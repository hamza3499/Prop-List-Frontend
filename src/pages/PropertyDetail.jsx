import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue, useInView } from 'framer-motion';
import {
  Bed, Bath, Move, MapPin, ChevronLeft,
  Phone, MessageCircle,
  Share2, Heart, Pencil,
  Home, ChevronRight, Star, Zap, Shield, Eye,
  TrendingUp, Award, CheckCircle
} from 'lucide-react';
import { getPropertyById, resolveImageUrl } from '../services/api';

const formatPrice = (price) => {
  const num = Number(price);
  if (isNaN(num)) return price;
  return `PKR ${num.toLocaleString()}`;
};

const getInitials = (name) => {
  if (!name) return "U";
  const parts = name.trim().split(" ").filter(p => p.length > 0);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return parts[0].substring(0, 2).toUpperCase();
};

const useTilt = (strength = 15) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [strength, -strength]), { stiffness: 200, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-strength, strength]), { stiffness: 200, damping: 30 });

  const onMouseMove = useCallback((e) => {
    if (!ref.current) return;
    requestAnimationFrame(() => {
      const rect = ref.current.getBoundingClientRect();
      x.set((e.clientX - rect.left) / rect.width - 0.5);
      y.set((e.clientY - rect.top) / rect.height - 0.5);
    });
  }, [x, y]);

  const onMouseLeave = useCallback(() => {
    x.set(0); y.set(0);
  }, [x, y]);

  return { ref, rotateX, rotateY, onMouseMove, onMouseLeave };
};

const Particle = React.memo(({ delay, x, y, size }) => (
  <div
    className="absolute rounded-full pointer-events-none opacity-20"
    style={{ 
      left: `${x}%`, top: `${y}%`, width: size, height: size, background: 'rgba(239, 68, 68, 0.5)',
      animation: `floatOrb 5s infinite ease-in-out ${delay}s`
    }}
  />
));

const StatCard = ({ icon: Icon, label, value, delay }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const tilt = useTilt(8);

  return (
    <motion.div
      ref={tilt.ref}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      style={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY, transformStyle: 'preserve-3d', perspective: 800 }}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="relative group cursor-default"
    >
      <div ref={ref} className="relative overflow-hidden rounded-2xl p-6 text-center border border-gray-200 dark:border-red-500/20 bg-white/50 dark:bg-black/40 backdrop-blur-xl shadow-sm hover:shadow-lg transition-shadow">
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(239, 68, 68, 0.08) 50%, transparent 60%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
        <div className="relative z-10 flex flex-col items-center gap-3" style={{ transform: 'translateZ(20px)' }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-red-50 dark:bg-red-500/10">
            <Icon size={20} className="text-red-500" strokeWidth={1.5} />
          </div>
          <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{value}</p>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-white/40">{label}</p>
        </div>
      </div>
    </motion.div>
  );
};

