import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Package, Plus, History as HistoryIcon } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import TimerDisplay from '../components/TimerDisplay';
import TimerModal from '../components/TimerModal';

type Page = 'home' | 'add-sale' | 'history' | 'profile' | 'settings';

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
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [showTimerModal, setShowTimerModal] = useState(false);

  useEffect(() => {
    // Load timer enabled state
    const loadTimerEnabled = () => {
      try {
        const enabled = localStorage.getItem('timerEnabled');
        setTimerEnabled(enabled === 'true');
      } catch (error) {
        console.error('Error loading timer enabled state:', error);
      }
    };

    loadTimerEnabled();

    // Listen for storage changes
    const handleStorageChange = () => {
      loadTimerEnabled();
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
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

      const todaySalesData = sales.filter(sale => sale.date === today);
      
      const profit = todaySalesData.reduce((sum, sale) => {
        const saleProfit = (sale.sellingPrice - sale.wholesalePrice) * sale.quantity;
        return sum + saleProfit;
      }, 0);

      setTodayProfit(profit);
      setTodaySales(todaySalesData.length);

      console.log('Today stats calculated:', { profit, count: todaySalesData.length });
    } catch (error) {
      console.error('Error calculating today stats:', error);
      setTodayProfit(0);
      setTodaySales(0);
    }
  };

  useEffect(() => {
    calculateTodayStats();
  }, []);

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
          {/* Today's Profit */}
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

          {/* Today's Sales */}
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
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg transition-transform group-hover:scale-110">
                    <Plus className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground">{t('home.addSale')}</h3>
                    <p className="text-sm text-muted-foreground">{t('home.addSaleDesc')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* View History */}
            <Card
              className="group cursor-pointer border-2 transition-all hover:scale-[1.02] hover:border-primary hover:shadow-xl"
              onClick={() => onNavigate('history')}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-secondary to-secondary/80 shadow-lg transition-transform group-hover:scale-110">
                    <HistoryIcon className="h-8 w-8 text-secondary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground">{t('home.viewHistory')}</h3>
                    <p className="text-sm text-muted-foreground">{t('home.viewHistoryDesc')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Timer Display */}
        {timerEnabled && (
          <div className="mb-8">
            <TimerDisplay 
              onClick={() => setShowTimerModal(true)}
              onTimerComplete={() => {
                calculateTodayStats();
              }}
            />
          </div>
        )}

        {/* Timer Modal */}
        <TimerModal open={showTimerModal} onOpenChange={setShowTimerModal} />
      </div>
    </div>
  );
}
