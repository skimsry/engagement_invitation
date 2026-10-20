import { useState, useEffect } from 'react';

export default function CountdownTimer({ targetDate = "2026-11-15T07:30:00+07:00", lang = "km" }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const target = new Date(targetDate).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const labels = {
    km: { days: 'ថ្ងៃ', hours: 'ម៉ោង', mins: 'នាទី', secs: 'វិនាទី', title: 'រាប់ថយក្រោយដល់ថ្ងៃសិរីមង្គល' },
    en: { days: 'Days', hours: 'Hours', mins: 'Mins', secs: 'Secs', title: 'Countdown to the Auspicious Day' }
  }[lang] || { days: 'ថ្ងៃ', hours: 'ម៉ោង', mins: 'នាទី', secs: 'វិនាទី', title: 'រាប់ថយក្រោយដល់ថ្ងៃសិរីមង្គល' };

  const timeUnits = [
    { value: timeLeft.days, label: labels.days },
    { value: timeLeft.hours, label: labels.hours },
    { value: timeLeft.minutes, label: labels.mins },
    { value: timeLeft.seconds, label: labels.secs }
  ];

  return (
    <div className="w-full my-6 p-4 rounded-2xl bg-gradient-to-b from-[#251d15] to-[#17130e] border border-[#d4af37]/40 shadow-xl text-center relative overflow-hidden">
      {/* Subtle gold glow background */}
      <div className="absolute -top-12 -left-12 w-32 h-32 bg-[#d4af37]/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-[#d4af37]/10 rounded-full blur-2xl pointer-events-none" />

      <p className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold mb-3">
        ⏳ {labels.title}
      </p>

      <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-sm mx-auto">
        {timeUnits.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-xl bg-black/40 border border-[#d4af37]/30 shadow-inner backdrop-blur-sm"
          >
            <span className="text-xl sm:text-2xl font-bold font-serif text-[#ffd700] tracking-tight">
              {String(item.value).padStart(2, '0')}
            </span>
            <span className="text-[10px] sm:text-xs text-[#e6ca65] mt-0.5">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
