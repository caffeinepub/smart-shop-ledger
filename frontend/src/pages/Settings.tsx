import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Globe, Palette, Code2, Crown, CheckCircle2, Upload, RotateCcw, Music2, Music, MicOff } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useClickSound } from '../hooks/useClickSound';
import DeveloperInfoModal from '../components/DeveloperInfoModal';
import PremiumModal from '../components/PremiumModal';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

// All valid premium access codes (must match PremiumModal)
const VALID_PREMIUM_CODES = ['987987', '123321', '456654', '789987', '321123'];

export default function Settings() {
  const { theme, setTheme, themeColor, setThemeColor } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { soundEnabled, setSoundEnabled, hasCustomSound, setCustomSound, resetCustomSound } = useClickSound();
  const [developerModalOpen, setDeveloperModalOpen] = useState(false);
  const [premiumModalOpen, setPremiumModalOpen] = useState(false);
  const [isPremiumUnlocked, setIsPremiumUnlocked] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoDialogOpen, setPromoDialogOpen] = useState(false);
  const soundFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      setIsPremiumUnlocked(localStorage.getItem('premiumUnlocked') === 'true');
    } catch {
      setIsPremiumUnlocked(false);
    }
  }, []);

  const handlePremiumUnlock = () => {
    setIsPremiumUnlocked(true);
    setPremiumModalOpen(false);
    window.dispatchEvent(new Event('storage'));
  };

  const handlePromoSubmit = () => {
    if (VALID_PREMIUM_CODES.includes(promoCode.trim())) {
      try {
        localStorage.setItem('premiumUnlocked', 'true');
      } catch {
        // ignore
      }
      setIsPremiumUnlocked(true);
      setPromoDialogOpen(false);
      setPromoCode('');
      setPromoError('');
      window.dispatchEvent(new Event('storage'));
    } else {
      setPromoError(t('settings.invalidCode'));
    }
  };

  const handleSoundFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      if (dataUrl) {
        setCustomSound(dataUrl);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
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
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">{t('settings.title')}</h1>
          <p className="text-muted-foreground">{t('settings.subtitle')}</p>
        </div>

        <div className="space-y-4">
          {/* ── Appearance Section ── */}
          <Card className="overflow-hidden rounded-2xl border border-border shadow-sm">
            <CardHeader className="border-b border-border/50 bg-secondary/20 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15">
                  <Palette className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-sm font-bold uppercase tracking-wider">{t('settings.appearance')}</CardTitle>
                  <CardDescription className="text-xs">{t('settings.appearanceDesc')}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5 px-5 py-4">
              {/* Sun/Moon Dark Mode Toggle */}
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold uppercase tracking-wide">
                  {t('settings.darkMode')}
                </Label>
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="relative flex h-10 w-20 items-center rounded-full border-2 border-border bg-secondary p-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  aria-label="Toggle dark mode"
                >
                  <span className="absolute left-2 flex h-6 w-6 items-center justify-center text-base">☀️</span>
                  <span className="absolute right-2 flex h-6 w-6 items-center justify-center text-base">🌙</span>
                  <span
                    className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full bg-primary shadow-md transition-all duration-300"
                    style={{
                      transform: theme === 'dark' ? 'translateX(38px)' : 'translateX(0px)',
                    }}
                  >
                    <span className="text-sm">{theme === 'dark' ? '🌙' : '☀️'}</span>
                  </span>
                </button>
              </div>

              {/* Theme Color */}
              <div>
                <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground">{t('settings.themeColor')}</p>
                <div className="space-y-2">
                  {themeColors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setThemeColor(color.id)}
                      className={`flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3 transition-all ${
                        themeColor === color.id
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50 hover:bg-secondary/50'
                      }`}
                    >
                      <div className={`h-7 w-7 rounded-full ${color.color} shadow-md`} />
                      <span className="flex-1 text-left text-sm font-semibold">{color.label}</span>
                      {themeColor === color.id && (
                        <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ── Language Section ── */}
          <Card className="overflow-hidden rounded-2xl border border-border shadow-sm">
            <CardHeader className="border-b border-border/50 bg-secondary/20 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15">
                  <Globe className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-sm font-bold uppercase tracking-wider">{t('settings.language')}</CardTitle>
                  <CardDescription className="text-xs">{t('settings.languageDesc')}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 px-5 py-4">
              <button
                onClick={() => setLanguage('en')}
                className={`flex w-full items-center justify-between rounded-xl border-2 px-4 py-3 transition-all ${
                  language === 'en'
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50 hover:bg-secondary/50'
                }`}
              >
                <span className="text-sm font-semibold">ENGLISH</span>
                {language === 'en' && <div className="h-2.5 w-2.5 rounded-full bg-primary" />}
              </button>
              <button
                onClick={() => setLanguage('bn')}
                className={`flex w-full items-center justify-between rounded-xl border-2 px-4 py-3 transition-all ${
                  language === 'bn'
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50 hover:bg-secondary/50'
                }`}
              >
                <span className="text-sm font-semibold">বাংলা</span>
                {language === 'bn' && <div className="h-2.5 w-2.5 rounded-full bg-primary" />}
              </button>
            </CardContent>
          </Card>

          {/* ── Sound Control Section ── */}
          <Card className="overflow-hidden rounded-2xl border border-border shadow-sm">
            <CardHeader className="border-b border-border/50 bg-secondary/20 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${
                  soundEnabled ? 'bg-primary/15' : 'bg-muted/40'
                }`}>
                  {soundEnabled ? (
                    <Music2 className="h-4 w-4 text-primary" />
                  ) : (
                    <MicOff className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <CardTitle className="text-sm font-bold uppercase tracking-wider">{t('settings.soundControl')}</CardTitle>
                  <CardDescription className="text-xs">{t('settings.soundControlDesc')}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 px-5 py-4">
              {/* Redesigned Sound ON/OFF toggle button */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold uppercase tracking-wide text-foreground">
                    {t('settings.soundEnabled')}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {soundEnabled
                      ? (language === 'bn' ? 'সাউন্ড চালু আছে' : 'Sound is ON')
                      : (language === 'bn' ? 'সাউন্ড বন্ধ আছে' : 'Sound is OFF')}
                  </span>
                </div>
                {/* Custom pill-style sound toggle */}
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`relative flex h-14 w-28 items-center justify-between overflow-hidden rounded-2xl border-2 px-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                    soundEnabled
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-secondary/50'
                  }`}
                  aria-label="Toggle sound"
                >
                  {/* OFF side */}
                  <span className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300 ${
                    !soundEnabled ? 'bg-muted-foreground/20' : 'opacity-30'
                  }`}>
                    <MicOff className={`h-5 w-5 transition-colors ${!soundEnabled ? 'text-foreground' : 'text-muted-foreground'}`} />
                  </span>
                  {/* ON side */}
                  <span className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300 ${
                    soundEnabled ? 'bg-primary shadow-md' : 'opacity-30'
                  }`}>
                    <Music className={`h-5 w-5 transition-colors ${soundEnabled ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                  </span>
                </button>
              </div>

              {/* Custom sound upload */}
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {hasCustomSound ? t('settings.customSoundActive') : t('settings.uploadCustomSound')}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-2 rounded-xl border-2 text-xs font-bold uppercase"
                    onClick={() => soundFileRef.current?.click()}
                    disabled={!soundEnabled}
                  >
                    <Upload className="h-3.5 w-3.5" />
                    {t('settings.uploadCustomSound')}
                  </Button>
                  {hasCustomSound && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 rounded-xl border-2 text-xs font-bold uppercase text-destructive hover:bg-destructive/10"
                      onClick={resetCustomSound}
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      {t('settings.resetSound')}
                    </Button>
                  )}
                </div>
                <input
                  ref={soundFileRef}
                  type="file"
                  accept="audio/mp3,audio/wav,audio/ogg,audio/*"
                  className="hidden"
                  onChange={handleSoundFileUpload}
                />
                {hasCustomSound && (
                  <p className="text-xs text-primary">✓ {t('settings.customSoundActive')}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* ── Premium Section ── */}
          <Card className={`overflow-hidden rounded-2xl border-2 shadow-sm ${
            isPremiumUnlocked
              ? 'border-amber-400 bg-gradient-to-r from-amber-50/80 to-yellow-50/80 dark:from-amber-950/30 dark:to-yellow-950/30'
              : 'border-amber-400/60 bg-gradient-to-r from-amber-50/40 to-yellow-50/40 dark:from-amber-950/10 dark:to-yellow-950/10'
          }`}>
            <CardHeader className="border-b border-amber-200/50 px-5 py-4 dark:border-amber-800/30">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400/20">
                  {isPremiumUnlocked ? (
                    <CheckCircle2 className="h-4 w-4 text-amber-600" />
                  ) : (
                    <Crown className="h-4 w-4 text-amber-600" />
                  )}
                </div>
                <div>
                  <CardTitle className="text-sm font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                    {isPremiumUnlocked ? t('settings.premiumUnlocked') : t('settings.premium')}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {isPremiumUnlocked ? t('settings.premiumUnlockedDesc') : t('settings.premiumDesc')}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-5 py-4">
              {isPremiumUnlocked ? (
                <div className="flex items-center gap-2 rounded-xl bg-amber-100/80 px-4 py-3 dark:bg-amber-900/30">
                  <CheckCircle2 className="h-5 w-5 text-amber-600" />
                  <span className="text-sm font-bold text-amber-700 dark:text-amber-400">
                    {t('settings.premiumFeaturesUnlocked')}
                  </span>
                </div>
              ) : (
                <Button
                  className="w-full gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 font-bold uppercase tracking-wide text-white shadow-md hover:from-amber-600 hover:to-yellow-600"
                  onClick={() => setPromoDialogOpen(true)}
                >
                  <Crown className="h-4 w-4" />
                  {t('settings.enterPromoCode')}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* ── Developer Section ── */}
          <Card className="overflow-hidden rounded-2xl border border-dashed border-primary/30 bg-primary/5 shadow-sm">
            <CardHeader className="border-b border-primary/10 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                  <Code2 className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-sm font-bold tracking-widest text-primary">
                    {t('settings.developerWatermark')}
                  </CardTitle>
                  <CardDescription className="text-xs">DEVELOPER</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-5 py-4">
              <Button
                variant="outline"
                className="w-full rounded-xl border-primary/40 font-bold uppercase tracking-wide text-primary hover:bg-primary/10"
                onClick={() => setDeveloperModalOpen(true)}
              >
                {t('settings.detailsButton')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Developer Info Modal */}
      <DeveloperInfoModal
        open={developerModalOpen}
        onClose={() => setDeveloperModalOpen(false)}
      />

      {/* Premium Modal (legacy, kept for compatibility) */}
      <PremiumModal
        open={premiumModalOpen}
        onClose={() => setPremiumModalOpen(false)}
        onUnlock={handlePremiumUnlock}
      />

      {/* Promo Code Dialog */}
      <Dialog open={promoDialogOpen} onOpenChange={(open) => {
        setPromoDialogOpen(open);
        if (!open) { setPromoCode(''); setPromoError(''); }
      }}>
        <DialogContent className="mx-4 max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-center text-lg font-bold uppercase">
              <Crown className="h-5 w-5 text-amber-500" />
              {t('settings.premium')}
            </DialogTitle>
            <DialogDescription className="text-center text-sm">
              {t('settings.enterPromoCode')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Input
              type="text"
              placeholder={t('settings.enterPromoCode')}
              value={promoCode}
              onChange={(e) => { setPromoCode(e.target.value); setPromoError(''); }}
              className="rounded-xl text-center text-lg font-bold tracking-widest"
              onKeyDown={(e) => { if (e.key === 'Enter') handlePromoSubmit(); }}
            />
            {promoError && (
              <p className="text-center text-sm font-semibold text-destructive">{promoError}</p>
            )}
            <Button
              className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 font-bold uppercase tracking-wide text-white hover:from-amber-600 hover:to-yellow-600"
              onClick={handlePromoSubmit}
            >
              {t('settings.submit')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
