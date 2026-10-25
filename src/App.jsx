import { useEffect, useState, useRef, lazy, Suspense } from 'react';

import Header from './components/Header';
import InvitationCover from './components/InvitationCover';
import InvitationOpening from './components/InvitationOpening';

// Lazy loaded Screen 2 components for instant initial cover render
const HeroSection = lazy(() => import('./components/HeroSection'));
const EventSchedule = lazy(() => import('./components/EventSchedule'));
const VenueSection = lazy(() => import('./components/VenueSection'));
const PhotoGallery = lazy(() => import('./components/PhotoGallery'));
const VideoSection = lazy(() => import('./components/VideoSection'));
const GiftBanner = lazy(() => import('./components/GiftBanner'));
const RsvpSection = lazy(() => import('./components/RsvpSection'));
const Footer = lazy(() => import('./components/Footer'));
const BottomNav = lazy(() => import('./components/BottomNav'));
const GiftAngpaoModal = lazy(() => import('./components/GiftAngpaoModal'));
const InvitationCrud = lazy(() => import('./components/InvitationCrud'));

// Helper for dynamic confetti import
const fireConfetti = async (options) => {
  try {
    const confetti = (await import('canvas-confetti')).default;
    confetti(options);
  } catch (err) {
    // Graceful fallback if confetti fails
  }
};

// Prefetch Screen 2 chunks on idle or when opening
const prefetchScreen2 = () => {
  import('./components/HeroSection');
  import('./components/EventSchedule');
  import('./components/VenueSection');
  import('./components/PhotoGallery');
  import('./components/VideoSection');
  import('./components/GiftBanner');
  import('./components/RsvpSection');
  import('./components/Footer');
  import('./components/BottomNav');
  import('./components/GiftAngpaoModal');
  import('canvas-confetti');
};

// Check if URL matches CRUD route
const checkIsCrudRoute = () => {
  if (typeof window === 'undefined') return false;
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  const search = window.location.search.toLowerCase();
  return (
    path === '/crud' || path.startsWith('/crud/') ||
    path === '/admin' || path.startsWith('/admin/') ||
    path === '/invitations' || path.startsWith('/invitations/') ||
    hash === '#crud' || hash === '#/crud' || hash === '#/admin' ||
    search.includes('route=crud') || search.includes('page=crud') || search.includes('admin=true')
  );
};

// Google Apps Script Web App URL from original implementation
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzLMSWSdHf9ArnCzpB4CIapF7UkcDCHyUfW6jm0U1Wn-HmrEeD2yTk2C-zrNvtsnwQJpQ/exec";

