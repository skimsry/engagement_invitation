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
        className="p-1 bg-transparent text-[#155E63] hover:text-[#0e3f42] transition-all active:scale-90 cursor-pointer focus:outline-none flex items-center justify-center"
      >
        {isPlaying ? (
          <div className="flex items-end gap-[2.5px] h-4">
            <span className="w-[3px] bg-[#155E63] rounded-full mini-wave-1" />
            <span className="w-[3px] bg-[#155E63] rounded-full mini-wave-2" />
            <span className="w-[3px] bg-[#155E63] rounded-full mini-wave-3" />
          </div>
        ) : (
          <Music className="w-5 h-5 text-[#155E63] hover:text-[#0e3f42]" />
        )}
      </button>
    </>
  );
}
