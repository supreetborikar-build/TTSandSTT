import React, { useRef, useState } from 'react';
import { Mic, MicOff, Square, Play, AlertCircle, Info, ShieldAlert } from 'lucide-react';
import { SpeechRecognitionStatus } from '../types/speech';
import { AudioWaveform } from './AudioWaveform';
import { useAudioVisualizer } from '../hooks/useAudioVisualizer';

interface MicrophoneButtonProps {
  status: SpeechRecognitionStatus;
  isListening: boolean;
  isSupported: boolean;
  error: string | null;
  permissionStatus: 'prompt' | 'granted' | 'denied' | 'unknown';
  onStart: () => void;
  onStop: () => void;
  interimTranscript: string;
}

export const MicrophoneButton: React.FC<MicrophoneButtonProps> = ({
  status,
  isListening,
  isSupported,
  error,
  permissionStatus,
  onStart,
  onStop,
  interimTranscript,
}) => {
  const [isPressing, setIsPressing] = useState(false);
  const audioLevels = useAudioVisualizer(isListening);
  const pressTimerRef = useRef<number | null>(null);

  // Pointer event handlers for Press-and-Hold
  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!isSupported) return;
    // Capture pointer to track release even outside bounds
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    setIsPressing(true);
    onStart();
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!isPressing) return;
    setIsPressing(false);
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // ignore
    }
    onStop();
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!isPressing) return;
    setIsPressing(false);
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // ignore
    }
    onStop();
  };

  const toggleListening = () => {
    if (!isSupported) return;
    if (isListening) {
      onStop();
    } else {
      onStart();
    }
  };

  // Status text & badge
  const getStatusDetails = () => {
    switch (status) {
      case 'listening':
        return { text: 'Listening...', color: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800' };
      case 'starting':
        return { text: 'Starting...', color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800' };
      case 'processing':
        return { text: 'Processing Speech...', color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800' };
      case 'error':
        return { text: 'Recognition Issue', color: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800' };
      default:
        return { text: 'Ready', color: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800' };
    }
  };

  const statusInfo = getStatusDetails();

  if (!isSupported) {
    return (
      <div className="p-5 rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 flex items-start gap-3.5">
        <AlertCircle className="w-6 h-6 flex-shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
        <div className="space-y-1 text-sm">
          <p className="font-semibold">Speech Recognition Not Supported</p>
          <p className="text-amber-800 dark:text-amber-300">
            Your current browser does not support the Web Speech API recognition engine. For speech-to-text dictation, please open VoiceFlow in <strong className="font-semibold">Google Chrome, Microsoft Edge, or Safari</strong> (iOS 14.5+).
          </p>
          <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
            Note: Text-to-Speech playback and the text editor remain fully functional.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all">
      {/* Status Bar */}
      <div className="flex items-center justify-between w-full mb-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Speech Engine
          </span>
          <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${statusInfo.color}`}>
            {statusInfo.text}
          </span>
        </div>

        {permissionStatus === 'denied' && (
          <span className="flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
            <ShieldAlert className="w-3.5 h-3.5" /> Mic Blocked
          </span>
        )}
      </div>

      {/* Main Hold-to-Talk Button */}
      <div className="relative flex items-center justify-center my-3">
        {/* Pulsing ring during listening */}
        {isListening && (
          <div className="absolute inset-0 rounded-full bg-rose-500/20 dark:bg-rose-500/30 animate-ping pointer-events-none scale-125" />
        )}
        {isListening && (
          <div className="absolute -inset-3 rounded-full bg-rose-500/15 dark:bg-rose-500/25 animate-pulse-ring pointer-events-none" />
        )}

        <button
          type="button"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          className={`relative z-10 w-24 h-24 md:w-28 md:h-28 rounded-full flex flex-col items-center justify-center transition-all select-none touch-none shadow-md ${
            isListening
              ? 'bg-rose-600 text-white shadow-rose-500/40 scale-105 ring-4 ring-rose-400/50'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/30 hover:scale-105 active:scale-95 ring-4 ring-indigo-500/20'
          }`}
          aria-label={isListening ? 'Release to stop recording' : 'Press and hold to speak'}
          title="Press and hold to speak"
        >
          {isListening ? (
            <Mic className="w-10 h-10 md:w-11 md:h-11 animate-pulse" />
          ) : (
            <Mic className="w-10 h-10 md:w-11 md:h-11" />
          )}
          <span className="text-[10px] md:text-xs font-semibold tracking-wide mt-1 uppercase opacity-90">
            {isListening ? 'Release' : 'Hold Mic'}
          </span>
        </button>
      </div>

      {/* Waveform Visualizer */}
      <div className="w-full max-w-xs mt-4 mb-2">
        <AudioWaveform levels={audioLevels} isListening={isListening} />
      </div>

      {/* Live Interim Transcript Bubble */}
      {interimTranscript && (
        <div className="w-full max-w-md my-2 px-3 py-2 bg-indigo-50/80 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 rounded-xl text-center text-xs md:text-sm text-indigo-700 dark:text-indigo-300 italic animate-pulse">
          "{interimTranscript}"
        </div>
      )}

      {/* Accessible Alternative: Start / Stop Toggle Button */}
      <div className="mt-4 flex flex-col sm:flex-row items-center gap-3">
        <button
          type="button"
          onClick={toggleListening}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-medium transition-colors border shadow-sm ${
            isListening
              ? 'bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800'
              : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700'
          }`}
          aria-label={isListening ? 'Stop recording dictation' : 'Start continuous dictation'}
        >
          {isListening ? (
            <>
              <Square className="w-4 h-4 text-rose-600 fill-rose-600" /> Stop Dictation (Click Mode)
            </>
          ) : (
            <>
              <Play className="w-4 h-4 text-indigo-600 fill-indigo-600" /> Start Dictation (Click Mode)
            </>
          )}
        </button>

        <span className="text-[11px] text-slate-500 dark:text-slate-400">
          Tip: Hold to talk or use click mode for hands-free dictation.
        </span>
      </div>

      {/* Error Feedback */}
      {error && (
        <div className="mt-4 p-3 w-full rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
