// Web Speech API Types extension for TypeScript

export type SpeechRecognitionStatus = 'idle' | 'starting' | 'listening' | 'processing' | 'error';
export type SpeechSynthesisStatus = 'idle' | 'speaking' | 'paused' | 'stopped' | 'error';

export interface VoiceSettings {
  voiceUri: string;
  rate: number;
  pitch: number;
  volume: number;
  lang: string;
}

export interface SpeechRecognitionHookResult {
  isSupported: boolean;
  status: SpeechRecognitionStatus;
  isListening: boolean;
  interimTranscript: string;
  finalTranscript: string;
  error: string | null;
  startListening: (options?: { lang?: string; continuous?: boolean }) => Promise<void>;
  stopListening: () => void;
  resetTranscript: () => void;
  permissionStatus: 'prompt' | 'granted' | 'denied' | 'unknown';
}

export interface SpeechSynthesisHookResult {
  isSupported: boolean;
  status: SpeechSynthesisStatus;
  voices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  settings: VoiceSettings;
  speak: (text: string) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  setVoice: (voiceUri: string) => void;
  setRate: (rate: number) => void;
  setPitch: (pitch: number) => void;
  setVolume: (volume: number) => void;
  setLang: (lang: string) => void;
  resetSettings: () => void;
  currentChunkIndex: number;
  totalChunks: number;
}
