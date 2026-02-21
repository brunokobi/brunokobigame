import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { X, Github, Linkedin, Mail, ExternalLink, Search, Trash2, MapPin, Globe, Radio ,Code2, Terminal, Cpu } from 'lucide-react';
import { createClient } from "@supabase/supabase-js";



// Se você não tiver react-icons instalado, pode usar ícones do lucide ou instalar: yarn add react-icons
// Aqui estou usando Lucide para manter consistência com seu arquivo, mas simulei o estilo alien
// Se quiser usar react-icons, descomente as linhas abaixo e instale a lib
// import { FaSatelliteDish } from "react-icons/fa"; 
// import { RiAliensFill } from "react-icons/ri"; 

/* =========================================
   CONFIGURAÇÃO SUPABASE
   ========================================= */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

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

        {/* Lado Direito: Mapa */}
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
   MODAIS PADRÃO
   ========================================= */

const AboutModal = () => {
  const { closeModal } = useGameStore();
  // Lista das suas principais armas no arsenal dev
  const techStack = ['IA & Computação Natural', 'Supabase', 'n8n', 'Python', 'React 3D'];
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ type: "spring", duration: 0.5 }}
      className="p-8 max-w-lg w-full mx-4 relative bg-[#050510]/90 backdrop-blur-xl border border-[#00ffcc]/30 rounded-2xl shadow-[0_0_50px_rgba(0,255,204,0.15)] overflow-hidden"
    >
      {/* Luz de fundo decorativa */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#00ffcc]/20 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-600/20 rounded-full blur-[80px] pointer-events-none" />

      {/* Botão de Fechar */}
      <button 
        onClick={closeModal} 
        className="absolute top-5 right-5 text-slate-400 hover:text-[#00ffcc] transition-colors z-50 p-1 bg-slate-800/50 rounded-full hover:bg-slate-800"
      >
        <X size={20} />
      </button>

      {/* Cabeçalho do Perfil */}
      <div className="text-center mb-6 relative z-10">
        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#00ffcc]/20 to-purple-600/20 flex items-center justify-center text-5xl shadow-[0_0_20px_rgba(0,255,204,0.2)] border-2 border-[#00ffcc]/50 relative group">
          <div className="absolute inset-0 rounded-full bg-[#00ffcc]/20 animate-ping opacity-20" />
          <span className="group-hover:scale-110 transition-transform duration-300">👽</span>
        </div>
        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00ffcc] to-cyan-300 font-mono tracking-widest uppercase">
          Bruno Kobi
        </h2>
        <div className="flex items-center justify-center gap-2 mt-2 text-[#00ffcc]/70 text-xs font-bold uppercase tracking-[0.2em]">
          <Terminal size={12} />
          <span>Desenvolvedor & IA</span>
        </div>
      </div>

      {/* Texto de Apresentação */}
      <div className="bg-black/40 border border-white/5 rounded-xl p-5 mb-6 relative z-10">
        <p className="text-slate-300 text-center leading-relaxed text-sm font-sans">
          Saudações, terráqueo! 🛸 Sou Mestrando em Computação Aplicada com foco em Inteligência Artificial. 
          Minha missão é transformar café em código, conectar sistemas complexos e abduzir problemas transformando-os em soluções eficientes.
        </p>
      </div>

      {/* Badges de Tecnologias */}
      <div className="flex flex-wrap justify-center gap-2 mb-8 relative z-10">
        {techStack.map((tech, index) => (
          <span 
            key={index}
            className="px-3 py-1 bg-[#00ffcc]/10 border border-[#00ffcc]/20 rounded-full text-[#00ffcc] text-[10px] font-bold tracking-widest uppercase flex items-center gap-1"
          >
            <Cpu size={10} />
            {tech}
          </span>
        ))}
      </div>

      {/* Botões de Contato */}
      <div className="grid grid-cols-2 gap-3 relative z-10">
        <a 
          href="https://github.com/brunokobi" 
          target="_blank" 
          rel="noreferrer" 
          className="flex justify-center items-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-white transition-all border border-slate-600 hover:border-slate-500 hover:shadow-lg text-sm font-bold tracking-wider"
        >
          <Github size={18} /> GitHub
        </a>
        <a 
          href="https://www.linkedin.com/in/brunokobi/" 
          target="_blank" 
          rel="noreferrer" 
          className="flex justify-center items-center gap-2 px-4 py-3 bg-[#0a66c2]/80 hover:bg-[#0a66c2] rounded-xl text-white transition-all border border-[#0a66c2] hover:shadow-[0_0_15px_rgba(10,102,194,0.4)] text-sm font-bold tracking-wider"
        >
          <Linkedin size={18} /> LinkedIn
        </a>
        <a
          href="https://brunokobi.netlify.app/"
          target="_blank"
          rel="noreferrer"
          className="col-span-2 flex justify-center items-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600/80 to-[#00ffcc]/80 hover:from-purple-600 hover:to-[#00ffcc] rounded-xl text-white transition-all shadow-lg hover:shadow-[0_0_20px_rgba(0,255,204,0.4)] border border-white/10 text-sm font-bold tracking-wider uppercase"
        >
          <Globe size={18} /> Acessar Portfólio Principal
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

/* =========================================
   CONTACT MODAL - UPLINK ALIEN (SUPABASE)
   ========================================= */
