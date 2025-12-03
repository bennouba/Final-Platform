import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Save,
  X,
  Copy,
  ExternalLink,
  Calendar,
  Percent,
  DollarSign,
  Tag as TagIcon,
  Users,
  Settings,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Info,
  Gift,
  Target,
  Clock,
  Download,
  ToggleLeft,
  ToggleRight,
  Link as LinkIcon,
  UserCheck,
  Building,
  Globe,
  FileText,
  Menu,
  Image as ImageIcon,
  Layout,
  Type,
  Palette,
  Camera,
  Upload,
  MapPin,
  Phone,
  Mail,
  Globe as GlobeIcon,
  Monitor,
  Smartphone,
  Tablet,
  Star,
  Crown,
  Gem,
  Heart,
  ShoppingCart,
  Timer,
  Calculator,
  Send,
  History,
  Bell,
  ChevronRight,
  Sparkles,
  Rocket,
  Award,
  Coins,
  Banknote,
  Store,
  Palette as PaletteIcon,
  Image,
  CreditCard,
  Zap,
  Shield,
  Eye as EyeIcon,
  Loader2,
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

interface StorePage {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'draft';
  createdAt: string;
}

interface MenuItem {
  id: string;
  title: string;
  url: string;
  type: 'page' | 'category' | 'custom';
  isVisible: boolean;
  sortOrder: number;
}

interface Slider {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

interface Advertisement {
  id: string;
  name: string;
  image: string;
  url: string;
  position: string;
  isActive: boolean;
  expiryDate: string;
  visits: number;
  createdAt: string;
}

interface StoreSettingsViewProps {
  storeData: any;
  setStoreData: (data: any) => void;
  onSave: () => void;
}

const StoreSettingsView: React.FC<StoreSettingsViewProps> = ({ storeData, setStoreData, onSave }) => {
  const [activeTab, setActiveTab] = useState('store-settings');
  const [searchTerm, setSearchTerm] = useState('');
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [isGPSEnabled, setIsGPSEnabled] = useState(false);

  // Store data
  const localStoreData = {
    name: 'متجر نواعم',
    phone: '0942161516',
    address: 'طرابلس - سوق الجمعة',
    email: 'contact@ishro.ly',
    about: 'منصة إشرو للتجارة الإلكترونية نقدم مجموعة من الخدمات و الأدوات العملية لإفتتاح متجرك الإلكتروني والدخول الى عالم التجارة الإلكترونية بشكل سهل وسريع ، في منصة إشرو نعمل على تمكين التجار من تطوير وتنمية تجارتهم و تسهل الوصول والتواصل مع العملاء.',
    workingHours: '24/7',
    copyright: '© 2025 منصة إشرو للتجارة الإلكترونية',
    seoTitle: 'منصة إشرو للتجارة الإلكترونية - تمكين وإنتشار',
    seoDescription: 'بوابة التجارة الإلكترونية في ليبيا ، تجارة الكترونية',
    logo: '/assets/stores/1.webp',
    favicon: '/assets/stores/1.webp',
    seoImage: '/assets/stores/1.webp',
    popupEnabled: false,
    popupDelay: 10,
    popupMessage: 'أهلا بك في متجر نواعم التجريبي',
    popupImage: '/assets/stores/1.webp',
  };

  // Image upload states for SEO settings
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>(localStoreData.logo);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string>(localStoreData.favicon);
  const [seoImageFile, setSeoImageFile] = useState<File | null>(null);
  const [seoImagePreview, setSeoImagePreview] = useState<string>(localStoreData.seoImage);

  // Google Maps states for store location
  const [mapLoaded, setMapLoaded] = useState(false);
  const [googleMap, setGoogleMap] = useState<any>(null);
  const [mapMarker, setMapMarker] = useState<any>(null);
  const [selectedCoordinates, setSelectedCoordinates] = useState<{lat: number, lng: number} | null>(null);

  // Location modal states
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationForm, setLocationForm] = useState({
    name: '',
    location: '',
    city: '',
    region: '',
    manager: '',
    phone: '',
    email: '',
    isMain: false,
    isActive: true,
    coordinates: null as {lat: number, lng: number} | null,
  });

  // Libyan cities and regions
  const libyanCities = [
    'طرابلس', 'بنغازي', 'مصراتة', 'البيضاء', 'زليتن', 'زوارة', 'صبراتة',
    'صبراته', 'ترهونة', 'غريان', 'صورمان', 'العزيزية', 'تاجوراء', 'قصر بن غشير'
  ];

  const libyanRegions = [
    'وسط طرابلس', 'شرق طرابلس', 'غرب طرابلس', 'جنوب طرابلس',
    'سوق الجمعة', 'فشلوم', 'الهضبة', 'باب بن غشير'
  ];

  // Store locations
  const storeLocations = [
    {
      id: '1',
      name: 'سوق الجمعة',
      address: 'طرابلس - سوق الجمعة, طرابلس, سوق الجمعة, Libya',
      city: 'طرابلس',
      region: 'سوق الجمعة',
      manager: 'مدير فرع',
      phone: '0942161516',
      email: 'contact@ishro.ly',
      status: 'نشط',
      isMain: true,
      longitude: '13.191338',
      latitude: '32.887209'
    }
  ];

  const menuItems: MenuItem[] = [
    {
      id: '1',
      title: 'الرئيسية',
      url: '/',
      type: 'custom',
      isVisible: true,
      sortOrder: 1,
    },
    {
      id: '2',
      title: 'جميع المنتجات',
      url: '/products',
      type: 'custom',
      isVisible: true,
      sortOrder: 2,
    },
    {
      id: '3',
      title: 'عن المتجر',
      url: '/about',
      type: 'page',
      isVisible: true,
      sortOrder: 3,
    },
    {
      id: '4',
      title: 'شروط الإستخدام',
      url: '/terms',
      type: 'page',
      isVisible: true,
      sortOrder: 4,
    },
  ];

  const sliders: Slider[] = [
    {
      id: '1',
      name: 'البنرات الرئيسية',
      status: 'active',
      createdAt: '2022-01-03',
    },
  ];

  const advertisements: Advertisement[] = [
    {
      id: '1',
      name: 'دعاية السمعات',
      image: 'headphones-ad.jpg',
      url: '/products/headphones',
      position: 'header',
      isActive: true,
      expiryDate: '2027-04-07',
      visits: 46,
      createdAt: '2024-01-01',
    },
    {
      id: '2',
      name: 'الدعاية الفردية',
      image: 'single-ad.jpg',
      url: '/products/single',
      position: 'sidebar',
      isActive: true,
      expiryDate: '2027-01-04',
      visits: 52,
      createdAt: '2024-01-02',
    },
  ];

  // Sample data for pages (keeping for backward compatibility)
  const pages: StorePage[] = [
    {
      id: '1',
      name: 'عن المتجر',
      status: 'active',
      createdAt: '2022-01-03',
    },
    {
      id: '2',
      name: 'التواصل معنا',
      status: 'active',
      createdAt: '2022-01-03',
    },
  ];

