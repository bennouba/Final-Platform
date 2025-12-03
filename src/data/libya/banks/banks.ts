// Libyan Banks Data - المصارف الليبية
export interface LibyanBank {
  id: string;
  name: string;
  nameEn?: string;
}

export const libyanBanks: LibyanBank[] = [
  { id: 'jumhuriya', name: 'مصرف الجمهورية', nameEn: 'Jumhuriya Bank' },
  { id: 'sahari', name: 'مصرف الصحاري', nameEn: 'Sahari Bank' },
  { id: 'mutahid', name: 'مصرف المتحد', nameEn: 'United Bank' },
  { id: 'north_africa', name: 'مصرف شمال أفريقيا', nameEn: 'North Africa Bank' },
  { id: 'wahda', name: 'مصرف الوحدة', nameEn: 'Wahda Bank' },
  { id: 'libyan_islamic', name: 'مصرف الليبي الإسلامي', nameEn: 'Libyan Islamic Bank' },
  { id: 'nuran', name: 'مصرف النوران', nameEn: 'Nuran Bank' },
  { id: 'andalus', name: 'مصرف الأندلس', nameEn: 'Andalus Bank' },
  { id: 'aman', name: 'مصرف الأمان', nameEn: 'Aman Bank' },
  { id: 'commercial_national', name: 'مصرف التجاري الوطني', nameEn: 'National Commercial Bank' },
  { id: 'tadamon', name: 'مصرف التضامن', nameEn: 'Tadamon Bank' },
  { id: 'commerce_development', name: 'مصرف التجارة والتنمية', nameEn: 'Commerce and Development Bank' },
  { id: 'investment_libyan', name: 'مصرف الإستثمار الليبي', nameEn: 'Libyan Investment Bank' },
  { id: 'gulf_first', name: 'مصرف الخليج الأول', nameEn: 'First Gulf Bank' },
  { id: 'ijmaa_arabi', name: 'مصرف الإجماع العربي', nameEn: 'Arab Ijmaa Bank' },
  { id: 'atib', name: 'مصرف أتيب', nameEn: 'ATIB Bank' },
  { id: 'yaqeen', name: 'مصرف اليقين', nameEn: 'Yaqeen Bank' },
  { id: 'wafaa', name: 'مصرف الوفاء', nameEn: 'Wafaa Bank' },
  { id: 'waha', name: 'مصرف الواحة', nameEn: 'Waha Bank' },
  { id: 'mutawasit', name: 'مصرف المتوسط', nameEn: 'Mediterranean Bank' },
  { id: 'commercial_arabi', name: 'مصرف التجاري العربي', nameEn: 'Arab Commercial Bank' },
  { id: 'siraj', name: 'مصرف السراج', nameEn: 'Siraj Bank' },
  { id: 'libyan_foreign', name: 'مصرف الليبي الخارجي', nameEn: 'Libyan Foreign Bank' }
];

// Helper functions for banks
export const getBankById = (bankId: string): LibyanBank | undefined => {
  return libyanBanks.find(bank => bank.id === bankId);
};

export const searchBanks = (query: string): LibyanBank[] => {
  return libyanBanks.filter(bank =>
    bank.name.toLowerCase().includes(query.toLowerCase()) ||
    bank.nameEn?.toLowerCase().includes(query.toLowerCase())
  );
};
