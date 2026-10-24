export const STORAGE_KEY_WEDDING_CONFIG = 'engagement_wedding_config_v1';

export const DEFAULT_WEDDING_CONFIG = {
  // 1. Full name & last name of man and woman (both english and khmer)
  couple: {
    groom: {
      lastNameKm: 'សន',
      firstNameKm: 'គឹមសាន្ត',
      lastNameEn: 'SORN',
      firstNameEn: 'KIMSAN',
    },
    bride: {
      lastNameKm: 'ង៉ោ',
      firstNameKm: 'អូយសាំង',
      lastNameEn: 'NGOV',
      firstNameEn: 'UYSANG',
    }
  },

  // 2. Cover image in Invitation_Opening
  cover: {
    openingCoverImage: '/images/open_final_frame.webp',
    openingVideo: '/images/open.mp4',
    openingPoster: '/images/open-poster.webp',
    homeCoverPoster: '/images/home-page-poster.webp',
    homeCoverVideo: '/images/home-page.mp4',
    portraitPlaqueImage: '/images/wedding-portrait-plaque.webp',
    heroImage: '/images/a1.webp'
  },

  // 3. Date of Engagement day with related countdown
  eventDate: {
    dateTime: '2026-11-28T07:30:00+07:00',
    dateTextKm: 'ថ្ងៃសៅរ៍ ទី២៨ ខែវិច្ឆិកា ឆ្នាំ២០២៦',
    dateTextEn: 'Saturday, November 28, 2026'
  },

  // 4. កម្មវិធីមង្គលភ្ជាប់ពាក្យ (Event Schedule)
  schedule: [
    {
      id: '1',
      time: '07:00 AM',
      titleKm: 'ពិធីជួបជុំភ្ញៀវកិត្តិយស',
      titleEn: 'Guest Welcome & Morning Refreshments',
      descKm: 'ជួបជុំភ្ញៀវកិត្តិយស ពិសាតែ កាហ្វេ និងរៀបចំជំនូន',
      descEn: 'Welcoming honored guests and preparing gift trays'
    },
    {
      id: '2',
      time: '07:30 AM',
      titleKm: 'ពិធីហែជំនូនចូលគេហដ្ឋាន',
      titleEn: 'Traditional Groom Gift Procession',
      descKm: 'ក្បួនហែជំនូនចូលគេហដ្ឋាន និងរាប់ផ្លែឈើជំនូន',
      descEn: 'Traditional procession presenting engagement offerings'
    },
    {
      id: '3',
      time: '08:30 AM',
      titleKm: 'ពិធីបំពាក់ចិញ្ចៀនភ្ជាប់ពាក្យ',
      titleEn: 'Engagement Ring Exchange Ceremony',
      descKm: 'គូដណ្តឹងទាំងពីរបំពាក់ចិញ្ចៀនជាសក្ខីភាពនៃក្តីស្រលាញ់',
      descEn: 'Exchange of engagement rings and formal blessings'
    },
    {
      id: '4',
      time: '09:30 AM',
      titleKm: 'ពិធីសំពះផ្ទឹម និងចងដៃប្រសិទ្ធពរជ័យ',
      titleEn: 'Blessing & Hand-Tying Ceremony',
      descKm: 'មាតាបិតា និងភ្ញៀវកិត្តិយសចងអំបោះក្រហមប្រសិទ្ធពរជ័យ',
      descEn: 'Traditional thread-tying blessings by elders & guests'
    },
    {
      id: '5',
      time: '11:30 AM',
      titleKm: 'ពិធីទទួលទានអាហារថ្ងៃត្រង់',
      titleEn: 'Celebration Luncheon & Banquet',
      descKm: 'ពិធីជប់លៀងទទួលទានអាហារថ្ងៃត្រង់ និងថតរូបអនុស្សាវរីយ៍',
      descEn: 'Festive dining, family photo sessions, and music'
    }
  ],

  // 5. Google Maps & Location
  venue: {
    venueNameKm: 'The Premier Centre Sen Sok (ដឹ ព្រេមៀ សែនសុខ)',
    venueNameEn: 'The Premier Centre Sen Sok',
    addressKm: 'The Premier Centre Sen Sok, រាជធានីភ្នំពេញ, ព្រះរាជាណាចក្រកម្ពុជា',
    addressEn: 'The Premier Centre Sen Sok, Phnom Penh, Cambodia',
    googleMapsUrl: 'https://maps.google.com/?q=The+Premier+Centre+Sen+Sok+Phnom+Penh'
  },

  // 6. Love Gallery
  gallery: [
    {
      id: '1',
      url: '/images/gallery-1.webp',
      titleKm: 'ស្នាមញញឹមនៃក្តីស្រលាញ់',
      titleEn: 'Sweet Moments Together',
      captionKm: 'ពេលវេលាដ៏មានអត្ថន័យ និងពោរពេញដោយសុភមង្គល',
      captionEn: 'Precious moments full of joy and love'
    },
    {
      id: '2',
      url: '/images/gallery-2.webp',
      titleKm: 'អនុស្សាវរីយ៍ដ៏កក់ក្តៅ',
      titleEn: 'Cherished Memories',
      captionKm: 'ក្តីស្រលាញ់ និងភាពកក់ក្តៅរួមដំណើរជីវិត',
      captionEn: 'Walking hand in hand through life'
    }
  ],

  // 7. Digital Angpao
  angpao: {
    bankName: 'ABA Bank (KHQR)',
    accountName: 'SORN KIMSAN',
    accountNumber: '001 234 567',
    qrCodeImage: '' // Custom QR code image URL or fallback to built-in SVG
  },

  // 8. Background Sound
  audio: {
    songTitle: 'ភ្ជាប់និស្ស័យ (NISAI) - OLICA ft. KZ',
    audioUrl: '/audio/wedding-song.mp3'
  }
};

