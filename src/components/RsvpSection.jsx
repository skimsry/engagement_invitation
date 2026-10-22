import { forwardRef } from 'react';
import { CheckCircle2, Users, Heart, HelpCircle, XCircle } from 'lucide-react';

const RsvpSection = forwardRef(function RsvpSection(
  {
    lang,
    submitted,
    setSubmitted,
    rsvpStatus,
    guestCount,
    setGuestCount,
    message,
    setMessage,
    quickWishes,
    submitting,
    onSubmitRSVP
  },
  ref
) {
  return (
    <div
      ref={ref}
      id="rsvp-section"
      className="w-full rounded-none sm:rounded-3xl bg-[#faf7f2] border-y sm:border-2 border-[#d4af37]/50 shadow-2xl p-5 sm:p-8 text-[#3d3126]"
    >
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
                  {count} {lang === 'km' ? 'នាក់' : count === '1' ? 'Guest' : 'Guests'}
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
              onClick={() => onSubmitRSVP('Attending')}
              className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-[#b8860b] hover:bg-[#996515] text-white text-xs sm:text-sm font-semibold shadow active:scale-95 transition disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>{lang === 'km' ? 'ចូលរួម (Will Attend)' : 'Will Attend'}</span>
            </button>

            <button
              disabled={submitting}
              onClick={() => onSubmitRSVP('Maybe')}
              className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs sm:text-sm font-semibold border border-amber-300 shadow-sm active:scale-95 transition disabled:opacity-50"
            >
              <HelpCircle className="w-4 h-4 text-amber-600" />
              <span>{lang === 'km' ? 'ប្រហែល (Maybe)' : 'Tentative'}</span>
            </button>

            <button
              disabled={submitting}
              onClick={() => onSubmitRSVP('Declined')}
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
  );
});

export default RsvpSection;
