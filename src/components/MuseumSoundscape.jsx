import React, { useState, useEffect, useRef } from 'react';
import { Music } from 'lucide-react';

export default function MuseumSoundscape() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef(null);
  const gainNodeRef = useRef(null);
  const oscNodesRef = useRef([]);

  const toggleSoundscape = () => {
    if (isPlaying) {
      if (gainNodeRef.current) {
        gainNodeRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.5);
      }
      setTimeout(() => {
        if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
          audioCtxRef.current.suspend();
        }
        setIsPlaying(false);
      }, 500);
    } else {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!audioCtxRef.current) {
          audioCtxRef.current = new AudioContext();
        } else if (audioCtxRef.current.state === 'suspended') {
          audioCtxRef.current.resume();
        }

        const ctx = audioCtxRef.current;
        const mainGain = ctx.createGain();
        mainGain.gain.setValueAtTime(0.001, ctx.currentTime);
        mainGain.gain.exponentialRampToValueAtTime(0.05, ctx.currentTime + 2); // Soft low volume
        mainGain.connect(ctx.destination);
        gainNodeRef.current = mainGain;

        // Create warm ambient drone (sine frequencies in pentatonic scale)
        const freqs = [110, 164.81, 220, 329.63]; // A2, E3, A3, E4
        oscNodesRef.current = freqs.map((freq) => {
          const osc = ctx.createOscillator();
          const oscGain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          oscGain.gain.setValueAtTime(0.2, ctx.currentTime);
          osc.connect(oscGain);
          oscGain.connect(mainGain);
          osc.start();
          return osc;
        });

        setIsPlaying(true);
      } catch (err) {
        console.warn('Web Audio Soundscape error:', err);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close();
      }
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <button
        onClick={toggleSoundscape}
        className={`flex items-center space-x-2 px-3 py-2 rounded-full border text-xs font-mono shadow-xl backdrop-blur-md transition-all ${
          isPlaying
            ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-amber-500/10'
            : 'bg-[#121216]/90 border-neutral-800 text-neutral-400 hover:text-neutral-200'
        }`}
        title="Toggle Ambient Museum Soundscape"
      >
        <Music className={`w-3.5 h-3.5 ${isPlaying ? 'text-amber-400 animate-pulse' : 'text-neutral-500'}`} />
        <span className="hidden sm:inline">
          {isPlaying ? 'Museum Ambiance ON' : 'Ambient Sound'}
        </span>
      </button>
    </div>
  );
}
