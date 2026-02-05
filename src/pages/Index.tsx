import { Scene } from '@/components/3d/Scene';
import { HUD } from '@/components/ui/HUD';
import { Tutorial } from '@/components/ui/Tutorial';
import { Modals } from '@/components/ui/Modals';
import { SkillToast } from '@/components/ui/SkillToast';
 import { MobileControls } from '@/components/ui/MobileControls';
import { motion } from 'framer-motion';

const Index = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      {/* 3D Scene */}
      <Scene />

      {/* UI Overlay */}
      <HUD />
      <Tutorial />
      <Modals />
      <SkillToast />
       <MobileControls />

      {/* Title */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-40 pointer-events-none text-center"
      >
        <h1 className="text-3xl md:text-4xl font-bold tracking-wider">
          <span className="text-primary neon-text">THE FULLSTACK</span>
          <span className="text-foreground"> INVASION</span>
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          🛸 Explore o mapa e descubra meus projetos
        </p>
      </motion.div>
    </div>
  );
};

export default Index;
