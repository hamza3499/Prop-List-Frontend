import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { Loader2 } from 'lucide-react';

const cn = (...inputs) => twMerge(clsx(inputs));

const GlowButton = ({ children, onClick, className, variant = 'primary', type = 'button', disabled = false, loading = false, loadingText }) => {
  const variants = {
    primary: "bg-gradient-to-r from-[#ff2b2b] to-[#e7131d] text-white shadow-lg shadow-primary/20",
    secondary: "bg-transparent border-2 border-outline-variant dark:border-white/10 text-on-surface dark:text-white hover:bg-primary/5 hover:border-primary transition-all",
    tertiary: "bg-transparent text-on-surface hover:text-primary uppercase font-black text-xs tracking-[0.2em]",
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={!disabled && !loading ? { 
        scale: 1.05, 
        y: -2,
        boxShadow: "0 20px 40px -12px rgba(255, 43, 43, 0.3)"
      } : {}}
      whileTap={!disabled && !loading ? { scale: 0.95 } : {}}
      className={cn(
        "relative px-10 py-4 rounded-2xl font-bold transition-all duration-300 overflow-hidden group flex items-center justify-center gap-3",
        variants[variant],
        (disabled || loading) && "opacity-50 cursor-not-allowed grayscale-[0.3]",
        className
      )}
    >
      {/* Dynamic Glow Overlay */}
      {variant === 'primary' && !disabled && !loading && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 bg-white/10 blur-2xl" />
          <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out" />
        </div>
      )}

      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="animate-pulse">{loadingText || 'Processing...'}</span>
          </>
        ) : children}
      </span>
    </motion.button>
  );
};

export default GlowButton;
