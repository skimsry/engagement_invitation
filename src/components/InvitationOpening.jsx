import { useState, useEffect, useRef } from 'react';
import { Heart } from 'lucide-react';
import { KhmerCorner, KhmerDivider } from './KhmerOrnaments';

/**
 * InvitationOpening component
 * 1. Plays the majestic Angkor Wat gate opening animation (open.mp4) for DURATION_MS = 9800ms.
 * 2. After loading / gate opening finishes, stays on the final frame (open_final_frame.webp)
 *    and displays the regal invitation box with the guest's name and ceremony details.
 * 3. Guest can click the button to proceed to the full invitation, or skip directly.
 */
export default function InvitationOpening({ guest, lang = 'km', onComplete, onHideHeader }) {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const videoRef = useRef(null);
  const completedRef = useRef(false);

  // Exact duration of open animation
  const DURATION_MS = 9800;

  useEffect(() => {
    // Hide Header during gate opening animation
    onHideHeader?.(true);
    document.body.classList.add('hide-header-nav');

    const timer = setTimeout(() => {
      setIsFinished(true); // Switch to final frame and show invitation box!
      onHideHeader?.(false);
      document.body.classList.remove('hide-header-nav');
    }, DURATION_MS);

    return () => {
      clearTimeout(timer);
      onHideHeader?.(false);
      document.body.classList.remove('hide-header-nav');
    };
  }, [onHideHeader]);

  // Quick skip directly to the final frame & invitation name box
  const handleSkipToFinal = () => {
    setIsFinished(true);
    onHideHeader?.(false);
    document.body.classList.remove('hide-header-nav');
  };

  // Exit transition to the full invitation details
  const handleFinish = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    onHideHeader?.(false);
    document.body.classList.remove('hide-header-nav');
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

        {/* Background Image/Video: open.mp4 during opening, open_final_frame.webp after finished */}
        {isFinished ? (
          <picture className="absolute inset-0 w-full h-full pointer-events-none select-none animate-fade-in">
            <source srcSet="/images/open_final_frame.webp" type="image/webp" />
            <img
              src="/images/open_final_frame.png"
              alt="Angkor Gate Opened"
              className="w-full h-full object-cover"
            />
          </picture>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            webkit-playsinline="true"
            poster="/images/open-poster.webp"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
            onEnded={() => {
              setProgress(100);
              setIsFinished(true);
            }}
          >
            <source src="/images/open.mp4" type="video/mp4" />
            <source src="/images/open.webp" type="image/webp" />
            <img
              src="/images/open_final_frame.webp"
              alt="Angkor Gate Opening"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
            />
          </video>
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

        {/* Quick Skip button during opening animation */}
        {!isFinished && (
          <button
            onClick={handleSkipToFinal}
            aria-label="Skip animation"
            className="absolute top-4 right-4 z-40 px-3 py-1 rounded-full bg-black/60 hover:bg-black/80 border border-[#d4af37]/60 text-[#ffd700] text-xs font-semibold cursor-pointer active:scale-95 transition backdrop-blur-md shadow-lg"
          >
            {lang === 'km' ? 'រំលង ➔' : 'Skip ➔'}
          </button>
        )}



        {/* CENTER CONTENT */}
        <div className="relative z-30 w-full flex-1 flex flex-col items-center justify-center px-4 py-3 pb-24 sm:pb-20">
          {/* PHASE 2: INVITATION NAME BOX (Appears after DURATION_MS or on Skip) */}
          {isFinished ? (
            <div className="w-full max-w-[340px] sm:max-w-[370px] p-4 sm:p-6 text-center animate-fade-in-up flex flex-col items-center">
              {/* Ceremony Header */}
              <h2 className="font-moulpali text-xl sm:text-2xl leading-[1.7] py-2 min-h-[52px] flex items-center justify-center text-gold-bright drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                {lang === 'km' ? 'សិរីមង្គល ពិធីភ្ជាប់ពាក្យ' : 'Engagement Ceremony'}
              </h2>

              <p className={`flex items-center justify-center gap-2 text-amber-200 mt-0.5 ${lang === 'km'
                ? 'font-dangrek text-lg sm:text-xl tracking-wide'
                : 'font-vibes text-2xl sm:text-3xl'
                }`}>
                <span>{lang === 'km' ? 'គឹមសាន្ត' : 'Kimsan'}</span>
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500 fill-rose-500 animate-pulse drop-shadow-[0_2px_8px_rgba(244,63,94,0.65)] shrink-0 mx-1" />
                <span>{lang === 'km' ? 'អ៊ុយស័ង' : 'Uysang'}</span>
              </p>

              <KhmerDivider className="my-2 w-full max-w-[240px]" />

              {/* Invitation Statement */}
              <p className="font-kantumruy text-sm text-[#faf5ea]/85">
                {lang === 'km' ? 'សូមគោរពអញ្ជើញ' : 'Cordially Invites'}
              </p>

              {/* BOX NAME OF INVITATION (Highlighted Guest Honorific with Portrait Plaque) */}
              <div
                className="my-1.5 w-full max-w-[320px] sm:max-w-[350px] aspect-[596/419] bg-contain bg-center bg-no-repeat relative drop-shadow-[0_6px_20px_rgba(0,0,0,0.8)] select-none"
                style={{ backgroundImage: "url('/images/wedding-portrait-plaque.webp')" }}
              >
                {/* Guest name positioned inside the right-hand rectangular frame */}
                <div
                  className="absolute flex items-center justify-center px-2 sm:px-3 text-center"
                  style={{
                    left: '40.5%',
                    top: '31%',
                    width: '53%',
                    height: '26%',
                  }}
                >
                  <p className="font-dangrek text-xs sm:text-sm font-bold tracking-normal drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] break-words text-center bg-gradient-to-b from-[#fff59d] via-[#ffd700] to-[#ca8a04] bg-clip-text text-transparent line-clamp-2">
                    {guest?.name}
                  </p>
                </div>
              </div>
            </div>
          ) : ""}
        </div>

        {/* PRIMARY ACTION BUTTON (Positioned identically to 'បើកធៀប' button in InvitationCover) */}
        {isFinished && (
          <div className="absolute bottom-16 sm:bottom-14 left-0 right-0 flex flex-col items-center justify-center px-4 z-30 animate-fade-in-up">
            <button
              onClick={handleFinish}
              aria-label="View Full Invitation"
              className="relative group cursor-pointer w-[240px] sm:w-[270px] max-w-[75vw] py-2.5 sm:py-3 px-5 rounded-full bg-gradient-to-r from-[#996515] via-[#ffd700] to-[#b8860b] text-[#140e08] font-bold shadow-[0_8px_25px_rgba(212,175,55,0.45)] hover:shadow-[0_12px_32px_rgba(212,175,55,0.75)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span className="font-dangrek text-xs sm:text-sm text-[#140e08] font-semibold tracking-wide animate-bounce">
                {lang === 'km' ? 'សូមចូលទស្សនាសំបុត្រអញ្ជើញ' : 'View Full Invitation'}
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
        )}



      </div>
    </div>
  );
}
