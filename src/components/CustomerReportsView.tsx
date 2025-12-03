import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CustomerReportsViewProps {
  storeData: any;
  setStoreData: (data: any) => void;
  onSave: () => void;
}

export const CustomerReportsView: React.FC<CustomerReportsViewProps> = ({
  storeData,
  setStoreData,
  onSave
}) => {
  const [activeTab, setActiveTab] = useState('نظرة عامة');

  // Sample customer data
  const customerData = {
    totalCustomers: 2847,
    activeCustomers: 2156,
    newCustomers: 234,
    returningCustomers: 1892,
    averageOrderValue: 145,
    topCustomers: [
      { name: 'أحمد محمد', orders: 12, totalSpent: 2450, lastOrder: '2024-01-15' },
      { name: 'فاطمة علي', orders: 8, totalSpent: 1890, lastOrder: '2024-01-14' },
      { name: 'محمد حسن', orders: 15, totalSpent: 3200, lastOrder: '2024-01-13' },
      { name: 'سارة أحمد', orders: 6, totalSpent: 1250, lastOrder: '2024-01-12' },
      { name: 'علي محمود', orders: 9, totalSpent: 1680, lastOrder: '2024-01-11' }
    ],
    customerSegments: [
      { segment: 'عملاء جدد', count: 234, percentage: 8.2, color: 'bg-green-500' },
      { segment: 'عملاء منتظمون', count: 1892, percentage: 66.5, color: 'bg-blue-500' },
      { segment: 'عملاء VIP', count: 456, percentage: 16.0, color: 'bg-purple-500' },
      { segment: 'عملاء غير نشطين', count: 265, percentage: 9.3, color: 'bg-gray-500' }
    ],
    monthlyGrowth: [
      { month: 'يناير', newCustomers: 180, totalCustomers: 2450 },
      { month: 'فبراير', newCustomers: 195, totalCustomers: 2645 },
      { month: 'مارس', newCustomers: 210, totalCustomers: 2855 },
      { month: 'أبريل', newCustomers: 225, totalCustomers: 3080 },
      { month: 'مايو', newCustomers: 240, totalCustomers: 3320 },
      { month: 'يونيو', newCustomers: 234, totalCustomers: 3554 }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">تقارير العملاء</h2>
          <p className="text-gray-600">تحليل شامل لبيانات العملاء وسلوكياتهم</p>
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
          <TabsTrigger value="العملاء الأعلى">العملاء الأعلى</TabsTrigger>
          <TabsTrigger value="الشرائح">شرائح العملاء</TabsTrigger>
          <TabsTrigger value="النمو">نمو العملاء</TabsTrigger>
        </TabsList>

        <TabsContent value="نظرة عامة" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">إجمالي العملاء</p>
                    <p className="text-3xl font-bold text-gray-900">{customerData.totalCustomers.toLocaleString()}</p>
                    <p className="text-sm text-blue-600">عميل مسجل</p>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">العملاء النشطون</p>
                    <p className="text-3xl font-bold text-green-600">{customerData.activeCustomers.toLocaleString()}</p>
                    <p className="text-sm text-green-600">{((customerData.activeCustomers / customerData.totalCustomers) * 100).toFixed(1)}% من الإجمالي</p>
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
                    <p className="text-sm font-medium text-gray-600">عملاء جدد</p>
                    <p className="text-3xl font-bold text-purple-600">{customerData.newCustomers}</p>
                    <p className="text-sm text-purple-600">هذا الشهر</p>
                  </div>
                  <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">متوسط قيمة الطلب</p>
                    <p className="text-3xl font-bold text-yellow-600">{customerData.averageOrderValue} د.ل</p>
                    <p className="text-sm text-yellow-600">لكل عميل</p>
                  </div>
                  <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Customer Segments Chart */}
          <Card>
            <CardHeader>
              <CardTitle>شرائح العملاء</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customerData.customerSegments.map((segment, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${segment.color}`}></div>
                      <span className="font-medium text-gray-900">{segment.segment}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-48 bg-gray-200 rounded-full h-3">
                        <div
                          className={`${segment.color} h-3 rounded-full`}
                          style={{ width: `${segment.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-16 text-center">
                        {segment.count} ({segment.percentage}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="العملاء الأعلى" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>أفضل العملاء</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-right">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 text-right">العميل</th>
                      <th className="p-3 text-right">عدد الطلبات</th>
                      <th className="p-3 text-right">إجمالي المشتريات</th>
                      <th className="p-3 text-right">آخر طلب</th>
                      <th className="p-3 text-right">الحالة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customerData.topCustomers.map((customer, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-3 font-medium">{customer.name}</td>
                        <td className="p-3">{customer.orders}</td>
                        <td className="p-3 font-bold">{customer.totalSpent.toLocaleString()} د.ل</td>
                        <td className="p-3">{customer.lastOrder}</td>
                        <td className="p-3">
                          <Badge className="bg-green-100 text-green-800">نشط</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="الشرائح" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {customerData.customerSegments.map((segment, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-full ${segment.color} flex items-center justify-center`}>
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                    <Badge variant="outline">{segment.percentage}%</Badge>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{segment.segment}</h3>
                  <p className="text-2xl font-bold text-gray-700">{segment.count.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">عميل</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="النمو" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>نمو قاعدة العملاء</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customerData.monthlyGrowth.map((month, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{month.month}</p>
                      <p className="text-sm text-gray-600">
                        عملاء جدد: {month.newCustomers} | إجمالي: {month.totalCustomers}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-gray-600">
                        +{month.newCustomers} جديد
                      </div>
                      <div className="w-32 bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-blue-500 h-3 rounded-full"
                          style={{ width: `${(month.totalCustomers / 3600) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
