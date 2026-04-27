import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import {
  User, Mail, Plus, MapPin, Edit2, Building2,
  Sparkles, Eye, CheckCircle, ArrowRight, Save,
  ShieldCheck, ShieldAlert, Clock, X, Phone, Home as HomeIcon,
  Camera, Star, TrendingUp, Award, Zap, ChevronRight, BarChart3
} from 'lucide-react';
import { getMyProperties, getToken, uploadAvatar, resolveImageUrl, updateUserProfile, submitVerification, getUserProfile } from '../services/api';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';

// ─── Tilt Card (3D hover effect) ────────────────────────────────────────────
const TiltCard = ({ children, className = '', intensity = 8 }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [intensity, -intensity]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-intensity, intensity]), { stiffness: 200, damping: 20 });
  const glowX = useTransform(x, [-0.5, 0.5], ['0%', '100%']);
  const glowY = useTransform(y, [-0.5, 0.5], ['0%', '100%']);

  const handleMouse = (e) => {
    if (!ref.current) return;
    requestAnimationFrame(() => {
      const rect = ref.current.getBoundingClientRect();
      x.set((e.clientX - rect.left) / rect.width - 0.5);
      y.set((e.clientY - rect.top) / rect.height - 0.5);
    });
  };
  const reset = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', transformPerspective: 1000 }}
      className={`relative ${className}`}
    >
      {/* Dynamic glow */}
      <motion.div
        className="absolute inset-0 rounded-[inherit] opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500 z-0"
        style={{
          background: `radial-gradient(circle at ${glowX} ${glowY}, rgba(220,38,38,0.15), transparent 60%)`,
        }}
      />
      <div style={{ transform: 'translateZ(0px)' }} className="relative z-10 h-full">
        {children}
      </div>
    </motion.div>
  );
};

// ─── Animated Counter ────────────────────────────────────────────────────────
const Counter = ({ target, suffix = '', duration = 1500 }) => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const steps = 60;
    const inc = target / steps;
    const interval = duration / steps;
    const t = setInterval(() => {
      start += inc;
      if (start >= target) { setCount(target); clearInterval(t); }
      else setCount(Math.floor(start));
    }, interval);
    return () => clearInterval(t);
  }, [started, target, duration]);

  return <span ref={ref}>{typeof target === 'string' ? target : count.toLocaleString()}{suffix}</span>;
};

// ─── Particle Ring (around avatar) ──────────────────────────────────────────
const ParticleRing = ({ size = 220 }) => {
  const particles = Array.from({ length: 12 }, (_, i) => i);
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ width: size, height: size }}>
      {particles.map((i) => {
        const angle = (i / particles.length) * 360;
        const delay = i * 0.15;
        return (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-red-500"
            style={{
              top: '50%', left: '50%',
              transformOrigin: `0 ${-size / 2 + 8}px`,
              rotate: angle,
              marginLeft: -3, marginTop: -3,
            }}
            animate={{ opacity: [0.2, 1, 0.2], scale: [0.6, 1.3, 0.6] }}
            transition={{ duration: 2.5, delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        );
      })}
    </div>
  );
};

// ─── Stat Card ───────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, color, delay, suffix = '' }) => (
  <TiltCard intensity={6} className="group">
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative bg-white dark:bg-[#0d0d0d] rounded-[28px] p-7 border border-gray-100 dark:border-white/5 overflow-hidden hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-500 cursor-default h-full"
    >
      {/* BG glow */}
      <div className={`absolute -top-8 -right-8 w-28 h-28 rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-700 ${color.replace('text-', 'bg-')}`} />

      <div className="flex items-start justify-between mb-6">
        <div className={`w-13 h-13 w-12 h-12 rounded-2xl flex items-center justify-center ${color} bg-current/10`}
          style={{ background: 'rgba(220,38,38,0.08)' }}>
          <Icon size={22} className={color} strokeWidth={2} />
        </div>
        <motion.div
          initial={{ rotate: 0 }}
          whileHover={{ rotate: 45 }}
          className="text-gray-200 dark:text-white/10"
        >
          <ChevronRight size={18} />
        </motion.div>
      </div>

      <p className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter mb-1">
        {typeof value === 'string' ? value : <Counter target={value} suffix={suffix} />}
      </p>
      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400">{label}</p>

      {/* Shimmer on hover */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 pointer-events-none" />
    </motion.div>
  </TiltCard>
);

// ─── Verification Badge ──────────────────────────────────────────────────────
const VerifBadge = ({ status }) => {
  if (status === 'verified') return (
    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500">
      <ShieldCheck size={13} strokeWidth={3} />
      <span className="text-[10px] font-black uppercase tracking-[0.2em]">Verified</span>
      <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 2 }}
        className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
    </motion.div>
  );
  if (status === 'pending') return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400">
      <Clock size={13} className="animate-spin" style={{ animationDuration: '3s' }} />
      <span className="text-[10px] font-black uppercase tracking-[0.2em]">Under Review</span>
    </div>
  );
  if (status === 'rejected') return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30 text-red-500">
      <ShieldAlert size={13} />
      <span className="text-[10px] font-black uppercase tracking-[0.2em]">Rejected</span>
    </div>
  );
  return null;
};

