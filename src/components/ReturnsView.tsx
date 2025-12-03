import React, { useCallback, useEffect, useState } from 'react';
import {
  AlertTriangle,
  Calendar,
  Camera,
  CheckCircle,
  Clock,
  CreditCard,
  FileText,
  MapPin,
  MessageSquare,
  Package,
  RefreshCw,
  Star,
  Truck,
  Upload,
  XCircle
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

interface ReturnRequest {
  id: string;
  orderId: string;
  customerId: string;
  customerName: string;
  items: ReturnItem[];
  reason: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected' | 'processing' | 'completed' | 'cancelled';
  refundMethod: 'original_payment' | 'store_credit' | 'bank_transfer';
  refundAmount: number;
  createdAt: Date;
  updatedAt: Date;
  approvedAt?: Date;
  completedAt?: Date;
  trackingNumber?: string;
  images: string[];
  notes: ReturnNote[];
}

interface ReturnItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  reason: string;
  condition: 'new' | 'opened' | 'used' | 'damaged';
}

interface ReturnNote {
  id: string;
  author: string;
  authorType: 'customer' | 'agent' | 'system';
  message: string;
  timestamp: Date;
  isInternal: boolean;
}

interface ReturnsViewProps {
  customerId?: string;
  onCreateReturn?: (returnRequest: Omit<ReturnRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateReturn?: (returnId: string, updates: Partial<ReturnRequest>) => void;
  className?: string;
}

class ReturnsService {
  private static returns: Map<string, ReturnRequest> = new Map();

  static initializeMockData() {
    if (this.returns.size === 0) {
      // Mock return requests
      const mockReturns: ReturnRequest[] = [
        {
          id: 'return_001',
          orderId: 'order_12345',
          customerId: 'customer_001',
          customerName: 'أحد حد',
          items: [
            {
              id: 'item_001',
              productId: 'prod_001',
              productName: 'اتف ذ ساسج',
              quantity: 1,
              unitPrice: 1500,
              reason: 'damaged',
              condition: 'damaged'
            }
          ],
          reason: 'product_damaged',
          description: 'اجاز حت ع خدش ا ع بش صحح',
          status: 'completed',
          refundMethod: 'original_payment',
          refundAmount: 1500,
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          approvedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
          completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          trackingNumber: 'RTN00123456',
          images: ['/return-image1.jpg', '/return-image2.jpg'],
          notes: [
            {
              id: 'note_001',
              author: 'أحد حد',
              authorType: 'customer',
              message: 'اتج ص تافا ا ع',
              timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
              isInternal: false
            },
            {
              id: 'note_002',
              author: 'فاطة ع',
              authorType: 'agent',
              message: 'ت فحص اتج تأد اتف. تت اافة ع اإرجاع.',
              timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
              isInternal: false
            },
            {
              id: 'note_003',
              author: 'ظا اإرجاع',
              authorType: 'system',
              message: 'ت إصدار ابغ استرد بة 1500 د.',
              timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
              isInternal: true
            }
          ]
        },
        {
          id: 'return_002',
          orderId: 'order_12346',
          customerId: 'customer_001',
          customerName: 'أحد حد',
          items: [
            {
              id: 'item_002',
              productId: 'prod_002',
              productName: 'حبة ظر',
              quantity: 1,
              unitPrice: 200,
              reason: 'wrong_size',
              condition: 'new'
            }
          ],
          reason: 'wrong_size',
          description: 'احج اطب ا برا جدا',
          status: 'processing',
          refundMethod: 'store_credit',
          refundAmount: 200,
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
          updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
          approvedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          images: [],
          notes: [
            {
              id: 'note_004',
              author: 'أحد حد',
              authorType: 'customer',
              message: 'احج بر جدا أحتاج حج أصغر',
              timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
              isInternal: false
            }
          ]
        }
      ];

      mockReturns.forEach(returnRequest => {
        this.returns.set(returnRequest.id, returnRequest);
      });
    }
  }

  static getReturnsByCustomer(customerId: string): ReturnRequest[] {
    this.initializeMockData();
    return Array.from(this.returns.values()).filter(r => r.customerId === customerId);
  }

  static getReturnById(returnId: string): ReturnRequest | undefined {
    this.initializeMockData();
    return this.returns.get(returnId);
  }

  static createReturn(returnData: Omit<ReturnRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>): string {
    const returnId = `return_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newReturn: ReturnRequest = {
      ...returnData,
      id: returnId,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.returns.set(returnId, newReturn);
    return returnId;
  }

  static updateReturn(returnId: string, updates: Partial<ReturnRequest>): boolean {
    const returnRequest = this.returns.get(returnId);
    if (!returnRequest) return false;

    this.returns.set(returnId, {
      ...returnRequest,
      ...updates,
      updatedAt: new Date()
    });

    return true;
  }

  static addNote(returnId: string, note: Omit<ReturnNote, 'id' | 'timestamp'>): boolean {
    const returnRequest = this.returns.get(returnId);
    if (!returnRequest) return false;

    const newNote: ReturnNote = {
      ...note,
      id: `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    };

