import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { generateStoreLocally } from '@/services/localStoreGenerator';
import '@/styles/animations.css';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle,
  CreditCard,
  Globe,
  ImageIcon,
  Info,
  MapPin,
  ShoppingCart,
  Sparkles,
  Star,
  Store,
  X
} from 'lucide-react';

import WarehouseMapPicker from './MapPicker';
import { getDefaultProductImageSync } from '@/utils/imageUtils';

const canonicalSlug = (v: any) => {
  const n = (v ?? '').toString().trim().toLowerCase().replace(/\s+/g, '-');
  const alias: Record<string, string> = {
    sherine: 'sheirine',
    sheirin: 'sheirine',
    delta: 'delta-store',
    details: 'delta-store',
    detail: 'delta-store',
    megna: 'magna-beauty',
    magna: 'magna-beauty',
    magna_beauty: 'magna-beauty',
  };
  return alias[n] || n;
};

// Extend window interface for createStoreFiles function
declare global {
  interface Window {
    createStoreFiles?: (storeData: any) => void;
  }
}

interface CreateStorePageProps {
  onBack: () => void;
  onNavigateToLogin: () => void;
  onStoreCreated: (storeData: any) => void;
}

interface Product {
  id: number;
  storeId: number;
  name: string;
  nameEn: string;
  description: string;
  price: number;
  originalPrice: number;
  quantity: number;
  images: string[];
  colors: Array<{ name: string; value: string }>;
  sizes: string[];
  availableSizes: string[];
  size: string;
  rating: number;
  reviews: number;
  views: number;
  likes: number;
  orders: number;
  category: string;
  inStock: boolean;
  isAvailable: boolean;
  tags: string[];
  imageFiles?: File[];
  expiryDate?: string;
  endDate?: string;
}

interface SliderImage {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  buttonText: string;
  imageFile?: File;
}

interface StoreFormData {
  // معلومات صاحب المتجر
  ownerName: string;
  email: string;
  phone: string;
  alternateEmail?: string;

  // معلومات المتجر
  nameAr: string;
  nameEn: string;
  description: string;
  categories: string[];
  subdomain: string;

  // المستندات
  commercialRegister: File | null;
  practiceLicense: File | null;

  // الشعار
  storeLogo: File | null;

  // المنتجات
  products: any[];

  // صور السلايدر
  sliderImages: any[];

  // موقع المخزن
  warehouseAddress: string;
  warehouseCity: string;
  warehousePhone: string;
  warehouseLat?: number;
  warehouseLng?: number;
  warehouseMode?: 'own' | 'platform' | 'both';

  // بيانات الدخول
  password: string;
  confirmPassword: string;
}

