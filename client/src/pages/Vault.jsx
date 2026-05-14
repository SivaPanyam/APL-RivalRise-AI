import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, Trophy, Sparkles, ShieldCheck, ChevronRight, PackageOpen } from 'lucide-react';
import { pageVariants, itemVariants } from '../animations/variants';
import { useAuth } from '../contexts/AuthContext';
import RewardService from '../services/rewardService';
import DatabaseService, { COLLECTIONS } from '../services/dbService';

export default function Vault() {
  const { userData, currentUser } = useAuth();
  const [coins, setCoins] = useState(0);
  const [inventory, setInventory] = useState([]);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [newUnlocks, setNewUnlocks] = useState([]);

  useEffect(() => {
    if (userData) {
      setCoins(userData.coins || 0);
      setInventory(userData.inventory || []);
    }
  }, [userData]);

  const handleEvaluateAchievements = async () => {
    if (!currentUser || !userData) return;
    setIsEvaluating(true);
    setNewUnlocks([]);
    
    try {
      // Create a mock currentStats object based on available userData
      // In a full app, missionsCompleted and predictions count would be fetched from subcollections
      const currentStats = {
        streak: userData.streak || 0,
        predictions: 10, // Mocked for demo: Assuming user made 10 predictions
        missionsCompleted: 5 // Mocked for demo: Assuming user did 5 missions
      };

      const unlockedBadges = await RewardService.evaluateAchievements(currentStats, inventory);
      
      if (unlockedBadges.length > 0) {
        setNewUnlocks(unlockedBadges);
        
        const updatedInventory = [...inventory, ...unlockedBadges];
        setInventory(updatedInventory);
        
        // Save to Firestore
        await DatabaseService.update(COLLECTIONS.USERS, currentUser.uid, {
          inventory: updatedInventory
        });
      }
    } catch (error) {
      console.error("Failed to evaluate achievements", error);
    } finally {
      setIsEvaluating(false);
    }
  };

  const rarityColors = {
    common: 'text-slate-400 border-slate-500/30 bg-slate-500/10 shadow-[0_0_15px_rgba(148,163,184,0.1)]',
    rare: 'text-blue-400 border-blue-500/30 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.2)]',
    epic: 'text-purple-400 border-purple-500/30 bg-purple-500/10 shadow-[0_0_15px_rgba(168,85,247,0.2)]',
    legendary: 'text-amber-400 border-amber-500/50 bg-amber-500/10 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="flex-1 py-4 sm:py-8 max-w-6xl mx-auto w-full space-y-8">
      
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-black mb-2 tracking-tight">The <span className="neon-text text-amber-400">Vault</span></h1>
          <p className="text-slate-400 font-medium">Your digital armory of Rival Coins and Collectibles.</p>
        </div>
        
        <div className="glass-panel p-4 flex items-center gap-4 border-amber-500/20 w-fit">
          <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-500/50 relative overflow-hidden">
             <div className="absolute inset-0 bg-amber-400/20 animate-ping opacity-20" />
             <Coins className="w-6 h-6 text-amber-400 relative z-10" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Balance</div>
            <div className="text-3xl font-black text-white">{coins} <span className="text-sm text-amber-400">RC</span></div>
          </div>
        </div>
      </header>

      {/* Action Banner */}
      <div className="glass-panel p-6 bg-gradient-to-r from-brand-600/20 to-accent-600/20 border-brand-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-black mb-2 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-brand-400" /> Achievement Evaluation
          </h2>
          <p className="text-slate-300 font-medium">Scan your recent tactical history to unlock pending badges and rewards.</p>
        </div>
        <button 
          onClick={handleEvaluateAchievements}
          disabled={isEvaluating}
          className="px-6 py-3 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] flex items-center gap-2 shrink-0"
        >
          {isEvaluating ? (
            <><PackageOpen className="w-5 h-5 animate-bounce" /> Scanning...</>
          ) : (
            <><Sparkles className="w-5 h-5" /> Scan for Unlocks</>
          )}
        </button>
      </div>

      {/* New Unlocks Notification */}
      <AnimatePresence>
        {newUnlocks.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-panel p-6 border-amber-500/50 bg-amber-500/10"
          >
            <h3 className="text-lg font-black text-amber-400 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5" /> New Badges Unlocked!
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {newUnlocks.map(badge => (
                <div key={badge.id} className={`p-4 rounded-xl border ${rarityColors[badge.rarity]} backdrop-blur-md`}>
                  <div className="text-xs font-black uppercase tracking-widest mb-1">{badge.rarity}</div>
                  <div className="text-lg font-bold text-white mb-1">{badge.name}</div>
                  <p className="text-sm opacity-80">{badge.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Inventory Grid */}
      <div>
        <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-slate-400" /> Collectible Badges
        </h2>
        
        {inventory.length === 0 ? (
          <div className="glass-panel p-12 text-center border-dashed border-white/20">
            <Trophy className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-400 mb-2">Your Vault is Empty</h3>
            <p className="text-slate-500">Complete missions and prediction battles to earn exclusive badges.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {inventory.map((item, idx) => (
              <motion.div 
                key={idx}
                variants={itemVariants}
                className={`glass-panel p-6 border ${rarityColors[item.rarity]} flex flex-col items-center text-center group hover:-translate-y-1 transition-transform cursor-pointer relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                
                <div className={`w-20 h-20 rounded-2xl border-4 ${rarityColors[item.rarity].split(' ')[1]} flex items-center justify-center mb-4 transform group-hover:scale-110 transition-transform bg-dark-900`}>
                  <ShieldCheck className="w-10 h-10" />
                </div>
                
                <div className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-80">{item.rarity}</div>
                <h3 className="text-lg font-bold text-white mb-2">{item.name}</h3>
                <p className="text-xs opacity-70 mb-4">{item.description}</p>
                
                <div className="mt-auto pt-4 border-t border-white/10 w-full text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Acquired: {new Date(item.acquiredAt).toLocaleDateString()}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

    </motion.div>
  );
}
