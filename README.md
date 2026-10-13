# VoiceFlow 🎙️

**Responsive Speech-to-Text & Text-to-Speech Web Application**

VoiceFlow is a production-quality, responsive web application engineered for modern voice productivity. It combines real-time browser-native speech recognition (Speech-to-Text) with expressive, customizable speech synthesis (Text-to-Speech) inside a modern productivity workspace.

---

## 🌟 Key Features

### 1. Speech-to-Text (STT) Dictation
- **Press & Hold Interaction**: Press and hold the microphone button to dictate naturally. Releasing automatically finishes speech recognition while retaining your transcribed text.
- **Hands-Free Click Mode**: Accessible toggle button for continuous dictation without holding.
- **Audio Waveform & Level Visualizer**: Live frequency feedback powered by the Web Audio API (`AnalyserNode`) and custom pulse animations.
- **Interim Speech Feedback**: Displays real-time interim recognition hypotheses in an accent bubble before committing final text.
- **Seamless Text Appending**: New recognized words append cleanly to previous text without overwriting existing content.
- **Multi-Language Dictation**: Select from multiple languages (English US/UK, Spanish, French, German, Japanese, Hindi, Chinese, etc.).
- **Graceful Error & Permission Handling**: Clear status indicators (`Ready`, `Listening`, `Processing`, `Error`) and diagnostics for blocked microphones or unsupported browsers.

### 2. Intelligent Text-to-Speech (TTS) Playback
- **Universal Device Voices**: Automatically queries and synchronizes system voices via `window.speechSynthesis.getVoices()` and `onvoiceschanged`.
- **Granular Controls**: Dedicated Play, Pause, Resume, and Stop controls.
- **Acoustic Fine-Tuning**: Sliders for Rate (0.5x to 2.0x), Pitch (0.5 to 1.5), and Volume (0% to 100%) with a quick "Reset Defaults" option.
- **Safe Sentence Chunking**: Resolves the well-known Chromium Web Speech API bug (where utterances freeze after ~15 seconds) by segmenting long passages into punctuation-aware chunks that stream sequentially with keep-alive watchdogs.
- **Automatic Lifecycle Cleanup**: Speech synthesis cancels when leaving the workspace or logging out.

### 3. Voice Document Text Editor
- **Rich Metrics Bar**: Live word count, character count, and estimated reading time.
- **One-Click Export**: Download transcribed notes as timestamped `.txt` files (`VoiceFlow-Transcript_YYYY-MM-DD.txt`).
- **Clipboard Integration**: Instant copy with visual toast confirmation.
- **Opt-in Local Draft Autosave**: Toggleable local draft preservation with explicit cache clearance.
- **Confirmation Safeguards**: Modal dialog protection when clearing editor contents to prevent accidental data loss.

### 4. Authentication & Security
- **Dual Authentication Architecture**:
  - **Firebase Authentication**: Integrated for production deployments with email/password.
  - **Local Secure Engine**: Out-of-the-box fallback utilizing Web Crypto API (`crypto.subtle.digest('SHA-256')`) with salted hashing and ephemeral `sessionStorage` session tokens.
- **Zero Plaintext Password Storage**: Passwords are never saved in plaintext or persisted insecurely.
- **Protected Dashboard**: Unauthenticated access attempts redirect to the login portal.
- **Show/Hide Password**: Accessible eye toggle and dynamic password strength requirements.

