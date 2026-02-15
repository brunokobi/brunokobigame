import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { X, Github, Linkedin, Mail, ExternalLink, Search, Trash2, MapPin, Globe } from 'lucide-react';

/* =========================================
   DADOS DOS MARCOS (LANDMARKS)
   ========================================= */
const LANDMARKS = [
  {
    title: "Torre Eiffel",
    lat: 48.8584, lng: 2.2945,
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg/800px-Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg",
    desc: "A Torre Eiffel é uma torre treliça de ferro do século XIX localizada no Champ de Mars, em Paris."
  },
  {
    title: "Estatua da Liberdade",
    lat: 40.6892, lng: -74.0445,
    img: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.pGtOXR35MxtSXfUw1TUgcAHaFj%26pid%3DApi&f=1",
    desc: "A Estátua da Liberdade é um grande monumento neoclássico localizado na ilha da Liberdade, Nova York."
  },
  {
    title: "Taj Mahal",
    lat: 27.1751, lng: 78.0421,
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Taj_Mahal_%28Edited%29.jpeg/800px-Taj_Mahal_%28Edited%29.jpeg",
    desc: "O Taj Mahal é um mausoléu de mármore branco localizado na cidade indiana de Agra."
  },
  {
    title: "Coliseu de Roma",
    lat: 41.8902, lng: 12.4922,
    img: "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2F1.bp.blogspot.com%2F-2UOdNE7_4Yo%2FUQvWIm7inyI%2FAAAAAAAAZEU%2FlLRwdD60b3I%2Fs1600%2FColiseo%2Bde%2BRoma.jpg&f=1",
    desc: "O Coliseu é um anfiteatro oval localizado no centro da cidade de Roma."
  },
  {
    title: "Pirâmides do Egito",
    lat: 29.9792, lng: 31.1342,
    img: "https://static.todamateria.com.br/upload/pi/ra/piramidesdoegito-cke.jpg",
    desc: "As pirâmides do Egito são estruturas monumentais construídas durante o Antigo Império."
  },
  {
    title: "Monte Fuji",
    lat: 35.3606, lng: 138.7278,
    img: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.pinimg.com%2Foriginals%2F23%2F36%2Fe2%2F2336e29eea04332945235eb55b57b2ff.jpg&f=1",
    desc: "O Monte Fuji é um vulcão ativo e o ponto mais alto do Japão."
  },
  {
    title: "Buda Ibiraçu",
    lat: -19.86565, lng: -40.38246,
    img: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic.meionorte.com%2Fuploads%2Fimagens%2F2021%2F8%2F29%2Festatua-de-buda-inaugurada-no-brasil-e-a-segunda-maior-do-mundo-491b34ed-1ac9-4e07-a3e8-4bfc4181d0d2.jpg&f=1",
    desc: "O Buda de Ibiraçu é a segunda maior estátua de Buda no Ocidente, localizada no Espírito Santo, Brasil."
  },
  {
    title: "Cristo Redentor",
    lat: -22.9519, lng: -43.2105,
    img: "https://rederiohoteis.com/wp-content/uploads/2017/09/2017-10-29-cristo-redentor-conheca-a-historia-dessa-maravilha-do-mundo-moderno2.jpg.webp",
    desc: "O Cristo Redentor é uma estátua art déco de Jesus Cristo no Rio de Janeiro, Brasil."
  },
  {
    title: "Monte Everest",
    lat: 27.9881, lng: 86.9250,
    img: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.factinate.com%2Fwp-content%2Fuploads%2F2018%2F01%2F17-37.jpg&f=1",
    desc: "O Monte Everest é a montanha mais alta do mundo acima do nível do mar."
  },
  {
    title: "Machu Picchu",
    lat: -13.1631, lng: -72.5450,
    img: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.Xafpds6a0ICK6THxncjFUAHaE8%26pid%3DApi&f=1",
    desc: "Machu Picchu é uma cidade inca construída no século XV no topo de uma montanha no Peru."
  },
  {
    title: "Pirâmide Azteca",
    lat: 19.6926, lng: -98.8456,
    img: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fvoyance-du-destin.fr%2Fwp-content%2Fuploads%2F2020%2F02%2F8-3.jpg&f=1",
    desc: "Teotihuacán foi um centro urbano da Mesoamérica pré-colombiana."
  },
  {
    title: "Convento da Penha",
    lat: -20.329444, lng: -40.287222,
    img: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.WRrcSaaxSQ5dYFt3sKQJIQHaE6%26pid%3DApi&f=1",
    desc: "O Convento da Penha é um convento católico localizado em Vila Velha, ES."
  }
];

