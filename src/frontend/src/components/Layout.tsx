import { Home, PlusCircle, History, User, Settings } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

type Page = 'home' | 'add-sale' | 'history' | 'profile' | 'settings';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export default function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const { t } = useLanguage();

  const navItems = [
    { id: 'home' as Page, icon: Home, label: t('nav.home') },
    { id: 'add-sale' as Page, icon: PlusCircle, label: t('nav.addSale') },
    { id: 'history' as Page, icon: History, label: t('nav.history') },
    { id: 'profile' as Page, icon: User, label: t('nav.profile') },
    { id: 'settings' as Page, icon: Settings, label: t('nav.settings') },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1 overflow-y-auto pb-20">{children}</main>
      
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card shadow-lg">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex min-w-[60px] flex-col items-center gap-1 rounded-lg px-3 py-2 transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