const Reveal = ({ children, delay = 0, className = "" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const GlassCard = ({ children, className = "", red = false }) => (
  <div className={`relative rounded-3xl border overflow-hidden transition-colors ${red ? 'border-red-500/30 dark:border-red-500/30' : 'border-gray-200 dark:border-white/10'} ${className}`}
    style={{ backdropFilter: 'blur(20px)' }}>
    <div className={`absolute inset-0 ${red ? 'bg-red-50/80 dark:bg-red-900/10' : 'bg-white/80 dark:bg-[#0a0a0a]/80'}`} />
    <div className="relative z-10">{children}</div>
  </div>
);

const DetailRow = ({ label, value, index }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="flex justify-between items-center py-4 border-b border-gray-100 dark:border-white/5 last:border-0 group hover:bg-gray-50/50 dark:hover:bg-white/5 px-2 rounded-lg transition-colors"
    >
      <span className="text-sm text-gray-500 dark:text-white/40 font-medium tracking-wide">{label}</span>
      <span className="text-sm font-bold text-gray-900 dark:text-white/90 text-right group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors">{value}</span>
    </motion.div>
  );
};

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [user, setUser] = useState(null);
  const [imgError, setImgError] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [viewCount] = useState(Math.floor(Math.random() * 300) + 50);

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 180]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 400], [1, 1.08]);

  const contactTilt = useTilt(6);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProp = async () => {
      try {
        const found = await getPropertyById(id);
        if (found) {
          let rawImages = [];
          if (found.images && Array.isArray(found.images) && found.images.length > 0) {
            rawImages = found.images.filter(img => typeof img === 'string' && img.trim() !== '');
          } else if (found.image && typeof found.image === 'string') {
            rawImages = [found.image];
          }
          setProperty({ ...found, images: rawImages });
        }
      } catch (err) {
        console.error("Failed to load property details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProp();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#050505] transition-colors duration-700">
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-red-500/20 animate-ping" />
          <div className="absolute inset-0 rounded-full border-t-2 border-red-500 animate-spin" />
          <div className="absolute inset-2 rounded-full border-b border-red-500/40 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
        </div>
        <motion.p animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }}
          className="text-red-500/80 text-sm font-semibold tracking-widest uppercase">
          Loading Listing
        </motion.p>
      </div>
    </div>
  );

  if (!property) return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-gray-50 dark:bg-[#050505] transition-colors duration-700">
      <GlassCard className="p-14 text-center max-w-sm w-full">
        <Home size={44} className="mx-auto text-gray-300 dark:text-white/10 mb-6" />
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-3">Not Found</h2>
        <p className="text-gray-500 dark:text-white/30 text-sm mb-8">This property may have been removed.</p>
        <button onClick={() => navigate(-1)}
          className="w-full py-3.5 rounded-xl font-bold text-white text-sm transition-all hover:scale-[1.02] active:scale-95 bg-gradient-to-r from-red-600 to-red-500">
          Go Back
        </button>
      </GlassCard>
    </div>
  );

  const safeAreaSociety = property.areaSociety || "";
  const safeCity = property.city || property.location || "";
  const displayLocation = [safeAreaSociety, safeCity].filter(Boolean).join(", ") || "Location unlisted";
  const agentName = (property.owner && typeof property.owner === 'object' && property.owner.name)
    ? property.owner.name : (property.postedBy || 'Property Owner');
  const hasAvatar = property.owner && typeof property.owner === 'object' && property.owner.avatar;

  const particles = Array.from({ length: 12 }, (_, i) => ({
    delay: i * 0.4, x: Math.random() * 100, y: Math.random() * 100,
    size: Math.random() * 4 + 2
  }));

  return (
    <div ref={containerRef} className="min-h-screen font-sans overflow-x-hidden bg-[#FAFAFA] dark:bg-[#050505] text-gray-900 dark:text-white transition-colors duration-700">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600;700;800;900&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        .display-font { font-family: 'Cormorant Garamond', serif; }
        @keyframes shimmer { from { background-position: -200% 0; } to { background-position: 200% 0; } }
        @keyframes glow-pulse { 0%,100% { box-shadow: 0 0 20px rgba(239, 68, 68, 0.3); } 50% { box-shadow: 0 0 50px rgba(239, 68, 68, 0.6), 0 0 80px rgba(239, 68, 68, 0.2); } }
        .red-glow { animation: glow-pulse 3s ease-in-out infinite; }
        .text-gradient { background: linear-gradient(135deg, #dc2626, #ef4444, #f87171); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .shimmer-line { background: linear-gradient(90deg, transparent, rgba(239, 68, 68, 0.2), transparent); background-size: 200% 100%; animation: shimmer 3s infinite; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: #ef4444; border-radius: 999px; }
      `}</style>

      {/* ─── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ height: '100vh', minHeight: 600 }}>
        {/* Parallax image */}
        <motion.div className="absolute inset-0" style={{ y: heroY, scale: heroScale }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 bg-gray-900"
            >
              {(!imgError && property.images?.length > 0 && resolveImageUrl(property.images[currentIndex])) ? (
                <>
                  <div className="absolute inset-0 scale-110 blur-3xl opacity-40"
                    style={{ backgroundImage: `url(${resolveImageUrl(property.images[currentIndex])})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                  <img
                    src={resolveImageUrl(property.images[currentIndex])}
                    onError={() => setImgError(true)}
                    alt={property.title}
                    loading="eager"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900">
                  <Home size={60} className="text-white/10 mb-4" />
                  <span className="text-white/20 text-sm tracking-widest uppercase font-semibold">No Image</span>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Layered gradients */}
        <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-black/40 via-transparent to-black/80" />
        <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-black/50 via-transparent to-black/20" />

        {/* Floating particles */}
        <motion.div className="absolute inset-0 z-10 pointer-events-none" style={{ opacity: heroOpacity }}>
          {particles.map((p, i) => <Particle key={i} {...p} />)}
        </motion.div>

        {/* Top nav */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute top-0 inset-x-0 z-30 px-6 py-8 flex justify-between items-center"
        >
          <button onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-sm font-semibold hover:scale-105 active:scale-95 transition-all border border-white/20 bg-white/10 backdrop-blur-md">
            <ChevronLeft size={16} strokeWidth={2.5} /> Back
          </button>

          <div className="flex gap-2.5">
            {/* Live viewers badge */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border border-white/20 bg-white/10 backdrop-blur-md">
              <Eye size={12} className="text-red-400" />
              <span className="text-white">{viewCount} views</span>
            </div>
            <button className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:scale-110 active:scale-95 transition-all bg-white/10 backdrop-blur-md">
              <Share2 size={15} className="text-white" />
            </button>
            {user?.role === 'admin' && (
              <button onClick={() => navigate(`/edit/${property._id || property.id}`)}
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:scale-110 active:scale-95 transition-all bg-white/10 backdrop-blur-md">
                <Pencil size={15} className="text-white" />
              </button>
            )}
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => setIsLiked(!isLiked)}
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all backdrop-blur-md ${isLiked ? 'bg-red-500/20 border-red-500/50' : 'bg-white/10 border-white/20'}`}
            >
              <motion.div animate={isLiked ? { scale: [1, 1.4, 1] } : {}} transition={{ duration: 0.3 }}>
                <Heart size={15} fill={isLiked ? '#ef4444' : 'none'} className={isLiked ? 'text-red-500' : 'text-white'} />
              </motion.div>
            </motion.button>
          </div>
        </motion.div>

        {/* Image nav arrows */}
        {property.images?.length > 1 && (
          <>
            <button onClick={() => { setImgError(false); setCurrentIndex(p => p === 0 ? property.images.length - 1 : p - 1); }}
              className="absolute left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full flex items-center justify-center border border-white/20 hover:scale-110 hover:border-red-500/50 active:scale-95 transition-all bg-black/40 backdrop-blur-md">
              <ChevronLeft size={20} className="text-white" strokeWidth={2} />
            </button>
            <button onClick={() => { setImgError(false); setCurrentIndex(p => (p + 1) % property.images.length); }}
              className="absolute right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full flex items-center justify-center border border-white/20 hover:scale-110 hover:border-red-500/50 active:scale-95 transition-all bg-black/40 backdrop-blur-md">
              <ChevronRight size={20} className="text-white" strokeWidth={2} />
            </button>

            {/* Dot indicators */}
            <div className="absolute bottom-36 left-1/2 -translate-x-1/2 flex gap-2 z-30">
              {property.images.map((_, i) => (
                <button key={i} onClick={() => { setImgError(false); setCurrentIndex(i); }}
                  className="rounded-full transition-all duration-300 shadow-md"
                  style={{ width: i === currentIndex ? 24 : 6, height: 6, background: i === currentIndex ? '#ef4444' : 'rgba(255,255,255,0.4)' }} />
              ))}
            </div>
          </>
        )}

        {/* Hero text */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="absolute inset-x-0 bottom-0 pb-16 z-30 px-6 md:px-12"
        >
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
              className="flex flex-wrap gap-2 mb-4">
              {property.purpose && (
                <span className="px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-full border border-red-400 bg-red-500/20 text-red-100 backdrop-blur-md">
                  {property.purpose}
                </span>
              )}
              {property.propertyType && (
                <span className="px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-md">
                  {property.propertyType}
                </span>
              )}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="display-font text-5xl md:text-7xl font-bold text-white leading-[1.05] max-w-3xl mb-5 drop-shadow-xl"
              style={{ textShadow: '0 4px 40px rgba(0,0,0,0.5)' }}>
              {property.title || "Property Listing"}
            </motion.h1>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap items-end gap-6">
              <div>
                <p className="text-xs text-white/60 font-semibold uppercase tracking-widest mb-1">Asking Price</p>
                <p className="text-white text-4xl font-black tracking-tight drop-shadow-lg">{formatPrice(property.price)}</p>
              </div>
              {displayLocation !== "Location unlisted" && (
                <div className="flex items-center gap-2 pb-1.5">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center bg-red-500/20 backdrop-blur-md">
                    <MapPin size={11} className="text-red-400" />
                  </div>
                  <span className="text-white/80 text-sm font-medium drop-shadow-md">{displayLocation}</span>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1 opacity-60"
        >
          <div className="w-px h-8 bg-gradient-to-b from-transparent to-red-400" />
          <span className="text-[10px] tracking-widest uppercase text-white font-semibold">Scroll</span>
        </motion.div>
      </section>

      {/* ─── MAIN CONTENT ─────────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-16 md:py-24 relative z-10">
        
        {/* Quick stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
          <StatCard icon={Bed} label="Bedrooms" value={property.beds || '—'} delay={0} />
          <StatCard icon={Bath} label="Bathrooms" value={property.baths || '—'} delay={0.1} />
          <StatCard icon={Move} label={property.sizeUnit || 'Area'} value={property.size || '—'} delay={0.2} />
        </div>

        {/* Divider */}
        <Reveal className="mb-16">
          <div className="relative h-px w-full">
            <div className="absolute inset-0 shimmer-line" />
            <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-red-500" />
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 xl:gap-16 items-start">

          {/* ── LEFT COLUMN ── */}
          <div className="space-y-8">

            {/* Overview */}
            <Reveal>
              <GlassCard className="p-8 md:p-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-red-50 dark:bg-red-500/10">
                    <Star size={14} className="text-red-500" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Overview</h3>
                </div>
                <p className="text-gray-600 dark:text-white/60 leading-relaxed text-[15px]">
                  {property.description || 'No description provided for this listing.'}
                </p>
              </GlassCard>
            </Reveal>

            {/* Property Details */}
            <Reveal delay={0.1}>
              <GlassCard className="p-8 md:p-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-red-50 dark:bg-red-500/10">
                    <Zap size={14} className="text-red-500" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Property Details</h3>
                </div>
                <div>
                  {[
                    { label: "Type", value: property.propertyType || "N/A" },
                    { label: "Purpose", value: property.purpose || "N/A" },
                    { label: "Location", value: displayLocation },
                    { label: "Bedrooms", value: property.beds || "N/A" },
                    { label: "Bathrooms", value: property.baths || "N/A" },
                    { label: "Area", value: property.size ? `${property.size} ${property.sizeUnit || ''}`.trim() : (property.sqft || "N/A") },
                    { label: "Condition", value: property.propertyCondition || "N/A" },
                    { label: "Age", value: property.propertyAge || "N/A" },
                  ].map((d, i) => <DetailRow key={i} label={d.label} value={d.value} index={i} />)}
                </div>
              </GlassCard>
            </Reveal>

            {/* Amenities */}
            {property.amenities?.length > 0 && (
              <Reveal delay={0.15}>
                <GlassCard className="p-8 md:p-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-red-50 dark:bg-red-500/10">
                      <CheckCircle size={14} className="text-red-500" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Amenities</h3>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {property.amenities.map((item, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.04 }}
                        className="px-4 py-2 text-sm font-medium rounded-full border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/60 hover:text-red-500 dark:hover:text-red-400 hover:border-red-500/30 transition-colors cursor-default bg-gray-50/50 dark:bg-white/5"
                      >
                        {item}
                      </motion.span>
                    ))}
                  </div>
                </GlassCard>
              </Reveal>
            )}

            {/* Feature Tags */}
            {property.featureTags?.length > 0 && (
              <Reveal delay={0.2}>
                <GlassCard className="p-8 md:p-10" red>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-red-100/50 dark:bg-red-500/20">
                      <Award size={14} className="text-red-600 dark:text-red-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Highlights</h3>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {property.featureTags.map((tag, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="px-4 py-2 text-sm font-bold rounded-full text-white bg-gradient-to-r from-red-600 to-red-500 shadow-sm"
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </div>
                </GlassCard>
              </Reveal>
            )}

          </div>

          {/* ── RIGHT: CONTACT CARD ── */}
          <aside className="lg:sticky lg:top-8">
            <motion.div
              ref={contactTilt.ref}
              onMouseMove={contactTilt.onMouseMove}
              onMouseLeave={contactTilt.onMouseLeave}
              style={{ rotateX: contactTilt.rotateX, rotateY: contactTilt.rotateY, transformStyle: 'preserve-3d', perspective: 1000 }}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="rounded-3xl overflow-hidden border border-gray-200 dark:border-red-500/20 red-glow bg-white dark:bg-[#0a0a0a]/90 backdrop-blur-3xl shadow-2xl dark:shadow-none"
                style={{ transformStyle: 'preserve-3d' }}>

                {/* Top red accent */}
                <div className="h-1 w-full bg-gradient-to-r from-red-600 via-red-500 to-red-600" />

                {/* Agent Section */}
                <div className="p-8 text-center" style={{ transform: 'translateZ(30px)' }}>
                  <div className="relative inline-block mb-5">
                    <div className="absolute -inset-2 rounded-full opacity-30 animate-pulse"
                      style={{ background: 'conic-gradient(from 0deg, #ef4444, transparent, #dc2626)' }} />
                    {hasAvatar && !avatarError ? (
                      <img
                        src={resolveImageUrl(property.owner.avatar)}
                        alt={agentName}
                        onError={() => setAvatarError(true)}
                        loading="lazy"
                        decoding="async"
                        className="relative w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-800 z-10 shadow-lg"
                      />
                    ) : (
                      <div className="relative w-24 h-24 rounded-full flex items-center justify-center font-black text-3xl text-white z-10 border-4 border-white dark:border-gray-800 shadow-lg bg-gradient-to-br from-red-600 to-red-500">
                        {getInitials(agentName)}
                      </div>
                    )}
                    <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full z-20 shadow-sm" />
                  </div>
                  <p className="text-xl font-black text-gray-900 dark:text-white leading-tight">{agentName}</p>
                  <p className="text-sm text-green-600 dark:text-green-400 font-medium mt-1.5 flex items-center justify-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-pulse" />
                    Available Now
                  </p>
                </div>

                {/* Stats row */}
                <div className="mx-6 rounded-2xl grid grid-cols-2 divide-x divide-gray-100 dark:divide-white/5 mb-6 overflow-hidden border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5">
                  <div className="p-4 text-center">
                    <p className="text-[17px] font-black text-gradient">{formatPrice(property.price)}</p>
                    <p className="text-[10px] text-gray-500 dark:text-white/40 uppercase tracking-widest font-semibold mt-0.5">Asking</p>
                  </div>
                  <div className="p-4 text-center">
                    <p className="text-[17px] font-black text-gray-900 dark:text-white/90">{viewCount}</p>
                    <p className="text-[10px] text-gray-500 dark:text-white/40 uppercase tracking-widest font-semibold mt-0.5">Views</p>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="px-6 pb-6 space-y-3" style={{ transform: 'translateZ(20px)' }}>
                  <motion.a
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    href={`tel:${(property.owner?.phone) || property.phoneNumber}`}
                    className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl text-white text-sm font-black tracking-wide shadow-xl shadow-red-500/20 transition-all bg-gradient-to-r from-red-600 to-red-500"
                  >
                    <Phone size={17} strokeWidth={2.5} /> Call Now
                  </motion.a>

                  {property.whatsappNumber && (
                    <motion.a
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      href={`https://wa.me/${property.whatsappNumber.replace(/[^0-9]/g, '')}`}
                      target="_blank" rel="noreferrer"
                      className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl text-sm font-bold transition-all border border-gray-200 dark:border-white/10 text-gray-700 dark:text-white/80 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10"
                    >
                      <MessageCircle size={17} /> WhatsApp
                    </motion.a>
                  )}
                </div>

                {/* Trust badge */}
                <div className="mx-6 mb-6 py-3 px-4 rounded-xl flex flex-col sm:flex-row items-center sm:items-start gap-3 border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5">
                  <Shield size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-500 dark:text-white/50 leading-relaxed text-center sm:text-left">
                    Verified listing by <span className="text-gray-900 dark:text-white/80 font-semibold">{agentName}</span>. Inquiries handled directly.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Trust badges below card */}
            <Reveal delay={0.5}>
              <div className="grid grid-cols-3 gap-3 mt-4">
                {[
                  { icon: Shield, label: 'Verified' },
                  { icon: TrendingUp, label: 'Market Ready' },
                  { icon: Award, label: 'Premium' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-1.5 py-3 rounded-xl border border-gray-200 dark:border-white/5 bg-white dark:bg-white/5 shadow-sm dark:shadow-none">
                    <Icon size={14} className="text-red-500" />
                    <span className="text-[10px] text-gray-500 dark:text-white/40 font-semibold uppercase tracking-widest">{label}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </aside>

        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
