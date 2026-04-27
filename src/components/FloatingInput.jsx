import React, { useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(inputs));

const FloatingInput = ({ label, id, type = 'text', value, onChange, error, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);
  const isFloating = isFocused || (value && value.length > 0);

  return (
    <div className="relative w-full space-y-1">
      <div className={cn(
        "relative rounded-xl transition-all duration-300 input-gradient-border",
        isFocused 
          ? "bg-white dark:bg-zinc-800 shadow-md ring-2 ring-primary/5" 
          : "bg-surface-container-low dark:bg-zinc-900 border border-outline-variant/5",
        error ? "after:via-error" : "after:via-primary"
      )}>
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full px-4 pt-6 pb-2 bg-transparent outline-none text-on-surface font-medium placeholder:text-transparent"
          placeholder={label}
          {...props}
        />
        <label
          htmlFor={id}
          className={cn(
            "absolute left-4 transition-all duration-300 pointer-events-none font-medium",
            isFloating 
              ? "top-1.5 text-xs text-primary" 
              : "top-4 text-base text-on-surface/50"
          )}
        >
          {label}
        </label>
      </div>
      {error && (
        <span className="text-xs text-primary font-bold pl-1 animate-fade-in">
          {error}
        </span>
      )}
    </div>
  );
};

export default FloatingInput;
