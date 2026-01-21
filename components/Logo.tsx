
import React from 'react';

export const Logo: React.FC<{ size?: 'sm' | 'md' | 'lg', light?: boolean }> = ({ size = 'md', light = false }) => {
  const sizeClasses = {
    sm: { box: 'w-6 h-6 rounded-md', text: 'text-lg', icon: 'text-sm' },
    md: { box: 'w-8 h-8 rounded-lg', text: 'text-xl', icon: 'text-base' },
    lg: { box: 'w-12 h-12 rounded-xl', text: 'text-3xl', icon: 'text-xl' },
  };

  const s = sizeClasses[size];

  return (
    <div className="flex items-center gap-2 select-none">
      <div className={`${s.box} bg-[#ff4b9a] flex items-center justify-center text-white font-black ${s.icon} shadow-sm`}>
        B
      </div>
      <span className={`${s.text} font-extrabold tracking-tight ${light ? 'text-white' : 'text-gray-900'}`}>
        Bhara<span className="text-[#ff4b9a]">.</span>online
      </span>
    </div>
  );
};
