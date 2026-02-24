import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface RegistrationModalProps {
  open: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

export default function RegistrationModal({ open, onComplete, onSkip }: RegistrationModalProps) {
  console.log('[RegistrationModal] Component rendering at', new Date().toISOString(), 'open:', open);
  
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    shopName: '',
    ownerName: '',
    mobileNumber: '',
    shopAddress: '',
    shopType: '',
    profilePhoto: null as File | null,
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, profilePhoto: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[RegistrationModal] Form submitted at', new Date().toISOString());
    try {
      localStorage.setItem('shop_profile', JSON.stringify({
        ...formData,
        profilePhoto: photoPreview,
      }));
      console.log('[RegistrationModal] Shop profile saved to localStorage');
      onComplete();
    } catch (error) {
      console.error('[RegistrationModal] Failed to save shop profile:', error);
    }
  };

  const handleSkipClick = () => {
    console.log('[RegistrationModal] Skip clicked at', new Date().toISOString());
    onSkip();
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">{t('registration.title')}</DialogTitle>
          <DialogDescription>{t('registration.description')}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="shopName">{t('registration.shopName')}</Label>
            <Input
              id="shopName"
              value={formData.shopName}
              onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
              placeholder={t('registration.shopNamePlaceholder')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ownerName">{t('registration.ownerName')}</Label>
            <Input
              id="ownerName"
              value={formData.ownerName}
              onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
              placeholder={t('registration.ownerNamePlaceholder')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobileNumber">{t('registration.mobileNumber')}</Label>
            <Input
              id="mobileNumber"
              type="tel"
              value={formData.mobileNumber}
              onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
              placeholder={t('registration.mobileNumberPlaceholder')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shopAddress">{t('registration.shopAddress')}</Label>
            <Textarea
              id="shopAddress"
              value={formData.shopAddress}
              onChange={(e) => setFormData({ ...formData, shopAddress: e.target.value })}
              placeholder={t('registration.shopAddressPlaceholder')}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shopType">{t('registration.shopType')}</Label>
            <Select value={formData.shopType} onValueChange={(value) => setFormData({ ...formData, shopType: value })}>
              <SelectTrigger>
                <SelectValue placeholder={t('registration.shopTypePlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grocery">{t('registration.shopTypes.grocery')}</SelectItem>
                <SelectItem value="electronics">{t('registration.shopTypes.electronics')}</SelectItem>
                <SelectItem value="clothing">{t('registration.shopTypes.clothing')}</SelectItem>
                <SelectItem value="pharmacy">{t('registration.shopTypes.pharmacy')}</SelectItem>
                <SelectItem value="hardware">{t('registration.shopTypes.hardware')}</SelectItem>
                <SelectItem value="other">{t('registration.shopTypes.other')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t('registration.profilePhoto')}</Label>
            <div className="flex gap-2">
              <Button type="button" variant="outline" className="flex-1" onClick={() => document.getElementById('photo-upload')?.click()}>
                <Upload className="mr-2 h-4 w-4" />
                {t('registration.uploadPhoto')}
              </Button>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </div>
            {photoPreview && (
              <div className="mt-2 flex justify-center">
                <img src={photoPreview} alt="Preview" className="h-24 w-24 rounded-lg object-cover" />
              </div>
            )}
          </div>

          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button type="button" variant="outline" onClick={handleSkipClick} className="w-full sm:w-auto">
              {t('registration.skip')}
            </Button>
            <Button type="submit" className="w-full sm:w-auto">
              {t('registration.submit')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
