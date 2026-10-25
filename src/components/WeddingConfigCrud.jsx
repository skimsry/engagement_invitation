import { useState, useEffect, useRef } from 'react';
import {
  Heart,
  Image as ImageIcon,
  Calendar,
  Clock,
  MapPin,
  Camera,
  Gift,
  Music,
  Plus,
  Trash2,
  Edit2,
  Save,
  RotateCcw,
  Check,
  ExternalLink,
  Play,
  Pause,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Upload,
  Loader2,
  X,
  QrCode,
  Copy,
  Volume2,
  VolumeX
} from 'lucide-react';
import { DEFAULT_WEDDING_CONFIG, saveStoredWeddingConfig, getStoredWeddingConfig } from '../utils/weddingConfig';
import CountdownTimer from './CountdownTimer';

// Custom YouTube Icon
const Youtube = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const handleImageFileUpload = (file, callback, onError) => {
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    const msg = 'សូមជ្រើសរើសឯកសារជារូបភាព (PNG, JPG, WEBP)!';
    if (onError) onError(msg);
    else alert(msg);
    return;
  }
  const reader = new FileReader();
  reader.onerror = () => {
    const msg = 'មិនអាចអានឯកសាររូបភាពបានទេ សូមជ្រើសរើសរូបភាពផ្សេង!';
    if (onError) onError(msg);
    else alert(msg);
  };
  reader.onload = (e) => {
    const rawDataUrl = e.target.result;
    const img = new Image();
    img.onerror = () => {
      // Fallback for SVG or formats unsupported by canvas decode
      const approxKb = Math.round(file.size / 1024);
      callback(rawDataUrl, approxKb);
    };
    img.onload = () => {
      try {
        const maxDim = 960; // Web-optimized: clear resolution on high-DPI displays while keeping storage ~50-80KB
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.75);
        const approxKb = Math.round((compressedDataUrl.length * 3) / 4 / 1024);
        callback(compressedDataUrl, approxKb);
      } catch (err) {
        console.warn('Canvas resize failed, using direct data URL:', err);
        const approxKb = Math.round(file.size / 1024);
        callback(rawDataUrl, approxKb);
      }
    };
    img.src = rawDataUrl;
  };
  reader.readAsDataURL(file);
};

const toKhmerNumber = (num) => {
  const khmerDigits = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];
  return String(num).replace(/[0-9]/g, (d) => khmerDigits[d]);
};

const formatKhmerDate = (d) => {
  const khmerDays = ['ថ្ងៃអាទិត្យ', 'ថ្ងៃច័ន្ទ', 'ថ្ងៃអង្គារ', 'ថ្ងៃពុធ', 'ថ្ងៃព្រហស្បតិ៍', 'ថ្ងៃសុក្រ', 'ថ្ងៃសៅរ៍'];
  const khmerMonths = ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'];
  const dayName = khmerDays[d.getDay()];
  const dayNum = toKhmerNumber(d.getDate());
  const monthName = khmerMonths[d.getMonth()];
  const yearNum = toKhmerNumber(d.getFullYear());
  return `${dayName} ទី${dayNum} ខែ${monthName} ឆ្នាំ${yearNum}`;
};

const formatEnglishDate = (d) => {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const dateStr = d.toLocaleDateString('en-US', options);
  const timeStr = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  return `${dateStr} • ${timeStr}`;
};

const getGoogleMapsEmbedUrl = (url, fallbackQuery = '') => {
  const raw = (url || '').trim();
  if (!raw && !fallbackQuery) return null;

  if (raw.includes('output=embed')) {
    return raw;
  }

  try {
    if (raw.startsWith('http://') || raw.startsWith('https://')) {
      const parsed = new URL(raw);

      // If query param q or query exists
      const q = parsed.searchParams.get('q') || parsed.searchParams.get('query');
      if (q) {
        return `https://maps.google.com/maps?q=${encodeURIComponent(q)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
      }

      // If path has /place/Name/@lat,lng
      const placeMatch = parsed.pathname.match(/\/place\/([^\/@]+)/);
      if (placeMatch && placeMatch[1]) {
        const placeName = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
        return `https://maps.google.com/maps?q=${encodeURIComponent(placeName)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
      }

      // If short link maps.app.goo.gl/is1RjP4f2pYupsgT8 or coordinates
      if (raw.includes('is1RjP4f2pYupsgT8')) {
        return `https://maps.google.com/maps?q=13.1067451,104.1262930&t=&z=16&ie=UTF8&iwloc=&output=embed`;
      }
    }
  } catch {
    // fallback below
  }

  const query = raw || fallbackQuery;
  if (!query) return null;
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
};

