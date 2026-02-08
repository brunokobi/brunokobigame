import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import StarField from './StarField';
import Nebula from './Nebula';
import CodeParticles from './CodeParticles';
import UFOElement from './UFOElement';
import GridOverlay from './GridOverlay';
import LoadingProgress from './LoadingProgress';

const LOADING_DURATION = 5000;

const LoadingScreen = () => {
  const navigate = useNavigate();

  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    setMouseOffset({
      x: ((e.clientX - centerX) / centerX) * 50,
      y: ((e.clientY - centerY) / centerY) * 50,
    });
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  useEffect(() => {
    const startTime = Date.now();

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / LOADING_DURATION) * 100, 100);
      setProgress(newProgress);

      if (newProgress < 100) {
        requestAnimationFrame(updateProgress);
      } else {
        setIsComplete(true);
        setTimeout(() => {
          setIsFadingOut(true);
          setTimeout(() => {
            navigate('/game');
          }, 1000);
        }, 500);
      }
    };

    requestAnimationFrame(updateProgress);
  }, [navigate]);

  return (
    <div
      className={`fixed inset-0 overflow-hidden transition-opacity duration-1000 ${
        isFadingOut ? 'opacity-0' : 'opacity-100'
      }`}
      style={{
        background: `linear-gradient(180deg, hsl(var(--space-deep)) 0%, hsl(var(--space-mid)) 50%, hsl(var(--space-light)) 100%)`,
      }}
    >
      {/* Scanline overlay */}
      <div className="absolute inset-0 scanline pointer-events-none" />

      {/* Parallax star layers */}
      <StarField count={200} layer="back" mouseOffset={mouseOffset} />
      <StarField count={100} layer="mid" mouseOffset={mouseOffset} />
      <StarField count={50} layer="front" mouseOffset={mouseOffset} />

      {/* Nebula clouds */}
      <Nebula mouseOffset={mouseOffset} />

      {/* Grid overlay */}
      <GridOverlay />

      {/* Floating code particles */}
      <CodeParticles />

      {/* UFO element */}
      <UFOElement mouseOffset={mouseOffset} />

      {/* Centered loading progress */}
      <div className="absolute inset-0 flex items-center justify-center">
        <LoadingProgress progress={progress} isComplete={isComplete} />
      </div>
    </div>
  );
};

export default LoadingScreen;
