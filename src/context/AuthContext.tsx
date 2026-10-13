import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types/auth';
import {
  loginUser,
  registerUser,
  logoutUser,
  subscribeToAuthChanges,
} from '../lib/auth';
import { isFirebaseConfigured } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  authProvider: 'firebase' | 'local';
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, displayName?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const authProvider = isFirebaseConfigured ? 'firebase' : 'local';

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(currentUser => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const login = async (email: string, pass: string) => {
    const loggedInUser = await loginUser(email, pass);
    setUser(loggedInUser);
  };

  const register = async (email: string, pass: string, displayName?: string) => {
    const newUser = await registerUser(email, pass, displayName);
    setUser(newUser);
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authProvider,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
