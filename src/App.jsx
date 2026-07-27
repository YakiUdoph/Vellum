import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ArtifactCard from './components/ArtifactCard';
import WalletConnector from './components/WalletConnector';
import EchoModal from './components/EchoModal';
import OnboardingModal from './components/OnboardingModal';
import SavedCollectionModal from './components/SavedCollectionModal';
import MobileBottomNav from './components/MobileBottomNav';
import MuseumSoundscape from './components/MuseumSoundscape';
import NimiqProviderBanner from './components/NimiqProviderBanner';
import ToastContainer from './components/ToastContainer';
import artifactsData from './data/artifacts.json';
import {
  getSavedWalletState,
  connectNimiqWallet,
  disconnectNimiqWallet,
} from './utils/nimiqPay';
import { getUserStreak, recordDailyVisit } from './utils/streak';
import { Feather } from 'lucide-react';

export default function App() {
  const [walletState, setWalletState] = useState(getSavedWalletState());
  const [streak, setStreak] = useState(getUserStreak());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [inscribeModalOpen, setInscribeModalOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [savedCollectionOpen, setSavedCollectionOpen] = useState(false);
  const [savedArtifactIds, setSavedArtifactIds] = useState(['artifact-alexandria-01']);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [toasts, setToasts] = useState([]);
  const echoFee = { usdt: '0.01', nim: '1' };

  const addToast = (toastObj) => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
    const newToast = { id, ...toastObj };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      dismissToast(id);
    }, 5000);
  };

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Explicit user action to connect — prevents any auto-connection on page load
  const handleConnectWallet = async () => {
    try {
      const updated = await connectNimiqWallet();
      setWalletState(updated);
      addToast({
        type: 'success',
        title: 'Wallet Connected',
        message: `Connected Nimiq Pay address: ${updated.address.slice(0, 10)}...`,
      });
      return updated;
    } catch (error) {
      console.error("Wallet connection failed or was cancelled:", error);
      addToast({
        type: 'error',
        title: 'Connection Failed',
        message: error.message || 'Wallet connection failed or was cancelled.',
      });
      throw error;
    }
  };

  const handleDisconnectWallet = () => {
    const updated = disconnectNimiqWallet();
    setWalletState(updated);
    addToast({
      type: 'warning',
      title: 'Wallet Disconnected',
      message: 'Nimiq Pay wallet session cleared.',
    });
  };

  // Track Daily Explorer Streak on load
  useEffect(() => {
    const updatedStreak = recordDailyVisit();
    setStreak(updatedStreak);

    try {
      const completed = localStorage.getItem('vellum_onboarding_completed_v1');
      if (!completed) {
        setOnboardingOpen(true);
      }
    } catch {
      // ignore
    }
  }, []);

  const currentArtifact = artifactsData[currentIndex] || artifactsData[0];

  const handleToggleGlobalAudio = () => {
    if (!('speechSynthesis' in window)) return;
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else if (currentArtifact) {
      const fullText = `${currentArtifact.title}. ${currentArtifact.subtitle}. ${currentArtifact.narrative.join(' ')}`;
      const utterance = new SpeechSynthesisUtterance(fullText);
      utterance.rate = 0.9;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  const handleSelectArtifactById = (id) => {
    const idx = artifactsData.findIndex((a) => a.id === id);
    if (idx !== -1) {
      setCurrentIndex(idx);
    }
  };

  const handleToggleBookmark = (id) => {
    if (savedArtifactIds.includes(id)) {
      setSavedArtifactIds(savedArtifactIds.filter((item) => item !== id));
    } else {
      setSavedArtifactIds([...savedArtifactIds, id]);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-neutral-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Nimiq Environment Status Banner */}
      <NimiqProviderBanner onOpenWallet={() => setWalletModalOpen(true)} />

      {/* Top Header */}
      <Header
        walletState={walletState}
        streak={streak}
        onOpenWallet={() => setWalletModalOpen(true)}
        onOpenOnboarding={() => setOnboardingOpen(true)}
        onOpenSavedCollection={() => setSavedCollectionOpen(true)}
        echoFee={echoFee}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-24 md:pb-16 pt-2 sm:pt-4">
        {/* Artifact Feed Card */}
        <ArtifactCard
          artifact={currentArtifact}
          allArtifacts={artifactsData}
          currentIndex={currentIndex}
          onNavigate={(index) => setCurrentIndex(index)}
          onOpenInscribeModal={() => setInscribeModalOpen(true)}
          isSaved={savedArtifactIds.includes(currentArtifact.id)}
          onToggleSave={() => handleToggleBookmark(currentArtifact.id)}
          echoFee={echoFee}
        />
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-neutral-900 bg-[#070709] text-center text-xs text-neutral-500 hidden md:block">
        <div className="max-w-4xl mx-auto px-4 space-y-3">
          <div className="flex items-center justify-center space-x-2">
            <Feather className="w-4 h-4 text-amber-500/60" />
            <span className="font-cinzel text-sm font-bold text-amber-200/80">VELLUM</span>
          </div>
          <p className="max-w-md mx-auto leading-relaxed text-neutral-400">
            A daily museum-grade historical narrative platform integrated with Nimiq Pay micro-payments (${echoFee.usdt} USDT / {echoFee.nim} NIM).
          </p>
          <div className="flex items-center justify-center space-x-4 text-[11px] font-mono text-neutral-400">
            <span>Powered by Nimiq PoS</span>
            <span>•</span>
            <span>Mobile Wallet First</span>
            <span>•</span>
            <span>Verified Micro-Transactions</span>
          </div>
        </div>
      </footer>

      {/* Native Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        onOpenInscribe={() => setInscribeModalOpen(true)}
        onOpenWallet={() => setWalletModalOpen(true)}
        onToggleAudio={handleToggleGlobalAudio}
        isPlayingAudio={isPlayingAudio}
        walletState={walletState}
      />

      {/* 60-Second Onboarding Tour Modal */}
      <OnboardingModal
        isOpen={onboardingOpen}
        onClose={() => setOnboardingOpen(false)}
        onStartInscribe={() => setInscribeModalOpen(true)}
      />

      {/* Personal Collection & Bookmarks Drawer */}
      <SavedCollectionModal
        isOpen={savedCollectionOpen}
        onClose={() => setSavedCollectionOpen(false)}
        allArtifacts={artifactsData}
        savedArtifactIds={savedArtifactIds}
        onSelectArtifact={handleSelectArtifactById}
      />

      {/* Wallet Connection Modal */}
      <WalletConnector
        isOpen={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
        walletState={walletState}
        setWalletState={setWalletState}
        streak={streak}
        onConnectWallet={handleConnectWallet}
        onDisconnectWallet={handleDisconnectWallet}
      />

      {/* Inscribe Echo Modal */}
      <EchoModal
        isOpen={inscribeModalOpen}
        onClose={() => setInscribeModalOpen(false)}
        artifact={currentArtifact}
        walletState={walletState}
        setWalletState={setWalletState}
        onOpenWalletModal={() => setWalletModalOpen(true)}
        onEchoInscribed={() => {}}
        onShowToast={addToast}
        onConnectWallet={handleConnectWallet}
      />

      {/* Global Toast Notification System */}
      <ToastContainer toasts={toasts} onDismissToast={dismissToast} />

      {/* Ambient Soundscape Player */}
      <MuseumSoundscape />
    </div>
  );
}
