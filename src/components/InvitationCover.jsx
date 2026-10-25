import { useState, useEffect } from 'react';
import { KhmerCorner } from './KhmerOrnaments';
import NatureAudio from './NatureAudio';
import { getStoredWeddingConfig } from '../utils/weddingConfig';

export default function InvitationCover({ isOpened, lang, onOpenCard, guest, hasGuestId: propHasGuestId }) {
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

  // Check if link has a valid guest ID or custom guest name
  const hasGuestId = propHasGuestId ?? Boolean(
    (guest?.id && guest.id !== 'demo' && guest.id !== '') ||
    (guest?.name && guest.name.trim() !== '' && guest.name !== 'ឯកឧត្តម / លោកជំទាវ / លោក / លោកស្រី' && guest.name !== 'ភ្ញៀវកិត្តិយស / Honored Guest') ||
    (typeof window !== 'undefined' && Boolean(
      new URLSearchParams(window.location.search).get('guest') ||
      new URLSearchParams(window.location.search).get('to') ||
      new URLSearchParams(window.location.search).get('name') ||
      window.Telegram?.WebApp?.initDataUnsafe?.start_param
    ))
  );

  const cover = config?.cover;
  const posterUrl = cover?.homeCoverPoster || "/images/home-page-poster.webp";
  const videoUrl = cover?.homeCoverVideo || "/images/home-page.mp4";

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center p-0 sm:py-8 animate-fade-in relative min-h-[100dvh] sm:min-h-[85vh]">
      {/* Ambient Nature Sound Controller (Starts automatically after 1s) */}
      <NatureAudio isOpened={isOpened} lang={lang} />

      {/* Immersive Luxury Card: Edge-to-edge 100dvh on mobile, elegant card on PC */}
      <div className="w-full h-[100dvh] sm:h-auto sm:max-w-md rounded-none sm:rounded-3xl overflow-hidden border-0 sm:border-2 border-[#d4af37]/70 shadow-none sm:shadow-[0_25px_60px_rgba(0,0,0,0.85)] relative flex flex-col items-center bg-[#171310] group">

        {/* The Video / WebP Media Display: Full 100dvh on mobile */}
        <div className="w-full h-full min-h-[100dvh] sm:min-h-[540px] relative flex items-center justify-center overflow-hidden bg-black/50">
          <video
            autoPlay
            loop
            muted
            playsInline
            webkit-playsinline="true"
            poster={posterUrl}
            className="w-full h-full object-cover min-h-[100dvh] sm:min-h-[540px] transition-transform duration-700 ease-out group-hover:scale-105 pointer-events-none"
          >
            <source src={videoUrl} type="video/mp4" />
            {/* Graceful image fallback */}
            <img
              src={posterUrl}
              alt="Engagement Invitation Cover"
              className="w-full h-full object-cover min-h-[100dvh] sm:min-h-[540px]"
            />
          </video>

          {/* Warm natural temple ambiance gradient overlay for perfect contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#140e08]/85 via-[#140e08]/25 to-transparent pointer-events-none" />

          {/* CENTER INVITATION STATEMENT (When link has no guest id) */}
          {!hasGuestId && (
            <div className="absolute inset-0 flex flex-col items-center justify-center -translate-y-16 sm:-translate-y-24 px-4 pointer-events-none z-20">
              <div className="relative flex flex-col items-center justify-center text-center animate-float">
                {/* Soft dark ambient shadow aura behind text for maximum contrast */}
                <div className="absolute -inset-x-8 -inset-y-4 bg-black/45 rounded-full blur-xl pointer-events-none -z-10" />

                <p
                  style={{
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,1)) drop-shadow(0 4px 10px rgba(0,0,0,1)) drop-shadow(0 8px 20px rgba(0,0,0,0.95)) drop-shadow(0 0 25px rgba(0,0,0,0.9))'
                  }}
                  className={`select-none text-center font-bold bg-gradient-to-r from-[#fff59d] via-[#ffd700] to-[#f59e0b] bg-clip-text text-transparent transition-all duration-500 ${
                    lang === 'km'
                      ? 'font-moulpali text-base sm:text-lg md:text-xl leading-relaxed tracking-wider'
                      : 'font-vibes text-2xl sm:text-3xl md:text-4xl tracking-widest'
                  }`}
                >
                  {lang === 'km' ? 'សូមគោរពអញ្ជើញ' : 'Cordially Invites'}
                </p>
                {/* Subtle royal golden glowing divider underline */}
                <div
                  style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.95))' }}
                  className="w-16 sm:w-24 h-[1.5px] bg-gradient-to-r from-transparent via-[#ffd700]/90 to-transparent mt-2 shadow-[0_0_10px_rgba(255,215,0,0.9)] animate-pulse"
                />
              </div>
            </div>
          )}

          {/* ROYAL GOLDEN FRAME OPEN BUTTON */}
          <div className="absolute bottom-16 sm:bottom-14 left-0 right-0 flex flex-col items-center justify-center px-4 z-30">
            <button
              onClick={onOpenCard}
              aria-label="Open Invitation"
              className="relative group/btn cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 w-[170px] sm:w-[195px] max-w-[75vw] focus:outline-none drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)] hover:drop-shadow-[0_14px_30px_rgba(212,175,55,0.65)]"
            >
              {/* Golden Baroque Frame Asset */}
              <img
                src="/images/open-card-frame.webp"
                alt="Golden Royal Frame"
                className="w-full h-auto object-contain block pointer-events-none select-none transition-transform duration-300 group-hover/btn:brightness-105"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/images/open-card-frame.png";
                }}
              />

              {/* Centered Content inside the Golden Frame Cartouche */}
              <div className="absolute inset-0 flex items-center justify-center px-2 sm:px-4">
                <div className="flex items-center justify-center gap-1 sm:gap-1.5 select-none">
                  <span className="font-moulpali tracking-tight sm:tracking-normal text-[11.5px] sm:text-[13.5px] font-bold whitespace-nowrap animate-bounce inline-block bg-gradient-to-l from-[#9A702E] via-[#C8973E] to-[#6B4714] bg-clip-text text-transparent drop-shadow-[0_1px_1px_rgba(255,255,255,0.35)]">
                    {lang === 'km' ? 'បើកសំបុត្រអញ្ជើញ' : 'Open Invitation'}
                  </span>
                </div>
              </div>
            </button>

            {/* <p className="font-dangrek text-xs sm:text-sm text-[#fef08a] tracking-wide mt-2 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] flex items-center gap-1.5">
              <span>{lang === 'km' ? 'ចុចខាងលើនេះដើម្បីបើកសំបុត្រអញ្ជើញ' : 'Tap above to open invitation'}</span>
            </p> */}
          </div>
        </div>

      </div>
    </div>
  );
}
