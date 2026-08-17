import React from 'react';

interface AutoVentraLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  variant?: 'dark' | 'light';
}

export const AutoVentraLogo: React.FC<AutoVentraLogoProps> = ({
  className = '',
  size = 'md',
  showTagline = false,
  variant = 'dark',
}) => {
  const iconSizeClass =
    size === 'sm'
      ? 'w-7 h-7 text-base'
      : size === 'md'
      ? 'w-8 h-8 text-lg'
      : size === 'lg'
      ? 'w-10 h-10 text-xl'
      : 'w-12 h-12 text-2xl';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Professional Polish Geometric Red Diamond Emblem */}
      <div className="relative flex-shrink-0 flex items-center justify-center p-1">
        <div
          className={`${iconSizeClass} bg-[#e24b4a] rotate-45 flex items-center justify-center shadow-lg shadow-red-950/40 transition-transform duration-300 group-hover:scale-105`}
        >
          <span className="-rotate-45 font-black text-white leading-none font-heading">
            A
          </span>
        </div>
      </div>

      {/* Typography */}
      <div className="flex flex-col text-left">
        <div className="flex items-center tracking-tight font-black uppercase font-heading leading-none flex-wrap">
          <span
            className={`text-base md:text-lg tracking-tight ${
              variant === 'light' ? 'text-[#0b0b0b]' : 'text-white'
            }`}
          >
            AUTOVENTRA
          </span>
          <span className="text-base md:text-lg tracking-tight text-[#e24b4a] ml-1">
            MOBILITIES
          </span>
        </div>

        <div className="flex items-center gap-1.5 mt-1">
          <span className="text-[9px] uppercase tracking-[0.2em] text-[#e24b4a] font-bold font-mono">
            Mobility & Automotive Group
          </span>
        </div>

        {showTagline && (
          <span
            className={`text-[10px] tracking-wider uppercase font-medium mt-0.5 ${
              variant === 'light' ? 'text-zinc-600' : 'text-zinc-400'
            }`}
          >
            Driving Trust. Delivering Value.
          </span>
        )}
      </div>
    </div>
  );
};

