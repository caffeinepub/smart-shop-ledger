import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Search, Calendar, Trash2, TrendingUp, ShoppingCart } from 'lucide-react';
import AdMobBanner from '../components/AdMobBanner';

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

function getSales(): Sale[] {
  try {
    const data = localStorage.getItem('sales');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveSales(sales: Sale[]) {
  localStorage.setItem('sales', JSON.stringify(sales));
}

const COLOR_DOT: Record<string, string> = {
  red: 'bg-red-500',
  yellow: 'bg-yellow-500',
  green: 'bg-green-500',
  blue: 'bg-blue-500',
};

const History: React.FC = () => {
  const { t, language } = useLanguage();
  const [sales, setSales] = useState<Sale[]>([]);
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [showDateFilter, setShowDateFilter] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setSales(getSales());
  }, []);

  const today = new Date().toDateString();
  const todaysSales = sales.filter(s => new Date(s.date).toDateString() === today);
  const totalIncome = todaysSales.reduce((sum, s) => sum + (s.sellingPrice || 0), 0);
  const totalCost = todaysSales.reduce((sum, s) => sum + (s.buyingPrice || 0), 0);
  const netProfit = totalIncome - totalCost;

  const filtered = sales.filter(s => {
    const matchSearch = !search || s.productName?.toLowerCase().includes(search.toLowerCase());
    const matchDate = !dateFilter || s.date?.startsWith(dateFilter);
    return matchSearch && matchDate;
  });

  const deleteSale = (id: string) => {
    const updated = sales.filter(s => s.id !== id);
    setSales(updated);
    saveSales(updated);
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return language === 'bn'
        ? d.toLocaleDateString('bn-BD', { year: 'numeric', month: 'short', day: 'numeric' })
        : d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 pb-4">
      {/* AdMob Banner at top */}
      <AdMobBanner />

      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={22} className="text-green-400" />
          <h1 className="text-xl font-bold text-white">{t('salesHistory') || 'বিক্রয় ইতিহাস'}</h1>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t('searchSales') || 'বিক্রয় খুঁজুন...'}
            className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-9 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-green-600"
          />
        </div>

        {/* Date filter */}
        <button
          onClick={() => setShowDateFilter(!showDateFilter)}
          className="w-full flex items-center justify-between bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-gray-400 text-sm mb-3"
        >
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <span>{dateFilter || (t('filterByDate') || 'তারিখ অনুযায়ী ফিল্টার')}</span>
          </div>
          <span>{showDateFilter ? '▲' : '▼'}</span>
        </button>
        {showDateFilter && (
          <input
            type="date"
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm mb-3 focus:outline-none focus:border-green-600"
          />
        )}
      </div>

      {/* Today's Summary Cards */}
      <div className="grid grid-cols-2 gap-3 px-4 mb-4">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
          <div className="flex items-center gap-1.5 mb-1">
            <TrendingUp size={14} className="text-green-400" />
            <span className="text-xs text-green-400 font-medium">
              {language === 'bn' ? 'আজকের মোট ইনকাম' : "Today's Total Income"}
            </span>
          </div>
          <p className="text-xl font-bold text-white">৳{totalIncome.toFixed(0)}</p>
          <p className="text-xs text-gray-500 mt-0.5">Daily Gross Income</p>
        </div>
        <div className={`border rounded-2xl p-4 ${netProfit >= 0 ? 'bg-gray-900 border-gray-800' : 'bg-red-950/30 border-red-900/50'}`}>
          <div className="flex items-center gap-1.5 mb-1">
            <ShoppingCart size={14} className={netProfit >= 0 ? 'text-green-400' : 'text-red-400'} />
            <span className={`text-xs font-medium ${netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {language === 'bn' ? 'আজকের প্রকৃত লাভ' : "Today's Net Profit"}
            </span>
          </div>
          <p className={`text-xl font-bold ${netProfit >= 0 ? 'text-white' : 'text-red-400'}`}>
            {netProfit >= 0 ? '+' : ''}৳{netProfit.toFixed(0)}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">Daily Net Profit</p>
        </div>
      </div>

      {/* Sales List */}
      <div className="px-4">
        {filtered.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            <ShoppingCart size={48} className="mx-auto mb-3 opacity-30" />
            <p>{t('noSalesFound') || 'কোনো বিক্রয় পাওয়া যায়নি'}</p>
          </div>
        ) : (
          filtered.map((sale, idx) => (
            <div key={sale.id || idx} className="mb-3 bg-gray-900 border border-gray-800 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {sale.colorTag && COLOR_DOT[sale.colorTag] ? (
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 ${COLOR_DOT[sale.colorTag]}`} />
                ) : (
                  <div className="w-3 h-3 rounded-full flex-shrink-0 bg-gray-600" />
                )}
                <div className="min-w-0">
                  <p className="text-white font-semibold text-sm truncate">{sale.productName || 'পণ্য'}</p>
                  <p className="text-xs text-gray-500">
                    {sale.quantity} {sale.unit} · {sale.buyingPrice ? `৳/Piece` : `৳/Piece`}
                  </p>
                  <p className="text-xs text-gray-600">{formatDate(sale.date)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-green-400 font-bold text-sm">+৳{sale.sellingPrice}</span>
                <button
                  onClick={() => deleteSale(sale.id)}
                  className="w-8 h-8 rounded-full bg-red-900/40 flex items-center justify-center text-red-400 hover:bg-red-900/70"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default History;
