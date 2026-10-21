import { useEffect, useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Send,
  Sparkles,
  Share2,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  Navigation,
  Gift,
  Heart,
  Users,
  CalendarPlus,
  Compass,
  ArrowRight
} from 'lucide-react';

import { KhmerLotus, KhmerDivider, KhmerCorner } from './components/KhmerOrnaments';
import RomanticAudio from './components/RomanticAudio';
import CountdownTimer from './components/CountdownTimer';
import GiftAngpaoModal from './components/GiftAngpaoModal';
import PhotoGallery from './components/PhotoGallery';

// Google Apps Script Web App URL from original implementation
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzLMSWSdHf9ArnCzpB4CIapF7UkcDCHyUfW6jm0U1Wn-HmrEeD2yTk2C-zrNvtsnwQJpQ/exec";

export default function App() {
  const [guest, setGuest] = useState({ id: '', name: 'ឯកឧត្តម / លោកជំទាវ / លោក / លោកស្រី', rsvp: 'Pending', loaded: false });
  const [isOpened, setIsOpened] = useState(false);
  const [rsvpStatus, setRsvpStatus] = useState('');
  const [guestCount, setGuestCount] = useState('1');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [lang, setLang] = useState('km'); // 'km' or 'en'
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  const invitationRef = useRef(null);
  const rsvpSectionRef = useRef(null);

  // Initialize Telegram Mini App & parse URL query params
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      tg.setHeaderColor('#14120f');
      tg.setBackgroundColor('#14120f');
    }

    const urlParams = new URLSearchParams(window.location.search);
    const guestId = tg?.initDataUnsafe?.start_param || urlParams.get('guest') || urlParams.get('to') || '';
    const directName = urlParams.get('name');
    const urlLang = urlParams.get('lang');

    if (urlLang === 'en' || urlLang === 'km') {
      setLang(urlLang);
    }

    if (directName) {
      setGuest({ id: guestId || 'guest', name: decodeURIComponent(directName), rsvp: 'Pending', loaded: true });
      return;
    }

    if (!guestId) {
      setGuest({ id: 'demo', name: 'ឯកឧត្តម លោកជំទាវ លោក លោកស្រី អ្នកនាងកញ្ញា', rsvp: 'Pending', loaded: true });
      return;
    }

    // Fetch Guest Name from Google Sheet
    fetch(`${SCRIPT_URL}?id=${encodeURIComponent(guestId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.found) {
          setGuest({ id: data.id, name: data.name, rsvp: data.rsvp, loaded: true });
          if (data.rsvp === 'Attending' || data.rsvp === 'Declined' || data.rsvp === 'Maybe') {
            setRsvpStatus(data.rsvp);
          }
        } else {
          setGuest({ id: guestId, name: 'ភ្ញៀវកិត្តិយស / Honored Guest', rsvp: 'Pending', loaded: true });
        }
      })
      .catch(() => {
        setGuest({ id: guestId, name: 'ភ្ញៀវកិត្តិយស / Honored Guest', rsvp: 'Pending', loaded: true });
      });
  }, []);

  // Listen for fullscreen state changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullScreen(false);
    }
  };

  const handleOpenCard = () => {
    setIsOpened(true);
    // Gold & red luxury celebration confetti
    confetti({
      particleCount: 75,
      spread: 80,
      origin: { y: 0.65 },
      colors: ['#ffd700', '#d4af37', '#e11d48', '#fef08a', '#ffffff']
    });
    window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('medium');
    setTimeout(() => {
      invitationRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 200);
  };

  const handleSubmitRSVP = async (statusSelection) => {
    setRsvpStatus(statusSelection);
    setSubmitting(true);

    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          id: guest.id,
          name: guest.name,
          rsvp: statusSelection,
          guestCount: guestCount,
          message: message
        }),
      });

      setSubmitted(true);
      if (statusSelection === 'Attending') {
        confetti({
          particleCount: 120,
          spread: 90,
          origin: { y: 0.6 },
          colors: ['#ffd700', '#d4af37', '#10b981', '#fef08a']
        });
      }
      window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('success');
    } catch (err) {
      alert(lang === 'km' ? 'មានបញ្ហាតភ្ជាប់បណ្តាញ សូមព្យាយាមម្តងទៀត!' : 'Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText("The Premier Centre Sen Sok, Phnom Penh, Cambodia");
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2500);
  };

  const handleNativeShare = async () => {
    const shareData = {
      title: 'សិរីមង្គល ពិធីភ្ជាប់ពាក្យ • Kimsan & Ussa',
      text: `សូមគោរពអញ្ជើញ ${guest.name} ចូលរួមជាអធិបតី និងភ្ញៀវកិត្តិយសក្នុងពិធីភ្ជាប់ពាក្យ សន គឹមសាន្ត & គង់ ឧស្សាហ៍`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled share
      }
    } else {
      handleCopyLink();
    }
  };

  const handleAddToCalendar = () => {
    // Engagement: Sunday, Nov 15, 2026, 07:30 AM to 01:00 PM (UTC+7)
    const title = encodeURIComponent("Engagement Ceremony: Kimsan & Ussa | សិរីមង្គល ពិធីភ្ជាប់ពាក្យ");
    const details = encodeURIComponent("សូមគោរពអញ្ជើញចូលរួមជាអធិបតី និងភ្ញៀវកិត្តិយសក្នុងពិធីភ្ជាប់ពាក្យ សន គឹមសាន្ត & គង់ ឧស្សាហ៍ (San Kimsan & Kong Ussa)");
    const location = encodeURIComponent("The Premier Centre Sen Sok, Phnom Penh, Cambodia");
    const start = "20261115T003000Z"; // 07:30 AM UTC+7
    const end = "20261115T060000Z";   // 01:00 PM UTC+7
    
    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
    window.open(googleCalUrl, '_blank');
  };

  const quickWishes = lang === 'km' ? [
    '💖 សូមជូនពរឱ្យស្រលាញ់គ្នាដល់ចាស់កោងខ្នង',
    '✨ រកស៊ីមានបាន ត្រជាក់ត្រជុំ សុភមង្គលពេញបរិបូរណ៌',
    '🥂 ចូលរួមអបអរសាទរ និងជូនពរឱ្យមានសុខភាពល្អ',
    '🎉 សូមឱ្យគ្រួសារថ្មីពោរពេញដោយភាពកក់ក្តៅជានិច្ច'
  ] : [
    '💖 Wishing you a lifetime of endless love & happiness!',
    '✨ Congratulations on your engagement!',
    '🥂 Best wishes on this wonderful journey ahead!',
    '🎉 So happy for both of you!'
  ];

  return (
    <div className="min-h-screen w-full bg-[#12100e] text-[#3d3126] flex flex-col items-center justify-start relative overflow-x-hidden">
      
      {/* Floating Top Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-40 px-3 sm:px-6 py-2.5 flex items-center justify-between bg-black/50 backdrop-blur-md border-b border-[#d4af37]/25 text-white">
        <div className="flex items-center gap-2">
          <KhmerLotus className="w-5 h-5 text-[#ffd700]" />
          <span className="font-moul text-xs sm:text-sm text-[#ffd700] tracking-wide">
            {lang === 'km' ? 'សិរីមង្គល' : 'Engagement'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Audio Player Toggle */}
          <RomanticAudio isOpened={isOpened} />

          {/* Language Switcher */}
          <button
            onClick={() => setLang(lang === 'km' ? 'en' : 'km')}
            className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-[#d4af37]/40 text-xs font-semibold text-[#fef08a] transition active:scale-95 flex items-center gap-1"
            title="Switch Language"
          >
            <span>{lang === 'km' ? '🇬🇧 EN' : '🇰🇭 ខ្មែរ'}</span>
          </button>

          {/* Full Screen Toggle */}
          <button
            onClick={toggleFullScreen}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-[#d4af37]/40 text-[#fef08a] transition active:scale-95"
            title={isFullScreen ? "Exit Full Screen" : "Full Screen Mode"}
          >
            {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Share Button */}
          <button
            onClick={handleNativeShare}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-[#d4af37]/40 text-[#fef08a] transition active:scale-95"
            title="Share Invitation"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Container: Full width, luxury card styled container */}
      <main className="w-full max-w-xl min-h-screen pt-14 pb-24 px-3 sm:px-4 flex flex-col items-center">

        {/* SCREEN 1: Sealed Royal Khmer Envelope */}
        {!isOpened ? (
          <div className="w-full flex-1 flex flex-col items-center justify-center py-8 animate-fade-in text-center">
            
            {/* The Royal Envelope Card */}
            <div className="w-full max-w-md rounded-3xl bg-gradient-to-b from-[#2a1e17] via-[#1f1712] to-[#17110c] border-2 border-[#d4af37]/60 shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-6 sm:p-8 relative overflow-hidden flex flex-col items-center">
              
              {/* Corner Traditional Ornaments */}
              <div className="absolute top-2 left-2 pointer-events-none opacity-70">
                <KhmerCorner className="w-10 h-10 text-[#d4af37]" />
              </div>
              <div className="absolute top-2 right-2 pointer-events-none opacity-70 rotate-90">
                <KhmerCorner className="w-10 h-10 text-[#d4af37]" />
              </div>
              <div className="absolute bottom-2 left-2 pointer-events-none opacity-70 -rotate-90">
                <KhmerCorner className="w-10 h-10 text-[#d4af37]" />
              </div>
              <div className="absolute bottom-2 right-2 pointer-events-none opacity-70 rotate-180">
                <KhmerCorner className="w-10 h-10 text-[#d4af37]" />
              </div>

              {/* Ceremony Type Heading */}
              <div className="mt-4 space-y-1">
                <p className="font-moul text-sm sm:text-base text-[#ffd700] tracking-wide">
                  សិរីមង្គល ពិធីភ្ជាប់ពាក្យ
                </p>
                <p className="text-xs uppercase tracking-[0.25em] text-[#e6ca65]/80 font-serif">
                  The Engagement Ceremony
                </p>
              </div>

              <KhmerDivider className="my-4" />

              {/* Couple Names in Script & Khmer */}
              <div className="my-3 space-y-1">
                <h1 className="text-3xl sm:text-4xl font-vibes text-gold-bright tracking-wider">
                  Kimsan &amp; Ussa
                </h1>
                <p className="font-moul text-xs sm:text-sm text-stone-300">
                  សន គឹមសាន្ត <span className="text-amber-400">&amp;</span> គង់ ឧស្សាហ៍
                </p>
              </div>

              {/* Auspicious Date Stamp */}
              <div className="my-3 px-4 py-1.5 rounded-full bg-black/40 border border-[#d4af37]/40 text-xs text-[#fef08a] font-medium tracking-wide">
                ថ្ងៃអាទិត្យ ទី១៥ ខែវិច្ឆិកា ឆ្នាំ២០២៦ • 15.11.2026
              </div>

              {/* Personalized Guest Name Box */}
              <div className="w-full my-5 p-4 rounded-2xl bg-gradient-to-r from-[#38281d] via-[#483424] to-[#38281d] border border-[#d4af37]/60 shadow-inner text-center">
                <p className="text-[11px] uppercase tracking-widest text-amber-200/70 mb-1">
                  {lang === 'km' ? 'សូមគោរពអញ្ជើញ / Cordially Invited' : 'Cordially Invited'}
                </p>
                {!guest.loaded ? (
                  <span className="text-xs text-amber-200/50 animate-pulse">
                    កំពុងផ្ទុកធៀបអញ្ជើញ... / Loading invitation...
                  </span>
                ) : (
                  <p className="font-moul text-base sm:text-lg text-[#ffd700] leading-relaxed drop-shadow">
                    {guest.name}
                  </p>
                )}
              </div>

              {/* Realistic Royal Red Wax Seal Button */}
              <div className="mt-4 flex flex-col items-center">
                <button
                  onClick={handleOpenCard}
                  disabled={!guest.loaded}
                  aria-label="Open Invitation Envelope"
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full wax-seal flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 animate-pulse-glow disabled:opacity-50 group"
                >
                  <KhmerLotus className="w-7 h-7 text-amber-200 drop-shadow group-hover:rotate-12 transition-transform" />
                  <span className="text-[10px] font-moul text-amber-100 tracking-wider mt-1">
                    បើកធៀប
                  </span>
                </button>

                <p className="text-xs text-stone-300 mt-4 flex items-center gap-1.5 animate-bounce">
                  <span>ចុចលើត្រាមាសដើម្បីបើកធៀប</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                </p>
              </div>

              {/* Romantic Song Badge */}
              <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/50 border border-[#d4af37]/40 text-[11px] text-amber-200">
                <span className="text-amber-400">🎵</span>
                <span className="font-medium">បទចម្រៀង៖ ភ្ជាប់និស្ស័យ (NISAI) - OLICA ft. KZ</span>
              </div>

              {/* Bottom Subtle Note */}
              <div className="mt-4 text-[10px] text-stone-400 tracking-wider">
                ភ្នំពេញ ព្រះរាជាណាចក�              {/* Couple Hero Photo */}
              <div className="w-full max-w-sm mx-auto my-4 rounded-2xl overflow-hidden border-2 border-[#d4af37] shadow-xl relative aspect-[3/4]">
                <img
                  src="/images/couple-traditional.jpg"
                  alt="San Kimsan and Kong Ussa"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-0 right-0 text-center text-white px-3">
                  <p className="font-vibes text-2xl sm:text-3xl text-amber-200">Kimsan &amp; Ussa</p>
                  <p className="text-[11px] text-stone-200">សន គឹមសាន្ត &amp; គង់ ឧស្សាហ៍</p>
                </div>
              </div>

              {/* Warm Invitation Statement with Guest Honorific */}
              <div className="my-6 space-y-2">
                <p className="text-xs sm:text-sm text-[#5c493a] leading-relaxed">
                  យើងខ្ញុំមានសេចក្តីសោមនស្សរីករាយឥតឧបមា សូមគោរពអញ្ជើញ
                </p>
                <div className="inline-block px-5 py-2.5 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/40 shadow-sm">
                  <p className="font-moul text-base sm:text-lg text-[#996515]">
                    {guest.name}
                  </p>
                </div>
                <p className="text-xs sm:text-sm text-[#5c493a] leading-relaxed pt-1">
                  ចូលរួមជាអធិបតី និងជាភ្ញៀវកិត្តិយស ក្នុងពិធីភ្ជាប់ពាក្យកូនប្រុស-កូនស្រីរបស់យើងខ្ញុំ
                  ដើម្បីប្រសិទ្ធពរជ័យ សិរីសួស្តី ជ័យមង្គល ដល់គូដណ្តឹងថ្មី។
                </p>
              </div>

              <KhmerDivider className="my-4" />

              {/* Traditional Cambodian Parents Section (មាតាបិតាទាំងសងខាង) */}
              <div className="my-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#8c7355] mb-4">
                  {lang === 'km' ? '— មាតាបិតាទាំងសងខាង —' : '— With the Blessings of Our Parents —'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                  {/* Groom's Family */}
                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-[#d4af37]/30 shadow-sm space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#b8860b]/15 text-[#b8860b]">
                      មាតាបិតាខាងប្រុស / Groom's Parents
                    </span>
                    <p className="text-xs text-stone-600 pt-1.5">ឪពុក៖ <span className="font-semibold text-stone-800">លោក សន ស៊ីម (San Sim)</span></p>
                    <p className="text-xs text-stone-600">ម្តាយ៖ <span className="font-semibold text-stone-800">លោកស្រី តូច សាវី (Toch Savy)</span></p>
                    <div className="pt-2 border-t border-amber-200/60">
                      <p className="text-xs text-stone-500">កូនប្រុសនាម៖</p>
                      <p className="font-moul text-sm text-[#996515]">សន គឹមសាន្ត (Kimsan)</p>
                    </div>
                  </div>

                  {/* Bride's Family */}
                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-[#d4af37]/30 shadow-sm space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#b8860b]/15 text-[#b8860b]">
                      មាតាបិតាខាងស្រី / Bride's Parents
                    </span>
                    <p className="text-xs text-stone-600 pt-1.5">ឪពុក៖ <span className="font-semibold text-stone-800">លោក គង់ សុវណ្ណ</span></p>
                    <p className="text-xs text-stone-600">ម្តាយ៖ <span className="font-semibold text-stone-800">លោកស្រី អ៊ុំ សារ៉េត</span></p>
                    <div className="pt-2 border-t border-amber-200/60">
                      <p className="text-xs text-stone-500">កូនស្រីនាម៖</p>
                      <p className="font-moul text-sm text-[#996515]">គង់ ឧស្សាហ៍ (Ussa)</p>
                    </div>
                  </div>
                </div>
              </div> className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                  {/* Groom's Family */}
                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-[#d4af37]/30 shadow-sm space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#b8860b]/15 text-[#b8860b]">
                      មាតាបិតាខាងប្រុស / Groom's Side
                    </span>
                    <p className="text-xs text-stone-600 pt-1.5">ឪពុក៖ <span className="font-semibold text-stone-800">លោក ជា សុខេង</span></p>
                    <p className="text-xs text-stone-600">ម្តាយ៖ <span className="font-semibold text-stone-800">លោកស្រី គង់ សុផល</span></p>
                    <div className="pt-2 border-t border-amber-200/60">
                      <p className="text-xs text-stone-500">កូនប្រុសនាម៖</p>
                      <p className="font-moul text-sm text-[#996515]">ជា គឹមស្រ៊ី (Kimsry)</p>
                    </div>
                  </div>

                  {/* Bride's Family */}
                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-[#d4af37]/30 shadow-sm space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#b8860b]/15 text-[#b8860b]">
                      មាតាបិតាខាងស្រី / Bride's Side
                    </span>
                    <p className="text-xs text-stone-600 pt-1.5">ឪពុក៖ <span className="font-semibold text-stone-800">លោក ហេង វិបុល</span></p>
                    <p className="text-xs text-stone-600">ម្តាយ៖ <span className="font-semibold text-stone-800">លោកស្រី ចាន់ ធីតា</span></p>
                    <div className="pt-2 border-t border-amber-200/60">
                      <p className="text-xs text-stone-500">កូនស្រីនាម៖</p>
                      <p className="font-moul text-sm text-[#996515]">ហេង សុខលីន (Soklin)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Auspicious Ceremony Date & Time */}
              <div className="my-6 p-4 rounded-2xl bg-gradient-to-r from-amber-100/60 via-amber-50 to-amber-100/60 border border-[#d4af37]/50 text-center space-y-1 shadow-sm">
                <p className="text-xs uppercase tracking-widest text-[#8c7355] font-semibold">
                  {lang === 'km' ? 'កាលបរិច្ឆេទនៃពិធីមង្គល' : 'Auspicious Ceremony Date'}
                </p>
                <p className="font-moul text-base sm:text-lg text-[#3d3126]">
                  ថ្ងៃអាទិត្យ ទី១៥ ខែវិច្ឆិកា ឆ្នាំ២០២៦
                </p>
                <p className="text-xs sm:text-sm text-[#78500c] font-medium">
                  Sunday, November 15, 2026 • វេលាម៉ោង ០៧:៣០ ព្រឹក
                </p>
              </div>

              {/* Live Countdown Timer */}
              <CountdownTimer lang={lang} />

              {/* Add to Calendar Button */}
              <div className="flex justify-center mt-3">
                <button
                  onClick={handleAddToCalendar}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-900 text-[#ffd700] hover:bg-stone-800 text-xs font-semibold border border-[#d4af37]/40 shadow transition active:scale-95"
                >
                  <CalendarPlus className="w-4 h-4 text-amber-400" />
                  <span>{lang === 'km' ? 'កត់ត្រាក្នុងប្រតិទិន (Add to Calendar)' : 'Add to Calendar'}</span>
                </button>
              </div>
            </div>

            {/* Traditional Cambodian Engagement Agenda (កម្មវិធីមង្គល) */}
            <div className="w-full rounded-3xl bg-[#faf7f2] border-2 border-[#d4af37]/50 shadow-2xl p-5 sm:p-8 text-[#3d3126]">
              <div className="text-center space-y-1 mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[#b8860b] text-xs font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{lang === 'km' ? 'ពេលវេលាកម្មវិធី' : 'Event Schedule'}</span>
                </div>
                <h3 className="font-moul text-xl sm:text-2xl text-[#3d3126]">
                  កម្មវិធីមង្គលភ្ជាប់ពាក្យ
                </h3>
                <p className="text-xs sm:text-sm text-[#8c7355]">
                  {lang === 'km' ? 'កាលវិភាគលម្អិតនៃពិធីមង្គល' : 'Ceremony Agenda & Timeline'}
                </p>
              </div>

              {/* Timeline Items */}
              <div className="space-y-4 max-w-md mx-auto">
                {[
                  {
                    time: '07:00 AM',
                    titleKm: 'ពិធីជួបជុំភ្ញៀវកិត្តិយស',
                    titleEn: 'Guest Welcome & Morning Refreshments',
                    descKm: 'ជួបជុំភ្ញៀវកិត្តិយស ពិសាតែ កាហ្វេ និងរៀបចំជំនូន',
                    descEn: 'Welcoming honored guests and preparing gift trays'
                  },
                  {
                    time: '07:30 AM',
                    titleKm: 'ពិធីហែជំនូនចូលគេហដ្ឋាន',
                    titleEn: 'Traditional Groom Gift Procession',
                    descKm: 'ក្បួនហែជំនូនចូលគេហដ្ឋាន និងរាប់ផ្លែឈើជំនូន',
                    descEn: 'Traditional procession presenting engagement offerings'
                  },
                  {
                    time: '08:30 AM',
                    titleKm: 'ពិធីបំពាក់ចិញ្ចៀនភ្ជាប់ពាក្យ',
                    titleEn: 'Engagement Ring Exchange Ceremony',
                    descKm: 'គូដណ្តឹងទាំងពីរបំពាក់ចិញ្ចៀនជាសក្ខីភាពនៃក្តីស្រលាញ់',
                    descEn: 'Exchange of engagement rings and formal blessings'
                  },
                  {
                    time: '09:30 AM',
                    titleKm: 'ពិធីសំពះផ្ទឹម និងចងដៃប្រសិទ្ធពរជ័យ',
                    titleEn: 'Blessing & Hand-Tying Ceremony',
                    descKm: 'មាតាបិតា និងភ្ញៀវកិត្តិយសចងអំបោះក្រហមប្រសិទ្ធពរជ័យ',
                    descEn: 'Traditional thread-tying blessings by elders & guests'
                  },
                  {
                    time: '11:30 AM',
                    titleKm: 'ពិធីទទួលទានអាហារថ្ងៃត្រង់',
                    titleEn: 'Celebration Luncheon & Banquet',
                    descKm: 'ពិធីជប់លៀងទទួលទានអាហារថ្ងៃត្រង់ និងថតរូបអនុស្សាវរីយ៍',
                    descEn: 'Festive dining, family photo sessions, and music'
                  }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white border border-[#d4af37]/30 shadow-sm">
                    <div className="px-2.5 py-1.5 rounded-xl bg-[#b8860b]/15 border border-[#b8860b]/30 text-[#b8860b] font-serif font-bold text-xs shrink-0 mt-0.5">
                      {item.time}
                    </div>
                    <div className="flex-1 space-y-0.5">
                      <h4 className="font-moul text-xs sm:text-sm text-[#3d3126]">
                        {lang === 'km' ? item.titleKm : item.titleEn}
                      </h4>
                      <p className="text-xs text-[#78500c]">
                        {lang === 'km' ? item.descKm : item.descEn}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Venue & Interactive Navigation (ទីតាំងកម្មវិធី) */}
            <div className="w-full rounded-3xl bg-[#faf7f2] border-2 border-[#d4af37]/50 shadow-2xl p-5 sm:p-8 text-[#3d3126]">
              <div className="text-center space-y-1 mb-5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[#b8860b] text-xs font-medium">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{lang === 'km' ? 'ទីតាំងកម្មវិធី' : 'Location & Venue'}</span>
                </div>
                <h3 className="font-moul text-xl sm:text-2xl text-[#3d3126]">
                  {lang === 'km' ? 'ទីតាំងប្រារព្ធពិធី' : 'Ceremony Venue'}
                </h3>
                <p className="text-sm font-semibold text-[#996515]">
                  The Premier Centre Sen Sok (ដឹ ព្រេមៀ សែនសុខ)
                </p>
                <p className="text-xs text-stone-500">
                  Phnom Penh, Kingdom of Cambodia
                </p>
              </div>

              {/* Navigation Action Buttons (Google Maps & Waze - Very common in Cambodia!) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto my-4">
                <a
                  href="https://maps.google.com/?q=The+Premier+Centre+Sen+Sok+Phnom+Penh"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#b8860b] hover:bg-[#996515] text-white text-xs sm:text-sm font-semibold shadow-md active:scale-95 transition"
                >
                  <MapPin className="w-4 h-4 text-amber-200" />
                  <span>Google Maps</span>
                </a>

                <a
                  href="https://waze.com/ul?q=The+Premier+Centre+Sen+Sok"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-sky-700 hover:bg-sky-800 text-white text-xs sm:text-sm font-semibold shadow-md active:scale-95 transition"
                >
                  <Compass className="w-4 h-4 text-sky-200" />
                  <span>Waze Navigation</span>
                </a>
              </div>

              {/* Copy Address Button */}
              <div className="text-center pt-1">
                <button
                  onClick={handleCopyAddress}
                  className="inline-flex items-center gap-1.5 text-xs text-[#8c7355] hover:text-[#996515] underline decoration-dotted underline-offset-4"
                >
                  {copiedAddress ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedAddress ? (lang === 'km' ? 'បានចម្លងអាសយដ្ឋាន!' : 'Address Copied!') : (lang === 'km' ? 'ចម្លងអាសយដ្ឋានទីតាំង' : 'Copy Venue Address')}</span>
                </button>
              </div>
            </div>

            {/* Pre-wedding Photo Gallery */}
            <div className="w-full rounded-3xl bg-[#faf7f2] border-2 border-[#d4af37]/50 shadow-2xl p-5 sm:p-8">
              <PhotoGallery lang={lang} />
            </div>

            {/* Trending in Cambodia: Digital Angpao / Gift via KHQR Card Banner */}
            <div className="w-full rounded-3xl bg-gradient-to-r from-[#2c1712] via-[#3a1d17] to-[#2c1712] border-2 border-[#d4af37]/70 shadow-2xl p-6 sm:p-8 text-center text-white relative overflow-hidden">
              <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center mb-3 shadow-lg border border-amber-200/50">
                <Gift className="w-6 h-6 text-amber-950" />
              </div>

              <h3 className="font-moul text-lg sm:text-xl text-[#ffd700] mb-1">
                {lang === 'km' ? 'ស្រោមសំបុត្រ ឬ ទឹកប្រាក់ចងដៃ' : 'Digital Wedding Gift & Angpao'}
              </h3>
              <p className="text-xs text-amber-100/80 max-w-sm mx-auto mb-4 leading-relaxed">
                {lang === 'km'
                  ? 'វត្តមានរបស់លោកអ្នកជាកិត្តិយសដ៏ធំធេងបំផុត។ លោកអ្នកក៏អាចផ្ញើពាក្យជូនពរ និងទឹកប្រាក់ចងដៃតាម KHQR ផងដែរ។'
                  : 'Your presence is our greatest honor. You may also send your blessings and digital Angpao via KHQR.'}
              </p>

              <button
                onClick={() => setShowGiftModal(true)}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-amber-950 font-bold text-xs sm:text-sm shadow-xl hover:brightness-110 active:scale-95 transition flex items-center gap-2 mx-auto"
              >
                <Gift className="w-4 h-4" />
                <span>{lang === 'km' ? 'ស្កេន KHQR / ABA Pay' : 'Scan KHQR / ABA Pay'}</span>
              </button>
            </div>

            {/* Enhanced RSVP Form Section */}
            <div ref={rsvpSectionRef} id="rsvp-section" className="w-full rounded-3xl bg-[#faf7f2] border-2 border-[#d4af37]/50 shadow-2xl p-5 sm:p-8 text-[#3d3126]">
              <div className="text-center space-y-1 mb-5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[#b8860b] text-xs font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>RSVP</span>
                </div>
                <h3 className="font-moul text-xl sm:text-2xl text-[#3d3126]">
                  {lang === 'km' ? 'ឆ្លើយតបការចូលរួម (RSVP)' : 'Confirm Your Attendance'}
                </h3>
                <p className="text-xs sm:text-sm text-[#8c7355]">
                  {lang === 'km'
                    ? 'សូមបញ្ជាក់ការចូលរួមដើម្បីជួយសម្រួលដល់ការរៀបចំកន្លែងទទួលភ្ញៀវ'
                    : 'Kindly let us know if you can attend to help us prepare your seat'}
                </p>
              </div>

              {submitted ? (
                <div className="py-6 text-center space-y-3 bg-emerald-50/80 border border-emerald-200 rounded-2xl p-5">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <p className="font-moul text-base text-emerald-900">
                    {lang === 'km' ? 'សូមអរគុណសម្រាប់ការឆ្លើយតប!' : 'Thank you for your response!'}
                  </p>
                  <p className="text-xs text-stone-600">
                    {lang === 'km' ? 'ការឆ្លើយតបរបស់អ្នកត្រូវបានកត់ត្រាជោគជ័យ៖ ' : 'Recorded status: '}
                    <span className="font-bold text-[#b8860b]">{rsvpStatus}</span>
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs text-[#b8860b] underline hover:text-[#996515] pt-2"
                  >
                    {lang === 'km' ? 'កែប្រែការឆ្លើយតប' : 'Update Response'}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  
                  {/* Companion / Number of Seats Option */}
                  <div>
                    <label className="block text-xs font-semibold text-[#5c493a] mb-2 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#b8860b]" />
                      <span>{lang === 'km' ? 'ចំនួនអ្នកចូលរួម (Number of Guests)' : 'Number of Guests'}</span>
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {['1', '2', '3', '4+'].map((count) => (
                        <button
                          key={count}
                          type="button"
                          onClick={() => setGuestCount(count)}
                          className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                            guestCount === count
                              ? 'bg-[#b8860b] text-white border-[#b8860b] shadow'
                              : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                          }`}
                        >
                          {count} {lang === 'km' ? 'នាក់' : (count === '1' ? 'Guest' : 'Guests')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quick Blessing Tags */}
                  <div>
                    <label className="block text-xs font-semibold text-[#5c493a] mb-2 flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-rose-500" />
                      <span>{lang === 'km' ? 'ជ្រើសរើសពាក្យជូនពររហ័ស (Quick Blessings)' : 'Quick Blessing Suggestions'}</span>
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {quickWishes.map((wish, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setMessage(wish)}
                          className="text-[11px] py-1.5 px-3 rounded-full bg-white hover:bg-amber-50 text-stone-700 border border-amber-200/80 transition active:scale-95 text-left"
                        >
                          {wish}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message Input Area */}
                  <div>
                    <label className="block text-xs font-semibold text-[#5c493a] mb-1">
                      {lang === 'km' ? 'សារប្រសិទ្ធពរជ័យដល់គូដណ្តឹង' : 'Your Blessings & Wishes'}
                    </label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={lang === 'km' ? 'សរសេរសារជូនពរ ឬកំណត់សម្គាល់ពិសេស...' : 'Write your warm blessings for the couple...'}
                      className="w-full rounded-xl border border-[#d4af37]/40 bg-white p-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#b8860b]"
                    />
                  </div>

                  {/* Attendance Choice Buttons (3 Options: Attending, Declined, Maybe) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                    <button
                      disabled={submitting}
                      onClick={() => handleSubmitRSVP('Attending')}
                      className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-[#b8860b] hover:bg-[#996515] text-white text-xs sm:text-sm font-semibold shadow active:scale-95 transition disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                      <span>{lang === 'km' ? 'ចូលរួម (Will Attend)' : 'Will Attend'}</span>
                    </button>

                    <button
                      disabled={submitting}
                      onClick={() => handleSubmitRSVP('Maybe')}
                      className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs sm:text-sm font-semibold border border-amber-300 shadow-sm active:scale-95 transition disabled:opacity-50"
                    >
                      <HelpCircle className="w-4 h-4 text-amber-600" />
                      <span>{lang === 'km' ? 'ប្រហែល (Maybe)' : 'Tentative'}</span>
                    </button>

                    <button
                      disabled={submitting}
                      onClick={() => handleSubmitRSVP('Declined')}
                      className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs sm:text-sm font-semibold active:scale-95 transition disabled:opacity-50"
                    >
                      <XCircle className="w-4 h-4 text-stone-500" />
                      <span>{lang === 'km' ? 'មិនអាច (Decline)' : 'Cannot Attend'}</span>
                    </button>
                  </div>

                  {submitting && (
                    <p className="text-xs text-center text-amber-600 animate-pulse">
                      {lang === 'km' ? 'កំពុងបញ្ជូនចម្លើយ...' : 'Submitting your RSVP...'}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Footer Blessing & Credits */}
            <footer className="text-center py-8 text-stone-400 space-y-2">
              <KhmerLotus className="w-6 h-6 text-[#d4af37] mx-auto opacity-70" />
              <p className="font-moul text-xs text-amber-200/80">
                សូមថ្លែងអំណរគុណយ៉ាងជ្រាលជ្រៅចំពោះវត្តមានដ៏ឧត្តុង្គឧត្តម
              </p>
              <p className="text-[11px] text-stone-400 font-serif">
                Kimsry &amp; Soklin Engagement • Phnom Penh, Cambodia 2026
              </p>
            </footer>

          </div>
        )}

      </main>

      {/* Floating Bottom Navigation Dock (Active when invitation is opened) */}
      {isOpened && (
        <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 px-3 py-2 rounded-full bg-stone-950/85 backdrop-blur-lg border border-[#d4af37]/40 shadow-2xl flex items-center gap-2 text-white text-xs">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="p-2 rounded-full hover:bg-white/10 text-amber-300 transition"
            title="Scroll to Top"
          >
            <Sparkles className="w-4 h-4" />
          </button>

          <div className="w-[1px] h-4 bg-stone-700" />

          <button
            onClick={() => rsvpSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#b8860b] text-white font-medium hover:bg-[#996515] transition active:scale-95 shadow"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>RSVP</span>
          </button>

          <button
            onClick={() => setShowGiftModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-800 hover:bg-stone-700 text-[#ffd700] border border-[#d4af37]/40 font-medium transition active:scale-95"
          >
            <Gift className="w-3.5 h-3.5" />
            <span>{lang === 'km' ? 'ចងដៃ' : 'Gift'}</span>
          </button>

          <div className="w-[1px] h-4 bg-stone-700" />

          <button
            onClick={handleNativeShare}
            className="p-2 rounded-full hover:bg-white/10 text-stone-300 transition"
            title="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* KHQR / ABA Digital Angpao Modal */}
      <GiftAngpaoModal
        isOpen={showGiftModal}
        onClose={() => setShowGiftModal(false)}
        lang={lang}
      />

    </div>
  );
}