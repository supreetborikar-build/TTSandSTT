import React from 'react';
import { ShieldCheck, Lock, Cpu, ServerOff, X } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-modal-title"
    >
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 id="privacy-modal-title" className="text-xl font-bold text-slate-900 dark:text-slate-100">
                VoiceFlow Privacy Notice
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Your privacy & data security commitments</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4 text-sm text-slate-600 dark:text-slate-300">
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
            <ServerOff className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-200">No Audio Stored on Servers</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                VoiceFlow never records, stores, or uploads your microphone audio stream to any proprietary backend database. Audio stream processing exists only transiently in your browser session.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
            <Cpu className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-200">Browser Native Web Speech API</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Speech recognition and text-to-speech are handled directly via standard W3C Web Speech API implementations provided by your device operating system or browser provider (Google, Apple, or Microsoft).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
            <Lock className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-200">Zero Plaintext Password Storage</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Authentication relies on Firebase Authentication industry standards or client-side cryptographic SHA-256 salted hashing with secure ephemeral session scopes. Passwords are never stored in plaintext.
              </p>
            </div>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pt-2">
            Local drafts are only saved when you explicitly toggle "Autosave Draft" on. You can erase all local data and drafts anytime with a single click.
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