// ─── Main Profile ────────────────────────────────────────────────────────────
const Profile = () => {
  const listingsRef = useRef(null);
  const heroRef = useRef(null);
  const [userListings, setUserListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const fileInputRef = useRef(null);
  const propertiesPerPage = 6;

  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [vData, setVData] = useState({ cnic: '', phone: '', address: '' });
  const [vError, setVError] = useState('');
  const [vSuccess, setVSuccess] = useState(false);

  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const userName = user.name || 'User';
  const userEmail = user.email || 'user@example.com';
  const verStatus = user.verificationStatus || 'unverified';

  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 400], [0, 80]);

  const fetchUserData = async () => {
    try {
      const token = getToken();
      if (token) {
        const fullProfile = await getUserProfile(token);
        if (fullProfile) {
          const updatedUser = { ...user, ...fullProfile };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          setUser(updatedUser);
        }
        const data = await getMyProperties(token);
        const formatted = data.map(p => ({
          ...p,
          location: p.city || p.location || 'Unknown Location',
          image: resolveImageUrl(p.images?.[0] || p.image),
          beds: p.beds || 'N/A',
          baths: p.baths || 'N/A',
          sqft: p.size ? `${p.size} ${p.sizeUnit || ''}`.trim() : (p.sqft || 'N/A'),
          status: 'Listing',
          price: String(p.price).startsWith('PKR') ? p.price : `PKR ${Number(p.price).toLocaleString()}`,
          views: Math.floor(Math.random() * 500) + 50,
        }));
        setUserListings(formatted);
      }
    } catch (err) {
      console.error("Failed to load profile data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    let isMounted = true;
    const load = async () => {
      if(isMounted) await fetchUserData();
    };
    load();
    return () => { isMounted = false; };
  }, []);

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    setUploading(true);
    try {
      const token = getToken();
      const fd = new FormData();
      fd.append('avatar', file);
      const result = await uploadAvatar(fd, token);
      const updatedUser = { ...user, avatar: result.avatar };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleSaveName = async () => {
    if (!editedName.trim() || editedName.trim().length < 2) { setEditError('Name must be at least 2 characters'); return; }
    setSaving(true); setEditError('');
    try {
      const token = getToken();
      const result = await updateUserProfile({ name: editedName.trim() }, token);
      const updatedUser = { ...user, name: result.user.name };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditing(false);
    } catch (err) {
      setEditError(err.message || 'Failed to update name');
    } finally {
      setSaving(false);
    }
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault(); setVError('');
    if (!/^\d{5}-\d{7}-\d{1}$/.test(vData.cnic)) { setVError('Invalid CNIC. Format: xxxxx-xxxxxxx-x'); return; }
    if (!/^\d{11}$/.test(vData.phone)) { setVError('Phone must be 11 digits'); return; }
    if (!vData.address.trim()) { setVError('Address is required'); return; }
    setVerifying(true);
    try {
      const token = getToken();
      await submitVerification(vData, token);
      const updatedUser = { ...user, verificationStatus: 'pending' };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setVSuccess(true);
      setTimeout(() => { setShowVerifyModal(false); setVSuccess(false); }, 3000);
    } catch (err) {
      setVError(err.message || 'Submission failed');
    } finally {
      setVerifying(false);
    }
  };

  const totalPages = Math.ceil(userListings.length / propertiesPerPage);
  const currentProperties = userListings.slice((currentPage - 1) * propertiesPerPage, currentPage * propertiesPerPage);

  const stats = [
    { icon: Building2, label: 'Total Listed', value: userListings.length, color: 'text-blue-500', delay: 0.1 },
    { icon: Sparkles, label: 'Active Listings', value: userListings.length, color: 'text-red-500', delay: 0.2 },
    { icon: Eye, label: 'Profile Views', value: '1.2k', color: 'text-amber-500', delay: 0.3 },
    { icon: Award, label: 'Reputation', value: 98, suffix: '%', color: 'text-emerald-500', delay: 0.4 },
  ];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] dark:bg-[#050505]">
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-red-500/10 border-t-red-500 rounded-full animate-spin" />
          <User className="absolute inset-0 m-auto text-red-500/20" size={22} />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 animate-pulse">Loading Profile</p>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-[#FAFAFA] dark:bg-[#050505] pb-32 overflow-x-hidden">

      {/* ─── HERO BANNER ──────────────────────────────────────────────────── */}
      <div ref={heroRef} className="relative w-full h-[420px] overflow-hidden">
        {/* Parallax BG */}
        <motion.div style={{ y: bgY }} className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1582407947304-fd86f28f4285?auto=format&fit=crop&q=80&w=2000"
            className="w-full h-full object-cover scale-110"
            alt="hero"
            loading="eager"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#FAFAFA] dark:to-[#050505]" />
        </motion.div>

        {/* Floating orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[
            { size: 400, color: 'rgba(220,38,38,0.2)', x: '10%', y: '10%', dur: 12 },
            { size: 300, color: 'rgba(185,28,28,0.15)', x: '70%', y: '40%', dur: 16 },
          ].map((orb, i) => (
            <motion.div key={i}
              className="absolute rounded-full"
              style={{ width: orb.size, height: orb.size, background: `radial-gradient(circle, ${orb.color}, transparent)`, left: orb.x, top: orb.y, filter: 'blur(60px)' }}
              animate={{ x: [0, 30, -20, 0], y: [0, -40, 20, 0] }}
              transition={{ duration: orb.dur, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
        </div>

        {/* Hero text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pt-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/40 text-xs font-black uppercase tracking-[0.4em] mb-3"
          >
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl font-black text-white tracking-tighter text-center"
          >
            {userName}<span className="text-red-400">.</span>
          </motion.h1>
        </div>

        {/* Diagonal cut */}
        <div
          className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none dark:hidden"
          style={{
            background: "linear-gradient(to bottom right, transparent 49%, #FAFAFA 50%)"
          }}
        />
      </div>

      <div className="container mx-auto px-4 md:px-6 max-w-6xl relative z-10 -mt-20 space-y-12">

        {/* ─── PROFILE CARD ─────────────────────────────────────────────── */}
        <TiltCard intensity={4} className="group">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative bg-white dark:bg-[#0d0d0d] rounded-[40px] border border-gray-100 dark:border-white/5 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.12)] dark:shadow-[0_40px_100px_-20px_rgba(220,38,38,0.08)] overflow-hidden"
          >
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-60" />

            {/* BG mesh */}
            <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
              style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #000 1px, transparent 0)', backgroundSize: '24px 24px' }} />
            <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="relative z-10 p-8 md:p-12 flex flex-col lg:flex-row items-center lg:items-start gap-10">

              {/* Avatar */}
              <div className="relative shrink-0 flex items-center justify-center" style={{ width: 180, height: 180 }}>
                <ParticleRing size={180} />
                <motion.div
                  whileHover={{ scale: 1.04 }}
                  onClick={() => fileInputRef.current?.click()}
                  className="w-40 h-40 rounded-full cursor-pointer relative overflow-hidden ring-4 ring-white dark:ring-[#1a1a1a] shadow-2xl shadow-red-500/20 group/avatar"
                  style={{ transform: 'translateZ(30px)' }}
                >
                  {user.avatar ? (
                    <img src={resolveImageUrl(user.avatar)} alt={userName} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-500 group-hover/avatar:scale-110" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-red-500/20 to-red-900/30 flex items-center justify-center">
                      <User size={60} className="text-red-400" strokeWidth={1} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/avatar:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-sm">
                    {uploading
                      ? <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      : <Camera size={26} className="text-white" />}
                  </div>
                </motion.div>
                <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />

                {/* Verified check badge */}
                {verStatus === 'verified' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.5 }}
                    className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-emerald-500 border-4 border-white dark:border-[#0d0d0d] flex items-center justify-center shadow-lg z-20"
                    style={{ transform: 'translateZ(40px)' }}
                  >
                    <ShieldCheck size={16} className="text-white" strokeWidth={3} />
                  </motion.div>
                )}
              </div>

              {/* Identity Info */}
              <div className="flex-1 space-y-5 text-center lg:text-left">
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                  <span className="px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-[0.2em]">
                    ✦ Executive Member
                  </span>
                  <VerifBadge status={verStatus} />
                  {verStatus === 'rejected' && (
                    <span className="px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-[0.2em]">
                      Rejected
                    </span>
                  )}
                </div>

                {/* Name */}
                <AnimatePresence mode="wait">
                  {isEditing ? (
                    <motion.div key="editing" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="space-y-3">
                      <input
                        type="text"
                        value={editedName}
                        onChange={e => setEditedName(e.target.value)}
                        autoFocus
                        className={`text-4xl font-black bg-gray-50 dark:bg-white/5 border-2 rounded-2xl px-5 py-3 outline-none w-full max-w-sm text-gray-900 dark:text-white tracking-tight transition-colors ${editError ? 'border-red-500' : 'border-gray-200 dark:border-white/10 focus:border-red-500'}`}
                        placeholder="Your name"
                      />
                      {editError && <p className="text-red-500 text-xs font-bold">{editError}</p>}
                      <div className="flex gap-3">
                        <button onClick={handleSaveName} disabled={saving}
                          className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-red-500 text-white text-xs font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-red-500/25 active:scale-95 disabled:opacity-60">
                          {saving ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={13} />} Save
                        </button>
                        <button onClick={() => { setIsEditing(false); setEditError(''); }} disabled={saving}
                          className="px-6 py-2.5 rounded-2xl bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-white/60 text-xs font-black uppercase tracking-widest hover:bg-gray-200 transition-all active:scale-95">
                          Cancel
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="display" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="flex items-center gap-4 justify-center lg:justify-start">
                      <h1 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tighter leading-none">
                        {userName}
                      </h1>
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => { setEditedName(userName); setIsEditing(true); setEditError(''); }}
                        className="w-10 h-10 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                      >
                        <Edit2 size={16} />
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <p className="flex items-center gap-2 text-gray-400 font-medium text-sm justify-center lg:justify-start">
                  <Mail size={15} className="text-red-500/60" /> {userEmail}
                </p>

                {/* Verification Alert Banner */}
                {(verStatus === 'unverified' || verStatus === 'rejected') && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/15 max-w-lg"
                  >
                    <ShieldAlert size={20} className="text-amber-500 shrink-0" />
                    <div className="flex-1 text-center sm:text-left">
                      <p className="text-sm font-black text-amber-700 dark:text-amber-400">
                        {verStatus === 'rejected' ? 'Verification Rejected' : 'Account Not Verified'}
                      </p>
                      <p className="text-xs text-amber-600/60 dark:text-amber-400/40 mt-0.5">Verify your identity to list premium properties.</p>
                    </div>
                    <button onClick={() => setShowVerifyModal(true)}
                      className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md active:scale-95 whitespace-nowrap">
                      {verStatus === 'rejected' ? 'Try Again' : 'Verify Now'}
                    </button>
                  </motion.div>
                )}
                {verStatus === 'pending' && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-blue-50 dark:bg-blue-500/5 border border-blue-200 dark:border-blue-500/15 max-w-lg"
                  >
                    <Clock size={20} className="text-blue-500 animate-spin shrink-0" style={{ animationDuration: '4s' }} />
                    <div>
                      <p className="text-sm font-black text-blue-700 dark:text-blue-400">Verification Under Review</p>
                      <p className="text-xs text-blue-600/60 dark:text-blue-400/40 mt-0.5">Our team is reviewing your credentials.</p>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 shrink-0 w-full lg:w-auto">
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => listingsRef.current?.scrollIntoView({ behavior: 'smooth' })}
                  className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl border-2 border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-700 dark:text-white text-sm font-black uppercase tracking-widest hover:border-red-500/30 transition-all"
                >
                  <Building2 size={17} /> My Listings
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => window.location.href = '/add-property'}
                  disabled={verStatus !== 'verified'}
                  className={`flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all relative overflow-hidden group/btn
                    ${verStatus === 'verified'
                      ? 'bg-red-600 hover:bg-red-500 text-white shadow-xl shadow-red-500/30'
                      : 'bg-gray-100 dark:bg-white/5 text-gray-400 cursor-not-allowed'}`}
                >
                  {verStatus === 'verified' && (
                    <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
                  )}
                  <Plus size={17} className="relative z-10" />
                  <span className="relative z-10">Add Listing</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </TiltCard>

        {/* ─── STATS ────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        {/* ─── LISTINGS ─────────────────────────────────────────────────── */}
        <div ref={listingsRef} className="space-y-10 pt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row justify-between items-end gap-6"
          >
            <div className="space-y-2">
              <p className="text-red-500 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                <span className="w-6 h-px bg-red-500" /> Your Portfolio
              </p>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tighter">
                Property <span className="text-red-500 italic">Collection</span>
              </h2>
            </div>
            {userListings.length > 0 && (
              <div className="px-5 py-2.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-[0.2em]">
                {userListings.length} Active {userListings.length === 1 ? 'Listing' : 'Listings'}
              </div>
            )}
          </motion.div>

          {userListings.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative py-36 rounded-[48px] border-2 border-dashed border-gray-200 dark:border-white/5 bg-white dark:bg-[#0d0d0d] text-center overflow-hidden"
            >
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(220,38,38,0.04)_0%,_transparent_70%)]" />
              <div className="relative z-10 space-y-8">
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                  className="w-24 h-24 mx-auto rounded-[32px] bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex items-center justify-center"
                >
                  <Building2 size={44} className="text-gray-300 dark:text-white/20" strokeWidth={1} />
                </motion.div>
                <div>
                  <h3 className="text-3xl font-black text-gray-300 dark:text-white/20 tracking-tight">No listings yet.</h3>
                  <p className="text-gray-400 dark:text-white/20 mt-2 max-w-xs mx-auto text-sm">Add your first property and start showcasing to verified buyers.</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => window.location.href = '/add-property'}
                  disabled={verStatus !== 'verified'}
                  className={`inline-flex items-center gap-2.5 px-10 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all
                    ${verStatus === 'verified' ? 'bg-red-600 text-white shadow-xl shadow-red-500/25 hover:bg-red-500' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                >
                  <Plus size={17} /> Add First Property
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentProperties.map((prop, index) => (
                  <motion.div
                    key={prop._id || prop.id || index}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <GlassCard property={prop} />
                  </motion.div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 pt-8">
                  <button onClick={() => { setCurrentPage(p => p - 1); listingsRef.current?.scrollIntoView({ behavior: 'smooth' }); }} disabled={currentPage === 1}
                    className="w-11 h-11 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-500 hover:border-red-500/40 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                    <ArrowRight className="rotate-180" size={18} />
                  </button>
                  <div className="flex gap-2">
                    {[...Array(totalPages)].map((_, i) => (
                      <button key={i} onClick={() => { setCurrentPage(i + 1); listingsRef.current?.scrollIntoView({ behavior: 'smooth' }); }}
                        className={`w-11 h-11 rounded-2xl font-black text-sm transition-all duration-300 ${currentPage === i + 1 ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 scale-110' : 'bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-500 hover:border-red-500/30'}`}>
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <button onClick={() => { setCurrentPage(p => p + 1); listingsRef.current?.scrollIntoView({ behavior: 'smooth' }); }} disabled={currentPage === totalPages}
                    className="w-11 h-11 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-500 hover:border-red-500/40 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                    <ArrowRight size={18} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ─── VERIFICATION MODAL ──────────────────────────────────────────── */}
      <AnimatePresence>
        {showVerifyModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center px-4 bg-black/70 backdrop-blur-xl"
            onClick={(e) => { if (e.target === e.currentTarget) setShowVerifyModal(false); }}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 40 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="bg-white dark:bg-[#0d0d0d] rounded-[36px] w-full max-w-lg overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.6)] border border-gray-100 dark:border-white/5 relative"
            >
              {/* Top accent */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500 to-transparent" />

              <div className="p-8 md:p-10">
                <AnimatePresence mode="wait">
                  {vSuccess ? (
                    <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                      className="py-16 text-center space-y-6">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: 2, duration: 0.4 }}
                        className="w-24 h-24 bg-emerald-500/10 rounded-[32px] flex items-center justify-center mx-auto"
                      >
                        <CheckCircle size={48} className="text-emerald-500" strokeWidth={1.5} />
                      </motion.div>
                      <div>
                        <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Submitted!</h3>
                        <p className="text-gray-400 mt-2 text-sm max-w-xs mx-auto">Your verification request is now pending admin review.</p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                      <div className="flex justify-between items-start">
                        <div>
                          <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
                            <ShieldCheck size={28} className="text-red-500" /> Identity Verification
                          </h2>
                          <p className="text-sm text-gray-400 mt-1">Provide your legal credentials to get verified.</p>
                        </div>
                        <motion.button whileHover={{ scale: 1.1, rotate: 90 }} transition={{ duration: 0.2 }}
                          onClick={() => setShowVerifyModal(false)}
                          className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-200 dark:hover:bg-white/10 transition-all">
                          <X size={18} />
                        </motion.button>
                      </div>

                      <form onSubmit={handleVerifySubmit} className="space-y-5">
                        {/* CNIC */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400">CNIC</label>
                          <input type="text" value={vData.cnic} onChange={e => setVData({ ...vData, cnic: e.target.value })}
                            placeholder="xxxxx-xxxxxxx-x"
                            className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 outline-none focus:border-red-500 dark:focus:border-red-500 transition-colors text-gray-900 dark:text-white font-mono font-bold text-sm" />
                        </div>

                        {/* Phone */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400">Phone Number</label>
                          <div className="relative">
                            <Phone size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input type="text" value={vData.phone} onChange={e => setVData({ ...vData, phone: e.target.value })}
                              placeholder="03XXXXXXXXX"
                              className="w-full pl-12 pr-5 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 outline-none focus:border-red-500 dark:focus:border-red-500 transition-colors text-gray-900 dark:text-white font-bold text-sm" />
                          </div>
                        </div>

                        {/* Address */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400">Full Address</label>
                          <div className="relative">
                            <HomeIcon size={16} className="absolute left-5 top-5 text-gray-400" />
                            <textarea value={vData.address} onChange={e => setVData({ ...vData, address: e.target.value })}
                              placeholder="House #, Street, City"
                              rows={3}
                              className="w-full pl-12 pr-5 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 outline-none focus:border-red-500 dark:focus:border-red-500 transition-colors text-gray-900 dark:text-white font-bold text-sm resize-none" />
                          </div>
                        </div>

                        <AnimatePresence>
                          {vError && (
                            <motion.p initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                              className="text-red-500 text-xs font-black text-center py-2 px-4 bg-red-50 dark:bg-red-500/10 rounded-2xl border border-red-100 dark:border-red-500/20">
                              {vError}
                            </motion.p>
                          )}
                        </AnimatePresence>

                        <motion.button
                          type="submit"
                          disabled={verifying}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full py-5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest text-sm shadow-xl shadow-red-500/25 transition-all relative overflow-hidden group/submit disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          <div className="absolute inset-0 -translate-x-full group-hover/submit:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-12" />
                          <span className="relative z-10 flex items-center justify-center gap-2">
                            {verifying ? (
                              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Submitting...</>
                            ) : (
                              <><ShieldCheck size={16} /> Submit Verification</>
                            )}
                          </span>
                        </motion.button>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fixed ambient orbs */}
      <div className="fixed top-1/4 right-0 w-96 h-96 bg-red-500/4 dark:bg-red-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-1/4 left-0 w-80 h-80 bg-red-500/4 dark:bg-red-500/4 rounded-full blur-[100px] pointer-events-none" />
    </div>
  );
};

export default Profile;