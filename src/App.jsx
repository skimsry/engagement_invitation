import { useEffect, useState, useRef } from 'react';
import confetti from 'canvas-confetti';

import Header from './components/Header';
import InvitationCover from './components/InvitationCover';
import InvitationOpening from './components/InvitationOpening';
import HeroSection from './components/HeroSection';
import EventSchedule from './components/EventSchedule';
import VenueSection from './components/VenueSection';
import PhotoGallery from './components/PhotoGallery';
import GiftBanner from './components/GiftBanner';
import RsvpSection from './components/RsvpSection';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav';
import GiftAngpaoModal from './components/GiftAngpaoModal';

// Google Apps Script Web App URL from original implementation
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzLMSWSdHf9ArnCzpB4CIapF7UkcDCHyUfW6jm0U1Wn-HmrEeD2yTk2C-zrNvtsnwQJpQ/exec";

export default function App() {
  const [guest, setGuest] = useState({ id: '', name: 'ឯកឧត្តម / លោកជំទាវ / លោក / លោកស្រី', rsvp: 'Pending', loaded: false });
  const [isOpened, setIsOpened] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [rsvpStatus, setRsvpStatus] = useState('');
  const [guestCount, setGuestCount] = useState('1');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [lang, setLang] = useState('km'); // 'km' or 'en'
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  const invitationRef = useRef(null);
  const rsvpSectionRef = useRef(null);

  // Initialize Telegram Mini App & parse URL query params
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      if (typeof tg.requestFullscreen === 'function') {
        try {
          tg.requestFullscreen();
        } catch (e) {
          // ignore if not supported in older tg clients
        }
      }
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
      setGuest({ id: 'demo', name: '', rsvp: 'Pending', loaded: true });
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

  const enterFullScreen = () => {
    const elem = document.documentElement;
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen({ navigationUI: "hide" }).catch(() => {
          elem.requestFullscreen().catch(() => { });
        });
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
    }
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      if (typeof tg.requestFullscreen === 'function') {
        try {
          tg.requestFullscreen();
        } catch (e) { }
      }
      if (typeof tg.expand === 'function') {
        try {
          tg.expand();
        } catch (e) { }
      }
    }
  };

  const exitFullScreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => { });
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
    if (window.Telegram?.WebApp?.exitFullscreen) {
      try {
        window.Telegram.WebApp.exitFullscreen();
      } catch (e) { }
    }
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      enterFullScreen();
      setIsFullScreen(true);
    } else {
      exitFullScreen();
      setIsFullScreen(false);
    }
  };

  // Listen for fullscreen state changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(Boolean(document.fullscreenElement || document.webkitFullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Default loading is full screen
  useEffect(() => {
    enterFullScreen();

    const onFirstInteraction = () => {
      enterFullScreen();
      window.removeEventListener('click', onFirstInteraction);
      window.removeEventListener('touchstart', onFirstInteraction);
      window.removeEventListener('pointerdown', onFirstInteraction);
    };

    window.addEventListener('click', onFirstInteraction, { once: true });
    window.addEventListener('touchstart', onFirstInteraction, { once: true });
    window.addEventListener('pointerdown', onFirstInteraction, { once: true });

    return () => {
      window.removeEventListener('click', onFirstInteraction);
      window.removeEventListener('touchstart', onFirstInteraction);
      window.removeEventListener('pointerdown', onFirstInteraction);
    };
  }, []);

  const handleOpenCard = () => {
    enterFullScreen();
    window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('medium');
    setIsOpening(true);
  };

  const handleOpeningComplete = () => {
    setIsOpening(false);
    setIsOpened(true);
    confetti({
      particleCount: 85,
      spread: 85,
      origin: { y: 0.6 },
      colors: ['#ffd700', '#d4af37', '#e11d48', '#fef08a', '#ffffff']
    });
    window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('success');
    setTimeout(() => {
      invitationRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
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

  const handleCopyAddress = () => {
    navigator.clipboard.writeText("The Premier Centre Sen Sok, Phnom Penh, Cambodia");
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2500);
  };

  const handleNativeShare = async () => {
    const shareData = {
      title: 'សិរីមង្គល ពិធីភ្ជាប់ពាក្យ • Kimsan & Ussa',
      text: `សូមគោរពអញ្ជើញ ${guest.name} ចូលរួមជាអធិបតី និងភ្ញៀវកិត្តិយសក្នុងពិធីភ្ជាប់ពាក្យ`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled share
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert(lang === 'km' ? 'បានចម្លងតំណភ្ជាប់សំបុត្រអញ្ជើញ!' : 'Invitation link copied!');
    }
  };

  const handleAddToCalendar = () => {
    const title = encodeURIComponent("Engagement Ceremony: Kimsry & Soklin | សិរីមង្គល ពិធីភ្ជាប់ពាក្យ");
    const details = encodeURIComponent("សូមគោរពអញ្ជើញចូលរួមជាអធិបតី និងភ្ញៀវកិត្តិយសក្នុងពិធីភ្ជាប់ពាក្យ សន គឹមសាន្ត & គង់ ឧស្សាហ៍ (San Kimsan & Kong Ussa)");
    const location = encodeURIComponent("The Premier Centre Sen Sok, Phnom Penh, Cambodia");
    const start = "20261115T003000Z";
    const end = "20261115T060000Z";

    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
    window.open(googleCalUrl, '_blank');
  };

  const quickWishes = lang === 'km' ? [
    '💖 សូមជូនពរឱ្យស្រលាញ់គ្នាដល់ចាស់កោងខ្នង',
    '✨ រកស៊ីមានបាន ត្រជាក់ត្រជុំ សុភមង្គលពេញបរិបូរណ៌',
    '🥂 សូមចូលរួមអបអរសាទរ និងជូនពរឱ្យមានសុខភាពល្អ',
    '🎉 សូមឱ្យគ្រួសារថ្មីពោរពេញដោយភាពកក់ក្តៅជានិច្ច'
  ] : [
    '💖 Wishing you a lifetime of endless love & happiness!',
    '✨ Congratulations on your engagement!',
    '🥂 Best wishes on this wonderful journey ahead!',
    '🎉 So happy for both of you!'
  ];

  return (
    <div className="min-h-screen w-full bg-[#12100e] text-[#3d3126] flex flex-col items-center justify-start relative overflow-x-hidden">

      {/* Radial Menu Navigation at Top-Right */}
      <Header
        lang={lang}
        setLang={setLang}
        isOpened={isOpened}
        isFullScreen={isFullScreen}
        toggleFullScreen={toggleFullScreen}
        onShare={handleNativeShare}
      />

      {/* Cinematic Angkor Gate Opening Animation Overlay (Works only one time) */}
      {isOpening && (
        <InvitationOpening
          guest={guest}
          lang={lang}
          onComplete={handleOpeningComplete}
        />
      )}

      {/* Main Container: Full screen on mobile, luxury centered card on PC */}
      <main className={`w-full ${!isOpened ? 'min-h-[100dvh] pt-0 pb-0 px-0 sm:pt-4 sm:pb-16 sm:px-4 sm:max-w-xl' : 'max-w-xl min-h-screen pt-4 pb-28 px-0 sm:px-4'} flex flex-col items-center`}>

        {/* SCREEN 1: Immersive Fullscreen Cover on Mobile / Luxury Card on PC */}
        {!isOpened ? (
          <InvitationCover
            isOpened={isOpened}
            lang={lang}
            onOpenCard={handleOpenCard}
          />
        ) : (
          /* SCREEN 2: Full Modern Cambodian Luxury Invitation */
          <div ref={invitationRef} className="w-full space-y-4 sm:space-y-6 animate-fade-in">
            {/* Top Luxury Banner & Couple Hero */}
            <HeroSection
              guest={guest}
              lang={lang}
              onAddToCalendar={handleAddToCalendar}
            />

            {/* Traditional Cambodian Engagement Agenda */}
            <EventSchedule lang={lang} />

            {/* Venue & Interactive Navigation */}
            <VenueSection
              lang={lang}
              copiedAddress={copiedAddress}
              onCopyAddress={handleCopyAddress}
            />

            {/* Pre-wedding Photo Gallery */}
            <div className="w-full rounded-none sm:rounded-3xl bg-[#faf7f2] border-y sm:border-2 border-[#d4af37]/50 shadow-2xl p-5 sm:p-8">
              <PhotoGallery lang={lang} />
            </div>

            {/* Digital Angpao / Gift via KHQR Card Banner */}
            <GiftBanner
              lang={lang}
              onOpenGiftModal={() => setShowGiftModal(true)}
            />

            {/* Enhanced RSVP Form Section */}
            <RsvpSection
              ref={rsvpSectionRef}
              lang={lang}
              submitted={submitted}
              setSubmitted={setSubmitted}
              rsvpStatus={rsvpStatus}
              guestCount={guestCount}
              setGuestCount={setGuestCount}
              message={message}
              setMessage={setMessage}
              quickWishes={quickWishes}
              submitting={submitting}
              onSubmitRSVP={handleSubmitRSVP}
            />

            {/* Footer Blessing & Credits */}
            <Footer />
          </div>
        )}

      </main>

      {/* Floating Bottom Navigation Dock */}
      {isOpened && (
        <BottomNav
          lang={lang}
          onScrollToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          onScrollToRsvp={() => rsvpSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
          onOpenGiftModal={() => setShowGiftModal(true)}
          onShare={handleNativeShare}
        />
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