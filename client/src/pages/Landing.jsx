import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { pageVariants } from '../animations/variants';
import { useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';

export default function Landing() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  return (
    <motion.div 
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex-1 flex flex-col items-center justify-center text-center p-4 relative"
    >
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542652694-40abf526446e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-10 pointer-events-none" />
      
      <div className="relative z-10 max-w-3xl">
        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
          ELEVATE YOUR <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-accent-500 neon-text">GAME.</span>
        </h1>
        <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
          The ultimate AI-powered sports engagement platform. Complete missions, climb the leaderboards, and evolve your fan identity.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/signup" 
            className="px-8 py-4 bg-brand-600 hover:bg-brand-500 rounded-lg font-bold tracking-widest transition-all neon-border"
          >
            JOIN THE ARENA
          </Link>
          <Link 
            to="/login" 
            className="px-8 py-4 bg-dark-800 hover:bg-dark-700 border border-white/10 rounded-lg font-bold tracking-widest transition-all"
          >
            EXISTING PLAYER
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
