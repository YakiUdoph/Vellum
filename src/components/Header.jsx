import React from 'react';
import { Wallet, Coins, Feather, Zap, HelpCircle, Bookmark, Flame } from 'lucide-react';

export default function Header({
  walletState,
  onOpenWallet,
  onOpenOnboarding,
  onOpenSavedCollection,
  streak,
  echoFee = { usdt: '0.01', nim: '1' },
}) {
  return (
    <header className="sticky top-0 z-40 bg-[#0a0a0c]/90 backdrop-blur-md border-b border-amber-500/15 transition-all">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand Emblem & Logo */}
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-700/10 border border-amber-500/30 flex items-center justify-center shadow-lg shadow-amber-500/5 shrink-0">
            <Feather className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-cinzel text-lg sm:text-xl font-bold tracking-widest gold-gradient-text">
                VELLUM
              </span>
              <span className="text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold">
                Nimiq Pay
              </span>
            </div>
            <p className="text-[9px] sm:text-[10px] text-neutral-400 tracking-wider font-mono hidden sm:block">
              HISTORICAL TIMELINE ECHOES
            </p>
          </div>
        </div>

        {/* Center Rate Indicator (Hidden on small screens) */}
        <div className="hidden md:flex items-center space-x-2 px-3 py-1 rounded-full bg-neutral-900/80 border border-neutral-800 text-xs text-neutral-400">
          <Coins className="w-3.5 h-3.5 text-amber-400" />
          <span>Fee:</span>
          <span className="text-amber-300 font-medium">${echoFee.usdt} USDT</span>
          <span className="text-neutral-600">|</span>
          <span className="text-amber-300 font-bold flex items-center space-x-1">
            <span>{echoFee.nim} NIM</span>
            <span className="text-[9px] font-mono text-amber-400 bg-amber-500/20 px-1.5 py-0.2 rounded border border-amber-500/30">
              ⚡ 5x BONUS
            </span>
          </span>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Daily Streak Badge */}
          <div
            className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-500/15 to-orange-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold"
            title={`${streak?.count || 1} Day Explorer Streak (${streak?.multiplier || 1}x PTS Boost)`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>{streak?.count || 1}D</span>
          </div>

          {/* Saved Collection Drawer Button */}
          <button
            onClick={onOpenSavedCollection}
            className="p-2 rounded-xl bg-neutral-900/80 border border-neutral-800 text-neutral-400 hover:text-amber-300 hover:border-amber-500/30 transition text-xs flex items-center space-x-1"
            title="My Saved Collection & Echoes"
          >
            <Bookmark className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline font-sans text-[11px]">Collection</span>
          </button>

          {/* Quick Tour Button */}
          <button
            onClick={onOpenOnboarding}
            className="p-2 rounded-xl bg-neutral-900/80 border border-neutral-800 text-neutral-400 hover:text-amber-300 hover:border-amber-500/30 transition text-xs flex items-center space-x-1"
            title="Interactive Onboarding Guide"
          >
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline font-sans text-[11px]">Tour</span>
          </button>

          {/* Bonus Points Pill */}
          {walletState.isConnected && (
            <button
              onClick={onOpenWallet}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold hover:bg-amber-500/20 transition"
              title="Collector Bonus Points"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>{walletState.bonusPoints || 0} PTS</span>
            </button>
          )}

          {/* Wallet Action Button */}
          <button
            onClick={onOpenWallet}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
              walletState.isConnected
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 hover:bg-amber-500/20 shadow-sm shadow-amber-500/10'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 font-bold border-transparent'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span className="max-w-[80px] sm:max-w-[120px] truncate font-mono">
              {walletState.isConnected
                ? walletState.address.slice(0, 8) + '...'
                : 'Connect'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