export default function WeddingConfigCrud({ config: propConfig, onUpdateConfig, lang = 'km', onBack }) {
  const [activeTab, setActiveTab] = useState('couple');
  const [formData, setFormData] = useState(() => {
    const base = propConfig || getStoredWeddingConfig();
    return JSON.parse(JSON.stringify(base));
  });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [audioTesting, setAudioTesting] = useState(false);
  const [audioElement, setAudioElement] = useState(null);
  const tabsContainerRef = useRef(null);
  const datePickerRef = useRef(null);

  // Parse current dateTime into datetime-local format: YYYY-MM-DDTHH:mm
  const getDatetimeLocalValue = () => {
    try {
      if (!formData.eventDate?.dateTime) return '';
      const d = new Date(formData.eventDate.dateTime);
      if (isNaN(d.getTime())) return '';
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch {
      return '';
    }
  };

  const handleDateChange = (newVal, autoFillText = true) => {
    if (!newVal) return;
    const isoString = `${newVal}:00+07:00`;
    const d = new Date(isoString);

    setFormData(prev => ({
      ...prev,
      eventDate: {
        ...prev.eventDate,
        dateTime: isoString,
        ...(autoFillText && !isNaN(d.getTime()) ? {
          dateTextKm: formatKhmerDate(d),
          dateTextEn: formatEnglishDate(d)
        } : {})
      }
    }));
  };

  const scrollTabs = (offset) => {
    if (tabsContainerRef.current) {
      tabsContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (propConfig) {
      setFormData(JSON.parse(JSON.stringify(propConfig)));
    }
  }, [propConfig]);

  // Modal for editing/adding Schedule Item
  const [scheduleModal, setScheduleModal] = useState({
    isOpen: false,
    item: null,
    isEdit: false
  });

  // Modal for editing/adding Gallery Item
  const [galleryModal, setGalleryModal] = useState({
    isOpen: false,
    item: null,
    isEdit: false,
    editIndex: -1
  });

  // Audio & Media Uploading State & Element Refs
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isUploadingQr, setIsUploadingQr] = useState(false);
  const [isUploadingAudio, setIsUploadingAudio] = useState(false);
  const galleryFileInputRef = useRef(null);
  const modalFileInputRef = useRef(null);
  const coverFileInputRef = useRef(null);
  const plaqueFileInputRef = useRef(null);
  const heroFileInputRef = useRef(null);
  const videoFileInputRef = useRef(null);
  const posterFileInputRef = useRef(null);
  const angpaoQrFileInputRef = useRef(null);
  const audioFileInputRef = useRef(null);

  const handleSave = (e) => {
    if (e) e.preventDefault();
    saveStoredWeddingConfig(formData);
    onUpdateConfig?.(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleResetToDefault = () => {
    const confirmReset = window.confirm(
      lang === 'km'
        ? 'តើអ្នកពិតជាចង់កំណត់ព័ត៌មានកម្មវិធីទាំងអស់ទៅជាតម្លៃដើមវិញមែនទេ?'
        : 'Are you sure you want to reset all wedding details to defaults?'
    );
    if (!confirmReset) return;
    const defaults = JSON.parse(JSON.stringify(DEFAULT_WEDDING_CONFIG));
    setFormData(defaults);
    saveStoredWeddingConfig(defaults);
    onUpdateConfig?.(defaults);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Helper to extract YouTube video ID from various URL formats
  const extractYouTubeId = (url) => {
    if (!url || typeof url !== 'string') return null;
    const trimmed = url.trim();
    const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = trimmed.match(regExp);
    return match ? match[1] : null;
  };

  // Handle local MP3 audio file upload (FileReader -> Base64 data URL)
  const handleAudioFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('audio/') && !file.name.toLowerCase().endsWith('.mp3')) {
      alert(lang === 'km' ? 'សូមជ្រើសរើសឯកសារសំឡេង (.mp3, .m4a, .wav, .ogg)!' : 'Please select a valid audio file (.mp3, .m4a, .wav)!');
      return;
    }

    // Check size limit: keep within reasonable storage limit (~3.5MB max for base64)
    if (file.size > 3.8 * 1024 * 1024) {
      alert(lang === 'km'
        ? 'ឯកសារសំឡេងធំពេក (លើសពី 3.5MB)! ដើម្បីការពារការលើសទំហំ Storage សូមប្រើប្រាស់ File តូចជាងនេះ ឬដាក់តំណភ្ជាប់ YouTube / MP3 URL វិញ។'
        : 'Audio file too large (>3.5MB). Please choose a smaller track or use a direct MP3 / YouTube URL.');
      return;
    }

    setIsUploadingAudio(true);
    const reader = new FileReader();
    reader.onerror = () => {
      setIsUploadingAudio(false);
      alert(lang === 'km' ? 'មិនអាចអានឯកសារសំឡេងបានទេ!' : 'Failed to read audio file!');
    };
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      const cleanFileName = file.name.replace(/\.[^/.]+$/, '');
      setFormData(prev => {
        const updated = {
          ...prev,
          audio: {
            ...prev.audio,
            audioUrl: dataUrl,
            songTitle: prev.audio.songTitle === DEFAULT_WEDDING_CONFIG.audio.songTitle ? cleanFileName : prev.audio.songTitle
          }
        };
        saveStoredWeddingConfig(updated);
        onUpdateConfig?.(updated);
        return updated;
      });
      setIsUploadingAudio(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    };
    reader.readAsDataURL(file);
    // Reset input value so re-uploading same file works
    e.target.value = '';
  };

  // Audio Preview Toggle
  const toggleTestAudio = () => {
    if (audioTesting && audioElement) {
      audioElement.pause();
      setAudioTesting(false);
    } else {
      const ytId = extractYouTubeId(formData.audio.audioUrl);
      if (ytId) {
        // For YouTube, toggle state
        setAudioTesting(prev => !prev);
        return;
      }

      try {
        if (audioElement) {
          audioElement.pause();
        }
        const audio = new Audio(formData.audio.audioUrl);
        audio.volume = 0.75;
        audio.play().then(() => {
          setAudioElement(audio);
          setAudioTesting(true);
          audio.onended = () => setAudioTesting(false);
        }).catch((err) => {
          alert((lang === 'km' ? 'មិនអាចចាក់សំឡេងបានទេ: ' : 'Cannot play audio: ') + err.message);
        });
      } catch (err) {
        alert((lang === 'km' ? 'តំណភ្ជាប់មិនត្រឹមត្រូវ: ' : 'Invalid audio URL: ') + err.message);
      }
    }
  };

  // Schedule CRUD Handlers
  const handleSaveScheduleItem = (e) => {
    if (e) e.preventDefault();
    const item = scheduleModal.item;
    if (!item?.time || !item?.titleKm) {
      alert(lang === 'km' ? 'សូមបំពេញម៉ោង និងឈ្មោះកម្មវិធីជាភាសាខ្មែរ' : 'Please fill in required fields');
      return;
    }
    setFormData(prev => {
      let updated;
      if (scheduleModal.isEdit) {
        updated = prev.schedule.map(s => String(s.id) === String(item.id) ? item : s);
      } else {
        const newItem = { ...item, id: Date.now().toString() };
        updated = [...(prev.schedule || []), newItem];
      }
      const newConfig = { ...prev, schedule: updated };
      saveStoredWeddingConfig(newConfig);
      onUpdateConfig?.(newConfig);
      return newConfig;
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
    setScheduleModal({ isOpen: false, item: null, isEdit: false });
  };

  const handleDeleteScheduleItem = (id) => {
    if (!window.confirm(lang === 'km' ? 'តើអ្នកពិតជាចង់លុបកម្មវិធីនេះមែនទេ?' : 'Delete this agenda item?')) return;
    setFormData(prev => {
      const updated = (prev.schedule || []).filter(s => String(s.id) !== String(id));
      const newConfig = { ...prev, schedule: updated };
      saveStoredWeddingConfig(newConfig);
      onUpdateConfig?.(newConfig);
      return newConfig;
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Gallery CRUD Handlers
  const handleOpenAddPhoto = () => {
    setGalleryModal({
      isOpen: true,
      isEdit: false,
      editIndex: -1,
      item: {
        id: Date.now().toString(),
        url: '',
        titleKm: '',
        titleEn: '',
        captionKm: '',
        captionEn: ''
      }
    });
  };

  const handleOpenEditPhoto = (photo, idx) => {
    setGalleryModal({
      isOpen: true,
      isEdit: true,
      editIndex: idx,
      item: {
        id: photo.id ? String(photo.id) : String(idx + 1),
        url: photo.url || '',
        titleKm: photo.titleKm || '',
        titleEn: photo.titleEn || '',
        captionKm: photo.captionKm || '',
        captionEn: photo.captionEn || ''
      }
    });
  };

  const handleHeaderFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingPhoto(true);
    handleImageFileUpload(
      file,
      (dataUrl, sizeKb) => {
        setIsUploadingPhoto(false);
        setGalleryModal({
          isOpen: true,
          isEdit: false,
          editIndex: -1,
          item: {
            id: Date.now().toString(),
            url: dataUrl,
            titleKm: 'រូបថតថ្មី',
            titleEn: 'New Photo',
            captionKm: '',
            captionEn: '',
            sizeKb
          }
        });
      },
      (errMsg) => {
        setIsUploadingPhoto(false);
        alert(errMsg);
      }
    );
    e.target.value = '';
  };

  const handleModalFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingPhoto(true);
    handleImageFileUpload(
      file,
      (dataUrl, sizeKb) => {
        setIsUploadingPhoto(false);
        setGalleryModal(prev => ({
          ...prev,
          item: {
            ...(prev.item || {}),
            url: dataUrl,
            sizeKb
          }
        }));
      },
      (errMsg) => {
        setIsUploadingPhoto(false);
        alert(errMsg);
      }
    );
    e.target.value = '';
  };

  const handleSaveGalleryItem = (e) => {
    if (e) e.preventDefault();
    const item = galleryModal.item;
    if (!item?.url || !item.url.trim()) {
      alert(lang === 'km' ? 'សូមជ្រើសរើស ឬ Upload រូបភាពជាមុនសិន' : 'Please provide or upload an image URL');
      return;
    }
    setFormData(prev => {
      const list = Array.isArray(prev.gallery) ? [...prev.gallery] : [];
      let updated;
      if (galleryModal.isEdit && galleryModal.editIndex >= 0 && galleryModal.editIndex < list.length) {
        updated = [...list];
        updated[galleryModal.editIndex] = {
          ...item,
          id: item.id || list[galleryModal.editIndex]?.id || Date.now().toString()
        };
      } else if (galleryModal.isEdit) {
        updated = list.map(g => String(g.id) === String(item.id) ? item : g);
      } else {
        const newItem = {
          ...item,
          id: item.id || Date.now().toString()
        };
        updated = [...list, newItem];
      }
      const newConfig = { ...prev, gallery: updated };
      const saveRes = saveStoredWeddingConfig(newConfig);
      if (saveRes && saveRes.success === false) {
        alert(lang === 'km'
          ? 'មិនអាចរក្សាទុករូបភាពបានទេ ដោយសារទំហំផ្ទុក Browser (LocalStorage) ពេញ! សូមជ្រើសរើសរូបភាពតូចជាងនេះ ឬលុបរូបភាពចាស់ៗមួយចំនួន។'
          : 'Storage quota exceeded. Please use a smaller photo or delete old photos.');
      }
      onUpdateConfig?.(newConfig);
      return newConfig;
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
    setGalleryModal({ isOpen: false, item: null, isEdit: false, editIndex: -1 });
  };

  const handleDeleteGalleryItem = (id, idx) => {
    if (!window.confirm(lang === 'km' ? 'តើអ្នកពិតជាចង់លុបរូបភាពនេះមែនទេ?' : 'Delete this photo?')) return;
    setFormData(prev => {
      const list = Array.isArray(prev.gallery) ? [...prev.gallery] : [];
      let updated;
      if (typeof idx === 'number' && idx >= 0 && idx < list.length) {
        updated = list.filter((_, i) => i !== idx);
      } else {
        updated = list.filter(g => String(g.id) !== String(id));
      }
      const newConfig = { ...prev, gallery: updated };
      saveStoredWeddingConfig(newConfig);
      onUpdateConfig?.(newConfig);
      return newConfig;
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const tabs = [
    { id: 'couple', icon: Heart, labelKm: 'គូដណ្តឹង', labelEn: 'Couple Names' },
    { id: 'cover', icon: ImageIcon, labelKm: 'រូបភាពបើកធៀប', labelEn: 'Opening Cover' },
    { id: 'date', icon: Calendar, labelKm: 'កាលបរិច្ឆេទ & រាប់ថយក្រោយ', labelEn: 'Date & Countdown' },
    { id: 'schedule', icon: Clock, labelKm: 'កម្មវិធីមង្គល', labelEn: 'Schedule' },
    { id: 'venue', icon: MapPin, labelKm: 'ទីតាំង & Maps', labelEn: 'Venue & Maps' },
    { id: 'gallery', icon: Camera, labelKm: 'វិចិត្រសាលរូបភាព', labelEn: 'Gallery' },
    { id: 'angpao', icon: Gift, labelKm: 'ចំណងដៃឌីជីថល', labelEn: 'Digital Angpao' },
    { id: 'audio', icon: Music, labelKm: 'ចម្រៀង & Audio', labelEn: 'Background Audio' }
  ];

  return (
    <div className="w-full space-y-6">
      {/* Top Banner & Global Save/Reset Buttons */}
      <div className="bg-[#181512] border border-[#d4af37]/35 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <h2 className="font-moulpali text-base sm:text-lg text-[#f3e5ab] flex items-center gap-2">
            <span>{lang === 'km' ? '⚙️ កំណត់ព័ត៌មានលម្អិតនៃកម្មវិធី' : '⚙️ Wedding Invitation Details CMS'}</span>
          </h2>
          <p className="text-xs text-stone-400">
            {lang === 'km'
              ? 'កែប្រែឈ្មោះ ថ្ងៃខែ ទីតាំង រូបភាព ចម្រៀង និងកាលវិភាគកម្មវិធី'
              : 'Customize couple names, dates, maps, photos, music, and agenda'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="py-2.5 px-3.5 rounded-xl bg-white/5 hover:bg-rose-950/40 border border-stone-700 hover:border-rose-500/50 text-stone-300 hover:text-rose-200 text-xs font-semibold transition active:scale-95 flex items-center gap-1.5"
            title="Reset All to Defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{lang === 'km' ? 'កំណត់ឡើងវិញ' : 'Reset'}</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-[#996515] via-[#b8860b] to-[#d4af37] text-stone-950 font-bold text-xs sm:text-sm shadow-[0_4px_20px_rgba(212,175,55,0.4)] hover:brightness-110 active:scale-95 transition flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>{lang === 'km' ? 'រក្សាទុកការកែប្រែ' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Success Banner */}
      {saveSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/50 border border-emerald-500/60 text-emerald-300 text-xs sm:text-sm flex items-center justify-between shadow-lg animate-fade-in">
          <div className="flex items-center gap-2 font-semibold">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{lang === 'km' ? 'បានរក្សាទុកព័ត៌មានដោយជោគជ័យ! ទិន្នន័យត្រូវបាន Update លើធៀបអញ្ជើញភ្លាមៗ។' : 'Wedding details saved successfully! Live invitation updated.'}</span>
          </div>
        </div>
      )}

      {/* Modern Tabs Navigation: Auto-wraps on desktop (no scroll needed on PC) + Mouse wheel horizontal scrolling & arrow buttons */}
      <div className="relative group/tabs">
        {/* Left Arrow Button for mobile/overflowing screens */}
        <button
          type="button"
          onClick={() => scrollTabs(-200)}
          className="sm:hidden absolute -left-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-black/85 border border-[#d4af37]/60 text-[#fde047] flex items-center justify-center shadow-lg active:scale-95 transition"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Right Arrow Button for mobile/overflowing screens */}
        <button
          type="button"
          onClick={() => scrollTabs(200)}
          className="sm:hidden absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-black/85 border border-[#d4af37]/60 text-[#fde047] flex items-center justify-center shadow-lg active:scale-95 transition"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <div
          ref={tabsContainerRef}
          onWheel={(e) => {
            if (e.deltaY !== 0 && tabsContainerRef.current) {
              // Convert mouse wheel vertical scroll to horizontal scroll on PC
              tabsContainerRef.current.scrollLeft += e.deltaY;
            }
          }}
          className="flex items-center gap-2 overflow-x-auto sm:flex-wrap sm:overflow-visible pb-2 px-1 scrollbar-thin scrollbar-thumb-[#d4af37]/40 scrollbar-track-stone-900/60"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer active:scale-95 border ${isActive
                  ? 'bg-gradient-to-r from-[#996515]/40 to-[#d4af37]/30 border-[#d4af37] text-[#fde047] shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                  : 'bg-[#181512] border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700'
                  }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#fde047]' : 'text-stone-400'}`} />
                <span>{lang === 'km' ? tab.labelKm : tab.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: COUPLE NAMES (MAN & WOMAN - KH & EN) */}
      {activeTab === 'couple' && (
        <div className="bg-[#181512] border border-stone-800 rounded-3xl p-5 sm:p-6 space-y-6">
          <div className="border-b border-stone-800 pb-3">
            <h3 className="font-moulpali text-sm sm:text-base text-[#f3e5ab] flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
              <span>{lang === 'km' ? 'ព័ត៌មានឈ្មោះគូដណ្តឹង (Groom & Bride)' : 'Bride & Groom Full Names'}</span>
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              {lang === 'km' ? 'កំណត់នាមត្រកូល និងនាមខ្លួន ទាំងភាសាខ្មែរ និងអង់គ្លេស' : 'Set first and last names in both Khmer and English'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* GROOM (MAN) */}
            <div className="bg-[#12100e] border border-[#d4af37]/30 rounded-2xl p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                <span className="text-xs font-bold text-amber-300">🤵 {lang === 'km' ? 'ខាងប្រុស (Groom)' : 'Groom'}</span>
                <span className="text-[11px] text-stone-400 font-mono">
                  {formData.couple.groom.lastNameKm} {formData.couple.groom.firstNameKm}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-stone-400 mb-1">{lang === 'km' ? 'នាមត្រកូល (ខ្មែរ)' : 'Last Name (KM)'}</label>
                  <input
                    type="text"
                    value={formData.couple.groom.lastNameKm}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      couple: { ...prev.couple, groom: { ...prev.couple.groom, lastNameKm: e.target.value } }
                    }))}
                    className="w-full bg-[#181512] border border-stone-700 focus:border-[#d4af37] rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none"
                    placeholder="សន"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-stone-400 mb-1">{lang === 'km' ? 'នាមខ្លួន (ខ្មែរ)' : 'First Name (KM)'}</label>
                  <input
                    type="text"
                    value={formData.couple.groom.firstNameKm}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      couple: { ...prev.couple, groom: { ...prev.couple.groom, firstNameKm: e.target.value } }
                    }))}
                    className="w-full bg-[#181512] border border-stone-700 focus:border-[#d4af37] rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none"
                    placeholder="គឹមសាន្ត"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-stone-400 mb-1">Last Name (EN)</label>
                  <input
                    type="text"
                    value={formData.couple.groom.lastNameEn}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      couple: { ...prev.couple, groom: { ...prev.couple.groom, lastNameEn: e.target.value } }
                    }))}
                    className="w-full bg-[#181512] border border-stone-700 focus:border-[#d4af37] rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none uppercase"
                    placeholder="SORN"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-stone-400 mb-1">First Name (EN)</label>
                  <input
                    type="text"
                    value={formData.couple.groom.firstNameEn}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      couple: { ...prev.couple, groom: { ...prev.couple.groom, firstNameEn: e.target.value } }
                    }))}
                    className="w-full bg-[#181512] border border-stone-700 focus:border-[#d4af37] rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none"
                    placeholder="Kimsan"
                  />
                </div>
              </div>
            </div>

            {/* BRIDE (WOMAN) */}
            <div className="bg-[#12100e] border border-rose-500/30 rounded-2xl p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                <span className="text-xs font-bold text-rose-300">👰 {lang === 'km' ? 'ខាងស្រី (Bride)' : 'Bride'}</span>
                <span className="text-[11px] text-stone-400 font-mono">
                  {formData.couple.bride.lastNameKm} {formData.couple.bride.firstNameKm}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-stone-400 mb-1">{lang === 'km' ? 'នាមត្រកូល (ខ្មែរ)' : 'Last Name (KM)'}</label>
                  <input
                    type="text"
                    value={formData.couple.bride.lastNameKm}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      couple: { ...prev.couple, bride: { ...prev.couple.bride, lastNameKm: e.target.value } }
                    }))}
                    className="w-full bg-[#181512] border border-stone-700 focus:border-rose-400 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none"
                    placeholder="ង៉ោ"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-stone-400 mb-1">{lang === 'km' ? 'នាមខ្លួន (ខ្មែរ)' : 'First Name (KM)'}</label>
                  <input
                    type="text"
                    value={formData.couple.bride.firstNameKm}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      couple: { ...prev.couple, bride: { ...prev.couple.bride, firstNameKm: e.target.value } }
                    }))}
                    className="w-full bg-[#181512] border border-stone-700 focus:border-rose-400 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none"
                    placeholder="អូយសាំង"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-stone-400 mb-1">Last Name (EN)</label>
                  <input
                    type="text"
                    value={formData.couple.bride.lastNameEn}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      couple: { ...prev.couple, bride: { ...prev.couple.bride, lastNameEn: e.target.value } }
                    }))}
                    className="w-full bg-[#181512] border border-stone-700 focus:border-rose-400 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none uppercase"
                    placeholder="NGO"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-stone-400 mb-1">First Name (EN)</label>
                  <input
                    type="text"
                    value={formData.couple.bride.firstNameEn}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      couple: { ...prev.couple, bride: { ...prev.couple.bride, firstNameEn: e.target.value } }
                    }))}
                    className="w-full bg-[#181512] border border-stone-700 focus:border-rose-400 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none"
                    placeholder="Uysang"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INVITATION OPENING COVER & PHOTO PLAQUE */}
      {activeTab === 'cover' && (
        <div className="bg-[#181512] border border-stone-800 rounded-3xl p-5 sm:p-6 space-y-6">
          <div className="border-b border-stone-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-moulpali text-sm sm:text-base text-[#f3e5ab] flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-amber-400" />
                <span>{lang === 'km' ? 'រូបភាពបើកធៀប, ស៊ុមឈ្មោះភ្ញៀវ & រូបគូដណ្តឹង' : 'Cover Assets, Portrait Plaque & Hero Photo'}</span>
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                {lang === 'km'
                  ? 'កំណត់រូបភាពស៊ុមបើកទ្វារ, បន្ទះស៊ុមឈ្មោះភ្ញៀវ (Portrait Plaque) និងរូបគូដណ្តឹងទំព័រដើម (Hero Photo)'
                  : 'Customize opening gate frame, guest honorific plaque, and homepage hero couple portrait'}
              </p>
            </div>
            <span className="text-[11px] px-3 py-1 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#fde047] font-semibold self-start sm:self-auto">
              {lang === 'km' ? 'Upload & Live Preview គ្រប់រូបភាព' : 'Full Upload & Previews'}
            </span>
          </div>

          {/* Hidden File Inputs */}
          <input
            ref={coverFileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleImageFileUpload(file, (dataUrl) => {
                  setFormData(prev => ({
                    ...prev,
                    cover: { ...prev.cover, openingCoverImage: dataUrl }
                  }));
                  setSaveSuccess(true);
                  setTimeout(() => setSaveSuccess(false), 3000);
                });
              }
              e.target.value = '';
            }}
          />

          <input
            ref={plaqueFileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleImageFileUpload(file, (dataUrl) => {
                  setFormData(prev => ({
                    ...prev,
                    cover: { ...prev.cover, portraitPlaqueImage: dataUrl }
                  }));
                  setSaveSuccess(true);
                  setTimeout(() => setSaveSuccess(false), 3000);
                });
              }
              e.target.value = '';
            }}
          />

          <input
            ref={heroFileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleImageFileUpload(file, (dataUrl) => {
                  setFormData(prev => ({
                    ...prev,
                    cover: { ...prev.cover, heroImage: dataUrl }
                  }));
                  setSaveSuccess(true);
                  setTimeout(() => setSaveSuccess(false), 3000);
                });
              }
              e.target.value = '';
            }}
          />

          {/* Hidden File Inputs for Video & Poster */}
          <input
            ref={videoFileInputRef}
            type="file"
            accept="video/mp4,video/webm,video/quicktime"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              if (file.size > 25 * 1024 * 1024) {
                alert(lang === 'km' ? 'ឯកសារវីដេអូធំពេក (លើសពី 25MB)! សូមជ្រើសរើសវីដេអូតូច ឬដាក់ URL វិញ។' : 'Video too large (>25MB)! Please select a smaller video or enter URL.');
                return;
              }
              const reader = new FileReader();
              reader.onload = (event) => {
                setFormData(prev => ({
                  ...prev,
                  cover: { ...prev.cover, openingVideo: event.target.result }
                }));
                setSaveSuccess(true);
                setTimeout(() => setSaveSuccess(false), 3000);
              };
              reader.readAsDataURL(file);
              e.target.value = '';
            }}
          />

          <input
            ref={posterFileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleImageFileUpload(file, (dataUrl) => {
                  setFormData(prev => ({
                    ...prev,
                    cover: { ...prev.cover, homeCoverPoster: dataUrl }
                  }));
                  setSaveSuccess(true);
                  setTimeout(() => setSaveSuccess(false), 3000);
                });
              }
              e.target.value = '';
            }}
          />

          {/* 3 Main Assets Cards with Upload + Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* 1. GUEST HONORIFIC PLAQUE (/images/wedding-portrait-plaque.webp) */}
            <div className="bg-[#12100e] border border-[#d4af37]/40 rounded-2xl p-4 flex flex-col justify-between space-y-3 shadow-lg">
              <div className="space-y-2">
                <div className="flex items-center justify-between pb-1.5 border-b border-stone-800">
                  <span className="text-xs font-bold text-amber-300">
                    📜 {lang === 'km' ? 'បន្ទះស៊ុមឈ្មោះភ្ញៀវ (Plaque)' : 'Guest Honorific Plaque'}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-500/30 font-mono">
                    Plaque
                  </span>
                </div>

                <p className="text-[11px] text-stone-400">
                  {lang === 'km'
                    ? 'រូបបន្ទះស៊ុមមាសសម្រាប់បង្ហាញឈ្មោះភ្ញៀវកិត្តិយសលើធៀបបើក'
                    : 'Golden plaque displaying honored guest name upon opening'}
                </p>

                {/* Live Preview Box with sample guest name */}
                <div className="relative aspect-[596/419] rounded-xl overflow-hidden border border-[#d4af37]/50 bg-black/80 flex items-center justify-center shadow-inner group">
                  <div
                    className="w-full h-full bg-contain bg-center bg-no-repeat relative flex items-center justify-center"
                    style={{
                      backgroundImage: `url('${formData.cover.portraitPlaqueImage || '/images/wedding-portrait-plaque.webp'}')`
                    }}
                  >
                    <div
                      className="absolute flex items-center justify-center px-1 text-center"
                      style={{
                        left: '40.5%',
                        top: '31%',
                        width: '53%',
                        height: '26%',
                      }}
                    >
                      <span className="font-moulpali text-xs sm:text-sm font-bold text-[#fde047] drop-shadow-[0_2px_4px_rgba(0,0,0,1)] line-clamp-1">
                        ឯកឧត្តម លោកជំទាវ
                      </span>
                    </div>
                  </div>

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => plaqueFileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg bg-[#d4af37] text-stone-950 text-xs font-bold shadow flex items-center gap-1 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{lang === 'km' ? 'ប្តូររូបស៊ុម' : 'Change Plaque'}</span>
                    </button>
                  </div>
                </div>

                {/* Input & Upload Button */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] text-stone-400">
                      {lang === 'km' ? 'តំណភ្ជាប់ ឬ Upload ថ្មី:' : 'Image URL or Upload:'}
                    </label>
                    <button
                      type="button"
                      onClick={() => plaqueFileInputRef.current?.click()}
                      className="text-[10px] text-[#fde047] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Upload className="w-3 h-3" />
                      <span>{lang === 'km' ? 'Upload ពីរូបម៉ាស៊ីន' : 'Upload File'}</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={formData.cover.portraitPlaqueImage || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      cover: { ...prev.cover, portraitPlaqueImage: e.target.value }
                    }))}
                    className="w-full bg-black/60 border border-stone-700 focus:border-[#d4af37] rounded-xl px-2.5 py-1.5 text-[11px] text-stone-100 font-mono focus:outline-none"
                    placeholder="/images/wedding-portrait-plaque.webp"
                  />
                  <div className="flex items-center justify-between text-[10px] pt-0.5">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        cover: { ...prev.cover, portraitPlaqueImage: '/images/wedding-portrait-plaque.webp' }
                      }))}
                      className="text-stone-400 hover:text-amber-300 underline cursor-pointer"
                    >
                      {lang === 'km' ? '↺ ប្រើប្រាស់រូបដើម (Default)' : '↺ Use Default'}
                    </button>
                    {formData.cover.portraitPlaqueImage?.startsWith('data:image') && (
                      <span className="text-emerald-400 font-semibold">✓ Custom Uploaded</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. HERO COUPLE PORTRAIT (/images/a1.webp) */}
            <div className="bg-[#12100e] border border-[#d4af37]/40 rounded-2xl p-4 flex flex-col justify-between space-y-3 shadow-lg">
              <div className="space-y-2">
                <div className="flex items-center justify-between pb-1.5 border-b border-stone-800">
                  <span className="text-xs font-bold text-amber-300">
                    💑 {lang === 'km' ? 'រូបគូដណ្តឹងទំព័រដើម (Hero Photo)' : 'Hero Couple Photo (a1.webp)'}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-500/30 font-mono">
                    a1.webp
                  </span>
                </div>

                <p className="text-[11px] text-stone-400">
                  {lang === 'km'
                    ? 'រូបថតគូដណ្តឹងដ៏ស្រស់ស្អាតនៅផ្នែកខាងលើនៃទំព័រដើម (Hero Section)'
                    : 'Main romantic couple portrait displayed in the Hero Section'}
                </p>

                {/* Live Preview Box */}
                <div className="relative aspect-[3/4] max-h-48 mx-auto rounded-xl overflow-hidden border border-[#d4af37]/50 bg-black/80 flex items-center justify-center shadow-inner group">
                  <img
                    src={formData.cover.heroImage || '/images/a1.webp'}
                    alt="Hero Couple Preview"
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                    onError={(e) => { e.target.src = '/images/a1.webp'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col items-center justify-end p-2 text-center">
                    <span className="text-xs sm:text-sm text-[#fde047] font-bold font-moulpali drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                      {formData.couple.groom.lastNameKm} {formData.couple.groom.firstNameKm} ♥ {formData.couple.bride.lastNameKm} {formData.couple.bride.firstNameKm}
                    </span>
                    <span className="text-[10px] text-white/90 font-mono">
                      {formData.couple.groom.firstNameEn} & {formData.couple.bride.firstNameEn}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => heroFileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg bg-[#d4af37] text-stone-950 text-xs font-bold shadow flex items-center gap-1 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{lang === 'km' ? 'ប្តូររូបថត' : 'Change Photo'}</span>
                    </button>
                  </div>
                </div>

                {/* Input & Upload Button */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] text-stone-400">
                      {lang === 'km' ? 'តំណភ្ជាប់ ឬ Upload ថ្មី:' : 'Image URL or Upload:'}
                    </label>
                    <button
                      type="button"
                      onClick={() => heroFileInputRef.current?.click()}
                      className="text-[10px] text-[#fde047] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Upload className="w-3 h-3" />
                      <span>{lang === 'km' ? 'Upload ពីរូបម៉ាស៊ីន' : 'Upload File'}</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={formData.cover.heroImage || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      cover: { ...prev.cover, heroImage: e.target.value }
                    }))}
                    className="w-full bg-black/60 border border-stone-700 focus:border-[#d4af37] rounded-xl px-2.5 py-1.5 text-[11px] text-stone-100 font-mono focus:outline-none"
                    placeholder="/images/a1.webp"
                  />
                  <div className="flex items-center justify-between text-[10px] pt-0.5">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        cover: { ...prev.cover, heroImage: '/images/a1.webp' }
                      }))}
                      className="text-stone-400 hover:text-amber-300 underline cursor-pointer"
                    >
                      {lang === 'km' ? '↺ ប្រើប្រាស់រូបដើម (Default)' : '↺ Use Default'}
                    </button>
                    {formData.cover.heroImage?.startsWith('data:image') && (
                      <span className="text-emerald-400 font-semibold">✓ Custom Uploaded</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. OPENING GATE FINAL FRAME (/images/open_final_frame.webp) */}
            <div className="bg-[#12100e] border border-[#d4af37]/40 rounded-2xl p-4 flex flex-col justify-between space-y-3 shadow-lg">
              <div className="space-y-2">
                <div className="flex items-center justify-between pb-1.5 border-b border-stone-800">
                  <span className="text-xs font-bold text-amber-300">
                    🚪 {lang === 'km' ? 'ស៊ុមពេលទ្វារបើក (Gate Frame)' : 'Gate Opening Final Frame'}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-500/30 font-mono">
                    Frame
                  </span>
                </div>

                <p className="text-[11px] text-stone-400">
                  {lang === 'km'
                    ? 'រូបភាពផ្ទៃខាងក្រោយពេលទ្វារអង្គរបានបើកចប់សព្វគ្រប់'
                    : 'Background frame displayed after Angkor gate animation'}
                </p>

                {/* Live Preview Box */}
                <div className="relative aspect-[3/4] max-h-48 mx-auto rounded-xl overflow-hidden border border-[#d4af37]/50 bg-black/80 flex items-center justify-center shadow-inner group">
                  <img
                    src={formData.cover.openingCoverImage}
                    alt="Opening Frame Preview"
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                    onError={(e) => { e.target.src = '/images/open_final_frame.webp'; }}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => coverFileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg bg-[#d4af37] text-stone-950 text-xs font-bold shadow flex items-center gap-1 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{lang === 'km' ? 'ប្តូរស៊ុមទ្វារ' : 'Change Frame'}</span>
                    </button>
                  </div>
                </div>

                {/* Input & Upload Button */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] text-stone-400">
                      {lang === 'km' ? 'តំណភ្ជាប់ ឬ Upload ថ្មី:' : 'Image URL or Upload:'}
                    </label>
                    <button
                      type="button"
                      onClick={() => coverFileInputRef.current?.click()}
                      className="text-[10px] text-[#fde047] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Upload className="w-3 h-3" />
                      <span>{lang === 'km' ? 'Upload ពីរូបម៉ាស៊ីន' : 'Upload File'}</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={formData.cover.openingCoverImage}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      cover: { ...prev.cover, openingCoverImage: e.target.value }
                    }))}
                    className="w-full bg-black/60 border border-stone-700 focus:border-[#d4af37] rounded-xl px-2.5 py-1.5 text-[11px] text-stone-100 font-mono focus:outline-none"
                    placeholder="/images/open_final_frame.webp"
                  />
                  <div className="flex items-center justify-between text-[10px] pt-0.5">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        cover: { ...prev.cover, openingCoverImage: '/images/open_final_frame.webp' }
                      }))}
                      className="text-stone-400 hover:text-amber-300 underline cursor-pointer"
                    >
                      {lang === 'km' ? '↺ ប្រើប្រាស់រូបដើម (Default)' : '↺ Use Default'}
                    </button>
                    {formData.cover.openingCoverImage?.startsWith('data:image') && (
                      <span className="text-emerald-400 font-semibold">✓ Custom Uploaded</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4 & 5. VIDEO & POSTER CARDS WITH FULL UPLOAD & LIVE PREVIEW */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 4. OPENING VIDEO (open.mp4) */}
            <div className="bg-[#12100e] border border-[#d4af37]/40 rounded-2xl p-4 flex flex-col justify-between space-y-3 shadow-lg">
              <div className="space-y-2">
                <div className="flex items-center justify-between pb-1.5 border-b border-stone-800">
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <span>🎬 {lang === 'km' ? 'វីដេអូបើកទ្វារ (Opening Video MP4)' : 'Opening Video (MP4)'}</span>
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-500/30 font-mono">
                    Video MP4
                  </span>
                </div>

                <p className="text-[11px] text-stone-400">
                  {lang === 'km'
                    ? 'វីដេអូចលនាបើកទ្វារអង្គរវត្តដ៏អស្ចារ្យនៅពេលភ្ញៀវចុច Slide to Open'
                    : 'The cinematic Angkor Wat gate animation video played upon opening'}
                </p>

                {/* Video Interactive Preview */}
                <div className="relative aspect-video rounded-xl overflow-hidden border border-[#d4af37]/50 bg-black/90 shadow-inner group">
                  <video
                    src={formData.cover.openingVideo}
                    controls
                    playsInline
                    className="w-full h-full object-cover"
                    poster={formData.cover.openingPoster || '/images/open-poster.webp'}
                  >
                    Your browser does not support the video tag.
                  </video>
                  <div className="absolute top-2 right-2 flex items-center gap-1 pointer-events-none">
                    <span className="bg-black/70 text-amber-300 text-[9px] font-mono px-2 py-0.5 rounded border border-[#d4af37]/30">
                      Live Video Preview
                    </span>
                  </div>
                </div>

                {/* Input & Upload Button */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] text-stone-400">
                      {lang === 'km' ? 'តំណភ្ជាប់ URL ឬ Upload វីដេអូថ្មី:' : 'Video URL or Upload File:'}
                    </label>
                    <button
                      type="button"
                      onClick={() => videoFileInputRef.current?.click()}
                      className="text-[10px] text-[#fde047] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Upload className="w-3 h-3" />
                      <span>{lang === 'km' ? 'Upload វីដេអូ MP4' : 'Upload Video File'}</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={formData.cover.openingVideo?.startsWith('data:video') ? '(Uploaded Local Video MP4)' : formData.cover.openingVideo}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      cover: { ...prev.cover, openingVideo: e.target.value }
                    }))}
                    className="w-full bg-black/60 border border-stone-700 focus:border-[#d4af37] rounded-xl px-2.5 py-1.5 text-[11px] text-stone-100 font-mono focus:outline-none"
                    placeholder="/images/open.mp4"
                  />
                  <div className="flex items-center justify-between text-[10px] pt-0.5">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        cover: { ...prev.cover, openingVideo: '/images/open.mp4' }
                      }))}
                      className="text-stone-400 hover:text-amber-300 underline cursor-pointer"
                    >
                      {lang === 'km' ? '↺ ប្រើប្រាស់វីដេអូដើម (Default)' : '↺ Use Default Video'}
                    </button>
                    {formData.cover.openingVideo?.startsWith('data:video') && (
                      <span className="text-emerald-400 font-semibold">✓ Custom Uploaded</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 5. COVER POSTER (home-page-poster.webp) */}
            <div className="bg-[#12100e] border border-[#d4af37]/40 rounded-2xl p-4 flex flex-col justify-between space-y-3 shadow-lg">
              <div className="space-y-2">
                <div className="flex items-center justify-between pb-1.5 border-b border-stone-800">
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <span>🖼️ {lang === 'km' ? 'រូប Poster មុខធៀបដំបូង (Home Page Poster)' : 'Cover Poster (home-page-poster.webp)'}</span>
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-teal-950/80 text-teal-300 border border-teal-500/30 font-mono">
                    Poster WebP
                  </span>
                </div>

                <p className="text-[11px] text-stone-400">
                  {lang === 'km'
                    ? 'ផ្ទាំងរូបភាពបង្ហាញជាគម្របមុខធៀបមុនពេលវីដេអូដំណើរការ'
                    : 'Initial cover poster displayed on invitation card preview before opening'}
                </p>

                {/* Poster Live Preview */}
                <div className="relative aspect-video rounded-xl overflow-hidden border border-[#d4af37]/50 bg-black/90 shadow-inner group flex items-center justify-center">
                  <img
                    src={formData.cover.homeCoverPoster || '/images/home-page-poster.webp'}
                    alt="Cover Poster Preview"
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                    onError={(e) => { e.target.src = '/images/home-page-poster.webp'; }}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => posterFileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg bg-[#d4af37] text-stone-950 text-xs font-bold shadow flex items-center gap-1 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{lang === 'km' ? 'ប្តូររូប Poster' : 'Change Poster'}</span>
                    </button>
                  </div>
                  <div className="absolute top-2 right-2 flex items-center gap-1 pointer-events-none">
                    <span className="bg-black/70 text-amber-300 text-[9px] font-mono px-2 py-0.5 rounded border border-[#d4af37]/30">
                      Live Poster Preview
                    </span>
                  </div>
                </div>

                {/* Input & Upload Button */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] text-stone-400">
                      {lang === 'km' ? 'តំណភ្ជាប់ ឬ Upload រូប Poster ថ្មី:' : 'Poster URL or Upload File:'}
                    </label>
                    <button
                      type="button"
                      onClick={() => posterFileInputRef.current?.click()}
                      className="text-[10px] text-[#fde047] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Upload className="w-3 h-3" />
                      <span>{lang === 'km' ? 'Upload ពីរូបម៉ាស៊ីន' : 'Upload File'}</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={formData.cover.homeCoverPoster || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      cover: { ...prev.cover, homeCoverPoster: e.target.value }
                    }))}
                    className="w-full bg-black/60 border border-stone-700 focus:border-[#d4af37] rounded-xl px-2.5 py-1.5 text-[11px] text-stone-100 font-mono focus:outline-none"
                    placeholder="/images/home-page-poster.webp"
                  />
                  <div className="flex items-center justify-between text-[10px] pt-0.5">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        cover: { ...prev.cover, homeCoverPoster: '/images/home-page-poster.webp' }
                      }))}
                      className="text-stone-400 hover:text-amber-300 underline cursor-pointer"
                    >
                      {lang === 'km' ? '↺ ប្រើប្រាស់រូបដើម (Default)' : '↺ Use Default Poster'}
                    </button>
                    {formData.cover.homeCoverPoster?.startsWith('data:image') && (
                      <span className="text-emerald-400 font-semibold">✓ Custom Uploaded</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DATE & COUNTDOWN */}
      {activeTab === 'date' && (
        <div className="bg-[#181512] border border-stone-800 rounded-3xl p-5 sm:p-6 space-y-6">
          <div className="border-b border-stone-800 pb-3">
            <h3 className="font-moulpali text-sm sm:text-base text-[#f3e5ab] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#d4af37]" />
              <span>{lang === 'km' ? 'កាលបរិច្ឆេទ & នាឡិការាប់ថយក្រោយ' : 'Ceremony Date & Countdown'}</span>
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              {lang === 'km' ? 'ជ្រើសរើសថ្ងៃ និងម៉ោងប្រារព្ធពិធីមង្គល តាមរយៈប្រតិទិន Pop-up' : 'Pick the engagement date and time with pop-up calendar picker'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              {/* Pop-up Date & Time Picker */}
              <div className="bg-[#12100e] border border-[#d4af37]/40 rounded-2xl p-4 sm:p-5 space-y-3 shadow-lg">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-[#fde047] flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#d4af37]" />
                    <span>{lang === 'km' ? 'ជ្រើសរើសថ្ងៃ & ម៉ោង (Pop-up Date & Time Picker)' : 'Select Date & Time'}</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      if (datePickerRef.current?.showPicker) {
                        datePickerRef.current.showPicker();
                      } else {
                        datePickerRef.current?.focus();
                      }
                    }}
                    className="px-2.5 py-1 rounded-lg bg-[#d4af37]/20 hover:bg-[#d4af37]/35 border border-[#d4af37]/50 text-[#fde047] text-[11px] font-semibold transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>{lang === 'km' ? 'បើកប្រតិទិន' : 'Open Calendar'}</span>
                  </button>
                </div>

                <div className="relative">
                  <input
                    ref={datePickerRef}
                    type="datetime-local"
                    value={getDatetimeLocalValue()}
                    onChange={(e) => handleDateChange(e.target.value, true)}
                    onClick={(e) => {
                      try {
                        e.target.showPicker?.();
                      } catch (err) { }
                    }}
                    className="w-full bg-[#181512] border-2 border-[#d4af37]/60 hover:border-[#ffd700] focus:border-[#ffd700] rounded-xl px-4 py-3 text-sm text-[#fde047] font-semibold cursor-pointer focus:outline-none transition shadow-inner [color-scheme:dark]"
                  />
                </div>

                <p className="text-[11px] text-stone-400 leading-relaxed">
                  💡 {lang === 'km' ? 'ចុចលើប្រអប់ខាងលើ ដើម្បីបើកប្រតិទិន (Pop up calendar) ជ្រើសរើសថ្ងៃ និងម៉ោង។ វានឹងបង្កើតអក្សរខ្មែរ និងអង់គ្លេសដោយស្វ័យប្រវត្តិ!' : 'Click the input to open the native calendar & time picker. It automatically generates Khmer & English dates!'}
                </p>
              </div>

              {/* Text Display Fields */}
              <div className="space-y-3 bg-[#12100e] border border-stone-800 rounded-2xl p-4 sm:p-5">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1 flex items-center justify-between">
                    <span>{lang === 'km' ? 'អក្សរថ្ងៃខែបង្ហាញជាភាសាខ្មែរ (Khmer Text)' : 'Khmer Date Display String'}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const d = new Date(formData.eventDate.dateTime);
                        if (!isNaN(d.getTime())) {
                          setFormData(prev => ({
                            ...prev,
                            eventDate: { ...prev.eventDate, dateTextKm: formatKhmerDate(d) }
                          }));
                        }
                      }}
                      className="text-[10px] text-[#fde047] hover:underline cursor-pointer"
                    >
                      {lang === 'km' ? '✨ បង្កើតស្វ័យប្រវត្តិ' : 'Auto-format'}
                    </button>
                  </label>
                  <input
                    type="text"
                    value={formData.eventDate.dateTextKm || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      eventDate: { ...prev.eventDate, dateTextKm: e.target.value }
                    }))}
                    className="w-full bg-[#181512] border border-stone-700 focus:border-[#d4af37] rounded-xl px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none font-moulpali"
                    placeholder="ថ្ងៃអាទិត្យ ទី២២ ខែវិច្ឆិកា ឆ្នាំ២០២៦"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1 flex items-center justify-between">
                    <span>{lang === 'km' ? 'អក្សរថ្ងៃខែបង្ហាញជាភាសាអង់គ្លេស (English Text)' : 'English Date Display String'}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const d = new Date(formData.eventDate.dateTime);
                        if (!isNaN(d.getTime())) {
                          setFormData(prev => ({
                            ...prev,
                            eventDate: { ...prev.eventDate, dateTextEn: formatEnglishDate(d) }
                          }));
                        }
                      }}
                      className="text-[10px] text-[#fde047] hover:underline cursor-pointer"
                    >
                      {lang === 'km' ? '✨ បង្កើតស្វ័យប្រវត្តិ' : 'Auto-format'}
                    </button>
                  </label>
                  <input
                    type="text"
                    value={formData.eventDate.dateTextEn || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      eventDate: { ...prev.eventDate, dateTextEn: e.target.value }
                    }))}
                    className="w-full bg-[#181512] border border-stone-700 focus:border-[#d4af37] rounded-xl px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none"
                    placeholder="Sunday, November 22, 2026 • 07:30 AM"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-stone-500 mb-1">
                    ISO Target Timestamp (Raw):
                  </label>
                  <input
                    type="text"
                    value={formData.eventDate.dateTime || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      eventDate: { ...prev.eventDate, dateTime: e.target.value }
                    }))}
                    className="w-full bg-[#181512] border border-stone-800 rounded-xl px-3 py-1.5 text-[11px] text-stone-400 font-mono focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Live Countdown Preview Card */}
            <div className="bg-[#12100e] border border-[#d4af37]/30 rounded-2xl p-5 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5 mb-2">
                  <Clock className="w-4 h-4 text-[#d4af37]" />
                  <span>{lang === 'km' ? 'ផ្ទាំងមើលការរាប់ថយក្រោយជាក់ស្តែង (Live Preview)' : 'Live Countdown Preview'}</span>
                </span>
                <p className="text-xs text-stone-400 mb-3">
                  {lang === 'km'
                    ? 'នាឡិការាប់ថយក្រោយនេះនឹងបង្ហាញលើទំព័រដើមនៃលិខិតអញ្ជើញ៖'
                    : 'This countdown will appear on the invitation card:'}
                </p>

                {/* Countdown Component Preview */}
                <div className="p-3 rounded-2xl bg-black/40 border border-[#d4af37]/20">
                  <CountdownTimer
                    targetDate={formData.eventDate?.dateTime || "2026-11-22T07:30:00+07:00"}
                    lang={lang}
                  />
                </div>
              </div>

              {/* Display text preview */}
              <div className="p-3.5 rounded-xl bg-[#181512] border border-stone-800 text-center space-y-1">
                <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">
                  {lang === 'km' ? 'កាលបរិច្ឆេទបង្ហាញលើធៀប' : 'Displayed on Invitation'}
                </span>
                <p className="font-moulpali text-sm text-[#fde047]">
                  {formData.eventDate.dateTextKm || 'ថ្ងៃអាទិត្យ ទី២២ ខែវិច្ឆិកា ឆ្នាំ២០២៦'}
                </p>
                <p className="text-xs text-stone-300">
                  {formData.eventDate.dateTextEn || 'Sunday, November 22, 2026'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: EVENT SCHEDULE (CRUD) */}
      {activeTab === 'schedule' && (
        <div className="bg-[#181512] border border-stone-800 rounded-3xl p-5 sm:p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
            <div>
              <h3 className="font-moulpali text-sm sm:text-base text-[#f3e5ab] flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>{lang === 'km' ? 'កម្មវិធីមង្គល ពិធីចូលចែចូវ (Event Schedule CRUD)' : 'Event Schedule Items'}</span>
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                {lang === 'km' ? 'បន្ថែម កែប្រែ ឬលុបកម្មវិធីនីមួយៗក្នុងពិធីមង្គល' : 'Add, edit, or remove timeline agenda items'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setScheduleModal({
                isOpen: true,
                isEdit: false,
                item: { time: '08:00 AM', titleKm: '', titleEn: '', descKm: '', descEn: '' }
              })}
              className="py-2 px-3.5 rounded-xl bg-[#d4af37]/20 hover:bg-[#d4af37]/30 border border-[#d4af37]/50 text-[#fde047] text-xs font-bold transition flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>{lang === 'km' ? 'បន្ថែមកម្មវិធី' : 'Add Agenda'}</span>
            </button>
          </div>

          <div className="space-y-3">
            {formData.schedule.map((item, idx) => (
              <div
                key={item.id || idx}
                className="bg-[#12100e] border border-stone-800 hover:border-[#d4af37]/40 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition"
              >
                <div className="flex items-start gap-3">
                  <div className="px-2.5 py-1.5 rounded-xl bg-[#b8860b]/20 border border-[#b8860b]/40 text-[#fde047] font-mono text-xs font-bold shrink-0 mt-0.5">
                    {item.time}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-xs sm:text-sm text-stone-100 flex items-center gap-2">
                      <span>{item.titleKm}</span>
                      {item.titleEn && <span className="text-stone-400 text-xs font-normal">({item.titleEn})</span>}
                    </h4>
                    <p className="text-xs text-stone-400 leading-relaxed">{item.descKm || item.descEn}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setScheduleModal({ isOpen: true, isEdit: true, item: { ...item } })}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-amber-300 hover:text-amber-200 transition"
                    title="Edit Item"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteScheduleItem(item.id)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-rose-950/40 text-rose-400 hover:text-rose-300 transition"
                    title="Delete Item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: VENUE & GOOGLE MAPS */}
      {activeTab === 'venue' && (() => {
        const mapEmbedUrl = getGoogleMapsEmbedUrl(
          formData.venue.googleMapsUrl,
          formData.venue.venueNameEn || formData.venue.venueNameKm || formData.venue.addressEn
        );

        const venuePresets = [
          {
            nameKm: 'គេហដ្ឋានខាងស្រី',
            nameEn: 'Bride’s House',
            addressKm: 'ភូមិផ្សារឃ្លាំង ឃុំកំពង់ឃ្លាំង ស្រុកសូទ្រនិគម ខេត្តសៀមរាប',
            addressEn: 'Phsar Khlang Village, Kampong Khleang Commune, Sot Nikum District, Siem Reap Province',
            url: 'https://maps.app.goo.gl/is1RjP4f2pYupsgT8?g_st=it'
          },
          {
            nameKm: 'សណ្ឋាគារ សុខា ភ្នំពេញ (Sokha Hotel)',
            nameEn: 'Sokha Phnom Penh Hotel',
            address: 'Street Keo Chenda, Phum 1, Sangkat Chroy Changvar, Phnom Penh',
            url: 'https://maps.google.com/?q=Sokha+Phnom+Penh+Hotel'
          },
          {
            nameKm: 'សណ្ឋាគារ សូហ្វីតែល ភ្នំពេញ ភូគីត្រា (Sofitel)',
            nameEn: 'Sofitel Phnom Penh Phokeethra',
            address: '26 Old August Site, Sothearos Blvd, Phnom Penh',
            url: 'https://maps.google.com/?q=Sofitel+Phnom+Penh+Phokeethra'
          },
          {
            nameKm: 'មជ្ឈមណ្ឌលកោះពេជ្រ (Koh Pich City Hall)',
            nameEn: 'Koh Pich City Hall',
            address: 'Koh Pich, Chamkarmon, Phnom Penh, Cambodia',
            url: 'https://maps.google.com/?q=Koh+Pich+Phnom+Penh'
          }
        ];

        return (
          <div className="bg-[#181512] border border-stone-800 rounded-3xl p-5 sm:p-6 space-y-6">
            <div className="border-b border-stone-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-moulpali text-sm sm:text-base text-[#f3e5ab] flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span>{lang === 'km' ? 'ទីតាំងប្រារព្ធពិធី & Google Maps' : 'Ceremony Venue & Google Maps'}</span>
                </h3>
                <p className="text-xs text-stone-400 mt-1">
                  {lang === 'km'
                    ? 'កំណត់ឈ្មោះទីតាំង អាសយដ្ឋាន និង Paste តំណភ្ជាប់ Google Maps ដើម្បីមើល Preview ផែនទីផ្ទាល់'
                    : 'Manage venue names, address, and paste Google Maps link for instant map preview'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5">
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>{lang === 'km' ? 'Live Map Preview Active' : 'Live Map Preview Active'}</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Form Inputs & Location Presets (6 Cols) */}
              <div className="lg:col-span-6 space-y-4">
                {/* Location Presets */}
                <div className="space-y-1.5 bg-white/5 border border-stone-800 p-3 rounded-2xl">
                  <span className="text-[11px] font-bold text-stone-300 flex items-center gap-1">
                    <span>📍</span>
                    <span>{lang === 'km' ? 'ទីតាំងពេញនិយមរហ័ស (Quick Presets):' : 'Popular Venue Presets:'}</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {venuePresets.map((vp) => (
                      <button
                        key={vp.nameEn}
                        type="button"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          venue: {
                            ...prev.venue,
                            venueNameKm: vp.nameKm,
                            venueNameEn: vp.nameEn,
                            addressKm: vp.addressKm || prev.venue.addressKm,
                            addressEn: vp.addressEn || vp.address,
                            googleMapsUrl: vp.url
                          }
                        }))}
                        className={`text-[10px] px-2.5 py-1 rounded-lg border transition cursor-pointer ${formData.venue.googleMapsUrl === vp.url
                          ? 'bg-[#d4af37]/25 text-[#fde047] border-[#d4af37]/60 font-bold'
                          : 'bg-[#12100e] hover:bg-white/10 text-stone-300 border-stone-700'
                          }`}
                      >
                        {vp.nameEn.split(' ')[0]} {vp.nameEn.split(' ')[1] || ''}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Venue Name KM */}
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    {lang === 'km' ? 'ឈ្មោះទីតាំង (ភាសាខ្មែរ)' : 'Venue Name (Khmer)'}
                  </label>
                  <input
                    type="text"
                    value={formData.venue.venueNameKm}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      venue: { ...prev.venue, venueNameKm: e.target.value }
                    }))}
                    className="w-full bg-[#12100e] border border-stone-700 focus:border-[#d4af37] rounded-xl px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none"
                    placeholder="គេហដ្ឋានខាងស្រី"
                  />
                </div>

                {/* Venue Name EN */}
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    {lang === 'km' ? 'ឈ្មោះទីតាំង (English)' : 'Venue Name (English)'}
                  </label>
                  <input
                    type="text"
                    value={formData.venue.venueNameEn}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      venue: { ...prev.venue, venueNameEn: e.target.value }
                    }))}
                    className="w-full bg-[#12100e] border border-stone-700 focus:border-[#d4af37] rounded-xl px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none"
                    placeholder="Bride’s House"
                  />
                </div>

                {/* Address KM */}
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    {lang === 'km' ? 'អាសយដ្ឋាន (ភាសាខ្មែរ)' : 'Address (Khmer)'}
                  </label>
                  <input
                    type="text"
                    value={formData.venue.addressKm || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      venue: { ...prev.venue, addressKm: e.target.value }
                    }))}
                    className="w-full bg-[#12100e] border border-stone-700 focus:border-[#d4af37] rounded-xl px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none"
                    placeholder="ភូមិផ្សារឃ្លាំង ឃុំកំពង់ឃ្លាំង ស្រុកសូទ្រនិគម ខេត្តសៀមរាប"
                  />
                </div>

                {/* Address EN */}
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    {lang === 'km' ? 'អាសយដ្ឋាន (English)' : 'Address (English)'}
                  </label>
                  <input
                    type="text"
                    value={formData.venue.addressEn}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      venue: { ...prev.venue, addressEn: e.target.value }
                    }))}
                    className="w-full bg-[#12100e] border border-stone-700 focus:border-[#d4af37] rounded-xl px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none"
                    placeholder="Phsar Khlang Village, Kampong Khleang Commune, Sot Nikum District, Siem Reap Province"
                  />
                </div>

                {/* Google Maps URL with Instant Preview */}
                <div className="bg-[#12100e] border border-[#d4af37]/35 rounded-2xl p-4 space-y-2">
                  <label className="block text-xs font-semibold text-stone-300 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>{lang === 'km' ? 'តំណភ្ជាប់ Google Maps (Link)' : 'Google Maps Direct Link'} *</span>
                    </span>
                    {formData.venue.googleMapsUrl && (
                      <a
                        href={formData.venue.googleMapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-[#2AABEE] hover:underline flex items-center gap-1 font-semibold"
                      >
                        <span>{lang === 'km' ? 'សាកល្បងបើក Map' : 'Open in Maps'}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </label>
                  <input
                    type="text"
                    value={formData.venue.googleMapsUrl}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      venue: { ...prev.venue, googleMapsUrl: e.target.value }
                    }))}
                    className="w-full bg-[#181512] border border-stone-700 focus:border-[#d4af37] rounded-xl px-3.5 py-2.5 text-xs text-stone-100 font-mono focus:outline-none"
                    placeholder="https://maps.google.com/?q=... ឬ Paste Link ពី Google Maps"
                  />
                  <p className="text-[11px] text-amber-200/80 leading-relaxed">
                    {lang === 'km'
                      ? '💡 គ្រាន់តែ Paste Link ឬឈ្មោះទីតាំងពី Google Maps នោះផែនទី Interactive Map Preview នៅខាងស្តាំនឹងបង្ហាញភ្លាមៗ!'
                      : '💡 Tip: Paste any Google Maps link or place name, and the interactive map preview will render immediately!'}
                  </p>
                </div>
              </div>

              {/* Right Column: Live Google Map Embed & Guest Card Preview (6 Cols) */}
              <div className="lg:col-span-6 space-y-4 lg:sticky lg:top-4">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-bold text-stone-300 flex items-center gap-1.5">
                    <span>🗺️</span>
                    <span>{lang === 'km' ? 'ផ្ទាំងផែនទីផ្ទាល់ (Live Google Map Preview)' : 'Live Google Map Preview'}</span>
                  </span>
                  {formData.venue.googleMapsUrl && (
                    <a
                      href={formData.venue.googleMapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-amber-400 hover:underline flex items-center gap-1"
                    >
                      <span>{lang === 'km' ? 'ពង្រីកផែនទីធំ' : 'Full Map'}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                {/* Embedded Interactive Google Map */}
                <div className="w-full rounded-2xl overflow-hidden border-2 border-[#d4af37]/50 shadow-2xl bg-stone-900 relative aspect-[16/10] sm:aspect-[16/9] group">
                  {mapEmbedUrl ? (
                    <iframe
                      key={mapEmbedUrl}
                      title="Google Maps Interactive Preview"
                      src={mapEmbedUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-stone-400 space-y-2">
                      <MapPin className="w-8 h-8 text-stone-600" />
                      <p className="text-xs">{lang === 'km' ? 'សូមបញ្ចូលតំណភ្ជាប់ Google Maps ដើម្បីបង្ហាញផែនទី' : 'Enter a Google Maps link to display map preview'}</p>
                    </div>
                  )}

                  {/* Quick Open Overlay Bar */}
                  {formData.venue.googleMapsUrl && (
                    <div className="absolute bottom-2 right-2 z-10">
                      <a
                        href={formData.venue.googleMapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="py-1 px-2.5 rounded-lg bg-black/85 hover:bg-black text-[#fde047] text-[11px] font-semibold flex items-center gap-1 border border-[#d4af37]/40 shadow-lg backdrop-blur-sm transition active:scale-95"
                      >
                        <MapPin className="w-3 h-3 text-amber-400" />
                        <span>Google Maps</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>

                {/* Realistic Guest Venue Card Preview matching VenueSection.jsx */}
                <div className="rounded-2xl bg-[#faf7f2] border-2 border-[#d4af37]/50 shadow-lg p-5 text-center text-[#3d3126] space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[#b8860b] text-[11px] font-medium">
                    <MapPin className="w-3 h-3" />
                    <span>{lang === 'km' ? 'ទីតាំងកម្មវិធី' : 'Location & Venue'}</span>
                  </div>
                  <h4 className="font-moulpali text-sm sm:text-base text-[#3d3126]">
                    {lang === 'km' ? 'ទីតាំងប្រារព្ធពិធី' : 'Ceremony Venue'}
                  </h4>
                  <p className="text-xs sm:text-sm font-bold text-[#996515]">
                    {lang === 'km'
                      ? (formData.venue.venueNameKm || formData.venue.venueNameEn || 'Bride’s House')
                      : (formData.venue.venueNameEn || formData.venue.venueNameKm || 'Bride’s House')}
                  </p>
                  <p className="text-[11px] text-stone-500 px-2 line-clamp-2">
                    {formData.venue.addressEn || formData.venue.addressKm || 'Phsar Khlang Village, Kampong Khleang Commune, Sot Nikum District, Siem Reap Province'}
                  </p>

                  <div className="pt-2 max-w-xs mx-auto">
                    <a
                      href={formData.venue.googleMapsUrl || '#'}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#996515]/75 via-[#d4af37] to-[#ffd700] text-stone-950 font-bold text-xs shadow-md active:scale-95 transition"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{lang === 'km' ? 'មើលទីតាំងលើ Google Maps' : 'View on Google Maps'}</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* TAB 6: LOVE GALLERY (CRUD) */}
      {activeTab === 'gallery' && (
        <div className="bg-[#181512] border border-stone-800 rounded-3xl p-5 sm:p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
            <div>
              <h3 className="font-moulpali text-sm sm:text-base text-[#f3e5ab] flex items-center gap-2">
                <Camera className="w-4 h-4 text-amber-400" />
                <span>{lang === 'km' ? 'វិចិត្រសាលរូបភាព (Love Gallery CRUD)' : 'Love Photo Gallery CRUD'}</span>
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                {lang === 'km' ? 'បន្ថែម កែប្រែ ឬដករូបភាពស្នេហាអនុស្សាវរីយ៍' : 'Manage photos, titles, and captions in the album'}
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              {/* Direct File Upload with explicit ref and loading spinner */}
              <button
                type="button"
                onClick={() => galleryFileInputRef.current?.click()}
                disabled={isUploadingPhoto}
                className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-[#996515] to-[#d4af37] text-stone-950 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md hover:brightness-110 active:scale-95 disabled:opacity-50"
              >
                {isUploadingPhoto ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Upload className="w-3.5 h-3.5 stroke-[2.5]" />
                )}
                <span>
                  {isUploadingPhoto
                    ? (lang === 'km' ? 'កំពុងរៀបចំ...' : 'Optimizing...')
                    : (lang === 'km' ? 'Upload រូបថត' : 'Upload Photo')}
                </span>
              </button>
              <input
                ref={galleryFileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/jpg"
                className="hidden"
                onChange={handleHeaderFileUpload}
              />

              {/* Add via Link or Preset */}
              <button
                type="button"
                onClick={handleOpenAddPhoto}
                className="py-2 px-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-[#d4af37]/40 text-[#fde047] text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>{lang === 'km' ? 'បន្ថែមតាម Link' : 'Add via Link'}</span>
              </button>
            </div>
          </div>

          {/* Photo Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {formData.gallery.map((photo, idx) => (
              <div
                key={photo.id || idx}
                className="bg-[#12100e] border border-stone-800 hover:border-[#d4af37]/40 rounded-2xl overflow-hidden p-3 space-y-3 transition group"
              >
                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-black/60 border border-stone-800 relative">
                  <img
                    src={photo.url}
                    alt={photo.titleKm || 'Gallery Photo'}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    onError={(e) => { e.target.src = '/images/gallery-1.webp'; }}
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/75 border border-white/10 text-[10px] text-amber-300 font-mono">
                    #{idx + 1}
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="font-semibold text-xs text-stone-100 truncate">
                    {photo.titleKm || photo.titleEn || `Photo #${idx + 1}`}
                  </h4>
                  <p className="text-[11px] text-stone-400 line-clamp-1">
                    {photo.captionKm || photo.captionEn || photo.url}
                  </p>
                </div>

                <div className="flex items-center justify-end gap-1.5 pt-1 border-t border-stone-800/80">
                  <button
                    type="button"
                    onClick={() => handleOpenEditPhoto(photo, idx)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-amber-300 transition text-xs flex items-center gap-1 cursor-pointer"
                    title="Edit Photo"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>{lang === 'km' ? 'កែប្រែ' : 'Edit'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteGalleryItem(photo.id, idx)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-rose-950/40 text-rose-400 transition text-xs flex items-center gap-1 cursor-pointer"
                    title="Delete Photo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{lang === 'km' ? 'លុប' : 'Delete'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: DIGITAL ANGPAO */}
      {activeTab === 'angpao' && (
        <div className="bg-[#181512] border border-stone-800 rounded-3xl p-5 sm:p-6 space-y-6">
          <div className="border-b border-stone-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-moulpali text-sm sm:text-base text-[#f3e5ab] flex items-center gap-2">
                <Gift className="w-4 h-4 text-amber-400" />
                <span>{lang === 'km' ? 'ចំណងដៃឌីជីថល (Digital Angpao / KHQR)' : 'Digital Angpao & KHQR'}</span>
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                {lang === 'km'
                  ? 'កំណត់ឈ្មោះធនាគារ ឈ្មោះគណនី លេខគណនី និង Upload រូបភាព QR Code ផ្ទាល់ខ្លួន'
                  : 'Configure bank name, account details, and upload your custom KHQR code'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border flex items-center gap-1.5 ${formData.angpao.qrCodeImage
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                : 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                }`}>
                {formData.angpao.qrCodeImage ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>{lang === 'km' ? 'រូបភាព QR ផ្ទាល់ខ្លួន' : 'Custom KHQR'}</span>
                  </>
                ) : (
                  <>
                    <QrCode className="w-3 h-3 text-amber-400" />
                    <span>{lang === 'km' ? 'Built-in KHQR ស្វ័យប្រវត្តិ' : 'Built-in KHQR'}</span>
                  </>
                )}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Input Form & Upload Box (7 Cols) */}
            <div className="lg:col-span-7 space-y-5">
              {/* Bank Name with quick select presets */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-stone-300">
                  {lang === 'km' ? 'ឈ្មោះធនាគារ (Bank Name)' : 'Bank Name'}
                </label>
                <input
                  type="text"
                  value={formData.angpao.bankName}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    angpao: { ...prev.angpao, bankName: e.target.value }
                  }))}
                  className="w-full bg-[#12100e] border border-stone-700 focus:border-[#d4af37] rounded-xl px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none"
                  placeholder="ABA Bank (KHQR)"
                />
                {/* Bank Presets */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-stone-500">{lang === 'km' ? 'ធនាគារពេញនិយម:' : 'Presets:'}</span>
                  {['ABA Bank (KHQR)', 'ACLEDA Bank', 'Canadia Bank', 'Wing Bank', 'Bakong (KHQR)'].map((bName) => (
                    <button
                      key={bName}
                      type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        angpao: { ...prev.angpao, bankName: bName }
                      }))}
                      className={`text-[10px] px-2 py-0.5 rounded-md transition cursor-pointer ${formData.angpao.bankName === bName
                        ? 'bg-[#d4af37]/25 text-[#fde047] border border-[#d4af37]/50 font-bold'
                        : 'bg-white/5 hover:bg-white/10 text-stone-300'
                        }`}
                    >
                      {bName.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Account Name */}
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  {lang === 'km' ? 'ឈ្មោះគណនី (Account Name)' : 'Account Name'}
                </label>
                <input
                  type="text"
                  value={formData.angpao.accountName}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    angpao: { ...prev.angpao, accountName: e.target.value.toUpperCase() }
                  }))}
                  className="w-full bg-[#12100e] border border-stone-700 focus:border-[#d4af37] rounded-xl px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none uppercase font-semibold tracking-wider"
                  placeholder="SORN KIMSAN"
                />
              </div>

              {/* Account Number */}
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  {lang === 'km' ? 'លេខគណនី (Account Number)' : 'Account Number'}
                </label>
                <input
                  type="text"
                  value={formData.angpao.accountNumber}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    angpao: { ...prev.angpao, accountNumber: e.target.value }
                  }))}
                  className="w-full bg-[#12100e] border border-stone-700 focus:border-[#d4af37] rounded-xl px-3.5 py-2.5 text-xs text-stone-100 font-mono font-bold tracking-wider focus:outline-none"
                  placeholder="001 234 567"
                />
              </div>

              {/* Dedicated KHQR Upload Dropzone & Manager */}
              <div className="bg-[#12100e] border border-[#d4af37]/35 rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-[#d4af37]" />
                    <span className="text-xs font-bold text-stone-200">
                      {lang === 'km' ? 'Upload រូបភាព KHQR ផ្ទាល់ខ្លួន' : 'Upload Custom KHQR Image'}
                    </span>
                  </div>
                  <span className="text-[10px] text-amber-400">PNG, JPG, WEBP</span>
                </div>

                {/* Hidden file input */}
                <input
                  ref={angpaoQrFileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/jpg"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setIsUploadingQr(true);
                      handleImageFileUpload(
                        file,
                        (dataUrl) => {
                          setIsUploadingQr(false);
                          setFormData(prev => ({
                            ...prev,
                            angpao: { ...prev.angpao, qrCodeImage: dataUrl }
                          }));
                        },
                        (errMsg) => {
                          setIsUploadingQr(false);
                          alert(errMsg);
                        }
                      );
                    }
                    e.target.value = '';
                  }}
                />

                {/* Upload Action Area */}
                {formData.angpao.qrCodeImage ? (
                  <div className="flex flex-col sm:flex-row items-center gap-4 bg-white/5 border border-emerald-500/40 rounded-2xl p-4">
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-white p-1 border border-stone-700 shrink-0 shadow-md">
                      <img
                        src={formData.angpao.qrCodeImage}
                        alt="Custom QR Preview"
                        className="w-full h-full object-contain"
                        onError={(e) => { e.target.src = '/images/gallery-1.webp'; }}
                      />
                    </div>

                    <div className="space-y-2 flex-1 text-center sm:text-left">
                      <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-bold text-emerald-400">
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>{lang === 'km' ? 'បានបញ្ចូលរូបភាព QR រួចរាល់!' : 'Custom QR Code Active!'}</span>
                      </div>
                      <p className="text-[11px] text-stone-400 leading-relaxed">
                        {lang === 'km'
                          ? 'រូបភាព KHQR ផ្ទាល់ខ្លួននេះនឹងបង្ហាញលើធៀបមង្គលការជាក់ស្តែង។'
                          : 'This custom KHQR will be rendered for all wedding guests.'}
                      </p>
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => angpaoQrFileInputRef.current?.click()}
                          disabled={isUploadingQr}
                          className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-[#996515] to-[#d4af37] text-stone-950 font-bold text-xs flex items-center gap-1 shadow hover:brightness-110 active:scale-95 transition cursor-pointer"
                        >
                          {isUploadingQr ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                          <span>{lang === 'km' ? 'ប្តូររូប QR ថ្មី' : 'Change QR Image'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({
                            ...prev,
                            angpao: { ...prev.angpao, qrCodeImage: '' }
                          }))}
                          className="py-1.5 px-3 rounded-xl bg-rose-950/30 hover:bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-semibold transition cursor-pointer"
                        >
                          {lang === 'km' ? 'លុបចេញ (ប្រើ Built-in KHQR)' : 'Reset to Default KHQR'}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => angpaoQrFileInputRef.current?.click()}
                    disabled={isUploadingQr}
                    className="w-full flex flex-col items-center justify-center border-2 border-dashed border-[#d4af37]/50 hover:border-[#ffd700] rounded-2xl p-6 cursor-pointer bg-white/5 hover:bg-white/10 transition group text-center disabled:opacity-50"
                  >
                    {isUploadingQr ? (
                      <>
                        <Loader2 className="w-9 h-9 text-[#d4af37] animate-spin mb-2" />
                        <span className="text-xs font-semibold text-[#fde047]">
                          {lang === 'km' ? 'កំពុងរៀបចំ និងបង្រួមរូប QR Code...' : 'Optimizing and compressing QR image...'}
                        </span>
                      </>
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-2xl bg-[#d4af37]/15 border border-[#d4af37]/30 flex items-center justify-center mb-2.5 group-hover:scale-110 transition shadow">
                          <Upload className="w-6 h-6 text-[#d4af37]" />
                        </div>
                        <span className="text-xs font-bold text-stone-100">
                          {lang === 'km' ? 'ចុចទីនេះដើម្បី Upload រូបភាព KHQR ពីម៉ាស៊ីន' : 'Click to Upload KHQR from Device'}
                        </span>
                        <span className="text-[11px] text-stone-400 mt-1">
                          {lang === 'km' ? 'ពីកុំព្យូទ័រ ឬទូរស័ព្ទ (PNG, JPG, WEBP)' : 'From PC or Smartphone (PNG, JPG, WEBP)'}
                        </span>
                      </>
                    )}
                  </button>
                )}

                {/* Direct Image URL input */}
                <div className="pt-2 border-t border-stone-800/80">
                  <label className="block text-[11px] text-stone-400 mb-1">
                    {lang === 'km' ? 'ឬ បញ្ចូលតំណភ្ជាប់រូបភាព (Image URL / Path)' : 'Or Enter Direct Image URL / Path'}
                  </label>
                  <input
                    type="text"
                    value={formData.angpao.qrCodeImage}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      angpao: { ...prev.angpao, qrCodeImage: e.target.value }
                    }))}
                    className="w-full bg-[#181512] border border-stone-700 focus:border-[#d4af37] rounded-xl px-3 py-2 text-xs text-stone-100 font-mono focus:outline-none"
                    placeholder="https://... ឬទុកទំនេរដើម្បីប្រើ Built-in KHQR"
                  />
                  <p className="text-[10px] text-stone-500 mt-1">
                    {lang === 'km'
                      ? '💡 ចំណាំ៖ ប្រសិនបើទុកទំនេរ ប្រព័ន្ធនឹងប្រើប្រាស់ KHQR Graphic ដែលមានស្រាប់ដោយស្វ័យប្រវត្តិ។'
                      : '💡 Tip: If left empty, the built-in authentic KHQR vector graphic will be used automatically.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Live KHQR Card Preview (5 Cols) */}
            <div className="lg:col-span-5 space-y-3 lg:sticky lg:top-4">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-stone-300 flex items-center gap-1.5">
                  <span>📱</span>
                  <span>{lang === 'km' ? 'ការមើលផ្ទាល់ (Live Card Preview)' : 'Live Card Preview'}</span>
                </span>
                <span className="text-[10px] text-stone-500 font-mono">
                  {formData.angpao.qrCodeImage ? 'Mode: Custom Image' : 'Mode: Built-in SVG'}
                </span>
              </div>

              {/* Realistic KHQR Modal Card Replica matching GiftAngpaoModal */}
              <div className="rounded-3xl bg-[#faf7f2] border-2 border-[#d4af37]/60 shadow-[0_20px_50px_rgba(0,0,0,0.45)] p-5 relative overflow-hidden text-center text-[#3d3126]">
                {/* Header */}
                <h4 className="font-moulpali text-base sm:text-lg text-[#78500c] mb-1">
                  {lang === 'km' ? 'ចំណងដៃឌីជីថល' : 'Digital Wedding Gift'}
                </h4>
                <p className="text-[11px] text-[#5c493a] mb-3 leading-relaxed">
                  {lang === 'km' ? 'ស្កេនដើម្បីចូលរួមចំណងដៃតាមរយៈ KHQR' : 'Scan to send wedding blessing via KHQR'}
                </p>

                {/* Realistic White Card */}
                <div className="bg-white rounded-2xl p-4 shadow-md border border-[#d4af37]/40 text-stone-800 relative">
                  <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-stone-200">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-[#d32f2f] text-white">
                        KHQR
                      </span>
                      <span className="text-[11px] font-semibold text-stone-700 truncate max-w-[140px]">
                        {formData.angpao.bankName || 'ABA Bank (KHQR)'}
                      </span>
                    </div>
                    <QrCode className="w-4 h-4 text-stone-400" />
                  </div>

                  {/* QR Graphic Container */}
                  <div className="w-44 h-44 mx-auto bg-stone-50 border border-stone-200 rounded-xl p-2.5 flex flex-col items-center justify-center shadow-inner relative group overflow-hidden">
                    {formData.angpao.qrCodeImage ? (
                      <img
                        src={formData.angpao.qrCodeImage}
                        alt="Angpao QR Code Preview"
                        className="w-full h-full object-contain rounded-lg"
                        onError={(e) => { e.target.src = '/images/gallery-1.webp'; }}
                      />
                    ) : (
                      <svg viewBox="0 0 100 100" className="w-full h-full text-stone-900" fill="currentColor">
                        {/* Corner position markers */}
                        <rect x="5" y="5" width="28" height="28" rx="4" fill="currentColor" />
                        <rect x="9" y="9" width="20" height="20" rx="2" fill="white" />
                        <rect x="13" y="13" width="12" height="12" rx="1" fill="currentColor" />

                        <rect x="67" y="5" width="28" height="28" rx="4" fill="currentColor" />
                        <rect x="71" y="9" width="20" height="20" rx="2" fill="white" />
                        <rect x="75" y="13" width="12" height="12" rx="1" fill="currentColor" />

                        <rect x="5" y="67" width="28" height="28" rx="4" fill="currentColor" />
                        <rect x="9" y="71" width="20" height="20" rx="2" fill="white" />
                        <rect x="13" y="75" width="12" height="12" rx="1" fill="currentColor" />

                        {/* Data modules pattern */}
                        <rect x="38" y="10" width="8" height="8" fill="currentColor" />
                        <rect x="50" y="15" width="8" height="8" fill="currentColor" />
                        <rect x="42" y="28" width="6" height="12" fill="currentColor" />
                        <rect x="10" y="42" width="10" height="6" fill="currentColor" />
                        <rect x="25" y="40" width="8" height="8" fill="currentColor" />
                        <rect x="68" y="40" width="10" height="8" fill="currentColor" />
                        <rect x="82" y="45" width="8" height="14" fill="currentColor" />
                        <rect x="38" y="55" width="12" height="8" fill="currentColor" />
                        <rect x="55" y="50" width="8" height="12" fill="currentColor" />
                        <rect x="40" y="70" width="8" height="8" fill="currentColor" />
                        <rect x="55" y="72" width="14" height="6" fill="currentColor" />
                        <rect x="75" y="70" width="16" height="16" fill="currentColor" />

                        {/* Center Emblem */}
                        <circle cx="50" cy="50" r="11" fill="white" stroke="#d4af37" strokeWidth="2" />
                        <circle cx="50" cy="50" r="6" fill="#d32f2f" />
                      </svg>
                    )}
                  </div>

                  {/* Account Details */}
                  <div className="mt-3 pt-2.5 border-t border-stone-200 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#8c7355]">{lang === 'km' ? 'ឈ្មោះគណនី:' : 'Name:'}</span>
                      <span className="text-xs font-bold text-[#3d3126] tracking-wider uppercase truncate max-w-[180px]">
                        {formData.angpao.accountName || 'SORN KIMSAN'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-[#8c7355]">{lang === 'km' ? 'លេខគណនី:' : 'Account #:'}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-mono font-bold text-[#b8860b]">
                          {formData.angpao.accountNumber || '001 234 567'}
                        </span>
                        <span className="p-1 rounded bg-stone-100 text-stone-500">
                          <Copy className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 text-[11px] text-[#5c493a]">
                  {lang === 'km'
                    ? 'សូមថ្លែងអំណរគុណយ៉ាងជ្រាលជ្រៅចំពោះទឹកចិត្ត និងពរជ័យដ៏កក់ក្តៅ!'
                    : 'Thank you wholeheartedly for your generous blessings and love!'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: BACKGROUND AUDIO */}
      {activeTab === 'audio' && (
        <div className="bg-[#181512] border border-stone-800 rounded-3xl p-5 sm:p-6 space-y-6">
          <div className="border-b border-stone-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-moulpali text-sm sm:text-base text-[#f3e5ab] flex items-center gap-2">
                <Music className="w-4 h-4 text-amber-400" />
                <span>{lang === 'km' ? 'ចម្រៀង & សំឡេងផ្ទៃខាងក្រោយ (Romantic Audio)' : 'Romantic Audio & Wedding Song'}</span>
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                {lang === 'km'
                  ? 'កំណត់បទចម្រៀងតាមរយៈ Upload ឯកសារ MP3, ភ្ជាប់លីង YouTube ឬតំណភ្ជាប់ MP3 ផ្ទាល់'
                  : 'Customize wedding soundtrack via MP3 file upload, YouTube video link, or direct MP3 URL'}
              </p>
            </div>

            {/* Current Source Badge */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              {extractYouTubeId(formData.audio.audioUrl) ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-rose-950/80 text-rose-300 border border-rose-500/40">
                  <Youtube className="w-3.5 h-3.5 text-rose-400" />
                  <span>YouTube Stream</span>
                </span>
              ) : formData.audio.audioUrl?.startsWith('data:audio') ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-950/80 text-amber-300 border border-amber-500/40">
                  <Upload className="w-3.5 h-3.5 text-amber-400" />
                  <span>Uploaded MP3</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Direct MP3 Audio</span>
                </span>
              )}
            </div>
          </div>

          {/* Hidden File Input for MP3 Upload */}
          <input
            ref={audioFileInputRef}
            type="file"
            accept="audio/mp3,audio/mpeg,audio/wav,audio/m4a,audio/ogg,.mp3"
            className="hidden"
            onChange={handleAudioFileUpload}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT COLUMN: Inputs & Upload Dropzone (7 Cols) */}
            <div className="lg:col-span-7 space-y-5">
              {/* Song Title Input */}
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5 flex items-center justify-between">
                  <span>{lang === 'km' ? 'ចំណងជើងបទចម្រៀង (Song Title)' : 'Song Title'} *</span>
                  <span className="text-[10px] text-stone-500">
                    {lang === 'km' ? 'បង្ហាញពេលភ្ញៀវ Hover លើប៊ូតុងភ្លេង' : 'Shown in tooltip'}
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formData.audio.songTitle}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      audio: { ...prev.audio, songTitle: e.target.value }
                    }))}
                    className="w-full bg-[#12100e] border border-stone-700 focus:border-[#d4af37] rounded-xl px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none pl-9"
                    placeholder="ភ្ជាប់និស្ស័យ (NISAI) - OLICA ft. KZ"
                  />
                  <Music className="w-4 h-4 text-amber-400/70 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* METHOD 1: Direct File Upload Dropzone */}
              <div className="bg-[#12100e] border border-[#d4af37]/30 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#fde047] flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{lang === 'km' ? 'វិធីទី១: Upload ឯកសារ MP3 ពីទូរស័ព្ទ/កុំព្យូទ័រ' : 'Method 1: Upload MP3 File'}</span>
                  </span>
                  <span className="text-[10px] text-stone-400 font-mono">Max 3.5MB</span>
                </div>

                <button
                  type="button"
                  onClick={() => audioFileInputRef.current?.click()}
                  disabled={isUploadingAudio}
                  className="w-full flex flex-col items-center justify-center border-2 border-dashed border-[#d4af37]/45 hover:border-[#ffd700] rounded-xl p-4 cursor-pointer bg-white/5 hover:bg-white/10 transition group text-center disabled:opacity-50"
                >
                  {isUploadingAudio ? (
                    <>
                      <Loader2 className="w-7 h-7 text-[#d4af37] animate-spin mb-1.5" />
                      <span className="text-xs font-semibold text-[#fde047]">
                        {lang === 'km' ? 'កំពុងបញ្ចូល File សំឡេង...' : 'Uploading audio file...'}
                      </span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-7 h-7 text-[#d4af37] group-hover:scale-110 transition mb-1.5" />
                      <span className="text-xs font-bold text-stone-100">
                        {lang === 'km' ? 'ចុចទីនេះដើម្បីជ្រើសរើស File MP3' : 'Click to Upload Audio File'}
                      </span>
                      <span className="text-[10px] text-stone-400 mt-0.5">
                        {lang === 'km' ? 'គាំទ្រឯកសារ .mp3, .wav, .m4a' : 'Supports .mp3, .wav, .m4a'}
                      </span>
                    </>
                  )}
                </button>
              </div>

              {/* METHOD 2: YouTube / MP3 URL */}
              <div className="bg-[#12100e] border border-stone-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-200 flex items-center gap-1.5">
                    <Youtube className="w-3.5 h-3.5 text-rose-500" />
                    <span>{lang === 'km' ? 'វិធីទី២: បញ្ចូលលីង YouTube ឬ MP3 URL' : 'Method 2: Paste YouTube or MP3 Link'}</span>
                  </span>
                  <span className="text-[10px] text-rose-400/90 font-mono">YouTube / .mp3</span>
                </div>

                <div>
                  <label className="block text-[11px] text-stone-400 mb-1">
                    {lang === 'km' ? 'តំណភ្ជាប់ចម្រៀង (YouTube Link ឬ Audio URL)' : 'Audio Link (YouTube URL or MP3)'}
                  </label>
                  <input
                    type="text"
                    value={formData.audio.audioUrl?.startsWith('data:audio') ? '(Uploaded Local MP3)' : formData.audio.audioUrl}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        audio: { ...prev.audio, audioUrl: val }
                      }));
                    }}
                    className="w-full bg-black/60 border border-stone-700 focus:border-[#d4af37] rounded-xl px-3.5 py-2.5 text-xs text-stone-100 font-mono focus:outline-none"
                    placeholder="https://www.youtube.com/watch?v=... ឬ /audio/wedding-song.mp3"
                  />
                  <p className="text-[10px] text-stone-500 mt-1">
                    {lang === 'km'
                      ? 'គាំទ្រទាំង: https://youtu.be/ID, https://www.youtube.com/watch?v=ID ឬ https://domain.com/song.mp3'
                      : 'Accepts YouTube links (youtube.com or youtu.be) or online .mp3 files'}
                  </p>
                </div>

                {/* Quick Presets */}
                <div className="pt-2 border-t border-stone-800/80">
                  <label className="block text-[10px] text-stone-400 mb-1.5 font-medium">
                    {lang === 'km' ? 'បទចម្រៀងគំរូពេញនិយម (Presets):' : 'Popular Wedding Presets:'}
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      {
                        title: 'ភ្ជាប់និស្ស័យ (NISAI) - OLICA ft. KZ',
                        url: '/audio/wedding-song.mp3',
                        badge: 'MP3 Local'
                      },
                      {
                        title: 'ភ្ជាប់និស្ស័យ (Official Audio) - YouTube',
                        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                        badge: 'YouTube'
                      },
                      {
                        title: 'Wedding Romantic Acoustic Melody',
                        url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3',
                        badge: 'MP3 Web'
                      }
                    ].map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            audio: {
                              songTitle: preset.title,
                              audioUrl: preset.url
                            }
                          }));
                          if (audioElement) audioElement.pause();
                          setAudioTesting(false);
                        }}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-stone-900 hover:bg-[#d4af37]/20 border border-stone-700 hover:border-[#d4af37]/50 text-stone-300 hover:text-[#fde047] transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <span className="text-[9px] px-1 py-0.2 rounded bg-black/60 text-amber-300 font-mono">
                          {preset.badge}
                        </span>
                        <span className="truncate max-w-[150px]">{preset.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Live Audio Preview & Player Card (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              <label className="block text-xs font-semibold text-stone-300 flex items-center justify-between">
                <span>{lang === 'km' ? 'ផ្ទាំងសាកល្បងស្តាប់ (Live Audio Player)' : 'Live Audio Player Preview'}</span>
                <span className="text-[10px] text-amber-400">Preview</span>
              </label>

              {/* Player Card Frame */}
              <div className="bg-gradient-to-b from-[#1c1813] to-[#12100e] border border-[#d4af37]/50 rounded-2xl p-5 shadow-2xl relative overflow-hidden space-y-4">
                {/* Decorative background glow */}
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#d4af37]/10 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-start justify-between gap-3 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#d4af37]/20 border border-[#d4af37]/60 flex items-center justify-center text-[#fde047] shadow-inner">
                      {extractYouTubeId(formData.audio.audioUrl) ? (
                        <Youtube className="w-6 h-6 text-rose-500" />
                      ) : (
                        <Music className="w-6 h-6 text-[#ffd700]" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] uppercase tracking-wider text-amber-400 font-bold block">
                        {extractYouTubeId(formData.audio.audioUrl) ? 'YouTube Track' : 'Background Audio'}
                      </span>
                      <h4 className="text-sm font-bold text-stone-100 truncate max-w-[190px]">
                        {formData.audio.songTitle || 'Wedding Song'}
                      </h4>
                    </div>
                  </div>

                  {/* Animated Wave Bars when Playing */}
                  <div className="flex items-end gap-[3px] h-6 pt-1">
                    {[1, 2, 3, 4, 5].map((bar) => (
                      <span
                        key={bar}
                        className={`w-1 rounded-full bg-[#fde047] transition-all duration-300 ${audioTesting ? 'animate-pulse h-5' : 'h-1.5 opacity-40'
                          }`}
                        style={{
                          animationDelay: `${bar * 120}ms`,
                          height: audioTesting ? `${Math.max(6, (bar % 3 + 1) * 7)}px` : '6px'
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* If YouTube, display interactive video embed or preview */}
                {extractYouTubeId(formData.audio.audioUrl) ? (
                  <div className="space-y-3 pt-1">
                    <div className="relative aspect-video rounded-xl overflow-hidden border border-rose-500/30 bg-black shadow-lg">
                      {audioTesting ? (
                        <iframe
                          title="YouTube Audio Preview"
                          src={`https://www.youtube-nocookie.com/embed/${extractYouTubeId(formData.audio.audioUrl)}?autoplay=1&controls=1&mute=0&playsinline=1`}
                          className="w-full h-full"
                          allow="autoplay; encrypted-media"
                          allowFullScreen
                        />
                      ) : (
                        <div
                          onClick={toggleTestAudio}
                          className="w-full h-full relative cursor-pointer group flex items-center justify-center"
                        >
                          <img
                            src={`https://img.youtube.com/vi/${extractYouTubeId(formData.audio.audioUrl)}/hqdefault.jpg`}
                            alt="YouTube Thumbnail"
                            className="w-full h-full object-cover group-hover:scale-105 transition opacity-80"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-1.5">
                            <div className="w-12 h-12 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition">
                              <Play className="w-5 h-5 fill-white ml-0.5" />
                            </div>
                            <span className="text-[11px] font-semibold text-white drop-shadow">
                              {lang === 'km' ? 'ចុចដើម្បីសាកល្បងស្តាប់ YouTube' : 'Click to Play YouTube Audio'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-stone-400">
                      <span className="font-mono text-[10px] text-rose-300">
                        ID: {extractYouTubeId(formData.audio.audioUrl)}
                      </span>
                      <a
                        href={formData.audio.audioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-stone-300 hover:text-white flex items-center gap-1 transition"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>{lang === 'km' ? 'បើកលើ YouTube' : 'Open in YouTube'}</span>
                      </a>
                    </div>
                  </div>
                ) : (
                  // Direct MP3 HTML5 Audio Controls
                  <div className="space-y-3 pt-1">
                    <div className="p-3 rounded-xl bg-black/50 border border-stone-800 space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-stone-400">{lang === 'km' ? 'ស្ថានភាពសំឡេង:' : 'Audio Status:'}</span>
                        <span className={audioTesting ? 'text-amber-400 font-bold' : 'text-stone-400'}>
                          {audioTesting ? (lang === 'km' ? 'កំពុងចាក់សំឡេង ♫' : 'Now Playing ♫') : (lang === 'km' ? 'ផ្អាក / មិនទាន់ចាក់' : 'Paused / Idle')}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={toggleTestAudio}
                          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg cursor-pointer ${audioTesting
                            ? 'bg-amber-500 text-stone-950 border border-amber-400 animate-pulse'
                            : 'bg-gradient-to-r from-[#996515] to-[#d4af37] text-stone-950 hover:brightness-110'
                            }`}
                        >
                          {audioTesting ? (
                            <>
                              <Pause className="w-4 h-4 fill-stone-950" />
                              <span>{lang === 'km' ? 'ផ្អាកសំឡេង (Pause)' : 'Pause Test'}</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4 fill-stone-950" />
                              <span>{lang === 'km' ? 'សាកល្បងចាក់ស្តាប់ (Play Test)' : 'Play Test'}</span>
                            </>
                          )}
                        </button>

                        {formData.audio.audioUrl?.startsWith('data:audio') && (
                          <button
                            type="button"
                            onClick={() => {
                              if (audioElement) audioElement.pause();
                              setAudioTesting(false);
                              setFormData(prev => ({
                                ...prev,
                                audio: {
                                  songTitle: DEFAULT_WEDDING_CONFIG.audio.songTitle,
                                  audioUrl: DEFAULT_WEDDING_CONFIG.audio.audioUrl
                                }
                              }));
                            }}
                            className="p-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/40 text-rose-300 text-xs transition cursor-pointer"
                            title="Reset to default MP3"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="text-[10px] text-stone-500 text-center">
                      {lang === 'km'
                        ? 'សំឡេងនឹងលេងដោយស្វ័យប្រវត្តនៅពេលភ្ញៀវចុចបើកធៀបអញ្ជើញ (Open Invitation)'
                        : 'Background track smoothly autoplays when guests tap to open the wedding invitation'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SCHEDULE EDIT / CREATE MODAL */}
      {scheduleModal.isOpen && (
        <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#181512] border border-[#d4af37]/50 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4">
            <h4 className="font-moulpali text-sm sm:text-base text-[#f3e5ab]">
              {scheduleModal.isEdit ? (lang === 'km' ? 'កែប្រែកម្មវិធី' : 'Edit Agenda') : (lang === 'km' ? 'បន្ថែមកម្មវិធីថ្មី' : 'Add New Agenda')}
            </h4>

            <form onSubmit={handleSaveScheduleItem} className="space-y-3">
              <div>
                <label className="block text-[11px] text-stone-400 mb-1">{lang === 'km' ? 'ម៉ោង (Time)' : 'Time'}</label>
                <input
                  type="text"
                  required
                  value={scheduleModal.item?.time || ''}
                  onChange={(e) => setScheduleModal(prev => ({ ...prev, item: { ...prev.item, time: e.target.value } }))}
                  className="w-full bg-[#12100e] border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 font-mono"
                  placeholder="07:00 AM"
                />
              </div>

              <div>
                <label className="block text-[11px] text-stone-400 mb-1">{lang === 'km' ? 'ចំណងជើងកម្មវិធី (ខ្មែរ)' : 'Title (KM)'}</label>
                <input
                  type="text"
                  required
                  value={scheduleModal.item?.titleKm || ''}
                  onChange={(e) => setScheduleModal(prev => ({ ...prev, item: { ...prev.item, titleKm: e.target.value } }))}
                  className="w-full bg-[#12100e] border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100"
                  placeholder="ពិធីជួបជុំភ្ញៀវកិត្តិយស"
                />
              </div>

              <div>
                <label className="block text-[11px] text-stone-400 mb-1">{lang === 'km' ? 'ចំណងជើងកម្មវិធី (English)' : 'Title (EN)'}</label>
                <input
                  type="text"
                  value={scheduleModal.item?.titleEn || ''}
                  onChange={(e) => setScheduleModal(prev => ({ ...prev, item: { ...prev.item, titleEn: e.target.value } }))}
                  className="w-full bg-[#12100e] border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100"
                  placeholder="Guest Welcome"
                />
              </div>

              <div>
                <label className="block text-[11px] text-stone-400 mb-1">{lang === 'km' ? 'ការពិពណ៌នា (ខ្មែរ)' : 'Description (KM)'}</label>
                <textarea
                  rows={2}
                  value={scheduleModal.item?.descKm || ''}
                  onChange={(e) => setScheduleModal(prev => ({ ...prev, item: { ...prev.item, descKm: e.target.value } }))}
                  className="w-full bg-[#12100e] border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100"
                  placeholder="ជួបជុំភ្ញៀវកិត្តិយស..."
                />
              </div>

              <div>
                <label className="block text-[11px] text-stone-400 mb-1">{lang === 'km' ? 'ការពិពណ៌នា (English)' : 'Description (EN)'}</label>
                <textarea
                  rows={2}
                  value={scheduleModal.item?.descEn || ''}
                  onChange={(e) => setScheduleModal(prev => ({ ...prev, item: { ...prev.item, descEn: e.target.value } }))}
                  className="w-full bg-[#12100e] border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100"
                  placeholder="Welcoming honored guests..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setScheduleModal({ isOpen: false, item: null, isEdit: false })}
                  className="py-2 px-3 rounded-xl bg-white/5 text-stone-400 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 rounded-xl bg-gradient-to-r from-[#996515] to-[#d4af37] text-stone-950 font-bold text-xs"
                >
                  Save Agenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GALLERY EDIT / CREATE MODAL */}
      {galleryModal.isOpen && (
        <div className="fixed inset-0 z-[150] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#181512] border border-[#d4af37]/50 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-stone-800">
              <h4 className="font-moulpali text-sm sm:text-base text-[#f3e5ab] flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#d4af37]" />
                <span>
                  {galleryModal.isEdit
                    ? (lang === 'km' ? 'កែប្រែព័ត៌មានរូបថត' : 'Edit Photo Details')
                    : (lang === 'km' ? 'បន្ថែមរូបថតថ្មីទៅកាន់ Album' : 'Add New Photo to Album')}
                </span>
              </h4>
              <button
                type="button"
                onClick={() => setGalleryModal({ isOpen: false, item: null, isEdit: false, editIndex: -1 })}
                className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveGalleryItem} className="space-y-4">
              {/* Hidden file input for modal uploads */}
              <input
                ref={modalFileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/jpg"
                className="hidden"
                onChange={handleModalFileUpload}
              />

              {/* Upload Dropzone or Current Image Preview */}
              <div>
                <label className="block text-[11px] font-semibold text-stone-300 mb-1.5 flex items-center justify-between">
                  <span>{lang === 'km' ? 'រូបភាព (Photo Asset)' : 'Photo Asset'} *</span>
                  <span className="text-[10px] text-amber-400">PNG, JPG, WEBP</span>
                </label>

                {galleryModal.item?.url ? (
                  <div className="space-y-2">
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#d4af37]/60 bg-black/80 shadow-lg group">
                      <img
                        src={galleryModal.item.url}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = '/images/gallery-1.webp'; }}
                      />
                      <div className="absolute top-2 right-2 flex items-center gap-1.5">
                        <span className="bg-emerald-950/90 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-500/40 shadow backdrop-blur-sm">
                          ✓ {galleryModal.item.sizeKb ? `${galleryModal.item.sizeKb} KB` : 'Ready'}
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => modalFileInputRef.current?.click()}
                          disabled={isUploadingPhoto}
                          className="px-3 py-1.5 rounded-xl bg-[#d4af37] text-stone-950 font-bold text-xs shadow hover:brightness-110 active:scale-95 transition flex items-center gap-1 cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>{lang === 'km' ? 'ប្តូររូបភាព' : 'Change Image'}</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => modalFileInputRef.current?.click()}
                        disabled={isUploadingPhoto}
                        className="py-1.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-[#d4af37]/40 text-[#fde047] text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                      >
                        {isUploadingPhoto ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Upload className="w-3.5 h-3.5" />
                        )}
                        <span>{lang === 'km' ? 'Upload រូបភាពថ្មី' : 'Upload New Photo'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setGalleryModal(prev => ({
                          ...prev,
                          item: { ...(prev.item || {}), url: '' }
                        }))}
                        className="text-[11px] text-rose-400 hover:text-rose-300 hover:underline transition cursor-pointer"
                      >
                        {lang === 'km' ? 'ដករូបភាពចេញ' : 'Remove Image'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => modalFileInputRef.current?.click()}
                    disabled={isUploadingPhoto}
                    className="w-full flex flex-col items-center justify-center border-2 border-dashed border-[#d4af37]/50 hover:border-[#ffd700] rounded-2xl p-5 cursor-pointer bg-white/5 hover:bg-white/10 transition group text-center disabled:opacity-50"
                  >
                    {isUploadingPhoto ? (
                      <>
                        <Loader2 className="w-8 h-8 text-[#d4af37] animate-spin mb-2" />
                        <span className="text-xs font-semibold text-[#fde047]">
                          {lang === 'km' ? 'កំពុងរៀបចំ និងបង្រួមរូបភាព...' : 'Optimizing and compressing photo...'}
                        </span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-[#d4af37] group-hover:scale-110 transition mb-2" />
                        <span className="text-xs font-bold text-stone-100">
                          {lang === 'km' ? 'ចុចទីនេះដើម្បី Upload រូបថតពីម៉ាស៊ីន' : 'Click to Upload Photo from Device'}
                        </span>
                        <span className="text-[10px] text-stone-400 mt-1">
                          {lang === 'km' ? 'ពីកុំព្យូទ័រ ឬទូរស័ព្ទ (PNG, JPG, WEBP)' : 'from your PC or Smartphone (PNG, JPG, WEBP)'}
                        </span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Image URL Input & Presets */}
              <div>
                <label className="block text-[11px] text-stone-400 mb-1">
                  {lang === 'km' ? 'ឬ បញ្ចូលតំណភ្ជាប់រូបភាព (Image URL / Path)' : 'Or Enter Image URL / Path'}
                </label>
                <input
                  type="text"
                  required
                  value={galleryModal.item?.url || ''}
                  onChange={(e) => setGalleryModal(prev => ({
                    ...prev,
                    item: { ...(prev.item || {}), url: e.target.value }
                  }))}
                  className="w-full bg-[#12100e] border border-stone-700 focus:border-[#d4af37] rounded-xl px-3 py-2 text-xs text-stone-100 font-mono focus:outline-none"
                  placeholder="/images/gallery-1.webp ឬ https://..."
                />
                <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
                  <span className="text-[10px] text-stone-500">{lang === 'km' ? 'រូបគំរូ:' : 'Presets:'}</span>
                  {['/images/gallery-1.webp', '/images/gallery-2.webp', '/images/gallery-8.webp', '/images/a1.webp', '/images/a2.webp', '/images/a3.webp'].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setGalleryModal(prev => ({
                        ...prev,
                        item: { ...(prev.item || {}), url: preset }
                      }))}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-stone-800 hover:bg-stone-700 text-stone-300 transition cursor-pointer"
                    >
                      {preset.split('/').pop()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Titles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-stone-400 mb-1">
                    {lang === 'km' ? 'ចំណងជើង (ខ្មែរ)' : 'Title (KM)'}
                  </label>
                  <input
                    type="text"
                    value={galleryModal.item?.titleKm || ''}
                    onChange={(e) => setGalleryModal(prev => ({
                      ...prev,
                      item: { ...(prev.item || {}), titleKm: e.target.value }
                    }))}
                    className="w-full bg-[#12100e] border border-stone-700 focus:border-[#d4af37] rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none"
                    placeholder="ស្នាមញញឹមនៃក្តីស្រលាញ់"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-stone-400 mb-1">
                    {lang === 'km' ? 'ចំណងជើង (English)' : 'Title (EN)'}
                  </label>
                  <input
                    type="text"
                    value={galleryModal.item?.titleEn || ''}
                    onChange={(e) => setGalleryModal(prev => ({
                      ...prev,
                      item: { ...(prev.item || {}), titleEn: e.target.value }
                    }))}
                    className="w-full bg-[#12100e] border border-stone-700 focus:border-[#d4af37] rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none"
                    placeholder="Sweet Moments"
                  />
                </div>
              </div>

              {/* Captions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-stone-400 mb-1">
                    {lang === 'km' ? 'ការពិពណ៌នាខ្លី (ខ្មែរ)' : 'Caption (KM)'}
                  </label>
                  <textarea
                    rows={2}
                    value={galleryModal.item?.captionKm || ''}
                    onChange={(e) => setGalleryModal(prev => ({
                      ...prev,
                      item: { ...(prev.item || {}), captionKm: e.target.value }
                    }))}
                    className="w-full bg-[#12100e] border border-stone-700 focus:border-[#d4af37] rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none resize-none"
                    placeholder="ពេលវេលាដ៏មានអត្ថន័យ..."
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-stone-400 mb-1">
                    {lang === 'km' ? 'ការពិពណ៌នាខ្លី (English)' : 'Caption (EN)'}
                  </label>
                  <textarea
                    rows={2}
                    value={galleryModal.item?.captionEn || ''}
                    onChange={(e) => setGalleryModal(prev => ({
                      ...prev,
                      item: { ...(prev.item || {}), captionEn: e.target.value }
                    }))}
                    className="w-full bg-[#12100e] border border-stone-700 focus:border-[#d4af37] rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none resize-none"
                    placeholder="Precious moments..."
                  />
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setGalleryModal({ isOpen: false, item: null, isEdit: false, editIndex: -1 })}
                  className="py-2.5 px-4 rounded-xl bg-white/5 text-stone-400 text-xs hover:text-white transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-[#996515] to-[#d4af37] text-stone-950 font-bold text-xs shadow-lg hover:brightness-110 active:scale-95 transition cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>{lang === 'km' ? 'រក្សាទុករូបថត' : 'Save Photo'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
