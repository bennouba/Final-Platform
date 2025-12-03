import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PagesManagementViewProps {
  storeData: any;
  setStoreData: (data: any) => void;
  onSave: () => void;
}

export const PagesManagementView: React.FC<PagesManagementViewProps> = ({
  storeData,
  setStoreData,
  onSave
}) => {
  const [showAddPage, setShowAddPage] = useState(false);
  const [filterValue, setFilterValue] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Sample pages data
  const pages = [
    { id: 1, name: 'عن المتجر', status: 'مفعل', date: '2022-01-03', actions: 'edit' },
    { id: 2, name: 'التواصل معنا', status: 'مفعل', date: '2022-01-03', actions: 'edit' },
    { id: 3, name: 'شروط الإستخدام', status: 'مفعل', date: '2022-01-03', actions: 'edit' },
    { id: 4, name: 'سياسة الاسترجاع والاستبدال والإلغاء', status: 'مفعل', date: '2022-01-03', actions: 'edit' },
    { id: 5, name: 'صفحة تجريبية', status: 'مفعل', date: '2024-02-27', actions: 'edit' },
    { id: 6, name: 'صفحة تجريبية', status: 'مفعل', date: '2024-02-27', actions: 'edit' }
  ];

  // New page form state
  const [newPage, setNewPage] = useState({
    name: '',
    content: '',
    seoTitle: '',
    seoDescription: '',
    status: 'غير مفعل'
  });

  const handleAddPage = () => {
    // Here you would typically save the new page

    setShowAddPage(false);
    setNewPage({ name: '', content: '', seoTitle: '', seoDescription: '', status: 'غير مفعل' });
  };

  const filteredPages = pages.filter(page => {
    const matchesValue = !filterValue || page.name.includes(filterValue);
    const matchesStatus = !filterStatus || page.status === filterStatus;
    return matchesValue && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">إدارة الصفحات</h2>
          <p className="text-gray-600">إنشاء وتعديل صفحات متجرك الإلكتروني</p>
        </div>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4 items-center">
              <Button
                onClick={() => setShowAddPage(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                إضافة صفحة جديدة
              </Button>

              <Select value={filterValue} onValueChange={setFilterValue}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="الكل" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">الكل</SelectItem>
                  <SelectItem value="عن المتجر">عن المتجر</SelectItem>
                  <SelectItem value="التواصل">التواصل معنا</SelectItem>
                  <SelectItem value="شروط">شروط الإستخدام</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">الكل</SelectItem>
                  <SelectItem value="مفعل">مفعل</SelectItem>
                  <SelectItem value="غير مفعل">غير مفعل</SelectItem>
                  <SelectItem value="ملغية">ملغية</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                بحث
              </Button>
              <Button variant="outline" size="sm">
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l4-4m-4 4l-4-4m8 2h3m-3 4h3m-6-8h3m-3 4h3" />
                </svg>
                تصدير
              </Button>
              <Button variant="outline" size="sm">
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                فرز تصاعدي
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add New Page Modal */}
      {showAddPage && (
        <Card>
          <CardHeader>
            <CardTitle>إضافة صفحة جديدة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="pageName">الإسم</Label>
                <Input
                  id="pageName"
                  value={newPage.name}
                  onChange={(e) => setNewPage({...newPage, name: e.target.value})}
                  placeholder="أدخل اسم الصفحة"
                  className="text-right"
                />
              </div>

              <div>
                <Label htmlFor="pageStatus">الحالة</Label>
                <Select value={newPage.status} onValueChange={(value) => setNewPage({...newPage, status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="غير مفعل">غير مفعل</SelectItem>
                    <SelectItem value="مفعل">مفعل</SelectItem>
                    <SelectItem value="ملغية">ملغية</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="pageContent">المحتوى</Label>
              <Textarea
                id="pageContent"
                rows={6}
                value={newPage.content}
                onChange={(e) => setNewPage({...newPage, content: e.target.value})}
                placeholder="أدخل محتوى الصفحة"
                className="text-right"
              />
            </div>

            <div className="border-t pt-6">
              <h4 className="font-medium text-gray-900 mb-4">تحسين محرك البحث</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="seoTitle">تعديل العنوان SEO</Label>
                  <Input
                    id="seoTitle"
                    value={newPage.seoTitle}
                    onChange={(e) => setNewPage({...newPage, seoTitle: e.target.value})}
                    placeholder="أدخل العنوان لمحركات البحث"
                    className="text-right"
                  />
                  <p className="text-xs text-gray-600 mt-1">قم بإعداد العنوان والوصف للصفحة لتسهيل الوصول لموقعك</p>
                </div>

                <div>
                  <Label htmlFor="seoDescription">تعديل الوصف SEO</Label>
                  <Textarea
                    id="seoDescription"
                    rows={3}
                    value={newPage.seoDescription}
                    onChange={(e) => setNewPage({...newPage, seoDescription: e.target.value})}
                    placeholder="أدخل الوصف لمحركات البحث"
                    className="text-right"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button onClick={handleAddPage}>حفظ</Button>
              <Button variant="outline" onClick={() => setShowAddPage(false)}>إلغاء</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pages Table */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة الصفحات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-right">الإسم</th>
                  <th className="p-3 text-right">الحالة</th>
                  <th className="p-3 text-right">التاريخ</th>
                  <th className="p-3 text-right">الخيارات</th>
                </tr>
              </thead>
              <tbody>
                {filteredPages.map((page) => (
                  <tr key={page.id} className="border-b">
                    <td className="p-3 font-medium">{page.name}</td>
                    <td className="p-3">
                      <Badge className={
                        page.status === 'مفعل' ? 'bg-green-100 text-green-800' :
                        page.status === 'غير مفعل' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }>
                        {page.status}
                      </Badge>
                    </td>
                    <td className="p-3">{page.date}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Button>
                        <Button size="sm" variant="outline">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 mt-6">
            <span className="text-sm text-gray-600">عرض من خلال 1 الى {filteredPages.length} في {filteredPages.length} سجلات</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
