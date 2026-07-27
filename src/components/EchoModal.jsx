import React, { useState } from 'react';
import {
  X,
  Feather,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Sparkles,
  ArrowRight,
  Zap,
  HelpCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  ECHO_PRICE,
  POINT_REWARDS,
  ERROR_CODES,
  executeNimiqPayTransaction,
  saveInscribedEcho,
} from '../utils/nimiqPay';

export default function EchoModal({
  isOpen,
  onClose,
  artifact,
  walletState,
  setWalletState,
  onEchoInscribed,
  onOpenWalletModal,
  onShowToast,
  onConnectWallet,
}) {
  const [reflection, setReflection] = useState('');
  const [authorName, setAuthorName] = useState(walletState.displayName || 'VellumExplorer.nimiq');
  const [selectedCurrency, setSelectedCurrency] = useState('NIM'); // Default to NIM to promote incentive!
  const [status, setStatus] = useState('idle'); // 'idle' | 'processing' | 'success' | 'error'
  const [currentStep, setCurrentStep] = useState({ id: 'preparing', text: 'Initializing payload...' });
  const [errorObj, setErrorObj] = useState(null);
  const [txDetails, setTxDetails] = useState(null);

  // Dev Testing Simulation Scenario selector for judges & reviewers
  const [testScenario, setTestScenario] = useState('none'); // 'none' | 'user_cancel' | 'network_error' | 'insufficient_funds'

  if (!isOpen || !artifact) return null;

  const charLimit = 280;
  const remainingChars = charLimit - reflection.length;
  const price = ECHO_PRICE[selectedCurrency];
  const bonusPointsEarned = POINT_REWARDS[selectedCurrency];

  const handleInscribe = async (e) => {
    e.preventDefault();
    if (!reflection.trim()) {
      setErrorObj({
        code: 'VALIDATION_ERROR',
        message: 'Please write a brief reflection before inscribing your echo onto the timeline.',
      });
      return;
    }

    let activeWallet = walletState;

    // Payment handler requiring manual trigger — connects wallet if disconnected
    if (!activeWallet.isConnected) {
      if (onConnectWallet) {
        try {
          activeWallet = await onConnectWallet();
        } catch (connError) {
          console.error("Wallet connection failed or was cancelled:", connError);
          setErrorObj({
            code: ERROR_CODES.WALLET_NOT_CONNECTED,
            message: 'Wallet connection is required to complete Nimiq Pay micro-transaction.',
          });
          return;
        }
      } else {
        setErrorObj({
          code: ERROR_CODES.WALLET_NOT_CONNECTED,
          message: 'Your Nimiq Pay wallet is currently disconnected.',
        });
        return;
      }
    }

    setErrorObj(null);
    setStatus('processing');
    setCurrentStep({ id: 'preparing', text: 'Preparing Nimiq Pay payment payload...' });

    try {
      const result = await executeNimiqPayTransaction({
        currency: selectedCurrency,
        amount: price,
        walletState: activeWallet,
        message: `Vellum Echo: ${artifact.title.slice(0, 30)}`,
        simulationScenario: testScenario,
        onProgressStep: (stepId, stepMsg) => {
          setCurrentStep({ id: stepId, text: stepMsg });
        },
      });

      // Update parent wallet state with deducted balance & new bonus points
      setWalletState(result.updatedWallet);

      // Create new Echo object
      const newEcho = {
        id: 'echo-' + Date.now(),
        author: authorName || 'Anonymous.nimiq',
        wallet: walletState.address,
        text: reflection.trim(),
        timestamp: new Date().toISOString(),
        currency: selectedCurrency,
        amount: price,
        txHash: result.txHash,
        bonusPoints: result.pointsEarned,
        verified: true,
      };

      // Persist to localStorage & trigger callback
      saveInscribedEcho(artifact.id, newEcho);
      setTxDetails(result);
      setStatus('success');

      // Trigger Confetti Celebration
      confetti({
        particleCount: selectedCurrency === 'NIM' ? 90 : 50,
        spread: 80,
        origin: { y: 0.6 },
        colors: selectedCurrency === 'NIM'
          ? ['#f5a623', '#d4af37', '#ffffff', '#eab308']
          : ['#10b981', '#34d399', '#ffffff'],
      });

      if (onEchoInscribed) {
        onEchoInscribed(newEcho);
      }

      if (onShowToast) {
        onShowToast({
          type: 'success',
          title: 'Payment Successful',
          message: `Inscribed ${price} ${selectedCurrency} echo. Earned +${result.pointsEarned} PTS!`,
        });
      }
    } catch (err) {
      console.error("Transaction failed or was cancelled:", err);
      setStatus('error');
      setErrorObj({
        code: err.code || 'UNKNOWN_ERROR',
        message: err.message || 'Payment execution encountered an unexpected issue.',
      });

      if (onShowToast) {
        onShowToast({
          type: err.code === ERROR_CODES.USER_CANCELLED ? 'warning' : 'error',
          title: err.code === ERROR_CODES.USER_CANCELLED ? 'Transaction Cancelled' : 'Payment Failed',
          message: err.message || 'Transaction could not be completed.',
        });
      }
    }
  };

  const handleResetAndClose = () => {
    setStatus('idle');
    setReflection('');
    setErrorObj(null);
    setTxDetails(null);
    onClose();
  };

  const handleTopUpClick = () => {
    handleResetAndClose();
    if (onOpenWalletModal) onOpenWalletModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#121216] border border-amber-500/35 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-amber-500/10 text-neutral-100 overflow-hidden">
        
        {/* Ambient Top Glow */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-amber-400 p-2 rounded-xl hover:bg-neutral-800 transition z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {status === 'success' ? (
          /* SUCCESS STATE */
          <div className="text-center py-6 space-y-5 animate-fade-in">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                Nimiq PoS Ledger Confirmed
              </span>
              <h3 className="font-cinzel text-2xl font-bold text-amber-100 mt-2">
                Echo Permanently Inscribed
              </h3>
              <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto">
                Your historical reflection on <span className="text-amber-300">"{artifact.title}"</span> has been signed and stamped.
              </p>
            </div>

            {/* Bonus Points Banner */}
            <div className="p-3.5 bg-gradient-to-r from-amber-500/20 via-neutral-900 to-neutral-900 border border-amber-500/40 rounded-2xl text-left flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-amber-500/20 rounded-xl">
                  <Zap className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <div className="text-xs font-bold text-amber-200">
                    +{txDetails?.pointsEarned} Bonus Collector Points
                  </div>
                  <div className="text-[10px] text-neutral-400 font-mono">
                    {selectedCurrency === 'NIM'
                      ? '⚡ 5x Incentive Multiplier (Paid with Native NIM)'
                      : 'Standard Inscription Reward (Paid with USDT)'}
                  </div>
                </div>
              </div>
              <span className="text-xs font-mono text-amber-400 font-bold px-2 py-1 bg-amber-500/10 rounded border border-amber-500/30">
                {selectedCurrency}
              </span>
            </div>

            {/* Transaction Hash Card */}
            <div className="p-3.5 bg-neutral-950 border border-neutral-800 rounded-xl text-left font-mono text-xs space-y-1">
              <div className="flex items-center justify-between text-neutral-400">
                <span>Verified Transaction Hash</span>
                <span className="text-emerald-400 font-semibold">{price} {selectedCurrency}</span>
              </div>
              <div className="text-emerald-400 break-all bg-black/60 p-2 rounded border border-neutral-800/80">
                {txDetails?.txHash}
              </div>
            </div>

            <button
              onClick={handleResetAndClose}
              className="w-full flex items-center justify-center space-x-2 py-3.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-500/20 transition transform active:scale-95"
            >
              <span>Return to Artifact Feed</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* FORM & DEFENSIVE PAYMENT FLOW */
          <div>
            <div className="flex items-center space-x-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                <Feather className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="font-cinzel text-lg font-bold text-amber-100">Inscribe an Echo</h3>
                <p className="text-xs text-neutral-400 truncate max-w-xs">
                  {artifact.title} • {artifact.historicalDate}
                </p>
              </div>
            </div>

            {/* DEFENSIVE ERROR ALERT BANNER */}
            {errorObj && (
              <div className="mb-4 p-4 bg-red-950/60 border border-red-500/40 rounded-2xl text-xs text-red-200 space-y-2 animate-fade-in shadow-lg">
                <div className="flex items-start space-x-2.5">
                  <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-bold text-red-300 uppercase tracking-wider text-[11px]">
                      {errorObj.code === ERROR_CODES.USER_CANCELLED
                        ? 'Payment Cancelled'
                        : errorObj.code === ERROR_CODES.INSUFFICIENT_BALANCE
                        ? 'Insufficient Wallet Balance'
                        : errorObj.code === ERROR_CODES.NETWORK_ERROR
                        ? 'Network Connection Timeout'
                        : errorObj.code === ERROR_CODES.WALLET_NOT_CONNECTED
                        ? 'Wallet Disconnected'
                        : 'Transaction Notice'}
                    </div>
                    <p className="mt-1 leading-relaxed text-neutral-300">{errorObj.message}</p>
                  </div>
                </div>

                {/* Actionable Error Recovery Buttons */}
                <div className="pt-2 border-t border-red-500/20 flex flex-wrap gap-2 justify-end">
                  {errorObj.code === ERROR_CODES.INSUFFICIENT_BALANCE && (
                    <button
                      type="button"
                      onClick={handleTopUpClick}
                      className="px-3 py-1.5 bg-amber-500 text-neutral-950 font-bold text-[11px] rounded-lg hover:bg-amber-400 transition"
                    >
                      Top Up via Faucet
                    </button>
                  )}
                  {errorObj.code === ERROR_CODES.WALLET_NOT_CONNECTED && (
                    <button
                      type="button"
                      onClick={handleTopUpClick}
                      className="px-3 py-1.5 bg-amber-500 text-neutral-950 font-bold text-[11px] rounded-lg hover:bg-amber-400 transition"
                    >
                      Connect Wallet Now
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setErrorObj(null)}
                    className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-medium text-[11px] rounded-lg border border-neutral-700 transition"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}

            {/* ASYNCHRONOUS STEP INDICATOR DURING PROCESSING */}
            {status === 'processing' ? (
              <div className="py-8 text-center space-y-6">
                <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-2 border-amber-500/20 border-t-amber-400 animate-spin"></div>
                  <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
                </div>

                <div>
                  <h4 className="font-cinzel text-lg font-bold text-amber-200">
                    Executing Nimiq Pay Micro-Payment
                  </h4>
                  <p className="text-xs text-neutral-400 mt-1">{currentStep.text}</p>
                </div>

                {/* Step Stepper Progress */}
                <div className="grid grid-cols-3 gap-2 px-4">
                  <div className={`p-2 rounded-xl border text-[10px] font-mono transition ${
                    currentStep.id === 'preparing'
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-500'
                  }`}>
                    1. Payload
                  </div>
                  <div className={`p-2 rounded-xl border text-[10px] font-mono transition ${
                    currentStep.id === 'signing'
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-500'
                  }`}>
                    2. Nimiq Sign
                  </div>
                  <div className={`p-2 rounded-xl border text-[10px] font-mono transition ${
                    currentStep.id === 'broadcasting'
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-500'
                  }`}>
                    3. Block Consensus
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleInscribe} className="space-y-4">
                
                {/* Author Name */}
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1 font-medium">
                    Inscriber Identity / Nimiq Alias
                  </label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="e.g. ApolloExplorer.nimiq"
                    className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition"
                  />
                </div>

                {/* Reflection Input */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] uppercase tracking-wider text-neutral-400 font-medium">
                      Your Historical Reflection
                    </label>
                    <span className={`text-[10px] font-mono ${remainingChars < 30 ? 'text-amber-400' : 'text-neutral-500'}`}>
                      {remainingChars} chars
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    value={reflection}
                    maxLength={charLimit}
                    onChange={(e) => setReflection(e.target.value)}
                    placeholder="What thoughts or emotions does this historical artifact awaken in you?"
                    className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition resize-none leading-relaxed font-serif text-sm"
                  />
                </div>

                {/* CURRENCY SELECTOR WITH CLEAR NIM INCENTIVE BADGING */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[11px] uppercase tracking-wider text-neutral-400 font-medium">
                      Select Nimiq Pay Currency
                    </label>
                    <span className="text-[10px] text-amber-400 font-mono flex items-center space-x-1">
                      <Zap className="w-3 h-3" />
                      <span>NIM Usage = 5x Bonus Points!</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* NIM Option (Incentivized) */}
                    <button
                      type="button"
                      onClick={() => setSelectedCurrency('NIM')}
                      className={`relative flex flex-col justify-between p-3.5 rounded-2xl border text-xs font-semibold transition ${
                        selectedCurrency === 'NIM'
                          ? 'bg-amber-500/15 border-amber-500/70 text-amber-200 shadow-md shadow-amber-500/10'
                          : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                      }`}
                    >
                      {/* Top Incentive Badge */}
                      <span className="absolute -top-2.5 right-2 px-2 py-0.5 bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 text-[9px] font-extrabold uppercase rounded-full tracking-wider shadow">
                        ⚡ 5x BONUS (+100 PTS)
                      </span>

                      <div className="flex items-center space-x-2 mb-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
                        <span className="font-bold text-amber-300">NIM Token</span>
                      </div>
                      
                      <div className="flex items-center justify-between w-full font-mono text-neutral-300">
                        <span>{ECHO_PRICE.NIM} NIM</span>
                        <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                          +100 PTS
                        </span>
                      </div>
                    </button>

                    {/* USDT Option */}
                    <button
                      type="button"
                      onClick={() => setSelectedCurrency('USDT')}
                      className={`flex flex-col justify-between p-3.5 rounded-2xl border text-xs font-semibold transition ${
                        selectedCurrency === 'USDT'
                          ? 'bg-amber-500/15 border-amber-500/70 text-amber-200 shadow-md shadow-amber-500/10'
                          : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                        <span>USDT</span>
                      </div>

                      <div className="flex items-center justify-between w-full font-mono text-neutral-400">
                        <span>${ECHO_PRICE.USDT}</span>
                        <span className="text-[10px] text-neutral-500 font-medium">
                          +20 PTS
                        </span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Payment Summary Box */}
                <div className="p-3.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-neutral-300">
                    <span>Micro-Payment Charge:</span>
                    <span className="text-amber-300 font-bold font-mono">
                      {price} {selectedCurrency}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-neutral-400 text-[11px]">
                    <span>Collector Rewards Granted:</span>
                    <span className="font-mono text-amber-400 font-bold">
                      +{bonusPointsEarned} Points
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-neutral-500 text-[10px]">
                    <span>Estimated Nimiq PoS Gas:</span>
                    <span className="font-mono">~0.0001 NIM</span>
                  </div>
                </div>

                {/* DEV TEST SCENARIO CONTROL FOR HACKATHON JUDGES */}
                <div className="p-3 bg-neutral-900/90 border border-neutral-800 rounded-xl">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-amber-400/90 flex items-center space-x-1">
                      <HelpCircle className="w-3 h-3" />
                      <span>Judge Sandbox: Test Defensive Error Handling</span>
                    </span>
                  </div>
                  <select
                    value={testScenario}
                    onChange={(e) => setTestScenario(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-black border border-neutral-800 rounded-lg text-xs text-neutral-300 focus:outline-none focus:border-amber-500/50 font-mono"
                  >
                    <option value="none">Normal Payment Flow (Success)</option>
                    <option value="user_cancel">Simulate User Cancellation in Nimiq Pay</option>
                    <option value="network_error">Simulate Nimiq PoS Network Timeout</option>
                    <option value="insufficient_funds">Simulate Insufficient Wallet Balance</option>
                  </select>
                </div>

                {/* SUBMIT BUTTON */}
                <button
                  type="submit"
                  disabled={status === 'processing'}
                  className="w-full flex items-center justify-center space-x-2 py-3.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-500/20 transition transform active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>
                    Pay {price} {selectedCurrency} & Earn +{bonusPointsEarned} PTS
                  </span>
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