const ALL_PROJECTS = [
  {
    id: 'presence',
    title: 'Presence Now',
    description: 'Reconhecimento facial escolar em tempo real.',
    techs: ['React', 'FaceAPI', 'TensorFlow'],
    color: '#4ecdc4',
    icon: '📸',
    code: "https://github.com/brunokobi/tccreconhecimento",
    demo: "https://presencenowreconhecimento.netlify.app/"
  },
  {
    id: 'mapas',
    title: 'Sistema de Mapas',
    description: 'Dashboard de geolocalização.',
    techs: ['React', 'Maps', 'Dashboard'],
    color: '#42c920',
    icon: '🌍',
    code: "",
    demo: ""
  },
  {
    id: 'portfolio',
    title: 'Portfólio Multilíngue',
    description: 'Site com suporte a i18n e múltiplos idiomas.',
    techs: ['React', 'JS', 'i18n'],
    color: '#ffe66d',
    icon: '🌐',
    code: "https://github.com/brunokobi/projeto-portifolio",
    demo: "https://brunokobi.netlify.app"
  },
  {
    id: 'guia',
    title: 'Guia Alimentar BR',
    description: 'App Android publicado na PlayStore sobre nutrição.',
    techs: ['React Native', 'Expo'],
    color: '#95d5b2',
    icon: '🥑',
    code: "https://play.google.com/store/apps/details?id=com.guiaalimentar.guiaalimentarbr",
    demo: "https://www.youtube.com/embed/8VxPXpS-qHg"
  },
  {
    id: 'etica',
    title: 'Quiz da Ética',
    description: 'App Android nativo estilo "Show do Milhão".',
    techs: ['Java', 'Android'],
    color: '#ff6b6b',
    icon: '⚖️',
    code: "https://github.com/brunokobi/QuizdaEtica",
    demo: "https://www.youtube.com/watch?v=euJuoEGtpnU"
  },
  {
    id: 'mestrado',
    title: 'Mestrado em IA',
    description: 'Algoritmos de busca e Machine Learning (IFES).',
    techs: ['Python', 'IA'],
    color: '#a29bfe',
    icon: '🎓',
    code: "https://github.com/brunokobi",
    demo: "https://humane-neon-20a.notion.site/Mestrado-Computa-o-Aplicada-IFES-64a075f439f740c4be96345c615f97c9"
  }
];

/* =========================================
   COMPONENTE DO MAPA
   ========================================= */
