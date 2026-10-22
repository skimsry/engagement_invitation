import { useState, useEffect, useRef } from 'react';
import { Heart } from 'lucide-react';
import { KhmerCorner, KhmerDivider, KhmerLotus } from './KhmerOrnaments';

/**
 * InvitationOpening component
 * 1. Plays the majestic Angkor Wat gate opening animation (open.gif) for DURATION_MS = 9800ms.
 * 2. After loading / gate opening finishes, stays on the final frame (open_final_frame.png)
 *    and displays the regal invitation box with the guest's name and ceremony details.
 * 3. Guest can click the button to proceed to the full invitation.
 */
export default function InvitationOpening({ guest, lang = 'km', onComplete }) {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [gifSrc, setGifSrc] = useState('');
  const completedRef = useRef(false);

  // Exact duration of open.gif (150 frames = 10,000ms)
  const DURATION_MS = 9800;

  useEffect(() => {
    // Append timestamp to ensure fresh playback from frame 0
    const timestamp = Date.now();
    setGifSrc(`/images/open.gif?t=${timestamp}`);

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min(100, Math.round((elapsed / DURATION_MS) * 100));
      setProgress(currentProgress);

      if (elapsed >= DURATION_MS) {
        clearInterval(interval);
        setProgress(100);
        setIsFinished(true); // Switch to final frame and show invitation box!
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Quick skip directly to the final frame & invitation name box
  const handleSkipToFinal = () => {
    setProgress(100);
    setIsFinished(true);
  };

  // Exit transition to the full invitation details
  const handleFinish = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    setIsFadingOut(true);

    setTimeout(() => {
      onComplete?.();
    }, 500); // 500ms smooth cross-fade into main invitation
  };

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#12100e] flex items-center justify-center overflow-hidden select-none transition-opacity duration-500 ${isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
    >
      {/* Container maintaining card/portrait frame */}
      <div className="relative w-full h-[100dvh] sm:h-auto sm:max-w-md sm:aspect-[9/16] overflow-hidden sm:rounded-3xl sm:border-2 sm:border-[#d4af37]/60 sm:shadow-[0_25px_60px_rgba(0,0,0,0.9)] flex flex-col justify-between items-center bg-[#14100c]">

        {/* Background Image: open.gif during opening, open_final_frame.png after finished */}
        {isFinished ? (
          <img
            src="/images/open_final_frame.png"
            alt="Angkor Gate Opened"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none animate-fade-in"
          />
        ) : (
          gifSrc && (
            <img
              src={gifSrc}
              alt="Angkor Gate Opening"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
            />
          )
        )}

        {/* Ambient Gradient Overlays for contrast and luxury mood */}
        <div className={`absolute inset-0 pointer-events-none transition-colors duration-700 ${isFinished ? 'bg-gradient-to-t from-black/85 via-black/40 to-black/60' : 'bg-gradient-to-t from-black/80 via-transparent to-black/60'
          }`} />

        {/* Corner Traditional Ornaments for royal aesthetic */}
        <div className="absolute top-3 sm:top-2.5 left-3 sm:left-2.5 pointer-events-none opacity-70 z-20">
          <KhmerCorner className="w-8 h-8 text-[#d4af37]" />
        </div>
        <div className="absolute top-3 sm:top-2.5 right-3 sm:right-2.5 pointer-events-none opacity-70 rotate-90 z-20">
          <KhmerCorner className="w-8 h-8 text-[#d4af37]" />
        </div>
        <div className="absolute bottom-3 sm:bottom-2.5 left-3 sm:left-2.5 pointer-events-none opacity-70 -rotate-90 z-20">
          <KhmerCorner className="w-8 h-8 text-[#d4af37]" />
        </div>
        <div className="absolute bottom-3 sm:bottom-2.5 right-3 sm:right-2.5 pointer-events-none opacity-70 rotate-180 z-20">
          <KhmerCorner className="w-8 h-8 text-[#d4af37]" />
        </div>



        {/* CENTER CONTENT */}
        <div className="relative z-30 w-full flex-1 flex flex-col items-center justify-center px-4 py-3">
          {/* PHASE 2: INVITATION NAME BOX (Appears after DURATION_MS or on Skip) */}
          {isFinished ? (
            <div className="w-full max-w-[340px] sm:max-w-[370px] p-5 sm:p-6 text-center animate-fade-in-up flex flex-col items-center">
              {/* Royal Crown / Rings Emblem */}
              {/* <div className="w-11 h-11 rounded-full bg-black/40 border border-[#d4af37]/60 flex items-center justify-center mb-2 shadow-inner">
                <KhmerLotus className="w-6 h-6 text-[#d4af37]" />
              </div> */}

              {/* Ceremony Header */}
              {/* Ceremony Header */}
              <h2 className="font-moulpali text-xl sm:text-2xl leading-[1.7] py-2.5 min-h-[56px] flex items-center justify-center text-gold-bright drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                {lang === 'km' ? 'សិរីមង្គល ពិធីភ្ជាប់ពាក្យ' : 'Engagement Ceremony'}
              </h2>

              {/* <p className="text-[10px] uppercase tracking-[0.2em] text-[#d4af37]/80 font-serif mt-0.5">
                {lang === 'km' ? 'សន គឹមសាន្ត & គង់ ឧស្សាហ៍' : 'San Kimsan & Kong Ussa'}
              </p> */}
              <p className={`flex items-center justify-center gap-2 text-amber-200 mt-1 ${lang === 'km'
                ? 'font-dangrek text-lg sm:text-xl tracking-wide'
                : 'font-vibes text-2xl sm:text-3xl'
                }`}>
                <span>{lang === 'km' ? 'គឹមសាន្ត' : 'Kimsan'}</span>
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500 fill-rose-500 animate-pulse drop-shadow-[0_2px_8px_rgba(244,63,94,0.65)] shrink-0 mx-1" />
                <span>{lang === 'km' ? 'អ៊ុយស័ង' : 'Uysang'}</span>
              </p>


              <KhmerDivider className="my-2.5 w-full max-w-[240px]" />

              {/* Invitation Statement */}
              <p className="font-kantumruy text-sm text-[#faf5ea]/85">
                {lang === 'km' ? 'សូមគោរពអញ្ជើញ' : 'Cordially Invites'}
              </p>

              {/* BOX NAME OF INVITATION (Highlighted Guest Honorific) */}
              <div className="my-2.5 w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37]/25 via-[#ffd700]/30 to-[#d4af37]/25 border border-[#d4af37]/70 shadow-[inset_0_1px_2px_rgba(255,255,255,0.25),0_4px_15px_rgba(0,0,0,0.6)]">
                <p className="font-dangrek text-sm sm:text-base text-[#ffd700] tracking-normal drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] break-words">
                  {guest?.name}
                </p>
              </div>

              {/* Date & Location Badges */}
              {/* <p className="font-kantumruy text-xs text-[#faf5ea]/90 leading-tight">
                {lang === 'km' ? 'អាទិត្យ ទី១៥ ខែវិច្ឆិកា ឆ្នាំ២០២៦' : 'Sunday, November 15, 2026'}
              </p>
              <p className="font-kantumruy text-[11px] text-[#d4af37] mt-0.5">
                The Premier Centre Sen Sok, Phnom Penh
              </p> */}

              {/* Primary Action Button: Enter Full Invitation */}
              <button
                onClick={handleFinish}
                className="mt-4 relative group cursor-pointer w-full py-2.5 px-5 rounded-full bg-gradient-to-r from-[#996515] via-[#ffd700] to-[#b8860b] text-[#140e08] font-bold shadow-[0_6px_20px_rgba(212,175,55,0.4)] hover:shadow-[0_8px_25px_rgba(212,175,55,0.7)] hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span className="font-dangrek text-xs sm:text-sm text-[#140e08] font-semibold tracking-wide">
                  {lang === 'km' ? 'ចូលទស្សនាសំបុត្រអញ្ជើញ' : 'View Full Invitation'}
                </span>
                <svg
                  className="w-4 h-4 text-[#140e08] transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          ) : ""}
        </div>



      </div>
    </div>
  );
}
