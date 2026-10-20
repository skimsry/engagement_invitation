import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

export default function RomanticAudio({ isOpened }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef(null);
  const timerRef = useRef(null);

  // Soft romantic wedding chord progression: Pentatonic harp arpeggios (C, G, Am, F)
  const notes = [
    261.63, 329.63, 392.00, 523.25, // C chord
    392.00, 493.88, 587.33, 783.99, // G chord
    440.00, 523.25, 659.25, 880.00, // Am chord
    349.23, 440.00, 523.25, 698.46  // F chord
  ];

  const playPluck = (freq, ctx) => {
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle'; // Warm harp-like tone
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    // Exponential decay like a romantic music box / harp string
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 2.3);
  };

  const startRomanticMelody = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      let noteIdx = 0;
      setIsPlaying(true);

      const loop = () => {
        if (!audioCtxRef.current) return;
        const freq = notes[noteIdx % notes.length];
        playPluck(freq, audioCtxRef.current);
        noteIdx++;
        // Gentle tempo ~600ms per note
        timerRef.current = setTimeout(loop, 600);
      };

      loop();
    } catch (e) {
      console.warn('Audio playback not supported', e);
    }
  };

  const stopRomanticMelody = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsPlaying(false);
  };

  const toggleAudio = () => {
    if (isPlaying) {
      stopRomanticMelody();
    } else {
      startRomanticMelody();
    }
  };

  // Auto-prompt playback once card is opened
  useEffect(() => {
    if (isOpened && !isPlaying) {
      startRomanticMelody();
    }
    return () => {
      stopRomanticMelody();
    };
  }, [isOpened]);

  return (
    <button
      onClick={toggleAudio}
      title={isPlaying ? "Mute Romantic Music" : "Play Romantic Music"}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-[#d4af37]/60 text-[#fef08a] shadow-lg transition-all active:scale-95 group"
    >
      {isPlaying ? (
        <>
          <div className="flex items-end gap-[3px] h-4">
            <span className="w-1 bg-[#ffd700] rounded-full wave-bar-1" />
            <span className="w-1 bg-[#ffd700] rounded-full wave-bar-2" />
            <span className="w-1 bg-[#ffd700] rounded-full wave-bar-3" />
            <span className="w-1 bg-[#ffd700] rounded-full wave-bar-4" />
          </div>
          <span className="text-xs font-medium tracking-wide text-amber-200 hidden sm:inline">ភ្លេងការ</span>
          <Volume2 className="w-3.5 h-3.5 text-[#fef08a]" />
        </>
      ) : (
        <>
          <Music className="w-3.5 h-3.5 text-stone-400 group-hover:text-amber-300" />
          <span className="text-xs font-medium tracking-wide text-stone-300 group-hover:text-amber-200 hidden sm:inline">ចាក់ភ្លេង</span>
          <VolumeX className="w-3.5 h-3.5 text-stone-400" />
        </>
      )}
    </button>
  );
}
