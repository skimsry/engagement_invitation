import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Camera, Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchStartY, setTouchStartY] = useState(null);

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

  // Lock body scroll and handle keyboard navigation when modal is open
  useEffect(() => {
    if (selectedPhotoIndex === null) return;

    const originalOverflow = document.body.style.overflow;
    const originalTouchAction = document.body.style.touchAction;
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedPhotoIndex(null);
      } else if (e.key === 'ArrowRight') {
        setSelectedPhotoIndex((prev) => (prev + 1) % photos.length);
      } else if (e.key === 'ArrowLeft') {
        setSelectedPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.touchAction = originalTouchAction;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedPhotoIndex, photos.length]);

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
    if (e) e.stopPropagation();
    setSelectedPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const handlePrev = (e) => {
    if (e) e.stopPropagation();
    setSelectedPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;

    // Trigger swipe only if horizontal movement is dominant and > 40px
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
      if (diffX > 0) {
        setSelectedPhotoIndex((prev) => (prev + 1) % photos.length);
      } else {
        setSelectedPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
      }
    }
    setTouchStartX(null);
    setTouchStartY(null);
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

      {/* Fullscreen Lightbox Modal (Portaled to document.body to avoid containment clipping & scrolling) */}
      {selectedPhotoIndex !== null && typeof document !== 'undefined' && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedPhotoIndex(null)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex flex-col justify-between select-none animate-fade-in"
        >
          {/* Top Bar */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 z-20 bg-gradient-to-b from-black/80 to-transparent"
          >
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold backdrop-blur-md border border-amber-400/30">
                {selectedPhotoIndex + 1} / {photos.length}
              </span>
              <span className="text-xs text-stone-400 hidden sm:inline">
                {content.sectionTitle}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setSelectedPhotoIndex(null)}
              aria-label="Close"
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-stone-200 hover:text-white transition backdrop-blur-md border border-white/20 cursor-pointer shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Middle Stage: Photo with Nav Arrows */}
          <div className="flex-1 min-h-0 flex items-center justify-center relative px-2 sm:px-14">
            {/* Prev Button */}
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous Photo"
              className="absolute left-2 sm:left-4 z-20 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-black/80 text-amber-200 hover:text-white border border-amber-400/30 backdrop-blur-md transition active:scale-90 cursor-pointer shadow-xl"
            >
              <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
            </button>

            {/* Photo Container - fits natural aspect ratio cleanly */}
            <div
              className="relative flex items-center justify-center max-w-full max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                key={selectedPhotoIndex}
                src={photos[selectedPhotoIndex].url}
                alt={lang === 'km' ? photos[selectedPhotoIndex].titleKm : photos[selectedPhotoIndex].titleEn}
                className="max-w-[92vw] sm:max-w-[80vw] max-h-[70vh] sm:max-h-[76vh] w-auto h-auto object-contain rounded-xl sm:rounded-2xl border-2 border-amber-400/50 shadow-2xl transition-all duration-200"
              />
            </div>

            {/* Next Button */}
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next Photo"
              className="absolute right-2 sm:right-4 z-20 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-black/80 text-amber-200 hover:text-white border border-amber-400/30 backdrop-blur-md transition active:scale-90 cursor-pointer shadow-xl"
            >
              <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
            </button>
          </div>

          {/* Bottom Bar: Title, Caption and Indicator Dots */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full px-4 py-3 sm:py-4 z-20 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex flex-col items-center text-center space-y-1.5"
          >
            <h4 className="text-sm sm:text-base font-semibold text-amber-300 drop-shadow line-clamp-1">
              {lang === 'km'
                ? photos[selectedPhotoIndex].titleKm
                : photos[selectedPhotoIndex].titleEn}
            </h4>
            <p className="text-xs sm:text-sm text-stone-300 max-w-md drop-shadow line-clamp-2 font-light">
              {lang === 'km'
                ? photos[selectedPhotoIndex].captionKm
                : photos[selectedPhotoIndex].captionEn}
            </p>

            {/* Indicator Dots */}
            <div className="flex items-center gap-1.5 pt-1">
              {photos.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedPhotoIndex(i)}
                  aria-label={`Photo ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    i === selectedPhotoIndex
                      ? 'w-6 bg-amber-400'
                      : 'w-1.5 bg-white/30 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}

