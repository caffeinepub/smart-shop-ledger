import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Crown } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface PremiumModalProps {
  open: boolean;
  onClose: () => void;
  onUnlock: () => void;
}

// All valid premium access codes
const VALID_PREMIUM_CODES = ['987987', '123321', '456654', '789987', '321123'];

export default function PremiumModal({ open, onClose, onUnlock }: PremiumModalProps) {
  const { t } = useLanguage();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (VALID_PREMIUM_CODES.includes(code.trim())) {
      try {
        localStorage.setItem('premiumUnlocked', 'true');
      } catch {
        // ignore
      }
      setCode('');
      setError('');
      onUnlock();
    } else {
      setError(t('settings.invalidCode'));
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) { onClose(); setCode(''); setError(''); } }}>
      <DialogContent className="mx-4 max-w-sm rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center gap-2 text-lg font-bold uppercase">
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
            value={code}
            onChange={(e) => { setCode(e.target.value); setError(''); }}
            className="rounded-xl text-center text-lg font-bold tracking-widest"
            onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
          />
          {error && (
            <p className="text-center text-sm font-semibold text-destructive">{error}</p>
          )}
          <Button
            className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 font-bold uppercase tracking-wide text-white hover:from-amber-600 hover:to-yellow-600"
            onClick={handleSubmit}
          >
            {t('settings.submit')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
