import { useState, useEffect, useRef } from 'react';

export function useAudioVisualizer(isActive: boolean) {
  const [audioLevels, setAudioLevels] = useState<number[]>([0.15, 0.25, 0.2, 0.35, 0.2, 0.15, 0.1]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isActive) {
      // Clean up
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        try {
          audioContextRef.current.close();
        } catch {
          // ignore
        }
        audioContextRef.current = null;
      }
      setAudioLevels([0.15, 0.25, 0.2, 0.35, 0.2, 0.15, 0.1]);
      return;
    }

    let isMounted = true;

    async function initAudio() {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          fallbackAnimation();
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (!isMounted) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }
        streamRef.current = stream;

        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        audioContextRef.current = ctx;

        const analyser = ctx.createAnalyser();
        analyser.fftSize = 64;
        analyser.smoothingTimeConstant = 0.8;
        analyserRef.current = analyser;

        const source = ctx.createMediaStreamSource(stream);
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const updateLevels = () => {
          if (!analyserRef.current || !isMounted) return;
          analyserRef.current.getByteFrequencyData(dataArray);

          // Sample 7-12 frequency bands
          const barCount = 12;
          const step = Math.floor(dataArray.length / barCount);
          const newLevels: number[] = [];

          for (let i = 0; i < barCount; i++) {
            const val = dataArray[i * step] || 0;
            // Normalize between 0.1 and 1.0
            const normalized = Math.max(0.12, Math.min(1.0, val / 180));
            newLevels.push(normalized);
          }

          setAudioLevels(newLevels);
          animationFrameRef.current = requestAnimationFrame(updateLevels);
        };

        updateLevels();
      } catch (err) {
        // Fallback to simulated subtle pulse if direct audio stream access fails
        fallbackAnimation();
      }
    }

    function fallbackAnimation() {
      const simulate = () => {
        if (!isMounted) return;
        const barCount = 12;
        const now = Date.now() / 200;
        const fakeLevels: number[] = [];
        for (let i = 0; i < barCount; i++) {
          const val = 0.2 + 0.6 * Math.abs(Math.sin(now + i * 0.5));
          fakeLevels.push(val);
        }
        setAudioLevels(fakeLevels);
        animationFrameRef.current = requestAnimationFrame(simulate);
      };
      simulate();
    }

    initAudio();

    return () => {
      isMounted = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        try {
          audioContextRef.current.close();
        } catch {
          // ignore
        }
      }
    };
  }, [isActive]);

  return audioLevels;
}
