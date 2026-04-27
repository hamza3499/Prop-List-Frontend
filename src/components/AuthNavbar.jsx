import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Home } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

const AuthNavbar = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const isLogin = location.pathname === '/login';

  return (
    <motion.nav
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
      className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-zinc-950 border-b border-outline-variant/10 dark:border-white/5 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <motion.div
            whileHover={{ rotate: 12 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center text-white shadow-md shadow-primary/20"
          >
            <Home size={16} />
          </motion.div>
          <span className="text-xl font-display font-bold tracking-tighter text-on-surface dark:text-white">
            Prop<span className="text-primary">List</span>
          </span>
        </Link>

        {/* Right — theme toggle + single CTA */}
        <div className="flex items-center gap-3">

          {/* Theme Toggle */}
          <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            className="w-9 h-9 rounded-full bg-surface-container-high dark:bg-white/5 border border-outline-variant/20 dark:border-white/10 flex items-center justify-center text-on-surface/50 dark:text-white/50 hover:text-primary hover:border-primary/30 transition-all duration-200"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={theme}
                initial={{ rotate: -30, opacity: 0, scale: 0.7 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 30, opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.2 }}
              >
                {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
              </motion.div>
            </AnimatePresence>
          </motion.button>

          {/* Context CTA */}
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link
              to={isLogin ? '/signup' : '/login'}
              className="px-5 py-2 rounded-xl text-sm font-bold text-white shadow-md shadow-primary/20 hover:shadow-primary/40 transition-all duration-200"
              style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
};

export default AuthNavbar;
