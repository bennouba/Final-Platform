// Main application component for the EISHRO e-commerce platform
import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PartnersPage from "@/pages/PartnersPage";
import DiscountSlider from "@/pages/DiscountSlider";
import ModernStorePage from "@/pages/ModernStorePage";
import EnhancedProductPage from "@/pages/EnhancedProductPage";
import CartPage from "@/pages/CartPage";
import EnhancedCheckoutPage from "@/pages/EnhancedCheckoutPage";
import CompleteOrdersPage from "@/pages/CompleteOrdersPage";
import ShopLoginPage from "@/pages/ShopLoginPage";
import CreateStorePage from "@/pages/CreateStorePage";
import AccountTypeSelectionPage from "@/pages/AccountTypeSelectionPage";
import VisitorRegistrationPage from "@/pages/VisitorRegistrationPage";
import TermsAndConditionsPage from "@/pages/TermsAndConditionsPage";
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage";
import EnhancedMerchantDashboard from "@/pages/EnhancedMerchantDashboard";
import MerchantAnalytics from "@/pages/MerchantAnalytics";
import MerchantFinance from "@/pages/MerchantFinance";
import MerchantSettings from "@/pages/MerchantSettings";
import AdminPortal from "@/pages/AdminPortal";
import CustomerDashboard, { CreateOrderPayload, OrderRecord } from "@/pages/CustomerDashboard";
import { merchants as merchantProfiles } from "@/components/admin/merchantConfig";
import AddToCartPopup from "@/components/AddToCartPopup";
import AddToCartSuccessModal from "@/components/AddToCartSuccessModal";
import OrderSuccessModal from "@/components/OrderSuccessModal";
import WelcomePopup from "@/components/WelcomePopup";
import StoreCreatedSuccessModal from "@/components/StoreCreatedSuccessModal";
import BrandSlider from "@/components/BrandSlider";
import { partnersData, statsData, storesData, generateOrderId } from "@/data/ecommerceData";
import { enhancedSampleProducts } from "@/data/productCategories";
import { allStoreProducts } from "@/data/allStoreProducts";
import {
  AlertCircle,
  ArrowLeft,
  Bell,
  DollarSign,
  Globe,
  Menu,
  Package,
  Settings,
  Shield,
  ShoppingCart,
  Smartphone,
  Star,
  Store,
  TrendingUp,
  Truck,
  User,
  Users,
  X,
  Zap
} from "lucide-react";

const dashboardShippingConfig: Record<string, { type: "normal" | "express"; cost: number; estimatedTime: string }> = {
  "normal-tripoli": { type: "normal", cost: 40, estimatedTime: "24-96 ساعة" },
  "normal-outside": { type: "normal", cost: 120, estimatedTime: "24-96 ساعة" },
  "express-tripoli": { type: "express", cost: 70, estimatedTime: "5-12 ساعة" },
  "express-outside": { type: "express", cost: 160, estimatedTime: "5-12 ساعة" }
};

const MERCHANT_LOGIN_CREDENTIALS: Record<string, { email: string; password: string; phone: string }> = {
  nawaem: { email: "mounir@gmail.com", password: "mounir123", phone: "218910000001" },
  sherine: { email: "salem@gmail.com", password: "salem123", phone: "218910000002" },
  delta: { email: "majed@gmail.com", password: "majed123", phone: "218910000003" },
  pretty: { email: "kamel@gmail.com", password: "kamel123", phone: "218910000004" },
  magna: { email: "hasan@gmail.com", password: "hasan123", phone: "218910000005" }
};

