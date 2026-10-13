import React, { useState } from 'react';
import {
  Mic,
  Sun,
  Moon,
  Menu,
  X,
  LogOut,
  User as UserIcon,
  LayoutDashboard,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  currentView: 'landing' | 'login' | 'register' | 'dashboard';
  onNavigate: (view: 'landing' | 'login' | 'register' | 'dashboard') => void;
  onOpenPrivacy?: () => void;
  onOpenContact?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenPrivacy,
  onOpenContact,
}) => {
  const { user, logout, authProvider } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    onNavigate('landing');
    setMobileMenuOpen(false);
  };

  const navTo = (view: 'landing' | 'login' | 'register' | 'dashboard') => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 dark:bg-slate-950/80 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          type="button"
          onClick={() => navTo('landing')}
          className="flex items-center gap-2.5 text-left group focus:outline-none"
          aria-label="VoiceFlow Home"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-600/25 group-hover:scale-105 transition-transform">
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                VoiceFlow
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50">
                v2.0
              </span>
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-none hidden sm:block">
              Speech-to-Text & Text-to-Speech
            </p>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            type="button"
            onClick={() => navTo('landing')}
            className={`hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors ${
              currentView === 'landing' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''
            }`}
          >
            Overview
          </button>

          {user && (
            <button
              type="button"
              onClick={() => navTo('dashboard')}
              className={`flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors ${
                currentView === 'dashboard' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Workspace</span>
            </button>
          )}

          {onOpenPrivacy && (
            <button
              type="button"
              onClick={onOpenPrivacy}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Privacy Notice
            </button>
          )}

          {onOpenContact && (
            <button
              type="button"
              onClick={onOpenContact}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Contact
            </button>
          )}
        </nav>

        {/* Desktop Controls (Theme + Auth) */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* User state */}
          {user ? (
            <div className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-300 flex items-center justify-center font-bold">
                  {user.displayName?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                    {user.displayName || user.email.split('@')[0]}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {authProvider === 'firebase' ? 'Firebase Auth' : 'Secure Auth'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navTo('login')}
                className="px-3.5 py-1.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => navTo('register')}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transition-colors shadow-sm shadow-indigo-600/25"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Get Started</span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile controls: Theme + Hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-3 pb-5 space-y-3 animate-in slide-in-from-top-2">
          <button
            type="button"
            onClick={() => navTo('landing')}
            className="w-full text-left py-2 px-3 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Overview
          </button>

          {user ? (
            <>
              <button
                type="button"
                onClick={() => navTo('dashboard')}
                className="w-full flex items-center gap-2 text-left py-2 px-3 rounded-lg text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Open Workspace Dashboard</span>
              </button>

              <div className="px-3 py-2 bg-slate-50 dark:bg-slate-900 rounded-xl text-xs flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{user.email}</p>
                  <p className="text-[10px] text-slate-400">Signed In ({authProvider})</p>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-2.5 py-1 text-xs text-rose-600 font-medium hover:underline flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" /> Logout
                </button>
              </div>
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => navTo('login')}
                className="w-full py-2.5 rounded-xl text-sm font-medium text-center border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => navTo('register')}
                className="w-full py-2.5 rounded-xl text-sm font-semibold text-center text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Get Started
              </button>
            </div>
          )}

          {onOpenPrivacy && (
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPrivacy();
              }}
              className="w-full text-left py-2 px-3 rounded-lg text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400"
            >
              Privacy Policy & Security
            </button>
          )}

          {onOpenContact && (
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenContact();
              }}
              className="w-full text-left py-2 px-3 rounded-lg text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400"
            >
              Contact Support
            </button>
          )}
        </div>
      )}
    </header>
  );
};
