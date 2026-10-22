import { useState, useEffect } from 'react';
import { X, Maximize2, Minimize2, Share2 } from 'lucide-react';
import RomanticAudio from './RomanticAudio';

export default function Header({
  lang,
  setLang,
  isOpened,
  isFullScreen,
  toggleFullScreen,
  onShare
}) {
  const [isOpen, setIsOpen] = useState(false);

  // Close radial menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  // Clean 150px arc fanning out upwards into viewport from bottom-right
  // Angles: 85° (Music), 62° (Language), 38° (Fullscreen), 15° (Share)
  const menuItems = [
    {
      id: 'music',
      label: lang === 'km' ? 'តន្ត្រី' : 'Music',
      x: -13,   // -150 * cos(85°) ≈ -13px
      y: -149,  // -150 * sin(85°) ≈ -149px
      render: (
        <RomanticAudio
          isOpened={isOpened}
          className="w-12 h-12 rounded-full bg-[#1c1814]/95 text-[#fde047] border border-[#d4af37]/60 shadow-[0_8px_20px_rgba(0,0,0,0.6)] hover:bg-[#d4af37] hover:text-stone-950 active:scale-90 transition-all flex items-center justify-center cursor-pointer backdrop-blur-md"
          waveColor="#fde047"
        />
      )
    },
    {
      id: 'lang',
      label: lang === 'km' ? 'ភាសា (EN)' : 'Language (ខ្មែរ)',
      x: -70,   // -150 * cos(62°) ≈ -70px
      y: -132,  // -150 * sin(62°) ≈ -132px
      render: (
        <button
          onClick={() => {
            setLang(lang === 'km' ? 'en' : 'km');
            setIsOpen(false);
          }}
          className="w-12 h-12 rounded-full bg-[#1c1814]/95 text-[#fde047] border border-[#d4af37]/60 shadow-[0_8px_20px_rgba(0,0,0,0.6)] hover:bg-[#d4af37] hover:text-stone-950 active:scale-90 transition-all flex items-center justify-center cursor-pointer font-bold text-xs backdrop-blur-md"
          title="Switch Language"
          aria-label="Switch Language"
        >
          {lang === 'km' ? 'EN' : 'ខ្មែរ'}
        </button>
      )
    },
    {
      id: 'fullscreen',
      label: lang === 'km'
        ? (isFullScreen ? 'បង្រួមអេក្រង់' : 'ពេញអេក្រង់')
        : (isFullScreen ? 'Exit Fullscreen' : 'Fullscreen'),
      x: -118,  // -150 * cos(38°) ≈ -118px
      y: -92,   // -150 * sin(38°) ≈ -92px
      render: (
        <button
          onClick={() => {
            toggleFullScreen();
            setIsOpen(false);
          }}
          className="w-12 h-12 rounded-full bg-[#1c1814]/95 text-[#fde047] border border-[#d4af37]/60 shadow-[0_8px_20px_rgba(0,0,0,0.6)] hover:bg-[#d4af37] hover:text-stone-950 active:scale-90 transition-all flex items-center justify-center cursor-pointer backdrop-blur-md"
          title={isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
          aria-label="Toggle Full Screen"
        >
          {isFullScreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
        </button>
      )
    },
    {
      id: 'share',
      label: lang === 'km' ? 'ចែករំលែក' : 'Share',
      x: -145,  // -150 * cos(15°) ≈ -145px
      y: -39,   // -150 * sin(15°) ≈ -39px
      render: (
        <button
          onClick={() => {
            onShare();
            setIsOpen(false);
          }}
          className="w-12 h-12 rounded-full bg-[#1c1814]/95 text-[#fde047] border border-[#d4af37]/60 shadow-[0_8px_20px_rgba(0,0,0,0.6)] hover:bg-[#d4af37] hover:text-stone-950 active:scale-90 transition-all flex items-center justify-center cursor-pointer backdrop-blur-md"
          title="Share Invitation"
          aria-label="Share Invitation"
        >
          <Share2 className="w-5 h-5" />
        </button>
      )
    }
  ];

  return (
    <>
      {/* 
        ACTIVE INTERACTIVE OVERLAY:
        Fixes the original's dead overlay — tapping anywhere outside closes the menu cleanly
      */}
      <div
        onClick={() => setIsOpen(false)}
        role="button"
        tabIndex={isOpen ? 0 : -1}
        aria-label="Close Radial Menu"
        className={`fixed inset-0 z-40 bg-black/45 backdrop-blur-[2px] transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
      />

      {/* Radial Menu Container (Anchored at bottom-right) */}
      <div className="fixed bottom-40 right-6 z-50 select-none">

        {/* Fan-Out Action Items with Staggered Delays */}
        <div className="relative">
          {menuItems.map((item, index) => {
            // Stagger delay: 40ms cascade
            const delay = isOpen
              ? `${index * 40}ms`
              : `${(menuItems.length - 1 - index) * 40}ms`;

            return (
              <div
                key={item.id}
                className="absolute bottom-0 right-0 flex items-center gap-2.5 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] origin-center"
                style={{
                  transform: isOpen
                    ? `translate(${item.x}px, ${item.y}px) scale(1)`
                    : 'translate(0px, 0px) scale(0)',
                  opacity: isOpen ? 1 : 0,
                  pointerEvents: isOpen ? 'auto' : 'none',
                  transitionDelay: delay
                }}
              >
                {/* Floating Frosted Pill Label */}
                {/* <span className="px-3 py-1 rounded-full bg-stone-950/90 text-[#fde047] text-xs font-medium border border-[#d4af37]/40 shadow-[0_4px_16px_rgba(0,0,0,0.8)] whitespace-nowrap pointer-events-none select-none backdrop-blur-md">
                  {item.label}
                </span> */}

                {/* Circular Action Button */}
                {item.render}
              </div>
            );
          })}
        </div>

        {/* 
          CENTRAL FAB BUTTON:
          Floating Action Button whose plus spins into an X cleanly
        */}
        <button
          onClick={() => {
            setIsOpen(!isOpen)
          }
          }
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Close Menu' : 'Open Navigation Menu'}
          className="relative z-10 w-14 h-14 rounded-full bg-gradient-to-tr from-[#996515] via-[#d4af37] to-[#fde047] text-stone-950 shadow-[0_8px_25px_rgba(212,175,55,0.5)] hover:shadow-[0_12px_32px_rgba(212,175,55,0.7)] hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none flex items-center justify-center cursor-pointer border-2 border-amber-100"
        >
          {/* Rings logo that smoothly spins into an X when open */}
          <div className="relative w-8 h-8 flex items-center justify-center pointer-events-none select-none">
            {/* The Rings Image (visible when closed, spins & dissolves when open) */}
            <img
              src="/images/rings-logo.png"
              alt="Engagement Rings"
              className={`absolute inset-0 w-full h-full object-contain transition-all duration-300 ease-out drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)] ${isOpen ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'
                }`}
            />

            {/* X icon (spins in when open) */}
            <X
              className={`w-7 h-7 text-stone-950 stroke-[2.75] transition-all duration-300 ease-out ${isOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'
                }`}
            />
          </div>
        </button>

      </div>
    </>
  );
}
