import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ArtifactCard from './components/ArtifactCard';
import WalletConnector from './components/WalletConnector';
import EchoModal from './components/EchoModal';
import MuseumSoundscape from './components/MuseumSoundscape';
import artifactsData from './data/artifacts.json';
import { getSavedWalletState } from './utils/nimiqPay';
import { Feather, Shield, Coins, Sparkles, Heart } from 'lucide-react';

export default function App() {
  const [walletState, setWalletState] = useState(getSavedWalletState());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [inscribeModalOpen, setInscribeModalOpen] = useState(false);
  const [echoFee, setEchoFee] = useState({ usdt: '0.01', nim: '1' });

  const currentArtifact = artifactsData[currentIndex] || artifactsData[0];

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-neutral-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Top Header */}
      <Header
        walletState={walletState}
        onOpenWallet={() => setWalletModalOpen(true)}
        activeArtifactDate={currentArtifact?.displayDate}
        echoFee={echoFee}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16 pt-4">
        {/* Artifact Feed Card */}
        <ArtifactCard
          artifact={currentArtifact}
          allArtifacts={artifactsData}
          currentIndex={currentIndex}
          onNavigate={(index) => setCurrentIndex(index)}
          onOpenInscribeModal={() => setInscribeModalOpen(true)}
          echoFee={echoFee}
        />
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-neutral-900 bg-[#070709] text-center text-xs text-neutral-500">
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

      {/* Wallet Connection Modal */}
      <WalletConnector
        isOpen={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
        walletState={walletState}
        setWalletState={setWalletState}
      />

      {/* Inscribe Echo Modal */}
      <EchoModal
        isOpen={inscribeModalOpen}
        onClose={() => setInscribeModalOpen(false)}
        artifact={currentArtifact}
        walletState={walletState}
        setWalletState={setWalletState}
        onEchoInscribed={() => {}}
      />

      {/* Ambient Soundscape Player */}
      <MuseumSoundscape />
    </div>
  );
}
