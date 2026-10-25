export const STORAGE_KEY_WEDDING_CONFIG = 'engagement_wedding_config_v1';

export const DEFAULT_WEDDING_CONFIG = {
  // 1. Full name & last name of man and woman (both english and khmer)
  couple: {
    groom: {
      lastNameKm: 'សន',
      firstNameKm: 'គឹមសាន្ត',
      lastNameEn: 'SORN',
      firstNameEn: 'KIMSAN',
      image: '/images/groom-childhood.webp'
    },
    bride: {
      lastNameKm: 'ង៉ោ',
      firstNameKm: 'អូយសាំង',
      lastNameEn: 'NGOV',
      firstNameEn: 'UYSANG',
      image: '/images/bride-childhood.webp'
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
    dateTime: '2026-11-22T07:30:00+07:00',
    dateTextKm: 'ថ្ងៃអាទិត្យ ទី២២ ខែវិច្ឆិកា ឆ្នាំ២០២៦',
    dateTextEn: 'Sunday, November 22, 2026'
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
      time: '08:30 AM',
      titleKm: 'ពិធីចូលចែចូវ',
      titleEn: 'Traditional Engagement Negotiation',
      descKm: 'ចាស់ទុំទាំងសងខាងជួបជុំគ្នា ជជែកពិភាក្សាតាមប្រពៃណីខ្មែរ អំពីការរៀបចំពិធីមង្គលការ',
      descEn: 'Elders from both families discuss the wedding arrangements according to Khmer traditions.'
    },
    {
      id: '3',
      time: '11:30 AM',
      titleKm: 'ពិធីទទួលទានអាហារថ្ងៃត្រង់',
      titleEn: 'Celebration Luncheon & Banquet',
      descKm: 'ពិធីជប់លៀងទទួលទានអាហារថ្ងៃត្រង់ និងថតរូបអនុស្សាវរីយ៍',
      descEn: 'Festive dining, family photo sessions, and music'
    }
  ],

  // 5. Google Maps & Location
  venue: {
    venueNameKm: 'គេហដ្ឋានខាងស្រី',
    venueNameEn: 'Bride’s House',
    addressKm: 'ភូមិផ្សារឃ្លាំង ឃុំកំពង់ឃ្លាំង ស្រុកសូទ្រនិគម ខេត្តសៀមរាប',
    addressEn: 'Phsar Khlang Village, Kampong Khleang Commune, Sot Nikum District, Siem Reap Province',
    googleMapsUrl: 'https://maps.app.goo.gl/is1RjP4f2pYupsgT8?g_st=it'
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
    },
    {
      id: '3',
      url: '/images/gallery-3.webp',
      titleKm: 'ដំណើរកម្សាន្តនៃក្តីស្រលាញ់',
      titleEn: 'Romantic Getaways',
      captionKm: 'ស្នាមញញឹម និងដំណើរកម្សាន្តរួមគ្នាពោរពេញដោយក្តីសុខ',
      captionEn: 'Sweet travel memories and shared happiness'
    },
    {
      id: '4',
      url: '/images/gallery-4.webp',
      titleKm: 'ពេលវេលាដ៏ស្រស់បំព្រង',
      titleEn: 'Beautiful Horizons',
      captionKm: 'មើលទៅអនាគតដ៏ភ្លឺស្វាងជាមួយគ្នា',
      captionEn: 'Looking towards a bright and loving future together'
    },
    {
      id: '5',
      url: '/images/gallery-5.webp',
      titleKm: 'ភាពស្រស់បំព្រងនៃធម្មជាតិ',
      titleEn: 'Serene Nature & Love',
      captionKm: 'ក្តីស្រលាញ់ដ៏បរិសុទ្ធ និងភាពកក់ក្តៅកណ្តាលធម្មជាតិ',
      captionEn: 'Pure love and tranquility surrounded by nature'
    },
    {
      id: '6',
      url: '/images/gallery-6.webp',
      titleKm: 'ស្នាមញញឹមនាពេលថ្ងៃលិច',
      titleEn: 'Golden Hour Smiles',
      captionKm: 'ភាពរីករាយ និងក្តីស្រលាញ់នាពេលរៀបលិច',
      captionEn: 'Joyful smiles under the golden sunset sky'
    },
    {
      id: '7',
      url: '/images/gallery-7.webp',
      titleKm: 'និស្ស័យស្នេហ៍នៅដែនដីអង្គរ',
      titleEn: 'Destined at Angkor',
      captionKm: 'សេចក្តីស្នេហាដ៏រឹងមាំ និងស្ថិតស្ថេរជារៀងរហូត',
      captionEn: 'Timeless love rooted in history and beauty'
    },
    {
      id: '8',
      url: '/images/gallery-8.webp',
      titleKm: 'ស្នាមញញឹមលើទូកនៃក្តីស្រលាញ់',
      titleEn: 'Kampong Khleang Boat Ride',
      captionKm: 'ស្នាមញញឹមដ៏កក់ក្តៅ និងដំណើរកម្សាន្តរួមគ្នាពោរពេញដោយក្តីសុខ',
      captionEn: 'Warm smiles and sweet adventures on the water'
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
        ...(parsed.couple || {}),
        groom: {
          ...DEFAULT_WEDDING_CONFIG.couple.groom,
          ...(parsed.couple?.groom || {}),
          image: (parsed.couple?.groom?.image && !parsed.couple.groom.image.includes('/images/groom.webp'))
            ? parsed.couple.groom.image
            : DEFAULT_WEDDING_CONFIG.couple.groom.image
        },
        bride: {
          ...DEFAULT_WEDDING_CONFIG.couple.bride,
          ...(parsed.couple?.bride || {}),
          image: (parsed.couple?.bride?.image && !parsed.couple.bride.image.includes('/images/bride.webp'))
            ? parsed.couple.bride.image
            : DEFAULT_WEDDING_CONFIG.couple.bride.image
        }
      },
      cover: {
        ...DEFAULT_WEDDING_CONFIG.cover,
        ...(parsed.cover || {})
      },
      eventDate: (() => {
        const storedDate = parsed.eventDate || {};
        if (!storedDate.dateTime || storedDate.dateTime.includes('2026-11-28')) {
          return {
            ...DEFAULT_WEDDING_CONFIG.eventDate,
            ...storedDate,
            dateTime: DEFAULT_WEDDING_CONFIG.eventDate.dateTime,
            dateTextKm: DEFAULT_WEDDING_CONFIG.eventDate.dateTextKm,
            dateTextEn: DEFAULT_WEDDING_CONFIG.eventDate.dateTextEn
          };
        }
        return {
          ...DEFAULT_WEDDING_CONFIG.eventDate,
          ...storedDate
        };
      })(),
      schedule: (() => {
        if (!Array.isArray(parsed.schedule) || parsed.schedule.length === 0) {
          return DEFAULT_WEDDING_CONFIG.schedule;
        }
        // If stored schedule still has the old 5 default items, upgrade to the current 3 items
        if (
          parsed.schedule.length > DEFAULT_WEDDING_CONFIG.schedule.length ||
          parsed.schedule.some((it) => it.titleKm?.includes('ហែជំនូន') || it.titleKm?.includes('បំពាក់ចិញ្ចៀន'))
        ) {
          return DEFAULT_WEDDING_CONFIG.schedule;
        }
        return parsed.schedule;
      })(),
      venue: (() => {
        const storedVenue = parsed.venue || {};
        if (
          !storedVenue.googleMapsUrl ||
          storedVenue.googleMapsUrl.includes('The+Premier+Centre') ||
          storedVenue.addressKm?.includes('រាជធានីភ្នំពេញ') ||
          storedVenue.addressKm?.includes('Bride’s House') ||
          storedVenue.venueNameKm?.includes('The Premier Centre')
        ) {
          return {
            ...DEFAULT_WEDDING_CONFIG.venue,
            ...storedVenue,
            venueNameKm: (storedVenue.venueNameKm && !storedVenue.venueNameKm.includes('The Premier Centre'))
              ? storedVenue.venueNameKm
              : DEFAULT_WEDDING_CONFIG.venue.venueNameKm,
            venueNameEn: (storedVenue.venueNameEn && !storedVenue.venueNameEn.includes('The Premier Centre'))
              ? storedVenue.venueNameEn
              : DEFAULT_WEDDING_CONFIG.venue.venueNameEn,
            addressKm: (storedVenue.addressKm && !storedVenue.addressKm.includes('រាជធានីភ្នំពេញ') && !storedVenue.addressKm.includes('Bride’s House'))
              ? storedVenue.addressKm
              : DEFAULT_WEDDING_CONFIG.venue.addressKm,
            addressEn: (storedVenue.addressEn && !storedVenue.addressEn.includes('Phnom Penh'))
              ? storedVenue.addressEn
              : DEFAULT_WEDDING_CONFIG.venue.addressEn,
            googleMapsUrl: (storedVenue.googleMapsUrl && !storedVenue.googleMapsUrl.includes('The+Premier+Centre'))
              ? storedVenue.googleMapsUrl
              : DEFAULT_WEDDING_CONFIG.venue.googleMapsUrl
          };
        }
        return {
          ...DEFAULT_WEDDING_CONFIG.venue,
          ...storedVenue
        };
      })(),
      gallery: (() => {
        if (!Array.isArray(parsed.gallery) || parsed.gallery.length === 0) {
          return DEFAULT_WEDDING_CONFIG.gallery;
        }
        // If stored config only had fewer default sample photos, upgrade to latest full gallery
        if (
          parsed.gallery.length < DEFAULT_WEDDING_CONFIG.gallery.length &&
          parsed.gallery[0]?.url === '/images/gallery-1.webp'
        ) {
          return DEFAULT_WEDDING_CONFIG.gallery;
        }
        return parsed.gallery;
      })().map((item, idx) => ({
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
      if (Array.isArray(fallbackConfig.gallery) && fallbackConfig.gallery.length > 12) {
        fallbackConfig.gallery = fallbackConfig.gallery.slice(0, 12);
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
