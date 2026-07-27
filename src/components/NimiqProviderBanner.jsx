import React, { useState, useEffect } from 'react';
import { checkNimiqEnvironment } from '../utils/nimiqPay';
import { Info, X, ExternalLink, ShieldCheck, Smartphone } from 'lucide-react';

export default function NimiqProviderBanner({ onOpenWallet }) {
  const [isVisible, setIsVisible] = useState(false);
  const [envInfo, setEnvInfo] = useState({ isAvailable: false, provider: null });

  useEffect(() => {
    // Perform environment check matching SDK provider check
    const status = checkNimiqEnvironment();
    setEnvInfo(status);

    // Show banner if provider is NOT injected (Standard Browser Mode)
    if (!status.isAvailable) {
      try {
        const dismissed = sessionStorage.getItem('vellum_nimiq_banner_dismissed');
        if (!dismissed) {
          setIsVisible(true);
        }
      } catch {
        setIsVisible(true);
      }
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      sessionStorage.setItem('vellum_nimiq_banner_dismissed', 'true');
    } catch {
      // ignore
    }
  };

  if (!isVisible || envInfo.isAvailable) return null;

  return (
    <div className="bg-gradient-to-r from-amber-950/70 via-neutral-900 to-amber-950/70 border-b border-amber-500/30 px-3.5 py-2.5 text-xs text-amber-200 shadow-md">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5 min-w-0">
          <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
            <Smartphone className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="min-w-0 text-left">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-amber-300 truncate">
                Standard Browser Mode
              </span>
              <span className="text-[9px] font-mono uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1.5 py-0.2 rounded font-semibold shrink-0">
                Sandbox Active
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 truncate">
              Nimiq Pay provider not injected in standard window. Web3 sandbox micro-payments enabled.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={onOpenWallet}
            className="hidden sm:flex items-center space-x-1 px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg text-[11px] font-semibold transition"
          >
            <ShieldCheck className="w-3 h-3 text-amber-400" />
            <span>View Nimiq Wallet</span>
          </button>
          <button
            onClick={handleDismiss}
            className="p-1 text-neutral-400 hover:text-amber-300 rounded-lg hover:bg-neutral-800 transition"
            title="Dismiss Notice"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