const MapInterface = ({ closeModal }: { closeModal: () => void }) => {
  const [latitudei, setLatitudei] = useState("");
  const [longitudei, setLongitudei] = useState("");
  
  const [mapState, setMapState] = useState({
    lat: "",
    lng: "",
    nome: "",
    desc: ""
  });

  const falar = (texto: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(texto);
      utterance.lang = 'pt-BR';
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMapState({
      lat: latitudei,
      lng: longitudei,
      nome: "Local Personalizado",
      desc: `Coordenadas: ${latitudei}, ${longitudei}`
    });
    falar("Localizando");
  };

  const handleClear = () => {
    setLatitudei("");
    setLongitudei("");
    setMapState({ lat: "", lng: "", nome: "", desc: "" });
    falar("Limpando campos");
  };

  const handleLandmarkClick = (item: any) => {
    setLatitudei(String(item.lat));
    setLongitudei(String(item.lng));
    setMapState({
      lat: String(item.lat),
      lng: String(item.lng),
      nome: item.title,
      desc: item.desc
    });
    falar(item.desc);
  };

  // --- LÓGICA DO IFRAME CORRIGIDA ---
  // Se TEM coordenadas: Mostra o local com zoom 19 (satélite próximo)
  // Se NÃO TEM coordenadas: Mostra o mapa mundi (zoom 2, satélite) ao invés de erro 404
  const mapUrl = mapState.lat && mapState.lng
    ? `https://maps.google.com/maps?q=${mapState.lat},${mapState.lng}&t=k&z=19&ie=UTF8&iwloc=&output=embed`
    : `https://maps.google.com/maps?q=0,0&t=k&z=2&ie=UTF8&iwloc=&output=embed`; 

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="glass-card w-full max-w-6xl mx-auto h-[90vh] bg-slate-900/95 border border-[#42c920] rounded-xl shadow-[0_0_30px_rgba(66,201,32,0.2)] flex flex-col overflow-hidden relative"
    >
      <button
        onClick={closeModal}
        className="absolute top-4 right-4 text-slate-400 hover:text-white z-50 bg-black/50 p-2 rounded-full"
      >
        <X size={24} />
      </button>

      <div className="p-4 border-b border-[#42c920]/30 bg-black/20 text-center shrink-0">
        <h2 className="text-2xl font-bold text-[#42c920] font-space flex items-center justify-center gap-2">
           <MapPin /> Mapa Global (Satélite)
        </h2>
      </div>

      <div className="flex flex-col md:flex-row h-full overflow-hidden">
        
        {/* Lado Esquerdo: Controles */}
        <div className="w-full md:w-1/3 p-4 overflow-y-auto custom-scrollbar border-b md:border-b-0 md:border-r border-[#42c920]/30 flex flex-col gap-6">
          
          {/* Formulário */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 bg-slate-800/50 p-4 rounded-lg border border-[#42c920]/50">
            <h3 className="text-[#42c920] font-bold text-sm uppercase tracking-wider mb-1">Inserir Coordenadas</h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Latitude"
                value={latitudei}
                onChange={(e) => setLatitudei(e.target.value)}
                className="w-full bg-slate-900 border border-[#42c920] text-[#42c920] placeholder-green-800 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#42c920]"
              />
              <input
                type="text"
                placeholder="Longitude"
                value={longitudei}
                onChange={(e) => setLongitudei(e.target.value)}
                className="w-full bg-slate-900 border border-[#42c920] text-[#42c920] placeholder-green-800 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#42c920]"
              />
            </div>
            <div className="flex gap-2 mt-2">
              <button
                type="submit"
                className="flex-1 bg-[#42c920] hover:bg-[#389d18] text-black font-bold py-2 rounded flex items-center justify-center gap-2 transition-colors"
                onMouseEnter={() => falar("Localizar")}
              >
                <Search size={18} /> Localizar
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="bg-red-600 hover:bg-red-700 text-white p-2 rounded transition-colors"
                onMouseEnter={() => falar("Limpar")}
                title="Limpar"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </form>

          {/* Grid de Pontos Turísticos */}
          <div>
            <h3 className="text-[#42c920] font-bold text-sm uppercase tracking-wider mb-3 text-center">Pontos Turísticos</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 gap-3 justify-items-center">
              {LANDMARKS.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleLandmarkClick(item)}
                  className="group relative flex flex-col items-center"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.1)";
                    falar(item.title);
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                  style={{ transition: 'transform 0.2s' }}
                >
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-slate-600 group-hover:border-[#42c920] transition-all shadow-lg ring-2 ring-transparent group-hover:ring-[#42c920]/50">
                    <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 text-center leading-tight group-hover:text-[#42c920]">{item.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Lado Direito: Mapa (SUBSTITUÍDO POR IFRAME) */}
        <div className="w-full md:w-2/3 h-full relative z-0 bg-slate-800 flex flex-col">
            <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight={0}
                marginWidth={0}
                src={mapUrl}
                title="Mapa"
            ></iframe>
            
            {/* Overlay com informações do local */}
            {mapState.nome && (
                <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur text-white p-4 rounded-lg border border-[#42c920]">
                    <h3 className="font-bold text-[#42c920]">{mapState.nome}</h3>
                    <p className="text-sm text-slate-300">{mapState.desc}</p>
                </div>
            )}
        </div>

      </div>
    </motion.div>
  );
};

/* =========================================
   MODAIS PADRÃO (Mantidos iguais)
   ========================================= */

const AboutModal = () => {
  const { closeModal } = useGameStore();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="glass-card p-6 md:p-8 max-w-lg w-full mx-4 relative bg-slate-900/95 border border-cyan-500/30 rounded-xl shadow-2xl shadow-cyan-500/10"
    >
      <button onClick={closeModal} className="absolute top-4 right-4 text-slate-400 hover:text-white z-50">
        <X size={24} />
      </button>
      <div className="text-center mb-6">
        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-4xl shadow-lg ring-2 ring-cyan-500/50">
          👽
        </div>
        <h2 className="text-2xl font-bold text-cyan-400 font-space tracking-wider">Bruno Kobi</h2>
        <p className="text-slate-400 text-sm uppercase tracking-widest mt-1">Mestrando em IA & Full Stack</p>
      </div>
      <p className="text-slate-300 mb-6 text-center leading-relaxed">
        Olá, humano! 🛸 Sou Mestrando em Computação Aplicada (IA) e Desenvolvedor.
        Transformo café em código e algoritmos em soluções.
      </p>
      <div className="flex justify-center gap-4">
        <a href="https://github.com/brunokobi" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-white transition-colors border border-slate-600">
          <Github size={20} /> GitHub
        </a>
        <a href="https://www.linkedin.com/in/brunokobi/" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded-lg text-white transition-colors">
          <Linkedin size={20} /> LinkedIn
        </a>
          <a
          href="https://brunokobi.netlify.app/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 rounded-lg text-white transition-all shadow-lg hover:shadow-cyan-500/25 border border-white/10"
        >
          <Globe size={20} /> Portfólio
        </a>

      </div>
    </motion.div>
  );
};

const ProjectListModal = () => {
  const { closeModal, setProject } = useGameStore();

  const handleCardClick = (id: string) => {
    if (id === 'mapas') {
      useGameStore.setState({ currentProject: 'mapas' });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="glass-card p-6 w-full max-w-4xl mx-4 relative bg-slate-900/95 border border-slate-700 rounded-xl shadow-2xl max-h-[85vh] flex flex-col"
    >
      <div className="flex justify-between items-center mb-6 shrink-0">
        <h2 className="text-2xl font-bold text-white font-space flex items-center gap-2">
          <span className="text-yellow-400">🚀</span> Meus Projetos
        </h2>
        <button onClick={closeModal} className="text-slate-400 hover:text-white p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors">
          <X size={24} />
        </button>
      </div>
      <div className="overflow-y-auto pr-2 custom-scrollbar grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
        {ALL_PROJECTS.map((project) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 hover:border-slate-500 transition-all hover:bg-slate-800 group relative"
            style={{ borderLeft: `4px solid ${project.color}` }}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-slate-200 group-hover:text-white transition-colors">{project.title}</h3>
              <span className="text-2xl">{project.icon}</span>
            </div>
            <p className="text-sm text-slate-400 mb-3 line-clamp-2">{project.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {project.techs.map(tech => (
                <span key={tech} className="text-[10px] uppercase font-bold px-2 py-1 bg-slate-900 rounded text-slate-500 border border-slate-800">
                  {tech}
                </span>
              ))}
            </div>
            <div className="flex gap-2 mt-auto">
               {project.id !== 'mapas' ? (
                 <>
                    {project.demo && (
                      <a href={project.demo} target="_blank" rel="noreferrer"
                        className="flex-1 text-center py-2 text-xs font-bold bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors flex items-center justify-center gap-1">
                        <ExternalLink size={12} /> Demo
                      </a>
                    )}
                    {project.code && (
                      <a href={project.code} target="_blank" rel="noreferrer"
                        className="flex-1 text-center py-2 text-xs font-bold border border-slate-600 hover:bg-slate-700 text-slate-300 rounded transition-colors flex items-center justify-center gap-1">
                        <Github size={12} /> Code
                      </a>
                    )}
                 </>
               ) : (
                 <button
                   onClick={() => handleCardClick('mapas')}
                   className="w-full text-center text-xs text-[#42c920] font-bold py-2 border border-[#42c920] rounded bg-[#42c920]/10 hover:bg-[#42c920]/20 transition-colors"
                 >
                   Abrir Mapa Interativo
                 </button>
               )}
            </div>
          </motion.div>
        ))}
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
      className="glass-card p-8 max-w-lg w-full mx-4 relative bg-slate-900/95 border border-yellow-500/30 rounded-xl shadow-2xl"
    >
      <button onClick={closeModal} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X size={24}/></button>
      <div className="text-center mb-6">
        <div className="text-5xl mb-4 animate-pulse">📡</div>
        <h2 className="text-2xl font-bold text-yellow-400 font-space">Contato</h2>
      </div>
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <input type="text" className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white" placeholder="Nome" />
        <input type="email" className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white" placeholder="Email" />
        <textarea rows={3} className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white resize-none" placeholder="Mensagem..."></textarea>
        <button className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold rounded-lg flex items-center justify-center gap-2">
          <Mail size={18} /> Enviar
        </button>
      </form>
    </motion.div>
  );
};

/* =========================================
   GERENCIADOR DE MODAIS
   ========================================= */
export const Modals = () => {
  const { currentSection, currentProject, closeModal } = useGameStore();

  useEffect(() => {
    if (currentSection) {
      const audio = new Audio('/sounds/plim.wav');
      audio.volume = 0.4;
      audio.play().catch(() => {});
    }
  }, [currentSection]);

  const renderContent = () => {
    if (currentSection === 'about') return <AboutModal />;
    if (currentSection === 'contact') return <ContactModal />;
    
    if (currentSection === 'projects') {
      if (currentProject === 'mapas') {
        return <MapInterface closeModal={closeModal} />;
      }
      return <ProjectListModal />;
    }
    return null;
  };

  return (
    <AnimatePresence>
      {currentSection && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div onClick={(e) => e.stopPropagation()} className="w-full flex justify-center">
            {renderContent()}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};