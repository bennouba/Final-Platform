import React from 'react';

interface MapPickerProps {
  value?: { lat: number; lng: number } | null;
  onChange: (coords: { lat: number; lng: number }) => void;
  height?: number;
  className?: string;
}

declare global {
  interface Window {
    L: any;
  }
}

const loadLeaflet = async (): Promise<typeof window.L> => {
  if (typeof window === 'undefined') return Promise.reject('no-window');

  // Inject CSS once
  if (!document.getElementById('leaflet-css')) {
    const link = document.createElement('link');
    link.id = 'leaflet-css';
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);
  }

  // Already loaded
  if ((window as any).L) return (window as any).L;

  // Inject JS
  await new Promise<void>((resolve, reject) => {
    if (document.getElementById('leaflet-js')) return resolve();
    const s = document.createElement('script');
    s.id = 'leaflet-js';
    s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Failed to load Leaflet'));
    document.body.appendChild(s);
  });

  return (window as any).L;
};

const MapPicker: React.FC<MapPickerProps> = ({ value, onChange, height = 280, className }) => {
  const mapRef = React.useRef<HTMLDivElement | null>(null);
  const instanceRef = React.useRef<any>(null);
  const markerRef = React.useRef<any>(null);

  React.useEffect(() => {
    let destroyed = false;

    const init = async () => {
      try {
        const L = await loadLeaflet();
        if (destroyed || !mapRef.current) return;

        const start = value || { lat: 32.8872, lng: 13.1913 }; // Tripoli default

        const map = L.map(mapRef.current, {
          center: [start.lat, start.lng],
          zoom: 12,
          zoomControl: true,
        });
        instanceRef.current = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
          maxZoom: 19,
        }).addTo(map);

        const marker = L.marker([start.lat, start.lng], { draggable: true }).addTo(map);
        markerRef.current = marker;

        const emit = (lat: number, lng: number) => onChange({ lat, lng });

        marker.on('dragend', () => {
          const pos = marker.getLatLng();
          emit(pos.lat, pos.lng);
        });

        map.on('click', (e: any) => {
          const { lat, lng } = e.latlng;
          marker.setLatLng([lat, lng]);
          emit(lat, lng);
        });
      } catch (e) {

      }
    };

    init();
    return () => {
      destroyed = true;
      try {
        if (instanceRef.current) instanceRef.current.remove();
      } catch {
        // Silently ignore errors when removing map instance
      }
    };
  }, []);

  const locateMe = async () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        if (instanceRef.current && markerRef.current) {
          instanceRef.current.setView([lat, lng], 14);
          markerRef.current.setLatLng([lat, lng]);
        }
        onChange({ lat, lng });
      },
      () => {
        // Silently ignore geolocation errors
      }
    );
  };

  return (
    <div className={className}>
      <div ref={mapRef} style={{ width: '100%', height }} className="rounded-lg overflow-hidden border" />
      <div className="flex justify-end mt-2">
        <button type="button" onClick={locateMe} className="px-3 py-1.5 text-xs rounded-md bg-emerald-600 text-white hover:bg-emerald-700">
          استخدام موقعي
        </button>
      </div>
    </div>
  );
};

export default MapPicker;
