import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit, Save, X, Upload, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

type Page = 'home' | 'add-sale' | 'history' | 'profile' | 'settings';

interface ProfileProps {
  onNavigate: (page: Page) => void;
}

export default function Profile({ onNavigate }: ProfileProps) {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    shopName: '',
    ownerName: '',
    mobileNumber: '',
    shopAddress: '',
    shopType: '',
    profilePhoto: null as string | null,
  });

  useEffect(() => {
    // Load profile from localStorage
    const savedProfile = localStorage.getItem('shop_profile');
    if (savedProfile) {
      setFormData(JSON.parse(savedProfile));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('shop_profile', JSON.stringify(formData));
    setIsEditing(false);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profilePhoto: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto max-w-2xl px-4 py-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => onNavigate('home')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{t('profile.title')}</h1>
              <p className="text-sm text-muted-foreground">{t('profile.subtitle')}</p>
            </div>
          </div>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="mr-2 h-4 w-4" />
              {t('profile.edit')}
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                <X className="mr-2 h-4 w-4" />
                {t('profile.cancel')}
              </Button>
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                {t('profile.save')}
              </Button>
            </div>
          )}
        </div>

        <Card className="border-2">
          <CardHeader>
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={formData.profilePhoto || undefined} />
                <AvatarFallback className="bg-gradient-to-br from-orange-500 to-amber-500 text-2xl text-white">
                  {formData.shopName?.[0] || 'S'}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button variant="outline" size="sm" onClick={() => document.getElementById('profile-photo-upload')?.click()}>
                  <Upload className="mr-2 h-4 w-4" />
                  {t('profile.changePhoto')}
                </Button>
              )}
              <input
                id="profile-photo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{t('registration.shopName')}</Label>
              {isEditing ? (
                <Input
                  value={formData.shopName}
                  onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                />
              ) : (
                <p className="rounded-md border border-border bg-muted px-3 py-2">{formData.shopName || '-'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('registration.ownerName')}</Label>
              {isEditing ? (
                <Input
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                />
              ) : (
                <p className="rounded-md border border-border bg-muted px-3 py-2">{formData.ownerName || '-'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('registration.mobileNumber')}</Label>
              {isEditing ? (
                <Input
                  value={formData.mobileNumber}
                  onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                />
              ) : (
                <p className="rounded-md border border-border bg-muted px-3 py-2">{formData.mobileNumber || '-'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('registration.shopAddress')}</Label>
              {isEditing ? (
                <Textarea
                  value={formData.shopAddress}
                  onChange={(e) => setFormData({ ...formData, shopAddress: e.target.value })}
                  rows={3}
                />
              ) : (
                <p className="rounded-md border border-border bg-muted px-3 py-2">{formData.shopAddress || '-'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('registration.shopType')}</Label>
              {isEditing ? (
                <Select value={formData.shopType} onValueChange={(value) => setFormData({ ...formData, shopType: value })}>
                  <SelectTrigger>
                    <SelectValue />
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
              ) : (
                <p className="rounded-md border border-border bg-muted px-3 py-2">
                  {formData.shopType ? t(`registration.shopTypes.${formData.shopType}`) : '-'}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
