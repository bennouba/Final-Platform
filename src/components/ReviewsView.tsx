import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Search,
  Filter,
  Edit,
  Trash2,
  Save,
  X,
  Star,
  Eye,
  EyeOff,
  Settings,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  AlertCircle,
  Info,
  MessageSquare,
  User,
  Package,
  ThumbsUp,
  ThumbsDown,
  MoreVertical,
  Send,
  Clock,
  Download,
  BarChart3,
  PieChart,
  TrendingUp,
  Award,
  Flag,
  Shield,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface ProductReview {
  id: string;
  productName: string;
  productCategory: string;
  customerName: string;
  customerEmail?: string;
  rating: number;
  comment: string;
  status: 'published' | 'pending' | 'rejected' | 'modified';
  createdAt: string;
  updatedAt: string;
  helpful: number;
  notHelpful: number;
  isVerified: boolean;
  images?: string[];
  response?: string;
  respondedAt?: string;
}

interface ReviewsViewProps {
  storeData: any;
  setStoreData: (data: any) => void;
  onSave: () => void;
}

const ReviewsView: React.FC<ReviewsViewProps> = ({ storeData, setStoreData, onSave }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState<ProductReview | null>(null);

  // Settings state
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    ownerNotification: true,
    autoPublish: true,
    allowCustomerEdit: true,
    emailTitleAr: 'كيف كانت تجربتك معنا؟',
    emailTitleEn: 'How was your experience?',
    emailContentAr: 'نحن نقدر رأيك ونريد معرفة كيف كانت تجربتك مع منتجاتنا...',
    emailContentEn: 'We value your opinion and want to know how your experience was with our products...',
    reminderDelay: 24,
  });

  // Sample reviews data
  const reviews: ProductReview[] = [
    {
      id: '1',
      productName: 'حقيبة بحر Vibes',
      productCategory: 'الإكسسوارات',
      customerName: 'عبدالله التاجوري',
      customerEmail: 'abdullah@example.com',
      rating: 5,
      comment: 'معاملة طيبة، مع منتجات في قمة الروعة',
      status: 'published',
      createdAt: '2024-07-13',
      updatedAt: '2024-09-20',
      helpful: 12,
      notHelpful: 2,
      isVerified: true,
    },
    {
      id: '2',
      productName: 'فستان طباعة الأزهار بكم واحد',
      productCategory: 'الملابس النسائية',
      customerName: 'فاطمة محمد الزهراني',
      customerEmail: 'fatima@example.com',
      rating: 4,
      comment: 'جودة عالية وسعر مناسب جداً',
      status: 'published',
      createdAt: '2024-08-25',
      updatedAt: '2024-08-25',
      helpful: 8,
      notHelpful: 1,
      isVerified: true,
    },
    {
      id: '3',
      productName: 'بوركيني Samara',
      productCategory: 'الملابس النسائية',
      customerName: 'أحمد علي الشريف',
      customerEmail: 'ahmed@example.com',
      rating: 5,
      comment: 'تجربة رائعة وخدمة ممتازة',
      status: 'pending',
      createdAt: '2024-09-02',
      updatedAt: '2024-09-02',
      helpful: 0,
      notHelpful: 0,
      isVerified: false,
    },
    {
      id: '4',
      productName: 'فستان مكشوف الكتف دانتيل',
      productCategory: 'الملابس النسائية',
      customerName: 'مريم أحمد',
      customerEmail: 'maryam@example.com',
      rating: 4,
      comment: 'منتج جميل لكن أتمنى لو كان السعر أقل قليلاً',
      status: 'modified',
      createdAt: '2024-09-01',
      updatedAt: '2024-09-03',
      helpful: 5,
      notHelpful: 0,
      isVerified: true,
      response: 'شكراً لك على تقييمك الإيجابي. نحن نقدر ملاحظات عملائنا وسنأخذ رأيك بعين الاعتبار.',
      respondedAt: '2024-09-03',
    },
  ];

  const filteredReviews = reviews.filter(review => {
    const matchesSearch =
      review.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || review.status === statusFilter;
    const matchesRating = ratingFilter === 'all' || review.rating.toString() === ratingFilter;

    return matchesSearch && matchesStatus && matchesRating;
  });

  const handleStatusChange = (reviewId: string, newStatus: ProductReview['status']) => {
    // In real app, this would update the backend

    onSave();
  };

  const handleResponse = (review: ProductReview) => {
    setSelectedReview(review);
    setShowResponseModal(true);
  };

  const handleSaveResponse = (response: string) => {
    if (!selectedReview) return;

    // In real app, this would save the response to backend

    setShowResponseModal(false);
    setSelectedReview(null);
    onSave();
  };

  const getStatusBadge = (status: ProductReview['status']) => {
    const statusConfig = {
      published: { label: 'منشور', color: 'bg-green-100 text-green-800' },
      pending: { label: 'في الانتظار', color: 'bg-yellow-100 text-yellow-800' },
      rejected: { label: 'مرفوض', color: 'bg-red-100 text-red-800' },
      modified: { label: 'معدّل', color: 'bg-blue-100 text-blue-800' },
    };

    const config = statusConfig[status];
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getRatingDistribution = () => {
    const distribution: { [key: number]: number } = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating as keyof typeof distribution] =
        (distribution[review.rating as keyof typeof distribution] || 0) + 1;
    });
    return distribution;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">التقييمات</h2>
          <p className="text-gray-600 mt-1">تتيح هذه الميزة لعملائك تقييم تجربتهم مع منتجاتك ومشاركتها</p>
        </div>
        <Button
          onClick={() => setShowSettingsModal(true)}
          variant="outline"
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
        >
          <Settings className="h-4 w-4 ml-2" />
          إعدادات التقييمات
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي التقييمات</p>
                <p className="text-3xl font-bold text-gray-900">{reviews.length}</p>
                <p className="text-sm text-gray-600">تقييم هذا الشهر</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">متوسط التقييم</p>
                <p className="text-3xl font-bold text-gray-900">
                  {(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)}
                </p>
                <p className="text-sm text-green-600">ممتاز</p>
              </div>
              <Award className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">في الانتظار</p>
                <p className="text-3xl font-bold text-gray-900">{reviews.filter(r => r.status === 'pending').length}</p>
                <p className="text-sm text-gray-600">تحتاج مراجعة</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">معتمدة</p>
                <p className="text-3xl font-bold text-gray-900">{reviews.filter(r => r.status === 'published').length}</p>
                <p className="text-sm text-gray-600">منشورة</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rating Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            توزيع التقييمات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => {
              const distribution = getRatingDistribution();
              const count = distribution[rating] || 0;
              const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;

              return (
                <div key={rating} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-12">
                    <span className="text-sm">{rating}</span>
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-yellow-400 h-3 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="w-8 text-sm text-gray-600">{count}</div>
                  <div className="w-12 text-sm text-gray-600">{percentage.toFixed(0)}%</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="البحث في التقييمات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="حالة التقييم" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="published">منشور</SelectItem>
                <SelectItem value="pending">في الانتظار</SelectItem>
                <SelectItem value="rejected">مرفوض</SelectItem>
                <SelectItem value="modified">معدّل</SelectItem>
              </SelectContent>
            </Select>
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="عدد النجوم" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع التقييمات</SelectItem>
                <SelectItem value="5">5 نجوم</SelectItem>
                <SelectItem value="4">4 نجوم</SelectItem>
                <SelectItem value="3">3 نجوم</SelectItem>
                <SelectItem value="2">2 نجوم</SelectItem>
                <SelectItem value="1">1 نجمة</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 ml-2" />
              تصدير
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة التقييمات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <div key={review.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{review.customerName}</h3>
                      <p className="text-sm text-gray-600">{review.productName}</p>
                      <p className="text-xs text-gray-500">{review.productCategory}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(review.status)}
                    {review.isVerified && (
                      <Badge className="bg-blue-100 text-blue-800">
                        <Shield className="h-3 w-3 ml-1" />
                        تم التحقق
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    {renderStars(review.rating)}
                  </div>
                  <span className="text-sm text-gray-600">
                    {review.rating} من 5 نجوم
                  </span>
                </div>

                <p className="text-gray-700 mb-3">{review.comment}</p>

                {review.response && (
                  <div className="bg-blue-50 border-r-4 border-blue-500 p-3 mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <MessageSquare className="h-4 w-4 text-blue-600" />
                      <span className="font-semibold text-blue-800">رد إشرو</span>
                      {review.respondedAt && (
                        <span className="text-xs text-gray-600">{review.respondedAt}</span>
                      )}
                    </div>
                    <p className="text-sm text-blue-700">{review.response}</p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>تاريخ الإنشاء: {review.createdAt}</span>
                    {review.updatedAt !== review.createdAt && (
                      <span>آخر تحديث: {review.updatedAt}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Button variant="outline" size="sm">
                        <ThumbsUp className="h-3 w-3 ml-1" />
                        {review.helpful}
                      </Button>
                      <Button variant="outline" size="sm">
                        <ThumbsDown className="h-3 w-3 ml-1" />
                        {review.notHelpful}
                      </Button>
                    </div>
                    <div className="flex gap-1">
                      {review.status === 'pending' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange(review.id, 'published')}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange(review.id, 'rejected')}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleResponse(review)}
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredReviews.length === 0 && (
            <div className="text-center py-8">
              <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">لا توجد تقييمات تطابق معايير البحث</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettingsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowSettingsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">إعدادات التقييمات</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettingsModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <Tabs defaultValue="notifications" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="notifications">إشعارات التقييمات</TabsTrigger>
                  <TabsTrigger value="email">إشعارات البريد الإلكتروني</TabsTrigger>
                  <TabsTrigger value="automation">الأتمتة</TabsTrigger>
                </TabsList>

                <TabsContent value="notifications" className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">تفعيل إشعارات البريد الإلكتروني</p>
                        <p className="text-sm text-gray-600">لتشجيع عملائك على تقييم المنتجات</p>
                      </div>
                      <Checkbox
                        checked={settings.emailNotifications}
                        onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked as boolean })}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">تفعيل إشعارات الرسائل النصية (SMS)</p>
                        <p className="text-sm text-gray-600">شجّع عملاءك عبر رسائل نصية مخصصة</p>
                      </div>
                      <Checkbox
                        checked={settings.smsNotifications}
                        onCheckedChange={(checked) => setSettings({ ...settings, smsNotifications: checked as boolean })}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">إرسال إشعار على بريدي عند وجود تقييم جديد</p>
                        <p className="text-sm text-gray-600">ليصلك إشعار فوري بأي تقييم جديد</p>
                      </div>
                      <Checkbox
                        checked={settings.ownerNotification}
                        onCheckedChange={(checked) => setSettings({ ...settings, ownerNotification: checked as boolean })}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="email" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label>عنوان رسالة البريد الإلكتروني بالعربية</Label>
                      <Input
                        value={settings.emailTitleAr}
                        onChange={(e) => setSettings({ ...settings, emailTitleAr: e.target.value })}
                        placeholder="كتابة عنوان لتشجيع التقييم"
                      />
                      <p className="text-sm text-gray-600 mt-1">عدد الأحرف: {settings.emailTitleAr.length} / 40</p>
                    </div>

                    <div>
                      <Label>عنوان رسالة البريد الإلكتروني بالإنجليزية</Label>
                      <Input
                        value={settings.emailTitleEn}
                        onChange={(e) => setSettings({ ...settings, emailTitleEn: e.target.value })}
                        placeholder="Write title to encourage review"
                      />
                      <p className="text-sm text-gray-600 mt-1">عدد الأحرف: {settings.emailTitleEn.length} / 40</p>
                    </div>

                    <div>
                      <Label>نص رسالة البريد الإلكتروني بالعربية</Label>
                      <Textarea
                        value={settings.emailContentAr}
                        onChange={(e) => setSettings({ ...settings, emailContentAr: e.target.value })}
                        placeholder="نص الرسالة..."
                        rows={4}
                      />
                      <p className="text-sm text-gray-600 mt-1">عدد الأحرف: {settings.emailContentAr.length} / 320</p>
                    </div>

                    <div>
                      <Label>نص رسالة البريد الإلكتروني بالإنجليزية</Label>
                      <Textarea
                        value={settings.emailContentEn}
                        onChange={(e) => setSettings({ ...settings, emailContentEn: e.target.value })}
                        placeholder="Email message text..."
                        rows={4}
                      />
                      <p className="text-sm text-gray-600 mt-1">عدد الأحرف: {settings.emailContentEn.length} / 320</p>
                    </div>
                  </div>

                  <div>
                    <Label>وقت إرسال البريد الإلكتروني</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={settings.reminderDelay}
                        onChange={(e) => setSettings({ ...settings, reminderDelay: Number(e.target.value) })}
                        className="w-24"
                      />
                      <span className="text-sm text-gray-600">ساعة</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      يتم إرسال طلب التقييم عبر البريد الإلكتروني بعد {settings.reminderDelay} ساعات من إكمال العميل الطلب
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="automation" className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">الموافقة والنشر التلقائي لمراجعات العملاء</p>
                        <p className="text-sm text-gray-600">نشر التقييمات تلقائياً بدون مراجعة</p>
                      </div>
                      <Checkbox
                        checked={settings.autoPublish}
                        onCheckedChange={(checked) => setSettings({ ...settings, autoPublish: checked as boolean })}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">تفعيل إمكانية تعديل التقييم بواسطة العميل</p>
                        <p className="text-sm text-gray-600">السماح للعملاء بتعديل تقييماتهم</p>
                      </div>
                      <Checkbox
                        checked={settings.allowCustomerEdit}
                        onCheckedChange={(checked) => setSettings({ ...settings, allowCustomerEdit: checked as boolean })}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end mt-6">
                <Button
                  onClick={() => setShowSettingsModal(false)}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  <Save className="h-4 w-4 ml-2" />
                  حفظ الإعدادات
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Response Modal */}
      <AnimatePresence>
        {showResponseModal && selectedReview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowResponseModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">الرد على التقييم</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowResponseModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">تقييم العميل</h4>
                  <p className="text-sm text-gray-600">{selectedReview.customerName}</p>
                  <p className="text-sm text-gray-600">{selectedReview.productName}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {renderStars(selectedReview.rating)}
                  </div>
                  <p className="text-sm mt-2">{selectedReview.comment}</p>
                </div>

                <div>
                  <Label>ردك على التقييم</Label>
                  <Textarea
                    placeholder="اكتب ردك على تقييم العميل..."
                    rows={4}
                    defaultValue={selectedReview.response}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  onClick={() => handleSaveResponse('رد مخصص')}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  <Send className="h-4 w-4 ml-2" />
                  إرسال الرد
                </Button>
                <Button variant="outline" onClick={() => setShowResponseModal(false)}>
                  إلغاء
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { ReviewsView };
