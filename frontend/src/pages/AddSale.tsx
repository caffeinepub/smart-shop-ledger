import React, { useState, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { usePremiumStatus } from '../hooks/usePremiumStatus';
import { Camera, Image, X, ChevronDown } from 'lucide-react';
import CameraModal from '../components/CameraModal';

interface SaleForm {
  productName: string;
  quantity: string;
  unit: string;
  sellingPrice: string;
  buyingPrice: string;
  note: string;
  colorTag: string;
  image?: string;
}

const UNITS = ['Piece', 'KG', 'Gram', 'Liter', 'Dozen'];
const COLOR_OPTIONS = [
  { key: 'red', label: 'লাল', labelEn: 'Red', bg: 'bg-red-500', border: 'border-red-500', text: 'text-red-400' },
  { key: 'yellow', label: 'হলুদ', labelEn: 'Yellow', bg: 'bg-yellow-500', border: 'border-yellow-500', text: 'text-yellow-400' },
  { key: 'green', label: 'সবুজ', labelEn: 'Green', bg: 'bg-green-500', border: 'border-green-500', text: 'text-green-400' },
  { key: 'blue', label: 'নীল', labelEn: 'Blue', bg: 'bg-blue-500', border: 'border-blue-500', text: 'text-blue-400' },
];

function getSales(): Record<string, unknown>[] {
  try {
    const data = localStorage.getItem('sales');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveSale(sale: Record<string, unknown>) {
  const sales = getSales();
  sales.unshift(sale);
  localStorage.setItem('sales', JSON.stringify(sales));
}

function getSaleCount(): number {
  return getSales().length;
}

const AddSale: React.FC = () => {
  const { t, language } = useLanguage();
  const { isActive: isPremium } = usePremiumStatus();
  const [form, setForm] = useState<SaleForm>({
    productName: '',
    quantity: '1',
    unit: 'Piece',
    sellingPrice: '',
    buyingPrice: '',
    note: '',
    colorTag: '',
  });
  const [showUnitDropdown, setShowUnitDropdown] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const saleCount = getSaleCount();
  const FREE_LIMIT = 199;

  const handleChange = (field: keyof SaleForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleImageCapture = (file: File) => {
    const reader = new FileReader();
    reader.onload = e => {
      setForm(prev => ({ ...prev, image: e.target?.result as string }));
    };
    reader.readAsDataURL(file);
    setShowCamera(false);
  };

  const handleGallerySelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      setForm(prev => ({ ...prev, image: ev.target?.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!form.sellingPrice) {
      setError(language === 'bn' ? 'বিক্রয় মূল্য আবশ্যক' : 'Selling price is required');
      return;
    }
    if (!isPremium && saleCount >= FREE_LIMIT) {
      setError(language === 'bn' ? 'বিনামূল্যে সীমা পূর্ণ হয়েছে' : 'Free limit reached');
      return;
    }
    const sale = {
      id: Date.now().toString(),
      productName: form.productName || (language === 'bn' ? 'পণ্য' : 'Product'),
      quantity: parseFloat(form.quantity) || 1,
      unit: form.unit,
      sellingPrice: parseFloat(form.sellingPrice) || 0,
      buyingPrice: parseFloat(form.buyingPrice) || 0,
      note: form.note,
      colorTag: form.colorTag,
      image: form.image,
      date: new Date().toISOString(),
    };
    saveSale(sale as Record<string, unknown>);
    setSubmitted(true);
    setError('');
    setTimeout(() => {
      setSubmitted(false);
      setForm({ productName: '', quantity: '1', unit: 'Piece', sellingPrice: '', buyingPrice: '', note: '', colorTag: '' });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-950 pb-8">
      <div className="px-4 pt-4">
        <h1 className="text-xl font-bold text-white mb-4">
          {language === 'bn' ? 'বিক্রয় যোগ করুন' : 'Add Sale'}
        </h1>

        {/* Sale count */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-2 mb-4 flex justify-between items-center">
          <span className="text-gray-400 text-sm">{language === 'bn' ? 'বিক্রয় সংখ্যা' : 'Sales Count'}</span>
          <span className={`font-bold text-sm ${isPremium ? 'text-green-400' : 'text-yellow-400'}`}>
            {isPremium ? `${saleCount} / ∞` : `${saleCount} / ${FREE_LIMIT}`}
          </span>
        </div>

        {/* Product Name */}
        <div className="mb-4">
          <label className="text-gray-400 text-sm mb-1.5 block">
            {language === 'bn' ? 'পণ্যের নাম' : 'Product Name'}
          </label>
          <input
            type="text"
            value={form.productName}
            onChange={e => handleChange('productName', e.target.value)}
            placeholder={language === 'bn' ? 'পণ্যের নাম লিখুন' : 'Enter product name'}
            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-600"
          />
        </div>

        {/* Quantity + Unit */}
        <div className="flex gap-3 mb-4">
          <div className="flex-1">
            <label className="text-gray-400 text-sm mb-1.5 block">
              {language === 'bn' ? 'পরিমাণ' : 'Quantity'}
            </label>
            <input
              type="number"
              value={form.quantity}
              onChange={e => handleChange('quantity', e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-600"
            />
          </div>
          <div className="w-32">
            <label className="text-gray-400 text-sm mb-1.5 block">
              {language === 'bn' ? 'একক' : 'Unit'}
            </label>
            <div className="relative">
              <button
                onClick={() => setShowUnitDropdown(!showUnitDropdown)}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-3 text-white flex items-center justify-between"
              >
                <span className="text-sm">{form.unit}</span>
                <ChevronDown size={14} className="text-gray-400" />
              </button>
              {showUnitDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-xl overflow-hidden z-10 shadow-xl">
                  {UNITS.map(u => (
                    <button
                      key={u}
                      onClick={() => { handleChange('unit', u); setShowUnitDropdown(false); }}
                      className="w-full px-4 py-2.5 text-left text-white text-sm hover:bg-gray-700"
                    >
                      {u}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Selling Price */}
        <div className="mb-4">
          <label className="text-gray-400 text-sm mb-1.5 block">
            {language === 'bn' ? 'বিক্রয় মূল্য' : 'Selling Price'}{' '}
            <span className="text-red-400">*</span>
          </label>
          <input
            type="number"
            value={form.sellingPrice}
            onChange={e => handleChange('sellingPrice', e.target.value)}
            placeholder="৳ 0"
            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-600"
          />
        </div>

        {/* Buying Price */}
        <div className="mb-4">
          <label className="text-gray-400 text-sm mb-1.5 block">
            {language === 'bn' ? 'ক্রয় মূল্য' : 'Buying Price'}
          </label>
          <input
            type="number"
            value={form.buyingPrice}
            onChange={e => handleChange('buyingPrice', e.target.value)}
            placeholder="৳ 0"
            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-600"
          />
        </div>

        {/* Color Tag */}
        <div className="mb-4">
          <label className="text-gray-400 text-sm mb-2 block">
            {language === 'bn' ? 'রঙ বিভাজন' : 'Color Tag'}
          </label>
          <div className="flex gap-2 flex-wrap">
            {COLOR_OPTIONS.map(c => (
              <button
                key={c.key}
                onClick={() => handleChange('colorTag', form.colorTag === c.key ? '' : c.key)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border transition-all ${
                  form.colorTag === c.key
                    ? `${c.border} bg-gray-800 ${c.text}`
                    : 'border-gray-700 text-gray-500 hover:border-gray-500'
                }`}
              >
                <div className={`w-3 h-3 rounded-full ${c.bg}`} />
                <span className="text-xs font-medium">
                  {language === 'bn' ? c.label : c.labelEn}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Note */}
        <div className="mb-4">
          <label className="text-gray-400 text-sm mb-1.5 block">
            {language === 'bn' ? 'নোট' : 'Note'}
          </label>
          <textarea
            value={form.note}
            onChange={e => handleChange('note', e.target.value)}
            placeholder={language === 'bn' ? 'ঐচ্ছিক নোট...' : 'Optional note...'}
            rows={2}
            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-600 resize-none"
          />
        </div>

        {/* Product Image */}
        <div className="mb-4">
          <label className="text-gray-400 text-sm mb-2 block">
            {language === 'bn' ? 'পণ্যের ছবি' : 'Product Image'}
          </label>
          {form.image ? (
            <div className="relative w-full h-40 rounded-xl overflow-hidden border border-gray-700">
              <img src={form.image} alt="Product" className="w-full h-full object-cover" />
              <button
                onClick={() => handleChange('image', '')}
                className="absolute top-2 right-2 bg-black/60 rounded-full p-1 text-white"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              {isPremium && (
                <button
                  onClick={() => setShowCamera(true)}
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-900 border border-gray-700 rounded-xl py-3 text-gray-400 hover:border-green-600 hover:text-green-400 transition-colors"
                >
                  <Camera size={18} />
                  <span className="text-sm">{language === 'bn' ? 'ক্যামেরা' : 'Camera'}</span>
                </button>
              )}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-900 border border-gray-700 rounded-xl py-3 text-gray-400 hover:border-green-600 hover:text-green-400 transition-colors"
              >
                <Image size={18} />
                <span className="text-sm">{language === 'bn' ? 'গ্যালারি' : 'Gallery'}</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleGallerySelect}
              />
            </div>
          )}
          {!isPremium && !form.image && (
            <div className="mt-2 bg-gray-900 border border-gray-800 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-500">
                {language === 'bn' ? 'বিজ্ঞাপন' : 'Advertisement'}
              </p>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 bg-red-900/30 border border-red-700/50 rounded-xl px-4 py-3">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={submitted}
          className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
            submitted
              ? 'bg-green-600 text-white scale-95'
              : 'bg-green-600 hover:bg-green-500 text-white active:scale-95'
          }`}
        >
          {submitted
            ? '✅ ' + (language === 'bn' ? 'বিক্রয় যোগ হয়েছে!' : 'Sale Added!')
            : (language === 'bn' ? 'বিক্রয় যোগ করুন' : 'Add Sale')}
        </button>
      </div>

      {showCamera && (
        <CameraModal
          isOpen={showCamera}
          onCapture={handleImageCapture}
          onClose={() => setShowCamera(false)}
        />
      )}
    </div>
  );
};

export default AddSale;
