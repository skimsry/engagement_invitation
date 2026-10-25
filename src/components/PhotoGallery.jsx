import { useState, useEffect } from 'react';
import { Camera, Maximize2, X, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { KhmerDivider } from './KhmerOrnaments';
import { getStoredWeddingConfig } from '../utils/weddingConfig';

const DEFAULT_PHOTOS = [
  {
    url: '/images/gallery-1.webp',
    titleKm: 'ស្នាមញញឹមនៃក្តីស្រលាញ់',
    titleEn: 'Sweet Moments Together',
    captionKm: 'ពេលវេលាដ៏មានអត្ថន័យ និងពោរពេញដោយសុភមង្គល',
    captionEn: 'Precious moments full of joy and love'
  },
  {
    url: '/images/gallery-2.webp',
    titleKm: 'អនុស្សាវរីយ៍ដ៏កក់ក្តៅ',
    titleEn: 'Cherished Memories',
    captionKm: 'ក្តីស្រលាញ់ និងភាពកក់ក្តៅរួមដំណើរជីវិត',
    captionEn: 'Walking hand in hand through life'
  },
  {
    url: '/images/gallery-3.webp',
    titleKm: 'ដំណើរកម្សាន្តនៃក្តីស្រលាញ់',
    titleEn: 'Romantic Getaways',
    captionKm: 'ស្នាមញញឹម និងដំណើរកម្សាន្តរួមគ្នាពោរពេញដោយក្តីសុខ',
    captionEn: 'Sweet travel memories and shared happiness'
  },
  {
    url: '/images/gallery-4.webp',
    titleKm: 'ពេលវេលាដ៏ស្រស់បំព្រង',
    titleEn: 'Beautiful Horizons',
    captionKm: 'មើលទៅអនាគតដ៏ភ្លឺស្វាងជាមួយគ្នា',
    captionEn: 'Looking towards a bright and loving future together'
  },
  {
    url: '/images/gallery-5.webp',
    titleKm: 'ភាពស្រស់បំព្រងនៃធម្មជាតិ',
    titleEn: 'Serene Nature & Love',
    captionKm: 'ក្តីស្រលាញ់ដ៏បរិសុទ្ធ និងភាពកក់ក្តៅកណ្តាលធម្មជាតិ',
    captionEn: 'Pure love and tranquility surrounded by nature'
  },
  {
    url: '/images/gallery-6.webp',
    titleKm: 'ស្នាមញញឹមនាពេលថ្ងៃលិច',
    titleEn: 'Golden Hour Smiles',
    captionKm: 'ភាពរីករាយ និងក្តីស្រលាញ់នាពេលរៀបលិច',
    captionEn: 'Joyful smiles under the golden sunset sky'
  },
  {
    url: '/images/gallery-7.webp',
    titleKm: 'និស្ស័យស្នេហ៍នៅដែនដីអង្គរ',
    titleEn: 'Destined at Angkor',
    captionKm: 'សេចក្តីស្នេហាដ៏រឹងមាំ និងស្ថិតស្ថេរជារៀងរហូត',
    captionEn: 'Timeless love rooted in history and beauty'
  },
  {
    url: '/images/gallery-8.webp',
    titleKm: 'ស្នាមញញឹមលើទូកនៃក្តីស្រលាញ់',
    titleEn: 'Kampong Khleang Boat Ride',
    captionKm: 'ស្នាមញញឹមដ៏កក់ក្តៅ និងដំណើរកម្សាន្តរួមគ្នាពោរពេញដោយក្តីសុខ',
    captionEn: 'Warm smiles and sweet adventures on the water'
  }
];

export default function PhotoGallery({ lang = "km", photos: customPhotos }) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);
  const [photos, setPhotos] = useState(() => customPhotos || getStoredWeddingConfig().gallery || DEFAULT_PHOTOS);

  useEffect(() => {
    if (customPhotos) {
      setPhotos(customPhotos);
    }
  }, [customPhotos]);

  useEffect(() => {
    const handleUpdate = (e) => {
      if (e.detail?.gallery) {
        setPhotos(e.detail.gallery);
      }
    };
    window.addEventListener('wedding_config_updated', handleUpdate);
    return () => window.removeEventListener('wedding_config_updated', handleUpdate);
  }, []);

  const content = {
    km: {
      sectionTitle: 'វិចិត្រសាលរូបភាព',
      subtitle: 'អនុស្សាវរីយ៍ផ្អែមល្ហែម នៃដំណើរស្នេហារបស់យើងខ្ញុំ',
      viewFull: 'ចុចដើម្បីមើលធំ'
    },
    en: {
      sectionTitle: 'Love Gallery',
      subtitle: 'Cherished moments capturing our love story',
      viewFull: 'Tap to view full'
    }
  }[lang];

  const handleNext = (e) => {
    e.stopPropagation();
    setSelectedPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setSelectedPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <section className="w-full my-8 space-y-4">
      <div className="text-center space-y-1">
        <div className="mb-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[#b8860b] text-xs font-medium">
          <Camera className="w-3.5 h-3.5" />
          <span>{content.sectionTitle}</span>
        </div>
        <h3 className="mb-2 font-moulpali text-xl sm:text-2xl text-[#3d3126]">
          {content.sectionTitle}
        </h3>
        <p className="text-xs sm:text-sm text-[#8c7355]">
          {content.subtitle}
        </p>
      </div>

      <KhmerDivider className="my-2" />

      {/* Grid of Photos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {photos.map((photo, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedPhotoIndex(idx)}
            className="group relative rounded-2xl overflow-hidden border-2 border-[#d4af37]/40 shadow-lg cursor-pointer bg-stone-900 aspect-[3/4]"
          >
            <img
              src={photo.url}
              alt={lang === 'km' ? photo.titleKm : photo.titleEn}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
              decoding="async"
            />
            {/* Elegant overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <span className="text-[10px] tracking-widest uppercase text-amber-300 font-semibold">
                Photo {String(idx + 1).padStart(2, '0')}
              </span>
              <h4 className="text-sm sm:text-base font-semibold text-white drop-shadow">
                {lang === 'km' ? photo.titleKm : photo.titleEn}
              </h4>
              <p className="text-xs text-amber-100/80 drop-shadow line-clamp-1">
                {lang === 'km' ? photo.captionKm : photo.captionEn}
              </p>
            </div>

            <div className="absolute top-3 right-3 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition shadow">
              <Maximize2 className="w-4 h-4 text-amber-300" />
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {selectedPhotoIndex !== null && (
        <div
          onClick={() => setSelectedPhotoIndex(null)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in"
        >
          <button
            onClick={handlePrev}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition active:scale-95 z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition active:scale-95 z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-xl sm:max-w-2xl w-full max-h-[85vh] flex flex-col items-center relative"
          >
            <div className="relative rounded-2xl overflow-hidden border-2 border-amber-400/60 shadow-2xl">
              {/* Photo Index Counter */}
              <span className="absolute top-3 left-3 z-20 px-3 py-1 rounded-full bg-black/60 text-amber-300 text-xs font-semibold backdrop-blur-md border border-white/20">
                {selectedPhotoIndex + 1} / {photos.length}
              </span>

              {/* Close Button on Edge of Image */}
              <button
                onClick={() => setSelectedPhotoIndex(null)}
                aria-label="Close"
                className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/60 hover:bg-black/85 text-white/90 hover:text-white transition active:scale-95 backdrop-blur-md border border-white/20 shadow-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <img
                src={photos[selectedPhotoIndex].url}
                alt="Enlarged pre-wedding photo"
                className="w-full max-h-[70vh] object-contain bg-black"
              />
            </div>
            <div className="mt-4 text-center text-white space-y-1">
              <p className="text-base font-semibold text-amber-300">
                {lang === 'km'
                  ? photos[selectedPhotoIndex].titleKm
                  : photos[selectedPhotoIndex].titleEn}
              </p>
              <p className="text-xs text-stone-300">
                {lang === 'km'
                  ? photos[selectedPhotoIndex].captionKm
                  : photos[selectedPhotoIndex].captionEn}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
