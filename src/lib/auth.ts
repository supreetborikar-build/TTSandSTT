import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { firebaseAuth, isFirebaseConfigured } from './firebase';
import { User } from '../types/auth';

const SESSION_KEY = 'vf_auth_session';
const LOCAL_USERS_KEY = 'vf_sec_users';

// Web Crypto SHA-256 hashing helper with fixed application salt
async function hashPassword(password: string): Promise<string> {
  const enc = new TextEncoder();
  const salt = 'voiceflow_secure_salt_v1_';
  const data = enc.encode(salt + password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

interface StoredLocalUser {
  uid: string;
  email: string;
  displayName: string;
  passwordHash: string;
  createdAt: string;
}

// Initialize seed demo user if not already present in sessionStorage
async function initializeLocalStore(): Promise<void> {
  try {
    const raw = sessionStorage.getItem(LOCAL_USERS_KEY);
    if (!raw) {
      const demoHash = await hashPassword('VoiceFlow@2026');
      const seedUsers: StoredLocalUser[] = [
        {
          uid: 'vf-demo-user-101',
          email: 'demo@voiceflow.ai',
          displayName: 'Alex Rivers',
          passwordHash: demoHash,
          createdAt: new Date().toISOString(),
        },
      ];
      sessionStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(seedUsers));
    }
  } catch (err) {
    console.warn('Local session storage warning:', err);
  }
}

// Initialise right away
if (!isFirebaseConfigured) {
  initializeLocalStore();
}

function getLocalUsers(): StoredLocalUser[] {
  try {
    const raw = sessionStorage.getItem(LOCAL_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalUsers(users: StoredLocalUser[]): void {
  try {
    sessionStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Failed to save local users:', err);
  }
}

export async function loginUser(email: string, password: string): Promise<User> {
  const trimmedEmail = email.trim().toLowerCase();

  if (!trimmedEmail || !password) {
    throw new Error('Please enter both email and password.');
  }

  // 1. If Firebase is configured, use real Firebase Auth
  if (isFirebaseConfigured && firebaseAuth) {
    const cred = await signInWithEmailAndPassword(firebaseAuth, trimmedEmail, password);
    return mapFirebaseUser(cred.user);
  }

  // 2. Local Secure Auth mode
  await initializeLocalStore();
  const users = getLocalUsers();
  const user = users.find(u => u.email.toLowerCase() === trimmedEmail);

  if (!user) {
    throw new Error('No account found with this email. Please check your credentials or register.');
  }

  const inputHash = await hashPassword(password);
  if (user.passwordHash !== inputHash) {
    throw new Error('Incorrect password. Please try again.');
  }

  const authenticatedUser: User = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    createdAt: user.createdAt,
  };

  // Save session in sessionStorage (expires when browser tab is closed, not in localStorage)
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(authenticatedUser));
  notifyListeners(authenticatedUser);
  return authenticatedUser;
}

export async function registerUser(email: string, password: string, displayName?: string): Promise<User> {
  const trimmedEmail = email.trim().toLowerCase();

  if (!trimmedEmail || !trimmedEmail.includes('@')) {
    throw new Error('Please provide a valid email address.');
  }
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }

  // 1. Firebase Auth mode
  if (isFirebaseConfigured && firebaseAuth) {
    const cred = await createUserWithEmailAndPassword(firebaseAuth, trimmedEmail, password);
    return mapFirebaseUser(cred.user);
  }

  // 2. Local Secure Auth mode
  await initializeLocalStore();
  const users = getLocalUsers();
  if (users.some(u => u.email.toLowerCase() === trimmedEmail)) {
    throw new Error('An account with this email address already exists.');
  }

  const passwordHash = await hashPassword(password);
  const newUser: StoredLocalUser = {
    uid: 'vf-user-' + Math.random().toString(36).substring(2, 9),
    email: trimmedEmail,
    displayName: displayName?.trim() || trimmedEmail.split('@')[0],
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveLocalUsers(users);

  const authenticatedUser: User = {
    uid: newUser.uid,
    email: newUser.email,
    displayName: newUser.displayName,
    createdAt: newUser.createdAt,
  };

  sessionStorage.setItem(SESSION_KEY, JSON.stringify(authenticatedUser));
  notifyListeners(authenticatedUser);
  return authenticatedUser;
}

export async function logoutUser(): Promise<void> {
  if (isFirebaseConfigured && firebaseAuth) {
    await firebaseSignOut(firebaseAuth);
    return;
  }

  sessionStorage.removeItem(SESSION_KEY);
  notifyListeners(null);
}

export function getCurrentSessionUser(): User | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function mapFirebaseUser(fbUser: FirebaseUser): User {
  return {
    uid: fbUser.uid,
    email: fbUser.email || '',
    displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
    createdAt: fbUser.metadata.creationTime,
  };
}

// Session state listener
type AuthListener = (user: User | null) => void;
const listeners: Set<AuthListener> = new Set();

function notifyListeners(user: User | null) {
  listeners.forEach(fn => fn(user));
}

export function subscribeToAuthChanges(callback: AuthListener): () => void {
  if (isFirebaseConfigured && firebaseAuth) {
    const unsubscribe = onAuthStateChanged(firebaseAuth, fbUser => {
      callback(fbUser ? mapFirebaseUser(fbUser) : null);
    });
    return unsubscribe;
  }

  listeners.add(callback);
  // Send initial session
  callback(getCurrentSessionUser());

  return () => {
    listeners.delete(callback);
  };
}