export default function App() {
  const [currentRoute, setCurrentRoute] = useState(() => {
    return checkIsCrudRoute() ? 'crud' : 'invitation';
  });
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
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);

  const invitationRef = useRef(null);
  const rsvpSectionRef = useRef(null);

  // Helper to switch routes
  const navigateTo = (route) => {
    if (route === 'crud') {
      const url = new URL(window.location.href);
      url.searchParams.set('route', 'crud');
      window.history.pushState({}, '', url.toString());
      setCurrentRoute('crud');
      window.scrollTo({ top: 0, behavior: 'instant' });
    } else {
      const url = new URL(window.location.href);
      url.searchParams.delete('route');
      url.searchParams.delete('page');
      url.searchParams.delete('admin');
      const newPath = (window.location.pathname.includes('/crud') || window.location.pathname.includes('/admin')) ? '/' : window.location.pathname;
      window.history.pushState({}, '', newPath + (url.search ? url.search : ''));
      setCurrentRoute('invitation');
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  // Listen to popstate and hashchange for browser navigation
  useEffect(() => {
    const handleRouteChange = () => {
      setCurrentRoute(checkIsCrudRoute() ? 'crud' : 'invitation');
    };
    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('hashchange', handleRouteChange);
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('hashchange', handleRouteChange);
    };
  }, []);

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

  // Default loading is full screen and idle prefetch of Screen 2
  useEffect(() => {
    enterFullScreen();

    // Prefetch heavy components during idle time
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const idleId = window.requestIdleCallback(() => prefetchScreen2(), { timeout: 3500 });
      return () => window.cancelIdleCallback(idleId);
    } else {
      const timer = setTimeout(() => prefetchScreen2(), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const onFirstInteraction = () => {
      enterFullScreen();
      prefetchScreen2();
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
    prefetchScreen2();
    window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('medium');
    setIsHeaderHidden(true);
    setIsOpening(true);
  };

  const handleOpeningComplete = () => {
    setIsOpening(false);
    setIsOpened(true);
    setIsHeaderHidden(false);
    fireConfetti({
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

  const handleSubmitRSVP = async (statusSelection, customName) => {
    setRsvpStatus(statusSelection || 'Attending');
    setSubmitting(true);

    const hasId = Boolean(
      (guest?.id && guest.id !== 'demo' && guest.id !== '') ||
      (guest?.name && guest.name.trim() !== '' && guest.name !== 'ឯកឧត្តម / លោកជំទាវ / លោក / លោកស្រី' && guest.name !== 'ភ្ញៀវកិត្តិយស / Honored Guest') ||
      (typeof window !== 'undefined' && Boolean(
        new URLSearchParams(window.location.search).get('guest') ||
        new URLSearchParams(window.location.search).get('to') ||
        new URLSearchParams(window.location.search).get('name') ||
        window.Telegram?.WebApp?.initDataUnsafe?.start_param
      ))
    );

    const senderName = customName?.trim() || guest.name || (lang === 'km' ? 'ភ្ញៀវកិត្តិយស' : 'Honored Guest');

    try {
      const payload = hasId
        ? {
          id: guest.id,
          name: guest.name,
          rsvp: statusSelection || 'Attending',
          guestCount: guestCount,
          message: message
        }
        : {
          action: 'create',
          name: senderName,
          rsvp: statusSelection || 'Wishes',
          guestCount: '1',
          message: message
        };

      await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
      });

      setSubmitted(true);
      fireConfetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#ffd700', '#d4af37', '#10b981', '#fef08a']
      });
      window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('success');
      return { success: true, name: senderName, message: message };
    } catch (err) {
      alert(lang === 'km' ? 'មានបញ្ហាតភ្ជាប់បណ្តាញ សូមព្យាយាមម្តងទៀត!' : 'Network error. Please try again.');
      return { success: false };
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyAddress = () => {
    const venue = getStoredWeddingConfig().venue;
    const addressToCopy = (lang === 'km' ? venue?.addressKm : venue?.addressEn) || "ភូមិផ្សារឃ្លាំង ឃុំកំពង់ឃ្លាំង ស្រុកសូទ្រនិគម ខេត្តសៀមរាប";
    navigator.clipboard.writeText(addressToCopy);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2500);
  };

  const handleNativeShare = async () => {
    const shareData = {
      title: 'សិរីមង្គល ពិធីចូលចែចូវ • Kimsan & Ussa',
      text: `សូមគោរពអញ្ជើញ ${guest.name} ចូលរួមជាអធិបតី និងភ្ញៀវកិត្តិយសក្នុងពិធីចូលចែចូវ`,
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
    const title = encodeURIComponent("Engagement Ceremony: Kimsan & Uysang | សិរីមង្គល ពិធីចូលចែចូវ");
    const details = encodeURIComponent("សូមគោរពអញ្ជើញចូលរួមជាអធិបតី និងភ្ញៀវកិត្តិយសក្នុងពិធីចូលចែចូវ សន គឹមសាន្ត & ង៉ោ អូយសាំង (SORN KIMSAN & NGO Uysang)");
    const location = encodeURIComponent("Phsar Khlang Village, Kampong Khleang Commune, Sot Nikum District, Siem Reap Province");
    const start = "20261122T003000Z";
    const end = "20261122T060000Z";

    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
    window.open(googleCalUrl, '_blank');
  };

  // Reset back to initial cover screen (first load)
  const handleExitApp = () => {
    setIsOpened(false);
    setIsOpening(false);
    setIsHeaderHidden(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
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

  if (currentRoute === 'crud') {
    return (
      <Suspense fallback={
        <div className="min-h-screen w-full bg-[#12100e] flex flex-col items-center justify-center p-8 space-y-4">
          <div className="w-10 h-10 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
          <p className="font-moulpali text-sm text-[#ffd700] animate-pulse">
            {lang === 'km' ? 'កំពុងដំណើរការ...' : 'Loading CRUD management...'}
          </p>
        </div>
      }>
        <InvitationCrud
          onBackToInvitation={() => navigateTo('invitation')}
          lang={lang}
        />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#12100e] text-[#3d3126] flex flex-col items-center justify-start relative overflow-x-hidden">


      {/* Cinematic Angkor Gate Opening Animation Overlay (Works only one time) */}
      {isOpening && (
        <InvitationOpening
          guest={guest}
          lang={lang}
          onComplete={handleOpeningComplete}
          onHideHeader={setIsHeaderHidden}
          isOpened={isOpened}
          hasGuestId={Boolean(
            (guest?.id && guest.id !== 'demo' && guest.id !== '') ||
            (guest?.name && guest.name.trim() !== '' && guest.name !== 'ឯកឧត្តម / លោកជំទាវ / លោក / លោកស្រី' && guest.name !== 'ភ្ញៀវកិត្តិយស / Honored Guest') ||
            (typeof window !== 'undefined' && Boolean(
              new URLSearchParams(window.location.search).get('guest') ||
              new URLSearchParams(window.location.search).get('to') ||
              new URLSearchParams(window.location.search).get('name') ||
              window.Telegram?.WebApp?.initDataUnsafe?.start_param
            ))
          )}
        />
      )}

      {/* Main Container: Full screen on mobile, luxury centered card on PC */}
      <main className={`w-full ${!isOpened && !isOpening ? 'min-h-[100dvh] pt-0 pb-0 px-0 sm:pt-4 sm:pb-16 sm:px-4 sm:max-w-xl' : 'max-w-xl min-h-screen pt-4 pb-28 px-0 sm:px-4'} flex flex-col items-center`}>

        {/* SCREEN 1: Immersive Fullscreen Cover on Mobile / Luxury Card on PC */}
        {!isOpened && !isOpening ? (
          <InvitationCover
            isOpened={isOpened}
            lang={lang}
            onOpenCard={handleOpenCard}
            guest={guest}
            hasGuestId={Boolean(
              (guest?.id && guest.id !== 'demo' && guest.id !== '') ||
              (guest?.name && guest.name.trim() !== '' && guest.name !== 'ឯកឧត្តម / លោកជំទាវ / លោក / លោកស្រី' && guest.name !== 'ភ្ញៀវកិត្តិយស / Honored Guest') ||
              (typeof window !== 'undefined' && Boolean(
                new URLSearchParams(window.location.search).get('guest') ||
                new URLSearchParams(window.location.search).get('to') ||
                new URLSearchParams(window.location.search).get('name') ||
                window.Telegram?.WebApp?.initDataUnsafe?.start_param
              ))
            )}
          />
        ) : (
          /* SCREEN 2: Full Modern Cambodian Luxury Invitation */
          <Suspense fallback={
            <div className="w-full min-h-[60vh] flex flex-col items-center justify-center p-8 space-y-4">
              <div className="w-10 h-10 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
              <p className="font-moulpali text-sm text-[#ffd700] animate-pulse">
                {lang === 'km' ? 'កំពុងដំណើរការ...' : 'Loading invitation...'}
              </p>
            </div>
          }>
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
              <div className="w-full rounded-none sm:rounded-3xl bg-[#faf7f2] border-y sm:border-2 border-[#d4af37]/50 shadow-2xl p-5 sm:p-8 content-auto">
                <PhotoGallery lang={lang} />
              </div>

              {/* Pre-wedding Video Section */}
              <div className="w-full rounded-none sm:rounded-3xl bg-[#faf7f2] border-y sm:border-2 border-[#d4af37]/50 shadow-2xl p-5 sm:p-8 content-auto">
                <VideoSection lang={lang} />
              </div>

              {/* Digital Angpao / Gift via KHQR Card Banner */}
              {/* <GiftBanner
                lang={lang}
                onOpenGiftModal={() => setShowGiftModal(true)}
              /> */}

              {/* Enhanced RSVP Form Section */}
              <RsvpSection
                ref={rsvpSectionRef}
                lang={lang}
                guest={guest}
                hasGuestId={Boolean(
                  (guest?.id && guest.id !== 'demo' && guest.id !== '') ||
                  (guest?.name && guest.name.trim() !== '' && guest.name !== 'ឯកឧត្តម / លោកជំទាវ / លោក / លោកស្រី' && guest.name !== 'ភ្ញៀវកិត្តិយស / Honored Guest') ||
                  (typeof window !== 'undefined' && Boolean(
                    new URLSearchParams(window.location.search).get('guest') ||
                    new URLSearchParams(window.location.search).get('to') ||
                    new URLSearchParams(window.location.search).get('name') ||
                    window.Telegram?.WebApp?.initDataUnsafe?.start_param
                  ))
                )}
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
                scriptUrl={SCRIPT_URL}
              />

              {/* Footer Blessing & Credits */}
              <Footer lang={lang} />
            </div>
          </Suspense>
        )}

      </main>

      {/* KHQR / ABA Digital Angpao Modal */}
      <Suspense fallback={null}>
        <GiftAngpaoModal
          isOpen={showGiftModal}
          onClose={() => setShowGiftModal(false)}
          lang={lang}
        />
      </Suspense>

      {/* Radial Menu Navigation Button (Always visible on all pages/screens) */}
      <Header
        lang={lang}
        setLang={setLang}
        isOpened={isOpened}
        isFullScreen={isFullScreen}
        toggleFullScreen={toggleFullScreen}
        onShare={handleNativeShare}
        onExitApp={handleExitApp}
        onOpenCard={handleOpenCard}
        onNavigateCrud={() => navigateTo('crud')}
        isHidden={isHeaderHidden}
      />

    </div>
  );
}