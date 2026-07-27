import React from 'react';
import { Compass, Feather, Wallet, Volume2, VolumeX } from 'lucide-react';

export default function MobileBottomNav({
  onOpenInscribe,
  onOpenWallet,
  onToggleAudio,
  isPlayingAudio,
  walletState,
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#0a0a0c]/95 backdrop-blur-lg border-t border-amber-500/20 px-3 py-2">
      <div className="flex items-center justify-around max-w-md mx-auto">
        
        {/* Artifact Feed Tab */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex flex-col items-center justify-center py-1 px-3 text-neutral-400 hover:text-amber-300 transition"
        >
          <Compass className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-medium font-sans">Artifact</span>
        </button>

        {/* Audio Guide Narrator Toggle */}
        <button
          onClick={onToggleAudio}
          className={`flex flex-col items-center justify-center py-1 px-3 transition ${
            isPlayingAudio ? 'text-amber-400 font-bold' : 'text-neutral-400 hover:text-amber-300'
          }`}
        >
          {isPlayingAudio ? (
            <VolumeX className="w-5 h-5 mb-0.5 text-amber-400 animate-pulse" />
          ) : (
            <Volume2 className="w-5 h-5 mb-0.5" />
          )}
          <span className="text-[10px] font-medium font-sans">
            {isPlayingAudio ? 'Stop Audio' : 'Audio'}
          </span>
        </button>

        {/* PRIMARY INSCRIBE CTA (GOLD BADGE) */}
        <button
          onClick={onOpenInscribe}
          className="flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 active:from-amber-400 active:to-amber-500 text-neutral-950 font-bold text-xs rounded-full shadow-lg shadow-amber-500/25 transition transform active:scale-95 -mt-3 border border-amber-300/40"
        >
          <Feather className="w-4 h-4" />
          <span>Inscribe</span>
        </button>

        {/* Wallet & Points Tab */}
        <button
          onClick={onOpenWallet}
          className="flex flex-col items-center justify-center py-1 px-3 text-neutral-400 hover:text-amber-300 transition relative"
        >
          <div className="relative">
            <Wallet className="w-5 h-5 mb-0.5" />
            {walletState.isConnected && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </div>
          <span className="text-[10px] font-mono text-amber-300">
            {walletState.isConnected ? `${walletState.bonusPoints || 0} PTS` : 'Wallet'}
          </span>
        </button>
      </div>
    </div>
  );
}
