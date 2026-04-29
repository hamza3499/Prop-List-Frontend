import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bed, Bath, Move, MapPin, ArrowUpRight } from 'lucide-react';

const GlassCard = ({ property }) => {
  const propId = property._id || property.id;
  
  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const seconds = Math.floor((new Date() - date) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' years ago';
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' months ago';
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' days ago';
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' hours ago';
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' min ago';
    return Math.floor(seconds) + ' sec ago';
  };

  return (
    <Link to={`/property/${propId}`} className="block h-full">
      <div
        className="group relative flex flex-col h-full bg-white dark:bg-zinc-900 rounded-[28px] border border-outline-variant/10 shadow-md hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden"
        style={{
          transform: 'translateZ(0)',
          transition: 'transform 0.35s cubic-bezier(0.33,1,0.68,1), box-shadow 0.35s ease',
          willChange: 'transform',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-10px) translateZ(0)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0) translateZ(0)'}
      >
        {/* Image Container */}
        <div className="relative h-[240px] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          <img
            src={property.image}
            alt={property.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-[1.06]"
            style={{ transition: 'transform 0.6s cubic-bezier(0.33,1,0.68,1)', willChange: 'transform' }}
          />
          
          {/* Price & Status Badges */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
            <div className="px-3 py-1 bg-white/90 dark:bg-black/80 backdrop-blur-md rounded-full text-[10px] font-bold text-primary shadow-sm uppercase tracking-widest">
              {property.status || 'Active'}
            </div>
            <div className="px-3 py-1.5 bg-primary rounded-xl text-white font-display font-black text-sm shadow-lg">
              {property.price}
            </div>
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="absolute bottom-4 right-4 w-10 h-10 bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center text-primary shadow-xl opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-4 transition-all duration-500 cursor-pointer">
            <ArrowUpRight size={20} />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <h3 className="text-xl font-display font-bold text-on-surface dark:text-white line-clamp-1 group-hover:text-primary transition-colors">
              {property.title}
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-on-surface/40 dark:text-white/30 text-xs font-medium min-w-0 pr-2">
                <MapPin size={14} className="text-primary/60 shrink-0" />
                <span className="truncate">{property.location}</span>
              </div>
              {property.createdAt && (
                <div className="text-[9px] font-black uppercase tracking-widest text-on-surface/30 dark:text-white/20 shrink-0">
                  {formatTimeAgo(property.createdAt)}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-outline-variant/10 dark:border-white/5">
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-1 text-on-surface/60 dark:text-white/50">
                <Bed size={14} />
                <span className="text-[11px] font-bold">{property.beds}</span>
              </div>
              <span className="text-[9px] uppercase tracking-widest text-on-surface/30 font-bold">Beds</span>
            </div>
            <div className="flex flex-col items-center gap-1 border-x border-outline-variant/10 dark:border-white/5">
              <div className="flex items-center gap-1 text-on-surface/60 dark:text-white/50">
                <Bath size={14} />
                <span className="text-[11px] font-bold">{property.baths}</span>
              </div>
              <span className="text-[9px] uppercase tracking-widest text-on-surface/30 font-bold">Baths</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-1 text-on-surface/60 dark:text-white/50">
                <Move size={14} />
                <span className="text-[11px] font-bold">{property.sqft}</span>
              </div>
              <span className="text-[9px] uppercase tracking-widest text-on-surface/30 font-bold">Sqft</span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default GlassCard;
