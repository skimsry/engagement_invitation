import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

export default function RomanticAudio({ isOpened }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const songTitle = "ភ្ជាប់និស្ស័យ (NISAI) - OLICA ft. KZ";

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.75;
    audio.loop = true;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, []);

  // When card is opened, trigger music playback smoothly
  useEffect(() => {
    if (isOpened && audioRef.current) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((err) => {
            console.warn("Autoplay prevented by browser, waiting for user click:", err);
          });
      }
    }
  }, [isOpened]);

  const toggleAudio = (e) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(console.warn);
    }
  };

  return (
    <>
      {/* Hidden audio element for high fidelity playback */}
      <audio
        ref={audioRef}
        src="/audio/wedding-song.mp3"
        preload="auto"
      />

      <button
        onClick={toggleAudio}
        title={isPlaying ? `ផ្អាកចម្រៀង: ${songTitle}` : `ចាក់ចម្រៀង: ${songTitle}`}
        aria-label="Toggle Wedding Music"
        className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-[#d4af37]/40 shadow-sm flex items-center justify-center text-[#fef08a] hover:text-white transition-all active:scale-95 cursor-pointer drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
      >
        {isPlaying ? (
          <div className="flex items-end gap-[2px] h-3.5">
            <span className="w-[2.5px] bg-[#ffd700] rounded-full mini-wave-1" />
            <span className="w-[2.5px] bg-[#ffd700] rounded-full mini-wave-2" />
            <span className="w-[2.5px] bg-[#ffd700] rounded-full mini-wave-3" />
          </div>
        ) : (
          <Music className="w-3.5 h-3.5 text-amber-200/80 group-hover:text-amber-200" />
        )}
      </button>
    </>
  );
}
