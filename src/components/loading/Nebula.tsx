interface NebulaProps {
  mouseOffset: { x: number; y: number };
}

const Nebula = ({ mouseOffset }: NebulaProps) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Main nebula - center */}
      <div 
        className="absolute w-[800px] h-[600px] rounded-full animate-nebula-drift opacity-40"
        style={{
          left: '50%',
          top: '40%',
          transform: `translate(-50%, -50%) translate(${mouseOffset.x * 0.03}px, ${mouseOffset.y * 0.03}px)`,
          background: 'radial-gradient(ellipse at center, hsl(210 80% 50% / 0.4) 0%, hsl(220 70% 40% / 0.2) 40%, transparent 70%)',
          filter: 'blur(60px)',
          transition: 'transform 0.5s ease-out',
        }}
      />
      
      {/* Secondary nebula - top right */}
      <div 
        className="absolute w-[500px] h-[400px] rounded-full opacity-30"
        style={{
          right: '-10%',
          top: '-5%',
          transform: `translate(${mouseOffset.x * 0.02}px, ${mouseOffset.y * 0.02}px)`,
          background: 'radial-gradient(ellipse at center, hsl(200 90% 60% / 0.3) 0%, hsl(210 80% 50% / 0.15) 50%, transparent 70%)',
          filter: 'blur(50px)',
          animation: 'nebula-drift 25s ease-in-out infinite reverse',
          transition: 'transform 0.5s ease-out',
        }}
      />
      
      {/* Tertiary nebula - bottom left */}
      <div 
        className="absolute w-[600px] h-[500px] rounded-full opacity-25"
        style={{
          left: '-15%',
          bottom: '-10%',
          transform: `translate(${mouseOffset.x * 0.025}px, ${mouseOffset.y * 0.025}px)`,
          background: 'radial-gradient(ellipse at center, hsl(140 60% 40% / 0.2) 0%, hsl(180 50% 35% / 0.1) 50%, transparent 70%)',
          filter: 'blur(70px)',
          animation: 'nebula-drift 30s ease-in-out infinite',
          transition: 'transform 0.5s ease-out',
        }}
      />

      {/* Small accent nebula */}
      <div 
        className="absolute w-[300px] h-[300px] rounded-full opacity-20"
        style={{
          right: '20%',
          bottom: '30%',
          transform: `translate(${mouseOffset.x * 0.04}px, ${mouseOffset.y * 0.04}px)`,
          background: 'radial-gradient(circle, hsl(140 100% 50% / 0.15) 0%, transparent 60%)',
          filter: 'blur(40px)',
          animation: 'nebula-drift 18s ease-in-out infinite',
          transition: 'transform 0.5s ease-out',
        }}
      />
    </div>
  );
};

export default Nebula;
