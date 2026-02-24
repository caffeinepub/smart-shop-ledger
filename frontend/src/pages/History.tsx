import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Search, Calendar as CalendarIcon, Edit, Trash2, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { useLanguage } from '../contexts/LanguageContext';
import { toast } from 'sonner';

type Page = 'home' | 'add-sale' | 'history' | 'profile' | 'settings';
type StockColor = 'red' | 'yellow' | 'green' | null;

interface HistoryProps {
  onNavigate: (page: Page) => void;
}

interface SaleRecord {
  id: string;
  itemName: string;
  wholesalePrice: number;
  sellingPrice: number;
  quantity: number;
  stockColor: StockColor;
  photo: string | null;
  date: string;
  timestamp: number;
}

export default function History({ onNavigate }: HistoryProps) {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [salesHistory, setSalesHistory] = useState<SaleRecord[]>([]);

  // Load sales from localStorage
  useEffect(() => {
    const loadSales = () => {
      try {
        const data = localStorage.getItem('sales');
        if (data) {
          const parsed: SaleRecord[] = JSON.parse(data);
          // Sort by timestamp descending (newest first)
          const sorted = parsed.sort((a, b) => b.timestamp - a.timestamp);
          setSalesHistory(sorted);
          console.log('Loaded sales from localStorage:', sorted);
        } else {
          setSalesHistory([]);
        }
      } catch (error) {
        console.error('Error loading sales:', error);
        setSalesHistory([]);
      }
    };

    loadSales();

    // Listen for storage changes
    const handleStorageChange = () => {
      loadSales();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const getStockColorClass = (color: StockColor) => {
    switch (color) {
      case 'red':
        return 'bg-red-500';
      case 'yellow':
        return 'bg-yellow-500';
      case 'green':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleDelete = (id: string) => {
    try {
      const filtered = salesHistory.filter(sale => sale.id !== id);
      localStorage.setItem('sales', JSON.stringify(filtered));
      setSalesHistory(filtered);
      toast.success('বিক্রয় মুছে ফেলা হয়েছে / Sale deleted');
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error('Error deleting sale:', error);
      toast.error('মুছতে ব্যর্থ / Failed to delete');
    }
  };

  // Filter sales
  const filteredSales = salesHistory.filter(sale => {
    const matchesSearch = sale.itemName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDate = date ? sale.date === format(date, 'yyyy-MM-dd') : true;
    return matchesSearch && matchesDate;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-accent/5">
      <div className="container mx-auto max-w-4xl px-4 py-6">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => onNavigate('home')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t('history.title')}</h1>
            <p className="text-sm text-muted-foreground">{t('history.subtitle')}</p>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6 border-2">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 sm:flex-row">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('history.searchPlaceholder')}
                  className="pl-10"
                />
              </div>

              {/* Date Filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP') : t('history.selectDate')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </CardContent>
        </Card>

        {/* Sales List */}
        <div className="space-y-4">
          {filteredSales.length === 0 ? (
            <Card className="border-2">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">{t('history.noRecords')}</p>
              </CardContent>
            </Card>
          ) : (
            filteredSales.map((sale) => {
              const profit = (sale.sellingPrice - sale.wholesalePrice) * sale.quantity;
              return (
                <Card key={sale.id} className="border-2">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {sale.stockColor && (
                          <div className={`mt-1 h-3 w-3 rounded-full ${getStockColorClass(sale.stockColor)}`} />
                        )}
                        <div>
                          <h3 className="font-semibold text-foreground">{sale.itemName}</h3>
                          <p className="text-sm text-muted-foreground">
                            {t('history.quantity')}: {sale.quantity} | {t('history.profit')}: ৳{profit.toFixed(2)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {sale.date ? format(new Date(sale.date), 'PPP') : 'No date'}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" disabled>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(sale.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
