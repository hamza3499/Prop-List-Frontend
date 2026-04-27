import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Bed, Bath, Move, ArrowRight, Heart } from 'lucide-react';

const SpotlightSection = ({ property, isFeatured = false, index = 0 }) => {
  const propId = property._id || property.id;
  const [saved, setSaved] = useState(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    return favorites.includes(propId);
  });
  const [imgError, setImgError] = useState(false);
  
  const handleSave = (e) => {
    e.stopPropagation();
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    let newFavorites;
    if (saved) {
      newFavorites = favorites.filter(id => id !== propId);
    } else {
      newFavorites = [...favorites, propId];
    }
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    setSaved(!saved);
  };

  const handleCardClick = () => {
    window.location.href = `/property/${propId}`;
  };

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
    if (interval > 1) return Math.floor(interval) + ' minutes ago';
    return Math.floor(seconds) + ' seconds ago';
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1], delay: index * 0.04 }}
      onClick={handleCardClick}
      className="group relative flex flex-col sm:flex-row bg-white border border-gray-100 rounded-2xl overflow-hidden cursor-pointer hover:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.1)] hover:border-gray-200 transition-all duration-300 ease-out h-full sm:h-[220px]"
    >
      {/* Image: fixed 280px on desktop, fills full card height */}
      <div className="relative shrink-0 w-full sm:w-[280px] h-48 sm:h-full bg-gray-100 overflow-hidden">
        {!imgError && property.image ? (
          <img
            src={property.image}
            alt={property.title}
            loading="lazy"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <span className="text-gray-300 text-xs font-medium tracking-widest uppercase">No Image</span>
          </div>
        )}

        {/* Minimal gradient at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />

        {/* Save Heart */}
        <button
          onClick={handleSave}
          title="Save property"
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm border transition-all duration-200
            ${saved ? 'bg-red-500 border-red-400 shadow-md' : 'bg-white/80 border-white/20 hover:bg-white shadow-sm'}`}
        >
          <Heart size={14} className={`transition-colors ${saved ? 'text-white fill-white' : 'text-gray-500'}`} />
        </button>
      </div>

      {/* ─── Content Panel ─── */}
      <div className="flex flex-col justify-between flex-1 min-w-0 p-6 md:p-7">
        
        {/* Top: Title + Location + Description */}
        <div className="space-y-3">
          {/* Title */}
          <h2 className="text-base md:text-lg font-bold text-gray-900 leading-snug tracking-tight capitalize group-hover:text-gray-700 transition-colors line-clamp-1">
            {property.title}
          </h2>

          {/* Location & Time */}
          <div className="flex items-center justify-between text-gray-400">
            <div className="flex items-center gap-1.5 flex-1 min-w-0 pr-4">
              <MapPin size={13} className="shrink-0" strokeWidth={2} />
              <span className="text-xs truncate">{property.location}</span>
            </div>
            {property.createdAt && (
              <span className="text-[10px] font-semibold uppercase tracking-wide shrink-0">
                {formatTimeAgo(property.createdAt)}
              </span>
            )}
          </div>

          {/* Description */}
          {property.description && property.description !== 'Premium Property' && (
            <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 pr-4">
              {property.description}
            </p>
          )}
        </div>

        {/* Bottom: Specs + Price + CTA */}
        <div className="mt-5 pt-5 border-t border-gray-50 flex flex-wrap items-end justify-between gap-4">

          {/* Specs */}
          <div className="flex flex-wrap items-center gap-4">
            {[
              { icon: Bed, value: property.beds, label: 'Beds' },
              { icon: Bath, value: property.baths, label: 'Baths' },
              { icon: Move, value: property.sqft, label: 'Area' },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <Icon size={13} className="text-gray-300" strokeWidth={2} />
                <span className="text-xs font-semibold text-gray-700">{value}</span>
                <span className="text-[10px] text-gray-400 uppercase">{label}</span>
              </div>
            ))}
          </div>

          {/* Price + Button */}
          <div className="flex items-center gap-4 ml-auto">
            <span className="text-base font-black text-gray-900 whitespace-nowrap">{property.price}</span>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={e => { e.stopPropagation(); window.location.href = `/property/${propId}`; }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-gray-700 bg-gray-50 border border-gray-200 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-200 whitespace-nowrap group/btn"
            >
              View Details
              <ArrowRight size={13} className="group-hover/btn:translate-x-0.5 transition-transform" />
            </motion.button>
          </div>

        </div>
      </div>
    </motion.article>
  );
};

export default SpotlightSection;
