import { MapPin, Compass, Check, Copy } from 'lucide-react';

export default function VenueSection({ lang, copiedAddress, onCopyAddress }) {
  return (
    <div className="w-full rounded-none sm:rounded-3xl bg-[#faf7f2] border-y sm:border-2 border-[#d4af37]/50 shadow-2xl p-5 sm:p-8 text-[#3d3126]">
      <div className="text-center space-y-1 mb-5">
        <div className="mb-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[#b8860b] text-xs font-medium">
          <MapPin className="w-3.5 h-3.5" />
          <span>{lang === 'km' ? 'ទីតាំងកម្មវិធី' : 'Location & Venue'}</span>
        </div>
        <h3 className="mb-2 font-moulpali text-xl sm:text-2xl text-[#3d3126]">
          {lang === 'km' ? 'ទីតាំងប្រារព្ធពិធី' : 'Ceremony Venue'}
        </h3>
        <p className="text-sm font-semibold text-[#996515]">
          The Premier Centre Sen Sok (ដឹ ព្រេមៀ សែនសុខ)
        </p>
        <p className="text-xs text-stone-500">
          Phnom Penh, Kingdom of Cambodia
        </p>
      </div>

      {/* Navigation Action Buttons (Google Maps & Waze - Very common in Cambodia!) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto my-4">
        <a
          href="https://maps.google.com/?q=The+Premier+Centre+Sen+Sok+Phnom+Penh"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#b8860b] hover:bg-[#996515] text-white text-xs sm:text-sm font-semibold shadow-md active:scale-95 transition"
        >
          <MapPin className="w-4 h-4 text-amber-200" />
          <span>Google Maps</span>
        </a>

        <a
          href="https://waze.com/ul?q=The+Premier+Centre+Sen+Sok"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-sky-700 hover:bg-sky-800 text-white text-xs sm:text-sm font-semibold shadow-md active:scale-95 transition"
        >
          <Compass className="w-4 h-4 text-sky-200" />
          <span>Waze Navigation</span>
        </a>
      </div>

      {/* Copy Address Button */}
      <div className="text-center pt-1">
        <button
          onClick={onCopyAddress}
          className="inline-flex items-center gap-1.5 text-xs text-[#8c7355] hover:text-[#996515] underline decoration-dotted underline-offset-4"
        >
          {copiedAddress ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          <span>
            {copiedAddress
              ? (lang === 'km' ? 'បានចម្លងអាសយដ្ឋាន!' : 'Address Copied!')
              : (lang === 'km' ? 'ចម្លងអាសយដ្ឋានទីតាំង' : 'Copy Venue Address')}
          </span>
        </button>
      </div>
    </div>
  );
}
