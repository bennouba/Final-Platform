// Libyan Data - البيانات الليبية
// Main export file for all Libyan data

// Areas - المناطق
export {
  libyanAreas,
  getAreaById,
  getAreasByCity,
  searchAreas,
  type LibyanArea
} from './areas/areas';

// Cities - المدن
export {
  libyanCities,
  libyanAreas as cityAreas,
  getCityById,
  getCityAreas,
  getAreaById as getCityAreaById
} from './cities/cities';

// Banks - المصارف
export {
  libyanBanks,
  getBankById,
  searchBanks,
  type LibyanBank
} from './banks/banks';
