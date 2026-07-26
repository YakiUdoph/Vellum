import React from 'react';
import { Shield, Sparkles, Wallet, Calendar, Coins, Feather } from 'lucide-react';

export default function Header({ walletState, onOpenWallet, activeArtifactDate, echoFee = { usdt: '0.01', nim: '1' } }) {
  return (
    <header className="sticky top-0 z-40 bg-[#0a0a0c]/90 backdrop-blur-md border-b border-amber-500/15 transition-all">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand Emblem & Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-700/10 border border-amber-500/30 flex items-center justify-center shadow-lg shadow-amber-500/5">
            <Feather className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-cinzel text-xl font-bold tracking-widest gold-gradient-text">
                VELLUM
              </span>
              <span className="text-[10px] uppercase tracking-widest px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
                Mini App
              </span>
            </div>
            <p className="text-[10px] text-neutral-400 tracking-wider font-mono">
              DAILY HISTORICAL ECHOES
            </p>
          </div>
        </div>

        {/* Center Rate Indicator (Hidden on smallest screens) */}
        <div className="hidden md:flex items-center space-x-2 px-3 py-1 rounded-full bg-neutral-900/80 border border-neutral-800 text-xs text-neutral-400">
          <Coins className="w-3.5 h-3.5 text-amber-400" />
          <span>Echo Fee:</span>
          <span className="text-amber-300 font-medium">${echoFee.usdt} USDT</span>
          <span className="text-neutral-600">|</span>
          <span className="text-amber-300 font-medium">{echoFee.nim} NIM</span>
        </div>

        {/* Wallet Connector Action */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenWallet}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
              walletState.isConnected
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 hover:bg-amber-500/20 shadow-sm shadow-amber-500/10'
                : 'bg-neutral-900 border-neutral-700 text-neutral-200 hover:border-amber-500/50 hover:text-amber-400'
            }`}
          >
            <Wallet className="w-4 h-4 text-amber-400" />
            <span className="max-w-[100px] truncate">
              {walletState.isConnected
                ? walletState.address.slice(0, 8) + '...'
                : 'Connect Nimiq'}
            </span>
            {walletState.isConnected && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
