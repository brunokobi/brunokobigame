import { useState, useRef, useCallback } from 'react';
import { useGameStore } from '@/store/gameStore';
import { motion, useMotionValue } from 'framer-motion';

export const useMobileControls = () => {
  return {};
};

// Global state for joystick that UFO can read
export let mobileJoystickState = { x: 0, y: 0 };

export const MobileControls = () => {
  const isAbducting = useGameStore(state => state.isAbducting);
  const setAbducting = useGameStore(state => state.setAbducting);

  const joystickRef = useRef<HTMLDivElement>(null);
  const [isJoystickActive, setIsJoystickActive] = useState(false);

  // useMotionValue não causa re-renders ao atualizar — framer-motion aplica direto no DOM
  const THUMB_OFFSET = -24; // metade de w-12 (48px)
  const thumbX = useMotionValue(THUMB_OFFSET);
  const thumbY = useMotionValue(THUMB_OFFSET);

  const handleJoystickStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    setIsJoystickActive(true);
  }, []);

  const handleJoystickMove = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (!joystickRef.current) return;

    const rect = joystickRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let clientX: number, clientY: number;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      if (!(e as React.MouseEvent).buttons) return; // ignorar mouse move sem botão
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    const maxDistance = rect.width / 2 - 20;
    let deltaX = clientX - centerX;
    let deltaY = clientY - centerY;

    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    if (distance > maxDistance) {
      deltaX = (deltaX / distance) * maxDistance;
      deltaY = (deltaY / distance) * maxDistance;
    }

    // Atualiza posição visual SEM re-render (framer-motion direto no DOM)
    thumbX.set(deltaX + THUMB_OFFSET);
    thumbY.set(deltaY + THUMB_OFFSET);

    // Normaliza para -1 a 1
    mobileJoystickState = {
      x: deltaX / maxDistance,
      y: deltaY / maxDistance,
    };
  }, [thumbX, thumbY]);

  const handleJoystickEnd = useCallback(() => {
    setIsJoystickActive(false);
    thumbX.set(THUMB_OFFSET);
    thumbY.set(THUMB_OFFSET);
    mobileJoystickState = { x: 0, y: 0 };
  }, [thumbX, thumbY]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none p-6 flex justify-between items-end md:hidden">
      {/* Virtual Joystick */}
      <div
        ref={joystickRef}
        className="relative w-32 h-32 rounded-full bg-black/30 backdrop-blur-sm border-2 border-primary/50 pointer-events-auto touch-none"
        onTouchStart={handleJoystickStart}
        onTouchMove={handleJoystickMove}
        onTouchEnd={handleJoystickEnd}
        onMouseDown={handleJoystickStart}
        onMouseMove={handleJoystickMove}
        onMouseUp={handleJoystickEnd}
        onMouseLeave={handleJoystickEnd}
      >
        {/* Joystick base lines */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-0.5 bg-primary/20" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-full w-0.5 bg-primary/20" />
        </div>

        {/* Joystick thumb — posição via useMotionValue, sem re-renders */}
        <motion.div
          className="absolute w-12 h-12 rounded-full bg-primary/80 border-2 border-primary shadow-lg shadow-primary/50"
          style={{
            left: '50%',
            top: '50%',
            x: thumbX,
            y: thumbY,
          }}
          animate={{ scale: isJoystickActive ? 1.1 : 1 }}
        />
      </div>

      {/* Abduction Button */}
      <motion.button
        className={`w-24 h-24 rounded-full pointer-events-auto touch-none flex items-center justify-center text-4xl
          ${isAbducting
            ? 'bg-primary/80 shadow-lg shadow-primary/80 border-4 border-primary'
            : 'bg-black/30 backdrop-blur-sm border-2 border-primary/50'
          }`}
        onTouchStart={(e) => { e.preventDefault(); setAbducting(true); }}
        onTouchEnd={(e) => { e.preventDefault(); setAbducting(false); }}
        onMouseDown={() => setAbducting(true)}
        onMouseUp={() => setAbducting(false)}
        onMouseLeave={() => setAbducting(false)}
        whileTap={{ scale: 0.95 }}
      >
        <motion.span
          animate={{
            scale: isAbducting ? [1, 1.2, 1] : 1,
            rotate: isAbducting ? [0, 10, -10, 0] : 0,
          }}
          transition={{ repeat: isAbducting ? Infinity : 0, duration: 0.5 }}
        >
          👽
        </motion.span>
      </motion.button>
    </div>
  );
};
