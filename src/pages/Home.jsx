import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, AnimatePresence, useMotionValue, useMotionTemplate } from 'framer-motion';
import { Search, MapPin, ArrowRight, X, Sparkles, ChevronDown, Star, Shield, Zap, TrendingUp, Home as HomeIcon, Building2, Eye, Heart } from 'lucide-react';
import { getProperties, resolveImageUrl } from '../services/api';
import GlowButton from '../components/GlowButton';
import SpotlightSection from '../components/SpotlightSection';
import PremiumFilters from '../components/PremiumFilters';

// ─── Magnetic Button Effect ───────────────────────────────────────────────────
const MagneticButton = ({ children, className, onClick }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const handleMouse = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.35);
    y.set((e.clientY - cy) * 0.35);
  };
  const reset = () => { x.set(0); y.set(0); };
  return (
    <motion.div ref={ref} onMouseMove={handleMouse} onMouseLeave={reset}
      style={{ x: useSpring(x, { stiffness: 200, damping: 15 }), y: useSpring(y, { stiffness: 200, damping: 15 }) }}
      className={className} onClick={onClick}>
      {children}
    </motion.div>
  );
};

// ─── Floating Orb ────────────────────────────────────────────────────────────
const FloatingOrb = React.memo(({ size, color, x, y, duration, delay }) => (
  <div
    className="absolute rounded-full pointer-events-none opacity-20"
    style={{ 
      width: size, height: size, background: color, left: x, top: y, filter: 'blur(50px)',
      animation: `floatOrb ${duration}s infinite ease-in-out ${delay || 0}s` 
    }}
  />
));

// ─── Animated Counter ────────────────────────────────────────────────────────
const Counter = ({ target, suffix = '', prefix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setInView(true); }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);
  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
};

// ─── Favorites Helper ─────────────────────────────────────────────────────────
const getFavorites = () => JSON.parse(localStorage.getItem('favorites') || '[]');
const isFavorited = (id) => getFavorites().includes(id);
const toggleFavorite = (id) => {
  const favs = getFavorites();
  const next = favs.includes(id) ? favs.filter(f => f !== id) : [...favs, id];
  localStorage.setItem('favorites', JSON.stringify(next));
  return next.includes(id);
};

