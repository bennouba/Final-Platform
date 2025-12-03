import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SlidersManagementViewProps {
  storeData: any;
  setStoreData: (data: any) => void;
  onSave: () => void;
}

export const SlidersManagementView: React.FC<SlidersManagementViewProps> = ({
  storeData,
  setStoreData,
  onSave
}) => {
  const [showAddSlider, setShowAddSlider] = useState(false);
  const [filterValue, setFilterValue] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Sample sliders data
  const sliders = [
    {
      id: 1,
      name: 'البنرات الرئيسية',
      status: 'مفعل',
      date: '2022-01-03',
      slides: 5
    }
  ];

  // New slider form state
  const [newSlider, setNewSlider] = useState({
    name: '',
    description: '',
    status: 'غير مفعل'
  });

  const handleAddSlider = () => {
    // Here you would typically save the new slider

    setShowAddSlider(false);
    setNewSlider({ name: '', description: '', status: 'غير مفعل' });
  };

  const filteredSliders = sliders.filter(slider => {
    const matchesValue = !filterValue || slider.name.includes(filterValue);
    const matchesStatus = !filterStatus || slider.status === filterStatus;
    return matchesValue && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">إدارة السلايدرز</h2>
          <p className="text-gray-600">إنشاء وتعديل السلايدرز لمتجرك الإلكتروني</p>
        </div>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4 items-center">
              <Button
                onClick={() => setShowAddSlider(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                إضافة سلايدر جديد
              </Button>

              <Select value={filterValue} onValueChange={setFilterValue}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="الكل" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">الكل</SelectItem>
                  <SelectItem value="البنرات الرئيسية">البنرات الرئيسية</SelectItem>
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                تحديث
              </Button>
              <Button variant="outline" size="sm">
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                فرز
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add New Slider Modal */}
      {showAddSlider && (
        <Card>
          <CardHeader>
            <CardTitle>إضافة سلايدر جديد</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="sliderName">الإسم</Label>
                <Input
                  id="sliderName"
                  value={newSlider.name}
                  onChange={(e) => setNewSlider({...newSlider, name: e.target.value})}
                  placeholder="أدخل اسم السلايدر"
                  className="text-right"
                />
              </div>

              <div>
                <Label htmlFor="sliderStatus">الحالة</Label>
                <Select value={newSlider.status} onValueChange={(value) => setNewSlider({...newSlider, status: value})}>
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
              <Label htmlFor="sliderDescription">الوصف</Label>
              <Textarea
                id="sliderDescription"
                rows={3}
                value={newSlider.description}
                onChange={(e) => setNewSlider({...newSlider, description: e.target.value})}
                placeholder="وصف مبسط"
                className="text-right"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button onClick={handleAddSlider}>حفظ</Button>
              <Button variant="outline" onClick={() => setShowAddSlider(false)}>إلغاء</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sliders Table */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة السلايدرز</CardTitle>
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
                {filteredSliders.map((slider) => (
                  <tr key={slider.id} className="border-b">
                    <td className="p-3">
                      <div>
                        <p className="font-medium">{slider.name}</p>
                        <p className="text-sm text-gray-600">{slider.slides} شريحة</p>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge className={
                        slider.status === 'مفعل' ? 'bg-green-100 text-green-800' :
                        slider.status === 'غير مفعل' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }>
                        {slider.status}
                      </Badge>
                    </td>
                    <td className="p-3">{slider.date}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Button>
                        <Button size="sm" variant="outline">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
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
            <span className="text-sm text-gray-600">عرض من خلال 1 الى {filteredSliders.length} في {filteredSliders.length} سجلات</span>
          </div>
        </CardContent>
      </Card>

      {/* Slider Preview */}
      <Card>
        <CardHeader>
          <CardTitle>معاينة السلايدر</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg p-8 text-center">
            <div className="text-6xl mb-4">🎠</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">البنرات الرئيسية</h3>
            <p className="text-gray-600 mb-4">سلايدر يحتوي على 5 شرائح إعلانية</p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((slide) => (
                <div
                  key={slide}
                  className={`w-3 h-3 rounded-full ${slide === 1 ? 'bg-blue-500' : 'bg-gray-300'}`}
                ></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
