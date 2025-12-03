// Libyan Cities Data - المدن الليبية
export interface City {
  id: string;
  name: string;
  areas?: string[];
}

export interface Area {
  id: string;
  name: string;
  cityId: string;
}

// Helper function to get city by ID
export const getCityById = (cityId: string): City | undefined => {
  return libyanCities.find(city => city.id === cityId);
};

// Helper function to get areas for a specific city
export const getCityAreas = (cityId: string): Area[] => {
  return libyanAreas.filter(area => area.cityId === cityId);
};

// Helper function to get area by ID
export const getAreaById = (areaId: string): Area | undefined => {
  return libyanAreas.find(area => area.id === areaId);
};

export const libyanCities: City[] = [
  { id: 'tripoli', name: 'طرابلس' },
  { id: 'benghazi', name: 'بنغازي' },
  { id: 'misrata', name: 'مصراتة' },
  { id: 'zawiya', name: 'الزاوية' },
  { id: 'zletin', name: 'زليتن' },
  { id: 'khoms', name: 'الخمس' },
  { id: 'gharyan', name: 'غريان' },
  { id: 'sabha', name: 'سبها' },
  { id: 'sirte', name: 'سرت' },
  { id: 'bayda', name: 'البيضاء' },
  { id: 'darna', name: 'درنة' },
  { id: 'tubruq', name: 'طبرق' },
  { id: 'marj', name: 'المرج' },
  { id: 'green_mountain', name: 'الجبل الأخضر' },
  { id: 'jufra', name: 'الجفرة' },
  { id: 'oasis', name: 'الواحات' },
  { id: 'kufra', name: 'الكفرة' },
  { id: 'awbari', name: 'أوباري' },
  { id: 'ghat', name: 'غات' },
  { id: 'murzuq', name: 'مرزق' },
  { id: 'zintan', name: 'الزنتان' },
  { id: 'rajban', name: 'الرجبان' },
  { id: 'asaba', name: 'الأصابعة' },
  { id: 'qasr_khayar', name: 'قصر الأخيار' },
  { id: 'maya', name: 'الماية' },
  { id: 'qala', name: 'القلعة' },
  { id: 'abyar', name: 'الأبيار' },
  { id: 'nalut', name: 'نالوت' },
  { id: 'kabaw', name: 'كاباو' },
  { id: 'jado', name: 'جادو' },
  { id: 'yafran', name: 'يفرن' },
  { id: 'jagbub', name: 'الجغبوب' },
  { id: 'awjila', name: 'أوجلة' },
  { id: 'brak_shati', name: 'براك الشاطئ' },
  { id: 'wadi_red', name: 'الوادي الأحمر' },
  { id: 'tazirbu', name: 'تازربو' },
  { id: 'amsaad', name: 'أمساعد' },
  { id: 'shahat', name: 'شحات' },
  { id: 'batnan', name: 'البطنان' },
  { id: 'qubba', name: 'القبة' },
  { id: 'tukra', name: 'توكرة' },
  { id: 'suluq', name: 'سلوق' },
  { id: 'abraq', name: 'الأبرق' },
  { id: 'awiniya', name: 'العوينية' },
  { id: 'qatrun', name: 'القطرون' },
  { id: 'tajura', name: 'تاجوراء' },
  { id: 'tajura_industrial', name: 'تاجوراء الصناعية' },
  { id: 'souq_juma', name: 'سوق الجمعة' },
  { id: 'ain_zara', name: 'عين زارة' },
  { id: 'airport_road', name: 'طريق المطار' },
  { id: 'ghut_shaal', name: 'غوط الشعال' },
  { id: 'karimia', name: 'الكريمية' },
  { id: 'shuhada_shat', name: 'شهداء الشط' },
  { id: 'qamins', name: 'قمينس' },
  { id: 'hadaek', name: 'الحدائق' },
  { id: 'furnaj', name: 'الفرناج' },
  { id: 'swani', name: 'السواني' },
  { id: 'dhahra', name: 'الظهرة' },
  { id: 'muhayshi', name: 'المحيشي' },
  { id: 'qasr_bin_ghashir', name: 'قصر بن غشير' },
  { id: 'amarat', name: 'العمارات' },
  { id: 'andalus', name: 'الأندلس' },
  { id: 'siahia', name: 'السياحية' },
  { id: 'fallah', name: 'الفلاح' },
  { id: 'qarra_bulli', name: 'القره بوللي' },
  { id: 'qarqarish', name: 'القرقارش' },
  { id: 'ghut_rumman', name: 'غوط الرمان' },
  { id: 'ghiran', name: 'الغيران' },
  { id: 'sabri', name: 'الصابري' },
  { id: 'mansura', name: 'المنصورة' }
];

