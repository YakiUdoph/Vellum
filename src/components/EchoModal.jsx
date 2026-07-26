import React, { useState } from 'react';
import { X, Feather, CheckCircle2, AlertCircle, Loader2, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ECHO_PRICE, executeNimiqPayTransaction, saveInscribedEcho } from '../utils/nimiqPay';

export default function EchoModal({ isOpen, onClose, artifact, walletState, setWalletState, onEchoInscribed }) {
  const [reflection, setReflection] = useState('');
  const [authorName, setAuthorName] = useState(walletState.displayName || 'VellumExplorer.nimiq');
  const [selectedCurrency, setSelectedCurrency] = useState('USDT'); // 'USDT' or 'NIM'
  const [status, setStatus] = useState('idle'); // 'idle' | 'processing' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [txDetails, setTxDetails] = useState(null);

  if (!isOpen || !artifact) return null;

  const charLimit = 280;
  const remainingChars = charLimit - reflection.length;
  const price = ECHO_PRICE[selectedCurrency];

  const handleInscribe = async (e) => {
    e.preventDefault();
    if (!reflection.trim()) {
      setErrorMessage('Please enter a reflection before inscribing.');
      return;
    }

    if (!walletState.isConnected) {
      setErrorMessage('Please connect your Nimiq Wallet to execute micro-payments.');
      return;
    }

    setErrorMessage('');
    setStatus('processing');

    try {
      const result = await executeNimiqPayTransaction({
        currency: selectedCurrency,
        amount: price,
        walletState,
      });

      // Update parent wallet state with deducted balance
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
        verified: true,
      };

      // Persist to localStorage & parent state
      saveInscribedEcho(artifact.id, newEcho);
      setTxDetails(result);
      setStatus('success');

      // Trigger Confetti Celebration
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f5a623', '#d4af37', '#ffffff', '#10b981'],
      });

      if (onEchoInscribed) {
        onEchoInscribed(newEcho);
      }
    } catch (err) {
      setStatus('error');
      setErrorMessage(err.message || 'Payment execution failed.');
    }
  };

  const handleResetAndClose = () => {
    setStatus('idle');
    setReflection('');
    setErrorMessage('');
    setTxDetails(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#121216] border border-amber-500/30 rounded-2xl p-6 sm:p-7 shadow-2xl shadow-amber-500/10 text-neutral-100 overflow-hidden">
        
        {/* Ambient Top Glow */}
        <div className="absolute -top-12 -left-12 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-amber-400 p-1.5 rounded-lg hover:bg-neutral-800 transition z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {status === 'success' ? (
          /* SUCCESS STATE */
          <div className="text-center py-6 space-y-5 animate-fade-in">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Nimiq PoS Block Confirmed
              </span>
              <h3 className="font-cinzel text-2xl font-bold text-amber-100 mt-2">
                Echo Inscribed into Timeline
              </h3>
              <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto">
                Your reflection on <span className="text-amber-300">"{artifact.title}"</span> is permanently stamped onto the public ledger.
              </p>
            </div>

            {/* Transaction Hash Card */}
            <div className="p-3.5 bg-neutral-900/90 border border-neutral-800 rounded-xl text-left font-mono text-xs">
              <div className="flex items-center justify-between text-neutral-400 mb-1">
                <span>Verified Tx Hash</span>
                <span className="text-amber-400 font-semibold">{price} {selectedCurrency}</span>
              </div>
              <div className="text-emerald-400 break-all bg-black/40 p-2 rounded border border-neutral-800">
                {txDetails?.txHash}
              </div>
            </div>

            <button
              onClick={handleResetAndClose}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-amber-500 text-neutral-950 font-bold text-sm rounded-xl hover:bg-amber-400 transition"
            >
              <span>Return to Artifact Timeline</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* INPUT & CHECKOUT FORM */
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

            {errorMessage && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-300 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleInscribe} className="space-y-4">
              
              {/* Alias / Handle */}
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

              {/* Reflection Textarea */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] uppercase tracking-wider text-neutral-400 font-medium">
                    Your Reflection
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

              {/* Currency Selector */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1.5 font-medium">
                  Select Nimiq Pay Currency
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedCurrency('USDT')}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition ${
                      selectedCurrency === 'USDT'
                        ? 'bg-amber-500/10 border-amber-500/50 text-amber-300'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      <span>USDT</span>
                    </div>
                    <span className="font-mono">${ECHO_PRICE.USDT}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedCurrency('NIM')}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition ${
                      selectedCurrency === 'NIM'
                        ? 'bg-amber-500/10 border-amber-500/50 text-amber-300'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                      <span>NIM Token</span>
                    </div>
                    <span className="font-mono">{ECHO_PRICE.NIM} NIM</span>
                  </button>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="p-3 bg-neutral-950 border border-neutral-800/80 rounded-xl text-xs space-y-1.5">
                <div className="flex items-center justify-between text-neutral-400">
                  <span>Inscription Micro-Payment</span>
                  <span className="text-amber-300 font-bold font-mono">
                    {price} {selectedCurrency}
                  </span>
                </div>
                <div className="flex items-center justify-between text-neutral-500 text-[11px]">
                  <span>Estimated Gas Fee (Nimiq PoS)</span>
                  <span className="font-mono">~0.0001 NIM</span>
                </div>
              </div>

              {/* Submit Trigger */}
              <button
                type="submit"
                disabled={status === 'processing'}
                className="w-full flex items-center justify-center space-x-2 py-3.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-500/20 transition transform active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
              >
                {status === 'processing' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-neutral-950" />
                    <span>Confirming on Nimiq Pay...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Pay {price} {selectedCurrency} & Inscribe Echo</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
