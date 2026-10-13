export interface User {
  uid: string;
  email: string;
  displayName?: string;
  createdAt?: string;
  isAnonymous?: boolean;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  authProvider: 'firebase' | 'local';
}
