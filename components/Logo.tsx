
import React from 'react';

export const Logo: React.FC<{ size?: 'sm' | 'md' | 'lg', light?: boolean, className?: string }> = ({ size = 'md', light = false, className = '' }) => {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-5xl',
  };

  const fontSize = sizeClasses[size];
  // Using brand purple #2d1b4e for dark text, white for light mode
  const textColor = light ? 'text-white' : 'text-[#2d1b4e]';

  return (
    <div className={`font-black tracking-tighter ${fontSize} select-none flex items-baseline leading-none ${className}`}>
      <span className={textColor}>Bhara</span>
      <span className="text-[#ff4b9a]">.</span>
      <span className={textColor}>online</span>
    </div>
  );
};
