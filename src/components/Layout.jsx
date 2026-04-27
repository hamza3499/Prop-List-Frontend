import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PremiumNavbar from './PremiumNavbar';
import AuthNavbar from './AuthNavbar';
import CustomCursor from './CustomCursor';
import PremiumFooter from './PremiumFooter';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // ─── 1. Redirect to Home on Refresh ───
  React.useEffect(() => {
    // Detect browser refresh using modern performance API
    const [navigationEntry] = performance.getEntriesByType('navigation');
    if (navigationEntry && navigationEntry.type === 'reload') {
       if (location && location.pathname !== '/') {
         navigate('/');
       }
    }
  }, []); // Only on mount

  // ─── 2. Scroll to Top on Page Switch ───
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  // ─── 3. Inactivity Logout (30 seconds) ───
  React.useEffect(() => {
    const INACTIVITY_LIMIT = 30 * 1000; // 30 seconds
    let timeoutId;

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        // Log out user
        const token = localStorage.getItem('token');
        if (token) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          alert('You have been logged out due to 30 seconds of inactivity.');
          navigate('/login');
        }
      }, INACTIVITY_LIMIT);
    };

    // Events to track activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => document.addEventListener(event, resetTimer));

    // Initial start
    resetTimer();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      events.forEach(event => document.removeEventListener(event, resetTimer));
    };
  }, [navigate]);

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className="min-h-screen relative flex flex-col">
      <div className="grain-overlay" />
      <CustomCursor />
      
      {isAuthPage ? <AuthNavbar /> : <PremiumNavbar />}
      
      <main className="flex-grow pt-24 pb-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="gpu-accelerated"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {!isAuthPage && <PremiumFooter />}
    </div>
  );
};

export default Layout;
