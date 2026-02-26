import React from 'react';
import BottomSheet from './BottomSheet';
import { TrendingUp, ShoppingCart } from 'lucide-react';

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

interface TodaysSalesPopupProps {
  open: boolean;
  onClose: () => void;
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

const TodaysSalesPopup: React.FC<TodaysSalesPopupProps> = ({ open, onClose }) => {
  const todaysSales = getTodaysSales();
  const totalIncome = todaysSales.reduce((sum, s) => sum + (s.sellingPrice || 0), 0);
  const totalCost = todaysSales.reduce((sum, s) => sum + (s.buyingPrice || 0), 0);
  const netProfit = totalIncome - totalCost;

  const colorDotMap: Record<string, string> = {
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    green: 'bg-green-500',
    blue: 'bg-blue-500',
  };

  return (
    <BottomSheet open={open} onClose={onClose} title="📊 আজকের বিক্রয় বিবরণ">
      <div className="px-4 py-3">
        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-green-900/30 border border-green-700/50 rounded-2xl p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingUp size={14} className="text-green-400" />
              <span className="text-xs text-green-400 font-medium">মোট ইনকাম</span>
            </div>
            <p className="text-xl font-bold text-white">৳{totalIncome.toFixed(0)}</p>
          </div>
          <div className={`border rounded-2xl p-3 ${netProfit >= 0 ? 'bg-blue-900/30 border-blue-700/50' : 'bg-red-900/30 border-red-700/50'}`}>
            <div className="flex items-center gap-1.5 mb-1">
              <ShoppingCart size={14} className={netProfit >= 0 ? 'text-blue-400' : 'text-red-400'} />
              <span className={`text-xs font-medium ${netProfit >= 0 ? 'text-blue-400' : 'text-red-400'}`}>প্রকৃত লাভ</span>
            </div>
            <p className={`text-xl font-bold ${netProfit >= 0 ? 'text-white' : 'text-red-400'}`}>
              {netProfit >= 0 ? '+' : ''}৳{netProfit.toFixed(0)}
            </p>
          </div>
        </div>

        {/* Sales list */}
        {todaysSales.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <ShoppingCart size={40} className="mx-auto mb-2 opacity-40" />
            <p>আজ কোনো বিক্রয় নেই</p>
          </div>
        ) : (
          <>
            <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-3">
              বিক্রয় তালিকা ({todaysSales.length}টি)
            </div>
            {todaysSales.map((sale, idx) => (
              <div key={sale.id || idx} className="mb-2 bg-gray-800 rounded-2xl border border-gray-700 p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {sale.colorTag && colorDotMap[sale.colorTag] && (
                    <div className={`w-3 h-3 rounded-full ${colorDotMap[sale.colorTag]} flex-shrink-0`} />
                  )}
                  <div>
                    <p className="text-white font-medium text-sm">{sale.productName || 'পণ্য'}</p>
                    <p className="text-xs text-gray-400">{sale.quantity} {sale.unit}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-bold text-sm">+৳{sale.sellingPrice}</p>
                  {sale.buyingPrice ? (
                    <p className="text-xs text-gray-500">খরচ: ৳{sale.buyingPrice}</p>
                  ) : null}
                </div>
              </div>
            ))}

            {/* Footer totals */}
            <div className="mt-4 bg-gray-800 rounded-2xl border border-gray-700 p-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-400 text-sm">মোট বিক্রয়</span>
                <span className="text-white font-bold">৳{totalIncome.toFixed(0)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-400 text-sm">মোট খরচ</span>
                <span className="text-red-400 font-bold">-৳{totalCost.toFixed(0)}</span>
              </div>
              <div className="border-t border-gray-700 pt-2 flex justify-between">
                <span className="text-gray-300 font-semibold text-sm">প্রকৃত লাভ</span>
                <span className={`font-bold ${netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {netProfit >= 0 ? '+' : ''}৳{netProfit.toFixed(0)}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </BottomSheet>
  );
};

export default TodaysSalesPopup;
