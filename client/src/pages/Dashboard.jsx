import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Flame, Trophy, Target, Activity, PlayCircle, Clock } from 'lucide-react';
import LiveTicker from '../components/LiveTicker';

export default function Dashboard() {
  const { userData } = useAuth();

  const stats = [
    { label: 'Current Streak', value: `${userData?.streak || 0} Days`, icon: Flame, color: 'text-orange-500' },
    { label: 'Total XP', value: userData?.xp || 0, icon: Activity, color: 'text-brand-400' },
    { label: 'Missions Completed', value: userData?.missionsCompleted || 0, icon: Target, color: 'text-green-400' },
    { label: 'Global Rank', value: '#4,281', icon: Trophy, color: 'text-accent-400' },
  ];

  return (
    <div className="flex-1">
      <LiveTicker />
      
      <div className="py-8">
        <header className="mb-10">
          <h1 className="text-4xl font-bold mb-2">Welcome back, <span className="neon-text">{userData?.username}</span></h1>
          <p className="text-slate-400">Your AI-generated training schedule is ready.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, i) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-panel p-6 flex items-center gap-4 relative overflow-hidden group"
            >
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-brand-500/10 transition-colors" />
              <div className={`p-3 rounded-xl bg-dark-900 border border-white/5 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-slate-400">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 glass-panel p-8"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Activity Heatmap</h2>
              <select className="bg-dark-900 border border-white/10 rounded px-3 py-1 text-sm outline-none focus:border-brand-500">
                <option>This Week</option>
                <option>This Month</option>
              </select>
            </div>
            <div className="h-48 flex items-end gap-2">
              {/* Placeholder for a chart */}
              {[40, 70, 30, 90, 50, 80, 100].map((h, i) => (
                <div key={i} className="flex-1 bg-dark-900 rounded-t-sm relative group">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: i * 0.1 + 0.5, type: 'spring' }}
                    className={`absolute bottom-0 w-full rounded-t-sm ${h > 80 ? 'bg-brand-500 neon-border' : 'bg-brand-500/40'}`}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-xs text-slate-500 font-bold tracking-widest">
              <span>MON</span>
              <span>TUE</span>
              <span>WED</span>
              <span>THU</span>
              <span>FRI</span>
              <span>SAT</span>
              <span>SUN</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-panel p-8 flex flex-col items-center justify-center text-center"
          >
            <div className="w-32 h-32 rounded-full border-4 border-dark-900 shadow-[0_0_15px_rgba(14,165,233,0.5)] p-1 mb-4 relative">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="46" fill="transparent" stroke="#1e293b" strokeWidth="8" />
                <motion.circle 
                  cx="50" cy="50" r="46" fill="transparent" stroke="#0ea5e9" strokeWidth="8" 
                  strokeDasharray="289" strokeDashoffset={289 - (289 * 65) / 100} 
                  strokeLinecap="round"
                  initial={{ strokeDashoffset: 289 }}
                  animate={{ strokeDashoffset: 289 - (289 * 65) / 100 }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold">Lvl {userData?.level || 1}</span>
              </div>
            </div>
            <h3 className="text-xl font-bold mb-1">Elite Challenger</h3>
            <p className="text-sm text-slate-400 mb-6">650 / 1000 XP to Level {userData?.level ? userData.level + 1 : 2}</p>
            <button className="w-full py-2 bg-white/5 hover:bg-white/10 rounded border border-white/10 transition-colors text-sm font-semibold">
              View Full Profile
            </button>
          </motion.div>
        </div>

        {/* Live Match Highlights Section */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <PlayCircle className="w-6 h-6 text-brand-400" /> Match Highlights
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Triple Kill by 'Ghost'", team: "Cyber Ninjas", time: "2m ago", img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=400&auto=format&fit=crop" },
            { title: "Incredible Base Defense", team: "Apex Sentinels", time: "15m ago", img: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=400&auto=format&fit=crop" },
            { title: "Perfect Team Wipe", team: "Neon Dragons", time: "1h ago", img: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=400&auto=format&fit=crop" },
          ].map((h, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 + 0.5 }}
              className="glass-panel p-0 overflow-hidden group cursor-pointer"
            >
              <div className="h-40 relative overflow-hidden">
                <img src={h.img} alt={h.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900 to-transparent" />
                <div className="absolute bottom-3 left-4 flex items-center gap-2">
                   <PlayCircle className="w-5 h-5 text-brand-400" />
                   <span className="text-[10px] font-black tracking-widest text-white uppercase">Watch Reel</span>
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-bold text-white mb-1">{h.title}</h4>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-brand-400 font-bold uppercase">{h.team}</span>
                  <span className="text-[10px] text-slate-500 flex items-center gap-1 font-bold">
                    <Clock className="w-3 h-3" /> {h.time}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
