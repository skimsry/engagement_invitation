import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';

/**
 * NatureAudio Component
 * Automatically turns on natural ambient background sound (/audio/nature-sound.mp3)
 * exactly 1 second after first loading, with interactive fallback for strict browser policies.
 */
export default function NatureAudio({ isOpened, lang = 'km', onStarted }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const hasStartedRef = useRef(false);

  // Stop background sound immediately when invitation card is opened
  useEffect(() => {
    if (isOpened && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [isOpened]);

  // Handle 1-second auto-play on first load with gesture fallback
  useEffect(() => {
    if (isOpened) return;

    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.85;
    audio.loop = true;

    let cleanupListeners = () => {};

    const attemptPlay = () => {
      if (hasStartedRef.current || isOpened) return;
      const el = audioRef.current;
      if (!el) return;

      const promise = el.play();
      if (promise !== undefined) {
        promise
          .then(() => {
            setIsPlaying(true);
            hasStartedRef.current = true;
            cleanupListeners();
            if (onStarted) onStarted();
          })
          .catch(() => {
            // Browser autoplay policy prevented unmuted playback.
            // Interaction listeners remain ready for first user touch anywhere.
          });
      }
    };

    // 1. One-second timer after first loading to turn on sound automatically
    const autoPlayTimer = setTimeout(() => {
      attemptPlay();
    }, 1000);

    // 2. Telegram WebApp Integration: attempt play on Telegram events & viewport setup
    const tg = window.Telegram?.WebApp;
    const handleTgViewport = () => {
      attemptPlay();
    };

    if (tg) {
      // If Telegram WebApp is already active or expands
      try {
        tg.onEvent?.('viewportChanged', handleTgViewport);
      } catch (e) {
        // ignore
      }
    }

    // 3. Interaction fallback across touch, tap, and click gestures
    const interactionEvents = ['pointerdown', 'touchstart', 'touchend', 'click', 'keydown', 'mousedown'];

    const handleInteraction = () => {
      attemptPlay();
      if (tg?.HapticFeedback) {
        try {
          tg.HapticFeedback.impactOccurred('light');
        } catch (e) {
          // ignore
        }
      }
    };

    interactionEvents.forEach((evt) => {
      window.addEventListener(evt, handleInteraction, { capture: true, passive: true });
      document.addEventListener(evt, handleInteraction, { capture: true, passive: true });
    });

    cleanupListeners = () => {
      clearTimeout(autoPlayTimer);
      if (tg) {
        try {
          tg.offEvent?.('viewportChanged', handleTgViewport);
        } catch (e) {
          // ignore
        }
      }
      interactionEvents.forEach((evt) => {
        window.removeEventListener(evt, handleInteraction, { capture: true });
        document.removeEventListener(evt, handleInteraction, { capture: true });
      });
    };

    return () => {
      cleanupListeners();
    };
  }, [isOpened, onStarted]);

  const toggleSound = (e) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
        hasStartedRef.current = true;
      }).catch(console.warn);
    }
  };

  if (isOpened) return null;

  const labelText = lang === 'km' ? 'សម្លេងផ្ទៃខាងក្រោយ' : 'Background Sound';

  return (
    <div className="absolute top-16 sm:top-4 right-3 sm:right-4 z-30">
      {/* Background Natural Audio track */}
      <audio
        ref={audioRef}
        src="/audio/nature-sound.mp3"
        preload="auto"
        playsInline
        loop
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <button
        type="button"
        onClick={toggleSound}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md border shadow-lg transition-all active:scale-95 text-xs font-medium cursor-pointer group ${
          isPlaying
            ? 'bg-black/70 hover:bg-black/85 border-[#d4af37]/80 text-[#fef08a] shadow-[0_0_15px_rgba(212,175,55,0.35)]'
            : 'bg-black/60 hover:bg-black/80 border-[#d4af37]/50 text-[#fef08a]/90 hover:border-[#d4af37]'
        }`}
        title={
          isPlaying
            ? (lang === 'km' ? "បិទសម្លេងផ្ទៃខាងក្រោយ (Mute)" : "Mute Background Sound")
            : (lang === 'km' ? "ចាក់សម្លេងផ្ទៃខាងក្រោយ (Play)" : "Play Background Sound")
        }
      >
        {isPlaying ? (
          <>
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span className="text-[11px] text-amber-200 tracking-wide font-medium">{labelText}</span>
            <div className="flex items-end gap-[2px] h-3 ml-0.5">
              <span className="w-0.5 bg-[#ffd700] rounded-full wave-bar-1 h-2" />
              <span className="w-0.5 bg-[#ffd700] rounded-full wave-bar-2 h-3" />
              <span className="w-0.5 bg-[#ffd700] rounded-full wave-bar-3 h-1.5" />
            </div>
            <Volume2 className="w-3.5 h-3.5 text-amber-400" />
          </>
        ) : (
          <>
            <span className="text-[11px] text-stone-300 group-hover:text-amber-200 tracking-wide">{labelText}</span>
            <VolumeX className="w-3.5 h-3.5 text-stone-400 group-hover:text-amber-300 animate-pulse" />
          </>
        )}
      </button>
    </div>
  );
}
