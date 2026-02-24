import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Package, Plus, History as HistoryIcon, ShoppingBag, Lock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

type Page = 'home' | 'add-sale' | 'history' | 'profile' | 'settings' | 'product-list';

interface HomeProps {
  onNavigate: (page: Page) => void;
}

interface SaleRecord {
  id: string;
  itemName: string;
  wholesalePrice: number;
  sellingPrice: number;
  quantity: number;
  date: string;
  timestamp: number;
}

export default function Home({ onNavigate }: HomeProps) {
  const { t } = useLanguage();
  const [todayProfit, setTodayProfit] = useState(0);
  const [todaySales, setTodaySales] = useState(0);
  const [isPremiumUnlocked, setIsPremiumUnlocked] = useState(false);
  const [lockedShake, setLockedShake] = useState(false);

  useEffect(() => {
    const checkPremium = () => {
      try {
        setIsPremiumUnlocked(localStorage.getItem('premiumUnlocked') === 'true');
      } catch {
        setIsPremiumUnlocked(false);
      }
    };
    checkPremium();

    const handleStorageChange = () => {
      checkPremium();
      calculateTodayStats();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const calculateTodayStats = () => {
    try {
      const data = localStorage.getItem('sales');
      if (!data) {
        setTodayProfit(0);
        setTodaySales(0);
        return;
      }
      const sales: SaleRecord[] = JSON.parse(data);
      const today = new Date().toISOString().split('T')[0];
      const todaySalesData = sales.filter(sale => sale.date === today);
      const profit = todaySalesData.reduce((sum, sale) => {
        return sum + (sale.sellingPrice - sale.wholesalePrice) * sale.quantity;
      }, 0);
      setTodayProfit(profit);
      setTodaySales(todaySalesData.length);
    } catch {
      setTodayProfit(0);
      setTodaySales(0);
    }
  };

  useEffect(() => {
    calculateTodayStats();
  }, []);

  const handleProductListClick = () => {
    if (isPremiumUnlocked) {
      onNavigate('product-list');
    } else {
      setLockedShake(true);
      setTimeout(() => setLockedShake(false), 600);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-accent/5">
      <div className="container mx-auto max-w-4xl px-4 py-6 pb-24">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">{t('home.welcome')}</h1>
          <p className="text-muted-foreground">{t('home.subtitle')}</p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          <Card className="border-2 transition-shadow hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('home.todayProfit')}</p>
                  <p className="text-2xl font-bold text-foreground">৳{todayProfit.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 transition-shadow hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('home.todaySales')}</p>
                  <p className="text-2xl font-bold text-foreground">{todaySales}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-foreground">{t('home.quickActions')}</h2>
          <div className="space-y-4">
            {/* Add New Sale */}
            <Card
              className="group cursor-pointer border-2 transition-all hover:scale-[1.02] hover:border-primary hover:shadow-xl"
              onClick={() => onNavigate('add-sale')}
            >
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md transition-transform group-hover:scale-110">
                    <Plus className="h-7 w-7" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-foreground">{t('home.addSale')}</h3>
                    <p className="text-sm text-muted-foreground">{t('home.addSaleDesc')}</p>
                  </div>
                  <div className="text-muted-foreground/40 transition-transform group-hover:translate-x-1">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* View History */}
            <Card
              className="group cursor-pointer border-2 transition-all hover:scale-[1.02] hover:border-primary hover:shadow-xl"
              onClick={() => onNavigate('history')}
            >
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground shadow-md transition-transform group-hover:scale-110">
                    <HistoryIcon className="h-7 w-7" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-foreground">{t('home.viewHistory')}</h3>
                    <p className="text-sm text-muted-foreground">{t('home.viewHistoryDesc')}</p>
                  </div>
                  <div className="text-muted-foreground/40 transition-transform group-hover:translate-x-1">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product List — Premium */}
            <Card
              className={`group cursor-pointer border-2 transition-all hover:scale-[1.02] hover:shadow-xl ${
                isPremiumUnlocked
                  ? 'hover:border-amber-500 border-amber-400/60 bg-gradient-to-r from-amber-50/50 to-yellow-50/50 dark:from-amber-950/20 dark:to-yellow-950/20'
                  : 'border-dashed border-muted-foreground/30 opacity-80'
              } ${lockedShake ? 'animate-shake' : ''}`}
              onClick={handleProductListClick}
            >
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl shadow-md transition-transform group-hover:scale-110 ${
                    isPremiumUnlocked
                      ? 'bg-gradient-to-br from-amber-400 to-yellow-500 text-white'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {isPremiumUnlocked ? (
                      <ShoppingBag className="h-7 w-7" />
                    ) : (
                      <Lock className="h-7 w-7" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-foreground">{t('home.productList')}</h3>
                      {!isPremiumUnlocked && (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
                          PREMIUM
                        </span>
                      )}
                      {isPremiumUnlocked && (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
                          ✓ UNLOCKED
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {isPremiumUnlocked ? t('home.productListDesc') : t('home.premiumLocked')}
                    </p>
                  </div>
                  <div className="text-muted-foreground/40 transition-transform group-hover:translate-x-1">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
