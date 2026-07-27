import React, { useState, useRef, useEffect } from 'react';
import {
  Wallet,
  Coins,
  Feather,
  Zap,
  HelpCircle,
  Bookmark,
  Flame,
  MoreHorizontal,
  ShieldCheck,
  Code,
} from 'lucide-react';

export default function Header({
  walletState,
  onOpenWallet,
  onOpenOnboarding,
  onOpenSavedCollection,
  streak,
  echoFee = { usdt: '0.01', nim: '1' },
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-[#0a0a0c]/95 backdrop-blur-md border-b border-amber-500/20 shadow-md">
      
      {/* TIER 1: PRIMARY HEADER ROW */}
      <div className="max-w-4xl mx-auto px-3.5 sm:px-6 h-14 flex items-center justify-between">
        
        {/* Brand Emblem & Logo */}
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-700/10 border border-amber-500/30 flex items-center justify-center shadow-md shadow-amber-500/5 shrink-0">
            <Feather className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-cinzel text-base sm:text-lg font-bold tracking-widest gold-gradient-text">
                VELLUM
              </span>
              <span className="text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold">
                Nimiq Pay
              </span>
            </div>
          </div>
        </div>

        {/* Primary Row Right Actions: Points, Wallet & Dropdown */}
        <div className="flex items-center space-x-2 relative" ref={menuRef}>
          
          {/* User Bonus Points Pill */}
          {walletState.isConnected && (
            <button
              onClick={onOpenWallet}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold hover:bg-amber-500/20 transition active:scale-95"
              title="Collector Bonus Points"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>{walletState.bonusPoints || 0} PTS</span>
            </button>
          )}

          {/* Wallet Connection Button */}
          <button
            onClick={onOpenWallet}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all active:scale-95 ${
              walletState.isConnected
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 hover:bg-amber-500/20 shadow-sm shadow-amber-500/10'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 font-bold border-transparent'
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            <span className="max-w-[75px] sm:max-w-[110px] truncate font-mono text-[11px]">
              {walletState.isConnected
                ? walletState.address.slice(0, 8) + '...'
                : 'Connect'}
            </span>
          </button>

          {/* Decluttered 3-Dots Quick-Menu Dropdown Trigger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-amber-300 hover:border-amber-500/40 transition active:scale-95 min-h-[36px] min-w-[36px] flex items-center justify-center"
            title="More Options & Navigation"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {/* DROPDOWN OVERFLOW MENU */}
          {menuOpen && (
            <div className="absolute right-0 top-12 w-52 bg-[#121216] border border-amber-500/30 rounded-2xl shadow-2xl p-1.5 z-50 animate-fade-in text-xs space-y-1">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onOpenSavedCollection();
                }}
                className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-neutral-300 hover:text-amber-200 hover:bg-neutral-800/80 transition text-left font-medium"
              >
                <Bookmark className="w-4 h-4 text-amber-400 shrink-0" />
                <span>My Saved Collection</span>
              </button>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  onOpenOnboarding();
                }}
                className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-neutral-300 hover:text-amber-200 hover:bg-neutral-800/80 transition text-left font-medium"
              >
                <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Interactive Tour (60s)</span>
              </button>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  onOpenWallet();
                }}
                className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-neutral-300 hover:text-amber-200 hover:bg-neutral-800/80 transition text-left font-medium"
              >
                <Code className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Nimiq Pay Sandbox</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* TIER 2: METRICS & UTILITY SUB-BAR */}
      <div className="bg-[#0e0e12]/90 border-t border-neutral-900 px-3.5 sm:px-6 py-1 text-[11px] font-mono text-neutral-400">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
          
          {/* Left: Streak Counter Metric */}
          <div className="flex items-center space-x-1.5 shrink-0 text-amber-300">
            <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="font-bold">{streak?.count || 1}D Streak</span>
            <span className="text-[9px] text-neutral-500 hidden xs:inline">
              ({streak?.multiplier || 1}x Boost)
            </span>
          </div>

          {/* Center: Inscription Rate & NIM Bonus */}
          <div className="flex items-center space-x-1.5 shrink-0 text-neutral-300">
            <Coins className="w-3 h-3 text-amber-400" />
            <span>Fee: ${echoFee.usdt} USDT</span>
            <span className="text-neutral-600">|</span>
            <span className="text-amber-300 font-bold flex items-center space-x-1">
              <span>{echoFee.nim} NIM</span>
              <span className="text-[9px] text-amber-400 bg-amber-500/20 px-1 py-0.2 rounded border border-amber-500/30">
                ⚡ 5x PTS
              </span>
            </span>
          </div>

          {/* Right: Network Status */}
          <div className="flex items-center space-x-1 shrink-0 text-emerald-400 text-[10px]">
            <ShieldCheck className="w-3 h-3" />
            <span className="hidden sm:inline">Nimiq PoS Verified</span>
          </div>
        </div>
      </div>
    </header>
  );
}
