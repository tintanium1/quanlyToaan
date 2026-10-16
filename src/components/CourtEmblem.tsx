import React from 'react';

interface CourtEmblemProps {
  className?: string;
  size?: number;
}

export const CourtEmblem: React.FC<CourtEmblemProps> = ({ className = '', size = 48 }) => {
  return (
    <div 
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`} 
      style={{ width: size, height: size }}
      title="Huy hiệu Tòa án nhân dân Việt Nam"
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm"
      >
        {/* Outer Golden Border & Cogwheel / Laurel styling */}
        <circle cx="50" cy="50" r="48" fill="#B91C1C" stroke="#F59E0B" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="44" stroke="#FBBF24" strokeWidth="1" strokeDasharray="3 2" />

        {/* Inner Golden Rice Ears / Wreath */}
        <path
          d="M 22 72 C 16 55 18 36 32 24 C 28 35 29 52 38 66 Z"
          fill="#FBBF24"
          opacity="0.9"
        />
        <path
          d="M 78 72 C 84 55 82 36 68 24 C 72 35 71 52 62 66 Z"
          fill="#FBBF24"
          opacity="0.9"
        />

        {/* Red Circular Center Shield */}
        <circle cx="50" cy="46" r="28" fill="#DC2626" />

        {/* Golden 5-point Star */}
        <path
          d="M 50 24 L 52.8 32.5 L 61.8 32.5 L 54.5 37.8 L 57.3 46.2 L 50 41 L 42.7 46.2 L 45.5 37.8 L 38.2 32.5 L 47.2 32.5 Z"
          fill="#FDE047"
          stroke="#F59E0B"
          strokeWidth="0.5"
        />

        {/* Golden Scale of Justice (Cán cân công lý) */}
        {/* Central pillar */}
        <rect x="48.5" y="44" width="3" height="24" rx="1.5" fill="#FBBF24" stroke="#B45309" strokeWidth="0.5" />
        {/* Base */}
        <path d="M 40 68 L 60 68 L 56 65 L 44 65 Z" fill="#FBBF24" />
        <rect x="38" y="68" width="24" height="2.5" rx="1" fill="#D97706" />

        {/* Horizontal balance beam */}
        <path d="M 30 48 L 70 48" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="50" cy="48" r="2.5" fill="#D97706" />

        {/* Left balance pan */}
        <path d="M 32 48 L 27 58 L 37 58 Z" fill="none" stroke="#FBBF24" strokeWidth="1" />
        <path d="M 25 58 C 25 61 39 61 39 58 Z" fill="#FDE047" stroke="#D97706" strokeWidth="0.5" />

        {/* Right balance pan */}
        <path d="M 68 48 L 63 58 L 73 58 Z" fill="none" stroke="#FBBF24" strokeWidth="1" />
        <path d="M 61 58 C 61 61 75 61 75 58 Z" fill="#FDE047" stroke="#D97706" strokeWidth="0.5" />

        {/* Red Ribbon Banner at bottom */}
        <path
          d="M 24 74 L 38 71 L 50 73 L 62 71 L 76 74 L 72 82 L 62 78 L 50 80 L 38 78 L 28 82 Z"
          fill="#991B1B"
          stroke="#F59E0B"
          strokeWidth="1"
        />
        {/* Text on banner */}
        <text
          x="50"
          y="77.5"
          textAnchor="middle"
          fontSize="4.5"
          fontWeight="bold"
          fill="#FEF08A"
          letterSpacing="0.8"
        >
          TÒA ÁN NHÂN DÂN
        </text>
      </svg>
    </div>
  );
};
