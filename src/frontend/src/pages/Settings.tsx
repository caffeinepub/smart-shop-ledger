import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Moon, Sun, Globe, Palette, Clock } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useState, useEffect } from 'react';

export default function Settings() {
  const { theme, setTheme, themeColor, setThemeColor } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [timerEnabled, setTimerEnabledState] = useState(false);

  useEffect(() => {
    // Load timer enabled state
    try {
      const enabled = localStorage.getItem('timerEnabled');
      setTimerEnabledState(enabled === 'true');
    } catch (error) {
      console.error('Error loading timer enabled state:', error);
    }
  }, []);

  const handleTimerToggle = (checked: boolean) => {
    setTimerEnabledState(checked);
    try {
      localStorage.setItem('timerEnabled', checked.toString());
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error('Error saving timer enabled state:', error);
    }
  };

  const themeColors = [
    { id: 'red' as const, label: t('settings.themes.red'), color: 'bg-[#F42A41]' },
    { id: 'green' as const, label: t('settings.themes.green'), color: 'bg-[#006A4E]' },
    { id: 'black' as const, label: t('settings.themes.black'), color: 'bg-black' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-accent/5">
      <div className="container mx-auto max-w-2xl px-4 py-6 pb-24">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">{t('settings.title')}</h1>
          <p className="text-muted-foreground">{t('settings.subtitle')}</p>
        </div>

        <div className="space-y-6">
          {/* Appearance Section */}
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Palette className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>{t('settings.appearance')}</CardTitle>
                  <CardDescription>{t('settings.appearanceDesc')}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Dark Mode Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {theme === 'dark' ? (
                    <Moon className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <Sun className="h-5 w-5 text-muted-foreground" />
                  )}
                  <Label htmlFor="dark-mode" className="text-base">
                    {t('settings.darkMode')}
                  </Label>
                </div>
                <Switch
                  id="dark-mode"
                  checked={theme === 'dark'}
                  onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Language Section */}
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Globe className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>{t('settings.language')}</CardTitle>
                  <CardDescription>{t('settings.languageDesc')}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <button
                  onClick={() => setLanguage('en')}
                  className={`flex w-full items-center justify-between rounded-lg border-2 px-4 py-3 transition-all ${
                    language === 'en'
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <span className="font-medium">English</span>
                  {language === 'en' && (
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  )}
                </button>
                <button
                  onClick={() => setLanguage('bn')}
                  className={`flex w-full items-center justify-between rounded-lg border-2 px-4 py-3 transition-all ${
                    language === 'bn'
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <span className="font-medium">বাংলা</span>
                  {language === 'bn' && (
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  )}
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Theme Color Section */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle>{t('settings.themeColor')}</CardTitle>
              <CardDescription>{t('settings.themeColorDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {themeColors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setThemeColor(color.id)}
                    className={`flex w-full items-center gap-3 rounded-lg border-2 px-4 py-3 transition-all ${
                      themeColor === color.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className={`h-8 w-8 rounded-full ${color.color} shadow-md`} />
                    <span className="flex-1 text-left font-medium">{color.label}</span>
                    {themeColor === color.id && (
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    )}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Timer/Reminder Section */}
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>{t('settings.timer')}</CardTitle>
                  <CardDescription>{t('settings.timerDesc')}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Label htmlFor="timer-enabled" className="text-base">
                  {t('settings.enableTimer')}
                </Label>
                <Switch
                  id="timer-enabled"
                  checked={timerEnabled}
                  onCheckedChange={handleTimerToggle}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
