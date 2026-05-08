import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import {
  Upload, Plus, X, CheckCircle, ArrowRight, ArrowLeft,
  Home, MapPin, Image as ImageIcon, Bed, Bath,
  Move, FileText, Eye, Shield, Sparkles, Info, AlertCircle,
  Tag, Compass, Phone, MessageCircle, Map, Layers, Building, Key,
  Loader2, BadgeCent, Check, CloudLightning, Save, ChevronDown, Ruler, Clock, History
} from 'lucide-react';
import { addProperty, getToken, getUserProfile, getMyProperties } from '../services/api';
import GlowButton from '../components/GlowButton';

/* ─── Custom Zap ─────────────────────────────────────────────── */
function Zap(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24"
      viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

const PKRIcon = () => <span className="text-[10px] font-black tracking-tight" style={{ color: 'inherit' }}>PKR</span>;

/* ─── DESIGN TOKENS ──────────────────────────────────────────── */
// Primary: #C8102E (deep crimson-red)
// Light accent: #FF3355
// White: #FFFFFF / #FAFAFA
// Off-white surface: #FFF5F7
// Deep ink: #1A0008

/* ══════════════════════════════════════════════════════════════
   PREMIUM INPUT
══════════════════════════════════════════════════════════════ */
const PremiumInput = ({ label, id, type = 'text', value, onChange, error, placeholder, helper, icon: Icon }) => {
  const inputRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = String(value || '').length > 0;
  const [hasText, setHasText] = useState(false);

  useEffect(() => {
    if (inputRef.current) setHasText(inputRef.current.value.length > 0);
  }, [value]);

  const active = isFocused || hasValue || hasText;

  return (
    <div className="relative w-full group">
      {/* Outer glow on focus */}
      <div className={`absolute -inset-[1px] rounded-[20px] transition-opacity duration-500 ${isFocused ? 'opacity-100' : 'opacity-0'
        }`} style={{ background: 'linear-gradient(135deg, #C8102E, #FF3355, #C8102E)', padding: 1 }} />

      <div className={`relative rounded-[20px] transition-all duration-400 flex items-center overflow-hidden ${error
          ? 'bg-red-50 border-2 border-red-400 shadow-[0_0_20px_rgba(200,16,46,0.15)]'
          : isFocused
            ? 'bg-white border-2 border-[#C8102E] shadow-[0_16px_40px_-8px_rgba(200,16,46,0.2)]'
            : 'bg-white border-2 border-gray-100 hover:border-red-200 hover:shadow-[0_8px_24px_-4px_rgba(200,16,46,0.08)]'
        }`}>

        {/* Icon slot */}
        <div className={`pl-5 pr-3 shrink-0 transition-all duration-300 ${isFocused ? 'text-[#C8102E] scale-110' : active ? 'text-[#C8102E]' : 'text-gray-300'
          } flex items-center justify-center`}>
          {Icon && <Icon size={22} strokeWidth={isFocused || active ? 2.5 : 2} />}
          {id === 'price' && <PKRIcon />}
        </div>

        {/* Label + Input */}
        <div className="flex-1 relative h-[68px] flex flex-col justify-center">
          <label htmlFor={id} className={`absolute left-0 pointer-events-none font-medium transition-all duration-300 ${active
              ? 'top-[10px] text-[10px] text-[#C8102E] uppercase tracking-[0.22em]'
              : 'top-1/2 -translate-y-1/2 text-[14px] text-gray-400 tracking-wide'
            }`}>{label}</label>

          <input
            ref={inputRef}
            id={id} type={type} value={value} 
            onChange={(e) => {
              setHasText(e.target.value.length > 0);
              onChange(e);
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={isFocused ? placeholder : ''}
            className={`w-full bg-transparent border-none outline-none text-gray-900 font-medium pr-4 transition-all duration-300 ${active ? 'pt-6 text-[15px] tracking-wide' : 'pt-0 text-[15px]'
              }`}
          />
        </div>

        {/* Validation icons */}
        <AnimatePresence>
          {hasValue && !error && !isFocused && (
            <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }} className="pr-5 shrink-0">
              <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                <Check size={13} strokeWidth={3} className="text-white" />
              </div>
            </motion.div>
          )}
          {error && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="pr-5 shrink-0">
              <AlertCircle size={20} className="text-[#C8102E]" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="px-3 mt-1.5 min-h-[18px]">
        {error
          ? <p className="text-[11px] text-[#C8102E] font-bold uppercase tracking-widest flex items-center gap-1"><AlertCircle size={11} /> {error}</p>
          : helper
            ? <p className="text-[11px] text-gray-400 font-medium">{helper}</p>
            : null}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   PREMIUM SELECT
══════════════════════════════════════════════════════════════ */
const PremiumSelect = ({ label, id, value, onChange, options = [], error, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState({});
  const triggerRef = useRef(null);
  const dropRef = useRef(null);

  useEffect(() => {
    const outside = (e) => {
      if (triggerRef.current && !triggerRef.current.contains(e.target) &&
        dropRef.current && !dropRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', outside);
    return () => document.removeEventListener('mousedown', outside);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onScroll = () => setIsOpen(false);
    window.addEventListener('scroll', onScroll, true);
    return () => window.removeEventListener('scroll', onScroll, true);
  }, [isOpen]);

  const open = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const menuH = Math.min(260, (options.length || 0) * 56 + 24);
    setMenuStyle({
      position: 'fixed', left: rect.left, width: rect.width, zIndex: 99999,
      ...(spaceBelow < menuH + 16 ? { bottom: window.innerHeight - rect.top + 8 } : { top: rect.bottom + 8 }),
    });
    setIsOpen(v => !v);
  };

  const opts = Array.isArray(options) ? options : [];
  const selected = opts.find(o => (typeof o === 'string' ? o : o.value) === value);
  const displayLabel = selected ? (typeof selected === 'string' ? selected : selected.label) : '';
  const hasValue = !!value;

  const menu = (
    <AnimatePresence>
      {isOpen && (
        <motion.ul ref={dropRef}
          initial={{ opacity: 0, scaleY: 0.9, y: -6 }}
          animate={{ opacity: 1, scaleY: 1, y: 0 }}
          exit={{ opacity: 0, scaleY: 0.9, y: -6 }}
          transition={{ duration: 0.2 }}
          style={{ ...menuStyle, transformOrigin: 'top' }}
          className="max-h-64 overflow-y-auto bg-white border border-gray-100 rounded-[20px] shadow-[0_24px_60px_-10px_rgba(200,16,46,0.18)] py-2"
        >
          {opts.map((opt, i) => {
            const val = typeof opt === 'string' ? opt : opt.value;
            const lbl = typeof opt === 'string' ? opt : opt.label;
            const OptIcon = typeof opt === 'string' ? null : opt.icon;
            const isSel = value === val;
            return (
              <li key={i}
                onClick={() => { onChange({ target: { value: val } }); setIsOpen(false); }}
                className={`px-5 py-3.5 cursor-pointer flex items-center gap-3 text-sm transition-all duration-200 ${isSel ? 'bg-red-50 text-[#C8102E] font-bold' : 'text-gray-600 hover:bg-red-50/60 hover:text-[#C8102E] font-medium'
                  }`}
              >
                {OptIcon && <OptIcon size={16} className={isSel ? 'text-[#C8102E]' : 'text-gray-300'} />}
                <span>{lbl}</span>
                {isSel && <Check size={15} className="ml-auto text-[#C8102E]" strokeWidth={3} />}
              </li>
            );
          })}
        </motion.ul>
      )}
    </AnimatePresence>
  );

  return (
    <div className="relative w-full">
      <div ref={triggerRef} onClick={open}
        className={`relative rounded-[20px] transition-all duration-400 flex items-center cursor-pointer h-[68px] overflow-hidden ${error ? 'bg-red-50 border-2 border-red-400'
            : isOpen ? 'bg-white border-2 border-[#C8102E] shadow-[0_16px_40px_-8px_rgba(200,16,46,0.2)]'
              : 'bg-white border-2 border-gray-100 hover:border-red-200 hover:shadow-[0_8px_24px_-4px_rgba(200,16,46,0.08)]'
          }`}
      >
        <div className={`pl-5 pr-3 shrink-0 transition-all duration-300 ${isOpen ? 'text-[#C8102E]' : hasValue ? 'text-[#C8102E]' : 'text-gray-300'}`}>
          {Icon && <Icon size={22} strokeWidth={isOpen || hasValue ? 2.5 : 2} />}
        </div>
        <div className="flex-1 relative h-full flex flex-col justify-center overflow-hidden pr-2">
          <span className={`absolute left-0 pointer-events-none font-medium transition-all duration-300 ${isOpen || hasValue ? 'top-[10px] text-[10px] text-[#C8102E] uppercase tracking-[0.22em]' : 'top-1/2 -translate-y-1/2 text-[14px] text-gray-400'
            }`}>{label}</span>
          <span className={`text-gray-900 font-medium truncate transition-all duration-300 text-[15px] ${hasValue || isOpen ? 'pt-5' : 'opacity-0'}`}>{displayLabel}</span>
        </div>
        <div className={`px-5 shrink-0 transition-transform duration-400 ${isOpen ? 'rotate-180 text-[#C8102E]' : 'text-gray-300'}`}>
          <ChevronDown size={20} strokeWidth={2.5} />
        </div>
      </div>
      {typeof document !== 'undefined' && document.body && ReactDOM.createPortal(menu, document.body)}
      <div className="px-3 mt-1.5 min-h-[18px]">
        {error && <p className="text-[11px] text-[#C8102E] font-bold uppercase tracking-widest flex items-center gap-1"><AlertCircle size={11} /> {error}</p>}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   PREMIUM TEXTAREA
══════════════════════════════════════════════════════════════ */
const PremiumTextarea = ({ label, id, value, onChange, error, placeholder, helper, icon: Icon }) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = String(value || '').length > 0;

  return (
    <div className="relative w-full">
      <div className={`relative rounded-[20px] transition-all duration-400 flex overflow-hidden ${error ? 'bg-red-50 border-2 border-red-400'
          : isFocused ? 'bg-white border-2 border-[#C8102E] shadow-[0_16px_40px_-8px_rgba(200,16,46,0.2)]'
            : 'bg-white border-2 border-gray-100 hover:border-red-200 hover:shadow-[0_8px_24px_-4px_rgba(200,16,46,0.08)]'
        }`}>
        <div className={`px-5 pt-6 shrink-0 transition-all duration-300 ${isFocused ? 'text-[#C8102E]' : hasValue ? 'text-[#C8102E]' : 'text-gray-300'}`}>
          {Icon && <Icon size={22} strokeWidth={isFocused || hasValue ? 2.5 : 2} />}
        </div>
        <div className="flex-1 relative min-h-[148px] flex flex-col">
          <label htmlFor={id} className={`absolute left-0 pointer-events-none font-medium transition-all duration-300 ${isFocused || hasValue ? 'top-4 text-[10px] text-[#C8102E] uppercase tracking-[0.22em]' : 'top-6 text-[14px] text-gray-400'
            }`}>{label}</label>
          <textarea id={id} value={value} onChange={onChange}
            onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)}
            placeholder={isFocused ? placeholder : ''} rows={4}
            className={`flex-1 bg-transparent border-none outline-none text-gray-900 font-medium resize-none pr-5 pb-4 transition-all duration-300 ${hasValue || isFocused ? 'pt-10' : 'pt-7'}`}
          />
        </div>
      </div>
      <div className="px-3 mt-1.5 min-h-[18px]">
        {error ? <p className="text-[11px] text-[#C8102E] font-bold flex items-center gap-1 uppercase tracking-widest"><AlertCircle size={11} />{error}</p>
          : helper ? <p className="text-[11px] text-gray-400 font-medium">{helper}</p> : null}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   PREMIUM CHECKBOX
══════════════════════════════════════════════════════════════ */
const PremiumCheckbox = ({ label, checked, onChange, icon: Icon }) => (
  <label className={`relative flex items-center p-5 rounded-[20px] border-2 transition-all duration-500 cursor-pointer group hover:-translate-y-0.5 ${checked
      ? 'border-[#C8102E] bg-gradient-to-br from-red-50 to-white shadow-[0_8px_32px_-8px_rgba(200,16,46,0.2)] scale-[1.02]'
      : 'border-gray-100 bg-white hover:border-red-200 hover:shadow-[0_8px_24px_-8px_rgba(200,16,46,0.1)]'
    }`}>
    <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />

    {/* Icon box */}
    <div className={`w-12 h-12 rounded-[16px] flex items-center justify-center shrink-0 mr-4 transition-all duration-500 ${checked ? 'bg-[#C8102E] text-white shadow-[0_8px_20px_-4px_rgba(200,16,46,0.4)] scale-105' : 'bg-gray-50 text-gray-300 group-hover:bg-red-50 group-hover:text-red-300'
      }`}>
      {Icon && <Icon size={22} strokeWidth={checked ? 2.5 : 2} />}
    </div>

    <span className={`text-sm font-medium tracking-wide transition-colors duration-300 ${checked ? 'text-[#C8102E]' : 'text-gray-500 group-hover:text-gray-700'}`}>
      {label}
    </span>

    {/* Check indicator */}
    <div className={`ml-auto w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300 ${checked ? 'border-[#C8102E] bg-[#C8102E] shadow-[0_4px_12px_rgba(200,16,46,0.35)]' : 'border-gray-200'
      }`}>
      <AnimatePresence>
        {checked && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
            <Check size={14} className="text-white" strokeWidth={3.5} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </label>
);

/* ─── CONFIG ─────────────────────────────────────────────────── */
const STEPS = [
  { id: 1, label: 'Overview', icon: Home },
  { id: 2, label: 'Location', icon: MapPin },
  { id: 3, label: 'Metrics', icon: Ruler },
  { id: 4, label: 'Amenities', icon: Layers },
  { id: 5, label: 'Tags', icon: Tag },
  { id: 6, label: 'Contact', icon: Phone },
  { id: 7, label: 'Media', icon: ImageIcon },
  { id: 8, label: 'Review', icon: Eye },
];

const AMENITIES_LIST = [
  { label: 'Parking', icon: Move },
  { label: 'Gas Line', icon: Zap },
  { label: 'Electricity Back', icon: CloudLightning },
  { label: 'Water Supply', icon: Layers },
  { label: 'Security System', icon: Shield },
  { label: 'Balcony', icon: Map },
  { label: 'Lawn/Garden', icon: Home },
];

const FEATURES_LIST = [
  { label: 'Corner Plot', icon: MapPin },
  { label: 'Park Facing', icon: Compass },
  { label: 'Main Road Access', icon: Building },
  { label: 'Gated Community', icon: Key },
];

/* ══════════════════════════════════════════════════════════════
   STEP ICON — numbered circle with red glow
══════════════════════════════════════════════════════════════ */
const StepCircle = ({ step: s, current, onClick }) => {
  const isActive = current === s.id;
  const isPast = current > s.id;
  return (
    <div className="relative flex flex-col items-center group/step cursor-pointer" onClick={onClick}>
      <motion.div
        animate={isActive ? { scale: [1, 1.08, 1] } : { scale: 1 }}
        transition={{ duration: 2, repeat: Infinity }}
        className={`w-11 h-11 rounded-[14px] flex items-center justify-center border-2 transition-all duration-500 ${isActive
            ? 'bg-[#C8102E] border-[#C8102E] text-white shadow-[0_0_0_4px_rgba(200,16,46,0.15),0_8px_24px_rgba(200,16,46,0.35)]'
            : isPast
              ? 'bg-[#C8102E] border-[#C8102E] text-white shadow-[0_4px_12px_rgba(200,16,46,0.25)]'
              : 'bg-white border-gray-200 text-gray-300 group-hover/step:border-red-200 group-hover/step:text-red-300'
          }`}
      >
        {isPast ? <Check size={18} strokeWidth={3} /> : <s.icon size={18} strokeWidth={2.5} />}
      </motion.div>
      <span className={`absolute -bottom-7 text-[9px] font-bold uppercase tracking-[0.18em] whitespace-nowrap transition-colors duration-300 ${isActive ? 'text-[#C8102E]' : isPast ? 'text-gray-700' : 'text-gray-300 group-hover/step:text-red-300'
        }`}>{s.label}</span>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   STEP HEADER (inside form card)
══════════════════════════════════════════════════════════════ */
const StepHeader = ({ icon: Icon, title, sub }) => (
  <div className="flex items-center gap-5 pb-8 mb-2" style={{ borderBottom: '1.5px solid #FFF0F2' }}>
    <div className="w-16 h-16 rounded-[22px] flex items-center justify-center shrink-0 text-white"
      style={{ background: 'linear-gradient(135deg, #C8102E 0%, #FF3355 100%)', boxShadow: '0 12px 32px -6px rgba(200,16,46,0.4)' }}>
      <Icon size={30} strokeWidth={2} />
    </div>
    <div>
      <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight leading-tight">{title}</h2>
      <p className="text-gray-400 font-semibold mt-1 text-sm tracking-wide">{sub}</p>
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════════ */
const AddProperty = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '', price: '', purpose: '', propertyType: '', description: '',
    city: '', areaSociety: '',
    size: '', sizeUnit: '', beds: '', baths: '', condition: '', age: '',
    // Category Specific
    floors: '', floorNumber: '', buildingName: '', isElevatorAvailable: '',
    plotType: '', subCategory: '', isCornerPlot: '', facing: '', roadWidth: '',
    possessionStatus: '', furnished: '', washrooms: '', parking: '',
    amenities: [], features: [],
    phoneNumber: '', whatsappNumber: '',
  });
  const [images, setImages] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [dir, setDir] = useState(1);
  const [lastSaved, setLastSaved] = useState(null);
  const fileRef = useRef();

  const [isVerified, setIsVerified] = useState(null);
  const [verStatus, setVerStatus] = useState('');
  const [verifiedPhone, setVerifiedPhone] = useState('');
  const [propertyCount, setPropertyCount] = useState(0);

  useEffect(() => {
    const check = async () => {
      const token = getToken();
      if (!token) { navigate('/login'); return; }
      try {
        const [profile, props] = await Promise.all([
          getUserProfile(token),
          getMyProperties(token)
        ]);
        
        if (profile) {
          setVerStatus(profile.verificationStatus || 'unverified');
          setIsVerified(profile.verificationStatus === 'verified');
          if (profile.verificationPhone) {
            setVerifiedPhone(profile.verificationPhone);
            // Pre-fill the phone number for convenience
            setFormData(prev => ({ ...prev, phoneNumber: profile.verificationPhone }));
          }
        } else { 
          setIsVerified(false); 
          setVerStatus('unverified'); 
        }

        if (Array.isArray(props)) {
          setPropertyCount(props.length);
        }
      } catch (err) { 
        console.error("Auth check error:", err);
        setIsVerified(false); 
        setVerStatus('unverified'); 
      }
    };
    check();
  }, [navigate]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (formData.title || formData.price || formData.city) setLastSaved(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearTimeout(t);
  }, [formData]);

  const validateField = (field, value) => {
    if (field === 'title' && !value) return 'Title is required';
    if (field === 'price') {
      if (!value) return 'Price is required';
      if (isNaN(value) || Number(value) <= 0) return 'Price must be greater than 0';
    }
    if (field === 'purpose' && !value) return 'Select purpose';
    if (field === 'propertyType' && !value) return 'Select type';
    if (field === 'city' && !value) return 'City is required';
    if (field === 'areaSociety' && !value) return 'Area/Society is required';
    if (field === 'size' && (!value || Number(value) <= 0)) return 'Size must be greater than 0';
    if (field === 'sizeUnit' && !value) return 'Unit required';
    if (field === 'beds' && !value) return 'Beds required';
    if (field === 'baths' && !value) return 'Baths required';
    if (field === 'condition' && !value) return 'Condition required';
    if (field === 'age' && !value) return 'Age required';
    if (field === 'phoneNumber') {
      if (!value) return 'Phone number is required';
      if (!/^03\d{9}$/.test(value)) return 'Enter a valid 11-digit Pakistani number (03XXXXXXXXX)';
    }
    return null;
  };

  const update = (field) => (e) => {
    const val = e.target.value;
    setFormData(prev => ({ ...prev, [field]: val }));
    setErrors(prev => ({ ...prev, [field]: validateField(field, val) }));
  };

  const toggleArray = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value) ? prev[field].filter(v => v !== value) : [...prev[field], value],
    }));
  };

  const validateStep = (s = step) => {
    const e = {};
    if (s === 1) {
      if (!formData.title) e.title = 'Title is required';
      if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) e.price = 'Price must be greater than 0';
      if (!formData.purpose) e.purpose = 'Select purpose';
      if (!formData.propertyType) e.propertyType = 'Select type';
    } else if (s === 2) {
      if (!formData.city) e.city = 'City is required';
      if (!formData.areaSociety) e.areaSociety = 'Area/Society is required';
    } else if (s === 3) {
      if (!formData.size || Number(formData.size) <= 0) e.size = 'Size is required';
      if (!formData.sizeUnit) e.sizeUnit = 'Unit required';
      
      const isPlot = formData.propertyType === 'Plot / Land';
      const isComm = formData.propertyType === 'Commercial';
      const isRes = !isPlot && !isComm;

      if (isRes) {
        if (!formData.beds) e.beds = 'Beds required';
        if (!formData.baths) e.baths = 'Baths required';
        if (!formData.condition) e.condition = 'Condition required';
        if (!formData.age) e.age = 'Age required';
      }
      if (isPlot) {
        if (!formData.possessionStatus) e.possessionStatus = 'Possession status required';
        if (!formData.plotType) e.plotType = 'Plot type required';
      }
      if (isComm) {
        if (!formData.washrooms) e.washrooms = 'Washrooms required';
      }
    } else if (s === 6) {
      if (!formData.phoneNumber) e.phoneNumber = 'Phone number is required';
      else if (!/^03\d{9}$/.test(formData.phoneNumber)) e.phoneNumber = 'Enter a valid 11-digit Pakistani number';
    } else if (s === 7) {
      if (images.length === 0) e.media = 'Upload at least one image';
    }
    setErrors(prev => ({ ...prev, ...e }));
    return Object.keys(e).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) { setSubmitError(null); setDir(1); setStep(s => Math.min(s + 1, 8)); }
  };
  const prevStep = () => { setErrors({}); setDir(-1); setStep(s => Math.max(s - 1, 1)); };

  const handleFiles = (fileList) => {
    const newFiles = Array.from(fileList).filter(f => f.type.startsWith('image/'));
    if (images.length + newFiles.length > 6) { setErrors(p => ({ ...p, media: 'Maximum 6 images allowed' })); return; }
    setErrors(p => ({ ...p, media: null }));
    newFiles.forEach(file => {
      const r = new FileReader();
      r.onload = (e) => setImages(prev => [...prev, { file, preview: e.target.result }]);
      r.readAsDataURL(file);
    });
  };

  const removeImage = (idx) => setImages(prev => prev.filter((_, i) => i !== idx));

  const handleSubmit = async () => {
    let firstErrStep = null, allValid = true;
    for (let i = 1; i <= 7; i++) {
      if (!validateStep(i)) { allValid = false; if (!firstErrStep) firstErrStep = i; }
    }
    if (!allValid) {
      setSubmitError('Please fix all errors before submitting.');
      setStep(firstErrStep);
      return;
    }
    setErrors({}); setSubmitError(null); setLoading(true);
    try {
      const fd = new FormData();
      fd.append('title', formData.title);
      fd.append('price', formData.price);
      fd.append('purpose', formData.purpose);
      fd.append('propertyType', formData.propertyType);
      fd.append('city', formData.city);
      fd.append('areaSociety', formData.areaSociety);
      fd.append('description', formData.description || 'Premium Property Listing');
      fd.append('size', formData.size);
      fd.append('sizeUnit', formData.sizeUnit);
      fd.append('beds', formData.beds);
      fd.append('baths', formData.baths);
      fd.append('propertyCondition', formData.condition);
      fd.append('propertyAge', formData.age);
      fd.append('phoneNumber', formData.phoneNumber);
      if (formData.whatsappNumber) fd.append('whatsappNumber', formData.whatsappNumber);
      
      // Dynamic fields
      if (formData.floors) fd.append('floors', formData.floors);
      if (formData.floorNumber) fd.append('floorNumber', formData.floorNumber);
      if (formData.buildingName) fd.append('buildingName', formData.buildingName);
      if (formData.isElevatorAvailable) fd.append('isElevatorAvailable', formData.isElevatorAvailable);
      if (formData.plotType) fd.append('plotType', formData.plotType);
      if (formData.subCategory) fd.append('subCategory', formData.subCategory);
      if (formData.isCornerPlot) fd.append('isCornerPlot', formData.isCornerPlot);
      if (formData.facing) fd.append('facing', formData.facing);
      if (formData.roadWidth) fd.append('roadWidth', formData.roadWidth);
      if (formData.possessionStatus) fd.append('possessionStatus', formData.possessionStatus);
      if (formData.furnished) fd.append('furnished', formData.furnished);
      if (formData.washrooms) fd.append('washrooms', formData.washrooms);
      if (formData.parking) fd.append('parking', formData.parking);

      formData.amenities.forEach(a => fd.append('amenities', a));
      formData.features.forEach(f => fd.append('featureTags', f));
      images.forEach(img => fd.append('images', img.file));
      await addProperty(fd, getToken());
      setSuccess('Property listed successfully! Taking you home...');
      setTimeout(() => navigate('/'), 2500);
    } catch (err) {
      setSubmitError(err.message || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const slideVariants = {
    enter: (d) => ({ x: d > 0 ? 70 : -70, opacity: 0, scale: 0.97, filter: 'blur(6px)' }),
    center: { x: 0, opacity: 1, scale: 1, filter: 'blur(0px)', transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
    exit: (d) => ({ x: d > 0 ? -70 : 70, opacity: 0, scale: 0.97, filter: 'blur(6px)', transition: { duration: 0.35 } }),
  };

  const pct = Math.round(((step - 1) / (STEPS.length - 1)) * 100);

  /* ── Loading guard ── */
  if (isVerified === null) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#FFF5F7' }}>
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-16 h-16">
          <div className="w-16 h-16 border-4 border-red-100 border-t-[#C8102E] rounded-full animate-spin" />
          <Shield className="absolute inset-0 m-auto text-[#C8102E]/20" size={24} />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 animate-pulse">Authenticating Session</p>
      </div>
    </div>
  );

  /* ── Unverified guard ── */
  if (!isVerified) {
    const desc = verStatus === 'pending'
      ? 'Your verification is being reviewed. You can post once approved.'
      : 'Verify your identity to start listing premium properties.';
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'linear-gradient(135deg, #FFF5F7 0%, #FFFFFF 100%)' }}>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-[40px] p-10 text-center space-y-8"
          style={{ boxShadow: '0 40px 100px -20px rgba(200,16,46,0.12)', border: '1.5px solid #FFE4E9' }}>
          <div className="w-24 h-24 rounded-[32px] flex items-center justify-center mx-auto"
            style={{ background: 'linear-gradient(135deg, #FFF0F3, #FFD6DE)', boxShadow: '0 12px_32px -6px rgba(200,16,46,0.2)' }}>
            <Shield size={48} strokeWidth={1.5} className="text-[#C8102E]" />
          </div>
          <div>
            <h2 className="text-3xl font-black tracking-tight text-gray-900">Verification Required</h2>
            <p className="text-gray-400 font-medium leading-relaxed mt-3">{desc}</p>
          </div>
          <div className="flex flex-col gap-4">
            {verStatus !== 'pending' && (
              <button onClick={() => navigate('/profile')}
                className="w-full py-4 rounded-[18px] text-white font-black text-sm uppercase tracking-[0.2em] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, #C8102E, #FF3355)', boxShadow: '0 12px 32px -6px rgba(200,16,46,0.4)' }}>
                Verify My Account
              </button>
            )}
            <button onClick={() => navigate('/')} className="text-sm font-black text-gray-400 uppercase tracking-widest hover:text-[#C8102E] transition-colors py-2">
              Return to Home
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════════════
     MAIN RENDER
  ══════════════════════════════════════════════════════════════ */
  return (
    <div className="relative min-h-screen pb-32 overflow-x-hidden pt-24"
      style={{ background: 'linear-gradient(160deg, #FFF5F7 0%, #FFFFFF 40%, #FFF8F9 100%)', fontFamily: "'Montserrat', sans-serif" }}>

      {/* Google Fonts */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Montserrat:wght@400;500;600;700;800;900&display=swap');`}</style>

      {/* ─── Ambient background shapes ─── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        {/* Large soft red blob top-right */}
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full opacity-[0.06]"
          style={{ background: 'radial-gradient(circle, #C8102E 0%, transparent 70%)' }} />
        {/* Small red dot bottom-left */}
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #FF3355 0%, transparent 70%)' }} />
        {/* Grid texture */}
        <div className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage: 'linear-gradient(#C8102E 1px, transparent 1px), linear-gradient(90deg, #C8102E 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }} />
      </div>

      <div className="container mx-auto px-4 md:px-6 max-w-4xl relative" style={{ zIndex: 10 }}>

        {/* ─── Auto-save badge ─── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -top-12 right-0 hidden sm:flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest"
          style={{ background: 'white', border: '1.5px solid #FFE4E9', boxShadow: '0 4px 16px rgba(200,16,46,0.08)', color: '#aaa' }}
        >
          {lastSaved
            ? <><Save size={13} className="text-emerald-500" /> Draft · {lastSaved}</>
            : <><motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-[#C8102E]" /> Live Session</>}
        </motion.div>

        {/* ─── Step Progress Bar ─── */}
        <div className="mb-16 relative px-4 sm:px-14">
          <div className="relative flex justify-between items-center w-full">
            {/* Track */}
            <div className="absolute left-0 right-0 h-[5px] rounded-full top-[22px] -z-10 overflow-hidden"
              style={{ background: '#F3E8EA' }}>
              <motion.div
                className="absolute left-0 top-0 bottom-0 rounded-full"
                style={{ background: 'linear-gradient(90deg, #C8102E, #FF3355)', boxShadow: '0 0 10px rgba(200,16,46,0.5)' }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
              />
            </div>
            {STEPS.map(s => (
              <StepCircle key={s.id} step={s} current={step} onClick={() => !loading && setStep(s.id)} />
            ))}
          </div>
        </div>

        {/* ─── Glass Card ─── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-[40px] p-8 md:p-14 min-h-[520px] flex flex-col"
          style={{
            background: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(40px)',
            border: '1.5px solid rgba(200,16,46,0.08)',
            boxShadow: '0 32px 80px -16px rgba(200,16,46,0.08), 0 0 0 1px rgba(200,16,46,0.04)',
          }}
        >
          {/* Red accent line at top of card */}
          <div className="absolute top-0 left-12 right-12 h-[3px] rounded-b-full"
            style={{ background: 'linear-gradient(90deg, transparent, #C8102E, #FF3355, #C8102E, transparent)' }} />

          {/* ─── LIMIT REACHED ALERT ─── */}
          {propertyCount >= 3 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-6 rounded-[24px] flex flex-col md:flex-row items-center gap-6 text-center md:text-left"
              style={{ background: 'linear-gradient(135deg, #FFF0F3, #FFE4E9)', border: '1.5px solid #FFD6DE', boxShadow: '0 12px 32px -8px rgba(200,16,46,0.1)' }}
            >
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-sm">
                <BadgeCent size={28} className="text-[#C8102E]" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-black text-gray-900 tracking-tight">Listing Limit Reached</h3>
                <p className="text-sm text-gray-500 font-semibold mt-1">You have reached your limit of 3 properties. Upgrade your plan to post more.</p>
              </div>
              <button 
                onClick={() => window.location.href = '/subscription'}
                className="px-6 py-3 rounded-xl bg-[#C8102E] text-white font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-red-500/25"
              >
                Upgrade Plan
              </button>
            </motion.div>
          )}

          <div className="flex-1 relative">
            <AnimatePresence custom={dir} mode="wait">

              {/* ── STEP 1: Overview ── */}
              {step === 1 && (
                <motion.div key="s1" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" className="space-y-8">
                  <StepHeader icon={Home} title="Basic Overview" sub="Establish the core identity of the property." />
                  <div className="space-y-5">
                    <PremiumInput label="Property Title" id="title" value={formData.title} onChange={update('title')} error={errors.title} placeholder="e.g. Modern Minimalist Villa" icon={Tag} />
                    <PremiumInput label="Listing Price (PKR)" id="price" type="text" value={formData.price} onChange={update('price')} error={errors.price} placeholder="e.g. 15000000" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <PremiumSelect label="Market Purpose" id="purpose" value={formData.purpose} onChange={update('purpose')} options={[
                        { label: 'For Sale', value: 'Sale', icon: Tag },
                        { label: 'For Rent', value: 'Rent', icon: Building },
                      ]} error={errors.purpose} icon={Tag} />
                      <PremiumSelect label="Property Type" id="propertyType" value={formData.propertyType} onChange={update('propertyType')} options={[
                        { label: 'House', value: 'House', icon: Home },
                        { label: 'Apartment', value: 'Apartment', icon: Layers },
                        { label: 'Plot / Land', value: 'Plot / Land', icon: Map },
                        { label: 'Commercial', value: 'Commercial', icon: Building },
                      ]} error={errors.propertyType} icon={Building} />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── STEP 2: Location ── */}
              {step === 2 && (
                <motion.div key="s2" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" className="space-y-8">
                  <StepHeader icon={MapPin} title="Geographical Data" sub="Pinpoint where this property exists in the real world." />
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <PremiumInput label="City" id="city" value={formData.city} onChange={update('city')} error={errors.city} placeholder="e.g. Karachi" icon={Building} />
                      <PremiumInput label="Zone / Society" id="areaSociety" value={formData.areaSociety} onChange={update('areaSociety')} error={errors.areaSociety} placeholder="e.g. Bahria Town Phase 8" icon={Map} />
                    </div>
                    <PremiumTextarea label="Narrative Description" id="description" value={formData.description} onChange={update('description')} placeholder="Neighborhood, proximity to schools, unique highlights..." icon={FileText} />
                  </div>
                </motion.div>
              )}

              {/* ── STEP 3: Metrics ── */}
              {step === 3 && (
                <motion.div key="s3" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" className="space-y-8">
                  <StepHeader icon={Ruler} title="Physical Dimensions" sub="Specify architectural metrics and conditioning." />
                  <div className="space-y-6">
                    {/* Common Field: Size */}
                    <div className="grid grid-cols-2 gap-5">
                      <PremiumInput label="Area Size" id="size" type="number" value={formData.size} onChange={update('size')} error={errors.size} placeholder="e.g. 10" icon={Ruler} />
                      <PremiumSelect label="Unit" id="sizeUnit" value={formData.sizeUnit} onChange={update('sizeUnit')} options={['Marla', 'Kanal', 'Sqft', 'Square Yards']} error={errors.sizeUnit} icon={MapPin} />
                    </div>

                    {/* DYNAMIC FIELDS: HOUSE / APARTMENT */}
                    {(formData.propertyType === 'House' || formData.propertyType === 'Apartment') && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-6">
                        <div className="grid grid-cols-2 gap-5">
                          <PremiumSelect label="Bedrooms" id="beds" value={formData.beds} onChange={update('beds')} error={errors.beds} options={['Studio', '1', '2', '3', '4', '5', '6', '7+']} icon={Bed} />
                          <PremiumSelect label="Bathrooms" id="baths" value={formData.baths} onChange={update('baths')} error={errors.baths} options={['0', '1', '2', '3', '4', '5', '6', '7+']} icon={Bath} />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-5">
                          <PremiumSelect label="Property Condition" id="condition" value={formData.condition} onChange={update('condition')} options={[
                            { label: 'Excellent', value: 'Excellent', icon: Sparkles },
                            { label: 'Good', value: 'Good', icon: Check },
                            { label: 'Fair', value: 'Fair', icon: Info },
                            { label: 'Needs Work', value: 'Needs Work', icon: AlertCircle },
                          ]} error={errors.condition} icon={Shield} />
                          <PremiumSelect label="Property Age" id="age" value={formData.age} onChange={update('age')} options={[
                            { label: 'Brand New', value: 'Newly Built', icon: Sparkles },
                            { label: '1–5 Years', value: '1-5 Years', icon: Layers },
                            { label: '5–10 Years', value: '5-10 Years', icon: Layers },
                            { label: '10+ Years', value: '10+ Years', icon: Clock },
                          ]} error={errors.age} icon={History} />
                        </div>

                        {formData.propertyType === 'House' && (
                          <div className="grid grid-cols-2 gap-5">
                            <PremiumSelect label="Total Floors" id="floors" value={formData.floors} onChange={update('floors')} options={['1', '2', '3', '4+']} icon={Layers} />
                            <PremiumSelect label="Parking" id="parking" value={formData.parking} onChange={update('parking')} options={['None', '1 Car', '2 Cars', '3+ Cars']} icon={CheckCircle} />
                          </div>
                        )}

                        {formData.propertyType === 'Apartment' && (
                          <div className="grid grid-cols-2 gap-5">
                            <PremiumInput label="Floor Number" id="floorNumber" value={formData.floorNumber} onChange={update('floorNumber')} placeholder="e.g. 5th" icon={Layers} />
                            <PremiumSelect label="Elevator" id="isElevatorAvailable" value={formData.isElevatorAvailable} onChange={update('isElevatorAvailable')} options={['No', 'Yes']} icon={Zap} />
                            <PremiumSelect label="Furnished" id="furnished" value={formData.furnished} onChange={update('furnished')} options={['No', 'Yes']} icon={Check} />
                          </div>
                        )}
                        
                        {formData.propertyType === 'Apartment' && (
                          <PremiumInput label="Building Name" id="buildingName" value={formData.buildingName} onChange={update('buildingName')} placeholder="e.g. Silver Oaks" icon={Building} />
                        )}
                      </motion.div>
                    )}

                    {/* DYNAMIC FIELDS: PLOT / LAND */}
                    {formData.propertyType === 'Plot / Land' && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-6">
                        <div className="grid grid-cols-2 gap-5">
                          <PremiumSelect label="Plot Type" id="plotType" value={formData.plotType} onChange={update('plotType')} options={['Residential', 'Commercial', 'Industrial', 'Agricultural']} error={errors.plotType} icon={Map} />
                          <PremiumSelect label="Possession" id="possessionStatus" value={formData.possessionStatus} onChange={update('possessionStatus')} options={['Immediate', 'Pending', 'In 6 Months', 'In 1 Year']} error={errors.possessionStatus} icon={CheckCircle} />
                        </div>
                        <div className="grid grid-cols-2 gap-5">
                          <PremiumSelect label="Corner Plot" id="isCornerPlot" value={formData.isCornerPlot} onChange={update('isCornerPlot')} options={['No', 'Yes']} icon={Compass} />
                          <PremiumSelect label="Facing" id="facing" value={formData.facing} onChange={update('facing')} options={['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West', 'Park Facing', 'Main Road Facing']} icon={Compass} />
                        </div>
                        <PremiumInput label="Road Width" id="roadWidth" value={formData.roadWidth} onChange={update('roadWidth')} placeholder="e.g. 40 ft" icon={Move} />
                      </motion.div>
                    )}

                    {/* DYNAMIC FIELDS: COMMERCIAL */}
                    {formData.propertyType === 'Commercial' && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-6">
                        <div className="grid grid-cols-2 gap-5">
                          <PremiumSelect label="Property Sub-Type" id="subCategory" value={formData.subCategory} onChange={update('subCategory')} options={['Shop', 'Office', 'Warehouse', 'Building', 'Factory', 'Hall']} icon={Building} />
                          <PremiumSelect label="Washrooms" id="washrooms" value={formData.washrooms} onChange={update('washrooms')} options={['0', '1', '2', '3', '4', '5+']} error={errors.washrooms} icon={Bath} />
                        </div>
                        <div className="grid grid-cols-2 gap-5">
                          <PremiumInput label="Floor" id="floors" value={formData.floors} onChange={update('floors')} placeholder="e.g. Ground, 4th" icon={Layers} />
                          <PremiumSelect label="Parking Spaces" id="parking" value={formData.parking} onChange={update('parking')} options={['None', 'Public', 'Private (1-5)', 'Private (5+)', 'Dedicated']} icon={CheckCircle} />
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ── STEP 4: Amenities ── */}
              {step === 4 && (
                <motion.div key="s4" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" className="space-y-8">
                  <StepHeader icon={Zap} title="Utility & Amenities" sub="Select all available fundamental facility packages." />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {AMENITIES_LIST.map(a => (
                      <PremiumCheckbox key={a.label} label={a.label} icon={a.icon}
                        checked={formData.amenities.includes(a.label)}
                        onChange={() => toggleArray('amenities', a.label)} />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ── STEP 5: Tags ── */}
              {step === 5 && (
                <motion.div key="s5" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" className="space-y-8">
                  <StepHeader icon={Tag} title="Specialized Tags" sub="Tag distinguishing exterior or structural features." />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {FEATURES_LIST.map(f => (
                      <PremiumCheckbox key={f.label} label={f.label} icon={f.icon}
                        checked={formData.features.includes(f.label)}
                        onChange={() => toggleArray('features', f.label)} />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ── STEP 6: Contact ── */}
              {step === 6 && (
                <motion.div key="s6" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" className="space-y-8">
                  <StepHeader icon={Phone} title="Communication Links" sub="Provide direct access lines for buyer inquiries." />
                  <div className="space-y-5">
                    <PremiumInput 
                      label="Phone (03XXXXXXXXX)" 
                      id="phoneNumber" 
                      type="tel" 
                      value={formData.phoneNumber} 
                      onChange={update('phoneNumber')} 
                      error={errors.phoneNumber} 
                      placeholder="03001234567" 
                      icon={Phone} 
                      helper={isVerified ? `Must match your verified number: ${verifiedPhone}` : ""}
                    />
                    <PremiumInput label="WhatsApp (Optional)" id="whatsappNumber" type="tel" value={formData.whatsappNumber} onChange={update('whatsappNumber')} error={errors.whatsappNumber} placeholder="03001234567" icon={MessageCircle} />
                  </div>
                </motion.div>
              )}

              {/* ── STEP 7: Media ── */}
              {step === 7 && (
                <motion.div key="s7" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" className="space-y-8">
                  <div className="flex items-center justify-between pb-8 mb-2" style={{ borderBottom: '1.5px solid #FFF0F2' }}>
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 rounded-[22px] flex items-center justify-center text-white shrink-0"
                        style={{ background: 'linear-gradient(135deg, #C8102E, #FF3355)', boxShadow: '0 12px 32px -6px rgba(200,16,46,0.4)' }}>
                        <ImageIcon size={30} strokeWidth={2} />
                      </div>
                      <div>
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Digital Gallery</h2>
                        <p className="text-gray-400 font-semibold mt-1 text-sm">High quality visuals drive conversions.</p>
                      </div>
                    </div>
                    <span className="text-xs font-black text-[#C8102E] px-4 py-2 rounded-full"
                      style={{ background: '#FFF0F3', border: '1.5px solid #FFD6DE' }}>
                      {images.length}/6 Uploaded
                    </span>
                  </div>

                  {/* Drop Zone */}
                  <motion.div
                    onClick={() => images.length < 6 && fileRef.current.click()}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
                    animate={dragOver ? { scale: 1.02, borderColor: '#C8102E' } : { scale: 1 }}
                    className={`relative border-2 border-dashed rounded-[32px] p-14 text-center transition-all duration-500 overflow-hidden group ${images.length >= 6
                        ? 'opacity-50 cursor-not-allowed border-gray-200'
                        : dragOver
                          ? 'border-[#C8102E] cursor-pointer'
                          : 'border-red-100 cursor-pointer hover:border-[#C8102E] hover:shadow-[0_16px_48px_-8px_rgba(200,16,46,0.12)]'
                      }`}
                    style={{ background: dragOver ? '#FFF0F3' : '#FFFAFB' }}
                  >
                    <input ref={fileRef} type="file" className="hidden" accept="image/*" multiple
                      onChange={(e) => handleFiles(e.target.files)} disabled={images.length >= 6} />

                    {/* Animated bg on drag */}
                    <AnimatePresence>
                      {dragOver && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          className="absolute inset-0 rounded-[32px]"
                          style={{ background: 'radial-gradient(ellipse at center, rgba(200,16,46,0.06) 0%, transparent 70%)' }} />
                      )}
                    </AnimatePresence>

                    <div className="relative z-10 space-y-5">
                      <motion.div
                        animate={dragOver ? { y: -6, scale: 1.1 } : { y: 0, scale: 1 }}
                        className="w-24 h-24 rounded-full flex items-center justify-center mx-auto transition-all duration-300"
                        style={{
                          background: dragOver ? 'linear-gradient(135deg, #C8102E, #FF3355)' : 'white',
                          boxShadow: dragOver ? '0 16px 40px -8px rgba(200,16,46,0.4)' : '0 8px 24px -4px rgba(200,16,46,0.1)',
                          border: '1.5px solid rgba(200,16,46,0.1)',
                        }}
                      >
                        <Upload size={36} strokeWidth={1.8}
                          className={dragOver ? 'text-white' : 'text-[#C8102E] group-hover:-translate-y-1 transition-transform duration-300'} />
                      </motion.div>
                      <div>
                        <p className="text-xl font-black text-gray-800">
                          {dragOver ? 'Release to upload' : 'Click or drag images here'}
                        </p>
                        <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mt-1">
                          JPG, PNG · Max 5MB each · Up to 6 images
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {errors.media && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 p-4 rounded-[16px] text-xs font-bold uppercase tracking-widest text-[#C8102E] justify-center"
                      style={{ background: '#FFF0F3', border: '1.5px solid #FFD6DE' }}>
                      <AlertCircle size={14} /> {errors.media}
                    </motion.div>
                  )}

                  {images.length > 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {images.map((img, idx) => (
                        <motion.div key={idx} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.06 }}
                          className="aspect-[4/3] relative group rounded-[20px] overflow-hidden"
                          style={{ boxShadow: '0 8px 24px -4px rgba(200,16,46,0.12)', border: '1.5px solid rgba(200,16,46,0.08)' }}>
                          {idx === 0 && (
                            <div className="absolute top-3 left-3 z-10 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest text-white"
                              style={{ background: 'linear-gradient(135deg, #C8102E, #FF3355)', boxShadow: '0 4px 12px rgba(200,16,46,0.4)' }}>
                              Cover
                            </div>
                          )}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity z-0"
                            style={{ background: 'linear-gradient(to top, rgba(200,16,46,0.5) 0%, transparent 60%)' }} />
                          <img src={img.preview} className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700" alt="Preview" />
                          <button onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                            className="absolute bottom-3 right-3 p-2.5 rounded-full opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 z-10"
                            style={{ background: 'rgba(255,255,255,0.95)', color: '#C8102E', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                            <X size={16} strokeWidth={3} />
                          </button>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* ── STEP 8: Review ── */}
              {step === 8 && (
                <motion.div key="s8" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" className="space-y-8">
                  <div className="flex flex-col items-center text-center space-y-4 pb-8 mb-2" style={{ borderBottom: '1.5px solid #FFF0F2' }}>
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="w-20 h-20 rounded-[28px] flex items-center justify-center text-white"
                      style={{ background: 'linear-gradient(135deg, #C8102E, #FF3355)', boxShadow: '0 16px 40px -6px rgba(200,16,46,0.4)' }}>
                      <CheckCircle size={38} strokeWidth={2} />
                    </motion.div>
                    <div>
                      <h2 className="text-4xl font-black text-gray-900 tracking-tight">Ready to Launch</h2>
                      <p className="text-gray-400 font-semibold mt-2 max-w-sm mx-auto">Review your listing details before deploying to the live marketplace.</p>
                    </div>
                  </div>

                  <AnimatePresence>
                    {submitError && (
                      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                        className="p-5 rounded-[24px] flex gap-4 items-center"
                        style={{ background: '#FFF0F3', border: '1.5px solid #FFD6DE' }}>
                        <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white"
                          style={{ background: '#C8102E' }}>
                          <AlertCircle size={20} />
                        </div>
                        <p className="text-sm font-bold text-[#C8102E]">{submitError}</p>
                      </motion.div>
                    )}
                    {success && (
                      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        className="p-8 rounded-[32px] flex flex-col items-center text-center space-y-3 text-white"
                        style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', boxShadow: '0 24px 60px -10px rgba(34,197,94,0.4)' }}>
                        <CheckCircle size={40} strokeWidth={2} />
                        <span className="text-xl font-black">{success}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Preview card */}
                  <div className="rounded-[28px] overflow-hidden" style={{ border: '1.5px solid rgba(200,16,46,0.1)', boxShadow: '0 16px 48px -8px rgba(200,16,46,0.1)' }}>
                    <div className="h-52 relative bg-gray-100">
                      {images.length > 0 && <img src={images[0].preview} className="w-full h-full object-cover" alt="Cover" />}
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(26,0,8,0.9) 0%, transparent 60%)' }} />
                      <div className="absolute bottom-5 left-6 right-6 flex justify-between items-end">
                        <div>
                          <h3 className="text-2xl font-black text-white tracking-tight">{formData.title || 'Property Title'}</h3>
                          <p className="text-sm font-bold text-white/60 flex items-center gap-1.5 mt-1">
                            <MapPin size={14} /> {formData.city || '—'}
                          </p>
                        </div>
                        <div className="text-lg font-black text-white px-4 py-2 rounded-[16px]"
                          style={{ background: 'rgba(200,16,46,0.85)', backdropFilter: 'blur(12px)' }}>
                          PKR {Number(formData.price || 0).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {/* Summary row */}
                    <div className="grid grid-cols-3 divide-x" style={{ background: '#FFFAFB', borderTop: '1.5px solid rgba(200,16,46,0.06)', divideColor: 'rgba(200,16,46,0.06)' }}>
                      {[
                        { label: 'Type', val: formData.propertyType || '—' },
                        { label: 'Purpose', val: formData.purpose || '—' },
                        { label: 'Area', val: formData.size ? `${formData.size} ${formData.sizeUnit}` : '—' },
                      ].map(({ label, val }) => (
                        <div key={label} className="p-4 text-center" style={{ borderRight: '1px solid rgba(200,16,46,0.06)' }}>
                          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-gray-400 mb-1">{label}</p>
                          <p className="text-sm font-medium text-gray-900">{val}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ─── Footer Nav ─── */}
          <div className="mt-10 pt-8 flex items-center justify-between" style={{ borderTop: '1.5px solid #FFF0F2' }}>

            {/* Back / Cancel */}
            {step > 1 ? (
              <button onClick={prevStep} disabled={loading}
                className="flex items-center gap-2 font-bold text-gray-400 hover:text-[#C8102E] transition-all duration-300 text-[12px] uppercase tracking-widest disabled:opacity-40 group px-5 py-3 rounded-[16px] hover:bg-red-50">
                <ArrowLeft size={17} className="group-hover:-translate-x-1 transition-transform duration-300" strokeWidth={2.5} /> Back
              </button>
            ) : (
              <button onClick={() => navigate(-1)}
                className="font-bold text-gray-300 hover:text-[#C8102E] transition-colors duration-300 text-[11px] uppercase tracking-[0.22em] px-5 py-3">
                Cancel
              </button>
            )}

            {/* Next / Submit */}
            <motion.button
              onClick={propertyCount >= 3 ? () => window.location.href = '/subscription' : (step === 8 ? handleSubmit : nextStep)}
              disabled={loading}
              whileHover={!loading ? { scale: 1.04, y: -2 } : {}}
              whileTap={!loading ? { scale: 0.97 } : {}}
              className={`relative flex items-center gap-3 px-10 py-4 rounded-[20px] text-[13px] font-bold uppercase tracking-[0.18em] text-white transition-all duration-400 overflow-hidden ${loading ? 'opacity-60 cursor-not-allowed' : ''
                }`}
              style={!loading ? {
                background: propertyCount >= 3 ? '#1A0008' : 'linear-gradient(135deg, #C8102E 0%, #FF3355 100%)',
                boxShadow: propertyCount >= 3 ? '0 12px 32px -6px rgba(0,0,0,0.3)' : '0 12px 32px -6px rgba(200,16,46,0.45)',
              } : { background: '#E5E7EB' }}
            >
              {/* Shimmer sweep */}
              {!loading && (
                <motion.div
                  className="absolute inset-0 -translate-x-full"
                  animate={{ translateX: ['−100%', '200%'] }}
                  transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5 }}
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)', transform: 'skewX(-12deg)' }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2.5">
                {propertyCount >= 3 
                  ? <><CloudLightning size={18} /> Upgrade Now</>
                  : step === 8
                    ? loading
                      ? <><Loader2 size={18} className="animate-spin" /> Processing...</>
                      : <><Sparkles size={18} strokeWidth={2} /> Launch Listing</>
                    : <>Proceed <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" strokeWidth={2.5} /></>
                }
              </span>
            </motion.button>

          </div>
        </motion.div>

        {/* Step counter pill */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center mt-6"
        >
          <div className="flex items-center gap-2 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.25em]"
            style={{ background: 'white', border: '1.5px solid rgba(200,16,46,0.1)', color: '#aaa', boxShadow: '0 4px 12px rgba(200,16,46,0.06)' }}>
            <span className="text-[#C8102E]">Step {step}</span>
            <span>of {STEPS.length}</span>
            <div className="w-px h-3 bg-gray-200" />
            <span>{STEPS[step - 1].label}</span>
          </div>
        </motion.div>

      </div>

      {/* Fixed ambient bottom */}
      <div className="fixed bottom-0 left-0 right-0 h-40 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(200,16,46,0.03), transparent)', zIndex: 0 }} />
    </div>
  );
};

export default AddProperty;