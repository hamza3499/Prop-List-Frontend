import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';
import GlowButton from '../components/GlowButton';
import CoolText from '../components/CoolText';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface dark:bg-black flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-primary/5 blur-[120px] pointer-events-none" />
      
      <div className="max-w-2xl w-full text-center space-y-12 relative z-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0, rotate: -15 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-32 h-32 bg-primary/10 rounded-[32px] flex items-center justify-center mx-auto text-primary shadow-2xl border border-primary/20"
        >
          <Compass size={64} strokeWidth={1} />
        </motion.div>

        <div className="space-y-4">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-1 rounded-full bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-[0.3em]"
          >
            Navigation Error: 404
          </motion.div>
          <h1 className="text-6xl md:text-8xl font-display font-black dark:text-white leading-tight">
            <CoolText text="Lost in" /><br />
            <span className="text-primary italic">Space.</span>
          </h1>
          <p className="text-on-surface/50 dark:text-white/40 text-lg md:text-xl font-body max-w-lg mx-auto">
            The property or page you are looking for has been moved or exists only in our archival chronicles.
          </p>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col md:flex-row items-center justify-center gap-6"
        >
          <GlowButton 
            onClick={() => navigate('/')}
            className="px-12 py-5 text-lg"
          >
            <ArrowLeft size={20} className="mr-2" /> Return to Home
          </GlowButton>
          <GlowButton 
            variant="secondary"
            onClick={() => navigate(-1)}
            className="px-12 py-5 text-lg"
          >
            Go Back
          </GlowButton>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-primary/10 rounded-full pointer-events-none animate-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-primary/5 rounded-full pointer-events-none" />
    </div>
  );
};

export default NotFound;
