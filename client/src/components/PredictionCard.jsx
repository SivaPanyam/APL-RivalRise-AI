import { useState } from 'react';
import { motion } from 'framer-motion';
import { Swords, Lock, Shield, Target } from 'lucide-react';
import TournamentService from '../services/tournamentService';
import { useAuth } from '../contexts/AuthContext';

export default function PredictionCard({ match, existingPrediction }) {
  const { currentUser } = useAuth();
  const [lockedVote, setLockedVote] = useState(existingPrediction?.predictedWinner || null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Format the date
  const matchDate = new Date(match.date).toLocaleDateString('en-US', { 
    weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
  });

  const handleVote = async (teamName) => {
    if (lockedVote || isSubmitting || !currentUser) return;
    
    setIsSubmitting(true);
    try {
      await TournamentService.submitPrediction(currentUser.uid, match.id, teamName);
      setLockedVote(teamName);
    } catch (error) {
      console.error("Prediction failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isTeamA = lockedVote === match.teamA;
  const isTeamB = lockedVote === match.teamB;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-panel p-6 relative overflow-hidden transition-all ${lockedVote ? 'border-brand-500/50 shadow-[0_0_20px_rgba(59,130,246,0.1)]' : 'hover:border-white/20'}`}
    >
      {/* Background glow if locked */}
      {lockedVote && <div className="absolute inset-0 bg-brand-500/5 pointer-events-none" />}

      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 rounded text-xs font-black tracking-wider bg-brand-500/20 text-brand-400 border border-brand-500/30 uppercase">
            LIVE PREDICTION
          </span>
          <span className="text-xs text-slate-400 font-bold tracking-wider">{matchDate}</span>
        </div>
        <div className="text-right">
          <span className="text-sm font-bold text-accent-400 flex items-center gap-1">
            <Target className="w-4 h-4" /> {match.rewardXP} XP
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        
        {/* TEAM A */}
        <button 
          onClick={() => handleVote(match.teamA)}
          disabled={lockedVote !== null || isSubmitting}
          className={`flex-1 p-4 rounded-xl border transition-all flex flex-col items-center gap-3 relative overflow-hidden group ${
            isTeamA 
              ? 'bg-brand-600 border-brand-400 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' 
              : lockedVote 
                ? 'bg-dark-900 border-white/5 opacity-50 grayscale'
                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-brand-500/50'
          }`}
        >
          {isTeamA && <div className="absolute inset-0 bg-white/10 animate-pulse pointer-events-none" />}
          <Shield className={`w-8 h-8 ${isTeamA ? 'text-white' : 'text-brand-400 group-hover:scale-110 transition-transform'}`} />
          <span className="font-black text-lg text-center leading-tight">{match.teamA}</span>
        </button>

        {/* VS Badge */}
        <div className="flex flex-col items-center justify-center shrink-0 w-12 h-12 rounded-full bg-dark-900 border border-white/10 z-10 shadow-lg">
          <Swords className="w-5 h-5 text-slate-500" />
        </div>

        {/* TEAM B */}
        <button 
          onClick={() => handleVote(match.teamB)}
          disabled={lockedVote !== null || isSubmitting}
          className={`flex-1 p-4 rounded-xl border transition-all flex flex-col items-center gap-3 relative overflow-hidden group ${
            isTeamB 
              ? 'bg-accent-600 border-accent-400 text-white shadow-[0_0_15px_rgba(245,158,11,0.5)]' 
              : lockedVote 
                ? 'bg-dark-900 border-white/5 opacity-50 grayscale'
                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-accent-500/50'
          }`}
        >
          {isTeamB && <div className="absolute inset-0 bg-white/10 animate-pulse pointer-events-none" />}
          <Shield className={`w-8 h-8 ${isTeamB ? 'text-white' : 'text-accent-400 group-hover:scale-110 transition-transform'}`} />
          <span className="font-black text-lg text-center leading-tight">{match.teamB}</span>
        </button>

      </div>

      {/* Lock Status */}
      {lockedVote && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-6 pt-4 border-t border-white/10 flex items-center justify-center gap-2 text-sm font-bold text-slate-300"
        >
          <Lock className="w-4 h-4 text-brand-400" />
          PREDICTION LOCKED: <span className={isTeamA ? 'text-brand-400' : 'text-accent-400'}>{lockedVote}</span>
        </motion.div>
      )}
    </motion.div>
  );
}
