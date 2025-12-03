import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface MenuManagementViewProps {
  storeData: any;
  setStoreData: (data: any) => void;
  onSave: () => void;
}

export const MenuManagementView: React.FC<MenuManagementViewProps> = ({
  storeData,
  setStoreData,
  onSave
}) => {
  const [newLink, setNewLink] = useState({ title: '', url: 'http://', location: 'header' });

  // Sample menu structure
  const menuStructure = [
    {
      id: 'main',
      name: 'الرئيسية',
      type: 'custom',
      url: '/',
      children: []
    },
    {
      id: 'products',
      name: 'جميع المنتجات',
      type: 'custom',
      url: '/products',
      children: []
    },
    {
      id: 'pages',
      name: 'الصفحات',
      type: 'custom',
      url: '/pages',
      children: [
        { id: 'about', name: 'عن المتجر', type: 'page', url: '/pages/about' },
        { id: 'contact', name: 'التواصل معنا', type: 'page', url: '/pages/contact' },
        { id: 'terms', name: 'شروط الإستخدام', type: 'page', url: '/pages/terms' },
        { id: 'return', name: 'سياسة الاسترجاع والاستبدال والإلغاء', type: 'page', url: '/pages/return' },
        { id: 'test1', name: 'صفحة تجريبية', type: 'page', url: '/pages/test1' },
        { id: 'test2', name: 'صفحة تجريبية', type: 'page', url: '/pages/test2' }
      ]
    }
  ];

  // Available pages for selection
  const availablePages = [
    'التواصل معنا',
    'سياسة الاسترجاع والاستبدال والإلغاء',
    'شروط الإستخدام',
    'صفحة تجريبية',
    'صفحة تجريبية',
    'عن المتجر'
  ];

  // Available categories for selection
  const availableCategories = [
    'ملابس',
    'أحذية',
    'إكسسوارات',
    'عناية شخصية'
  ];

  // Available brands for selection
  const availableBrands = [
    'ZARA',
    'H&M',
    'Nike',
    'Adidas',
    'Samsung',
    'Apple'
  ];

  const handleAddLink = () => {
    // Here you would typically add the new link to the menu

    setNewLink({ title: '', url: 'http://', location: 'header' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">إدارة القائمة</h2>
          <p className="text-gray-600">تعديل القائمة الرئيسية للمتجر</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add New Link */}
        <Card>
          <CardHeader>
            <CardTitle>إضافة رابط</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="linkTitle">العنوان</Label>
              <Input
                id="linkTitle"
                value={newLink.title}
                onChange={(e) => setNewLink({...newLink, title: e.target.value})}
                placeholder="أدخل عنوان الرابط"
                className="text-right"
              />
            </div>

            <div>
              <Label htmlFor="linkUrl">URL الرابط</Label>
              <Input
                id="linkUrl"
                value={newLink.url}
                onChange={(e) => setNewLink({...newLink, url: e.target.value})}
                placeholder="http://"
                className="text-right"
              />
            </div>

            <div>
              <Label id="linkLocationLabel" htmlFor="linkLocation">مكان العرض</Label>
              <select
                id="linkLocation"
                value={newLink.location}
                onChange={(e) => setNewLink({...newLink, location: e.target.value})}
                className="w-full p-2 border rounded-md text-right"
                aria-labelledby="linkLocationLabel"
                aria-label="مكان العرض"
                title="مكان العرض"
              >
                <option value="header">الهيدر (القائمة الرئيسية)</option>
                <option value="footer">الفوتر</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="samePage" aria-labelledby="samePageLabel" aria-label="فتح الرابط في نفس الصفحة" title="فتح الرابط في نفس الصفحة" />
              <Label id="samePageLabel" htmlFor="samePage">فتح الرابط في نفس الصفحة</Label>
            </div>

            <Button onClick={handleAddLink} className="w-full">
              إضافة الرابط
            </Button>
          </CardContent>
        </Card>

        {/* Available Pages */}
        <Card>
          <CardHeader>
            <CardTitle>الصفحات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {availablePages.map((page, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm text-gray-700">{page}</span>
                  <Button size="sm" variant="outline">
                    إضافة
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Menu Structure */}
      <Card>
        <CardHeader>
          <CardTitle>هيكل القائمة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {menuStructure.map((item) => (
              <div key={item.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-900">{item.name}</span>
                    <Badge variant="outline">{item.type === 'custom' ? 'رابط مخصص' : 'صفحة'}</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" size="sm" variant="outline" aria-label="تحرير العنصر">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </Button>
                    <Button type="button" size="sm" variant="outline" aria-label="حذف العنصر">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </Button>
                  </div>
                </div>

                {item.children && item.children.length > 0 && (
                  <div className="mt-3 pl-4 border-r-2 border-gray-200">
                    <div className="space-y-2">
                      {item.children.map((child) => (
                        <div key={child.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm text-gray-700">{child.name}</span>
                          <div className="flex gap-1">
                            <Badge className="bg-blue-100 text-blue-800 text-xs">{child.type}</Badge>
                            <Button type="button" size="sm" variant="outline" aria-label="تحرير العنصر الفرعي">
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </Button>
                            <Button type="button" size="sm" variant="outline" aria-label="حذف العنصر الفرعي">
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Available Categories and Brands */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>التصنيفات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {availableCategories.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm text-gray-700">{category}</span>
                  <Button size="sm" variant="outline">
                    إضافة
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>العلامات التجارية</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {availableBrands.map((brand, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm text-gray-700">{brand}</span>
                  <Button size="sm" variant="outline">
                    إضافة
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Default Menu Restore */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">استعادة القائمة الإفتراضية</h4>
              <p className="text-sm text-gray-600">استعادة القائمة إلى إعداداتها الافتراضية</p>
            </div>
            <Button variant="outline">
              استعادة القائمة الإفتراضية
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Actions */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              <p>النشر و الحفظ</p>
              <p>سيتم حفظ جميع التغييرات وحفظ القائمة الجديدة</p>
            </div>
            <div className="flex gap-4">
              <Button variant="outline">إلغاء</Button>
              <Button>حفظ</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
