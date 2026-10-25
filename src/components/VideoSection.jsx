import { useState, useRef, useEffect } from 'react';
import { Film, Play, Pause, Volume2, VolumeX, Maximize, RotateCcw } from 'lucide-react';
import { KhmerDivider } from './KhmerOrnaments';

export default function VideoSection({
  lang = 'km',
  videoSrc = '/images/prewedding-video.mp4',
  posterSrc = '/images/prewedding-video-poster.webp'
}) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(46);
  const [showControls, setShowControls] = useState(true);
  const hideTimeoutRef = useRef(null);

  const content = {
    km: {
      badge: 'វីដេអូអនុស្សាវរីយ៍',
      title: 'វីដេអូអនុស្សាវរីយ៍',
      subtitle: 'ពេលវេលាដ៏មានតម្លៃ និងអនុស្សាវរីយ៍ផ្អែមល្ហែមដែលមិនអាចបំភ្លេចបាន',
      playTip: 'ចុចដើម្បីទស្សនាវីដេអូ'
    },
    en: {
      badge: 'Our Love Story',
      title: 'Moments Captured in Motion',
      subtitle: 'Cherished memories and unforgettable sweet moments together',
      playTip: 'Tap to play video'
    }
  }[lang];

  // Format time MM:SS
  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.warn('Playback error:', err);
      });
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e) => {
    e?.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    const newMuted = !video.muted;
    video.muted = newMuted;
    setIsMuted(newMuted);
  };

  // Synchronize audio with RomanticAudio:
  // When video plays with sound (isPlaying && !isMuted) -> mute/pause RomanticAudio.
  // When video sound is muted or paused -> resume RomanticAudio again.
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (isPlaying && !isMuted) {
      window.dispatchEvent(new CustomEvent('wedding_audio_control', {
        detail: { action: 'pause', source: 'video' }
      }));
    } else {
      window.dispatchEvent(new CustomEvent('wedding_audio_control', {
        detail: { action: 'resume', source: 'video' }
      }));
    }
  }, [isPlaying, isMuted]);

  // Clean up if VideoSection unmounts while video was playing with sound
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('wedding_audio_control', {
          detail: { action: 'resume', source: 'video' }
        }));
      }
    };
  }, []);

  const handleSeek = (e) => {
    const video = videoRef.current;
    if (!video) return;
    const newTime = parseFloat(e.target.value);
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleFullscreen = (e) => {
    e?.stopPropagation();
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if (video?.webkitEnterFullscreen) {
        video.webkitEnterFullscreen(); // iOS Safari fallback
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const handleUserInteraction = () => {
    setShowControls(true);
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    if (isPlaying) {
      hideTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  return (
    <section className="w-full my-8 space-y-4">
      {/* Header */}
      <div className="text-center space-y-1">
        <div className="mb-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[#b8860b] text-xs font-medium">
          <Film className="w-3.5 h-3.5" />
          <span>{content.badge}</span>
        </div>
        <h3 className="mb-2 font-moulpali text-xl sm:text-2xl text-[#3d3126]">
          {content.title}
        </h3>
        <p className="text-xs sm:text-sm text-[#8c7355]">
          {content.subtitle}
        </p>
      </div>

      <KhmerDivider className="my-2" />

      {/* Video Player Card */}
      <div className="flex justify-center">
        <div
          ref={containerRef}
          onClick={handleUserInteraction}
          onMouseMove={handleUserInteraction}
          className="group relative w-full max-w-[340px] sm:max-w-[360px] aspect-[9/16] rounded-2xl overflow-hidden border-2 border-[#d4af37]/50 shadow-2xl bg-black select-none"
        >
          {/* Main Video Element */}
          <video
            ref={videoRef}
            src={videoSrc}
            poster={posterSrc}
            playsInline
            preload="metadata"
            muted={isMuted}
            loop
            onTimeUpdate={() => {
              if (videoRef.current) {
                setCurrentTime(videoRef.current.currentTime);
              }
            }}
            onLoadedMetadata={() => {
              if (videoRef.current && videoRef.current.duration) {
                setDuration(videoRef.current.duration);
              }
            }}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
            onClick={togglePlay}
            className="w-full h-full object-cover cursor-pointer"
          />

          {/* Large Center Play Button Overlay (when paused) */}
          {!isPlaying && (
            <div
              onClick={togglePlay}
              className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center gap-3 cursor-pointer transition-opacity animate-fade-in"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-300 p-0.5 shadow-[0_0_25px_rgba(212,175,55,0.6)] group-hover:scale-110 active:scale-95 transition-all">
                <div className="w-full h-full rounded-full bg-stone-900/90 flex items-center justify-center text-amber-300">
                  <Play className="w-8 h-8 ml-1 fill-amber-300 text-amber-300" />
                </div>
              </div>
              <span className="text-xs font-semibold text-white/90 tracking-wide drop-shadow bg-black/50 px-3 py-1 rounded-full border border-white/20">
                {content.playTip}
              </span>
            </div>
          )}

          {/* Quick Sound Toggle on Top Right */}
          <button
            type="button"
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute video' : 'Mute video'}
            className="absolute top-3 right-3 z-20 p-2.5 rounded-full bg-black/60 hover:bg-black/85 text-amber-300 transition active:scale-90 backdrop-blur-md border border-amber-400/30 shadow-lg cursor-pointer"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-stone-300" />
            ) : (
              <Volume2 className="w-4 h-4 text-amber-400" />
            )}
          </button>

          {/* Video Controls Bar at Bottom */}
          <div
            className={`absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/95 via-black/60 to-transparent transition-opacity duration-300 z-10 flex flex-col gap-2 ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
          >
            {/* Timeline Progress Bar */}
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max={duration || 100}
                step="0.1"
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-amber-400 focus:outline-none"
              />
            </div>

            {/* Controls Row */}
            <div className="flex items-center justify-between text-xs text-white">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-amber-300 transition"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 fill-amber-300" />
                  ) : (
                    <Play className="w-4 h-4 fill-amber-300 ml-0.5" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (videoRef.current) {
                      videoRef.current.currentTime = 0;
                    }
                  }}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-stone-300 transition"
                  aria-label="Replay"
                  title="Replay from start"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                <span className="text-[11px] font-mono text-stone-300 font-medium">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleFullscreen}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-stone-300 hover:text-white transition"
                  aria-label="Fullscreen"
                >
                  <Maximize className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
