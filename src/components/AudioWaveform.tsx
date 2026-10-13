import React from 'react';

interface AudioWaveformProps {
  levels: number[];
  isListening: boolean;
  isSpeaking?: boolean;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({
  levels,
  isListening,
  isSpeaking = false,
}) => {
  const active = isListening || isSpeaking;

  return (
    <div
      className={`flex items-center justify-center gap-1.5 h-12 px-4 rounded-xl transition-all duration-300 ${
        active
          ? 'bg-indigo-500/10 dark:bg-indigo-500/20 border border-indigo-500/20'
          : 'bg-slate-100/50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50 opacity-60'
      }`}
      aria-hidden="true"
    >
      {levels.map((level, idx) => {
        // Calculate height between 6px and 40px
        const heightPx = active ? Math.max(8, Math.round(level * 42)) : 6;
        return (
          <div
            key={idx}
            className={`w-1.5 rounded-full transition-all duration-100 ${
              isListening
                ? 'bg-rose-500 dark:bg-rose-400'
                : isSpeaking
                ? 'bg-indigo-600 dark:bg-indigo-400'
                : 'bg-slate-300 dark:bg-slate-600'
            }`}
            style={{
              height: `${heightPx}px`,
              transition: 'height 75ms ease-out',
            }}
          />
        );
      })}
    </div>
  );
};
