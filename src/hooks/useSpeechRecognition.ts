import { useState, useEffect, useRef, useCallback } from 'react';
import { SpeechRecognitionStatus } from '../types/speech';

// Type definitions for Web Speech API
interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export function useSpeechRecognition() {
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [status, setStatus] = useState<SpeechRecognitionStatus>('idle');
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [finalTranscript, setFinalTranscript] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<'prompt' | 'granted' | 'denied' | 'unknown'>('unknown');

  const recognitionRef = useRef<any>(null);
  const isStartingRef = useRef<boolean>(false);
  const isListeningRef = useRef<boolean>(false);
  const shouldRestartRef = useRef<boolean>(false);

  // Check support on mount
  useEffect(() => {
    const win = window as unknown as IWindow;
    const SpeechRecognitionClass = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (SpeechRecognitionClass) {
      setIsSupported(true);
      try {
        if (navigator.permissions && navigator.permissions.query) {
          navigator.permissions.query({ name: 'microphone' as PermissionName }).then(res => {
            setPermissionStatus(res.state as 'prompt' | 'granted' | 'denied');
            res.onchange = () => {
              setPermissionStatus(res.state as 'prompt' | 'granted' | 'denied');
            };
          }).catch(() => {
            setPermissionStatus('unknown');
          });
        }
      } catch {
        setPermissionStatus('unknown');
      }
    } else {
      setIsSupported(false);
      setError('Web Speech API is not supported by your browser. Please use Chrome, Edge, or Safari.');
    }

    return () => {
      // Cleanup on unmount
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
        recognitionRef.current = null;
      }
    };
  }, []);

  const createRecognition = useCallback((lang: string = 'en-US', continuous: boolean = true) => {
    const win = window as unknown as IWindow;
    const SpeechRecognitionClass = win.SpeechRecognition || win.webkitSpeechRecognition;
    if (!SpeechRecognitionClass) return null;

    const recognition = new SpeechRecognitionClass();
    recognition.continuous = continuous;
    recognition.interimResults = true;
    recognition.lang = lang;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      isStartingRef.current = false;
      isListeningRef.current = true;
      setStatus('listening');
      setError(null);
    };

    recognition.onresult = (event: any) => {
      let interim = '';
      let finalPiece = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptChunk = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalPiece += transcriptChunk;
        } else {
          interim += transcriptChunk;
        }
      }

      if (finalPiece) {
        setFinalTranscript(prev => (prev ? `${prev} ${finalPiece.trim()}` : finalPiece.trim()));
      }
      setInterimTranscript(interim);
    };

    recognition.onerror = (event: any) => {
      isStartingRef.current = false;
      const errType = event.error;

      if (errType === 'no-speech') {
        // Non-fatal: simply no speech detected in silence window
        return;
      }

      if (errType === 'aborted') {
        // Expected when user intentionally stops or releases
        setStatus('idle');
        return;
      }

      let errorMsg = `Speech recognition error: ${errType}`;
      if (errType === 'not-allowed') {
        setPermissionStatus('denied');
        errorMsg = 'Microphone permission denied. Please allow microphone access in your browser.';
      } else if (errType === 'audio-capture') {
        errorMsg = 'No microphone detected or microphone is currently in use by another application.';
      } else if (errType === 'network') {
        errorMsg = 'Network communication error with speech recognition service.';
      }

      setError(errorMsg);
      setStatus('error');
      isListeningRef.current = false;
    };

    recognition.onend = () => {
      isStartingRef.current = false;
      isListeningRef.current = false;

      if (shouldRestartRef.current) {
        shouldRestartRef.current = false;
        try {
          recognition.start();
          return;
        } catch {
          // fallback to idle
        }
      }

      setStatus(prev => (prev === 'listening' || prev === 'starting' ? 'idle' : prev));
      setInterimTranscript('');
    };

    return recognition;
  }, []);

  const startListening = useCallback(
    async (options?: { lang?: string; continuous?: boolean }) => {
      if (!isSupported) {
        setError('Speech recognition is not supported in this browser.');
        return;
      }

      if (isListeningRef.current || isStartingRef.current) {
        return;
      }

      try {
        // Reset any prior error
        setError(null);
        setStatus('starting');
        isStartingRef.current = true;

        if (recognitionRef.current) {
          try {
            recognitionRef.current.abort();
          } catch {
            // ignore
          }
          recognitionRef.current = null;
        }

        const instance = createRecognition(options?.lang || 'en-US', options?.continuous ?? true);
        if (!instance) {
          throw new Error('Failed to create speech recognition instance');
        }

        recognitionRef.current = instance;
        instance.start();
      } catch (err: any) {
        isStartingRef.current = false;
        isListeningRef.current = false;
        setStatus('error');
        setError(err?.message || 'Could not access speech recognition service.');
      }
    },
    [isSupported, createRecognition]
  );

  const stopListening = useCallback(() => {
    shouldRestartRef.current = false;
    isStartingRef.current = false;

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
    }
    isListeningRef.current = false;
    setStatus('idle');
    setInterimTranscript('');
  }, []);

  const resetTranscript = useCallback(() => {
    setFinalTranscript('');
    setInterimTranscript('');
  }, []);

  return {
    isSupported,
    status,
    isListening: status === 'listening',
    interimTranscript,
    finalTranscript,
    error,
    startListening,
    stopListening,
    resetTranscript,
    permissionStatus,
  };
}
