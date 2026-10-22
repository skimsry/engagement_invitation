import { Gift } from 'lucide-react';

export default function GiftBanner({ lang, onOpenGiftModal }) {
  return (
    <div className="w-full rounded-none sm:rounded-3xl bg-gradient-to-r from-[#2c1712] via-[#3a1d17] to-[#2c1712] border-y sm:border-2 border-[#d4af37]/70 shadow-2xl p-6 sm:p-8 text-center text-white relative overflow-hidden">
      <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center mb-3 shadow-lg border border-amber-200/50">
        <Gift className="w-6 h-6 text-amber-950" />
      </div>

      <h3 className="font-moul text-lg sm:text-xl text-[#ffd700] mb-1">
        {lang === 'km' ? 'ស្រោមសំបុត្រ ឬ ទឹកប្រាក់ចងដៃ' : 'Digital Wedding Gift & Angpao'}
      </h3>
      <p className="text-xs text-amber-100/80 max-w-sm mx-auto mb-4 leading-relaxed">
        {lang === 'km'
          ? 'វត្តមានរបស់លោកអ្នកជាកិត្តិយសដ៏ធំធេងបំផុត។ លោកអ្នកក៏អាចផ្ញើពាក្យជូនពរ និងទឹកប្រាក់ចងដៃតាម KHQR ផងដែរ។'
          : 'Your presence is our greatest honor. You may also send your blessings and digital Angpao via KHQR.'}
      </p>

      <button
        onClick={onOpenGiftModal}
        className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-amber-950 font-bold text-xs sm:text-sm shadow-xl hover:brightness-110 active:scale-95 transition flex items-center gap-2 mx-auto"
      >
        <Gift className="w-4 h-4" />
        <span>{lang === 'km' ? 'ស្កេន KHQR / ABA Pay' : 'Scan KHQR / ABA Pay'}</span>
      </button>
    </div>
  );
}
