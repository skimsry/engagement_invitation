import { KhmerLotus } from './KhmerOrnaments';

export default function Footer({ lang = 'km' }) {
  return (
    <footer className="w-full text-center py-8 px-4 rounded-2xl sm:rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.6)] space-y-2.5">
      <KhmerLotus className="w-14 h-14 sm:w-16 sm:h-16 text-[#d4af37] mx-auto opacity-80 drop-shadow-[0_2px_8px_rgba(212,175,55,0.4)]" />

      <p className={`text-xs sm:text-sm text-amber-200/90 leading-relaxed drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] ${lang === 'km' ? 'font-moulpali' : 'font-serif italic'
        }`}>
        {lang === 'km'
          ? 'សូមថ្លែងអំណរគុណយ៉ាងជ្រាលជ្រៅចំពោះវត្តមានដ៏ឧត្តុង្គឧត្តម'
          : 'Thank you sincerely for gracing us with your esteemed presence'}
      </p>

      <p className={`text-stone-400 ${lang === 'km'
        ? 'font-dangrek text-sm sm:text-base tracking-wide text-amber-100/70'
        : 'font-serif text-[15px] sm:text-[16px] tracking-wider'
        }`}>
        {lang === 'km' ? 'ពិធីភ្ជាប់ពាក្យ គឹមសាន្ត & អ៊ុយស័ង' : 'Kimsan & Uysang Engagement'}
      </p>
    </footer>
  );
}
