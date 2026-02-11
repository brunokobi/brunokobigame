import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { X, Github, Linkedin, Mail, ExternalLink } from 'lucide-react';

/* =========================================
   MODAL: SOBRE MIM (Mantido igual)
   ========================================= */
const AboutModal = () => {
  const { closeModal } = useGameStore();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="glass-card p-8 max-w-lg w-full mx-4 relative bg-slate-900/95 border border-cyan-500/30 rounded-xl shadow-2xl shadow-cyan-500/10"
    >
      <button 
        onClick={closeModal}
        className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
      >
        <X size={24} />
      </button>

      <div className="text-center mb-6">
        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-4xl shadow-lg ring-2 ring-cyan-500/50">
          👽
        </div>
        <h2 className="text-2xl font-bold text-cyan-400 font-space tracking-wider">Bruno Kobi</h2>
        <p className="text-slate-400 text-sm uppercase tracking-widest mt-1">Desenvolvedor Full Stack</p>
      </div>

      <p className="text-slate-300 mb-6 text-center leading-relaxed">
        Olá, humano! 🛸 Sou um desenvolvedor apaixonado por criar experiências 
        digitais incríveis. Com anos de experiência em React, Node.js e tecnologias 
        cloud, estou sempre em busca de novos desafios para "abduzir" e transformar 
        em soluções inovadoras.
      </p>

      <div className="flex justify-center gap-4">
        <a 
          href="https://github.com/brunokobi" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-white transition-colors border border-slate-600"
        >
          <Github size={20} />
          GitHub
        </a>
        <a 
          href="https://www.linkedin.com/in/brunokobi/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded-lg text-white transition-colors"
        >
          <Linkedin size={20} />
          LinkedIn
        </a>
      </div>
    </motion.div>
  );
};

/* =========================================
   MODAL: PROJETOS (Atualizado: 'projetos' e 'mapas')
   ========================================= */
const ProjectModal = () => {
  const { closeModal, currentProject } = useGameStore();

  const projects = {
    // 1. Antes era 'mobile', agora é 'projetos'
    projetos: { 
      title: 'Meus Projetos',
      description: 'Uma coleção de aplicativos mobile e web desenvolvidos com foco em performance e experiência do usuário.',
      techs: ['React', 'React Native', 'Expo', 'TypeScript', 'Tailwind'],
      color: '#ffe66d', // Amarelo
      icon: '🚀'
    },
    // 2. Antes era 'saas', agora é 'mapas'
    mapas: { 
      title: 'Sistema de Mapas',
      description: 'Dashboard de geolocalização e analytics em tempo real para monitoramento de frotas e territórios.',
      techs: ['Next.js', 'Leaflet / Mapbox', 'PHP', 'MongoDB', 'Docker'],
      color: '#4ecdc4', // Verde Água
      icon: '🌍'
    },
    // Extra (opcional)
    ecommerce: {
      title: 'E-commerce Platform',
      description: 'Plataforma completa de vendas online com gestão de estoque e pagamentos integrados.',
      techs: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'AWS'],
      color: '#ff6b6b', // Vermelho
      icon: '🛒'
    },
  };

  // @ts-ignore
  const project = currentProject ? projects[currentProject] : null;

  if (!project) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="glass-card p-8 max-w-lg w-full mx-4 relative bg-slate-900/95 border border-slate-700 rounded-xl shadow-2xl"
      style={{ borderColor: project.color }}
    >
      <button 
        onClick={closeModal}
        className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
      >
        <X size={24} />
      </button>

      <div 
        className="w-16 h-16 rounded-xl mb-4 flex items-center justify-center text-3xl shadow-lg mx-auto"
        style={{ backgroundColor: project.color + '20', border: `1px solid ${project.color}`, color: project.color }}
      >
        {project.icon}
      </div>

      <h2 className="text-2xl font-bold mb-2 font-space text-center" style={{ color: project.color }}>
        {project.title}
      </h2>
      
      <p className="text-slate-300 mb-6 leading-relaxed text-center">
        {project.description}
      </p>

      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {project.techs.map((tech) => (
          <span 
            key={tech} 
            className="px-3 py-1 text-xs font-bold rounded-full bg-slate-800 text-slate-300 border border-slate-700"
          >
            {tech}
          </span>
        ))}
      </div>

      <div className="flex gap-4">
        <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-600 font-medium">
          <Github size={18} />
          Ver Código
        </button>
        <button 
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-slate-900 font-bold rounded-lg transition-colors hover:opacity-90"
            style={{ backgroundColor: project.color }}
        >
          <ExternalLink size={18} />
          Demo Online
        </button>
      </div>
    </motion.div>
  );
};

/* =========================================
   MODAL: CONTATO (Mantido igual)
   ========================================= */
const ContactModal = () => {
  const { closeModal } = useGameStore();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="glass-card p-8 max-w-lg w-full mx-4 relative bg-slate-900/95 border border-yellow-500/30 rounded-xl shadow-2xl shadow-yellow-500/10"
    >
      <button 
        onClick={closeModal}
        className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
      >
        <X size={24} />
      </button>

      <div className="text-center mb-6">
        <div className="text-5xl mb-4 animate-pulse">📡</div>
        <h2 className="text-2xl font-bold text-yellow-400 font-space tracking-wider">Transmita uma Mensagem</h2>
        <p className="text-slate-400 mt-1">Entre em contato com a nave-mãe</p>
      </div>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Nome</label>
          <input 
            type="text"
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:border-yellow-400 focus:outline-none text-white transition-colors placeholder:text-slate-600"
            placeholder="Seu nome terrestre"
          />
        </div>
        
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Email</label>
          <input 
            type="email"
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:border-yellow-400 focus:outline-none text-white transition-colors placeholder:text-slate-600"
            placeholder="seu@email.com"
          />
        </div>
        
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Mensagem</label>
          <textarea 
            rows={4}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:border-yellow-400 focus:outline-none text-white transition-colors resize-none placeholder:text-slate-600"
            placeholder="Sua mensagem intergaláctica..."
          />
        </div>

        <button type="submit" className="w-full py-4 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold rounded-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]">
          <Mail size={20} />
          Enviar Transmissão
        </button>
      </form>
    </motion.div>
  );
};

/* =========================================
   COMPONENTE PRINCIPAL (Gerenciador)
   ========================================= */
export const Modals = () => {
  const { currentSection, currentProject } = useGameStore();

  // --- EFEITO SONORO AO ABRIR MODAL ---
  useEffect(() => {
    if (currentSection) {
      const audio = new Audio('/sounds/plim.wav');
      audio.volume = 0.5; // Ajuste o volume conforme necessário
      audio.play().catch((error) => console.error("Erro ao tocar som:", error));
    }
  }, [currentSection]);

  return (
    <AnimatePresence>
      {currentSection && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        >
          {currentSection === 'about' && <AboutModal />}
          {currentSection === 'projects' && currentProject && <ProjectModal />}
          {currentSection === 'contact' && <ContactModal />}
        </motion.div>
      )}
    </AnimatePresence>
  );
};