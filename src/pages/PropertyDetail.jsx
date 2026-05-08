import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence
} from 'framer-motion';
import {
  Bed,
  Bath,
  Move,
  MapPin,
  ChevronLeft,
  Phone,
  MessageCircle,
  Share2,
  Heart,
  Home,
  Shield,
  Eye,
  Clock,
  CheckCircle,
  Award,
  ArrowRight,
  UserCheck,
  Zap,
  Info,
  Star,
  Sparkles,
  Calendar,
  Layers,
  Map,
  BadgeCheck,
  Globe,
  Sun,
  Moon,
  Building
} from 'lucide-react';
import { getPropertyById, resolveImageUrl } from '../services/api';

/* ─────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────── */
const formatPrice = (price) => {
  const num = Number(price);
  if (isNaN(num)) return price ?? '—';
  if (num >= 10000000) return `PKR ${(num / 10000000).toFixed(2)} Crore`;
  if (num >= 100000) return `PKR ${(num / 100000).toFixed(2)} Lac`;
  return `PKR ${num.toLocaleString()}`;
};

const getInitials = (name) => {
  if (!name || typeof name !== 'string' || !name.trim()) return 'P';
  const parts = name.trim().split(' ').filter((p) => p.length > 0);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return parts[0].substring(0, 2).toUpperCase();
};

/* ─────────────────────────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────────────────────────── */
const Reveal = ({ children, delay = 0, className = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 15 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1.0] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const DetailRow = ({ label, value, index }) => {
  if (!value) return null;
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.03 }}
      className="flex justify-between items-center py-4 border-b border-gray-100 dark:border-white/10 group px-4 hover:bg-red-50/20 dark:hover:bg-red-500/5 transition-all rounded-xl"
    >
      <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-white/40">
        {label}
      </span>
      <span className="text-sm font-semibold text-gray-800 dark:text-white/90 group-hover:text-red-600 transition-colors">
        {value}
      </span>
    </motion.div>
  );
};