// ─── Property Card ───────────────────────────────────────────────────────────
const PropertyCard = React.memo(({ property, index }) => {
  const navigate = useNavigate();
  const propId = property._id || property.id;
  const [hovered, setHovered] = useState(false);
  const [liked, setLiked] = useState(() => isFavorited(propId));

  const handleLike = (e) => {
    e.stopPropagation();
    const nowLiked = toggleFavorite(propId);
    setLiked(nowLiked);
  };

  const handleViewProperty = () => {
    navigate(`/property/${propId}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative bg-white dark:bg-[#0d0d0d] rounded-[32px] overflow-hidden border border-gray-100/80 dark:border-white/5 shadow-sm hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-700 hover:-translate-y-2"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden cursor-pointer" onClick={handleViewProperty}>
        <motion.img
          src={property.image || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800'}
          alt={property.title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
          animate={{ scale: hovered ? 1.08 : 1 }}
          transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-red-500 text-white shadow-lg shadow-red-500/30">
            {property.purpose || 'Sale'}
          </span>
          {index === 0 && (
            <span className="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-400 text-black shadow-lg">
              ✦ Featured
            </span>
          )}
        </div>

        {/* Like */}
        <button onClick={handleLike} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20 hover:bg-white/40 transition-all z-10">
          <Heart size={15} className={liked ? 'fill-red-500 text-red-500' : 'text-white'} />
        </button>

        {/* Price */}
        <div className="absolute bottom-4 left-4">
          <p className="text-3xl font-black text-white tracking-tight drop-shadow-lg">
            {property.price}
          </p>
        </div>
      </div>

      {/* Info */}
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight line-clamp-1">{property.title || 'Premium Property'}</h3>
          <p className="text-sm text-gray-400 font-medium flex items-center gap-1.5 mt-1">
            <MapPin size={13} className="text-red-500 shrink-0" /> {property.location}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Beds', val: property.beds },
            { label: 'Baths', val: property.baths },
            { label: 'Area', val: property.sqft },
          ].map(({ label, val }) => (
            <div key={label} className="bg-gray-50 dark:bg-white/5 rounded-2xl py-3 px-2 text-center">
              <p className="text-[13px] font-black text-gray-900 dark:text-white">{val}</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        <motion.button
          whileHover={{ x: 4 }}
          onClick={handleViewProperty}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-red-500 text-white text-sm font-black uppercase tracking-[0.15em] flex items-center justify-center gap-2 shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/40 transition-all duration-300"
        >
          View Property <ArrowRight size={15} strokeWidth={3} />
        </motion.button>
      </div>
    </motion.div>
  );
});

// ─── Skeleton ────────────────────────────────────────────────────────────────
const PropertySkeleton = React.memo(() => (
  <div className="bg-white dark:bg-[#0d0d0d] rounded-[32px] overflow-hidden border border-gray-100 dark:border-white/5 animate-pulse">
    <div className="aspect-[16/10] bg-gray-100 dark:bg-zinc-800" />
    <div className="p-6 space-y-4">
      <div className="h-5 bg-gray-100 dark:bg-zinc-800 rounded-xl w-3/4" />
      <div className="h-4 bg-gray-100 dark:bg-zinc-800 rounded-xl w-1/2" />
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map(i => <div key={i} className="h-14 bg-gray-100 dark:bg-zinc-800 rounded-2xl" />)}
      </div>
      <div className="h-12 bg-gray-100 dark:bg-zinc-800 rounded-2xl" />
    </div>
  </div>
));

// ─── Main Component ───────────────────────────────────────────────────────────
const Home = () => {
  const propertiesRef = useRef(null);
  const heroRef = useRef(null);
  const canvasRef = useRef(null);

  const [apiFilters, setApiFilters] = useState({
    search: '', purpose: 'Both', type: 'All',
    minPrice: '', maxPrice: '', beds: '', baths: '',
    minArea: '', maxArea: '', condition: '', furnished: false, sort: 'newest'
  });
  const [properties, setProperties] = useState([]);
  const [totalMatches, setTotalMatches] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 200]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 600], [1, 1.12]);

  // Mouse parallax (throttled)
  useEffect(() => {
    let ticking = false;
    const handleMouse = (e) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setMousePos({ x: e.clientX / window.innerWidth - 0.5, y: e.clientY / window.innerHeight - 0.5 });
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('mousemove', handleMouse, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  // Particle canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.5 + 0.1,
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220,38,38,${p.alpha})`;
        ctx.fill();
      });
      // Throttle particle rendering to ~30fps to save GPU/CPU massively
      setTimeout(() => {
        raf = requestAnimationFrame(draw);
      }, 33);
    };
    draw();
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const responseData = await getProperties({ ...apiFilters, page: currentPage, limit: 3 });
        const data = responseData.properties || (Array.isArray(responseData) ? responseData : []);
        const totalCount = responseData.total || data.length;
        const pagesCount = responseData.pages || Math.ceil(totalCount / 3) || 1;
        const formatted = data.map(p => ({
          ...p,
          location: p.city || p.location || 'Location missing',
          image: resolveImageUrl(p.images?.[0] || p.image),
          beds: p.beds || 'N/A',
          baths: p.baths || 'N/A',
          sqft: p.size ? `${p.size} ${p.sizeUnit || ''}`.trim() : (p.sqft || 'N/A'),
          price: String(p.price).startsWith('PKR') ? p.price : `PKR ${Number(p.price).toLocaleString()}`
        }));
        if (isMounted) {
          setProperties(formatted);
          setTotalMatches(totalCount);
          setTotalPages(pagesCount);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, [apiFilters, currentPage]);

  const handleFilterChange = useCallback((newFilters) => {
    setApiFilters(prev => {
      if (JSON.stringify(prev) === JSON.stringify(newFilters)) return prev;
      setCurrentPage(1);
      return newFilters;
    });
  }, []);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    propertiesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const stats = [
    { icon: HomeIcon, label: 'Active Listings', value: 2400, suffix: '+' },
    { icon: Star, label: 'Satisfied Clients', value: 98, suffix: '%' },
    { icon: Shield, label: 'Verified Agents', value: 340, suffix: '+' },
    { icon: TrendingUp, label: 'Cities Covered', value: 24, suffix: '' },
  ];

  return (
    <div className="relative overflow-hidden bg-[#FAFAFA] dark:bg-[#050505] transition-colors duration-700"
      style={{ fontFamily: "'Clash Display', 'Syne', sans-serif" }}>
      <style>{`
        @keyframes floatOrb {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(40px, -50px) scale(1.1); }
          66% { transform: translate(-30px, 30px) scale(0.9); }
        }
      `}</style>
      
      {/* ─── HERO ─────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden">

        {/* Particle Canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 z-10 pointer-events-none opacity-60" />

        {/* Parallax BG */}
        <motion.div className="absolute inset-0 z-0" style={{ y: heroY, scale: heroScale }}>
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=90&w=2400"
            className="w-full h-full object-cover"
            alt="hero"
            loading="eager"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/50 to-black/85" />
        </motion.div>

        {/* Floating orbs */}
        <div className="absolute inset-0 z-5 pointer-events-none overflow-hidden">
          <FloatingOrb size={500} color="radial-gradient(circle, #dc2626, transparent)" x="10%" y="20%" duration={14} delay={0} />
          <FloatingOrb size={400} color="radial-gradient(circle, #b91c1c, transparent)" x="65%" y="50%" duration={18} delay={3} />
          <FloatingOrb size={300} color="radial-gradient(circle, #ef4444, transparent)" x="40%" y="70%" duration={12} delay={6} />
        </div>

        {/* Mouse-tracked gradient */}
        <div
          className="absolute inset-0 z-5 pointer-events-none transition-all duration-300"
          style={{
            background: `radial-gradient(600px circle at ${50 + mousePos.x * 30}% ${50 + mousePos.y * 30}%, rgba(220,38,38,0.12), transparent 60%)`
          }}
        />

        {/* Hero Content */}
        <motion.div style={{ opacity: heroOpacity }} className="relative z-20 container mx-auto px-6 flex flex-col items-center text-center">

          {/* Pill badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-xl text-white text-xs font-bold uppercase tracking-[0.25em]"
          >
            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            Pakistan's Premium Real Estate Platform
            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
          </motion.div>

          {/* Main Headline */}
          <div className="overflow-hidden mb-6">
            <motion.h1
              initial={{ y: 120, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="text-6xl sm:text-7xl md:text-8xl lg:text-[96px] font-black text-white leading-[0.92] tracking-tighter"
            >
              Find Your
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-6">
            <motion.h1
              initial={{ y: 120, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="text-6xl sm:text-7xl md:text-8xl lg:text-[96px] font-black leading-[0.92] tracking-tighter"
              style={{ WebkitTextStroke: '2px rgba(255,255,255,0.9)', color: 'transparent' }}
            >
              Dream Home
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-10">
            <motion.h1
              initial={{ y: 120, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              className="text-6xl sm:text-7xl md:text-8xl lg:text-[96px] font-black text-red-400 leading-[0.92] tracking-tighter"
            >
              Today.
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5 }}
            className="text-white/50 text-lg md:text-xl max-w-xl mx-auto font-medium leading-relaxed mb-14 tracking-wide"
          >
            Thousands of verified properties across Pakistan. Buy, rent, or sell — all in one place.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center gap-4 mb-20"
          >
            <MagneticButton
              className="px-10 py-5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-base uppercase tracking-[0.15em] flex items-center gap-3 shadow-2xl shadow-red-600/40 transition-colors duration-300 cursor-pointer"
              onClick={() => propertiesRef.current?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Sparkles size={18} /> Browse Properties
            </MagneticButton>
            <MagneticButton
              className="px-10 py-5 rounded-2xl border-2 border-white/25 bg-white/10 backdrop-blur-xl text-white font-black text-base uppercase tracking-[0.15em] flex items-center gap-3 hover:bg-white/20 transition-all duration-300 cursor-pointer"
              onClick={() => window.location.href = '/add-property'}
            >
              List Property <ArrowRight size={18} strokeWidth={2.5} />
            </MagneticButton>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="flex flex-col items-center gap-2 text-white/30"
          >
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Scroll to explore</span>
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}>
              <ChevronDown size={20} />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Bottom filters panel */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-0 left-0 right-0 z-30"
        >
          <div className="container mx-auto px-4 md:px-6 max-w-5xl pb-6">
            <PremiumFilters onFilterChange={handleFilterChange} />
          </div>
        </motion.div>
      </section>

      {/* ─── STATS BAR ──────────────────────────────────────────────────── */}
      <section className="relative z-10 bg-white dark:bg-[#0a0a0a] border-y border-gray-100 dark:border-white/5">
        <div className="container mx-auto px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(({ icon: Icon, label, value, suffix }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="flex flex-col items-center text-center gap-2 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform duration-300 mb-1">
                  <Icon size={22} strokeWidth={2} />
                </div>
                <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                  <Counter target={value} suffix={suffix} />
                </p>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── LISTINGS ───────────────────────────────────────────────────── */}
      <section ref={propertiesRef} className="relative container mx-auto px-6 py-28 space-y-16">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="space-y-3">
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-red-500 text-xs font-black uppercase tracking-[0.3em] flex items-center gap-2"
            >
              <span className="w-8 h-[2px] bg-red-500 inline-block" /> Featured Listings
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tighter leading-none"
            >
              Prime<br />
              <span className="text-red-500">Properties</span>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-gray-400 font-medium text-sm"
          >
            {loading ? 'Fetching listings...' : `${totalMatches} ${totalMatches === 1 ? 'property' : 'properties'} found`}
          </motion.p>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <PropertySkeleton key={i} />)}
          </div>
        ) : properties.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((prop, index) => (
                <PropertyCard key={prop._id || prop.id || index} property={prop} index={index} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-center justify-center gap-3 pt-10"
              >
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-6 py-3 rounded-2xl border-2 border-gray-200 dark:border-white/10 font-black text-sm text-gray-400 hover:border-red-500 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  ← Prev
                </button>
                <div className="flex items-center gap-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePageChange(i + 1)}
                      className={`w-11 h-11 rounded-2xl font-black text-sm transition-all duration-300 ${currentPage === i + 1
                        ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 scale-110'
                        : 'bg-gray-100 dark:bg-white/5 text-gray-500 hover:bg-gray-200 dark:hover:bg-white/10'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-6 py-3 rounded-2xl border-2 border-gray-200 dark:border-white/10 font-black text-sm text-gray-400 hover:border-red-500 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  Next →
                </button>
              </motion.div>
            )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative text-center py-40 rounded-[48px] overflow-hidden border border-gray-100 dark:border-white/5 bg-white dark:bg-[#0a0a0a]"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(220,38,38,0.06)_0%,_transparent_70%)]" />
            <div className="relative z-10 space-y-8">
              <div className="w-24 h-24 mx-auto rounded-[28px] bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
                <Search size={44} className="text-red-400" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">No Results Found</h3>
                <p className="text-gray-400 mt-3 max-w-sm mx-auto">Try adjusting your filters or explore all available properties.</p>
              </div>
              <button
                onClick={() => handleFilterChange({ search: '', purpose: 'Both', type: 'All', minPrice: '', maxPrice: '', beds: '', baths: '', minArea: '', maxArea: '', condition: '', furnished: false, sort: 'newest' })}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-red-500 text-white font-black text-sm uppercase tracking-widest hover:bg-red-600 transition-colors"
              >
                <X size={16} /> Clear Filters
              </button>
            </div>
          </motion.div>
        )}
      </section>

      {/* ─── HOW IT WORKS ───────────────────────────────────────────────── */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-red-700 to-[#7f1d1d]" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'white\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/svg%3E")' }} />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <p className="text-white/50 text-xs font-black uppercase tracking-[0.4em] mb-4">Simple Process</p>
            <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter">How It Works</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: '01', icon: Search, title: 'Search', desc: 'Browse thousands of verified listings using smart filters.' },
              { step: '02', icon: Eye, title: 'Explore', desc: 'View detailed property info, photos, and connect with sellers.' },
              { step: '03', icon: HomeIcon, title: 'Move In', desc: 'Finalize the deal and get the keys to your new home.' },
            ].map(({ step, icon: Icon, title, desc }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.7 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="relative bg-white/10 backdrop-blur-xl border border-white/15 rounded-[32px] p-8 text-center group"
              >
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white flex items-center justify-center text-red-600 text-xs font-black shadow-lg">
                  {step}
                </div>
                <div className="w-16 h-16 rounded-[22px] bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-6 mt-4 group-hover:bg-white/20 transition-colors">
                  <Icon size={28} className="text-white" strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-black text-white mb-3 tracking-tight">{title}</h3>
                <p className="text-white/50 font-medium text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BOTTOM CTA ─────────────────────────────────────────────────── */}
      <section className="container mx-auto px-6 py-28">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-[56px] overflow-hidden"
        >
          {/* BG */}
          <div className="absolute inset-0 bg-[#0a0a0a] dark:bg-black" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,_rgba(220,38,38,0.25)_0%,_transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,_rgba(185,28,28,0.2)_0%,_transparent_50%)]" />
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.1) 40px, rgba(255,255,255,0.1) 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.1) 40px, rgba(255,255,255,0.1) 41px)' }} />

          <div className="relative z-10 p-14 md:p-24 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="space-y-6 max-w-xl">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-black uppercase tracking-widest"
              >
                <Zap size={12} className="animate-pulse" /> Start Listing Today
              </motion.div>
              <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-[0.95]">
                Turn Your Property<br />
                <span className="text-red-500">Into Profit.</span>
              </h2>
              <p className="text-white/40 text-lg font-medium leading-relaxed">
                Join thousands of property owners who trust our platform to connect with serious buyers and renters.
              </p>
            </div>

            <div className="flex flex-col gap-4 w-full md:w-auto shrink-0">
              <MagneticButton
                className="px-12 py-5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-sm uppercase tracking-[0.15em] flex items-center justify-center gap-3 shadow-2xl shadow-red-500/30 transition-all duration-300 cursor-pointer whitespace-nowrap"
                onClick={() => window.location.href = '/add-property'}
              >
                <HomeIcon size={18} /> Add Your Listing
              </MagneticButton>
              <MagneticButton
                className="px-12 py-5 rounded-2xl border-2 border-white/15 text-white/60 hover:text-white hover:border-white/30 font-black text-sm uppercase tracking-[0.15em] flex items-center justify-center gap-3 transition-all duration-300 cursor-pointer whitespace-nowrap"
                onClick={() => window.location.href = '/signup'}
              >
                Create Free Account <ArrowRight size={18} />
              </MagneticButton>
              <p className="text-white/20 text-[10px] uppercase tracking-[0.3em] font-bold text-center">
                No fees &nbsp;·&nbsp; Quick setup &nbsp;·&nbsp; Verified platform
              </p>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
