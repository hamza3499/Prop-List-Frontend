import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Sparkles, ArrowRight, Mail, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { loginUser } from '../services/api';
import GlowButton from '../components/GlowButton';

// ─── Styled Input ─────────────────────────────────────────────────────────────
const AuthInput = ({ label, id, type = 'text', value, onChange, error, autoFocus, icon: Icon }) => {
  const [showPass, setShowPass] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPass ? 'text' : 'password') : type;

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className={`block text-xs font-bold uppercase tracking-wider transition-colors ${error ? 'text-red-400' : 'text-on-surface/40 dark:text-white/30'}`}>
        {label}
      </label>
      <div className="relative group">
        {Icon && (
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-on-surface/25 dark:text-white/20 group-focus-within:text-primary transition-colors pointer-events-none">
            <Icon size={18} />
          </div>
        )}
        <input
          id={id}
          type={inputType}
          value={value}
          onChange={onChange}
          autoFocus={autoFocus}
          placeholder={label}
          className={`w-full pl-12 pr-12 py-4 rounded-2xl bg-surface-container-low dark:bg-zinc-800/60 border-2 text-on-surface dark:text-white placeholder:text-on-surface/20 dark:placeholder:text-white/15 outline-none transition-all duration-300
            ${error
              ? 'border-red-400/60 focus:border-red-400'
              : 'border-outline-variant/10 dark:border-white/5 focus:border-primary/60 focus:shadow-[0_0_0_4px_rgba(220,38,38,0.08)]'
            }`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPass(v => !v)}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-on-surface/30 dark:text-white/20 hover:text-primary transition-colors"
          >
            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-400 pl-1 font-medium">{error}</p>}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const data = await loginUser(formData);
      localStorage.setItem("token", data.token);
      if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
      setLoginSuccess(true);
      const from = location.state?.from?.pathname || '/';
      setTimeout(() => navigate(from, { replace: true }), 900);
    } catch (err) {
      setErrors({ form: err.message || 'Login failed. Please check your credentials.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.99 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
      className="flex flex-col lg:flex-row min-h-screen -mt-24 mb-[-3rem] bg-white dark:bg-black overflow-hidden relative z-10 w-full"
    >
      {/* ── Left Side: Cinematic Branding ──────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-zinc-950 m-4 rounded-[48px] shadow-2xl z-20">
        {/* Background Image with enhanced depth */}
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.8, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200"
            className="w-full h-full object-cover opacity-50"
            alt="Luxury Interior"
          />
          {/* Layered Gradient for Depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-transparent to-transparent" />
          {/* Vignette – darker edges */}
          <div className="absolute inset-0" style={{ boxShadow: 'inset 0 0 120px 60px rgba(0,0,0,0.7)' }} />
        </motion.div>

        {/* Left Content */}
        <div className="relative z-10 w-full h-full flex flex-col justify-between p-14">
          {/* Top badge */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest w-fit"
          >
            <Sparkles size={12} className="text-primary animate-pulse" /> Verified Real Estate
          </motion.div>

          {/* Main Text */}
          <div className="space-y-6">
            <div className="overflow-hidden">
              <motion.h2
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
                className="text-6xl xl:text-7xl font-display font-black text-white leading-tight"
              >
                Access Your<br />
                <span className="text-primary italic">Dashboard.</span>
              </motion.h2>
            </div>

            <motion.p
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.7 }}
              className="text-lg text-white/50 max-w-sm font-body leading-relaxed"
            >
              Manage your property listings, track inquiries, and explore the latest premium collections — all in one place.
            </motion.p>

            {/* Trust pills */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
              className="flex flex-wrap gap-3"
            >
              {['Verified Listings', 'Secure Platform', 'Premium Support'].map((t) => (
                <span key={t} className="flex items-center gap-1.5 text-[10px] text-white/30 font-bold uppercase tracking-widest border border-white/10 rounded-full px-3 py-1">
                  <CheckCircle size={10} className="text-primary/60" /> {t}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Bottom stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="flex gap-8 text-white/20 text-xs font-bold uppercase tracking-widest"
          >
            <span>Verified Listings</span>
            <span>Premium Support</span>
            <span>Est. 2026</span>
          </motion.div>
        </div>
      </div>

      {/* ── Right Side: Form ────────────────────────────────── */}
      <div className="w-full lg:w-1/2 relative flex items-center justify-center p-8 md:p-16">
        {/* Ambient glows */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] -z-10" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 blur-[100px] -z-10" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.7, ease: [0.33, 1, 0.68, 1] }}
          className="max-w-md w-full space-y-10"
        >
          {/* Mobile Logo */}
          <Link to="/" className="lg:hidden text-3xl font-display font-black block text-center text-on-surface dark:text-white">
            Prop<span className="text-primary">List</span>
          </Link>

          {/* Heading */}
          <div className="space-y-2">
            <h3 className="text-4xl font-display font-black text-on-surface dark:text-white">
              Welcome <span className="text-primary italic">Back.</span>
            </h3>
            <p className="text-on-surface/40 dark:text-white/30 text-base">Enter your credentials to access your account.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-5">
              <AuthInput
                label="Email Address"
                id="email"
                type="email"
                icon={Mail}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={errors.email}
                autoFocus
              />
              <AuthInput
                label="Password"
                id="password"
                type="password"
                icon={Lock}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                error={errors.password}
              />
            </div>

            {/* API Error */}
            {errors.form && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-primary/5 border border-primary/20 text-sm text-primary font-bold text-center"
              >
                {errors.form}
              </motion.div>
            )}

            {/* Success */}
            {loginSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-sm text-green-500 font-bold text-center flex items-center justify-center gap-2"
              >
                <CheckCircle size={16} /> Logged in! Redirecting…
              </motion.div>
            )}

            <div className="space-y-5">
              <GlowButton
                type="submit"
                loading={loading}
                loadingText="Logging in..."
                disabled={loading || loginSuccess}
                className="w-full py-5 text-lg font-display font-black group"
              >
                Log In <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </GlowButton>

              {/* Trust signal */}
              <p className="text-center text-xs text-on-surface/25 dark:text-white/15 flex items-center justify-center gap-1.5">
                <Shield size={12} className="text-primary/40" />
                Secure login • Your data is protected
              </p>

              <p className="text-center text-sm text-on-surface/40 dark:text-white/30">
                New to PropList?{' '}
                <Link to="/signup" className="text-primary font-black hover:underline underline-offset-4">
                  Sign Up
                </Link>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Login;
