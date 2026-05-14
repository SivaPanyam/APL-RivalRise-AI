import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-[100px] pointer-events-none" />
      
      <Navbar />
      <main className="flex-1 flex flex-col p-4 sm:p-8 max-w-7xl mx-auto w-full relative z-10">
        <AnimatePresence mode="wait">
          <Outlet />
        </AnimatePresence>
      </main>
    </div>
  );
}
