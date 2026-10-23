import { Clock } from 'lucide-react';

const SCHEDULE_ITEMS = [
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
];

export default function EventSchedule({ lang }) {
  return (
    <div className="w-full rounded-none sm:rounded-3xl bg-[#faf7f2] border-y sm:border-2 border-[#d4af37]/50 shadow-2xl p-5 sm:p-8 text-[#3d3126]">
      <div className="text-center space-y-1 mb-6">
        <div className="mb-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[#b8860b] text-xs font-medium">
          <Clock className="w-3.5 h-3.5" />
          <span>{lang === 'km' ? 'ពេលវេលាកម្មវិធី' : 'Event Schedule'}</span>
        </div>
        <h3 className="mb-2 font-moulpali text-xl sm:text-2xl text-[#3d3126]">
          កម្មវិធីមង្គលភ្ជាប់ពាក្យ
        </h3>
        <p className="text-xs sm:text-sm text-[#8c7355]">
          {lang === 'km' ? 'កាលវិភាគលម្អិតនៃពិធីមង្គល' : 'Ceremony Agenda & Timeline'}
        </p>
      </div>

      {/* Timeline Items */}
      <div className="space-y-4 max-w-md mx-auto">
        {SCHEDULE_ITEMS.map((item, idx) => (
          <div key={idx} className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white border border-[#d4af37]/30 shadow-sm">
            <div className="px-2.5 py-1.5 rounded-xl bg-[#b8860b]/15 border border-[#b8860b]/30 text-[#b8860b] font-serif font-bold text-xs shrink-0 mt-0.5">
              {item.time}
            </div>
            <div className="flex-1 space-y-0.5">
              <h4 className="mb-2 font-dangrek text-xs sm:text-sm text-[#3d3126]">
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
  );
}
