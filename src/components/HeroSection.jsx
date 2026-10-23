import { CalendarPlus } from 'lucide-react';
import { KhmerCorner, KhmerDivider } from './KhmerOrnaments';
import CountdownTimer from './CountdownTimer';

export default function HeroSection({ guest, lang, onAddToCalendar }) {
  return (
    <div className="w-full rounded-none sm:rounded-3xl bg-[#faf7f2] border-y sm:border-2 border-[#d4af37]/50 shadow-2xl p-5 sm:p-8 relative overflow-hidden text-center text-[#3d3126]">
      {/* Corner Traditional Ornaments */}
      <div className="absolute top-2 left-2 pointer-events-none opacity-40">
        <KhmerCorner className="w-9 h-9 text-[#b8860b]" />
      </div>
      <div className="absolute top-2 right-2 pointer-events-none opacity-40 rotate-90">
        <KhmerCorner className="w-9 h-9 text-[#b8860b]" />
      </div>

      {/* Khmer Blessing Header */}
      <p className="font-moul text-base sm:text-xl text-[#b8860b] mb-1">
        សិរីសួស្តី ជ័យមង្គល វិបុលសុខ
      </p>
      <p className="font-moul text-sm sm:text-base text-[#78500c]">
        ពិធីភ្ជាប់ពាក្យ
      </p>
      <p className="text-xs uppercase tracking-[0.2em] text-[#8c7355] mt-1 font-serif">
        The Engagement Ceremony of
      </p>

      <KhmerDivider className="my-3" />

      {/* Couple Hero Photo */}
      <div className="w-full max-w-sm mx-auto my-4 rounded-2xl overflow-hidden border-2 border-[#d4af37] shadow-xl relative aspect-[3/4]">
        <picture>
          <source srcSet="/images/couple-traditional.webp" type="image/webp" />
          <img
            src="/images/couple-traditional.jpg"
            alt="San Kimsan and Kong Ussa"
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-0 right-0 text-center text-white px-3">
          <p className="font-vibes text-2xl sm:text-3xl text-amber-200">Kimsan &amp; Ussa</p>
          <p className="text-[11px] text-stone-200">សន គឹមសាន្ត &amp; គង់ ឧស្សាហ៍</p>
        </div>
      </div>

      {/* Warm Invitation Statement with Guest Honorific */}
      <div className="my-6 space-y-2">
        <p className="text-xs sm:text-sm text-[#5c493a] leading-relaxed">
          យើងខ្ញុំមានសេចក្តីសោមនស្សរីករាយឥតឧបមា សូមគោរពអញ្ជើញ
        </p>
        <div className="inline-block px-5 py-2.5 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/40 shadow-sm">
          <p className="font-moul text-base sm:text-lg text-[#996515]">
            {guest.name}
          </p>
        </div>
        <p className="text-xs sm:text-sm text-[#5c493a] leading-relaxed pt-1">
          ចូលរួមជាអធិបតី និងជាភ្ញៀវកិត្តិយស ក្នុងពិធីភ្ជាប់ពាក្យកូនប្រុស-កូនស្រីរបស់យើងខ្ញុំ
          ដើម្បីប្រសិទ្ធពរជ័យ សិរីសួស្តី ជ័យមង្គល ដល់គូដណ្តឹងថ្មី។
        </p>
      </div>

      <KhmerDivider className="my-4" />

      {/* Traditional Cambodian Parents Section (មាតាបិតាទាំងសងខាង) */}
      <div className="my-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#8c7355] mb-4">
          {lang === 'km' ? '— មាតាបិតាទាំងសងខាង —' : '— With the Blessings of Our Parents —'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          {/* Groom's Family */}
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

          {/* Bride's Family */}
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
      </div>

      {/* Auspicious Ceremony Date & Time */}
      <div className="my-6 p-4 rounded-2xl bg-gradient-to-r from-amber-100/60 via-amber-50 to-amber-100/60 border border-[#d4af37]/50 text-center space-y-1 shadow-sm">
        <p className="text-xs uppercase tracking-widest text-[#8c7355] font-semibold">
          {lang === 'km' ? 'កាលបរិច្ឆេទនៃពិធីមង្គល' : 'Auspicious Ceremony Date'}
        </p>
        <p className="font-moul text-base sm:text-lg text-[#3d3126]">
          ថ្ងៃអាទិត្យ ទី១៥ ខែវិច្ឆិកា ឆ្នាំ២០២៦
        </p>
        <p className="text-xs sm:text-sm text-[#78500c] font-medium">
          Sunday, November 15, 2026 • វេលាម៉ោង ០៧:៣០ ព្រឹក
        </p>
      </div>

      {/* Live Countdown Timer */}
      <CountdownTimer lang={lang} />

      {/* Add to Calendar Button */}
      <div className="flex justify-center mt-3">
        <button
          onClick={onAddToCalendar}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-900 text-[#ffd700] hover:bg-stone-800 text-xs font-semibold border border-[#d4af37]/40 shadow transition active:scale-95"
        >
          <CalendarPlus className="w-4 h-4 text-amber-400" />
          <span>{lang === 'km' ? 'កត់ត្រាក្នុងប្រតិទិន (Add to Calendar)' : 'Add to Calendar'}</span>
        </button>
      </div>
    </div>
  );
}
