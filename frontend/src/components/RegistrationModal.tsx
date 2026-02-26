import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface RegistrationModalProps {
  onComplete: (data: {
    shopName: string;
    ownerName: string;
    phone: string;
    address: string;
    category: string;
  }) => void;
  onSkip: () => void;
}

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

const RegistrationModal: React.FC<RegistrationModalProps> = ({ onComplete, onSkip }) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [shopName, setShopName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [category, setCategory] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!shopName.trim()) newErrors.shopName = isBn ? 'দোকানের নাম দিন' : 'Shop name is required';
    if (!ownerName.trim()) newErrors.ownerName = isBn ? 'মালিকের নাম দিন' : 'Owner name is required';
    if (!phone.trim()) newErrors.phone = isBn ? 'ফোন নম্বর দিন' : 'Phone number is required';
    if (!agreed) newErrors.agreed = isBn ? 'শর্তাবলী মেনে নিন' : 'Please agree to terms';
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    // Save profile to localStorage
    const profileData = { shopName, ownerName, phone, address, category };
    try {
      localStorage.setItem('shopProfile', JSON.stringify(profileData));
    } catch {}
    // Mark registration as permanently complete
    try {
      localStorage.setItem('registrationComplete', 'true');
    } catch {}
    onComplete(profileData);
  };

  const handleSkip = () => {
    // Mark registration as permanently complete even when skipped
    try {
      localStorage.setItem('registrationComplete', 'true');
    } catch {}
    onSkip();
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '10px',
    border: '1.5px solid rgba(255,255,255,0.2)',
    backgroundColor: 'rgba(255,255,255,0.08)',
    color: '#ffffff',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '13px',
    fontWeight: 600,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: '6px',
  };

  const errorStyle: React.CSSProperties = {
    color: '#fca5a5',
    fontSize: '12px',
    marginTop: '4px',
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/assets/generated/registration-galaxy-bg.dim_1080x1920.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,20,60,0.85) 100%)',
        }}
      />

      {/* Modal Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: '420px',
          maxHeight: '90vh',
          overflowY: 'auto',
          margin: '0 16px',
          borderRadius: '20px',
          background: 'rgba(255,255,255,0.07)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.15)',
          padding: '28px 24px',
        }}
      >
        {/* Logo & Title */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <img
            src="/assets/generated/app-logo.dim_256x256.png"
            alt="Logo"
            style={{ width: '72px', height: '72px', borderRadius: '18px', margin: '0 auto 12px', display: 'block' }}
          />
          <h1 style={{ color: '#ffffff', fontWeight: 900, fontSize: '22px', margin: '0 0 4px' }}>
            {isBn ? 'স্মার্ট শপ লেজার' : 'Smart Shop Ledger'}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '13px', margin: 0 }}>
            {isBn ? 'আপনার দোকানের তথ্য দিন' : 'Set up your shop profile'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Shop Name */}
          <div>
            <label style={labelStyle}>{isBn ? 'দোকানের নাম *' : 'Shop Name *'}</label>
            <input
              type="text"
              value={shopName}
              onChange={e => setShopName(e.target.value)}
              placeholder={isBn ? 'আপনার দোকানের নাম' : 'Your shop name'}
              style={{
                ...inputStyle,
                borderColor: errors.shopName ? '#fca5a5' : 'rgba(255,255,255,0.2)',
              }}
            />
            {errors.shopName && <p style={errorStyle}>{errors.shopName}</p>}
          </div>

          {/* Owner Name */}
          <div>
            <label style={labelStyle}>{isBn ? 'মালিকের নাম *' : 'Owner Name *'}</label>
            <input
              type="text"
              value={ownerName}
              onChange={e => setOwnerName(e.target.value)}
              placeholder={isBn ? 'আপনার নাম' : 'Your name'}
              style={{
                ...inputStyle,
                borderColor: errors.ownerName ? '#fca5a5' : 'rgba(255,255,255,0.2)',
              }}
            />
            {errors.ownerName && <p style={errorStyle}>{errors.ownerName}</p>}
          </div>

          {/* Phone */}
          <div>
            <label style={labelStyle}>{isBn ? 'ফোন নম্বর *' : 'Phone Number *'}</label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder={isBn ? '০১XXXXXXXXX' : '01XXXXXXXXX'}
              style={{
                ...inputStyle,
                borderColor: errors.phone ? '#fca5a5' : 'rgba(255,255,255,0.2)',
              }}
            />
            {errors.phone && <p style={errorStyle}>{errors.phone}</p>}
          </div>

          {/* Address */}
          <div>
            <label style={labelStyle}>{isBn ? 'ঠিকানা (ঐচ্ছিক)' : 'Address (optional)'}</label>
            <input
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder={isBn ? 'দোকানের ঠিকানা' : 'Shop address'}
              style={inputStyle}
            />
          </div>

          {/* Category */}
          <div>
            <label style={labelStyle}>{isBn ? 'দোকানের ধরন' : 'Shop Category'}</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              style={{
                ...inputStyle,
                cursor: 'pointer',
                appearance: 'none',
              }}
            >
              <option value="" style={{ backgroundColor: '#1a1a2e' }}>
                {isBn ? 'ধরন বেছে নিন' : 'Select category'}
              </option>
              {SHOP_CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value} style={{ backgroundColor: '#1a1a2e' }}>
                  {isBn ? cat.labelBn : cat.labelEn}
                </option>
              ))}
            </select>
          </div>

          {/* Terms */}
          <div>
            <label
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                style={{ marginTop: '2px', width: '16px', height: '16px', flexShrink: 0, cursor: 'pointer' }}
              />
              <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '12px', lineHeight: '1.5' }}>
                {isBn
                  ? 'আমি শর্তাবলী ও গোপনীয়তা নীতি মেনে নিচ্ছি।'
                  : 'I agree to the Terms of Service and Privacy Policy.'}
              </span>
            </label>
            {errors.agreed && <p style={errorStyle}>{errors.agreed}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #006a4e, #f42a41)',
              color: '#ffffff',
              fontWeight: 900,
              fontSize: '15px',
              cursor: 'pointer',
              letterSpacing: '0.03em',
              marginTop: '4px',
            }}
          >
            {isBn ? 'শুরু করুন' : 'Get Started'}
          </button>

          {/* Skip */}
          <button
            type="button"
            onClick={handleSkip}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.2)',
              background: 'transparent',
              color: 'rgba(255,255,255,0.6)',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            {isBn ? 'এখন না, পরে করব' : 'Skip for now'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationModal;
