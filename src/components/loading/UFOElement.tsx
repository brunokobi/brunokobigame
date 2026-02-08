interface UFOElementProps {
  mouseOffset: { x: number; y: number };
}

const UFOElement = ({ mouseOffset }: UFOElementProps) => {
  return (
    <div
      className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      style={{
        transform: `translate(-50%, -50%) translate(${mouseOffset.x * 0.02}px, ${mouseOffset.y * 0.02}px)`,
        transition: 'transform 0.4s ease-out',
      }}
    >
      {/* UFO Body glow */}
      <div className="relative animate-float">
        {/* Outer glow ring */}
        <div
          className="absolute w-40 h-40 rounded-full opacity-20"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            background:
              'radial-gradient(circle, hsl(var(--neon-green) / 0.4) 0%, transparent 70%)',
            filter: 'blur(20px)',
          }}
        />

        {/* UFO disc shape */}
        <div
          className="relative w-24 h-8 rounded-full animate-pulse-glow"
          style={{
            background:
              'linear-gradient(180deg, hsl(220 60% 25%) 0%, hsl(var(--space-mid)) 100%)',
          }}
        >
          {/* UFO dome */}
          <div
            className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-6 rounded-t-full"
            style={{
              background:
                'linear-gradient(180deg, hsl(var(--nebula-light) / 0.3) 0%, hsl(220 60% 30% / 0.5) 100%)',
              boxShadow:
                'inset 0 -2px 10px hsl(var(--nebula-light) / 0.2)',
            }}
          />

          {/* UFO lights */}
          <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex justify-between">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-neon-green"
                style={{
                  animation: `twinkle ${1 + i * 0.2}s ease-in-out infinite`,
                  animationDelay: `${i * 0.15}s`,
                  boxShadow: '0 0 8px hsl(var(--neon-green) / 0.8)',
                }}
              />
            ))}
          </div>
        </div>

        {/* Light beam */}
        <div
          className="absolute top-8 left-1/2 -translate-x-1/2 animate-ufo-beam"
          style={{
            width: '60px',
            height: '150px',
            background:
              'linear-gradient(180deg, hsl(var(--neon-green) / 0.3) 0%, hsl(var(--neon-green) / 0.05) 100%)',
            clipPath: 'polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%)',
            filter: 'blur(8px)',
          }}
        />
      </div>
    </div>
  );
};

export default UFOElement;
