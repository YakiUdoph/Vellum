import React from 'react';
import { Zap, ShieldCheck, CreditCard } from 'lucide-react';

export default function NimiqPayAdvantageCard() {
  return (
    <div className="p-4 sm:p-5 bg-gradient-to-br from-neutral-900 via-[#14141a] to-neutral-950 border border-amber-500/30 rounded-2xl my-6 space-y-3.5 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
          <Zap className="w-4 h-4 text-amber-400" />
          <span>Why Nimiq Pay Enables Vellum Micro-Payments</span>
        </div>
        <span className="text-[9px] font-mono font-extrabold uppercase tracking-widest px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
          Sub-Cent Protocol
        </span>
      </div>

      <p className="text-xs text-neutral-300 leading-relaxed font-sans">
        Traditional payment rails like credit cards or PayPal charge a minimum <span className="text-red-400 font-semibold">$0.30 fixed fee per swipe</span>, making sub-cent micro-transactions mathematically impossible. Nimiq Pay makes $0.01 micro-payments instant, cheap, and frictionless.
      </p>

      {/* Comparison Grid */}
      <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
        {/* TradFi Card */}
        <div className="p-3 bg-red-950/20 border border-red-500/20 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-red-300 font-bold text-[11px]">
            <span className="flex items-center space-x-1">
              <CreditCard className="w-3.5 h-3.5" />
              <span>Credit Cards</span>
            </span>
            <span className="font-mono text-red-400">$0.30 Fee</span>
          </div>
          <p className="text-[10px] text-neutral-400 leading-snug">
            3000% overhead on $0.01 payments. High decline rates & slow payouts.
          </p>
        </div>

        {/* Nimiq Pay Card */}
        <div className="p-3 bg-amber-500/10 border border-amber-500/40 rounded-xl space-y-1 shadow-md shadow-amber-500/5">
          <div className="flex items-center justify-between text-amber-300 font-bold text-[11px]">
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Nimiq Pay</span>
            </span>
            <span className="font-mono text-emerald-400">~$0.0001 Gas</span>
          </div>
          <p className="text-[10px] text-amber-200/90 leading-snug font-medium">
            ⚡ 1-Click native execution • 100% micro-payment efficiency.
          </p>
        </div>
      </div>
    </div>
  );
}
