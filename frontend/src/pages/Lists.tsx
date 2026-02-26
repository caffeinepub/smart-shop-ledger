import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { usePremiumStatus } from '../hooks/usePremiumStatus';
import { useNotificationContext } from '../contexts/NotificationContext';
import PremiumModal from '../components/PremiumModal';

interface ListItem {
  id: string;
  text: string;
  price?: string;
  wholesalePrice?: string;
  note?: string;
  completed: boolean;
  createdAt: number;
}

const Lists: React.FC = () => {
  const { mode, accentColor } = useTheme();
  const { t, language } = useLanguage();
  const { isActive: isPremium, checkAndEnforceExpiry } = usePremiumStatus();
  const { showNotification } = useNotificationContext();
  const isBn = language === 'bn';

  const isDark = mode === 'dark';

  const [items, setItems] = useState<ListItem[]>([]);
  const [newItemText, setNewItemText] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemWholesale, setNewItemWholesale] = useState('');
  const [newItemNote, setNewItemNote] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const accent = accentColor || '#FFA500';

  useEffect(() => {
    checkAndEnforceExpiry();
    const saved = localStorage.getItem('doToListItems');
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch { setItems([]); }
    }
  }, [checkAndEnforceExpiry]);

  const saveItems = (updated: ListItem[]) => {
    setItems(updated);
    localStorage.setItem('doToListItems', JSON.stringify(updated));
  };

  const handleAddClick = () => {
    if (!isPremium) {
      setShowPremiumModal(true);
      return;
    }
    setShowAddForm(true);
  };

  const handleAddItem = () => {
    if (!newItemText.trim()) return;
    const newItem: ListItem = {
      id: Date.now().toString(),
      text: newItemText.trim(),
      price: newItemPrice.trim() || undefined,
      wholesalePrice: newItemWholesale.trim() || undefined,
      note: newItemNote.trim() || undefined,
      completed: false,
      createdAt: Date.now(),
    };
    const updated = [newItem, ...items];
    saveItems(updated);
    showNotification(`${isBn ? 'নতুন আইটেম যোগ হয়েছে' : 'New item added'}: ${newItem.text}`);
    setNewItemText('');
    setNewItemPrice('');
    setNewItemWholesale('');
    setNewItemNote('');
    setShowAddForm(false);
  };

  const toggleItem = (id: string) => {
    saveItems(items.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
  };

  const deleteItem = (id: string) => {
    saveItems(items.filter(item => item.id !== id));
  };

  const clearAll = () => {
    saveItems([]);
    setShowClearConfirm(false);
  };

  const bg = isDark ? '#0f0f1a' : '#f5f5f5';
  const cardBg = isDark ? '#1a1a2e' : '#ffffff';
  const textColor = isDark ? '#ffffff' : '#1a1a2e';
  const subText = isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)';
  const inputBg = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)';
  const borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

  const accentColorMap: Record<string, string> = {
    green: '#22c55e', red: '#ef4444', blue: '#3b82f6',
    yellow: '#eab308', orange: '#f97316', dark: '#6b7280',
  };
  const accentHex = accentColorMap[accentColor] || '#22c55e';

  return (
    <div style={{ minHeight: '100vh', background: bg, padding: '16px', paddingBottom: '100px' }}>
      {/* Page Title */}
      <h1 style={{ color: textColor, fontSize: '26px', fontWeight: '800', marginBottom: '20px', margin: '0 0 20px 0' }}>
        {isBn ? 'আমার তালিকা' : 'My Lists'}
      </h1>

      {/* Premium Option Badge */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        background: `${accentHex}22`,
        border: `1px solid ${accentHex}44`,
        borderRadius: '20px',
        padding: '6px 14px',
        marginBottom: '16px',
      }}>
        <span style={{ fontSize: '14px' }}>👑</span>
        <span style={{ color: accentHex, fontWeight: '700', fontSize: '13px' }}>
          {isBn ? 'প্রিমিয়াম অপশন' : 'Premium Option'}
        </span>
      </div>

      {/* DO TO LIST Card */}
      <div style={{
        background: cardBg,
        borderRadius: '20px',
        overflow: 'hidden',
        border: `1px solid ${borderColor}`,
        boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.08)',
      }}>
        {/* Card Header */}
        <div style={{
          background: `linear-gradient(135deg, ${accentHex}, ${accentHex}cc)`,
          padding: '14px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px' }}>📋</span>
            <div>
              <div style={{ color: '#fff', fontWeight: '800', fontSize: '16px', letterSpacing: '0.05em' }}>
                DO TO LIST
              </div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>
                {isBn ? 'কাজের তালিকা' : 'Task List'}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {items.length > 0 && (
              <button
                onClick={() => setShowClearConfirm(true)}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '6px 10px',
                  color: '#fff',
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                {isBn ? 'সব মুছুন' : 'Clear All'}
              </button>
            )}
            <button
              onClick={handleAddClick}
              style={{
                background: 'rgba(255,255,255,0.25)',
                border: 'none',
                borderRadius: '10px',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '22px',
                color: '#fff',
                fontWeight: 'bold',
              }}
            >
              +
            </button>
          </div>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <div style={{ padding: '16px', borderBottom: `1px solid ${borderColor}`, background: inputBg }}>
            <input
              type="text"
              value={newItemText}
              onChange={e => setNewItemText(e.target.value)}
              placeholder={isBn ? 'আইটেমের নাম *' : 'Item name *'}
              style={{
                width: '100%',
                background: cardBg,
                border: `1px solid ${borderColor}`,
                borderRadius: '10px',
                padding: '10px 14px',
                color: textColor,
                fontSize: '14px',
                marginBottom: '8px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
              <input
                type="number"
                value={newItemPrice}
                onChange={e => setNewItemPrice(e.target.value)}
                placeholder={isBn ? 'খুচরা মূল্য ৳' : 'Retail price ৳'}
                style={{
                  background: cardBg,
                  border: `1px solid ${borderColor}`,
                  borderRadius: '10px',
                  padding: '10px 14px',
                  color: textColor,
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
              <input
                type="number"
                value={newItemWholesale}
                onChange={e => setNewItemWholesale(e.target.value)}
                placeholder={isBn ? 'পাইকারি মূল্য ৳' : 'Wholesale ৳'}
                style={{
                  background: cardBg,
                  border: `1px solid ${borderColor}`,
                  borderRadius: '10px',
                  padding: '10px 14px',
                  color: textColor,
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>
            <input
              type="text"
              value={newItemNote}
              onChange={e => setNewItemNote(e.target.value)}
              placeholder={isBn ? 'নোট (ঐচ্ছিক)' : 'Note (optional)'}
              style={{
                width: '100%',
                background: cardBg,
                border: `1px solid ${borderColor}`,
                borderRadius: '10px',
                padding: '10px 14px',
                color: textColor,
                fontSize: '14px',
                marginBottom: '10px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handleAddItem}
                style={{
                  flex: 1,
                  background: accentHex,
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '10px',
                  fontWeight: '700',
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                {isBn ? 'যোগ করুন' : 'Add'}
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                style={{
                  flex: 1,
                  background: borderColor,
                  color: textColor,
                  border: 'none',
                  borderRadius: '10px',
                  padding: '10px',
                  fontWeight: '600',
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                {isBn ? 'বাতিল' : 'Cancel'}
              </button>
            </div>
          </div>
        )}

        {/* Items */}
        <div style={{ padding: '8px' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: subText }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>📋</div>
              <p style={{ fontSize: '14px' }}>
                {isBn ? 'কোনো আইটেম নেই। + বাটন চাপুন যোগ করতে' : 'No items yet. Tap + to add'}
              </p>
              {!isPremium && (
                <p style={{ fontSize: '12px', marginTop: '8px', color: accentHex }}>
                  {isBn ? '⚠️ প্রিমিয়াম প্রয়োজন' : '⚠️ Premium required'}
                </p>
              )}
            </div>
          ) : (
            items.map(item => (
              <div
                key={item.id}
                style={{
                  background: item.completed
                    ? (isDark ? 'rgba(34,197,94,0.08)' : 'rgba(34,197,94,0.05)')
                    : (isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)'),
                  borderRadius: '14px',
                  padding: '12px 14px',
                  marginBottom: '8px',
                  border: `1px solid ${item.completed ? 'rgba(34,197,94,0.2)' : borderColor}`,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                }}
              >
                <button
                  onClick={() => toggleItem(item.id)}
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    border: `2px solid ${item.completed ? '#22c55e' : borderColor}`,
                    background: item.completed ? '#22c55e' : 'transparent',
                    cursor: 'pointer',
                    flexShrink: 0,
                    marginTop: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                >
                  {item.completed ? '✓' : ''}
                </button>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    color: item.completed ? subText : textColor,
                    fontWeight: '600',
                    fontSize: '14px',
                    textDecoration: item.completed ? 'line-through' : 'none',
                    marginBottom: '4px',
                  }}>
                    {item.text}
                  </p>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    {item.price && (
                      <span style={{ color: accentHex, fontSize: '12px', fontWeight: '600' }}>
                        {isBn ? 'খুচরা:' : 'Retail:'} ৳{item.price}
                      </span>
                    )}
                    {item.wholesalePrice && (
                      <span style={{ color: subText, fontSize: '12px' }}>
                        {isBn ? 'পাইকারি:' : 'Wholesale:'} ৳{item.wholesalePrice}
                      </span>
                    )}
                    {item.note && (
                      <span style={{ color: subText, fontSize: '12px', fontStyle: 'italic' }}>
                        {item.note}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => deleteItem(item.id)}
                  style={{
                    background: 'rgba(239,68,68,0.1)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '6px',
                    cursor: 'pointer',
                    color: '#ef4444',
                    flexShrink: 0,
                  }}
                >
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Clear Confirm Dialog */}
      {showClearConfirm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 100, padding: '16px',
        }}>
          <div style={{
            background: cardBg, borderRadius: '20px', padding: '24px',
            width: '100%', maxWidth: '320px', border: `1px solid ${borderColor}`,
          }}>
            <h3 style={{ color: textColor, fontWeight: '700', marginBottom: '8px' }}>
              {isBn ? 'সব মুছবেন?' : 'Clear all items?'}
            </h3>
            <p style={{ color: subText, fontSize: '14px', marginBottom: '20px' }}>
              {isBn ? 'এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।' : 'This action cannot be undone.'}
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setShowClearConfirm(false)}
                style={{
                  flex: 1, padding: '10px', borderRadius: '12px',
                  background: borderColor, border: 'none', color: textColor,
                  fontWeight: '600', cursor: 'pointer',
                }}
              >
                {isBn ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                onClick={clearAll}
                style={{
                  flex: 1, padding: '10px', borderRadius: '12px',
                  background: '#ef4444', border: 'none', color: '#fff',
                  fontWeight: '700', cursor: 'pointer',
                }}
              >
                {isBn ? 'মুছুন' : 'Clear'}
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

export default Lists;
