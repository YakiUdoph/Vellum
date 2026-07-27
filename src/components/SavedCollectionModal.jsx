import React, { useState } from 'react';
import {
  X,
  Bookmark,
  Feather,
  ShieldCheck,
  Zap,
  ExternalLink,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { getInscribedEchoes } from '../utils/nimiqPay';

export default function SavedCollectionModal({
  isOpen,
  onClose,
  allArtifacts,
  savedArtifactIds = [],
  onSelectArtifact,
}) {
  const [activeTab, setActiveTab] = useState('bookmarks'); // 'bookmarks' | 'echoes'

  if (!isOpen) return null;

  const bookmarkedArtifacts = allArtifacts.filter((a) => savedArtifactIds.includes(a.id));
  
  // Aggregate all user inscribed echoes across artifacts
  const allUserEchoes = allArtifacts.flatMap((art) => {
    const echoes = getInscribedEchoes(art.id);
    return echoes.map((e) => ({ ...e, artifactTitle: art.title, artifactDate: art.displayDate }));
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#121216] border border-amber-500/30 rounded-3xl p-6 shadow-2xl shadow-amber-500/10 text-neutral-100 overflow-hidden">
        
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
            <Bookmark className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="font-cinzel text-lg font-bold text-amber-100">My Museum Collection</h3>
            <p className="text-xs text-neutral-400">
              Personal history archive & inscribed reflections
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-1 p-1 bg-neutral-900 border border-neutral-800 rounded-xl mb-5 text-xs">
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`flex-1 py-2 rounded-lg font-medium transition flex items-center justify-center space-x-1.5 ${
              activeTab === 'bookmarks'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Saved Bookmarks ({bookmarkedArtifacts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('echoes')}
            className={`flex-1 py-2 rounded-lg font-medium transition flex items-center justify-center space-x-1.5 ${
              activeTab === 'echoes'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Feather className="w-3.5 h-3.5" />
            <span>Inscribed Echoes ({allUserEchoes.length})</span>
          </button>
        </div>

        {/* TAB 1: BOOKMARKED ARTIFACTS */}
        {activeTab === 'bookmarks' && (
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {bookmarkedArtifacts.length === 0 ? (
              <div className="p-8 text-center bg-neutral-900/40 rounded-2xl border border-neutral-800/80 space-y-2">
                <Bookmark className="w-8 h-8 text-amber-500/40 mx-auto" />
                <p className="text-xs text-neutral-400">No bookmarked artifacts yet.</p>
                <p className="text-[11px] text-neutral-500">
                  Click the bookmark icon on any historical artifact card to save it here for offline reading.
                </p>
              </div>
            ) : (
              bookmarkedArtifacts.map((artifact) => (
                <div
                  key={artifact.id}
                  onClick={() => {
                    onSelectArtifact(artifact.id);
                    onClose();
                  }}
                  className="p-3.5 bg-neutral-900/80 border border-neutral-800 hover:border-amber-500/40 rounded-2xl cursor-pointer transition flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-3 truncate">
                    <img
                      src={artifact.coverImage}
                      alt={artifact.title}
                      className="w-12 h-12 object-cover rounded-xl border border-amber-500/20 shrink-0"
                    />
                    <div className="truncate">
                      <div className="text-xs font-mono text-amber-400 font-semibold">{artifact.displayDate}</div>
                      <div className="text-sm font-bold text-neutral-100 group-hover:text-amber-300 truncate">
                        {artifact.title}
                      </div>
                      <div className="text-[10px] text-neutral-500 truncate">{artifact.era}</div>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-neutral-500 group-hover:text-amber-400 shrink-0 ml-2" />
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: MY INSCRIBED ECHOES */}
        {activeTab === 'echoes' && (
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {allUserEchoes.length === 0 ? (
              <div className="p-8 text-center bg-neutral-900/40 rounded-2xl border border-neutral-800/80 space-y-2">
                <Sparkles className="w-8 h-8 text-amber-500/40 mx-auto" />
                <p className="text-xs text-neutral-400">No inscribed echoes found.</p>
                <p className="text-[11px] text-neutral-500">
                  Inscribe your thoughts onto history using Nimiq Pay micro-payments to store them on-chain.
                </p>
              </div>
            ) : (
              allUserEchoes.map((echo) => (
                <div
                  key={echo.id}
                  className="p-3.5 bg-neutral-900/80 border border-neutral-800 rounded-2xl space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between text-neutral-400 font-mono text-[11px]">
                    <span className="text-amber-300 font-bold">{echo.artifactTitle}</span>
                    <span className="text-amber-400 font-bold flex items-center space-x-1">
                      <Zap className="w-3 h-3" />
                      <span>{echo.amount} {echo.currency}</span>
                    </span>
                  </div>

                  <p className="font-serif italic text-neutral-200 pl-2 border-l-2 border-amber-500/30">
                    "{echo.text}"
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-neutral-500 font-mono pt-1 border-t border-neutral-800/60">
                    <span className="truncate max-w-[200px]">{echo.txHash}</span>
                    <span className="text-emerald-400 flex items-center space-x-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Verified PoS</span>
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
