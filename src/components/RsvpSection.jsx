import { forwardRef, useState, useEffect } from 'react';
import {
  CheckCircle2,
  Users,
  Heart,
  HelpCircle,
  XCircle,
  Send,
  User,
  MessageSquare,
  Clock,
  Inbox
} from 'lucide-react';

const STORAGE_KEY_PUBLIC_WISHES = 'engagement_public_wishes_cache_v1';

// Starter blessings to populate the wall beautifully on initial view
const INITIAL_DEFAULT_WISHES = [
  {
    id: 'sample-1',
    name: 'សន ស៊ីម & តូច សាវី',
    message: '💖 សូមជូនពរឱ្យកូនទាំងពីរស្រលាញ់គ្នាដល់ចាស់កោងខ្នង រកស៊ីមានបាន ត្រជាក់ត្រជុំ និងមានសុភមង្គលពេញបរិបូរណ៌!',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: 'sample-2',
    name: 'សន ចាន់ទី & ជា ពុទ្ធី',
    message: '✨ សូមចូលរួមអបអរសាទរ និងប្រសិទ្ធពរជ័យឱ្យគ្រួសារថ្មីពោរពេញដោយភាពកក់ក្តៅ និងសុខភាពល្អបរិបូរណ៌ជានិច្ច!',
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString()
  },
  {
    id: 'sample-3',
    name: 'សន គឹមស្រ៊ី & វុទ្ធី សុធារ័ត្ន',
    message: '🥂 Wishing you both a lifetime of happiness, endless love, and joy on this special journey together! 🎉',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
  }
];

// Relative time formatting helper
function formatRelativeTime(dateStr, lang) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diffSec = Math.floor((now.getTime() - d.getTime()) / 1000);
    if (diffSec < 60) return lang === 'km' ? 'ទើបតែផ្ញើ' : 'Just now';
    if (diffSec < 3600) {
      const min = Math.floor(diffSec / 60);
      return lang === 'km' ? `${min} នាទីមុន` : `${min}m ago`;
    }
    if (diffSec < 86400) {
      const hours = Math.floor(diffSec / 3600);
      return lang === 'km' ? `${hours} ម៉ោងមុន` : `${hours}h ago`;
    }
    const days = Math.floor(diffSec / 86400);
    if (days < 7) {
      return lang === 'km' ? `${days} ថ្ងៃមុន` : `${days}d ago`;
    }
    return d.toLocaleDateString(lang === 'km' ? 'km-KH' : 'en-US', {
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return '';
  }
}

