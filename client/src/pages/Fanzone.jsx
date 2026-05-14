import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Hash, Send, ShieldCheck, Users, Trophy, MessageSquare } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import SocialService from '../services/socialService';

const CHANNELS = [
  { id: 'global-banter', name: 'Global Banter', icon: MessageSquare },
  { id: 'match-predictions', name: 'Match Predictions', icon: Trophy },
  { id: 'team-tactics', name: 'Team Tactics', icon: ShieldCheck }
];

export default function Fanzone() {
  const { currentUser, userData } = useAuth();
  const [activeChannel, setActiveChannel] = useState(CHANNELS[0].id);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  // Subscribe to real-time messages
  useEffect(() => {
    setMessages([]); // Clear messages when switching channels
    const unsubscribe = SocialService.subscribeToMessages(activeChannel, (newMessages) => {
      setMessages(newMessages);
      scrollToBottom();
    });

    return () => unsubscribe();
  }, [activeChannel]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !currentUser || !userData) return;

    setIsSending(true);
    try {
      await SocialService.sendMessage(activeChannel, {
        text: inputText,
        userId: currentUser.uid,
        username: userData.username || 'Anonymous Fan',
        userLevel: userData.level || 1,
        userAvatar: userData.username?.charAt(0).toUpperCase() || 'F',
      });
      setInputText('');
      scrollToBottom();
    } catch (error) {
      console.error("Failed to send:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] max-w-7xl mx-auto w-full gap-4 md:gap-6 pt-4">
      
      {/* Sidebar - Channels */}
      <div className="hidden md:flex flex-col w-64 glass-panel border-r border-white/5 overflow-hidden">
        <div className="p-4 border-b border-white/5 bg-dark-900/50">
          <h2 className="text-lg font-black uppercase tracking-widest text-slate-300 flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-400" />
            The Fanzone
          </h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {CHANNELS.map(channel => (
            <button
              key={channel.id}
              onClick={() => setActiveChannel(channel.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all ${
                activeChannel === channel.id 
                  ? 'bg-brand-500/20 text-white font-bold border border-brand-500/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`}
            >
              <channel.icon className={`w-5 h-5 ${activeChannel === channel.id ? 'text-brand-400' : 'text-slate-500'}`} />
              <span className="truncate">#{channel.name}</span>
              
              {/* Fake live activity indicator */}
              {activeChannel !== channel.id && Math.random() > 0.7 && (
                <div className="w-2 h-2 rounded-full bg-accent-500 animate-pulse ml-auto" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col glass-panel overflow-hidden border border-white/5 relative">
        
        {/* Chat Header */}
        <div className="p-4 border-b border-white/5 bg-dark-900/50 flex items-center justify-between z-10 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="md:hidden">
              <select 
                value={activeChannel}
                onChange={(e) => setActiveChannel(e.target.value)}
                className="bg-dark-900 border border-white/10 text-white rounded-lg p-2 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
              >
                {CHANNELS.map(c => <option key={c.id} value={c.id}>#{c.name}</option>)}
              </select>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <Hash className="w-6 h-6 text-slate-500" />
              <h2 className="text-xl font-bold text-white">
                {CHANNELS.find(c => c.id === activeChannel)?.name}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            LIVE
          </div>
        </div>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide flex flex-col relative">
          {messages.length === 0 ? (
            <div className="m-auto text-center p-8">
              <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 font-medium">No messages yet. Be the first to start the banter!</p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex gap-4 group ${msg.userId === currentUser?.uid ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-lg ${
                  msg.userId === currentUser?.uid 
                    ? 'bg-gradient-to-br from-brand-500 to-accent-600 text-white' 
                    : 'bg-dark-700 text-slate-300 border border-white/10'
                }`}>
                  {msg.userAvatar}
                </div>
                
                {/* Message Body */}
                <div className={`flex flex-col max-w-[75%] ${msg.userId === currentUser?.uid ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-sm font-bold text-slate-200">{msg.username}</span>
                    <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-400 border border-brand-500/30">
                      LVL {msg.userLevel}
                    </span>
                    <span className="text-xs text-slate-500 ml-1">
                      {msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Just now'}
                    </span>
                  </div>
                  
                  <div className={`px-4 py-2.5 rounded-2xl text-sm ${
                    msg.userId === currentUser?.uid
                      ? 'bg-brand-600 text-white rounded-tr-sm shadow-[0_4px_15px_rgba(59,130,246,0.2)]'
                      : 'bg-dark-800 text-slate-200 border border-white/5 rounded-tl-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              </motion.div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t border-white/5 bg-dark-900/80 backdrop-blur-xl shrink-0">
          <form onSubmit={handleSendMessage} className="relative flex items-center">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Message #${CHANNELS.find(c => c.id === activeChannel)?.name.toLowerCase().replace(' ', '-')}`}
              className="w-full bg-dark-950 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isSending}
              className="absolute right-2 p-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg disabled:opacity-50 disabled:hover:bg-brand-600 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
        
      </div>
    </div>
  );
}
