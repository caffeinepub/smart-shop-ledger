import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '../contexts/LanguageContext';
import { toast } from 'sonner';
import { useTimerNotification } from '../hooks/useTimerNotification';

interface TimerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TimerModal({ open, onOpenChange }: TimerModalProps) {
  const { t } = useLanguage();
  const { requestPermission } = useTimerNotification();
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const hoursNum = parseInt(hours) || 0;
    const minutesNum = parseInt(minutes) || 0;

    if (hoursNum === 0 && minutesNum === 0) {
      toast.error(t('timer.errorNoTime'));
      return;
    }

    // Request notification permission
    const granted = await requestPermission();
    if (!granted) {
      toast.error(t('timer.errorPermission'));
      return;
    }

    const durationMs = (hoursNum * 60 * 60 + minutesNum * 60) * 1000;
    const now = Date.now();

    const timerData = {
      targetTime: now + durationMs,
      startTime: now,
      duration: durationMs,
    };

    try {
      localStorage.setItem('timerData', JSON.stringify(timerData));
      toast.success(t('timer.setSuccess'));
      setHours('');
      setMinutes('');
      onOpenChange(false);

      // Trigger storage event for other components
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error('Error saving timer:', error);
      toast.error(t('timer.errorSave'));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('timer.modalTitle')}</DialogTitle>
          <DialogDescription>{t('timer.modalDescription')}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hours">{t('timer.hours')}</Label>
                <Input
                  id="hours"
                  type="number"
                  min="0"
                  max="23"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minutes">{t('timer.minutes')}</Label>
                <Input
                  id="minutes"
                  type="number"
                  min="0"
                  max="59"
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('timer.cancel')}
            </Button>
            <Button type="submit">{t('timer.setReminder')}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
