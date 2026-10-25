import { useState, useEffect } from 'react';
import { MapPin, Check, Copy } from 'lucide-react';
import { getStoredWeddingConfig } from '../utils/weddingConfig';

export default function VenueSection({ lang, venue, copiedAddress, onCopyAddress }) {
  const [venueData, setVenueData] = useState(() => venue || getStoredWeddingConfig().venue);

  useEffect(() => {
    if (venue) {
      setVenueData(venue);
    }
  }, [venue]);

  useEffect(() => {
    const handleUpdate = (e) => {
      if (e.detail?.venue) {
        setVenueData(e.detail.venue);
      }
    };
    window.addEventListener('wedding_config_updated', handleUpdate);
    return () => window.removeEventListener('wedding_config_updated', handleUpdate);
  }, []);

  const venueName = lang === 'km' ? venueData.venueNameKm : venueData.venueNameEn;
  const address = lang === 'km' ? venueData.addressKm : venueData.addressEn;
  const mapsUrl = venueData.googleMapsUrl || "https://maps.app.goo.gl/is1RjP4f2pYupsgT8?g_st=it";

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
          {venueName}
        </p>
        <p className="text-xs text-stone-500">
          {address}
        </p>
      </div>

      {/* Navigation Action Button (Google Maps) */}
      <div className="flex justify-center max-w-xs mx-auto my-4">
        <a
          href={mapsUrl}
          target="_blank"
          rel="noreferrer"
          className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-[#996515]/60 via-[#d4af37]/75 to-[#ffd700]/90 hover:brightness-105 text-white text-xs sm:text-sm font-semibold shadow-md active:scale-95 transition"
        >
          <MapPin className="w-4 h-4 text-amber-200" />
          <span>Google Maps</span>
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
