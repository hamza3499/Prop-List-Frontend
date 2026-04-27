import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Search, Home as HomeIcon, ArrowRight, Sparkles, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import PremiumPropertyCard from '../components/PremiumPropertyCard';
import { getProperties, resolveImageUrl } from '../services/api';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (savedFavorites.length === 0) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    try {
      // Fetch specifically the properties in our favorites list
      const responseData = await getProperties({ ids: savedFavorites.join(','), limit: 20 });
      const data = responseData.properties || (Array.isArray(responseData) ? responseData : []);

      const favoriteProperties = data.map(p => ({
        ...p,
        location: p.city || p.location || 'Location missing',
        image: resolveImageUrl(p.images?.[0] || p.image),
        beds: p.beds || '—',
        baths: p.baths || '—',
        sqft: p.size ? `${p.size} ${p.sizeUnit || ''}`.trim() : (p.sqft || '—'),
        status: 'Active',
        price: String(p.price).startsWith('$') ? p.price : `$${Number(p.price).toLocaleString()}`
      }));
      setFavorites(favoriteProperties);
    } catch (err) {
      console.error("Error fetching favorites:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleToggleFavorite = (propId) => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const newFavorites = savedFavorites.filter(id => id !== propId);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    // Small timeout to show the "unheart" animation on the card before it disappears
    setTimeout(() => {
      setFavorites(prev => prev.filter(p => (p._id || p.id) !== propId));
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-[#050505] transition-colors duration-700">

      {/* ─── PREMIUM HERO HEADER ─── */}
      <section className="relative w-full h-[50vh] min-h-[450px] flex items-center overflow-hidden">
        {/* Background Ambience */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent dark:from-primary/20" />
          <div className="absolute top-[-20%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,rgba(255,43,43,0.03)_0%,transparent_100%)] dark:bg-[radial-gradient(circle_at_center,rgba(255,43,43,0.08)_0%,transparent_100%)]" />
          {/* Subtle noise pattern */}
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-center lg:items-end gap-12">

            {/* Typography Section */}
            <div className="flex-1 space-y-8 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] backdrop-blur-sm"
              >
                <Heart size={14} fill="currentColor" className="animate-pulse" /> Your Personal Luxury Sanctuary
              </motion.div>

              <div className="space-y-4">
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.8 }}
                  className="text-6xl md:text-8xl font-display font-black text-on-surface dark:text-white leading-[0.9] tracking-tighter"
                >
                  Your <br /> <span className="text-primary italic">Favorites.</span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="text-on-surface/40 dark:text-white/30 text-lg md:text-xl font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed"
                >
                  A curated collection of exceptional residences tailored to your unique lifestyle and investment goals.
                </motion.p>
              </div>
            </div>

            {/* Total Saved Glass Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-[320px]"
            >
              <div className="absolute inset-0 bg-primary/20 blur-[80px] rounded-full opacity-50" />
              <div className="relative p-10 rounded-[48px] bg-white/60 dark:bg-zinc-900/40 backdrop-blur-3xl border border-white dark:border-white/5 shadow-2xl space-y-6 text-center overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-on-surface/30 dark:text-white/20">Total Collections</p>
                  <p className="text-7xl font-display font-black text-on-surface dark:text-white tracking-tighter">
                    {favorites.length < 10 ? `0${favorites.length}` : favorites.length}
                  </p>
                </div>
                <div className="h-0.5 w-12 bg-primary mx-auto rounded-full" />
                <p className="text-xs font-bold text-on-surface/40 dark:text-white/30 uppercase tracking-widest">Saved Residences</p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ─── MAIN COLLECTION GRID ─── */}
      <section className="container mx-auto px-6 py-24">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-[500px] w-full rounded-[40px] bg-zinc-100 dark:bg-zinc-900 animate-pulse border border-zinc-200/50" />
            ))}
          </div>
        ) : favorites.length > 0 ? (
          <div className="space-y-16">
            <div className="flex items-center justify-between ml-2">
              <div className="space-y-1">
                <h2 className="text-2xl font-display font-black text-on-surface dark:text-white tracking-tight">Current Selections</h2>
                <p className="text-xs font-medium text-on-surface/40 dark:text-white/20 uppercase tracking-widest">Browse through your handpicked listings</p>
              </div>
              <div className="w-12 h-0.5 bg-zinc-200 dark:bg-zinc-800" />
            </div>

            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-14"
            >
              <AnimatePresence mode="popLayout">
                {favorites.map((property, index) => (
                  <PremiumPropertyCard
                    key={property._id || property.id}
                    property={property}
                    index={index}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        ) : (
          /* ✨ Empty State Redesign */
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-32 text-center space-y-12 bg-zinc-50/50 dark:bg-white/[0.02] rounded-[80px] border border-dashed border-zinc-200 dark:border-white/5"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/5 blur-[100px] rounded-full scale-[2]" />
              <div className="relative w-40 h-40 rounded-[48px] bg-white dark:bg-zinc-900 flex items-center justify-center text-primary/10 shadow-2xl border border-zinc-100 dark:border-white/5">
                <Heart size={80} strokeWidth={0.5} className="text-zinc-200 dark:text-zinc-800" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Building2 size={40} className="text-primary/40 animate-bounce" />
                </div>
              </div>
            </div>

            <div className="space-y-4 px-6">
              <h3 className="text-4xl font-display font-black text-on-surface dark:text-white tracking-tight">Empty <span className="text-primary">Gallery.</span></h3>
              <p className="text-on-surface/40 dark:text-white/30 max-w-sm mx-auto font-medium text-lg leading-relaxed">
                Your luxury sanctuary is currently waiting for your first selection. Explore our premier listings to build your dream collection.
              </p>
            </div>

            <Link to="/">
              <motion.button
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                className="px-12 py-5 rounded-[24px] bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold text-sm uppercase tracking-[0.25em] flex items-center gap-4 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_40px_-10px_rgba(255,255,255,0.1)] group transition-all"
              >
                Start Exploring <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          </motion.div>
        )}
      </section>

      {/* Decorative Bottom Ambience */}
      <div className="fixed bottom-0 left-0 right-0 h-[300px] bg-gradient-to-t from-primary/5 to-transparent pointer-events-none -z-10" />
    </div>
  );
};

export default Favorites;

