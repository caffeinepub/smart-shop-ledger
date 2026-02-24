import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, Upload, ArrowLeft, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCamera } from '../camera/useCamera';
import { toast } from 'sonner';

type Page = 'home' | 'add-sale' | 'history' | 'profile' | 'settings';
type StockColor = 'red' | 'yellow' | 'green' | null;

interface AddSaleProps {
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

export default function AddSale({ onNavigate }: AddSaleProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    itemName: '',
    wholesalePrice: '',
    sellingPrice: '',
    quantity: '',
  });
  const [stockColor, setStockColor] = useState<StockColor>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [showCamera, setShowCamera] = useState(false);

  const {
    isActive,
    isSupported,
    error: cameraError,
    isLoading: cameraLoading,
    startCamera,
    stopCamera,
    capturePhoto,
    videoRef,
    canvasRef,
  } = useCamera({
    facingMode: 'environment',
    quality: 0.8,
  });

  const stockColors = [
    { id: 'red' as StockColor, label: t('addSale.stockColors.red'), color: 'bg-red-500' },
    { id: 'yellow' as StockColor, label: t('addSale.stockColors.yellow'), color: 'bg-yellow-500' },
    { id: 'green' as StockColor, label: t('addSale.stockColors.green'), color: 'bg-green-500' },
  ];

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraOpen = async () => {
    setShowCamera(true);
    const success = await startCamera();
    if (!success) {
      toast.error('ক্যামেরা খুলতে ব্যর্থ / Failed to open camera');
      setShowCamera(false);
    }
  };

  const handleCameraCapture = async () => {
    const file = await capturePhoto();
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
      await stopCamera();
      setShowCamera(false);
      toast.success('ছবি সংযুক্ত হয়েছে / Photo attached');
    }
  };

  const handleCameraClose = async () => {
    await stopCamera();
    setShowCamera(false);
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
    setPhotoFile(null);
    toast.info('ছবি সরানো হয়েছে / Photo removed');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if at least one field is filled
    const hasItemName = formData.itemName.trim() !== '';
    const hasQuantity = formData.quantity.trim() !== '';
    const hasSellingPrice = formData.sellingPrice.trim() !== '';
    const hasWholesalePrice = formData.wholesalePrice.trim() !== '';
    const hasStockColor = stockColor !== null;
    const hasPhoto = photo !== null;

    if (!hasItemName && !hasQuantity && !hasSellingPrice && !hasWholesalePrice && !hasStockColor && !hasPhoto) {
      toast.error('অন্তত একটি ক্ষেত্র পূরণ করুন / Fill at least one field');
      return;
    }

    // Auto-default empty fields
    const wholesalePrice = formData.wholesalePrice.trim() === '' ? 0 : parseFloat(formData.wholesalePrice);
    const sellingPrice = formData.sellingPrice.trim() === '' ? 0 : parseFloat(formData.sellingPrice);
    const quantity = formData.quantity.trim() === '' ? 0 : parseInt(formData.quantity);
    const profit = (sellingPrice - wholesalePrice) * quantity;

    // Create sale record
    const now = new Date();
    const saleRecord: SaleRecord = {
      id: Date.now().toString(),
      itemName: formData.itemName.trim() || 'Unnamed Item',
      wholesalePrice,
      sellingPrice,
      quantity,
      stockColor: stockColor || null,
      photo,
      date: now.toISOString().split('T')[0], // YYYY-MM-DD format
      timestamp: Date.now(),
    };

    // Save to localStorage
    try {
      const existingSales = localStorage.getItem('sales');
      const salesArray: SaleRecord[] = existingSales ? JSON.parse(existingSales) : [];
      salesArray.push(saleRecord);
      localStorage.setItem('sales', JSON.stringify(salesArray));

      console.log('Sale saved successfully:', saleRecord);

      // Success feedback
      toast.success('বিক্রয় সফলভাবে সংরক্ষিত হয়েছে / Sale saved successfully');

      // Clear form
      setFormData({
        itemName: '',
        wholesalePrice: '',
        sellingPrice: '',
        quantity: '',
      });
      setStockColor(null);
      setPhoto(null);
      setPhotoFile(null);

      // Navigate to history after a short delay
      setTimeout(() => {
        onNavigate('history');
      }, 1000);
    } catch (error) {
      console.error('Error saving sale:', error);
      toast.error('বিক্রয় সংরক্ষণে ব্যর্থ / Failed to save sale');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-accent/5">
      <div className="container mx-auto max-w-2xl px-4 py-6">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => onNavigate('home')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t('addSale.title')}</h1>
            <p className="text-sm text-muted-foreground">{t('addSale.subtitle')}</p>
          </div>
        </div>

        <Card className="border-2">
          <CardHeader>
            <CardTitle>{t('addSale.formTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Item Name with Stock Color Dot */}
              <div className="space-y-2">
                <Label htmlFor="itemName">{t('addSale.itemName')}</Label>
                <div className="flex items-center gap-2">
                  {stockColor && (
                    <div className={`h-3 w-3 rounded-full ${stockColors.find(c => c.id === stockColor)?.color}`} />
                  )}
                  <Input
                    id="itemName"
                    value={formData.itemName}
                    onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                    placeholder={t('addSale.itemNamePlaceholder')}
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Stock Color Selector */}
              <div className="space-y-2">
                <Label>{t('addSale.stockStatus')}</Label>
                <div className="flex gap-3">
                  {stockColors.map((color) => (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => setStockColor(color.id)}
                      className={`flex flex-1 items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 transition-all ${
                        stockColor === color.id
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className={`h-4 w-4 rounded-full ${color.color}`} />
                      <span className="text-sm font-medium">{color.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Prices */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="wholesalePrice">{t('addSale.wholesalePrice')}</Label>
                  <Input
                    id="wholesalePrice"
                    type="number"
                    step="0.01"
                    value={formData.wholesalePrice}
                    onChange={(e) => setFormData({ ...formData, wholesalePrice: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sellingPrice">{t('addSale.sellingPrice')}</Label>
                  <Input
                    id="sellingPrice"
                    type="number"
                    step="0.01"
                    value={formData.sellingPrice}
                    onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Quantity */}
              <div className="space-y-2">
                <Label htmlFor="quantity">{t('addSale.quantity')}</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  placeholder="1"
                />
              </div>

              {/* Photo Upload */}
              <div className="space-y-2">
                <Label>{t('addSale.photo')}</Label>
                
                {!showCamera && !photo && (
                  <div className="flex gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      className="flex-1"
                      onClick={handleCameraOpen}
                      disabled={isSupported === false}
                    >
                      <Camera className="mr-2 h-4 w-4" />
                      ক্যামেরা / Camera
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      className="flex-1" 
                      onClick={() => document.getElementById('photo-upload')?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      গ্যালারি / Gallery
                    </Button>
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleGalleryChange}
                    />
                  </div>
                )}

                {/* Camera View */}
                {showCamera && (
                  <div className="space-y-3">
                    <div className="relative w-full overflow-hidden rounded-lg border-2 border-primary bg-black" style={{ aspectRatio: '4/3', minHeight: '300px' }}>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="h-full w-full object-cover"
                      />
                      <canvas ref={canvasRef} className="hidden" />
                    </div>
                    {cameraError && (
                      <p className="text-sm text-destructive">
                        {cameraError.message}
                      </p>
                    )}
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        onClick={handleCameraCapture}
                        disabled={!isActive || cameraLoading}
                        className="flex-1"
                        size="sm"
                      >
                        <Camera className="mr-2 h-4 w-4" />
                        ছবি তুলুন / Capture
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCameraClose}
                        size="sm"
                      >
                        বাতিল / Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {/* Photo Preview */}
                {photo && !showCamera && (
                  <div className="flex items-start gap-3">
                    <img src={photo} alt="Preview" className="h-32 w-32 rounded-lg object-cover border-2 border-border" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={handleRemovePhoto}
                      className="h-8 w-8"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full" size="lg">
                {t('addSale.submit')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
