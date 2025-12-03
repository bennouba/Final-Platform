import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ManualOrdersView } from '@/components/ManualOrdersView';
import { ProductsView } from '@/components/ProductsView';
import { CategoriesView } from '@/components/CategoriesView';
import { WarehouseManagementView } from '@/components/WarehouseManagementView';

import { CustomerGroupsView } from '@/components/CustomerGroupsView';
import { InventoryNotificationsView } from '@/components/InventoryNotificationsView';
import { MarketingCampaignsView } from '@/components/MarketingCampaignsView';
import { DiscountCouponsView } from '@/components/DiscountCouponsView';
import { LoyaltyProgramView } from '@/components/LoyaltyProgramView';
import { RealTimeAnalyticsView } from '@/components/RealTimeAnalyticsView';
import { MerchantFinancialView } from '@/components/MerchantFinancialView';
import { SubscriptionManagementView } from '@/components/SubscriptionManagementView';
import { DigitalWalletView } from '@/components/DigitalWalletView';
import { StoreSettingsView } from '@/components/StoreSettingsView';
import { libyanCities } from '@/data/libya/cities/cities';

// Note: These components are now implemented in EnhancedMerchantDashboard.tsx
// The main application uses EnhancedMerchantDashboard.tsx, not this file

interface MerchantPortalProps {
  storeData: any;
  setStoreData: (data: any) => void;
  onSave: () => void;
}

