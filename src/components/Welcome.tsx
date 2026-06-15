import React, { useState } from 'react';
import Ladybug from './Ladybug';

interface WelcomeProps {
  onEnter: () => void;
}

export default function Welcome({ onEnter }: WelcomeProps) {
  const [dots, setDots] = useState<{ id: number; x: number; y: number; color: string; size: number }[]>([]);

  // Cute interactive click trail matching editorial colors
  const handleMouseMove = (e: React.MouseEvent) => {
    if (Math.random() < 0.1) {
      const colors = ['#2D423F', '#8B9474', '#D18A6A'];
      const size = Math.random() * 6 + 3;
      const newDot = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
        color: colors[Math.floor(Math.random() * colors.length)],
        size,
      };
      setDots((prev) => [...prev, newDot]);
      setTimeout(() => {
        setDots((prev) => prev.filter((d) => d.id !== newDot.id));
      }, 1000);
    }
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative flex flex-col items-center justify-center min-h-screen p-12 overflow-hidden bg-background font-sans select-none"
    >
      {/* Click Trails */}
      {dots.map((dot) => (
        <div
          key={dot.id}
          style={{
            position: 'fixed',
            left: dot.x,
            top: dot.y,
            width: `${dot.size}px`,
            height: `${dot.size}px`,
            backgroundColor: dot.color,
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: 50,
            opacity: 0.7,
            transition: 'all 1s ease-out',
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}

      {/* Background Blobs and Rotators */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 opacity-20 animate-spin" style={{ animationDuration: '40s' }}>
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <circle cx="50" cy="50" fill="#8B9474" r="15" />
            <path
              d="M50 20 Q55 35 60 20 Q75 35 60 50 Q75 65 60 80 Q55 65 50 80 Q45 65 40 80 Q25 65 40 50 Q25 35 40 20 Q45 35 50 20"
              fill="#2D423F"
              opacity="0.3"
            />
          </svg>
        </div>

        {/* Ladybugs of Welcome Screen */}
        <Ladybug className="bottom-1/3 right-1/4 scale-125" initialRotation={15} isWelcome={true} />
        <Ladybug className="top-12 right-24 scale-90" initialRotation={110} isWelcome={true} />

        {/* Decorative soft pastel editorial blur spots */}
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-[#D18A6A]/5 blur-[80px]" />
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#8B9474]/5 blur-[80px]" />
      </div>

      {/* Main Card Content */}
      <main className="relative z-10 flex flex-col items-center text-center max-w-2xl px-6 mx-auto">
        <div className="mb-6">
          <span className="font-serif italic text-4xl font-light tracking-tight text-primary">
            Agnes.
          </span>
        </div>

        <div className="mb-12">
          <span className="text-[11px] uppercase tracking-[0.3em] font-semibold text-secondary mb-3 block">Volume I — The Sanctuary</span>
          <h1 className="font-serif text-5xl md:text-6xl text-on-surface font-light leading-[1.15] mb-6 tracking-tight">
            Your Skincare <br/><span className="italic">Sanctuary</span>
          </h1>
          <p className="text-base md:text-lg font-serif italic text-on-surface/70 max-w-lg mx-auto leading-relaxed">
            A curated space designed for your unique chemistry. Where science meets the art of self-care. Discover the products that speak to your soul and your skin.
          </p>
        </div>

        {/* Pulsing enter button */}
        <div className="relative group">
          <button
            onClick={onEnter}
            className="px-10 py-4 bg-[#1C1C1C] text-white text-[12px] uppercase tracking-[0.2ed] tracking-[0.2em] font-semibold hover:bg-[#2D423F] transition-all duration-300 shadow-sm cursor-pointer"
          >
            Enter Sanctuary
          </button>
        </div>

        {/* Decorative thin accent line */}
        <div className="mt-16 w-32 border-b border-[#1C1C1C]/10" />
      </main>

      {/* Floating Interactive bottom badges: spa flower, favorite heart */}
      <div className="fixed bottom-8 left-8 flex gap-4 z-20">
        <div className="w-11 h-11 flex items-center justify-center bg-white text-on-surface rounded-full border border-[#1C1C1C]/10 shadow-sm hover:ring-2 ring-secondary transition-all duration-300 group cursor-pointer">
          <span className="material-symbols-outlined text-sm text-secondary group-hover:scale-110 transition-transform">
            spa
          </span>
        </div>
        <div className="w-11 h-11 flex items-center justify-center bg-white text-on-surface rounded-full border border-[#1C1C1C]/10 shadow-sm hover:ring-2 ring-secondary transition-all duration-300 group cursor-pointer">
          <span className="material-symbols-outlined text-sm text-secondary group-hover:scale-110 transition-transform">
            favorite
          </span>
        </div>
      </div>
    </div>
  );
}
