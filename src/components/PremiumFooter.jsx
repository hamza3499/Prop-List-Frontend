import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe, Mail, Shield, Send, ArrowUpRight } from 'lucide-react';
import { getToken } from '../services/api';

const BuildingIcon = ({ size }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
  >
    <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
    <path d="M9 22v-4h6v4" />
    <path d="M8 6h.01" />
    <path d="M16 6h.01" />
  </svg>
);

const PremiumFooter = () => {
  const currentYear = new Date().getFullYear();
  const isLoggedIn = !!getToken();

  const footerLinks = {
    navigation: [
      { label: 'Home', path: '/' },
      { label: 'Add Property', path: isLoggedIn ? '/add-property' : '/login' },
      { label: 'Favorites', path: '/favorites' },
      { label: 'Our Story', path: '/about' },
    ],
    categories: [
      { label: 'Modern Houses', path: 'https://www.architecturaldigest.com/architecture', external: true },
      { label: 'Luxury Apartments', path: 'https://www.sothebysrealty.com', external: true },
      { label: 'Commercial Space', path: 'https://www.loopnet.com', external: true },
      { label: 'Plots & Land', path: 'https://www.landwatch.com', external: true },
    ],
    legal: [
      { label: 'Privacy Policy', path: '/privacy' },
      { label: 'Terms & Conditions', path: '/terms' },
      { label: 'Cookie Policy', path: '/cookies' },
    ]
  };

  return (
    <footer className="footer-luxury bg-[#0B1120] text-white/70 pt-28 pb-10 relative overflow-hidden transition-all duration-700 font-display border-t border-white/5">
      {/* Background Ambience Controls */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full pointer-events-none opacity-40" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none opacity-30" />
      
      {/* Tightened Max-Width Container for perfect balance */}
      <div className="max-w-[1280px] mx-auto px-8 relative z-10">
        
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-16 pb-20">
          
          {/* Column 1: Brand & Strategic Vision */}
          <div className="space-y-12">
            <div className="space-y-6">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-[0_12px_30px_-5px_rgba(255,43,43,0.5)] transition-all duration-500 group-hover:rotate-[15deg] group-hover:scale-110">
                  <BuildingIcon size={24} />
                </div>
                <span className="text-4xl font-black tracking-tighter text-white">
                  Prop<span className="text-primary italic">List.</span>
                </span>
              </Link>
              <p className="text-[15px] text-white/50 font-medium leading-relaxed max-w-[280px]">
                Discover premium properties curated for modern living. Elevating the standard of luxury real estate exploration globally.
              </p>
            </div>

            {/* Newsletter: Wide & Integrated */}
            <div className="space-y-5">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/40">The Elite Newsletter</p>
              <div className="relative w-full max-w-[320px]">
                <input 
                  type="email" 
                  placeholder="name@domain.com"
                  className="w-full px-6 py-4 rounded-[20px] bg-white/[0.03] border border-white/10 outline-none text-sm text-white placeholder:text-white/20 focus:border-primary/60 focus:bg-white/[0.07] focus:shadow-[0_0_25px_-5px_rgba(255,43,43,0.15)] transition-all duration-500"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 bg-white text-[#0B1120] rounded-[14px] flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 shadow-xl active:scale-95">
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div className="space-y-10 lg:pl-12">
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-white underline decoration-primary/50 underline-offset-8">Information</h4>
            <ul className="space-y-5">
              {footerLinks.navigation.map((link, i) => (
                <li key={i}>
                  <Link to={link.path} className="group flex items-center gap-3 text-[14px] font-bold text-white/40 hover:text-white transition-all duration-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-primary transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Property Categories */}
          <div className="space-y-10 lg:pl-8">
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-white underline decoration-primary/50 underline-offset-8">Collections</h4>
            <ul className="space-y-5">
              {footerLinks.categories.map((link, i) => (
                <li key={i}>
                  {link.external ? (
                    <a href={link.path} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 text-[14px] font-bold text-white/40 hover:text-white transition-all duration-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-primary transition-all duration-300" />
                      {link.label}
                    </a>
                  ) : (
                    <Link to={link.path} className="group flex items-center gap-3 text-[14px] font-bold text-white/40 hover:text-white transition-all duration-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-primary transition-all duration-300" />
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Specialized Trust */}
          <div className="space-y-12">
             <div className="space-y-8">
                <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-white underline decoration-primary/50 underline-offset-8">Connect With Us</h4>
                <div className="flex gap-4">
                  {[
                    // Facebook
                    { url: 'https://www.facebook.com', icon: () => <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg> },
                    // Twitter/X
                    { url: 'https://twitter.com', icon: () => <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
                    // Instagram
                    { url: 'https://www.instagram.com', icon: () => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg> },
                    // LinkedIn
                    { url: 'https://www.linkedin.com', icon: () => <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg> },
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <motion.a
                        key={i}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ y: -5, scale: 1.1, backgroundColor: 'rgba(255,255,255,1)', color: '#0B1120' }}
                        className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 transition-all duration-300 cursor-pointer block"
                      >
                        <Icon />
                      </motion.a>
                    );
                  })}
                </div>
             </div>

             {/* Verified Performance Card: Grid Aligned */}
             <div className="relative p-7 rounded-[32px] bg-white/[0.03] border border-white/10 group hover:border-primary/40 hover:bg-white/[0.05] transition-all duration-500 shadow-inner">
                <div className="absolute -top-3 -right-3 w-10 h-10 bg-primary/10 rounded-full blur-xl animate-pulse" />
                <div className="flex items-center gap-4 text-white mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary group-hover:rotate-12 transition-transform duration-500">
                    <Shield size={20} strokeWidth={2.5} />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-widest">Global Integrity</span>
                </div>
                <p className="text-[12px] text-white/30 font-semibold leading-relaxed">
                  Every asset in our curated global portfolio undergoes precise architectural and dual-layer legal certification.
                </p>
             </div>
          </div>

        </div>

        {/* Separator Bar */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Bottom Bar: Clean & Muted */}
        <div className="pt-10 flex flex-col md:flex-row justify-between items-center gap-8 text-[11px] font-black tracking-[0.2em]">
          <div className="flex flex-wrap justify-center md:justify-start gap-x-12 gap-y-4 text-white/20">
            {footerLinks.legal.map((link, i) => (
              <Link key={i} to={link.path} className="hover:text-white transition-colors duration-400">
                {link.label}
              </Link>
            ))}
          </div>
          
          <div className="text-white/10 tracking-[0.3em]">
            © {currentYear} PROPLIST INTERNATIONAL.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PremiumFooter;


