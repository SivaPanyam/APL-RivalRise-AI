import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Target, Zap, Activity, Shield, Crown, Settings, PenTool, Sparkles, Loader2, Fingerprint, Bell } from 'lucide-react';
import { pageVariants } from '../animations/variants';
import { getFanRank, getLevelProgress, calculateLevelFromXp, calculateXpForLevel } from '../utils/progression';
import TournamentService from '../services/tournamentService';
import DatabaseService, { COLLECTIONS } from '../services/dbService';
import ApiService from '../services/api';
import FCMService from '../services/fcmService';

export default function FanProfile() {
  const { userData, currentUser } = useAuth();
  const [predictionHistory, setPredictionHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [favTeam, setFavTeam] = useState('');
  const [aiIdentity, setAiIdentity] = useState(null);
  const [isGeneratingIdentity, setIsGeneratingIdentity] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [fcmToken, setFcmToken] = useState(null);

  useEffect(() => {
    async function loadProfileData() {
      if (currentUser && userData) {
        setFavTeam(userData.sportPreference || '');
        if (userData.aiIdentity) {
          setAiIdentity(userData.aiIdentity);
        }
        if (userData.fcmToken) {
          setFcmToken(userData.fcmToken);
          setNotificationsEnabled(true);
        }
        try {
          const history = await TournamentService.getUserPredictions(currentUser.uid);
          // Sort by newest first
          history.sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis());
          setPredictionHistory(history);
        } catch (err) {
          console.error("Failed to fetch prediction history", err);
        }
      }
      setLoading(false);
    }
    loadProfileData();
  }, [currentUser, userData]);

  const handleSavePreferences = async () => {
    if (!currentUser) return;
    try {
      await DatabaseService.update(COLLECTIONS.USERS, currentUser.uid, {
        sportPreference: favTeam
      });
      setIsEditing(false);
      // Note: Ideally we update local AuthContext state here, but relying on refresh or Realtime listener in future
    } catch (err) {
      console.error("Failed to update preferences", err);
    }
  };

  const handleGenerateIdentity = async () => {
    if (!currentUser || !userData) return;
    setIsGeneratingIdentity(true);
    try {
      const identity = await ApiService.analyzeFanIdentity(userData, predictionHistory);
      setAiIdentity(identity);
      
      // Persist to Firestore
      await DatabaseService.update(COLLECTIONS.USERS, currentUser.uid, {
        aiIdentity: identity
      });
    } catch (error) {
      console.error("Failed to generate identity", error);
    } finally {
      setIsGeneratingIdentity(false);
    }
  };

  const handleEnableNotifications = async () => {
    try {
      const token = await FCMService.requestNotificationPermission();
      setFcmToken(token);
      setNotificationsEnabled(true);
      
      if (currentUser) {
        await DatabaseService.update(COLLECTIONS.USERS, currentUser.uid, {
          fcmToken: token
        });
      }
    } catch (error) {
      console.error("Failed to enable notifications", error);
      alert("Failed to enable notifications. Please check browser permissions.");
    }
  };

  const handleTestSmartAlert = async () => {
    if (!currentUser) return;
    try {
      const userContext = {
        username: userData.username,
        level: calculateLevelFromXp(userData.xp || 0),
        streak: userData.streak || 0,
        archetype: aiIdentity?.archetype || 'Loyal Supporter'
      };
      
      await FCMService.triggerSmartAlert(userContext, 'STREAK_REMINDER', fcmToken);
      alert("Smart Alert triggered! Check your terminal logs for the mocked dispatch.");
    } catch (error) {
      console.error("Failed to trigger smart alert", error);
    }
  };

  const userXp = userData?.xp || 0;
  const currentLevel = calculateLevelFromXp(userXp);
  const nextLevelXp = calculateXpForLevel(currentLevel + 1);
  const currentRank = getFanRank(currentLevel);
  const progressPercent = getLevelProgress(userXp);

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="flex-1 py-4 sm:py-8 max-w-6xl mx-auto w-full">
      
      {/* Identity Header */}
      <div className="glass-panel p-8 md:p-12 mb-8 relative overflow-hidden group">
        <div className={`absolute -top-32 -right-32 w-96 h-96 rounded-full blur-[100px] opacity-20 pointer-events-none transition-colors duration-1000 ${currentRank.bg.replace('/10', '')}`} />
        
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className={`w-32 h-32 rounded-2xl ${currentRank.bg} ${currentRank.border} border-4 flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.5)] transform group-hover:scale-105 transition-transform shrink-0`}>
             <span className={`text-6xl font-black ${currentRank.color} drop-shadow-lg`}>
               {userData?.username?.charAt(0).toUpperCase() || 'P'}
             </span>
          </div>

          <div className="flex-1 w-full text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-black mb-2 tracking-tight">
              {userData?.username || 'Player'}
            </h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-6">
              <span className={`px-4 py-1.5 rounded-full text-sm font-black uppercase tracking-widest border flex items-center gap-2 ${currentRank.bg} ${currentRank.color} ${currentRank.border}`}>
                <Crown className="w-4 h-4" /> {currentRank.name}
              </span>
              <span className="text-slate-400 font-bold bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
                Level {currentLevel}
              </span>
            </div>

            {/* Large XP Bar */}
            <div className="space-y-2 max-w-2xl">
              <div className="flex justify-between text-sm font-bold">
                <span className="text-slate-300">{userXp} XP</span>
                <span className="text-slate-500">{nextLevelXp} XP to Level {currentLevel + 1}</span>
              </div>
              <div className="h-4 bg-dark-900 rounded-full overflow-hidden border border-white/10 relative shadow-inner">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className={`h-full bg-gradient-to-r from-brand-600 to-brand-400 relative`}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Stats & Preferences */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-panel p-4 text-center">
              <Target className="w-6 h-6 text-brand-400 mx-auto mb-2 opacity-80" />
              <div className="text-3xl font-black text-white mb-1">{predictionHistory.length}</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Predictions</div>
            </div>
            <div className="glass-panel p-4 text-center">
              <Activity className="w-6 h-6 text-accent-400 mx-auto mb-2 opacity-80" />
              <div className="text-3xl font-black text-white mb-1">TBD</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Win Rate</div>
            </div>
            <div className="glass-panel p-4 text-center col-span-2 flex items-center justify-between">
              <div className="text-left">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" /> Active Streak
                </div>
                <div className="text-3xl font-black text-white">{userData?.streak || 0} <span className="text-sm text-slate-400">Days</span></div>
              </div>
              <div className="w-12 h-12 rounded-full border-4 border-amber-500/30 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Settings / Preferences */}
          <div className="glass-panel p-6 border-brand-500/20">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-black text-slate-500 tracking-widest uppercase flex items-center gap-2">
                <Settings className="w-4 h-4" /> Preferences
              </h3>
              {!isEditing && (
                <button onClick={() => setIsEditing(true)} className="text-brand-400 hover:text-brand-300 transition-colors">
                  <PenTool className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Primary Email</label>
                <div className="bg-dark-900 px-4 py-3 rounded-lg border border-white/5 text-slate-400 font-medium cursor-not-allowed">
                  {userData?.email || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Favorite Team / Faction</label>
                {isEditing ? (
                  <div className="space-y-3">
                    <input 
                      type="text" 
                      value={favTeam} 
                      onChange={(e) => setFavTeam(e.target.value)}
                      placeholder="e.g., Cyber Ninjas"
                      className="w-full bg-dark-900 border border-brand-500/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-400 transition-colors"
                    />
                    <div className="flex gap-2">
                      <button onClick={handleSavePreferences} className="flex-1 py-2 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-lg transition-colors">Save</button>
                      <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white font-bold rounded-lg transition-colors">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-dark-900 px-4 py-3 rounded-lg border border-white/5 text-brand-300 font-bold">
                    {userData?.sportPreference || 'Unassigned Faction'}
                  </div>
                )}
              </div>
              
              <div className="pt-4 border-t border-white/5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Push Notifications</label>
                {notificationsEnabled ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20">
                      <Bell className="w-4 h-4" /> Enabled (FCM Active)
                    </div>
                    <button 
                      onClick={handleTestSmartAlert}
                      className="w-full py-2 bg-white/5 hover:bg-white/10 text-brand-300 border border-brand-500/30 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors"
                    >
                      <Sparkles className="w-4 h-4" /> Test Smart Alert
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={handleEnableNotifications}
                    className="w-full py-3 bg-brand-600/20 hover:bg-brand-600/40 text-brand-300 border border-brand-500/30 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Bell className="w-4 h-4" /> Enable Smart Alerts
                  </button>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Activity & History */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* AI Identity Engine Card */}
          <div className="glass-panel p-6 bg-gradient-to-br from-white/[0.02] to-accent-500/[0.05] border-accent-500/20 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 text-accent-500/10 pointer-events-none">
              <Fingerprint className="w-64 h-64" />
            </div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-sm font-black text-accent-400 tracking-widest uppercase flex items-center gap-2">
                  <Fingerprint className="w-4 h-4" /> AI Identity Analysis
                </h3>
                
                <button 
                  onClick={handleGenerateIdentity}
                  disabled={isGeneratingIdentity}
                  className="px-4 py-2 bg-accent-600 hover:bg-accent-500 disabled:opacity-50 disabled:hover:bg-accent-600 text-white text-xs font-bold uppercase tracking-widest rounded-lg flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(236,72,153,0.3)] disabled:shadow-none"
                >
                  {isGeneratingIdentity ? (
                    <><Loader2 className="w-3 h-3 animate-spin" /> Analyzing</>
                  ) : (
                    <><Sparkles className="w-3 h-3" /> {aiIdentity ? 'Recalculate Identity' : 'Generate Identity'}</>
                  )}
                </button>
              </div>

              {aiIdentity ? (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-4">
                    <div className="px-4 py-2 bg-dark-900 border border-accent-500/50 rounded-xl text-accent-300 font-black tracking-widest uppercase shadow-[0_0_20px_rgba(236,72,153,0.15)]">
                      {aiIdentity.archetype}
                    </div>
                    <div className="flex-1 h-2 bg-dark-900 rounded-full overflow-hidden border border-white/10">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${aiIdentity.tacticalScore}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="h-full bg-gradient-to-r from-accent-600 to-accent-400"
                      />
                    </div>
                    <div className="text-xs font-bold text-slate-500 w-16 text-right">
                      {aiIdentity.tacticalScore} / 100
                    </div>
                  </div>
                  <p className="text-slate-300 leading-relaxed font-medium text-lg border-l-2 border-accent-500 pl-4 py-1 italic">
                    "{aiIdentity.narrative}"
                  </p>
                </div>
              ) : (
                <p className="text-slate-400 leading-relaxed font-medium">
                  Your behavioral data is raw. Initiate the tactical assessment to uncover your true fan archetype and receive a personalized engagement narrative.
                </p>
              )}
            </div>
          </div>

          <div className="glass-panel p-6 bg-gradient-to-br from-white/[0.03] to-brand-500/[0.05] border-brand-500/20">
            <h3 className="text-sm font-black text-brand-400 tracking-widest uppercase mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4" /> Tactical Assessment
            </h3>
            <p className="text-slate-300 leading-relaxed font-medium">
              "You are showing signs of becoming a true <span className="text-white font-bold">{currentRank.name}</span>. Your active streak demonstrates dedication. Keep participating in prediction battles to solidify your standing in the global rankings."
            </p>
          </div>

          <div className="glass-panel p-0 overflow-hidden flex flex-col h-[500px]">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
              <h2 className="text-lg font-black flex items-center gap-2">
                <Shield className="w-5 h-5 text-accent-400" /> Battle Log
              </h2>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : predictionHistory.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-500 font-medium">
                  No predictions made yet. Head to the Arena!
                </div>
              ) : (
                predictionHistory.map((pred) => {
                  const dateStr = pred.createdAt ? pred.createdAt.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Recent';
                  return (
                    <div key={pred.id} className="p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-dark-900 border border-white/10 flex items-center justify-center shrink-0">
                          <Target className="w-4 h-4 text-brand-400" />
                        </div>
                        <div>
                          <p className="text-white font-bold">Predicted <span className="text-accent-400">{pred.predictedWinner}</span> to win.</p>
                          <p className="text-xs text-slate-500 font-medium mt-0.5">Match ID: {pred.matchId}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{dateStr}</div>
                        <div className={`text-sm font-black mt-1 ${pred.status === 'pending' ? 'text-amber-400' : 'text-slate-500'}`}>
                          {pred.status.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>

      </div>
    </motion.div>
  );
}
