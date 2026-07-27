import React, { useState } from 'react';
import {
  X,
  Check,
  Copy,
  Wallet,
  ShieldCheck,
  ExternalLink,
  PlusCircle,
  History,
  Award,
  HelpCircle,
  CheckCircle2,
  Flame,
  Zap,
} from 'lucide-react';
import { saveWalletState, calculatePatronRank } from '../utils/nimiqPay';

export default function WalletConnector({
  isOpen,
  onClose,
  walletState,
  setWalletState,
  streak = { count: 1, multiplier: 1.0 },
  onConnectWallet,
  onDisconnectWallet,
}) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('account'); // 'account' | 'history' | 'diagnostics'

  if (!isOpen) return null;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletState.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConnectClick = async () => {
    if (onConnectWallet) {
      await onConnectWallet();
    } else {
      const updated = {
        ...walletState,
        isConnected: true,
      };
      setWalletState(updated);
      saveWalletState(updated);
    }
  };

  const handleDisconnectClick = () => {
    if (onDisconnectWallet) {
      onDisconnectWallet();
    } else {
      const updated = {
        ...walletState,
        isConnected: false,
      };
      setWalletState(updated);
      saveWalletState(updated);
    }
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

  const points = walletState.bonusPoints || 0;
  const currentRank = calculatePatronRank(points);
  const nextTarget = points >= 1000 ? 2000 : points >= 500 ? 1000 : points >= 200 ? 500 : 200;
  const progressPercent = Math.min(Math.round((points / nextTarget) * 100), 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-[#121216] border border-amber-500/30 rounded-3xl p-6 shadow-2xl shadow-amber-500/10 text-neutral-100 overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-amber-400 p-2 rounded-xl hover:bg-neutral-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-5">
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

        {/* Navigation Tabs */}
        {walletState.isConnected && (
          <div className="flex items-center space-x-1 p-1 bg-neutral-900 border border-neutral-800 rounded-xl mb-5 text-xs">
            <button
              onClick={() => setActiveTab('account')}
              className={`flex-1 py-1.5 rounded-lg font-medium transition ${
                activeTab === 'account'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Account
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-1.5 rounded-lg font-medium transition flex items-center justify-center space-x-1 ${
                activeTab === 'history'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>History</span>
            </button>
            <button
              onClick={() => setActiveTab('diagnostics')}
              className={`flex-1 py-1.5 rounded-lg font-medium transition flex items-center justify-center space-x-1 ${
                activeTab === 'diagnostics'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Sandbox</span>
            </button>
          </div>
        )}

        {walletState.isConnected ? (
          <div>
            {/* TAB 1: ACCOUNT & BALANCES */}
            {activeTab === 'account' && (
              <div className="space-y-4">
                
                {/* Patron Rank Banner & Progress Bar */}
                <div className="p-4 bg-gradient-to-r from-amber-500/20 via-neutral-900 to-neutral-900 border border-amber-500/40 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-amber-500/20 rounded-xl">
                        <Award className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-amber-200">{currentRank}</div>
                        <div className="text-[10px] text-neutral-400 font-mono">
                          {points} Bonus Points
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30 flex items-center space-x-1">
                      <Flame className="w-3 h-3 text-amber-400" />
                      <span>{streak.count}D Streak</span>
                    </span>
                  </div>

                  {/* Level Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400">
                      <span>Rank Progress</span>
                      <span className="text-amber-300 font-bold">{points} / {nextTarget} PTS</span>
                    </div>
                    <div className="w-full h-2 bg-neutral-950 rounded-full overflow-hidden border border-neutral-800">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Address Box */}
                <div className="p-3.5 bg-neutral-900/90 border border-neutral-800 rounded-2xl">
                  <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
                    <span>Account Address</span>
                    <span className="text-emerald-400 font-mono text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      Connected
                    </span>
                  </div>
                  <div className="flex items-center justify-between font-mono text-sm text-amber-200 tracking-wider">
                    <span className="truncate">{walletState.address}</span>
                    <button
                      onClick={handleCopyAddress}
                      className="ml-2 p-1.5 text-neutral-400 hover:text-amber-400 rounded-lg hover:bg-neutral-800 transition"
                      title="Copy Address"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Balances Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl relative overflow-hidden">
                    <span className="absolute top-2 right-2 text-[9px] font-mono text-amber-400 font-bold bg-amber-500/20 px-1.5 py-0.5 rounded">
                      5x PTS
                    </span>
                    <div className="text-[11px] uppercase tracking-wider text-amber-300 font-bold mb-1">NIM Balance</div>
                    <div className="text-lg font-bold text-amber-400 font-mono">
                      {walletState.balances.NIM.toLocaleString('en-US', { minimumFractionDigits: 2 })} NIM
                    </div>
                    <div className="text-[10px] text-neutral-400">Native Nimiq PoS Token</div>
                  </div>

                  <div className="p-3.5 bg-neutral-900/70 border border-neutral-800/80 rounded-2xl">
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
                  onClick={handleDisconnectClick}
                  className="w-full py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-red-400 text-xs font-medium rounded-xl border border-neutral-800 transition"
                >
                  Disconnect Wallet
                </button>
              </div>
            )}

            {/* TAB 2: TRANSACTION HISTORY */}
            {activeTab === 'history' && (
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {(!walletState.txHistory || walletState.txHistory.length === 0) ? (
                  <div className="p-6 text-center text-xs text-neutral-400 bg-neutral-900/50 rounded-xl">
                    No transactions recorded yet.
                  </div>
                ) : (
                  walletState.txHistory.map((tx) => (
                    <div
                      key={tx.id}
                      className="p-3 bg-neutral-900/80 border border-neutral-800 rounded-xl text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-300 font-mono">
                          {tx.amount} {tx.currency}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{tx.status}</span>
                        </span>
                      </div>
                      <div className="text-[11px] text-neutral-300 truncate">{tx.memo}</div>
                      <div className="flex items-center justify-between text-[10px] text-neutral-500 font-mono">
                        <span className="truncate max-w-[180px]">{tx.txHash}</span>
                        <span className="text-amber-400">+{tx.bonusPoints} PTS</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 3: DIAGNOSTICS & SANDBOX INFORMATION */}
            {activeTab === 'diagnostics' && (
              <div className="space-y-3 text-xs text-neutral-300">
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-1">
                  <div className="font-bold text-amber-300">Defensive Web3 Error Architecture</div>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    Vellum catches all blockchain exception types gracefully:
                  </p>
                  <ul className="text-[10px] font-mono space-y-1 text-amber-200/90 list-disc pl-4 mt-1">
                    <li>USER_CANCELLED: Handled without console unhandled promise errors</li>
                    <li>INSUFFICIENT_BALANCE: Checked before initiating SDK popup</li>
                    <li>NETWORK_ERROR: Catch timeouts & node failures with retry UI</li>
                  </ul>
                </div>
                <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl">
                  <div className="font-bold text-neutral-200 mb-1">Nimiq Pay SDK Status</div>
                  <div className="font-mono text-[11px] text-neutral-400">
                    {window.NimiqPay ? '🟢 window.NimiqPay Injected' : '🟠 Web3 Simulator Engine Active'}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4 space-y-4">
            <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl text-left">
              <h4 className="text-sm font-semibold text-amber-200 mb-1">Nimiq Pay Seamless Integration</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Connect your Nimiq Wallet to execute instant micro-payments for historical echoes using USDT or native NIM with 5x bonus scoring points.
              </p>
            </div>

            <button
              onClick={handleConnectClick}
              className="w-full flex items-center justify-center space-x-2 py-3.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-500/20 transition transform active:scale-95"
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
