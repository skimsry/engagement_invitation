import { useEffect, useRef, useState } from 'react';

/**
 * NatureAudio Component (Invisible Background Sound Player)
 * Plays the natural ambient background sound (/audio/nature-sound.mp3)
 * automatically 1 second after first load, and triggers on mouse move / touch.
 * Has no visual UI as requested by user.
 */
export default function NatureAudio({ isOpened, onStarted, volume = 0.05 }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const hasStartedRef = useRef(false);
  const isMusicActiveRef = useRef(Boolean(typeof window !== 'undefined' && window.__isWeddingMusicPlaying));

  // Stop background sound immediately when invitation card is opened
  useEffect(() => {
    if (isOpened && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.muted = true;
      setIsPlaying(false);
    }
  }, [isOpened]);

  // Listen to wedding music play/pause states (e.g. from Header music button)
  useEffect(() => {
    const handleMusicState = (e) => {
      const musicPlaying = Boolean(e.detail?.isPlaying);
      isMusicActiveRef.current = musicPlaying;
      if (musicPlaying) {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.muted = true;
        }
        setIsPlaying(false);
      } else {
        if (audioRef.current) {
          audioRef.current.muted = false;
        }
        if (!isOpened) {
          // If Romantic music paused and invitation is still on cover/opening, resume nature sound
          hasStartedRef.current = false;
          audioRef.current?.play().then(() => setIsPlaying(true)).catch(() => { });
        }
      }
    };

    window.addEventListener('wedding_music_state', handleMusicState);
    return () => window.removeEventListener('wedding_music_state', handleMusicState);
  }, [isOpened]);

  // Handle auto-play on first load / gesture fallback
  useEffect(() => {
    if (isOpened || isMusicActiveRef.current || (typeof window !== 'undefined' && window.__isWeddingMusicPlaying)) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.muted = true;
      }
      return;
    }

    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;
    audio.loop = true;

    let cleanupListeners = () => { };

    const attemptPlay = () => {
      if (
        hasStartedRef.current ||
        isOpened ||
        isMusicActiveRef.current ||
        (typeof window !== 'undefined' && window.__isWeddingMusicPlaying)
      ) {
        return;
      }
      const el = audioRef.current;
      if (!el) return;

      el.volume = volume;
      const promise = el.play();
      if (promise !== undefined) {
        promise
          .then(() => {
            if (
              isMusicActiveRef.current ||
              (typeof window !== 'undefined' && window.__isWeddingMusicPlaying)
            ) {
              el.pause();
              el.muted = true;
              return;
            }
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

    // 1. Immediate play attempt (works instantly after user interaction, like clicking "Open Invitation")
    attemptPlay();

    // 2. One-second timer after first loading to turn on sound automatically
    const autoPlayTimer = setTimeout(() => {
      attemptPlay();
    }, 1000);

    // 3. Telegram WebApp Integration: attempt play on Telegram events & viewport setup
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

    // 4. Autoplay triggers across mouse movement, touch, scroll, and tap gestures
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
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [isOpened, onStarted, volume]);

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
