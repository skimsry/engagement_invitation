import { Sparkles, CheckCircle2, Gift, Share2 } from 'lucide-react';

export default function BottomNav({
  lang,
  onScrollToTop,
  onScrollToRsvp,
  onOpenGiftModal,
  onShare
}) {
  return (
    <div className="fixed bottom-3.5 left-1/2 -translate-x-1/2 z-40 px-3 py-2 rounded-full bg-stone-950/85 backdrop-blur-lg border border-[#d4af37]/40 shadow-2xl flex items-center gap-2 text-white text-xs">
      <button
        onClick={onScrollToTop}
        className="p-2 rounded-full hover:bg-white/10 text-amber-300 transition"
        title="Scroll to Top"
      >
        <Sparkles className="w-4 h-4" />
      </button>

      <div className="w-[1px] h-4 bg-stone-700" />

      <button
        onClick={onScrollToRsvp}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#b8860b] text-white font-medium hover:bg-[#996515] transition active:scale-95 shadow"
      >
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span>RSVP</span>
      </button>

      <button
        onClick={onOpenGiftModal}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-800 hover:bg-stone-700 text-[#ffd700] border border-[#d4af37]/40 font-medium transition active:scale-95"
      >
        <Gift className="w-3.5 h-3.5" />
        <span>{lang === 'km' ? 'ចងដៃ' : 'Gift'}</span>
      </button>

      <div className="w-[1px] h-4 bg-stone-700" />

      <button
        onClick={onShare}
        className="p-2 rounded-full hover:bg-white/10 text-stone-300 transition"
        title="Share"
      >
        <Share2 className="w-4 h-4" />
      </button>
    </div>
  );
}
