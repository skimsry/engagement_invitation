import { KhmerLotus } from './KhmerOrnaments';

export default function Footer() {
  return (
    <footer className="text-center py-8 text-stone-400 space-y-2">
      <KhmerLotus className="w-6 h-6 text-[#d4af37] mx-auto opacity-70" />
      <p className="font-moul text-xs text-amber-200/80">
        សូមថ្លែងអំណរគុណយ៉ាងជ្រាលជ្រៅចំពោះវត្តមានដ៏ឧត្តុង្គឧត្តម
      </p>
      <p className="text-[11px] text-stone-400 font-serif">
        Kimsan &amp; Ussa Engagement • Phnom Penh, Cambodia 2026
      </p>
    </footer>
  );
}
