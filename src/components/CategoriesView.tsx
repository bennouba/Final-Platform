import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { Plus, Edit, Trash2, Save, Search, Image as ImageIcon, RefreshCw, EyeOff, Eye, FolderOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { ImageGalleryModal } from './ImageGalleryModal';
import { handleImageError } from '@/utils/imageUtils';
import { merchantCategoriesApi, MerchantCategory, CategoryPayload } from '@/services/merchantCategories';

interface ProductCategory {
  id: string;
  name: string;
  productsCount: number;
  isActive: boolean;
  createdAt?: string;
  image?: string;
  backgroundImage?: string;
}

interface StoreData {
  id: string;
  nameAr: string;
  email: string;
  categories?: ProductCategory[];
}

interface CategoriesViewProps {
  storeData: StoreData | null;
  setStoreData: (data: StoreData | null) => void;
  onSave: () => void;
}

interface CategoryForm {
  name: string;
  nameAr: string;
  description: string;
  image: string;
  sortOrder: number;
  isActive: boolean;
}

const createDefaultForm = (): CategoryForm => ({
  name: '',
  nameAr: '',
  description: '',
  image: '',
  sortOrder: 0,
  isActive: true,
});

const CategoriesView: React.FC<CategoriesViewProps> = ({ storeData, setStoreData, onSave }) => {
  const [categories, setCategories] = useState<MerchantCategory[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageGalleryOpen, setIsImageGalleryOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MerchantCategory | null>(null);
  const [form, setForm] = useState<CategoryForm>(() => createDefaultForm());
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const syncStoreCategories = useCallback((records: MerchantCategory[]) => {
    if (!storeData) {
      return;
    }
    const mapped: ProductCategory[] = records.map((record) => {
      const result: ProductCategory = {
        id: String(record.id),
        name: record.name,
        productsCount: 0,
        isActive: record.isActive,
      };
      if (record.createdAt) {
        result.createdAt = record.createdAt;
      }
      if (record.image) {
        result.image = record.image;
      }
      return result;
    });
    setStoreData({
      ...storeData,
      categories: mapped,
    });
    if (records.length > 0) {
      setSyncMessage('تمت مزامنة التصنيفات مع الخادم');
      if (typeof window !== 'undefined') {
        window.setTimeout(() => setSyncMessage(null), 2500);
      }
    }
  }, [setStoreData, storeData]);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await merchantCategoriesApi.list({ includeInactive: true });
      setCategories(data);
      syncStoreCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذر تحميل التصنيفات');
    } finally {
      setLoading(false);
    }
  }, [syncStoreCategories]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) {
      return categories;
    }
    const query = searchTerm.toLowerCase();
    return categories.filter((category) => {
      const nameMatch = category.name?.toLowerCase().includes(query);
      const nameArMatch = category.nameAr?.toLowerCase().includes(query);
      return nameMatch || nameArMatch;
    });
  }, [categories, searchTerm]);

  const metrics = useMemo(() => {
    const total = categories.length;
    const active = categories.filter((category) => category.isActive).length;
    const inactive = total - active;
    return { total, active, inactive };
  }, [categories]);

  const resetForm = useCallback(() => {
    setForm(createDefaultForm());
    setEditingCategory(null);
  }, []);

  // Predefined subcategories for cleaning materials business
  const CLEANING_MATERIALS_SUBCATEGORIES = [
    { nameAr: 'مستلزمات مطابخ', nameEn: 'Kitchen Supplies' },
    { nameAr: 'مستلزمات تنظيف صحون وأواني', nameEn: 'Dish & Cookware Cleaners' },
    { nameAr: 'مساحيق غسيل ملابس', nameEn: 'Laundry Powders' },
    { nameAr: 'سوائل مركزة غسيل ملابس', nameEn: 'Concentrated Laundry Liquids' },
    { nameAr: 'سوائل مركزة غسيل الصحون والأواني', nameEn: 'Concentrated Dishwashing Liquids' },
    { nameAr: 'مستلزمات العناية الشخصية', nameEn: 'Personal Care Items' },
    { nameAr: 'مستلزمات تنظيف الأرضيات والسيراميك', nameEn: 'Floor & Tile Cleaners' },
    { nameAr: 'معطرات أرضيات وملابس', nameEn: 'Floor & Fabric Fresheners' },
    { nameAr: 'مواد تجميل والبشرة', nameEn: 'Beauty & Skincare Products' },
    { nameAr: 'مستلزمات الأعياد والمناسبات', nameEn: 'Celebration & Occasion Supplies' },
    { nameAr: 'مستلزمات أطفال', nameEn: 'Children\'s Supplies' }
  ];

  const openCreateModal = () => {
    resetForm();
    // Pre-fill with first cleaning subcategory suggestion if available
    const firstSubcategory = CLEANING_MATERIALS_SUBCATEGORIES[0];
    if (firstSubcategory) {
      setForm(prev => ({
        ...prev,
        nameAr: firstSubcategory.nameAr,
        name: firstSubcategory.nameEn
      }));
    }
    setIsModalOpen(true);
  };

  const openEditModal = (category: MerchantCategory) => {
    setEditingCategory(category);
    setForm({
      name: category.name,
      nameAr: category.nameAr || '',
      description: category.description || '',
      image: category.image || '',
      sortOrder: category.sortOrder,
      isActive: category.isActive,
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (field: keyof CategoryForm) => (event: ChangeEvent<HTMLInputElement>) => {
    const value = field === 'sortOrder' ? Number(event.target.value) || 0 : event.target.value;
    setForm((previous) => ({ ...previous, [field]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setForm((previous) => ({ ...previous, isActive: checked }));
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSubmitting(false);
  };

  const handleImageSelect = (imageUrl: string) => {
    setForm((previous) => ({ ...previous, image: imageUrl }));
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      setError('يرجى إدخال اسم التصنيف');
      return;
    }
    const payload: CategoryPayload = {
      name: form.name.trim(),
      sortOrder: form.sortOrder,
      isActive: form.isActive,
    };
    if (form.nameAr.trim()) {
      payload.nameAr = form.nameAr.trim();
    }
    if (form.description.trim()) {
      payload.description = form.description.trim();
    }
    if (form.image.trim()) {
      payload.image = form.image.trim();
    }
    try {
      setSubmitting(true);
      setError(null);
      if (editingCategory) {
        await merchantCategoriesApi.update(editingCategory.id, payload);
      } else {
        await merchantCategoriesApi.create(payload);
      }
      await fetchCategories();
      closeModal();
      onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذر حفظ التصنيف');
      setSubmitting(false);
    }
  };

  const handleDelete = async (category: MerchantCategory) => {
    const confirmed = window.confirm('هل تريد حذف هذا التصنيف بشكل نهائي؟');
    if (!confirmed) {
      return;
    }
    try {
      setSubmitting(true);
      setError(null);
      await merchantCategoriesApi.remove(category.id);
      await fetchCategories();
      onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذر حذف التصنيف');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (category: MerchantCategory) => {
    try {
      setSubmitting(true);
      setError(null);
      await merchantCategoriesApi.update(category.id, { isActive: !category.isActive });
      await fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذر تحديث حالة التصنيف');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">إدارة التصنيفات</h2>
          <p className="text-gray-600 mt-1">إضافة تصنيفات جديدة ضمن النشاط التجاري المحدد</p>
          <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700 flex items-center gap-2">
              🎯 <span>يتم إضافة التصنيفات وفقاً للنشاط التجاري المختار في خطوات إنشاء المتجر</span>
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={fetchCategories} disabled={loading}>
            <RefreshCw className="h-4 w-4 ml-2" />
            تحديث البيانات
          </Button>
          <Button className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white shadow-lg transform hover:scale-105 transition-all duration-200" onClick={openCreateModal}>
            ✨ إنشاء تصنيف جديد ✨
          </Button>
        </div>
      </div>

      {syncMessage && (
        <Card>
          <CardContent className="p-3 text-sm text-green-700">{syncMessage}</CardContent>
        </Card>
      )}

      {error && (
        <Card>
          <CardContent className="p-3 text-sm text-red-600">{error}</CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-500">إجمالي التصنيفات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{metrics.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-500">التصنيفات النشطة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600">{metrics.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-500">التصنيفات الموقوفة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">{metrics.inactive}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="البحث بالاسم العربي أو الإنجليزي"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Predefined Cleaning Materials Subcategories */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="text-green-800 flex items-center gap-2">
            🧹 تصنيفات مواد التنظيف المقترحة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-green-700 mb-4">
            التصنيفات التالية مخصصة لنشاط "مواد تنظيف" ويمكنك إضافتها مباشرة أو تعديلها حسب احتياجاتك:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {CLEANING_MATERIALS_SUBCATEGORIES.map((subcategory, index) => (
              <div
                key={index}
                className="p-3 bg-white rounded-lg border border-green-200 hover:border-green-300 cursor-pointer transition-colors"
                onClick={() => {
                  setForm(prev => ({
                    ...prev,
                    nameAr: subcategory.nameAr,
                    name: subcategory.nameEn,
                    description: `تصنيف ${subcategory.nameAr} من مواد التنظيف`
                  }));
                  setIsModalOpen(true);
                }}
              >
                <h4 className="font-semibold text-gray-800 text-sm">{subcategory.nameAr}</h4>
                <p className="text-xs text-gray-500 mt-1">{subcategory.nameEn}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <Card>
          <CardContent className="p-6 text-center text-gray-500">جارٍ تحميل التصنيفات...</CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <Card key={category.id} className="overflow-hidden">
              <div className="h-32 bg-gray-100 flex items-center justify-center">
                {category.image ? (
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      handleImageError(e, 'indeesh');
                    }}
                  />
                ) : (
                  <ImageIcon className="h-8 w-8 text-gray-400" />
                )}
              </div>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                  <p className="text-sm text-gray-500">{category.nameAr || 'بدون ترجمة عربية'}</p>
                </div>
                <Badge variant={category.isActive ? 'default' : 'secondary'}>
                  {category.isActive ? 'نشط' : 'موقوف'}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 min-h-[40px]">
                  {category.description || 'لا يوجد وصف متاح'}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>الترتيب: {category.sortOrder}</span>
                  <span>{category.createdAt ? new Date(category.createdAt).toLocaleDateString('ar-LY') : 'غير متوفر'}</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleStatus(category)}
                    disabled={submitting}
                  >
                    {category.isActive ? <EyeOff className="h-4 w-4 ml-2" /> : <Eye className="h-4 w-4 ml-2" />}
                    {category.isActive ? 'إيقاف' : 'تفعيل'}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-blue-700 hover:bg-blue-50" onClick={() => openEditModal(category)}>
                    <Edit className="h-4 w-4 ml-2" />
                    تعديل
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-purple-700 hover:bg-purple-50"
                    onClick={() => {
                      setEditingCategory(category);
                      setForm({
                        name: category.name,
                        nameAr: category.nameAr || '',
                        description: category.description || '',
                        image: category.image || '',
                        sortOrder: category.sortOrder,
                        isActive: category.isActive,
                      });
                      setIsModalOpen(true);
                    }}
                  >
                    <ImageIcon className="h-4 w-4 ml-2" />
                    تغيير الصورة
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(category)} disabled={submitting}>
                    <Trash2 className="h-4 w-4 ml-2" />
                    حذف
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {filteredCategories.length === 0 && (
            <Card className="col-span-full">
              <CardContent className="p-8 text-center text-gray-500">لا توجد تصنيفات مطابقة لبحثك</CardContent>
            </Card>
          )}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingCategory ? 'تعديل التصنيف' : 'إضافة تصنيف جديد'}
                </h3>
                <p className="text-sm text-gray-500">تحديث بيانات التصنيف ومزامنتها مع لوحة التحكم</p>
              </div>
              <Button variant="ghost" onClick={closeModal}>إغلاق</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category-name">الاسم بالعربية</Label>
                <Input id="category-name" value={form.nameAr} onChange={handleInputChange('nameAr')} placeholder="مثال: العناية اليومية" />
              </div>
              <div>
                <Label htmlFor="category-name-en">الاسم للوصول السريع</Label>
                <Input id="category-name-en" value={form.name} onChange={handleInputChange('name')} placeholder="مثال: Daily Care" />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="category-description">الوصف</Label>
                <Input id="category-description" value={form.description} onChange={handleInputChange('description')} placeholder="شرح مختصر للتصنيف" />
              </div>
              <div>
                <Label htmlFor="category-image">صورة التصنيف</Label>
                <div className="flex gap-2">
                  <Input 
                    id="category-image" 
                    value={form.image} 
                    onChange={handleInputChange('image')} 
                    placeholder="https:// أو اختر من المعرض" 
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsImageGalleryOpen(true)}
                    className="whitespace-nowrap"
                  >
                    <FolderOpen className="h-4 w-4 ml-2" />
                    اختيار من المعرض
                  </Button>
                </div>
                {form.image && (
                  <div className="mt-2">
                    <img src={form.image} alt="معاينة الصورة" className="w-20 h-20 object-cover rounded border" />
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="category-sort">ترتيب العرض</Label>
                <Input id="category-sort" type="number" value={form.sortOrder} onChange={handleInputChange('sortOrder')} />
              </div>
              <div className="flex items-center gap-3 mt-6">
                <Checkbox checked={form.isActive} onCheckedChange={handleCheckboxChange} id="category-active" />
                <Label htmlFor="category-active">التصنيف نشط</Label>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3">
              <Button variant="outline" onClick={closeModal} disabled={submitting}>إلغاء</Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleSave} disabled={submitting}>
                <Save className="h-4 w-4 ml-2" />
                حفظ التصنيف
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Image Gallery Modal */}
      <ImageGalleryModal
        isOpen={isImageGalleryOpen}
        onClose={() => setIsImageGalleryOpen(false)}
        onImageSelect={handleImageSelect}
        storeSlug="indeesh"
        allowedExtensions={['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'tiff', 'svg']}
      />
    </div>
  );
};

export { CategoriesView };
