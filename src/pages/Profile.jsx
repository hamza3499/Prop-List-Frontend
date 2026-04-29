import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import {
  User, Mail, Plus, Edit2, Building2,
  Sparkles, Eye, CheckCircle, ArrowRight, Save,
  ShieldCheck, ShieldAlert, Clock, X, Phone, Home as HomeIcon,
  Camera, Award, ChevronRight, BarChart3, TrendingUp
} from 'lucide-react';
import {
  getMyProperties, getToken, uploadAvatar,
  resolveImageUrl, updateUserProfile, submitVerification, getUserProfile
} from '../services/api';
import GlassCard from '../components/GlassCard';

/* ─────────────────────────────────────────────────────────────
   DESIGN TOKENS — injected as <style> so they work in both modes
───────────────────────────────────────────────────────────── */
const Tokens = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');

    :root {
      --red:       #dc2626;
      --red-light: #ef4444;
      --red-pale:  #fff1f1;
      --red-mid:   #fca5a5;

      /* Light surface palette */
      --surf-0:  #ffffff;
      --surf-1:  #fafafa;
      --surf-2:  #f4f4f5;
      --surf-3:  #e4e4e7;

      --ink-0:  #09090b;
      --ink-1:  #3f3f46;
      --ink-2:  #71717a;
      --ink-3:  #a1a1aa;

      --radius-card: 28px;
      --radius-pill: 999px;
      --shadow-card: 0 8px 48px -8px rgba(0,0,0,0.10), 0 2px 12px -2px rgba(0,0,0,0.06);
      --shadow-red:  0 8px 40px -8px rgba(220,38,38,0.25);
    }

    .dark {
      --red-pale:  rgba(220,38,38,0.08);
      --red-mid:   rgba(220,38,38,0.4);

      --surf-0:  #0c0c0e;
      --surf-1:  #111113;
      --surf-2:  #18181b;
      --surf-3:  #27272a;

      --ink-0:  #fafafa;
      --ink-1:  #d4d4d8;
      --ink-2:  #a1a1aa;
      --ink-3:  #52525b;

      --shadow-card: 0 8px 48px -8px rgba(0,0,0,0.5), 0 2px 12px -2px rgba(0,0,0,0.3);
      --shadow-red:  0 8px 40px -8px rgba(220,38,38,0.35);
    }

    .profile-root * { box-sizing: border-box; }

    .profile-root {
      font-family: 'DM Sans', sans-serif;
      background: var(--surf-1);
      color: var(--ink-0);
      min-height: 100vh;
    }

    /* ── Card ── */
    .p-card {
      background: var(--surf-0);
      border: 1px solid var(--surf-3);
      border-radius: var(--radius-card);
      box-shadow: var(--shadow-card);
      position: relative;
      overflow: hidden;
    }

    /* light mode: add a very subtle top accent stripe */
    .p-card::before {
      content: '';
      position: absolute;
      inset: 0 0 auto 0;
      height: 2px;
      background: linear-gradient(90deg, transparent 0%, var(--red) 40%, var(--red-light) 60%, transparent 100%);
      opacity: 0.5;
    }

    /* ── Pill badge ── */
    .pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 14px;
      border-radius: var(--radius-pill);
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 0.18em;
      text-transform: uppercase;
    }
    .pill-red   { background: var(--red-pale); color: var(--red); border: 1px solid rgba(220,38,38,0.2); }
    .pill-green { background: rgba(16,185,129,0.08); color: #059669; border: 1px solid rgba(16,185,129,0.2); }
    .pill-blue  { background: rgba(59,130,246,0.08); color: #2563eb; border: 1px solid rgba(59,130,246,0.2); }
    .pill-amber { background: rgba(245,158,11,0.08); color: #d97706; border: 1px solid rgba(245,158,11,0.2); }
    .pill-gray  { background: var(--surf-2); color: var(--ink-2); border: 1px solid var(--surf-3); }

    /* ── Stat card ── */
    .stat-card {
      background: var(--surf-0);
      border: 1px solid var(--surf-3);
      border-radius: 20px;
      padding: 24px 22px;
      box-shadow: var(--shadow-card);
      position: relative;
      overflow: hidden;
      cursor: default;
      transition: transform 0.3s, box-shadow 0.3s;
    }
    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-red);
    }
    /* light: subtle inner top border colored per accent */
    .stat-card::after {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 3px;
      border-radius: 20px 20px 0 0;
      background: var(--stat-color, var(--red));
      opacity: 0.7;
    }

    /* ── Input ── */
    .p-input {
      width: 100%;
      padding: 13px 16px;
      border-radius: 14px;
      border: 1.5px solid var(--surf-3);
      background: var(--surf-1);
      color: var(--ink-0);
      font-family: 'DM Sans', sans-serif;
      font-size: 14px;
      font-weight: 500;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .p-input:focus {
      border-color: var(--red);
      box-shadow: 0 0 0 3px rgba(220,38,38,0.1);
    }
    .p-input::placeholder { color: var(--ink-3); }

    /* ── Primary button ── */
    .btn-primary {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 13px 28px;
      border-radius: 14px;
      background: var(--red);
      color: #fff;
      font-weight: 700;
      font-size: 13px;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      border: none;
      cursor: pointer;
      box-shadow: var(--shadow-red);
      transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
      position: relative;
      overflow: hidden;
    }
    .btn-primary:hover { background: var(--red-light); transform: translateY(-1px); }
    .btn-primary:active { transform: translateY(0); }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

    /* Shimmer sweep on btn-primary */
    .btn-primary::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
      transform: translateX(-100%) skewX(-12deg);
      transition: transform 0.6s;
    }
    .btn-primary:hover::after { transform: translateX(100%) skewX(-12deg); }

    /* ── Secondary button ── */
    .btn-secondary {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 13px 28px;
      border-radius: 14px;
      background: var(--surf-2);
      color: var(--ink-1);
      font-weight: 700;
      font-size: 13px;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      border: 1.5px solid var(--surf-3);
      cursor: pointer;
      transition: background 0.2s, border-color 0.2s, transform 0.15s;
    }
    .btn-secondary:hover {
      background: var(--surf-3);
      border-color: var(--red);
      color: var(--red);
      transform: translateY(-1px);
    }

    /* ── Avatar ring ── */
    @keyframes ring-spin { to { transform: rotate(360deg); } }
    .avatar-ring {
      position: absolute;
      inset: -6px;
      border-radius: 50%;
      border: 2px dashed rgba(220,38,38,0.35);
      animation: ring-spin 12s linear infinite;
    }
    .avatar-ring-2 {
      position: absolute;
      inset: -14px;
      border-radius: 50%;
      border: 1.5px dashed rgba(220,38,38,0.15);
      animation: ring-spin 20s linear infinite reverse;
    }

    /* ── Orbit dot ── */
    @keyframes orbit { from{transform:rotate(0deg) translateX(80px) rotate(0deg)} to{transform:rotate(360deg) translateX(80px) rotate(-360deg)} }
    @keyframes orbit2{ from{transform:rotate(60deg) translateX(106px) rotate(-60deg)} to{transform:rotate(420deg) translateX(106px) rotate(-420deg)} }

    /* ── Section label ── */
    .section-label {
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: var(--red);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .section-label::before {
      content: '';
      display: block;
      width: 24px;
      height: 2px;
      background: var(--red);
      border-radius: 2px;
    }

    /* ── Empty state ── */
    @keyframes float-empty { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
    .float-empty { animation: float-empty 3s ease-in-out infinite; }

    /* ── Pulse dot ── */
    @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.7)} }

    /* ── Shimmer ── */
    @keyframes shimmer { from{background-position:-200% center} to{background-position:200% center} }
    .shimmer-text {
      background: linear-gradient(90deg, var(--ink-0) 30%, var(--red) 50%, var(--ink-0) 70%);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: shimmer 5s linear infinite;
    }

    /* ── Hero gradient — works beautifully in light ── */
    .hero-grad {
      background: linear-gradient(
        160deg,
        #fff8f8 0%,
        #fff1f1 30%,
        #ffeaea 60%,
        #fff 100%
      );
    }
    .dark .hero-grad {
      background: linear-gradient(
        160deg,
        #0f0507 0%,
        #130508 30%,
        #0c0c0e 60%,
        #0c0c0e 100%
      );
    }

    /* ── Mesh pattern ── */
    .mesh-pattern {
      background-image: radial-gradient(circle, rgba(220,38,38,0.07) 1px, transparent 1px);
      background-size: 28px 28px;
    }
    .dark .mesh-pattern {
      background-image: radial-gradient(circle, rgba(220,38,38,0.12) 1px, transparent 1px);
    }

    /* ── Property card wrapper ── */
    .prop-card {
      border-radius: 20px;
      overflow: hidden;
      box-shadow: var(--shadow-card);
      transition: transform 0.3s, box-shadow 0.3s;
    }
    .prop-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-red); }

    /* ── Pagination btn ── */
    .pg-btn {
      width: 44px; height: 44px;
      border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
      border: 1.5px solid var(--surf-3);
      background: var(--surf-0);
      color: var(--ink-2);
      cursor: pointer;
      transition: all 0.2s;
      font-weight: 700;
      font-size: 14px;
    }
    .pg-btn:hover { border-color: var(--red); color: var(--red); }
    .pg-btn.active { background: var(--red); border-color: var(--red); color: #fff; transform: scale(1.08); box-shadow: var(--shadow-red); }
    .pg-btn:disabled { opacity: 0.3; cursor: not-allowed; }

    /* ── Verification alert ── */
    .verify-alert {
      padding: 14px 18px;
      border-radius: 16px;
      display: flex;
      align-items: flex-start;
      gap: 14px;
      max-width: 480px;
    }
    .verify-alert.amber {
      background: rgba(245,158,11,0.07);
      border: 1.5px solid rgba(245,158,11,0.22);
    }
    .verify-alert.blue {
      background: rgba(59,130,246,0.07);
      border: 1.5px solid rgba(59,130,246,0.22);
    }

    /* ── Modal ── */
    .modal-card {
      background: var(--surf-0);
      border: 1px solid var(--surf-3);
      border-radius: 32px;
      box-shadow: 0 40px 120px -20px rgba(0,0,0,0.35);
      width: 100%;
      max-width: 480px;
      position: relative;
      overflow: hidden;
    }
    .modal-card::before {
      content: '';
      position: absolute;
      inset: 0 0 auto 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, var(--red), transparent);
    }

    /* ── DM Serif ── */
    .serif { font-family: 'DM Serif Display', serif; }
  `}</style>
);

/* ─────────────────────────────────────────────────────────────
   TILT CARD
───────────────────────────────────────────────────────────── */
const TiltCard = ({ children, className = '', intensity = 6 }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rX = useSpring(useTransform(y, [-0.5, 0.5], [intensity, -intensity]), { stiffness: 180, damping: 22 });
  const rY = useSpring(useTransform(x, [-0.5, 0.5], [-intensity, intensity]), { stiffness: 180, damping: 22 });

  const onMove = (e) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      style={{ rotateX: rX, rotateY: rY, transformStyle: 'preserve-3d', transformPerspective: 1000 }}
      className={className}>
      {children}
    </motion.div>
  );
};

/* ─────────────────────────────────────────────────────────────
   ANIMATED COUNTER
───────────────────────────────────────────────────────────── */
const Counter = ({ target, suffix = '' }) => {
  const [n, setN] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        let f = 0;
        const steps = 50;
        const inc = target / steps;
        const iv = setInterval(() => {
          f += inc;
          if (f >= target) { setN(target); clearInterval(iv); }
          else setN(Math.floor(f));
        }, 30);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);

  return <span ref={ref}>{typeof target === 'string' ? target : n}{suffix}</span>;
};

/* ─────────────────────────────────────────────────────────────
   STAT CARD
───────────────────────────────────────────────────────────── */
const StatCard = ({ icon: Icon, label, value, colorVar, delay, suffix = '', trend }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    className="stat-card group"
    style={{ '--stat-color': colorVar }}
  >
    {/* Subtle corner glow */}
    <div style={{
      position: 'absolute', top: -40, right: -40,
      width: 120, height: 120, borderRadius: '50%',
      background: `radial-gradient(circle, ${colorVar}20, transparent)`,
      filter: 'blur(24px)',
      opacity: 0,
      transition: 'opacity 0.4s',
    }} className="group-hover:opacity-100" />

    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
      <div style={{
        width: 46, height: 46, borderRadius: 14,
        background: `${colorVar}12`,
        border: `1.5px solid ${colorVar}25`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={20} style={{ color: colorVar }} strokeWidth={2} />
      </div>
      {trend && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, color: '#10b981' }}>
          <TrendingUp size={12} /> {trend}
        </div>
      )}
    </div>

    <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: '2.4rem', lineHeight: 1, color: 'var(--ink-0)', marginBottom: 6 }}>
      {typeof value === 'string' ? value : <Counter target={value} suffix={suffix} />}
    </div>
    <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>
      {label}
    </div>
  </motion.div>
);

/* ─────────────────────────────────────────────────────────────
   VERIFICATION BADGE
───────────────────────────────────────────────────────────── */
const VerifBadge = ({ status }) => {
  if (status === 'verified') return (
    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }}
      className="pill pill-green">
      <ShieldCheck size={11} strokeWidth={3} />
      Verified
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', animation: 'pulse-dot 2s ease-in-out infinite', display: 'inline-block' }} />
    </motion.div>
  );
  if (status === 'pending') return (
    <div className="pill pill-blue">
      <Clock size={11} style={{ animation: 'ring-spin 3s linear infinite' }} />
      Under Review
    </div>
  );
  if (status === 'rejected') return (
    <div className="pill pill-red">
      <ShieldAlert size={11} />
      Rejected
    </div>
  );
  return null;
};

/* ─────────────────────────────────────────────────────────────
   ORBIT AVATAR — premium animated avatar with orbital dots
───────────────────────────────────────────────────────────── */
const OrbitAvatar = ({ user, userName, verStatus, uploading, onClick }) => (
  <div style={{ position: 'relative', width: 180, height: 180, flexShrink: 0 }}>
    {/* Orbit dots */}
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', width: 8, height: 8, borderRadius: '50%', background: 'var(--red)', boxShadow: '0 0 10px var(--red)', animation: 'orbit 8s linear infinite' }} />
      <div style={{ position: 'absolute', width: 6, height: 6, borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 8px #f59e0b', animation: 'orbit2 12s linear infinite' }} />
    </div>

    {/* Dashed rings */}
    <div className="avatar-ring-2" />
    <div className="avatar-ring" />

    {/* Avatar circle */}
    <motion.div
      whileHover={{ scale: 1.05 }}
      onClick={onClick}
      style={{
        position: 'absolute', inset: 0,
        borderRadius: '50%', overflow: 'hidden', cursor: 'pointer',
        border: '3px solid var(--surf-0)',
        boxShadow: '0 0 0 3px var(--red), 0 16px 48px -8px rgba(220,38,38,0.35)',
      }}
    >
      {user.avatar ? (
        <img src={resolveImageUrl(user.avatar)} alt={userName}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        />
      ) : (
        <div style={{
          width: '100%', height: '100%',
          background: 'linear-gradient(135deg, #fff1f1, #ffd6d6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <User size={56} style={{ color: 'var(--red)', opacity: 0.6 }} strokeWidth={1} />
        </div>
      )}
      {/* Overlay on hover */}
      <div style={{
        position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: 0, transition: 'opacity 0.3s', backdropFilter: 'blur(4px)',
      }}
        onMouseEnter={e => e.currentTarget.style.opacity = 1}
        onMouseLeave={e => e.currentTarget.style.opacity = 0}>
        {uploading
          ? <div style={{ width: 28, height: 28, borderRadius: '50%', border: '3px solid #fff', borderTopColor: 'transparent', animation: 'ring-spin 0.8s linear infinite' }} />
          : <Camera size={28} color="#fff" />}
      </div>
    </motion.div>

    {/* Verified badge */}
    {verStatus === 'verified' && (
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.6 }}
        style={{
          position: 'absolute', bottom: 6, right: 6,
          width: 36, height: 36, borderRadius: '50%',
          background: '#10b981',
          border: '3px solid var(--surf-0)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(16,185,129,0.4)',
          zIndex: 10,
        }}>
        <ShieldCheck size={16} color="#fff" strokeWidth={3} />
      </motion.div>
    )}
  </div>
);

/* ─────────────────────────────────────────────────────────────
   MAIN PROFILE COMPONENT
───────────────────────────────────────────────────────────── */
const Profile = () => {
  const listingsRef = useRef(null);
  const fileInputRef = useRef(null);

  const [userListings, setUserListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
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
  const heroY = useTransform(scrollY, [0, 400], [0, 70]);

  /* ── fetch ── */
  const fetchUserData = async () => {
    try {
      const token = getToken();
      if (token) {
        const profile = await getUserProfile(token);
        if (profile) {
          const u = { ...user, ...profile };
          localStorage.setItem('user', JSON.stringify(u));
          setUser(u);
        }
        const data = await getMyProperties(token);
        setUserListings(data.map(p => ({
          ...p,
          location: p.city || p.location || 'Unknown Location',
          image: resolveImageUrl(p.images?.[0] || p.image),
          beds: p.beds || 'N/A',
          baths: p.baths || 'N/A',
          sqft: p.size ? `${p.size} ${p.sizeUnit || ''}`.trim() : (p.sqft || 'N/A'),
          status: 'Listing',
          price: String(p.price).startsWith('PKR') ? p.price : `PKR ${Number(p.price).toLocaleString()}`,
          views: Math.floor(Math.random() * 500) + 50,
        })));
      }
    } catch (err) {
      console.error('Profile load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let alive = true;
    fetchUserData().then(() => { }).catch(() => { });
    return () => { alive = false; };
  }, []);

  /* ── avatar upload ── */
  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('avatar', file);
      const res = await uploadAvatar(fd, getToken());
      const u = { ...user, avatar: res.avatar };
      localStorage.setItem('user', JSON.stringify(u));
      setUser(u);
    } finally {
      setUploading(false);
    }
  };

  /* ── save name ── */
  const handleSaveName = async () => {
    if (!editedName.trim() || editedName.trim().length < 2) {
      setEditError('Name must be at least 2 characters'); return;
    }
    setSaving(true); setEditError('');
    try {
      const res = await updateUserProfile({ name: editedName.trim() }, getToken());
      const u = { ...user, name: res.user.name };
      localStorage.setItem('user', JSON.stringify(u));
      setUser(u);
      setIsEditing(false);
    } catch (err) {
      setEditError(err.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  /* ── verify submit ── */
  const handleVerifySubmit = async (e) => {
    e.preventDefault(); setVError('');
    if (!/^\d{5}-\d{7}-\d{1}$/.test(vData.cnic)) { setVError('Invalid CNIC. Format: xxxxx-xxxxxxx-x'); return; }
    if (!/^\d{11}$/.test(vData.phone)) { setVError('Phone must be 11 digits'); return; }
    if (!vData.address.trim()) { setVError('Address is required'); return; }
    setVerifying(true);
    try {
      await submitVerification(vData, getToken());
      const u = { ...user, verificationStatus: 'pending' };
      localStorage.setItem('user', JSON.stringify(u));
      setUser(u);
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
    { icon: Building2, label: 'Total Listed', value: userListings.length, colorVar: '#3b82f6', delay: 0.10 },
    { icon: Sparkles, label: 'Active Listings', value: userListings.length, colorVar: '#dc2626', delay: 0.18, trend: '+12%' },
    { icon: Eye, label: 'Profile Views', value: '1.2k', colorVar: '#f59e0b', delay: 0.26 },
    { icon: Award, label: 'Reputation', value: 98, suffix: '%', colorVar: '#10b981', delay: 0.34, trend: 'Top 5%' },
  ];

  /* ── Loading ── */
  if (loading) return (
    <>
      <Tokens />
      <div className="profile-root" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', border: '3px solid rgba(220,38,38,0.15)', borderTopColor: 'var(--red)', animation: 'ring-spin 0.9s linear infinite' }} />
          <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--ink-3)', animation: 'pulse-dot 1.5s ease-in-out infinite' }}>
            Loading Profile
          </p>
        </div>
      </div>
    </>
  );

  return (
    <>
      <Tokens />
      <div className="profile-root">

        {/* ══════════════════════════════════════════════
            HERO BANNER — beautiful in light & dark
        ══════════════════════════════════════════════ */}
        <div style={{ position: 'relative', height: 380, overflow: 'hidden' }}>
          {/* Parallax image */}
          <motion.div style={{ y: heroY, position: 'absolute', inset: 0 }}>
            <img
              src="https://images.unsplash.com/photo-1582407947304-fd86f28f4285?auto=format&fit=crop&q=80&w=2000"
              style={{ width: '100%', height: '110%', objectFit: 'cover' }}
              alt="hero"
              loading="eager"
              decoding="async"
            />
            {/* Light-mode: warm cream-tinted overlay; dark-mode handled via CSS */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 50%, var(--surf-1) 100%)',
            }} />
          </motion.div>

          {/* Floating blobs */}
          {[
            { size: 360, color: 'rgba(220,38,38,0.22)', x: '8%', y: '5%', dur: 14 },
            { size: 280, color: 'rgba(239,68,68,0.15)', x: '65%', y: '35%', dur: 18 },
          ].map((o, i) => (
            <motion.div key={i}
              style={{
                position: 'absolute', width: o.size, height: o.size, borderRadius: '50%',
                background: `radial-gradient(circle, ${o.color}, transparent)`,
                left: o.x, top: o.y, filter: 'blur(55px)', pointerEvents: 'none',
              }}
              animate={{ x: [0, 25, -15, 0], y: [0, -30, 18, 0] }}
              transition={{ duration: o.dur, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}

          {/* Hero title */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 5, paddingTop: 48 }}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="pill pill-red"
              style={{ marginBottom: 14, backdropFilter: 'blur(8px)', background: 'rgba(220,38,38,0.18)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              <Sparkles size={10} /> Executive Member
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="serif"
              style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)', color: '#fff', textAlign: 'center', lineHeight: 1.05, letterSpacing: '-0.02em' }}
            >
              {userName}<span style={{ color: '#fca5a5' }}>.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
              style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14, marginTop: 8 }}
            >
              {userEmail}
            </motion.p>
          </div>
        </div>

        {/* ══════════════════════════════════════════════
            PAGE BODY
        ══════════════════════════════════════════════ */}
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 20px 80px', position: 'relative', zIndex: 10, marginTop: -80 }}>

          {/* ── PROFILE CARD ── */}
          <TiltCard intensity={3} style={{ marginBottom: 20 }}>
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="p-card"
              style={{ padding: 'clamp(24px, 4vw, 40px)' }}
            >
              {/* Mesh pattern BG */}
              <div className="mesh-pattern" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.4 }} />
              {/* Corner accent */}
              <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(220,38,38,0.08), transparent)', pointerEvents: 'none' }} />

              <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 32 }}>

                {/* Avatar */}
                <OrbitAvatar
                  user={user} userName={userName} verStatus={verStatus}
                  uploading={uploading}
                  onClick={() => fileInputRef.current?.click()}
                />
                <input ref={fileInputRef} type="file" style={{ display: 'none' }} accept="image/*" onChange={handleAvatarChange} />

                {/* Info */}
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                    <VerifBadge status={verStatus} />
                    <div className="pill pill-gray">✦ Executive Member</div>
                  </div>

                  {/* Name / edit */}
                  <AnimatePresence mode="wait">
                    {isEditing ? (
                      <motion.div key="edit" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ marginBottom: 16 }}>
                        <input
                          className="p-input serif"
                          style={{ fontSize: '1.9rem', fontWeight: 700, maxWidth: 340, marginBottom: 10 }}
                          value={editedName}
                          onChange={e => setEditedName(e.target.value)}
                          autoFocus
                          placeholder="Your name"
                        />
                        {editError && <p style={{ color: 'var(--red)', fontSize: 12, fontWeight: 600, marginBottom: 8 }}>{editError}</p>}
                        <div style={{ display: 'flex', gap: 10 }}>
                          <button className="btn-primary" onClick={handleSaveName} disabled={saving} style={{ padding: '10px 20px', fontSize: 12 }}>
                            {saving ? <div style={{ width: 12, height: 12, borderRadius: '50%', border: '2px solid #fff', borderTopColor: 'transparent', animation: 'ring-spin 0.8s linear infinite' }} /> : <Save size={13} />}
                            Save
                          </button>
                          <button className="btn-secondary" onClick={() => { setIsEditing(false); setEditError(''); }} style={{ padding: '10px 20px', fontSize: 12 }}>
                            Cancel
                          </button>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div key="display" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                        <h2 className="serif" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: 'var(--ink-0)', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
                          {userName}
                        </h2>
                        <motion.button
                          whileHover={{ scale: 1.1, rotate: 8 }} whileTap={{ scale: 0.9 }}
                          onClick={() => { setEditedName(userName); setIsEditing(true); setEditError(''); }}
                          style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--surf-2)', border: '1.5px solid var(--surf-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--ink-2)', transition: 'all 0.2s', flexShrink: 0 }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'var(--red-pale)'; e.currentTarget.style.color = 'var(--red)'; e.currentTarget.style.borderColor = 'rgba(220,38,38,0.3)'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'var(--surf-2)'; e.currentTarget.style.color = 'var(--ink-2)'; e.currentTarget.style.borderColor = 'var(--surf-3)'; }}
                        >
                          <Edit2 size={15} />
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <p style={{ display: 'flex', alignItems: 'center', gap: 7, color: 'var(--ink-2)', fontSize: 14, marginBottom: 20 }}>
                    <Mail size={14} style={{ color: 'var(--red)', opacity: 0.7 }} /> {userEmail}
                  </p>

                  {/* Verify alerts */}
                  {(verStatus === 'unverified' || verStatus === 'rejected') && (
                    <motion.div initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} className="verify-alert amber" style={{ marginBottom: 0 }}>
                      <ShieldAlert size={18} style={{ color: '#d97706', flexShrink: 0, marginTop: 2 }} />
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 13, fontWeight: 800, color: '#92400e', marginBottom: 3 }}>
                          {verStatus === 'rejected' ? 'Verification Rejected' : 'Account Not Verified'}
                        </p>
                        <p style={{ fontSize: 12, color: '#b45309', opacity: 0.8 }}>Verify your identity to list premium properties.</p>
                      </div>
                      <button
                        className="btn-primary"
                        onClick={() => setShowVerifyModal(true)}
                        style={{ background: '#d97706', boxShadow: '0 4px 16px rgba(217,119,6,0.35)', padding: '9px 16px', fontSize: 11, whiteSpace: 'nowrap', flexShrink: 0 }}
                      >
                        {verStatus === 'rejected' ? 'Try Again' : 'Verify Now'}
                      </button>
                    </motion.div>
                  )}
                  {verStatus === 'pending' && (
                    <motion.div initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} className="verify-alert blue">
                      <Clock size={18} style={{ color: '#2563eb', animation: 'ring-spin 4s linear infinite', flexShrink: 0 }} />
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 800, color: '#1d4ed8', marginBottom: 3 }}>Verification Under Review</p>
                        <p style={{ fontSize: 12, color: '#1e40af', opacity: 0.8 }}>Our team is reviewing your credentials.</p>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Action buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0, width: '100%', maxWidth: 200 }}>
                  <motion.button
                    className="btn-secondary"
                    whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                    onClick={() => listingsRef.current?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    <Building2 size={16} /> My Listings
                  </motion.button>
                  <motion.button
                    className="btn-primary"
                    whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                    onClick={() => window.location.href = '/add-property'}
                    disabled={verStatus !== 'verified'}
                  >
                    <Plus size={16} /> Add Listing
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </TiltCard>

          {/* ── STATS ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 14, marginBottom: 56 }}>
            {stats.map((s) => <StatCard key={s.label} {...s} />)}
          </div>

          {/* ── LISTINGS SECTION ── */}
          <div ref={listingsRef}>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, marginBottom: 36 }}
            >
              <div>
                <div className="section-label" style={{ marginBottom: 10 }}>Your Portfolio</div>
                <h2 className="serif" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--ink-0)', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
                  Property{' '}
                  <em style={{ color: 'var(--red)', fontStyle: 'italic' }}>Collection</em>
                </h2>
              </div>
              {userListings.length > 0 && (
                <div className="pill pill-red" style={{ fontSize: 11 }}>
                  {userListings.length} Active {userListings.length === 1 ? 'Listing' : 'Listings'}
                </div>
              )}
            </motion.div>

            {/* Empty state */}
            {userListings.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  padding: '80px 24px',
                  borderRadius: 28,
                  border: '2px dashed var(--surf-3)',
                  background: 'var(--surf-0)',
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Subtle radial glow */}
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 40%, rgba(220,38,38,0.04), transparent 65%)', pointerEvents: 'none' }} />

                <div className="float-empty" style={{
                  width: 88, height: 88, borderRadius: 24,
                  background: 'var(--surf-2)',
                  border: '1.5px solid var(--surf-3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 28px',
                }}>
                  <Building2 size={40} style={{ color: 'var(--ink-3)', opacity: 0.7 }} strokeWidth={1} />
                </div>

                <h3 className="serif" style={{ fontSize: '1.8rem', color: 'var(--ink-2)', marginBottom: 10 }}>No listings yet.</h3>
                <p style={{ color: 'var(--ink-3)', fontSize: 14, maxWidth: 300, margin: '0 auto 28px' }}>
                  Add your first property and start showcasing to verified buyers.
                </p>
                <motion.button
                  className="btn-primary"
                  whileHover={{ y: -2, scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => window.location.href = '/add-property'}
                  disabled={verStatus !== 'verified'}
                >
                  <Plus size={16} /> Add First Property
                </motion.button>
              </motion.div>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
                  {currentProperties.map((prop, i) => (
                    <motion.div
                      key={prop._id || prop.id || i}
                      initial={{ opacity: 0, y: 32 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                      className="prop-card"
                    >
                      <GlassCard property={prop} />
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 40 }}>
                    <button
                      className="pg-btn"
                      onClick={() => { setCurrentPage(p => p - 1); listingsRef.current?.scrollIntoView({ behavior: 'smooth' }); }}
                      disabled={currentPage === 1}
                    >
                      <ArrowRight size={17} style={{ transform: 'rotate(180deg)' }} />
                    </button>

                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        className={`pg-btn ${currentPage === i + 1 ? 'active' : ''}`}
                        onClick={() => { setCurrentPage(i + 1); listingsRef.current?.scrollIntoView({ behavior: 'smooth' }); }}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      className="pg-btn"
                      onClick={() => { setCurrentPage(p => p + 1); listingsRef.current?.scrollIntoView({ behavior: 'smooth' }); }}
                      disabled={currentPage === totalPages}
                    >
                      <ArrowRight size={17} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* ══════════════════════════════════════════════
            VERIFICATION MODAL
        ══════════════════════════════════════════════ */}
        <AnimatePresence>
          {showVerifyModal && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{
                position: 'fixed', inset: 0, zIndex: 200,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: 20,
                background: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(14px)',
              }}
              onClick={e => { if (e.target === e.currentTarget) setShowVerifyModal(false); }}
            >
              <motion.div
                initial={{ scale: 0.88, opacity: 0, y: 32 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.88, opacity: 0, y: 32 }}
                transition={{ type: 'spring', stiffness: 210, damping: 22 }}
                className="modal-card"
              >
                <div style={{ padding: 'clamp(24px, 5vw, 40px)' }}>
                  <AnimatePresence mode="wait">
                    {vSuccess ? (
                      <motion.div key="success" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
                        style={{ padding: '48px 0', textAlign: 'center' }}>
                        <motion.div
                          animate={{ scale: [1, 1.12, 1] }}
                          transition={{ repeat: 2, duration: 0.4 }}
                          style={{
                            width: 88, height: 88, borderRadius: 28,
                            background: 'rgba(16,185,129,0.1)',
                            border: '1.5px solid rgba(16,185,129,0.3)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 24px',
                          }}
                        >
                          <CheckCircle size={44} style={{ color: '#10b981' }} strokeWidth={1.5} />
                        </motion.div>
                        <h3 className="serif" style={{ fontSize: '2rem', color: 'var(--ink-0)', marginBottom: 8 }}>Submitted!</h3>
                        <p style={{ color: 'var(--ink-2)', fontSize: 14 }}>Your request is pending admin review.</p>
                      </motion.div>
                    ) : (
                      <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        {/* Modal header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
                          <div>
                            <div className="pill pill-red" style={{ marginBottom: 10 }}>
                              <ShieldCheck size={10} /> Identity Verification
                            </div>
                            <h2 className="serif" style={{ fontSize: '1.8rem', color: 'var(--ink-0)', lineHeight: 1.15 }}>
                              Get Verified
                            </h2>
                            <p style={{ color: 'var(--ink-2)', fontSize: 13, marginTop: 4 }}>
                              Provide your legal credentials below.
                            </p>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            onClick={() => setShowVerifyModal(false)}
                            style={{
                              width: 36, height: 36, borderRadius: 10,
                              background: 'var(--surf-2)', border: '1.5px solid var(--surf-3)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              cursor: 'pointer', color: 'var(--ink-2)',
                            }}
                          >
                            <X size={16} />
                          </motion.button>
                        </div>

                        <form onSubmit={handleVerifySubmit}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

                            {/* CNIC */}
                            <div>
                              <label style={{ display: 'block', fontSize: 10, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 7 }}>
                                CNIC
                              </label>
                              <input className="p-input" type="text"
                                value={vData.cnic}
                                onChange={e => setVData({ ...vData, cnic: e.target.value })}
                                placeholder="xxxxx-xxxxxxx-x"
                                style={{ fontFamily: 'monospace', fontWeight: 600 }}
                              />
                            </div>

                            {/* Phone */}
                            <div>
                              <label style={{ display: 'block', fontSize: 10, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 7 }}>
                                Phone Number
                              </label>
                              <div style={{ position: 'relative' }}>
                                <Phone size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-3)' }} />
                                <input className="p-input" type="text"
                                  value={vData.phone}
                                  onChange={e => setVData({ ...vData, phone: e.target.value })}
                                  placeholder="03XXXXXXXXX"
                                  style={{ paddingLeft: 40 }}
                                />
                              </div>
                            </div>

                            {/* Address */}
                            <div>
                              <label style={{ display: 'block', fontSize: 10, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 7 }}>
                                Full Address
                              </label>
                              <div style={{ position: 'relative' }}>
                                <HomeIcon size={15} style={{ position: 'absolute', left: 14, top: 16, color: 'var(--ink-3)' }} />
                                <textarea className="p-input" rows={3}
                                  value={vData.address}
                                  onChange={e => setVData({ ...vData, address: e.target.value })}
                                  placeholder="House #, Street, City"
                                  style={{ paddingLeft: 40, resize: 'none' }}
                                />
                              </div>
                            </div>

                            {/* Error */}
                            <AnimatePresence>
                              {vError && (
                                <motion.div
                                  initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                  style={{ padding: '10px 14px', borderRadius: 12, background: 'var(--red-pale)', border: '1.5px solid rgba(220,38,38,0.2)', color: 'var(--red)', fontSize: 13, fontWeight: 600 }}
                                >
                                  {vError}
                                </motion.div>
                              )}
                            </AnimatePresence>

                            <motion.button
                              type="submit"
                              className="btn-primary"
                              disabled={verifying}
                              whileHover={{ scale: 1.02, y: -1 }}
                              whileTap={{ scale: 0.98 }}
                              style={{ width: '100%', padding: '16px', fontSize: 14, marginTop: 4 }}
                            >
                              {verifying
                                ? <><div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', animation: 'ring-spin 0.8s linear infinite' }} /> Submitting...</>
                                : <><ShieldCheck size={16} /> Submit Verification</>
                              }
                            </motion.button>
                          </div>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ambient fixed orbs */}
        <div style={{ position: 'fixed', top: '20%', right: 0, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(220,38,38,0.04), transparent)', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'fixed', bottom: '20%', left: 0, width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(220,38,38,0.03), transparent)', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />
      </div>
    </>
  );
};

export default Profile;