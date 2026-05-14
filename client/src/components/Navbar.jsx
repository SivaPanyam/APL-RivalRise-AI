import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Trophy, Target, LogOut, Swords, Medal, Bot, Gift, User, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar() {
  const { currentUser, logout, userData } = useAuth();
  const location = useLocation();

  if (!currentUser) return null;

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: Trophy },
    { name: 'Missions', path: '/missions', icon: Target },
    { name: 'Arena', path: '/tournaments', icon: Swords },
    { name: 'Fanzone', path: '/fanzone', icon: Users },
    { name: 'Rank', path: '/leaderboards', icon: Medal },
    { name: 'Coach', path: '/coach', icon: Bot },
    { name: 'Vault', path: '/vault', icon: Gift },
  ];

  return (
    <nav className="glass-panel mt-4 mx-4 md:mx-8 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between sticky top-4 z-50 gap-4">
      <div className="flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-500/20 flex items-center justify-center neon-border">
            <Trophy className="text-brand-400 w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-wider neon-text hidden lg:block">RIVALRISE</span>
        </Link>
      </div>

      <div className="flex items-center overflow-x-auto gap-6 pb-2 md:pb-0 scrollbar-hide">
        {navLinks.map((link) => (
          <Link 
            key={link.path}
            to={link.path} 
            className={`flex items-center gap-2 whitespace-nowrap transition-colors hover:text-brand-400 relative ${isActive(link.path) ? 'text-brand-400 font-semibold' : 'text-slate-400'}`}
          >
            <link.icon className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">{link.name}</span>
            {isActive(link.path) && (
               <motion.div layoutId="nav-pill" className="absolute -bottom-4 w-full h-1 bg-brand-500 rounded-t-lg" />
            )}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-4 hidden md:flex">
        <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="text-right">
            <p className="text-sm font-semibold text-white">{userData?.username || 'Player'}</p>
            <p className="text-xs text-brand-400">Lvl {userData?.level || 1}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-600 to-accent-500 p-[2px]">
            <div className="w-full h-full bg-dark-900 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-white">{userData?.username?.charAt(0).toUpperCase() || 'P'}</span>
            </div>
          </div>
        </Link>
        <button 
          onClick={logout}
          className="p-2 rounded-full hover:bg-white/5 transition-colors"
          title="Logout"
        >
          <LogOut className="w-5 h-5 text-slate-400 hover:text-white" />
        </button>
      </div>
    </nav>
  );
}
