import { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Plus,
  Search,
  Copy,
  Check,
  ExternalLink,
  Edit3,
  Trash2,
  RefreshCw,
  Send,
  Globe,
  CheckCircle2,
  HelpCircle,
  XCircle,
  Clock,
  Sparkles,
  ArrowLeft,
  Settings,
  X,
  FileSpreadsheet,
  Download,
  AlertCircle,
  Lock,
  Eye,
  EyeOff,
  LogOut,
  ShieldCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { GOOGLE_APPS_SCRIPT_CODE } from './googleAppsScriptSource';
import WeddingConfigCrud from './WeddingConfigCrud';
import { getStoredWeddingConfig } from '../utils/weddingConfig';

const DEFAULT_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzLMSWSdHf9ArnCzpB4CIapF7UkcDCHyUfW6jm0U1Wn-HmrEeD2yTk2C-zrNvtsnwQJpQ/exec";
const STORAGE_KEY_GUESTS = "engagement_invitations_cache_v1";
const STORAGE_KEY_SCRIPT_URL = "engagement_invitation_script_url";
const ADMIN_PASSWORD = "123!@#kims@n";
const STORAGE_KEY_AUTH = "engagement_crud_admin_auth";

// Generates a 6-digit random number string
const generate6DigitId = (existingIds = []) => {
  const idsSet = new Set(existingIds.map(String));
  let newId = '';
  let attempts = 0;
  do {
    newId = String(Math.floor(100000 + Math.random() * 900000));
    attempts++;
  } while (idsSet.has(newId) && attempts < 10000);
  return newId;
};

// Formats the English copy text with the specified link
const formatEnglishCopyText = (link) => {
  return `💐 Engagement Ceremony Invitation 💍\nWe are delighted to invite you to celebrate our engagement ceremony. Your presence and blessings would mean so much to us. ❤️\nPlease click the link below to view our invitation:\n🔗 ${link}`;
};

// Formats the Khmer copy text with the specified link
const formatKhmerCopyText = (link) => {
  return `💐 សូមគោរពអញ្ជើញ 💍\nយើងខ្ញុំមានកិត្តិយស សូមគោរពអញ្ជើញ ឯកឧត្តម លោកជំទាវ លោក លោកស្រី អ្នកនាង កញ្ញា ចូលរួមជាអធិបតី និងជាភ្ញៀវកិត្តិយស អបអរសាទរក្នុងពិធីចូលចែចូវរបស់យើងខ្ញុំ។ វត្តមាន និងពរជ័យរបស់លោកអ្នក គឺជាកិត្តិយស និងជាក្តីរីករាយដ៏ធំធេងសម្រាប់យើងខ្ញុំ។ ❤️\nសូមចុចតំណភ្ជាប់ខាងក្រោម ដើម្បីទស្សនាលិខិតអញ្ជើញ៖\n🔗 ${link}`;
};

// Engagement Ring SVG Icon
function RingIcon({ className = "w-5 h-5 text-[#d4af37]", ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Diamond Gem setting */}
      <path d="M9 3h6l2 3-5 4-5-4 2-3z" fill="currentColor" fillOpacity="0.25" />
      <path d="M7 6h10" />
      <path d="M12 3v7" />
      {/* Ring Band */}
      <circle cx="12" cy="14.5" r="6.5" />
    </svg>
  );
}

