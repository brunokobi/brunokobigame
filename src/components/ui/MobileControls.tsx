 import { useState, useRef, useCallback } from 'react';
 import { useGameStore } from '@/store/gameStore';
 import { motion } from 'framer-motion';
 
 interface JoystickState {
   x: number;
   y: number;
   active: boolean;
 }
 
 export const useMobileControls = () => {
   const [joystick, setJoystick] = useState<JoystickState>({ x: 0, y: 0, active: false });
   
   return { joystick, setJoystick };
 };
 
 // Global state for joystick that UFO can read
 export let mobileJoystickState = { x: 0, y: 0 };
 
 export const MobileControls = () => {
   const { isAbducting, setAbducting } = useGameStore();
   const joystickRef = useRef<HTMLDivElement>(null);
   const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 });
   const [isJoystickActive, setIsJoystickActive] = useState(false);
   
   const handleJoystickStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
     e.preventDefault();
     setIsJoystickActive(true);
   }, []);
   
   const handleJoystickMove = useCallback((e: React.TouchEvent | React.MouseEvent) => {
     if (!isJoystickActive || !joystickRef.current) return;
     
     const rect = joystickRef.current.getBoundingClientRect();
     const centerX = rect.left + rect.width / 2;
     const centerY = rect.top + rect.height / 2;
     
     let clientX: number, clientY: number;
     if ('touches' in e) {
       clientX = e.touches[0].clientX;
       clientY = e.touches[0].clientY;
     } else {
       clientX = e.clientX;
       clientY = e.clientY;
     }
     
     const maxDistance = rect.width / 2 - 20;
     let deltaX = clientX - centerX;
     let deltaY = clientY - centerY;
     
     const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
     if (distance > maxDistance) {
       deltaX = (deltaX / distance) * maxDistance;
       deltaY = (deltaY / distance) * maxDistance;
     }
     
     setJoystickPos({ x: deltaX, y: deltaY });
     
     // Normalize to -1 to 1 range
     mobileJoystickState = {
       x: deltaX / maxDistance,
       y: deltaY / maxDistance
     };
   }, [isJoystickActive]);
   
   const handleJoystickEnd = useCallback(() => {
     setIsJoystickActive(false);
     setJoystickPos({ x: 0, y: 0 });
     mobileJoystickState = { x: 0, y: 0 };
   }, []);
   
   return (
     <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none p-6 flex justify-between items-end md:hidden">
       {/* Virtual Joystick */}
       <div
         ref={joystickRef}
         className="relative w-32 h-32 rounded-full bg-black/30 backdrop-blur-sm border-2 border-primary/50 pointer-events-auto touch-none"
         onTouchStart={handleJoystickStart}
         onTouchMove={handleJoystickMove}
         onTouchEnd={handleJoystickEnd}
         onMouseDown={handleJoystickStart}
         onMouseMove={handleJoystickMove}
         onMouseUp={handleJoystickEnd}
         onMouseLeave={handleJoystickEnd}
       >
         {/* Joystick base lines */}
         <div className="absolute inset-0 flex items-center justify-center">
           <div className="w-full h-0.5 bg-primary/20" />
         </div>
         <div className="absolute inset-0 flex items-center justify-center">
           <div className="h-full w-0.5 bg-primary/20" />
         </div>
         
         {/* Joystick thumb */}
         <motion.div
           className="absolute w-12 h-12 rounded-full bg-primary/80 border-2 border-primary shadow-lg shadow-primary/50"
           style={{
             left: '50%',
             top: '50%',
             x: joystickPos.x - 24,
             y: joystickPos.y - 24,
           }}
           animate={{
             scale: isJoystickActive ? 1.1 : 1,
           }}
         />
       </div>
       
       {/* Abduction Button */}
       <motion.button
         className={`w-24 h-24 rounded-full pointer-events-auto touch-none flex items-center justify-center text-4xl
           ${isAbducting 
             ? 'bg-primary/80 shadow-lg shadow-primary/80 border-4 border-primary' 
             : 'bg-black/30 backdrop-blur-sm border-2 border-primary/50'
           }`}
         onTouchStart={(e) => { e.preventDefault(); setAbducting(true); }}
         onTouchEnd={(e) => { e.preventDefault(); setAbducting(false); }}
         onMouseDown={() => setAbducting(true)}
         onMouseUp={() => setAbducting(false)}
         onMouseLeave={() => setAbducting(false)}
         whileTap={{ scale: 0.95 }}
       >
         <motion.span
           animate={{
             scale: isAbducting ? [1, 1.2, 1] : 1,
             rotate: isAbducting ? [0, 10, -10, 0] : 0,
           }}
           transition={{ repeat: isAbducting ? Infinity : 0, duration: 0.5 }}
         >
           👽
         </motion.span>
       </motion.button>
     </div>
   );
 };