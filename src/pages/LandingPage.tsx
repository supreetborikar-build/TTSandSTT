import React, { useRef } from 'react';
import {
  Mic,
  Volume2,
  Smartphone,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Zap,
  Globe,
  Headphones,
  CheckCircle2,
} from 'lucide-react';
import { FeatureCard } from '../components/FeatureCard';

interface LandingPageProps {
  onGetStarted: () => void;
  onExploreFeatures: () => void;
  onOpenPrivacy: () => void;
  onOpenContact: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onOpenPrivacy,
  onOpenContact,
}) => {
  const featuresRef = useRef<HTMLDivElement>(null);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-indigo-500/10 dark:bg-indigo-600/15 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 text-xs font-semibold text-indigo-700 dark:text-indigo-300 shadow-sm animate-in fade-in slide-in-from-top-3">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Next-Gen Web Speech & Synthesis Engine</span>
            </div>

            {/* Headline & Subtitle */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              Your Voice.{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
                Your Words.
              </span>{' '}
              Your Freedom.
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
              Speak naturally, convert speech into text, and turn your written words into speech. Designed for peak productivity on laptops, phones, and tablets.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              <button
                type="button"
                onClick={onGetStarted}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-lg shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={scrollToFeatures}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-base font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 shadow-sm transition-all"
              >
                <span>Explore Features</span>
              </button>
            </div>

            {/* Feature highlights bullets */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-medium text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Zero Server Audio Storage</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Press & Hold or Continuous Click</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Multi-Device Responsive</span>
              </div>
            </div>
          </div>

          {/* Interactive Voice Wave Hero Illustration */}
          <div className="mt-14 max-w-4xl mx-auto">
            <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 text-white shadow-2xl overflow-hidden">
              {/* Subtle top bar */}
              <div className="flex items-center justify-between pb-6 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-xs font-mono text-slate-400">voiceflow.workspace</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-indigo-400 bg-indigo-950/60 border border-indigo-800/50 px-3 py-1 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Web Speech API Active</span>
                </div>
              </div>

              {/* Animated Waveform Representation */}
              <div className="py-10 flex flex-col items-center justify-center">
                <div className="flex items-center justify-center gap-1.5 sm:gap-2 h-20 mb-6">
                  {[28, 48, 72, 35, 84, 60, 96, 45, 68, 88, 52, 76, 38, 92, 64, 40, 80, 50, 30].map(
                    (height, i) => (
                      <div
                        key={i}
                        className="w-1.5 sm:w-2 rounded-full bg-gradient-to-t from-indigo-500 via-purple-500 to-pink-500 animate-pulse"
                        style={{
                          height: `${height}%`,
                          animationDelay: `${(i * 0.08).toFixed(2)}s`,
                          animationDuration: '1.4s',
                        }}
                      />
                    )
                  )}
                </div>

                <div className="text-center max-w-xl">
                  <p className="text-lg sm:text-xl font-medium text-slate-200">
                    "Convert thoughts to text with low latency, and let your browser speak any written message back to you."
                  </p>
                  <p className="text-xs text-slate-400 mt-2">
                    Speech recognition & natural browser speech synthesis in one unified interface.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 bg-slate-50/50 dark:bg-slate-900/40 border-y border-slate-200/60 dark:border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Built for Modern Voice Productivity
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-400">
              Powerful browser capabilities combined with clean, responsive design.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={Mic}
              title="Real-Time Speech-to-Text"
              description="Speak naturally using press-and-hold interaction or hands-free continuous click mode. Live interim results appear instantaneously and append to your text."
              badge="STT"
            />
            <FeatureCard
              icon={Volume2}
              title="Intelligent Text-to-Speech"
              description="Turn any text into high-clarity voice output. Fine-tune speed, pitch, and volume. Safe chunking prevents browser synthesis freezes on long text."
              badge="TTS"
            />
            <FeatureCard
              icon={Smartphone}
              title="Cross-Device Responsive"
              description="Seamless touch interactions on mobile phones without accidental scrolling or selection, and an expansive multi-column dashboard on laptops and desktops."
              badge="Mobile Ready"
            />
            <FeatureCard
              icon={ShieldCheck}
              title="Privacy-First by Design"
              description="No voice recordings are transmitted to or stored on VoiceFlow servers. All processing runs via local device or browser native speech services."
              badge="Secure"
            />
            <FeatureCard
              icon={Zap}
              title="Productivity Tools"
              description="One-click copy to clipboard, timestamped .txt export, word and character counters, estimated reading time, and opt-in local draft autosave."
              badge="Utilities"
            />
            <FeatureCard
              icon={Globe}
              title="Universal Device Voices"
              description="Automatically detects and enumerates all system and browser voices installed on your device, with language filters and custom preferences."
              badge="Versatile"
            />
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-white dark:bg-slate-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-2xl sm:text-3xl font-extrabold">Ready to unlock your voice?</h3>
              <p className="text-indigo-100 text-sm sm:text-base max-w-md">
                Experience seamless speech dictation and playback in your browser now.
              </p>
            </div>
            <button
              type="button"
              onClick={onGetStarted}
              className="px-6 py-3 rounded-2xl bg-white text-indigo-700 font-bold hover:bg-indigo-50 shadow-md transition-transform hover:scale-105 active:scale-95 text-sm sm:text-base flex-shrink-0"
            >
              Launch Voice Workspace
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