### 5. UI/UX & Responsive Engineering
- **Color Palette**: Modern dark navy typography on clean light backgrounds with violet/indigo accents (`#6366f1`).
- **Dark Mode**: Complete light/dark theme toggle with persistent preference detection.
- **Responsive Layout**: Designed and tested across mobile viewports (360px, 390px), tablets (768px), and desktop displays (1024px, 1440px+).
- **Mobile Touch Protections**: Utilizes Pointer Capture API and `touch-action: none` on the microphone button to prevent accidental scrolling or text selection during press-and-hold on touchscreens.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | [React 19](https://react.dev/) + [Vite 8](https://vitejs.dev/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) (Strict Mode) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Speech Recognition** | W3C Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`) |
| **Speech Synthesis** | W3C Web Speech API (`window.speechSynthesis`) |
| **Audio Visualization**| Web Audio API (`AudioContext`, `AnalyserNode`) |
| **Authentication** | [Firebase Auth](https://firebase.google.com/docs/auth) / Web Crypto SHA-256 Local Engine |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher (v22+ recommended)
- **npm**: v9.0.0 or higher

### Installation

1. Clone or navigate to the repository directory:
   ```bash
   cd Nirmaan
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

4. Build for production:
   ```bash
   npm run build
   ```

5. Preview production build:
   ```bash
   npm run preview
   ```

---

## 🔐 Authentication Configuration

VoiceFlow comes ready to test immediately out-of-the-box with a pre-configured local secure user account, and seamlessly activates Firebase Authentication when environment variables are supplied.

### Instant Demo Account (Local Secure Mode)
- **Email:** `demo@voiceflow.ai`
- **Password:** `VoiceFlow@2026`
*(Or click "Fill Demo" on the login screen, or create any new account via the Register tab).*

### Connecting Firebase Authentication (Optional)
To use production Firebase Authentication:
1. Copy the example configuration file:
   ```bash
   cp .env.example .env
   ```
2. Create a project at [Firebase Console](https://console.firebase.google.com/).
3. Navigate to **Authentication** > **Sign-in method** and enable **Email/Password**.
4. In **Project Settings**, register a Web App and copy the config values into `.env`:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```
5. Restart Vite dev server (`npm run dev`). VoiceFlow will automatically detect the credentials and switch the provider badge to **Firebase Auth**.

---

## 🌐 Browser Compatibility & Platform Support

| Browser / OS | Speech Recognition (STT) | Text-to-Speech (TTS) | Notes |
|---|---|---|---|
| **Google Chrome (Desktop & Android)** | ✅ Supported | ✅ Supported | Full support with extensive voice options |
| **Microsoft Edge (Desktop & Mobile)** | ✅ Supported | ✅ Supported | Full support with Edge Natural Neural voices |
| **Safari (iOS 14.5+ & macOS)** | ✅ Supported (`webkitSpeechRecognition`) | ✅ Supported | Requires explicit microphone permission prompt |
| **Firefox** | ⚠️ Limited (Requires flags) | ✅ Supported | Text-to-speech works natively; STT shows friendly fallback guide |
| **Opera / Brave** | ✅ Supported | ✅ Supported | Ensure speech services are enabled in browser shields |

---

## 🚢 Deployment Guide

### Deploy to Vercel
1. Push your repository to GitHub / GitLab.
2. Import the project into [Vercel](https://vercel.com).
3. Framework Preset: **Vite**.
4. Build Command: `npm run build`.
5. Output Directory: `dist`.
6. Add environment variables from `.env` if using Firebase Auth.
7. Click **Deploy**.

### Deploy to Netlify
1. Connect repository in [Netlify](https://netlify.com).
2. Build command: `npm run build`.
3. Publish directory: `dist`.
4. Deploy site.

### Deploy to Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
# Set public directory to 'dist' and configure as single-page app
npm run build
firebase deploy --only hosting
```

---

## 🛡️ Privacy & Security Design

- **No Remote Audio Uploads**: VoiceFlow does not transmit microphone audio streams to third-party databases or proprietary servers. Audio is processed transiently by browser native APIs.
- **Sanitized Local Storage**: Passwords and authentication session tokens are never saved to `localStorage`. Only harmless UI flags (theme preference and opt-in draft autosave) use `localStorage`.
- **Ephemeral Session Tokens**: Active session states reside in memory or `sessionStorage` and clear upon tab close or logout.

---

## 📄 License

MIT License &copy; 2026 VoiceFlow. All rights reserved.