const CreateStorePage: React.FC<CreateStorePageProps> = ({
  onBack,
  onNavigateToLogin,
  onStoreCreated
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<StoreFormData>({
    // معلومات صاحب المتجر
    ownerName: '',
    email: '',
    phone: '',
    alternateEmail: '',

    // معلومات المتجر
    nameAr: '',
    nameEn: '',
    description: '',
    categories: [],
    subdomain: '',

    // المستندات
    commercialRegister: null,
    practiceLicense: null,

    // الشعار
    storeLogo: null,

    // المنتجات
    products: [],

    // صور السلايدر
    sliderImages: [],

    // موقع المخزن
    warehouseAddress: '',
    warehouseCity: '',
    warehousePhone: '',
    warehouseLat: 0,
    warehouseLng: 0,
    warehouseMode: 'own',

    // بيانات الدخول
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showAccountSuccessModal, setShowAccountSuccessModal] = useState(false);
  const [showStoreSuccessModal, setShowStoreSuccessModal] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [duplicateField, setDuplicateField] = useState<'email' | 'phone' | ''>('');
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({
    name: '',
    nameEn: '',
    description: '',
    price: 0,
    originalPrice: 0,
    quantity: 0,
    images: [],
    colors: [],
    sizes: [],
    availableSizes: [],
    size: '',
    rating: 4.5,
    reviews: 0,
    category: '',
    inStock: true,
    tags: [],
    expiryDate: '',
    endDate: ''
  });
  const [currentSliderImage, setCurrentSliderImage] = useState<Partial<SliderImage>>({
    image: '',
    title: '',
    subtitle: '',
    buttonText: ''
  });
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const sliderImageInputRef = useRef<HTMLInputElement>(null);

  const storeCategories = [
    { id: 'fashion', name: 'الأزياء والملابس', icon: '👗' },
    { id: 'electronics', name: 'الإلكترونيات', icon: '📱' },
    { id: 'food', name: 'الأطعمة والمشروبات', icon: '🍔' },
    { id: 'beauty', name: 'الجمال والعناية', icon: '💄' },
    { id: 'home', name: 'المنزل والحديقة', icon: '🏠' },
    { id: 'sports', name: 'الرياضة واللياقة', icon: '⚽' },
    { id: 'books', name: 'الكتب والثقافة', icon: '📚' },
    { id: 'toys', name: 'الألعاب والأطفال', icon: '🧸' },
    { id: 'automotive', name: 'السيارات والمركبات', icon: '🚗' },
    { id: 'health', name: 'الصحة والطب', icon: '⚕️' },
    { id: 'food-supplements', name: 'المكملات الغذائية', icon: '💊' },
    { id: 'cleaning', name: 'مواد تنظيف', icon: '🧹' },
    { id: 'stationery', name: 'المكتبات والقرطاسية', icon: '📝' },
    { id: 'food-materials', name: 'مواد غذائية', icon: '🥫' },
    { id: 'home-appliances', name: 'مواد كهرومنزلية', icon: '🔌' },
    { id: 'construction', name: 'مواد بناء', icon: '🏗️' },
    { id: 'electrical', name: 'مواد كهربائية', icon: '⚡' },
    { id: 'spare-parts', name: 'قطع غيار أجهزة إلكترونية', icon: '🔧' },
    { id: 'pets', name: 'حيوانات وأكسسوارات', icon: '🐕' },
    { id: 'motorcycles', name: 'دراجات نارية', icon: '🏍️' },
    { id: 'accessories', name: 'اكسسوارات', icon: '💍' },
    { id: 'furniture', name: 'المفروشات والديكور', icon: '🛋️' }
  ];

  const categoriesRequiringExpiryDates = ['food', 'beauty', 'health', 'food-supplements', 'cleaning', 'food-materials'];
  
  const shouldShowExpiryDateFields = (categoryId: string): boolean => {
    return categoriesRequiringExpiryDates.includes(categoryId);
  };

  const benefits = [
    {
      icon: <Globe className="h-8 w-8" />,
      title: "شبكة بشكل واسعة",
      description: "شبكة بشراء وتوصيل شراء وإيمت مختلف لليبيا",
      color: "text-blue-600"
    },
    {
      icon: <CreditCard className="h-8 w-8" />,
      title: "وسائل دفع متعددة",
      description: "دعم جميع طرق الدفع المحلية",
      color: "text-green-600"
    },
    {
      icon: <Star className="h-8 w-8" />,
      title: "متجر احترافي",
      description: "تصميم عصري وتجسين استخدام",
      color: "text-purple-600"
    }
  ];

  const totalSteps = 8;
  const progressPercentage = (currentStep / totalSteps) * 100;

  const validateStep = (step: number): boolean => {

    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.ownerName.trim()) newErrors.ownerName = 'اسم صاحب المتجر مطلوب';
        if (!formData.email.trim()) newErrors.email = 'البريد الإلكتروني مطلوب';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = 'البريد الإلكتروني غير صحيح';
        }
        if (!formData.phone.trim()) newErrors.phone = 'رقم الهاتف مطلوب';
        break;

      case 2:
        if (!formData.nameAr.trim()) newErrors.nameAr = 'اسم المتجر بالعربية مطلوب';
        if (!formData.description.trim()) newErrors.description = 'وصف المتجر مطلوب';
        if (formData.categories.length === 0) newErrors.categories = 'يجب اختيار فئة واحدة على الأقل';
        if (!formData.commercialRegister) newErrors.commercialRegister = 'نسخة من السجل التجاري مطلوبة';
        if (!formData.practiceLicense) newErrors.practiceLicense = 'نسخة من رخصة المزاولة مطلوبة';
        if (!formData.subdomain.trim()) newErrors.subdomain = 'عنوان المتجر مطلوب';
        else if (!/^[a-z0-9-]+$/.test(formData.subdomain)) {
          newErrors.subdomain = 'يجب أن يحتوي عنوان المتجر على أحرف إنجليزية صغيرة وأرقام وعلامة - فقط';
        }
        break;

      case 3:
        if (!formData.password) newErrors.password = 'كلمة المرور مطلوبة';
        else if (formData.password.length < 8) {
          newErrors.password = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل';
        }
        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'كلمة المرور غير متطابقة';
        }
        if (!formData.storeLogo) newErrors.storeLogo = 'شعار المتجر مطلوب';
        break;

      case 4:
        // خطوة المراجعة - لا يوجد تحقق
        break;

      case 5:
        if (!formData.products || formData.products.length === 0) {
          newErrors.products = 'يجب إضافة منتج واحد على الأقل';
        }
        break;

      case 6:
        if (!formData.sliderImages || formData.sliderImages.length === 0) {
          newErrors.sliderImages = 'يجب إضافة صورة واحدة على الأقل للسلايدر';
        }
        break;

      case 7:
        if (!formData.warehouseAddress.trim()) {
          newErrors.warehouseAddress = 'عنوان المخزن مطلوب';
        }
        if (!formData.warehouseCity.trim()) {
          newErrors.warehouseCity = 'المدينة مطلوبة';
        }
        if (!formData.warehouseLat || !formData.warehouseLng) {
          newErrors.warehouseLocation = 'يرجى تحديد موقع المخزن على الخريطة';
        }
        break;

      case 8:
        // خطوة التأكيد - لا يوجد تحقق
        break;
    }

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;

    return isValid;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleEditProduct = (product: Product) => {
    // Check if this is a custom size that needs the 'custom:' prefix for editing
    const isCustomSize = !['1000 مل', '750 مل', '500 مل', '300 مل', '250 مل', '1 كيلو', '2.5 كيلو', '3 كيلو', '4 كيلو', '5 كيلو', '9 كيلو', '10 كيلو', '15 كيلو', '500 ملليتر', '1000 ملليتر', '15 لتر'].includes(product.size);

    setCurrentProduct({
      name: product.name,
      nameEn: product.nameEn,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice,
      quantity: product.quantity,
      images: product.images,
      colors: product.colors,
      sizes: product.sizes,
      availableSizes: product.availableSizes,
      size: isCustomSize ? `custom:${product.size}` : product.size,
      rating: product.rating,
      reviews: product.reviews,
      category: product.category,
      inStock: product.inStock,
      tags: product.tags,
      imageFiles: product.imageFiles || []
    });
    setEditingProductId(product.id);
  };

  const checkBackendHealthLocal = async () => {
    try {
      // Try both direct and relative paths
      const backendUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
      const urls = [
        `${backendUrl}/health`,
        '/health'
      ];
      
      for (const url of urls) {
        try {
          const res = await fetch(url, { 
            cache: 'no-store',
            method: 'GET'
          });
          if (res.ok) {
            const data = await res.json().catch(() => ({}));

            return { isHealthy: true, message: data?.status || 'ok' };
          }
        } catch (e) {
          // Silently ignore fetch errors
        }
      }
      
      return { isHealthy: false, message: 'Backend not responding on any endpoint' };
    } catch (e: any) {

      return { isHealthy: false, message: e?.message || 'network error' };
    }
  };

  const handleSubmit = async () => {



    if (!validateStep(currentStep)) {

      return;
    }

    setIsLoading(true);



    const healthCheck = await checkBackendHealthLocal();

    
    if (!healthCheck.isHealthy) {
      // Backend not healthy, will use local fallback
    } else {
      // Backend is healthy
    }

    try {

      const checkResponse = await fetch('/api/stores/check-exists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeName: formData.nameAr,
          storeSlug: formData.subdomain,
          email1: formData.email,
          email2: formData.alternateEmail || null
        })
      });

      const checkData = await checkResponse.json();
      if (checkData.data?.exists) {
        const existingItems: string[] = [];
        if (checkData.data?.store) {
          existingItems.push(`متجر "${formData.nameAr}"`);
        }
        checkData.data?.emails?.forEach((email: any) => {
          existingItems.push(`البريد "${email.email}"`);
        });
        
        const message = `موجود مسبقاً: ${existingItems.join(', ')}. يجب حذفها أولاً قبل الإنشاء.`;
        setErrors({ general: message });
        setIsLoading(false);
        alert(message);
        return;
      }


      // التحقق من التكرارات بقاعدة البيانات المحلية
      const existingStores = JSON.parse(localStorage.getItem('eshro_stores') || '[]');


      // التحقق من البريد الإلكتروني المكرر
      if (existingStores.some((store: any) => store.email === formData.email)) {
        setDuplicateField('email');
        setShowDuplicateModal(true);
        setIsLoading(false);
        return;
      }

      // التحقق من رقم الهاتف المكرر
      if (existingStores.some((store: any) => store.phone === formData.phone)) {
        setDuplicateField('phone');
        setShowDuplicateModal(true);
        setIsLoading(false);
        return;
      }

      // التحقق من الـ subdomain المكرر - معطل لأغراض الاختبار
      // if (existingStores.some((store: any) => store.subdomain === formData.subdomain)) {
      //   console.log('Duplicate subdomain found, aborting');
      //   setErrors({ subdomain: 'عنوان المتجر موجود مسبقاً، يرجى اختيار عنوان آخر' });
      //   setIsLoading(false);
      //   return;
      // }

      // قفل منع التكرار بالسلاج بعد التوحيد
      const RESERVED = ['nawaem','sheirine','pretty','delta-store','magna-beauty'];
      const newSlugCanonical = canonicalSlug(formData.subdomain);

      const existingCanonicalSlugs = new Set<string>();
      try {
        (existingStores || []).forEach((s: any) => {
          const slug = canonicalSlug(s?.subdomain || s?.id);
          if (slug) existingCanonicalSlugs.add(slug);
        });
        // أدرج أي سلاجات من مفاتيح الملفات المحلية
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (!key) continue;
          if (key.startsWith('eshro_store_files_')) {
            const raw = localStorage.getItem(key);
            try {
              const parsed = raw ? JSON.parse(raw) : null;
              const slug = canonicalSlug(parsed?.storeData?.storeSlug || parsed?.storeData?.subdomain);
              if (slug) existingCanonicalSlugs.add(slug);
            } catch {
              // Silently ignore parsing errors
            }
          }
        }
      } catch {
        // Silently ignore outer errors
      }

      if (RESERVED.includes(newSlugCanonical) || existingCanonicalSlugs.has(newSlugCanonical)) {
        setErrors({ subdomain: 'عنوان المتجر محجوز بالفعل، يرجى اختيار عنوان آخر' });
        setIsLoading(false);
        return;
      }


      const storeId = Date.now();

      
      let productsWithIds = (formData.products || []).map((product, idx) => {
        const { imageFiles, ...productData } = product;

        const finalImages = (imageFiles || []).length > 0 ? 
          (imageFiles || []).map((file, fileIdx) => {
            return `/assets/${formData.subdomain}/products/${file.name}`;
          }) : 
          [`/default-product.png`];

        const isInStock = (product.quantity || 0) > 0;

        return {
          ...productData,
          id: storeId * 1000 + idx + 1,
          images: finalImages,
          inStock: isInStock,
          isAvailable: isInStock
        };
      });

      let sliderImagesWithIds = (formData.sliderImages || []).map((slider, idx) => {
        const { imageFile, ...sliderData } = slider;

        const imagePath = imageFile ?
          `/assets/${formData.subdomain}/sliders/${imageFile.name}` :
          `/default-slider.png`;

        return {
          ...sliderData,
          id: `banner${idx + 1}`,
          image: imagePath
        };
      });

      // Build upload files payload (files + counts)
      const productsImageCounts = (formData.products || []).map((p: any) => (p.imageFiles || []).length || 0);
      const flatProductFiles: File[] = [];
      (formData.products || []).forEach((p: any) => {
        (p.imageFiles || []).forEach((f: File) => flatProductFiles.push(f));
      });
      const sliderFiles: File[] = (formData.sliderImages || []).map((s: any) => s.imageFile).filter(Boolean);





      let useLocalFallback = false;

      const storeData = {
        id: storeId.toString(),
        storeId: storeId,
        storeSlug: formData.subdomain,
        storeName: formData.nameAr,
        storeNameEn: formData.nameEn,
        description: formData.description,
        icon: '🏪',
        color: 'from-purple-400 to-pink-600',
        logo: useLocalFallback ? `/default-store.png` : (formData.storeLogo ? `/assets/${formData.subdomain}/logo/store-logo.webp` : `/default-store.png`),
        categories: formData.categories.map(catId =>
          storeCategories.find(c => c.id === catId)?.name || catId
        ),
        products: productsWithIds,
        sliderImages: sliderImagesWithIds,
        commercialRegister: formData.commercialRegister?.name || '',
        practiceLicense: formData.practiceLicense?.name || '',
        nameAr: formData.nameAr,
        nameEn: formData.nameEn,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        createdAt: new Date().toISOString(),
        status: 'active',
        trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        warehouseAddress: formData.warehouseAddress,
        warehouseCity: formData.warehouseCity,
        warehousePhone: formData.warehousePhone,
        warehouseLat: formData.warehouseLat || 0,
        warehouseLng: formData.warehouseLng || 0,
        warehouseMode: formData.warehouseMode || 'own',
        uploadFiles: {
          productImages: flatProductFiles,
          productsImageCounts,
          sliderImages: sliderFiles,
          storeLogo: formData.storeLogo || null
        }
      };






      
      // Build FormData correctly with all required fields
      const apiFormData = new FormData();
      apiFormData.append('storeId', storeId.toString());
      apiFormData.append('storeSlug', formData.subdomain);
      apiFormData.append('storeName', formData.nameAr);
      apiFormData.append('storeNameEn', formData.nameEn || '');
      apiFormData.append('description', formData.description);
      apiFormData.append('ownerName', formData.ownerName);
      apiFormData.append('email', formData.email);
      apiFormData.append('ownerEmail', formData.email);
      apiFormData.append('ownerSecondEmail', formData.alternateEmail || '');
      apiFormData.append('phone', formData.phone);
      apiFormData.append('password', formData.password);
      apiFormData.append('categories', JSON.stringify(formData.categories));

      // Warehouse details
      apiFormData.append('warehouseAddress', formData.warehouseAddress);
      apiFormData.append('warehouseCity', formData.warehouseCity);
      apiFormData.append('warehousePhone', formData.warehousePhone);
      apiFormData.append('warehouseLat', String(formData.warehouseLat || 0));
      apiFormData.append('warehouseLng', String(formData.warehouseLng || 0));
      apiFormData.append('warehouseMode', formData.warehouseMode || 'own');
      
      // Send products and sliders as JSON
      apiFormData.append('products', JSON.stringify(productsWithIds));
      apiFormData.append('sliderImages', JSON.stringify(sliderImagesWithIds));
      
      // Add image counts for proper distribution
      apiFormData.append('productsImageCounts', JSON.stringify(productsImageCounts));
      
      // Send files
      apiFormData.append('commercialRegister', formData.commercialRegister?.name || '');
      apiFormData.append('practiceLicense', formData.practiceLicense?.name || '');

      // Add logo
      if (formData.storeLogo) {
        apiFormData.append('storeLogo', formData.storeLogo);
      }

      // Add product images with index-based field names to prevent mixing
      // Each product's images go to productImage_0, productImage_1, etc.
      let fileIdx = 0;
      productsImageCounts.forEach((count, productIdx) => {
        for (let i = 0; i < count; i++) {
          if (fileIdx < flatProductFiles.length) {
            const file = flatProductFiles[fileIdx];
            if (file) {
              const fieldName = `productImage_${productIdx}`;
              apiFormData.append(fieldName, file);
              fileIdx++;
            }
          }
        }
      });

      // Add slider images with sequential field names
      sliderFiles.forEach((file, idx) => {
        apiFormData.append(`sliderImage_${idx}`, file);
      });

     // Use relative path to benefit from Vite proxy
      let createResponse: Response | null = null;
      let apiResponse: any = null;

      try {
        createResponse = await fetch('/api/stores/create-with-images', {
          method: 'POST',
          body: apiFormData
          // Don't set Content-Type header - let the browser set it with boundary
        });

        apiResponse = await createResponse.json().catch((e: any) => ({
          success: false,
          error: `Failed to parse response: ${e.message}`
        }));



        // Check for HTTP errors
        if (!createResponse.ok) {
          const errorMsg = apiResponse.error || apiResponse.message || `Server error: ${createResponse.status}`;

          useLocalFallback = true;
        } else if (!apiResponse.success) {
          const errorMsg = apiResponse.error || apiResponse.message || 'فشل في إنشاء المتجر على الخادم';

          useLocalFallback = true;
        }
      } catch (error: any) {

        useLocalFallback = true;
      }

      // If API failed, use local generation
      if (useLocalFallback) {


        // استخدم Placeholders للصور عند غياب الخادم
        productsWithIds = productsWithIds.map((p) => ({
          ...p,
          images: (p.images || []).length ? p.images.map(() => '/default-product.png') : ['/default-product.png']
        }));
        sliderImagesWithIds = sliderImagesWithIds.map((s) => ({ ...s, image: '/assets/default-slider.png' }));
        
        const localGenerationResult = generateStoreLocally({
          storeId: storeId,
          storeSlug: formData.subdomain,
          storeName: formData.nameAr,
          storeNameEn: formData.nameEn,
          description: formData.description,
          categories: formData.categories.map(catId =>
            storeCategories.find(c => c.id === catId)?.name || catId
          ),
          products: productsWithIds,
          sliderImages: sliderImagesWithIds
        });

        if (!localGenerationResult.success) {

          setErrors({ general: `خطأ: ${localGenerationResult.message}` });
          setIsLoading(false);
          return;
        }


      }


      if (apiResponse) {
        // API response received, will use server data
      }

      const serverStoreData = apiResponse?.store || apiResponse?.data?.store || storeData;
      const serverProducts = apiResponse?.products || apiResponse?.data?.products || productsWithIds;
      const serverSliders = apiResponse?.sliderImages || apiResponse?.data?.sliderImages || sliderImagesWithIds;
      
      let logoDataUrl: string | null = null;
      if (formData.storeLogo) {
        logoDataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(formData.storeLogo);
        });
      }

      
      const finalStoreData = {
        ...storeData,
        ...serverStoreData,
        products: serverProducts,
        sliderImages: serverSliders,
        logo: logoDataUrl || serverStoreData.logo || apiResponse?.data?.logoPath || storeData.logo,
        storeSlug: formData.subdomain
      };
      
      localStorage.setItem(`eshro_store_files_${formData.subdomain}`, JSON.stringify({
        storeData: finalStoreData,
        createdAt: new Date().toISOString()
      }));


      const allRegisteredStores = JSON.parse(localStorage.getItem('eshro_stores') || '[]');
      const newStoreEntry = {
        id: finalStoreData.storeId,
        nameAr: finalStoreData.nameAr || finalStoreData.storeName,
        nameEn: finalStoreData.nameEn || finalStoreData.storeNameEn,
        subdomain: finalStoreData.storeSlug || formData.subdomain,
        description: finalStoreData.description,
        categories: finalStoreData.categories,
        logo: finalStoreData.logo,
        setupComplete: true,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        ownerName: formData.ownerName
      };
      // منع تكرار الإدخال بسلاج موحّد
      const newKey = canonicalSlug(newStoreEntry.subdomain || newStoreEntry.id);
      const filtered = (Array.isArray(allRegisteredStores) ? allRegisteredStores : []).filter((s: any) => canonicalSlug(s?.subdomain || s?.id) !== newKey);
      filtered.push(newStoreEntry);
      localStorage.setItem('eshro_stores', JSON.stringify(filtered));


      const productsForStorage = serverProducts.map((p: any) => ({
        ...p,
        storeId: finalStoreData.storeId,
        category: p.category || 'عام',
        images: p.images || []
      }));
      localStorage.setItem(`store_products_${formData.subdomain}`, JSON.stringify(productsForStorage));


      const slidersForStorage = serverSliders.map((s: any) => ({
        id: s.id || `banner_${Date.now()}_${Math.random()}`,
        image: s.image || '',
        title: s.title || '',
        subtitle: s.subtitle || '',
        buttonText: s.buttonText || 'تسوق الآن'
      }));
      localStorage.setItem(`store_sliders_${formData.subdomain}`, JSON.stringify(slidersForStorage));


      const merchantCredentials = {
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        ownerName: formData.ownerName,
        subdomain: formData.subdomain,
        storeId: finalStoreData.storeId,
        storeName: finalStoreData.nameAr || finalStoreData.storeName,
        setupComplete: true,
        createdAt: new Date().toISOString()
      };
      localStorage.setItem(`merchant_${formData.email}`, JSON.stringify(merchantCredentials));
      localStorage.setItem(`merchant_credentials_${formData.subdomain}`, JSON.stringify(merchantCredentials));

      


      onStoreCreated(storeData);

      window.dispatchEvent(new Event('storeCreated'));



      setIsLoading(false);
      setTimeout(() => {

        setShowStoreSuccessModal(true);
      }, 100);
    } catch (error: any) {

      setErrors({ general: `حدث خطأ في إنشاء المتجر: ${error?.message || 'يرجى المحاولة مرة أخرى.'}` });
    } finally {

      setIsLoading(false);
    }
  };

  const handleSubdomainChange = (value: string) => {
    // تحويل إلى أحرف صغيرة وإزالة المسافات والأحرف غير المسموحة
    const cleanValue = value.toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 30);
    setFormData(prev => ({ ...prev, subdomain: cleanValue }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Store className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">معلومات صاحب المتجر</h3>
                <p className="text-sm text-gray-600">أدخل معلوماتك الشخصية</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ownerName">الاسم الكامل *</Label>
                <Input
                  id="ownerName"
                  placeholder="أدخل اسمك الكامل"
                  value={formData.ownerName}
                  onChange={(e) => setFormData(prev => ({ ...prev, ownerName: e.target.value }))}
                  className={errors.ownerName ? 'border-red-500' : ''}
                />
                {errors.ownerName && <p className="text-xs text-red-500">{errors.ownerName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">رقم الهاتف *</Label>
                <Input
                  id="phone"
                  placeholder="0912345678"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">معلومات المتجر الأساسية</h3>
                <p className="text-sm text-gray-600">أدخل المعلومات الأساسية لمتجرك</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nameAr">اسم المتجر بالعربية *</Label>
                <Input
                  id="nameAr"
                  placeholder="مثال: حليب صين البقلة"
                  value={formData.nameAr}
                  onChange={(e) => setFormData(prev => ({ ...prev, nameAr: e.target.value }))}
                  className={errors.nameAr ? 'border-red-500' : ''}
                />
                {errors.nameAr && <p className="text-xs text-red-500">{errors.nameAr}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="nameEn">اسم المتجر بالإنجليزية</Label>
                <Input
                  id="nameEn"
                  placeholder="Example: Elegance Store"
                  value={formData.nameEn}
                  onChange={(e) => setFormData(prev => ({ ...prev, nameEn: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">وصف المتجر *</Label>
              <Textarea
                id="description"
                placeholder="أكتب شرح مفصل عن متجرك ومنتجاتك..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4 md:col-span-2">
                <Label>فئة المتجر *</Label>
                <p className="text-sm text-gray-600 mb-4">يمكنك اختيار أكثر من فئة</p>
                <div className="flex flex-wrap gap-3">
                  {storeCategories.map((category) => (
                    <label
                      key={category.id}
                      className={`flex items-center gap-2 px-4 py-3 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-105 ${
                        formData.categories.includes(category.id)
                          ? 'border-primary bg-primary/10 shadow-md scale-105'
                          : 'border-gray-200 hover:border-primary/50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.categories.includes(category.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData(prev => ({
                              ...prev,
                              categories: [...prev.categories, category.id]
                            }));
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              categories: prev.categories.filter(c => c !== category.id)
                            }));
                          }
                        }}
                        className="sr-only"
                      />
                      <span className="text-xl">{category.icon}</span>
                      <span className="text-sm font-medium whitespace-nowrap">{category.name}</span>
                      {formData.categories.includes(category.id) && (
                        <div className="w-2 h-2 bg-primary rounded-full ml-1"></div>
                      )}
                    </label>
                  ))}
                </div>
                {errors.categories && <p className="text-sm text-red-500 mt-2">{errors.categories}</p>}
              </div>

              {/* نسخة من السجل التجاري */}
              <div className="space-y-2">
                <Label htmlFor="commercialRegister">نسخة من السجل التجاري مرفقة *</Label>
                <Input
                  id="commercialRegister"
                  type="file"
                  accept=".png,.jpeg,.jpg,.pdf,.winrar,.zip"
                  onChange={(e) => setFormData(prev => ({ ...prev, commercialRegister: e.target.files?.[0] || null }))}
                  className={errors.commercialRegister ? 'border-red-500' : ''}
                />
                <p className="text-xs text-gray-500">الامتدادات المسموحة: PNG, JPEG, JPG, PDF, WINRAR, ZIP</p>
                {errors.commercialRegister && <p className="text-xs text-red-500">{errors.commercialRegister}</p>}
              </div>

              {/* نسخة من رخصة المزاولة */}
              <div className="space-y-2">
                <Label htmlFor="practiceLicense">نسخة من رخصة المزاولة مرفقة *</Label>
                <Input
                  id="practiceLicense"
                  type="file"
                  accept=".png,.jpeg,.jpg,.pdf,.winrar,.zip"
                  onChange={(e) => setFormData(prev => ({ ...prev, practiceLicense: e.target.files?.[0] || null }))}
                  className={errors.practiceLicense ? 'border-red-500' : ''}
                />
                <p className="text-xs text-gray-500">الامتدادات المسموحة: PNG, JPEG, JPG, PDF, WINRAR, ZIP</p>
                {errors.practiceLicense && <p className="text-xs text-red-500">{errors.practiceLicense}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="subdomain">عنوان المتجر *</Label>
                <div className="space-y-1">
                  <Input
                    id="subdomain"
                    placeholder="my-store"
                    value={formData.subdomain}
                    onChange={(e) => handleSubdomainChange(e.target.value)}
                    className={errors.subdomain ? 'border-red-500' : ''}
                  />
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Info className="h-3 w-3" />
                    <span>سيكون الرابط النهائي: {formData.subdomain || 'my-store'}.eshro.ly</span>
                  </div>
                </div>
                {errors.subdomain && <p className="text-xs text-red-500">{errors.subdomain}</p>}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">إعدادات الحساب وشعار المتجر</h3>
                <p className="text-sm text-gray-600">أنشئ كلمة مرور قوية وارفع شعار متجرك</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* كلمة المرور */}
              <div className="space-y-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h4 className="font-semibold">بيانات الدخول</h4>
                <div className="space-y-2">
                  <Label htmlFor="password">كلمة المرور *</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="أدخل كلمة مرور قوية"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className={errors.password ? 'border-red-500' : ''}
                  />
                  {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                  <p className="text-xs text-gray-500">يجب أن تكون كلمة المرور 8 أحرف على الأقل</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">تأكيد كلمة المرور *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="أعد إدخال كلمة المرور"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className={errors.confirmPassword ? 'border-red-500' : ''}
                  />
                  {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword}</p>}
                </div>
              </div>

              {/* شعار المتجر */}
              <div className="space-y-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                <h4 className="font-semibold">شعار المتجر</h4>
                <Label htmlFor="storeLogo">ارفع شعار متجرك *</Label>
                <div
                  className="border-2 border-dashed border-orange-300 rounded-lg p-6 cursor-pointer hover:bg-orange-100 transition-colors"
                  onClick={() => document.getElementById('storeLogo')?.click()}
                >
                  <input
                    id="storeLogo"
                    type="file"
                    accept=".png,.jpg,.jpeg,.webp,.avif,.tiff,.bmp"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setFormData(prev => ({ ...prev, storeLogo: file }));
                      }
                    }}
                    className="sr-only"
                    title="شعار المتجر"
                  />
                  <div className="text-center mt-4">
                    <ImageIcon className="h-12 w-12 text-orange-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      {formData.storeLogo?.name || 'اختر صورة الشعار'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      الامتدادات المسموحة: PNG, JPG, JPEG, WEBP, AVIF, TIFF, BMP
                    </p>
                  </div>
                </div>
                {errors.storeLogo && <p className="text-xs text-red-500">{errors.storeLogo}</p>}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">مراجعة البيانات</h3>
              <p className="text-gray-600">تأكد من صحة البيانات قبل إنشاء المتجر</p>
            </div>

            <Card className="text-right">
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">اسم المتجر:</span>
                  <div className="flex items-center gap-2">
                    <span>{formData.nameAr}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setCurrentStep(3)}
                      className="text-xs"
                    >
                      تعديل
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">الفئة:</span>
                  <div className="flex items-center gap-2">
                    <span>{formData.categories.map(catId => storeCategories.find(c => c.id === catId)?.name).join(', ')}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setCurrentStep(3)}
                      className="text-xs"
                    >
                      تعديل
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">رابط المتجر:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600">{formData.subdomain}.eshro.ly</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setCurrentStep(3)}
                      className="text-xs"
                    >
                      تعديل
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">البريد الإلكتروني:</span>
                  <div className="flex items-center gap-2">
                    <span>{formData.email}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setCurrentStep(2)}
                      className="text-xs"
                    >
                      تعديل
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">رقم الهاتف:</span>
                  <div className="flex items-center gap-2">
                    <span>{formData.phone}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setCurrentStep(2)}
                      className="text-xs"
                    >
                      تعديل
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">الشعار:</span>
                  <div className="flex items-center gap-2">
                    <span>{formData.storeLogo ? 'تم رفع الشعار' : 'لم يتم رفع الشعار'}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setCurrentStep(4)}
                      className="text-xs"
                    >
                      تعديل
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {errors.general && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                <span className="text-sm text-red-700">{errors.general}</span>
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">إضافة المنتجات</h3>
                <p className="text-sm text-gray-600">أضف المنتجات والصور والأسعار</p>
              </div>
            </div>

            <div className="space-y-4 mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-900">
                  {editingProductId !== null ? 'تعديل المنتج' : 'منتج جديد'}
                </h4>
                <Badge variant="outline">
                  {formData.products?.length || 0}/100 منتج
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>اسم المنتج</Label>
                  <Input
                    placeholder="مثال: فستان أسود"
                    value={currentProduct.name || ''}
                    onChange={(e) => setCurrentProduct({...currentProduct, name: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label>اسم المنتج بالإنجليزية</Label>
                  <Input
                    placeholder="Example: Black Dress"
                    value={currentProduct.nameEn || ''}
                    onChange={(e) => setCurrentProduct({...currentProduct, nameEn: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label>السعر (د.ل)</Label>
                  <Input
                    type="number"
                    placeholder="100"
                    value={currentProduct.price || ''}
                    onChange={(e) => setCurrentProduct({...currentProduct, price: parseFloat(e.target.value)})}
                  />
                </div>

                <div className="space-y-2">
                  <Label>الكمية المتاحة بالمخزن *</Label>
                  <Input
                    type="number"
                    placeholder="50"
                    value={currentProduct.quantity || ''}
                    onChange={(e) => setCurrentProduct({...currentProduct, quantity: parseInt(e.target.value) || 0})}
                  />
                  <p className="text-xs text-gray-500">الكمية التي ستكون متاحة بالمخزن. عندما تنتهي الكمية، سيظهر للعملاء "أخبرني عند التوفر"</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>الوصف</Label>
                <Textarea
                  placeholder="اكتب وصف المنتج..."
                  value={currentProduct.description || ''}
                  onChange={(e) => setCurrentProduct({...currentProduct, description: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>السعر قبل التخفيض (د.ل)</Label>
                <Input
                  type="number"
                  placeholder="150"
                  value={currentProduct.originalPrice || ''}
                  onChange={(e) => setCurrentProduct({...currentProduct, originalPrice: parseFloat(e.target.value)})}
                />
              </div>

              <div className="space-y-2">
                <Label>حجم المنتج</Label>
                <Select
                  value={currentProduct.size || ''}
                  onValueChange={(value) => setCurrentProduct({...currentProduct, size: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر حجم المنتج" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1000 مل">1000 مل</SelectItem>
                    <SelectItem value="750 مل">750 مل</SelectItem>
                    <SelectItem value="500 مل">500 مل</SelectItem>
                    <SelectItem value="300 مل">300 مل</SelectItem>
                    <SelectItem value="250 مل">250 مل</SelectItem>
                    <SelectItem value="1 كيلو">1 كيلو</SelectItem>
                    <SelectItem value="2.5 كيلو">2.5 كيلو</SelectItem>
                    <SelectItem value="3 كيلو">3 كيلو</SelectItem>
                    <SelectItem value="4 كيلو">4 كيلو</SelectItem>
                    <SelectItem value="5 كيلو">5 كيلو</SelectItem>
                    <SelectItem value="9 كيلو">9 كيلو</SelectItem>
                    <SelectItem value="10 كيلو">10 كيلو</SelectItem>
                    <SelectItem value="15 كيلو">15 كيلو</SelectItem>
                    <SelectItem value="500 ملليتر">500 ملليتر</SelectItem>
                    <SelectItem value="1000 ملليتر">1000 ملليتر</SelectItem>
                    <SelectItem value="15 لتر">15 لتر</SelectItem>
                    <SelectItem value="custom">إدخال يدوي</SelectItem>
                  </SelectContent>
                </Select>
                {(currentProduct.size === 'custom' || currentProduct.size?.startsWith('custom:')) && (
                  <Input
                    placeholder="أدخل الحجم يدوياً"
                    value={currentProduct.size?.startsWith('custom:') ? currentProduct.size.replace('custom:', '') : ''}
                    onChange={(e) => setCurrentProduct({...currentProduct, size: e.target.value ? `custom:${e.target.value}` : 'custom:'})}
                    className="mt-2"
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="product-category">فئة المنتج</Label>
                <select
                  id="product-category"
                  aria-label="فئة المنتج"
                  value={currentProduct.category || ''}
                  onChange={(e) => setCurrentProduct({...currentProduct, category: e.target.value})}
                  className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <option value="">اختر فئة المنتج</option>
                  {storeCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="product-images">صور المنتج (متعددة)</Label>
                <div
                  className="border-2 border-dashed border-blue-300 rounded-lg p-4 cursor-pointer hover:bg-blue-100 transition-colors"
                  onClick={() => document.getElementById('product-images')?.click()}
                >
                  <input
                    id="product-images"
                    type="file"
                    multiple
                    accept=".png,.jpg,.jpeg,.webp,.avif,.tiff,.bmp"
                    title="اختر صور المنتج"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      setCurrentProduct({
                        ...currentProduct,
                        imageFiles: [...(currentProduct.imageFiles || []), ...files],
                        images: [...(currentProduct.images || []), ...files.map(f => f.name)]
                      });
                    }}
                    className="sr-only"
                  />
                  <p className="text-sm text-gray-600 mt-2">
                    {currentProduct.imageFiles?.length ? `${currentProduct.imageFiles.length} صورة مختارة` : 'اختر صور المنتج'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    الامتدادات المسموحة: PNG, JPG, JPEG, WEBP, AVIF, TIFF, BMP
                  </p>
                </div>

                {currentProduct.imageFiles && currentProduct.imageFiles.length > 0 && (
                  <div className="mt-4">
                    <h5 className="text-sm font-medium mb-2">الصور المختارة:</h5>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {currentProduct.imageFiles.map((file, index) => (
                        <div key={index} className="relative border rounded-lg p-2 bg-gray-50">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`صورة ${index + 1}`}
                            className="w-full h-20 object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newFiles = currentProduct.imageFiles?.filter((_, i) => i !== index) || [];
                              const newImages = currentProduct.images?.filter((_, i) => i !== index) || [];
                              setCurrentProduct({
                                ...currentProduct,
                                imageFiles: newFiles,
                                images: newImages
                              });
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            ×
                          </button>
                          <p className="text-xs text-gray-600 mt-1 truncate">{file.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {shouldShowExpiryDateFields(currentProduct.category || formData.categories?.[0] || '') && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-amber-600" />
                    <h5 className="font-semibold text-amber-900">معلومات الصلاحية</h5>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry-date">تاريخ الصنع</Label>
                      <Input
                        id="expiry-date"
                        type="date"
                        value={currentProduct.expiryDate || ''}
                        onChange={(e) => setCurrentProduct({...currentProduct, expiryDate: e.target.value})}
                      />
                      <p className="text-xs text-gray-600">تاريخ صنع أو إنتاج المنتج</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="end-date">تاريخ الانتهاء (الصلاحية)</Label>
                      <Input
                        id="end-date"
                        type="date"
                        value={currentProduct.endDate || ''}
                        onChange={(e) => setCurrentProduct({...currentProduct, endDate: e.target.value})}
                      />
                      <p className="text-xs text-gray-600">تاريخ انتهاء صلاحية المنتج</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  disabled={(formData.products?.length || 0) >= 100}
                  onClick={() => {


                    // Check if maximum products limit is reached
                    const currentProductCount = formData.products?.length || 0;
                    if (currentProductCount >= 100) {

                      setErrors({ products: 'يمكنك إضافة حتى 100 منتج كحد أقصى' });
                      return;
                    }

                    if (currentProduct.name && currentProduct.nameEn && currentProduct.price && currentProduct.quantity && currentProduct.description && currentProduct.size && currentProduct.imageFiles && currentProduct.imageFiles.length > 0 && (currentProduct.size !== 'custom' || (currentProduct.size.startsWith('custom:') && currentProduct.size.length > 7))) {
                      if (editingProductId !== null) {
                        // Update existing product
                        setFormData(prev => ({
                          ...prev,
                          products: prev.products?.map(p =>
                            p.id === editingProductId
                              ? {
                                  ...p,
                                  name: currentProduct.name,
                                  nameEn: currentProduct.nameEn,
                                  description: currentProduct.description,
                                  price: currentProduct.price,
                                  originalPrice: currentProduct.originalPrice || currentProduct.price,
                                  quantity: currentProduct.quantity || 0,
                                  images: currentProduct.images || [getDefaultProductImageSync(formData.subdomain)],
                                  size: currentProduct.size?.startsWith('custom:') ? currentProduct.size.replace('custom:', '') : currentProduct.size,
                                  category: currentProduct.category || formData.categories[0] || 'عام',
                                  imageFiles: currentProduct.imageFiles,
                                  ...(shouldShowExpiryDateFields(currentProduct.category || formData.categories?.[0] || '') && {
                                    expiryDate: currentProduct.expiryDate,
                                    endDate: currentProduct.endDate
                                  })
                                }
                              : p
                          ) || []
                        }));
                        setEditingProductId(null);
                      } else {
                        // Add new product
                        setFormData(prev => {
                          const newProduct: Product = {
                            id: (prev.products?.length || 0) + 1,
                            storeId: 0, // Will be set when store is created
                            name: currentProduct.name || '',
                            nameEn: currentProduct.nameEn || '',
                            description: currentProduct.description || '',
                            price: currentProduct.price || 0,
                            originalPrice: currentProduct.originalPrice || currentProduct.price || 0,
                            quantity: currentProduct.quantity || 0,
                            images: currentProduct.images || [getDefaultProductImageSync(formData.subdomain)],
                            colors: currentProduct.colors || [{name: 'أسود', value: '#000000'}],
                            sizes: currentProduct.sizes || ['S', 'M', 'L', 'XL'],
                            availableSizes: currentProduct.availableSizes || ['S', 'M', 'L', 'XL'],
                            size: currentProduct.size?.startsWith('custom:') ? currentProduct.size.replace('custom:', '') : (currentProduct.size || ''),
                            category: currentProduct.category || formData.categories[0] || 'عام',
                            rating: 4.5,
                            reviews: 0,
                            views: 0,
                            likes: 0,
                            orders: 0,
                            inStock: (currentProduct.quantity || 0) > 0,
                            isAvailable: (currentProduct.quantity || 0) > 0,
                            tags: ['جديد'],
                            imageFiles: currentProduct.imageFiles || []
                          };
                          
                          const categoryToCheck = currentProduct.category || formData.categories?.[0] || '';
                          if (shouldShowExpiryDateFields(categoryToCheck)) {
                            if (currentProduct.expiryDate) newProduct.expiryDate = currentProduct.expiryDate;
                            if (currentProduct.endDate) newProduct.endDate = currentProduct.endDate;
                          }
                          
                          return {
                            ...prev,
                            products: [
                              ...(prev.products || []),
                              newProduct
                            ]
                          };
                        });
                      }
                      setCurrentProduct({
                        name: '',
                        nameEn: '',
                        description: '',
                        price: 0,
                        originalPrice: 0,
                        quantity: 0,
                        images: [],
                        colors: [],
                        sizes: [],
                        availableSizes: [],
                        size: '',
                        rating: 4.5,
                        reviews: 0,
                        category: '',
                        inStock: true,
                        tags: [],
                        imageFiles: [],
                        expiryDate: '',
                        endDate: ''
                      });
                    } else {
                     setErrors({ products: 'يرجى ملء جميع الحقول المطلوبة وإضافة صورة واحدة على الأقل' });
                    }
                  }}
                  className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-400"
                >
                  {(formData.products?.length || 0) >= 100
                    ? 'تم الوصول للحد الأقصى (100 منتج)'
                    : editingProductId !== null
                      ? 'تحديث المنتج'
                      : 'إضافة المنتج'
                  }
                </Button>
                {editingProductId !== null && (
                  <Button
                    onClick={() => {
                      setEditingProductId(null);
                      setCurrentProduct({
                        name: '',
                        nameEn: '',
                        description: '',
                        price: 0,
                        originalPrice: 0,
                        quantity: 0,
                        images: [],
                        colors: [],
                        sizes: [],
                        availableSizes: [],
                        size: '',
                        rating: 4.5,
                        reviews: 0,
                        category: '',
                        inStock: true,
                        tags: [],
                        imageFiles: [],
                        expiryDate: '',
                        endDate: ''
                      });
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    إلغاء التعديل
                  </Button>
                )}
              </div>
            </div>

            {formData.products && formData.products.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-lg">المنتجات المضافة: {formData.products.length}/100</h4>
                  {formData.products.length >= 90 && (
                    <Badge variant={formData.products.length >= 100 ? "destructive" : "secondary"}>
                      {formData.products.length >= 100 ? "تم الوصول للحد الأقصى" : "اقتربت من الحد الأقصى"}
                    </Badge>
                  )}
                </div>
                <div className="grid gap-4">
                  {formData.products.map((product) => (
                    <Card key={product.id} className="p-4">
                      <div className="flex gap-4">
                        {/* Product Images */}
                        <div className="flex-shrink-0">
                          {product.imageFiles && product.imageFiles.length > 0 ? (
                            <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                              <img
                                src={URL.createObjectURL(product.imageFiles[0])}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                              <ImageIcon className="h-8 w-8 text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h5 className="font-semibold text-lg">{product.name}</h5>
                              <p className="text-sm text-gray-600">{product.nameEn}</p>
                            </div>
                            <div className="text-left">
                              <p className="font-bold text-lg text-green-600">{product.price} د.ل</p>
                              {product.originalPrice && product.originalPrice !== product.price && (
                                <p className="text-sm text-gray-500 line-through">{product.originalPrice} د.ل</p>
                              )}
                            </div>
                          </div>

                          <p className="text-sm text-gray-700 mb-2 line-clamp-2">{product.description}</p>

                          <div className="flex flex-wrap gap-2 text-xs">
                            <Badge variant="secondary">الحجم: {product.size}</Badge>
                            <Badge variant="outline">الصور: {product.imageFiles?.length || 0}</Badge>
                            {product.category && <Badge variant="outline">الفئة: {product.category}</Badge>}
                            <Badge className={product.quantity && product.quantity > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                              الكمية: {product.quantity || 0}
                            </Badge>
                            <Badge className={product.quantity && product.quantity > 0 ? "bg-blue-100 text-blue-800" : "bg-orange-100 text-orange-800"}>
                              {product.quantity && product.quantity > 0 ? "متوفر" : "غير متوفر"}
                            </Badge>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-2 flex-shrink-0">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditProduct(product)}
                            disabled={editingProductId === product.id}
                            className="w-20"
                          >
                            {editingProductId === product.id ? 'يتم التعديل' : 'تعديل'}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                products: prev.products?.filter(p => p.id !== product.id) || []
                              }));
                            }}
                            className="w-20"
                          >
                            حذف
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {errors.products && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                <span className="text-sm text-red-700">{errors.products}</span>
              </div>
            )}
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">إضافة صور السلايدرز</h3>
                <p className="text-sm text-gray-600">أضف صور السلايدرز التي تعرض كل 5 ثوان</p>
              </div>
            </div>

            <div className="space-y-4 mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-gray-900">صورة سلايدر جديدة</h4>

              <div className="space-y-2">
                <Label htmlFor="slider-image">صورة السلايدر</Label>
                <div
                  className="border-2 border-dashed border-purple-300 rounded-lg p-4 cursor-pointer hover:bg-purple-100 transition-colors"
                  onClick={() => document.getElementById('slider-image')?.click()}
                >
                  <input
                    ref={sliderImageInputRef}
                    id="slider-image"
                    type="file"
                    accept=".png,.jpg,.jpeg,.webp,.avif,.tiff,.bmp"
                    title="اختر صورة السلايدر"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setCurrentSliderImage({
                          ...currentSliderImage,
                          imageFile: file,
                          image: file.name
                        });
                      }
                    }}
                    className="sr-only"
                  />
                  <p className="text-sm text-gray-600 mt-2">
                    {currentSliderImage.imageFile?.name || 'اختر صورة السلايدر'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    الامتدادات المسموحة: PNG, JPG, JPEG, WEBP, AVIF, TIFF, BMP
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>العنوان</Label>
                <Input
                  placeholder="مثال: فساتين جديدة"
                  value={currentSliderImage.title || ''}
                  onChange={(e) => setCurrentSliderImage({...currentSliderImage, title: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label>الوصف الفرعي</Label>
                <Input
                  placeholder="وصف قصير للصورة"
                  value={currentSliderImage.subtitle || ''}
                  onChange={(e) => setCurrentSliderImage({...currentSliderImage, subtitle: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label>نص الزر</Label>
                <Input
                  placeholder="تسوقي الآن"
                  value={currentSliderImage.buttonText || ''}
                  onChange={(e) => setCurrentSliderImage({...currentSliderImage, buttonText: e.target.value})}
                />
              </div>

              <Button
                onClick={() => {
                  if (currentSliderImage.imageFile && currentSliderImage.title) {
                    setFormData(prev => ({
                      ...prev,
                      sliderImages: [
                        ...(prev.sliderImages || []),
                        {
                          ...(currentSliderImage as SliderImage),
                          id: `banner${(prev.sliderImages?.length || 0) + 1}`
                        }
                      ]
                    }));
                    setCurrentSliderImage({
                      image: '',
                      title: '',
                      subtitle: '',
                      buttonText: ''
                    });
                    // Clear the file input
                    if (sliderImageInputRef.current) {
                      sliderImageInputRef.current.value = '';
                    }
                  }
                }}
                className="w-full bg-green-500 hover:bg-green-600"
                disabled={!currentSliderImage.imageFile || !currentSliderImage.title}
              >
                إضافة الصورة
              </Button>
            </div>

            {formData.sliderImages && formData.sliderImages.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold">صور السلايدر المضافة: {formData.sliderImages.length}</h4>
                <div className="space-y-2">
                  {formData.sliderImages.map((slider) => (
                    <div key={slider.id} className="p-3 bg-gray-100 rounded-lg flex justify-between items-center">
                      <span>{slider.title}</span>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            sliderImages: prev.sliderImages?.filter(s => s.id !== slider.id) || []
                          }));
                        }}
                      >
                        حذف
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {errors.sliderImages && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                <span className="text-sm text-red-700">{errors.sliderImages}</span>
              </div>
            )}
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <MapPin className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">موقع المخزن</h3>
                <p className="text-sm text-gray-600">حدد موقع مخزنك لتسهيل عمليات التوصيل</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="warehouseAddress">عنوان المخزن *</Label>
                <Textarea
                  id="warehouseAddress"
                  placeholder="أدخل عنوان المخزن بالتفصيل (المدينة، المنطقة، الشارع، رقم المبنى)"
                  value={formData.warehouseAddress || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, warehouseAddress: e.target.value }))}
                  rows={3}
                  className={errors.warehouseAddress ? 'border-red-500' : ''}
                />
                {errors.warehouseAddress && <p className="text-xs text-red-500">{errors.warehouseAddress}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="warehouseCity">المدينة *</Label>
                  <Select
                    value={formData.warehouseCity || ''}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, warehouseCity: value }))}
                  >
                    <SelectTrigger className={errors.warehouseCity ? 'border-red-500' : ''}>
                      <SelectValue placeholder="اختر المدينة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tripoli">طرابلس</SelectItem>
                      <SelectItem value="benghazi">بنغازي</SelectItem>
                      <SelectItem value="misrata">مصراتة</SelectItem>
                      <SelectItem value="zawia">الزاوية</SelectItem>
                      <SelectItem value="khoms">خمس</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.warehouseCity && <p className="text-xs text-red-500">{errors.warehouseCity}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="warehousePhone">رقم هاتف المخزن</Label>
                  <Input
                    id="warehousePhone"
                    placeholder="0912345678"
                    value={formData.warehousePhone || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, warehousePhone: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>حدد موقع المخزن على الخريطة</Label>
                  <WarehouseMapPicker
                    value={formData.warehouseLat && formData.warehouseLng ? { lat: formData.warehouseLat, lng: formData.warehouseLng } : null}
                    onChange={(coords) => setFormData((prev) => ({ ...prev, warehouseLat: coords.lat, warehouseLng: coords.lng }))}
                    height={280}
                  />
                  {errors.warehouseLocation && (
                    <p className="text-xs text-red-500">{errors.warehouseLocation}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>خيارات المخزون</Label>
                  <div className="flex flex-wrap gap-3">
                    {[
                      { id: 'own', label: 'مخزني الخاص' },
                      { id: 'platform', label: 'مخازن إشرو' },
                      { id: 'both', label: 'الاثنان معًا' }
                    ].map((opt) => (
                      <label
                        key={opt.id}
                        className={`px-4 py-2 border rounded-lg cursor-pointer transition-colors ${formData.warehouseMode === (opt.id as any) ? 'bg-emerald-50 border-emerald-400' : 'hover:bg-gray-50'}`}
                      >
                        <input
                          type="radio"
                          className="sr-only"
                          checked={formData.warehouseMode === (opt.id as any)}
                          onChange={() => setFormData((prev) => ({ ...prev, warehouseMode: opt.id as any }))}
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-red-900 mb-1">أهمية تحديد موقع المخزن</h4>
                    <p className="text-sm text-red-700">
                      موقع المخزن مهم لتسهيل عمليات التوصيل والشحن. تأكد من إدخال العنوان الصحيح لتجنب تأخير الطلبات.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold">جاهز لإنشاء المتجر</h3>
            <p className="text-gray-600">اضغط "إنشاء المتجر" لإكمال العملية</p>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                تحقق من جميع البيانات جيداً قبل الإنشاء. بعد الإنشاء، سيتم نقلك إلى صفحة المتجر مباشرة.
              </p>
            </div>
          </div>
        );

      case 9:
        return (
          <div className="space-y-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">تم إنشاء المتجر بنجاح! 🎉</h3>
            <p className="text-gray-600 mb-4">جاري إعادة توجيهك إلى صفحة متجرك...</p>
            <div className="spin-animation">
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* الهيدر */}
      <header className="p-4 border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            الرئيسية
          </Button>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Store className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-primary">إشرو</span>
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={onNavigateToLogin}
          >
            تسجيل الدخول
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* العنوان وشريط التقدم */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2 text-center w-full flex justify-center">إنشاء حساب</h1>
          <p className="text-slate-600 mb-6 text-center w-full flex justify-center">أكمل الخطوات التالية لإطلاق متجرك الإلكتروني</p>
          
          <div className="max-w-md mx-auto">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-slate-600">الخطوة {currentStep} من {totalSteps}</span>
              <span className="text-sm font-medium text-primary">{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>

        {/* محتوى الخطوة */}
        <div className="max-w-2xl mx-auto">
          <Card className="mb-8">
            <CardContent className="p-8">
              {renderStep()}
            </CardContent>
          </Card>

          {/* أزرار التنقل */}
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              {currentStep > 1 && (
                <Button 
                  variant="outline" 
                  onClick={handlePrevious}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  السابق
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              {currentStep < 8 ? (
                <Button 
                  onClick={handleNext}
                  className="flex items-center gap-2"
                >
                  التالي
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="bg-green-500 hover:bg-green-600 flex items-center gap-2"
                >
                  {isLoading ? 'جاري الإنشاء...' : 'إنشاء المتجر'}
                  <CheckCircle className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* المميزات */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8 text-slate-800 w-full flex justify-center">ما ستحصل عليه مع إشرو</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <div className={`mb-4 ${benefit.color} flex justify-center`}>
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-slate-800">{benefit.title}</h3>
                <p className="text-sm text-slate-600">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* نافذة نجاح إنشاء الحساب */}
      {showAccountSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl relative border-2 border-green-200">
            <button
              onClick={() => setShowAccountSuccessModal(false)}
              title="إغلاق"
              className="absolute top-4 left-4 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors z-10"
            >
              <X className="h-4 w-4 text-gray-700" />
            </button>

            <div className="p-8 text-center">
              {/* أيقونة النجاح */}
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>

              {/* رسالة النجاح */}
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                ✨✨ تم إنشاء الحساب بنجاح !! ✨✨
              </h2>

              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                نتمنى لك رحلة ممتعة معنا بمنصة إشرو
              </p>

              {/* معلومات المتجر */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6 text-right">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">اسم المتجر:</span>
                    <span className="font-semibold text-gray-900">{formData.nameAr}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">البريد الإلكتروني:</span>
                    <span className="font-semibold text-gray-900">{formData.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">رابط المتجر:</span>
                    <span className="font-semibold text-green-600">{formData.subdomain}.eshro.ly</span>
                  </div>
                </div>
              </div>

              {/* زر البدء */}
              <button
                onClick={() => {
                  setShowAccountSuccessModal(false);
                  setShowWelcomeModal(true);
                }}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 text-lg"
              >
                <Sparkles className="h-5 w-5" />
                ابدأ رحلتك مع إشرو
                <Sparkles className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* نافذة النجاح في إنشاء المتجر */}
      {showStoreSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl relative border-2 border-green-200">
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                تمت عملية الانشاء كاملة بنجاح !
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6 text-center">
                نتمنى لك وقت ممتعا معنا
              </p>
              <button
                onClick={() => {
                  setShowStoreSuccessModal(false);
                  setShowWelcomeModal(true);
                }}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                متابعة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* نافذة التحذير من التكرار */}
      {showDuplicateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl relative border-2 border-red-200">
            <button
              onClick={() => setShowDuplicateModal(false)}
              title="إغلاق"
              className="absolute top-4 left-4 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors z-10"
            >
              <X className="h-4 w-4 text-gray-700" />
            </button>

            <div className="p-8 text-center">
              {/* أيقونة التحذير */}
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="h-10 w-10 text-red-600" />
              </div>

              {/* رسالة التحذير */}
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                اسم المستخدم او رقم الموبايل مسجل لدينا مسبقا !!
              </h2>

              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                {duplicateField === 'email' && 'البريد الإلكتروني الذي أدخلته مسجل لدينا مسبقاً'}
                {duplicateField === 'phone' && 'رقم الهاتف الذي أدخلته مسجل لدينا مسبقاً'}
              </p>

              {/* معلومات التكرار */}
              <div className="bg-red-50 rounded-xl p-4 mb-6 text-right">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-red-600">الحقل المكرر:</span>
                    <span className="font-semibold text-gray-900">
                      {duplicateField === 'email' ? 'البريد الإلكتروني' : 'رقم الهاتف'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-600">القيمة:</span>
                    <span className="font-semibold text-gray-900">
                      {duplicateField === 'email' ? formData.email : formData.phone}
                    </span>
                  </div>
                </div>
              </div>

              {/* زر فهم */}
              <button
                onClick={() => setShowDuplicateModal(false)}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                فهمت، سأقوم بتغيير البيانات
              </button>
            </div>
          </div>
        </div>
      )}

      {/* نافذة ترحيب التاجر */}
      {showWelcomeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-green-50 via-blue-50 to-primary/10 rounded-3xl max-w-md w-full max-h-[90vh] overflow-hidden shadow-2xl relative border-2 border-primary/20">

            {/* زر الإغلاق */}
            <button
              onClick={() => {
                setShowWelcomeModal(false);
                onNavigateToLogin();
              }}
              title="إغلاق"
              className="absolute top-4 left-4 w-8 h-8 bg-gray-200/80 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors z-10"
            >
              <X className="h-4 w-4 text-gray-700" />
            </button>

            {/* الواجهة الأولى - الترحيب */}
            <div className="relative p-6">
              {/* العنوان والرموز */}
              <div className="text-center mb-6">
                <div className="mb-4">
                  <span className="text-2xl">🏆</span>
                  <span className="text-sm font-bold text-primary mx-2">أهلاً وسهلاً بك عزيزي التاجر!</span>
                  <span className="text-2xl">🏆</span>
                </div>
                <p className="text-orange-500 font-bold text-lg mb-4">🎉 مرحباً بك في منصة إشرو 🎉</p>
                <p className="text-gray-700 text-sm mb-4">نحن سعداء بانضمامك إلى مجتمعنا المتنامي من التجار الناجحين</p>
              </div>

              {/* مميزات التاجر */}
              <div className="bg-primary/10 border-2 border-primary/30 rounded-xl p-4 mb-6">
                <div className="text-center">
                  <h4 className="text-primary font-bold mb-3">🌟 ما ستحصل عليه كتاجر مع إشرو</h4>

                  <div className="space-y-3 text-right text-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-gray-700">متجر إلكتروني احترافي مجاناً لمدة 7 أيام</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-gray-700">لوحة تحكم متطورة لإدارة المتجر والطلبات</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-gray-700">نظام دفع إلكتروني متكامل وآمن</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-gray-700">خدمات الشحن والتوصيل المتكاملة</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-gray-700">دعم فني متخصص 24/7</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-gray-700">أدوات تسويقية متقدمة لزيادة المبيعات</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* معلومات المتجر */}
              <div className="bg-white/80 rounded-xl p-4 mb-6 text-right">
                <h5 className="font-bold text-gray-800 mb-3">📋 تفاصيل متجرك</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">اسم المتجر:</span>
                    <span className="font-semibold text-gray-900">{formData.nameAr}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">رابط المتجر:</span>
                    <span className="font-semibold text-green-600">{formData.subdomain}.eshro.ly</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">البريد الإلكتروني:</span>
                    <span className="font-semibold text-gray-900">{formData.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">تاريخ الإنشاء:</span>
                    <span className="font-semibold text-gray-900">{new Date().toLocaleDateString('ar-LY')}</span>
                  </div>
                </div>
              </div>

              {/* زر البدء */}
              <button
                onClick={() => {
                  setShowWelcomeModal(false);
                  onNavigateToLogin();
                }}
                className="w-full bg-gradient-to-r from-green-500 to-primary hover:from-green-600 hover:to-primary/90 text-white font-bold py-4 rounded-xl shadow-lg text-base"
              >
                🏪 ابدأ إدارة متجرك الآن 🏪
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateStorePage;
