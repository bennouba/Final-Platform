import React, { useState } from 'react';
import {
  AlertCircle,
  Camera,
  CheckCircle,
  Send,
  Star,
  ThumbsDown,
  ThumbsUp,
  Upload,
  X
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

interface ProductReview {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  orderId: string;
  customerId: string;
  customerName: string;
  rating: number;
  title: string;
  comment: string;
  pros: string[];
  cons: string[];
  images: string[];
  verified: boolean;
  helpful: number;
  notHelpful: number;
  createdAt: Date;
  updatedAt: Date;
  response?: {
    author: string;
    message: string;
    timestamp: Date;
  };
}

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    image: string;
    orderId: string;
  };
  existingReview?: ProductReview;
  onSubmit: (review: Omit<ProductReview, 'id' | 'createdAt' | 'updatedAt' | 'helpful' | 'notHelpful'>) => void;
  onUpdate?: (reviewId: string, updates: Partial<ProductReview>) => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  product,
  existingReview,
  onSubmit,
  onUpdate
}) => {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState(existingReview?.title || '');
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [pros, setPros] = useState<string[]>(existingReview?.pros || []);
  const [cons, setCons] = useState<string[]>(existingReview?.cons || []);
  const [currentPro, setCurrentPro] = useState('');
  const [currentCon, setCurrentCon] = useState('');
  const [images, setImages] = useState<string[]>(existingReview?.images || []);
  const [anonymous, setAnonymous] = useState(false);
  const [recommend, setRecommend] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0 || !comment.trim()) return;

    setIsSubmitting(true);

    try {
      const reviewData = {
        productId: product.id,
        productName: product.name,
        productImage: product.image,
        orderId: product.orderId,
        customerId: 'current_user', // In real app, get from auth
        customerName: anonymous ? 'ع ج' : 'اس اع', // In real app, get from user data
        rating,
        title: title.trim(),
        comment: comment.trim(),
        pros: pros.filter(p => p.trim()),
        cons: cons.filter(c => c.trim()),
        images,
        verified: true, // Since it's post-purchase
        ...(existingReview?.response ? { response: existingReview.response } : {})
      };

      if (existingReview) {
        onUpdate?.(existingReview.id, reviewData);
      } else {
        onSubmit(reviewData);
      }

      setSubmitSuccess(true);
      setTimeout(() => {
        onClose();
        resetForm();
      }, 2000);

    } catch (error) {

    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setRating(0);
    setHoverRating(0);
    setTitle('');
    setComment('');
    setPros([]);
    setCons([]);
    setCurrentPro('');
    setCurrentCon('');
    setImages([]);
    setAnonymous(false);
    setRecommend(null);
    setSubmitSuccess(false);
  };

  const addPro = () => {
    if (currentPro.trim() && !pros.includes(currentPro.trim())) {
      setPros([...pros, currentPro.trim()]);
      setCurrentPro('');
    }
  };

  const addCon = () => {
    if (currentCon.trim() && !cons.includes(currentCon.trim())) {
      setCons([...cons, currentCon.trim()]);
      setCurrentCon('');
    }
  };

  const removePro = (index: number) => {
    setPros(pros.filter((_, i) => i !== index));
  };

  const removeCon = (index: number) => {
    setCons(cons.filter((_, i) => i !== index));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target?.result && images.length < 5) {
              setImages([...images, e.target.result as string]);
            }
          };
          reader.readAsDataURL(file);
        }
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 1: return 'سء جدا';
      case 2: return 'سء';
      case 3: return 'ب';
      case 4: return 'جد';
      case 5: return 'تاز';
      default: return '';
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600';
    if (rating >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (submitSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              شرا !
            </h3>
            <p className="text-gray-600">
              ت {existingReview ? 'تحدث' : 'إرسا'} ت بجاح. سساعد ذ اعاء اآخر ف اتخاذ رارات.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            {existingReview ? 'تحدث ات' : 'تابة ت'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-600">اطب: {product.orderId}</p>
                  <Badge variant="outline" className="text-xs">
                    شراء ث
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rating */}
          <div>
            <Label className="text-base font-semibold">ات اعا</Label>
            <div className="mt-2">
              <div className="flex items-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Button
                    key={star}
                    type="button"
                    variant="ghost"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-0 h-auto w-auto focus:outline-none"
                    aria-label={`ت ${star} ج`}
                    title={`ت ${star} ج`}
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= (hoverRating || rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      } transition-colors`}
                    />
                  </Button>
                ))}
                {(rating > 0 || hoverRating > 0) && (
                  <span className={`ml-2 font-medium ${getRatingColor(hoverRating || rating)}`}>
                    {getRatingText(hoverRating || rating)}
                  </span>
                )}
              </div>
              {rating === 0 && (
                <p className="text-sm text-gray-500">ار ع اج إعطاء ت</p>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <Label htmlFor="title">عا ات (اختار)</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ثا: تج رائع جدة عاة"
              maxLength={100}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">{title.length}/100</p>
          </div>

          {/* Comment */}
          <div>
            <Label htmlFor="comment">تع ع اتج</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="شارا تجربت ع ذا اتج..."
              rows={4}
              maxLength={1000}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">{comment.length}/1000</p>
          </div>

          {/* Pros and Cons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pros */}
            <div>
              <Label className="text-sm font-semibold text-green-700">ااط اإجابة</Label>
              <div className="mt-2 space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={currentPro}
                    onChange={(e) => setCurrentPro(e.target.value)}
                    placeholder="أضف طة إجابة..."
                    onKeyPress={(e) => e.key === 'Enter' && addPro()}
                  />
                  <Button
                    size="sm"
                    onClick={addPro}
                    disabled={!currentPro.trim()}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <ThumbsUp className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-1">
                  {pros.map((pro, index) => (
                    <div key={index} className="flex items-center justify-between bg-green-50 p-2 rounded">
                      <span className="text-sm text-green-800"> {pro}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removePro(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Cons */}
            <div>
              <Label className="text-sm font-semibold text-red-700">ااط اسبة</Label>
              <div className="mt-2 space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={currentCon}
                    onChange={(e) => setCurrentCon(e.target.value)}
                    placeholder="أضف طة سبة..."
                    onKeyPress={(e) => e.key === 'Enter' && addCon()}
                  />
                  <Button
                    size="sm"
                    onClick={addCon}
                    disabled={!currentCon.trim()}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <ThumbsDown className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-1">
                  {cons.map((con, index) => (
                    <div key={index} className="flex items-center justify-between bg-red-50 p-2 rounded">
                      <span className="text-sm text-red-800"> {con}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeCon(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recommendation */}
          <div>
            <Label className="text-base font-semibold"> تص بذا اتج</Label>
            <div className="mt-2 flex gap-4">
              <Button
                variant={recommend === true ? "default" : "outline"}
                onClick={() => setRecommend(true)}
                className={recommend === true ? "bg-green-600 hover:bg-green-700" : ""}
              >
                <ThumbsUp className="h-4 w-4 ml-2" />
                ع أص ب
              </Button>
              <Button
                variant={recommend === false ? "default" : "outline"}
                onClick={() => setRecommend(false)}
                className={recommend === false ? "bg-red-600 hover:bg-red-700" : ""}
              >
                <ThumbsDown className="h-4 w-4 ml-2" />
                ا ا أص ب
              </Button>
            </div>
          </div>

          {/* Images */}
          <div>
            <Label className="text-base font-semibold">صر إضافة (اختار)</Label>
            <div className="mt-2">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Review image ${index + 1}`}
                      className="w-full h-20 object-cover rounded-lg"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute -top-2 -right-2 rounded-full w-6 h-6 p-0 text-red-600 hover:text-red-700"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                {images.length < 5 && (
                  <label className="border-2 border-dashed border-gray-300 rounded-lg h-20 flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <div className="text-center">
                      <Camera className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                      <p className="text-xs text-gray-500">أضف صرة</p>
                    </div>
                  </label>
                )}
              </div>
              <p className="text-xs text-gray-500">
                 إضافة حت 5 صر  {images.length}/5
              </p>
            </div>
          </div>

          {/* Options */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="anonymous"
              checked={anonymous}
              onCheckedChange={(checked) => setAnonymous(!!checked)}
            />
            <Label htmlFor="anonymous" className="text-sm">
              شر ات بش ج
            </Label>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              إغاء
            </Button>
            <Button type="button" onClick={handleSubmit}
              disabled={isSubmitting || rating === 0 || !comment.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                  جار اإرسا...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 ml-2" />
                  {existingReview ? 'تحدث ات' : 'إرسا ات'}
                </>
              )}
            </Button>
          </div>

          {/* Validation Messages */}
          {(rating === 0 || !comment.trim()) && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-yellow-800">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">
                  {rating === 0 && !comment.trim()
                    ? 'رج إعطاء ت باج تابة تع'
                    : rating === 0
                    ? 'رج إعطاء ت باج'
                    : 'رج تابة تع ع اتج'
                  }
                </span>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewModal;
