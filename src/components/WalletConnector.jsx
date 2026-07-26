import React, { useState } from 'react';
import { X, Check, Copy, Wallet, RefreshCw, Zap, ShieldCheck, ExternalLink, PlusCircle } from 'lucide-react';
import { saveWalletState } from '../utils/nimiqPay';

export default function WalletConnector({ isOpen, onClose, walletState, setWalletState }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletState.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleConnection = () => {
    const updated = {
      ...walletState,
      isConnected: !walletState.isConnected,
    };
    setWalletState(updated);
    saveWalletState(updated);
  };

  const handleSimulateTopUp = () => {
    const updated = {
      ...walletState,
      balances: {
        USDT: parseFloat((walletState.balances.USDT + 10.0).toFixed(2)),
        NIM: parseFloat((walletState.balances.NIM + 500.0).toFixed(2)),
      },
    };
    setWalletState(updated);
    saveWalletState(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-[#121216] border border-amber-500/30 rounded-2xl p-6 shadow-2xl shadow-amber-500/10 text-neutral-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-amber-400 p-1.5 rounded-lg hover:bg-neutral-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
            <Wallet className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="font-cinzel text-lg font-bold text-amber-100">Nimiq Pay Wallet</h3>
            <p className="text-xs text-neutral-400 flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{walletState.network}</span>
            </p>
          </div>
        </div>

        {walletState.isConnected ? (
          <div className="space-y-4">
            
            {/* Address Box */}
            <div className="p-3.5 bg-neutral-900/90 border border-neutral-800 rounded-xl">
              <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
                <span>Account Address</span>
                <span className="text-emerald-400 font-mono text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between font-mono text-sm text-amber-200 tracking-wider">
                <span className="truncate">{walletState.address}</span>
                <button
                  onClick={handleCopyAddress}
                  className="ml-2 p-1.5 text-neutral-400 hover:text-amber-400 rounded hover:bg-neutral-800 transition"
                  title="Copy Address"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Balances Card */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 bg-neutral-900/70 border border-neutral-800/80 rounded-xl">
                <div className="text-[11px] uppercase tracking-wider text-neutral-400 mb-1">NIM Balance</div>
                <div className="text-lg font-bold text-amber-400 font-mono">
                  {walletState.balances.NIM.toLocaleString('en-US', { minimumFractionDigits: 2 })} NIM
                </div>
                <div className="text-[10px] text-neutral-500">Native Nimiq PoS Token</div>
              </div>

              <div className="p-3.5 bg-neutral-900/70 border border-neutral-800/80 rounded-xl">
                <div className="text-[11px] uppercase tracking-wider text-neutral-400 mb-1">USDT Balance</div>
                <div className="text-lg font-bold text-amber-400 font-mono">
                  ${walletState.balances.USDT.toFixed(2)} USDT
                </div>
                <div className="text-[10px] text-neutral-500">Nimiq Pay Stablecoin</div>
              </div>
            </div>

            {/* Test Faucet / Top-Up Action */}
            <button
              onClick={handleSimulateTopUp}
              className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold rounded-xl transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Simulate Faucet Top-Up (+500 NIM / +$10 USDT)</span>
            </button>

            {/* Disconnect Action */}
            <button
              onClick={handleToggleConnection}
              className="w-full py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-red-400 text-xs font-medium rounded-xl border border-neutral-800 transition"
            >
              Disconnect Wallet
            </button>
          </div>
        ) : (
          <div className="text-center py-4 space-y-4">
            <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl text-left">
              <h4 className="text-sm font-semibold text-amber-200 mb-1">Frictionless Nimiq Pay Integration</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Connect your Nimiq Wallet to seamlessly micro-pay for echo inscriptions on the daily historical timeline using USDT or NIM.
              </p>
            </div>

            <button
              onClick={handleToggleConnection}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-500/20 transition transform active:scale-95"
            >
              <Zap className="w-4 h-4" />
              <span>Connect Nimiq Pay Wallet</span>
            </button>
          </div>
        )}

        <div className="mt-5 pt-4 border-t border-neutral-800 text-center">
          <a
            href="https://nimiq.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 text-[11px] text-neutral-500 hover:text-amber-400 transition"
          >
            <span>Powered by Nimiq Pay Mini App SDK</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
