import { useState, useEffect } from 'react';
import { X, Maximize2, Minimize2, Share2, ChevronUp, ChevronDown, LogOut, Users, Power, Home } from 'lucide-react';
import RomanticAudio from './RomanticAudio';

export default function Header({
  lang,
  setLang,
  isOpened,
  isFullScreen,
  toggleFullScreen,
  onShare,
  onNext,
  onPrev,
  onExitApp,
  onCloseApp,
  onOpenCard,
  onNavigateCrud,
  isHidden = false
}) {
  const [isOpen, setIsOpen] = useState(false);

  // Close menu if hidden externally
  useEffect(() => {
    if (isHidden) setIsOpen(false);
  }, [isHidden]);

  // Close menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  // Handle Next Section Navigation
  const handleNextSection = () => {
    setIsOpen(false);
    if (onNext) {
      onNext();
      return;
    }
    if (!isOpened) {
      onOpenCard?.();
      return;
    }
    const sections = Array.from(document.querySelectorAll('main section, main > div > div, main [ref]'));
    const nextSec = sections.find((el) => {
      const top = el.getBoundingClientRect().top;
      return top > 120;
    });
    if (nextSec) {
      nextSec.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollBy({ top: window.innerHeight * 0.75, behavior: 'smooth' });
    }
  };

  // Handle Previous Section Navigation
  const handlePrevSection = () => {
    setIsOpen(false);
    if (onPrev) {
      onPrev();
      return;
    }
    const sections = Array.from(document.querySelectorAll('main section, main > div > div, main [ref]'));
    const prevSecs = sections.filter((el) => {
      const top = el.getBoundingClientRect().top;
      return top < -80;
    });
    if (prevSecs.length > 0) {
      prevSecs[prevSecs.length - 1].scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle Exit Application (Return to First Load)
  const handleExitApp = () => {
    setIsOpen(false);
    if (onExitApp) {
      onExitApp();
      return;
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Handle Exit from App (Browser tab or Telegram Mini App / Bot)
  const handleCloseApp = () => {
    setIsOpen(false);
    if (onCloseApp) {
      onCloseApp();
    }

    // 1. If running inside Telegram Mini App / Telegram Bot
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      try {
        const tg = window.Telegram.WebApp;
        tg.HapticFeedback?.notificationOccurred?.('warning');
        if (typeof tg.close === 'function') {
          tg.close();
          return;
        }
      } catch (e) {
        console.warn('Telegram close failed:', e);
      }
    }

    // 2. If running in regular Web Browser
    if (typeof window !== 'undefined') {
      try {
        window.close();
      } catch (e) {
        console.warn('window.close failed:', e);
      }

      // Secondary script-close workaround
      setTimeout(() => {
        try {
          window.open('', '_self', '');
          window.close();
        } catch (e) {}

        // Fallback if browser blocks script-initiated tab closing
        setTimeout(() => {
          if (window.history.length > 1) {
            window.history.back();
          } else {
            window.location.href = 'about:blank';
          }
        }, 150);
      }, 50);
    }
  };

  return (
    <>
      {/* 
        ACTIVE INTERACTIVE OVERLAY:
        Tapping outside closes the menu cleanly
      */}
      <div
        onClick={() => setIsOpen(false)}
        role="button"
        tabIndex={isOpen ? 0 : -1}
        aria-label="Close Menu"
        className={`fixed inset-0 z-[65] bg-black/55 backdrop-blur-[3px] transition-opacity duration-300 ${isOpen && !isHidden ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
      />

      {/* 
        ROYAL GLASS MENU CARD:
        Positioned right above the floating trigger button at bottom-right
      */}
      <div
        className={`fixed bottom-24 right-5 sm:right-8 z-[70] w-[300px] sm:w-[320px] select-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] origin-bottom-right ${isOpen && !isHidden
          ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 scale-90 translate-y-4 pointer-events-none'
          }`}
      >
        <div className="bg-[#161310]/95 backdrop-blur-2xl border border-[#d4af37]/45 shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_35px_rgba(212,175,55,0.18)] rounded-3xl p-4 flex flex-col gap-3.5">
          {/* Card Header with Rings Crest & Close Button */}
          <div className="flex items-center justify-between pb-1 border-b border-[#d4af37]/25">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/60 flex items-center justify-center p-0.5">
                <img src="/images/rings-logo.png" alt="Rings" className="w-full h-full object-contain" />
              </div>
              <h3 className="font-moulpali text-amber-200 text-xs sm:text-sm tracking-wide">
                {lang === 'km' ? 'មឺនុយសំបុត្រអញ្ជើញ' : 'Invitation Menu'}
              </h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full bg-white/5 hover:bg-[#d4af37]/25 text-amber-200/80 hover:text-amber-100 flex items-center justify-center transition active:scale-90"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Section 1: Previous & Next Navigation Bar */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] uppercase font-semibold text-stone-400 tracking-wider">
              {lang === 'km' ? '🧭 ការរុករកទំព័រ' : '🧭 Navigation'}
            </span>
            <div className="grid grid-cols-2 gap-2">
              {/* Previous Button */}
              <button
                onClick={handlePrevSection}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-black/50 hover:bg-[#d4af37]/20 border border-[#d4af37]/35 hover:border-[#d4af37] text-[#fde047] text-xs font-semibold shadow-sm active:scale-95 transition group"
                title={lang === 'km' ? 'ផ្នែកមុន' : 'Previous Section'}
              >
                <ChevronUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform text-[#fde047]" />
                <span>{lang === 'km' ? 'ក្រោយ' : 'Previous'}</span>
              </button>

              {/* Next Button */}
              <button
                onClick={handleNextSection}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#996515] to-[#d4af37] hover:brightness-110 text-stone-950 text-xs font-bold shadow-[0_4px_14px_rgba(212,175,55,0.35)] active:scale-95 transition group"
                title={lang === 'km' ? 'ផ្នែកបន្ទាប់' : 'Next Section'}
              >
                <span>{lang === 'km' ? 'បន្ទាប់' : 'Next'}</span>
                <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform text-stone-950" />
              </button>
            </div>
          </div>

          {/* Section 2: Utilities Grid (Music, Language, Fullscreen, Share) */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] uppercase font-semibold text-stone-400 tracking-wider">
              {lang === 'km' ? '⚙️ ឧបករណ៍បញ្ជា' : '⚙️ Quick Controls'}
            </span>
            <div className="grid grid-cols-4 gap-2 text-center">
              {/* Music */}
              <div className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-2xl bg-black/50 border border-[#d4af37]/40 hover:border-[#d4af37] hover:bg-[#d4af37]/20 text-[#fde047] flex items-center justify-center transition active:scale-90 shadow-sm">
                  <RomanticAudio
                    isOpened={isOpened}
                    className="w-full h-full flex items-center justify-center"
                    waveColor="#fde047"
                  />
                </div>
                <span className="text-[10px] text-stone-300 font-medium">
                  {lang === 'km' ? 'តន្ត្រី' : 'Music'}
                </span>
              </div>

              {/* Language Toggle */}
              <div className="flex flex-col items-center gap-1">
                <button
                  onClick={() => {
                    setLang(lang === 'km' ? 'en' : 'km');
                  }}
                  className="w-12 h-12 rounded-2xl bg-black/50 border border-[#d4af37]/40 hover:border-[#d4af37] hover:bg-[#d4af37]/20 text-[#fde047] font-bold text-xs flex items-center justify-center transition active:scale-90 shadow-sm"
                  title="Switch Language"
                >
                  {lang === 'km' ? 'EN' : 'ខ្មែរ'}
                </button>
                <span className="text-[10px] text-stone-300 font-medium">
                  {lang === 'km' ? 'ភាសា' : 'Lang'}
                </span>
              </div>

              {/* Fullscreen Toggle */}
              <div className="flex flex-col items-center gap-1">
                <button
                  onClick={() => {
                    toggleFullScreen();
                  }}
                  className="w-12 h-12 rounded-2xl bg-black/50 border border-[#d4af37]/40 hover:border-[#d4af37] hover:bg-[#d4af37]/20 text-[#fde047] flex items-center justify-center transition active:scale-90 shadow-sm"
                  title={isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
                >
                  {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <span className="text-[10px] text-stone-300 font-medium">
                  {isFullScreen
                    ? (lang === 'km' ? 'បង្រួម' : 'Exit')
                    : (lang === 'km' ? 'ពង្រីក' : 'Full')}
                </span>
              </div>

              {/* Share */}
              <div className="flex flex-col items-center gap-1">
                <button
                  onClick={() => {
                    onShare();
                    setIsOpen(false);
                  }}
                  className="w-12 h-12 rounded-2xl bg-black/50 border border-[#d4af37]/40 hover:border-[#d4af37] hover:bg-[#d4af37]/20 text-[#fde047] flex items-center justify-center transition active:scale-90 shadow-sm"
                  title="Share Invitation"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <span className="text-[10px] text-stone-300 font-medium">
                  {lang === 'km' ? 'ចែករំលែក' : 'Share'}
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Admin & Guest List CRUD Route */}
          <div className="pt-1 border-t border-[#d4af37]/25 flex flex-col gap-2">
            <button
              onClick={() => {
                setIsOpen(false);
                onNavigateCrud?.();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#d4af37]/20 hover:bg-[#d4af37]/35 border border-[#d4af37]/60 text-[#fde047] text-xs font-bold transition active:scale-95 group shadow-sm"
              title={lang === 'km' ? 'គ្រប់គ្រងប្រព័ន្ធភ្ញៀវ ' : 'Guest List & Spreadsheet CRUD'}
            >
              <Users className="w-4 h-4 text-[#fde047] group-hover:scale-110 transition-transform" />
              <span>{lang === 'km' ? 'បញ្ជីភ្ញៀវ' : 'Guest List '}</span>
            </button>

            {/* Exit to First Load (Cover) */}
            <button
              onClick={handleExitApp}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-stone-900/80 hover:bg-stone-800 border border-[#d4af37]/30 text-amber-200/90 hover:text-amber-100 text-xs font-semibold transition active:scale-95 group shadow-sm"
              title={lang === 'km' ? 'ត្រឡប់ទៅទំព័រដើម' : 'Exit to First Load'}
            >
              <Home className="w-4 h-4 group-hover:scale-110 transition-transform text-[#fde047]" />
              <span>{lang === 'km' ? 'ត្រឡប់ទៅទំព័រដើម' : 'Exit to First Load'}</span>
            </button>

            {/* Exit from App (Browser / Telegram Bot) */}
            <button
              onClick={handleCloseApp}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-rose-950/50 hover:bg-rose-900/70 border border-rose-500/50 text-rose-300 hover:text-white text-xs font-bold transition active:scale-95 group shadow-sm"
              title={lang === 'km' ? 'ចាកចេញពីកម្មវិធី' : 'Exit from App'}
            >
              <Power className="w-4 h-4 group-hover:scale-110 transition-transform text-rose-400" />
              <span>{lang === 'km' ? 'ចាកចេញពីកម្មវិធី' : 'Exit from App'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 
        CENTRAL FAB TRIGGER BUTTON:
        Golden royal rings floating action button at bottom-right
      */}
      <div
        className={`mb-8 ml-4 fixed bottom-6 right-5 sm:right-8 z-[70] select-none transition-all duration-300 ease-out ${isHidden ? 'opacity-0 scale-75 pointer-events-none' : 'opacity-100 scale-100'
          }`}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
          className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-[#9A702E] via-[#C8973E] to-[#6B4714] text-stone-950 shadow-[0_8px_25px_rgba(212,175,55,0.55)] hover:shadow-[0_12px_32px_rgba(212,175,55,0.75)] hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none flex items-center justify-center cursor-pointer border-2 border-amber-100"
        >
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
