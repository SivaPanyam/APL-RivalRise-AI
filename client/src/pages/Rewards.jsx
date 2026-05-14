import { motion } from 'framer-motion';
import { pageVariants } from '../animations/variants';
import { Lock, Unlock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Rewards() {
  const { userData } = useAuth();
  const currentLevel = userData?.level || 1;

  const rewards = [
    { level: 1, name: 'Rookie Badge', status: currentLevel >= 1 ? 'unlocked' : 'locked' },
    { level: 5, name: 'Neon Profile Frame', status: currentLevel >= 5 ? 'unlocked' : 'locked' },
    { level: 10, name: 'Elite Avatar Pack', status: currentLevel >= 10 ? 'unlocked' : 'locked' },
    { level: 25, name: 'Custom AI Voice Coach', status: currentLevel >= 25 ? 'unlocked' : 'locked' },
  ];

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="flex-1 py-8">
      <header className="mb-10">
        <h1 className="text-4xl font-bold mb-2">Rewards <span className="neon-text">Center</span></h1>
        <p className="text-slate-400">Unlock exclusive cosmetics and features as you level up.</p>
      </header>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {rewards.map((reward, i) => (
          <div key={i} className={`glass-panel p-6 relative overflow-hidden transition-all ${reward.status === 'locked' ? 'opacity-50 grayscale' : 'hover:scale-105 hover:shadow-[0_0_20px_rgba(14,165,233,0.3)] cursor-pointer'}`}>
            <div className="absolute top-4 right-4 text-slate-500">
              {reward.status === 'locked' ? <Lock className="w-5 h-5" /> : <Unlock className="text-brand-400 w-5 h-5" />}
            </div>
            <div className="w-16 h-16 rounded-full bg-dark-900 border border-white/10 flex items-center justify-center mb-4 text-xl font-black">
              L{reward.level}
            </div>
            <h3 className="font-bold mb-1">{reward.name}</h3>
            <p className="text-xs text-slate-400">{reward.status === 'locked' ? `Unlocks at Level ${reward.level}` : 'Available to use'}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
