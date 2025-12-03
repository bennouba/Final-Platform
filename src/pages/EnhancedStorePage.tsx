import React, { useEffect, useState } from 'react';
import type { JSX } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  AlertTriangle,
  ArrowLeft,
  Bell,
  Check,
  Crown,
  Eye,
  Filter,
  Grid3X3,
  Heart,
  List,
  Search,
  Share2,
  ShoppingCart,
  Sparkles,
  Star,
  TrendingUp,
  X
} from 'lucide-react';
import { getStoresData } from '@/data/ecommerceData';
import ShareMenu from '@/components/ShareMenu';
import { getProductsByCategory, productCategories, sheirineJewelryCategories } from '@/data/productCategories';
import { allStoreProducts } from '@/data/allStoreProducts';
import { nawaemProducts } from '@/data/stores/nawaem/products';
import { sheirineProducts } from '@/data/stores/sheirine/products';
import { prettyProducts } from '@/data/stores/pretty/products';
import { deltaProducts } from '@/data/stores/delta-store/products';
import { magnaBeautyProducts } from '@/data/stores/magna-beauty/products';

import type { Product } from '@/data/storeProducts';
import NotifyWhenAvailable from '@/components/NotifyWhenAvailable';
import StoreFrontSlider from '@/components/StoreFrontSlider';
import StoreAds from '@/components/StoreAds';

interface EnhancedStorePageProps {
  storeSlug: string;
  onBack: () => void;
  onProductClick: (productId: number) => void;
  onAddToCart: (product: Product) => void;
  onToggleFavorite: (productId: number) => void;
  onNotifyWhenAvailable: (productId: number) => void;
  favorites: number[];
}

