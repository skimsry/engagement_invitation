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

export function KhmerCorner({ className = "w-12 h-12", alt = "Khmer Corner Ornament", ...props }) {
  return (
    <img
      src="/images/khmer-corner.webp"
      alt={alt}
      width={140}
      height={140}
      loading="eager"
      decoding="async"
      className={`object-contain pointer-events-none select-none inline-block shrink-0 ${className}`}
      {...props}
    />
  );
}
