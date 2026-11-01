import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ChatProvider, useChat } from './context/ChatContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AddMoneyModal } from './components/AddMoneyModal';
import { StartConsultationModal } from './components/StartConsultationModal';
import { IncomingRequestModal } from './components/IncomingRequestModal';
import { ChatRoom } from './components/ChatRoom';

import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { ReaderProfilePage } from './pages/ReaderProfilePage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PolicyPages } from './pages/PolicyPages';
import { AuthPages } from './pages/AuthPages';
import { CompatibilityPage } from './pages/CompatibilityPage';
import { CustomerDashboard } from './pages/CustomerDashboard';
import { AstrologerDashboard } from './pages/AstrologerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { Reader } from './types';

function MainContent() {
  const { user } = useAuth();
  const { activeSession, startSession } = useChat();

  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedReader, setSelectedReader] = useState<Reader | null>(null);
  const [consultationModalReader, setConsultationModalReader] = useState<Reader | null>(null);
  const [isAddMoneyOpen, setIsAddMoneyOpen] = useState<boolean>(false);

  const handleOpenConsultationModal = (reader: Reader) => {
    if (!user) {
      setCurrentView('login');
      return;
    }
    setConsultationModalReader(reader);
  };

  const handleConsultationSuccess = (session: any) => {
    setCurrentView('customer-chat');
  };

  const handleSelectReader = (reader: Reader) => {
    setSelectedReader(reader);
    setCurrentView('reader-profile');
  };

  return (
    <div className={`min-h-screen flex flex-col ${currentView === 'home' ? 'bg-[#160822] text-[#FAF7F2]' : 'bg-[#FAF7F2] text-[#29252D]'}`}>
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        onOpenWalletModal={() => setIsAddMoneyOpen(true)}
      />

      {/* Real-time Astrologer incoming request prompt */}
      <IncomingRequestModal
        onOpenChat={() => setCurrentView('astrologer-chat')}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomePage
            onSelectReader={handleSelectReader}
            onExplore={() => setCurrentView('explore')}
            onOpenConsultationModal={handleOpenConsultationModal}
            setCurrentView={setCurrentView}
          />
        )}

        {currentView === 'explore' && (
          <ExplorePage
            onSelectReader={handleSelectReader}
            onOpenConsultationModal={handleOpenConsultationModal}
          />
        )}

        {currentView === 'reader-profile' && selectedReader && (
          <ReaderProfilePage
            reader={selectedReader}
            onBack={() => setCurrentView('explore')}
            onOpenConsultationModal={handleOpenConsultationModal}
          />
        )}

        {currentView === 'how-it-works' && (
          <HowItWorksPage
            onExplore={() => setCurrentView('explore')}
            setCurrentView={setCurrentView}
          />
        )}

        {currentView === 'about' && (
          <AboutPage onExplore={() => setCurrentView('explore')} />
        )}

        {currentView === 'contact' && <ContactPage />}

        {(currentView === 'compatibility' || currentView === 'calculator') && (
          <CompatibilityPage
            onExplore={() => setCurrentView('explore')}
            onSelectReader={handleSelectReader}
            onOpenConsultationModal={handleOpenConsultationModal}
            setCurrentView={setCurrentView}
          />
        )}

        {currentView === 'login' && (
          <AuthPages
            initialMode="login"
            onSuccess={role => {
              if (role === 'admin') setCurrentView('admin');
              else if (role === 'astrologer') setCurrentView('astrologer-dashboard');
              else setCurrentView('customer-dashboard');
            }}
            onNavigatePolicy={pol => setCurrentView(pol)}
          />
        )}

        {currentView === 'signup' && (
          <AuthPages
            initialMode="signup"
            onSuccess={role => {
              if (role === 'admin') setCurrentView('admin');
              else if (role === 'astrologer') setCurrentView('astrologer-dashboard');
              else setCurrentView('customer-dashboard');
            }}
            onNavigatePolicy={pol => setCurrentView(pol)}
          />
        )}

        {currentView === 'forgot-password' && (
          <AuthPages
            initialMode="forgot"
            onSuccess={() => setCurrentView('customer-dashboard')}
            onNavigatePolicy={pol => setCurrentView(pol)}
          />
        )}

        {(currentView === 'privacy' || currentView === 'terms' || currentView === 'refund') && (
          <PolicyPages
            type={currentView as any}
            onBack={() => setCurrentView('home')}
          />
        )}

        {currentView === 'customer-dashboard' && (
          <CustomerDashboard
            onOpenAddMoney={() => setIsAddMoneyOpen(true)}
            onOpenChat={() => setCurrentView('customer-chat')}
            onExplore={() => setCurrentView('explore')}
            setCurrentView={setCurrentView}
          />
        )}

        {currentView === 'customer-chat' && (
          <ChatRoom
            onBack={() => setCurrentView('customer-dashboard')}
            onOpenAddMoney={() => setIsAddMoneyOpen(true)}
          />
        )}

        {currentView === 'astrologer-dashboard' && (
          <AstrologerDashboard
            onOpenChat={() => setCurrentView('astrologer-chat')}
            setCurrentView={setCurrentView}
          />
        )}

        {currentView === 'astrologer-chat' && (
          <ChatRoom
            onBack={() => setCurrentView('astrologer-dashboard')}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboard
            onOpenChat={() => setCurrentView('customer-chat')}
            setCurrentView={setCurrentView}
          />
        )}
      </main>

      {/* Footer */}
      <Footer setCurrentView={setCurrentView} />

      {/* Global Modals */}
      <AddMoneyModal
        isOpen={isAddMoneyOpen}
        onClose={() => setIsAddMoneyOpen(false)}
      />

      <StartConsultationModal
        reader={consultationModalReader}
        isOpen={Boolean(consultationModalReader)}
        onClose={() => setConsultationModalReader(null)}
        onSuccess={handleConsultationSuccess}
        onOpenAddMoney={() => setIsAddMoneyOpen(true)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <MainContent />
      </ChatProvider>
    </AuthProvider>
  );
}
