/**
 * ?? LogisticsManagement - ????? ????? ????? ????????
 * ???? ??????? ????? ????
 * 
 * ????????:
 * - ??? ????? ????? ?? ?????? ?????
 * - ????? ???? ??? ????? ?? ??? ??????
 * - ????? ?????? ???????
 * - ????? ?????? ??? OpenStreetMap
 * - ????? responsive ??????
 */

import React, { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Edit, Image as ImageIcon, Mail, MapPin, Phone, Plus, Save, Trash2, Upload, X
} from 'lucide-react';

// ????? ?????? Leaflet
if (typeof window !== 'undefined') {
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-shadow.png',
  });
}

// ???? ?????? ????? ??? ???????
const MapClickHandler = ({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) => {
  useMapEvents({
    click: (e) => {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

// ????? ????????
interface ShippingCompany {
  id: number;
  name: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  lat: number;
  lng: number;
  logo: string;
}

// ????? ????? ???????
const libyanCities = [
  '??????', '??????', '??????', '???????', '???????', '?????', 
  '??????', '?????', '?????', '???', '????', '????'
];

const LOGISTICS_FALLBACK_ICON = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMTI4IDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0xMiAyMGMwLTQuNDI5IDIuNjUxLTguNDQzIDYuNzEzLTEwLjMzTDU5LjA4NCAyLjYzOUM2MS43OTYgMS4zNzIgNjQuNzQ4IDAgNjcuOTk5IDBoNTguMDAyQzEyNy4zOTcgMCAxMzIgNC42MDMgMTMyIDEwLjI1NHY1OS40OTJDMTEzLjMzMiA3NS4zMzUgOTQuMzg3IDgwIDc1LjUwMiA4MEg1Mi41Yy02LjAyOCAwLTEyLjA0LTIuMTc3LTE2LjczNC02LjA4OEwxNC4wNTIgNjMuNzA0QzExLjQxMiA2MS42NzQgMTAuMDAyIDU4LjY1OCAxMCA1NS40NTJWMjB6IiBmaWxsPSIjZjNmNGY5Ii8+PHRleHQgeD0iNjQiIHk9IjUwIiBmb250LXNpemU9IjI0IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtd2VpZ2h0PSI3MDAiIGZpbGw9IiM1NjU2NTYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk5PIElDT048L3RleHQ+PC9zdmc+';

export default function LogisticsManagement() {
  // ???? ???????
  const [shippingCompanies, setShippingCompanies] = useState<ShippingCompany[]>([
    { 
      id: 1, 
      name: '????', 
      phone: '+218 91 000 0001', 
      email: 'info@hudhud.ly', 
      city: '??????',
      address: '??????? ?????',
      lat: 32.8872, 
      lng: 13.1913,
      logo: '/assets/partners/transport/hudhud.jpeg'
    },
    { 
      id: 2, 
      name: '?? ??? ??', 
      phone: '+218 91 000 0002', 
      email: 'info@dhl.ly', 
      city: '??????',
      address: '??????? ?????',
      lat: 32.8872, 
      lng: 13.1913,
      logo: '/assets/partners/transport/dhl.png'
    },
    { 
      id: 3, 
      name: '??????', 
      phone: '+218 91 000 0003', 
      email: 'info@aramex.ly', 
      city: '??????',
      address: '??????? ?????',
      lat: 32.8872, 
      lng: 13.1913,
      logo: '/assets/partners/transport/aramex.webp'
    }
  ]);

  // ???? ???????
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentCompany, setCurrentCompany] = useState<ShippingCompany | null>(null);
  
  // ???? ???????
  const [form, setForm] = useState({
    name: '',
    phone: '',
    mobilePhone: '',
    email: '',
    city: '',
    address: '',
    lat: '',
    lng: '',
    logo: ''
  });

  // ???? ???????
  const [showMap, setShowMap] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);

  // ??? ??????
  const [logoPreview, setLogoPreview] = useState<string>('');

  // ????? ??? ??????
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // ?????? ?? ??? ?????
      const allowedTypes = ['image/webp', 'image/jpeg', 'image/jpg', 'image/bmp'];
      if (!allowedTypes.includes(file.type)) {
        alert('????? ?????? ???? ????? WEBP, JPG, JPEG, ?? BMP');
        return;
      }

      // ?????? ??????
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
        setForm({ ...form, logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // ????? ?????? ?????? ?? ???????
  const handleLocationSelect = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
    setForm({ 
      ...form, 
      lat: lat.toFixed(8), 
      lng: lng.toFixed(8) 
    });
  };

  // ??? ???? ??? ?????
  const handleAddCompany = () => {
    if (!form.name || !form.phone || !form.email) {
      alert('???? ??? ???? ?????? ????????');
      return;
    }

    const newCompany: ShippingCompany = {
      id: Date.now(),
      name: form.name,
      phone: form.phone,
      email: form.email,
      city: form.city,
      address: form.address,
      lat: parseFloat(form.lat) || 32.8872,
      lng: parseFloat(form.lng) || 13.1913,
      logo: form.logo || LOGISTICS_FALLBACK_ICON
    };

    setShippingCompanies([...shippingCompanies, newCompany]);
    resetForm();
    setShowAddModal(false);
  };

  // ????? ???? ???
  const handleUpdateCompany = () => {
    if (!currentCompany) return;

    const updatedCompanies = shippingCompanies.map(company => 
      company.id === currentCompany.id 
        ? {
            ...company,
            name: form.name,
            phone: form.phone,
            email: form.email,
            city: form.city,
            address: form.address,
            lat: parseFloat(form.lat) || company.lat,
            lng: parseFloat(form.lng) || company.lng,
            logo: form.logo || company.logo
          }
        : company
    );

    setShippingCompanies(updatedCompanies);
    resetForm();
    setShowEditModal(false);
    setCurrentCompany(null);
  };

  // ??? ???? ???
  const handleDeleteCompany = (id: number) => {
    if (confirm('?? ??? ????? ?? ??? ??? ???????')) {
      setShippingCompanies(shippingCompanies.filter(c => c.id !== id));
    }
  };

  // ??? ????? ???????
  const openEditModal = (company: ShippingCompany) => {
    setCurrentCompany(company);
    setForm({
      name: company.name,
      phone: company.phone,
      mobilePhone: company.phone,
      email: company.email,
      city: company.city,
      address: company.address,
      lat: company.lat.toString(),
      lng: company.lng.toString(),
      logo: company.logo
    });
    setLogoPreview(company.logo);
    setSelectedLocation({ lat: company.lat, lng: company.lng });
    setShowEditModal(true);
  };

  // ????? ????? ???????
  const resetForm = () => {
    setForm({
      name: '',
      phone: '',
      mobilePhone: '',
      email: '',
      city: '',
      address: '',
      lat: '',
      lng: '',
      logo: ''
    });
    setLogoPreview('');
    setSelectedLocation(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-linear-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black mb-2">?? ????? ??? ????? ???????? ?</h2>
            <p className="text-blue-100 text-lg">????? ????? ????? ???????? ?? ??????? ????? ?????? ????????</p>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* ?? ????? ???? ????? */}
      <div className="flex justify-start">
        <button type="button" onClick={() => setShowAddModal(true)}
          className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-6 text-lg font-bold rounded-xl"
        >
          <Plus className="h-5 w-5 ml-2" />
          + ????? ???? ??? ?????
        </button>
      </div>

      {/* ????? ????? ????? */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shippingCompanies.map((company) => (
          <Card key={company.id} className="shadow-lg hover:shadow-2xl transition-all duration-300 border-none bg-white overflow-hidden group">
            <CardContent className="p-6">
              {/* ?????? */}
              <div className="flex items-center justify-center mb-6">
                <div className="w-40 h-40 bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-gray-100 group-hover:border-blue-300 transition-all duration-300">
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="w-full h-full object-contain p-2"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = LOGISTICS_FALLBACK_ICON;
                    }}
                  />
                </div>
              </div>

              {/* ???????? - ?? ??????? */}
              <div className="space-y-3 text-center mb-6">
                <div className="flex items-center justify-center gap-2 text-gray-700">
                  <Phone className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">{company.phone}</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-gray-700">
                  <Mail className="h-4 w-4 text-blue-500" />
                  <span className="font-medium text-sm">{company.email}</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-gray-700">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">{company.address}</span>
                </div>
              </div>

              {/* ????? ?????? */}
              <div className="flex gap-2 justify-center">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => openEditModal(company)}
                  className="flex-1 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-all duration-300"
                >
                  <Edit className="h-4 w-4 ml-1" />
                  ?????
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleDeleteCompany(company.id)}
                  className="hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-all duration-300"
                  title="??? ??????"
                  aria-label="??? ??????"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ????? ????? ???? ????? */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-linear-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-3xl z-10">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black flex items-center gap-2">
                  ??? ????? ???? ??? ????? ???
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="hover:bg-white/20 text-white"
                  title="?????"
                  aria-label="?????"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {/* ??????? ?????? ???????? */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
                <h4 className="font-black text-blue-900 mb-4 text-lg flex items-center gap-2">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  ??????? ?????? ????????
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* ??? ?????? */}
                  <div className="md:col-span-2">
                    <Label htmlFor="name" className="text-gray-700 font-bold">??? ??????</Label>
                    <Input
                      id="name"
                      placeholder="????: ???? ????? ??????"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="mt-2 border-2 focus:border-blue-500"
                    />
                  </div>

                  {/* ??? ?????? */}
                  <div>
                    <Label htmlFor="phone" className="text-gray-700 font-bold">??? ??????</Label>
                    <Input
                      id="phone"
                      placeholder="+218 91 000 0000"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="mt-2 border-2 focus:border-blue-500"
                    />
                  </div>

                  {/* ??? ???????? */}
                  <div>
                    <Label htmlFor="mobile" className="text-gray-700 font-bold">??? ????????</Label>
                    <Input
                      id="mobile"
                      placeholder="+218 92 000 0000"
                      value={form.mobilePhone}
                      onChange={(e) => setForm({ ...form, mobilePhone: e.target.value })}
                      className="mt-2 border-2 focus:border-blue-500"
                    />
                  </div>

                  {/* ?????? ?????????? */}
                  <div>
                    <Label htmlFor="email" className="text-gray-700 font-bold">?????? ??????????</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="info@company.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="mt-2 border-2 focus:border-blue-500"
                    />
                  </div>

                  {/* ??????? */}
                  <div>
                    <Label htmlFor="city" className="text-gray-700 font-bold">???????</Label>
                    <Select value={form.city} onValueChange={(value) => setForm({ ...form, city: value })}>
                      <SelectTrigger className="mt-2 border-2">
                        <SelectValue placeholder="???? ???????" />
                      </SelectTrigger>
                      <SelectContent>
                        {libyanCities.map((city, index) => (
                          <SelectItem key={index} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* ??????? */}
                  <div className="md:col-span-2">
                    <Label htmlFor="address" className="text-gray-700 font-bold">???????</Label>
                    <Input
                      id="address"
                      placeholder="??????? ????? - ??????? ???????"
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      className="mt-2 border-2 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* ??? ?????? */}
              <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-6">
                <h4 className="font-black text-purple-900 mb-4 text-lg flex items-center gap-2">
                  <ImageIcon className="h-6 w-6" />
                  ???? ???? ?????
                </h4>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    {logoPreview ? (
                      <div className="relative">
                        <img 
                          src={logoPreview} 
                          alt="?????? ??????" 
                          className="w-48 h-48 object-contain rounded-2xl border-4 border-purple-200 bg-white p-2"
                        />
                        <button type="button" onClick={() => {
                            setLogoPreview('');
                            setForm({ ...form, logo: '' });
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg"
                          title="????? ??????"
                          aria-label="????? ??????"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-48 h-48 border-4 border-dashed border-purple-300 rounded-2xl flex flex-col items-center justify-center bg-white cursor-pointer hover:border-purple-500 transition-all duration-300"
                        onClick={() => document.getElementById('logo-upload')?.click()}
                      >
                        <Upload className="h-12 w-12 text-purple-400 mb-2" />
                        <p className="text-sm font-bold text-purple-600">???? ???? ??????</p>
                        <p className="text-xs text-gray-500 mt-1">WEBP, JPG, JPEG, BMP</p>
                      </div>
                    )}
                  </div>

                  <Label htmlFor="logo-upload" className="sr-only">????? ???? ???? ?????</Label>
                  <input
                    id="logo-upload"
                    type="file"
                    accept=".webp,.jpg,.jpeg,.bmp"
                    onChange={handleLogoUpload}
                    className="hidden"
                    aria-label="????? ???? ???? ?????"
                  />

                  {!logoPreview && (
                    <Button type="button" variant="outline" onClick={() => document.getElementById('logo-upload')?.click()}
                      className="w-full border-2 border-purple-300 hover:bg-purple-50"
                    >
                      <Upload className="h-4 w-4 ml-2" />
                      ???? ??? ??????
                    </Button>
                  )}
                </div>
              </div>

              {/* ????? ?????? ???????? */}
              <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6">
                <h4 className="font-black text-green-900 mb-4 text-lg flex items-center gap-2">
                  <MapPin className="h-6 w-6" />
                  ????? ?????? ????????
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  {/* ?? ????? */}
                  <div>
                    <Label htmlFor="lat" className="text-gray-700 font-bold">?? ????? (Latitude)</Label>
                    <Input
                      id="lat"
                      type="number"
                      step="any"
                      placeholder="32.8872"
                      value={form.lat}
                      onChange={(e) => setForm({ ...form, lat: e.target.value })}
                      className="mt-2 border-2 focus:border-green-500"
                    />
                  </div>

                  {/* ?? ????? */}
                  <div>
                    <Label htmlFor="lng" className="text-gray-700 font-bold">?? ????? (Longitude)</Label>
                    <Input
                      id="lng"
                      type="number"
                      step="any"
                      placeholder="13.1913"
                      value={form.lng}
                      onChange={(e) => setForm({ ...form, lng: e.target.value })}
                      className="mt-2 border-2 focus:border-green-500"
                    />
                  </div>
                </div>

                {/* ??????? */}
                <div className="relative bg-gray-100 rounded-xl overflow-hidden border-4 border-green-200" style={{ height: '400px' }}>
                  <MapContainer
                    center={selectedLocation ? [selectedLocation.lat, selectedLocation.lng] : [32.8872, 13.1913]}
                    zoom={selectedLocation ? 13 : 7}
                    style={{ height: '100%', width: '100%' }}
                    className="z-10"
                  >
                    <MapClickHandler onLocationSelect={handleLocationSelect} />
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {selectedLocation && (
                      <Marker position={[selectedLocation.lat, selectedLocation.lng]}>
                        <Popup>
                          <div className="text-center">
                            <p className="font-bold">{form.name || '?????? ??????'}</p>
                            <p className="text-xs text-gray-600">
                              {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                            </p>
                          </div>
                        </Popup>
                      </Marker>
                    )}
                  </MapContainer>
                  
                  {/* ??????? */}
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg z-[1000] border-2 border-green-300">
                    <p className="text-sm font-bold text-green-700 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      ???? ??? ??????? ?????? ??????
                    </p>
                  </div>

                  {/* ??? ?????????? ??????? */}
                  {selectedLocation && (
                    <div className="absolute bottom-3 left-3 right-3 bg-green-600 text-white px-4 py-3 rounded-lg shadow-xl z-[1000]">
                      <p className="text-sm font-bold text-center">
                        ? ?? ???????: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* ????? ????? ???????? */}
              <div className="flex gap-3 pt-6">
                <Button type="button" onClick={handleAddCompany}
                  className="flex-1 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 py-6 text-lg font-black"
                >
                  <Save className="h-5 w-5 ml-2" />
                  ?? ????? ???? ????? ?
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="px-8 py-6 border-2 hover:bg-gray-50"
                >
                  ?????
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ????? ????? ???? */}
      {showEditModal && currentCompany && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-linear-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-3xl z-10">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black flex items-center gap-2">
                  ?? ????? ?????? ???? ?????
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowEditModal(false);
                    setCurrentCompany(null);
                    resetForm();
                  }}
                  className="hover:bg-white/20 text-white"
                  title="?????"
                  aria-label="?????"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {/* ??????? ?????? */}
              <div className="bg-indigo-50 border-2 border-indigo-200 rounded-2xl p-6">
                <h4 className="font-black text-indigo-900 mb-4 text-lg">??????? ??????</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* ??? ?????? */}
                  <div className="md:col-span-2">
                    <Label htmlFor="edit-name" className="text-gray-700 font-bold">??? ???? ?????</Label>
                    <Input
                      id="edit-name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="mt-2 border-2 focus:border-indigo-500"
                    />
                  </div>

                  {/* ??? ?????? */}
                  <div>
                    <Label htmlFor="edit-phone" className="text-gray-700 font-bold">??? ??????</Label>
                    <Input
                      id="edit-phone"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="mt-2 border-2 focus:border-indigo-500"
                    />
                  </div>

                  {/* ??? ???????? */}
                  <div>
                    <Label htmlFor="edit-mobile" className="text-gray-700 font-bold">??? ????????</Label>
                    <Input
                      id="edit-mobile"
                      value={form.mobilePhone}
                      onChange={(e) => setForm({ ...form, mobilePhone: e.target.value })}
                      className="mt-2 border-2 focus:border-indigo-500"
                    />
                  </div>

                  {/* ?????? ?????????? */}
                  <div>
                    <Label htmlFor="edit-email" className="text-gray-700 font-bold">?????? ??????????</Label>
                    <Input
                      id="edit-email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="mt-2 border-2 focus:border-indigo-500"
                    />
                  </div>

                  {/* ??????? */}
                  <div>
                    <Label htmlFor="edit-city" className="text-gray-700 font-bold">???????</Label>
                    <Select value={form.city} onValueChange={(value) => setForm({ ...form, city: value })}>
                      <SelectTrigger className="mt-2 border-2">
                        <SelectValue placeholder="???? ???????" />
                      </SelectTrigger>
                      <SelectContent>
                        {libyanCities.map((city, index) => (
                          <SelectItem key={index} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* ??????? */}
                  <div className="md:col-span-2">
                    <Label htmlFor="edit-address" className="text-gray-700 font-bold">???????</Label>
                    <Input
                      id="edit-address"
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      className="mt-2 border-2 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* ??? ?????? */}
              <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-6">
                <h4 className="font-black text-purple-900 mb-4 text-lg flex items-center gap-2">
                  <ImageIcon className="h-6 w-6" />
                  ???? ???? ?????
                </h4>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    {logoPreview ? (
                      <div className="relative">
                        <img 
                          src={logoPreview} 
                          alt="?????? ??????" 
                          className="w-48 h-48 object-contain rounded-2xl border-4 border-purple-200 bg-white p-2"
                        />
                        <button type="button" onClick={() => {
                            setLogoPreview('');
                            setForm({ ...form, logo: '' });
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg"
                          title="????? ??????"
                          aria-label="????? ??????"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-48 h-48 border-4 border-dashed border-purple-300 rounded-2xl flex flex-col items-center justify-center bg-white cursor-pointer hover:border-purple-500 transition-all duration-300"
                        onClick={() => document.getElementById('logo-upload-edit')?.click()}
                      >
                        <Upload className="h-12 w-12 text-purple-400 mb-2" />
                        <p className="text-sm font-bold text-purple-600">???? ???? ??????</p>
                        <p className="text-xs text-gray-500 mt-1">WEBP, JPG, JPEG, BMP</p>
                      </div>
                    )}
                  </div>

                  <Label htmlFor="logo-upload-edit" className="sr-only">????? ???? ???? ?? ???????</Label>
                  <input
                    id="logo-upload-edit"
                    type="file"
                    accept=".webp,.jpg,.jpeg,.bmp"
                    onChange={handleLogoUpload}
                    className="hidden"
                    aria-label="????? ???? ???? ?? ???????"
                  />
                </div>
              </div>

              {/* ????? ?????? */}
              <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6">
                <h4 className="font-black text-green-900 mb-4 text-lg flex items-center gap-2">
                  <MapPin className="h-6 w-6" />
                  ????? ?????? ????????
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <Label htmlFor="edit-lat" className="text-gray-700 font-bold">?? ????? (Latitude)</Label>
                    <Input
                      id="edit-lat"
                      type="number"
                      step="any"
                      value={form.lat}
                      onChange={(e) => setForm({ ...form, lat: e.target.value })}
                      className="mt-2 border-2 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-lng" className="text-gray-700 font-bold">?? ????? (Longitude)</Label>
                    <Input
                      id="edit-lng"
                      type="number"
                      step="any"
                      value={form.lng}
                      onChange={(e) => setForm({ ...form, lng: e.target.value })}
                      className="mt-2 border-2 focus:border-green-500"
                    />
                  </div>
                </div>

                {/* ??????? */}
                <div className="relative bg-gray-100 rounded-xl overflow-hidden border-4 border-green-200" style={{ height: '400px' }}>
                  <MapContainer
                    center={selectedLocation ? [selectedLocation.lat, selectedLocation.lng] : [32.8872, 13.1913]}
                    zoom={selectedLocation ? 13 : 7}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <MapClickHandler onLocationSelect={handleLocationSelect} />
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {selectedLocation && (
                      <Marker position={[selectedLocation.lat, selectedLocation.lng]}>
                        <Popup>
                          <div className="text-center">
                            <p className="font-bold">{form.name}</p>
                            <p className="text-xs">
                              {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                            </p>
                          </div>
                        </Popup>
                      </Marker>
                    )}
                  </MapContainer>
                  
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg z-[1000] border-2 border-green-300">
                    <p className="text-sm font-bold text-green-700 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      ???? ??? ??????? ?????? ??????
                    </p>
                  </div>

                  {selectedLocation && (
                    <div className="absolute bottom-3 left-3 right-3 bg-green-600 text-white px-4 py-3 rounded-lg shadow-xl z-[1000]">
                      <p className="text-sm font-bold text-center">
                        ? ??????: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* ????? ????? */}
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={handleUpdateCompany}
                  className="flex-1 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 py-6 text-lg font-black"
                >
                  <Save className="h-5 w-5 ml-2" />
                  ?? ??? ?????????
                </button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowEditModal(false);
                    setCurrentCompany(null);
                    resetForm();
                  }}
                  className="px-8 py-6 border-2 hover:bg-gray-50"
                >
                  ?????
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