export const getStoredWeddingConfig = () => {
  if (typeof window === 'undefined') return DEFAULT_WEDDING_CONFIG;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_WEDDING_CONFIG);
    if (!raw) return DEFAULT_WEDDING_CONFIG;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_WEDDING_CONFIG,
      ...parsed,
      couple: {
        ...DEFAULT_WEDDING_CONFIG.couple,
        ...(parsed.couple || {})
      },
      cover: {
        ...DEFAULT_WEDDING_CONFIG.cover,
        ...(parsed.cover || {})
      },
      eventDate: {
        ...DEFAULT_WEDDING_CONFIG.eventDate,
        ...(parsed.eventDate || {})
      },
      schedule: Array.isArray(parsed.schedule) ? parsed.schedule : DEFAULT_WEDDING_CONFIG.schedule,
      venue: {
        ...DEFAULT_WEDDING_CONFIG.venue,
        ...(parsed.venue || {})
      },
      gallery: (Array.isArray(parsed.gallery) && parsed.gallery.length > 0 ? parsed.gallery : DEFAULT_WEDDING_CONFIG.gallery).map((item, idx) => ({
        id: item.id ? String(item.id) : String(idx + 1),
        url: item.url || '/images/gallery-1.webp',
        titleKm: item.titleKm || '',
        titleEn: item.titleEn || '',
        captionKm: item.captionKm || '',
        captionEn: item.captionEn || ''
      })),
      angpao: {
        ...DEFAULT_WEDDING_CONFIG.angpao,
        ...(parsed.angpao || {})
      },
      audio: {
        ...DEFAULT_WEDDING_CONFIG.audio,
        ...(parsed.audio || {})
      }
    };
  } catch (err) {
    console.warn('Error reading wedding config from storage:', err);
    return DEFAULT_WEDDING_CONFIG;
  }
};

export const saveStoredWeddingConfig = (newConfig) => {
  if (typeof window === 'undefined') return { success: false, error: 'No window' };
  try {
    localStorage.setItem(STORAGE_KEY_WEDDING_CONFIG, JSON.stringify(newConfig));
    // Dispatch custom event so all active components update immediately
    window.dispatchEvent(new CustomEvent('wedding_config_updated', { detail: newConfig }));
    return { success: true };
  } catch (err) {
    console.error('Failed to save wedding config to localStorage:', err);
    try {
      // If saving hit QuotaExceededError, try pruning excess gallery items
      const fallbackConfig = JSON.parse(JSON.stringify(newConfig));
      if (Array.isArray(fallbackConfig.gallery) && fallbackConfig.gallery.length > 8) {
        fallbackConfig.gallery = fallbackConfig.gallery.slice(0, 8);
      }
      localStorage.setItem(STORAGE_KEY_WEDDING_CONFIG, JSON.stringify(fallbackConfig));
      window.dispatchEvent(new CustomEvent('wedding_config_updated', { detail: fallbackConfig }));
      return { success: true, warning: 'pruned' };
    } catch (e2) {
      console.error('Storage quota exceeded and fallback failed:', e2);
      return { success: false, error: err?.message || 'QuotaExceededError' };
    }
  }
};
