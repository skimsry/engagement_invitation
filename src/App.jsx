import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Calendar, Clock, MapPin, CheckCircle2, XCircle, Send, Sparkles } from 'lucide-react';

// Replace with your deployed Google Apps Script Web App URL
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzLMSWSdHf9ArnCzpB4CIapF7UkcDCHyUfW6jm0U1Wn-HmrEeD2yTk2C-zrNvtsnwQJpQ/exec";

export default function App() {
  const [guest, setGuest] = useState({ id: '', name: 'Honored Guest', rsvp: 'Pending', loaded: false });
  const [isOpened, setIsOpened] = useState(false);
  const [rsvpStatus, setRsvpStatus] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand(); // Full height inside Telegram
      tg.setHeaderColor('#faf6f0');
    }

    // 1. Get Guest ID from Telegram startapp parameter OR URL query (?guest=guest_001)
    const urlParams = new URLSearchParams(window.location.search);
    const guestId = tg?.initDataUnsafe?.start_param || urlParams.get('guest') || '';

    if (!guestId) {
      setGuest({ id: 'demo', name: 'H.E. / Lok Chumteav / Mr. & Mrs.', rsvp: 'Pending', loaded: true });
      return;
    }

    // 2. Fetch Guest Name from Google Sheet
    fetch(`${SCRIPT_URL}?id=${encodeURIComponent(guestId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.found) {
          setGuest({ id: data.id, name: data.name, rsvp: data.rsvp, loaded: true });
          if (data.rsvp === 'Attending' || data.rsvp === 'Declined') {
            setRsvpStatus(data.rsvp);
          }
        } else {
          setGuest({ id: guestId, name: 'Honored Guest', rsvp: 'Pending', loaded: true });
        }
      })
      .catch(() => {
        setGuest({ id: guestId, name: 'Honored Guest', rsvp: 'Pending', loaded: true });
      });
  }, []);

  const handleOpenCard = () => {
    setIsOpened(true);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
  };

  const handleSubmitRSVP = async (statusSelection) => {
    setRsvpStatus(statusSelection);
    setSubmitting(true);

    try {
      // Using text/plain prevents CORS preflight blocks with Google Apps Script
      await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          id: guest.id,
          rsvp: statusSelection,
          message: message
        }),
      });

      setSubmitted(true);
      if (statusSelection === 'Attending') {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      }
      window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('success');
    } catch (err) {
      alert('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    /* Outer Wrapper: Centers card on Tablet/Desktop, full width on Mobile */
    <div className="min-h-[100dvh] w-full bg-[#f4ece1] flex justify-center items-center sm:py-8 sm:px-4">

      {/* Card Container: Responsive across all devices */}
      <main className="w-full max-w-md md:max-w-lg min-h-[100dvh] sm:min-h-[85vh] bg-[#faf6f0] sm:rounded-3xl shadow-2xl border-x sm:border-2 border-[#d4af37]/40 flex flex-col justify-between overflow-hidden relative">

        {/* Top Decorative Gold Border */}
        <div className="h-2 w-full bg-gradient-to-r from-[#b8860b] via-[#f3e5ab] to-[#b8860b]" />

        {/* SCREEN 1: Sealed Invitation Envelope (Responsive Cover) */}
        {!isOpened ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 text-center animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-[#d4af37]/15 border border-[#d4af37] flex items-center justify-center mb-6">
              <Sparkles className="w-9 h-9 text-[#b8860b]" />
            </div>

            <p className="text-xs sm:text-sm uppercase tracking-[0.25em] text-[#8c7355] mb-2">
              សិរីមង្គលពិធីភ្ជាប់ពាក្យ • Engagement Ceremony
            </p>

            <h1 className="text-3xl sm:text-4xl font-bold text-[#3d3126] my-3 font-serif">
              Kimsry <span className="text-[#b8860b]">&amp;</span> Partner
            </h1>

            <div className="w-24 h-[1px] bg-[#d4af37] my-6" />

            <p className="text-xs uppercase tracking-widest text-[#8c7355] mb-2">
              សូមគោរពអញ្ជើញ / Cordially Invited
            </p>

            {/* Personalized Guest Name Box */}
            <div className="w-full max-w-xs bg-white/90 border border-[#d4af37]/50 rounded-xl py-4 px-5 my-3 shadow-sm">
              {!guest.loaded ? (
                <span className="text-sm text-gray-400 animate-pulse">Loading your invitation...</span>
              ) : (
                <p className="text-lg sm:text-xl font-semibold text-[#996515] break-words">
                  {guest.name}
                </p>
              )}
            </div>

            <button
              onClick={handleOpenCard}
              disabled={!guest.loaded}
              className="mt-8 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#b8860b] to-[#d4af37] text-white font-medium text-sm sm:text-base shadow-lg hover:opacity-95 active:scale-95 transition-all disabled:opacity-50"
            >
              បើកធៀបអញ្ជើញ / Open Invitation
            </button>
          </div>
        ) : (
          /* SCREEN 2: Full Responsive Invitation Content */
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 text-center">

            {/* Header & Couple Names */}
            <section className="space-y-2 pt-2">
              <p className="text-xs uppercase tracking-[0.2em] text-[#8c7355]">
                The Engagement Of
              </p>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#3d3126]">
                Kimsry &amp; Partner
              </h2>
              <p className="text-sm text-[#6e5d4f] pt-2 leading-relaxed">
                With joyful hearts, we warmly invite <br />
                <span className="font-semibold text-[#996515] text-base sm:text-lg underline decoration-[#d4af37]/60 underline-offset-4">
                  {guest.name}
                </span>
                <br /> to celebrate our engagement ceremony.
              </p>
            </section>

            {/* Event Date, Time & Venue Grid (Responsive) */}
            <section className="bg-white/80 border border-[#d4af37]/30 rounded-2xl p-5 shadow-sm space-y-4 text-left">
              <div className="flex items-start gap-3.5">
                <Calendar className="w-5 h-5 text-[#b8860b] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs uppercase text-[#8c7355]">Date</p>
                  <p className="text-sm sm:text-base font-semibold text-[#3d3126]">
                    Sunday, November 15, 2026
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Clock className="w-5 h-5 text-[#b8860b] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs uppercase text-[#8c7355]">Time</p>
                  <p className="text-sm sm:text-base font-semibold text-[#3d3126]">
                    07:30 AM – Morning Ceremony &amp; Reception
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <MapPin className="w-5 h-5 text-[#b8860b] shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs uppercase text-[#8c7355]">Location</p>
                  <p className="text-sm sm:text-base font-semibold text-[#3d3126]">
                    Phnom Penh, Cambodia
                  </p>
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block mt-2 text-xs font-medium text-[#b8860b] underline"
                  >
                    📍 View on Google Maps
                  </a>
                </div>
              </div>
            </section>

            {/* RSVP & Wishes Section */}
            <section className="bg-white border border-[#d4af37]/40 rounded-2xl p-5 shadow-sm space-y-4">
              <h3 className="text-base sm:text-lg font-bold text-[#3d3126]">
                Confirm Attendance (RSVP)
              </h3>

              {submitted ? (
                <div className="py-4 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-green-600 mx-auto" />
                  <p className="font-semibold text-[#3d3126]">
                    សូមអរគុណ! / Thank you for your response!
                  </p>
                  <p className="text-xs text-[#8c7355]">
                    Status recorded: <span className="font-semibold">{rsvpStatus}</span>
                  </p>
                </div>
              ) : (
                <>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your blessings or wishes for the couple..."
                    className="w-full rounded-xl border border-[#d4af37]/40 bg-[#faf6f0]/60 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#b8860b]"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    <button
                      disabled={submitting}
                      onClick={() => handleSubmitRSVP('Attending')}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#b8860b] text-white text-sm font-medium shadow hover:bg-[#996515] active:scale-98 transition disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Will Attend
                    </button>

                    <button
                      disabled={submitting}
                      onClick={() => handleSubmitRSVP('Declined')}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-300 active:scale-98 transition disabled:opacity-50"
                    >
                      <XCircle className="w-4 h-4" />
                      Cannot Attend
                    </button>
                  </div>
                </>
              )}
            </section>
          </div>
        )}

        {/* Bottom Decorative Gold Border */}
        <div className="h-2 w-full bg-gradient-to-r from-[#b8860b] via-[#f3e5ab] to-[#b8860b]" />
      </main>
    </div>
  );
}