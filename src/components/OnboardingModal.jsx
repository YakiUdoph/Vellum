import React, { useState } from 'react';
import {
  Zap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  BookOpen,
  Coins,
  Compass,
} from 'lucide-react';

export default function OnboardingModal({ isOpen, onClose, onStartInscribe }) {
  const [step, setStep] = useState(0);

  if (!isOpen) return null;

  const slides = [
    {
      badge: 'Step 1 of 3 • Daily History',
      icon: BookOpen,
      title: 'Museum-Grade Historical Narratives',
      description:
        'Discover deeply researched human stories, rare museum artifacts, and authentic primary sources refreshed daily on Vellum.',
      highlight: 'Curated Daily • Free Audio Guide Included',
    },
    {
      badge: 'Step 2 of 3 • Nimiq Pay Integration',
      icon: Coins,
      title: 'Frictionless Web3 Micro-Payments',
      description:
        'Inscribe your reflections onto the historical timeline using Nimiq Pay for just $0.01 USDT or 1 NIM without complex Web3 setup.',
      highlight: 'Zero Friction • Mobile Wallet First',
    },
    {
      badge: 'Step 3 of 3 • Collector Rewards',
      icon: Zap,
      title: 'Earn +100 NIM Bonus Collector Points',
      description:
        'Using native NIM awards 5x bonus scoring points (+100 PTS) and unlocks the exclusive NIM Patron badge on the public ledger.',
      highlight: '⚡ 5x Incentive Multiplier with Native NIM',
    },
  ];

  const currentSlide = slides[step];
  const IconComponent = currentSlide.icon;

  const handleNext = () => {
    if (step < slides.length - 1) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    try {
      localStorage.setItem('vellum_onboarding_completed_v1', 'true');
    } catch {
      // ignore
    }
    onClose();
  };

  const handleQuickStartInscribe = () => {
    handleComplete();
    if (onStartInscribe) onStartInscribe();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-[#121216] border border-amber-500/35 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-amber-500/10 text-neutral-100 overflow-hidden">
        
        {/* Subtle Glow */}
        <div className="absolute -top-16 -right-16 w-44 h-44 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Skip / Close */}
        <button
          onClick={handleComplete}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-200 text-xs font-mono px-2.5 py-1 rounded-lg hover:bg-neutral-800 transition"
        >
          Skip
        </button>

        {/* Header Badge */}
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest mb-6">
          <Compass className="w-3 h-3" />
          <span>{currentSlide.badge}</span>
        </div>

        {/* Slide Content */}
        <div className="space-y-4 my-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-neutral-900 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-md">
            <IconComponent className="w-7 h-7" />
          </div>

          <h3 className="font-cinzel text-2xl font-bold text-amber-100 leading-snug">
            {currentSlide.title}
          </h3>

          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">
            {currentSlide.description}
          </p>

          <div className="p-3 bg-neutral-950 border border-neutral-800/80 rounded-xl text-xs font-mono text-amber-300 flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="truncate">{currentSlide.highlight}</span>
          </div>
        </div>

        {/* Stepper Dots & Navigation Buttons */}
        <div className="mt-8 pt-4 border-t border-neutral-800/80 space-y-4">
          <div className="flex items-center justify-between">
            {/* Dots */}
            <div className="flex items-center space-x-1.5">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setStep(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    step === idx ? 'w-6 bg-amber-400' : 'w-2 bg-neutral-800'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="flex items-center space-x-2 py-2.5 px-5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition transform active:scale-95"
            >
              <span>{step === slides.length - 1 ? 'Get Started' : 'Next Step'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Direct 60-Second Inscribe Shortcut */}
          <button
            onClick={handleQuickStartInscribe}
            className="w-full py-2.5 px-4 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold rounded-xl transition flex items-center justify-center space-x-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Try Inscribing an Echo Now (60s Quickstart)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
