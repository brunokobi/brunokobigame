import { useMemo } from 'react';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  animationDelay: string;
  animationDuration: string;
}

interface StarFieldProps {
  count: number;
  layer: 'back' | 'mid' | 'front';
  mouseOffset: { x: number; y: number };
}

const StarField = ({ count, layer, mouseOffset }: StarFieldProps) => {
  const stars = useMemo<Star[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 200,
      size:
        layer === 'front'
          ? Math.random() * 3 + 1.5
          : layer === 'mid'
            ? Math.random() * 2 + 0.8
            : Math.random() * 1.5 + 0.3,
      opacity:
        layer === 'front'
          ? Math.random() * 0.5 + 0.5
          : layer === 'mid'
            ? Math.random() * 0.4 + 0.3
            : Math.random() * 0.3 + 0.1,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${Math.random() * 3 + 2}s`,
    }));
  }, [count, layer]);

  const parallaxMultiplier =
    layer === 'front' ? 0.05 : layer === 'mid' ? 0.02 : 0.01;
  const animationClass =
    layer === 'front'
      ? 'animate-stars-fast'
      : layer === 'mid'
        ? 'animate-stars-medium'
        : 'animate-stars-slow';

  return (
    <div
      className={`absolute inset-0 overflow-hidden ${animationClass}`}
      style={{
        transform: `translate(${mouseOffset.x * parallaxMultiplier}px, ${mouseOffset.y * parallaxMultiplier}px)`,
        transition: 'transform 0.3s ease-out',
      }}
    >
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-star-white animate-twinkle"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animationDelay: star.animationDelay,
            animationDuration: star.animationDuration,
            boxShadow:
              layer === 'front'
                ? `0 0 ${star.size * 2}px hsl(var(--star-white) / 0.5)`
                : 'none',
          }}
        />
      ))}
    </div>
  );
};

export default StarField;
