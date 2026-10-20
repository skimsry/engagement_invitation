export function KhmerLotus({ className = "w-8 h-8 text-[#d4af37]" }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="currentColor">
      <path d="M50 10 C45 35 30 45 10 50 C30 55 45 65 50 90 C55 65 70 55 90 50 C70 45 55 35 50 10 Z" opacity="0.85"/>
      <circle cx="50" cy="50" r="10" fill="#fef08a" />
      <path d="M50 25 C47 38 38 47 25 50 C38 53 47 62 50 75 C53 62 62 53 75 50 C62 47 53 38 50 25 Z" opacity="0.6"/>
    </svg>
  );
}

export function KhmerDivider({ className = "w-full my-4" }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#d4af37]/60 to-[#d4af37]" />
      <div className="flex items-center gap-1.5 text-[#d4af37]">
        <span className="text-xs">❖</span>
        <KhmerLotus className="w-5 h-5 text-[#b8860b]" />
        <span className="text-xs">❖</span>
      </div>
      <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#d4af37]/60 to-[#d4af37]" />
    </div>
  );
}

export function KhmerCorner({ className = "w-12 h-12 text-[#d4af37]" }) {
  return (
    <svg className={className} viewBox="0 0 60 60" fill="none" stroke="currentColor">
      <path d="M5 55 L5 15 C5 9.5 9.5 5 15 5 L55 5" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 55 L12 20 C12 15.6 15.6 12 20 12 L55 12" strokeWidth="1" opacity="0.6" strokeLinecap="round" />
      <circle cx="20" cy="20" r="3" fill="currentColor" />
      <path d="M5 5 L15 15" strokeWidth="1.5" />
      <circle cx="8" cy="8" r="1.5" fill="currentColor" />
    </svg>
  );
}
