import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { usePremiumStatus } from '../hooks/usePremiumStatus';
import { useNotificationContext } from '../contexts/NotificationContext';
import PremiumModal from '../components/PremiumModal';
import { Plus, Edit2, Trash2, Package } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  retailPrice: string;
  wholesalePrice: string;
  stock: string;
  note: string;
  createdAt: number;
}

const FREE_LIMIT = 10;

const ProductList: React.FC = () => {
  const { mode } = useTheme();
  const { t, language } = useLanguage();
  const { isActive: isPremium, checkAndEnforceExpiry } = usePremiumStatus();
  const { showNotification } = useNotificationContext();
  const isDark = mode === 'dark';
  const isBn = language === 'bn';

  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [formName, setFormName] = useState('');
  const [formRetail, setFormRetail] = useState('');
  const [formWholesale, setFormWholesale] = useState('');
  const [formStock, setFormStock] = useState('');
  const [formNote, setFormNote] = useState('');

  useEffect(() => {
    checkAndEnforceExpiry();
    const saved = localStorage.getItem('productList');
    if (saved) { try { setProducts(JSON.parse(saved)); } catch { setProducts([]); } }
  }, [checkAndEnforceExpiry]);

  const saveProducts = (updated: Product[]) => {
    setProducts(updated);
    localStorage.setItem('productList', JSON.stringify(updated));
  };

  const resetForm = () => {
    setFormName(''); setFormRetail(''); setFormWholesale('');
    setFormStock(''); setFormNote(''); setEditingId(null);
  };

  const handleAddClick = () => {
    if (!isPremium && products.length >= FREE_LIMIT) {
      setShowPremiumModal(true);
      return;
    }
    resetForm();
    setShowForm(true);
  };

  const handleEditClick = (product: Product) => {
    if (!isPremium) {
      setShowPremiumModal(true);
      return;
    }
    setFormName(product.name);
    setFormRetail(product.retailPrice);
    setFormWholesale(product.wholesalePrice);
    setFormStock(product.stock);
    setFormNote(product.note);
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!formName.trim()) return;
    if (editingId) {
      const updated = products.map(p =>
        p.id === editingId
          ? { ...p, name: formName.trim(), retailPrice: formRetail, wholesalePrice: formWholesale, stock: formStock, note: formNote }
          : p
      );
      saveProducts(updated);
      showNotification(isBn ? '✅ পণ্য আপডেট হয়েছে!' : '✅ Product updated!');
    } else {
      const newProduct: Product = {
        id: Date.now().toString(),
        name: formName.trim(),
        retailPrice: formRetail,
        wholesalePrice: formWholesale,
        stock: formStock,
        note: formNote,
        createdAt: Date.now(),
      };
      saveProducts([newProduct, ...products]);
      showNotification(isBn ? '📦 নতুন পণ্য যোগ হয়েছে!' : '📦 New product added!');
    }
    resetForm();
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    saveProducts(products.filter(p => p.id !== id));
    setDeleteConfirmId(null);
  };

  const cardBg = isDark ? 'rgba(255,255,255,0.05)' : '#ffffff';
  const cardBorder = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.07)';
  const textPrimary = isDark ? '#ffffff' : '#1a1a1a';
  const textSecondary = isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.45)';
  const inputBg = isDark ? 'rgba(255,255,255,0.08)' : '#f8f9fa';

  return (
    <div className="min-h-screen pb-24" style={{ background: isDark ? '#0f172a' : '#f1f5f9' }}>
      <div className="px-4 pt-4 max-w-lg mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-xl font-bold" style={{ color: textPrimary }}>{t('productList')}</h1>
            {!isPremium && (
              <p className="text-xs mt-0.5" style={{ color: textSecondary }}>
                {products.length}/{FREE_LIMIT} {isBn ? 'পণ্য (ফ্রি সীমা)' : 'products (free limit)'}
              </p>
            )}
          </div>
          <button
            onClick={handleAddClick}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95"
            style={{ background: '#22c55e', color: '#fff' }}
          >
            <Plus size={16} />
            {t('addProduct')}
          </button>
        </div>

        {/* Free limit warning */}
        {!isPremium && products.length >= FREE_LIMIT && (
          <div
            className="rounded-xl p-3 mb-4 flex items-center gap-2"
            style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.3)' }}
          >
            <span>⚠️</span>
            <p className="text-xs" style={{ color: '#f97316' }}>
              {t('freeLimit')}
            </p>
          </div>
        )}

        {/* Add/Edit Form */}
        {showForm && (
          <div
            className="rounded-2xl p-4 mb-4"
            style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
          >
            <h3 className="text-sm font-bold mb-3" style={{ color: textPrimary }}>
              {editingId ? t('editProduct') : t('addProduct')}
            </h3>
            <div className="space-y-2">
              <input
                type="text"
                value={formName}
                onChange={e => setFormName(e.target.value)}
                placeholder={`${t('productName')} *`}
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                style={{ background: inputBg, border: `1px solid ${cardBorder}`, color: textPrimary }}
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  value={formRetail}
                  onChange={e => setFormRetail(e.target.value)}
                  placeholder={`${t('retailPrice')} ৳`}
                  className="px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: inputBg, border: `1px solid ${cardBorder}`, color: textPrimary }}
                />
                <input
                  type="number"
                  value={formWholesale}
                  onChange={e => setFormWholesale(e.target.value)}
                  placeholder={`${t('wholesalePrice')} ৳`}
                  className="px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: inputBg, border: `1px solid ${cardBorder}`, color: textPrimary }}
                />
              </div>
              <input
                type="number"
                value={formStock}
                onChange={e => setFormStock(e.target.value)}
                placeholder={isBn ? 'স্টক পরিমাণ' : 'Stock quantity'}
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                style={{ background: inputBg, border: `1px solid ${cardBorder}`, color: textPrimary }}
              />
              <input
                type="text"
                value={formNote}
                onChange={e => setFormNote(e.target.value)}
                placeholder={isBn ? 'নোট (ঐচ্ছিক)' : 'Note (optional)'}
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                style={{ background: inputBg, border: `1px solid ${cardBorder}`, color: textPrimary }}
              />
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleSave}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: '#22c55e', color: '#fff' }}
              >
                {t('save')}
              </button>
              <button
                onClick={() => { setShowForm(false); resetForm(); }}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: isDark ? 'rgba(255,255,255,0.1)' : '#f1f5f9', color: textPrimary }}
              >
                {t('cancel')}
              </button>
            </div>
          </div>
        )}

        {/* Product list */}
        {products.length === 0 ? (
          <div
            className="rounded-2xl p-10 flex flex-col items-center gap-3"
            style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
          >
            <Package size={40} color={textSecondary} />
            <p className="text-sm" style={{ color: textSecondary }}>{t('noProducts')}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {products.map(product => (
              <div
                key={product.id}
                className="rounded-xl px-4 py-3"
                style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: textPrimary }}>{product.name}</p>
                    <div className="flex gap-3 mt-1 flex-wrap">
                      {product.retailPrice && (
                        <span className="text-xs" style={{ color: '#22c55e' }}>
                          {isBn ? 'খুচরা:' : 'Retail:'} ৳{product.retailPrice}
                        </span>
                      )}
                      {product.wholesalePrice && (
                        <span className="text-xs" style={{ color: textSecondary }}>
                          {isBn ? 'পাইকারি:' : 'Wholesale:'} ৳{product.wholesalePrice}
                        </span>
                      )}
                      {product.stock && (
                        <span className="text-xs" style={{ color: textSecondary }}>
                          {isBn ? 'স্টক:' : 'Stock:'} {product.stock}
                        </span>
                      )}
                    </div>
                    {product.note && (
                      <p className="text-xs mt-0.5 truncate" style={{ color: textSecondary }}>{product.note}</p>
                    )}
                  </div>
                  <div className="flex gap-2 ml-2">
                    <button
                      onClick={() => handleEditClick(product)}
                      className="p-1.5 rounded-lg"
                      style={{ background: 'rgba(59,130,246,0.1)' }}
                    >
                      <Edit2 size={14} color="#3b82f6" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(product.id)}
                      className="p-1.5 rounded-lg"
                      style={{ background: 'rgba(239,68,68,0.1)' }}
                    >
                      <Trash2 size={14} color="#ef4444" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirm */}
      {deleteConfirmId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: 'rgba(0,0,0,0.6)' }}
        >
          <div
            className="rounded-2xl p-6 w-full max-w-sm"
            style={{ background: isDark ? '#1e293b' : '#ffffff' }}
          >
            <h3 className="text-base font-bold mb-2" style={{ color: textPrimary }}>{t('deleteProduct')}</h3>
            <p className="text-sm mb-5" style={{ color: textSecondary }}>
              {isBn ? 'এই পণ্যটি মুছে ফেলবেন?' : 'Delete this product?'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: isDark ? 'rgba(255,255,255,0.1)' : '#f1f5f9', color: textPrimary }}
              >
                {t('cancel')}
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: '#ef4444', color: '#fff' }}
              >
                {t('delete')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Premium Modal */}
      <PremiumModal isOpen={showPremiumModal} onClose={() => setShowPremiumModal(false)} />
    </div>
  );
};

export default ProductList;