  const filteredPages = pages.filter(page =>
    page.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    return status === 'active' ? (
      <Badge className="bg-green-100 text-green-800">مفعل</Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-800">غير مفعل</Badge>
    );
  };

  // Image handling functions
  const handleImageUpload = (file: File, type: 'logo' | 'favicon' | 'seoImage') => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (type === 'logo') {
          setLogoFile(file);
          setLogoPreview(result);
        } else if (type === 'favicon') {
          setFaviconFile(file);
          setFaviconPreview(result);
        } else if (type === 'seoImage') {
          setSeoImageFile(file);
          setSeoImagePreview(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, type: 'logo' | 'favicon' | 'seoImage') => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0]) {
      handleImageUpload(files[0], type);
    }
  };

  // Google Maps functions for store location
  const initializeGoogleMap = () => {
    try {
      const googleMaps = (window as any).google?.maps;
      if (googleMaps && !googleMap) {
        setMapLoaded(true);
        const mapElement = document.getElementById('store-google-map');
        if (mapElement) {
          const map = new googleMaps.Map(mapElement, {
            center: { lat: 32.8872, lng: 13.1913 }, // Center of Libya
            zoom: 7,
            mapTypeControl: true,
            streetViewControl: false,
            fullscreenControl: true,
            zoomControl: true,
            gestureHandling: 'greedy',
            mapTypeId: googleMaps.MapTypeId.ROADMAP,
            styles: [
              {
                featureType: 'poi',
                stylers: [{ visibility: 'simplified' }]
              },
              {
                featureType: 'road',
                stylers: [{ visibility: 'simplified' }]
              }
            ]
          });

          setGoogleMap(map);

          // Add click listener to map for location selection
          map.addListener('click', (event: any) => {
            const coordinates = {
              lat: event.latLng.lat(),
              lng: event.latLng.lng()
            };
            setSelectedCoordinates(coordinates);

            // Update or create marker
            if (mapMarker) {
              mapMarker.setPosition(coordinates);
            } else {
              const marker = new googleMaps.Marker({
                position: coordinates,
                map: map,
                title: 'موقع المتجر المختار',
                draggable: true,
                animation: googleMaps.Animation.DROP
              });
              setMapMarker(marker);
            }
          });

          // Add Libya cities markers
          const libyaCitiesData = [
            { name: 'طرابلس', lat: 32.8872, lng: 13.1913, color: '#EF4444' },
            { name: 'بنغازي', lat: 32.1167, lng: 20.0667, color: '#3B82F6' },
            { name: 'مصراتة', lat: 32.3753, lng: 15.0925, color: '#10B981' },
            { name: 'سبها', lat: 27.0389, lng: 14.4264, color: '#F59E0B' },
            { name: 'الزاوية', lat: 32.7522, lng: 12.7278, color: '#8B5CF6' },
            { name: 'زليتن', lat: 32.4667, lng: 14.5667, color: '#F97316' }
          ];

          libyaCitiesData.forEach((city, index) => {
            setTimeout(() => {
              const cityMarker = new googleMaps.Marker({
                position: { lat: city.lat, lng: city.lng },
                map: map,
                title: city.name,
                icon: {
                  path: googleMaps.SymbolPath.CIRCLE,
                  scale: 16,
                  fillColor: city.color,
                  fillOpacity: 1,
                  strokeColor: 'white',
                  strokeWeight: 4,
                },
                animation: googleMaps.Animation.DROP
              });

              cityMarker.addListener('click', () => {
                map.setCenter({ lat: city.lat, lng: city.lng });
                map.setZoom(12);
                setSelectedCoordinates({ lat: city.lat, lng: city.lng });
              });
            }, index * 100);
          });
        }
      } else {

        setTimeout(initializeGoogleMap, 500);
      }
    } catch (error) {

      setMapLoaded(false);
    }
  };

  const handleMapSearch = () => {
    const searchInput = document.getElementById('store-map-search') as HTMLInputElement;
    const searchTerm = searchInput?.value;

    if (searchTerm && googleMap) {
      const googleMaps = (window as any).google?.maps;
      if (googleMaps && googleMaps.places) {
        const service = new googleMaps.places.PlacesService(googleMap);

        const request = {
          query: searchTerm + ', Libya',
          fields: ['name', 'geometry', 'formatted_address'],
          language: 'ar'
        };

        service.findPlaceFromQuery(request, (results: any, status: any) => {
          if (status === googleMaps.places.PlacesServiceStatus.OK && results && results[0]) {
            const place = results[0];
            const coordinates = {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng()
            };

            googleMap.setCenter(coordinates);
            googleMap.setZoom(15);
            setSelectedCoordinates(coordinates);

            if (mapMarker) {
              mapMarker.setPosition(coordinates);
            } else {
              const marker = new googleMaps.Marker({
                position: coordinates,
                map: googleMap,
                title: place.name,
                draggable: true,
                animation: googleMaps.Animation.DROP
              });
              setMapMarker(marker);
            }
          } else {
            alert('لم يتم العثور على الموقع. يرجى التأكد من الاسم والمحاولة مرة أخرى.');
          }
        });
      }
    } else {
      alert('يرجى إدخال اسم المكان للبحث عنه');
    }
  };

  // Initialize map when modal opens
  React.useEffect(() => {
    if (showMapModal) {
      setMapLoaded(false);

      // Load Google Maps script if not already loaded
      if (!(window as any).google?.maps) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg&libraries=places&language=ar&region=LY&callback=initStoreGoogleMaps&loading=async`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);

        // Global callback for when Google Maps loads
        (window as any).initStoreGoogleMaps = () => {

          initializeGoogleMap();
        };
      } else {
        // Google Maps already loaded, initialize immediately
        initializeGoogleMap();
      }
    }
  }, [showMapModal]);

  // Location form handlers
  const handleCreateLocation = () => {
    setLocationForm({
      name: '',
      location: '',
      city: '',
      region: '',
      manager: '',
      phone: '',
      email: '',
      isMain: false,
      isActive: true,
      coordinates: null,
    });
    setSelectedCoordinates(null);
    setGoogleMap(null);
    setMapMarker(null);
    setMapLoaded(false);
    setShowLocationModal(true);
  };

  const handleSaveLocation = () => {
    // Check if required fields are filled
    if (!locationForm.name.trim()) {
      alert('يرجى إدخال اسم الموقع');
      return;
    }

    if (!locationForm.city) {
      alert('يرجى اختيار المدينة');
      return;
    }

    if (!locationForm.location.trim()) {
      alert('يرجى إدخال موقع المكان');
      return;
    }

    // Allow saving even without coordinates (user can enter manually)
    if (!locationForm.coordinates) {
      const confirmWithoutLocation = confirm('لم يتم تحديد موقع المكان على الخريطة. هل تريد المتابعة بدون تحديد الموقع؟');
      if (!confirmWithoutLocation) {
        return;
      }
    }

    const newLocation = {
      id: Date.now().toString(),
      name: locationForm.name,
      address: `${locationForm.location}, ${locationForm.city}, ${locationForm.region}, Libya`,
      city: locationForm.city,
      region: locationForm.region,
      manager: locationForm.manager,
      phone: locationForm.phone,
      email: locationForm.email,
      status: locationForm.isActive ? 'نشط' : 'معطل',
      isMain: locationForm.isMain,
      longitude: locationForm.coordinates?.lng.toString() || '13.191338',
      latitude: locationForm.coordinates?.lat.toString() || '32.887209'
    };

    // Add the new location to the storeLocations array
    // Note: In a real app, this would be handled by state management or API call

    setShowLocationModal(false);

    // Reset form
    setLocationForm({
      name: '',
      location: '',
      city: '',
      region: '',
      manager: '',
      phone: '',
      email: '',
      isMain: false,
      isActive: true,
      coordinates: null,
    });
    setSelectedCoordinates(null);
    setGoogleMap(null);
    setMapMarker(null);
    setMapLoaded(false);

    // Success message
    const coordinatesText = locationForm.coordinates
      ? `📍 الإحداثيات: ${locationForm.coordinates.lat.toFixed(6)}, ${locationForm.coordinates.lng.toFixed(6)}`
      : '📍 الموقع: لم يتم تحديده';

    alert(`✅ تم إنشاء الموقع بنجاح!\n\n🏪 اسم الموقع: ${newLocation.name}\n📍 الموقع: ${newLocation.address}\n👨‍💼 المدير: ${locationForm.manager || 'غير محدد'}\n📞 الهاتف: ${locationForm.phone || 'غير محدد'}\n📧 البريد الإلكتروني: ${locationForm.email || 'غير محدد'}\n✅ الحالة: ${newLocation.status}\n${locationForm.isMain ? '🏠 موقع رئيسي' : '🏪 فرع'}\n${coordinatesText}`);
  };

  const handleMapLocationSelect = (coordinates: {lat: number, lng: number}) => {
    setSelectedCoordinates(coordinates);
    setLocationForm(prev => ({...prev, coordinates}));
    setShowMapModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-100 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header احترافي متطور */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 rounded-3xl p-8 text-white shadow-2xl"
        >
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-48 translate-x-48 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-white/5 to-transparent rounded-full translate-y-32 -translate-x-32 animate-pulse"></div>

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-2xl border border-white/20">
                <Settings className="h-8 w-8 text-green-300 drop-shadow-lg" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white via-emerald-100 to-green-100 bg-clip-text text-transparent">
                  ⚙️ إعدادات المتجر
                </h1>
                <p className="text-emerald-100/90 text-lg font-medium">
                  تخصيص وإدارة متجرك الإلكتروني بالكامل
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="store-settings" className="text-lg py-4">
              🏪 بيانات المتجر
            </TabsTrigger>
            <TabsTrigger value="store-interface" className="text-lg py-4">
              🎨 واجهة المتجر
            </TabsTrigger>
          </TabsList>

          {/* قسم بيانات المتجر */}
          <TabsContent value="store-settings" className="space-y-6">
            {/* بيانات المتجر الأساسية */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 border-blue-200 shadow-2xl hover:shadow-3xl transition-all duration-300">
                <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full -translate-y-16 -translate-x-16 animate-pulse"></div>
                <CardHeader className="relative">
                  <CardTitle className="flex items-center gap-3 text-2xl rtl-text">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg border border-blue-200/50">
                      <Building className="h-6 w-6 text-white drop-shadow-sm" />
                    </div>
                    <div className="rtl-text">
                      <span className="bg-gradient-to-l from-blue-700 to-indigo-700 bg-clip-text text-transparent font-bold rtl-text">
                        📋 بيانات المتجر الأساسية
                      </span>
                      <p className="text-sm text-blue-600 mt-1 font-normal rtl-text">
                        يرجى إدخال هذه البيانات لانها ستظهر في فاتورة المتجر، وستستخدم في عملية الشحن والتوصيل
                      </p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="storeName" className="text-right rtl-text">اسم المتجر</Label>
                      <Input
                        id="storeName"
                        defaultValue={localStoreData.name}
                        className="text-right rtl-text"
                        placeholder="أدخل اسم المتجر"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="storePhone" className="text-right rtl-text">رقم الهاتف</Label>
                      <Input
                        id="storePhone"
                        defaultValue={localStoreData.phone}
                        className="text-right rtl-text"
                        placeholder="09xxxxxxxx"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="storeAddress" className="text-right rtl-text">العنوان</Label>
                      <Input
                        id="storeAddress"
                        defaultValue={localStoreData.address}
                        className="text-right rtl-text"
                        placeholder="أدخل عنوان المتجر"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-right rtl-text">اختيار المدينة</Label>
                      <Select>
                        <SelectTrigger className="text-right rtl-text">
                          <SelectValue placeholder="اختر المدينة" />
                        </SelectTrigger>
                        <SelectContent>
                          {libyanCities.map((city) => (
                            <SelectItem key={city} value={city}>{city}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-right rtl-text">اختيار المنطقة</Label>
                      <Select>
                        <SelectTrigger className="text-right rtl-text">
                          <SelectValue placeholder="اختر المنطقة" />
                        </SelectTrigger>
                        <SelectContent>
                          {libyanRegions.map((region) => (
                            <SelectItem key={region} value={region}>{region}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex gap-4 rtl-text">
                    <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
                      <Save className="h-4 w-4 ml-2" />
                      حفظ البيانات
                    </Button>
                    <Button variant="outline">
                      إلغاء
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* تفعيل GPS Map */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100 border-green-200 shadow-2xl hover:shadow-3xl transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-full -translate-y-16 translate-x-16 animate-pulse"></div>
                <CardHeader className="relative">
                  <CardTitle className="flex items-center gap-3 text-2xl rtl-text">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg border border-green-200/50">
                      <MapPin className="h-6 w-6 text-white drop-shadow-sm" />
                    </div>
                    <div className="rtl-text">
                      <span className="bg-gradient-to-l from-green-700 to-emerald-700 bg-clip-text text-transparent font-bold rtl-text">
                        🗺️ تحديد الموقع الجغرافي
                      </span>
                      <p className="text-sm text-green-600 mt-1 font-normal rtl-text">
                        تحديد الموقع يتم بتفعيل GPS Map
                      </p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <div className="flex items-center justify-between p-6 bg-gray-50 rounded-xl">
                    <div className="text-right rtl-text">
                      <h3 className="font-semibold text-gray-800 rtl-text">تفعيل GPS Map</h3>
                      <p className="text-sm text-gray-600 rtl-text">اريد ان يتم ربطها بجوجل ماب لعرض الخريطة الجغرافية لتحديد الموقع</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600 rtl-text">Longitude | Altitude</span>
                      <Button
                        className={`${
                          isGPSEnabled
                            ? 'bg-green-500 hover:bg-green-600'
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                        onClick={() => setIsGPSEnabled(!isGPSEnabled)}
                      >
                        {isGPSEnabled ? (
                          <ToggleRight className="h-5 w-5 text-white ml-2" />
                        ) : (
                          <ToggleLeft className="h-5 w-5 text-white ml-2" />
                        )}
                        {isGPSEnabled ? 'مفعل' : 'معطل'}
                      </Button>
                    </div>
                  </div>

                  {isGPSEnabled && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-6 space-y-4"
                    >
                      {/* Location Selection Button */}
                      <div className="bg-white rounded-xl p-6 border-2 border-dashed border-green-300">
                        <div className="text-center text-green-600">
                          <MapPin className="h-16 w-16 mx-auto mb-4" />
                          <p className="text-lg font-semibold rtl-text">خريطة جوجل ماب التفاعلية</p>
                          <p className="text-sm rtl-text mt-2 mb-4">انقر على الموقع المطلوب من الخريطة لتحديد الموقع الجغرافي بدقة عالية</p>

                          {selectedCoordinates ? (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <span className="font-bold text-green-800 rtl-text">تم تحديد الموقع بنجاح!</span>
                              </div>
                              <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="bg-white p-2 rounded border">
                                  <span className="text-gray-600 block rtl-text">خط العرض:</span>
                                  <span className="font-mono text-gray-800">{selectedCoordinates.lat.toFixed(6)}</span>
                                </div>
                                <div className="bg-white p-2 rounded border">
                                  <span className="text-gray-600 block rtl-text">خط الطول:</span>
                                  <span className="font-mono text-gray-800">{selectedCoordinates.lng.toFixed(6)}</span>
                                </div>
                              </div>
                              <p className="text-xs text-green-700 mt-2 rtl-text">
                                📍 سيتم حفظ إحداثيات GPS هذه مع بيانات المتجر
                              </p>
                            </div>
                          ) : (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                              <p className="text-sm text-blue-800 rtl-text">
                                يرجى فتح الخريطة وتحديد موقع المتجر بالنقر على المكان المطلوب
                              </p>
                            </div>
                          )}

                          <Button
                            className="bg-green-500 hover:bg-green-600"
                            onClick={() => setShowMapModal(true)}
                          >
                            <MapPin className="h-4 w-4 mr-2" />
                            فتح الخريطة وتحديد الموقع
                          </Button>
                        </div>
                      </div>

                      {/* Manual Coordinate Input */}
                      <div className="bg-gray-50 rounded-xl p-6">
                        <h4 className="font-bold text-gray-800 mb-4 rtl-text">أو أدخل الإحداثيات يدوياً:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm text-gray-600 rtl-text">خط العرض (Latitude)</Label>
                            <Input
                              type="number"
                              step="any"
                              placeholder="32.8872"
                              className="text-sm"
                              onChange={(e) => {
                                const lat = parseFloat(e.target.value);
                                if (lat) {
                                  setSelectedCoordinates(prev => ({ lat, lng: prev?.lng || 13.1913 }));
                                }
                              }}
                            />
                          </div>
                          <div>
                            <Label className="text-sm text-gray-600 rtl-text">خط الطول (Longitude)</Label>
                            <Input
                              type="number"
                              step="any"
                              placeholder="13.1913"
                              className="text-sm"
                              onChange={(e) => {
                                const lng = parseFloat(e.target.value);
                                if (lng) {
                                  setSelectedCoordinates(prev => ({ lat: prev?.lat || 32.8872, lng }));
                                }
                              }}
                            />
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 rtl-text">مثال: طرابلس (32.8872, 13.1913)</p>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* عناوين المتجر */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-100 border-purple-200 shadow-2xl hover:shadow-3xl transition-all duration-300">
                <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-violet-500/20 rounded-full -translate-y-16 -translate-x-16 animate-pulse"></div>
                <CardHeader className="relative">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3 text-2xl rtl-text">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg border border-purple-200/50">
                        <MapPin className="h-6 w-6 text-white drop-shadow-sm" />
                      </div>
                      <div className="rtl-text">
                        <span className="bg-gradient-to-l from-purple-700 to-violet-700 bg-clip-text text-transparent font-bold rtl-text">
                          📍 عناوين المتجر
                        </span>
                        <p className="text-sm text-purple-600 mt-1 font-normal rtl-text">
                          تشمل القوائم بالأسفل عناوين المتجر الرئيسي والفروع
                        </p>
                      </div>
                    </CardTitle>
                    <Button
                      className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700"
                      onClick={handleCreateLocation}
                    >
                      <Plus className="h-4 w-4 ml-2" />
                      إضافة موقع جديد
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="relative space-y-4">
                  {storeLocations.map((location, index) => (
                    <motion.div
                      key={location.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-100 shadow-xl hover:shadow-2xl transition-all duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-violet-500 rounded-xl flex items-center justify-center shadow-lg">
                            <MapPin className="h-6 w-6 text-white" />
                          </div>
                          <div className="text-right rtl-text">
                            <h3 className="font-bold text-gray-800 rtl-text">{location.name}</h3>
                            <p className="text-sm text-gray-600 rtl-text">{location.address}</p>
                            <div className="flex items-center gap-2 mt-2">
                              {location.isMain && (
                                <Badge className="bg-purple-100 text-purple-700 px-2 py-1 text-xs rtl-text">
                                  أساسي
                                </Badge>
                              )}
                              <Badge className={`px-2 py-1 text-xs rtl-text ${
                                location.status === 'نشط' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                              }`}>
                                {location.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* قسم واجهة المتجر */}
          <TabsContent value="store-interface" className="space-y-6">
            {/* قوالب المتجر */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50 to-teal-100 border-emerald-200 shadow-2xl hover:shadow-3xl transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-green-500/20 rounded-full -translate-y-16 translate-x-16 animate-pulse"></div>
                <CardHeader className="relative">
                  <CardTitle className="flex items-center gap-3 text-2xl rtl-text">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg border border-emerald-200/50">
                      <PaletteIcon className="h-6 w-6 text-white drop-shadow-sm" />
                    </div>
                    <div className="rtl-text">
                      <span className="bg-gradient-to-l from-emerald-700 to-green-700 bg-clip-text text-transparent font-bold rtl-text">
                        🎨 قوالب المتجر
                      </span>
                      <p className="text-sm text-emerald-600 mt-1 font-normal rtl-text">
                        اختر القالب المناسب لمتجرك الإلكتروني
                      </p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* مفعل */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                      className="relative overflow-hidden bg-white rounded-2xl p-6 border-2 border-emerald-200 shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer"
                    >
                      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-emerald-400/20 to-green-400/20 rounded-full -translate-y-8 translate-x-8 group-hover:scale-125 transition-transform duration-300"></div>
                      <div className="relative text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                          <Monitor className="h-10 w-10 text-white drop-shadow-sm" />
                        </div>
                        <h3 className="font-bold text-lg text-gray-800 mb-2">مفعل</h3>
                        <p className="text-sm text-gray-600 mb-4">قالب احترافي متكامل</p>
                        <Button className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700">
                          مفعل حالياً
                        </Button>
                      </div>
                    </motion.div>

                    {/* محترف */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 }}
                      className="relative overflow-hidden bg-white rounded-2xl p-6 border-2 border-blue-200 shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer hover:border-blue-300"
                    >
                      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full -translate-y-8 translate-x-8 group-hover:scale-125 transition-transform duration-300"></div>
                      <div className="relative text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                          <Crown className="h-10 w-10 text-white drop-shadow-sm" />
                        </div>
                        <h3 className="font-bold text-lg text-gray-800 mb-2">محترف</h3>
                        <p className="text-sm text-gray-600 mb-4">قالب متقدم بميزات إضافية</p>
                        <Button variant="outline" className="w-full border-blue-200 hover:bg-blue-50">
                          تعديل
                        </Button>
                      </div>
                    </motion.div>

                    {/* بسيط (قريباً) */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 }}
                      className="relative overflow-hidden bg-gray-50 rounded-2xl p-6 border-2 border-gray-200 shadow-xl opacity-60"
                    >
                      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-gray-400/20 to-slate-400/20 rounded-full -translate-y-8 translate-x-8"></div>
                      <div className="relative text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-gray-400 to-slate-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                          <Clock className="h-10 w-10 text-white drop-shadow-sm" />
                        </div>
                        <h3 className="font-bold text-lg text-gray-600 mb-2">بسيط</h3>
                        <p className="text-sm text-gray-500 mb-4">(قريباً)</p>
                        <Button disabled className="w-full">
                          قريباً
                        </Button>
                      </div>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* العناوين والوصف */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 border-amber-200 shadow-2xl hover:shadow-3xl transition-all duration-300">
                <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-full -translate-y-16 -translate-x-16 animate-pulse"></div>
                <CardHeader className="relative">
                  <CardTitle className="flex items-center gap-3 text-2xl rtl-text">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg border border-amber-200/50">
                      <Type className="h-6 w-6 text-white drop-shadow-sm" />
                    </div>
                    <div className="rtl-text">
                      <span className="bg-gradient-to-l from-amber-700 to-orange-700 bg-clip-text text-transparent font-bold rtl-text">
                        📝 العناوين والوصف
                      </span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="storeTitle" className="text-right rtl-text">اسم المتجر</Label>
                      <Input
                        id="storeTitle"
                        defaultValue={localStoreData.name}
                        className="text-right rtl-text"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="workingHours" className="text-right rtl-text">ساعات التواصل</Label>
                      <Input
                        id="workingHours"
                        defaultValue={localStoreData.workingHours}
                        className="text-right rtl-text"
                        placeholder="مثال: 24/7"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-right rtl-text">الهاتف</Label>
                      <Input
                        id="phone"
                        defaultValue={localStoreData.phone}
                        className="text-right rtl-text"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-right rtl-text">البريد الإلكتروني (اختياري)</Label>
                      <Input
                        id="email"
                        defaultValue={localStoreData.email}
                        className="text-right rtl-text"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address" className="text-right rtl-text">العناوين</Label>
                      <Input
                        id="address"
                        defaultValue={localStoreData.address}
                        className="text-right rtl-text"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="about" className="text-right rtl-text">من نحن</Label>
                      <Textarea
                        id="about"
                        defaultValue={localStoreData.about}
                        className="text-right rtl-text min-h-[120px]"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="copyright" className="text-right rtl-text">حقوق النشر</Label>
                      <Input
                        id="copyright"
                        defaultValue={localStoreData.copyright}
                        className="text-right rtl-text"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 rtl-text">
                    <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700">
                      <Save className="h-4 w-4 ml-2" />
                      حفظ التغييرات
                    </Button>
                    <Button variant="outline">
                      إلغاء
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* SEO Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-100 border-indigo-200 shadow-2xl hover:shadow-3xl transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-400/20 to-blue-500/20 rounded-full -translate-y-16 translate-x-16 animate-pulse"></div>
                <CardHeader className="relative">
                  <CardTitle className="flex items-center gap-3 text-2xl rtl-text">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg border border-indigo-200/50">
                      <GlobeIcon className="h-6 w-6 text-white drop-shadow-sm" />
                    </div>
                    <div className="rtl-text">
                      <span className="bg-gradient-to-l from-indigo-700 to-blue-700 bg-clip-text text-transparent font-bold rtl-text">
                        🔍 إعدادات SEO
                      </span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="seoTitle" className="text-right rtl-text">عنوان SEO</Label>
                      <Input
                        id="seoTitle"
                        defaultValue={localStoreData.seoTitle}
                        className="text-right rtl-text"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="seoDescription" className="text-right rtl-text">الوصف الخاص بالـ SEO</Label>
                      <Textarea
                        id="seoDescription"
                        defaultValue={localStoreData.seoDescription}
                        className="text-right rtl-text min-h-[100px]"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 rtl-text">الصور</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Logo Upload */}
                      <div className="space-y-2">
                        <Label className="text-right rtl-text">الشعار</Label>
                        <div
                          className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors cursor-pointer"
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, 'logo')}
                          onClick={() => document.getElementById('logo-upload')?.click()}
                        >
                          {logoPreview ? (
                            <div className="space-y-3">
                              <img
                                src={logoPreview}
                                alt="Logo Preview"
                                className="h-16 w-16 object-contain mx-auto rounded-lg"
                              />
                              <p className="text-sm text-green-600 rtl-text">✅ تم رفع الشعار بنجاح</p>
                              <div className="text-xs text-gray-500">
                                <p>الحجم: {(logoFile?.size ? (logoFile.size / 1024).toFixed(1) : 0)} كيلوبايت</p>
                                <p>النوع: {logoFile?.type}</p>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <ImageIcon className="h-12 w-12 mx-auto text-gray-400" />
                              <p className="text-sm text-gray-600 rtl-text">اسحب الشعار هنا أو انقر للاختيار</p>
                              <p className="text-xs text-gray-500 rtl-text">PNG, JPEG, JPG (حجم أقصى 2MB)</p>
                            </div>
                          )}
                          <input
                            id="logo-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            aria-label="رفع شعار المتجر"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(file, 'logo');
                            }}
                          />
                        </div>
                        {logoPreview && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => {
                              setLogoFile(null);
                              setLogoPreview('');
                            }}
                          >
                            <X className="h-4 w-4 mr-2" />
                            إزالة الشعار
                          </Button>
                        )}
                      </div>

                      {/* Favicon Upload */}
                      <div className="space-y-2">
                        <Label className="text-right rtl-text">أيقونة المتصفح (Favicon)</Label>
                        <div
                          className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors cursor-pointer"
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, 'favicon')}
                          onClick={() => document.getElementById('favicon-upload')?.click()}
                        >
                          {faviconPreview ? (
                            <div className="space-y-3">
                              <img
                                src={faviconPreview}
                                alt="Favicon Preview"
                                className="h-12 w-12 object-contain mx-auto rounded-lg"
                              />
                              <p className="text-sm text-green-600 rtl-text">✅ تم رفع الأيقونة بنجاح</p>
                              <div className="text-xs text-gray-500">
                                <p>الحجم: {(faviconFile?.size ? (faviconFile.size / 1024).toFixed(1) : 0)} كيلوبايت</p>
                                <p className="text-xs text-gray-500">مربعة 32x32 بكسل مثالية</p>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <ImageIcon className="h-12 w-12 mx-auto text-gray-400" />
                              <p className="text-sm text-gray-600 rtl-text">اسحب الأيقونة هنا أو انقر للاختيار</p>
                              <p className="text-xs text-gray-500 rtl-text">PNG, JPEG, JPG (مربعة 32x32 بكسل)</p>
                            </div>
                          )}
                          <input
                            id="favicon-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            aria-label="رفع أيقونة المتصفح"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(file, 'favicon');
                            }}
                          />
                        </div>
                        {faviconPreview && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => {
                              setFaviconFile(null);
                              setFaviconPreview('');
                            }}
                          >
                            <X className="h-4 w-4 mr-2" />
                            إزالة الأيقونة
                          </Button>
                        )}
                      </div>

                      {/* SEO Image Upload */}
                      <div className="space-y-2">
                        <Label className="text-right rtl-text">صورة SEO خاصة بنشر روابط المتجر</Label>
                        <div
                          className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors cursor-pointer"
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, 'seoImage')}
                          onClick={() => document.getElementById('seo-image-upload')?.click()}
                        >
                          {seoImagePreview ? (
                            <div className="space-y-3">
                              <img
                                src={seoImagePreview}
                                alt="SEO Image Preview"
                                className="h-20 w-full object-cover mx-auto rounded-lg"
                              />
                              <p className="text-sm text-green-600 rtl-text">✅ تم رفع صورة SEO بنجاح</p>
                              <div className="text-xs text-gray-500">
                                <p>الحجم: {(seoImageFile?.size ? (seoImageFile.size / 1024).toFixed(1) : 0)} كيلوبايت</p>
                                <p className="text-xs text-gray-500">تظهر عند مشاركة روابط المتجر</p>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <ImageIcon className="h-12 w-12 mx-auto text-gray-400" />
                              <p className="text-sm text-gray-600 rtl-text">اسحب صورة SEO هنا أو انقر للاختيار</p>
                              <p className="text-xs text-gray-500 rtl-text">PNG, JPEG, JPG (1200x630 بكسل مثالية)</p>
                            </div>
                          )}
                          <input
                            id="seo-image-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            aria-label="رفع صورة تحسين محركات البحث"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(file, 'seoImage');
                            }}
                          />
                        </div>
                        {seoImagePreview && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => {
                              setSeoImageFile(null);
                              setSeoImagePreview('');
                            }}
                          >
                            <X className="h-4 w-4 mr-2" />
                            إزالة الصورة
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Image Upload Guidelines */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-bold text-blue-900 mb-2 rtl-text">📋 إرشادات رفع الصور:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-800">
                        <div>
                          <p className="font-medium rtl-text">الشعار:</p>
                          <p className="text-xs rtl-text">• أبعاد مثالية: 200x80 بكسل</p>
                          <p className="text-xs rtl-text">• صيغة: PNG شفاف أو JPEG</p>
                        </div>
                        <div>
                          <p className="font-medium rtl-text">أيقونة المتصفح:</p>
                          <p className="text-xs rtl-text">• أبعاد مثالية: 32x32 بكسل</p>
                          <p className="text-xs rtl-text">• يجب أن تكون الصورة مربعة</p>
                        </div>
                        <div>
                          <p className="font-medium rtl-text">صورة SEO:</p>
                          <p className="text-xs rtl-text">• أبعاد مثالية: 1200x630 بكسل</p>
                          <p className="text-xs rtl-text">• تظهر عند مشاركة الروابط</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 rtl-text">
                    <Button className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700">
                      <Save className="h-4 w-4 ml-2" />
                      حفظ إعدادات SEO
                    </Button>
                    <Button variant="outline">
                      إلغاء
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* طرق الدفع */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="relative overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-purple-100 border-rose-200 shadow-2xl hover:shadow-3xl transition-all duration-300">
                <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-rose-400/20 to-pink-500/20 rounded-full -translate-y-16 -translate-x-16 animate-pulse"></div>
                <CardHeader className="relative">
                  <CardTitle className="flex items-center gap-3 text-2xl rtl-text">
                    <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg border border-rose-200/50">
                      <CreditCard className="h-6 w-6 text-white drop-shadow-sm" />
                    </div>
                    <div className="rtl-text">
                      <span className="bg-gradient-to-l from-rose-700 to-pink-700 bg-clip-text text-transparent font-bold rtl-text">
                        💳 طرق الدفع
                      </span>
                      <p className="text-sm text-rose-600 mt-1 font-normal rtl-text">
                        العنوان: نقبل الدفع عبر
                      </p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <div className="text-right rtl-text mb-6">
                    <h3 className="font-semibold text-gray-800 rtl-text">طرق الدفع المتاحة</h3>
                    <p className="text-sm text-gray-600 rtl-text mt-1">يمكنك رفع أيقونات مخصصة لطرق الدفع الخاصة بك</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[
                      { id: 1, name: 'تحويل مصرفي', color: 'bg-blue-100 text-blue-800' },
                      { id: 2, name: 'عند الاستلام', color: 'bg-green-100 text-green-800' },
                      { id: 3, name: 'المحفظة الرقمية', color: 'bg-purple-100 text-purple-800' },
                      { id: 4, name: 'بطاقة ائتمان', color: 'bg-orange-100 text-orange-800' },
                      { id: 5, name: 'أقساط', color: 'bg-pink-100 text-pink-800' }
                    ].map((payment) => (
                      <div key={payment.id} className="relative group">
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-blue-400 transition-all duration-200 cursor-pointer">
                          <div className="relative">
                            {/* Credit Card Icon - Always Purple */}
                            <div className="w-12 h-12 mx-auto mb-2 bg-purple-100 rounded-lg flex items-center justify-center">
                              <CreditCard className="h-6 w-6 text-purple-600" />
                            </div>
                            <Badge className={`text-xs ${payment.color} mb-2`}>
                              {payment.name}
                            </Badge>
                            <p className="text-xs text-gray-600 rtl-text">انقر لرفع أيقونة مخصصة</p>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id={`payment-${payment.id}`}
                            aria-label={`رفع أيقونة ${payment.name}`}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {

                                // Here you would handle the file upload for payment method icons
                              }
                            }}
                          />
                          <div
                            className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-blue-500/10"
                            onClick={() => document.getElementById(`payment-${payment.id}`)?.click()}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 text-center">
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 inline-block">
                      <div className="flex items-center gap-2 text-purple-800">
                        <CreditCard className="h-5 w-5" />
                        <span className="text-sm font-medium rtl-text">أيقونة 💳 محجوزة باللون البنفسجي للبطاقات الائتمانية</span>
                      </div>
                      <p className="text-xs text-purple-600 mt-1 rtl-text">لا يمكن تغيير لون أو شكل هذه الأيقونة</p>
                    </div>
                  </div>

                  <div className="mt-4 text-center">
                    <Button variant="outline" className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 hover:from-blue-100 hover:to-purple-100">
                      <Plus className="h-4 w-4 ml-2" />
                      إضافة طريقة دفع جديدة
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* النافذة الإعلانية المنبثقة */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="relative overflow-hidden bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-100 border-violet-200 shadow-2xl hover:shadow-3xl transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-400/20 to-purple-500/20 rounded-full -translate-y-16 translate-x-16 animate-pulse"></div>
                <CardHeader className="relative">
                  <CardTitle className="flex items-center gap-3 text-2xl rtl-text">
                    <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg border border-violet-200/50">
                      <Zap className="h-6 w-6 text-white drop-shadow-sm" />
                    </div>
                    <div className="rtl-text">
                      <span className="bg-gradient-to-l from-violet-700 to-purple-700 bg-clip-text text-transparent font-bold rtl-text">
                        📢 النافذة الإعلانية المنبثقة
                      </span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="text-right rtl-text">
                          <h3 className="font-semibold text-gray-800 rtl-text">تمكين من العرض ؟</h3>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-600 rtl-text">لا</span>
                          <div className="relative">
                            <input type="checkbox" className="sr-only" aria-label="تبديل عرض النافذة الإعلانية" />
                            <div className="w-10 h-6 bg-gray-300 rounded-full relative">
                              <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 transition-transform"></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-right rtl-text">زمن تأخر عرض النافذة (ثواني)</Label>
                        <Input
                          type="number"
                          defaultValue="10"
                          className="text-right rtl-text"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-right rtl-text">رسالة الترحيب</Label>
                        <Textarea
                          defaultValue="أهلا بك في متجر نواعم التجريبي"
                          className="text-right rtl-text min-h-[100px]"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-right rtl-text">الصورة الدعائية المستخدمة</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                          <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600 rtl-text">معاينة الصورة</p>
                          <Button variant="outline" size="sm" className="mt-2">
                            اختيار صورة
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 rtl-text">
                    <Button className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700">
                      <Save className="h-4 w-4 ml-2" />
                      حفظ الإعدادات
                    </Button>
                    <Button variant="outline">
                      إلغاء
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

        <TabsContent value="pages" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>إدارة الصفحات</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="البحث في الصفحات..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 ml-2" />
                    تصدير
                  </Button>
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                    <Plus className="h-4 w-4 ml-2" />
                    إضافة صفحة
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredPages.map((page) => (
                  <div key={page.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{page.name}</h3>
                        <p className="text-sm text-gray-600">تم الإنشاء: {page.createdAt}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(page.status)}
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="menus" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Menu className="h-5 w-5" />
                  تعديل القائمة الرئيسية للمتجر
                </CardTitle>
                <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة رابط
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>العنوان</Label>
                    <Input placeholder="العنوان" />
                  </div>
                  <div>
                    <Label>URL الرابط</Label>
                    <Input placeholder="http://" />
                  </div>
                  <div>
                    <Label>مكان العرض</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر المكان" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="header">القائمة العلوية</SelectItem>
                        <SelectItem value="footer">القائمة السفلية</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="open-new-tab" />
                    <Label htmlFor="open-new-tab">فتح الرابط في نفس الصفحة</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>الصفحات</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {pages.map((page) => (
                      <div key={page.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">{page.name}</span>
                        <Button variant="outline" size="sm">
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>التصنيفات</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">العطور</span>
                      <Button variant="outline" size="sm">
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">الملابس النسائية</span>
                      <Button variant="outline" size="sm">
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>هيكل القائمة</Label>
                  <div className="space-y-2">
                    {menuItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                        <span className="text-sm font-medium">{item.title}</span>
                        <Badge variant="outline">{item.type}</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                    <Save className="h-4 w-4 ml-2" />
                    النشر و الحفظ
                  </Button>
                  <Button variant="outline">
                    <Settings className="h-4 w-4 ml-2" />
                    استعادة القائمة الإفتراضية
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sliders" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>إدارة السلايدرز</CardTitle>
                <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة سلايدر
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sliders.map((slider) => (
                  <div key={slider.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Layout className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{slider.name}</h3>
                        <p className="text-sm text-gray-600">تم الإنشاء: {slider.createdAt}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(slider.status)}
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ads" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>إدارة الاعلانات</CardTitle>
                <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة اعلان
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {advertisements.map((ad) => (
                  <div key={ad.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <ImageIcon className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{ad.name}</h3>
                          <p className="text-sm text-gray-600">{ad.visits} زيارة • انتهاء: {ad.expiryDate}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(ad.isActive ? 'active' : 'inactive')}
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        </Tabs>
      </div>

      {/* Google Maps Location Selection Modal */}
      {showMapModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-2xl p-6 w-full max-w-4xl mx-4 shadow-2xl border max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 rtl-text">اختر موقع المتجر من الخريطة</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMapModal(false)}
                className="hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              {/* Search Box */}
              <div className="relative">
                <Input
                  id="store-map-search"
                  placeholder="ابحث عن الموقع في ليبيا..."
                  className="pr-10"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleMapSearch();
                    }
                  }}
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 cursor-pointer" onClick={handleMapSearch} />
              </div>

              {/* Map Container */}
              <div className="relative bg-gray-100 rounded-lg overflow-hidden h-[450px]">
                {!mapLoaded ? (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <h4 className="text-xl font-bold text-gray-800 mb-2 rtl-text">جاري تحميل خريطة Google Maps</h4>
                      <p className="text-gray-600 mb-2 rtl-text">يرجى الانتظار قليلاً...</p>
                      <div className="flex justify-center items-center gap-1 text-sm text-gray-500">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    id="store-google-map"
                    className="w-full h-full min-h-[450px]"
                  ></div>
                )}
              </div>

              {/* Selected Location Info */}
              {selectedCoordinates && (
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <h4 className="font-bold text-green-900 rtl-text">✅ تم تحديد الموقع بنجاح!</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="bg-white p-2 rounded border">
                      <span className="text-gray-600 block rtl-text">خط العرض (Latitude):</span>
                      <span className="font-mono font-bold text-gray-800">{selectedCoordinates.lat.toFixed(6)}</span>
                    </div>
                    <div className="bg-white p-2 rounded border">
                      <span className="text-gray-600 block rtl-text">خط الطول (Longitude):</span>
                      <span className="font-mono font-bold text-gray-800">{selectedCoordinates.lng.toFixed(6)}</span>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-green-700 rtl-text">
                    📍 سيتم حفظ إحداثيات GPS هذه مع بيانات المتجر
                  </div>
                </div>
              )}

              {/* Map Actions */}
              <div className="flex gap-3">
                <Button
                  onClick={() => setShowMapModal(false)}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  تأكيد الموقع المختار
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowMapModal(false)}
                  className="transition-all duration-200 hover:bg-gray-50"
                >
                  إلغاء
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Location Creation Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4 shadow-2xl border">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 rtl-text">إضافة موقع جديد</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowLocationModal(false)}
                className="hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="location-name" className="rtl-text">اسم الموقع *</Label>
                <Input
                  id="location-name"
                  value={locationForm.name}
                  onChange={(e) => setLocationForm({ ...locationForm, name: e.target.value })}
                  placeholder="مثال: فرع طرابلس الرئيسي"
                  className="rtl-text"
                />
              </div>

              <div>
                <Label htmlFor="location-city" className="rtl-text">المدينة *</Label>
                <Select
                  value={locationForm.city}
                  onValueChange={(value) => setLocationForm({ ...locationForm, city: value })}
                >
                  <SelectTrigger className="w-full rtl-text" id="location-city">
                    <SelectValue placeholder="اختر المدينة" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 z-[9999]">
                    {libyanCities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="location-region" className="rtl-text">المنطقة</Label>
                <Select
                  value={locationForm.region}
                  onValueChange={(value) => setLocationForm({ ...locationForm, region: value })}
                >
                  <SelectTrigger className="w-full rtl-text" id="location-region">
                    <SelectValue placeholder="اختر المنطقة" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 z-[9999]">
                    {libyanRegions.map((region) => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="location-manager" className="rtl-text">مدير الموقع</Label>
                <Input
                  id="location-manager"
                  value={locationForm.manager}
                  onChange={(e) => setLocationForm({ ...locationForm, manager: e.target.value })}
                  placeholder="اسم مدير الموقع"
                  className="rtl-text"
                />
              </div>

              <div>
                <Label htmlFor="location-phone" className="rtl-text">رقم موبايل مسؤول الموقع</Label>
                <Input
                  id="location-phone"
                  value={locationForm.phone}
                  onChange={(e) => setLocationForm({ ...locationForm, phone: e.target.value })}
                  placeholder="+218911234567"
                  className="rtl-text"
                />
              </div>

              <div>
                <Label htmlFor="location-email" className="rtl-text">البريد الإلكتروني</Label>
                <Input
                  id="location-email"
                  type="email"
                  value={locationForm.email}
                  onChange={(e) => setLocationForm({ ...locationForm, email: e.target.value })}
                  placeholder="location@eshro.com"
                  className="rtl-text"
                />
              </div>

              <div>
                <Label htmlFor="location-address" className="rtl-text">مكان الموقع *</Label>
                <div className="space-y-3">
                  <div className="space-y-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowMapModal(true)}
                      className="w-full justify-start text-right h-12 border-2 hover:border-blue-400 transition-colors rtl-text"
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      {selectedCoordinates ? (
                        <div className="text-right">
                          <div className="font-bold text-green-600 rtl-text">✅ تم تحديد الموقع بنجاح</div>
                          <div className="text-xs text-gray-600 rtl-text">إحداثيات GPS: {selectedCoordinates.lat.toFixed(6)}, {selectedCoordinates.lng.toFixed(6)}</div>
                        </div>
                      ) : (
                        '🗺️ اختر موقع المكان من الخريطة (مطلوب)'
                      )}
                    </Button>

                    {/* Manual coordinate input as fallback */}
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 mb-2 rtl-text">أو أدخل الإحداثيات يدوياً:</p>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs text-gray-600 rtl-text">خط العرض (Latitude)</Label>
                          <Input
                            type="number"
                            step="any"
                            placeholder="32.8872"
                            className="text-sm"
                            onChange={(e) => {
                              const lat = parseFloat(e.target.value);
                              if (lat) {
                                const newCoordinates = { lat, lng: selectedCoordinates?.lng || 13.1913 };
                                setSelectedCoordinates(newCoordinates);
                                setLocationForm(prev => ({ ...prev, coordinates: newCoordinates }));
                              }
                            }}
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-gray-600 rtl-text">خط الطول (Longitude)</Label>
                          <Input
                            type="number"
                            step="any"
                            placeholder="13.1913"
                            className="text-sm"
                            onChange={(e) => {
                              const lng = parseFloat(e.target.value);
                              if (lng) {
                                const newCoordinates = { lat: selectedCoordinates?.lat || 32.8872, lng };
                                setSelectedCoordinates(newCoordinates);
                                setLocationForm(prev => ({ ...prev, coordinates: newCoordinates }));
                              }
                            }}
                          />
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 rtl-text">مثال: طرابلس (32.8872, 13.1913)</p>
                    </div>
                  </div>

                  {selectedCoordinates && (
                    <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-bold text-green-800 rtl-text">تم تحديد الموقع</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="bg-white p-2 rounded border">
                          <span className="text-gray-600 block rtl-text">خط العرض:</span>
                          <span className="font-mono text-gray-800">{selectedCoordinates.lat.toFixed(6)}</span>
                        </div>
                        <div className="bg-white p-2 rounded border">
                          <span className="text-gray-600 block rtl-text">خط الطول:</span>
                          <span className="font-mono text-gray-800">{selectedCoordinates.lng.toFixed(6)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="location-address-detail" className="rtl-text">تفاصيل عنوان الموقع</Label>
                <Textarea
                  id="location-address-detail"
                  value={locationForm.location}
                  onChange={(e) => setLocationForm({ ...locationForm, location: e.target.value })}
                  placeholder="أدخل تفاصيل دقيقة للموقع مثل: مقابل المسجد، بجانب المدرسة، الطابق الثاني..."
                  className="rtl-text"
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="location-main"
                  checked={locationForm.isMain}
                  onCheckedChange={(checked) => setLocationForm({ ...locationForm, isMain: checked as boolean })}
                />
                <Label htmlFor="location-main" className="rtl-text">تعيين كموقع رئيسي للمتجر</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="location-active"
                  checked={locationForm.isActive}
                  onCheckedChange={(checked) => setLocationForm({ ...locationForm, isActive: checked as boolean })}
                />
                <Label htmlFor="location-active" className="rtl-text">تفعيل هذا الموقع</Label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleSaveLocation}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                disabled={!locationForm.name.trim() || !locationForm.city || !locationForm.location.trim()}
              >
                <Plus className="h-4 w-4 mr-2" />
                حفظ الموقع الجديد
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowLocationModal(false)}
                className="transition-all duration-200 hover:bg-gray-50"
              >
                إلغاء
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { StoreSettingsView };
