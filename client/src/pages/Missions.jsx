import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRealtimeCollection } from '../hooks/useRealtimeCollection';
import DatabaseService, { COLLECTIONS } from '../services/dbService';
import ApiService from '../services/api';
import { Target, Zap, Clock, Trophy, ChevronRight, CheckCircle2, Loader2, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { pageVariants } from '../animations/variants';
import { where } from 'firebase/firestore';

export default function Missions() {
  const { userData, currentUser } = useAuth();
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  // Fetch active missions in real-time
  const { data: activeMissions, loading: fetchingMissions } = useRealtimeCollection(
    COLLECTIONS.MISSIONS,
    currentUser ? [where('userId', '==', currentUser.uid), where('status', '==', 'active')] : []
  );

  async function requestAIMission() {
    if (!currentUser || !userData) return;
    setGenerating(true);
    setError('');
    try {
      // 1. Ask Express server to use Gemini to build a mission
      const newMission = await ApiService.generateMission(currentUser.uid, userData, userData.sportPreference);
      
      // 2. Save it directly to Firestore via dbService
      await DatabaseService.add(COLLECTIONS.MISSIONS, newMission);
    } catch (err) {
      console.error(err);
      setError('Failed to generate mission. Ensure servers are running and API keys are set.');
    } finally {
      setGenerating(false);
    }
  }

  async function simulateProgress(mission) {
    if (mission.progress >= mission.target) return;
    
    // Simulate adding 25% progress per click
    const amount = Math.max(1, Math.floor(mission.target * 0.25));
    const newProgress = Math.min(mission.progress + amount, mission.target);
    const newStatus = newProgress >= mission.target ? 'completed' : 'active';

    try {
      await DatabaseService.update(COLLECTIONS.MISSIONS, mission.id, {
        progress: newProgress,
        status: newStatus
      });

      if (newStatus === 'completed') {
        // Add XP to the user
        await DatabaseService.update(COLLECTIONS.USERS, currentUser.uid, {
          xp: (userData.xp || 0) + (mission.xpReward || 0)
        });
      }
    } catch (err) {
      console.error("Failed to update progress", err);
    }
  }

  // Calculate overall level progress (Mock logic for UI)
  const currentLevelProgress = ((userData?.xp || 0) % 1000) / 1000 * 100;

  return (
    <motion.div 
      variants={pageVariants} 
      initial="initial" 
      animate="animate" 
      exit="exit" 
      className="flex-1 py-4 sm:py-8"
    >
      <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black mb-2 tracking-tight">Mission <span className="neon-text">Command</span></h1>
          <p className="text-slate-400 font-medium">Complete AI-generated challenges to rank up.</p>
        </div>
        <button 
          onClick={requestAIMission}
          disabled={generating}
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-5 py-3 rounded-lg font-bold tracking-wide transition-all neon-border disabled:opacity-50"
        >
          {generating ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
          {generating ? 'GENERATING...' : 'REQUEST AI MISSION'}
        </button>
      </header>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-lg mb-8 text-sm font-medium">
          {error}
        </div>
      )}

      {/* Global Progression Bar */}
      <div className="glass-panel p-6 mb-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="flex justify-between items-end mb-4 relative z-10">
          <div>
            <p className="text-brand-400 font-bold tracking-wider text-sm mb-1">CURRENT SEASON</p>
            <h2 className="text-2xl font-black text-white">LEVEL {userData?.level || 1}</h2>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-white">{userData?.xp || 0} XP</p>
            <p className="text-sm text-slate-400">{1000 - ((userData?.xp || 0) % 1000)} XP to Next Rank</p>
          </div>
        </div>
        <div className="h-4 bg-dark-900 rounded-full overflow-hidden border border-white/5 relative z-10">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${currentLevelProgress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-brand-500 to-accent-500 relative"
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          </motion.div>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Zap className="w-5 h-5 text-brand-400" />
          Active Directives
        </h3>
        <span className="text-sm text-slate-400 font-medium">{activeMissions?.length || 0} Available</span>
      </div>

      <div className="space-y-4">
        {fetchingMissions ? (
          <div className="flex justify-center p-12">
            <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
          </div>
        ) : !activeMissions || activeMissions.length === 0 ? (
          <div className="glass-panel p-12 text-center border-dashed border-white/10">
            <Target className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Active Missions</h3>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">You've cleared your queue. Request a new AI-generated mission to continue grinding.</p>
            <button 
              onClick={requestAIMission}
              className="text-brand-400 font-bold hover:text-brand-300 transition-colors"
            >
              REQUEST MISSION
            </button>
          </div>
        ) : (
          <AnimatePresence>
            {activeMissions.map((mission) => {
              const percent = Math.min(100, Math.floor((mission.progress / mission.target) * 100));
              const isComplete = percent >= 100;

              return (
                <motion.div 
                  key={mission.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="glass-panel p-0 relative overflow-hidden group"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-brand-500" />
                  
                  <div className="p-6 sm:p-8 flex flex-col md:flex-row gap-6 md:items-center">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-2 py-1 rounded text-xs font-black tracking-wider bg-brand-500/20 text-brand-400 border border-brand-500/30 uppercase">
                          {mission.difficulty || 'STANDARD'}
                        </span>
                        <span className="text-sm text-slate-400 font-medium flex items-center gap-1">
                          <Clock className="w-4 h-4" /> 24h
                        </span>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-brand-300 transition-colors">{mission.title}</h3>
                      <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-2xl">{mission.description}</p>
                      
                      {mission.aiMessage && (
                        <div className="mt-4 p-3 rounded-lg bg-dark-900/50 border border-white/5 flex gap-3 items-start">
                          <div className="w-6 h-6 rounded bg-brand-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Trophy className="w-3 h-3 text-brand-400" />
                          </div>
                          <p className="text-sm text-slate-300 italic">"{mission.aiMessage}"</p>
                        </div>
                      )}
                    </div>

                    <div className="w-full md:w-64 flex flex-col justify-center shrink-0 border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-6">
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-xl font-bold text-accent-400">+{mission.xpReward || 0} XP</span>
                        <span className="text-sm font-bold text-slate-300">{percent}%</span>
                      </div>
                      
                      <div className="h-3 bg-dark-900 rounded-full overflow-hidden border border-white/5 mb-4">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${percent}%` }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                          className={`h-full relative ${isComplete ? 'bg-green-500' : 'bg-brand-500'}`}
                        >
                           {isComplete && <div className="absolute inset-0 bg-white/30 animate-pulse" />}
                        </motion.div>
                      </div>

                      <button 
                        onClick={() => simulateProgress(mission)}
                        disabled={isComplete}
                        className={`w-full py-2 rounded font-bold text-sm tracking-wider flex items-center justify-center transition-all ${
                          isComplete 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
                            : 'bg-white/5 hover:bg-brand-500/20 hover:text-brand-400 border border-white/10 hover:border-brand-500/50 text-white'
                        }`}
                      >
                        {isComplete ? (
                          <><CheckCircle2 className="w-4 h-4 mr-2" /> CLEARED</>
                        ) : (
                          <><ChevronRight className="w-4 h-4 mr-1" /> SIMULATE ACTION</>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
}
