import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Star,
  Gift,
  Users,
  Settings,
  TrendingUp,
  Coins,
  Clock,
  ToggleLeft,
  ToggleRight,
  Award,
  Zap,
  Target,
  DollarSign,
  Calendar,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Rocket,
  Crown,
  Gem,
  Heart,
  ShoppingCart,
  CreditCard,
  Timer,
  Percent,
  Calculator,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Progress } from './ui/progress';

interface LoyaltyReward {
  id: string;
  name: string;
  type: 'fixed' | 'percentage' | 'free_shipping' | 'gift';
  value: number;
  pointsRequired: number;
  isActive: boolean;
  usageLimit?: number;
  usedCount: number;
  description: string;
  createdAt: string;
}

interface LoyaltyProgramViewProps {
  storeData: any;
  setStoreData: (data: any) => void;
  onSave: () => void;
}

const LoyaltyProgramView: React.FC<LoyaltyProgramViewProps> = ({ storeData, setStoreData, onSave }) => {
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [editingReward, setEditingReward] = useState<LoyaltyReward | null>(null);
  const [isProgramEnabled, setIsProgramEnabled] = useState(true);

  // Program settings
  const [programSettings, setProgramSettings] = useState({
    isEnabled: true,
    title: 'برنامج مكافآت إشرو',
    description: 'اكسب نقاط ولاء مع كل عملية شراء من متجرك',
    pointsPerCurrency: 1,
    currencyPerPoint: 1,
    pointsExpiryDays: 365,
    minOrderAmount: 0,
    maxPointsPerOrder: 0,
  });

  // Reward form state
  const [rewardForm, setRewardForm] = useState({
    name: '',
    type: 'fixed' as LoyaltyReward['type'],
    value: 0,
    pointsRequired: 0,
    usageLimit: 0,
    description: '',
    isActive: true,
  });

  // Initialize rewards from storeData or use default
  const [rewards, setRewards] = useState<LoyaltyReward[]>(() => {
    if (storeData?.loyaltyRewards && Array.isArray(storeData.loyaltyRewards)) {
      return storeData.loyaltyRewards;
    }
    return [
      {
        id: '1',
        name: 'خصم ثابت',
        type: 'fixed',
        value: 50,
        pointsRequired: 1000,
        isActive: true,
        usedCount: 25,
        description: 'خصم بقيمة 50 دينار ليبي',
        createdAt: '2024-06-27',
      },
      {
        id: '2',
        name: 'خصم نسبي',
        type: 'percentage',
        value: 15,
        pointsRequired: 500,
        isActive: true,
        usedCount: 12,
        description: 'خصم 15% على الطلب',
        createdAt: '2024-06-28',
      },
    ];
  });

  // Update rewards when storeData changes
  useEffect(() => {
    if (storeData?.loyaltyRewards && Array.isArray(storeData.loyaltyRewards)) {
      setRewards(storeData.loyaltyRewards);
    }
  }, [storeData?.loyaltyRewards]);

  const handleAddReward = () => {
    setEditingReward(null);
    setRewardForm({
      name: '',
      type: 'fixed',
      value: 0,
      pointsRequired: 0,
      usageLimit: 0,
      description: '',
      isActive: true,
    });
    setShowRewardModal(true);
  };

  const handleEditReward = (reward: LoyaltyReward) => {
    setEditingReward(reward);
    setRewardForm({
      name: reward.name,
      type: reward.type,
      value: reward.value,
      pointsRequired: reward.pointsRequired,
      usageLimit: reward.usageLimit || 0,
      description: reward.description,
      isActive: reward.isActive,
    });
    setShowRewardModal(true);
  };

  const handleSaveReward = () => {
    const newReward: LoyaltyReward = {
      id: editingReward ? editingReward.id : Date.now().toString(),
      name: rewardForm.name,
      type: rewardForm.type,
      value: rewardForm.value,
      pointsRequired: rewardForm.pointsRequired,
      isActive: rewardForm.isActive,
      usageLimit: rewardForm.usageLimit,
      usedCount: editingReward ? editingReward.usedCount : 0,
      description: rewardForm.description,
      createdAt: editingReward ? editingReward.createdAt : new Date().toISOString().split('T')[0]!,
    };

    let updatedRewards: LoyaltyReward[];

    if (editingReward) {
      // Edit existing reward
      updatedRewards = rewards.map(r => r.id === editingReward.id ? newReward : r);
      setRewards(updatedRewards);
    } else {
      // Add new reward
      updatedRewards = [...rewards, newReward];
      setRewards(updatedRewards);
    }

    // Update storeData as well with the updated rewards array
    if (storeData) {
      setStoreData({
        ...storeData,
        loyaltyRewards: updatedRewards,
      });
    }

    setShowRewardModal(false);
    setRewardForm({
      name: '',
      type: 'fixed',
      value: 0,
      pointsRequired: 0,
      usageLimit: 0,
      description: '',
      isActive: true,
    });
    onSave();
  };

  const handleDeleteReward = (rewardId: string) => {
    const updatedRewards = rewards.filter(r => r.id !== rewardId);
    setRewards(updatedRewards);

    // Update storeData as well
    if (storeData) {
      setStoreData({
        ...storeData,
        loyaltyRewards: updatedRewards,
      });
    }

    onSave();
  };

  const getTypeBadge = (type: LoyaltyReward['type']) => {
    const typeConfig = {
      fixed: { label: 'قيمة ثابتة', color: 'bg-blue-100 text-blue-800' },
      percentage: { label: 'نسبة مئوية', color: 'bg-green-100 text-green-800' },
      free_shipping: { label: 'شحن مجاني', color: 'bg-purple-100 text-purple-800' },
      gift: { label: 'هدية', color: 'bg-pink-100 text-pink-800' },
    };

    const config = typeConfig[type];
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header احترافي */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 rounded-3xl p-8 text-white shadow-2xl"
        >
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-48 translate-x-48"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32"></div>

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Crown className="h-8 w-8 text-yellow-300" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  برنامج الولاء
                </h1>
                <p className="text-blue-100 text-lg">
                  مكّن عملاءك من كسب نقاط ولاء مع كل عملية شراء من متجرك
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <span className="text-sm font-medium">تفعيل البرنامج</span>
                <Button
                  variant={isProgramEnabled ? "default" : "outline"}
                  size="lg"
                  onClick={() => setIsProgramEnabled(!isProgramEnabled)}
                  className={`relative overflow-hidden ${
                    isProgramEnabled
                      ? 'bg-green-500 hover:bg-green-600 shadow-green-500/25'
                      : 'bg-white/20 hover:bg-white/30 border-white/30'
                  }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r transition-opacity duration-300 ${
                    isProgramEnabled ? 'from-green-400/20 to-emerald-400/20' : 'opacity-0'
                  }`}></div>
                  <div className="relative flex items-center gap-2">
                    {isProgramEnabled ? (
                      <>
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        <span className="text-white font-medium">مفعل</span>
                        <CheckCircle className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        <span className="text-white/80">معطل</span>
                        <ToggleLeft className="h-4 w-4" />
                      </>
                    )}
                  </div>
                </Button>
              </div>

              <Button
                onClick={handleAddReward}
                size="lg"
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Plus className="h-5 w-5 ml-2" />
                إضافة مكافأة جديدة
              </Button>
            </div>
          </div>
        </motion.div>

       {/* Analytics Cards متطورة */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {/* النقاط المكتسبة */}
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.1 }}
         >
           <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-50 to-green-100 border-green-200 hover:shadow-xl transition-all duration-300 group">
             <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-400/20 to-green-500/20 rounded-full -translate-y-8 translate-x-8 group-hover:scale-110 transition-transform duration-300"></div>
             <CardContent className="p-6 relative">
               <div className="flex items-center justify-between mb-4">
                 <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                   <Coins className="h-6 w-6 text-white" />
                 </div>
                 <div className="text-right">
                   <p className="text-sm font-medium text-emerald-700 mb-1">النقاط المكتسبة</p>
                   <p className="text-3xl font-bold text-emerald-800">2,598</p>
                 </div>
               </div>
               <div className="flex items-center justify-between">
                 <div className="text-xs text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
                   +12% من الشهر الماضي
                 </div>
                 <div className="w-16 h-1 bg-emerald-200 rounded-full overflow-hidden">
                   <div className="w-3/4 h-full bg-gradient-to-r from-emerald-400 to-green-500 rounded-full"></div>
                 </div>
               </div>
             </CardContent>
           </Card>
         </motion.div>

         {/* النقاط المستبدلة */}
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.2 }}
         >
           <Card className="relative overflow-hidden bg-gradient-to-br from-rose-50 to-red-100 border-red-200 hover:shadow-xl transition-all duration-300 group">
             <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-rose-400/20 to-red-500/20 rounded-full -translate-y-8 translate-x-8 group-hover:scale-110 transition-transform duration-300"></div>
             <CardContent className="p-6 relative">
               <div className="flex items-center justify-between mb-4">
                 <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                   <Gift className="h-6 w-6 text-white" />
                 </div>
                 <div className="text-right">
                   <p className="text-sm font-medium text-rose-700 mb-1">النقاط المُستبدلة</p>
                   <p className="text-3xl font-bold text-rose-800">0</p>
                 </div>
               </div>
               <div className="flex items-center justify-between">
                 <div className="text-xs text-rose-600 bg-rose-100 px-2 py-1 rounded-full">
                   لا توجد عمليات استبدال
                 </div>
                 <div className="w-16 h-1 bg-rose-200 rounded-full overflow-hidden">
                   <div className="w-1/12 h-full bg-gradient-to-r from-rose-400 to-red-500 rounded-full"></div>
                 </div>
               </div>
             </CardContent>
           </Card>
         </motion.div>

         {/* عدد العملاء */}
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.3 }}
         >
           <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200 hover:shadow-xl transition-all duration-300 group">
             <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full -translate-y-8 translate-x-8 group-hover:scale-110 transition-transform duration-300"></div>
             <CardContent className="p-6 relative">
               <div className="flex items-center justify-between mb-4">
                 <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                   <Users className="h-6 w-6 text-white" />
                 </div>
                 <div className="text-right">
                   <p className="text-sm font-medium text-blue-700 mb-1">العملاء النشطون</p>
                   <p className="text-3xl font-bold text-blue-800">28</p>
                 </div>
               </div>
               <div className="flex items-center justify-between">
                 <div className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                   +5 عملاء جدد
                 </div>
                 <div className="w-16 h-1 bg-blue-200 rounded-full overflow-hidden">
                   <div className="w-5/12 h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full"></div>
                 </div>
               </div>
             </CardContent>
           </Card>
         </motion.div>

         {/* معدل الاستبدال */}
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.4 }}
         >
           <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-violet-100 border-purple-200 hover:shadow-xl transition-all duration-300 group">
             <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-400/20 to-violet-500/20 rounded-full -translate-y-8 translate-x-8 group-hover:scale-110 transition-transform duration-300"></div>
             <CardContent className="p-6 relative">
               <div className="flex items-center justify-between mb-4">
                 <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
                   <TrendingUp className="h-6 w-6 text-white" />
                 </div>
                 <div className="text-right">
                   <p className="text-sm font-medium text-purple-700 mb-1">معدل الاستبدال</p>
                   <p className="text-3xl font-bold text-purple-800">0%</p>
                 </div>
               </div>
               <div className="flex items-center justify-between">
                 <div className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                   يحتاج تحسين
                 </div>
                 <div className="w-16 h-1 bg-purple-200 rounded-full overflow-hidden">
                   <div className="w-1/12 h-full bg-gradient-to-r from-purple-400 to-violet-500 rounded-full"></div>
                 </div>
               </div>
             </CardContent>
           </Card>
         </motion.div>
       </div>

       {/* Program Content متطور */}
       <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.5 }}
       >
         <Card className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-100 border-amber-200 shadow-xl">
           <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-400/20 to-yellow-500/20 rounded-full -translate-y-16 translate-x-16"></div>
           <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-orange-400/20 to-amber-500/20 rounded-full translate-y-12 -translate-x-12"></div>

           <CardHeader className="relative">
             <CardTitle className="flex items-center gap-3 text-2xl">
               <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
                 <Star className="h-6 w-6 text-white" />
               </div>
               <div>
                 <span className="bg-gradient-to-r from-amber-700 to-orange-700 bg-clip-text text-transparent">
                   محتوى برنامج الولاء
                 </span>
                 <p className="text-sm text-amber-600 mt-1 font-normal">
                   أضف تفاصيل برنامج الولاء الخاص بك
                 </p>
               </div>
             </CardTitle>
           </CardHeader>

           <CardContent className="relative space-y-6">
             <div className="space-y-4">
               <div>
                 <Label className="text-lg font-semibold text-amber-800 mb-3 block">
                   عنوان برنامج الولاء
                 </Label>
                 <div className="relative">
                   <Input
                     value={programSettings.title}
                     onChange={(e) => setProgramSettings({ ...programSettings, title: e.target.value })}
                     placeholder="أضف عنوانًا جذابًا لبرنامج الولاء"
                     className="bg-white/80 backdrop-blur-sm border-amber-200 focus:border-amber-400 focus:ring-amber-400 text-lg py-6 px-4 rounded-xl shadow-sm"
                   />
                   <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-lg flex items-center justify-center">
                     <Award className="h-4 w-4 text-white" />
                   </div>
                 </div>
               </div>

               <div>
                 <Label className="text-lg font-semibold text-amber-800 mb-3 block">
                   وصف البرنامج
                 </Label>
                 <div className="relative">
                   <Textarea
                     value={programSettings.description}
                     onChange={(e) => setProgramSettings({ ...programSettings, description: e.target.value })}
                     placeholder="اكتب وصفًا مفصلاً يشرح كيفية عمل برنامج الولاء وفوائده للعملاء..."
                     rows={4}
                     className="bg-white/80 backdrop-blur-sm border-amber-200 focus:border-amber-400 focus:ring-amber-400 text-base p-4 rounded-xl shadow-sm resize-none"
                   />
                   <div className="absolute left-4 top-4 w-6 h-6 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-lg flex items-center justify-center">
                     <Sparkles className="h-3 w-3 text-white" />
                   </div>
                 </div>
                 <div className="flex justify-between items-center mt-3">
                   <div className="flex items-center gap-2">
                     <div className={`w-3 h-3 rounded-full ${programSettings.description.length > 0 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                     <span className="text-sm text-amber-700">
                       {programSettings.description.length > 0 ? 'تم إضافة الوصف' : 'أضف وصفًا للبرنامج'}
                     </span>
                   </div>
                   <div className="text-sm text-amber-600 bg-amber-100 px-3 py-1 rounded-full">
                     {programSettings.description.length} / 320 حرف
                   </div>
                 </div>
                 <Progress
                   value={(programSettings.description.length / 320) * 100}
                   className="mt-2 h-2 bg-amber-100"
                 />
               </div>
             </div>
           </CardContent>
         </Card>
       </motion.div>

       {/* Points Earning Settings متطور */}
       <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.6 }}
       >
         <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 border-emerald-200 shadow-xl">
           <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-teal-500/20 rounded-full -translate-y-16 translate-x-16"></div>
           <CardHeader className="relative">
             <CardTitle className="flex items-center gap-3 text-2xl">
               <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                 <Coins className="h-6 w-6 text-white" />
               </div>
               <div>
                 <span className="bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
                   طرق كسب النقاط
                 </span>
                 <p className="text-sm text-emerald-600 mt-1 font-normal">
                   تحكّم بطريقة كسب العملاء للنقاط وآلية استبدالها
                 </p>
               </div>
             </CardTitle>
           </CardHeader>

           <CardContent className="relative space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {/* الشراء من المتجر */}
               <div className="relative overflow-hidden bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-emerald-100 shadow-lg hover:shadow-xl transition-all duration-300 group">
                 <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-emerald-400/10 to-teal-400/10 rounded-full -translate-y-8 translate-x-8 group-hover:scale-110 transition-transform duration-300"></div>
                 <div className="relative">
                   <div className="flex items-center gap-3 mb-4">
                     <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
                       <ShoppingCart className="h-5 w-5 text-white" />
                     </div>
                     <div>
                       <h3 className="font-bold text-emerald-800">الشراء من المتجر</h3>
                       <p className="text-sm text-emerald-600">كسب النقاط من خلال التسوق المباشر</p>
                     </div>
                   </div>

                   <div className="flex items-center justify-between">
                     <div className="text-sm text-emerald-700">
                       النقاط لكل دينار ليبي
                     </div>
                     <div className="flex items-center gap-3 bg-emerald-50 rounded-lg p-2">
                       <Input
                         type="number"
                         value={programSettings.pointsPerCurrency}
                         onChange={(e) => setProgramSettings({ ...programSettings, pointsPerCurrency: Number(e.target.value) })}
                         className="w-16 h-8 text-center bg-white border-emerald-200 focus:border-emerald-400"
                         min="0"
                         step="0.1"
                       />
                       <span className="text-sm font-medium text-emerald-700">نقطة</span>
                     </div>
                   </div>
                 </div>
               </div>

               {/* الشراء عبر المنصة */}
               <div className="relative overflow-hidden bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-cyan-100 shadow-lg hover:shadow-xl transition-all duration-300 group">
                 <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-cyan-400/10 to-blue-400/10 rounded-full -translate-y-8 translate-x-8 group-hover:scale-110 transition-transform duration-300"></div>
                 <div className="relative">
                   <div className="flex items-center gap-3 mb-4">
                     <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                       <CreditCard className="h-5 w-5 text-white" />
                     </div>
                     <div>
                       <h3 className="font-bold text-cyan-800">الشراء عبر منصة إشرو</h3>
                       <p className="text-sm text-cyan-600">كسب النقاط من خلال المنصة الإلكترونية</p>
                     </div>
                   </div>

                   <div className="flex items-center justify-between">
                     <div className="text-sm text-cyan-700">
                       الدينار لكل نقطة
                     </div>
                     <div className="flex items-center gap-3 bg-cyan-50 rounded-lg p-2">
                       <Input
                         type="number"
                         value={programSettings.currencyPerPoint}
                         onChange={(e) => setProgramSettings({ ...programSettings, currencyPerPoint: Number(e.target.value) })}
                         className="w-16 h-8 text-center bg-white border-cyan-200 focus:border-cyan-400"
                         min="0"
                         step="0.1"
                       />
                       <span className="text-sm font-medium text-cyan-700">د.ل</span>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           </CardContent>
         </Card>
       </motion.div>

       {/* Points Expiry متطور */}
       <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.7 }}
       >
         <Card className="relative overflow-hidden bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-100 border-violet-200 shadow-xl">
           <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-violet-400/20 to-purple-500/20 rounded-full -translate-y-12 translate-x-12"></div>
           <CardHeader className="relative">
             <CardTitle className="flex items-center gap-3 text-2xl">
               <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                 <Timer className="h-6 w-6 text-white" />
               </div>
               <div>
                 <span className="bg-gradient-to-r from-violet-700 to-purple-700 bg-clip-text text-transparent">
                   مدة صلاحية النقاط
                 </span>
                 <p className="text-sm text-violet-600 mt-1 font-normal">
                   تحدد مدة صلاحية النقاط المُكتسبة من العميل
                 </p>
               </div>
             </CardTitle>
           </CardHeader>

           <CardContent className="relative">
             <div className="flex items-center gap-6 bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-violet-100">
               <div className="flex-1">
                 <div className="flex items-center gap-4">
                   <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center">
                     <Clock className="h-8 w-8 text-white" />
                   </div>
                   <div>
                     <h3 className="text-xl font-bold text-violet-800 mb-2">
                       صلاحية النقاط
                     </h3>
                     <p className="text-violet-600">
                       النقاط تنتهي صلاحيتها بعد انتهاء هذه المدة
                     </p>
                   </div>
                 </div>
               </div>

               <div className="flex items-center gap-4">
                 <div className="flex items-center gap-3 bg-violet-50 rounded-xl p-4">
                   <Input
                     type="number"
                     value={programSettings.pointsExpiryDays}
                     onChange={(e) => setProgramSettings({ ...programSettings, pointsExpiryDays: Number(e.target.value) })}
                     className="w-20 h-10 text-center text-lg font-bold bg-white border-violet-200 focus:border-violet-400"
                     min="1"
                     max="365"
                   />
                   <div className="text-right">
                     <div className="font-bold text-violet-800">يوم</div>
                     <div className="text-sm text-violet-600">/ أيام</div>
                   </div>
                 </div>
               </div>
             </div>
           </CardContent>
         </Card>
       </motion.div>

       {/* Redemption Methods متطور */}
       <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.8 }}
       >
         <Card className="relative overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-purple-100 border-rose-200 shadow-xl">
           <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-rose-400/20 to-pink-500/20 rounded-full -translate-y-16 translate-x-16"></div>
           <CardHeader className="relative">
             <CardTitle className="flex items-center gap-3 text-2xl">
               <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                 <Gift className="h-6 w-6 text-white" />
               </div>
               <div>
                 <span className="bg-gradient-to-r from-rose-700 to-pink-700 bg-clip-text text-transparent">
                   طرق استبدال النقاط
                 </span>
                 <p className="text-sm text-rose-600 mt-1 font-normal">
                   يمكنك إضافة حتى 10 عناصر كحد أقصى
                 </p>
               </div>
             </CardTitle>
           </CardHeader>

           <CardContent className="relative space-y-6">
             {rewards.map((reward, index) => (
               <motion.div
                 key={reward.id}
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: 0.1 * index }}
                 className="relative overflow-hidden bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-rose-100 shadow-lg hover:shadow-xl transition-all duration-300 group"
               >
                 <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-rose-400/10 to-pink-400/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-110 transition-transform duration-300"></div>

                 <div className="relative flex items-center justify-between">
                   <div className="flex items-center gap-4">
                     <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                       <Gift className="h-7 w-7 text-white" />
                     </div>
                     <div>
                       <h3 className="font-bold text-rose-800 text-lg mb-1">{reward.name}</h3>
                       <p className="text-rose-600 text-sm mb-2">{reward.description}</p>
                       <div className="flex items-center gap-3">
                         <div className="flex items-center gap-1 bg-rose-100 px-3 py-1 rounded-full">
                           <Coins className="h-3 w-3 text-rose-600" />
                           <span className="text-sm font-medium text-rose-700">
                             {reward.pointsRequired} نقطة
                           </span>
                         </div>
                         <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                           reward.isActive
                             ? 'bg-green-100 text-green-700'
                             : 'bg-gray-100 text-gray-700'
                         }`}>
                           {reward.isActive ? 'نشط' : 'غير نشط'}
                         </div>
                         {getTypeBadge(reward.type)}
                       </div>
                     </div>
                   </div>

                   <div className="flex items-center gap-2">
                     <Button
                       variant="outline"
                       size="sm"
                       onClick={() => handleEditReward(reward)}
                       className="bg-white/80 border-rose-200 hover:bg-rose-50 hover:border-rose-300"
                     >
                       <Edit className="h-4 w-4 text-rose-600" />
                     </Button>
                     <Button
                       variant="outline"
                       size="sm"
                       onClick={() => handleDeleteReward(reward.id)}
                       className="bg-white/80 border-red-200 hover:bg-red-50 hover:border-red-300 text-red-600"
                     >
                       <Trash2 className="h-4 w-4" />
                     </Button>
                   </div>
                 </div>
               </motion.div>
             ))}

             {rewards.length < 10 && (
               <motion.div
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ delay: 0.3 }}
               >
                 <Button
                   onClick={handleAddReward}
                   variant="outline"
                   className="w-full h-24 border-2 border-dashed border-rose-200 bg-rose-50/50 hover:bg-rose-100 hover:border-rose-300 transition-all duration-300 group"
                 >
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                       <Plus className="h-5 w-5 text-white" />
                     </div>
                     <div className="text-right">
                       <div className="font-bold text-rose-700">إضافة طريقة استبدال جديدة</div>
                       <div className="text-sm text-rose-600">يمكنك إضافة مكافآت متنوعة للعملاء</div>
                     </div>
                   </div>
                 </Button>
               </motion.div>
             )}
           </CardContent>
         </Card>
       </motion.div>

      {/* Add/Edit Reward Modal */}
      <AnimatePresence>
        {showRewardModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowRewardModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingReward ? 'تعديل المكافأة' : 'إضافة مكافأة جديدة'}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowRewardModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>اسم المكافأة</Label>
                  <Input
                    value={rewardForm.name}
                    onChange={(e) => setRewardForm({ ...rewardForm, name: e.target.value })}
                    placeholder="أدخل اسم المكافأة"
                  />
                </div>

                <div>
                  <Label>نوع المكافأة</Label>
                  <Select value={rewardForm.type} onValueChange={(value) => setRewardForm({ ...rewardForm, type: value as LoyaltyReward['type'] })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">قيمة ثابتة</SelectItem>
                      <SelectItem value="percentage">نسبة مئوية</SelectItem>
                      <SelectItem value="free_shipping">شحن مجاني</SelectItem>
                      <SelectItem value="gift">هدية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>قيمة المكافأة</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={rewardForm.value}
                      onChange={(e) => setRewardForm({ ...rewardForm, value: Number(e.target.value) })}
                      placeholder="0"
                    />
                    {rewardForm.type === 'percentage' && <span className="flex items-center text-sm text-gray-600">%</span>}
                    {rewardForm.type === 'fixed' && <span className="flex items-center text-sm text-gray-600">د.ل</span>}
                  </div>
                </div>

                <div>
                  <Label>النقاط المطلوبة</Label>
                  <Input
                    type="number"
                    value={rewardForm.pointsRequired}
                    onChange={(e) => setRewardForm({ ...rewardForm, pointsRequired: Number(e.target.value) })}
                    placeholder="1000"
                  />
                </div>

                <div>
                  <Label>وصف المكافأة</Label>
                  <Textarea
                    value={rewardForm.description}
                    onChange={(e) => setRewardForm({ ...rewardForm, description: e.target.value })}
                    placeholder="وصف مختصر للمكافأة"
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isActive"
                    checked={rewardForm.isActive}
                    onCheckedChange={(checked) => setRewardForm({ ...rewardForm, isActive: checked as boolean })}
                  />
                  <Label htmlFor="isActive">مكافأة نشطة</Label>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  onClick={handleSaveReward}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  disabled={!rewardForm.name.trim() || !rewardForm.pointsRequired}
                >
                  <Save className="h-4 w-4 ml-2" />
                  {editingReward ? 'حفظ التغييرات' : 'إضافة المكافأة'}
                </Button>
                <Button variant="outline" onClick={() => setShowRewardModal(false)}>
                  إلغاء
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
};

export { LoyaltyProgramView };
