export function KhmerLotus({ className = "w-8 h-8", alt = "Engagement Rings" }) {
  return (
    <img
      src="/images/rings-logo.png"
      alt={alt}
      className={`object-contain inline-block shrink-0 select-none ${className}`}
    />
  );
}

export function KhmerDivider({ className = "w-full my-4" }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#d4af37]/60 to-[#d4af37]" />
      <div className="flex items-center gap-1.5 text-[#d4af37]">
        <span className="text-xs">❖</span>
        <KhmerLotus className="w-8 h-8 text-[#b8860b]" />
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