    returnRequest.notes.push(newNote);
    returnRequest.updatedAt = new Date();
    this.returns.set(returnId, returnRequest);

    return true;
  }
}

const ReturnsView: React.FC<ReturnsViewProps> = ({
  customerId = 'customer_001',
  onCreateReturn,
  onUpdateReturn,
  className = ""
}) => {
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [selectedReturn, setSelectedReturn] = useState<ReturnRequest | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Create return form state
  const [returnForm, setReturnForm] = useState({
    orderId: '',
    items: [] as ReturnItem[],
    reason: '',
    description: '',
    refundMethod: 'original_payment' as ReturnRequest['refundMethod'],
    images: [] as string[]
  });

  const loadReturns = useCallback(() => {
    const customerReturns = ReturnsService.getReturnsByCustomer(customerId);
    setReturns(customerReturns);
  }, [customerId]);

  useEffect(() => {
    loadReturns();
  }, [loadReturns]);

  const handleCreateReturn = async () => {
    if (!returnForm.orderId || returnForm.items.length === 0) return;

    setIsLoading(true);
    try {
      const returnData = {
        orderId: returnForm.orderId,
        customerId,
        customerName: 'اع', // In real app, get from user data
        items: returnForm.items,
        reason: returnForm.reason,
        description: returnForm.description,
        refundMethod: returnForm.refundMethod,
        refundAmount: returnForm.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0),
        images: returnForm.images,
        notes: []
      };

      const returnId = ReturnsService.createReturn(returnData);
      onCreateReturn?.(returnData);

      // Reset form
      setReturnForm({
        orderId: '',
        items: [],
        reason: '',
        description: '',
        refundMethod: 'original_payment',
        images: []
      });

      setShowCreateDialog(false);
      loadReturns();
    } catch (error) {

    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: ReturnRequest['status']) => {
    const statusConfig = {
      pending: { label: 'د اراجعة', color: 'bg-yellow-100 text-yellow-800' },
      approved: { label: 'تت اافة', color: 'bg-blue-100 text-blue-800' },
      rejected: { label: 'رفض', color: 'bg-red-100 text-red-800' },
      processing: { label: 'د اعاجة', color: 'bg-orange-100 text-orange-800' },
      completed: { label: 'ت', color: 'bg-green-100 text-green-800' },
      cancelled: { label: 'غ', color: 'bg-gray-100 text-gray-800' }
    };

    const config = statusConfig[status];
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getStatusIcon = (status: ReturnRequest['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-blue-600" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'processing':
        return <RefreshCw className="h-5 w-5 text-orange-600" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-gray-600" />;
      default:
        return <Package className="h-5 w-5 text-gray-600" />;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">طبات اإرجاع ااستبدا</h2>
          <p className="text-gray-600 mt-1">إدارة طبات اإرجاع ااستبدا اخاصة ب</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <Button type="button" className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowCreateDialog(true)}>
            <Package className="h-4 w-4 ml-2" />
            طب إرجاع جدد
          </Button>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>إشاء طب إرجاع جدد</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="orderId">ر اطب</Label>
                <Input
                  id="orderId"
                  value={returnForm.orderId}
                  onChange={(e) => setReturnForm({ ...returnForm, orderId: e.target.value })}
                  placeholder="أدخ ر اطب"
                />
              </div>

              <div>
                <Label htmlFor="reason">سبب اإرجاع</Label>
                <Select value={returnForm.reason} onValueChange={(value) => setReturnForm({ ...returnForm, reason: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر اسبب" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="product_damaged">اتج تاف</SelectItem>
                    <SelectItem value="wrong_item">ت إرسا تج خاطئ</SelectItem>
                    <SelectItem value="wrong_size">احج غر اسب</SelectItem>
                    <SelectItem value="not_as_described">غر طاب صف</SelectItem>
                    <SelectItem value="changed_mind">غرت رأ</SelectItem>
                    <SelectItem value="other">سبب آخر</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">صف اشة</Label>
                <Textarea
                  id="description"
                  value={returnForm.description}
                  onChange={(e) => setReturnForm({ ...returnForm, description: e.target.value })}
                  placeholder="صف تفص شة..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="refundMethod">طرة استرداد ابغ</Label>
                <Select value={returnForm.refundMethod} onValueChange={(value) => setReturnForm({ ...returnForm, refundMethod: value as ReturnRequest['refundMethod'] })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="original_payment">اطرة اأصة دفع</SelectItem>
                    <SelectItem value="store_credit">رصد ف اتجر</SelectItem>
                    <SelectItem value="bank_transfer">تح ب</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  إغاء
                </Button>
                <Button type="button" onClick={handleCreateReturn}
                  disabled={isLoading || !returnForm.orderId}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? <RefreshCw className="h-4 w-4 animate-spin ml-2" /> : <Package className="h-4 w-4 ml-2" />}
                  إرسا اطب
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Returns List */}
      <div className="grid gap-4">
        {returns.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">ا تجد طبات إرجاع</h3>
              <p className="text-gray-600"> ت بإشاء أ طبات إرجاع حت اآ</p>
            </CardContent>
          </Card>
        ) : (
          returns.map((returnRequest) => (
            <Card key={returnRequest.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(returnRequest.status)}
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        طب إرجاع #{returnRequest.id.split('_')[1]}
                      </h3>
                      <p className="text-sm text-gray-600">
                        اطب اأص: {returnRequest.orderId}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(returnRequest.status)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">تارخ اإشاء</p>
                    <p className="font-medium">{formatDate(returnRequest.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">ة ااسترداد</p>
                    <p className="font-medium text-green-600">{returnRequest.refundAmount} د.</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">طرة ااسترداد</p>
                    <p className="font-medium">
                      {returnRequest.refundMethod === 'original_payment' ? 'ادفع اأص' :
                       returnRequest.refundMethod === 'store_credit' ? 'رصد اتجر' : 'تح ب'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    {returnRequest.items.length} تج  {returnRequest.notes.length} احظة
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedReturn(returnRequest)}
                  >
                    عرض اتفاص
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Return Details Modal */}
      {selectedReturn && (
        <Dialog open={!!selectedReturn} onOpenChange={() => setSelectedReturn(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                تفاص طب اإرجاع #{selectedReturn.id.split('_')[1]}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Status and Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>حاة اطب</Label>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusIcon(selectedReturn.status)}
                    {getStatusBadge(selectedReturn.status)}
                  </div>
                </div>
                <div>
                  <Label>تارخ اإشاء</Label>
                  <p className="mt-1">{formatDate(selectedReturn.createdAt)}</p>
                </div>
                <div>
                  <Label>اطب اأص</Label>
                  <p className="mt-1 font-medium">{selectedReturn.orderId}</p>
                </div>
                <div>
                  <Label>ة ااسترداد</Label>
                  <p className="mt-1 font-medium text-green-600">{selectedReturn.refundAmount} د.</p>
                </div>
              </div>

              {/* Items */}
              <div>
                <Label className="text-base font-semibold">اتجات ارجعة</Label>
                <div className="mt-2 space-y-2">
                  {selectedReturn.items.map((item) => (
                    <div key={item.id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{item.productName}</h4>
                          <p className="text-sm text-gray-600">
                            اة: {item.quantity}  اسعر: {item.unitPrice} د.
                          </p>
                          <p className="text-sm text-gray-600">
                            احاة: {item.condition === 'new' ? 'جدد' :
                                   item.condition === 'opened' ? 'فتح' :
                                   item.condition === 'used' ? 'ستع' : 'تاف'}
                          </p>
                        </div>
                        <Badge variant="outline">{item.reason}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <Label>صف اشة</Label>
                <p className="mt-1 p-3 bg-gray-50 rounded-lg">{selectedReturn.description}</p>
              </div>

              {/* Images */}
              {selectedReturn.images.length > 0 && (
                <div>
                  <Label>اصر ارفة</Label>
                  <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
                    {selectedReturn.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Return image ${index + 1}`}
                        className="w-full h-20 object-cover rounded-lg cursor-pointer hover:opacity-80"
                        onClick={() => window.open(image, '_blank')}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Tracking */}
              {selectedReturn.trackingNumber && (
                <div>
                  <Label>ر اتتبع</Label>
                  <div className="mt-1 flex items-center gap-2">
                    <Truck className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">{selectedReturn.trackingNumber}</span>
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <Label className="text-base font-semibold">ااحظات اتحدثات</Label>
                <ScrollArea className="mt-2 h-32 border rounded-lg p-3">
                  <div className="space-y-3">
                    {selectedReturn.notes.map((note) => (
                      <div key={note.id} className="flex gap-3">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="text-xs">
                            {note.author.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{note.author}</span>
                            <Badge variant="outline" className="text-xs">
                              {note.authorType === 'customer' ? 'ع' :
                               note.authorType === 'agent' ? 'ظف' : 'ظا'}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {note.timestamp.toLocaleDateString('ar-SA')}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 mt-1">{note.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ReturnsView;
