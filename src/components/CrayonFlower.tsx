import React, { useState } from 'react';

interface CrayonFlowerProps {
  className?: string;
  size?: number;
}

export default function CrayonFlower({ className = '', size = 80 }: CrayonFlowerProps) {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  const handleSpinSubmit = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    // Add additional rotations
    const newRotation = rotation + 1080 + Math.random() * 360;
    setRotation(newRotation);
    
    setTimeout(() => {
      setIsSpinning(false);
    }, 1600);
  };

  return (
    <div
      onClick={handleSpinSubmit}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        cursor: 'pointer',
        perspective: '1000px',
      }}
      className={`relative select-none flex flex-col justify-center items-center group ${className}`}
      title="Tap to spin the Hand-drawn Crayon Chamomile!"
    >
      {/* Hand-drawn Flower Graphic */}
      <div
        className="relative w-full h-full transition-transform duration-[1600ms] ease-[cubic-bezier(0.19,1,0.22,1)]"
        style={{
          transform: `rotate(${rotation}deg)`,
        }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-[2px_4px_6px_rgba(28,28,28,0.06)]"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Stem/Leaf (sketchy crayon lines) */}
          <path
            d="M50,75 C51,85 53,92 51,98"
            stroke="#8B9474"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
            strokeDasharray="1 1"
          />
          <path
            d="M51,82 C38,82 34,74 42,76"
            stroke="#8B9474"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Chamomile / Calendula Petals (overlapping hand-sketched paths) */}
          <g fill="#FDFDFB" stroke="#D18A6A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            {/* Soft cream petals with crayon texture shadows */}
            <path d="M50,15 C45,2 35,5 45,25 Q50,30 50,45" />
            <path d="M50,15 C55,2 65,5 55,25 Q50,30 50,45" />
            
            <path d="M85,50 C98,45 95,35 75,45 Q70,50 55,50" />
            <path d="M85,50 C98,55 95,65 75,55 Q70,50 55,50" />

            <path d="M50,85 C55,98 65,95 55,75 Q50,70 50,55" />
            <path d="M50,85 C45,98 35,95 45,75 Q50,70 50,55" />

            <path d="M15,50 C2,55 5,65 25,55 Q30,50 45,50" />
            <path d="M15,50 C2,45 5,35 25,45 Q30,50 45,50" />

            {/* Diagonals to fill the gaps */}
            <path d="M26,26 C15,18 22,10 35,32 Q40,38 50,50" />
            <path d="M74,74 C85,82 78,90 65,68 Q60,62 50,50" />

            <path d="M74,26 C85,18 78,10 65,32 Q60,38 50,50" />
            <path d="M26,74 C15,82 22,90 35,68 Q40,62 50,50" />
          </g>

          {/* Fluffy Crayon pollen center */}
          <circle
            cx="50"
            cy="50"
            r="16"
            fill="#E5A93B"
            stroke="#C97D54"
            strokeWidth="1.5"
            strokeDasharray="1.5 2.5"
          />
          {/* Inside smiley face to look childlike and positive */}
          <path
            d="M44,48 Q44,45 45,45 M55,48 Q55,45 56,45"
            stroke="#1C1C1C"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M45,54 Q50,58 55,54"
            stroke="#1C1C1C"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
          />
        </svg>

        {/* Small floating sparkles container */}
        <div className={`absolute top-0 right-0 w-4 h-4 text-xs font-serif text-[#D18A6A] leading-none transition-transform duration-700 ${isSpinning ? 'scale-150 animate-bounce' : 'scale-0'}`}>
          ✦
        </div>
      </div>

      {/* Childlike crayon label overlay under hover */}
      <span className="absolute -bottom-6 text-[8px] font-mono whitespace-nowrap opacity-0 group-hover:opacity-75 uppercase tracking-widest text-[#D18A6A] transition-opacity duration-300">
        {isSpinning ? 'WHEEE!' : 'TAP TO SPIN'}
      </span>
    </div>
  );
}
