import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { usePremiumStatus } from '../hooks/usePremiumStatus';
import AdBanner from '../components/AdBanner';
import { Search, Trash2, Calendar, TrendingUp, DollarSign } from 'lucide-react';

interface Sale {
  id: string;
  productName: string;
  quantity: number;
  unit: string;
  sellingPrice: number;
  buyingPrice: number;
  colorTag: string;
  note: string;
  date: string;
}

export default function History() {
  const { t } = useLanguage();
  const { mode } = useTheme();
  const isDark = mode === 'dark';
  const { isActive } = usePremiumStatus();

  const [sales, setSales] = useState<Sale[]>([]);
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const load = () => {
      const stored = localStorage.getItem('sales');
      if (stored) { try { setSales(JSON.parse(stored)); } catch { /* ignore */ } }
    };
    load();
    window.addEventListener('salesUpdated', load as EventListener);
    window.addEventListener('storage', load);
    return () => {
      window.removeEventListener('salesUpdated', load as EventListener);
      window.removeEventListener('storage', load);
    };
  }, []);

  const filtered = sales.filter(s => {
    const matchSearch = s.productName.toLowerCase().includes(search.toLowerCase());
    const matchDate = dateFilter ? new Date(s.date).toDateString() === new Date(dateFilter).toDateString() : true;
    return matchSearch && matchDate;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const todayStr = new Date().toDateString();
  const todaySales = sales.filter(s => new Date(s.date).toDateString() === todayStr);
  const todayIncome = todaySales.reduce((sum, s) => sum + s.sellingPrice * s.quantity, 0);
  const todayProfit = todaySales.reduce((sum, s) => sum + (s.sellingPrice - s.buyingPrice) * s.quantity, 0);

  const handleDelete = (id: string) => {
    const updated = sales.filter(s => s.id !== id);
    setSales(updated);
    localStorage.setItem('sales', JSON.stringify(updated));
    window.dispatchEvent(new Event('salesUpdated'));
    setDeleteId(null);
  };

  const colorMap: Record<string, string> = {
    red: '#ef4444', green: '#22c55e', blue: '#3b82f6', yellow: '#eab308',
  };

  const cardBg = isDark ? 'rgba(255,255,255,0.06)' : '#ffffff';
  const cardBorder = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.07)';
  const textPrimary = isDark ? '#ffffff' : '#1a1a1a';
  const textSecondary = isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.45)';
  const inputBg = isDark ? 'rgba(255,255,255,0.08)' : '#f8f9fa';

  return (
    <div className="min-h-screen pb-4" style={{ background: isDark ? '#0f172a' : '#f1f5f9' }}>
      <div className="px-4 pt-4 max-w-lg mx-auto">

        {/* Today's Summary */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div
            className="rounded-2xl p-4"
            style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)', boxShadow: '0 4px 16px rgba(22,163,74,0.3)' }}
          >
            <div className="flex items-center gap-2 mb-1">
              <DollarSign size={14} color="rgba(255,255,255,0.8)" />
              <p className="text-xs font-medium text-white opacity-80">{t('totalIncome')}</p>
            </div>
            <p className="text-xl font-bold text-white">৳{todayIncome.toFixed(0)}</p>
          </div>
          <div
            className="rounded-2xl p-4"
            style={{ background: 'linear-gradient(135deg, #1d4ed8, #1e40af)', boxShadow: '0 4px 16px rgba(29,78,216,0.3)' }}
          >
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp size={14} color="rgba(255,255,255,0.8)" />
              <p className="text-xs font-medium text-white opacity-80">{t('netProfit')}</p>
            </div>
            <p className="text-xl font-bold text-white">৳{todayProfit.toFixed(0)}</p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex gap-2 mb-4">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: textSecondary }} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t('searchSales')}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm outline-none"
              style={{ background: inputBg, border: `1px solid ${cardBorder}`, color: textPrimary }}
            />
          </div>
          <div className="relative">
            <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: textSecondary }} />
            <input
              type="date"
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
              className="pl-9 pr-3 py-2.5 rounded-xl text-sm outline-none"
              style={{ background: inputBg, border: `1px solid ${cardBorder}`, color: textPrimary, width: '140px' }}
            />
          </div>
        </div>

        {/* Sales list */}
        {filtered.length === 0 ? (
          <div
            className="rounded-2xl p-10 flex flex-col items-center gap-2 mb-4"
            style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
          >
            <p className="text-sm" style={{ color: textSecondary }}>{t('noSalesFound')}</p>
          </div>
        ) : (
          <div className="space-y-2 mb-4">
            {filtered.map(sale => (
              <div
                key={sale.id}
                className="rounded-xl px-4 py-3"
                style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-3 h-3 rounded-full mt-1 flex-shrink-0" style={{ background: colorMap[sale.colorTag] || '#888' }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: textPrimary }}>{sale.productName}</p>
                      <p className="text-xs mt-0.5" style={{ color: textSecondary }}>
                        {sale.quantity} {sale.unit} · ৳{sale.sellingPrice}/{t('pieces')}
                      </p>
                      {sale.note && (
                        <p className="text-xs mt-0.5 truncate" style={{ color: textSecondary }}>{sale.note}</p>
                      )}
                      <p className="text-xs mt-0.5" style={{ color: textSecondary }}>
                        {new Date(sale.date).toLocaleDateString()} {new Date(sale.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 ml-2">
                    <p className="text-sm font-bold" style={{ color: '#22c55e' }}>৳{(sale.sellingPrice * sale.quantity).toFixed(0)}</p>
                    <p className="text-xs" style={{ color: textSecondary }}>
                      {t('profit')}: ৳{((sale.sellingPrice - sale.buyingPrice) * sale.quantity).toFixed(0)}
                    </p>
                    <button
                      onClick={() => setDeleteId(sale.id)}
                      className="p-1.5 rounded-lg transition-colors"
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

        {/* Ad Banner at bottom for non-premium users */}
        {!isActive && (
          <div className="mb-4">
            <AdBanner />
          </div>
        )}

      </div>

      {/* Delete Confirm Dialog */}
      {deleteId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: 'rgba(0,0,0,0.6)' }}
        >
          <div
            className="rounded-2xl p-6 w-full max-w-sm"
            style={{ background: isDark ? '#1e293b' : '#ffffff' }}
          >
            <h3 className="text-base font-bold mb-2" style={{ color: textPrimary }}>{t('deleteSale')}</h3>
            <p className="text-sm mb-5" style={{ color: textSecondary }}>{t('confirmDelete')}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: isDark ? 'rgba(255,255,255,0.1)' : '#f1f5f9', color: textPrimary }}
              >
                {t('cancel')}
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: '#ef4444', color: '#fff' }}
              >
                {t('delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
