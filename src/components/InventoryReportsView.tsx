import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface InventoryReportsViewProps {
  storeData: any;
  setStoreData: (data: any) => void;
  onSave: () => void;
}

export const InventoryReportsView: React.FC<InventoryReportsViewProps> = ({
  storeData,
  setStoreData,
  onSave
}) => {
  const [activeTab, setActiveTab] = useState('نظرة عامة');

  // Sample inventory data
  const inventoryData = {
    totalProducts: 1250,
    inStock: 1100,
    lowStock: 85,
    outOfStock: 65,
    totalValue: 245000,
    categories: [
      { name: 'ملابس', count: 450, value: 125000 },
      { name: 'أحذية', count: 320, value: 85000 },
      { name: 'إكسسوارات', count: 280, value: 35000 },
      { name: 'عناية شخصية', count: 200, value: 10000 }
    ],
    monthlyTrends: [
      { month: 'يناير', inStock: 1200, outOfStock: 50 },
      { month: 'فبراير', inStock: 1150, outOfStock: 75 },
      { month: 'مارس', inStock: 1180, outOfStock: 45 },
      { month: 'أبريل', inStock: 1100, outOfStock: 65 },
      { month: 'مايو', inStock: 1120, outOfStock: 55 },
      { month: 'يونيو', inStock: 1080, outOfStock: 85 }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">تقارير المخزون</h2>
          <p className="text-gray-600">تحليل شامل لحالة المخزون والمنتجات</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l4-4m-4 4l-4-4m8 2h3m-3 4h3m-6-8h3m-3 4h3" />
            </svg>
            تصدير التقرير
          </Button>
          <Button>
            <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            تحديث البيانات
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="نظرة عامة">نظرة عامة</TabsTrigger>
          <TabsTrigger value="بالتصنيفات">بالتصنيفات</TabsTrigger>
          <TabsTrigger value="اتجاهات">الاتجاهات</TabsTrigger>
          <TabsTrigger value="تنبيهات">التنبيهات</TabsTrigger>
        </TabsList>

        <TabsContent value="نظرة عامة" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">إجمالي المنتجات</p>
                    <p className="text-3xl font-bold text-gray-900">{inventoryData.totalProducts.toLocaleString()}</p>
                    <p className="text-sm text-blue-600">منتج في المخزون</p>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                    <p className="text-sm font-medium text-gray-600">متوفر في المخزون</p>
                    <p className="text-3xl font-bold text-green-600">{inventoryData.inStock.toLocaleString()}</p>
                    <p className="text-sm text-green-600">{((inventoryData.inStock / inventoryData.totalProducts) * 100).toFixed(1)}% من الإجمالي</p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">نقص في المخزون</p>
                    <p className="text-3xl font-bold text-yellow-600">{inventoryData.lowStock}</p>
                    <p className="text-sm text-yellow-600">يحتاج إعادة تعبئة</p>
                  </div>
                  <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">غير متوفر</p>
                    <p className="text-3xl font-bold text-red-600">{inventoryData.outOfStock}</p>
                    <p className="text-sm text-red-600">نفذ من المخزون</p>
                  </div>
                  <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Inventory Value Chart */}
          <Card>
            <CardHeader>
              <CardTitle>القيمة الإجمالية للمخزون</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="text-4xl font-bold text-gray-900 mb-2">{inventoryData.totalValue.toLocaleString()} د.ل</div>
                <p className="text-gray-600">القيمة الإجمالية للمنتجات في المخزون</p>
                <div className="mt-4 flex justify-center">
                  <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{((inventoryData.totalValue / 300000) * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="بالتصنيفات" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>توزيع المنتجات حسب التصنيف</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {inventoryData.categories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${
                        index === 0 ? 'from-blue-500 to-blue-600' :
                        index === 1 ? 'from-green-500 to-green-600' :
                        index === 2 ? 'from-yellow-500 to-yellow-600' :
                        'from-purple-500 to-purple-600'
                      }`}></div>
                      <div>
                        <p className="font-medium text-gray-900">{category.name}</p>
                        <p className="text-sm text-gray-600">{category.count} منتج</p>
                      </div>
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-gray-900">{category.value.toLocaleString()} د.ل</p>
                      <p className="text-sm text-gray-600">{((category.value / inventoryData.totalValue) * 100).toFixed(1)}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="اتجاهات" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>اتجاهات المخزون الشهرية</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {inventoryData.monthlyTrends.map((month, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{month.month}</p>
                      <p className="text-sm text-gray-600">متوفر: {month.inStock} | غير متوفر: {month.outOfStock}</p>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${(month.inStock / 1200) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-16 text-center">
                        {((month.inStock / (month.inStock + month.outOfStock)) * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="تنبيهات" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>تنبيهات المخزون</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-red-800">نقص في المخزون</p>
                      <p className="text-sm text-red-600">65 منتج نفذ من المخزون ويحتاج إعادة تعبئة فورية</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-yellow-800">مخزون منخفض</p>
                      <p className="text-sm text-yellow-600">85 منتج وصل إلى الحد الأدنى ويحتاج إعادة طلب</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
