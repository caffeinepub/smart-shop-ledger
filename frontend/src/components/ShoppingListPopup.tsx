import React, { useState, useEffect, useRef } from 'react';
import BottomSheet from './BottomSheet';
import { playCashRegister } from '../utils/sounds';
import { Plus, Trash2, ShoppingCart } from 'lucide-react';

interface ShoppingItem {
  id: string;
  name: string;
  quantity?: string;
  price?: string;
  bought: boolean;
  createdAt: string;
}

interface ShoppingListPopupProps {
  open: boolean;
  onClose: () => void;
}

const STORAGE_KEY = 'smart_shop_shopping_list';

function loadItems(): ShoppingItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveItems(items: ShoppingItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

const ShoppingListPopup: React.FC<ShoppingListPopupProps> = ({ open, onClose }) => {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [newName, setNewName] = useState('');
  const [newQty, setNewQty] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [fadingIds, setFadingIds] = useState<string[]>([]);
  const touchStartX = useRef<{ [id: string]: number }>({});
  const [swipeOffsets, setSwipeOffsets] = useState<{ [id: string]: number }>({});

  useEffect(() => {
    if (open) setItems(loadItems());
  }, [open]);

  const addItem = () => {
    if (!newName.trim()) return;
    const item: ShoppingItem = {
      id: Date.now().toString(),
      name: newName.trim(),
      quantity: newQty.trim(),
      price: newPrice.trim(),
      bought: false,
      createdAt: new Date().toISOString(),
    };
    const updated = [item, ...items];
    setItems(updated);
    saveItems(updated);
    setNewName('');
    setNewQty('');
    setNewPrice('');
  };

  const markBought = (id: string) => {
    playCashRegister();
    setFadingIds(prev => [...prev, id]);
    setTimeout(() => {
      const updated = items.map(i => i.id === id ? { ...i, bought: true } : i);
      setItems(updated);
      saveItems(updated);
      setFadingIds(prev => prev.filter(fid => fid !== id));
    }, 600);
  };

  const deleteItem = (id: string) => {
    const updated = items.filter(i => i.id !== id);
    setItems(updated);
    saveItems(updated);
  };

  const handleTouchStart = (id: string, e: React.TouchEvent) => {
    touchStartX.current[id] = e.touches[0].clientX;
  };

  const handleTouchMove = (id: string, e: React.TouchEvent) => {
    const startX = touchStartX.current[id];
    if (startX === undefined) return;
    const diff = e.touches[0].clientX - startX;
    setSwipeOffsets(prev => ({ ...prev, [id]: diff }));
  };

  const handleTouchEnd = (id: string) => {
    const offset = swipeOffsets[id] || 0;
    if (Math.abs(offset) > 80) {
      markBought(id);
    }
    setSwipeOffsets(prev => ({ ...prev, [id]: 0 }));
    delete touchStartX.current[id];
  };

  const pendingItems = items.filter(i => !i.bought);
  const boughtItems = items.filter(i => i.bought);
  const totalPrice = pendingItems.reduce((sum, i) => sum + (parseFloat(i.price || '0') || 0), 0);

  return (
    <BottomSheet open={open} onClose={onClose} title="🛒 কেনাকাটার তালিকা">
      <div className="px-4 py-3">
        {/* Add item */}
        <div className="bg-gray-800 rounded-2xl p-3 mb-4 border border-gray-700">
          <input
            type="text"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="পণ্যের নাম..."
            className="w-full bg-transparent text-white text-sm mb-2 focus:outline-none placeholder-gray-500"
          />
          <div className="flex gap-2">
            <input
              type="text"
              value={newQty}
              onChange={e => setNewQty(e.target.value)}
              placeholder="পরিমাণ"
              className="flex-1 bg-gray-700 text-white rounded-lg px-3 py-1.5 text-xs focus:outline-none"
            />
            <input
              type="number"
              value={newPrice}
              onChange={e => setNewPrice(e.target.value)}
              placeholder="দাম ৳"
              className="flex-1 bg-gray-700 text-white rounded-lg px-3 py-1.5 text-xs focus:outline-none"
            />
            <button
              onClick={addItem}
              className="bg-green-600 text-white rounded-lg px-3 py-1.5 hover:bg-green-500"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Swipe hint */}
        <p className="text-xs text-gray-500 text-center mb-3">← → সোয়াইপ করুন কেনা হয়েছে চিহ্নিত করতে</p>

        {/* Total */}
        {pendingItems.length > 0 && (
          <div className="bg-green-900/30 border border-green-700/50 rounded-xl px-4 py-2 mb-3 flex justify-between">
            <span className="text-green-400 text-sm font-medium">মোট বাজেট</span>
            <span className="text-green-300 font-bold">৳{totalPrice.toFixed(0)}</span>
          </div>
        )}

        {pendingItems.length === 0 && boughtItems.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <ShoppingCart size={40} className="mx-auto mb-2 opacity-40" />
            <p>কোনো আইটেম নেই। নতুন আইটেম যোগ করুন!</p>
          </div>
        )}

        {pendingItems.map(item => (
          <div
            key={item.id}
            className={`mb-3 rounded-2xl border border-gray-700 bg-gray-800 overflow-hidden transition-all duration-300 ${
              fadingIds.includes(item.id) ? 'opacity-0 scale-95' : 'opacity-100'
            }`}
            style={{
              transform: `translateX(${swipeOffsets[item.id] || 0}px)`,
              transition: swipeOffsets[item.id] ? 'none' : 'transform 0.3s ease, opacity 0.6s ease',
            }}
            onTouchStart={e => handleTouchStart(item.id, e)}
            onTouchMove={e => handleTouchMove(item.id, e)}
            onTouchEnd={() => handleTouchEnd(item.id)}
          >
            <div className="flex items-center justify-between p-4">
              <div className="flex-1">
                <p className="text-white font-medium">{item.name}</p>
                <div className="flex gap-3 mt-1">
                  {item.quantity && <span className="text-xs text-gray-400">📦 {item.quantity}</span>}
                  {item.price && <span className="text-xs text-yellow-400">৳ {item.price}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => markBought(item.id)}
                  className="bg-green-600/20 text-green-400 border border-green-600/40 rounded-lg px-3 py-1.5 text-xs hover:bg-green-600/40"
                >
                  কিনেছি ✓
                </button>
                <button onClick={() => deleteItem(item.id)} className="text-red-400 hover:text-red-300 p-1">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {boughtItems.length > 0 && (
          <>
            <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2 mt-4">
              কেনা হয়েছে ({boughtItems.length})
            </div>
            {boughtItems.map(item => (
              <div key={item.id} className="mb-2 rounded-2xl border border-gray-800 bg-gray-800/30 p-3 flex items-center justify-between opacity-50">
                <div className="flex items-center gap-3">
                  <span className="text-green-400">✅</span>
                  <div>
                    <p className="text-gray-400 line-through text-sm">{item.name}</p>
                    {item.price && <p className="text-xs text-gray-600">৳ {item.price}</p>}
                  </div>
                </div>
                <button onClick={() => deleteItem(item.id)} className="text-red-400/60 hover:text-red-400 p-1">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </>
        )}
      </div>
    </BottomSheet>
  );
};

export default ShoppingListPopup;
