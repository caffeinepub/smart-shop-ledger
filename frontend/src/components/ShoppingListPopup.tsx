import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { usePremiumStatus } from '../hooks/usePremiumStatus';
import { Plus, ShoppingCart, Trash2, AlertCircle } from 'lucide-react';
import BottomSheet from './BottomSheet';
import PremiumModal from './PremiumModal';
import { playCashRegister } from '../utils/sounds';

interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  bought: boolean;
  createdAt: string;
}

interface ShoppingListPopupProps {
  open: boolean;
  onClose: () => void;
}

const FREE_ITEM_LIMIT = 199;

export default function ShoppingListPopup({ open, onClose }: ShoppingListPopupProps) {
  const { language } = useLanguage();
  const { isDark } = useTheme();
  const { isActive: isPremium } = usePremiumStatus();
  const isBn = language === 'bn';

  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [newItem, setNewItem] = useState('');
  const [newQty, setNewQty] = useState('');
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const touchStartX = useRef<Record<string, number>>({});

  useEffect(() => {
    if (open) loadItems();
  }, [open]);

  const loadItems = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('shoppingList') || '[]');
      setItems(Array.isArray(saved) ? saved : []);
    } catch {
      setItems([]);
    }
  };

  const saveItems = (newItems: ShoppingItem[]) => {
    try {
      localStorage.setItem('shoppingList', JSON.stringify(newItems));
    } catch {}
  };

  const handleAdd = () => {
    if (!newItem.trim()) return;

    if (!isPremium && items.length >= FREE_ITEM_LIMIT) {
      setShowPremiumModal(true);
      return;
    }

    const item: ShoppingItem = {
      id: Date.now().toString(),
      name: newItem.trim(),
      quantity: newQty.trim(),
      bought: false,
      createdAt: new Date().toISOString(),
    };
    const updated = [item, ...items];
    setItems(updated);
    saveItems(updated);
    setNewItem('');
    setNewQty('');
  };

  const handleTouchStart = (id: string, e: React.TouchEvent) => {
    touchStartX.current[id] = e.touches[0].clientX;
  };

  const handleTouchEnd = (id: string, e: React.TouchEvent) => {
    const startX = touchStartX.current[id];
    if (startX === undefined) return;
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    if (diff > 60) {
      const updated = items.map(i => i.id === id ? { ...i, bought: true } : i);
      setItems(updated);
      saveItems(updated);
      playCashRegister();
    }
    delete touchStartX.current[id];
  };

  const handleDelete = (id: string) => {
    const updated = items.filter(i => i.id !== id);
    setItems(updated);
    saveItems(updated);
  };

  const nearLimit = !isPremium && items.length >= 190 && items.length < FREE_ITEM_LIMIT;
  const atLimit = !isPremium && items.length >= FREE_ITEM_LIMIT;

  return (
    <>
      <BottomSheet open={open} onClose={onClose} title={isBn ? 'কেনাকাটার তালিকা' : 'Shopping List'}>
        <div className="flex flex-col h-full px-4 py-3">
          {/* Near limit warning */}
          {nearLimit && (
            <div className="flex items-center gap-2 p-3 mb-3 rounded-xl bg-amber-50 border border-amber-200">
              <AlertCircle size={14} className="text-amber-500 flex-shrink-0" />
              <p className="text-amber-700 text-xs">
                {isBn ? `${FREE_ITEM_LIMIT - items.length}টি আইটেম আর যোগ করতে পারবেন` : `${FREE_ITEM_LIMIT - items.length} items remaining`}
              </p>
            </div>
          )}

          {/* Add input */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newItem}
              onChange={e => setNewItem(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              placeholder={isBn ? 'পণ্যের নাম...' : 'Item name...'}
              className={`flex-1 px-3 py-2 rounded-xl border outline-none text-sm ${
                isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
              } focus:border-amber-500`}
            />
            <input
              type="text"
              value={newQty}
              onChange={e => setNewQty(e.target.value)}
              placeholder={isBn ? 'পরিমাণ' : 'Qty'}
              className={`w-16 px-2 py-2 rounded-xl border outline-none text-sm ${
                isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
              } focus:border-amber-500`}
            />
            <button
              onClick={handleAdd}
              disabled={atLimit}
              className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center disabled:opacity-50"
            >
              <Plus size={18} className="text-white" />
            </button>
          </div>

          {/* Swipe hint */}
          <p className={`text-xs text-center mb-3 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
            {isBn ? '← সোয়াইপ করুন কেনা হয়েছে চিহ্নিত করতে' : '← Swipe to mark as bought'}
          </p>

          {/* Items */}
          <div className="flex-1 overflow-y-auto space-y-2">
            {items.length === 0 ? (
              <div className={`text-center py-8 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                <ShoppingCart size={32} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">{isBn ? 'কোনো আইটেম নেই' : 'No items yet'}</p>
              </div>
            ) : (
              items.map(item => (
                <div
                  key={item.id}
                  onTouchStart={e => handleTouchStart(item.id, e)}
                  onTouchEnd={e => handleTouchEnd(item.id, e)}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    item.bought
                      ? isDark ? 'bg-green-900/30 border-green-700 opacity-60' : 'bg-green-50 border-green-200 opacity-60'
                      : isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
                  }`}
                >
                  <ShoppingCart size={16} className={item.bought ? 'text-green-500' : isDark ? 'text-gray-400' : 'text-gray-400'} />
                  <span className={`flex-1 text-sm ${
                    item.bought
                      ? 'line-through text-gray-400'
                      : isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {item.name}
                    {item.quantity && (
                      <span className={`ml-2 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        ({item.quantity})
                      </span>
                    )}
                  </span>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1 text-red-400"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </BottomSheet>

      <PremiumModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        onActivate={() => setShowPremiumModal(false)}
      />
    </>
  );
}