export default function InvitationCrud({ onBackToInvitation, lang = 'km' }) {
  const [scriptUrl, setScriptUrl] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_SCRIPT_URL) || DEFAULT_SCRIPT_URL;
  });
  const [adminTab, setAdminTab] = useState('guests'); // 'guests' | 'wedding_config'
  const [weddingConfig, setWeddingConfig] = useState(() => getStoredWeddingConfig());

  const [guests, setGuests] = useState(() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY_GUESTS);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (e) {
      // ignore
    }
    // Default initial guest matching the user's provided example
    return [
      {
        id: "482915",
        name: "សន គឹមស្រ៊ី",
        rsvp: "Attending",
        guestCount: "2",
        message: "សូមជូនពរឱ្យស្រលាញ់គ្នាដល់ចាស់កោងខ្នង និងមានសុភមង្គលជានិច្ច!",
        telegram_link: "https://t.me/engagement_invitation_bot/invite?startapp=482915",
        web_link: "https://engagement-invitation.sornkimsry96.workers.dev/?guest=482915",
        createdAt: new Date().toISOString()
      }
    ];
  });

  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState(null);
  const [guestToDelete, setGuestToDelete] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [isGeneralLinkOpen, setIsGeneralLinkOpen] = useState(true);

  // General (No ID) invitation links
  const publicWebLink = typeof window !== 'undefined' && window.location.origin && !window.location.origin.includes('localhost')
    ? `${window.location.origin}/`
    : 'https://engagement-invitation.sornkimsry96.workers.dev/';
  const publicTgLink = 'https://t.me/engagement_invitation_bot/invite';

  const enPublicTgText = formatEnglishCopyText(publicTgLink);
  const khPublicTgText = formatKhmerCopyText(publicTgLink);
  const enPublicWebText = formatEnglishCopyText(publicWebLink);
  const khPublicWebText = formatKhmerCopyText(publicWebLink);

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    rsvp: 'Pending',
    guestCount: '1',
    message: ''
  });

  // Admin Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY_AUTH) === 'true';
    } catch (e) {
      return false;
    }
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput.trim() === ADMIN_PASSWORD) {
      try {
        sessionStorage.setItem(STORAGE_KEY_AUTH, 'true');
      } catch (err) { }
      setIsAuthenticated(true);
      setAuthError(false);
      setPasswordInput('');
    } else {
      setAuthError(true);
    }
  };

  const handleLogout = () => {
    try {
      sessionStorage.removeItem(STORAGE_KEY_AUTH);
    } catch (err) { }
    setIsAuthenticated(false);
    setPasswordInput('');
    setAuthError(false);
  };

  // Save to local storage whenever guests change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_GUESTS, JSON.stringify(guests));
    } catch (e) {
      console.error(e);
    }
  }, [guests]);

  // Show temporary toast message
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const [sheetStatus, setSheetStatus] = useState('checking'); // 'checking' | 'connected' | 'legacy' | 'error'
  const [isSaving, setIsSaving] = useState(false);
  const [syncAlert, setSyncAlert] = useState(null);

  // Fetch guests from Google Spreadsheet
  const fetchGuestsFromSheet = async () => {
    setLoading(true);
    setSheetStatus('checking');
    try {
      const res = await fetch(`${scriptUrl}?action=list`);
      const data = await res.json();
      if (data && (data.success || Array.isArray(data.data))) {
        const loaded = (data.data || []).map(item => ({
          ...item,
          id: String(item.id),
          telegram_link: item.telegram_link || `https://t.me/engagement_invitation_bot/invite?startapp=${item.id}`,
          web_link: item.web_link || `https://engagement-invitation.sornkimsry96.workers.dev/?guest=${item.id}`
        }));
        setGuests(loaded);
        setSheetStatus('connected');
        showToast(lang === 'km' ? 'ទាញទិន្នន័យពីម៉ាស៊ីនមេជោគជ័យ!' : 'Synced from Server!');
      } else {
        // If data returns error or missing id, the script is legacy
        setSheetStatus('legacy');
        if (data.found && data.id) {
          setGuests(prev => {
            const exists = prev.find(g => g.id === String(data.id));
            if (!exists) {
              return [{
                id: String(data.id),
                name: data.name,
                rsvp: data.rsvp,
                guestCount: data.guestCount || '1',
                message: data.message || '',
                telegram_link: `https://t.me/engagement_invitation_bot/invite?startapp=${data.id}`,
                web_link: `https://engagement-invitation.sornkimsry96.workers.dev/?guest=${data.id}`
              }, ...prev];
            }
            return prev;
          });
        }
      }
    } catch (err) {
      console.warn("Failed to fetch from sheet API, working from local cache:", err);
      setSheetStatus('legacy');
    } finally {
      setLoading(false);
    }
  };

  // Initial load when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchGuestsFromSheet();
    }
  }, [scriptUrl, isAuthenticated]);

  // Open Create Form
  const handleOpenCreate = () => {
    const existingIds = guests.map(g => g.id);
    const newId = generate6DigitId(existingIds);
    setFormData({
      id: newId,
      name: '',
      rsvp: 'Pending',
      guestCount: '1',
      message: ''
    });
    setEditingGuest(null);
    setIsFormModalOpen(true);
  };

  // Open Edit Form
  const handleOpenEdit = (guest) => {
    setEditingGuest(guest);
    setFormData({
      id: guest.id,
      name: guest.name || '',
      rsvp: guest.rsvp || 'Pending',
      guestCount: guest.guestCount || '1',
      message: guest.message || ''
    });
    setIsFormModalOpen(true);
  };

  // Re-generate ID inside modal
  const handleRerollId = () => {
    const existingIds = guests.filter(g => !editingGuest || g.id !== editingGuest.id).map(g => g.id);
    const newId = generate6DigitId(existingIds);
    setFormData(prev => ({ ...prev, id: newId }));
  };

  // Save (Create or Update)
  const handleSaveGuest = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert(lang === 'km' ? 'សូមបញ្ចូលឈ្មោះភ្ញៀវកិត្តិយស!' : 'Please enter guest name!');
      return;
    }

    const cleanId = String(formData.id).trim();
    if (!cleanId || cleanId.length !== 6 || isNaN(Number(cleanId))) {
      alert(lang === 'km' ? 'ID ត្រូវតែជាលេខ ៦ ខ្ទង់!' : 'ID must be a 6-digit number!');
      return;
    }

    // Check duplicate if creating or changing ID
    const duplicate = guests.find(g => g.id === cleanId && (!editingGuest || editingGuest.id !== cleanId));
    if (duplicate) {
      alert(lang === 'km' ? 'លេខ ID នេះមានរួចហើយ! សូមបង្កើត ID ថ្មី។' : 'This ID already exists! Please roll a new ID.');
      return;
    }

    const telegram_link = `https://t.me/engagement_invitation_bot/invite?startapp=${cleanId}`;
    const web_link = `https://engagement-invitation.sornkimsry96.workers.dev/?guest=${cleanId}`;

    const newGuestRecord = {
      id: cleanId,
      name: formData.name.trim(),
      rsvp: editingGuest ? (editingGuest.rsvp || 'Pending') : 'Pending',
      guestCount: editingGuest ? (editingGuest.guestCount || '1') : '1',
      message: editingGuest ? (editingGuest.message || '') : '',
      telegram_link,
      web_link,
      updatedAt: new Date().toISOString()
    };

    setIsSaving(true);

    // Save locally first so user's work is never lost
    if (editingGuest) {
      setGuests(prev => prev.map(g => g.id === editingGuest.id ? {
        ...g,
        name: formData.name.trim(),
        updatedAt: new Date().toISOString()
      } : g));
    } else {
      newGuestRecord.createdAt = new Date().toISOString();
      setGuests(prev => [newGuestRecord, ...prev]);
    }

    // Send to Google Apps Script
    try {
      const requestPayload = editingGuest
        ? {
          action: 'update',
          id: cleanId,
          name: formData.name.trim()
        }
        : {
          action: 'create',
          ...newGuestRecord
        };

      const res = await fetch(scriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(requestPayload)
      });

      const data = await res.json().catch(() => ({}));

      if (data && data.success) {
        setSheetStatus('connected');
        showToast(lang === 'km' ? '✅ បានកត់ត្រាចូល Google Sheet ជោគជ័យ!' : '✅ Saved to Google Sheet!');
        setIsFormModalOpen(false);
      } else {
        // Old Apps Script or error response
        setSheetStatus('legacy');
        setIsFormModalOpen(false);
        setSyncAlert({
          title: lang === 'km' ? 'Google Sheet មិនទាន់ទទួលទិន្នន័យទេ' : 'Not Saved to Google Sheet',
          reason: data?.error || (lang === 'km' ? 'Google Apps Script កំពុងដំណើរការ version ចាស់ (ឆ្លើយតបថា Guest not found)' : 'Google Apps Script is running an older deployment that does not support appending rows.'),
          guest: newGuestRecord
        });
      }
    } catch (err) {
      console.warn("Sheet sync error:", err);
      setSheetStatus('error');
      setIsFormModalOpen(false);
      setSyncAlert({
        title: lang === 'km' ? 'បញ្ហាតភ្ជាប់បណ្តាញ' : 'Network / Sync Issue',
        reason: err.message || (lang === 'km' ? 'មិនអាចទាក់ទង Google Apps Script បានទេ' : 'Could not reach Google Apps Script'),
        guest: newGuestRecord
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Guest
  const handleDeleteConfirm = async () => {
    if (!guestToDelete) return;
    const targetId = guestToDelete.id;

    setGuests(prev => prev.filter(g => g.id !== targetId));
    setGuestToDelete(null);
    showToast(lang === 'km' ? 'បានលុបសំបុត្រអញ្ជើញ!' : 'Invitation deleted!');

    // Sync with Google Apps Script
    try {
      const res = await fetch(scriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'delete',
          id: targetId
        })
      });
      const data = await res.json().catch(() => ({}));
      if (data && data.success) {
        setSheetStatus('connected');
      } else {
        setSheetStatus('legacy');
      }
    } catch (err) {
      console.warn("Background sheet delete notice:", err);
    }
  };

  // Clipboard Copy Helper
  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast(lang === 'km' ? 'បានចម្លងទៅ Clipboard!' : 'Copied to clipboard!');
    setTimeout(() => {
      setCopiedKey(null);
    }, 2200);
  };

  // Filtered and Searched List
  const filteredGuests = useMemo(() => {
    return guests.filter(g => {
      const matchesStatus = statusFilter === 'ALL' || g.rsvp === statusFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        g.name.toLowerCase().includes(q) ||
        g.id.includes(q) ||
        (g.message && g.message.toLowerCase().includes(q));
      return matchesStatus && matchesSearch;
    });
  }, [guests, statusFilter, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const total = guests.length;
    const attending = guests.filter(g => g.rsvp === 'Attending').length;
    const maybe = guests.filter(g => g.rsvp === 'Maybe').length;
    const declined = guests.filter(g => g.rsvp === 'Declined').length;
    const pending = guests.filter(g => !g.rsvp || g.rsvp === 'Pending').length;
    return { total, attending, maybe, declined, pending };
  }, [guests]);

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ["ID", "Name", "RSVP", "Guest Count", "Message", "Telegram Link", "Web Link"];
    const rows = guests.map(g => [
      `"${g.id}"`,
      `"${(g.name || '').replace(/"/g, '""')}"`,
      `"${g.rsvp || 'Pending'}"`,
      `"${g.guestCount || '1'}"`,
      `"${(g.message || '').replace(/"/g, '""')}"`,
      `"${g.telegram_link}"`,
      `"${g.web_link}"`
    ]);
    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `invitations_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Render Login Screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full bg-[#12100e] text-stone-100 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden select-none">
        {/* Ambient background glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#d4af37]/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-sm sm:max-w-md bg-[#181512]/95 border border-[#d4af37]/40 rounded-3xl p-6 sm:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.8),0_0_25px_rgba(212,175,55,0.15)] backdrop-blur-md relative z-10 space-y-6">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#996515]/30 via-[#d4af37]/20 to-transparent border border-[#d4af37]/50 flex items-center justify-center mx-auto text-[#fde047] shadow-[0_0_25px_rgba(212,175,55,0.25)]">
              <Lock className="w-8 h-8" />
            </div>
            <div>
              <h2 className="mt-4 mb-2 font-moulpali text-lg sm:text-xl text-[#f3e5ab]">
                {lang === 'km' ? 'ប្រព័ន្ធគ្រប់គ្រង ' : 'Admin Login'}
              </h2>
              <p className="text-xs text-stone-400 mt-1">
                {lang === 'km'
                  ? 'សូមបញ្ចូលលេខសម្ងាត់ ដើម្បីគ្រប់គ្រងសំបុត្រអញ្ជើញ'
                  : 'Please enter the admin password to manage invitations'}
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                {lang === 'km' ? 'លេខសម្ងាត់ ' : 'Admin Password'}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoFocus
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (authError) setAuthError(false);
                  }}
                  placeholder="••••••••••••"
                  className={`w-full bg-[#12100e] border ${authError ? 'border-rose-500 focus:border-rose-400' : 'border-stone-700 focus:border-[#d4af37]'
                    } rounded-xl pl-3.5 pr-10 py-3 text-sm text-stone-100 placeholder-stone-600 focus:outline-none transition`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200 p-1"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {authError && (
                <div className="mt-2.5 p-2.5 rounded-xl bg-rose-950/50 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2 animate-shake">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>
                    {lang === 'km'
                      ? 'លេខសម្ងាត់មិនត្រឹមត្រូវទេ! សូមសាកល្បងម្តងទៀត។'
                      : 'Incorrect password! Please try again.'}
                  </span>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#996515] via-[#b8860b] to-[#d4af37] text-stone-950 font-bold text-sm shadow-[0_4px_20px_rgba(212,175,55,0.4)] hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
              <span>{lang === 'km' ? 'ចូលប្រព័ន្ធ' : 'Login to Admin'}</span>
            </button>

            <button
              type="button"
              onClick={onBackToInvitation}
              className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 text-xs font-semibold transition flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{lang === 'km' ? 'ត្រឡប់ទៅធៀបអញ្ជើញ' : 'Back to Invitation'}</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#12100e] text-[#f7eedd] p-3 sm:p-6 md:p-8 flex flex-col items-center">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 z-[100] px-5 py-3 rounded-2xl bg-gradient-to-r from-[#996515] to-[#d4af37] text-stone-950 font-bold text-sm shadow-[0_10px_30px_rgba(212,175,55,0.4)] flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-stone-950" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="w-full max-w-5xl space-y-6">

        {/* Top Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#1c1815] border border-[#d4af37]/30 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-2xl">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToInvitation}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white/5 hover:bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#fde047] flex items-center gap-1.5 text-xs sm:text-sm font-semibold transition active:scale-95"
              title="Return to Invitation"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{lang === 'km' ? 'ទៅធៀបអញ្ជើញ' : 'View Invitation'}</span>
            </button>

            <div>
              <h1 className="font-moulpali text-lg sm:text-2xl text-[#f3e5ab] flex items-center gap-2">
                <span>{lang === 'km' ? 'គ្រប់គ្រងប្រព័ន្ធ' : 'Invitation Management'}</span>
              </h1>
              {/* <p className="text-xs text-stone-400">
                {lang === 'km' ? 'តភ្ជាប់ Google Spreadsheet & បង្កើត Link អញ្ជើញភ្ញៀវ' : 'Google Spreadsheet CRUD & Shareable Invitation Links'}
              </p> */}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {adminTab === 'guests' && (
              <>
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-stone-700 text-stone-300 hover:text-white transition active:scale-95 text-xs flex items-center gap-1.5"
                  title="Google Sheet Settings"
                >
                  <Settings className="w-4 h-4 text-[#d4af37]" />
                  <span className="hidden sm:inline">Settings</span>
                </button>

                <button
                  onClick={fetchGuestsFromSheet}
                  disabled={loading}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-stone-700 text-stone-300 hover:text-white transition active:scale-95 text-xs flex items-center gap-1.5 disabled:opacity-50"
                  title="Refresh from Sheet"
                >
                  <RefreshCw className={`w-4 h-4 text-[#d4af37] ${loading ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">{lang === 'km' ? 'ទាញទិន្នន័យ' : 'Refresh'}</span>
                </button>

                <button
                  onClick={handleExportCSV}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-stone-700 text-stone-300 hover:text-white transition active:scale-95 text-xs flex items-center gap-1.5"
                  title="Export CSV"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span className="hidden sm:inline">CSV</span>
                </button>
              </>
            )}

            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl bg-rose-950/20 hover:bg-rose-950/50 border border-rose-500/30 text-rose-300 hover:text-rose-200 transition active:scale-95 text-xs flex items-center gap-1.5"
              title={lang === 'km' ? 'ចាកចេញពី Admin' : 'Logout from Admin'}
            >
              <LogOut className="w-4 h-4 text-rose-400" />
              <span className="hidden md:inline">{lang === 'km' ? 'ចាកចេញ' : 'Logout'}</span>
            </button>

            {adminTab === 'guests' && (
              <button
                onClick={handleOpenCreate}
                className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#996515] via-[#b8860b] to-[#d4af37] text-stone-950 font-bold text-xs sm:text-sm shadow-[0_4px_20px_rgba(212,175,55,0.4)] hover:brightness-110 active:scale-95 transition flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>{lang === 'km' ? 'បង្កើតធៀបថ្មី' : 'Add Guest'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Main Tab Switcher: Guests List vs Wedding Event Details CMS */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#1c1815] border border-[#d4af37]/40 shadow-xl">
          <button
            onClick={() => setAdminTab('guests')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-2 cursor-pointer ${adminTab === 'guests'
              ? 'bg-gradient-to-r from-[#996515] via-[#b8860b] to-[#d4af37] text-stone-950 font-bold shadow-[0_4px_15px_rgba(212,175,55,0.35)]'
              : 'text-stone-300 hover:text-white hover:bg-white/5'
              }`}
          >
            <Users className="w-4 h-4" />
            <span className="font-moulpali text-xs sm:text-sm">
              {lang === 'km' ? 'បញ្ជីភ្ញៀវ' : 'Guest List & RSVP'}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${adminTab === 'guests' ? 'bg-black/25 text-stone-950' : 'bg-white/10 text-stone-300'
              }`}>
              {guests.length}
            </span>
          </button>

          <button
            onClick={() => setAdminTab('wedding_config')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-2 cursor-pointer ${adminTab === 'wedding_config'
              ? 'bg-gradient-to-r from-[#996515] via-[#b8860b] to-[#d4af37] text-stone-950 font-bold shadow-[0_4px_15px_rgba(212,175,55,0.35)]'
              : 'text-stone-300 hover:text-white hover:bg-white/5'
              }`}
          >
            <RingIcon className="w-4 h-4" />
            <span className="font-moulpali text-xs sm:text-sm">
              {lang === 'km' ? 'ព័ត៌មានមង្គលការ' : 'Wedding Details CMS'}
            </span>
          </button>
        </div>

        {adminTab === 'wedding_config' ? (
          <WeddingConfigCrud
            config={weddingConfig}
            onUpdateConfig={setWeddingConfig}
            lang={lang}
            onBack={() => setAdminTab('guests')}
          />
        ) : (
          <>
            {/* Sync Status Alert Banner if Google Apps Script is not deployed or legacy */}
            {sheetStatus === 'legacy' && (
              <div className="bg-amber-950/40 border-2 border-amber-500/60 rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-[0_4px_25px_rgba(245,158,11,0.2)]">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
                  <div className="space-y-1">
                    <h4 className="font-moul text-xs sm:text-sm text-amber-200">
                      {lang === 'km' ? '⚠️ Google Apps Script ត្រូវការ Update Code ថ្មី' : '⚠️ Action Required: Update Google Apps Script'}
                    </h4>
                    <p className="text-xs text-stone-300 leading-relaxed max-w-2xl">
                      {lang === 'km'
                        ? 'អ្នកមិនទាន់ឃើញ Record ថ្មីក្នុង Google Spreadsheet ដោយសារ Apps Script លើ Google កំពុងរត់ Version ចាស់ (ឆ្លើយតប Guest not found)។ សូម Update កូដ Code.gs ថ្មីជា New Version ដើម្បីឱ្យទិន្នន័យ Sync ដោយស្វ័យប្រវត្តិ!'
                        : 'Records are not appearing in Google Sheets because the current Apps Script on Google is running an older deployment. Please update Code.gs in Apps Script as a "New version".'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:brightness-110 text-stone-950 font-bold text-xs shrink-0 shadow active:scale-95 transition flex items-center gap-1.5"
                >
                  <span>{lang === 'km' ? 'របៀប Update Code.gs' : 'Deploy Instructions'}</span>
                </button>
              </div>
            )}

            {/* Sync Status Banner if Connected */}
            {sheetStatus === 'connected' && (
              <div className="bg-emerald-950/30 border border-emerald-500/40 rounded-2xl px-4 py-2.5 flex items-center justify-between gap-2 text-xs text-emerald-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{lang === 'km' ? '🟢 Google Spreadsheet បានភ្ជាប់ជោគជ័យ (CRUD Ready)' : '🟢 Google Spreadsheet Connected (CRUD Ready)'}</span>
                </div>
                <a
                  href="https://docs.google.com/spreadsheets/d/1Dywg4dhXeyF-21qwhA1PAQqeV-VgPOC8NiUtwNzd0QM"
                  target="_blank"
                  rel="noreferrer"
                  className="underline text-[11px] text-emerald-400 hover:text-emerald-200 flex items-center gap-1"
                >
                  <span>View Sheet</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

            {/* Stats Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3">
              <div
                onClick={() => setStatusFilter('ALL')}
                className={`cursor-pointer rounded-2xl p-3 sm:p-4 border transition ${statusFilter === 'ALL'
                  ? 'bg-[#d4af37]/15 border-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                  : 'bg-[#181512] border-stone-800 hover:border-stone-700'
                  }`}
              >
                <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
                  <span>{lang === 'km' ? 'សរុបទាំងអស់' : 'Total Guests'}</span>
                  <Users className="w-4 h-4 text-[#d4af37]" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-[#f3e5ab]">{stats.total}</div>
              </div>

              <div
                onClick={() => setStatusFilter('Attending')}
                className={`cursor-pointer rounded-2xl p-3 sm:p-4 border transition ${statusFilter === 'Attending'
                  ? 'bg-emerald-950/40 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                  : 'bg-[#181512] border-stone-800 hover:border-stone-700'
                  }`}
              >
                <div className="flex items-center justify-between text-xs text-emerald-400 mb-1">
                  <span>{lang === 'km' ? 'ចូលរួម' : 'Attending'}</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-emerald-300">{stats.attending}</div>
              </div>

              <div
                onClick={() => setStatusFilter('Maybe')}
                className={`cursor-pointer rounded-2xl p-3 sm:p-4 border transition ${statusFilter === 'Maybe'
                  ? 'bg-amber-950/40 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                  : 'bg-[#181512] border-stone-800 hover:border-stone-700'
                  }`}
              >
                <div className="flex items-center justify-between text-xs text-amber-400 mb-1">
                  <span>{lang === 'km' ? 'ប្រហែល' : 'Maybe'}</span>
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-amber-300">{stats.maybe}</div>
              </div>

              <div
                onClick={() => setStatusFilter('Declined')}
                className={`cursor-pointer rounded-2xl p-3 sm:p-4 border transition ${statusFilter === 'Declined'
                  ? 'bg-rose-950/40 border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.2)]'
                  : 'bg-[#181512] border-stone-800 hover:border-stone-700'
                  }`}
              >
                <div className="flex items-center justify-between text-xs text-rose-400 mb-1">
                  <span>{lang === 'km' ? 'មិនអាចចូលរួម' : 'Declined'}</span>
                  <XCircle className="w-4 h-4 text-rose-400" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-rose-300">{stats.declined}</div>
              </div>

              <div
                onClick={() => setStatusFilter('Pending')}
                className={`cursor-pointer rounded-2xl p-3 sm:p-4 border transition col-span-2 sm:col-span-1 ${statusFilter === 'Pending'
                  ? 'bg-stone-800/60 border-stone-400 shadow-[0_0_15px_rgba(168,162,158,0.2)]'
                  : 'bg-[#181512] border-stone-800 hover:border-stone-700'
                  }`}
              >
                <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
                  <span>{lang === 'km' ? 'រង់ចាំឆ្លើយ' : 'Pending'}</span>
                  <Clock className="w-4 h-4 text-stone-400" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-stone-300">{stats.pending}</div>
              </div>
            </div>

            {/* General Public Invitation Link (No Guest ID / សម្រាប់ភ្ញៀវទូទៅគ្មាន ID) */}
            <div className="bg-gradient-to-br from-[#1d1915] via-[#161310] to-[#12100e] border-2 border-[#d4af37]/45 hover:border-[#d4af37]/75 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-[0_8px_30px_rgba(0,0,0,0.6),0_0_20px_rgba(212,175,55,0.12)] space-y-4 relative overflow-hidden transition">
              {/* Soft gold ambient backlight */}
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />

              {/* Card Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-800 relative z-10">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-xl bg-gradient-to-r from-[#996515]/40 via-[#d4af37]/25 to-transparent border border-[#d4af37]/50 text-[#fde047] shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-[#ffd700] animate-pulse" />
                    <span>{lang === 'km' ? 'លិខិតអញ្ជើញទូទៅ (គ្មាន ID)' : 'General Public Link (No ID)'}</span>
                  </span>
                  <h3 className="font-moul text-sm sm:text-base text-[#f3e5ab]">
                    {lang === 'km' ? 'សម្រាប់ភ្ញៀវទូទៅ' : 'For Guests Without ID'}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline-flex items-center text-[11px] text-amber-200/80 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
                    {lang === 'km' ? '✨ បង្ហាញ «សូមគោរពអញ្ជើញ» នៅលើក្របទំព័រ' : '✨ Displays "Cordially Invites" on cover'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsGeneralLinkOpen(!isGeneralLinkOpen)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white transition"
                    title={isGeneralLinkOpen ? 'Collapse' : 'Expand'}
                  >
                    {isGeneralLinkOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {isGeneralLinkOpen && (
                <>
                  <p className="text-xs text-stone-300 leading-relaxed relative z-10">
                    {lang === 'km'
                      ? 'ប្រើតំណភ្ជាប់ខាងក្រោមនេះដើម្បីចែករំលែកទៅកាន់ភ្ញៀវទូទៅ សាច់ញាតិ ឬមិត្តភក្តិ ដោយមិនបាច់បង្កើតលេខកូដ ID សំបុត្រភ្ញៀវម្នាក់ៗឡើយ (អ្នកទទួលអាចបើកមើល ស្ដាប់ភ្លេង និងឆ្លើយតប RSVP បានដូចគ្នា)។'
                      : 'Use these general links to share with general guests, relatives, or friends without generating individual guest IDs (guests can still view ceremony info, enjoy music, and RSVP).'}
                  </p>

                  {/* LINKS & COPY ACTIONS SECTION */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1 relative z-10">

                    {/* 1. TELEGRAM BOT GENERAL LINK CARD */}
                    <div className="bg-[#12100e] border border-[#2AABEE]/30 rounded-2xl p-3.5 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#2AABEE]">
                          <Send className="w-4 h-4" />
                          <span>Telegram Mini App Link (General)</span>
                        </div>
                        <a
                          href={publicTgLink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-stone-400 hover:text-[#2AABEE] flex items-center gap-1 underline"
                        >
                          <span>Open</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>

                      {/* Raw Link Input with Copy button */}
                      <div className="flex items-center gap-1 bg-black/40 border border-stone-800 rounded-xl px-2.5 py-1.5 text-xs text-stone-400">
                        <span className="truncate flex-1">{publicTgLink}</span>
                        <button
                          onClick={() => handleCopy(publicTgLink, 'public_raw_tg')}
                          className="p-1 rounded-md hover:bg-white/10 text-stone-300 hover:text-white"
                          title="Copy raw link only"
                        >
                          {copiedKey === 'public_raw_tg' ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      {/* Copy Invitation Message Buttons */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() => handleCopy(enPublicTgText, 'public_tg_en')}
                          className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-blue-950/40 hover:bg-blue-900/60 border border-blue-500/40 text-blue-200 text-xs font-semibold active:scale-95 transition"
                          title="Copy English Invitation Text with Telegram Link"
                        >
                          {copiedKey === 'public_tg_en' ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-300">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-blue-400" />
                              <span>Copy EN (TG)</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleCopy(khPublicTgText, 'public_tg_kh')}
                          className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/40 text-amber-200 text-xs font-semibold active:scale-95 transition"
                          title="Copy Khmer Invitation Text with Telegram Link"
                        >
                          {copiedKey === 'public_tg_kh' ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-300">បានចម្លង!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-amber-400" />
                              <span>ចម្លងខ្មែរ (TG)</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* 2. DIRECT WEB GENERAL LINK CARD */}
                    <div className="bg-[#12100e] border border-[#d4af37]/35 rounded-2xl p-3.5 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#f3e5ab]">
                          <Globe className="w-4 h-4 text-[#d4af37]" />
                          <span>Direct Web Link (General / Browser)</span>
                        </div>
                        <a
                          href={publicWebLink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-stone-400 hover:text-[#f3e5ab] flex items-center gap-1 underline"
                        >
                          <span>Preview</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>

                      {/* Raw Link Input with Copy button */}
                      <div className="flex items-center gap-1 bg-black/40 border border-stone-800 rounded-xl px-2.5 py-1.5 text-xs text-stone-400">
                        <span className="truncate flex-1">{publicWebLink}</span>
                        <button
                          onClick={() => handleCopy(publicWebLink, 'public_raw_web')}
                          className="p-1 rounded-md hover:bg-white/10 text-stone-300 hover:text-white"
                          title="Copy raw link only"
                        >
                          {copiedKey === 'public_raw_web' ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      {/* Copy Invitation Message Buttons */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() => handleCopy(enPublicWebText, 'public_web_en')}
                          className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-stone-900 hover:bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#fde047] text-xs font-semibold active:scale-95 transition"
                          title="Copy English Invitation Text with Web Link"
                        >
                          {copiedKey === 'public_web_en' ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-300">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-[#fde047]" />
                              <span>Copy EN (Web)</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleCopy(khPublicWebText, 'public_web_kh')}
                          className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-gradient-to-r from-[#996515] to-[#d4af37] text-stone-950 text-xs font-bold shadow-md hover:brightness-110 active:scale-95 transition"
                          title="Copy Khmer Invitation Text with Web Link"
                        >
                          {copiedKey === 'public_web_kh' ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-950" />
                              <span>បានចម្លង!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-stone-950" />
                              <span>ចម្លងខ្មែរ (Web)</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                  </div>
                </>
              )}
            </div>

            {/* Search & Filter Toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#181512] border border-stone-800 p-3 sm:p-4 rounded-2xl">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={lang === 'km' ? 'ស្វែងរកតាមឈ្មោះ ឬ លេខ ID (ឧ. 482915)...' : 'Search by name or 6-digit ID (e.g. 482915)...'}
                  className="w-full bg-[#12100e] border border-stone-700 focus:border-[#d4af37] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-stone-200 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Quick Filter Buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {['ALL', 'Attending', 'Maybe', 'Declined', 'Pending'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`py-1.5 px-3 rounded-xl text-xs font-semibold whitespace-nowrap transition ${statusFilter === st
                      ? 'bg-[#d4af37] text-stone-950 shadow'
                      : 'bg-white/5 text-stone-400 hover:bg-white/10 hover:text-stone-200'
                      }`}
                  >
                    {st === 'ALL' ? (lang === 'km' ? 'ទាំងអស់' : 'All') :
                      st === 'Attending' ? (lang === 'km' ? 'ចូលរួម' : 'Attending') :
                        st === 'Maybe' ? (lang === 'km' ? 'ប្រហែល' : 'Maybe') :
                          st === 'Declined' ? (lang === 'km' ? 'មិនចូលរួម' : 'Declined') :
                            (lang === 'km' ? 'រង់ចាំ' : 'Pending')}
                  </button>
                ))}
              </div>
            </div>

            {/* Invitations List / Cards */}
            {filteredGuests.length === 0 ? (
              <div className="bg-[#181512] border border-dashed border-stone-800 rounded-3xl p-12 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-[#d4af37]/30 flex items-center justify-center mx-auto text-[#d4af37]">
                  <Users className="w-7 h-7" />
                </div>
                <p className="font-semibold text-stone-300">
                  {lang === 'km' ? 'រកមិនឃើញសំបុត្រអញ្ជើញទេ' : 'No invitations found'}
                </p>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  {lang === 'km'
                    ? 'មិនមានទិន្នន័យត្រូវនឹងការស្វែងរក ឬអ្នកមិនទាន់បានបង្កើតសំបុត្រអញ្ជើញនៅឡើយ។'
                    : 'No records match your filter, or no invitations have been added yet.'}
                </p>
                <button
                  onClick={handleOpenCreate}
                  className="py-2 px-4 rounded-xl bg-[#d4af37] text-stone-950 font-bold text-xs inline-flex items-center gap-1.5 shadow"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{lang === 'km' ? 'បង្កើតសំបុត្រដំបូង' : 'Create First Invitation'}</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredGuests.map((guest) => {
                  const tgLink = guest.telegram_link || `https://t.me/engagement_invitation_bot/invite?startapp=${guest.id}`;
                  const webLink = guest.web_link || `https://engagement-invitation.sornkimsry96.workers.dev/?guest=${guest.id}`;

                  const enTgText = formatEnglishCopyText(tgLink);
                  const khTgText = formatKhmerCopyText(tgLink);
                  const enWebText = formatEnglishCopyText(webLink);
                  const khWebText = formatKhmerCopyText(webLink);

                  return (
                    <div
                      key={guest.id}
                      className="bg-[#181512] border border-[#d4af37]/25 hover:border-[#d4af37]/50 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xl transition space-y-4"
                    >
                      {/* Card Header: ID, Name, RSVP Status, Edit/Delete */}
                      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3 border-b border-stone-800">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          {/* 6-Digit ID Badge */}
                          <span className=" text-xs font-bold px-2.5 py-1 rounded-lg bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#fde047]">
                            #{guest.id}
                          </span>

                          {/* Guest Honorific / Name */}
                          <h2 className="font-moul text-base sm:text-lg text-[#f3e5ab]">
                            {guest.name}
                          </h2>

                          {/* RSVP Badge */}
                          {guest.rsvp === 'Attending' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-500/40">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>{lang === 'km' ? 'ចូលរួម' : 'Attending'} ({guest.guestCount || '1'})</span>
                            </span>
                          )}
                          {guest.rsvp === 'Maybe' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-950/60 text-amber-300 border border-amber-500/40">
                              <HelpCircle className="w-3 h-3" />
                              <span>{lang === 'km' ? 'ប្រហែល' : 'Maybe'}</span>
                            </span>
                          )}
                          {guest.rsvp === 'Declined' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-950/60 text-rose-300 border border-rose-500/40">
                              <XCircle className="w-3 h-3" />
                              <span>{lang === 'km' ? 'មិនអាច' : 'Declined'}</span>
                            </span>
                          )}
                          {(!guest.rsvp || guest.rsvp === 'Pending') && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-stone-800/80 text-stone-400 border border-stone-700">
                              <Clock className="w-3 h-3" />
                              <span>{lang === 'km' ? 'រង់ចាំឆ្លើយ' : 'Pending'}</span>
                            </span>
                          )}
                        </div>

                        {/* Edit and Delete Actions */}
                        <div className="flex items-center gap-1.5 ml-auto">
                          <button
                            onClick={() => handleOpenEdit(guest)}
                            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white border border-stone-700/80 transition active:scale-95"
                            title={lang === 'km' ? 'កែប្រែ' : 'Edit'}
                          >
                            <Edit3 className="w-4 h-4 text-amber-400" />
                          </button>
                          <button
                            onClick={() => setGuestToDelete(guest)}
                            className="p-2 rounded-xl bg-white/5 hover:bg-rose-950/40 text-stone-300 hover:text-rose-300 border border-stone-700/80 transition active:scale-95"
                            title={lang === 'km' ? 'លុប' : 'Delete'}
                          >
                            <Trash2 className="w-4 h-4 text-rose-400" />
                          </button>
                        </div>
                      </div>

                      {/* Guest Message / Blessings (if any) */}
                      {guest.message && (
                        <div className="text-xs bg-[#12100e] border border-amber-500/20 rounded-xl p-3 text-amber-200/90 italic flex items-start gap-2">
                          <span className="not-italic text-sm">💬</span>
                          <span>"{guest.message}"</span>
                        </div>
                      )}

                      {/* LINKS & COPY ACTIONS SECTION */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">

                        {/* 1. TELEGRAM BOT LINK CARD */}
                        <div className="bg-[#12100e] border border-[#2AABEE]/30 rounded-2xl p-3.5 space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-[#2AABEE]">
                              <Send className="w-4 h-4" />
                              <span>Telegram Mini App Link</span>
                            </div>
                            <a
                              href={tgLink}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] text-stone-400 hover:text-[#2AABEE] flex items-center gap-1 underline"
                            >
                              <span>Open</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>

                          {/* Raw Link Input with Copy button */}
                          <div className="flex items-center gap-1 bg-black/40 border border-stone-800 rounded-xl px-2.5 py-1.5 text-xs text-stone-400 ">
                            <span className="truncate flex-1">{tgLink}</span>
                            <button
                              onClick={() => handleCopy(tgLink, `raw_tg_${guest.id}`)}
                              className="p-1 rounded-md hover:bg-white/10 text-stone-300 hover:text-white"
                              title="Copy raw link only"
                            >
                              {copiedKey === `raw_tg_${guest.id}` ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>

                          {/* Copy Invitation Message Buttons */}
                          <div className="grid grid-cols-2 gap-2 pt-1">
                            <button
                              onClick={() => handleCopy(enTgText, `tg_en_${guest.id}`)}
                              className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-blue-950/40 hover:bg-blue-900/60 border border-blue-500/40 text-blue-200 text-xs font-semibold active:scale-95 transition"
                              title="Copy English Invitation Text with Telegram Link"
                            >
                              {copiedKey === `tg_en_${guest.id}` ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  <span className="text-emerald-300">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5 text-blue-400" />
                                  <span>Copy EN (TG)</span>
                                </>
                              )}
                            </button>

                            <button
                              onClick={() => handleCopy(khTgText, `tg_kh_${guest.id}`)}
                              className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/40 text-amber-200 text-xs font-semibold active:scale-95 transition"
                              title="Copy Khmer Invitation Text with Telegram Link"
                            >
                              {copiedKey === `tg_kh_${guest.id}` ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  <span className="text-emerald-300">បានចម្លង!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5 text-amber-400" />
                                  <span>ចម្លងខ្មែរ (TG)</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        {/* 2. WEB LINK CARD */}
                        <div className="bg-[#12100e] border border-[#d4af37]/35 rounded-2xl p-3.5 space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-[#f3e5ab]">
                              <Globe className="w-4 h-4 text-[#d4af37]" />
                              <span>Direct Web Link (Cloudflare / Browser)</span>
                            </div>
                            <a
                              href={webLink}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] text-stone-400 hover:text-[#f3e5ab] flex items-center gap-1 underline"
                            >
                              <span>Preview</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>

                          {/* Raw Link Input with Copy button */}
                          <div className="flex items-center gap-1 bg-black/40 border border-stone-800 rounded-xl px-2.5 py-1.5 text-xs text-stone-400 ">
                            <span className="truncate flex-1">{webLink}</span>
                            <button
                              onClick={() => handleCopy(webLink, `raw_web_${guest.id}`)}
                              className="p-1 rounded-md hover:bg-white/10 text-stone-300 hover:text-white"
                              title="Copy raw link only"
                            >
                              {copiedKey === `raw_web_${guest.id}` ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>

                          {/* Copy Invitation Message Buttons */}
                          <div className="grid grid-cols-2 gap-2 pt-1">
                            <button
                              onClick={() => handleCopy(enWebText, `web_en_${guest.id}`)}
                              className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-stone-900 hover:bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#fde047] text-xs font-semibold active:scale-95 transition"
                              title="Copy English Invitation Text with Web Link"
                            >
                              {copiedKey === `web_en_${guest.id}` ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  <span className="text-emerald-300">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5 text-[#fde047]" />
                                  <span>Copy EN (Web)</span>
                                </>
                              )}
                            </button>

                            <button
                              onClick={() => handleCopy(khWebText, `web_kh_${guest.id}`)}
                              className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-gradient-to-r from-[#996515] to-[#d4af37] text-stone-950 text-xs font-bold shadow-md hover:brightness-110 active:scale-95 transition"
                              title="Copy Khmer Invitation Text with Web Link"
                            >
                              {copiedKey === `web_kh_${guest.id}` ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-stone-950" />
                                  <span>បានចម្លង!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5 text-stone-950" />
                                  <span>ចម្លងខ្មែរ (Web)</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

      </div>

      {/* CREATE / EDIT MODAL */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-[120] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#181512] border border-[#d4af37]/50 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-stone-800">
              <h3 className="font-moulpali text-base sm:text-lg text-[#f3e5ab] flex items-center gap-2">
                <RingIcon className="w-5 h-5 text-[#d4af37]" />
                <span>
                  {editingGuest
                    ? (lang === 'km' ? 'កែប្រែព័ត៌មានភ្ញៀវ' : 'Edit Invitation')
                    : (lang === 'km' ? 'បង្កើតសំបុត្រអញ្ជើញថ្មី' : 'Create New Invitation')}
                </span>
              </h3>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveGuest} className="space-y-4">
              {/* Field 1: 6-Digit ID (Random Unique) */}
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1 flex items-center justify-between">
                  <span>{lang === 'km' ? 'លេខកូដសម្គាល់ ID (៦ ខ្ទង់)' : 'Invitation ID (6 digits unique)'}</span>
                  {!editingGuest ? (
                    <button
                      type="button"
                      onClick={handleRerollId}
                      className="text-[11px] text-[#fde047] hover:underline flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>{lang === 'km' ? 'បង្កើតលេខថ្មី' : 'Generate New ID'}</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-stone-500 flex items-center gap-1 ">
                      <Lock className="w-3 h-3 text-stone-500" />
                      <span>{lang === 'km' ? 'មិនអាចកែប្រែ ID បានទេ' : 'ID Locked'}</span>
                    </span>
                  )}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={6}
                    required
                    disabled={Boolean(editingGuest)}
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value.replace(/\D/g, '') })}
                    className={`w-full bg-[#12100e] border ${editingGuest ? 'border-stone-800 text-stone-400 cursor-not-allowed select-none' : 'border-[#d4af37]/40 text-[#fde047]'
                      } focus:border-[#d4af37] rounded-xl px-3.5 py-2.5 text-sm  font-bold tracking-widest focus:outline-none`}
                    placeholder="482915"
                  />
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  {editingGuest
                    ? (lang === 'km' ? 'លេខ ID ត្រូវបានរក្សាទុកដដែល ដើម្បីកុំឱ្យខូចតំណភ្ជាប់ដែលបានផ្ញើរួច។' : 'ID cannot be changed to prevent invalidating sent links.')
                    : (lang === 'km' ? 'លេខសម្គាល់ ៦ ខ្ទង់ចៃដន្យ គ្មានស្ទួន សម្រាប់ភ្ញៀវម្នាក់ៗ។' : 'Unique 6-digit random code generated for this guest.')}
                </p>
              </div>

              {/* Field 2: Guest Name (Editable in both Create and Update) */}
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  {lang === 'km' ? 'គោរមងារ និង ឈ្មោះភ្ញៀវ' : 'Guest Title & Name'} <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#12100e] border border-stone-700 focus:border-[#d4af37] rounded-xl px-3.5 py-2.5 text-sm text-stone-100 focus:outline-none"
                  placeholder="ឧ. ឯកឧត្តម សន គឹមស្រ៊ី ឬ លោកជំទាវ..."
                />
                {/* Quick honorific chips */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {['ឯកឧត្តម', 'លោកជំទាវ', 'លោក', 'លោកស្រី', 'អ្នកនាង', 'កញ្ញា'].map(h => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        name: prev.name.startsWith(h) ? prev.name : `${h} ${prev.name.replace(/^(ឯកឧត្តម|លោកជំទាវ|លោក|លោកស្រី|អ្នកនាង|កញ្ញា)\s*/, '')}`.trim()
                      }))}
                      className="text-[11px] px-2 py-0.5 rounded-lg bg-white/5 hover:bg-[#d4af37]/20 border border-stone-700 text-stone-300"
                    >
                      +{h}
                    </button>
                  ))}
                </div>
              </div>

              {/* VIEW ONLY SECTION WHEN UPDATING: RSVP, Guest Count, Message cannot be edited */}
              {editingGuest ? (
                <div className="bg-[#12100e] border border-stone-800 rounded-2xl p-4 space-y-3.5">
                  <div className="flex items-center justify-between pb-2.5 border-b border-stone-800/80">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-200">
                      <Lock className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>{lang === 'km' ? 'ព័ត៌មានឆ្លើយតបពីភ្ញៀវ (មើលតែប៉ុណ្ណោះ / View Only)' : 'Guest RSVP Response (View Only)'}</span>
                    </div>
                    <span className="text-[10px] text-stone-500  bg-stone-900 px-2 py-0.5 rounded border border-stone-800">🔒 មិនអាចកែប្រែបាន</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {/* 1. ស្ថានភាពឆ្លើយតប */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-stone-400 font-medium">
                        <span>{lang === 'km' ? 'ស្ថានភាពឆ្លើយតប' : 'RSVP Status'}</span>
                        <span className="text-[10px] text-stone-500 ">🔒 មើលតែប៉ុណ្ណោះ</span>
                      </div>
                      <div className="px-3.5 py-2.5 rounded-xl bg-black/60 border border-stone-800 select-none flex items-center gap-2">
                        {editingGuest.rsvp === 'Attending' ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span className="text-emerald-300 font-bold">{lang === 'km' ? 'ចូលរួម' : 'Attending'}</span>
                          </>
                        ) : editingGuest.rsvp === 'Maybe' ? (
                          <>
                            <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
                            <span className="text-amber-300 font-bold">{lang === 'km' ? 'ប្រហែល' : 'Maybe'}</span>
                          </>
                        ) : editingGuest.rsvp === 'Declined' ? (
                          <>
                            <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                            <span className="text-rose-300 font-bold">{lang === 'km' ? 'មិនអាចចូលរួម' : 'Declined'}</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-4 h-4 text-stone-400 shrink-0" />
                            <span className="text-stone-300 font-bold">{lang === 'km' ? 'រង់ចាំឆ្លើយ' : 'Pending'}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* 2. ចំនួនកៅអី/ភ្ញៀវ */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-stone-400 font-medium">
                        <span>{lang === 'km' ? 'ចំនួនកៅអី/ភ្ញៀវ' : 'Guest Count'}</span>
                        <span className="text-[10px] text-stone-500 ">🔒 មើលតែប៉ុណ្ណោះ</span>
                      </div>
                      <div className="px-3.5 py-2.5 rounded-xl bg-black/60 border border-stone-800 text-stone-200 select-none font-bold flex items-center gap-2">
                        <Users className="w-4 h-4 text-[#d4af37]" />
                        <span>{editingGuest.guestCount || '1'} {lang === 'km' ? 'នាក់ / កៅអី' : 'Guest(s) / Seat(s)'}</span>
                      </div>
                    </div>
                  </div>

                  {/* 3. ពាក្យជូនពរ ឬ សារពីភ្ញៀវ */}
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center justify-between text-[11px] text-stone-400 font-medium">
                      <span>{lang === 'km' ? 'ពាក្យជូនពរ ឬ សារពីភ្ញៀវ' : 'Blessing Message from Guest'}</span>
                      <span className="text-[10px] text-stone-500 ">🔒 មើលតែប៉ុណ្ណោះ</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-black/60 border border-stone-800 text-stone-300 text-xs italic leading-relaxed min-h-[50px] select-none">
                      {editingGuest.message ? (
                        <div className="flex items-start gap-2">
                          <span className="not-italic text-sm shrink-0">💬</span>
                          <span>"{editingGuest.message}"</span>
                        </div>
                      ) : (
                        <span className="not-italic text-stone-500 text-[11px]">
                          {lang === 'km' ? '(ភ្ញៀវមិនទាន់បានសរសេរសារជូនពរនៅឡើយទេ)' : '(No blessings written yet)'}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-[11px] text-amber-300/70 pt-1 flex items-center gap-1.5">
                    <span>💡</span>
                    <span>
                      {lang === 'km'
                        ? 'ព័ត៌មានទាំង ៣ នេះត្រូវបានបំពេញដោយស្វ័យប្រវត្តិតាមរយៈការឆ្លើយតបរបស់ភ្ញៀវផ្ទាល់ ដូច្នេះមិនអាចកែប្រែដោយផ្ទាល់បានទេ (សម្រាប់តែមើល)។'
                        : 'These 3 fields are updated automatically when the guest responds to their digital invitation and cannot be manually edited (view only).'}
                    </span>
                  </p>
                </div>
              ) : (
                /* Information note when inserting new invitation */
                <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-3 text-[11px] text-amber-200/80 flex items-center gap-2">
                  <span className="text-sm">ℹ️</span>
                  <span>
                    {lang === 'km'
                      ? 'ស្ថានភាព, ចំនួនកៅអី និងពាក្យជូនពរ នឹងទទួលបានពីភ្ញៀវផ្ទាល់នៅពេលពួកគាត់ឆ្លើយតបតាមរយៈ Link សំបុត្រអញ្ជើញ។'
                      : 'RSVP status, guest count, and blessings will be received directly from the guest when they confirm attendance.'}
                  </span>
                </div>
              )}

              {/* Auto Links Preview in Modal */}
              <div className="bg-black/30 border border-stone-800 rounded-xl p-3 space-y-2 text-xs text-stone-400">
                <div className="flex items-center gap-1.5 text-stone-300 font-semibold">
                  {/* <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" /> */}
                  <span>{lang === 'km' ? 'តំណភ្ជាប់ដែលបង្កើតដោយស្វ័យប្រវត្តិ:' : 'Auto-generated Links:'}</span>
                </div>
                <div className="truncate  text-[11px] text-[#2AABEE]">
                  Telegram: https://t.me/engagement_invitation_bot/invite?startapp={formData.id}
                </div>
                <div className="truncate  text-[11px] text-[#fde047]">
                  Web: https://engagement-invitation.sornkimsry96.workers.dev/?guest={formData.id}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 text-xs sm:text-sm font-semibold transition"
                >
                  {lang === 'km' ? 'បោះបង់' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#996515] to-[#d4af37] text-stone-950 font-bold text-xs sm:text-sm shadow-lg hover:brightness-110 active:scale-95 transition"
                >
                  {editingGuest
                    ? (lang === 'km' ? 'រក្សាទុកការកែប្រែ' : 'Save Changes')
                    : (lang === 'km' ? 'យល់ព្រមបង្កើត' : 'Confirm & Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {guestToDelete && (
        <div className="fixed inset-0 z-[120] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#181512] border border-rose-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-moulpali text-base text-rose-200">
                {lang === 'km' ? 'តើអ្នកពិតជាចង់លុបមែនទេ?' : 'Delete Invitation?'}
              </h4>
              <p className="text-xs text-stone-400 mt-1">
                {lang === 'km'
                  ? `លុបសំបុត្រអញ្ជើញរបស់ "${guestToDelete.name}"?`
                  : `Are you sure you want to remove ${guestToDelete.name}?`}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setGuestToDelete(null)}
                className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 text-xs font-semibold transition"
              >
                {lang === 'km' ? 'បោះបង់' : 'Cancel'}
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow transition active:scale-95"
              >
                {lang === 'km' ? 'លុបចេញ' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SYNC ALERT MODAL */}
      {syncAlert && (
        <div className="fixed inset-0 z-[130] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#181512] border-2 border-amber-500/60 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto">
              <AlertCircle className="w-6 h-6 animate-pulse" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-moul text-base text-amber-200">
                {syncAlert.title}
              </h3>
              <p className="text-xs text-stone-300">
                {lang === 'km'
                  ? 'ទិន្នន័យត្រូវបានកត់ត្រាទុកក្នុង App រួចរាល់ ប៉ុន្តែ Google Spreadsheet ឆ្លើយតបថា៖'
                  : 'Invitation recorded in app, but Google Spreadsheet replied:'}
              </p>
              <div className="p-2.5 rounded-xl bg-black/60 border border-stone-800 text-rose-300  text-xs text-center mt-2">
                "{syncAlert.reason}"
              </div>
            </div>
            <div className="bg-amber-950/25 border border-amber-500/30 rounded-xl p-3 text-xs text-amber-200/90 space-y-1.5">
              <p className="font-bold text-amber-300">{lang === 'km' ? '💡 មូលហេតុ និងដំណោះស្រាយ៖' : '💡 Why is it not in the sheet?'}</p>
              <p className="text-stone-300 text-[11px] leading-relaxed">
                {lang === 'km'
                  ? 'Google Apps Script លើ Google របស់អ្នកកំពុងរត់ version ចាស់ (មិនទាន់ update កូដ CRUD)។ សូមធ្វើការ Copy កូដថ្មី ហើយ Deploy ជា "New version" ក្នុង Apps Script។'
                  : 'The script currently running on Google is the old version that does not support appending new rows. Deploy the new Code.gs as a "New version" to enable 2-way sync.'}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setSyncAlert(null)}
                className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 text-xs font-semibold transition"
              >
                {lang === 'km' ? 'យល់ព្រម / បិទ' : 'Dismiss'}
              </button>
              <button
                onClick={() => {
                  setSyncAlert(null);
                  setIsSettingsOpen(true);
                }}
                className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#996515] to-[#d4af37] text-stone-950 text-xs font-bold shadow transition active:scale-95 flex items-center justify-center gap-1"
              >
                <span>{lang === 'km' ? 'មើលរបៀប Deploy' : 'Deploy Guide'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SETTINGS MODAL: GOOGLE SCRIPT URL & INSTRUCTIONS */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#181512] border border-[#d4af37]/50 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-[#d4af37]" />
                <h3 className="font-moul text-base text-[#f3e5ab]">
                  {lang === 'km' ? 'ការកំណត់ Google Spreadsheet & Apps Script' : 'Google Spreadsheet & Script Settings'}
                </h3>
              </div>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-stone-300">
              {/* Direct Link to Google Spreadsheet */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-white/5 border border-stone-800 rounded-xl">
                <div>
                  <span className="font-semibold text-stone-200 block">Google Spreadsheet របស់អ្នក:</span>
                  <span className=" text-[11px] text-stone-400">1Dywg4dhXeyF-21qwhA1PAQqeV-VgPOC8NiUtwNzd0QM</span>
                </div>
                <a
                  href="https://docs.google.com/spreadsheets/d/1Dywg4dhXeyF-21qwhA1PAQqeV-VgPOC8NiUtwNzd0QM"
                  target="_blank"
                  rel="noreferrer"
                  className="py-1.5 px-3 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition shrink-0"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>បើក Google Sheet</span>
                </a>
              </div>

              {/* 1-Click Copy Code.gs Button */}
              <div className="p-3.5 bg-[#14110e] border border-[#d4af37]/40 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
                <div>
                  <h5 className="font-bold text-[#fde047] text-xs sm:text-sm">
                    {lang === 'km' ? 'កូដ Google Apps Script (Code.gs)' : 'Google Apps Script Code (Code.gs)'}
                  </h5>
                  <p className="text-[11px] text-stone-400">
                    {lang === 'km'
                      ? 'កូដពេញលេញសម្រាប់គាំទ្រ Create, Read, Update, Delete និង RSVP'
                      : 'Complete script supporting Create, Read, Update, Delete & RSVP'}
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(GOOGLE_APPS_SCRIPT_CODE, 'code_gs_copy')}
                  className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-[#996515] to-[#d4af37] text-stone-950 font-bold text-xs shrink-0 flex items-center gap-1.5 shadow active:scale-95 transition"
                >
                  {copiedKey === 'code_gs_copy' ? (
                    <>
                      <Check className="w-4 h-4 text-stone-950" />
                      <span>បានចម្លងកូដ!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-stone-950" />
                      <span>ចម្លងកូដ Code.gs</span>
                    </>
                  )}
                </button>
              </div>

              {/* Step-by-Step Instructions */}
              <div className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-4 space-y-2 text-[11px] text-amber-200/90">
                <div className="font-bold flex items-center gap-1.5 text-amber-300 text-xs">
                  <AlertCircle className="w-4 h-4" />
                  <span>ជំហាន Update Google Apps Script (ដើម្បីឱ្យឃើញ Record ក្នុង Sheet):</span>
                </div>
                <ol className="list-decimal pl-4 space-y-1.5 text-stone-300">
                  <li>បើក Google Sheet រួចចុច <b>Extensions &gt; Apps Script</b> (ផ្នែកបន្ថែម &gt; Apps Script)</li>
                  <li>លុបកូដចាស់ទាំងអស់ក្នុង <b>Code.gs</b> រួចចុចប៊ូតុង <b>"ចម្លងកូដ Code.gs"</b> ខាងលើ ហើយបិទភ្ជាប់ (Paste)</li>
                  <li>
                    <b className="text-amber-300">សំខាន់បំផុត (Most Important):</b> ចុច <b>Deploy &gt; Manage deployments</b> (គ្រប់គ្រងការដាក់ឱ្យប្រើប្រាស់)
                  </li>
                  <li>ចុចលើរូប <b>ខ្មៅដៃ (Edit / កែប្រែ)</b> នៅក្បែរ Web App</li>
                  <li>ត្រង់ប្រអប់ <b>Version</b> សូមជ្រើសរើស <b>"New version" (កំណែថ្មី)</b> រួចចុច <b>Deploy</b>!</li>
                  <li>(ឬប្រសិនបើធ្វើ New Deployment៖ ជ្រើសរើស Web app &gt; Execute as: <b>Me</b> &gt; Access: <b>Anyone</b>)</li>
                  <li>ចម្លង Web App URL នោះមកដាក់ក្នុងប្រអប់ខាងក្រោមនេះ៖</li>
                </ol>
              </div>

              {/* Web App URL Input */}
              <div>
                <label className="block text-xs font-semibold text-stone-400 mb-1">
                  Google Apps Script Web App URL:
                </label>
                <input
                  type="text"
                  value={scriptUrl}
                  onChange={(e) => {
                    const newUrl = e.target.value;
                    setScriptUrl(newUrl);
                    localStorage.setItem(STORAGE_KEY_SCRIPT_URL, newUrl);
                  }}
                  className="w-full bg-[#12100e] border border-stone-700 focus:border-[#d4af37] rounded-xl p-2.5  text-[11px] text-amber-200 focus:outline-none"
                />
              </div>

              {/* Bottom Actions */}
              <div className="flex justify-between items-center pt-2 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => {
                    setScriptUrl(DEFAULT_SCRIPT_URL);
                    localStorage.setItem(STORAGE_KEY_SCRIPT_URL, DEFAULT_SCRIPT_URL);
                    showToast(lang === 'km' ? 'បានកំណត់ URL ដើមឡើងវិញ' : 'Reset to default script URL');
                  }}
                  className="text-stone-400 hover:text-white underline text-[11px]"
                >
                  {lang === 'km' ? 'កំណត់ URL ដើមឡើងវិញ' : 'Reset to Default'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsSettingsOpen(false);
                    fetchGuestsFromSheet();
                  }}
                  className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-[#996515] to-[#d4af37] text-stone-950 font-bold text-xs shadow active:scale-95 transition"
                >
                  {lang === 'km' ? 'រក្សាទុក & ភ្ជាប់ឡើងវិញ' : 'Save & Sync Now'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
