import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, ChevronDown, ChevronUp, Pencil, Trash2, ArrowLeft, ShoppingBag, Calendar, Tag, AlignLeft, Scale } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

type Page = 'home' | 'add-sale' | 'history' | 'profile' | 'settings' | 'product-list';
type QuantityUnit = 'gram' | 'kg' | 'liter' | 'piece';

interface ProductListProps {
  onNavigate: (page: Page) => void;
}

interface Product {
  id: string;
  name: string;
  price: string;
  quantity: string;
  quantityUnit: QuantityUnit;
  date: string;
  features: string;
}

const STORAGE_KEY = 'products';

function loadProducts(): Product[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    // Migrate old products that don't have quantity/quantityUnit
    return parsed.map((p: Product & { quantity?: string; quantityUnit?: QuantityUnit }) => ({
      ...p,
      quantity: p.quantity ?? '',
      quantityUnit: p.quantityUnit ?? 'piece',
    }));
  } catch {
    return [];
  }
}

function saveProducts(products: Product[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch {
    // ignore
  }
}

const emptyForm: Omit<Product, 'id'> = {
  name: '',
  price: '',
  quantity: '',
  quantityUnit: 'piece',
  date: new Date().toISOString().split('T')[0],
  features: '',
};

export default function ProductList({ onNavigate }: ProductListProps) {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<Omit<Product, 'id'>>(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  useEffect(() => {
    setProducts(loadProducts());
  }, []);

  const unitOptions: { id: QuantityUnit; label: string }[] = [
    { id: 'gram', label: t('units.gram') },
    { id: 'kg', label: t('units.kg') },
    { id: 'liter', label: t('units.liter') },
    { id: 'piece', label: t('units.piece') },
  ];

  const getUnitLabel = (unit: QuantityUnit) =>
    unitOptions.find(u => u.id === unit)?.label ?? unit;

  const openAddForm = () => {
    setEditingProduct(null);
    setForm({ ...emptyForm, date: new Date().toISOString().split('T')[0] });
    setFormOpen(true);
  };

  const openEditForm = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      price: product.price,
      quantity: product.quantity ?? '',
      quantityUnit: product.quantityUnit ?? 'piece',
      date: product.date,
      features: product.features,
    });
    setFormOpen(true);
  };

  const handleFormSave = () => {
    if (!form.name.trim()) return;
    let updated: Product[];
    if (editingProduct) {
      updated = products.map(p =>
        p.id === editingProduct.id ? { ...editingProduct, ...form } : p
      );
    } else {
      const newProduct: Product = {
        id: Date.now().toString(),
        ...form,
      };
      updated = [newProduct, ...products];
    }
    setProducts(updated);
    saveProducts(updated);
    setFormOpen(false);
    setEditingProduct(null);
    setForm(emptyForm);
  };

  const handleDelete = (id: string) => {
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    saveProducts(updated);
    if (expandedId === id) setExpandedId(null);
    setDeleteTarget(null);
  };

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <div className="relative min-h-screen" style={{ background: 'var(--grid-bg, #f8f9fa)' }}>
      {/* Grid background pattern */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative z-10 min-h-screen bg-background/80 backdrop-blur-[1px]">
        {/* Header */}
        <div className="sticky top-0 z-20 border-b border-border bg-card/95 px-4 py-4 shadow-sm backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('home')}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-background transition-colors hover:bg-secondary"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-yellow-500">
                <ShoppingBag className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold uppercase tracking-wide text-foreground">{t('productList.title')}</h1>
                <p className="text-xs text-muted-foreground">{products.length} {t('productList.title').toLowerCase()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product List */}
        <div className="mx-auto max-w-2xl space-y-3 px-4 py-5 pb-28">
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-100 dark:bg-amber-900/30">
                <ShoppingBag className="h-10 w-10 text-amber-500" />
              </div>
              <p className="text-base font-semibold text-muted-foreground">{t('productList.noProducts')}</p>
            </div>
          ) : (
            products.map((product) => {
              const isExpanded = expandedId === product.id;
              return (
                <div
                  key={product.id}
                  className="overflow-hidden rounded-2xl border-2 border-border bg-card shadow-sm transition-all duration-200"
                  style={{
                    borderColor: isExpanded ? 'oklch(var(--primary) / 0.5)' : undefined,
                    boxShadow: isExpanded ? '0 4px 20px oklch(var(--primary) / 0.1)' : undefined,
                  }}
                >
                  {/* Collapsed row */}
                  <button
                    className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-secondary/30"
                    onClick={() => toggleExpand(product.id)}
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400/20 to-yellow-400/20">
                      <ShoppingBag className="h-6 w-6 text-amber-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-base font-bold uppercase tracking-wide text-foreground">
                        {product.name}
                      </p>
                      <div className="mt-0.5 flex items-center gap-3">
                        <span className="flex items-center gap-1 text-sm font-semibold text-primary">
                          <Tag className="h-3 w-3" />
                          ৳{product.price}
                        </span>
                        {product.quantity && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Scale className="h-3 w-3" />
                            {product.quantity} {getUnitLabel(product.quantityUnit ?? 'piece')}
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {product.date}
                        </span>
                      </div>
                    </div>
                    <div className="shrink-0 text-muted-foreground">
                      {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </div>
                  </button>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="border-t border-border/50 bg-secondary/10 px-5 py-4">
                      {product.features && (
                        <div className="mb-4">
                          <div className="mb-1 flex items-center gap-1.5">
                            <AlignLeft className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                              {t('productList.features')}
                            </span>
                          </div>
                          <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                            {product.features}
                          </p>
                        </div>
                      )}

                      <div className="mb-4 grid grid-cols-2 gap-3">
                        <div className="rounded-xl bg-background/80 px-3 py-2.5">
                          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t('productList.price')}</p>
                          <p className="mt-0.5 text-lg font-bold text-primary">৳{product.price}</p>
                        </div>
                        {product.quantity ? (
                          <div className="rounded-xl bg-background/80 px-3 py-2.5">
                            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t('addSale.quantity')}</p>
                            <p className="mt-0.5 text-sm font-semibold text-foreground">
                              {product.quantity} <span className="text-primary">{getUnitLabel(product.quantityUnit ?? 'piece')}</span>
                            </p>
                          </div>
                        ) : (
                          <div className="rounded-xl bg-background/80 px-3 py-2.5">
                            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t('productList.dateAdded')}</p>
                            <p className="mt-0.5 text-sm font-semibold text-foreground">{product.date}</p>
                          </div>
                        )}
                      </div>

                      {product.quantity && (
                        <div className="mb-4 rounded-xl bg-background/80 px-3 py-2.5">
                          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t('productList.dateAdded')}</p>
                          <p className="mt-0.5 text-sm font-semibold text-foreground">{product.date}</p>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 gap-1.5 rounded-xl border-2 text-xs font-bold uppercase"
                          onClick={() => openEditForm(product)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          {t('productList.edit')}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 gap-1.5 rounded-xl border-2 border-destructive/40 text-xs font-bold uppercase text-destructive hover:bg-destructive/10"
                          onClick={() => setDeleteTarget(product.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          {t('productList.delete')}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Floating Add Button */}
        <button
          onClick={openAddForm}
          className="fixed bottom-6 right-6 z-30 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-yellow-500 shadow-xl transition-transform hover:scale-110 active:scale-95"
        >
          <Plus className="h-8 w-8 text-white" />
        </button>
      </div>

      {/* Add/Edit Form Dialog */}
      <Dialog open={formOpen} onOpenChange={(open) => { if (!open) { setFormOpen(false); setEditingProduct(null); } }}>
        <DialogContent className="mx-4 max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold uppercase tracking-wide">
              {editingProduct ? t('productList.edit') : t('productList.addProduct')}
            </DialogTitle>
            <DialogDescription className="text-sm">
              {t('productList.subtitle')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider">{t('productList.productName')}</Label>
              <Input
                placeholder={t('productList.productNamePlaceholder')}
                value={form.name}
                onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider">{t('productList.price')}</Label>
              <Input
                type="number"
                placeholder={t('productList.pricePlaceholder')}
                value={form.price}
                onChange={(e) => setForm(f => ({ ...f, price: e.target.value }))}
                className="rounded-xl"
              />
            </div>

            {/* Quantity with Unit Selector */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider">{t('addSale.quantity')}</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="0"
                  value={form.quantity}
                  onChange={(e) => setForm(f => ({ ...f, quantity: e.target.value }))}
                  className="flex-1 rounded-xl"
                />
                {/* Unit Selector Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="flex h-10 min-w-[72px] items-center justify-between gap-1 rounded-xl border-2 border-border bg-secondary/50 px-3 text-sm font-bold uppercase tracking-wide transition-colors hover:border-primary/60 hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
                      aria-label={t('units.label')}
                    >
                      <Scale className="h-3.5 w-3.5 shrink-0 text-primary" />
                      <span className="text-xs font-bold">{getUnitLabel(form.quantityUnit)}</span>
                      <ChevronDown className="h-3 w-3 shrink-0 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="min-w-[110px] rounded-xl">
                    {unitOptions.map((unit) => (
                      <DropdownMenuItem
                        key={unit.id}
                        onClick={() => setForm(f => ({ ...f, quantityUnit: unit.id }))}
                        className={`cursor-pointer rounded-lg text-sm font-semibold ${
                          form.quantityUnit === unit.id ? 'bg-primary/10 text-primary' : ''
                        }`}
                      >
                        {unit.label}
                        {form.quantityUnit === unit.id && (
                          <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider">{t('productList.dateAdded')}</Label>
              <Input
                type="date"
                value={form.date}
                onChange={(e) => setForm(f => ({ ...f, date: e.target.value }))}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider">{t('productList.features')}</Label>
              <Textarea
                placeholder={t('productList.featuresPlaceholder')}
                value={form.features}
                onChange={(e) => setForm(f => ({ ...f, features: e.target.value }))}
                className="min-h-[80px] rounded-xl"
              />
            </div>
            <div className="flex gap-2 pt-1">
              <Button
                variant="outline"
                className="flex-1 rounded-xl font-bold uppercase"
                onClick={() => { setFormOpen(false); setEditingProduct(null); }}
              >
                {t('productList.cancel')}
              </Button>
              <Button
                className="flex-1 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 font-bold uppercase text-white hover:from-amber-600 hover:to-yellow-600"
                onClick={handleFormSave}
                disabled={!form.name.trim()}
              >
                {t('productList.save')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <AlertDialogContent className="mx-4 max-w-sm rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-bold uppercase">{t('productList.confirmDelete')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('productList.delete')}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl font-bold uppercase">{t('productList.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-xl bg-destructive font-bold uppercase text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteTarget && handleDelete(deleteTarget)}
            >
              {t('productList.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
