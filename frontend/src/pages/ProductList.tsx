import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { usePremiumStatus } from '../hooks/usePremiumStatus';
import { Plus, Edit2, Trash2, Crown, Package, AlertCircle } from 'lucide-react';
import PremiumModal from '../components/PremiumModal';
import { useNotification } from '../hooks/useNotification';

interface Product {
  id: string;
  name: string;
  buyingPrice: number;
  sellingPrice: number;
  stock: number;
  unit: string;
  note: string;
  createdAt: string;
}

const FREE_ITEM_LIMIT = 199;

export default function ProductList() {
  const { t, language } = useLanguage();
  const { isDark } = useTheme();
  const { isActive: isPremium } = usePremiumStatus();
  const { showNotification } = useNotification();
  const isBn = language === 'bn';

  const [products, setProducts] = useState<Product[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [buyingPrice, setBuyingPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [stock, setStock] = useState('');
  const [unit, setUnit] = useState(isBn ? 'পিস' : 'pcs');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (!isPremium) {
      setShowPremiumModal(true);
      return;
    }
    loadProducts();
  }, [isPremium]);

  const loadProducts = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('products') || '[]');
      setProducts(Array.isArray(saved) ? saved : []);
    } catch {
      setProducts([]);
    }
  };

  const saveProducts = (newProducts: Product[]) => {
    try {
      localStorage.setItem('products', JSON.stringify(newProducts));
    } catch {}
  };

  const handleAdd = () => {
    if (!isPremium) {
      setShowPremiumModal(true);
      return;
    }

    if (!isPremium && products.length >= FREE_ITEM_LIMIT) {
      setShowPremiumModal(true);
      return;
    }

    if (!name.trim()) return;

    if (editingId) {
      const updated = products.map(p =>
        p.id === editingId
          ? { ...p, name: name.trim(), buyingPrice: parseFloat(buyingPrice) || 0, sellingPrice: parseFloat(sellingPrice) || 0, stock: parseFloat(stock) || 0, unit, note }
          : p
      );
      setProducts(updated);
      saveProducts(updated);
      setEditingId(null);
    } else {
      const newProduct: Product = {
        id: Date.now().toString(),
        name: name.trim(),
        buyingPrice: parseFloat(buyingPrice) || 0,
        sellingPrice: parseFloat(sellingPrice) || 0,
        stock: parseFloat(stock) || 0,
        unit,
        note,
        createdAt: new Date().toISOString(),
      };
      const updated = [newProduct, ...products];
      setProducts(updated);
      saveProducts(updated);
      showNotification(isBn ? 'পণ্য যোগ হয়েছে!' : 'Product added!');
    }

    resetForm();
  };

  const resetForm = () => {
    setName('');
    setBuyingPrice('');
    setSellingPrice('');
    setStock('');
    setUnit(isBn ? 'পিস' : 'pcs');
    setNote('');
    setShowAddForm(false);
    setEditingId(null);
  };

  const handleEdit = (product: Product) => {
    if (!isPremium) {
      setShowPremiumModal(true);
      return;
    }
    setEditingId(product.id);
    setName(product.name);
    setBuyingPrice(product.buyingPrice.toString());
    setSellingPrice(product.sellingPrice.toString());
    setStock(product.stock.toString());
    setUnit(product.unit);
    setNote(product.note);
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    saveProducts(updated);
  };

  const nearLimit = !isPremium && products.length >= 190 && products.length < FREE_ITEM_LIMIT;

  if (!isPremium) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center px-6 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className={`w-full max-w-sm rounded-3xl p-8 text-center shadow-xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <Crown size={36} className="text-amber-500" />
          </div>
          <h2 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {isBn ? 'প্রিমিয়াম ফিচার' : 'Premium Feature'}
          </h2>
          <p className={`text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {isBn ? 'পণ্যের তালিকা ব্যবহার করতে প্রিমিয়াম সাবস্ক্রিপশন প্রয়োজন।' : 'Product List requires a Premium subscription.'}
          </p>
          <button
            onClick={() => setShowPremiumModal(true)}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold"
          >
            👑 {isBn ? 'প্রিমিয়াম নিন' : 'Get Premium'}
          </button>
        </div>

        <PremiumModal
          isOpen={showPremiumModal}
          onClose={() => setShowPremiumModal(false)}
          onActivate={() => {
            setShowPremiumModal(false);
            loadProducts();
          }}
        />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`px-4 py-4 flex items-center justify-between border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <div>
          <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {isBn ? 'তোমার পণ্যের তালিকা' : 'Your Product List'}
          </h1>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {products.length} {isBn ? 'টি পণ্য' : 'products'}
          </p>
        </div>
        <button
          onClick={() => {
            if (!isPremium && products.length >= FREE_ITEM_LIMIT) {
              setShowPremiumModal(true);
              return;
            }
            resetForm();
            setShowAddForm(true);
          }}
          className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center shadow-lg"
        >
          <Plus size={20} className="text-white" />
        </button>
      </div>

      {/* Near limit warning */}
      {nearLimit && (
        <div className="mx-4 mt-3 flex items-center gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200">
          <AlertCircle size={16} className="text-amber-500 flex-shrink-0" />
          <p className="text-amber-700 text-sm">
            {isBn
              ? `সতর্কতা: আপনি ${FREE_ITEM_LIMIT - products.length}টি পণ্য আর যোগ করতে পারবেন`
              : `Warning: You can add ${FREE_ITEM_LIMIT - products.length} more products`}
          </p>
        </div>
      )}

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className={`mx-4 mt-4 rounded-2xl p-4 border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm`}>
          <h3 className={`font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {editingId ? (isBn ? 'পণ্য সম্পাদনা' : 'Edit Product') : (isBn ? 'নতুন পণ্য' : 'New Product')}
          </h3>
          <div className="space-y-3">
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={isBn ? 'পণ্যের নাম *' : 'Product Name *'}
              className={`w-full px-3 py-2 rounded-xl border outline-none text-sm ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'} focus:border-amber-500`}
            />
            <div className="flex gap-2">
              <input
                type="number"
                value={buyingPrice}
                onChange={e => setBuyingPrice(e.target.value)}
                placeholder={isBn ? 'ক্রয় মূল্য' : 'Buying Price'}
                className={`flex-1 px-3 py-2 rounded-xl border outline-none text-sm ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'} focus:border-amber-500`}
              />
              <input
                type="number"
                value={sellingPrice}
                onChange={e => setSellingPrice(e.target.value)}
                placeholder={isBn ? 'বিক্রয় মূল্য' : 'Selling Price'}
                className={`flex-1 px-3 py-2 rounded-xl border outline-none text-sm ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'} focus:border-amber-500`}
              />
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                value={stock}
                onChange={e => setStock(e.target.value)}
                placeholder={isBn ? 'স্টক' : 'Stock'}
                className={`flex-1 px-3 py-2 rounded-xl border outline-none text-sm ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'} focus:border-amber-500`}
              />
              <input
                type="text"
                value={unit}
                onChange={e => setUnit(e.target.value)}
                placeholder={isBn ? 'একক' : 'Unit'}
                className={`flex-1 px-3 py-2 rounded-xl border outline-none text-sm ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'} focus:border-amber-500`}
              />
            </div>
            <input
              type="text"
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder={isBn ? 'নোট' : 'Note'}
              className={`w-full px-3 py-2 rounded-xl border outline-none text-sm ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'} focus:border-amber-500`}
            />
            <div className="flex gap-2">
              <button
                onClick={resetForm}
                className={`flex-1 py-2 rounded-xl border text-sm font-semibold ${isDark ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-600'}`}
              >
                {isBn ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                onClick={handleAdd}
                className="flex-1 py-2 rounded-xl bg-amber-500 text-white text-sm font-semibold"
              >
                {editingId ? (isBn ? 'আপডেট' : 'Update') : (isBn ? 'যোগ করুন' : 'Add')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products */}
      <div className="px-4 py-4 space-y-3">
        {products.length === 0 ? (
          <div className={`text-center py-12 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            <Package size={40} className="mx-auto mb-3 opacity-50" />
            <p>{isBn ? 'কোনো পণ্য নেই' : 'No products yet'}</p>
          </div>
        ) : (
          products.map(product => (
            <div
              key={product.id}
              className={`rounded-2xl p-4 border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{product.name}</p>
                  <div className="flex flex-wrap gap-3 mt-1">
                    <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {isBn ? 'ক্রয়:' : 'Buy:'} ৳{product.buyingPrice}
                    </span>
                    <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {isBn ? 'বিক্রয়:' : 'Sell:'} ৳{product.sellingPrice}
                    </span>
                    <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {isBn ? 'স্টক:' : 'Stock:'} {product.stock} {product.unit}
                    </span>
                  </div>
                  {product.note && (
                    <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{product.note}</p>
                  )}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(product)}
                    className={`p-2 rounded-lg ${isDark ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}`}
                  >
                    <Edit2 size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-2 rounded-lg text-red-400 hover:bg-red-50"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <PremiumModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        onActivate={() => {
          setShowPremiumModal(false);
          loadProducts();
        }}
      />
    </div>
  );
}
