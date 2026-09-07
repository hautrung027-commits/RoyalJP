import React from 'react';

interface RoyalJpLogoProps {
  className?: string;
  variant?: 'navbar' | 'footer' | 'intro' | 'badge' | 'full';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
}

export const RoyalJpLogo: React.FC<RoyalJpLogoProps> = ({
  className = '',
  variant = 'navbar',
  size = 'md',
  showSubtitle = true,
}) => {
  // Dimension presets
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10 sm:h-11',
    lg: 'h-14 sm:h-16',
    xl: 'h-20 sm:h-24',
  };

  if (variant === 'badge') {
    return (
      <div className={`relative inline-flex items-center justify-center overflow-hidden rounded-md bg-black border border-[#C8A96B]/40 shadow-md ${className}`}>
        <img
          src="/royal_jp_logo.jpg"
          alt="royalJPcar Logo"
          referrerPolicy="no-referrer"
          className="h-full w-auto object-contain"
        />
      </div>
    );
  }

  if (variant === 'intro') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        {/* Emblem Image Container */}
        <div className="relative mb-3 p-2 bg-black rounded-xl border border-[#C8A96B]/60 shadow-[0_16px_40px_rgba(0,0,0,0.5)] max-w-[280px] sm:max-w-[340px]">
          <img
            src="/royal_jp_logo.jpg"
            alt="royalJPcar Official Logo"
            referrerPolicy="no-referrer"
            className="w-full h-auto object-contain rounded-lg"
          />
        </div>

        {/* Brand Text */}
        <div className="flex items-center gap-1.5 mt-2">
          <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#C8A96B]">
            Royal
          </span>
          <span className="font-sans text-2xl sm:text-3xl font-black italic tracking-tighter text-[#E5252A]">
            JP
          </span>
          <span className="font-sans text-2xl sm:text-3xl font-bold italic tracking-tight text-[#17212B]">
            car
          </span>
        </div>

        {showSubtitle && (
          <div className="flex items-center gap-2 mt-1.5">
            <span className="inline-block w-6 h-[1px] bg-[#C8A96B]/60" />
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#69727C] font-semibold">
              TOKYO • ROPPONGI
            </span>
            <span className="inline-block w-6 h-[1px] bg-[#C8A96B]/60" />
          </div>
        )}
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={`flex items-center gap-3.5 ${className}`}>
        {/* Dark Box for Logo Image */}
        <div className="h-12 w-auto px-2 py-1 bg-black rounded-sm border border-[#C8A96B]/40 flex items-center justify-center shrink-0 shadow-sm">
          <img
            src="/royal_jp_logo.jpg"
            alt="royalJPcar Logo"
            referrerPolicy="no-referrer"
            className="h-10 w-auto object-contain"
          />
        </div>

        <div className="flex flex-col">
          <div className="flex items-baseline gap-1">
            <span className="font-serif font-bold text-white text-xl sm:text-2xl tracking-normal">
              Royal
            </span>
            <span className="font-sans font-black italic text-[#E5252A] text-xl sm:text-2xl tracking-tighter">
              JP
            </span>
            <span className="font-sans font-bold italic text-white text-xl sm:text-2xl tracking-tight">
              car
            </span>
          </div>
          {showSubtitle && (
            <span className="text-[9px] sm:text-[10px] tracking-[0.22em] text-[#B8C0C7] uppercase font-medium mt-0.5">
              Automotive Luxury • Japan
            </span>
          )}
        </div>
      </div>
    );
  }

  // Default 'navbar' variant
  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 group ${className}`}>
      {/* Crisp Logo Emblem Container */}
      <div className="h-9 sm:h-10 px-1.5 py-0.5 bg-[#0D1117] rounded-sm border border-[#C8A96B]/50 group-hover:border-[#C8A96B] transition-colors shadow-sm flex items-center justify-center shrink-0">
        <img
          src="/royal_jp_logo.jpg"
          alt="royalJPcar"
          referrerPolicy="no-referrer"
          className="h-8 sm:h-9 w-auto object-contain"
        />
      </div>

      {/* Stylized Brand Name */}
      <div className="flex flex-col text-left">
        <div className="flex items-baseline gap-0.5">
          <span className="font-serif font-bold text-[#C8A96B] text-lg sm:text-xl tracking-tight leading-none">
            Royal
          </span>
          <span className="font-sans font-black italic text-[#E5252A] text-lg sm:text-xl tracking-tighter leading-none">
            JP
          </span>
          <span className="font-sans font-bold italic text-[#17212B] text-lg sm:text-xl tracking-tight leading-none">
            car
          </span>
        </div>
        {showSubtitle && (
          <span className="text-[8px] sm:text-[9px] tracking-[0.22em] text-[#69727C] uppercase font-medium mt-0.5 whitespace-nowrap">
            Luxury Showroom • Tokyo
          </span>
        )}
      </div>
    </div>
  );
};
