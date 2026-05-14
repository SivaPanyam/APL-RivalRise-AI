import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, User, Send, Loader2, Zap, Shield, Target } from 'lucide-react';
import { pageVariants } from '../animations/variants';
import { useAuth } from '../contexts/AuthContext';
import { getFanRank, calculateLevelFromXp } from '../utils/progression';
import ApiService from '../services/api';

const SUGGESTED_PROMPTS = [
  "How can I level up faster?",
  "Give me a tactical breakdown of my favorite team.",
  "What is the best strategy for prediction battles?",
  "Analyze my current rank and streak."
];

export default function AICoach() {
  const { userData, currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialize with greeting
  useEffect(() => {
    if (userData && messages.length === 0) {
      const currentLevel = calculateLevelFromXp(userData.xp || 0);
      const currentRank = getFanRank(currentLevel);
      
      setMessages([
        {
          id: 'initial',
          role: 'coach',
          text: `Welcome to the war room, ${currentRank.name} ${userData.username || 'Player'}. I am your AI Tactician. I analyze the meta, crunch the numbers, and help you dominate the leaderboards. What's our strategy today?`
        }
      ]);
    }
  }, [userData]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (textToSubmit = input) => {
    if (!textToSubmit.trim() || isLoading) return;

    const userText = textToSubmit.trim();
    setInput('');
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', text: userText }]);
    setIsLoading(true);

    try {
      const currentLevel = calculateLevelFromXp(userData?.xp || 0);
      const currentRank = getFanRank(currentLevel);
      
      const userContext = {
        username: userData?.username,
        level: currentLevel,
        streak: userData?.streak,
        favTeam: userData?.sportPreference,
        rankName: currentRank.name
      };

      const response = await ApiService.chatWithCoach(userText, userContext);
      
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        role: 'coach', 
        text: response 
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        role: 'coach', 
        text: "System Error: The tactical uplink was interrupted. Please try asking again.",
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="flex-1 flex flex-col py-4 sm:py-8 max-w-5xl mx-auto w-full h-[calc(100vh-80px)]">
      
      {/* Header Info */}
      <div className="flex flex-col md:flex-row gap-6 mb-6 shrink-0">
        <div className="flex-1">
          <h1 className="text-4xl font-black mb-2 tracking-tight">AI <span className="neon-text text-brand-400">Tactician</span></h1>
          <p className="text-slate-400 font-medium">Your personal data analyst and esports coach.</p>
        </div>
        
        {/* Context Indicators */}
        <div className="flex gap-4 items-center">
          <div className="glass-panel py-2 px-4 flex items-center gap-2 border-brand-500/20 text-xs font-bold text-slate-300">
            <Shield className="w-4 h-4 text-brand-400" /> Rank Analysis Active
          </div>
          <div className="glass-panel py-2 px-4 flex items-center gap-2 border-accent-500/20 text-xs font-bold text-slate-300">
            <Zap className="w-4 h-4 text-accent-400" /> Meta Data Synced
          </div>
        </div>
      </div>
      
      {/* Chat Area */}
      <div className="flex-1 glass-panel p-0 flex flex-col overflow-hidden relative border-brand-500/20 shadow-[0_0_30px_rgba(59,130,246,0.05)]">
        
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none mix-blend-overlay" />
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar relative z-10">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center border ${
                  msg.role === 'coach' 
                    ? 'bg-brand-900 border-brand-400/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]' 
                    : 'bg-dark-800 border-white/10'
                }`}>
                  {msg.role === 'coach' ? (
                    <Bot className="w-5 h-5 text-brand-400" />
                  ) : (
                    <User className="w-5 h-5 text-slate-400" />
                  )}
                </div>

                {/* Message Bubble */}
                <div className={`max-w-[80%] rounded-2xl p-4 ${
                  msg.role === 'coach' 
                    ? msg.isError 
                      ? 'bg-red-900/20 border border-red-500/30 text-red-200'
                      : 'bg-white/[0.03] border border-white/5 text-slate-200 shadow-sm'
                    : 'bg-brand-600 text-white shadow-md'
                }`}>
                  <p className="whitespace-pre-wrap leading-relaxed font-medium text-sm md:text-base">
                    {msg.text}
                  </p>
                </div>
              </motion.div>
            ))}
            
            {isLoading && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex gap-4 flex-row"
              >
                <div className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center border bg-brand-900 border-brand-400/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                  <Bot className="w-5 h-5 text-brand-400 animate-pulse" />
                </div>
                <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-brand-400 animate-spin" />
                  <span className="text-brand-400 text-sm font-bold tracking-widest uppercase">Analyzing Data...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input Area */}
        <div className="p-4 md:p-6 bg-dark-900/80 border-t border-white/10 relative z-10 backdrop-blur-md">
          
          {/* Suggested Prompts */}
          {messages.length <= 1 && !isLoading && (
             <div className="flex flex-wrap gap-2 mb-4">
               {SUGGESTED_PROMPTS.map((prompt, idx) => (
                 <button 
                   key={idx}
                   onClick={() => handleSend(prompt)}
                   className="text-xs font-bold text-slate-400 bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1"
                 >
                   <Target className="w-3 h-3 text-brand-400" /> {prompt}
                 </button>
               ))}
             </div>
          )}

          <div className="flex gap-3">
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask for tactical advice, predictions, or strategy..." 
              className="flex-1 bg-dark-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500 transition-all resize-none h-[52px] min-h-[52px] max-h-[120px] custom-scrollbar"
              disabled={isLoading}
            />
            <button 
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="w-[52px] h-[52px] shrink-0 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 disabled:hover:bg-brand-600 rounded-xl flex items-center justify-center transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] disabled:shadow-none group"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              ) : (
                <Send className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
              )}
            </button>
          </div>
          <div className="text-center mt-2">
             <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Powered by Google Gemini 1.5 Flash</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
