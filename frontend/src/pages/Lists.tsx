import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { usePremiumStatus } from '../hooks/usePremiumStatus';
import { Plus, Trash2, Crown, AlertCircle, ListChecks } from 'lucide-react';
import PremiumModal from '../components/PremiumModal';
import { useNotification } from '../hooks/useNotification';

interface ListItem {
  id: string;
  name: string;
  retailPrice: string;
  wholesalePrice: string;
  note: string;
  createdAt: string;
}

const FREE_ITEM_LIMIT = 199;

export default function Lists() {
  const { language } = useLanguage();
  const { isDark } = useTheme();
  const { isActive: isPremium } = usePremiumStatus();
  const { showNotification } = useNotification();
  const isBn = language === 'bn';

  const [items, setItems] = useState<ListItem[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [name, setName] = useState('');
  const [retailPrice, setRetailPrice] = useState('');
  const [wholesalePrice, setWholesalePrice] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (!isPremium) {
      setShowPremiumModal(true);
      return;
    }
    loadItems();
  }, [isPremium]);

  const loadItems = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('taskList') || '[]');
      setItems(Array.isArray(saved) ? saved : []);
    } catch {
      setItems([]);
    }
  };

  const saveItems = (newItems: ListItem[]) => {
    try {
      localStorage.setItem('taskList', JSON.stringify(newItems));
    } catch {}
  };

  const handleAdd = () => {
    if (!isPremium) {
      setShowPremiumModal(true);
      return;
    }

    if (!isPremium && items.length >= FREE_ITEM_LIMIT) {
      setShowPremiumModal(true);
      return;
    }

    if (!name.trim()) return;

    const newItem: ListItem = {
      id: Date.now().toString(),
      name: name.trim(),
      retailPrice,
      wholesalePrice,
      note,
      createdAt: new Date().toISOString(),
    };

    const updated = [newItem, ...items];
    setItems(updated);
    saveItems(updated);
    setName('');
    setRetailPrice('');
    setWholesalePrice('');
    setNote('');
    setShowAddForm(false);
    showNotification(isBn ? 'আইটেম যোগ হয়েছে!' : 'Item added!');
  };

  const handleDelete = (id: string) => {
    const updated = items.filter(i => i.id !== id);
    setItems(updated);
    saveItems(updated);
  };

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
            {isBn ? 'কাজের তালিকা ব্যবহার করতে প্রিমিয়াম সাবস্ক্রিপশন প্রয়োজন।' : 'Task List requires a Premium subscription.'}
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
            loadItems();
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
            {isBn ? 'তোমার কাজের তালিকা' : 'Your Task List'}
          </h1>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {items.length} {isBn ? 'টি আইটেম' : 'items'}
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center shadow-lg"
        >
          <Plus size={20} className="text-white" />
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className={`mx-4 mt-4 rounded-2xl p-4 border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm`}>
          <h3 className={`font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {isBn ? 'নতুন আইটেম' : 'New Item'}
          </h3>
          <div className="space-y-3">
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={isBn ? 'নাম *' : 'Name *'}
              className={`w-full px-3 py-2 rounded-xl border outline-none text-sm ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'} focus:border-amber-500`}
            />
            <div className="flex gap-2">
              <input
                type="text"
                value={retailPrice}
                onChange={e => setRetailPrice(e.target.value)}
                placeholder={isBn ? 'খুচরা মূল্য' : 'Retail Price'}
                className={`flex-1 px-3 py-2 rounded-xl border outline-none text-sm ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'} focus:border-amber-500`}
              />
              <input
                type="text"
                value={wholesalePrice}
                onChange={e => setWholesalePrice(e.target.value)}
                placeholder={isBn ? 'পাইকারি মূল্য' : 'Wholesale Price'}
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
                onClick={() => setShowAddForm(false)}
                className={`flex-1 py-2 rounded-xl border text-sm font-semibold ${isDark ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-600'}`}
              >
                {isBn ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                onClick={handleAdd}
                className="flex-1 py-2 rounded-xl bg-amber-500 text-white text-sm font-semibold"
              >
                {isBn ? 'যোগ করুন' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Items */}
      <div className="px-4 py-4 space-y-3">
        {items.length === 0 ? (
          <div className={`text-center py-12 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            <ListChecks size={40} className="mx-auto mb-3 opacity-50" />
            <p>{isBn ? 'কোনো আইটেম নেই' : 'No items yet'}</p>
          </div>
        ) : (
          items.map(item => (
            <div
              key={item.id}
              className={`rounded-2xl p-4 border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.name}</p>
                  {(item.retailPrice || item.wholesalePrice) && (
                    <div className="flex gap-3 mt-1">
                      {item.retailPrice && (
                        <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {isBn ? 'খুচরা:' : 'Retail:'} ৳{item.retailPrice}
                        </span>
                      )}
                      {item.wholesalePrice && (
                        <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {isBn ? 'পাইকারি:' : 'Wholesale:'} ৳{item.wholesalePrice}
                        </span>
                      )}
                    </div>
                  )}
                  {item.note && (
                    <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{item.note}</p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 rounded-lg text-red-400 hover:bg-red-50"
                >
                  <Trash2 size={16} />
                </button>
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
          loadItems();
        }}
      />
    </div>
  );
}