export const libyanAreas: Area[] = [
  { id: 'karimia', name: 'الكريمية', cityId: 'tripoli' },
  { id: 'ghut_shaal', name: 'غوط الشعال', cityId: 'tripoli' },
  { id: 'airport_road', name: 'طريق المطار', cityId: 'tripoli' },
  { id: 'shuhada_shat', name: 'شهداء الشط', cityId: 'tripoli' },
  { id: 'qamins', name: 'قمينس', cityId: 'tripoli' },
  { id: 'hadaek', name: 'الحدائق', cityId: 'tripoli' },
  { id: 'furnaj', name: 'الفرناج', cityId: 'tripoli' },
  { id: 'swani', name: 'السواني', cityId: 'tripoli' },
  { id: 'dhahra', name: 'الظهرة', cityId: 'tripoli' },
  { id: 'muhayshi', name: 'المحيشي', cityId: 'tripoli' },
  { id: 'qasr_bin_ghashir', name: 'قصر بن غشير', cityId: 'tripoli' },
  { id: 'amarat', name: 'العمارات', cityId: 'tripoli' },
  { id: 'andalus', name: 'الأندلس', cityId: 'tripoli' },
  { id: 'siahia', name: 'السياحية', cityId: 'tripoli' },
  { id: 'fallah', name: 'الفلاح', cityId: 'tripoli' },
  { id: 'qarra_bulli', name: 'القره بوللي', cityId: 'tripoli' },
  { id: 'qarqarish', name: 'القرقارش', cityId: 'tripoli' },
  { id: 'ghut_rumman', name: 'غوط الرمان', cityId: 'tripoli' },
  { id: 'ghiran', name: 'الغيران', cityId: 'tripoli' },
  { id: 'sabri', name: 'الصابري', cityId: 'tripoli' },
  { id: 'mansura', name: 'المنصورة', cityId: 'tripoli' },
  { id: 'tajura', name: 'تاجوراء', cityId: 'tripoli' },
  { id: 'tajura_industrial', name: 'تاجوراء الصناعية', cityId: 'tripoli' },
  { id: 'souq_juma', name: 'سوق الجمعة', cityId: 'tripoli' },
  { id: 'ain_zara', name: 'عين زارة', cityId: 'tripoli' },
  { id: 'maya', name: 'الماية', cityId: 'tripoli' },
  { id: 'qala', name: 'القلعة', cityId: 'tripoli' },
  { id: 'abyar', name: 'الأبيار', cityId: 'tripoli' },
  { id: 'nalut', name: 'نالوت', cityId: 'tripoli' },
  { id: 'kabaw', name: 'كاباو', cityId: 'tripoli' },
  { id: 'jado', name: 'جادو', cityId: 'tripoli' },
  { id: 'yafran', name: 'يفرن', cityId: 'tripoli' },
  { id: 'jagbub', name: 'الجغبوب', cityId: 'tripoli' },
  { id: 'awjila', name: 'أوجلة', cityId: 'tripoli' },
  { id: 'brak_shati', name: 'براك الشاطئ', cityId: 'tripoli' },
  { id: 'wadi_red', name: 'الوادي الأحمر', cityId: 'tripoli' },
  { id: 'tazirbu', name: 'تازربو', cityId: 'tripoli' },
  { id: 'amsaad', name: 'أمساعد', cityId: 'tripoli' },
  { id: 'shahat', name: 'شحات', cityId: 'tripoli' },
  { id: 'batnan', name: 'البطنان', cityId: 'tripoli' },
  { id: 'qubba', name: 'القبة', cityId: 'tripoli' },
  { id: 'tukra', name: 'توكرة', cityId: 'tripoli' },
  { id: 'suluq', name: 'سلوق', cityId: 'tripoli' },
  { id: 'abraq', name: 'الأبرق', cityId: 'tripoli' },
  { id: 'awiniya', name: 'العوينية', cityId: 'tripoli' },
  { id: 'qatrun', name: 'القطرون', cityId: 'tripoli' },
  { id: 'green_mountain', name: 'الجبل الأخضر', cityId: 'tripoli' },
  { id: 'jufra', name: 'الجفرة', cityId: 'tripoli' },
  { id: 'oasis', name: 'الواحات', cityId: 'tripoli' },
  { id: 'kufra', name: 'الكفرة', cityId: 'tripoli' },
  { id: 'awbari', name: 'أوباري', cityId: 'tripoli' },
  { id: 'ghat', name: 'غات', cityId: 'tripoli' },
  { id: 'murzuq', name: 'مرزق', cityId: 'tripoli' },
  { id: 'zintan', name: 'الزنتان', cityId: 'tripoli' },
  { id: 'rajban', name: 'الرجبان', cityId: 'tripoli' },
  { id: 'asaba', name: 'الأصابعة', cityId: 'tripoli' },
  { id: 'qasr_khayar', name: 'قصر الأخيار', cityId: 'tripoli' }
];
