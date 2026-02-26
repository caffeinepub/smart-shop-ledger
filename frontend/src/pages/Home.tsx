import React, { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { TrendingUp, ShoppingCart, Package, Tag, Plus, History, List, ShoppingBag } from 'lucide-react';
import TaskListPopup from '../components/TaskListPopup';
import ShoppingListPopup from '../components/ShoppingListPopup';
import TodaysSalesPopup from '../components/TodaysSalesPopup';

interface Sale {
  id: string;
  productName: string;
  quantity: number;
  unit: string;
  sellingPrice: number;
  buyingPrice?: number;
  date: string;
  colorTag?: string;
}

interface ShopProfile {
  shopName: string;
  ownerName: string;
}

function getTodaysSales(): Sale[] {
  try {
    const data = localStorage.getItem('sales');
    if (!data) return [];
    const sales: Sale[] = JSON.parse(data);
    const today = new Date().toDateString();
    return sales.filter(s => new Date(s.date).toDateString() === today);
  } catch {
    return [];
  }
}

function getShopProfile(): ShopProfile {
  try {
    const data = localStorage.getItem('shopProfile');
    if (!data) return { shopName: 'আমার দোকান', ownerName: '' };
    return JSON.parse(data);
  } catch {
    return { shopName: 'আমার দোকান', ownerName: '' };
  }
}

const COLOR_CONFIG = [
  { key: 'red', label: 'লাল', labelEn: 'Red', bg: 'bg-red-500' },
  { key: 'yellow', label: 'হলুদ', labelEn: 'Yellow', bg: 'bg-yellow-500' },
  { key: 'green', label: 'সবুজ', labelEn: 'Green', bg: 'bg-green-500' },
  { key: 'blue', label: 'নীল', labelEn: 'Blue', bg: 'bg-blue-500' },
];

const Home: React.FC = () => {
  const { t, language } = useLanguage();
  const [todaysSales, setTodaysSales] = useState<Sale[]>([]);
  const [shopProfile, setShopProfile] = useState<ShopProfile>({ shopName: '', ownerName: '' });
  const [taskPopupOpen, setTaskPopupOpen] = useState(false);
  const [shoppingPopupOpen, setShoppingPopupOpen] = useState(false);
  const [salesPopupOpen, setSalesPopupOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setTodaysSales(getTodaysSales());
    setShopProfile(getShopProfile());
  }, []);

  const totalIncome = todaysSales.reduce((sum, s) => sum + (s.sellingPrice || 0), 0);
  const totalCost = todaysSales.reduce((sum, s) => sum + (s.buyingPrice || 0), 0);
  const netProfit = totalIncome - totalCost;
  const itemsSold = todaysSales.length;

  const colorCounts = COLOR_CONFIG.reduce((acc, c) => {
    acc[c.key] = todaysSales.filter(s => s.colorTag === c.key).length;
    return acc;
  }, {} as Record<string, number>);

  const hasColorData = Object.values(colorCounts).some(v => v > 0);

  const today = new Date();
  const dateStr = language === 'bn'
    ? today.toLocaleDateString('bn-BD', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    : today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen bg-gray-950 pb-4">
      {/* Welcome Banner */}
      <div className="mx-4 mt-4 rounded-2xl bg-gradient-to-r from-green-800 to-green-700 p-4 flex items-center gap-4 shadow-lg">
        <img
          src="/assets/generated/app-logo.dim_80x80.png"
          alt="Logo"
          className="w-14 h-14 rounded-xl object-contain"
        />
        <div>
          <p className="text-green-200 text-sm">{t('welcome')}!</p>
          <h2 className="text-white text-xl font-bold">{shopProfile.shopName || t('myShop')}</h2>
          <p className="text-green-300 text-xs mt-0.5">{dateStr}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mx-4 mt-4">
        {/* Today's Profit */}
        <button
          onClick={() => setSalesPopupOpen(true)}
          className="bg-gray-900 border border-gray-800 rounded-2xl p-4 text-left hover:border-green-700 transition-colors"
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-green-400" />
            <span className="text-xs text-green-400 font-medium">{t('todayProfit')}</span>
          </div>
          <p className="text-2xl font-bold text-white">৳{netProfit.toFixed(0)}</p>
        </button>

        {/* Total Sales */}
        <button
          onClick={() => setSalesPopupOpen(true)}
          className="bg-gray-900 border border-gray-800 rounded-2xl p-4 text-left hover:border-green-700 transition-colors"
        >
          <div className="flex items-center gap-2 mb-2">
            <ShoppingCart size={16} className="text-green-400" />
            <span className="text-xs text-green-400 font-medium">{t('totalSales')}</span>
          </div>
          <p className="text-2xl font-bold text-white">৳{totalIncome.toFixed(0)}</p>
        </button>

        {/* Items Sold */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Package size={16} className="text-green-400" />
            <span className="text-xs text-green-400 font-medium">{t('itemsSold')}</span>
          </div>
          <p className="text-2xl font-bold text-white">{itemsSold}</p>
        </div>

        {/* Color Breakdown */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Tag size={16} className="text-green-400" />
            <span className="text-xs text-green-400 font-medium">{t('colorBreakdown') || 'রঙ বিভাজন'}</span>
          </div>
          {hasColorData ? (
            <div className="flex flex-wrap gap-1.5">
              {COLOR_CONFIG.map(c => colorCounts[c.key] > 0 ? (
                <div key={c.key} className="flex items-center gap-1">
                  <div className={`w-2.5 h-2.5 rounded-full ${c.bg}`} />
                  <span className="text-xs text-gray-300">{colorCounts[c.key]}</span>
                </div>
              ) : null)}
            </div>
          ) : (
            <p className="text-xs text-gray-500">{t('noSalesToday') || 'আজ কোনো বিক্রয় নেই'}</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mx-4 mt-5">
        <h3 className="text-white font-bold text-base mb-3">{t('quickActions') || 'দ্রুত কাজ'}</h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              const event = new CustomEvent('navigate', { detail: 'add-sale' });
              window.dispatchEvent(event);
            }}
            className="bg-green-700 hover:bg-green-600 rounded-2xl p-4 text-left transition-colors"
          >
            <Plus size={22} className="text-white mb-2" />
            <p className="text-white font-bold text-sm">{t('addSale')}</p>
            <p className="text-green-200 text-xs">{t('newSaleRecord')}</p>
          </button>
          <button
            onClick={() => {
              const event = new CustomEvent('navigate', { detail: 'history' });
              window.dispatchEvent(event);
            }}
            className="bg-green-700 hover:bg-green-600 rounded-2xl p-4 text-left transition-colors"
          >
            <History size={22} className="text-white mb-2" />
            <p className="text-white font-bold text-sm">{t('viewHistory')}</p>
            <p className="text-green-200 text-xs">{t('pastSales')}</p>
          </button>
          <button
            onClick={() => {
              const event = new CustomEvent('navigate', { detail: 'products' });
              window.dispatchEvent(event);
            }}
            className="bg-green-700 hover:bg-green-600 rounded-2xl p-4 text-left transition-colors"
          >
            <Package size={22} className="text-white mb-2" />
            <p className="text-white font-bold text-sm">{t('productList')}</p>
            <p className="text-green-200 text-xs">{t('manageProducts')}</p>
          </button>
          <button
            onClick={() => {
              const event = new CustomEvent('navigate', { detail: 'lists' });
              window.dispatchEvent(event);
            }}
            className="bg-green-700 hover:bg-green-600 rounded-2xl p-4 text-left transition-colors"
          >
            <List size={22} className="text-white mb-2" />
            <p className="text-white font-bold text-sm">{t('lists') || 'তালিকা'}</p>
            <p className="text-green-200 text-xs">{t('shoppingList') || 'কেনাকাটার তালিকা'}</p>
          </button>
        </div>
      </div>

      {/* Lists Section */}
      <div className="mx-4 mt-5">
        <h3 className="text-white font-bold text-base mb-3">{t('lists') || 'তালিকা'}</h3>
        <div className="grid grid-cols-2 gap-3">
          {/* Shopping List */}
          <button
            onClick={() => setShoppingPopupOpen(true)}
            className="bg-gray-900 border border-gray-800 hover:border-green-700 rounded-2xl p-4 text-left transition-colors"
          >
            <ShoppingBag size={20} className="text-green-400 mb-2" />
            <p className="text-white font-semibold text-sm">{t('shoppingList') || 'কেনাকাটার তালিকা'}</p>
            <p className="text-gray-500 text-xs mt-0.5">{t('noList') || 'কোনো তালিকা নেই'}</p>
          </button>
          {/* Task List */}
          <button
            onClick={() => setTaskPopupOpen(true)}
            className="bg-gray-900 border border-gray-800 hover:border-green-700 rounded-2xl p-4 text-left transition-colors"
          >
            <List size={20} className="text-green-400 mb-2" />
            <p className="text-white font-semibold text-sm">{t('taskList') || 'কাজের তালিকা'}</p>
            <p className="text-gray-500 text-xs mt-0.5">{t('noList') || 'কোনো তালিকা নেই'}</p>
          </button>
        </div>
      </div>

      {/* Popups */}
      <TaskListPopup open={taskPopupOpen} onClose={() => setTaskPopupOpen(false)} />
      <ShoppingListPopup open={shoppingPopupOpen} onClose={() => setShoppingPopupOpen(false)} />
      <TodaysSalesPopup open={salesPopupOpen} onClose={() => setSalesPopupOpen(false)} />
    </div>
  );
};

export default Home;
