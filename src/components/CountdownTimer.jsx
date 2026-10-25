import { useState, useEffect } from 'react';

export default function CountdownTimer({ targetDate = "2026-11-22T07:30:00+07:00", lang = "km" }) {
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
    <div className="w-full my-4 p-4 rounded-2xl bg-gradient-to-r from-amber-100/60 via-amber-50 to-amber-100/60 border border-[#d4af37]/50 shadow-sm text-center relative overflow-hidden">
      {/* Subtle gold glow background */}
      <div className="absolute -top-10 -left-10 w-28 h-28 bg-[#d4af37]/10 rounded-full blur-xl pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-28 h-28 bg-[#d4af37]/10 rounded-full blur-xl pointer-events-none" />

      <p className="font-moulpali text-xs sm:text-sm text-[#78500c] mb-3">
        ⏳ {labels.title}
      </p>

      <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-sm mx-auto">
        {timeUnits.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-xl bg-white border border-[#d4af37]/40 shadow-sm"
          >
            <span className="text-xl sm:text-2xl font-bold font-serif text-[#78500c] tracking-tight">
              {String(item.value).padStart(2, '0')}
            </span>
            <span className="text-[10px] sm:text-xs text-[#8c7355] font-medium mt-0.5">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
