import { useState, useEffect } from 'react';
import { X, Copy, Check, QrCode } from 'lucide-react';
import { KhmerLotus, KhmerCorner, KhmerDivider } from './KhmerOrnaments';
import { getStoredWeddingConfig } from '../utils/weddingConfig';

export default function GiftAngpaoModal({ isOpen, onClose, lang = "km", angpao: customAngpao }) {
  const [copied, setCopied] = useState(false);
  const [angpao, setAngpao] = useState(() => customAngpao || getStoredWeddingConfig().angpao);

  useEffect(() => {
    if (customAngpao) {
      setAngpao(customAngpao);
    }
  }, [customAngpao]);

  useEffect(() => {
    const handleUpdate = (e) => {
      if (e.detail?.angpao) {
        setAngpao(e.detail.angpao);
      }
    };
    window.addEventListener('wedding_config_updated', handleUpdate);
    return () => window.removeEventListener('wedding_config_updated', handleUpdate);
  }, []);

  const accountNumber = angpao?.accountNumber || "001 234 567";
  const accountName = angpao?.accountName || "SORN KIMSAN";
  const bankName = angpao?.bankName || "ABA Bank (KHQR)";
  const qrCodeImage = angpao?.qrCodeImage || "";

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(accountNumber.replace(/\s+/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const content = {
    km: {
      title: 'ចំណងដៃឌីជីថល',
      subtitle: 'វត្តមានរបស់អស់លោកអ្នក ជាកិត្តិយសដ៏ធំធេងបំផុតសម្រាប់យើងខ្ញុំ។ ប្រសិនបើលោកអ្នកមានបំណងចងដៃ ឬជូនពរជាទឹកប្រាក់ សូមប្រើប្រាស់ KHQR ខាងក្រោម៖',
      scanLabel: 'ស្កេនទូទាត់តាម KHQR គ្រប់ធនាគារ',
      accName: 'ឈ្មោះគណនី',
      accNum: 'លេខគណនី ABA',
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-3xl bg-[#faf7f2] border-2 border-[#d4af37]/60 shadow-[0_20px_50px_rgba(0,0,0,0.35)] p-6 relative overflow-hidden text-center text-[#3d3126]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Corner Traditional Ornaments matching HeroSection */}
        <div className="absolute top-2 left-2 pointer-events-none opacity-40 z-10">
          <KhmerCorner className="w-16 h-16 text-[#b8860b]" />
        </div>
        <div className="absolute top-2 right-2 pointer-events-none opacity-40 rotate-90 z-10">
          <KhmerCorner className="w-16 h-16 text-[#b8860b]" />
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label={content.close}
          className="absolute top-3.5 right-3.5 z-20 p-2 rounded-full bg-stone-200/70 hover:bg-stone-300/80 text-stone-600 hover:text-stone-900 active:scale-95 transition shadow-sm"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Medallion Logo */}
        {/* <div className="flex justify-center mb-3 mt-1">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#9A702E] via-[#C8973E] to-[#6B4714] flex items-center justify-center shadow-md border-2 border-amber-100">
            <KhmerLotus className="w-8 h-8" />
          </div>
        </div> */}

        {/* Title */}
        <h3 className="mt-8 font-moulpali text-lg sm:text-xl text-[#78500c] mb-1.5">
          {content.title}
        </h3>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-[#5c493a] mb-4 leading-relaxed px-1">
          {content.subtitle}
        </p>

        {/* Realistic KHQR Code Card */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-md border border-[#d4af37]/40 text-stone-800 my-2 relative">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-200">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-[#d32f2f] text-white">
                KHQR
              </span>
              {/* <span className="text-xs font-semibold text-stone-700">{bankName}</span> */}
            </div>
            <QrCode className="w-4 h-4 text-stone-400" />
          </div>

          {/* QR Code Graphic (SVG High-Res Representation or Custom Image) */}
          <div className="w-44 h-44 sm:w-48 sm:h-48 mx-auto bg-stone-50 border border-stone-200 rounded-xl p-2.5 flex flex-col items-center justify-center shadow-inner relative group overflow-hidden">
            {qrCodeImage ? (
              <img
                src={qrCodeImage}
                alt="Angpao QR Code"
                className="w-full h-full object-contain rounded-lg"
              />
            ) : (
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
            )}
            <div className="absolute inset-0 bg-amber-500/0 hover:bg-amber-500/10 rounded-xl transition cursor-pointer flex items-center justify-center">
              <span className="text-[10px] bg-black/75 text-amber-200 px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition shadow">
                KHQR Scan
              </span>
            </div>
          </div>

          {/* Account Details */}
          <div className="mt-3.5 pt-3 border-t border-stone-200 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#8c7355]">{content.accName}:</span>
              <span className="text-sm font-bold text-[#3d3126] tracking-wider">{accountName}</span>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-[#8c7355]">{content.accNum}:</span>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-mono font-bold text-[#b8860b]">{accountNumber}</span>
                <button
                  onClick={handleCopy}
                  className="p-1 rounded-md bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-300 active:scale-95 transition"
                  title={content.copy}
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className={`w-full py-3 px-4 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 shadow-md mt-3 active:scale-98 ${copied
            ? 'bg-emerald-600 text-white font-bold'
            : 'hover:brightness-105 bg-gradient-to-r from-[#996515]/60 via-[#d4af37]/75 to-[#ffd700]/90 text-white font-bold hover:brightness-105 shadow-amber-500/20'
            }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              <span>{content.copied}</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>{content.copy}</span>
            </>
          )}
        </button>

        {/* Traditional Divider */}
        <KhmerDivider className="my-3 opacity-60" />

        {/* Blessing Statement */}
        <p className="text-[11px] sm:text-xs text-[#78500c] leading-relaxed italic px-1 font-light">
          {content.blessing}
        </p>
      </div>
    </div>
  );
}
