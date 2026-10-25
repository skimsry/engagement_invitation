import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { getStoredWeddingConfig } from '../utils/weddingConfig';

const DEFAULT_SCHEDULE_ITEMS = [
  {
    time: '08:00 AM',
    titleKm: 'ការអញ្ជើញមកដល់របស់ភ្ញៀវ',
    titleEn: 'Guest Arrival',
    descKm: 'សូមស្វាគមន៍ការអញ្ជើញមកដល់របស់ភ្ញៀវកិត្តិយស ចាស់ទុំ និងសាច់ញាតិទាំងសងខាង។',
    descEn: 'Welcoming honored guests, elders, and relatives from both families.'
  },
  {
    time: '09:00 AM',
    titleKm: 'ពិធីចូលចែចូវ',
    titleEn: 'Traditional Engagement Negotiation',
    descKm: 'អ្នកផ្លូវទាំងសងខាងជួបជុំគ្នា ដើម្បីជជែកពិភាក្សាតាមប្រពៃណីខ្មែរ អំពីការភ្ជាប់ពាក្យ និងកិច្ចព្រមព្រៀងផ្សេងៗ។',
    descEn: 'Representatives from both families discuss the engagement arrangements according to Khmer traditions.'
  },
  {
    time: '09:30 AM',
    titleKm: 'ពិធីព្រមព្រៀងថ្ងៃរៀបការ',
    titleEn: 'Wedding Date Agreement',
    descKm: 'ចាស់ទុំទាំងសងខាងពិភាក្សា និងព្រមព្រៀងកំណត់ថ្ងៃរៀបការដ៏សមស្របតាមប្រពៃណីខ្មែរ។',
    descEn: 'Elders from both families discuss and agree on a suitable wedding date according to Khmer traditions.'
  },
  {
    time: '10:00 AM',
    titleKm: 'ពិធីថតរូបអនុស្សាវរីយ៍',
    titleEn: 'Memorable Photo Session',
    descKm: 'គូដណ្តឹងទាំងពីរ ថតរូបអនុស្សាវរីយ៍ជាមួយចាស់ទុំ ភ្ញៀវកិត្តិយស និងសាច់ញាតិទាំងសងខាង។',
    descEn: 'The engaged couple takes memorable photos with elders, honored guests, and relatives from both families.'
  },
  {
    time: '11:00 AM',
    titleKm: 'ពិធីទទួលទានអាហារថ្ងៃត្រង់',
    titleEn: 'Wedding Luncheon',
    descKm: 'សូមអញ្ជើញភ្ញៀវកិត្តិយស និងសាច់ញាតិទាំងអស់ទទួលទានអាហារថ្ងៃត្រង់ជាមួយគ្នា ប្រកបដោយភាពរីករាយ និងស្និទ្ធស្នាល។',
    descEn: 'Guests and relatives are invited to enjoy lunch together in a warm and joyful atmosphere.'
  }
];

export default function EventSchedule({ lang, scheduleItems }) {
  const [items, setItems] = useState(() => scheduleItems || getStoredWeddingConfig().schedule || DEFAULT_SCHEDULE_ITEMS);

  useEffect(() => {
    if (scheduleItems) {
      setItems(scheduleItems);
    }
  }, [scheduleItems]);

  useEffect(() => {
    const handleUpdate = (e) => {
      if (e.detail?.schedule) {
        setItems(e.detail.schedule);
      }
    };
    window.addEventListener('wedding_config_updated', handleUpdate);
    return () => window.removeEventListener('wedding_config_updated', handleUpdate);
  }, []);

  return (
    <div className="w-full rounded-none sm:rounded-3xl bg-[#faf7f2] border-y sm:border-2 border-[#d4af37]/50 shadow-2xl p-5 sm:p-8 text-[#3d3126]">
      <div className="text-center space-y-1 mb-6">
        <div className="mb-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[#b8860b] text-xs font-medium">
          <Clock className="w-3.5 h-3.5" />
          <span>{lang === 'km' ? 'ពេលវេលាកម្មវិធី' : 'Event Schedule'}</span>
        </div>
        <h3 className={`mb-2 ${lang === 'km' ? 'font-moulpali' : 'font-serif font-bold'} text-xl sm:text-2xl text-[#3d3126]`}>
          {lang === 'km' ? 'កម្មវិធីមង្គល ពិធីចូលចែចូវ' : 'Engagement Ceremony Program'}
        </h3>
        <p className="text-xs sm:text-sm text-[#8c7355]">
          {lang === 'km' ? 'កាលវិភាគលម្អិតនៃពិធីមង្គល' : 'Ceremony Agenda & Timeline'}
        </p>
      </div>

      {/* Timeline Items */}
      <div className="space-y-4 max-w-md mx-auto">
        {items.map((item, idx) => (
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
