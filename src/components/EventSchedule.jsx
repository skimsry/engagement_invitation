import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { getStoredWeddingConfig } from '../utils/weddingConfig';

const DEFAULT_SCHEDULE_ITEMS = [
  {
    time: '07:00 AM',
    titleKm: 'ពិធីជួបជុំភ្ញៀវកិត្តិយស',
    titleEn: 'Guest Welcome & Morning Refreshments',
    descKm: 'ជួបជុំភ្ញៀវកិត្តិយស ពិសាតែ កាហ្វេ និងរៀបចំជំនូន',
    descEn: 'Welcoming honored guests and preparing gift trays'
  },

  {
    time: '08:30 AM',
    titleKm: 'ពិធីចូលចែចូវ',
    titleEn: 'Traditional Engagement Negotiation',
    descKm: 'ចាស់ទុំទាំងសងខាងជួបជុំគ្នា ជជែកពិភាក្សាតាមប្រពៃណីខ្មែរ អំពីការរៀបចំពិធីមង្គលការ',
    descEn: 'Elders from both families discuss the wedding arrangements according to Khmer traditions.'
  },

  {
    time: '11:30 AM',
    titleKm: 'ពិធីទទួលទានអាហារថ្ងៃត្រង់',
    titleEn: 'Celebration Luncheon & Banquet',
    descKm: 'ពិធីជប់លៀងទទួលទានអាហារថ្ងៃត្រង់ និងថតរូបអនុស្សាវរីយ៍',
    descEn: 'Festive dining, family photo sessions, and music'
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
          {lang === 'km' ? 'កម្មវិធីមង្គលភ្ជាប់ពាក្យ' : 'Engagement Ceremony Program'}
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
