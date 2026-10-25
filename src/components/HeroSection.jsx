import { useState, useEffect } from 'react';
import { CalendarPlus, Heart } from 'lucide-react';
import { KhmerCorner, KhmerDivider } from './KhmerOrnaments';
import CountdownTimer from './CountdownTimer';
import { getStoredWeddingConfig } from '../utils/weddingConfig';

export default function HeroSection({ guest, lang, onAddToCalendar }) {
  const [config, setConfig] = useState(() => getStoredWeddingConfig());

  useEffect(() => {
    const handleUpdate = (e) => {
      if (e.detail) {
        setConfig(e.detail);
      }
    };
    window.addEventListener('wedding_config_updated', handleUpdate);
    return () => window.removeEventListener('wedding_config_updated', handleUpdate);
  }, []);

  const couple = config?.couple;
  const eventDate = config?.eventDate;
  const cover = config?.cover;

  // Check if link has a valid guest ID or custom guest name
  const hasGuestId = Boolean(
    (guest?.id && guest.id !== 'demo' && guest.id !== '') ||
    (guest?.name && guest.name.trim() !== '' && guest.name !== 'ឯកឧត្តម / លោកជំទាវ / លោក / លោកស្រី' && guest.name !== 'ភ្ញៀវកិត្តិយស / Honored Guest') ||
    (typeof window !== 'undefined' && Boolean(
      new URLSearchParams(window.location.search).get('guest') ||
      new URLSearchParams(window.location.search).get('to') ||
      new URLSearchParams(window.location.search).get('name') ||
      window.Telegram?.WebApp?.initDataUnsafe?.start_param
    ))
  );

  const defaultHonoredText = lang === 'km'
    ? 'ឯកឧត្តម លោកជំទាវ លោក លោកស្រី អ្នកនាង កញ្ញា និងភ្ញៀវកិត្តិយសទាំងអស់'
    : 'Excellencies, Ladies, Gentlemen, and Distinguished Guests';

  const guestDisplayName = (hasGuestId && guest?.name?.trim())
    ? guest.name
    : defaultHonoredText;

  return (
    <div className="w-full rounded-none sm:rounded-3xl bg-[#faf7f2] border-y sm:border-2 border-[#d4af37]/50 shadow-2xl p-5 sm:p-8 relative overflow-hidden text-center text-[#3d3126]">
      {/* Corner Traditional Ornaments */}
      <div className="absolute top-2 left-2 pointer-events-none opacity-40">
        <KhmerCorner className="w-36 h-36 text-[#b8860b]" />
      </div>
      <div className="absolute top-2 right-2 pointer-events-none opacity-40 rotate-90">
        <KhmerCorner className="w-36 h-36 text-[#b8860b]" />
      </div>

      {/* Khmer Blessing Header */}
      <p className="mb-4 mt-16 font-moulpali text-base sm:text-xl text-[#b8860b]">
        សិរីសួស្តី ជ័យមង្គល វិបុលសុខ
      </p>
      <p className="mb-2 font-moulpali text-sm sm:text-base text-[#78500c]">
        ពិធីចូលចែចូវ
      </p>
      <p className="text-xs uppercase tracking-[0.2em] text-[#8c7355] mt-1 font-serif">
        The Engagement Ceremony of
      </p>

      <KhmerDivider className="my-3" />

      {/* Couple Individual Portraits Section (Man Top-Left, Woman Bottom-Right) */}
      <div className="w-full max-w-sm mx-auto my-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-50/80 via-white to-amber-50/60 border border-[#d4af37]/40 shadow-sm relative overflow-hidden">
        {/* Soft background ornament */}
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#d4af37]/10 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-rose-500/10 rounded-full blur-xl pointer-events-none" />

        {/* Man Preview (Top Left) */}
        <div className="flex items-center gap-3 sm:gap-4 mr-auto w-full max-w-[92%]">
          <div className="relative shrink-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-[#d4af37] shadow-[0_4px_12px_rgba(212,175,55,0.35)] p-0.5 bg-gradient-to-tr from-[#996515] via-[#ffd700] to-[#fbeea0]">
              <img
                src={couple?.groom?.image || "/images/groom-childhood.webp"}
                alt={couple?.groom?.firstNameEn || 'Kimsan'}
                className="w-full h-full object-cover rounded-full"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#12100e] border border-[#d4af37] flex items-center justify-center text-[10px] text-[#ffd700] shadow">
              🤵
            </div>
          </div>
          <div className="text-left flex-1 min-w-0">
            <span className="inline-block font-kantumruy text-[11px] sm:text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#d4af37]/15 text-[#854d0e] border border-[#d4af37]/35 tracking-wide">
              {lang === 'km' ? 'កូនប្រុសនាម' : 'The Groom'}
            </span>
            <h3 className="font-moulpali text-sm sm:text-base text-[#78500c] mt-1.5 truncate">
              {couple?.groom?.lastNameKm ? `${couple.groom.lastNameKm} ${couple.groom.firstNameKm}` : 'សន គឹមសាន្ត'}
            </h3>
            <p className="font-kantumruy text-xs text-[#8c7355] tracking-wider truncate">
              {couple?.groom?.lastNameEn ? `${couple.groom.lastNameEn} ${couple.groom.firstNameEn}` : 'SORN KIMSAN'}
            </p>
          </div>
        </div>

        {/* Connecting Heart Motif */}
        <div className="my-2.5 flex items-center justify-center gap-2">
          <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37]/50 to-rose-300" />
          <div className="w-8 h-8 rounded-full bg-rose-50 border border-rose-200/80 flex items-center justify-center shadow-sm">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
          </div>
          <div className="flex-1 h-[1px] bg-gradient-to-r from-rose-300 via-[#d4af37]/50 to-transparent" />
        </div>

        {/* Woman Preview (Bottom Right) */}
        <div className="flex items-center justify-end gap-3 sm:gap-4 ml-auto w-full max-w-[92%] text-right">
          <div className="text-right flex-1 min-w-0">
            <span className="inline-block font-kantumruy text-[11px] sm:text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-700 border border-rose-300/40 tracking-wide">
              {lang === 'km' ? 'កូនស្រីនាម' : 'The Bride'}
            </span>
            <h3 className="font-moulpali text-sm sm:text-base text-[#78500c] mt-1.5 truncate">
              {couple?.bride?.lastNameKm ? `${couple.bride.lastNameKm} ${couple.bride.firstNameKm}` : 'ង៉ោ អូយសាំង'}
            </h3>
            <p className="font-kantumruy text-xs text-[#8c7355] tracking-wider truncate">
              {couple?.bride?.lastNameEn ? `${couple.bride.lastNameEn} ${couple.bride.firstNameEn}` : 'NGOV UYSANG'}
            </p>
          </div>
          <div className="relative shrink-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-rose-400 shadow-[0_4px_12px_rgba(244,63,94,0.3)] p-0.5 bg-gradient-to-tr from-rose-500 via-[#ffd700] to-rose-200">
              <img
                src={couple?.bride?.image || "/images/bride-childhood.webp"}
                alt={couple?.bride?.firstNameEn || 'Uysang'}
                className="w-full h-full object-cover rounded-full"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="absolute -bottom-1 -left-1 w-6 h-6 rounded-full bg-[#12100e] border border-rose-400 flex items-center justify-center text-[10px] text-rose-300 shadow">
              👰
            </div>
          </div>
        </div>
      </div>
      {/* Couple Hero Photo */}
      {/* <div className="w-full max-w-sm mx-auto my-4 rounded-2xl overflow-hidden border-2 border-[#d4af37] shadow-xl relative aspect-[3/4]">
        <img
          src={cover?.heroImage || "/images/a1.webp"}
          alt={`${couple?.groom?.firstNameEn || 'Kimsan'} and ${couple?.bride?.firstNameEn || 'Uysang'}`}
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-0 right-0 text-center text-white px-3">
          <p className="font-moulpali text-2xl sm:text-3xl text-amber-200 flex items-center justify-center gap-1.5 sm:gap-2">
            <span>{couple?.groom?.firstNameEn || 'Kimsan'}</span>
            <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500 fill-rose-500 animate-pulse drop-shadow-[0_2px_8px_rgba(244,63,94,0.7)] shrink-0" />
            <span>{couple?.bride?.firstNameEn || 'Uysang'}</span>
          </p>
          <p className="text-[11px] text-stone-200 flex items-center justify-center gap-1.5 mt-0.5">
            <span>{couple?.groom?.lastNameKm ? `${couple.groom.lastNameKm} ${couple.groom.firstNameKm}` : 'សន គឹមសាន្ត'}</span>
            <Heart className="w-2.5 h-2.5 text-rose-400 fill-rose-400 shrink-0" />
            <span>{couple?.bride?.lastNameKm ? `${couple.bride.lastNameKm} ${couple.bride.firstNameKm}` : 'ង៉ោ អូយសាំង'}</span>
          </p>
        </div>
      </div> */}



      {/* Warm Invitation Statement with Guest Honorific */}
      <div className="my-6 space-y-2">
        <p className="text-xs sm:text-sm text-[#5c493a] leading-relaxed">
          យើងខ្ញុំមានសេចក្តីសោមនស្សរីករាយឥតឧបមា សូមគោរពអញ្ជើញ
        </p>
        <div className="inline-block px-4 py-2 max-w-lg">
          <p className="font-moulpali text-sm sm:text-base md:text-lg text-[#996515] leading-relaxed">
            {guestDisplayName}
          </p>
        </div>
        <p className="text-xs sm:text-sm text-[#5c493a] leading-relaxed pt-1">
          ចូលរួមជាអធិបតី និងជាភ្ញៀវកិត្តិយស ក្នុងពិធីចូលចែចូវកូនប្រុស-កូនស្រីរបស់យើងខ្ញុំ
          ដើម្បីប្រសិទ្ធពរជ័យ សិរីសួស្តី ជ័យមង្គល ដល់គូដណ្តឹងថ្មី។
        </p>
      </div>

      <KhmerDivider className="my-4" />

      {/* Traditional Cambodian Parents Section (មាតាបិតាទាំងសងខាង) */}
      {/* <div className="my-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#8c7355] mb-4">
          {lang === 'km' ? '— មាតាបិតាទាំងសងខាង —' : '— With the Blessings of Our Parents —'}
        </p> 

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
         
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-[#d4af37]/30 shadow-sm space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#b8860b]/15 text-[#b8860b]">
              មាតាបិតាខាងប្រុស / Groom's Parents
            </span>
            <p className="text-xs text-stone-600 pt-1.5">ឪពុក៖ <span className="font-semibold text-stone-800">លោក សន ស៊ីម (San Sim)</span></p>
            <p className="text-xs text-stone-600">ម្តាយ៖ <span className="font-semibold text-stone-800">លោកស្រី តូច សាវី (Toch Savy)</span></p>
            <div className="pt-2 border-t border-amber-200/60">
              <p className="text-xs text-stone-500">កូនប្រុសនាម៖</p>
              <p className="font-moul text-sm text-[#996515]">សន គឹមសាន្ត (Kimsan)</p>
            </div>
          </div>

          
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-[#d4af37]/30 shadow-sm space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#b8860b]/15 text-[#b8860b]">
              មាតាបិតាខាងស្រី / Bride's Parents
            </span>
            <p className="text-xs text-stone-600 pt-1.5">ឪពុក៖ <span className="font-semibold text-stone-800">លោក គង់ សុវណ្ណ</span></p>
            <p className="text-xs text-stone-600">ម្តាយ៖ <span className="font-semibold text-stone-800">លោកស្រី អ៊ុំ សារ៉េត</span></p>
            <div className="pt-2 border-t border-amber-200/60">
              <p className="text-xs text-stone-500">កូនស្រីនាម៖</p>
              <p className="font-moul text-sm text-[#996515]">គង់ ឧស្សាហ៍ (Ussa)</p>
            </div>
          </div>
        </div>
      </div> */}

      {/* Auspicious Ceremony Date & Time */}
      <div className="my-6 p-4 rounded-2xl bg-gradient-to-r from-amber-100/60 via-amber-50 to-amber-100/60 border border-[#d4af37]/50 text-center space-y-1 shadow-sm">
        <p className="mb-4 text-xs uppercase tracking-widest text-[#8c7355] font-semibold">
          {lang === 'km' ? 'កាលបរិច្ឆេទនៃពិធីមង្គល' : 'Auspicious Ceremony Date'}
        </p>
        <p className="font-moulpali text-base sm:text-lg text-[#3d3126]">
          {eventDate?.dateTextKm || eventDate?.displayKm || 'ថ្ងៃអាទិត្យ ទី២២ ខែវិច្ឆិកា ឆ្នាំ២០២៦'}
        </p>
        <p className="text-xs sm:text-sm text-[#78500c] font-medium">
          {eventDate?.dateTextEn || eventDate?.displayEn || 'Sunday, November 22, 2026 • វេលាម៉ោង ០៧:៣០ ព្រឹក'}
        </p>
      </div>

      {/* Live Countdown Timer */}
      <CountdownTimer targetDate={eventDate?.dateTime || "2026-11-22T07:30:00+07:00"} lang={lang} />

      {/* Add to Calendar Button */}
      <div className="flex justify-center mt-3">
        <button
          onClick={onAddToCalendar}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#996515]/60 via-[#d4af37]/75 to-[#ffd700]/90 text-white font-bold text-xs sm:text-sm shadow-md hover:brightness-105 active:scale-95 transition"
        >
          <CalendarPlus className="w-4 h-4 text-white" />
          <span className="font-moulpali">{lang === 'km' ? 'កត់ត្រាក្នុងប្រតិទិន' : 'Add to Calendar'}</span>
        </button>
      </div>
    </div>
  );
}
