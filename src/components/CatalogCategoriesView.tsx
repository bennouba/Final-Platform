import React, { useState, useMemo, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Save,
  X,
  Image as ImageIcon,
  Upload,
  Tag as TagIcon,
  Layers,
  Camera,
  FileImage,
  Globe,
  BarChart3,
  Store,
} from 'lucide-react';
import { enhancedDatabase } from '../utils/enhancedDatabase';
import { authManager } from '../utils/authManager';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';

interface Category {
  id: string;
  nameAr: string;
  nameEn: string;
  parentId?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  image?: string;
  backgroundImage?: string;
  productsCount: number;
  isActive: boolean;
  seoTitleAr?: string;
  seoTitleEn?: string;
  seoDescriptionAr?: string;
  seoDescriptionEn?: string;
  slug: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

interface CatalogCategoriesViewProps {
  storeData: any;
  setStoreData: (data: any) => void;
  onSave: () => void;
}

const CatalogCategoriesView: React.FC<CatalogCategoriesViewProps> = ({
  storeData,
  setStoreData,
  onSave
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'basic' | 'seo' | 'images'>('basic');
  const [merchantBusinessType, setMerchantBusinessType] = useState<string>('');

  // Get merchant business type
  useEffect(() => {
    try {
      const currentMerchant = authManager.getCurrentMerchant();
      if (currentMerchant?.businessType) {
        setMerchantBusinessType(currentMerchant.businessType);
      } else if (storeData?.businessType) {
        setMerchantBusinessType(storeData.businessType);
      }
    } catch (error) {

    }
  }, [storeData]);

  // Get business type display name
  const getBusinessTypeDisplay = (businessType: string) => {
    const businessTypes: Record<string, string> = {
      'beauty': 'الجمال والعناية',
      'fashion': 'الأزياء والملابس',
      'electronics': 'الإلكترونيات والأجهزة',
      'cleaning': 'مواد التنظيف',
      'food': 'المواد الغذائية',
      'sports': 'الرياضة واللياقة',
      'home': 'المنزل والحديقة',
      'books': 'الكتب والقرطاسية',
      'automotive': 'السيارات والدراجات',
      'jewelry': 'المجوهرات والإكسسوارات',
      'toys': 'الألعاب والهوايات',
      'health': 'الصحة والعلاج'
    };
    return businessTypes[businessType] || businessType;
  };

  // Form state
  const [categoryForm, setCategoryForm] = useState({
    nameAr: '',
    nameEn: '',
    parentId: 'main-category',
    descriptionAr: '',
    descriptionEn: '',
    image: '',
    backgroundImage: '',
    seoTitleAr: '',
    seoTitleEn: '',
    seoDescriptionAr: '',
    seoDescriptionEn: '',
    slug: '',
    sortOrder: 0,
    isActive: true,
  });


  // Image upload handlers
  const handleImageUpload = (type: 'image' | 'backgroundImage') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string;
          setCategoryForm({ ...categoryForm, [type]: imageUrl });
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  // Get categories safely
  const categories: Category[] = useMemo(() => {
    if (!storeData?.categories) return [];
    return storeData.categories.filter((cat: any) =>
      cat && typeof cat === 'object' && cat.id && cat.nameAr
    );
  }, [storeData?.categories]);

  // Filter categories based on search
  const filteredCategories = useMemo(() => {
    return categories.filter(category =>
      category.nameAr?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.nameEn?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

  const handleAddCategory = () => {
    try {
      setModalError(null);
      setEditingCategory(null);
      setActiveTab('basic');
      setCategoryForm({
        nameAr: '',
        nameEn: '',
        parentId: 'main-category',
        descriptionAr: '',
        descriptionEn: '',
        image: '',
        backgroundImage: '',
        seoTitleAr: '',
        seoTitleEn: '',
        seoDescriptionAr: '',
        seoDescriptionEn: '',
        slug: '',
        sortOrder: categories.length + 1,
        isActive: true,
      });
      setShowCategoryModal(true);
    } catch (error) {

      alert('حدث خطأ في فتح نافذة إنشاء التصنيف');
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setActiveTab('basic');
    setCategoryForm({
      nameAr: category.nameAr,
      nameEn: category.nameEn,
      parentId: category.parentId || 'main-category',
      descriptionAr: category.descriptionAr || '',
      descriptionEn: category.descriptionEn || '',
      image: category.image || '',
      backgroundImage: category.backgroundImage || '',
      seoTitleAr: category.seoTitleAr || '',
      seoTitleEn: category.seoTitleEn || '',
      seoDescriptionAr: category.seoDescriptionAr || '',
      seoDescriptionEn: category.seoDescriptionEn || '',
      slug: category.slug,
      sortOrder: category.sortOrder,
      isActive: category.isActive,
    });
    setShowCategoryModal(true);
  };

  const handleSaveCategory = async () => {
    try {
      setIsSaving(true);
      setModalError(null);

      // Validation
      if (!categoryForm.nameAr.trim()) {
        setModalError('يرجى إدخال اسم التصنيف باللغة العربية');
        setActiveTab('basic');
        return;
      }

      if (!categoryForm.nameEn.trim()) {
        setModalError('يرجى إدخال اسم التصنيف باللغة الإنجليزية');
        setActiveTab('basic');
        return;
      }

      if (!storeData) {
        setModalError('خطأ في بيانات المتجر');
        return;
      }

      // Get current merchant
      const currentMerchant = authManager.getCurrentMerchant();
      const merchantId = currentMerchant?.id || storeData?.id || 'unknown';
      
      // Create category object
      const newCategory = {
        id: editingCategory ? editingCategory.id : Date.now().toString(),
        nameAr: categoryForm.nameAr.trim(),
        nameEn: categoryForm.nameEn.trim(),
        parentId: categoryForm.parentId === '' || categoryForm.parentId === 'main-category' ? undefined : (categoryForm.parentId || undefined),
        descriptionAr: categoryForm.descriptionAr,
        descriptionEn: categoryForm.descriptionEn,
        image: categoryForm.image,
        backgroundImage: categoryForm.backgroundImage,
        productsCount: editingCategory ? editingCategory.productsCount : 0,
        isActive: categoryForm.isActive,
        seoTitleAr: categoryForm.seoTitleAr,
        seoTitleEn: categoryForm.seoTitleEn,
        seoDescriptionAr: categoryForm.seoDescriptionAr,
        seoDescriptionEn: categoryForm.seoDescriptionEn,
        slug: categoryForm.slug || categoryForm.nameEn.toLowerCase().replace(/\s+/g, '-'),
        sortOrder: categoryForm.sortOrder,
        businessType: merchantBusinessType || 'general', // ربط بنوع النشاط التجاري
        merchantId: merchantId,
        createdAt: editingCategory ? editingCategory.createdAt : new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };

      // Save to enhanced database if merchant is available
      try {
        if (currentMerchant && !editingCategory) {
          const categoryData = {
            id: newCategory.id,
            merchantId: merchantId,
            nameAr: newCategory.nameAr,
            nameEn: newCategory.nameEn,
            descriptionAr: newCategory.descriptionAr,
            businessType: merchantBusinessType || 'general',
            sortOrder: newCategory.sortOrder,
            isActive: newCategory.isActive,
            productsCount: 0,
            createdAt: newCategory.createdAt || new Date().toISOString(),
            updatedAt: newCategory.updatedAt || new Date().toISOString()
          };
          enhancedDatabase.saveCategory(categoryData);
        }
      } catch (error) {

      }

      if (editingCategory) {
        // Edit existing category
        const updatedCategories = categories.map(c =>
          c.id === editingCategory.id ? newCategory as Category : c
        );
        setStoreData({
          ...storeData,
          categories: updatedCategories,
        });
      } else {
        // Add new category
        const updatedCategories = [...categories, newCategory as Category];
        setStoreData({
          ...storeData,
          categories: updatedCategories,
        });
      }

      setShowCategoryModal(false);
      onSave();

      // Show success message
      setTimeout(() => {
        alert(editingCategory ? 'تم حفظ التغييرات بنجاح!' : 'تم إنشاء التصنيف بنجاح!');
      }, 100);

    } catch (error) {

      setModalError('فشل في حفظ التصنيف. يرجى المحاولة مرة أخرى');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا التصنيف؟')) {
      const updatedCategories = categories.filter(c => c.id !== categoryId);
      setStoreData({
        ...storeData,
        categories: updatedCategories,
      });
      onSave();
    }
  };

  const handleCloseModal = () => {
    setShowCategoryModal(false);
    setModalError(null);
    setEditingCategory(null);
    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">التصنيفات ✨</h2>
          <div className="flex items-center gap-4 mt-1">
            <p className="text-gray-600">إدارة تصنيفات متجرك مع إضافة صور وأوصاف مخصصة</p>
            {merchantBusinessType && (
              <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-1 rounded-full border border-blue-200">
                <Store className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  {getBusinessTypeDisplay(merchantBusinessType)}
                </span>
              </div>
            )}
          </div>
        </div>
        <Button
          onClick={handleAddCategory}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
        >
          <Plus className="h-4 w-4 ml-2" />
          إنشاء تصنيف جديد
        </Button>
      </div>

      {/* Empty State */}
      {categories.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TagIcon className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">ابدأ رحلتك مع التصنيفات! 🚀</h3>
            <p className="text-gray-600 mb-6">قم بإنشاء تصنيفات احترافية لمنتجاتك مع صور جذابة ووصف تفصيلي لتنظيم متجرك بشكل مثالي</p>
            <Button onClick={handleAddCategory}>
              <Plus className="h-4 w-4 ml-2" />
              ابدأ الإنشاء الآن
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Search */}
          <Card>
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="البحث في التصنيفات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Categories List */}
          <Card>
            <CardHeader>
              <CardTitle>هيكل التصنيفات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {filteredCategories
                  .filter(category => !category.parentId)
                  .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
                  .map((category) => (
                    <div key={category.id} className="border rounded-lg">
                      <div className="flex items-center justify-between p-4 hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                            <TagIcon className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{category.nameAr}</h3>
                            <p className="text-sm text-gray-600">{category.nameEn}</p>
                            <p className="text-xs text-gray-500">{category.productsCount} منتج</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={category.isActive ? 'default' : 'secondary'}>
                            {category.isActive ? 'نشط' : 'غير نشط'}
                          </Badge>
                          <Button variant="outline" size="sm" onClick={() => handleEditCategory(category)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteCategory(category.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Subcategories */}
                      {filteredCategories
                        .filter(sub => sub.parentId === category.id)
                        .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
                        .map((subcategory) => (
                          <div key={subcategory.id} className="flex items-center justify-between p-4 pl-12 border-t bg-gray-50 hover:bg-gray-100">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg flex items-center justify-center">
                                <Layers className="h-4 w-4 text-green-600" />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">{subcategory.nameAr}</h4>
                                <p className="text-sm text-gray-600">{subcategory.nameEn}</p>
                                <p className="text-xs text-gray-500">{subcategory.productsCount} منتج</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={subcategory.isActive ? 'default' : 'secondary'}>
                                {subcategory.isActive ? 'نشط' : 'غير نشط'}
                              </Badge>
                              <Button variant="outline" size="sm" onClick={() => handleEditCategory(subcategory)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteCategory(subcategory.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Enhanced Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4 overflow-y-auto">
          <div className="bg-white rounded-lg w-full max-w-5xl max-h-[95vh] overflow-hidden shadow-2xl relative">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
              <h3 className="text-xl font-bold text-gray-900">
                إنشاء تصنيف جديد ✨
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCloseModal}
                className="hover:bg-red-100 hover:text-red-600"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Modal Tabs */}
            <div className="border-b border-gray-200">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('basic')}
                  className={`px-6 py-3 text-sm font-medium border-b-2 ${
                    activeTab === 'basic'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  المعلومات الأساسية
                </button>
                <button
                  onClick={() => setActiveTab('images')}
                  className={`px-6 py-3 text-sm font-medium border-b-2 ${
                    activeTab === 'images'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  الصور والوسائط
                </button>
                <button
                  onClick={() => setActiveTab('seo')}
                  className={`px-6 py-3 text-sm font-medium border-b-2 ${
                    activeTab === 'seo'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  تحسين محركات البحث
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(95vh-200px)] min-h-[400px]">
              {modalError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <div className="text-red-500 ml-3">⚠️</div>
                    <div className="flex-1">
                      <p className="text-red-800 font-medium">خطأ</p>
                      <p className="text-red-600 text-sm">{modalError}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setModalError(null)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Basic Information Tab */}
              {activeTab === 'basic' && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <p className="text-gray-600">تحكم في تصنيفات متجرك وأضف صورها أو أوصافها</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Arabic Name */}
                    <div>
                      <Label htmlFor="nameAr">اسم التصنيف باللغة العربية *</Label>
                      <Input
                        id="nameAr"
                        value={categoryForm.nameAr}
                        onChange={(e) => setCategoryForm({ ...categoryForm, nameAr: e.target.value })}
                        placeholder="أدخل اسم التصنيف بالعربية"
                        className="mt-1"
                      />
                    </div>

                    {/* English Name */}
                    <div>
                      <Label htmlFor="nameEn">اسم التصنيف باللغة الإنجليزية *</Label>
                      <Input
                        id="nameEn"
                        value={categoryForm.nameEn}
                        onChange={(e) => setCategoryForm({ ...categoryForm, nameEn: e.target.value })}
                        placeholder="Enter category name in English"
                        className="mt-1"
                      />
                    </div>

                    {/* Parent Category */}
                    <div>
                      <Label htmlFor="parentId">التصنيف الرئيسي</Label>
                      <Select value={categoryForm.parentId} onValueChange={(value) => setCategoryForm({ ...categoryForm, parentId: value })}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="البحث عن التصنيف الرئيسي" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="main-category">تصنيف رئيسي</SelectItem>
                          {categories.filter(c => !c.parentId).map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.nameAr}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Sort Order */}
                    <div>
                      <Label htmlFor="sortOrder">ترتيب العرض</Label>
                      <Input
                        id="sortOrder"
                        type="number"
                        value={categoryForm.sortOrder}
                        onChange={(e) => setCategoryForm({ ...categoryForm, sortOrder: Number(e.target.value) })}
                        placeholder="0"
                        className="mt-1"
                      />
                    </div>

                    {/* Arabic Description */}
                    <div className="md:col-span-2">
                      <Label htmlFor="descriptionAr">وصف صورة التصنيف بالعربية</Label>
                      <Textarea
                        id="descriptionAr"
                        value={categoryForm.descriptionAr}
                        onChange={(e) => setCategoryForm({ ...categoryForm, descriptionAr: e.target.value })}
                        placeholder="وصف مختصر للتصنيف باللغة العربية"
                        rows={3}
                        className="mt-1"
                      />
                    </div>

                    {/* English Description */}
                    <div className="md:col-span-2">
                      <Label htmlFor="descriptionEn">وصف صورة التصنيف بالإنجليزية</Label>
                      <Textarea
                        id="descriptionEn"
                        value={categoryForm.descriptionEn}
                        onChange={(e) => setCategoryForm({ ...categoryForm, descriptionEn: e.target.value })}
                        placeholder="Brief category description in English"
                        rows={3}
                        className="mt-1"
                      />
                    </div>

                    {/* Active Checkbox */}
                    <div className="md:col-span-2 flex items-center space-x-3">
                      <Checkbox
                        id="isActive"
                        checked={categoryForm.isActive}
                        onCheckedChange={(checked) => setCategoryForm({ ...categoryForm, isActive: checked as boolean })}
                      />
                      <Label htmlFor="isActive">تصنيف نشط وقابل للعرض في المتجر</Label>
                    </div>
                  </div>
                </div>
              )}

              {/* Images Tab */}
              {activeTab === 'images' && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <p className="text-gray-600">أضف صور جذابة للتصنيف لتحسين مظهر متجرك</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Category Image */}
                    <div>
                      <Label className="text-base font-medium mb-3 block">صورة التصنيف</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                        {categoryForm.image ? (
                          <div className="space-y-4">
                            <img
                              src={categoryForm.image}
                              alt="Category"
                              className="w-full max-w-xs mx-auto h-32 object-cover rounded"
                            />
                            <div className="flex gap-2 justify-center">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleImageUpload('image')}
                              >
                                <Camera className="h-4 w-4 ml-2" />
                                تغيير الصورة
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCategoryForm({ ...categoryForm, image: '' })}
                                className="text-red-600 hover:text-red-700"
                              >
                                حذف
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                              <ImageIcon className="h-8 w-8 text-gray-400" />
                            </div>
                            <div>
                              <Button
                                variant="outline"
                                onClick={() => handleImageUpload('image')}
                                className="mb-2"
                              >
                                <Upload className="h-4 w-4 ml-2" />
                                رفع الصورة
                              </Button>
                              <p className="text-sm text-gray-600">
                                أو اسحب وأفلت الملف هنا
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                PNG, JPEG, JPG
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Background Image */}
                    <div>
                      <Label className="text-base font-medium mb-3 block">الصورة الخلفية للتصنيف</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                        {categoryForm.backgroundImage ? (
                          <div className="space-y-4">
                            <img
                              src={categoryForm.backgroundImage}
                              alt="Background"
                              className="w-full max-w-xs mx-auto h-32 object-cover rounded"
                            />
                            <div className="flex gap-2 justify-center">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleImageUpload('backgroundImage')}
                              >
                                <Camera className="h-4 w-4 ml-2" />
                                تغيير الصورة الخلفية
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCategoryForm({ ...categoryForm, backgroundImage: '' })}
                                className="text-red-600 hover:text-red-700"
                              >
                                حذف
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                              <FileImage className="h-8 w-8 text-gray-400" />
                            </div>
                            <div>
                              <Button
                                variant="outline"
                                onClick={() => handleImageUpload('backgroundImage')}
                                className="mb-2"
                              >
                                <Upload className="h-4 w-4 ml-2" />
                                رفع الصورة الخلفية
                              </Button>
                              <p className="text-sm text-gray-600">
                                أو اسحب وأفلت الملف هنا
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                PNG, JPEG, JPG
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SEO Tab */}
              {activeTab === 'seo' && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <p className="text-gray-600">حسّن ظهور تصنيفك في نتائج البحث</p>
                  </div>

                  <div className="space-y-6">
                    {/* SEO Titles */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="seoTitleAr">عنوان صفحة التصنيف بالعربية</Label>
                        <Input
                          id="seoTitleAr"
                          value={categoryForm.seoTitleAr}
                          onChange={(e) => setCategoryForm({ ...categoryForm, seoTitleAr: e.target.value })}
                          placeholder="عنوان محسن لمحركات البحث"
                          className="mt-1"
                        />
                        <p className="text-xs text-gray-600 mt-1">عدد الأحرف: {categoryForm.seoTitleAr.length}/70</p>
                      </div>

                      <div>
                        <Label htmlFor="seoTitleEn">عنوان صفحة التصنيف بالإنجليزية</Label>
                        <Input
                          id="seoTitleEn"
                          value={categoryForm.seoTitleEn}
                          onChange={(e) => setCategoryForm({ ...categoryForm, seoTitleEn: e.target.value })}
                          placeholder="SEO optimized title"
                          className="mt-1"
                        />
                        <p className="text-xs text-gray-600 mt-1">عدد الأحرف: {categoryForm.seoTitleEn.length}/70</p>
                      </div>
                    </div>

                    {/* SEO Descriptions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="seoDescriptionAr">وصف صفحة التصنيف بالعربية</Label>
                        <Textarea
                          id="seoDescriptionAr"
                          value={categoryForm.seoDescriptionAr}
                          onChange={(e) => setCategoryForm({ ...categoryForm, seoDescriptionAr: e.target.value })}
                          placeholder="وصف محسن لمحركات البحث باللغة العربية"
                          rows={4}
                          className="mt-1"
                        />
                        <p className="text-xs text-gray-600 mt-1">عدد الأحرف: {categoryForm.seoDescriptionAr.length}/320</p>
                      </div>

                      <div>
                        <Label htmlFor="seoDescriptionEn">وصف صفحة التصنيف بالإنجليزية</Label>
                        <Textarea
                          id="seoDescriptionEn"
                          value={categoryForm.seoDescriptionEn}
                          onChange={(e) => setCategoryForm({ ...categoryForm, seoDescriptionEn: e.target.value })}
                          placeholder="SEO optimized description in English"
                          rows={4}
                          className="mt-1"
                        />
                        <p className="text-xs text-gray-600 mt-1">عدد الأحرف: {categoryForm.seoDescriptionEn.length}/320</p>
                      </div>
                    </div>

                    {/* Slug */}
                    <div>
                      <Label htmlFor="slug">إنشاء رابط للتصنيف</Label>
                      <div className="flex gap-2 mt-1">
                        <span className="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded">
                          eshro.com/categories/
                        </span>
                        <Input
                          id="slug"
                          value={categoryForm.slug}
                          onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                          placeholder="category-name"
                          className="flex-1"
                        />
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        الرابط النهائي: eshro.com/categories/{categoryForm.slug || 'category-name'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50">
              <Button variant="outline" onClick={handleCloseModal}>
                إلغاء
              </Button>
              <Button
                onClick={handleSaveCategory}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                disabled={!categoryForm.nameAr.trim() || !categoryForm.nameEn.trim() || isSaving}
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 ml-2" />
                    إنشاء التصنيف
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { CatalogCategoriesView };
