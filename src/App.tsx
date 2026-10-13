import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { Dashboard } from './pages/Dashboard';
import { PrivacyModal } from './components/PrivacyModal';
import { ContactModal } from './components/ContactModal';
import { Loader2 } from 'lucide-react';

export type ViewState = 'landing' | 'login' | 'register' | 'dashboard';

export const App: React.FC = () => {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState<ViewState>('landing');
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  // Protected route enforcement
  useEffect(() => {
    if (!loading) {
      if (!user && currentView === 'dashboard') {
        setCurrentView('login');
      } else if (user && (currentView === 'login' || currentView === 'register')) {
        setCurrentView('dashboard');
      }
    }
  }, [user, loading, currentView]);

  const handleGetStarted = () => {
    if (user) {
      setCurrentView('dashboard');
    } else {
      setCurrentView('login');
    }
  };

  const handleNavigate = (view: ViewState) => {
    if (view === 'dashboard' && !user) {
      setCurrentView('login');
      return;
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3 text-indigo-600">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="text-xs font-semibold tracking-wider uppercase text-slate-500">
            Initializing VoiceFlow...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Navigation Header */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
      />

      {/* Main Content Router */}
      <div className="flex-1">
        {currentView === 'landing' && (
          <LandingPage
            onGetStarted={handleGetStarted}
            onExploreFeatures={() => {
              const el = document.getElementById('features');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            onOpenPrivacy={() => setIsPrivacyOpen(true)}
            onOpenContact={() => setIsContactOpen(true)}
          />
        )}

        {currentView === 'login' && (
          <LoginPage
            onSuccess={() => setCurrentView('dashboard')}
            onNavigateRegister={() => setCurrentView('register')}
            onNavigateHome={() => setCurrentView('landing')}
          />
        )}

        {currentView === 'register' && (
          <RegisterPage
            onSuccess={() => setCurrentView('dashboard')}
            onNavigateLogin={() => setCurrentView('login')}
            onNavigateHome={() => setCurrentView('landing')}
          />
        )}

        {currentView === 'dashboard' && user && (
          <Dashboard
            onOpenPrivacy={() => setIsPrivacyOpen(true)}
            onOpenContact={() => setIsContactOpen(true)}
          />
        )}
      </div>

      {/* Footer (Rendered on landing, login, and register pages) */}
      {currentView !== 'dashboard' && (
        <Footer
          onOpenPrivacy={() => setIsPrivacyOpen(true)}
          onOpenContact={() => setIsContactOpen(true)}
          onNavigateFeatures={() => {
            if (currentView !== 'landing') {
              setCurrentView('landing');
              setTimeout(() => {
                const el = document.getElementById('features');
                el?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }
          }}
        />
      )}

      {/* Modals */}
      <PrivacyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </div>
  );
};

export default App;
