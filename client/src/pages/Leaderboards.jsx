import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Trophy, Star, Shield, Zap, TrendingUp, Medal, Crown } from 'lucide-react';
import { pageVariants } from '../animations/variants';
import { getFanRank, getLevelProgress, calculateLevelFromXp, calculateXpForLevel } from '../utils/progression';
import DatabaseService, { COLLECTIONS } from '../services/dbService';

export default function Leaderboards() {
  const { userData } = useAuth();
  const [globalRankings, setGlobalRankings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRankings() {
      try {
        const topUsers = await DatabaseService.getGlobalLeaderboard(50);
        setGlobalRankings(topUsers);
      } catch (err) {
        console.error("Failed to fetch rankings:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchRankings();
  }, []);

  // Calculate user progression data
  const userXp = userData?.xp || 0;
  const currentLevel = calculateLevelFromXp(userXp);
  const nextLevelXp = calculateXpForLevel(currentLevel + 1);
  const currentRank = getFanRank(currentLevel);
  const progressPercent = getLevelProgress(userXp);

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="flex-1 py-4 sm:py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-black mb-2 tracking-tight">Global <span className="neon-text">Rankings</span></h1>
        <p className="text-slate-400 font-medium">Climb the ladder and build your legacy.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Personal Progression */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Current Rank Card */}
          <div className="glass-panel p-6 relative overflow-hidden group">
            {/* Ambient Background Glow based on rank color */}
            <div className={`absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-1000 ${currentRank.bg.replace('/10', '')}`} />
            
            <h2 className="text-sm font-black text-slate-500 tracking-widest uppercase mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4" /> Current Status
            </h2>

            <div className="flex items-center gap-5 mb-6">
              <div className={`w-20 h-20 rounded-xl ${currentRank.bg} ${currentRank.border} border-2 flex items-center justify-center transform group-hover:scale-105 transition-transform shadow-lg`}>
                <Crown className={`w-10 h-10 ${currentRank.color}`} />
              </div>
              <div>
                <h3 className={`text-3xl font-black ${currentRank.color} tracking-wide`}>{currentRank.name}</h3>
                <p className="text-white font-medium text-lg">Level {currentLevel}</p>
              </div>
            </div>

            {/* XP Progress Bar */}
            <div className="space-y-2 relative z-10">
              <div className="flex justify-between text-sm font-bold">
                <span className="text-slate-300">{userXp} XP</span>
                <span className="text-slate-500">{nextLevelXp} XP</span>
              </div>
              <div className="h-4 bg-dark-900 rounded-full overflow-hidden border border-white/5 relative shadow-inner">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full bg-gradient-to-r from-brand-600 to-brand-400 relative`}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </motion.div>
              </div>
            </div>
          </div>

          {/* Streak Card */}
          <div className="glass-panel p-6 border-brand-500/20 hover:border-brand-500/40 transition-colors">
            <h2 className="text-sm font-black text-slate-500 tracking-widest uppercase mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-brand-400" /> Active Streak
            </h2>
            <div className="flex items-end gap-3">
              <span className="text-5xl font-black text-white">{userData?.streak || 0}</span>
              <span className="text-xl font-bold text-slate-400 pb-1">Days</span>
            </div>
            <p className="text-sm text-slate-400 mt-2 font-medium">Log in tomorrow to keep the multiplier active.</p>
          </div>

        </div>

        {/* Right Column: Global Leaderboard */}
        <div className="lg:col-span-2">
          <div className="glass-panel p-0 overflow-hidden h-full flex flex-col">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Trophy className="w-5 h-5 text-accent-400" /> Top Analysts
              </h2>
              <span className="text-xs font-bold px-3 py-1 bg-white/10 rounded-full">GLOBAL</span>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
              {loading ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : globalRankings.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-slate-500 font-medium">
                  No players found. Be the first to rank up!
                </div>
              ) : (
                <div className="space-y-1">
                  {globalRankings.map((player, index) => {
                    const playerLevel = calculateLevelFromXp(player.xp || 0);
                    const playerRank = getFanRank(playerLevel);
                    
                    // Highlight top 3
                    const isTop3 = index < 3;
                    const indexColor = index === 0 ? 'text-accent-400' : index === 1 ? 'text-slate-300' : index === 2 ? 'text-amber-600' : 'text-slate-500';

                    return (
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        key={player.id} 
                        className={`flex items-center p-4 rounded-xl transition-all ${
                          player.id === userData?.uid 
                            ? 'bg-brand-500/20 border border-brand-500/40 shadow-[0_0_15px_rgba(59,130,246,0.15)]' 
                            : 'hover:bg-white/5 border border-transparent'
                        }`}
                      >
                        <div className={`w-8 font-black text-lg ${indexColor} text-center mr-4`}>
                          #{index + 1}
                        </div>
                        
                        <div className="flex-1 flex items-center gap-4">
                          {/* Player Avatar placeholder */}
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg ${playerRank.bg} ${playerRank.color}`}>
                            {player.username ? player.username.charAt(0).toUpperCase() : 'U'}
                          </div>
                          
                          <div>
                            <h4 className="font-bold text-white text-lg flex items-center gap-2">
                              {player.username || 'Unknown Player'}
                              {player.id === userData?.uid && <span className="text-[10px] px-2 py-0.5 bg-brand-500 text-white rounded-full uppercase tracking-wider">You</span>}
                            </h4>
                            <p className={`text-xs font-bold uppercase tracking-wider ${playerRank.color}`}>
                              {playerRank.name} • Lvl {playerLevel}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-black text-xl text-white">{player.xp || 0}</div>
                          <div className="text-xs font-bold text-slate-500 tracking-wider">XP</div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
