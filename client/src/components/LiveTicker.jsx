import React from 'react';
import { motion } from 'framer-motion';
import { Radio, Zap } from 'lucide-react';

const LIVE_HIGHLIGHTS = [
  "Cyber Ninjas take the lead in Round 3 with a triple kill!",
  "Neon Dragons secure the Baron and push mid.",
  "Quantum Strikers vs Plasma FC: Live in 5 minutes.",
  "RivalRise AI: Season 1 Rankings updated.",
  "Apex Sentinels pull off a miracle defense!"
];

export default function LiveTicker() {
  return (
    <div className="bg-dark-900/50 border-b border-white/5 py-2 overflow-hidden whitespace-nowrap relative">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-dark-900 to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-dark-900 to-transparent z-10" />
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-4 shrink-0 border-r border-white/10">
          <Radio className="w-4 h-4 text-red-500 animate-pulse" />
          <span className="text-[10px] font-black tracking-widest text-white uppercase">Live Feed</span>
        </div>
        
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="flex gap-12 items-center"
        >
          {LIVE_HIGHLIGHTS.concat(LIVE_HIGHLIGHTS).map((text, i) => (
            <div key={i} className="flex items-center gap-2">
              <Zap className="w-3 h-3 text-brand-400" />
              <span className="text-xs font-bold text-slate-300 tracking-wide uppercase">{text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
