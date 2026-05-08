import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from 'framer-motion';
import { Shield, Sparkles, Globe, Zap, Heart, Award, Users, Target, ArrowRight } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    whileHover={{ y: -15, scale: 1.05, rotate: 1 }}
    className="relative p-12 rounded-[48px] bg-white/[0.02] border border-white/5 group hover:bg-white/[0.05] hover:border-red-500/30 transition-all duration-700 overflow-hidden"
  >
    <div className="absolute top-0 right-0 w-40 h-40 bg-red-500/5 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-red-500/10 transition-colors" />
    <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 mb-8 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
      <Icon size={32} />
    </div>
    <h3 className="text-5xl font-black text-white mb-2 tracking-tighter">{value}</h3>
    <p className="text-sm font-bold text-white/30 uppercase tracking-[0.3em]">{label}</p>
  </motion.div>
);

const TimelineItem = ({ year, title, desc, index, image }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const imageY = useTransform(scrollYProgress, [0, 1], [-80, 80]);
  const textY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <div ref={ref} className={`relative flex flex-col md:flex-row items-center justify-between mb-64 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-20`}>
      <div className="w-full md:w-[50%] relative group">
        <motion.div
          style={{ y: imageY }}
          className="aspect-[16/10] overflow-hidden rounded-[56px] shadow-2xl relative z-10"
        >
          <motion.img 
            initial={{ scale: 1.5 }}
            whileInView={{ scale: 1.1 }}
            transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
            src={image} 
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-110" 
            alt={title} 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        </motion.div>
        
        {/* Decorative Background Frame */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="absolute -inset-4 border border-white/5 rounded-[64px] -z-10 group-hover:border-red-500/20 transition-colors duration-700"
        />
        
        <motion.div 
          initial={{ scaleX: 1 }}
          whileInView={{ scaleX: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="absolute inset-0 bg-red-600 z-20 origin-right rounded-[56px]"
        />
      </div>
      
      {/* Center Line Marker */}
      <div className="absolute left-8 md:left-1/2 -translate-x-1/2 flex flex-col items-center top-0 bottom-0 py-20 pointer-events-none">
        <motion.div 
          initial={{ scale: 0, boxShadow: "0 0 0px rgba(239, 68, 68, 0)" }}
          whileInView={{ scale: 1, boxShadow: "0 0 50px rgba(239, 68, 68, 1)" }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
          className="w-6 h-6 rounded-full bg-red-500 z-10 border-[6px] border-[#050505]" 
        />
        <motion.div 
          initial={{ height: 0 }}
          whileInView={{ height: '100%' }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="w-[2px] bg-gradient-to-b from-red-500 via-white/10 to-transparent flex-grow" 
        />
      </div>

      <motion.div 
        style={{ y: textY }}
        initial={{ opacity: 0, x: index % 2 === 0 ? 120 : -120 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
        className="w-full md:w-[45%] pl-24 md:pl-0 space-y-10"
      >
        <div className="inline-block relative">
          <motion.span 
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: index * 0.7 }}
            className="text-[120px] font-black text-white/[0.03] tracking-tighter mb-4 block cursor-default transition-colors group-hover:text-red-500/10 leading-none"
          >
            {year}
          </motion.span>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: '100%' }}
            transition={{ duration: 1.2, delay: 0.8 }}
            className="absolute bottom-6 left-0 h-1.5 bg-red-500 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.5)]" 
          />
        </div>
        <h4 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-none">{title}</h4>
        <p className="text-white/40 leading-relaxed font-medium text-2xl max-w-lg">{desc}</p>
        
        <motion.button
          whileHover={{ x: 10 }}
          className="flex items-center gap-6 text-red-500 text-sm font-black uppercase tracking-[0.4em] group/btn"
        >
          <div className="w-12 h-[2px] bg-red-500 group-hover/btn:w-20 transition-all duration-500" />
          The Legacy Continues
        </motion.button>
      </motion.div>
    </div>
  );
};

const MagneticElement = ({ children }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    setPosition({ x: x * 0.35, y: y * 0.35 });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 200, damping: 20, mass: 0.1 }}
    >
      {children}
    </motion.div>
  );
};

const FloatingOrb = ({ size, color, x, y, duration, delay }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none opacity-20"
    animate={{ 
      x: [0, 80, -60, 0],
      y: [0, -100, 70, 0],
      scale: [1, 1.3, 0.7, 1],
      rotate: [0, 360],
      opacity: [0.1, 0.3, 0.1]
    }}
    transition={{
      duration: duration || 15,
      repeat: Infinity,
      delay: delay || 0,
      ease: "linear"
    }}
    style={{ 
      width: size, height: size, background: color, left: x, top: y, filter: 'blur(100px)',
    }}
  />
);

