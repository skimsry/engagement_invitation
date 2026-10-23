import { useState, useEffect, useRef } from 'react';
import { Heart, ChevronsRight, Check } from 'lucide-react';
import { KhmerCorner, KhmerDivider } from './KhmerOrnaments';

/**
 * Interactive Slide to Unlock / Enter Button
 * Supports fluid touch dragging on mobile & mouse drag on desktop,
 * with golden shimmer animations and haptic feedback.
 */
function SlideButton({ onSlideComplete, lang = 'km', className = '' }) {
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const trackRef = useRef(null);
  const startXRef = useRef(0);
  const isDraggingRef = useRef(false);
  const currentDragXRef = useRef(0);

  const getMaxDistance = () => {
    if (!trackRef.current) return 180;
    const trackWidth = trackRef.current.clientWidth;
    const thumbWidth = typeof window !== 'undefined' && window.innerWidth >= 640 ? 48 : 44;
    return Math.max(0, trackWidth - thumbWidth - 8);
  };

  const handleDragStart = (clientX) => {
    if (isCompleted) return;
    startXRef.current = clientX - currentDragXRef.current;
    isDraggingRef.current = true;
    setIsDragging(true);
  };

  const handleDragMove = (clientX) => {
    if (!isDraggingRef.current || isCompleted) return;
    const maxDist = getMaxDistance();
    const newX = Math.min(Math.max(0, clientX - startXRef.current), maxDist);
    currentDragXRef.current = newX;
    setDragX(newX);
  };

  const handleDragEnd = () => {
    if (!isDraggingRef.current || isCompleted) return;
    isDraggingRef.current = false;
    setIsDragging(false);
    const maxDist = getMaxDistance();

    if (currentDragXRef.current >= maxDist * 0.65) {
      currentDragXRef.current = maxDist;
      setDragX(maxDist);
      setIsCompleted(true);
      try {
        navigator.vibrate?.([40, 30, 60]);
      } catch {
        // ignore
      }
      setTimeout(() => {
        onSlideComplete?.();
      }, 280);
    } else {
      currentDragXRef.current = 0;
      setDragX(0);
    }
  };

  const onTouchStart = (e) => handleDragStart(e.touches[0].clientX);
  const onTouchMove = (e) => handleDragMove(e.touches[0].clientX);
  const onTouchEnd = () => handleDragEnd();

  const onMouseDown = (e) => {
    handleDragStart(e.clientX);
    const onWindowMouseMove = (ev) => handleDragMove(ev.clientX);
    const onWindowMouseUp = () => {
      handleDragEnd();
      window.removeEventListener('mousemove', onWindowMouseMove);
      window.removeEventListener('mouseup', onWindowMouseUp);
    };
    window.addEventListener('mousemove', onWindowMouseMove);
    window.addEventListener('mouseup', onWindowMouseUp);
  };

  const handleClickFallback = () => {
    if (isCompleted || isDragging) return;
    const maxDist = getMaxDistance();
    currentDragXRef.current = maxDist;
    setDragX(maxDist);
    setIsCompleted(true);
    try {
      navigator.vibrate?.([40, 30, 60]);
    } catch {
      // ignore
    }
    setTimeout(() => {
      onSlideComplete?.();
    }, 320);
  };

  const maxDist = getMaxDistance();
  const progressRatio = maxDist > 0 ? Math.min(1, dragX / maxDist) : 0;

  return (
    <div
      ref={trackRef}
      onClick={handleClickFallback}
      className={`relative w-full max-w-[280px] sm:max-w-[320px] h-[52px] sm:h-[56px] rounded-full bg-[#16110a]/90 border border-[#d4af37]/70 shadow-[0_8px_25px_rgba(0,0,0,0.8),inset_0_2px_4px_rgba(212,175,55,0.25)] backdrop-blur-md p-1 flex items-center select-none overflow-hidden cursor-pointer group ${className}`}
      style={{ touchAction: 'none' }}
    >
      {/* Golden progress fill bar behind thumb */}
      <div
        className="absolute left-1 top-1 bottom-1 rounded-full bg-gradient-to-r from-[#996515]/60 via-[#d4af37]/75 to-[#ffd700]/90 pointer-events-none"
        style={{
          width: `${dragX + (typeof window !== 'undefined' && window.innerWidth >= 640 ? 48 : 44)}px`,
          transition: isDragging ? 'none' : 'width 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
        }}
      />

      {/* Guide text & chevrons (fades out as thumb slides across) */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-150 pl-12 pr-4 sm:pl-14 sm:pr-6"
        style={{ opacity: Math.max(0, 1 - progressRatio * 1.5) }}
      >
        <span className="font-moulpali text-[11px] sm:text-[13px] font-semibold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#ffd700] via-[#fff3b0] to-[#ca8a04] drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] whitespace-nowrap flex items-center gap-1">
          <span>{lang === 'km' ? 'សូមអូសចូលទស្សនាបន្ត' : 'Slide to View Invitation'}</span>
          <ChevronsRight className="w-3.5 h-3.5 text-[#ffd700] animate-pulse inline-block" />
        </span>
      </div>

      {/* Draggable slider thumb */}
      <div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
        onMouseDown={onMouseDown}
        style={{
          transform: `translateX(${dragX}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
          touchAction: 'none',
        }}
        className="relative z-10 w-[44px] h-[44px] sm:w-[48px] sm:h-[48px] rounded-full bg-gradient-to-tr from-[#996515] via-[#ffd700] to-[#fff3b0] text-[#140e08] flex items-center justify-center shadow-[0_4px_16px_rgba(212,175,55,0.7)] cursor-grab active:cursor-grabbing hover:scale-105 transition-transform shrink-0"
        aria-label="Slide to view invitation"
      >
        {isCompleted ? (
          <Check className="w-5 h-5 text-[#140e08] stroke-[3] animate-scale-in" />
        ) : (
          <ChevronsRight className="w-5 h-5 text-[#140e08] stroke-[2.5] animate-pulse" />
        )}
      </div>
    </div>
  );
}

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

  // Exit transition directly to the full invitation details (skipping cover)
  const handleFinish = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    onHideHeader?.(false);
    document.body.classList.remove('hide-header-nav');
    onComplete?.();
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
        {/* <div className="absolute top-3 sm:top-2.5 left-3 sm:left-2.5 pointer-events-none opacity-70 z-20">
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
        </div> */}

        {/* Quick Skip button during opening animation */}
        {/* {!isFinished && (
              <button
                onClick={handleSkipToFinal}
                aria-label="Skip animation"
                className="absolute top-4 right-4 z-40 px-3 py-1 rounded-full bg-black/60 hover:bg-black/80 border border-[#d4af37]/60 text-[#ffd700] text-xs font-semibold cursor-pointer active:scale-95 transition backdrop-blur-md shadow-lg"
              >
                {lang === 'km' ? 'រំលង ➔' : 'Skip ➔'}
              </button>
            )} */}



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

              {/* Date & Location Badges */}
              {/* <p className="font-kantumruy text-xs text-[#faf5ea]/90 leading-tight">
                {lang === 'km' ? 'សៅរ៍ ទី២៨ ខែវិច្ឆិកា ឆ្នាំ២០២៦' : 'Saturday, November 28, 2026'}
              </p>
              <p className="font-kantumruy text-[11px] text-[#d4af37] mt-0.5">
                The Premier Centre Sen Sok, Phnom Penh
              </p> */}

              {/* Primary Action: Slide to View Full Invitation */}
              <SlideButton
                onSlideComplete={handleFinish}
                lang={lang}
                className="mt-48 min-[380px]:mt-28 sm:mt-36"
              />
            </div>
          ) : ""}
        </div>



      </div>
    </div>
  );
}
