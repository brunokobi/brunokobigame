import { useMemo } from 'react';

const codeSnippets = [
  '</>',
  '{ }',
  '( )',
  '[ ]',
  '&&',
  '||',
  '=>',
  '::',
  '/**/',
  '0x',
  'fn()',
  '<dev>',
  '</dev>',
  'null',
  'true',
  '01',
  '10',
  '++',
  '--',
  '===',
];

interface CodeParticle {
  id: number;
  text: string;
  x: number;
  size: number;
  delay: number;
  duration: number;
}

const CodeParticles = () => {
  const particles = useMemo<CodeParticle[]>(() => {
    return Array.from({ length: 15 }, (_, i) => ({
      id: i,
      text: codeSnippets[Math.floor(Math.random() * codeSnippets.length)],
      x: Math.random() * 100,
      size: Math.random() * 0.5 + 0.6,
      delay: Math.random() * 15,
      duration: Math.random() * 10 + 15,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute font-mono text-neon-green/20 whitespace-nowrap animate-code-float"
          style={{
            left: `${particle.x}%`,
            fontSize: `${particle.size}rem`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        >
          {particle.text}
        </div>
      ))}
    </div>
  );
};

export default CodeParticles;
