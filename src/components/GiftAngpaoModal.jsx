import { useState } from 'react';
import { X, Copy, Check, Heart, QrCode } from 'lucide-react';
import { KhmerLotus } from './KhmerOrnaments';

export default function GiftAngpaoModal({ isOpen, onClose, lang = "km" }) {
  const [copied, setCopied] = useState(false);
  const accountNumber = "001 234 567";
  const accountName = "SAN KIMSAN";
  const bankName = "ABA Bank (KHQR)";

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(accountNumber.replace(/\s+/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const content = {
    km: {
      title: 'ស្រោមសំបុត្រ ឬ ទឹកប្រាក់ចងដៃ',
      subtitle: 'វត្តមានរបស់អស់លោកអ្នក ជាកិត្តិយសដ៏ធំធេងបំផុតសម្រាប់យើងខ្ញុំ។ ប្រសិនបើលោកអ្នកមានបំណងចងដៃ ឬជូនពរជាទឹកប្រាក់ សូមប្រើប្រាស់ KHQR ខាងក្រោម៖',
      scanLabel: 'ស្កេនទូទាត់តាម KHQR គ្រប់ធនាគារ',
      accName: 'ឈ្មោះគណនី',
      accNum: 'លេខគណនី',
      copy: 'ចម្លងលេខគណនី',
      copied: 'បានចម្លងរួចរាល់!',
      close: 'បិទ',
      blessing: 'សូមថ្លែងអំណរគុណយ៉ាងជ្រាលជ្រៅ និងសូមជូនពរឱ្យទទួលបាននូវពុទ្ធពរទាំងបួនប្រការ៖ អាយុ វណ្ណៈ សុខៈ ពលៈ'
    },
    en: {
      title: 'Wedding Gift / Angpao',
      subtitle: 'Your presence is the greatest gift of all. If you wish to honor us with a monetary gift, you may use the KHQR below:',
      scanLabel: 'Scan via KHQR with Any Cambodian Bank App',
      accName: 'Account Name',
      accNum: 'Account Number',
      copy: 'Copy Account Number',
      copied: 'Copied to Clipboard!',
      close: 'Close',
      blessing: 'Thank you wholeheartedly for your generous blessings and warm love.'
    }
  }[lang];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="w-full max-w-sm rounded-3xl bg-gradient-to-b from-[#2a1714] via-[#1a0f0d] to-[#120a09] border-2 border-[#d4af37]/60 shadow-2xl p-6 relative overflow-hidden text-center text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Golden Corner Glows */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex justify-center mb-3">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center shadow-lg border border-amber-200/50">
            <KhmerLotus className="w-8 h-8 text-amber-950" />
          </div>
        </div>

        <h3 className="font-moul text-lg text-[#ffd700] tracking-wide mb-1">
          {content.title}
        </h3>
        <p className="text-xs text-amber-100/80 mb-5 leading-relaxed px-2">
          {content.subtitle}
        </p>

        {/* Realistic KHQR Code Card */}
        <div className="bg-white rounded-2xl p-5 shadow-2xl border-2 border-amber-400/40 text-stone-800 my-2 relative">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-200">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-[#d32f2f] text-white">
                KHQR
              </span>
              <span className="text-xs font-semibold text-stone-700">{bankName}</span>
            </div>
            <QrCode className="w-4 h-4 text-stone-400" />
          </div>

          {/* QR Code Graphic (SVG High-Res Representation) */}
          <div className="w-48 h-48 mx-auto bg-stone-50 border border-stone-200 rounded-xl p-2.5 flex flex-col items-center justify-center shadow-inner relative group">
            {/* Cambodian KHQR stylized QR code */}
            <svg viewBox="0 0 100 100" className="w-full h-full text-stone-900" fill="currentColor">
              {/* Corner position markers */}
              <rect x="5" y="5" width="28" height="28" rx="4" fill="currentColor" />
              <rect x="9" y="9" width="20" height="20" rx="2" fill="white" />
              <rect x="13" y="13" width="12" height="12" rx="1" fill="currentColor" />

              <rect x="67" y="5" width="28" height="28" rx="4" fill="currentColor" />
              <rect x="71" y="9" width="20" height="20" rx="2" fill="white" />
              <rect x="75" y="13" width="12" height="12" rx="1" fill="currentColor" />

              <rect x="5" y="67" width="28" height="28" rx="4" fill="currentColor" />
              <rect x="9" y="71" width="20" height="20" rx="2" fill="white" />
              <rect x="13" y="75" width="12" height="12" rx="1" fill="currentColor" />

              {/* Data modules pattern */}
              <rect x="38" y="10" width="8" height="8" fill="currentColor" />
              <rect x="50" y="15" width="8" height="8" fill="currentColor" />
              <rect x="42" y="28" width="6" height="12" fill="currentColor" />
              <rect x="10" y="42" width="10" height="6" fill="currentColor" />
              <rect x="25" y="40" width="8" height="8" fill="currentColor" />
              <rect x="68" y="40" width="10" height="8" fill="currentColor" />
              <rect x="82" y="45" width="8" height="14" fill="currentColor" />
              <rect x="38" y="55" width="12" height="8" fill="currentColor" />
              <rect x="55" y="50" width="8" height="12" fill="currentColor" />
              <rect x="40" y="70" width="8" height="8" fill="currentColor" />
              <rect x="55" y="72" width="14" height="6" fill="currentColor" />
              <rect x="75" y="70" width="16" height="16" fill="currentColor" />

              {/* Center Emblem */}
              <circle cx="50" cy="50" r="11" fill="white" stroke="#d4af37" strokeWidth="2" />
              <circle cx="50" cy="50" r="6" fill="#d32f2f" />
            </svg>
            <div className="absolute inset-0 bg-amber-500/0 hover:bg-amber-500/10 rounded-xl transition cursor-pointer flex items-center justify-center">
              <span className="text-[10px] bg-black/75 text-amber-200 px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition shadow">
                KHQR Scan
              </span>
            </div>
          </div>

          {/* Account Details */}
          <div className="mt-4 pt-3 border-t border-stone-200 space-y-1">
            <p className="text-xs text-stone-500">{content.accName}:</p>
            <p className="text-sm font-bold text-stone-900 tracking-wider">{accountName}</p>
            
            <p className="text-xs text-stone-500 pt-1">{content.accNum}:</p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-base font-mono font-bold text-[#b8860b]">{accountNumber}</span>
              <button
                onClick={handleCopy}
                className="p-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 active:scale-95 transition"
                title={content.copy}
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className={`w-full py-3 px-4 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 shadow-lg mt-3 ${
            copied 
              ? 'bg-emerald-600 text-white' 
              : 'bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-amber-950 font-semibold hover:brightness-110 active:scale-98'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              {content.copied}
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              {content.copy}
            </>
          )}
        </button>

        <p className="text-[11px] text-amber-200/70 italic mt-4 leading-relaxed">
          {content.blessing}
        </p>
      </div>
    </div>
  );
}
