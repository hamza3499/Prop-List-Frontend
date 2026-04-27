import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Sparkles, User, Mail, Lock, ArrowRight } from 'lucide-react';
import { signupUser } from '../services/api';
import FloatingInput from '../components/FloatingInput';
import GlowButton from '../components/GlowButton';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const newErrors = {};
    if (!formData.name) newErrors.name = 'Full name is required';
    if (!formData.email) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await signupUser(formData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setErrors({ form: err.message || 'Signup failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen -mt-24 mb-[-3rem] bg-white dark:bg-black overflow-hidden relative z-10 w-full">
      {/* Form Side */}
      <div className="w-full lg:w-1/2 relative flex flex-col items-center justify-center p-8 md:p-16 overflow-y-auto">
        <div className="max-w-md w-full space-y-10 py-12">
          <Link to="/" className="lg:hidden text-3xl font-display font-black mb-12 block text-center">
            Prop<span className="text-primary">List</span>
          </Link>

          <div className="space-y-2 text-center lg:text-left">
            <h3 className="text-4xl font-display font-black dark:text-white">Create your <span className="text-primary">Profile.</span></h3>
            <p className="text-on-surface/50 dark:text-white/40 font-medium font-body">Join our community of premium real estate homeowners.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              <div className="relative group">
                <div className="absolute -left-10 top-1/2 -translate-y-1/2 text-primary/40 group-focus-within:text-primary transition-colors pointer-events-none">
                  <User size={24} />
                </div>
                <FloatingInput
                  label="Full Name"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  error={errors.name}
                />
              </div>

              <div className="relative group">
                <div className="absolute -left-10 top-1/2 -translate-y-1/2 text-primary/40 group-focus-within:text-primary transition-colors pointer-events-none">
                  <Mail size={24} />
                </div>
                <FloatingInput
                  label="Email Address"
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  error={errors.email}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative group">
                  <div className="absolute -left-10 top-1/2 -translate-y-1/2 text-primary/40 group-focus-within:text-primary transition-colors pointer-events-none">
                    <Lock size={24} />
                  </div>
                  <FloatingInput
                    label="Password"
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    error={errors.password}
                  />
                </div>
                <div className="relative group">
                  <div className="absolute -left-10 top-1/2 -translate-y-1/2 text-primary/40 group-focus-within:text-primary transition-colors pointer-events-none">
                    <Lock size={24} />
                  </div>
                  <FloatingInput
                    label="Confirm Password"
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    error={errors.confirmPassword}
                  />
                </div>
              </div>
            </div>

            {errors.form && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-primary/5 border border-primary/20 text-[10px] uppercase tracking-widest text-primary font-bold text-center"
              >
                {errors.form}
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-[10px] uppercase tracking-widest text-green-600 font-bold text-center"
              >
                Account created successfully. Redirecting to login...
              </motion.div>
            )}

            <div className="space-y-6 pt-4">
              <GlowButton
                type="submit"
                loading={loading}
                loadingText="Creating Account..."
                disabled={success}
                className="w-full py-5 text-lg font-display font-black group"
              >
                Sign Up <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </GlowButton>

              <div className="text-center font-body">
                <span className="text-on-surface/40 text-sm italic">Already have an account? </span>
                <Link to="/login" className="text-primary font-black text-sm hover:underline underline-offset-4">Log In</Link>
              </div>
            </div>
          </form>

          <p className="text-[10px] text-center text-on-surface/30 uppercase tracking-[0.2em] pt-8 font-display font-bold">
            Enter a sphere of architectural excellence.
          </p>
        </div>

        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 blur-[100px] -z-10" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] -z-10" />
      </div>

      {/* Cinematic Right Side */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-zinc-900 m-4 rounded-[48px] shadow-2xl z-20">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <img
            src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200"
            className="w-full h-full object-cover opacity-60"
            alt="Modern Architecture"
          />
          <div className="absolute inset-0 bg-gradient-to-tl from-black via-black/40 to-transparent" />
        </motion.div>

        <div className="relative z-10 w-full h-full flex flex-col justify-between p-16 items-end text-right">
          <div className="space-y-8 flex flex-col items-end">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest"
            >
              <Shield size={14} className="text-primary" /> Verified Membership
            </motion.div>

            <h2 className="text-6xl xl:text-7xl font-display font-black text-white leading-tight">
              Start Your<br />
              <span className="text-primary italic">Journey.</span>
            </h2>

            <p className="text-xl text-white/60 max-w-sm font-body">
              Discover and list premium properties in a marketplace built for clarity and quality.
            </p>
          </div>

          <div className="flex gap-8 text-white/40 text-xs font-bold uppercase tracking-widest font-display">
            <span>Exclusive Access</span>
            <span>Signature Living</span>
            <span>© 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
