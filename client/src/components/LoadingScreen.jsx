import { motion } from 'framer-motion';

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center absolute inset-0 z-[100]">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 rounded-full border-4 border-dark-800 border-t-brand-500 animate-spin mb-4 neon-border" />
        <motion.p 
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-brand-400 font-bold tracking-[0.2em]"
        >
          INITIALIZING...
        </motion.p>
      </div>
    </div>
  );
}
