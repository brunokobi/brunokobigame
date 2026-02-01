import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { X, Github, Linkedin, Mail, ExternalLink } from 'lucide-react';

const AboutModal = () => {
  const { closeModal } = useGameStore();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="glass-card p-8 max-w-lg w-full mx-4"
    >
      <button 
        onClick={closeModal}
        className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
      >
        <X size={24} />
      </button>

      <div className="text-center mb-6">
        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-4xl">
          👽
        </div>
        <h2 className="text-2xl font-bold neon-text">The Fullstack Invader</h2>
        <p className="text-muted-foreground">Desenvolvedor Full Stack</p>
      </div>

      <p className="text-foreground/80 mb-6 text-center leading-relaxed">
        Olá, humano! 🛸 Sou um desenvolvedor apaixonado por criar experiências 
        digitais incríveis. Com anos de experiência em React, Node.js e tecnologias 
        cloud, estou sempre em busca de novos desafios para "abduzir" e transformar 
        em soluções inovadoras.
      </p>

      <div className="flex justify-center gap-4">
        <a 
          href="https://github.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="ufo-button flex items-center gap-2"
        >
          <Github size={20} />
          GitHub
        </a>
        <a 
          href="https://linkedin.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="ufo-button flex items-center gap-2"
        >
          <Linkedin size={20} />
          LinkedIn
        </a>
      </div>
    </motion.div>
  );
};

const ProjectModal = () => {
  const { closeModal, currentProject } = useGameStore();

  const projects = {
    ecommerce: {
      title: 'E-commerce Platform',
      description: 'Uma plataforma completa de e-commerce com carrinho, pagamentos e painel admin.',
      techs: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'AWS'],
      color: '#ff6b6b',
    },
    saas: {
      title: 'SaaS Dashboard',
      description: 'Dashboard analytics para empresas com gráficos em tempo real e relatórios.',
      techs: ['Next.js', 'TypeScript', 'GraphQL', 'MongoDB', 'Docker'],
      color: '#4ecdc4',
    },
    mobile: {
      title: 'Mobile App',
      description: 'Aplicativo mobile multiplataforma para gestão de tarefas e produtividade.',
      techs: ['React Native', 'Expo', 'Firebase', 'Redux', 'Jest'],
      color: '#ffe66d',
    },
  };

  const project = currentProject ? projects[currentProject] : null;

  if (!project) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="glass-card p-8 max-w-lg w-full mx-4"
    >
      <button 
        onClick={closeModal}
        className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
      >
        <X size={24} />
      </button>

      <div 
        className="w-16 h-16 rounded-xl mb-4 flex items-center justify-center text-2xl"
        style={{ backgroundColor: project.color + '30', border: `2px solid ${project.color}` }}
      >
        🚀
      </div>

      <h2 className="text-2xl font-bold mb-2" style={{ color: project.color }}>
        {project.title}
      </h2>
      
      <p className="text-foreground/80 mb-6 leading-relaxed">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {project.techs.map((tech) => (
          <span key={tech} className="skill-tag">
            {tech}
          </span>
        ))}
      </div>

      <div className="flex gap-4">
        <button className="ufo-button flex items-center gap-2">
          <Github size={20} />
          Código
        </button>
        <button className="ufo-button flex items-center gap-2">
          <ExternalLink size={20} />
          Demo
        </button>
      </div>
    </motion.div>
  );
};

const ContactModal = () => {
  const { closeModal } = useGameStore();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="glass-card p-8 max-w-lg w-full mx-4"
    >
      <button 
        onClick={closeModal}
        className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
      >
        <X size={24} />
      </button>

      <div className="text-center mb-6">
        <div className="text-4xl mb-2">📡</div>
        <h2 className="text-2xl font-bold neon-text">Transmita uma Mensagem</h2>
        <p className="text-muted-foreground">Entre em contato com a nave-mãe</p>
      </div>

      <form className="space-y-4">
        <div>
          <label className="block text-sm text-muted-foreground mb-2">Nome</label>
          <input 
            type="text"
            className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
            placeholder="Seu nome terrestre"
          />
        </div>
        
        <div>
          <label className="block text-sm text-muted-foreground mb-2">Email</label>
          <input 
            type="email"
            className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
            placeholder="seu@email.com"
          />
        </div>
        
        <div>
          <label className="block text-sm text-muted-foreground mb-2">Mensagem</label>
          <textarea 
            rows={4}
            className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors resize-none"
            placeholder="Sua mensagem intergaláctica..."
          />
        </div>

        <button type="submit" className="ufo-button w-full flex items-center justify-center gap-2">
          <Mail size={20} />
          Enviar Transmissão
        </button>
      </form>
    </motion.div>
  );
};

export const Modals = () => {
  const { currentSection, currentProject } = useGameStore();

  return (
    <AnimatePresence>
      {currentSection && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/60 backdrop-blur-sm"
        >
          {currentSection === 'about' && <AboutModal />}
          {currentSection === 'projects' && currentProject && <ProjectModal />}
          {currentSection === 'contact' && <ContactModal />}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