const EnhancedStorePage: React.FC<EnhancedStorePageProps> = ({
  storeSlug,
  onBack,
  onProductClick,
  onAddToCart,
  onToggleFavorite,
  onNotifyWhenAvailable,
  favorites = []
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high' | 'rating'>('newest');
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // العثور على المتجر
  const storesData = getStoresData();
  const store = storesData.find(s => s.slug === storeSlug);
  
  if (!store) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-4">متجر غير موجود</h2>
          <Button onClick={onBack}>العودة للرئيسية</Button>
        </div>
      </div>
    );
  }

  // تصفية وترتيب المنتجات
  let storeProducts: any[] = [];
  if (store) {
    switch (store.slug) {
      case 'nawaem':
        storeProducts = nawaemProducts;
        break;
      case 'sheirine':
        storeProducts = sheirineProducts;
        break;
      case 'pretty':
        storeProducts = allStoreProducts.filter(p => p.storeId === store.id) as any;
        break;
      case 'delta-store':
        storeProducts = deltaProducts;
        break;
      case 'magna-beauty':
        storeProducts = magnaBeautyProducts;
        break;

      default:
        try {
          const localProducts = localStorage.getItem(`store_products_${store.slug}`);
          if (localProducts) {
            storeProducts = JSON.parse(localProducts);
          } else {
            storeProducts = allStoreProducts.filter(p => p.storeId === store.id) as any;
          }
        } catch (error) {

          storeProducts = allStoreProducts.filter(p => p.storeId === store.id) as any;
        }
    }
  }
  
  let filteredProducts = selectedCategory === 'all' 
    ? storeProducts 
    : getProductsByCategory(storeProducts, selectedCategory);

  // تصفية بالبحث
  if (searchQuery) {
    filteredProducts = filteredProducts.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // ترتيب المنتجات
  filteredProducts.sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
      default:
        return b.id - a.id;
    }
  });

  const renderStarRating = (rating: number): JSX.Element => {
    const stars: JSX.Element[] = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star 
          key={i} 
          className={`h-4 w-4 ${i <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
        />
      );
    }
    return <div className="flex items-center gap-1">{stars}</div>;
  };

  const getCategoryIcon = (categoryId: string) => {
    const categories = storeSlug === 'sheirine' ? sheirineJewelryCategories : productCategories;
    const category = categories.find(c => c.id === categoryId);
    return category?.icon || '📦';
  };

  // دالة للحصول على الفئات المناسبة
  const getStoreCategories = () => {
    return storeSlug === 'sheirine' ? sheirineJewelryCategories : productCategories;
  };

  // دالة للحصول على لون البadge بالألوان المطلوبة
  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'جديد': return 'bg-green-800'; // الأخضر الداكن
      case 'اكثر طلبا': return 'bg-blue-800'; // الأزرق الملكي
      case 'اكثر مبيعا': return 'bg-purple-600'; // البنفسجي
      case 'اكثر مشاهدة': return 'bg-yellow-500'; // الأصفر
      case 'اكثر إعجاب': return 'bg-red-500'; // الأحمر للإعجاب
      case 'مميز': return 'bg-red-600'; // الأحمر
      case 'تخفيضات': return 'bg-pink-600'; // الوردي
      case 'حصري': return 'bg-gray-400'; // الفضي اللامع
      case 'غير متوفر': return 'bg-orange-800'; // البرتقالي الداكن
      default: return 'bg-gray-500';
    }
  };

  // دالة للحصول على البadge من الـ tags بالأسماء العربية المطلوبة
  const getBadgeFromTags = (tags: string[]): string | null => {
    const badgePriority = [
      'غير متوفر',
      'جديد',
      'اكثر طلبا',
      'اكثر مبيعا',
      'اكثر مشاهدة',
      'اكثر إعجاب',
      'مميز',
      'تخفيضات',
      'حصري'
    ];

    for (const badge of badgePriority) {
      if (tags.includes(badge)) {
        return badge;
      }
    }
    return null;
  };

  // معالجات النافذة المحلية
  const handleNotifyWhenAvailable = (product: Product) => {
    setSelectedProduct(product);
    setShowNotifyModal(true);
    onNotifyWhenAvailable(product.id);
  };

  const handleCloseNotifyModal = () => {
    setShowNotifyModal(false);
    setSelectedProduct(null);
  };


  return (
    <div className="min-h-screen bg-gray-50">
      {/* هيدر المتجر */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                العودة
              </Button>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100">
                  <img
                    src={store.logo}
                    alt={store.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      (e.target as HTMLElement).parentElement!.innerHTML = 
                        `<div class="w-full h-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">${store.name.charAt(0)}</div>`;
                    }}
                  />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{store.name}</h1>
                  <p className="text-sm text-gray-600">{store.description}</p>
                </div>
              </div>
            </div>

            {store.isActive && (
              <Badge className="bg-green-500">
                متجر نشط
              </Badge>
            )}
          </div>
        </div>
      </header>

      <div className="mb-6">
        <div className="container mx-auto px-4">
          <StoreFrontSlider storeSlug={storeSlug} storeId={store.slug} />
        </div>
      </div>

      <div className="mb-6">
        <div className="container mx-auto px-4">
          <StoreAds storeId={store.slug} />
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* شريط البحث والتصفية */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن المنتجات..."
                className="pr-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* تصنيفات المنتجات */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span>📦</span>
            جميع المنتجات ({storeProducts.length})
          </button>
          
          {getStoreCategories().map((category) => {
            const count = getProductsByCategory(storeProducts, category.id).length;
            if (count === 0) return null;
            
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span>{category.icon}</span>
                {category.name} ({count})
              </button>
            );
          })}
        </div>

        {/* فرز المنتجات */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-gray-600">
            عرض {filteredProducts.length} من {storeProducts.length} منتج
          </div>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="ترتيب المنتجات"
          >
            <option value="newest">الأحدث</option>
            <option value="price-low">السعر: من الأقل للأعلى</option>
            <option value="price-high">السعر: من الأعلى للأقل</option>
            <option value="rating">الأعلى تقييماً</option>
          </select>
        </div>

        {/* عرض المنتجات */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">لا توجد منتجات</h3>
            <p className="text-gray-500">جرب تغيير معايير البحث أو التصنيف</p>
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }>
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                viewMode={viewMode}
                isFavorite={favorites.includes(product.id)}
                onProductClick={() => {
                  if (product.inStock && product.isAvailable) {
                    onProductClick(product.id);
                  } else {
                    handleNotifyWhenAvailable(product);
                  }
                }}
                onAddToCart={() => onAddToCart(product)}
                onToggleFavorite={() => onToggleFavorite(product.id)}
                onNotifyWhenAvailable={() => handleNotifyWhenAvailable(product)}
                renderStarRating={renderStarRating}
              />
            ))}
          </div>
        )}
      </div>

      {/* نافذة نبهني عند التوفر المحلية */}
      {showNotifyModal && selectedProduct && (
        <NotifyWhenAvailable
          isOpen={showNotifyModal}
          product={selectedProduct}
          onClose={handleCloseNotifyModal}
          storeSlug={store.slug}
          storeName={store.name}
        />
      )}
    </div>
  );
};

// مكون كارد المنتج
const ProductCard: React.FC<{
  product: Product;
  viewMode: 'grid' | 'list';
  isFavorite: boolean;
  onProductClick: () => void;
  onAddToCart: () => void;
  onToggleFavorite: () => void;
  onNotifyWhenAvailable: () => void;
  renderStarRating: (rating: number) => React.ReactNode;
}> = ({
  product,
  viewMode,
  isFavorite,
  onProductClick,
  onAddToCart,
  onToggleFavorite,
  onNotifyWhenAvailable,
  renderStarRating
}) => {

  const getTagIcon = (tagType: string) => {
    switch (tagType) {
      case 'featured': return <Crown className="h-3 w-3" />;
      case 'bestselling': return <TrendingUp className="h-3 w-3" />;
      case 'most_requested': return <Star className="h-3 w-3" />;
      case 'new': return <Sparkles className="h-3 w-3" />;
      case 'top_rated': return <Star className="h-3 w-3" />;
      case 'out_of_stock': return <AlertTriangle className="h-3 w-3" />;
      default: return null;
    }
  };

  // دالة للحصول على لون البadge بالألوان المطلوبة
  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'جديد': return 'bg-green-800'; // الأخضر الداكن
      case 'اكثر طلبا': return 'bg-blue-800'; // الأزرق الملكي
      case 'اكثر مبيعا': return 'bg-purple-600'; // البنفسجي
      case 'اكثر مشاهدة': return 'bg-yellow-500'; // الأصفر
      case 'اكثر إعجاب': return 'bg-red-500'; // الأحمر للإعجاب
      case 'مميز': return 'bg-red-600'; // الأحمر
      case 'تخفيضات': return 'bg-pink-600'; // الوردي
      case 'حصري': return 'bg-gray-400'; // الفضي اللامع
      case 'غير متوفر': return 'bg-orange-800'; // البرتقالي الداكن
      default: return 'bg-gray-500';
    }
  };

  // دالة للحصول على البadge من الـ tags بالأسماء العربية المطلوبة
  const getBadgeFromTags = (tags: string[]): string | null => {
    const badgePriority = [
      'غير متوفر',
      'جديد',
      'اكثر طلبا',
      'اكثر مبيعا',
      'اكثر مشاهدة',
      'اكثر إعجاب',
      'مميز',
      'تخفيضات',
      'حصري'
    ];

    for (const badge of badgePriority) {
      if (tags.includes(badge)) {
        return badge;
      }
    }
    return null;
  };


  if (viewMode === 'list') {
    return (
      <Card
        className={`overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer ${!product.inStock ? 'opacity-75' : ''}`}
        onClick={onProductClick}
      >
        <CardContent className="p-0">
          <div className="flex">
            <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative flex-shrink-0">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  (e.target as HTMLElement).parentElement!.innerHTML =
                    '<div class="w-full h-full flex items-center justify-center text-4xl">📦</div>';
                }}
              />

              {/* Discount Badge for list view */}
              {product.originalPrice > product.price && (
                <Badge className="absolute top-2 left-2 bg-red-500 text-white text-xs">
                  -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </Badge>
              )}

              {!product.inStock && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Badge variant="destructive" className="text-xs">
                    غير متوفر
                  </Badge>
                </div>
              )}
            </div>
            
            <div className="flex-1 p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                </div>
                
                <div className="flex gap-1 ml-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-8 h-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite();
                    }}
                  >
                    <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                  
                  <div onClick={(e) => e.stopPropagation()}>
                    <ShareMenu 
                      url={`${window.location.origin}/product/${product.id}`}
                      title={`شاهد هذا المنتج الرائع: ${product.name}`}
                      size="sm"
                      variant="ghost"
                      className="w-8 h-8 p-0"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mb-3">
                {renderStarRating(product.rating)}
                <span className="text-xs text-gray-500">({product.reviews})</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {product.inStock && product.isAvailable ? (
                    <>
                      <span className="text-xl font-bold text-primary">{product.price} د.ل</span>
                      {product.originalPrice > product.price && (
                        <span className="text-sm text-gray-500 line-through">
                          {product.originalPrice} د.ل
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-xl font-bold text-red-600">غير متوفر</span>
                  )}
                </div>
                
                {product.inStock && (product.quantity || 0) > 0 ? (
                  <Button size="sm" onClick={(e) => { e.stopPropagation(); onAddToCart(); }}>
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    أضف للسلة
                  </Button>
                ) : (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={(e) => { e.stopPropagation(); onNotifyWhenAvailable(); }}
                  >
                    <Bell className="h-4 w-4 mr-1" />
                    أخبرني عند التوفر
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // عرض الشبكة
  return (
    <Card
      className={`overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group ${!product.inStock ? 'opacity-75' : ''}`}
      onClick={onProductClick}
    >
      <CardContent className="p-0">
        <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-contain bg-white group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLElement).parentElement!.innerHTML = 
                '<div class="w-full h-full flex items-center justify-center text-4xl">📦</div>';
            }}
          />
          
          {/* علامات المنتج */}
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            {/* عرض badge بناءً على الـ tags */}
            {(() => {
              const badge = getBadgeFromTags(product.tags);
              return badge ? (
                <Badge className={`text-xs text-white font-bold ${getBadgeColor(badge)}`}>
                  {badge}
                </Badge>
              ) : null;
            })()}

            {/* عرض tags كسلاسل نصية */}
            {product.tags && product.tags.slice(0, 2).map((tag, index) => (
              <Badge key={index} className={`text-xs ${
                tag === 'مميزة' ? 'bg-yellow-500' :
                tag === 'أكثر مبيعاً' ? 'bg-red-500' :
                tag === 'أكثر طلباً' ? 'bg-blue-500' :
                tag === 'جديد' ? 'bg-green-500' :
                tag === 'أكثر تقييماً' ? 'bg-purple-500' :
                'bg-gray-500'
              }`}>
                <span>{tag}</span>
              </Badge>
            ))}
          </div>

          {/* Discount Badge */}
          <div className="absolute top-2 left-2">
            {product.originalPrice > product.price && (
              <Badge className="bg-red-500 text-white text-xs">
                -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
              </Badge>
            )}
          </div>

          {!product.inStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Badge variant="destructive">
                غير متوفر
              </Badge>
            </div>
          )}

          {/* أزرار التفاعل */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="outline"
              size="sm"
              className="w-8 h-8 p-0 bg-white/90"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite();
              }}
            >
              <Heart className={`h-3 w-3 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            
            <ShareMenu 
              url={`${window.location.origin}/product/${product.id}`}
              title={`شاهد هذا المنتج الرائع: ${product.name}`}
              size="sm"
              variant="outline"
              className="w-8 h-8 p-0 bg-white/90"
            />
          </div>

          {/* إحصائيات المنتج */}
          <div className="absolute bottom-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {product.views}
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
          
          <div className="flex items-center gap-2 mb-3">
            {renderStarRating(product.rating)}
            <span className="text-xs text-gray-500">({product.reviews})</span>
          </div>
          
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {product.inStock && product.isAvailable ? (
                <>
                  <span className="text-lg font-bold text-primary">{product.price} د.ل</span>
                  {product.originalPrice > product.price && (
                    <>
                      <span className="text-sm text-gray-500 line-through">
                        {product.originalPrice} د.ل
                      </span>
                      <Badge className="bg-red-500 text-xs">
                        -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                      </Badge>
                    </>
                  )}
                </>
              ) : (
                <span className="text-lg font-bold text-red-600">غير متوفر</span>
              )}
            </div>
          </div>
          
          {product.inStock && (product.quantity || 0) > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={(e) => { e.stopPropagation(); onAddToCart(); }}
              >
                <ShoppingCart className="h-4 w-4 mr-1" />
                للسلة
              </Button>
              <Button 
                size="sm"
                onClick={(e) => { e.stopPropagation(); onProductClick(); }}
              >
                عرض التفاصيل
              </Button>
            </div>
          ) : (
            <Button 
              size="sm" 
              variant="outline"
              className="w-full"
              onClick={(e) => { e.stopPropagation(); onNotifyWhenAvailable(); }}
            >
              <Bell className="h-4 w-4 mr-1" />
              أخبرني عند التوفر
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedStorePage;
