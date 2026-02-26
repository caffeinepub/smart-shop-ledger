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
        background: `linear-gradient(135deg, ${accent}22, ${accent}11)`,
        border: `1px solid ${accent}44`,
        borderRadius: '20px',
        padding: '6px 14px',
        marginBottom: '16px',
      }}>
        <span style={{ fontSize: '14px' }}>👑</span>
        <span style={{ color: accent, fontWeight: '700', fontSize: '13px' }}>
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
          background: `linear-gradient(135deg, ${accent}, ${accent}cc)`,
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
              <div style={{
                background: 'rgba(255,255,255,0.25)',
                borderRadius: '10px',
                padding: '1px 8px',
                display: 'inline-block',
                marginTop: '2px',
              }}>
                <span style={{ color: '#fff', fontSize: '11px', fontWeight: '600' }}>
                  {items.length}
                </span>
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
                  borderRadius: '50%',
                  width: '36px', height: '36px',
                  color: '#fff', cursor: 'pointer',
                  fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
                title={isBn ? 'সব মুছুন' : 'Clear All'}
              >
                🗑️
              </button>
            )}
            {/* Add Button */}
            <button
              onClick={handleAddClick}
              style={{
                background: isPremium ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)',
                border: isPremium ? 'none' : '2px dashed rgba(255,255,255,0.4)',
                borderRadius: '50%',
                width: '40px', height: '40px',
                color: isPremium ? '#fff' : 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
                fontSize: '22px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative',
              }}
              title={isPremium ? (isBn ? 'আইটেম যোগ করুন' : 'Add Item') : (isBn ? 'প্রিমিয়াম প্রয়োজন' : 'Premium Required')}
            >
              {isPremium ? '+' : '🔒'}
            </button>
          </div>
        </div>

        {/* Add Form */}
        {showAddForm && isPremium && (
          <div style={{
            padding: '16px',
            borderBottom: `1px solid ${borderColor}`,
            background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
          }}>
            <input
              type="text"
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              placeholder={isBn ? 'আইটেমের নাম *' : 'Item name *'}
              autoFocus
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '10px',
                border: `1px solid ${borderColor}`,
                background: inputBg,
                color: textColor,
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
                marginBottom: '8px',
              }}
            />
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <input
                type="number"
                value={newItemPrice}
                onChange={(e) => setNewItemPrice(e.target.value)}
                placeholder={isBn ? 'দাম (খুচরা)' : 'Price (Retail)'}
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: `1px solid ${borderColor}`,
                  background: inputBg,
                  color: textColor,
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              <input
                type="number"
                value={newItemWholesale}
                onChange={(e) => setNewItemWholesale(e.target.value)}
                placeholder={isBn ? 'পাইকারি দাম' : 'Wholesale Price'}
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: `1px solid ${borderColor}`,
                  background: inputBg,
                  color: textColor,
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <input
              type="text"
              value={newItemNote}
              onChange={(e) => setNewItemNote(e.target.value)}
              placeholder={isBn ? 'নোট (ঐচ্ছিক)' : 'Note (optional)'}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '10px',
                border: `1px solid ${borderColor}`,
                background: inputBg,
                color: textColor,
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
                marginBottom: '10px',
              }}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handleAddItem}
                disabled={!newItemText.trim()}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '10px',
                  border: 'none',
                  background: newItemText.trim() ? `linear-gradient(135deg, ${accent}, ${accent}cc)` : 'rgba(255,255,255,0.1)',
                  color: newItemText.trim() ? '#fff' : subText,
                  fontWeight: '700',
                  fontSize: '14px',
                  cursor: newItemText.trim() ? 'pointer' : 'not-allowed',
                }}
              >
                {isBn ? 'যোগ করুন' : 'Add'}
              </button>
              <button
                onClick={() => { setShowAddForm(false); setNewItemText(''); setNewItemPrice(''); setNewItemWholesale(''); setNewItemNote(''); }}
                style={{
                  padding: '10px 16px',
                  borderRadius: '10px',
                  border: `1px solid ${borderColor}`,
                  background: 'transparent',
                  color: subText,
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                {isBn ? 'বাতিল' : 'Cancel'}
              </button>
            </div>
          </div>
        )}

        {/* Items List */}
        <div style={{ padding: '12px 16px', minHeight: '80px' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 0', color: subText, fontSize: '14px' }}>
              {isPremium
                ? (isBn ? 'এখনো কোনো আইটেম নেই' : 'No items yet')
                : (isBn ? '🔒 প্রিমিয়াম নিন এবং আইটেম যোগ করুন' : '🔒 Get Premium to add items')}
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: '10px 0',
                  borderBottom: `1px solid ${borderColor}`,
                }}
              >
                <button
                  onClick={() => toggleItem(item.id)}
                  style={{
                    width: '22px', height: '22px',
                    borderRadius: '50%',
                    border: `2px solid ${item.completed ? accent : borderColor}`,
                    background: item.completed ? accent : 'transparent',
                    cursor: 'pointer',
                    flexShrink: 0,
                    marginTop: '2px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontSize: '12px',
                  }}
                >
                  {item.completed ? '✓' : ''}
                </button>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    color: item.completed ? subText : textColor,
                    fontSize: '14px',
                    fontWeight: '600',
                    textDecoration: item.completed ? 'line-through' : 'none',
                  }}>
                    {item.text}
                  </div>
                  {(item.price || item.wholesalePrice) && (
                    <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                      {item.price && (
                        <span style={{ color: accent, fontSize: '12px', fontWeight: '600' }}>
                          {isBn ? 'খুচরা: ' : 'Retail: '}৳{item.price}
                        </span>
                      )}
                      {item.wholesalePrice && (
                        <span style={{ color: subText, fontSize: '12px' }}>
                          {isBn ? 'পাইকারি: ' : 'Wholesale: '}৳{item.wholesalePrice}
                        </span>
                      )}
                    </div>
                  )}
                  {item.note && (
                    <div style={{ color: subText, fontSize: '12px', marginTop: '2px', fontStyle: 'italic' }}>
                      {item.note}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => deleteItem(item.id)}
                  style={{
                    background: 'rgba(244,67,54,0.1)',
                    border: 'none',
                    borderRadius: '8px',
                    width: '30px', height: '30px',
                    color: '#f44336',
                    cursor: 'pointer',
                    fontSize: '14px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        {/* Premium lock overlay hint */}
        {!isPremium && (
          <div style={{
            padding: '12px 16px',
            borderTop: `1px solid ${borderColor}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}>
            <button
              onClick={() => setShowPremiumModal(true)}
              style={{
                background: `linear-gradient(135deg, ${accent}, ${accent}cc)`,
                border: 'none',
                borderRadius: '12px',
                padding: '10px 24px',
                color: '#fff',
                fontWeight: '700',
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              👑 {isBn ? 'প্রিমিয়াম নিন' : 'Get Premium'}
            </button>
          </div>
        )}
      </div>

      {/* Clear Confirm Dialog */}
      {showClearConfirm && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 500,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '16px',
        }}>
          <div style={{
            background: cardBg,
            borderRadius: '16px',
            padding: '24px',
            width: '100%',
            maxWidth: '320px',
            textAlign: 'center',
          }}>
            <p style={{ color: textColor, fontSize: '16px', fontWeight: '600', marginBottom: '20px' }}>
              {isBn ? 'সব আইটেম মুছবেন?' : 'Clear all items?'}
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setShowClearConfirm(false)}
                style={{
                  flex: 1, padding: '10px', borderRadius: '10px',
                  border: `1px solid ${borderColor}`, background: 'transparent',
                  color: textColor, cursor: 'pointer', fontSize: '14px',
                }}
              >
                {isBn ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                onClick={clearAll}
                style={{
                  flex: 1, padding: '10px', borderRadius: '10px',
                  border: 'none', background: '#f44336',
                  color: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: '700',
                }}
              >
                {isBn ? 'মুছুন' : 'Clear'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Premium Modal */}
      {showPremiumModal && (
        <PremiumModal
          onClose={() => setShowPremiumModal(false)}
          onActivate={() => {
            checkAndEnforceExpiry();
            setShowPremiumModal(false);
          }}
        />
      )}
    </div>
  );
};

export default Lists;
