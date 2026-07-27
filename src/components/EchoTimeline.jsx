import React, { useState } from 'react';
import {
  ShieldCheck,
  Sparkles,
  Check,
  Copy,
  MessageSquare,
  Zap,
} from 'lucide-react';

export default function EchoTimeline({ echoes, onInscribeClick }) {
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'NIM' | 'USDT'
  const [copiedId, setCopiedId] = useState(null);

  const handleCopyTx = (txHash, id) => {
    navigator.clipboard.writeText(txHash);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredEchoes = echoes.filter((echo) => {
    if (filter === 'USDT') return echo.currency === 'USDT';
    if (filter === 'NIM') return echo.currency === 'NIM';
    return true;
  });

  return (
    <div className="mt-12 pt-10 border-t border-amber-500/15">
      
      {/* Timeline Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs text-amber-400 font-mono tracking-wider uppercase mb-1">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Public Ledger of Historical Reflections</span>
          </div>
          <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-amber-100 flex items-center space-x-2">
            <span>Inscribed Echoes</span>
            <span className="text-sm font-sans font-medium px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
              {echoes.length}
            </span>
          </h3>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 p-1 bg-neutral-900/90 border border-neutral-800 rounded-xl self-start sm:self-auto text-xs">
          {['ALL', 'NIM', 'USDT'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center space-x-1 ${
                filter === tab
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
              }`}
            >
              {tab === 'NIM' && <Zap className="w-3 h-3 text-amber-400" />}
              <span>{tab === 'ALL' ? 'All Echoes' : tab === 'NIM' ? '⚡ NIM (5x PTS)' : tab}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Echo List */}
      {filteredEchoes.length === 0 ? (
        <div className="p-8 text-center bg-neutral-900/40 border border-neutral-800/80 rounded-2xl">
          <Sparkles className="w-8 h-8 text-amber-500/40 mx-auto mb-2" />
          <p className="text-sm text-neutral-400 font-serif">No echoes found matching this filter.</p>
          <button
            onClick={onInscribeClick}
            className="mt-3 px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold rounded-xl transition"
          >
            Be the First to Inscribe with NIM (+100 PTS)
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEchoes.map((echo) => {
            const isNim = echo.currency === 'NIM';
            return (
              <div
                key={echo.id}
                className={`group relative p-5 bg-[#121216]/90 border rounded-2xl transition-all duration-300 shadow-md ${
                  isNim
                    ? 'border-amber-500/40 shadow-amber-500/5 bg-gradient-to-r from-[#17161c] via-[#121216] to-[#121216]'
                    : 'border-neutral-800/90 hover:border-amber-500/30'
                }`}
              >
                {/* Header: Author & Verified Badge */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2.5">
                    {/* Avatar Icon */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono border ${
                      isNim
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                        : 'bg-neutral-800 text-neutral-300 border-neutral-700'
                    }`}>
                      {echo.author ? echo.author[0].toUpperCase() : 'V'}
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-xs text-amber-200 font-mono">
                          {echo.author}
                        </span>
                        {isNim ? (
                          <span className="inline-flex items-center space-x-1 text-[10px] text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full font-mono font-bold">
                            <Zap className="w-3 h-3 text-amber-400" />
                            <span>NIM Patron (+100 PTS)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded font-mono">
                            <ShieldCheck className="w-3 h-3" />
                            <span>Verified Tx (+20 PTS)</span>
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-neutral-500 font-mono">
                        {new Date(echo.timestamp).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Micro-payment Badge */}
                  <div className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono border ${
                    isNim
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 font-bold'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isNim ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
                    <span>{echo.amount} {echo.currency}</span>
                  </div>
                </div>

                {/* Reflection Body */}
                <p className="text-sm sm:text-base font-serif leading-relaxed text-neutral-200 pl-1 border-l-2 border-amber-500/20 my-3 italic">
                  "{echo.text}"
                </p>

                {/* Footer: Tx Hash & Details */}
                <div className="flex items-center justify-between pt-2 border-t border-neutral-800/60 text-[11px] text-neutral-500 font-mono">
                  <div className="flex items-center space-x-1 truncate max-w-[220px] sm:max-w-xs">
                    <span>Tx Hash:</span>
                    <span className="text-neutral-400 truncate">{echo.txHash}</span>
                  </div>

                  <button
                    onClick={() => handleCopyTx(echo.txHash, echo.id)}
                    className="flex items-center space-x-1 text-neutral-400 hover:text-amber-300 transition"
                    title="Copy Transaction Hash"
                  >
                    {copiedId === echo.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400 text-[10px]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span className="text-[10px]">Copy Hash</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
