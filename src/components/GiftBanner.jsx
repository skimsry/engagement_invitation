import { Gift } from 'lucide-react';

export default function GiftBanner({ lang, onOpenGiftModal }) {
  return (
    <div className="w-full rounded-none sm:rounded-3xl bg-[#faf7f2] border-y sm:border-2 border-[#d4af37]/50 shadow-2xl p-6 sm:p-8 text-center text-[#3d3126] relative overflow-hidden">
      <div className="mb-8 w-12 h-12 mx-auto rounded-full bg-gradient-to-tr from-[#9A702E] via-[#C8973E] to-[#6B4714] flex items-center justify-center mb-3 shadow-md border-2 border-amber-100">
        <Gift className="w-8 h-8 text-white" />
      </div>

      <h3 className="mb-2 font-moulpali text-xl sm:text-2xl text-[#3d3126]">
        {lang === 'km' ? 'ចំណងដៃឌីជីថល' : 'Digital Angpao'}
      </h3>
      <p className="text-xs sm:text-sm text-[#5c493a] max-w-sm mx-auto mb-5 leading-relaxed">
        {lang === 'km'
          ? 'វត្តមានរបស់លោកអ្នកជាកិត្តិយសដ៏ធំធេងបំផុត។ លោកអ្នកក៏អាចផ្ញើពាក្យជូនពរ និងទឹកប្រាក់ចងដៃតាម KHQR ផងដែរ។'
          : 'Your presence is our greatest honor. You may also send your blessings and digital Angpao via KHQR.'}
      </p>

      <button
        onClick={onOpenGiftModal}
        className="px-6 py-3 rounded-full bg-gradient-to-r from-[#996515]/60 via-[#d4af37]/75 to-[#ffd700]/90 text-white font-bold text-xs sm:text-sm shadow-md hover:brightness-105 active:scale-95 transition flex items-center gap-2 mx-auto"
      >
        <Gift className="w-4 h-4" />
        <span>{lang === 'km' ? 'ស្កេន KHQR' : 'Scan KHQR'}</span>
      </button>
    </div>
  );
}
