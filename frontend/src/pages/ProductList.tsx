import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { usePremiumStatus } from '../hooks/usePremiumStatus';
import { useNotificationContext } from '../contexts/NotificationContext';
import PremiumModal from '../components/PremiumModal';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category?: string;
}

const FREE_PRODUCT_LIMIT = 10;

const ProductList: React.FC = () => {
  const { mode, accentColor } = useTheme();
  const { language } = useLanguage();
  const { isActive: isPremium, checkAndEnforceExpiry } = usePremiumStatus();
  const { showNotification } = useNotificationContext();
  const isBn = language === 'bn';
  const isDark = mode === 'dark';

  const [products, setProducts] = useState<Product[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newStock, setNewStock] = useState('');
  const [shake, setShake] = useState(false);

  const accent = accentColor || '#FFA500';
  const bg = isDark ? '#0f0f1a' : '#f5f5f5';
  const cardBg = isDark ? '#1a1a2e' : '#ffffff';
  const textColor = isDark ? '#ffffff' : '#1a1a2e';
  const subText = isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.5)';
  const borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const inputBg = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.04)';

  useEffect(() => {
    checkAndEnforceExpiry();
    const stored = localStorage.getItem('products');
    if (stored) {
      try { setProducts(JSON.parse(stored)); } catch { setProducts([]); }
    }
  }, [checkAndEnforceExpiry]);

  const saveProducts = (updated: Product[]) => {
    setProducts(updated);
    localStorage.setItem('products', JSON.stringify(updated));
  };

  const handleAddClick = () => {
    if (!isPremium && products.length >= FREE_PRODUCT_LIMIT) {
      setShake(true);
      setTimeout(() => setShake(false), 600);
      setShowPremiumModal(true);
      return;
    }
    setShowAddForm(true);
    setEditingId(null);
    setNewName('');
    setNewPrice('');
    setNewStock('');
  };

  const handleEditClick = (product: Product) => {
    if (!isPremium) {
      setShowPremiumModal(true);
      return;
    }
    setEditingId(product.id);
    setNewName(product.name);
    setNewPrice(product.price.toString());
    setNewStock(product.stock.toString());
    setShowAddForm(true);
  };

  const handleSave = () => {
    if (!newName.trim()) return;
    if (editingId) {
      const updated = products.map(p =>
        p.id === editingId
          ? { ...p, name: newName.trim(), price: parseFloat(newPrice) || 0, stock: parseInt(newStock) || 0 }
          : p
      );
      saveProducts(updated);
    } else {
      const newProduct: Product = {
        id: Date.now().toString(),
        name: newName.trim(),
        price: parseFloat(newPrice) || 0,
        stock: parseInt(newStock) || 0,
      };
      saveProducts([newProduct, ...products]);
      showNotification(`${isBn ? 'নতুন পণ্য যোগ হয়েছে' : 'New product added'}: ${newProduct.name}`);
    }
    setShowAddForm(false);
    setEditingId(null);
    setNewName('');
    setNewPrice('');
    setNewStock('');
  };

  const handleDelete = (id: string) => {
    saveProducts(products.filter(p => p.id !== id));
  };

  const inputStyle: React.CSSProperties = {
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
  };

  return (
    <div style={{ minHeight: '100vh', background: bg, padding: '16px', paddingBottom: '100px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1 style={{ color: textColor, fontSize: '26px', fontWeight: '800', margin: 0 }}>
          {isBn ? 'পণ্য তালিকা' : 'Product List'}
        </h1>
        <button
          onClick={handleAddClick}
          style={{
            background: `linear-gradient(135deg, ${accent}, ${accent}cc)`,
            border: 'none',
            borderRadius: '12px',
            padding: '10px 16px',
            color: '#fff',
            fontWeight: '700',
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          + {isBn ? 'যোগ করুন' : 'Add'}
        </button>
      </div>

      {/* Free limit banner */}
      {!isPremium && (
        <div style={{
          background: products.length >= FREE_PRODUCT_LIMIT ? 'rgba(244,67,54,0.1)' : 'rgba(255,165,0,0.1)',
          border: `1px solid ${products.length >= FREE_PRODUCT_LIMIT ? 'rgba(244,67,54,0.3)' : 'rgba(255,165,0,0.3)'}`,
          borderRadius: '12px',
          padding: '10px 14px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          ...(shake ? { animation: 'shake 0.5s ease' } : {}),
        }}>
          <span style={{ color: products.length >= FREE_PRODUCT_LIMIT ? '#f44336' : accent, fontSize: '13px', fontWeight: '600' }}>
            {products.length}/{FREE_PRODUCT_LIMIT} {isBn ? 'পণ্য (ফ্রি সীমা)' : 'products (free limit)'}
          </span>
          {products.length >= FREE_PRODUCT_LIMIT && (
            <button
              onClick={() => setShowPremiumModal(true)}
              style={{
                background: `linear-gradient(135deg, ${accent}, ${accent}cc)`,
                border: 'none',
                borderRadius: '8px',
                padding: '6px 12px',
                color: '#fff',
                fontWeight: '700',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              {isBn ? 'আপগ্রেড করুন' : 'Upgrade'}
            </button>
          )}
        </div>
      )}

      {/* Add/Edit Form */}
      {showAddForm && (
        <div style={{
          background: cardBg,
          borderRadius: '16px',
          padding: '16px',
          marginBottom: '16px',
          border: `1px solid ${borderColor}`,
        }}>
          <h3 style={{ color: textColor, fontSize: '16px', fontWeight: '700', marginBottom: '12px', margin: '0 0 12px 0' }}>
            {editingId ? (isBn ? 'পণ্য সম্পাদনা' : 'Edit Product') : (isBn ? 'নতুন পণ্য' : 'New Product')}
          </h3>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder={isBn ? 'পণ্যের নাম *' : 'Product name *'}
            style={inputStyle}
            autoFocus
          />
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="number"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              placeholder={isBn ? 'মূল্য' : 'Price'}
              style={{ ...inputStyle, flex: 1 }}
            />
            <input
              type="number"
              value={newStock}
              onChange={(e) => setNewStock(e.target.value)}
              placeholder={isBn ? 'স্টক' : 'Stock'}
              style={{ ...inputStyle, flex: 1 }}
            />
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
            <button
              onClick={handleSave}
              disabled={!newName.trim()}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '10px',
                border: 'none',
                background: newName.trim() ? `linear-gradient(135deg, ${accent}, ${accent}cc)` : 'rgba(255,255,255,0.1)',
                color: newName.trim() ? '#fff' : subText,
                fontWeight: '700',
                fontSize: '14px',
                cursor: newName.trim() ? 'pointer' : 'not-allowed',
              }}
            >
              {isBn ? 'সংরক্ষণ' : 'Save'}
            </button>
            <button
              onClick={() => { setShowAddForm(false); setEditingId(null); }}
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

      {/* Products */}
      {products.length === 0 ? (
        <div style={{
          background: cardBg,
          borderRadius: '16px',
          padding: '40px 20px',
          textAlign: 'center',
          border: `1px solid ${borderColor}`,
        }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>📦</div>
          <p style={{ color: subText, fontSize: '15px' }}>
            {isBn ? 'এখনো কোনো পণ্য নেই' : 'No products yet'}
          </p>
        </div>
      ) : (
        products.map((product) => (
          <div
            key={product.id}
            style={{
              background: cardBg,
              borderRadius: '14px',
              padding: '14px 16px',
              marginBottom: '10px',
              border: `1px solid ${borderColor}`,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div style={{
              width: '42px', height: '42px',
              borderRadius: '10px',
              background: `${accent}22`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '20px',
              flexShrink: 0,
            }}>
              📦
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: textColor, fontWeight: '700', fontSize: '15px', marginBottom: '2px' }}>
                {product.name}
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <span style={{ color: accent, fontSize: '13px', fontWeight: '600' }}>৳{product.price}</span>
                <span style={{ color: subText, fontSize: '13px' }}>
                  {isBn ? 'স্টক: ' : 'Stock: '}{product.stock}
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
              <button
                onClick={() => handleEditClick(product)}
                style={{
                  background: `${accent}22`,
                  border: 'none',
                  borderRadius: '8px',
                  width: '34px', height: '34px',
                  color: accent,
                  cursor: 'pointer',
                  fontSize: '14px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                ✏️
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                style={{
                  background: 'rgba(244,67,54,0.1)',
                  border: 'none',
                  borderRadius: '8px',
                  width: '34px', height: '34px',
                  color: '#f44336',
                  cursor: 'pointer',
                  fontSize: '14px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                🗑️
              </button>
            </div>
          </div>
        ))
      )}

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

export default ProductList;
