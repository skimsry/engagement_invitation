import { useEffect, useRef, useState } from 'react';

/**
 * NatureAudio Component (Invisible Background Sound Player)
 * Plays the natural ambient background sound (/audio/nature-sound.mp3)
 * automatically 1 second after first load, and triggers on mouse move / touch.
 * Has no visual UI as requested by user.
 */
export default function NatureAudio({ isOpened, onStarted }) {
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
            // Autoplay blocked without prior interaction; listeners remain ready
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
      try {
        tg.onEvent?.('viewportChanged', handleTgViewport);
      } catch (e) {
        // ignore
      }
    }

    // 3. Autoplay triggers across mouse movement, touch, scroll, and tap gestures
    const interactionEvents = [
      'mousemove',
      'pointermove',
      'touchstart',
      'touchmove',
      'touchend',
      'pointerdown',
      'mousedown',
      'click',
      'wheel',
      'scroll',
      'keydown'
    ];

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

  if (isOpened) return null;

  return (
    <audio
      ref={audioRef}
      src="/audio/nature-sound.mp3"
      preload="auto"
      playsInline
      loop
      onPlay={() => setIsPlaying(true)}
      onPause={() => setIsPlaying(false)}
      style={{ display: 'none' }}
    />
  );
}