const MerchantPortal: React.FC<MerchantPortalProps> = ({ storeData, setStoreData, onSave }) => {
  const [activeSection, setActiveSection] = useState('نظرة عامة');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Header Icons Component
  const HeaderIcons = () => (
    <div className="flex items-center gap-4">
      {/* General Status Icon */}
      <div className="flex items-center gap-2 bg-green-100 px-3 py-2 rounded-lg cursor-pointer hover:bg-green-200 transition-colors">
        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        <span className="text-sm font-medium text-green-700">نشط</span>
      </div>

      {/* Unavailable Orders Icon */}
      <div className="p-2 bg-red-100 rounded-lg cursor-pointer hover:bg-red-200 transition-colors">
        <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>

      {/* Notifications Icon */}
      <div className="p-2 bg-blue-100 rounded-lg cursor-pointer hover:bg-blue-200 transition-colors relative">
        <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.868 12.683A17.925 17.925 0 0112 21c7.962 0 12-1.21 12-2.683m-12 2.683a17.925 17.925 0 01-7.132-8.317M12 21c4.411 0 8-4.03 8-9s-3.589-9-8-9-8 4.03-8 9a9.06 9.06 0 001.832 5.683L4 21l4.868-2.317z" />
        </svg>
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
      </div>

      {/* Shipping Tracking Icon */}
      <div className="p-2 bg-purple-100 rounded-lg cursor-pointer hover:bg-purple-200 transition-colors">
        <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>

      {/* Settings Icon */}
      <div className="p-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors" onClick={() => setActiveSection('الإعدادات')}>
        <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>

      {/* Chat Bot Icon */}
      <div className="p-2 bg-indigo-100 rounded-lg cursor-pointer hover:bg-indigo-200 transition-colors">
        <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </div>

      {/* Return to Store Button */}
      <Button
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg"
        onClick={() => window.open('https://nawaem.ishro.ly', '_blank')}
      >
        العودة للمتجر
      </Button>

      {/* Merchant Icon */}
      <div className="p-2 bg-yellow-100 rounded-lg cursor-pointer hover:bg-yellow-200 transition-colors">
        <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>

      {/* Logout Button */}
      <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
        تسجيل خروج
      </Button>
    </div>
  );

  // Sidebar Navigation Component
  const SidebarNavigation = () => (
    <div className="w-64 bg-white shadow-lg h-full overflow-y-auto">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">لوحة التحكم</h2>
        <nav className="space-y-2">
          <button
            onClick={() => { setActiveSection('نظرة عامة'); setSidebarOpen(false); }}
            className={`w-full text-right p-3 rounded-lg transition-colors ${activeSection === 'نظرة عامة' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            نظرة عامة
          </button>

          <button
            onClick={() => { setActiveSection('الطلبات'); setSidebarOpen(false); }}
            className={`w-full text-right p-3 rounded-lg transition-colors ${activeSection === 'الطلبات' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            الطلبات
          </button>

          <button
            onClick={() => { setActiveSection('الطلبات اليدوية'); setSidebarOpen(false); }}
            className={`w-full text-right p-3 rounded-lg transition-colors ${activeSection === 'الطلبات اليدوية' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            الطلبات اليدوية
          </button>

          <button
            onClick={() => { setActiveSection('الطلبات المتروكة'); setSidebarOpen(false); }}
            className={`w-full text-right p-3 rounded-lg transition-colors ${activeSection === 'الطلبات المتروكة' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            الطلبات المتروكة
          </button>

          <button
            onClick={() => { setActiveSection('الطلبات الغير متوفرة'); setSidebarOpen(false); }}
            className={`w-full text-right p-3 rounded-lg transition-colors ${activeSection === 'الطلبات الغير متوفرة' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            الطلبات الغير متوفرة
          </button>

          <button
            onClick={() => { setActiveSection('الكتالوج'); setSidebarOpen(false); }}
            className={`w-full text-right p-3 rounded-lg transition-colors ${activeSection === 'الكتالوج' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            الكتالوج
          </button>

          <button
            onClick={() => { setActiveSection('المنتجات'); setSidebarOpen(false); }}
            className={`w-full text-right p-3 rounded-lg transition-colors ${activeSection === 'المنتجات' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            المنتجات
          </button>

          <button
            onClick={() => { setActiveSection('التصنيفات'); setSidebarOpen(false); }}
            className={`w-full text-right p-3 rounded-lg transition-colors ${activeSection === 'التصنيفات' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            التصنيفات
          </button>

          <button
            onClick={() => { setActiveSection('المخزون'); setSidebarOpen(false); }}
            className={`w-full text-right p-3 rounded-lg transition-colors ${activeSection === 'المخزون' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            المخزون
          </button>

          <button
            onClick={() => { setActiveSection('إدارة تغيير المخزون'); setSidebarOpen(false); }}
            className={`w-full text-right p-3 rounded-lg transition-colors ${activeSection === 'إدارة تغيير المخزون' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            إدارة تغيير المخزون
          </button>


          <button
            onClick={() => { setActiveSection('العملاء'); setSidebarOpen(false); }}
            className={`w-full text-right p-3 rounded-lg transition-colors ${activeSection === 'العملاء' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            العملاء
          </button>

          <button
            onClick={() => { setActiveSection('مجموعة العملاء'); setSidebarOpen(false); }}
            className={`w-full text-right p-3 rounded-lg transition-colors ${activeSection === 'مجموعة العملاء' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            مجموعة العملاء
          </button>

          <button
            onClick={() => { setActiveSection('التقييمات'); setSidebarOpen(false); }}
            className={`w-full text-right p-3 rounded-lg transition-colors ${activeSection === 'التقييمات' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            التقييمات
          </button>

          <button
            onClick={() => { setActiveSection('الأسئلة'); setSidebarOpen(false); }}
            className={`w-full text-right p-3 rounded-lg transition-colors ${activeSection === 'الأسئلة' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            الأسئلة
          </button>

          <button
            onClick={() => { setActiveSection('إشعارات بالمخزون'); setSidebarOpen(false); }}
            className={`w-full text-right p-3 rounded-lg transition-colors ${activeSection === 'إشعارات بالمخزون' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            إشعارات بالمخزون
          </button>

          <div className="border-t pt-4 mt-4">
            <h3 className="text-sm font-semibold text-gray-500 mb-2">التسويق</h3>
            <button
              onClick={() => { setActiveSection('الحملات التسويقية'); setSidebarOpen(false); }}
              className={`w-full text-right p-3 rounded-lg transition-colors ${activeSection === 'الحملات التسويقية' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              الحملات التسويقية
            </button>

            <button
              onClick={() => { setActiveSection('كوبونات الخصم'); setSidebarOpen(false); }}
              className={`w-full text-right p-3 rounded-lg transition-colors ${activeSection === 'كوبونات الخصم' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              كوبونات الخصم
            </button>

            <button
              onClick={() => { setActiveSection('برنامج الولاء'); setSidebarOpen(false); }}
              className={`w-full text-right p-3 rounded-lg transition-colors ${activeSection === 'برنامج الولاء' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              برنامج الولاء
            </button>
          </div>

          <div className="border-t pt-4 mt-4">
            <h3 className="text-sm font-semibold text-gray-500 mb-2">التحليلات</h3>
            <button
              onClick={() => { setActiveSection('التحليلات المباشرة'); setSidebarOpen(false); }}
              className={`w-full text-right p-3 rounded-lg transition-colors ${activeSection === 'التحليلات المباشرة' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              التحليلات المباشرة
            </button>

            <button
              onClick={() => { setActiveSection('تقارير المبيعات'); setSidebarOpen(false); }}
              className={`w-full text-right p-3 rounded-lg transition-colors ${activeSection === 'تقارير المبيعات' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              تقارير المبيعات
            </button>

            <button
              onClick={() => { setActiveSection('تقارير المخزون'); setSidebarOpen(false); }}
              className={`w-full text-right p-3 rounded-lg transition-colors ${activeSection === 'تقارير المخزون' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              تقارير المخزون
            </button>

            <button
              onClick={() => { setActiveSection('تقارير العملاء'); setSidebarOpen(false); }}
              className={`w-full text-right p-3 rounded-lg transition-colors ${activeSection === 'تقارير العملاء' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              تقارير العملاء
            </button>
          </div>

          <div className="border-t pt-4 mt-4">
            <h3 className="text-sm font-semibold text-gray-500 mb-2">المالية</h3>
            <button
              onClick={() => { setActiveSection('المالية'); setSidebarOpen(false); }}
              className={`w-full text-right p-3 rounded-lg transition-colors ${activeSection === 'المالية' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              المالية
            </button>

            <button
              onClick={() => { setActiveSection('إدارة الاشتراك'); setSidebarOpen(false); }}
              className={`w-full text-right p-3 rounded-lg transition-colors ${activeSection === 'إدارة الاشتراك' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              إدارة الاشتراك
            </button>

            <button
              onClick={() => { setActiveSection('المحفظة'); setSidebarOpen(false); }}
              className={`w-full text-right p-3 rounded-lg transition-colors ${activeSection === 'المحفظة' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              المحفظة
            </button>
          </div>

          <div className="border-t pt-4 mt-4">
            <h3 className="text-sm font-semibold text-gray-500 mb-2">الإعدادات</h3>
            <button
              onClick={() => { setActiveSection('بيانات المتجر'); setSidebarOpen(false); }}
              className={`w-full text-right p-3 rounded-lg transition-colors ${activeSection === 'بيانات المتجر' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              بيانات المتجر
            </button>

            <button
              onClick={() => { setActiveSection('واجهة المتجر'); setSidebarOpen(false); }}
              className={`w-full text-right p-3 rounded-lg transition-colors ${activeSection === 'واجهة المتجر' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              واجهة المتجر
            </button>

            <button
              onClick={() => { setActiveSection('الصفحات'); setSidebarOpen(false); }}
              className={`w-full text-right p-3 rounded-lg transition-colors ${activeSection === 'الصفحات' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              الصفحات
            </button>

            <button
              onClick={() => { setActiveSection('القائمة'); setSidebarOpen(false); }}
              className={`w-full text-right p-3 rounded-lg transition-colors ${activeSection === 'القائمة' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              القائمة
            </button>

            <button
              onClick={() => { setActiveSection('السلايدرز'); setSidebarOpen(false); }}
              className={`w-full text-right p-3 rounded-lg transition-colors ${activeSection === 'السلايدرز' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              السلايدرز
            </button>

            <button
              onClick={() => { setActiveSection('الإعلانات'); setSidebarOpen(false); }}
              className={`w-full text-right p-3 rounded-lg transition-colors ${activeSection === 'الإعلانات' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              الإعلانات
            </button>
          </div>

          <div className="border-t pt-4 mt-4">
            <h3 className="text-sm font-semibold text-gray-500 mb-2">الخدمات</h3>
            <button
              onClick={() => { setActiveSection('نقاط البيع'); setSidebarOpen(false); }}
              className={`w-full text-right p-3 rounded-lg transition-colors ${activeSection === 'نقاط البيع' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              نقاط البيع
            </button>

            <button
              onClick={() => { setActiveSection('الخدمات'); setSidebarOpen(false); }}
              className={`w-full text-right p-3 rounded-lg transition-colors ${activeSection === 'الخدمات' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              الخدمات
            </button>

            <button
              onClick={() => { setActiveSection('خدمة العملاء'); setSidebarOpen(false); }}
              className={`w-full text-right p-3 rounded-lg transition-colors ${activeSection === 'خدمة العملاء' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              خدمة العملاء
            </button>

            <button
              onClick={() => { setActiveSection('الدعم الفني'); setSidebarOpen(false); }}
              className={`w-full text-right p-3 rounded-lg transition-colors ${activeSection === 'الدعم الفني' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              الدعم الفني
            </button>
          </div>

          <button
            onClick={() => { setActiveSection('تسجيل الخروج'); setSidebarOpen(false); }}
            className={`w-full text-right p-3 rounded-lg transition-colors text-red-600 hover:bg-red-50`}
          >
            تسجيل الخروج
          </button>
        </nav>
      </div>
    </div>
  );

  // Render Overview Section
  const renderOverviewSection = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي المبيعات</p>
                <p className="text-3xl font-bold text-gray-900">45,231 د.ل</p>
                <p className="text-sm text-green-600">+20.1% من الشهر الماضي</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">الطلبات الجديدة</p>
                <p className="text-3xl font-bold text-gray-900">12</p>
                <p className="text-sm text-green-600">+2 من الأمس</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">المنتجات</p>
                <p className="text-3xl font-bold text-gray-900">156</p>
                <p className="text-sm text-blue-600">نشطة في المتجر</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">العملاء</p>
                <p className="text-3xl font-bold text-gray-900">1,234</p>
                <p className="text-sm text-green-600">+12% نمو</p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>الطلبات الأخيرة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-right">رقم الطلب</th>
                  <th className="p-3 text-right">العميل</th>
                  <th className="p-3 text-right">المبلغ</th>
                  <th className="p-3 text-right">الحالة</th>
                  <th className="p-3 text-right">التاريخ</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-3">#1234</td>
                  <td className="p-3">أحمد محمد</td>
                  <td className="p-3">150 د.ل</td>
                  <td className="p-3"><Badge className="bg-green-100 text-green-800">مكتمل</Badge></td>
                  <td className="p-3">2024-01-15</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3">#1235</td>
                  <td className="p-3">فاطمة علي</td>
                  <td className="p-3">89 د.ل</td>
                  <td className="p-3"><Badge className="bg-blue-100 text-blue-800">قيد المعالجة</Badge></td>
                  <td className="p-3">2024-01-15</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3">#1236</td>
                  <td className="p-3">محمد حسن</td>
                  <td className="p-3">245 د.ل</td>
                  <td className="p-3"><Badge className="bg-yellow-100 text-yellow-800">في الانتظار</Badge></td>
                  <td className="p-3">2024-01-14</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Render Active Section Content
  const renderActiveSection = () => {
    switch (activeSection) {
      case 'نظرة عامة':
        return renderOverviewSection();
      case 'الطلبات':
      case 'الطلبات اليدوية':
        return <ManualOrdersView storeData={storeData} setStoreData={setStoreData} onSave={onSave} />;
      case 'المنتجات':
        return <ProductsView storeData={storeData} setStoreData={setStoreData} onSave={onSave} />;
      case 'التصنيفات':
        return <CategoriesView storeData={storeData} setStoreData={setStoreData} onSave={onSave} />;
      case 'المخزون':
        return <WarehouseManagementView storeData={storeData} setStoreData={setStoreData} onSave={onSave} />;

      case 'العملاء':
      case 'مجموعة العملاء':
        return <CustomerGroupsView storeData={storeData} setStoreData={setStoreData} onSave={onSave} />;
      case 'إشعارات بالمخزون':
        return <InventoryNotificationsView storeData={storeData} setStoreData={setStoreData} onSave={onSave} />;
      case 'الحملات التسويقية':
        return <MarketingCampaignsView storeData={storeData} setStoreData={setStoreData} onSave={onSave} />;
      case 'كوبونات الخصم':
        return <DiscountCouponsView storeData={storeData} setStoreData={setStoreData} onSave={onSave} />;
      case 'برنامج الولاء':
        return <LoyaltyProgramView storeData={storeData} setStoreData={setStoreData} onSave={onSave} />;
      case 'التحليلات المباشرة':
        return <RealTimeAnalyticsView storeData={storeData} setStoreData={setStoreData} onSave={onSave} />;
      case 'تقارير المخزون':
        return (
          <Card>
            <CardContent className="p-6">
              <p className="text-gray-600">محتوى تقارير المخزون سيتم إضافته قريباً</p>
            </CardContent>
          </Card>
        );
      case 'تقارير العملاء':
        return (
          <Card>
            <CardContent className="p-6">
              <p className="text-gray-600">محتوى تقارير العملاء سيتم إضافته قريباً</p>
            </CardContent>
          </Card>
        );
      case 'المالية':
        return <MerchantFinancialView storeData={storeData} setStoreData={setStoreData} onSave={onSave} />;
      case 'إدارة الاشتراك':
        return (
          <SubscriptionManagementView
            storeData={storeData}
            setStoreData={setStoreData}
            onSave={onSave}
          />
        );
      case 'المحفظة':
        return (
          <DigitalWalletView
            storeData={storeData}
            setStoreData={setStoreData}
            onSave={onSave}
          />
        );
      case 'واجهة المتجر':
        return <StoreSettingsView storeData={storeData} setStoreData={setStoreData} onSave={onSave} />;
      case 'الصفحات':
        return (
          <Card>
            <CardContent className="p-6">
              <p className="text-gray-600">محتوى إدارة الصفحات سيتم إضافته قريباً</p>
            </CardContent>
          </Card>
        );
      case 'القائمة':
        return (
          <Card>
            <CardContent className="p-6">
              <p className="text-gray-600">محتوى إدارة القائمة سيتم إضافته قريباً</p>
            </CardContent>
          </Card>
        );
      case 'السلايدرز':
        return (
          <Card>
            <CardContent className="p-6">
              <p className="text-gray-600">محتوى إدارة السلايدرز سيتم إضافته قريباً</p>
            </CardContent>
          </Card>
        );
      case 'الإعلانات':
        return (
          <Card>
            <CardContent className="p-6">
              <p className="text-gray-600">محتوى إدارة الإعلانات سيتم إضافته قريباً</p>
            </CardContent>
          </Card>
        );
      case 'بيانات المتجر':
      case 'الإعدادات':
        return <StoreSettingsView storeData={storeData} setStoreData={setStoreData} onSave={onSave} />;
      default:
        return renderOverviewSection();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar */}
      <Sheet>
        <SheetContent className="p-0">
          <SidebarNavigation />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <SidebarNavigation />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center gap-4">
                {/* Mobile Menu Button */}
                <Sheet>
                  <SheetTrigger>
                    <Button variant="outline" size="sm" className="lg:hidden">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="p-0">
                    <SidebarNavigation />
                  </SheetContent>
                </Sheet>

                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{activeSection}</h1>
                  <p className="text-gray-600 mt-1">إدارة متجر نواعم الإلكتروني</p>
                </div>
              </div>

              <HeaderIcons />
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderActiveSection()}
        </div>
      </div>
    </div>
  );
};

export default MerchantPortal;
