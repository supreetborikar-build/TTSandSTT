import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  Volume2,
  Sliders,
  Settings,
  Sparkles,
  Info,
  LogOut,
  HelpCircle,
  FileText,
  Shield,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { MicrophoneButton } from '../components/MicrophoneButton';
import { TextEditor } from '../components/TextEditor';
import { SpeechControls } from '../components/SpeechControls';
import { VoiceSelector } from '../components/VoiceSelector';

interface DashboardProps {
  onOpenPrivacy: () => void;
  onOpenContact: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onOpenPrivacy, onOpenContact }) => {
  const { user, logout, authProvider } = useAuth();
  const { showToast } = useToast();

  const [editorText, setEditorText] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'editor' | 'voice-settings'>('editor');
  const [speechLanguage, setSpeechLanguage] = useState<string>('en-US');

  // Speech Recognition Hook
  const {
    isSupported: isSttSupported,
    status: sttStatus,
    isListening,
    interimTranscript,
    finalTranscript,
    error: sttError,
    startListening,
    stopListening,
    resetTranscript,
    permissionStatus,
  } = useSpeechRecognition();

  // Speech Synthesis Hook
  const {
    isSupported: isTtsSupported,
    status: ttsStatus,
    voices,
    selectedVoice,
    settings: ttsSettings,
    speak,
    pause,
    resume,
    stop: stopTts,
    setVoice,
    setRate,
    setPitch,
    setVolume,
    resetSettings: resetTtsSettings,
    currentChunkIndex,
    totalChunks,
  } = useSpeechSynthesis();

  // Append transcribed speech to editor text smoothly without overwriting
  const previousTranscriptRef = useRef<string>('');

  useEffect(() => {
    if (finalTranscript && finalTranscript !== previousTranscriptRef.current) {
      const newPart = finalTranscript.slice(previousTranscriptRef.current.length).trim();
      if (newPart) {
        setEditorText(prev => {
          if (!prev.trim()) {
            return newPart;
          }
          // Ensure appropriate spacing
          const needsSpace = !prev.endsWith(' ') && !prev.endsWith('\n');
          return `${prev}${needsSpace ? ' ' : ''}${newPart}`;
        });
      }
      previousTranscriptRef.current = finalTranscript;
    }
  }, [finalTranscript]);

  // Clean up ongoing speech recognition and synthesis when unmounting or leaving
  useEffect(() => {
    return () => {
      stopListening();
      stopTts();
    };
  }, [stopListening, stopTts]);

  const handleStartRecording = () => {
    // If TTS is currently speaking, stop it first to prevent audio loopback into mic
    if (ttsStatus === 'speaking' || ttsStatus === 'paused') {
      stopTts();
    }
    startListening({ lang: speechLanguage, continuous: true });
  };

  const handleStopRecording = () => {
    stopListening();
  };

  const handleSpeakText = () => {
    if (!editorText.trim()) {
      showToast('Please type or dictate text first to speak.', 'info');
      return;
    }
    // If microphone is active, stop it
    if (isListening) {
      stopListening();
    }
    speak(editorText);
  };

  const handleClearEditor = () => {
    setEditorText('');
    resetTranscript();
    previousTranscriptRef.current = '';
    stopTts();
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col lg:flex-row bg-slate-50/50 dark:bg-slate-950">
      {/* Desktop Left Sidebar / Navigation */}
      <aside className="w-full lg:w-64 xl:w-72 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 flex flex-col justify-between flex-shrink-0">
        <div className="space-y-6">
          {/* User profile capsule */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              {user?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="overflow-hidden">
              <h2 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                {user?.displayName || 'VoiceFlow User'}
              </h2>
              <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
              <span className="inline-block text-[9px] uppercase font-semibold tracking-wider text-emerald-600 dark:text-emerald-400">
                {authProvider === 'firebase' ? 'Firebase' : 'Local Auth'} Active
              </span>
            </div>
          </div>

          {/* Quick tab switcher for mobile/tablet */}
          <div className="flex lg:flex-col gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab('editor')}
              className={`flex-1 lg:w-full flex items-center justify-center lg:justify-start gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'editor'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Workspace Editor</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('voice-settings')}
              className={`flex-1 lg:w-full flex items-center justify-center lg:justify-start gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'voice-settings'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Voice Settings</span>
            </button>
          </div>

          {/* Dictation Language Quick Selector */}
          <div className="space-y-1.5">
            <label htmlFor="stt-lang" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Dictation Language
            </label>
            <select
              id="stt-lang"
              value={speechLanguage}
              onChange={e => setSpeechLanguage(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="en-US">English (United States)</option>
              <option value="en-GB">English (United Kingdom)</option>
              <option value="es-ES">Spanish (Español)</option>
              <option value="fr-FR">French (Français)</option>
              <option value="de-DE">German (Deutsch)</option>
              <option value="it-IT">Italian (Italiano)</option>
              <option value="ja-JP">Japanese (日本語)</option>
              <option value="hi-IN">Hindi (हिन्दी)</option>
              <option value="zh-CN">Chinese (Mandarin Simplified)</option>
              <option value="pt-BR">Portuguese (Brasil)</option>
            </select>
          </div>

          {/* Workspace Quick Tips */}
          <div className="hidden lg:block p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/50 dark:border-indigo-800/50 text-xs text-indigo-900 dark:text-indigo-200 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Pro Tip</span>
            </div>
            <p className="text-[11px] leading-relaxed text-indigo-800 dark:text-indigo-300">
              Hold the microphone button while speaking. Release when finished. New phrases are automatically added without deleting existing text.
            </p>
          </div>
        </div>

        {/* Bottom Sidebar Utility links */}
        <div className="pt-6 space-y-2 border-t border-slate-200 dark:border-slate-800 hidden lg:block">
          <button
            type="button"
            onClick={onOpenPrivacy}
            className="w-full flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 py-1.5 transition-colors"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Privacy & Audio Security</span>
          </button>

          <button
            type="button"
            onClick={onOpenContact}
            className="w-full flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 py-1.5 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Help & Feedback</span>
          </button>

          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center gap-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 px-2 py-2 rounded-xl transition-colors mt-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        <div className="space-y-6">
          {/* Section A: Speech-to-Text Microphone Hub */}
          <section aria-labelledby="stt-heading">
            <h2 id="stt-heading" className="sr-only">Speech Recognition Control</h2>
            <MicrophoneButton
              status={sttStatus}
              isListening={isListening}
              isSupported={isSttSupported}
              error={sttError}
              permissionStatus={permissionStatus}
              onStart={handleStartRecording}
              onStop={handleStopRecording}
              interimTranscript={interimTranscript}
            />
          </section>

          {/* Section B & C: Text Editor & Playback Controls */}
          {activeTab === 'editor' ? (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Playback Action Bar */}
              <section aria-labelledby="tts-controls-heading">
                <h2 id="tts-controls-heading" className="sr-only">Text-to-Speech Playback</h2>
                <SpeechControls
                  status={ttsStatus}
                  hasText={Boolean(editorText.trim())}
                  currentChunkIndex={currentChunkIndex}
                  totalChunks={totalChunks}
                  onSpeak={handleSpeakText}
                  onPause={pause}
                  onResume={resume}
                  onStop={stopTts}
                />
              </section>

              {/* Main Text Editor Box */}
              <section aria-labelledby="editor-heading" className="min-h-[450px]">
                <h2 id="editor-heading" className="sr-only">Main Text Editor</h2>
                <TextEditor
                  value={editorText}
                  onChange={setEditorText}
                  onClear={handleClearEditor}
                />
              </section>
            </div>
          ) : (
            /* Tab: Voice Engine & Playback Settings */
            <div className="animate-in fade-in duration-200">
              <VoiceSelector
                voices={voices}
                selectedVoice={selectedVoice}
                settings={ttsSettings}
                onVoiceChange={setVoice}
                onRateChange={setRate}
                onPitchChange={setPitch}
                onVolumeChange={setVolume}
                onResetSettings={resetTtsSettings}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
