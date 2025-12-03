
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Search,
  Filter,
  Edit,
  Trash2,
  Save,
  X,
  MessageSquare,
  Eye,
  EyeOff,
  Settings,
  User,
  Package,
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  HelpCircle,
  ThumbsUp,
  ThumbsDown,
  MoreVertical,
  Download,
  ToggleLeft,
  ToggleRight,
  Lightbulb,
  Shield,
  Flag,
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

interface ProductQuestion {
  id: string;
  productName: string;
  productCategory: string;
  customerName: string;
  customerEmail?: string;
  question: string;
  answer?: string;
  status: 'answered' | 'pending' | 'hidden';
  isPublic: boolean;
  helpful: number;
  notHelpful: number;
  createdAt: string;
  answeredAt?: string;
  answeredBy?: string;
  priority: 'low' | 'medium' | 'high';
}

interface QuestionsViewProps {
  storeData: any;
  setStoreData: (data: any) => void;
  onSave: () => void;
}

const QuestionsView: React.FC<QuestionsViewProps> = ({ storeData, setStoreData, onSave }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<ProductQuestion | null>(null);
  const [isFeatureEnabled, setIsFeatureEnabled] = useState(true);

  // Form state
  const [answerForm, setAnswerForm] = useState({
    answer: '',
    isPublic: true,
    priority: 'medium' as ProductQuestion['priority'],
  });

  // Sample questions data
  const questions: ProductQuestion[] = [
    {
      id: '1',
      productName: 'عطر Hugo Intense 100ml',
      productCategory: 'العطور',
      customerName: 'سارة أحمد',
      customerEmail: 'sara@example.com',
      question: 'هل هذا العطر أصلي؟',
      answer: 'نعم، جميع منتجاتنا أصلية ومضمونة من الشركة المصنعة ونقدم ضمان على الأصالة.',
      status: 'answered',
      isPublic: true,
      helpful: 5,
      notHelpful: 1,
      createdAt: '2024-01-19',
      answeredAt: '2024-01-19',
      answeredBy: 'فريق إشرو',
      priority: 'high',
    },
    {
      id: '2',
      productName: 'حقيبة يد جلدية',
      productCategory: 'الإكسسوارات',
      customerName: 'محمد سالم',
      customerEmail: 'mohamed@example.com',
      question: 'ما هي أبعاد الحقيبة؟',
      status: 'pending',
      isPublic: true,
      helpful: 0,
      notHelpful: 0,
      createdAt: '2024-01-20',
      priority: 'medium',
    },
    {
      id: '3',
      productName: 'فستان سهرة أنيق',
      productCategory: 'الملابس النسائية',
      customerName: 'فاطمة علي',
      customerEmail: 'fatima@example.com',
      question: 'هل متوفر منه ألوان أخرى؟',
      answer: 'نعم، الفستان متوفر باللون الأسود والأحمر والأزرق. يمكنك اختيار اللون المفضل لديك.',
      status: 'answered',
      isPublic: true,
      helpful: 8,
      notHelpful: 0,
      createdAt: '2024-01-18',
      answeredAt: '2024-01-18',
      answeredBy: 'فريق إشرو',
      priority: 'medium',
    },
  ];

  const filteredQuestions = questions.filter(question => {
    const matchesSearch =
      question.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.question.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || question.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleAnswerQuestion = (question: ProductQuestion) => {
    setSelectedQuestion(question);
    setAnswerForm({
      answer: question.answer || '',
      isPublic: question.isPublic,
      priority: question.priority,
    });
    setShowAnswerModal(true);
  };

  const handleSaveAnswer = () => {
    if (!selectedQuestion) return;

    // In real app, this would save the answer to backend

    setShowAnswerModal(false);
    setSelectedQuestion(null);
    onSave();
  };

  const handleStatusChange = (questionId: string, newStatus: ProductQuestion['status']) => {
    // In real app, this would update the question status

    onSave();
  };

  const getStatusBadge = (status: ProductQuestion['status']) => {
    const statusConfig = {
      answered: { label: 'تم الرد', color: 'bg-green-100 text-green-800' },
      pending: { label: 'في الانتظار', color: 'bg-yellow-100 text-yellow-800' },
      hidden: { label: 'مخفي', color: 'bg-gray-100 text-gray-800' },
    };

    const config = statusConfig[status];
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getPriorityBadge = (priority: ProductQuestion['priority']) => {
    const priorityConfig = {
      high: { label: 'عالية', color: 'bg-red-100 text-red-800' },
      medium: { label: 'متوسطة', color: 'bg-yellow-100 text-yellow-800' },
      low: { label: 'منخفضة', color: 'bg-green-100 text-green-800' },
    };

    const config = priorityConfig[priority];
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">الأسئلة</h2>
          <p className="text-gray-600 mt-1">جهز قسماً للأسئلة والأجوبة لكل منتج تعرضه</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">تفعيل الميزة</span>
            <Button
              variant={isFeatureEnabled ? "default" : "outline"}
              size="sm"
              onClick={() => setIsFeatureEnabled(!isFeatureEnabled)}
            >
              {isFeatureEnabled ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Feature Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <HelpCircle className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 mb-2">ميزة الأسئلة والأجوبة</h3>
              <div className="space-y-2 text-sm text-blue-800">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>دع عملاءك يطرحون أسئلة متعلقة بالمنتج</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>ستصلك إشعارات بالأسئلة الجديدة</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>يمكنك الرد عليها من لوحة تحكم التاجر</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>تحسين تجربة العميل وزيادة الثقة في المنتجات</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>ملاحظة:</strong> بعد تفعيل هذه الميزة، سيظهر قسم "الأسئلة والأجوبة" في جميع صفحات المنتجات بمتجرك
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي الأسئلة</p>
                <p className="text-3xl font-bold text-gray-900">{questions.length}</p>
                <p className="text-sm text-gray-600">سؤال هذا الشهر</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">تم الرد عليها</p>
                <p className="text-3xl font-bold text-green-600">{questions.filter(q => q.status === 'answered').length}</p>
                <p className="text-sm text-gray-600">معدل الاستجابة السريع</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">في الانتظار</p>
                <p className="text-3xl font-bold text-orange-600">{questions.filter(q => q.status === 'pending').length}</p>
                <p className="text-sm text-gray-600">تحتاج للرد</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">الأولوية العالية</p>
                <p className="text-3xl font-bold text-red-600">{questions.filter(q => q.priority === 'high').length}</p>
                <p className="text-sm text-gray-600">تتطلب رد فوري</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="البحث في الأسئلة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="حالة السؤال" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="answered">تم الرد</SelectItem>
                <SelectItem value="pending">في الانتظار</SelectItem>
                <SelectItem value="hidden">مخفي</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 ml-2" />
              تصدير
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Questions List */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة الأسئلة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredQuestions.map((question) => (
              <div key={question.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{question.customerName}</h3>
                      <p className="text-sm text-gray-600">{question.productName}</p>
                      <p className="text-xs text-gray-500">{question.productCategory}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(question.status)}
                    {getPriorityBadge(question.priority)}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <p className="font-medium text-gray-900 mb-1">السؤال:</p>
                  <p className="text-gray-700">{question.question}</p>
                </div>

                {question.answer && (
                  <div className="bg-green-50 border-r-4 border-green-500 p-3 mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <MessageSquare className="h-4 w-4 text-green-600" />
                      <span className="font-semibold text-green-800">الرد</span>
                      {question.answeredAt && (
                        <span className="text-xs text-gray-600">{question.answeredAt}</span>
                      )}
                    </div>
                    <p className="text-sm text-green-700">{question.answer}</p>
                    {question.answeredBy && (
                      <p className="text-xs text-green-600 mt-1">بواسطة: {question.answeredBy}</p>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>تاريخ السؤال: {question.createdAt}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Button variant="outline" size="sm">
                        <ThumbsUp className="h-3 w-3 ml-1" />
                        {question.helpful}
                      </Button>
                      <Button variant="outline" size="sm">
                        <ThumbsDown className="h-3 w-3 ml-1" />
                        {question.notHelpful}
                      </Button>
                    </div>
                    <div className="flex gap-1">
                      {question.status === 'pending' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAnswerQuestion(question)}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusChange(question.id, 'hidden')}
                        className="text-red-600 hover:text-red-700"
                      >
                        <EyeOff className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredQuestions.length === 0 && (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">لا توجد أسئلة تطابق معايير البحث</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Answer Modal */}
      <AnimatePresence>
        {showAnswerModal && selectedQuestion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowAnswerModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">الرد على السؤال</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAnswerModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">سؤال العميل</h4>
                  <p className="text-sm text-gray-600">{selectedQuestion.customerName}</p>
                  <p className="text-sm text-gray-600">{selectedQuestion.productName}</p>
                  <p className="text-sm mt-2 font-medium">{selectedQuestion.question}</p>
                </div>

                <div>
                  <Label>ردك على السؤال</Label>
                  <Textarea
                    value={answerForm.answer}
                    onChange={(e) => setAnswerForm({ ...answerForm, answer: e.target.value })}
                    placeholder="اكتب ردك على سؤال العميل..."
                    rows={4}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isPublic"
                    checked={answerForm.isPublic}
                    onCheckedChange={(checked) => setAnswerForm({ ...answerForm, isPublic: checked as boolean })}
                  />
                  <Label htmlFor="isPublic">إجابة عامة مرئية للجميع</Label>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  onClick={handleSaveAnswer}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  <Send className="h-4 w-4 ml-2" />
                  إرسال الرد
                </Button>
                <Button variant="outline" onClick={() => setShowAnswerModal(false)}>
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

export { QuestionsView };
