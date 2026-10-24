import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { getStoredWeddingConfig } from '../utils/weddingConfig';

// Helper to extract YouTube video ID from various URL formats
export const extractYouTubeId = (url) => {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = trimmed.match(regExp);
  return match ? match[1] : null;
};

export default function RomanticAudio({
  isOpened,
  className,
  waveColor = '#ffd700',
  audioConfig
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const [currentConfig, setCurrentConfig] = useState(() => audioConfig || getStoredWeddingConfig().audio);

  useEffect(() => {
    if (audioConfig) {
      setCurrentConfig(audioConfig);
    }
  }, [audioConfig]);

  useEffect(() => {
    const handleUpdate = (e) => {
      if (e.detail?.audio) {
        setCurrentConfig(e.detail.audio);
      }
    };
    window.addEventListener('wedding_config_updated', handleUpdate);
    return () => window.removeEventListener('wedding_config_updated', handleUpdate);
  }, []);

  const songTitle = currentConfig?.songTitle || "ភ្ជាប់និស្ស័យ (NISAI) - OLICA ft. KZ";
  const audioUrl = currentConfig?.audioUrl || "/audio/wedding-song.mp3";
  const youtubeId = extractYouTubeId(audioUrl);

  useEffect(() => {
    // If not YouTube, configure HTML5 Audio
    if (youtubeId) return;

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
  }, [youtubeId, audioUrl]);

  // When card is opened, trigger music playback smoothly; when closed, pause and rewind
  useEffect(() => {
    if (youtubeId) {
      if (isOpened) {
        setIsPlaying(true);
      } else {
        setIsPlaying(false);
      }
      return;
    }

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
    } else if (!isOpened && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, [isOpened, youtubeId]);

  const toggleAudio = (e) => {
    e.stopPropagation();
    if (youtubeId) {
      setIsPlaying(prev => !prev);
      return;
    }

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
      {youtubeId ? (
        // YouTube background player (Hidden iframe with autoplay & enablejsapi)
        isPlaying && (
          <div className="sr-only pointer-events-none" aria-hidden="true">
            <iframe
              title={`YouTube Background Audio - ${songTitle}`}
              width="200"
              height="200"
              src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&loop=1&playlist=${youtubeId}&controls=0&mute=0&playsinline=1`}
              allow="autoplay; encrypted-media"
              allowFullScreen={false}
              className="opacity-0 pointer-events-none"
            />
          </div>
        )
      ) : (
        <audio
          ref={audioRef}
          src={audioUrl}
          preload="none"
        />
      )}

      <button
        onClick={toggleAudio}
        title={isPlaying ? `ផ្អាកចម្រៀង: ${songTitle}` : `ចាក់ចម្រៀង: ${songTitle}`}
        aria-label="Toggle Wedding Music"
        className={
          className ||
          "p-1 bg-transparent text-[#155E63] hover:text-[#0e3f42] transition-all active:scale-90 cursor-pointer focus:outline-none flex items-center justify-center"
        }
      >
        {isPlaying ? (
          <div className="flex items-end gap-[2.5px] h-4">
            <span className="w-[3px] rounded-full mini-wave-1" style={{ backgroundColor: waveColor }} />
            <span className="w-[3px] rounded-full mini-wave-2" style={{ backgroundColor: waveColor }} />
            <span className="w-[3px] rounded-full mini-wave-3" style={{ backgroundColor: waveColor }} />
          </div>
        ) : (
          <Music className="w-5 h-5 text-current" />
        )}
      </button>
    </>
  );
}
