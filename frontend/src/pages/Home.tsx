import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { usePremiumStatus } from '../hooks/usePremiumStatus';
import ShoppingListPopup from '../components/ShoppingListPopup';
import TaskListPopup from '../components/TaskListPopup';
import TodaysSalesPopup from '../components/TodaysSalesPopup';
import AdBanner from '../components/AdBanner';
import { ShoppingCart, CheckSquare, TrendingUp, Package, Plus, BarChart2 } from 'lucide-react';

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

export default function Home() {
  const { t } = useLanguage();
  const { mode } = useTheme();
  const isDark = mode === 'dark';
  const { isActive } = usePremiumStatus();

  const [sales, setSales] = useState<Sale[]>([]);
  const [showShoppingList, setShowShoppingList] = useState(false);
  const [showTaskList, setShowTaskList] = useState(false);
  const [showTodaysSales, setShowTodaysSales] = useState(false);

  useEffect(() => {
    const load = () => {
      const stored = localStorage.getItem('sales');
      if (stored) { try { setSales(JSON.parse(stored)); } catch { /* ignore */ } }
    };
    load();
    window.addEventListener('storage', load);
    window.addEventListener('salesUpdated', load as EventListener);
    return () => {
      window.removeEventListener('storage', load);
      window.removeEventListener('salesUpdated', load as EventListener);
    };
  }, []);

  const today = new Date().toDateString();
  const todaySales = sales.filter(s => new Date(s.date).toDateString() === today);
  const todayIncome = todaySales.reduce((sum, s) => sum + (s.sellingPrice * s.quantity), 0);
  const todayProfit = todaySales.reduce((sum, s) => sum + ((s.sellingPrice - s.buyingPrice) * s.quantity), 0);
  const itemsSold = todaySales.reduce((sum, s) => sum + s.quantity, 0);

  const colorCounts: Record<string, number> = {};
  todaySales.forEach(s => {
    if (s.colorTag) colorCounts[s.colorTag] = (colorCounts[s.colorTag] || 0) + s.quantity;
  });

  const colorMap: Record<string, string> = {
    red: '#ef4444', green: '#22c55e', blue: '#3b82f6', yellow: '#eab308',
  };

  const cardBg = isDark ? 'rgba(255,255,255,0.06)' : '#ffffff';
  const cardBorder = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.07)';
  const textPrimary = isDark ? '#ffffff' : '#1a1a1a';
  const textSecondary = isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.45)';

  return (
    <div className="min-h-screen pb-4" style={{ background: isDark ? '#0f172a' : '#f1f5f9' }}>
      <div className="px-4 pt-4 max-w-lg mx-auto">

        {/* Welcome */}
        <div className="mb-5">
          <h1 className="text-2xl font-bold" style={{ color: textPrimary }}>
            {t('home')} 👋
          </h1>
          <p className="text-sm mt-0.5" style={{ color: textSecondary }}>
            {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {/* Today's Profit */}
          <div
            className="rounded-2xl p-4 flex flex-col gap-2"
            style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium" style={{ color: textSecondary }}>{t('todayProfit')}</span>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(34,197,94,0.15)' }}>
                <TrendingUp size={16} color="#22c55e" />
              </div>
            </div>
            <p className="text-xl font-bold" style={{ color: textPrimary }}>৳{todayProfit.toFixed(0)}</p>
          </div>

          {/* Total Income */}
          <div
            className="rounded-2xl p-4 flex flex-col gap-2"
            style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium" style={{ color: textSecondary }}>{t('totalIncome')}</span>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.15)' }}>
                <BarChart2 size={16} color="#3b82f6" />
              </div>
            </div>
            <p className="text-xl font-bold" style={{ color: textPrimary }}>৳{todayIncome.toFixed(0)}</p>
          </div>

          {/* Items Sold */}
          <div
            className="rounded-2xl p-4 flex flex-col gap-2"
            style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium" style={{ color: textSecondary }}>{t('itemsSold')}</span>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(249,115,22,0.15)' }}>
                <Package size={16} color="#f97316" />
              </div>
            </div>
            <p className="text-xl font-bold" style={{ color: textPrimary }}>{itemsSold} {t('pieces')}</p>
          </div>

          {/* Color breakdown */}
          <div
            className="rounded-2xl p-4"
            style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
          >
            <p className="text-xs font-medium mb-2" style={{ color: textSecondary }}>Colors</p>
            {Object.keys(colorCounts).length === 0 ? (
              <p className="text-xs" style={{ color: textSecondary }}>—</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(colorCounts).map(([color, count]) => (
                  <div key={color} className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full" style={{ background: colorMap[color] || '#888' }} />
                    <span className="text-xs font-medium" style={{ color: textPrimary }}>{count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <p className="text-sm font-semibold mb-3" style={{ color: textSecondary }}>{t('quickActions')}</p>
        <div className="grid grid-cols-3 gap-3 mb-5">
          <button
            onClick={() => setShowShoppingList(true)}
            className="rounded-2xl p-4 flex flex-col items-center gap-2 transition-all active:scale-95"
            style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.15)' }}>
              <ShoppingCart size={22} color="#3b82f6" />
            </div>
            <span className="text-xs font-medium text-center" style={{ color: textPrimary }}>{t('shoppingList')}</span>
          </button>
          <button
            onClick={() => setShowTaskList(true)}
            className="rounded-2xl p-4 flex flex-col items-center gap-2 transition-all active:scale-95"
            style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(34,197,94,0.15)' }}>
              <CheckSquare size={22} color="#22c55e" />
            </div>
            <span className="text-xs font-medium text-center" style={{ color: textPrimary }}>{t('taskList')}</span>
          </button>
          <button
            onClick={() => setShowTodaysSales(true)}
            className="rounded-2xl p-4 flex flex-col items-center gap-2 transition-all active:scale-95"
            style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(249,115,22,0.15)' }}>
              <TrendingUp size={22} color="#f97316" />
            </div>
            <span className="text-xs font-medium text-center" style={{ color: textPrimary }}>{t('todaysSales')}</span>
          </button>
        </div>

        {/* Recent Sales */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold" style={{ color: textSecondary }}>{t('todaysSales')}</p>
          <button
            onClick={() => setShowTodaysSales(true)}
            className="text-xs font-medium"
            style={{ color: '#22c55e' }}
          >
            {t('viewAll')}
          </button>
        </div>

        {todaySales.length === 0 ? (
          <div
            className="rounded-2xl p-8 flex flex-col items-center gap-2 mb-5"
            style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
          >
            <Plus size={32} color={textSecondary} />
            <p className="text-sm" style={{ color: textSecondary }}>{t('noSalesToday')}</p>
          </div>
        ) : (
          <div className="space-y-2 mb-5">
            {todaySales.slice(0, 3).map(sale => (
              <div
                key={sale.id}
                className="rounded-xl px-4 py-3 flex items-center justify-between"
                style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ background: colorMap[sale.colorTag] || '#888' }} />
                  <div>
                    <p className="text-sm font-medium" style={{ color: textPrimary }}>{sale.productName}</p>
                    <p className="text-xs" style={{ color: textSecondary }}>{sale.quantity} {sale.unit}</p>
                  </div>
                </div>
                <p className="text-sm font-bold" style={{ color: '#22c55e' }}>৳{(sale.sellingPrice * sale.quantity).toFixed(0)}</p>
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

      {/* Popups */}
      <ShoppingListPopup open={showShoppingList} onClose={() => setShowShoppingList(false)} />
      <TaskListPopup open={showTaskList} onClose={() => setShowTaskList(false)} />
      <TodaysSalesPopup open={showTodaysSales} onClose={() => setShowTodaysSales(false)} />
    </div>
  );
}
