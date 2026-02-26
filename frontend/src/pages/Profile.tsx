import React, { useState, useEffect, useRef } from 'react';
import { Camera, Edit2, Save, X, User, Phone, MapPin, Tag, Store } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useClickSound } from '../hooks/useClickSound';

const SHOP_CATEGORIES = [
  { value: 'grocery', labelEn: 'Grocery Store', labelBn: 'মুদি দোকান' },
  { value: 'pharmacy', labelEn: 'Pharmacy', labelBn: 'ফার্মেসি' },
  { value: 'clothing', labelEn: 'Clothing', labelBn: 'কাপড়ের দোকান' },
  { value: 'electronics', labelEn: 'Electronics', labelBn: 'ইলেকট্রনিক্স' },
  { value: 'restaurant', labelEn: 'Restaurant', labelBn: 'রেস্তোরাঁ' },
  { value: 'hardware', labelEn: 'Hardware', labelBn: 'হার্ডওয়্যার' },
  { value: 'stationery', labelEn: 'Stationery', labelBn: 'স্টেশনারি' },
  { value: 'cosmetics', labelEn: 'Cosmetics', labelBn: 'কসমেটিক্স' },
  { value: 'furniture', labelEn: 'Furniture', labelBn: 'আসবাবপত্র' },
  { value: 'mobile', labelEn: 'Mobile Shop', labelBn: 'মোবাইল শপ' },
  { value: 'other', labelEn: 'Other', labelBn: 'অন্যান্য' },
];

interface ProfileData {
  shopName: string;
  ownerName: string;
  phone: string;
  address: string;
  category: string;
  photo: string | null;
}

const Profile: React.FC = () => {
  const { mode } = useTheme();
  const { language, t } = useLanguage();
  const { playSound } = useClickSound();
  const isDark = mode === 'dark';
  const isBn = language === 'bn';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<ProfileData>(() => {
    try {
      const stored = localStorage.getItem('shopProfile');
      if (stored) return JSON.parse(stored);
    } catch {}
    return { shopName: '', ownerName: '', phone: '', address: '', category: '', photo: null };
  });
  const [editData, setEditData] = useState<ProfileData>(profile);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setEditData((prev) => ({ ...prev, photo: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    playSound();
    setProfile(editData);
    try {
      localStorage.setItem('shopProfile', JSON.stringify(editData));
    } catch {}
    setIsEditing(false);
  };

  const handleCancel = () => {
    playSound();
    setEditData(profile);
    setIsEditing(false);
  };

  const getCategoryLabel = (value: string) => {
    const cat = SHOP_CATEGORIES.find((c) => c.value === value);
    if (!cat) return value;
    return isBn ? cat.labelBn : cat.labelEn;
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: isDark ? '#1a1a2e' : '#ffffff',
    borderColor: isDark ? '#333' : '#e5e7eb',
  };
  const textPrimary: React.CSSProperties = { color: isDark ? '#ffffff' : '#111827' };
  const textSecondary: React.CSSProperties = { color: isDark ? '#9ca3af' : '#6b7280' };
  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '10px',
    border: `1.5px solid ${isDark ? '#444' : '#e5e7eb'}`,
    backgroundColor: isDark ? '#16213e' : '#f9fafb',
    color: isDark ? '#fff' : '#111',
    fontSize: '14px',
    outline: 'none',
  };

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: isDark ? '#0f0f1a' : '#f3f4f6' }}>
      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">

        {/* Profile Card */}
        <div className="rounded-2xl border p-5" style={cardStyle}>
          {/* Photo */}
          <div className="flex flex-col items-center mb-5">
            <div className="relative">
              <div
                className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center"
                style={{
                  background: (isEditing ? editData.photo : profile.photo) ? 'transparent' : 'linear-gradient(135deg, var(--accent-primary), oklch(0.55 0.22 25))',
                  border: '3px solid var(--accent-primary)',
                }}
              >
                {(isEditing ? editData.photo : profile.photo) ? (
                  <img
                    src={(isEditing ? editData.photo : profile.photo) as string}
                    alt="Shop"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Store size={36} color="#fff" />
                )}
              </div>
              {isEditing && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'var(--accent-primary)' }}
                >
                  <Camera size={14} color="#fff" />
                </button>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
            {!isEditing && (
              <div className="mt-3 text-center">
                <h2 className="text-xl font-bold" style={textPrimary}>
                  {profile.shopName || (isBn ? 'দোকানের নাম' : 'Shop Name')}
                </h2>
                <p className="text-sm" style={textSecondary}>
                  {profile.ownerName || (isBn ? 'মালিকের নাম' : 'Owner Name')}
                </p>
              </div>
            )}
          </div>

          {/* Edit / View */}
          {isEditing ? (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1" style={textSecondary}>
                  {t('shopName') || 'Shop Name'}
                </label>
                <input
                  type="text"
                  value={editData.shopName}
                  onChange={(e) => setEditData({ ...editData, shopName: e.target.value })}
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={textSecondary}>
                  {t('ownerName') || 'Owner Name'}
                </label>
                <input
                  type="text"
                  value={editData.ownerName}
                  onChange={(e) => setEditData({ ...editData, ownerName: e.target.value })}
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={textSecondary}>
                  {t('phone') || 'Phone'}
                </label>
                <input
                  type="tel"
                  value={editData.phone}
                  onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={textSecondary}>
                  {t('address') || 'Address'}
                </label>
                <input
                  type="text"
                  value={editData.address}
                  onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={textSecondary}>
                  {t('category') || 'Category'}
                </label>
                <select
                  value={editData.category}
                  onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                >
                  <option value="">{isBn ? '-- ধরন বেছে নিন --' : '-- Select category --'}</option>
                  {SHOP_CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {isBn ? cat.labelBn : cat.labelEn}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSave}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-white text-sm"
                  style={{ backgroundColor: 'var(--accent-primary)' }}
                >
                  <Save size={16} /> {t('saveChanges') || 'Save Changes'}
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm border"
                  style={{ borderColor: isDark ? '#444' : '#e5e7eb', color: isDark ? '#ccc' : '#555' }}
                >
                  <X size={16} /> {t('cancel') || 'Cancel'}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {[
                { icon: <Store size={16} />, label: t('shopName') || 'Shop Name', value: profile.shopName },
                { icon: <User size={16} />, label: t('ownerName') || 'Owner Name', value: profile.ownerName },
                { icon: <Phone size={16} />, label: t('phone') || 'Phone', value: profile.phone },
                { icon: <MapPin size={16} />, label: t('address') || 'Address', value: profile.address },
                { icon: <Tag size={16} />, label: t('category') || 'Category', value: getCategoryLabel(profile.category) },
              ].map((field, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 py-2 border-b last:border-b-0"
                  style={{ borderColor: isDark ? '#333' : '#f0f0f0' }}
                >
                  <span style={{ color: 'var(--accent-primary)', marginTop: 2 }}>{field.icon}</span>
                  <div>
                    <p className="text-xs" style={textSecondary}>{field.label}</p>
                    <p className="text-sm font-semibold" style={textPrimary}>
                      {field.value || (isBn ? 'দেওয়া হয়নি' : 'Not provided')}
                    </p>
                  </div>
                </div>
              ))}
              <button
                onClick={() => { playSound(); setIsEditing(true); setEditData(profile); }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-white text-sm mt-2"
                style={{ backgroundColor: 'var(--accent-primary)' }}
              >
                <Edit2 size={16} /> {t('edit') || 'Edit Profile'}
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Profile;
