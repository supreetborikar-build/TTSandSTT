import React, { useState, useEffect, useMemo } from 'react';
import {
  Copy,
  Download,
  Trash2,
  Clock,
  FileText,
  Save,
  Check,
  RotateCcw,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { downloadTextAsFile } from '../lib/exportTxt';
import { ConfirmModal } from './ConfirmModal';

interface TextEditorProps {
  value: string;
  onChange: (newValue: string) => void;
  onClear: () => void;
}

const AUTOSAVE_STORAGE_KEY = 'vf_editor_draft';
const AUTOSAVE_FLAG_KEY = 'vf_autosave_enabled';

export const TextEditor: React.FC<TextEditorProps> = ({ value, onChange, onClear }) => {
  const [isConfirmClearOpen, setIsConfirmClearOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [autosaveEnabled, setAutosaveEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem(AUTOSAVE_FLAG_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);

  const { showToast } = useToast();

  // Load saved draft on mount if available and current text is empty
  useEffect(() => {
    try {
      const savedFlag = localStorage.getItem(AUTOSAVE_FLAG_KEY) === 'true';
      if (savedFlag) {
        const savedDraft = localStorage.getItem(AUTOSAVE_STORAGE_KEY);
        if (savedDraft && !value) {
          onChange(savedDraft);
          setLastSavedTime('Restored previous draft');
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Handle autosave when text changes
  useEffect(() => {
    if (!autosaveEnabled) return;

    const timer = setTimeout(() => {
      try {
        if (value.trim()) {
          localStorage.setItem(AUTOSAVE_STORAGE_KEY, value);
          const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          setLastSavedTime(`Saved at ${time}`);
        }
      } catch (err) {
        console.warn('Autosave failed:', err);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [value, autosaveEnabled]);

  const toggleAutosave = () => {
    const nextState = !autosaveEnabled;
    setAutosaveEnabled(nextState);
    try {
      localStorage.setItem(AUTOSAVE_FLAG_KEY, String(nextState));
      if (nextState) {
        localStorage.setItem(AUTOSAVE_STORAGE_KEY, value);
        showToast('Draft autosave enabled', 'success');
      } else {
        localStorage.removeItem(AUTOSAVE_STORAGE_KEY);
        setLastSavedTime(null);
        showToast('Draft autosave disabled & cache cleared', 'info');
      }
    } catch {
      // ignore
    }
  };

  const handleClearDraft = () => {
    try {
      localStorage.removeItem(AUTOSAVE_STORAGE_KEY);
      setLastSavedTime(null);
      showToast('Saved draft cache erased', 'info');
    } catch {
      // ignore
    }
  };

  // Metrics calculation
  const metrics = useMemo(() => {
    const chars = value.length;
    const words = value.trim() ? value.trim().split(/\s+/).length : 0;
    // Average reading speed: 200 words per minute
    const readingMinutes = Math.ceil(words / 200);
    return { chars, words, readingMinutes };
  }, [value]);

  const handleCopy = async () => {
    if (!value.trim()) {
      showToast('No text available to copy.', 'info');
      return;
    }
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      showToast('Text copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Could not copy to clipboard.', 'error');
    }
  };

  const handleDownload = () => {
    if (!value.trim()) {
      showToast('No text available to download.', 'info');
      return;
    }
    try {
      downloadTextAsFile(value, 'VoiceFlow-Transcript');
      showToast('Exported transcript to .txt file', 'success');
    } catch (err: any) {
      showToast(err.message || 'Download failed', 'error');
    }
  };

  const handleConfirmClear = () => {
    onClear();
    setIsConfirmClearOpen(false);
    if (autosaveEnabled) {
      try {
        localStorage.removeItem(AUTOSAVE_STORAGE_KEY);
        setLastSavedTime(null);
      } catch {
        // ignore
      }
    }
    showToast('Editor cleared.', 'info');
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Editor Toolbar Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70">
        {/* Left: Document label and metrics */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
            <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Voice Document</span>
          </div>

          <span className="hidden sm:inline text-slate-300 dark:text-slate-700">|</span>

          <span>{metrics.words} words</span>
          <span>&bull;</span>
          <span>{metrics.chars} characters</span>

          {metrics.words > 0 && (
            <>
              <span className="hidden md:inline">&bull;</span>
              <span className="hidden md:flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> ~{metrics.readingMinutes} min read
              </span>
            </>
          )}
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            disabled={!value.trim()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
            title="Copy to clipboard"
            aria-label="Copy text to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>

          {/* Download TXT Button */}
          <button
            type="button"
            onClick={handleDownload}
            disabled={!value.trim()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
            title="Download as .txt"
            aria-label="Download text as txt file"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export .txt</span>
            <span className="sm:hidden">TXT</span>
          </button>

          {/* Clear Button */}
          <button
            type="button"
            onClick={() => setIsConfirmClearOpen(true)}
            disabled={!value.trim()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
            title="Clear all text"
            aria-label="Clear all editor text"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Main Textarea */}
      <div className="relative flex-1 min-h-[300px] md:min-h-[420px]">
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Type something here or hold the microphone button to start speaking..."
          className="w-full h-full p-5 text-sm md:text-base leading-relaxed text-slate-800 dark:text-slate-100 bg-transparent resize-none focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 font-sans"
          aria-label="Main VoiceFlow text workspace"
          spellCheck
        />
      </div>

      {/* Editor Footer / Autosave Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-slate-50/60 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={autosaveEnabled}
              onChange={toggleAutosave}
              className="rounded text-indigo-600 focus:ring-indigo-500 dark:bg-slate-800 dark:border-slate-700"
            />
            <span className="font-medium text-slate-700 dark:text-slate-300">Autosave Draft</span>
          </label>

          {lastSavedTime && (
            <span className="text-[11px] text-slate-400 dark:text-slate-500 italic">
              ({lastSavedTime})
            </span>
          )}
        </div>

        {autosaveEnabled && (
          <button
            type="button"
            onClick={handleClearDraft}
            className="text-[11px] text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 underline"
          >
            Clear Draft Cache
          </button>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={isConfirmClearOpen}
        title="Clear Editor Text"
        message="Are you sure you want to erase all current text in the workspace? This action cannot be undone."
        confirmLabel="Yes, Clear All"
        cancelLabel="Cancel"
        isDestructive={true}
        onConfirm={handleConfirmClear}
        onCancel={() => setIsConfirmClearOpen(false)}
      />
    </div>
  );
};
