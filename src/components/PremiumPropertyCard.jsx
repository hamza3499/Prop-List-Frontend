import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Bed, Bath, Move, Heart, Search, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PremiumPropertyCard = ({ property, index, onToggleFavorite }) => {
  const navigate = useNavigate();
  const propId = property._id || property.id;
  const [isLiked, setIsLiked] = useState(true); // Since it's in Favorites, it's liked initially
  
  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + 'h ago';
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + 'm ago';
    return 'Just now';
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsLiked(!isLiked);
    if (onToggleFavorite) onToggleFavorite(propId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1, 
        ease: [0.22, 1, 0.36, 1] 
      }}
      whileHover={{ y: -8, scale: 1.02 }}
      onClick={() => navigate(`/property/${propId}`)}
      className="group relative flex flex-col bg-white dark:bg-zinc-900 rounded-[32px] overflow-hidden shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.6)] border border-zinc-100 dark:border-white/5 transition-all duration-500 cursor-pointer h-full"
    >
      {/* Image Section */}
      <div className="relative h-[260px] overflow-hidden">
        <motion.img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
        />
        {/* Bottom Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
        
        {/* Top Badges */}
        <div className="absolute top-5 left-5 right-5 flex justify-between items-center z-10">
          <div className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-black uppercase tracking-widest">
            {property.propertyType || "Property"}
          </div>
        </div>

        {/* Floating Heart Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleFavoriteClick}
          className={`absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border transition-all duration-300 z-20 
            ${isLiked ? 'bg-primary border-primary/20 text-white shadow-lg shadow-primary/30' : 'bg-white/20 border-white/30 text-white hover:bg-white hover:text-primary'}`}
        >
          <motion.div
             animate={{ scale: isLiked ? [1, 1.3, 1] : 1 }}
             transition={{ duration: 0.3 }}
          >
            <Heart size={18} fill={isLiked ? "currentColor" : "none"} strokeWidth={2.5} />
          </motion.div>
        </motion.button>
      </div>

      {/* Content Section */}
      <div className="p-7 space-y-5 flex-grow flex flex-col">
        <div className="space-y-1">
          <h3 className="text-xl font-display font-black text-on-surface dark:text-white line-clamp-1 group-hover:text-primary transition-colors duration-300">
            {property.title}
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-on-surface/40 dark:text-white/30">
              <MapPin size={14} className="text-primary" />
              <span className="text-xs font-medium truncate">{property.location}</span>
            </div>
            {property.createdAt && (
              <span className="text-[10px] font-black text-on-surface/30 dark:text-white/20 uppercase tracking-wider">
                {formatTimeAgo(property.createdAt)}
              </span>
            )}
          </div>
        </div>

        {/* Property Specs Row */}
        <div className="flex items-center gap-6 py-4 border-y border-zinc-50 dark:border-white/5">
          {[
            { icon: Bed, value: property.beds, label: 'Beds' },
            { icon: Bath, value: property.baths, label: 'Baths' },
            { icon: Move, value: property.sqft, label: 'Area' },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-primary/60 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                <Icon size={14} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-black text-on-surface dark:text-white">{value}</span>
                <span className="text-[9px] uppercase font-bold text-on-surface/30 dark:text-white/20 tracking-tighter">{label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Price Row */}
        <div className="pt-2 flex justify-end items-center mt-auto">
          <div className="text-right">
            <p className="text-[10px] font-black text-primary/60 uppercase tracking-[0.2em] mb-0.5">Premium Value</p>
            <p className="text-2xl font-display font-black text-on-surface dark:text-white tracking-tight">
               {property.price}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PremiumPropertyCard;