const OurStory = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const y = useTransform(scrollYProgress, [0, 1], [0, -400]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.4], [1, 1.2]);

  const timeline = [
    { 
      year: '2021', 
      title: 'The Vision', 
      desc: 'Muhammad Hamza Ghaffar envisioned a platform that bridges the gap between premium architectural excellence and the digital search experience.',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop'
    },
    { 
      year: '2022', 
      title: 'Building the Core', 
      desc: 'Our team of expert engineers and designers began crafting the high-performance engine that powers PropList today.',
      image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1200&auto=format&fit=crop'
    },
    { 
      year: '2023', 
      title: 'Global Expansion', 
      desc: 'We reached our first 10,000 verified listings across Pakistan, setting a new standard for data integrity in real estate.',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop'
    },
    { 
      year: '2024', 
      title: 'The Premium Pivot', 
      desc: 'Redesigning the entire ecosystem to provide an "Executive Class" experience for the most discerning property seekers.',
      image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=1200&auto=format&fit=crop'
    },
    { 
      year: '2025', 
      title: 'Future of Living', 
      desc: 'Integrating AI-driven insights and 3D immersive tours to make the home-buying journey as seamless as the home itself.',
      image: 'https://images.unsplash.com/photo-1600585154340-be6199f50a09?q=80&w=1200&auto=format&fit=crop'
    },
  ];

  return (
    <div ref={containerRef} className="bg-[#050505] text-white overflow-hidden min-h-screen selection:bg-red-500 selection:text-white">
      <style>{`
        .text-gradient {
          background: linear-gradient(135deg, #fff 0%, #ffffff80 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .text-glow {
          text-shadow: 0 0 40px rgba(239, 68, 68, 0.4);
        }
        .perspective-2000 {
          perspective: 2000px;
        }
      `}</style>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center pt-20">
        <div className="absolute inset-0 z-0">
          <motion.div style={{ y, scale: heroScale, opacity: heroOpacity }} className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=90&w=2400" 
              className="w-full h-full object-cover opacity-20 grayscale"
              alt="Architecture"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/90 to-[#050505]" />
          </motion.div>
          
          <FloatingOrb size={600} color="radial-gradient(circle, #dc2626, transparent)" x="5%" y="10%" duration={20} delay={0} />
          <FloatingOrb size={500} color="radial-gradient(circle, #b91c1c, transparent)" x="70%" y="40%" duration={25} delay={5} />
          <FloatingOrb size={400} color="radial-gradient(circle, #ef4444, transparent)" x="30%" y="75%" duration={18} delay={10} />
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.span 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="inline-block px-8 py-3 rounded-full border border-red-500/30 bg-red-500/5 text-red-500 text-[10px] font-black uppercase tracking-[0.6em] mb-12 shadow-[0_0_30px_rgba(239,68,68,0.1)]"
            >
              The Odyssey Since 2021
            </motion.span>
            <h1 className="text-8xl md:text-[180px] font-black tracking-tighter leading-[0.75] mb-16 text-gradient select-none">
              MASTERING<br />
              <span className="text-red-500 text-glow italic">SPACE.</span>
            </h1>
            <p className="max-w-3xl mx-auto text-white/30 text-xl md:text-2xl font-medium leading-relaxed tracking-wide">
              PropList is a digital symphony composed by <span className="text-white font-bold">Muhammad Hamza Ghaffar</span>. A legacy built on architectural purity and high-performance digital artistry.
            </p>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div 
            style={{ opacity: heroOpacity }}
            animate={{ y: [0, 15, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">Explore History</span>
            <div className="w-[1px] h-20 bg-gradient-to-b from-red-500 to-transparent shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
          </motion.div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-60 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-16"
            >
              <div className="space-y-4">
                <p className="text-red-500 text-xs font-black uppercase tracking-[0.5em]">The Core Values</p>
                <h2 className="text-6xl md:text-[100px] font-black tracking-tighter leading-none">
                  PURE<br />
                  <span className="text-red-500">PHILOSOPHY.</span>
                </h2>
              </div>
              <div className="space-y-10 text-white/50 text-2xl font-medium leading-relaxed">
                <p>
                  We believe that finding a home should be as inspiring as living in one. The traditional real estate market is cluttered with noise, unverified data, and uninspiring interfaces.
                </p>
                <p className="text-white/30 italic">
                  "At PropList, we curate only the finest listings, ensuring every image, description, and metric meets our Executive Standard." 
                </p>
                <div className="pt-12 flex flex-wrap gap-6">
                  {[
                    { icon: Shield, text: 'Legal Integrity' },
                    { icon: Sparkles, text: 'Visual Excellence' },
                    { icon: Globe, text: 'Global Reach' },
                  ].map((item, i) => (
                    <motion.div 
                      key={i} 
                      whileHover={{ scale: 1.05, backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                      className="flex items-center gap-4 px-8 py-5 rounded-3xl bg-white/5 border border-white/10 text-white text-xs font-black uppercase tracking-widest transition-colors"
                    >
                      <item.icon size={20} className="text-red-500" />
                      {item.text}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.7, rotate: -5 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative aspect-square rounded-[80px] overflow-hidden group perspective-2000"
            >
              <div className="absolute inset-0 bg-red-600/30 group-hover:bg-transparent transition-all duration-1000 z-10" />
              <img 
                src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=90&w=1200" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms]"
                alt="Luxury Home"
              />
              <div className="absolute bottom-12 left-12 right-12 z-20">
                <motion.div 
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="p-12 rounded-[48px] bg-black/70 backdrop-blur-3xl border border-white/10 shadow-2xl"
                >
                  <p className="text-2xl font-bold text-white tracking-tight leading-tight">"Design is not just what it looks like. Design is how it works."</p>
                  <p className="text-red-500 font-black uppercase text-[10px] tracking-[0.5em] mt-8 flex items-center gap-3">
                    <span className="w-10 h-[2px] bg-red-500" /> OUR COMMITMENT
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-40 relative overflow-hidden bg-white/[0.01] border-y border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <StatCard icon={Target} label="Properties Listed" value="12,500+" index={0} />
            <StatCard icon={Users} label="Premium Clients" value="4,800+" index={1} />
            <StatCard icon={Award} label="Cities Covered" value="24+" index={2} />
            <StatCard icon={Zap} label="Verified Agents" value="350+" index={3} />
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-60 relative">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-48 space-y-4">
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-red-500 text-xs font-black uppercase tracking-[0.6em]"
            >
              The Evolution of PropList
            </motion.p>
            <h2 className="text-7xl md:text-[120px] font-black tracking-tighter leading-none">CHRONICLES.</h2>
          </div>

          <div className="relative">
            {/* Background Line */}
            <div className="absolute left-8 md:left-1/2 -translate-x-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-red-500/20 via-white/5 to-transparent" />
            
            {timeline.map((item, i) => (
              <TimelineItem key={i} {...item} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-60 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(220,38,38,0.05),_transparent_50%)]" />
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto rounded-[80px] bg-gradient-to-br from-red-900/20 to-[#050505] p-16 md:p-32 border border-white/10 relative overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-600/10 blur-[150px] -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10 flex flex-col items-center text-center space-y-16">
              <div className="w-48 h-48 rounded-full overflow-hidden border-8 border-red-500/10 p-3 bg-gradient-to-b from-red-500/20 to-transparent">
                <div className="w-full h-full rounded-full bg-white/5 flex items-center justify-center text-red-500 shadow-inner">
                  <Users size={64} />
                </div>
              </div>
              
              <div className="space-y-6">
                <h3 className="text-4xl md:text-7xl font-black tracking-tighter leading-none">MUHAMMAD HAMZA GHAFFAR</h3>
                <p className="text-red-500 text-sm font-black uppercase tracking-[0.8em]">Architect & Visionary</p>
              </div>

              <p className="text-white/40 text-2xl italic leading-relaxed font-medium max-w-4xl">
                "PropList was born from a simple observation: real estate is about more than just square footage. It's about the legacy we build and the spaces that shape our lives. I wanted to create a platform that honors that significance with every pixel."
              </p>

              <div className="flex gap-8">
                {[
                  // LinkedIn
                  { url: 'https://www.linkedin.com', icon: () => <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg> },
                  // Twitter
                  { url: 'https://twitter.com', icon: () => <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
                  // Portfolio
                  { url: '#', icon: () => <Globe size={28} /> },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <MagneticElement key={i}>
                      <motion.a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1, backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }}
                        className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-white/30 transition-all cursor-pointer shadow-xl hover:shadow-red-500/20"
                      >
                        <Icon />
                      </motion.a>
                    </MagneticElement>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-60 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="space-y-16"
        >
          <h2 className="text-7xl md:text-[130px] font-black tracking-tighter leading-none select-none">JOIN THE<br /><span className="text-red-500 italic text-glow">REVOLUTION.</span></h2>
          <MagneticElement>
            <button 
              onClick={() => window.location.href = '/add-property'}
              className="px-20 py-8 rounded-[32px] bg-red-600 text-white font-black text-xl uppercase tracking-[0.4em] shadow-[0_30px_80px_rgba(239,68,68,0.5)] hover:bg-red-500 transition-all group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <span className="flex items-center gap-6 relative z-10">
                List Property <ArrowRight className="group-hover:translate-x-3 transition-transform" strokeWidth={3} />
              </span>
            </button>
          </MagneticElement>
        </motion.div>
      </section>
    </div>
  );
};

export default OurStory;
