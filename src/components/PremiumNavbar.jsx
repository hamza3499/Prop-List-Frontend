import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, PlusSquare, User, LogOut, Menu, X, Sun, Moon, Heart } from 'lucide-react';
import { getToken } from '../services/api';
import { useTheme } from '../hooks/useTheme';

const PremiumNavbar = () => {
  const navigate = useNavigate();
  const token = getToken();
  const user = token ? true : false;

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setIsMobileMenuOpen(false); }, [location.pathname]);

  const navLinks = [
    { path: '/',               label: 'Home',         icon: Home },
    { path: '/add-property',   label: 'Add Property', icon: PlusSquare, authOnly: true },
    { path: '/favorites',      label: 'Favorites',    icon: Heart },
    { path: '/profile',        label: 'Profile',      icon: User,       authOnly: true },
  ];

  const visibleLinks = navLinks.filter(l => !l.authOnly || user);
  const isAuthPage = ['/login', '/signup'].includes(location.pathname);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        scrolled ? 'pt-2 pb-2' : 'pt-4 pb-4'
      }`}
    >
      {/* Floating pill container */}
      <div
        className={`container mx-auto px-4 transition-all duration-500 ${
          scrolled ? 'max-w-5xl' : 'max-w-7xl'
        }`}
      >
        <div
          className={`flex justify-between items-center px-5 rounded-2xl transition-all duration-500 ${
            scrolled
              ? 'py-3 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl border border-outline-variant/10 dark:border-white/5 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.15)] dark:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)]'
              : 'py-4 bg-white/40 dark:bg-black/20 backdrop-blur-xl border border-white/10 dark:border-white/5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]'
          }`}
        >
          {/* ── Logo ────────────────────────────────────────── */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <motion.div
              whileHover={{ rotate: 12, scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30"
            >
              <Home size={20} />
            </motion.div>
            <span className={`text-xl font-display font-bold tracking-tighter transition-colors ${isAuthPage ? 'text-white' : 'text-on-surface dark:text-white'}`}>
              Prop<span className="text-primary">List</span>
            </span>
          </Link>

          {/* ── Desktop Links ───────────────────────────────── */}
          <div className="hidden md:flex items-center gap-1">
            {visibleLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 group ${
                    isActive
                      ? 'text-primary'
                      : 'text-on-surface/60 dark:text-white/50 hover:text-on-surface dark:hover:text-white hover:bg-surface-container-high/50 dark:hover:bg-white/5'
                  }`}
                >
                  {/* Active pill background */}
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-primary/8 dark:bg-primary/10 rounded-xl"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  {/* Active animated underline */}
                  {isActive && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute bottom-1 left-4 right-4 h-0.5 bg-primary rounded-full"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* ── Right Controls ──────────────────────────────── */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              className="w-9 h-9 rounded-full bg-surface-container-high/60 dark:bg-white/5 border border-outline-variant/10 dark:border-white/5 flex items-center justify-center text-on-surface/60 dark:text-white/40 hover:text-primary hover:border-primary/30 hover:shadow-[0_0_12px_rgba(220,38,38,0.2)] transition-all duration-300"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={theme}
                  initial={{ rotate: -30, opacity: 0, scale: 0.7 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 30, opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.25 }}
                >
                  {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
                </motion.div>
              </AnimatePresence>
            </motion.button>

            {user ? (
              <motion.button
                onClick={logout}
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-on-surface/60 dark:text-white/40 border border-outline-variant/10 dark:border-white/5 hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
              >
                <LogOut size={15} />
                Logout
              </motion.button>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-bold text-on-surface/60 dark:text-white/40 hover:text-primary transition-colors duration-300 px-3 py-2"
                >
                  Login
                </Link>
                <motion.div whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/signup"
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-300"
                    style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%)' }}
                  >
                    Sign Up
                  </Link>
                </motion.div>
              </div>
            )}
          </div>

          {/* ── Mobile Menu Button ──────────────────────────── */}
          <button
            className="md:hidden w-9 h-9 rounded-xl bg-surface-container-high/60 dark:bg-white/5 border border-outline-variant/10 dark:border-white/5 flex items-center justify-center text-on-surface dark:text-white transition-colors"
            onClick={() => setIsMobileMenuOpen(v => !v)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={isMobileMenuOpen ? 'close' : 'open'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </motion.div>
            </AnimatePresence>
          </button>
        </div>

        {/* ── Mobile Menu ─────────────────────────────────── */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.97 }}
              transition={{ duration: 0.25, ease: [0.33, 1, 0.68, 1] }}
              className="mt-2 rounded-2xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-2xl border border-outline-variant/10 dark:border-white/5 shadow-2xl p-5 flex flex-col gap-2"
            >
              {visibleLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-bold transition-all duration-200 ${
                      isActive
                        ? 'bg-primary/8 dark:bg-primary/10 text-primary'
                        : 'text-on-surface dark:text-white hover:bg-surface-container-high/50 dark:hover:bg-white/5'
                    }`}
                  >
                    <link.icon size={18} className={isActive ? 'text-primary' : 'text-on-surface/40 dark:text-white/30'} />
                    {link.label}
                    {isActive && <div className="ml-auto w-1.5 h-1.5 bg-primary rounded-full" />}
                  </Link>
                );
              })}

              <div className="w-full h-px bg-outline-variant/10 dark:bg-white/5 my-1" />

              <div className="flex items-center justify-between">
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-on-surface/60 dark:text-white/40 hover:bg-surface-container-high/50 dark:hover:bg-white/5 transition-colors"
                >
                  {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                  {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                </button>
                {user ? (
                  <button
                    onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-primary hover:bg-primary/5 transition-colors"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-2.5 rounded-xl text-sm font-bold text-on-surface/60 dark:text-white/40 hover:bg-surface-container-high/50 transition-colors">Login</Link>
                    <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-2.5 rounded-xl text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>Sign Up</Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default PremiumNavbar;
