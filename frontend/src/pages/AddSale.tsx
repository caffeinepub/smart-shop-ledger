import React, { useState, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { Camera, X, ChevronLeft, AlertCircle } from 'lucide-react';
import CameraModal from '../components/CameraModal';
import PremiumModal from '../components/PremiumModal';
import { usePremiumStatus } from '../hooks/usePremiumStatus';

interface Sale {
  id: string;
  productName: string;
  quantity: number;
  unit: string;
  sellingPrice: number;
  buyingPrice: number;
  colorTag: string;
  note: string;
  imageData?: string;
  date: string;
  profit: number;
}

interface AddSaleProps {
  onBack: () => void;
  onSaleAdded: () => void;
}

const COLOR_TAGS = [
  { value: 'red', label: 'লাল', color: '#ef4444' },
  { value: 'green', label: 'সবুজ', color: '#22c55e' },
  { value: 'blue', label: 'নীল', color: '#3b82f6' },
  { value: 'yellow', label: 'হলুদ', color: '#eab308' },
];

const FREE_ITEM_LIMIT = 199;

export default function AddSale({ onBack, onSaleAdded }: AddSaleProps) {
  const { t, language } = useLanguage();
  const { isDark } = useTheme();
  const { isActive: isPremium } = usePremiumStatus();
  const isBn = language === 'bn';

  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [unit, setUnit] = useState(isBn ? 'পিস' : 'pcs');
  const [sellingPrice, setSellingPrice] = useState('');
  const [buyingPrice, setBuyingPrice] = useState('');
  const [colorTag, setColorTag] = useState('');
  const [note, setNote] = useState('');
  const [imageData, setImageData] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [premiumModalReason, setPremiumModalReason] = useState<'color' | 'limit' | null>(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const getSalesCount = () => {
    try {
      const sales = JSON.parse(localStorage.getItem('sales') || '[]');
      return Array.isArray(sales) ? sales.length : 0;
    } catch {
      return 0;
    }
  };

  const salesCount = getSalesCount();
  const nearLimit = !isPremium && salesCount >= 190 && salesCount < FREE_ITEM_LIMIT;
  const atLimit = !isPremium && salesCount >= FREE_ITEM_LIMIT;

  const handleColorTagClick = (value: string) => {
    if (!isPremium) {
      setPremiumModalReason('color');
      setShowPremiumModal(true);
      return;
    }
    setColorTag(prev => prev === value ? '' : value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!productName.trim()) {
      setError(isBn ? 'পণ্যের নাম দিন' : 'Enter product name');
      return;
    }
    if (!sellingPrice) {
      setError(isBn ? 'বিক্রয় মূল্য দিন' : 'Enter selling price');
      return;
    }

    if (atLimit) {
      setPremiumModalReason('limit');
      setShowPremiumModal(true);
      return;
    }

    setSaving(true);
    try {
      const sales: Sale[] = JSON.parse(localStorage.getItem('sales') || '[]');
      const sp = parseFloat(sellingPrice) || 0;
      const bp = parseFloat(buyingPrice) || 0;
      const qty = parseFloat(quantity) || 1;
      const profit = (sp - bp) * qty;

      const newSale: Sale = {
        id: Date.now().toString(),
        productName: productName.trim(),
        quantity: qty,
        unit,
        sellingPrice: sp,
        buyingPrice: bp,
        colorTag,
        note: note.trim(),
        imageData: imageData || undefined,
        date: new Date().toISOString(),
        profit,
      };

      sales.unshift(newSale);
      localStorage.setItem('sales', JSON.stringify(sales));
      onSaleAdded();
      onBack();
    } catch (err) {
      setError(isBn ? 'সংরক্ষণে সমস্যা হয়েছে' : 'Error saving sale');
    } finally {
      setSaving(false);
    }
  };

  const handlePremiumActivate = () => {
    setShowPremiumModal(false);
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`sticky top-0 z-10 px-4 py-3 flex items-center gap-3 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b shadow-sm`}>
        <button onClick={onBack} className={`p-2 rounded-full ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
          <ChevronLeft size={22} className={isDark ? 'text-white' : 'text-gray-800'} />
        </button>
        <h1 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {isBn ? 'নতুন বিক্রয় যোগ করুন' : 'Add New Sale'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="px-4 py-4 space-y-4 pb-24">
        {/* Free limit warning */}
        {nearLimit && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200">
            <AlertCircle size={16} className="text-amber-500 flex-shrink-0" />
            <p className="text-amber-700 text-sm">
              {isBn
                ? `সতর্কতা: আপনি ${FREE_ITEM_LIMIT - salesCount}টি বিক্রয় আর যোগ করতে পারবেন (ফ্রি সীমা: ১৯৯)`
                : `Warning: You can add ${FREE_ITEM_LIMIT - salesCount} more sales (free limit: 199)`}
            </p>
          </div>
        )}

        {atLimit && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200">
            <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
            <p className="text-red-700 text-sm">
              {isBn ? 'ফ্রি সীমা শেষ! প্রিমিয়াম নিন আনলিমিটেড বিক্রয় যোগ করতে।' : 'Free limit reached! Get Premium for unlimited sales.'}
            </p>
          </div>
        )}

        {/* Product Name */}
        <div>
          <label className={`block text-sm font-semibold mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            {isBn ? 'পণ্যের নাম *' : 'Product Name *'}
          </label>
          <input
            type="text"
            value={productName}
            onChange={e => setProductName(e.target.value)}
            placeholder={isBn ? 'পণ্যের নাম লিখুন' : 'Enter product name'}
            className={`w-full px-4 py-3 rounded-xl border outline-none transition-colors ${
              isDark ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
            } focus:border-amber-500`}
          />
        </div>

        {/* Quantity & Unit */}
        <div className="flex gap-3">
          <div className="flex-1">
            <label className={`block text-sm font-semibold mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {isBn ? 'পরিমাণ' : 'Quantity'}
            </label>
            <input
              type="number"
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
              min="0.01"
              step="0.01"
              className={`w-full px-4 py-3 rounded-xl border outline-none transition-colors ${
                isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
              } focus:border-amber-500`}
            />
          </div>
          <div className="flex-1">
            <label className={`block text-sm font-semibold mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {isBn ? 'একক' : 'Unit'}
            </label>
            <input
              type="text"
              value={unit}
              onChange={e => setUnit(e.target.value)}
              placeholder={isBn ? 'পিস/কেজি' : 'pcs/kg'}
              className={`w-full px-4 py-3 rounded-xl border outline-none transition-colors ${
                isDark ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
              } focus:border-amber-500`}
            />
          </div>
        </div>

        {/* Selling Price */}
        <div>
          <label className={`block text-sm font-semibold mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            {isBn ? 'বিক্রয় মূল্য (৳) *' : 'Selling Price (৳) *'}
          </label>
          <input
            type="number"
            value={sellingPrice}
            onChange={e => setSellingPrice(e.target.value)}
            min="0"
            step="0.01"
            placeholder="0.00"
            className={`w-full px-4 py-3 rounded-xl border outline-none transition-colors ${
              isDark ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
            } focus:border-amber-500`}
          />
        </div>

        {/* Buying Price */}
        <div>
          <label className={`block text-sm font-semibold mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            {isBn ? 'ক্রয় মূল্য (৳)' : 'Buying Price (৳)'}
          </label>
          <input
            type="number"
            value={buyingPrice}
            onChange={e => setBuyingPrice(e.target.value)}
            min="0"
            step="0.01"
            placeholder="0.00"
            className={`w-full px-4 py-3 rounded-xl border outline-none transition-colors ${
              isDark ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
            } focus:border-amber-500`}
          />
        </div>

        {/* Color Tag - Premium locked for free users */}
        <div>
          <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            {isBn ? 'রঙ ট্যাগ' : 'Color Tag'}
            {!isPremium && (
              <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                👑 {isBn ? 'প্রিমিয়াম' : 'Premium'}
              </span>
            )}
          </label>
          <div className="flex gap-3">
            {COLOR_TAGS.map(tag => (
              <button
                key={tag.value}
                type="button"
                onClick={() => handleColorTagClick(tag.value)}
                className={`relative flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all ${
                  colorTag === tag.value
                    ? 'border-amber-500 scale-110'
                    : isDark ? 'border-gray-600' : 'border-gray-200'
                } ${!isPremium ? 'opacity-60' : ''}`}
              >
                <div
                  className="w-8 h-8 rounded-full shadow-sm"
                  style={{ backgroundColor: tag.color }}
                />
                <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{tag.label}</span>
                {!isPremium && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/10">
                    <span className="text-xs">🔒</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Note */}
        <div>
          <label className={`block text-sm font-semibold mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            {isBn ? 'নোট' : 'Note'}
          </label>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder={isBn ? 'অতিরিক্ত তথ্য লিখুন...' : 'Additional notes...'}
            rows={3}
            className={`w-full px-4 py-3 rounded-xl border outline-none transition-colors resize-none ${
              isDark ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
            } focus:border-amber-500`}
          />
        </div>

        {/* Image */}
        <div>
          <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            {isBn ? 'ছবি (ঐচ্ছিক)' : 'Image (Optional)'}
          </label>
          {imageData ? (
            <div className="relative inline-block">
              <img src={imageData} alt="product" className="w-24 h-24 rounded-xl object-cover" />
              <button
                type="button"
                onClick={() => setImageData(null)}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center"
              >
                <X size={12} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowCamera(true)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed transition-colors ${
                isDark ? 'border-gray-600 text-gray-400 hover:border-amber-500' : 'border-gray-300 text-gray-500 hover:border-amber-500'
              }`}
            >
              <Camera size={18} />
              <span className="text-sm">{isBn ? 'ছবি তুলুন' : 'Take Photo'}</span>
            </button>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200">
            <AlertCircle size={16} className="text-red-500" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={saving || atLimit}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold text-lg shadow-lg disabled:opacity-50 active:scale-95 transition-transform"
        >
          {saving ? (isBn ? 'সংরক্ষণ হচ্ছে...' : 'Saving...') : (isBn ? 'বিক্রয় সংরক্ষণ করুন' : 'Save Sale')}
        </button>
      </form>

      {/* Camera Modal */}
      <CameraModal
        isOpen={showCamera}
        onClose={() => setShowCamera(false)}
        onCapture={(file) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            setImageData(e.target?.result as string);
            setShowCamera(false);
          };
          reader.readAsDataURL(file);
        }}
      />

      {/* Premium Modal */}
      <PremiumModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        onActivate={handlePremiumActivate}
      />
    </div>
  );
}
