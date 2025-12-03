export interface CleaningSubcategory {
  id: string;
  name: string;
  nameEn: string;
  description?: string;
  icon?: string;
}

export const cleaningMaterialsSubcategories: CleaningSubcategory[] = [
  {
    id: 'kitchen_appliances_supplies',
    name: 'مستلزمات مطابخ وأفران',
    nameEn: 'Kitchen Appliances & Supplies',
    description: 'منظفات ومستلزمات تنظيف المطابخ والأفران'
  },
  {
    id: 'degreaser_multipurpose',
    name: 'مستلزمات إزالة الذهون ومتعددة الاستخدامات',
    nameEn: 'Degreaser & Multi-Purpose Supplies',
    description: 'منتجات إزالة الذهون والمنظفات متعددة الاستخدامات'
  },
  {
    id: 'occasions_holidays',
    name: 'مستلزمات مناسبات وأعياد',
    nameEn: 'Occasions & Holidays Supplies',
    description: 'منتجات التنظيف الخاصة بالمناسبات والأعياد'
  },
  {
    id: 'laundry_powder',
    name: 'مساحيق غسيل ملابس',
    nameEn: 'Laundry Washing Powder',
    description: 'مساحيق غسيل عالية الجودة للملابس'
  },
  {
    id: 'carpet_moquet_powder',
    name: 'مساحيق غسيل سجاد وموكيت',
    nameEn: 'Carpet & Moquet Washing Powder',
    description: 'مساحيق متخصصة لغسيل السجاد والموكيت'
  },
  {
    id: 'concentrated_dishwash_liquid',
    name: 'سوائل غسيل أواني وصحون مركزة',
    nameEn: 'Concentrated Dishwash Liquid',
    description: 'سوائل جلي مركزة عالية الفعالية'
  },
  {
    id: 'beauty_decoration',
    name: 'مستلزمات الزينة و الجمال',
    nameEn: 'Beauty & Decoration Supplies',
    description: 'منتجات تنظيف متعلقة بالزينة والجمال'
  },
  {
    id: 'personal_care',
    name: 'مستلزمات العناية الشخصية',
    nameEn: 'Personal Care Supplies',
    description: 'منتجات العناية الشخصية والنظافة'
  },
  {
    id: 'children_supplies',
    name: 'مستلزمات أطفال',
    nameEn: 'Children Supplies',
    description: 'منتجات تنظيف آمنة للأطفال'
  },
  {
    id: 'ceramic_bathroom_powder',
    name: 'مساحيق غسيل السيراميك والحمامات',
    nameEn: 'Ceramic & Bathroom Cleaning Powder',
    description: 'مساحيق متخصصة لتنظيف السيراميك والحمامات'
  },
  {
    id: 'floor_ceramic_perfume',
    name: 'معطرات أرضيات وسيراميك',
    nameEn: 'Floor & Ceramic Fragrances',
    description: 'معطرات متخصصة للأرضيات والسيراميك'
  },
  {
    id: 'pest_insect_control',
    name: 'مستلزمات مكافحة القوارض والحشرات',
    nameEn: 'Pest & Insect Control Supplies',
    description: 'منتجات مكافحة الآفات والحشرات'
  }
];

export const getCleaningSubcategoryById = (id: string): CleaningSubcategory | undefined => {
  return cleaningMaterialsSubcategories.find(cat => cat.id === id);
};

export const getCleaningSubcategoryOptions = () => {
  return cleaningMaterialsSubcategories.map(cat => ({
    value: cat.id,
    label: cat.name
  }));
};
