import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Trophy, Users, Shield, Loader2 } from 'lucide-react';
import { pageVariants } from '../animations/variants';
import { useRealtimeCollection } from '../hooks/useRealtimeCollection';
import { COLLECTIONS } from '../services/dbService';
import TournamentService from '../services/tournamentService';
import PredictionCard from '../components/PredictionCard';

export default function TournamentArena() {
  const { currentUser } = useAuth();
  const [userPredictions, setUserPredictions] = useState([]);
  const [seeding, setSeeding] = useState(true);

  // Fetch all tournaments/matches
  const { data: matches, loading: loadingMatches } = useRealtimeCollection(COLLECTIONS.TOURNAMENTS);

  useEffect(() => {
    async function initializeArena() {
      // Seed mock matches if DB is empty
      await TournamentService.seedMockMatchesIfEmpty();
      
      // Fetch user's existing predictions to lock cards
      if (currentUser) {
        const predictions = await TournamentService.getUserPredictions(currentUser.uid);
        setUserPredictions(predictions);
      }
      setSeeding(false);
    }
    initializeArena();
  }, [currentUser]);

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="flex-1 py-4 sm:py-8">
      
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden mb-12 bg-dark-900 border border-white/10 group">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-900/40 to-accent-900/40 opacity-50 pointer-events-none" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay pointer-events-none" />
        
        <div className="relative z-10 p-8 sm:p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl text-center md:text-left">
            <span className="px-3 py-1 bg-accent-500/20 text-accent-400 border border-accent-500/30 rounded-full text-xs font-black tracking-widest uppercase mb-4 inline-block shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              SEASON 1 CHAMPIONSHIP
            </span>
            <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter uppercase leading-none">
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-accent-400">Proving Grounds</span>
            </h1>
            <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-xl">
              Lock in your predictions before the matches begin. Earn massive XP multipliers for consecutive correct predictions and climb the regional rankings.
            </p>
          </div>
          
          <div className="hidden lg:flex shrink-0 w-64 h-64 bg-dark-800 rounded-full border-4 border-white/5 items-center justify-center relative shadow-2xl">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-brand-500 to-accent-500 opacity-20 blur-2xl" />
            <Trophy className="w-32 h-32 text-white/90 drop-shadow-lg" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content: Match Predictions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-black flex items-center gap-2">
              <SwordsIcon className="w-6 h-6 text-brand-400" /> Upcoming Clashes
            </h2>
          </div>

          {(loadingMatches || seeding) ? (
            <div className="flex justify-center p-12 glass-panel">
              <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
            </div>
          ) : matches.length === 0 ? (
            <div className="glass-panel p-12 text-center text-slate-400 font-medium">
              No upcoming matches found. Check back later!
            </div>
          ) : (
            <div className="space-y-4">
              {matches.map(match => {
                const existingPrediction = userPredictions.find(p => p.matchId === match.id);
                return (
                  <PredictionCard 
                    key={match.id} 
                    match={match} 
                    existingPrediction={existingPrediction} 
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          
          <div className="glass-panel p-6 border-accent-500/20">
            <h3 className="text-sm font-black text-slate-500 tracking-widest uppercase mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-accent-400" /> Battle Intel
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              Predictions lock 5 minutes before the match start time. Once locked, predictions cannot be altered.
            </p>
            <div className="bg-dark-900 rounded-lg p-4 border border-white/5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-slate-400">Your Accuracy</span>
                <span className="text-sm font-black text-brand-400">--%</span>
              </div>
              <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
                <div className="h-full bg-brand-500 w-0" />
              </div>
            </div>
          </div>

          <div className="glass-panel p-0 overflow-hidden">
             <div className="p-4 border-b border-white/10 bg-white/[0.02]">
                <h3 className="font-bold flex items-center gap-2">
                  <Users className="w-4 h-4 text-brand-400" /> Faction Leaders
                </h3>
             </div>
             <div className="p-6 text-center text-sm text-slate-500 font-medium">
               Faction leaderboards activate when the season begins.
             </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}

function SwordsIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/>
      <line x1="13" x2="19" y1="19" y2="13"/>
      <line x1="16" x2="20" y1="16" y2="20"/>
      <line x1="19" x2="21" y1="21" y2="19"/>
      <polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5"/>
      <line x1="5" x2="9" y1="14" y2="18"/>
      <line x1="7" x2="4" y1="17" y2="20"/>
      <line x1="3" x2="5" y1="19" y2="21"/>
    </svg>
  )
}