const ContactModal = () => {
  const { closeModal } = useGameStore();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [formData, setFormData] = useState({ nome: "", email: "", mensagem: "" });
  
  const arcadeGreen = "#39ff14";

  // CSS Styles for the Alien Animations (Scanline, etc)
  const styles = `
    @keyframes scanline {
      0% { transform: translateY(-100%); }
      100% { transform: translateY(100%); }
    }
    @keyframes signalWave {
      0% { transform: scale(1); opacity: 0.8; border-color: ${arcadeGreen}; }
      100% { transform: scale(2); opacity: 0; border-color: transparent; }
    }
    @keyframes blink {
      0% { opacity: 1; box-shadow: 0 0 10px ${arcadeGreen}; }
      50% { opacity: 0.3; box-shadow: 0 0 0px ${arcadeGreen}; }
      100% { opacity: 1; box-shadow: 0 0 10px ${arcadeGreen}; }
    }
    .animate-scanline { animation: scanline 4s linear infinite; }
    .animate-signal { animation: signalWave 2s infinite; }
    .animate-signal-delay { animation: signalWave 2s infinite 0.5s; }
    .animate-blink { animation: blink 1s infinite; }
  `;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('contato')
      .insert([{ 
          nome: formData.nome, 
          email: formData.email, 
          mensagem: formData.mensagem 
      }]);

    setLoading(false);

    if (!error) {
      setSent(true);
      setTimeout(() => {
        closeModal();
      }, 2500);
    } else {
        alert("Erro na transmissão. Tente novamente.");
    }
  };

  return (
    <>
      <style>{styles}</style>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative overflow-hidden p-8 max-w-lg w-full mx-4 bg-[#0a0f0a]/95 border-2 border-[#39ff14] rounded-2xl shadow-[0_0_30px_rgba(57,255,20,0.3)] font-mono"
      >
        {/* Efeito Scanline */}
        <div 
            className="absolute top-0 left-0 w-full h-[10px] opacity-50 pointer-events-none z-10 animate-scanline"
            style={{ background: `linear-gradient(to bottom, transparent, ${arcadeGreen}20, transparent)` }}
        />

        <button onClick={closeModal} className="absolute top-4 right-4 text-[#39ff14] hover:text-white z-50">
          <X size={24} />
        </button>

        {sent ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            {/* Ícone Alienígena (Simulado) */}
            <div className="w-16 h-16 mb-4 text-[#39ff14] animate-blink flex items-center justify-center border-2 border-[#39ff14] rounded-full">
                👽
            </div>
            <h2 className="text-[#39ff14] text-xl font-bold tracking-widest font-[Orbitron]">TRANSMISSÃO CONCLUÍDA</h2>
            <p className="text-[#39ff14] mt-2 text-xs opacity-70">SINAL RECEBIDO NA NAVE MÃE</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center mb-6 relative z-20">
              <div className="relative mb-4">
                <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full border-2 border-[#39ff14] animate-signal" />
                <div className="absolute -top-2 -left-2 -right-2 -bottom-2 rounded-full border border-[#39ff14] animate-signal-delay" />
                <div className="bg-black rounded-full p-3 border-2 border-[#39ff14] z-10 relative">
                  <Radio size={32} color={arcadeGreen} />
                </div>
              </div>
              <h2 className="text-[#39ff14] text-xl font-bold tracking-[4px] drop-shadow-[0_0_10px_#39ff14]">
                UPLINK E.T.
              </h2>
              <div className="flex items-center mt-2 gap-2">
                <div className="w-2 h-2 rounded-full bg-[#39ff14] animate-blink" />
                <span className="text-[10px] text-[#39ff14] tracking-widest">STATION ONLINE // READY</span>
              </div>
            </div>

            <form className="space-y-4 relative z-20" onSubmit={handleSubmit}>
              <div className="space-y-1">
                <label className="text-[#39ff14] text-[10px] font-bold ml-1">IDENT: COMANDANTE</label>
                <input 
                  name="nome"
                  required
                  value={formData.nome}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black border border-[#39ff14]/40 rounded-lg text-[#39ff14] focus:border-[#39ff14] outline-none transition-all placeholder-[#39ff14]/20 shadow-[inset_0_0_10px_rgba(57,255,20,0.1)] focus:shadow-[0_0_10px_rgba(57,255,20,0.3)]" 
                  placeholder="NOME..." 
                />
              </div>
              <div className="space-y-1">
                <label className="text-[#39ff14] text-[10px] font-bold ml-1">FREQUÊNCIA (EMAIL)</label>
                <input 
                  type="email" 
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black border border-[#39ff14]/40 rounded-lg text-[#39ff14] focus:border-[#39ff14] outline-none transition-all placeholder-[#39ff14]/20 shadow-[inset_0_0_10px_rgba(57,255,20,0.1)] focus:shadow-[0_0_10px_rgba(57,255,20,0.3)]" 
                  placeholder="EMAIL@GALAXY.COM" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-[#39ff14] text-[10px] font-bold ml-1">PACOTE DE DADOS</label>
                <textarea 
                  name="mensagem"
                  required
                  rows={3} 
                  value={formData.mensagem}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black border border-[#39ff14]/40 rounded-lg text-[#39ff14] focus:border-[#39ff14] outline-none transition-all placeholder-[#39ff14]/20 resize-none shadow-[inset_0_0_10px_rgba(57,255,20,0.1)] focus:shadow-[0_0_10px_rgba(57,255,20,0.3)]" 
                  placeholder="DIGITE A MENSAGEM..." 
                />
              </div>
              
              <button 
                disabled={loading}
                className="group w-full py-4 bg-transparent border-2 border-[#39ff14] text-[#39ff14] font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-[#39ff14] hover:text-black transition-all hover:shadow-[0_0_20px_#39ff14] uppercase tracking-wider"
              >
                {loading ? (
                  "TRANSMITINDO..."
                ) : (
                  <>
                    <Mail size={20} className="group-hover:animate-bounce" /> DISPARAR SINAL
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </>
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