const RsvpSection = forwardRef(function RsvpSection(
  {
    lang = 'km',
    guest,
    hasGuestId: hasGuestIdProp,
    submitted,
    setSubmitted,
    rsvpStatus,
    guestCount,
    setGuestCount,
    message,
    setMessage,
    quickWishes = [],
    submitting,
    onSubmitRSVP,
    scriptUrl
  },
  ref
) {
  const [publicName, setPublicName] = useState('');
  const [wishes, setWishes] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(STORAGE_KEY_PUBLIC_WISHES);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch { }
    }
    return INITIAL_DEFAULT_WISHES;
  });

  // Determine if link has a personalized guest ID
  const isPersonalizedGuest = hasGuestIdProp !== undefined
    ? Boolean(hasGuestIdProp)
    : Boolean(
      (guest?.id && guest.id !== 'demo' && guest.id !== '') ||
      (guest?.name && guest.name.trim() !== '' && guest.name !== 'ឯកឧត្តម / លោកជំទាវ / លោក / លោកស្រី' && guest.name !== 'ភ្ញៀវកិត្តិយស / Honored Guest') ||
      (typeof window !== 'undefined' && Boolean(
        new URLSearchParams(window.location.search).get('guest') ||
        new URLSearchParams(window.location.search).get('to') ||
        new URLSearchParams(window.location.search).get('name') ||
        window.Telegram?.WebApp?.initDataUnsafe?.start_param
      ))
    );

  // Fetch live public messages from Google Sheets on mount
  useEffect(() => {
    if (!scriptUrl) return;
    let isMounted = true;

    fetch(`${scriptUrl}?action=list`)
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.success && Array.isArray(data.data)) {
          const validMessages = data.data
            .filter((item) => item.message && String(item.message).trim().length > 0)
            .map((item) => ({
              id: item.id || String(Math.random()),
              name: item.name || (lang === 'km' ? 'ភ្ញៀវកិត្តិយស' : 'Honored Guest'),
              message: item.message,
              createdAt: item.updatedAt || item.createdAt || new Date().toISOString()
            }))
            .reverse(); // Newest first

          if (validMessages.length > 0) {
            setWishes(validMessages);
            try {
              localStorage.setItem(STORAGE_KEY_PUBLIC_WISHES, JSON.stringify(validMessages));
            } catch { }
          }
        }
      })
      .catch(() => { });

    return () => {
      isMounted = false;
    };
  }, [scriptUrl, lang]);

  // Handler for Public Viewer Wish Submission
  const handleSendPublicWish = async () => {
    const trimmedName = publicName.trim();
    const trimmedMsg = message.trim();
    if (!trimmedName) return;

    const res = await onSubmitRSVP?.('Wishes', trimmedName);
    if (res && res.success !== false) {
      // Immediately add the new wish to the top of the wall
      const newWish = {
        id: String(Date.now()),
        name: trimmedName,
        message: trimmedMsg || (lang === 'km' ? 'សូមចូលរួមអបអរសាទរ!' : 'Warmest congratulations!'),
        createdAt: new Date().toISOString()
      };
      setWishes((prev) => [newWish, ...prev.filter((w) => w.id !== newWish.id)]);
      try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY_PUBLIC_WISHES) || '[]');
        localStorage.setItem(STORAGE_KEY_PUBLIC_WISHES, JSON.stringify([newWish, ...stored]));
      } catch { }
    }
  };

  // Handler for Guest RSVP Submission
  const handleGuestRsvpSubmit = async (status) => {
    const res = await onSubmitRSVP?.(status);
    if (res && res.success !== false && message?.trim()) {
      const newWish = {
        id: String(Date.now()),
        name: guest?.name || (lang === 'km' ? 'ភ្ញៀវកិត្តិយស' : 'Honored Guest'),
        message: message.trim(),
        createdAt: new Date().toISOString()
      };
      setWishes((prev) => [newWish, ...prev.filter((w) => w.id !== newWish.id)]);
      try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY_PUBLIC_WISHES) || '[]');
        localStorage.setItem(STORAGE_KEY_PUBLIC_WISHES, JSON.stringify([newWish, ...stored]));
      } catch { }
    }
  };

  return (
    <div
      ref={ref}
      id="rsvp-section"
      className="w-full rounded-none sm:rounded-3xl bg-[#faf7f2] border-y sm:border-2 border-[#d4af37]/50 shadow-2xl p-5 sm:p-8 text-[#3d3126]"
    >
      {/* Header Title & Subtitle */}
      <div className="text-center space-y-1 mb-5">
        <h3 className="mb-2 font-moulpali text-xl sm:text-2xl text-[#3d3126]">
          {isPersonalizedGuest
            ? (lang === 'km' ? 'ឆ្លើយតបការចូលរួម' : 'Confirm Your Attendance')
            : (lang === 'km' ? 'ផ្ញើសារប្រសិទ្ធពរជ័យ' : 'Send Blessings & Wishes')}
        </h3>
        <p className="text-xs sm:text-sm text-[#8c7355] max-w-md mx-auto">
          {isPersonalizedGuest
            ? (lang === 'km'
              ? 'សូមបញ្ជាក់ការចូលរួមដើម្បីជួយសម្រួលដល់ការរៀបចំកន្លែងទទួលភ្ញៀវ'
              : 'Kindly let us know if you can attend to help us prepare your seat')
            : (lang === 'km'
              ? 'សូមផ្ញើសារជូនពរដល់គូដណ្តឹងថ្មី សាររបស់អ្នកនឹងបង្ហាញជូនជាសាធារណៈខាងក្រោម'
              : 'Share your warm blessings with the couple. Your message will be displayed publicly below.')}
        </p>
      </div>

      {/* Form or Submitted Confirmation */}
      {submitted ? (
        <div className="py-6 text-center space-y-3 bg-emerald-50/80 border border-emerald-200 rounded-2xl p-5 animate-fade-in shadow-inner">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
          <p className="font-moul text-base text-emerald-900">
            {lang === 'km' ? 'សូមអរគុណសម្រាប់សារប្រសិទ្ធពរជ័យ!' : 'Thank you for your warm blessings!'}
          </p>
          <p className="text-xs text-stone-600">
            {isPersonalizedGuest ? (
              <>
                {lang === 'km' ? 'ការឆ្លើយតបរបស់អ្នកត្រូវបានកត់ត្រាជោគជ័យ៖ ' : 'Recorded status: '}
                <span className="font-bold text-[#b8860b]">{rsvpStatus}</span>
              </>
            ) : (
              <span>
                {lang === 'km'
                  ? 'សារជូនពររបស់អ្នកត្រូវបានបង្ហោះលើផ្ទាំងជូនពរជាសាធារណៈជោគជ័យ'
                  : 'Your blessing has been posted to the public guestbook wall'}
              </span>
            )}
          </p>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="text-xs text-[#b8860b] font-semibold underline hover:text-[#996515] pt-2 cursor-pointer transition"
          >
            {lang === 'km' ? 'ផ្ញើសារជូនពរបន្ថែមទៀត' : 'Send Another Blessing'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">

          {/* Mode 1: Public Viewer - Name Input (Only shown when link has no guest id) */}
          {!isPersonalizedGuest && (
            <div>
              <label className="block text-xs font-semibold text-[#5c493a] mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#b8860b]" />
                <span>{lang === 'km' ? 'ឈ្មោះរបស់អ្នក' : 'Your Name'}</span>
                <span className="text-rose-500 font-bold">*</span>
              </label>
              <input
                type="text"
                value={publicName}
                onChange={(e) => setPublicName(e.target.value)}
                placeholder={lang === 'km' ? 'សូមបញ្ចូលឈ្មោះរបស់អ្នក (ឧ. សុខ ពិសី)...' : 'Enter your name...'}
                className="w-full rounded-xl border border-[#d4af37]/50 bg-white px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#b8860b] shadow-inner text-stone-900 placeholder-stone-400"
              />
            </div>
          )}

          {/* Mode 2: Guest ID Link - Number of Seats (Only shown when link has guest id) */}
          {isPersonalizedGuest && (
            <div>
              <label className="block text-xs font-semibold text-[#5c493a] mb-2 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#b8860b]" />
                <span>{lang === 'km' ? 'ចំនួនអ្នកចូលរួម' : 'Number of Guests'}</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['1', '2', '3', '4+'].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setGuestCount?.(count)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition cursor-pointer ${guestCount === count
                      ? 'bg-[#b8860b] text-white border-[#b8860b] shadow'
                      : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                      }`}
                  >
                    {count} {lang === 'km' ? 'នាក់' : count === '1' ? 'Guest' : 'Guests'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Blessing Tags (Available in both modes) */}
          {quickWishes.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-[#5c493a] mb-2 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-500" />
                <span>{lang === 'km' ? 'ជ្រើសរើសពាក្យជូនពររហ័ស' : 'Quick Blessing Suggestions'}</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {quickWishes.map((wish, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setMessage(wish)}
                    className="text-[11px] py-1.5 px-3 rounded-full bg-white hover:bg-amber-50 text-stone-700 border border-amber-200/80 transition active:scale-95 text-left cursor-pointer shadow-2xs"
                  >
                    {wish}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message Input Area (Available in both modes) */}
          <div>
            <label className="block text-xs font-semibold text-[#5c493a] mb-1">
              {lang === 'km' ? 'សារប្រសិទ្ធពរជ័យដល់គូដណ្តឹង' : 'Your Blessings & Wishes'}
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                lang === 'km'
                  ? 'សរសេរសារជូនពរ ឬកំណត់សម្គាល់ពិសេស...'
                  : 'Write your warm blessings for the couple...'
              }
              className="w-full rounded-xl border border-[#d4af37]/40 bg-white p-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#b8860b] shadow-inner text-stone-800 placeholder-stone-400"
            />
          </div>

          {/* Action Area: Either 3 Attendance Buttons (Guest ID) or Single Send Wish Button (No Guest ID) */}
          {isPersonalizedGuest ? (
            <div className="grid grid-cols-3 gap-2 sm:gap-2.5 pt-2">
              <button
                type="button"
                disabled={submitting}
                onClick={() => handleGuestRsvpSubmit('Attending')}
                className="flex items-center justify-center gap-1 sm:gap-2 py-2.5 sm:py-3 px-1 sm:px-3 rounded-xl bg-[#b8860b] hover:bg-[#996515] text-white text-xs sm:text-sm font-semibold shadow active:scale-95 transition disabled:opacity-50 cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-300 shrink-0" />
                <span className="truncate">{lang === 'km' ? 'ចូលរួម' : 'Will Attend'}</span>
              </button>

              <button
                type="button"
                disabled={submitting}
                onClick={() => handleGuestRsvpSubmit('Maybe')}
                className="flex items-center justify-center gap-1 sm:gap-2 py-2.5 sm:py-3 px-1 sm:px-3 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs sm:text-sm font-semibold border border-amber-300 shadow-sm active:scale-95 transition disabled:opacity-50 cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 shrink-0" />
                <span className="truncate">{lang === 'km' ? 'ប្រហែល' : 'Maybe'}</span>
              </button>

              <button
                type="button"
                disabled={submitting}
                onClick={() => handleGuestRsvpSubmit('Declined')}
                className="flex items-center justify-center gap-1 sm:gap-2 py-2.5 sm:py-3 px-1 sm:px-3 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs sm:text-sm font-semibold active:scale-95 transition disabled:opacity-50 cursor-pointer"
              >
                <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-500 shrink-0" />
                <span className="truncate">{lang === 'km' ? 'មិនអាច' : 'Cannot Attend'}</span>
              </button>
            </div>
          ) : (
            <div className="pt-2">
              <button
                type="button"
                disabled={submitting || !publicName.trim() || !message.trim()}
                onClick={handleSendPublicWish}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#996515] via-[#b8860b] to-[#d4af37] hover:brightness-105 text-white font-bold text-xs sm:text-sm shadow-md active:scale-95 transition disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-4 h-4 text-white" />
                <span>{lang === 'km' ? 'ផ្ញើសារប្រសិទ្ធពរជ័យ' : 'Send Blessing & Wish'}</span>
              </button>
            </div>
          )}

          {submitting && (
            <p className="text-xs text-center text-amber-600 animate-pulse pt-1">
              {lang === 'km' ? 'កំពុងបញ្ជូនចម្លើយ...' : 'Submitting...'}
            </p>
          )}
        </div>
      )}

      {/* PUBLIC WISHES & BLESSINGS WALL (Visible to All Viewers) */}
      <div className="mt-8 pt-6 border-t border-[#d4af37]/35">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-amber-500/15 border border-[#d4af37]/50 flex items-center justify-center text-[#996515]">
              <MessageSquare className="w-3.5 h-3.5" />
            </div>
            <h4 className="font-moulpali text-sm sm:text-base text-[#78500c]">
              {lang === 'km' ? 'សារជូនពរ ពីភ្ញៀវកិត្តិយស' : 'Public Blessings & Wishes'}
            </h4>
          </div>
          <span className="text-[11px] font-semibold text-[#b8860b] bg-amber-100/70 border border-amber-300/50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Inbox className="w-3 h-3 text-[#b8860b]" />
            <span>{wishes.length}</span>
          </span>
        </div>

        {/* Wishes List Container */}
        {wishes.length === 0 ? (
          <div className="text-center py-6 px-4 bg-white/60 border border-dashed border-amber-200 rounded-2xl">
            <p className="text-xs text-stone-500 font-kantumruy">
              {lang === 'km'
                ? 'មិនទាន់មានសារជូនពរនៅឡើយទេ។ សូមក្លាយជាអ្នកដំបូងដែលផ្ញើសារជូនពរ!'
                : 'No blessings yet. Be the first to share your warm wishes!'}
            </p>
          </div>
        ) : (
          <div className="max-h-[380px] overflow-y-auto space-y-2.5 pr-1.5 scrollbar-thin">
            {wishes.map((w, index) => {
              const initial = (w.name || 'ភ្ញៀវ').trim().charAt(0).toUpperCase();
              return (
                <div
                  key={w.id || index}
                  className="bg-white/90 border border-amber-200/80 rounded-2xl p-3 sm:p-3.5 shadow-xs hover:border-[#d4af37] transition flex items-start gap-3 animate-fade-in"
                >
                  {/* Avatar badge */}
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-[#996515] to-[#ffd700] text-stone-950 font-bold text-xs flex items-center justify-center shrink-0 shadow-sm border border-amber-100">
                    {initial}
                  </div>

                  {/* Body Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-dangrek text-xs sm:text-sm text-[#8c5912] truncate">
                        {w.name}
                      </p>
                      {w.createdAt && (
                        <span className="text-[10px] text-stone-400 flex items-center gap-1 shrink-0 font-sans">
                          <Clock className="w-2.5 h-2.5" />
                          <span>{formatRelativeTime(w.createdAt, lang)}</span>
                        </span>
                      )}
                    </div>

                    <p className="font-kantumruy text-xs text-stone-700 leading-relaxed mt-1 break-words bg-[#faf7f2]/90 p-2 rounded-xl border border-amber-100/60">
                      {w.message}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
});

export default RsvpSection;
