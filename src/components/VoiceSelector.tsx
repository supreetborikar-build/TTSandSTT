import React, { useMemo } from 'react';
import { Volume2, Globe, Sliders } from 'lucide-react';
import { VoiceSettings } from '../types/speech';

interface VoiceSelectorProps {
  voices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  settings: VoiceSettings;
  onVoiceChange: (voiceUri: string) => void;
  onRateChange: (rate: number) => void;
  onPitchChange: (pitch: number) => void;
  onVolumeChange: (volume: number) => void;
  onResetSettings: () => void;
}

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({
  voices,
  selectedVoice,
  settings,
  onVoiceChange,
  onRateChange,
  onPitchChange,
  onVolumeChange,
  onResetSettings,
}) => {
  // Extract distinct language codes available on this device
  const availableLanguages = useMemo(() => {
    const langs = new Set<string>();
    voices.forEach(v => {
      if (v.lang) langs.add(v.lang);
    });
    return Array.from(langs).sort();
  }, [voices]);

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Voice & Playback Engine
          </h3>
        </div>
        <button
          type="button"
          onClick={onResetSettings}
          className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
        >
          Reset Defaults
        </button>
      </div>

      {/* Voice Selection */}
      <div className="space-y-1.5">
        <label htmlFor="voice-select" className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
          <span className="flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-slate-500" /> Current Voice
          </span>
          <span className="text-[11px] font-normal text-slate-500">
            {voices.length} voices available
          </span>
        </label>

        {voices.length === 0 ? (
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-500">
            Loading system voices... (If empty, your browser uses default OS speech)
          </div>
        ) : (
          <select
            id="voice-select"
            value={selectedVoice?.voiceURI || ''}
            onChange={e => onVoiceChange(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs md:text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            {voices.map(voice => (
              <option key={voice.voiceURI} value={voice.voiceURI}>
                {voice.name} ({voice.lang}) {voice.default ? '★ Default' : ''}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Sliders Grid: Speed, Pitch, Volume */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
        {/* Speed / Rate */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-slate-600 dark:text-slate-400">Rate (Speed)</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">{settings.rate.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.1"
            value={settings.rate}
            onChange={e => onRateChange(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            aria-label="Speech rate"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>0.5x</span>
            <span>1.0x</span>
            <span>2.0x</span>
          </div>
        </div>

        {/* Pitch */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-slate-600 dark:text-slate-400">Pitch</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">{settings.pitch.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="1.5"
            step="0.1"
            value={settings.pitch}
            onChange={e => onPitchChange(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            aria-label="Speech pitch"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>Low</span>
            <span>Normal</span>
            <span>High</span>
          </div>
        </div>

        {/* Volume */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-slate-600 dark:text-slate-400">Volume</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">{Math.round(settings.volume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={settings.volume}
            onChange={e => onVolumeChange(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            aria-label="Speech volume"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
