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
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-[#d4af37]/60 text-[#fef08a] shadow-lg transition-all active:scale-95 group cursor-pointer"
      >
        {isPlaying ? (
          <>
            <div className="flex items-end gap-[3px] h-4">
              <span className="w-1 bg-[#ffd700] rounded-full wave-bar-1" />
              <span className="w-1 bg-[#ffd700] rounded-full wave-bar-2" />
              <span className="w-1 bg-[#ffd700] rounded-full wave-bar-3" />
              <span className="w-1 bg-[#ffd700] rounded-full wave-bar-4" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[11px] font-semibold tracking-wide text-amber-200 hidden sm:inline leading-none">
                ភ្ជាប់និស្ស័យ
              </span>
              <span className="text-[9px] text-amber-300/70 hidden sm:inline leading-none mt-0.5">
                OLICA ft. KZ
              </span>
            </div>
            <Volume2 className="w-3.5 h-3.5 text-[#fef08a]" />
          </>
        ) : (
          <>
            <Music className="w-3.5 h-3.5 text-stone-400 group-hover:text-amber-300" />
            <span className="text-xs font-medium tracking-wide text-stone-300 group-hover:text-amber-200 hidden sm:inline">
              ចាក់ចម្រៀង
            </span>
            <VolumeX className="w-3.5 h-3.5 text-stone-400" />
          </>
        )}
      </button>
    </>
  );
}
