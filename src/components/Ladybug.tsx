import React, { useEffect, useRef, useState } from 'react';

interface LadybugProps {
  className?: string;
  initialRotation?: number;
  isWelcome?: boolean;
}

export default function Ladybug({ className = '', initialRotation = 0, isWelcome = false }: LadybugProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const [squished, setSquished] = useState(false);
  const [faded, setFaded] = useState(false);
  const [isFullyGone, setIsFullyGone] = useState(false);
  const squishedRef = useRef(false);

  // Real-time physics properties stored in refs for 60fps performance without re-renders
  const pos = useRef({ x: 0, y: 0 });
  const vel = useRef({ x: 0, y: 0 });
  const rotation = useRef(initialRotation);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    // Keep track of the pointer coordinates
    const handlePointerMove = (e: PointerEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerLeave = () => {
      mouseRef.current = null;
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerleave', handlePointerLeave);
    
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, []);

  useEffect(() => {
    let animationFrameId: number;

    const update = () => {
      if (squishedRef.current) {
        // No physics or posture updates when squished!
        return;
      }

      if (!ref.current) {
        animationFrameId = requestAnimationFrame(update);
        return;
      }

      const rect = ref.current.getBoundingClientRect();
      const bugX = rect.left + rect.width / 2;
      const bugY = rect.top + rect.height / 2;

      let scared = false;

      // 1. Mouse repulsion / scurry away behavior
      if (mouseRef.current) {
        const dx = bugX - mouseRef.current.x;
        const dy = bugY - mouseRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 1;

        const threshold = 180; // Distance of awareness
        if (distance < threshold) {
          scared = true;
          // Deeper proximity creates a more explosive force
          const intensity = (threshold - distance) / threshold;
          const pushForce = intensity * 3.5;

          // Increase velocity in direction opposite to the cursor
          vel.current.x += (dx / distance) * pushForce;
          vel.current.y += (dy / distance) * pushForce;

          // Add a little delightful jitter/scatter sideways so they scurry randomly
          const jitter = (Math.random() - 0.5) * 0.8;
          vel.current.x += (dy / distance) * jitter;
          vel.current.y += (-dx / distance) * jitter;
        }
      }

      // 2. Gentle natural random wander when idle
      if (!scared) {
        if (Math.random() < 0.03) {
          const wanderAngle = Math.random() * Math.PI * 2;
          const wanderForce = 0.4;
          vel.current.x += Math.cos(wanderAngle) * wanderForce;
          vel.current.y += Math.sin(wanderAngle) * wanderForce;
        }
      }

      // 3. Keep anchored to layout locality home (0,0) so they don't wander off the parent page permanently
      const distFromHomeSq = pos.current.x * pos.current.x + pos.current.y * pos.current.y;
      if (distFromHomeSq > 2500) { // More than 50px away
        const distFromHome = Math.sqrt(distFromHomeSq);
        const homePull = 0.006; // Soft organic dampener/spring pull
        vel.current.x -= (pos.current.x / distFromHome) * homePull * (distFromHome - 30);
        vel.current.y -= (pos.current.y / distFromHome) * homePull * (distFromHome - 30);
      }

      // 4. Momentum & Friction dampening
      vel.current.x *= 0.89;
      vel.current.y *= 0.89;

      // Limit absolute speeds
      const speed = Math.sqrt(vel.current.x * vel.current.x + vel.current.y * vel.current.y);
      const maxSpeed = scared ? 15 : 2.5;
      if (speed > maxSpeed) {
        vel.current.x = (vel.current.x / speed) * maxSpeed;
        vel.current.y = (vel.current.y / speed) * maxSpeed;
      }

      // Apply positions
      pos.current.x += vel.current.x;
      pos.current.y += vel.current.y;

      // 5. Hard browser bounds protection to keep ladybugs inside user viewport
      const offsetMargin = 20;
      if (rect.left < offsetMargin && vel.current.x < 0) {
        vel.current.x *= -0.5;
        pos.current.x += 4;
      }
      if (rect.right > window.innerWidth - offsetMargin && vel.current.x > 0) {
        vel.current.x *= -0.5;
        pos.current.x -= 4;
      }
      if (rect.top < offsetMargin && vel.current.y < 0) {
        vel.current.y *= -0.5;
        pos.current.y += 4;
      }
      if (rect.bottom > window.innerHeight - offsetMargin && vel.current.y > 0) {
        vel.current.y *= -0.5;
        pos.current.y -= 4;
      }

      // 6. Face rotation to movement direction
      if (speed > 0.08) {
        // Bug head points UP natively (add 90deg offset)
        const targetRot = Math.atan2(vel.current.y, vel.current.x) * (180 / Math.PI) + 90;
        
        let diff = targetRot - rotation.current;
        // Turn via the shortest direction helper
        while (diff < -180) diff += 360;
        while (diff > 180) diff -= 360;
        rotation.current += diff * 0.14; // smooth pivot
      }

      // 7. Update DOM node directly to bypass heavy react virtual DOM re-renders
      if (ref.current) {
        ref.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) rotate(${rotation.current}deg)`;

        // Control leg wiggle speeds directly via speed intensity
        const leftLegs = ref.current.querySelector('.leg-group-l');
        const rightLegs = ref.current.querySelector('.leg-group-r');
        if (leftLegs && rightLegs) {
          if (speed > 0.15) {
            leftLegs.classList.add('leg-scurry-l');
            rightLegs.classList.add('leg-scurry-r');
          } else {
            leftLegs.classList.remove('leg-scurry-l');
            rightLegs.classList.remove('leg-scurry-r');
          }
        }
      }

      animationFrameId = requestAnimationFrame(update);
    };

    animationFrameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const handleSquish = (e: React.MouseEvent) => {
    if (isWelcome) return;
    if (squishedRef.current) return;
    
    e.stopPropagation();

    setSquished(true);
    squishedRef.current = true;
    
    // Stop physics to represent frozen squished state
    vel.current = { x: 0, y: 0 };

    // After 800ms start fading out
    setTimeout(() => {
      setFaded(true);
    }, 800);

    // After 1400ms unmount completely
    setTimeout(() => {
      setIsFullyGone(true);
    }, 1400);
  };

  if (isFullyGone) {
    return null;
  }

  // Determine pointer-events and index based on page type
  // Opening page remains z-10 / pointer-events-none, whereas other pages are z-[1] / pointer-events-auto so they sit under elements but can be squished!
  const interactClasses = isWelcome 
    ? 'z-10 pointer-events-none' 
    : 'z-[1] pointer-events-auto cursor-pointer hover:scale-110 active:scale-95';

  return (
    <>
      <style>{`
        @keyframes leg-wiggle-l {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-14deg); }
        }
        @keyframes leg-wiggle-r {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(14deg); }
        }
        .leg-scurry-l {
          transform-origin: 25px 50px;
          animation: leg-wiggle-l 0.1s infinite linear;
        }
        .leg-scurry-r {
          transform-origin: 75px 50px;
          animation: leg-wiggle-r 0.1s infinite linear;
        }
      `}</style>
      
      <div
        ref={ref}
        onClick={handleSquish}
        style={{
          willChange: 'transform, opacity',
          opacity: faded ? 0 : (squished ? 0.95 : 1),
          transition: 'opacity 0.6s ease-out, scale 0.15s ease-out',
        }}
        className={`absolute w-12 h-12 select-none flex items-center justify-center ${interactClasses} ${className}`}
        title={isWelcome ? "Move your cursor near to chase me!" : "Click to squish me!"}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
        >
          {!squished ? (
            <>
              {/* NORMAL LADYBUG */}
              {/* Left Legs */}
              <g className="leg-group-l">
                <path d="M25,40 Q10,38 8,42" stroke="#1C1C1C" strokeWidth="4" strokeLinecap="round" fill="none" />
                <path d="M25,50 Q8,50 6,56" stroke="#1C1C1C" strokeWidth="4" strokeLinecap="round" fill="none" />
                <path d="M25,60 Q10,65 10,74" stroke="#1C1C1C" strokeWidth="4" strokeLinecap="round" fill="none" />
              </g>
              
              {/* Right Legs */}
              <g className="leg-group-r">
                <path d="M75,40 Q90,38 92,42" stroke="#1C1C1C" strokeWidth="4" strokeLinecap="round" fill="none" />
                <path d="M75,50 Q92,50 94,56" stroke="#1C1C1C" strokeWidth="4" strokeLinecap="round" fill="none" />
                <path d="M75,60 Q90,65 90,74" stroke="#1C1C1C" strokeWidth="4" strokeLinecap="round" fill="none" />
              </g>

              {/* Antennas */}
              <path d="M42,20 Q36,10 28,12" stroke="#1C1C1C" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M58,20 Q64,10 72,12" stroke="#1C1C1C" strokeWidth="3" strokeLinecap="round" fill="none" />

              {/* Head */}
              <circle cx="50" cy="24" r="13" fill="#1C1C1C" />
              <circle cx="44" cy="18" r="2.5" fill="#FFF" />
              <circle cx="56" cy="18" r="2.5" fill="#FFF" />

              {/* Ladybug Body Shell */}
              <circle cx="50" cy="56" r="32" fill="#D18A6A" />

              {/* Wing split line */}
              <line x1="50" y1="24" x2="50" y2="88" stroke="#1C1C1C" strokeWidth="3" strokeLinecap="round" />

              {/* Adorable black spots */}
              <circle cx="34" cy="46" r="5" fill="#1C1C1C" />
              <circle cx="32" cy="64" r="6" fill="#1C1C1C" />
              <circle cx="43" cy="74" r="4" fill="#1C1C1C" />
              
              <circle cx="66" cy="46" r="5" fill="#1C1C1C" />
              <circle cx="68" cy="64" r="6" fill="#1C1C1C" />
              <circle cx="57" cy="74" r="4" fill="#1C1C1C" />
            </>
          ) : (
            <>
              {/* ORGANIC SQUISHED LADYBUG SPLAT */}
              {/* Splat background blotcher color of organic contents */}
              <circle cx="50" cy="56" r="44" fill="#D18A6A" opacity="0.3" />
              <path d="M25,48 C15,35 12,65 25,62 C38,58 35,42 25,48 Z" fill="#D18A6A" opacity="0.25" />
              <path d="M75,48 C85,35 88,65 75,62 C62,58 65,42 75,48 Z" fill="#D18A6A" opacity="0.25" />

              {/* Crooked, flattened legs going straight out */}
              <line x1="25" y1="40" x2="6" y2="34" stroke="#1C1C1C" strokeWidth="3.5" strokeLinecap="round" />
              <line x1="25" y1="50" x2="4" y2="50" stroke="#1C1C1C" strokeWidth="3.5" strokeLinecap="round" />
              <line x1="25" y1="60" x2="8" y2="68" stroke="#1C1C1C" strokeWidth="3.5" strokeLinecap="round" />
              
              <line x1="75" y1="40" x2="94" y2="34" stroke="#1C1C1C" strokeWidth="3.5" strokeLinecap="round" />
              <line x1="75" y1="50" x2="96" y2="50" stroke="#1C1C1C" strokeWidth="3.5" strokeLinecap="round" />
              <line x1="75" y1="60" x2="92" y2="68" stroke="#1C1C1C" strokeWidth="3.5" strokeLinecap="round" />

              {/* Flattened Head */}
              <ellipse cx="50" cy="28" rx="16" ry="10" fill="#1C1C1C" />
              {/* Adorable crossed-out dead cartoon eyes (X X) */}
              <path d="M42,26 L46,30" stroke="#FFF" strokeWidth="2" strokeLinecap="round" />
              <path d="M46,26 L42,30" stroke="#FFF" strokeWidth="2" strokeLinecap="round" />
              <path d="M54,26 L58,30" stroke="#FFF" strokeWidth="2" strokeLinecap="round" />
              <path d="M58,26 L54,30" stroke="#FFF" strokeWidth="2" strokeLinecap="round" />

              {/* Squished Flattened Body Shell */}
              <ellipse cx="50" cy="58" rx="36" ry="25" fill="#D18A6A" />

              {/* Shattered wing line */}
              <path d="M50,34 L48,50 L52,66 L50,82" stroke="#1C1C1C" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.85" />

              {/* Splattered offset spots */}
              <ellipse cx="28" cy="54" rx="4" ry="3" fill="#1C1C1C" />
              <ellipse cx="32" cy="68" rx="5" ry="4" fill="#1C1C1C" />
              <ellipse cx="44" cy="73" rx="3" ry="2" fill="#1C1C1C" />
              
              <ellipse cx="72" cy="54" rx="4" ry="3" fill="#1C1C1C" />
              <ellipse cx="68" cy="68" rx="5" ry="4" fill="#1C1C1C" />
              <ellipse cx="56" cy="73" rx="3" ry="2" fill="#1C1C1C" />
            </>
          )}
        </svg>
      </div>
    </>
  );
}
