import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronDown, Check } from 'lucide-react';

const PremiumFilters = ({ onFilterChange }) => {
  const initialFilters = {
    search: '', purpose: 'Both', type: 'All',
    minPrice: '', maxPrice: '', beds: '', baths: '',
    minArea: '', maxArea: '', condition: '', furnished: false, sort: 'newest'
  };

  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    const handler = setTimeout(() => onFilterChange(filters), 400);
    return () => clearTimeout(handler);
  }, [filters, onFilterChange]);

  const updateFilter = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));
  const clearFilters = () => setFilters(initialFilters);

  const types = ['All', 'House', 'Apartment', 'Plot', 'Commercial'];
  const bedsBaths = ['1', '2', '3', '4', '5+'];

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* Top Search Bar */}
      <div className="relative w-full max-w-4xl mb-10 shadow-[0_15px_40px_-5px_rgba(0,0,0,0.08)] border border-black/5 dark:border-white/5 rounded-full z-20 group transition-all duration-300 hover:shadow-[0_20px_50px_-5px_rgba(0,0,0,0.12)] hover:scale-[1.01] bg-white dark:bg-zinc-800 flex items-center h-16 md:h-20 focus-within:shadow-[0_20px_50px_-5px_rgba(0,0,0,0.15)] focus-within:scale-[1.01] focus-within:border-black/10 dark:focus-within:border-white/10">
        <div className="pl-6 md:pl-8 flex items-center pointer-events-none">
          <Search size={22} className="text-black/40 group-focus-within:text-zinc-900 dark:group-focus-within:text-white transition-colors duration-300" strokeWidth={2} />
        </div>
        <input 
          type="text"
          placeholder="Enter an address, neighborhood, city, or ZIP code"
          value={filters.search}
          onChange={(e) => updateFilter('search', e.target.value)}
          className="flex-1 h-full px-4 md:px-6 bg-transparent text-lg md:text-xl text-black dark:text-white outline-none placeholder:text-black/30 dark:placeholder:text-white/30 font-medium transition-all"
        />
        
        {/* Purpose Toggles directly integrated into the right side of search bar */}
        <div className="hidden sm:flex bg-zinc-100 dark:bg-zinc-900 p-1 rounded-full mr-2 md:mr-3 border border-black/5 dark:border-white/5 shadow-inner">
           {['Both', 'Sale', 'Rent'].map(p => (
              <button 
                key={p} 
                onClick={() => updateFilter('purpose', p)}
                className={`px-5 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-semibold tracking-wide transition-all duration-300 ${filters.purpose === p ? 'bg-white dark:bg-zinc-700 text-black dark:text-white shadow-[0_2px_8px_rgba(0,0,0,0.1)]' : 'text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'}`}
              >
                {p}
              </button>
           ))}
        </div>
      </div>

      {/* Mobile Purpose Filter */}
      <div className="flex sm:hidden w-full max-w-4xl mb-8 bg-white dark:bg-zinc-800 p-1.5 rounded-full shadow-md border border-black/5 dark:border-white/5">
         {['Both', 'Sale', 'Rent'].map(p => (
            <button 
              key={p} 
              onClick={() => updateFilter('purpose', p)}
              className={`flex-1 py-3 px-4 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 ${filters.purpose === p ? 'bg-zinc-900 text-white shadow-sm' : 'text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white hover:bg-black/5'}`}
            >
              {p}
            </button>
         ))}
      </div>

      {/* Solid Premium Filter Board */}
      <div className="w-full max-w-5xl bg-white dark:bg-zinc-900 rounded-[20px] md:rounded-[24px] p-8 md:p-10 lg:p-12 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.05),0_0_1px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,1)] dark:shadow-[0_20px_60px_-10px_rgba(0,0,0,0.4),0_0_1px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.05)] border border-zinc-200/60 dark:border-white/5 space-y-10 z-10 transition-all duration-300">
        
        {/* Property Type Tabs */}
        <div>
          <div className="flex justify-between items-center mb-5 ml-1">
            <p className="text-[11px] md:text-xs font-semibold tracking-widest text-black/50 dark:text-white/50 uppercase">Property Type</p>
            <button onClick={clearFilters} className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline transition-all">Clear All Filters</button>
          </div>
          <div className="flex gap-4 pb-2 overflow-x-auto hide-scrollbar">
            {types.map(t => (
              <button
                key={t}
                onClick={() => updateFilter('type', t)}
                className={`px-8 md:px-10 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 border ${
                  filters.type === t 
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-zinc-900 shadow-[0_4px_15px_rgba(0,0,0,0.15)]' 
                    : 'bg-zinc-50 dark:bg-zinc-800/80 border-black/5 dark:border-white/5 text-black/70 dark:text-white/70 hover:bg-zinc-100 hover:shadow-sm hover:-translate-y-[2px]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 lg:gap-12">
          
          {/* Price Range */}
          <div className="space-y-4">
             <p className="text-[11px] md:text-xs font-semibold tracking-widest text-black/50 dark:text-white/50 ml-1 uppercase">Price (PKR)</p>
             <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800 p-1.5 rounded-xl border border-black/5 dark:border-white/5 focus-within:shadow-[0_0_0_2px_rgba(0,0,0,0.05)] focus-within:border-black/20 dark:focus-within:border-white/20 transition-all duration-300">
               <input type="number" placeholder="Min" value={filters.minPrice} onChange={e => updateFilter('minPrice', e.target.value)} className="w-full bg-transparent py-2.5 rounded-lg outline-none text-sm font-semibold text-center text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/40 focus:bg-white dark:focus:bg-zinc-700 transition-colors duration-300" />
               <div className="w-px h-6 bg-black/10 dark:bg-white/10 shrink-0 mx-0.5" />
               <input type="number" placeholder="Max" value={filters.maxPrice} onChange={e => updateFilter('maxPrice', e.target.value)} className="w-full bg-transparent py-2.5 rounded-lg outline-none text-sm font-semibold text-center text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/40 focus:bg-white dark:focus:bg-zinc-700 transition-colors duration-300" />
             </div>
          </div>

          {/* Area Range */}
          <div className="space-y-4">
             <p className="text-[11px] md:text-xs font-semibold tracking-widest text-black/50 dark:text-white/50 ml-1 uppercase">Area (SQFT)</p>
             <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800 p-1.5 rounded-xl border border-black/5 dark:border-white/5 focus-within:shadow-[0_0_0_2px_rgba(0,0,0,0.05)] focus-within:border-black/20 dark:focus-within:border-white/20 transition-all duration-300">
               <input type="number" placeholder="Min" value={filters.minArea} onChange={e => updateFilter('minArea', e.target.value)} className="w-full bg-transparent py-2.5 rounded-lg outline-none text-sm font-semibold text-center text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/40 focus:bg-white dark:focus:bg-zinc-700 transition-colors duration-300" />
               <div className="w-px h-6 bg-black/10 dark:bg-white/10 shrink-0 mx-0.5" />
               <input type="number" placeholder="Max" value={filters.maxArea} onChange={e => updateFilter('maxArea', e.target.value)} className="w-full bg-transparent py-2.5 rounded-lg outline-none text-sm font-semibold text-center text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/40 focus:bg-white dark:focus:bg-zinc-700 transition-colors duration-300" />
             </div>
          </div>

          {/* Bedrooms */}
          <div className="space-y-4 lg:col-span-2">
             <div className="grid grid-cols-2 gap-8 md:gap-10 lg:gap-12">
                <div>
                   <p className="text-[11px] md:text-xs font-semibold tracking-widest text-black/50 dark:text-white/50 mb-4 ml-1 uppercase">Beds</p>
                   <div className="flex gap-1 p-1 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-black/5 dark:border-white/5">
                     {bedsBaths.map(b => (
                        <button key={b} onClick={() => updateFilter('beds', filters.beds === b ? '' : b)}
                          className={`flex-1 py-2.5 md:py-3 text-sm font-semibold rounded-lg transition-all duration-300 hover:-translate-y-[1px] ${filters.beds === b ? 'bg-white dark:bg-zinc-700 shadow-[0_4px_12px_rgba(0,0,0,0.08)] text-black dark:text-white border border-black/5' : 'text-black/60 dark:text-white/60 hover:bg-zinc-100 hover:text-black'}`}>
                          {b}
                        </button>
                     ))}
                   </div>
                </div>
                <div>
                   <p className="text-[11px] md:text-xs font-semibold tracking-widest text-black/50 dark:text-white/50 mb-4 ml-1 uppercase">Baths</p>
                   <div className="flex gap-1 p-1 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-black/5 dark:border-white/5">
                     {bedsBaths.map(b => (
                        <button key={b} onClick={() => updateFilter('baths', filters.baths === b ? '' : b)}
                          className={`flex-1 py-2.5 md:py-3 text-sm font-semibold rounded-lg transition-all duration-300 hover:-translate-y-[1px] ${filters.baths === b ? 'bg-white dark:bg-zinc-700 shadow-[0_4px_12px_rgba(0,0,0,0.08)] text-black dark:text-white border border-black/5' : 'text-black/60 dark:text-white/60 hover:bg-zinc-100 hover:text-black'}`}>
                          {b}
                        </button>
                     ))}
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Action Row */}
        <div className="flex flex-col md:flex-row items-center justify-start gap-6 pt-10 mt-6 border-t border-black/5 dark:border-white/5">
           
           {/* Secondary Dropdowns */}
           <div className="flex flex-col sm:flex-row flex-wrap gap-4 w-full md:w-auto">
              <div className="relative flex-grow sm:flex-grow-0 group">
                 <select value={filters.condition} onChange={e => updateFilter('condition', e.target.value)} className="w-full md:w-56 appearance-none pl-5 pr-12 py-3.5 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-sm font-semibold border border-black/5 dark:border-white/5 text-black/80 dark:text-white/80 outline-none hover:bg-zinc-100 hover:shadow-sm hover:-translate-y-[1px] transition-all duration-300 cursor-pointer">
                    <option value="">Condition: Any</option>
                    <option value="Excellent">Brand New / Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Needs Work">Needs Work</option>
                 </select>
                 <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-black/40 group-hover:text-black transition-colors" />
              </div>
              <button 
                 onClick={() => updateFilter('furnished', !filters.furnished)} 
                 className={`flex-grow sm:flex-grow-0 flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl transition-all duration-300 text-sm font-semibold border hover:-translate-y-[1px] ${filters.furnished ? 'bg-zinc-900 text-white border-zinc-900 shadow-md dark:bg-white dark:text-zinc-900' : 'bg-zinc-50 dark:bg-zinc-800 border-black/5 dark:border-white/5 text-black/70 hover:bg-zinc-100 hover:shadow-sm'}`}
              >
                 <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors duration-300 ${filters.furnished ? 'border-transparent text-white dark:text-zinc-900' : 'border-black/20 dark:border-white/20'}`}>
                    {filters.furnished && <Check size={12} strokeWidth={3} />}
                 </div>
                 Furnished Only
              </button>
           </div>
        </div>

      </div>
    </div>
  );
};

export default React.memo(PremiumFilters);
