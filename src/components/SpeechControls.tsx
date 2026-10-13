import React from 'react';
import { Volume2, Play, Pause, Square, RotateCcw } from 'lucide-react';
import { SpeechSynthesisStatus } from '../types/speech';

interface SpeechControlsProps {
  status: SpeechSynthesisStatus;
  hasText: boolean;
  currentChunkIndex: number;
  totalChunks: number;
  onSpeak: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
}

export const SpeechControls: React.FC<SpeechControlsProps> = ({
  status,
  hasText,
  currentChunkIndex,
  totalChunks,
  onSpeak,
  onPause,
  onResume,
  onStop,
}) => {
  const isSpeaking = status === 'speaking';
  const isPaused = status === 'paused';
  const isActive = isSpeaking || isPaused;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
      {/* Primary Speak Button */}
      <div className="flex items-center gap-2">
        {!isActive ? (
          <button
            type="button"
            onClick={onSpeak}
            disabled={!hasText}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-indigo-600/20"
            aria-label="Speak text"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Speak Text</span>
          </button>
        ) : isPaused ? (
          <button
            type="button"
            onClick={onResume}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 transition-all shadow-md shadow-emerald-600/20"
            aria-label="Resume speech"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Resume</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onPause}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 active:bg-amber-800 transition-all shadow-md shadow-amber-600/20"
            aria-label="Pause speech"
          >
            <Pause className="w-4 h-4 fill-white" />
            <span>Pause</span>
          </button>
        )}

        {/* Stop Button */}
        {isActive && (
          <button
            type="button"
            onClick={onStop}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
            aria-label="Stop speech"
          >
            <Square className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span>Stop</span>
          </button>
        )}
      </div>

      {/* Playback status & progress */}
      <div className="flex items-center gap-3">
        {totalChunks > 1 && isActive && (
          <div className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-1 rounded-full border border-indigo-200/50 dark:border-indigo-800/50">
            <span>Chunk {currentChunkIndex} of {totalChunks}</span>
          </div>
        )}

        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{
            backgroundColor: isSpeaking ? '#10b981' : isPaused ? '#f59e0b' : '#94a3b8'
          }} />
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 capitalize">
            {status}
          </span>
        </div>
      </div>
    </div>
  );
};