// FloatingCubes component: Renders animated floating cubes for background decoration
// مكون المكعبات المتحركة
const FloatingCubes = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className={`absolute w-4 h-4 bg-primary/20 floating-cube`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${i * 0.5}s`,
          }}
        />
      ))}
    </div>
  );
};

// Header component: Navigation header with logo, menu items, cart icon, and user actions
// مكون الهيدر المحسن
const Header = ({
  onNavigate,
  cartItemsCount,
  unavailableOrdersCount,
  onCartOpen,
  onOrdersOpen,
  isLoggedInAsVisitor,
  currentVisitor,
  setCurrentVisitor,
  setIsLoggedInAsVisitor
}: {
  onNavigate: (page: string) => void;
  cartItemsCount: number;
  unavailableOrdersCount: number;
  onCartOpen: () => void;
  onOrdersOpen: () => void;
  isLoggedInAsVisitor: boolean;
  currentVisitor: any;
  setCurrentVisitor: (visitor: any) => void;
  setIsLoggedInAsVisitor: (loggedIn: boolean) => void;
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <FloatingCubes />
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/eshro-new-logo.png"
            alt="إشرو"
            className="h-12 w-32 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              const fallback = document.createElement('div');
              fallback.className = 'w-32 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg';
              fallback.innerHTML = '<svg class="h-7 w-7 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="m2 17 10 5 10-5M2 12l10 5 10-5"/></svg>';
              (e.target as HTMLImageElement).parentNode?.appendChild(fallback);
            }}
          />
        </div>

        {/* التنقل الرئيسي - مع تباعد محسن وحجم أكبر */}
        <nav className="hidden md:flex items-center gap-16">
          <button 
            onClick={() => onNavigate('home')}
            className="text-lg font-semibold transition-colors hover:text-primary text-muted-foreground hover:scale-105 py-2 px-4 rounded-lg hover:bg-primary/10"
          >
            الرئيسية
          </button>
          <button 
            onClick={() => {
              const aboutSection = document.querySelector('.services-section');
              if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="text-lg font-semibold transition-colors hover:text-primary text-muted-foreground hover:scale-105 py-2 px-4 rounded-lg hover:bg-primary/10"
          >
            عن إشرو
          </button>
          <button 
            onClick={() => {
              const storesSection = document.querySelector('.stores-carousel');
              if (storesSection) {
                storesSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="text-lg font-semibold transition-colors hover:text-primary text-muted-foreground hover:scale-105 py-2 px-4 rounded-lg hover:bg-primary/10"
          >
            متاجر إشرو
          </button>
          <button 
            onClick={() => onNavigate('partners')}
            className="text-lg font-semibold transition-colors hover:text-primary text-muted-foreground hover:scale-105 whitespace-nowrap py-2 px-4 rounded-lg hover:bg-primary/10"
          >
            شركاء النجاح
          </button>
          <button 
            onClick={() => {
              const footerSection = document.querySelector('footer');
              if (footerSection) {
                footerSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="text-lg font-semibold transition-colors hover:text-primary text-muted-foreground hover:scale-105 py-2 px-4 rounded-lg hover:bg-primary/10"
          >
            اتصل بنا
          </button>
        </nav>

        <div className="flex items-center gap-6">
          {/* أيقونة بوابة الإدارة - مخفية تماماً عن المستخدمين العاديين */}
          {/* سيتم إظهارها فقط للمدراء عبر نظام خاص في المستقبل */}

         {/* أيقونة لوحة تحكم المستخدم - تظهر فقط بعد تسجيل الدخول */}
         {isLoggedInAsVisitor && currentVisitor && (
           <Button
             variant="ghost"
             size="sm"
             onClick={() => {
               console.log('🔍 Dashboard button clicked - Context Analysis:');
               console.log('isLoggedInAsVisitor:', isLoggedInAsVisitor);
               console.log('currentVisitor:', currentVisitor);
               console.log('🚀 Navigating to customer-dashboard');
               onNavigate('customer-dashboard');
             }}
             className="relative shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700"
             title="لوحة تحكم المستخدم"
           >
             <User className="h-5 w-5" />
             <span className="sr-only">لوحة تحكم المستخدم</span>
           </Button>
         )}

         {/* أيقونة الطلبات */}
         <Button variant="ghost" size="sm" onClick={onOrdersOpen} className="relative">
           <Package className="h-5 w-5" />
           {unavailableOrdersCount > 0 && (
             <span className="absolute -top-2 -right-2 bg-orange-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
               {unavailableOrdersCount}
             </span>
           )}
           <span className="sr-only">طلباتي</span>
         </Button>

         {/* أيقونة السلة */}
         <Button variant="ghost" size="sm" onClick={onCartOpen} className="relative">
           <ShoppingCart className="h-5 w-5" />
           {cartItemsCount > 0 && (
             <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
               {cartItemsCount}
             </span>
           )}
           <span className="sr-only">السلة</span>
         </Button>

         {/* عرض معلومات المستخدم إذا كان مسجل دخول */}
         {isLoggedInAsVisitor && currentVisitor ? (
           <div className="relative">
             <button
               onClick={() => {
                 const dropdown = document.getElementById('user-dropdown');
                 if (dropdown) {
                   dropdown.classList.toggle('hidden');
                 }
               }}
               className="flex items-center gap-3 hover:bg-gray-50 rounded-lg p-2 transition-colors"
             >
               {/* صورة المستخدم */}
               <div className="relative">
                 {(() => {
                   const avatarSrc = currentVisitor.avatar || (typeof window !== 'undefined' ? localStorage.getItem('userProfileImage') : null);
                   return avatarSrc ? (
                     <img
                       src={avatarSrc}
                       alt="صورة المستخدم"
                       className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-lg"
                     />
                   ) : (
                     <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg">
                       <span className="text-white text-sm font-bold">
                         {currentVisitor.firstName?.charAt(0) || currentVisitor.name?.charAt(0) || 'م'}
                       </span>
                     </div>
                   );
                 })()}
                 <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
               </div>

               {/* النص المطلوب فقط */}
               <div className="text-right">
                 <p className="text-sm font-medium text-gray-900">
                   مرحباً، {currentVisitor.firstName || currentVisitor.name?.split(' ')[0] || 'مستخدم'}
                 </p>
               </div>
             </button>

             {/* القائمة المنسدلة */}
             <div
               id="user-dropdown"
               className="hidden absolute left-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
             >
               <div className="px-4 py-2 border-b border-gray-100">
                 <p className="text-sm font-medium text-gray-900">
                   {currentVisitor.firstName || currentVisitor.name?.split(' ')[0] || 'مستخدم'}
                 </p>
                 <p className="text-xs text-gray-600">
                   {currentVisitor.membershipType || 'عضو مسجل'}
                 </p>
               </div>

               <button
                 onClick={() => {
                   document.getElementById('user-dropdown')?.classList.add('hidden');
                   onNavigate('customer-dashboard');
                 }}
                 className="w-full text-right px-4 py-2 hover:bg-gray-50 flex items-center gap-3 transition-colors"
               >
                 <User className="h-4 w-4 text-gray-600" />
                 <span className="text-sm">عضو مسجل</span>
               </button>

               <button
                 onClick={() => {
                   document.getElementById('user-dropdown')?.classList.add('hidden');
                   // الانتقال لصفحة الطلبات وتفعيل تبويب المفضلة
                   onNavigate('orders');
                   setTimeout(() => {
                     const favoritesTab = document.querySelector('[data-tab="favorites"]') as HTMLButtonElement;
                     if (favoritesTab) {
                       favoritesTab.click();
                     }
                   }, 100);
                 }}
                 className="w-full text-right px-4 py-2 hover:bg-gray-50 flex items-center gap-3 transition-colors"
               >
                 <Package className="h-4 w-4 text-gray-600" />
                 <span className="text-sm">الطلبات</span>
               </button>

               <button
                 onClick={() => {
                   document.getElementById('user-dropdown')?.classList.add('hidden');
                   // الانتقال لصفحة الطلبات وتفعيل تبويب الطلبات الغير متوفرة
                   onNavigate('orders');
                   setTimeout(() => {
                     const unavailableTab = document.querySelector('[data-tab="unavailable"]') as HTMLButtonElement;
                     if (unavailableTab) {
                       unavailableTab.click();
                     }
                   }, 100);
                 }}
                 className="w-full text-right px-4 py-2 hover:bg-gray-50 flex items-center gap-3 transition-colors"
               >
                 <AlertCircle className="h-4 w-4 text-gray-600" />
                 <span className="text-sm">الطلبات الغير متوفرة</span>
               </button>

               <button
                 onClick={() => {
                   document.getElementById('user-dropdown')?.classList.add('hidden');
                   // الانتقال لصفحة الاشتراكات المستقلة
                   onNavigate('subscriptions');
                 }}
                 className="w-full text-right px-4 py-2 hover:bg-gray-50 flex items-center gap-3 transition-colors"
               >
                 <Bell className="h-4 w-4 text-gray-600" />
                 <span className="text-sm">الاشتراكات</span>
               </button>

               <button
                 onClick={() => {
                   document.getElementById('user-dropdown')?.classList.add('hidden');
                   // الانتقال لواجهة تغيير كلمة المرور المستقلة
                   onNavigate('change-password');
                 }}
                 className="w-full text-right px-4 py-2 hover:bg-gray-50 flex items-center gap-3 transition-colors"
               >
                 <Settings className="h-4 w-4 text-gray-600" />
                 <span className="text-sm">تغيير كلمة المرور</span>
               </button>

               <div className="border-t border-gray-100 mt-2 pt-2">
                 <button
                   onClick={() => {
                     document.getElementById('user-dropdown')?.classList.add('hidden');
                     console.log('Logout clicked');
                     setCurrentVisitor(null);
                     setIsLoggedInAsVisitor(false);
                     localStorage.removeItem('eshro_visitor_user');
                     localStorage.removeItem('eshro_logged_in_as_visitor');
                     alert('تم تسجيل الخروج بنجاح!');
                   }}
                   className="w-full text-right px-4 py-2 hover:bg-red-50 flex items-center gap-3 transition-colors text-red-600"
                 >
                   <ArrowLeft className="h-4 w-4" />
                   <span className="text-sm">تسجيل الخروج</span>
                 </button>
               </div>
             </div>
           </div>
         ) : (
           <Button variant="outline" size="sm" onClick={() => onNavigate('login')} className="hover:bg-primary/10">
             تسجيل الدخول
           </Button>
         )}

         <button
           onClick={() => setIsMenuOpen(!isMenuOpen)}
           className="md:hidden p-2 hover:bg-primary/10 rounded-lg transition-colors"
         >
           {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
         </button>
       </div>
      </div>

      {/* القائمة المحمولة */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur p-4 space-y-2 slide-in-right">
          <button 
            onClick={() => { onNavigate('home'); setIsMenuOpen(false); }}
            className="block w-full text-right py-3 text-sm font-medium hover:text-primary transition-colors hover:bg-primary/5 rounded-lg"
          >
            الرئيسية
          </button>
          <button 
            onClick={() => { onNavigate('about'); setIsMenuOpen(false); }}
            className="block w-full text-right py-3 text-sm font-medium hover:text-primary transition-colors hover:bg-primary/5 rounded-lg"
          >
            عن إشرو
          </button>
          <button 
            onClick={() => { onNavigate('stores'); setIsMenuOpen(false); }}
            className="block w-full text-right py-3 text-sm font-medium hover:text-primary transition-colors hover:bg-primary/5 rounded-lg"
          >
            متاجر إشرو
          </button>
          <button 
            onClick={() => { onNavigate('partners'); setIsMenuOpen(false); }}
            className="block w-full text-right py-3 text-sm font-medium hover:text-primary transition-colors hover:bg-primary/5 rounded-lg"
          >
            شركاء النجاح
          </button>
          <button 
            onClick={() => { onNavigate('contact'); setIsMenuOpen(false); }}
            className="block w-full text-right py-3 text-sm font-medium hover:text-primary transition-colors hover:bg-primary/5 rounded-lg"
          >
            اتصل بنا
          </button>
        </div>
      )}
    </header>
  );
};

// HeroSection component: Main landing section with brand slider
// مكون Hero Section مع سلايدر الماركات
const HeroSection = () => {
  // Array of brand images from slider Eishro folder only
  const brandImages = [
    'babel2.png',
    'collection.jpg',
    'hasamat.jpg',
    'hommer.jpg',
    'lamis.webp',
    'motajadid.jpg',
    'slider9.png',
    'slider10.png',
    'slider11.png',
    'tourri.webp'
  ];

  return (
    <section className="relative w-full bg-gradient-to-br from-background/80 via-primary/3 to-primary/5 overflow-hidden">
      <FloatingCubes />

      <div className="w-full px-4 py-8 relative z-10">
        <BrandSlider
          images={brandImages}
          autoRotateInterval={5000} // 5 seconds
        />
      </div>
    </section>
  );
};

// ServicesSection component: Displays the services offered by the platform
// مكون الخدمات المحسن
const ServicesSection = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const services = [
    {
      icon: <Store className="h-12 w-12" />,
      title: "إنشاء متجر خاص",
      description: "بالتجارة الإلكترونية",
      details: "تصميم متجر مخصص يعكس هوية علامتك التجارية"
    },
    {
      icon: <Smartphone className="h-12 w-12" />,
      title: "عرض منتجاتك",
      description: "بعدة طرق وأشكال مختلفة",
      details: "واجهات عرض تجارية متنوعة"
    },
    {
      icon: <TrendingUp className="h-12 w-12" />,
      title: "تسويق منتجات",
      description: "التجارة باضافة إلى حملات تسويقية متقدمة",
      details: "استراتيجيات تسويق متقدمة"
    },
    {
      icon: <Shield className="h-12 w-12" />,
      title: "وسائل الدفع",
      description: "الإلكترونية",
      details: "دفع آمن وموثوق لعملائك"
    },
    {
      icon: <Truck className="h-12 w-12" />,
      title: "أكثر من أربع شركات",
      description: "توصيل",
      details: "شبكة توصيل شاملة"
    }
  ];

  return (
    <section className="services-section py-20 bg-slate-900 text-white relative overflow-hidden">
      <FloatingCubes />
      
      <div className="container px-4 relative z-10">
        <div className="text-center mb-16 fade-in-up">
          <h2 className="flex items-center justify-center text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              خدماتنا
            </span>
          </h2>
          <p className="flex items-center justify-center text-xl text-gray-300 max-w-3xl mx-auto">
            نعمل على المساعدة لتوفير الوقت المستغرق في النقل للترويج والتسويق لتوسيع الانتشار وادارة الطلبات للتاجر
            لتسهيل البيع والشراء بطرق الدفع المتنوعة وتسريع التوصيل وذلك حرصاً على تقديم حل واحد لجميع
            المدفوعات في مكان واحد
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {services.map((service, index) => (
            <Card 
              key={index}
              className="group bg-white border border-emerald-200 hover:bg-emerald-600 hover:border-emerald-600 hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden transform hover:scale-105"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <CardContent className="p-8 text-center">
                <div className="flex items-center justify-center mb-4 text-emerald-700 group-hover:text-white transition-colors duration-300">
                  {service.icon}
                </div>
                <h3 className="flex items-center justify-center text-xl font-extrabold text-slate-900 group-hover:text-white mb-1 transition-colors">
                  {service.title}
                </h3>
                <p className="flex items-center justify-center text-slate-900 font-semibold group-hover:text-white/90 mb-1">
                  {service.description}
                </p>
                <p className="flex items-center justify-center text-sm text-gray-600 group-hover:text-white/80">
                  {service.details}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>


      </div>
    </section>
  );
};

// StoresCarousel component: Animated carousel displaying available stores
// مكون شريط المتاجر المتحرك
const StoresCarousel = ({ onStoreClick }: { onStoreClick: (storeSlug: string) => void }) => {
  const featuredSlugs = ['nawaem','sheirine','pretty','delta-store','magna-beauty'];
  const logoOverrides: Record<string, string> = {
    'nawaem': '/assets/stores/nawaem.webp',
    'sheirine': '/assets/stores/sheirine.webp',
    'pretty': '/assets/stores/pretty.webp',
    'delta-store': '/assets/stores/delta-store.webp',
    'magna-beauty': '/assets/stores/magna-beauty.webp',
  };
  const featured = storesData.filter(s => featuredSlugs.includes(s.slug));

  return (
    <section className="stores-carousel py-16 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      <FloatingCubes />
      
      <div className="container px-4 relative z-10">
        <h2 className="flex items-center justify-center text-2xl md:text-4xl font-bold mb-12 fade-in-up">
          <span className="text-primary">متاجر على منصة إشرو</span>
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 justify-items-center">
          {featured.map((store, index) => (
            <div
              key={index}
              className="w-64 h-56 bg-white rounded-2xl border border-gray-200 hover:border-primary hover:shadow-2xl transition-all duration-500 cursor-pointer p-6 flex flex-col items-center justify-center group relative overflow-hidden"
              onClick={() => onStoreClick(store.slug)}
              >
                {/* خلفية متدرجة */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="w-24 h-24 mb-4 group-hover:scale-110 transition-transform duration-300 rounded-xl overflow-hidden bg-white">
                  <img 
                    src={logoOverrides[store.slug] || store.logo}
                    alt={store.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      const parent = (e.target as HTMLElement).parentElement;
                      if (parent) {
                        parent.innerHTML = '<div class="w-full h-full bg-primary/20 flex items-center justify-center text-primary font-bold text-2xl">' + store.name.charAt(0) + '</div>';
                      }
                    }}
                  />
                </div>
                
                <h3 className="text-lg font-bold text-center group-hover:text-primary transition-colors mb-1 leading-tight">
                  {store.name}
                </h3>
                
                <p className="text-sm text-gray-500 mb-4 text-center leading-tight">{store.description}</p>
                
                <div className="flex gap-3 text-gray-400">
                  <Users className="h-4 w-4 group-hover:text-primary transition-colors" />
                  <Globe className="h-4 w-4 group-hover:text-primary transition-colors" />
                  <ShoppingCart className="h-4 w-4 group-hover:text-primary transition-colors" />
                </div>
                
                {/* مؤشر الحالة */}
                <div className="absolute top-4 right-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full pulse-animation"></div>
                </div>
                
                {/* أيقونة متجر إشرو المخفية */}
                <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <Store className="h-3 w-3 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>

        {/* إحصائيات المتاجر */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6 justify-items-center">
          {statsData.map((stat, index) => (
            <div key={index} className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-primary/10 hover:border-primary/30 transition-colors">
              <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// PartnersSection component: Section showcasing business partners (banks, payments, shipping)
// مكون شركاء النجاح المتحرك
const PartnersSection = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const banks = [
    { name: "مصرف أمان", icon: "🏦", color: "from-blue-500 to-indigo-600" },
    { name: "مصرف الأندلس", icon: "🏛️", color: "from-green-500 to-emerald-600" },
    { name: "المصرف التجاري", icon: "🏢", color: "from-purple-500 to-violet-600" },
    { name: "مصرف الجمهورية", icon: "🏦", color: "from-orange-500 to-red-600" },
    { name: "مصرف الوحدة", icon: "🏛️", color: "from-cyan-500 to-blue-600" },
    { name: "مصرف المعاملات", icon: "🏢", color: "from-pink-500 to-rose-600" },
  ];

  const payments = [
    { name: "1Pay", icon: "💳", color: "from-green-500 to-emerald-600" },
    { name: "Cash", icon: "💰", color: "from-yellow-500 to-orange-600" },
    { name: "Becom", icon: "📱", color: "from-blue-500 to-indigo-600" },
    { name: "موبي كاش", icon: "💸", color: "from-purple-500 to-violet-600" },
    { name: "سداد", icon: "🔷", color: "from-red-500 to-pink-600" },
  ];

  const shipping = [
    { name: "أمیال", icon: "🚚", color: "from-orange-500 to-red-600" },
    { name: "درب السیل", icon: "📦", color: "from-green-500 to-emerald-600" },
    { name: "فانکس", icon: "🚛", color: "from-blue-500 to-indigo-600" },
    { name: "زام", icon: "🚐", color: "from-purple-500 to-violet-600" },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-white relative overflow-hidden">
      <style>{`
        .scroll-container { width: 200%; }
        .animate-delay-15s { animation-delay: -15s; }
        .animate-delay-30s { animation-delay: -30s; }
        .fade-delay-02s { animation-delay: 0.2s; }
        .fade-delay-04s { animation-delay: 0.4s; }
      `}</style>
      <FloatingCubes />
      
      <div className="container px-4 relative z-10">
        <div className="flex items-center justify-center mb-12 fade-in-up">
          <h2 className="text-2xl md:text-4xl font-bold mb-2 text-primary">شركاء النجاح</h2>
        </div>
        
        <div className="space-y-16">
          {/* المصارف التجارية */}
          <div className="fade-in-up">
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-primary">المصارف التجارية</h3>
            </div>
            <div className="relative overflow-hidden bg-white/50 backdrop-blur-sm rounded-3xl border border-primary/10 p-6">
              <div className="flex animate-scroll space-x-6 scroll-container">
                {[...partnersData.banks, ...partnersData.banks].map((bank, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-48 h-32 bg-transparent rounded-2xl transition-all duration-500 p-4 flex flex-col items-center justify-center"
                  >
                    <img
                      src={bank.logo}
                      alt={bank.name}
                      className="w-24 h-16 object-contain drop-shadow-md mb-2"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        const parent = (e.target as HTMLElement).parentElement;
                        if (parent) {
                          const fallback = document.createElement('div');
                          fallback.className = 'w-16 h-12 bg-gray-200 rounded flex items-center justify-center text-2xl mb-2';
                          fallback.innerHTML = '🏦';
                          parent.insertBefore(fallback, parent.lastElementChild);
                        }
                      }}
                    />
                    <p className="text-xs font-medium text-gray-700 text-center">{bank.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* شركات الدفع الإلكتروني */}
          <div className="fade-in-up fade-delay-02s">
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-primary">شركات الدفع الإلكتروني</h3>
            </div>
            <div className="relative overflow-hidden bg-white/50 backdrop-blur-sm rounded-3xl border border-primary/10 p-6">
              <div className="flex animate-scroll space-x-6 scroll-container animate-delay-15s">
                {[...partnersData.payment, ...partnersData.payment].map((payment, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-48 h-32 bg-transparent rounded-2xl transition-all duration-500 p-4 flex flex-col items-center justify-center"
                  >
                    <img
                      src={payment.logo}
                      alt={payment.name}
                      className="w-24 h-16 object-contain drop-shadow-md mb-2"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        const parent = (e.target as HTMLElement).parentElement;
                        if (parent) {
                          const fallback = document.createElement('div');
                          fallback.className = 'w-16 h-12 bg-gray-200 rounded flex items-center justify-center text-2xl mb-2';
                          fallback.innerHTML = '💳';
                          parent.insertBefore(fallback, parent.lastElementChild);
                        }
                      }}
                    />
                    <p className="text-xs font-medium text-gray-700 text-center">{payment.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* شركات الشحن والتوصيل */}
          <div className="fade-in-up fade-delay-04s">
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <Truck className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-primary">شركات الشحن والتوصيل</h3>
            </div>
            <div className="relative overflow-hidden bg-white/50 backdrop-blur-sm rounded-3xl border border-primary/10 p-6">
              <div className="flex animate-scroll space-x-6 scroll-container animate-delay-30s">
                {[...partnersData.transport, ...partnersData.transport].map((company, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-48 h-32 bg-transparent rounded-2xl transition-all duration-500 p-4 flex flex-col items-center justify-center"
                  >
                    <img
                      src={company.logo}
                      alt={company.name}
                      className="w-24 h-16 object-contain drop-shadow-md mb-2"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        const parent = (e.target as HTMLElement).parentElement;
                        if (parent) {
                          const fallback = document.createElement('div');
                          fallback.className = 'w-16 h-12 bg-gray-200 rounded flex items-center justify-center text-2xl mb-2';
                          fallback.innerHTML = '🚚';
                          parent.insertBefore(fallback, parent.lastElementChild);
                        }
                      }}
                    />
                    <p className="text-xs font-medium text-gray-700 text-center">{company.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* no CTA per request */}
      </div>
    </section>
  );
};

// Footer component: Site footer with links, contact info, and social media
// الفوتر
const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white py-16 relative overflow-hidden">
      <FloatingCubes />

      <div className="container px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="text-right">
            <div className="flex items-right gap-2 mb-4 right">
              <img src="/eshro-logo-white.png" alt="إشرو" className="h-10 w-auto" />
            </div>
            <p className="text-gray-400 mb-4">
              منصة إشرو للتجارة الإلكترونية - انتقل من التجارة التقليدية إلى الرقمية بكل يسر
            </p>
            <div className="flex gap-4 justify-center">
              {/* أيقونات وسائل التواصل */}
              <div className="w-10 h-10 bg-primary/40 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary transition-colors">
                <span className="text-xs">f</span>
              </div>
              <div className="w-10 h-10 bg-primary/40 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary transition-colors">
                <span className="text-xs">t</span>
              </div>
              <div className="w-10 h-10 bg-primary/40 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary transition-colors">
                <span className="text-xs">i</span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4 text-primary">عن إشرو</h3>
            <ul className="space-y-2 text-gray-400 text-center">
              <li><a href="#" className="hover:text-white transition-colors">عن المنصة</a></li>
              <li><a href="#" className="hover:text-white transition-colors">شروط الخدمة</a></li>
              <li><a href="#" className="hover:text-white transition-colors">سياسة الخصوصية</a></li>
              <li><a href="#" className="hover:text-white transition-colors">الشروط والأحكام</a></li>
            </ul>
          </div>

          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4 text-primary">الخدمات</h3>
            <ul className="space-y-2 text-gray-400 text-center">
              <li><a href="#" className="hover:text-white transition-colors">إنشاء متجر</a></li>
              <li><a href="#" className="hover:text-white transition-colors">حلول الدفع</a></li>
              <li><a href="#" className="hover:text-white transition-colors">خدمات الشحن</a></li>
              <li><a href="#" className="hover:text-white transition-colors">الدعم التقني</a></li>
            </ul>
          </div>

          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4 text-primary">تواصل معنا</h3>
            <ul className="space-y-2 text-gray-400 text-center">
              <li>📧 info@ishro.ly</li>
              <li>📞944062927(218)</li>
              <li>📞944062927(218)</li>
              <li>📍 طرابلس، ليبيا</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex items-center justify-center text-gray-600">
          <p className="text-center"> منصة إشرو © 2025 جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
};

// Home component: Main application component managing state and rendering different pages
// المكون الرئيسي
export default function Home() {
  const [currentPage, setCurrentPage] = useState('home');
  const [currentStore, setCurrentStore] = useState<string | null>(null);
  const [currentProduct, setCurrentProduct] = useState<number | null>(null);
  
  // حالة السلة والطلبات
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [unavailableItems, setUnavailableItems] = useState<any[]>([]);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  const [showStoreSuccessModal, setShowStoreSuccessModal] = useState(false);
  const [createdStoreName, setCreatedStoreName] = useState('');
  const [userCoupons, setUserCoupons] = useState<any[]>([]);
  const [showOrderSuccess, setShowOrderSuccess] = useState<any>(null);
  const [showAddToCartPopup, setShowAddToCartPopup] = useState<any>(null);
  const [showAddToCartSuccess, setShowAddToCartSuccess] = useState<any>(null);
  const [showWelcomeBackModal, setShowWelcomeBackModal] = useState<any>(null);
  const [currentMerchant, setCurrentMerchant] = useState<any>(null);
  const [isLoggedInAsMerchant, setIsLoggedInAsMerchant] = useState(false);
  const [currentVisitor, setCurrentVisitor] = useState<any>(null);
  const [isLoggedInAsVisitor, setIsLoggedInAsVisitor] = useState(false);
  const [allStores, setAllStores] = useState<any[]>([]);
  const [merchantSubPage, setMerchantSubPage] = useState('analytics');
  const validOrders = useMemo(() => orders.filter(order => order && order.id), [orders]);

  // عرض النافذة الترحيبية في كل مرة يتم فتح المنصة (لأغراض التسويق وتشجيع الاشتراك)
  useEffect(() => {
    // إزالة التحقق من localStorage لجعل النافذة تظهر في كل مرة
    setShowWelcomePopup(true);
  }, []);

  // استرداد البيانات المحفوظة عند تحميل التطبيق
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const savedOrders = localStorage.getItem('eshro_orders');
    const savedCartItems = localStorage.getItem('eshro_cart');
    const savedFavorites = localStorage.getItem('eshro_favorites');
    const savedCurrentMerchant = localStorage.getItem('eshro_current_merchant');
    const savedIsLoggedInAsMerchant = localStorage.getItem('eshro_logged_in_as_merchant');

    if (savedOrders) {
      try {
        const parsedOrders = JSON.parse(savedOrders);
        if (Array.isArray(parsedOrders)) {
          setOrders(parsedOrders.filter((order: any) => order && order.id));
        }
      } catch (error) {
        console.error('Failed to parse saved orders:', error);
      }
    }

    if (savedCartItems) {
      try {
        setCartItems(JSON.parse(savedCartItems));
      } catch (error) {
        console.error('Failed to parse saved cart items:', error);
      }
    }

    if (savedFavorites) {
      try {
        const parsedFavorites = JSON.parse(savedFavorites);
        if (Array.isArray(parsedFavorites)) {
          const catalog = [...allStoreProducts, ...enhancedSampleProducts];
          const normalizedFavorites = parsedFavorites
            .map((entry: any) => {
              if (!entry) {
                return null;
              }
              if (typeof entry === 'number') {
                return catalog.find((product) => product.id === entry) || null;
              }
              if (entry.id) {
                const reference = catalog.find((product) => product.id === entry.id);
                if (reference) {
                  const referenceImages = Array.isArray(reference.images) ? reference.images : [];
                  const entryImages = Array.isArray(entry.images) ? entry.images : [];
                  const mergedImages = referenceImages.length > 0 ? referenceImages : entryImages;
                  return {
                    ...reference,
                    ...entry,
                    images: mergedImages.length > 0 ? mergedImages : entryImages
                  };
                }
              }
              if (!Array.isArray(entry.images) || entry.images.length === 0) {
                const fallbackImage =
                  entry.image ||
                  entry.thumbnail ||
                  (Array.isArray(entry.product?.images) && entry.product.images.length > 0 ? entry.product.images[0] : entry.product?.image);
                if (fallbackImage) {
                  return { ...entry, images: [fallbackImage] };
                }
              }
              return entry;
            })
            .filter(Boolean);
          setFavorites(normalizedFavorites as any[]);
        }
      } catch (error) {
        console.error('Failed to parse saved favorites:', error);
      }
    }

    if (savedCurrentMerchant) {
      try {
        setCurrentMerchant(JSON.parse(savedCurrentMerchant));
      } catch (error) {
        console.error('Failed to parse saved current merchant:', error);
      }
    }

    if (savedIsLoggedInAsMerchant === 'true') {
      setIsLoggedInAsMerchant(true);
    }

    const savedIsLoggedInAsVisitor = localStorage.getItem('eshro_logged_in_as_visitor');
    if (savedIsLoggedInAsVisitor === 'true') {
      setIsLoggedInAsVisitor(true);
      const savedVisitorData = localStorage.getItem('eshro_visitor_user');
      if (savedVisitorData) {
        try {
          const parsedVisitor = JSON.parse(savedVisitorData);
          if (!parsedVisitor.avatar) {
            const cachedAvatar = localStorage.getItem('userProfileImage');
            if (cachedAvatar) {
              parsedVisitor.avatar = cachedAvatar;
            }
          } else {
            localStorage.setItem('userProfileImage', parsedVisitor.avatar);
          }
          setCurrentVisitor(parsedVisitor);
        } catch (error) {
          console.error('Failed to parse saved visitor data:', error);
        }
      }
    }

    const savedUnavailable = localStorage.getItem('eshro_unavailable');
    if (savedUnavailable) {
      try {
        setUnavailableItems(JSON.parse(savedUnavailable));
      } catch (error) {
        console.error('Failed to parse saved unavailable items:', error);
      }
    }

    const seedMerchantStores = () => {
      const seeds = merchantProfiles
        .map((profile) => {
          const credentials = MERCHANT_LOGIN_CREDENTIALS[profile.id];
          if (!credentials) {
            return null;
          }
          return {
            id: profile.id,
            nameAr: profile.name,
            nameEn: profile.name,
            email: credentials.email,
            password: credentials.password,
            phone: credentials.phone,
            subdomain: profile.id,
            owner: profile.owner,
            plan: profile.plan,
            tier: profile.tier,
            color: profile.color,
            stats: profile.stats,
            disabled: profile.disabled ?? []
          };
        })
        .filter(Boolean) as any[];

      let existingList: any[] = [];
      try {
        const raw = localStorage.getItem('eshro_stores');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            existingList = parsed;
          }
        }
      } catch {
        existingList = [];
      }

      const mergedList = [...existingList];
      const seen = new Set<string>();
      mergedList.forEach((store) => {
        if (store?.email && typeof store.email === 'string') {
          seen.add(store.email.toLowerCase());
        }
        if (store?.subdomain && typeof store.subdomain === 'string') {
          seen.add(store.subdomain);
        }
        if (store?.id && typeof store.id === 'string') {
          seen.add(store.id);
        }
      });

      seeds.forEach((store) => {
        const storeKey = `store_${store.subdomain}`;
        let normalizedStore = store;
        const existingRaw = localStorage.getItem(storeKey);
        if (existingRaw) {
          try {
            const existing = JSON.parse(existingRaw);
            normalizedStore = {
              ...existing,
              ...store,
              disabled: Array.isArray(existing?.disabled) ? existing.disabled : store.disabled ?? []
            };
          } catch {
            normalizedStore = store;
          }
        }
        localStorage.setItem(storeKey, JSON.stringify(normalizedStore));

        const variants = [
          typeof normalizedStore.email === 'string' ? normalizedStore.email.toLowerCase() : '',
          typeof normalizedStore.subdomain === 'string' ? normalizedStore.subdomain : '',
          typeof normalizedStore.id === 'string' ? normalizedStore.id : ''
        ].filter(Boolean);

        const existingIndex = mergedList.findIndex((entry) => {
          if (!entry) {
            return false;
          }
          const entryVariants = [
            typeof entry.email === 'string' ? entry.email.toLowerCase() : '',
            typeof entry.subdomain === 'string' ? entry.subdomain : '',
            typeof entry.id === 'string' ? entry.id : ''
          ].filter(Boolean);
          return entryVariants.some((key) => variants.includes(key));
        });

        if (existingIndex >= 0) {
          mergedList[existingIndex] = { ...mergedList[existingIndex], ...normalizedStore };
        } else {
          mergedList.push(normalizedStore);
        }

        variants.forEach((key) => {
          if (key) {
            seen.add(key);
          }
        });
      });

      localStorage.setItem('eshro_stores', JSON.stringify(mergedList));
      return mergedList;
    };

    const seededStores = seedMerchantStores();

    const loadAllStores = () => {
      const stores: any[] = [];
      const seen = new Set<string>();
      const pushStore = (store: any) => {
        if (!store) {
          return;
        }
        const variants = [
          typeof store.email === 'string' ? store.email.toLowerCase() : '',
          typeof store.subdomain === 'string' ? store.subdomain : '',
          typeof store.id === 'string' ? store.id : ''
        ].filter(Boolean);
        const exists = variants.some((key) => seen.has(key));
        if (!exists) {
          stores.push(store);
        }
        variants.forEach((key) => {
          if (key) {
            seen.add(key);
          }
        });
      };

      if (Array.isArray(seededStores)) {
        seededStores.forEach(pushStore);
      }

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('store_')) {
          try {
            const raw = localStorage.getItem(key);
            if (!raw) {
              continue;
            }
            const parsed = JSON.parse(raw);
            pushStore(parsed);
          } catch (error) {
            console.error('Failed to parse store data:', error);
          }
        }
      }

      try {
        const rawList = localStorage.getItem('eshro_stores');
        if (rawList) {
          const parsedList = JSON.parse(rawList);
          if (Array.isArray(parsedList)) {
            parsedList.forEach(pushStore);
          }
        }
      } catch (error) {
        console.error('Failed to parse store list:', error);
      }

      setAllStores(stores);
    };

    loadAllStores();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'eshro_unavailable' && e.newValue) {
        try {
          setUnavailableItems(JSON.parse(e.newValue));
        } catch (error) {
          console.error('Failed to parse updated unavailable items:', error);
        }
      }
      if (!e.key) {
        return;
      }
      if (e.key === 'eshro_stores' || e.key.startsWith('store_')) {
        loadAllStores();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // حفظ البيانات في localStorage عند تغييرها
  useEffect(() => {
    localStorage.setItem('eshro_orders', JSON.stringify(validOrders));
  }, [validOrders]);

  useEffect(() => {
    // حفظ السلة في localStorage حتى لو كانت فارغة
    localStorage.setItem('eshro_cart', JSON.stringify(cartItems));
    
    // إزالة السلة من localStorage إذا كانت فارغة
    if (cartItems.length === 0) {
      localStorage.removeItem('eshro_cart');
    }
  }, [cartItems]);

  useEffect(() => {
    if (favorites.length > 0) {
      localStorage.setItem('eshro_favorites', JSON.stringify(favorites));
    } else {
      localStorage.removeItem('eshro_favorites');
    }
  }, [favorites]);

  useEffect(() => {
    if (unavailableItems.length > 0) {
      localStorage.setItem('eshro_unavailable', JSON.stringify(unavailableItems));
    }
  }, [unavailableItems]);

  // حفظ بيانات التاجر الحالي
  useEffect(() => {
    if (currentMerchant) {
      localStorage.setItem('eshro_current_merchant', JSON.stringify(currentMerchant));
    } else {
      localStorage.removeItem('eshro_current_merchant');
    }
  }, [currentMerchant]);

  useEffect(() => {
    localStorage.setItem('eshro_logged_in_as_merchant', isLoggedInAsMerchant.toString());
  }, [isLoggedInAsMerchant]);

  useEffect(() => {
    localStorage.setItem('eshro_logged_in_as_visitor', isLoggedInAsVisitor.toString());
  }, [isLoggedInAsVisitor]);

  const handleNavigation = (page: string) => {
    setCurrentPage(page);
    setCurrentStore(null);
    setCurrentProduct(null);
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    setCurrentStore(null);
    setCurrentProduct(null);
  };

  const handleStoreClick = (storeSlug: string) => {
    setCurrentStore(storeSlug);
    setCurrentPage('store');
  };

  const handleProductClick = (productId: number) => {
    setCurrentProduct(productId);
    setCurrentPage('product');
  };

  const handleBackToStore = () => {
    setCurrentPage('store');
    setCurrentProduct(null);
  };

  const handleAddToCart = (product: any, size: string, color: string, quantity: number) => {
    const cartItem = {
      id: Date.now(), // معرف مؤقت
      product,
      size,
      color,
      quantity
    };
    
    setCartItems(prev => [...prev, cartItem]);
    
    // عرض نافذة النجاح المخصصة
    setShowAddToCartSuccess({
      productName: product.name,
      quantity,
      selectedSize: size,
      selectedColor: color
    });
  };

  const handleBuyNow = (product: any, size: string, color: string, quantity: number) => {
    // إضافة للسلة أولاً
    handleAddToCart(product, size, color, quantity);
    // ثم الانتقال للسلة
    setCurrentPage('cart');
  };

  const handleUpdateCartQuantity = (itemId: number, quantity: number) => {
    setCartItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, quantity } : item
    ));
  };

  const handleRemoveFromCart = (itemId: number) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleOrderComplete = (orderData: any) => {
    if (orderData) {
      // إضافة الطلب للطلبات المكتملة
      setOrders(prev => [...prev, orderData]);
      
      // إفراغ السلة
      setCartItems([]);
    }
    
    // العودة للرئيسية
    setCurrentPage('home');
  };

  const handleRegistrationComplete = (couponData: any) => {
    if (!couponData) {
      return;
    }

    setUserCoupons((prev) => {
      const existing = prev.find((coupon) => coupon.code === couponData.code);
      if (existing) {
        return prev.map((coupon) => (coupon.code === couponData.code ? couponData : coupon));
      }
      return [...prev, couponData];
    });
  };

  const handleDashboardOrderRequest = (payload: CreateOrderPayload): OrderRecord => {
    const product = allStoreProducts.find((item) => item.id === payload.productId);
    if (!product) {
      throw new Error('PRODUCT_NOT_FOUND');
    }
    const config = dashboardShippingConfig[payload.shippingOptionId] ?? dashboardShippingConfig['normal-tripoli'];
    if (!config) {
      throw new Error('SHIPPING_CONFIG_NOT_FOUND');
    }
    const now = new Date();
    const isoString = now.toISOString();
    const [datePart] = isoString.split('T');
    const orderDate = datePart ?? isoString.slice(0, 10);
    const orderTime = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const subtotal = (product.price || 0) * payload.quantity;
    const shippingCost = config.cost;
    const finalTotal = subtotal + shippingCost;
    const orderId = generateOrderId();
    const fullName = payload.fullName.trim();
    const nameParts = fullName.split(' ');
    const firstName = nameParts[0] || fullName;
    const lastName = nameParts.slice(1).join(' ');
    const location = payload.latitude !== undefined && payload.longitude !== undefined
      ? { latitude: payload.latitude, longitude: payload.longitude, accuracy: 10 }
      : undefined;

    const newOrder: OrderRecord = {
      id: orderId,
      date: orderDate,
      time: orderTime,
      status: 'pending',
      items: [
        {
          id: product.id,
          name: product.name,
          product,
          price: product.price,
          quantity: payload.quantity
        }
      ],
      subtotal,
      shippingCost,
      discountAmount: 0,
      discountPercentage: 0,
      finalTotal,
      total: finalTotal,
      totalAmount: finalTotal,
      customer: {
        name: fullName,
        firstName,
        lastName,
        phone: payload.phone.trim(),
        email: payload.email.trim(),
        address: payload.address.trim(),
        city: payload.cityId,
        area: payload.areaId
      },
      shipping: {
        type: config.type,
        cost: shippingCost,
        estimatedTime: config.estimatedTime,
        company: payload.shippingCompany
      },
      payment: {
        method: 'onDelivery',
        type: payload.orderType === 'urgent' ? 'الدفع عند الاستلام' : 'الدفع عند الاستلام'
      },
      createdAt: isoString,
      ...(payload.notes ? { notes: payload.notes } : {}),
      ...(location ? { location } : {})
    };

    setOrders((prev) => [...prev, newOrder]);
    return newOrder;
  };

  const handleUpdateVisitorProfile = (profile: any) => {
    setCurrentVisitor((prev) => {
      const updatedName = profile.name && profile.name.trim().length > 0 ? profile.name : `${profile.firstName || ''} ${profile.lastName || ''}`.trim();
      const updatedVisitor = {
        ...(prev || {}),
        ...profile,
        name: updatedName || prev?.name || 'مستخدم إشرو'
      };
      localStorage.setItem('eshro_visitor_user', JSON.stringify(updatedVisitor));
      if (updatedVisitor.avatar) {
        localStorage.setItem('userProfileImage', updatedVisitor.avatar);
      } else {
        localStorage.removeItem('userProfileImage');
      }
      const allVisitorsRaw = localStorage.getItem('eshro_all_visitors');
      if (allVisitorsRaw) {
        try {
          const parsed = JSON.parse(allVisitorsRaw);
          if (Array.isArray(parsed)) {
            const updatedList = parsed.map((visitor: any) =>
              visitor.email === updatedVisitor.email
                ? { ...visitor, name: `${updatedVisitor.firstName || ''} ${updatedVisitor.lastName || ''}`.trim(), email: updatedVisitor.email, avatar: updatedVisitor.avatar }
                : visitor
            );
            localStorage.setItem('eshro_all_visitors', JSON.stringify(updatedList));
          }
        } catch (error) {
          console.error('Failed to update visitors list', error);
        }
      }
      const visitorKeys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('eshro_visitor_user_')) {
          visitorKeys.push(key);
        }
      }
      visitorKeys.forEach((key) => {
        const value = localStorage.getItem(key);
        if (!value) {
          return;
        }
        try {
          const parsed = JSON.parse(value);
          if (parsed.email === updatedVisitor.email) {
            localStorage.setItem(key, JSON.stringify({ ...parsed, ...updatedVisitor }));
          }
        } catch (error) {
          console.error('Failed to sync visitor record', error);
        }
      });
      return updatedVisitor;
    });
  };

  const handleVisitorPasswordChange = async ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) => {
    if (!currentVisitor) {
      return;
    }
    if (currentVisitor.password && currentVisitor.password !== currentPassword) {
      throw new Error('INVALID_PASSWORD');
    }
    const updatedVisitor = { ...currentVisitor, password: newPassword };
    setCurrentVisitor(updatedVisitor);
    localStorage.setItem('eshro_visitor_user', JSON.stringify(updatedVisitor));
    const visitorKeys = [] as string[];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('eshro_visitor_user_')) {
        visitorKeys.push(key);
      }
    }
    visitorKeys.forEach((key) => {
      const value = localStorage.getItem(key);
      if (!value) {
        return;
      }
      try {
        const parsed = JSON.parse(value);
        if (parsed.email === updatedVisitor.email) {
          localStorage.setItem(key, JSON.stringify({ ...parsed, password: newPassword }));
        }
      } catch (error) {
        console.error('Failed to sync visitor password', error);
      }
    });
  };

  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const completedOrdersCount = validOrders.length;

  // معالج تسجيل الدخول
  const handleLogin = (credentials: { username: string; password: string; userType?: string }) => {
    const { username, password, userType = 'merchant' } = credentials;

    console.log('🔐 Login attempt:', { username, password, userType });
    console.log('📊 Available stores in allStores:', allStores.length);

    // إصلاح مشكلة متجر نواعم إذا لم يكن موجود
    if (username === 'mounir@gmail.com' && password === 'mounir123' && allStores.length === 0) {
      console.log('🔧 Creating Nawaem store data for testing...');
      const nawaemStoreData = {
        nameAr: 'نواعم',
        nameEn: 'Nawaem',
        email: 'mounir@gmail.com',
        password: 'mounir123',
        phone: '218911234567',
        subdomain: 'nawaem',
        description: 'متجر نواعم للملابس والإكسسوارات',
        logo: '/assets/real-stores/interface nawaem.png',
        category: 'ملابس وإكسسوارات',
        products: []
      };

      // حفظ بيانات المتجر
      const storeKey = `store_${nawaemStoreData.subdomain}`;
      localStorage.setItem(storeKey, JSON.stringify(nawaemStoreData));
      setAllStores([nawaemStoreData]);

      console.log('✅ Nawaem store created successfully');
      alert('تم إنشاء بيانات متجر نواعم بنجاح! جرب تسجيل الدخول الآن.');
      return;
    }

    if (userType === 'user') {
      // تسجيل دخول الزائر
      try {
        console.log('🔐 Attempting visitor login for:', username);

        // البحث في جميع مستخدمي الزوار المحفوظين
        const visitors: Array<{ key: string; data: any }> = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.startsWith('eshro_visitor_user_') || key === 'eshro_visitor_user')) {
            try {
              const visitorDataStr = localStorage.getItem(key);
              if (visitorDataStr) {
                const visitorData = JSON.parse(visitorDataStr);
                visitors.push({ key, data: visitorData });
              }
            } catch (error) {
              console.error('Error parsing visitor data for key:', key, error);
            }
          }
        }

        console.log('📊 Total visitors found:', visitors.length);

        // البحث عن المستخدم المناسب
        const matchedVisitor = visitors.find(({ data: visitorData }) => {
          const isEmailMatch = visitorData.email && visitorData.email.toLowerCase() === username.toLowerCase();
          const isNameMatch = visitorData.firstName && visitorData.lastName &&
            `${visitorData.firstName} ${visitorData.lastName}`.toLowerCase() === username.toLowerCase();
          const isPasswordMatch = visitorData.password === password;

          console.log('🔍 Checking visitor:', visitorData.email, '- Email match:', isEmailMatch, 'Name match:', isNameMatch, 'Password match:', isPasswordMatch);

          return (isEmailMatch || isNameMatch) && isPasswordMatch;
        });

        if (matchedVisitor) {
          console.log('✅ Visitor login successful:', matchedVisitor.data);

          // تحديث بيانات المستخدم للتأكد من اكتمالها
          const storedAvatar = matchedVisitor.data.avatar || localStorage.getItem('userProfileImage');
          const updatedVisitorData = {
            ...matchedVisitor.data,
            membershipType: matchedVisitor.data.membershipType || 'عضو مسجل',
            lastLogin: new Date().toISOString(),
            avatar: storedAvatar || matchedVisitor.data.avatar
          };

          if (updatedVisitorData.avatar) {
            localStorage.setItem('userProfileImage', updatedVisitorData.avatar);
          }

          setCurrentVisitor(updatedVisitorData);
          setIsLoggedInAsVisitor(true);

          // حفظ البيانات المحدثة في جميع المواقع
          localStorage.setItem('eshro_visitor_user', JSON.stringify(updatedVisitorData));
          localStorage.setItem(matchedVisitor.key, JSON.stringify(updatedVisitorData));

          // تحديث قائمة المستخدمين
          const existingUsers = JSON.parse(localStorage.getItem('eshro_all_visitors') || '[]');
          const updatedUsers = existingUsers.map((user: any) =>
            user.email === updatedVisitorData.email ? { ...user, lastLogin: updatedVisitorData.lastLogin } : user
          );
          localStorage.setItem('eshro_all_visitors', JSON.stringify(updatedUsers));

          // عرض بوب اب الترحيب
          setShowWelcomeBackModal({
            visitorName: updatedVisitorData.firstName,
            isFirstTime: false
          });

          // العودة للصفحة الرئيسية بعد تأخير قصير
          setTimeout(() => {
            setCurrentPage('home');
          }, 2000);

          return;
        }

        console.log('❌ No matching visitor found');
        alert('بيانات تسجيل الدخول غير صحيحة. يرجى التأكد من اسم المستخدم وكلمة المرور.');
      } catch (error) {
        console.error('Error during visitor login:', error);
        alert('حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.');
      }
    } else if (userType === 'admin') {
      // تسجيل دخول مسؤول النظام
      if (username === 'admin@eshro.ly' && password === 'admin123') {
        console.log('Admin login successful');
        alert('مرحباً بك مسؤول النظام! 🎉');
        // في التطبيق الحقيقي، سيتم توجيه مسؤول النظام للوحة التحكم الرئيسية
        // مؤقتاً سنستخدم نفس نظام التاجر لحين تطوير لوحة التحكم الإدارية الرئيسية
        setCurrentPage('admin');
      } else {
        alert('بيانات مسؤول النظام غير صحيحة');
      }
    } else {
      // تسجيل دخول التاجر (النظام الحالي)
      const storeInfo = allStores.map(s => ({ email: s.email, subdomain: s.subdomain, name: s.nameAr || s.name }));
      console.log('🔍 Searching for merchant in allStores:', storeInfo);

      let matchingStore = allStores.find(store =>
        (store.email === username || store.subdomain === username || store.phone === username) &&
        store.password === password
      );

      if (!matchingStore) {
        const normalizedUsername = username.toLowerCase();
        const credentialEntry = Object.entries(MERCHANT_LOGIN_CREDENTIALS).find(([merchantId, creds]) => {
          if (!creds) {
            return false;
          }
          const emailMatch = creds.email.toLowerCase() === normalizedUsername;
          const phoneMatch = creds.phone === username;
          const aliasMatch = normalizedUsername === creds.email.split('@')[0];
          const subdomainMatch = merchantId === normalizedUsername;
          return emailMatch || phoneMatch || aliasMatch || subdomainMatch;
        });
        if (credentialEntry) {
          const [merchantId, creds] = credentialEntry;
          if (creds.password === password) {
            const profile = merchantProfiles.find((merchant) => merchant.id === merchantId);
            if (profile) {
              matchingStore = {
                id: profile.id,
                nameAr: profile.name,
                nameEn: profile.name,
                email: creds.email,
                password: creds.password,
                phone: creds.phone,
                subdomain: profile.id,
                owner: profile.owner,
                plan: profile.plan,
                tier: profile.tier,
                color: profile.color,
                stats: profile.stats,
                disabled: profile.disabled ?? []
              } as any;
              const storeKey = `store_${profile.id}`;
              localStorage.setItem(storeKey, JSON.stringify(matchingStore));
              let storedList: any[] = [];
              try {
                const rawList = localStorage.getItem('eshro_stores');
                if (rawList) {
                  const parsed = JSON.parse(rawList);
                  if (Array.isArray(parsed)) {
                    storedList = parsed;
                  }
                }
              } catch {
                storedList = [];
              }
              const existsInList = storedList.some((store) =>
                store &&
                (store.email === matchingStore?.email || store.subdomain === matchingStore?.subdomain || store.id === matchingStore?.id)
              );
              if (!existsInList) {
                storedList.push(matchingStore);
                localStorage.setItem('eshro_stores', JSON.stringify(storedList));
              }
              setAllStores((previous) => {
                const existsInState = previous.some(
                  (store) =>
                    store &&
                    (store.email === matchingStore?.email || store.subdomain === matchingStore?.subdomain || store.id === matchingStore?.id)
                );
                if (existsInState) {
                  return previous;
                }
                return [...previous, matchingStore];
              });
            }
          }
        }
      }

      if (matchingStore) {
        console.log('✅ Merchant login successful:', matchingStore);
        setCurrentMerchant(matchingStore);
        setIsLoggedInAsMerchant(true);
        setCurrentPage('merchant-dashboard');
      } else {
        console.log('❌ Merchant login failed - no matching store found');
        console.log('🔍 Debug info:');
        console.log('- Username:', username);
        console.log('- Password:', password);
        console.log('- Available stores:', allStores.length);
        console.log('- Store emails:', allStores.map(s => s.email));
        console.log('- Store subdomains:', allStores.map(s => s.subdomain));

        const storeWithEmail = allStores.find(store => store.email === username || store.subdomain === username || store.phone === username);
        if (storeWithEmail) {
          console.log('⚠️ Store found but password incorrect');
          alert('كلمة المرور غير صحيحة. يرجى التأكد من كلمة المرور والمحاولة مرة أخرى.');
        } else {
          console.log('❓ Store not found with this email/subdomain');
          alert('اسم المستخدم أو البريد الإلكتروني غير موجود. يرجى التأكد من البيانات والمحاولة مرة أخرى.');
        }
      }
    }
  };

  // معالج إنشاء المتجر
  const handleStoreCreated = (storeData: any) => {
    console.log('Store created:', storeData);

    // حفظ بيانات المتجر في localStorage مع معرف فريد
    const storeKey = `store_${storeData.subdomain || storeData.nameEn}`;
    localStorage.setItem(storeKey, JSON.stringify(storeData));

    // إضافة المتجر للقائمة العامة
    setAllStores(prev => [...prev, storeData]);

    // إظهار نافذة النجاح الجميلة
    setCreatedStoreName(storeData.nameAr);
    setCurrentMerchant(storeData);
    setShowStoreSuccessModal(true);
  };

  const handleStartMerchantDashboard = () => {
    setIsLoggedInAsMerchant(true);
    setCurrentPage('merchant-dashboard');
    setShowStoreSuccessModal(false);
  };

  // عرض بوابة الإدارة (Admin Portal)
  if (currentPage === 'admin') {
    return (
      <AdminPortal
        onLogout={() => {
          setCurrentPage('login');
        }}
      />
    );
  }


  // عرض لوحة تحكم التاجر المطورة مع الشريط الجانبي العمودي
  if (currentPage === 'merchant-dashboard') {
    console.log('🔍 Enhanced Merchant Dashboard Context Analysis:');
    console.log('currentMerchant:', currentMerchant);
    console.log('isLoggedInAsMerchant:', isLoggedInAsMerchant);
    console.log('currentPage:', currentPage);

    return (
      <EnhancedMerchantDashboard
        currentMerchant={currentMerchant}
        onLogout={() => {
          console.log('🔓 Enhanced Merchant Dashboard logout clicked');
          setCurrentMerchant(null);
          setIsLoggedInAsMerchant(false);
          localStorage.removeItem('eshro_current_merchant');
          localStorage.removeItem('eshro_current_user');
          localStorage.setItem('eshro_logged_in_as_merchant', 'false');
          setCurrentPage('home');
        }}
      />
    );
  }

  // عرض لوحة تحكم المستخدم - مقارنة السياقات المختلفة
  if (currentPage === 'customer-dashboard') {
    console.log('🔍 CustomerDashboard Context Analysis:');
    console.log('currentVisitor:', currentVisitor);
    console.log('isLoggedInAsVisitor:', isLoggedInAsVisitor);
    console.log('currentPage:', currentPage);

    // إنشاء بيانات المستخدم مع ضمان اكتمال جميع الحقول المطلوبة
    const createCompleteCustomerData = () => {
      const baseData = currentVisitor || {
        firstName: 'زائر',
        lastName: 'موقت',
        email: 'guest@eshro.ly',
        phone: '944062927',
        name: 'زائر موقت',
        membershipType: 'زائر',
        joinDate: new Date().toISOString().split('T')[0]
      };

      // ضمان وجود الاسم الكامل
      const fullName = baseData.name || `${baseData.firstName || ''} ${baseData.lastName || ''}`.trim() || 'زائر موقت';

      return {
        ...baseData,
        name: fullName,
        firstName: baseData.firstName || fullName.split(' ')[0] || 'زائر',
        lastName: baseData.lastName || fullName.split(' ').slice(1).join(' ') || 'موقت',
        email: baseData.email || 'guest@eshro.ly',
        phone: baseData.phone || '944062927',
        membershipType: baseData.membershipType || 'زائر',
        joinDate: baseData.joinDate || new Date().toISOString().split('T')[0],
        // إضافة معلومات إضافية للمقارنة مع الاختبار الناجح
        context: 'user-login-flow',
        timestamp: new Date().toISOString(),
        isFromLogin: true
      };
    };

    const customerData = createCompleteCustomerData();

    console.log('📊 Complete customerData being passed:', customerData);

    return (
      <CustomerDashboard
        customerData={customerData}
        favorites={favorites}
        orders={validOrders}
        unavailableItems={unavailableItems}
        onCreateOrder={handleDashboardOrderRequest}
        onUpdateProfile={handleUpdateVisitorProfile}
        onPasswordChange={handleVisitorPasswordChange}
        onBack={() => {
          console.log('🔙 Dashboard back button clicked in user login context');
          setCurrentPage('home');
        }}
        onLogout={() => {
          console.log('🔓 Dashboard logout button clicked in user login context');
          setCurrentVisitor(null);
          setIsLoggedInAsVisitor(false);
          setCurrentPage('home');
        }}
      />
    );
  }

  // عرض صفحة تسجيل الدخول
  if (currentPage === 'login') {
    return (
      <ShopLoginPage
        onBack={handleBackToHome}
        onLogin={handleLogin}
        onNavigateToRegister={() => setCurrentPage('register')}
        onNavigateToAccountTypeSelection={() => setCurrentPage('account-type-selection')}
      />
    );
  }

  // عرض صفحة اختيار نوع الحساب
  if (currentPage === 'account-type-selection') {
    return (
      <AccountTypeSelectionPage
        onBack={handleBackToHome}
        onSelectMerchant={() => setCurrentPage('register')}
        onSelectVisitor={() => setCurrentPage('visitor-register')}
      />
    );
  }

  // عرض صفحة إنشاء حساب الزائر
  if (currentPage === 'visitor-register') {
    return (
      <VisitorRegistrationPage
        onBack={handleBackToHome}
        onRegister={(userData) => {
          console.log('Visitor registered:', userData);

          // حفظ بيانات المستخدم بمفتاح فريد للحفاظ على جميع المستخدمين
          const userKey = `eshro_visitor_user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          localStorage.setItem(userKey, JSON.stringify(userData));

          // حفظ أيضاً في المفتاح العام للوصول السريع للمستخدم الحالي
          localStorage.setItem('eshro_visitor_user', JSON.stringify(userData));

          // حفظ قائمة بجميع مستخدمي الزوار لتسهيل البحث
          const existingUsers = JSON.parse(localStorage.getItem('eshro_all_visitors') || '[]');
          existingUsers.push({ key: userKey, email: userData.email, name: `${userData.firstName} ${userData.lastName}` });
          localStorage.setItem('eshro_all_visitors', JSON.stringify(existingUsers));

          alert('تم إنشاء حسابك بنجاح! 🎉');
          setCurrentPage('home');
        }}
        onNavigateToLogin={() => setCurrentPage('login')}
        onNavigateToTerms={() => setCurrentPage('terms')}
        onNavigateToPrivacy={() => setCurrentPage('privacy')}
      />
    );
  }

  // عرض صفحة إنشاء المتجر
  if (currentPage === 'register') {
    return (
      <CreateStorePage
        onBack={handleBackToHome}
        onNavigateToLogin={() => setCurrentPage('login')}
        onStoreCreated={handleStoreCreated}
      />
    );
  }

  // عرض صفحة شركاء النجاح
  if (currentPage === 'partners') {
    return <PartnersPage onBack={handleBackToHome} />;
  }

  // عرض صفحة الشروط والأحكام
  if (currentPage === 'terms') {
    return (
      <TermsAndConditionsPage
        onBack={handleBackToHome}
      />
    );
  }

  // عرض صفحة سياسة الخصوصية
  if (currentPage === 'privacy') {
    return (
      <PrivacyPolicyPage
        onBack={handleBackToHome}
      />
    );
  }

  // عرض صفحة المتجر
  if (currentPage === 'store' && currentStore) {
    return (
      <ModernStorePage 
        storeSlug={currentStore} 
        onBack={handleBackToHome}
        onProductClick={handleProductClick}
        onAddToCart={handleAddToCart}
        onToggleFavorite={(productId) => {
          const product = allStoreProducts.find(p => p.id === productId) || enhancedSampleProducts.find(p => p.id === productId);
          if (product) {
            if (favorites.find(f => f.id === productId)) {
              setFavorites(prev => prev.filter(f => f.id !== productId));
            } else {
              setFavorites(prev => [...prev, product]);
            }
          }
        }}
        onNotifyWhenAvailable={(productId) => {
          console.log('Notification requested for product ID:', productId);
          // النافذة الآن تُعرض محلياً في صفحات المتاجر والمنتجات
        }}
        onSubmitNotification={(product, notificationData) => {
          // حفظ بيانات التنبيه في قائمة العناصر غير المتوفرة
          const newUnavailableItem = {
            ...product,
            notificationData,
            requestedAt: new Date().toISOString()
          };
          
          setUnavailableItems(prev => [...prev, newUnavailableItem]);
          
          // حفظ في localStorage
          const savedUnavailable = JSON.parse(localStorage.getItem('eshro_unavailable') || '[]');
          savedUnavailable.push(newUnavailableItem);
          localStorage.setItem('eshro_unavailable', JSON.stringify(savedUnavailable));
          
          console.log('Notification saved:', notificationData);
        }}
        favorites={favorites.map(f => f.id)}
      />
    );
  }

  // عرض صفحة المنتج
  if (currentPage === 'product' && currentProduct) {
    const selectedProduct = allStoreProducts.find(p => p.id === currentProduct);

    if (!selectedProduct) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-8">
          <div className="text-center space-y-4">
            <p className="text-lg">هذا المنتج غير متوفر حالياً.</p>
            <Button
              onClick={() => console.log('Notification requested for unavailable product:', currentProduct)}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              <Bell className="h-4 w-4 mr-2" />
              نبهني عند التوفر
            </Button>
            <br />
            <Button onClick={currentStore ? handleBackToStore : handleBackToHome} variant="outline">
              العودة
            </Button>
          </div>
        </div>
      );
    }

    return (
      <EnhancedProductPage
        product={selectedProduct}
        onBack={currentStore ? handleBackToStore : handleBackToHome}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        onToggleFavorite={(productId) => {
          const product = allStoreProducts.find(p => p.id === productId) || enhancedSampleProducts.find(p => p.id === productId);
          if (product) {
            if (favorites.find(f => f.id === productId)) {
              setFavorites(prev => prev.filter(f => f.id !== productId));
            } else {
              setFavorites(prev => [...prev, product]);
            }
          }
        }}
        onNotifyWhenAvailable={(productId) => {
          console.log('Notification requested for product ID:', productId);
          // النافذة الآن تُعرض محلياً في صفحات المتاجر والمنتجات
        }}
        isFavorite={favorites.some(f => f.id === currentProduct)}
      />
    );
  }

  // عرض صفحة السلة
  if (currentPage === 'cart') {
    return (
      <CartPage
        cartItems={cartItems}
        onBack={handleBackToHome}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onOrderComplete={handleOrderComplete}
      />
    );
  }

  // عرض صفحة إتمام الطلب
  if (currentPage === 'checkout') {
    return (
      <EnhancedCheckoutPage
        cartItems={cartItems}
        onBack={() => setCurrentPage('cart')}
        onOrderComplete={(orderData) => {
          if (orderData) {
            setOrders(prev => [...prev, orderData]);
            setCartItems([]); // تصفير السلة
            setShowOrderSuccess(orderData);
          }
          setCurrentPage('home');
        }}
        appliedCoupon={userCoupons.length > 0 ? userCoupons[0] : undefined}
      />
    );
  }

  // عرض صفحة الطلبات - إرجاع المكون الأصلي بالكامل
  if (currentPage === 'orders') {
    return (
      <CompleteOrdersPage
        orders={validOrders}
        favorites={favorites}
        unavailableItems={unavailableItems}
        onBack={handleBackToHome}
        onAddToCart={(product) => {
          const cartItem = { id: Date.now(), product, size: 'M', color: 'أسود', quantity: 1 };
          setCartItems(prev => [...prev, cartItem]);
          alert('تم إضافة المنتج للسلة!');
        }}
        onToggleFavorite={(productId) => {
          const product = allStoreProducts.find(p => p.id === productId) || enhancedSampleProducts.find(p => p.id === productId);
          if (product) {
            if (favorites.find(f => f.id === productId)) {
              setFavorites(prev => prev.filter(f => f.id !== productId));
            } else {
              setFavorites(prev => [...prev, product]);
            }
          }
        }}
        onRemoveFavorite={(productId) => {
          setFavorites(prev => prev.filter(p => p.id !== productId));
        }}
        onNotifyWhenAvailable={(productId) => {
          console.log('Notification requested for product ID:', productId);
        }}
        onDeleteOrder={(orderId) => {
          setOrders(prev => prev.filter(order => order?.id && order.id !== orderId));
          alert('تم حذف الطلب بنجاح!');
        }}
        onRemoveUnavailableItem={(index) => {
          const updatedUnavailableItems = unavailableItems.filter((_, i) => i !== index);
          setUnavailableItems(updatedUnavailableItems);
        }}
      />
    );
  }

  // عرض صفحة الاشتراكات المستقلة
  if (currentPage === 'subscriptions') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={handleBackToHome}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  العودة للرئيسية
                </Button>
                <h1 className="text-2xl font-bold text-gray-800">الاشتراكات</h1>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card className="p-8 text-center">
              <Bell className="h-16 w-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-4">إدارة الاشتراكات</h2>
              <p className="text-gray-600 mb-6">
                هنا يمكنك إدارة جميع اشتراكاتك في المتاجر والخدمات المختلفة
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="text-lg font-bold mb-3">اشتراكات المتاجر</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    إدارة اشتراكاتك في متاجر إشرو المفضلة
                  </p>
                  <Button className="w-full">عرض المتاجر المشترك بها</Button>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-bold mb-3">إشعارات المنتجات</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    إدارة إشعارات المنتجات الغير متوفرة
                  </p>
                  <Button className="w-full">عرض الإشعارات</Button>
                </Card>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // عرض صفحة تغيير كلمة المرور المستقلة
  if (currentPage === 'change-password') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={handleBackToHome}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  العودة للرئيسية
                </Button>
                <h1 className="text-2xl font-bold text-gray-800">تغيير كلمة المرور</h1>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <Card className="p-6">
              <div className="text-center mb-6">
                <Settings className="h-16 w-16 text-primary mx-auto mb-4" />
                <h2 className="text-xl font-bold text-gray-800">تغيير كلمة المرور</h2>
                <p className="text-sm text-gray-600">أدخل كلمة المرور الحالية والجديدة</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="current-password">كلمة المرور الحالية</Label>
                  <Input
                    id="current-password"
                    type="password"
                    placeholder="أدخل كلمة المرور الحالية"
                    className="text-right"
                  />
                </div>

                <div>
                  <Label htmlFor="new-password">كلمة المرور الجديدة</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="أدخل كلمة المرور الجديدة"
                    className="text-right"
                  />
                </div>

                <div>
                  <Label htmlFor="confirm-password">تأكيد كلمة المرور الجديدة</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="أعد إدخال كلمة المرور الجديدة"
                    className="text-right"
                  />
                </div>

                <Button className="w-full bg-primary hover:bg-primary/90">
                  تغيير كلمة المرور
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // عرض الصفحة الرئيسية (افتراضي)
  return (
    <div className="min-h-screen bg-background">
      <Header
        onNavigate={handleNavigation}
        cartItemsCount={cartItemsCount}
        unavailableOrdersCount={completedOrdersCount}
        onCartOpen={() => setCurrentPage('cart')}
        onOrdersOpen={() => setCurrentPage('orders')}
        isLoggedInAsVisitor={isLoggedInAsVisitor}
        currentVisitor={currentVisitor}
        setCurrentVisitor={setCurrentVisitor}
        setIsLoggedInAsVisitor={setIsLoggedInAsVisitor}
      />
      <HeroSection />
      <ServicesSection onNavigate={handleNavigation} />
      <StoresCarousel onStoreClick={handleStoreClick} />
      <DiscountSlider />
      <PartnersSection onNavigate={handleNavigation} />
      <Footer />
      
      {/* النافذة المنبثقة الترحيبية */}
      <WelcomePopup
        isOpen={showWelcomePopup}
        onClose={() => {
          console.log('Welcome popup onClose called');
          console.log('showWelcomePopup before:', showWelcomePopup);
          setShowWelcomePopup(false);
          console.log('showWelcomePopup after:', showWelcomePopup);
        }}
        onRegistrationComplete={handleRegistrationComplete}
      />
      
      {/* نافذة نجاح الطلب */}
      {showOrderSuccess && (
        <OrderSuccessModal
          isOpen={true}
          orderData={showOrderSuccess}
          onClose={() => setShowOrderSuccess(null)}
        />
      )}
      
      
      {/* نافذة نجاح إضافة المنتج للسلة */}
      {showAddToCartSuccess && (
        <AddToCartSuccessModal
          isOpen={true}
          productName={showAddToCartSuccess.productName}
          quantity={showAddToCartSuccess.quantity}
          selectedSize={showAddToCartSuccess.selectedSize}
          selectedColor={showAddToCartSuccess.selectedColor}
          onClose={() => setShowAddToCartSuccess(null)}
          onViewCart={() => {
            setShowAddToCartSuccess(null);
            setCurrentPage('cart');
          }}
          onContinueShopping={() => {
            setShowAddToCartSuccess(null);
          }}
        />
      )}

      {/* نافذة نجاح إنشاء المتجر الجديدة */}
      {showStoreSuccessModal && (
        <StoreCreatedSuccessModal
          isOpen={true}
          storeName={createdStoreName}
          onClose={() => setShowStoreSuccessModal(false)}
          onStartDashboard={handleStartMerchantDashboard}
        />
      )}

      {/* بوب اب الترحيب للمستخدمين - تم تبسيطه */}
      {showWelcomeBackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl">
            <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-white text-3xl">🎉</span>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              أهلاً وسهلاً بك عزيزي المشترك ✨✨
            </h2>

            <p className="text-gray-600 mb-6 leading-relaxed">
              مرحباً بك مرة أخرى {showWelcomeBackModal.visitorName}!
              <br />
              نتمنى لك وقتاً ممتعاً معنا بمنصة إشرو ✨✨
            </p>

            {/* زر متابعة التسوق فقط - تم إزالة زر لوحة التحكم */}
            <Button
              onClick={() => {
                console.log('Continue shopping clicked in welcome back modal');
                setShowWelcomeBackModal(null);
              }}
              className="w-full bg-gradient-to-r from-green-500 to-primary hover:from-green-600 hover:to-primary/90 text-white font-bold py-3"
            >
              🛍️ متابعة التسوق 🛍️
            </Button>

            <p className="text-xs text-gray-500 mt-4">
              يمكنك الوصول للوحة التحكم في أي وقت من أيقونة المستخدم في الأعلى
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