const StatBlock = ({ label, value, unit, borderLeft = false, icon: Icon }) => (
  <div className={`flex-1 py-12 px-10 space-y-4 border border-red-50/50 dark:border-white/5 hover:border-red-500/30 dark:hover:border-red-500/30 hover:bg-red-50/10 dark:hover:bg-red-500/10 transition-all duration-500 group cursor-default relative overflow-hidden ${borderLeft ? 'md:border-l-0' : ''} md:first:rounded-l-[32px] md:last:rounded-r-[32px]`}>
    <div className="flex items-center justify-between">
      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 dark:text-white/30 group-hover:text-red-500 transition-colors">{label}</p>
      {Icon && <Icon size={14} className="text-gray-200 dark:text-white/10 group-hover:text-red-200 transition-colors" />}
    </div>
    <div className="flex items-baseline gap-2">
      <p className="text-4xl font-semibold text-gray-900 dark:text-white leading-none tracking-tight">
        {value ?? '—'}
      </p>
      {unit && <span className="text-sm text-gray-400 dark:text-white/40 font-bold uppercase tracking-widest">{unit}</span>}
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────── */
const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submitError, setSubmitError] = useState(null);

  const viewCount = useMemo(() => Math.floor(Math.random() * 200) + 700, []);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    let active = true;
    const fetchProp = async () => {
      setLoading(true);
      try {
        const found = await getPropertyById(id);
        if (!active) return;
        if (found && !found.error) {
          setProperty(found);
        } else {
          setSubmitError('Listing unreachable');
        }
      } catch (err) {
        if (active) setSubmitError('Connection failure');
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchProp();
    return () => { active = false; };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#050505]">
        <div className="w-8 h-8 rounded-full border-2 border-red-50 dark:border-white/10 border-t-red-600 animate-spin" />
      </div>
    );
  }

  if (submitError || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#050505] px-6 text-center">
        <div className="space-y-6">
          <Zap size={48} className="text-red-600 mx-auto" />
          <h2 className="text-2xl font-bold dark:text-white">Listing Unavailable</h2>
          <button onClick={() => navigate('/')} className="px-8 py-3 bg-red-600 text-white font-bold rounded-xl text-[10px] tracking-widest uppercase">Back Home</button>
        </div>
      </div>
    );
  }

  const isPlot = property.propertyType?.toLowerCase().includes('plot') || property.propertyType?.toLowerCase().includes('land');
  const isCommercial = property.propertyType?.toLowerCase().includes('commercial') || property.propertyType?.toLowerCase().includes('shop') || property.propertyType?.toLowerCase().includes('office');

  const agentName = property.owner?.name || property.postedBy || 'Elite Curator';
  const agentPhone = property.owner?.phone || property.phoneNumber || '';
  const images = property.images?.length > 0 ? property.images : [property.image];
  const currentImg = resolveImageUrl(images[currentIndex]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] text-gray-900 dark:text-white antialiased selection:bg-red-600 selection:text-white transition-colors duration-500">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap');
        * { font-family: 'Inter', sans-serif; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #eee; border-radius: 10px; }
        .dark ::-webkit-scrollbar-thumb { background: #222; }
        
        @keyframes heavy-glow {
          0%, 100% { box-shadow: 0 0 50px rgba(220, 38, 38, 0.15); transform: translateY(0); }
          50% { box-shadow: 0 0 100px rgba(220, 38, 38, 0.35); transform: translateY(-5px); }
        }
        .heavy-glow-card { animation: heavy-glow 6s ease-in-out infinite; }
      `}</style>

      {/* FLOAT NAV */}
      <nav className="fixed top-0 left-0 right-0 z-[100] h-20 flex items-center justify-between px-8 md:px-16 pointer-events-none">
        <button 
          onClick={() => { if (window.history.length > 1) { window.history.back(); } else { navigate('/'); } }} 
          className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-white/60 hover:text-white transition-all pointer-events-auto bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10"
        >
          <ChevronLeft size={14} /> Back
        </button>
        
        <div className="flex gap-4 pointer-events-auto">
          <button className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white/60 hover:text-white transition-all border border-white/10"><Share2 size={16} /></button>
          <button className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white/60 hover:text-white transition-all border border-white/10"><Heart size={16} /></button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative h-[70vh] overflow-hidden bg-gray-50 dark:bg-zinc-900">
        <img src={currentImg} className="w-full h-full object-cover" alt="" />
        {images.length > 1 && (
          <div className="absolute right-8 bottom-8 flex gap-3 z-10">
            {images.slice(0, 5).map((img, i) => (
              <button key={i} onClick={() => setCurrentIndex(i)} className={`w-12 h-12 border-2 overflow-hidden transition-all duration-300 rounded-lg shadow-lg ${currentIndex === i ? 'border-red-600 scale-110' : 'border-white opacity-60 hover:opacity-100'}`}>
                <img src={resolveImageUrl(img)} className="w-full h-full object-cover" alt="" />
              </button>
            ))}
          </div>
        )}
      </section>

      {/* HEADER SECTION */}
      <section className="max-w-screen-2xl mx-auto px-8 md:px-16 pt-16 pb-8">
        <Reveal className="space-y-8">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-red-600 to-red-500 text-white text-[9px] font-black uppercase tracking-[0.3em] rounded-full shadow-xl shadow-red-600/20 border border-red-400/20">
              <Sparkles size={10} className="animate-pulse" />
              {property.purpose}
            </div>
            <div className="px-4 py-1.5 bg-white/5 dark:bg-white/5 backdrop-blur-md border border-gray-100 dark:border-white/10 text-gray-400 dark:text-white/40 text-[9px] font-black uppercase tracking-[0.3em] rounded-full">
              {property.propertyType}
            </div>
            <div className="h-4 w-px bg-gray-100 dark:bg-white/10 mx-2 hidden md:block" />
            <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-gray-300 dark:text-white/20">
              <Clock size={12} />
              Listed 2 days ago
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-12">
            <div className="space-y-6 flex-1">
              <div className="space-y-2">
                <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-white leading-[1.05] selection:bg-red-500">
                  {property.title}
                </h1>
                <div className="h-1.5 w-24 bg-gradient-to-r from-red-600 to-transparent rounded-full opacity-50" />
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-600 border border-red-100 dark:border-red-500/20">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-xl md:text-2xl font-semibold text-gray-600 dark:text-white/60 tracking-tight">
                    {property.areaSociety}, {property.city}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <CheckCircle size={10} className="text-green-500" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300 dark:text-white/20">Verified Address</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:text-right pt-6 lg:pt-2 border-t lg:border-t-0 border-gray-100 dark:border-white/10 w-full lg:w-auto relative group">
              <div className="flex flex-col lg:items-end">
                <div className="flex items-center lg:justify-end gap-2 mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 dark:text-white/20">Elite Valuation</p>
                </div>
                
                <div className="flex items-baseline lg:justify-end gap-2">
                  <span className="text-xl font-bold text-gray-400 dark:text-white/20 tracking-tighter">PKR</span>
                  <p className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-500 tracking-tighter leading-none drop-shadow-sm">
                    {formatPrice(property.price).replace('PKR ', '')}
                  </p>
                </div>
                
                <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 dark:bg-red-500/10 rounded-full border border-red-100 dark:border-red-500/20">
                  <Shield size={10} className="text-red-600" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-red-600">Market Leader</span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* CONTENT BODY */}
      <main className="max-w-screen-2xl mx-auto px-8 md:px-16 py-12 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          <div className="lg:col-span-8 space-y-20">
            {/* STATS CARD */}
            <div className="flex flex-col md:flex-row md:rounded-[32px] overflow-hidden bg-white dark:bg-white/[0.03] border border-gray-50 dark:border-white/5">
              <StatBlock label="Dimensions" value={property.size} unit={property.sizeUnit} icon={Layers} />
              
              {isPlot ? (
                <>
                  <StatBlock label="Orientation" value={property.facing || "North"} borderLeft icon={Map} />
                  <StatBlock label="Approach" value={property.roadWidth} unit="Ft" borderLeft icon={Move} />
                </>
              ) : isCommercial ? (
                <>
                  <StatBlock label="Category" value={property.subCategory || "Business"} borderLeft icon={Building} />
                  <StatBlock label="Floors" value={property.floors || "1"} borderLeft icon={Layers} />
                </>
              ) : (
                <>
                  <StatBlock label="Bedrooms" value={property.beds} unit="Beds" borderLeft icon={Bed} />
                  <StatBlock label="Bathrooms" value={property.baths} unit="Baths" borderLeft icon={Bath} />
                </>
              )}
            </div>

            {/* Description */}
            <Reveal className="space-y-8">
              <h2 className="text-2xl font-bold uppercase tracking-tight text-gray-900 dark:text-white">The Narrative</h2>
              <p className="text-lg font-medium leading-relaxed text-gray-500 dark:text-white/60 whitespace-pre-wrap">{property.description}</p>
            </Reveal>

            {/* Specifications */}
            <Reveal className="space-y-12">
              <div className="flex items-center gap-6">
                <h2 className="text-xl font-bold uppercase tracking-tight text-gray-900 dark:text-white whitespace-nowrap">Specifications</h2>
                <div className="h-px w-full bg-gray-100 dark:bg-white/10" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                <div className="space-y-1">
                  <DetailRow label="Category" value={property.propertyType} index={1} />
                  <DetailRow label="Society" value={property.areaSociety} index={2} />
                  <DetailRow label="City Hub" value={property.city} index={3} />
                  {property.plotType && <DetailRow label="Structure" value={property.plotType} index={4} />}
                  {property.possessionStatus && <DetailRow label="Possession" value={property.possessionStatus} index={5} />}
                </div>
                <div className="space-y-1">
                  {property.floors && <DetailRow label="Floors" value={property.floors} index={6} />}
                  {property.furnished && <DetailRow label="Curation" value={property.furnished} index={7} />}
                  {property.buildingName && <DetailRow label="Building" value={property.buildingName} index={8} />}
                  {property.washrooms && <DetailRow label="Washrooms" value={property.washrooms} index={9} />}
                  {property.facing && <DetailRow label="Facing" value={property.facing} index={10} />}
                  {property.parking && <DetailRow label="Parking" value={property.parking} index={11} />}
                </div>
              </div>
            </Reveal>

            {/* Amenities */}
            {property.amenities?.length > 0 && (
              <Reveal className="space-y-8">
                <h2 className="text-xl font-bold uppercase tracking-tight text-gray-900 dark:text-white">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.amenities.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-5 border border-red-50 dark:border-white/10 hover:border-red-500/20 hover:bg-red-50/10 dark:hover:bg-red-500/5 rounded-2xl transition-all group">
                      <CheckCircle size={16} className="text-red-600" />
                      <span className="text-xs font-semibold text-gray-600 dark:text-white/50 group-hover:text-red-600 transition-colors uppercase tracking-widest">{item}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
            )}
          </div>

          {/* ELITE PROFILE SIDEBAR */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 space-y-8">
              <Reveal>
                <div className="relative p-[1.5px] rounded-[40px] overflow-hidden heavy-glow-card border border-red-100 dark:border-white/10 shadow-xl bg-white dark:bg-[#0c0c0c]">
                  <div className="p-10 space-y-8 flex flex-col items-center text-center">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-[32px] bg-white dark:bg-zinc-800 flex items-center justify-center overflow-hidden border-2 border-gray-100 dark:border-white/10 shadow-md">
                        {property.owner?.avatar ? (
                          <img src={resolveImageUrl(property.owner.avatar)} className="w-full h-full object-cover" alt="" />
                        ) : (
                          <span className="text-3xl font-black text-gray-100 dark:text-white/10">{getInitials(agentName)}</span>
                        )}
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-9 h-9 bg-red-600 rounded-[14px] flex items-center justify-center text-white border-2 border-white dark:border-[#0c0c0c] shadow-lg">
                        <BadgeCheck size={18} />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-bold text-xl text-gray-900 dark:text-white tracking-tight">{agentName}</h4>
                        <div className="flex items-center justify-center gap-2 text-red-600 mt-1">
                           <Star size={12} className="fill-current" />
                           <p className="text-[10px] font-bold uppercase tracking-[0.4em]">Elite Partner</p>
                        </div>
                      </div>
                      
                      <div className="pt-6 grid grid-cols-2 gap-4 border-t border-gray-50 dark:border-white/10">
                        <div className="space-y-1">
                          <p className="text-[8px] font-bold uppercase tracking-widest text-gray-300 dark:text-white/20">Trust Score</p>
                          <p className="text-sm font-semibold text-gray-800 dark:text-white/80">98% Positive</p>
                        </div>
                        <div className="space-y-1 border-l border-gray-50 dark:border-white/10 pl-4">
                          <p className="text-[8px] font-bold uppercase tracking-widest text-gray-300 dark:text-white/20">Response</p>
                          <p className="text-sm font-semibold text-gray-800 dark:text-white/80">Under 15m</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-center gap-2 text-[8px] font-bold uppercase tracking-widest text-gray-300 dark:text-white/30">
                         <span className="px-2 py-1 rounded-full border border-gray-50 dark:border-white/10">Verified Assets</span>
                         <span className="px-2 py-1 rounded-full border border-gray-50 dark:border-white/10">Direct Deal</span>
                      </div>
                    </div>

                    <div className="w-full space-y-3 px-2">
                      <motion.a 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        href={`tel:${agentPhone}`} 
                        className="w-full h-14 bg-gradient-to-r from-red-600 via-red-500 to-rose-600 text-white rounded-2xl flex items-center justify-center text-[10px] font-bold uppercase tracking-[0.4em] shadow-xl shadow-red-600/30 transition-all"
                      >
                        <Phone size={16} className="mr-2" /> Call Now
                      </motion.a>
                      
                      <motion.a 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        href={`https://wa.me/${String(property.whatsappNumber).replace(/[^0-9]/g, '')}`}
                        target="_blank" rel="noopener noreferrer"
                        className="w-full h-12 border border-gray-100 dark:border-white/10 text-gray-400 dark:text-white/40 rounded-2xl flex items-center justify-center text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-gray-50 dark:hover:bg-white/5 hover:text-red-600 transition-all"
                      >
                        <MessageCircle size={16} className="mr-2" /> Message
                      </motion.a>
                    </div>

                    <div className="w-full flex items-center justify-between text-[9px] font-bold uppercase tracking-widest text-gray-300 dark:text-white/20 pt-4 border-t border-gray-50 dark:border-white/10">
                      <div className="flex items-center gap-2"><Eye size={12} /> {viewCount} Views</div>
                      <div className="flex items-center gap-2 text-green-500 font-bold"><div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Active</div>
                    </div>
                  </div>
                </div>
              </Reveal>

              <div className="p-8 bg-gray-50/50 dark:bg-white/[0.02] rounded-[32px] border border-gray-100 dark:border-white/10 flex gap-5 items-start">
                <Shield size={24} className="text-red-600 shrink-0 mt-1 opacity-50" />
                <div className="space-y-1">
                  <h5 className="text-[9px] font-bold uppercase tracking-widest text-gray-900 dark:text-white/60">Vetted Asset</h5>
                  <p className="text-[11px] text-gray-400 dark:text-white/40 leading-relaxed font-medium">Digital verification active. Proceed with confidence.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      <footer className="py-32 text-center border-t border-gray-50 dark:border-white/10">
        <Reveal className="space-y-8">
          <p className="text-[9px] font-bold uppercase tracking-[0.5em] text-gray-300 dark:text-white/20">PropList Ledger</p>
          <button onClick={() => navigate('/')} className="inline-flex items-center gap-4 px-12 py-5 bg-gray-900 dark:bg-white dark:text-black text-white rounded-2xl text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-red-600 dark:hover:bg-red-600 transition-all">
            Return to Index <ArrowRight size={18} />
          </button>
        </Reveal>
      </footer>
    </div>
  );
};

export default PropertyDetail;