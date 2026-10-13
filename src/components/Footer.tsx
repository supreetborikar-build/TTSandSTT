import React from 'react';
import { Mic, Shield, Heart, Sparkles } from 'lucide-react';

interface FooterProps {
  onOpenPrivacy?: () => void;
  onOpenContact?: () => void;
  onNavigateFeatures?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenPrivacy,
  onOpenContact,
  onNavigateFeatures,
}) => {
  return (
    <footer className="w-full bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 transition-colors py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Mic className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg text-slate-900 dark:text-white">
                VoiceFlow
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Next-generation speech-to-text dictation and text-to-speech audio synthesizer built on modern browser Web Speech APIs.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Web Speech API Ready</span>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Capabilities
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={onNavigateFeatures}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Speech-to-Text Dictation
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onNavigateFeatures}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Text-to-Speech Playback
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onNavigateFeatures}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Voice Pitch & Speed Tuning
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onNavigateFeatures}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Safe Sentence Chunking
                </button>
              </li>
            </ul>
          </div>

          {/* Privacy & Legal */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Trust & Privacy
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={onOpenPrivacy}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1"
                >
                  <Shield className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Privacy Policy</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenPrivacy}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Data Protection Notice
                </button>
              </li>
              <li>
                <span className="text-slate-400">Zero Audio Server Storage</span>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Support & Inquiries
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={onOpenContact}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Contact Developer
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenContact}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Submit Feedback
                </button>
              </li>
              <li>
                <a
                  href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  MDN Web Speech Specs &nearr;
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>&copy; {new Date().getFullYear()} VoiceFlow. Designed for desktop, tablet, and mobile browsers.</p>
          <div className="flex items-center gap-2">
            <span>Built with React, TypeScript & Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
