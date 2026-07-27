import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Sparkles,
  Landmark,
  Calendar,
  Share2,
  Feather,
  Maximize2,
  X,
  Bookmark,
  BookmarkCheck,
} from 'lucide-react';
import EchoTimeline from './EchoTimeline';
import NimiqPayAdvantageCard from './NimiqPayAdvantageCard';
import { getInscribedEchoes } from '../utils/nimiqPay';

export default function ArtifactCard({
  artifact,
  allArtifacts,
  currentIndex,
  onNavigate,
  onOpenInscribeModal,
  isSaved = false,
  onToggleSave,
  echoFee = { usdt: '0.01', nim: '1' },
}) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [echoes, setEchoes] = useState([]);
  const [copiedShare, setCopiedShare] = useState(false);

  // Load merged echoes whenever artifact changes
  useEffect(() => {
    if (!artifact) return;
    const customEchoes = getInscribedEchoes(artifact.id);
    setEchoes([...customEchoes, ...artifact.initialEchoes]);
    setIsPlayingAudio(false);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, [artifact]);

  if (!artifact) return null;

  // Web Speech API Narrator Toggle
  const handleToggleAudio = () => {
    if (!('speechSynthesis' in window)) {
      alert('Audio guide is not supported in this browser.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      const fullText = `${artifact.title}. ${artifact.subtitle}. ${artifact.narrative.join(' ')}`;
      const utterance = new SpeechSynthesisUtterance(fullText);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);

      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Vellum | ${artifact.title}`,
        text: `Explore "${artifact.title}" on Vellum historical timeline.`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < allArtifacts.length - 1;

  return (
    <article className="relative max-w-3xl mx-auto px-3.5 sm:px-6 py-3 sm:py-6 animate-fade-in">
      
      {/* Date & Chronological Navigation Bar */}
      <div className="flex items-center justify-between mb-4 sm:mb-6 p-2 sm:p-3 bg-[#121216]/90 border border-neutral-800 rounded-2xl backdrop-blur-md">
        
        {/* Previous Artifact Button */}
        <button
          onClick={() => hasPrev && onNavigate(currentIndex - 1)}
          disabled={!hasPrev}
          className={`flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-semibold min-h-[44px] transition ${
            hasPrev
              ? 'text-amber-300 hover:bg-amber-500/10 border border-amber-500/20 active:scale-95'
              : 'text-neutral-600 border border-transparent cursor-not-allowed'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Earlier</span>
        </button>

        {/* Date Display Pill */}
        <div className="flex items-center space-x-2 text-center">
          <Calendar className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs font-mono font-semibold text-amber-200 uppercase tracking-wider">
            {artifact.displayDate}
          </span>
          <span className="text-[10px] text-neutral-500 font-mono hidden md:inline">
            ({currentIndex + 1} of {allArtifacts.length})
          </span>
        </div>

        {/* Next Artifact Button */}
        <button
          onClick={() => hasNext && onNavigate(currentIndex + 1)}
          disabled={!hasNext}
          className={`flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-semibold min-h-[44px] transition ${
            hasNext
              ? 'text-amber-300 hover:bg-amber-500/10 border border-amber-500/20 active:scale-95'
              : 'text-neutral-600 border border-transparent cursor-not-allowed'
          }`}
        >
          <span className="hidden sm:inline">Later</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Museum Card Frame */}
      <div className="bg-[#121216] border border-amber-500/25 rounded-3xl p-4 sm:p-8 shadow-2xl shadow-black/80 relative overflow-hidden">
        
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header Tags & Museum Code */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3 sm:mb-4 text-xs font-mono">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/30 uppercase tracking-widest font-semibold text-[10px]">
              {artifact.era}
            </span>
            <span className="text-neutral-500">•</span>
            <span className="text-neutral-400 text-[11px]">{artifact.category}</span>
          </div>

          <div className="text-neutral-500 text-[10px] sm:text-[11px] font-mono tracking-widest bg-neutral-900 px-2.5 py-0.5 rounded border border-neutral-800">
            {artifact.museumCode}
          </div>
        </div>

        {/* Artifact Title & Subtitle */}
        <div className="mb-6">
          <div className="text-[11px] sm:text-xs text-amber-400/90 font-mono uppercase tracking-widest mb-1">
            {artifact.historicalDate}
          </div>
          <h1 className="font-serif-museum text-2xl sm:text-4xl md:text-5xl font-bold leading-tight gold-gradient-text">
            {artifact.title}
          </h1>
          <p className="font-serif text-sm sm:text-lg text-neutral-300 mt-2 leading-relaxed italic">
            {artifact.subtitle}
          </p>
        </div>

        {/* High Resolution Image Frame */}
        <div className="relative group mb-6 sm:mb-8 rounded-2xl overflow-hidden border border-amber-500/30 shadow-xl bg-black">
          <img
            src={artifact.coverImage}
            alt={artifact.title}
            className="w-full h-64 sm:h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121216] via-transparent to-transparent opacity-80"></div>
          
          {/* Image Action Buttons */}
          <div className="absolute bottom-3 right-3 flex items-center space-x-2">
            <button
              onClick={() => setLightboxOpen(true)}
              className="p-2.5 rounded-xl bg-black/70 hover:bg-black/90 text-neutral-300 hover:text-amber-300 border border-neutral-700 backdrop-blur-md transition min-h-[44px] min-w-[44px] flex items-center justify-center"
              title="Expand Image Lightbox"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Location Badge Overlay */}
          <div className="absolute bottom-3 left-3 flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-black/75 border border-neutral-800 text-xs text-neutral-300 backdrop-blur-md max-w-[75%] truncate">
            <Landmark className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">{artifact.location}</span>
          </div>
        </div>

        {/* Audio Guide & Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-neutral-900/80 border border-neutral-800 rounded-2xl mb-6 sm:mb-8">
          <button
            onClick={handleToggleAudio}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold min-h-[44px] transition ${
              isPlayingAudio
                ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20 animate-pulse'
                : 'bg-neutral-800 text-amber-300 hover:bg-neutral-700 border border-amber-500/20'
            }`}
          >
            {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
            <span>{isPlayingAudio ? 'Stop Audio Guide' : 'Listen to Narrative'}</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onToggleSave && onToggleSave()}
              className="p-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 transition min-h-[44px] min-w-[44px] flex items-center justify-center"
              title="Bookmark Artifact"
            >
              {isSaved ? <BookmarkCheck className="w-4 h-4 text-amber-400" /> : <Bookmark className="w-4 h-4" />}
            </button>

            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 transition min-h-[44px] min-w-[44px] flex items-center justify-center"
              title="Share Artifact"
            >
              <Share2 className="w-4 h-4" />
            </button>
            {copiedShare && (
              <span className="text-[10px] text-emerald-400 font-mono">Copied!</span>
            )}
          </div>
        </div>

        {/* Narrative Text */}
        <div className="space-y-4 sm:space-y-5 text-neutral-200 font-serif text-base sm:text-lg leading-relaxed mb-8">
          {artifact.narrative.map((paragraph, idx) => (
            <p key={idx} className="first-letter:text-3xl first-letter:font-bold first-letter:text-amber-400 first-letter:mr-1">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Pull-Quote Block */}
        {artifact.quote && (
          <blockquote className="my-6 sm:my-8 p-4 sm:p-6 bg-gradient-to-r from-amber-500/10 via-neutral-900 to-neutral-900 border-l-4 border-amber-500 rounded-r-2xl">
            <p className="font-serif-museum text-lg sm:text-2xl text-amber-100 italic leading-relaxed">
              "{artifact.quote.text}"
            </p>
            <footer className="mt-2.5 text-xs font-mono text-amber-400/90 font-semibold tracking-wider">
              — {artifact.quote.author}
            </footer>
          </blockquote>
        )}

        {/* Provenance Footer Box */}
        <div className="p-3.5 sm:p-4 bg-neutral-900/60 border border-neutral-800 rounded-xl text-xs text-neutral-400 mb-8">
          <span className="font-semibold text-neutral-300 uppercase tracking-wider block mb-1">
            Provenance & Archival Record:
          </span>
          <span className="font-mono text-neutral-400">{artifact.provenance}</span>
        </div>

        {/* Nimiq Pay Value Proposition vs TradFi Card */}
        <NimiqPayAdvantageCard />

        {/* Primary CTA: Inscribe an Echo Button */}
        <div className="p-5 sm:p-6 bg-gradient-to-br from-amber-500/15 via-[#16161d] to-[#121216] border border-amber-500/40 rounded-2xl text-center space-y-3 shadow-xl">
          <div className="inline-flex items-center space-x-1.5 text-[11px] text-amber-400 font-mono uppercase tracking-widest px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Nimiq Pay Micro-Payment</span>
          </div>

          <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-amber-100">
            Inscribe Your Echo onto History
          </h3>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-md mx-auto leading-relaxed">
            Stamp a personal reflection permanently onto today's timeline for <span className="text-amber-300 font-semibold">${echoFee.usdt} USDT</span> or <span className="text-amber-300 font-bold">⚡ {echoFee.nim} NIM (+100 PTS)</span>.
          </p>

          <button
            onClick={onOpenInscribeModal}
            className="mt-2 inline-flex items-center space-x-2 py-3.5 px-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-500/20 transition transform active:scale-95 min-h-[44px]"
          >
            <Feather className="w-4 h-4" />
            <span>Inscribe an Echo (${echoFee.usdt} USDT / ⚡ {echoFee.nim} NIM)</span>
          </button>
        </div>

        {/* Integrated Echo Timeline */}
        <EchoTimeline echoes={echoes} onInscribeClick={onOpenInscribeModal} />
      </div>

      {/* Image Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-fade-in">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 text-neutral-400 hover:text-white p-2.5 rounded-full bg-neutral-900 border border-neutral-800 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={artifact.coverImage}
            alt={artifact.title}
            className="max-w-full max-h-[85vh] object-contain rounded-xl border border-amber-500/30"
          />
        </div>
      )}
    </article>
  );
}
