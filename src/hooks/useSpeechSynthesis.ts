import { useState, useEffect, useRef, useCallback } from 'react';
import { SpeechSynthesisStatus, VoiceSettings } from '../types/speech';

export function useSpeechSynthesis() {
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [status, setStatus] = useState<SpeechSynthesisStatus>('idle');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [currentChunkIndex, setCurrentChunkIndex] = useState<number>(0);
  const [totalChunks, setTotalChunks] = useState<number>(0);

  const [settings, setSettings] = useState<VoiceSettings>({
    voiceUri: '',
    rate: 1,
    pitch: 1,
    volume: 1,
    lang: 'en-US',
  });

  const chunksRef = useRef<string[]>([]);
  const currentChunkIndexRef = useRef<number>(0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isCancelledRef = useRef<boolean>(false);
  const keepAliveTimerRef = useRef<number | null>(null);

  // Initialize and load voices
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);

      const updateVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        if (availableVoices && availableVoices.length > 0) {
          setVoices(availableVoices);

          // Find default voice (prefer English or default device voice)
          setSelectedVoice(prev => {
            if (prev) {
              const matched = availableVoices.find(v => v.voiceURI === prev.voiceURI);
              if (matched) return matched;
            }
            const defaultVoice =
              availableVoices.find(v => v.default) ||
              availableVoices.find(v => v.lang.startsWith('en')) ||
              availableVoices[0];
            return defaultVoice || null;
          });
        }
      };

      updateVoices();

      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = updateVoices;
      }
    } else {
      setIsSupported(false);
    }

    return () => {
      // Cleanup on unmount
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (keepAliveTimerRef.current) {
        clearInterval(keepAliveTimerRef.current);
      }
    };
  }, []);

  // Split long text into natural punctuation chunks (max ~180 chars per chunk)
  const splitTextIntoChunks = (text: string): string[] => {
    const rawChunks = text
      .split(/(?<=[.?!;:\n])\s+/)
      .map(c => c.trim())
      .filter(Boolean);

    const safeChunks: string[] = [];
    const MAX_CHUNK_LENGTH = 180;

    for (const chunk of rawChunks) {
      if (chunk.length <= MAX_CHUNK_LENGTH) {
        safeChunks.push(chunk);
      } else {
        // Further split long sentence by commas or spaces
        const words = chunk.split(' ');
        let current = '';
        for (const word of words) {
          if ((current + ' ' + word).trim().length <= MAX_CHUNK_LENGTH) {
            current = (current + ' ' + word).trim();
          } else {
            if (current) safeChunks.push(current);
            current = word;
          }
        }
        if (current) safeChunks.push(current);
      }
    }

    return safeChunks.length > 0 ? safeChunks : [text];
  };

  // Chromium bug workaround: speech synthesis can pause unexpectedly after ~15s
  const startChromiumKeepAlive = () => {
    if (keepAliveTimerRef.current) clearInterval(keepAliveTimerRef.current);
    keepAliveTimerRef.current = window.setInterval(() => {
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 10000);
  };

  const stopChromiumKeepAlive = () => {
    if (keepAliveTimerRef.current) {
      clearInterval(keepAliveTimerRef.current);
      keepAliveTimerRef.current = null;
    }
  };

  const speakNextChunk = useCallback(() => {
    if (isCancelledRef.current) return;

    const chunks = chunksRef.current;
    const index = currentChunkIndexRef.current;

    if (index >= chunks.length) {
      // Completed all chunks
      stopChromiumKeepAlive();
      setStatus('idle');
      setCurrentChunkIndex(0);
      setTotalChunks(0);
      return;
    }

    const chunkText = chunks[index];
    const utterance = new SpeechSynthesisUtterance(chunkText);
    utteranceRef.current = utterance;

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    }
    utterance.rate = settings.rate;
    utterance.pitch = settings.pitch;
    utterance.volume = settings.volume;

    utterance.onstart = () => {
      setStatus('speaking');
      setCurrentChunkIndex(index + 1);
    };

    utterance.onend = () => {
      if (isCancelledRef.current) return;
      currentChunkIndexRef.current += 1;
      speakNextChunk();
    };

    utterance.onerror = (event: any) => {
      if (event.error === 'interrupted' || event.error === 'canceled') {
        return;
      }
      console.warn('SpeechSynthesis error:', event.error);
      stopChromiumKeepAlive();
      setStatus('error');
    };

    window.speechSynthesis.speak(utterance);
  }, [selectedVoice, settings]);

  const speak = useCallback(
    (text: string) => {
      if (!isSupported || !text.trim()) return;

      // Cancel any ongoing playback
      window.speechSynthesis.cancel();
      stopChromiumKeepAlive();

      isCancelledRef.current = false;
      const chunks = splitTextIntoChunks(text);
      chunksRef.current = chunks;
      currentChunkIndexRef.current = 0;
      setTotalChunks(chunks.length);
      setCurrentChunkIndex(1);

      startChromiumKeepAlive();
      speakNextChunk();
    },
    [isSupported, speakNextChunk]
  );

  const pause = useCallback(() => {
    if (isSupported && window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      setStatus('paused');
    }
  }, [isSupported]);

  const resume = useCallback(() => {
    if (isSupported && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setStatus('speaking');
    }
  }, [isSupported]);

  const stop = useCallback(() => {
    if (isSupported) {
      isCancelledRef.current = true;
      stopChromiumKeepAlive();
      window.speechSynthesis.cancel();
      setStatus('idle');
      setCurrentChunkIndex(0);
      setTotalChunks(0);
    }
  }, [isSupported]);

  const setVoice = useCallback(
    (voiceUri: string) => {
      const found = voices.find(v => v.voiceURI === voiceUri);
      if (found) {
        setSelectedVoice(found);
        setSettings(prev => ({ ...prev, voiceUri: found.voiceURI, lang: found.lang }));
      }
    },
    [voices]
  );

  const setRate = useCallback((rate: number) => {
    setSettings(prev => ({ ...prev, rate }));
  }, []);

  const setPitch = useCallback((pitch: number) => {
    setSettings(prev => ({ ...prev, pitch }));
  }, []);

  const setVolume = useCallback((volume: number) => {
    setSettings(prev => ({ ...prev, volume }));
  }, []);

  const setLang = useCallback((lang: string) => {
    setSettings(prev => ({ ...prev, lang }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings({
      voiceUri: selectedVoice?.voiceURI || '',
      rate: 1,
      pitch: 1,
      volume: 1,
      lang: selectedVoice?.lang || 'en-US',
    });
  }, [selectedVoice]);

  return {
    isSupported,
    status,
    voices,
    selectedVoice,
    settings,
    speak,
    pause,
    resume,
    stop,
    setVoice,
    setRate,
    setPitch,
    setVolume,
    setLang,
    resetSettings,
    currentChunkIndex,
    totalChunks,
  };
}
