import { useState, useEffect, useRef } from 'react';
import { MapPin, Phone, Navigation, Loader2, X, ChevronRight, ArrowLeft, Clock, Route, Locate, Crosshair } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWorkerStore, getDistance } from '@/store/workerStore';
import { useLanguageStore, t } from '@/store/languageStore';
import { supabase } from '@/integrations/supabase/client';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const WhatsAppIcon = ({ size = 16 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

interface MapEntity {
  id: string;
  name: string;
  category: string;
  village: string;
  mobile: string;
  lat: number;
  lng: number;
  type: 'worker' | 'shop' | 'digital' | 'coaching';
}

const RADIUS_OPTIONS = [
  { value: 2, label: '2 km' },
  { value: 5, label: '5 km' },
  { value: 10, label: '10 km' },
  { value: 25, label: '25 km' },
  { value: 50, label: '50 km' },
];

const TYPE_FILTERS = [
  { value: 'all', label: 'सभी', labelEn: 'All' },
  { value: 'worker', label: 'कामगार', labelEn: 'Workers' },
  { value: 'shop', label: 'दुकान', labelEn: 'Shops' },
  { value: 'digital', label: 'डिजिटल', labelEn: 'Digital' },
  { value: 'coaching', label: 'कोचिंग', labelEn: 'Coaching' },
];

const MARKER_COLORS: Record<string, string> = {
  worker: 'hsl(142,71%,40%)',
  shop: 'hsl(25,95%,53%)',
  digital: 'hsl(217,91%,60%)',
  coaching: 'hsl(280,65%,60%)',
};

const MARKER_EMOJIS: Record<string, string> = {
  worker: '🔧',
  shop: '🏪',
  digital: '💻',
  coaching: '📚',
};

const estimateTravelTime = (distKm: number, lang: 'hi' | 'en'): string => {
  if (distKm <= 2) return `${Math.ceil(distKm / 5 * 60)} min ${lang === 'hi' ? 'पैदल' : 'walk'}`;
  if (distKm <= 10) return `${Math.ceil(distKm / 25 * 60)} min ${lang === 'hi' ? 'बाइक' : 'bike'}`;
  return `${Math.ceil(distKm / 40 * 60)} min ${lang === 'hi' ? 'गाड़ी' : 'car'}`;
};

// India center coordinates
const INDIA_CENTER: [number, number] = [22.5, 82.0];
const INDIA_ZOOM = 5;

const MapPage = () => {
  const navigate = useNavigate();
  const lang = useLanguageStore((s) => s.lang);
  const workers = useWorkerStore((s) => s.workers);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLng, setUserLng] = useState<number | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [radius, setRadius] = useState(25);
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedEntity, setSelectedEntity] = useState<MapEntity | null>(null);
  const [businesses, setBusinesses] = useState<MapEntity[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      const [shopRes, digitalRes, coachingRes] = await Promise.all([
        supabase.from('local_businesses').select('id, name, category, village, mobile, lat, lng'),
        supabase.from('digital_services').select('id, shop_name, service_type, village, mobile, lat, lng'),
        supabase.from('education_coaching').select('id, institute_name, course_type, village, mobile, lat, lng'),
      ]);
      const entities: MapEntity[] = [];
      (shopRes.data || []).forEach((s) => {
        if (s.lat && s.lng) entities.push({ id: s.id, name: s.name, category: s.category, village: s.village, mobile: s.mobile, lat: s.lat, lng: s.lng, type: 'shop' });
      });
      (digitalRes.data || []).forEach((d) => {
        if (d.lat && d.lng) entities.push({ id: d.id, name: d.shop_name, category: d.service_type, village: d.village, mobile: d.mobile, lat: d.lat, lng: d.lng, type: 'digital' });
      });
      (coachingRes.data || []).forEach((c) => {
        if (c.lat && c.lng) entities.push({ id: c.id, name: c.institute_name, category: c.course_type, village: c.village, mobile: c.mobile, lat: c.lat, lng: c.lng, type: 'coaching' });
      });
      setBusinesses(entities);
    };
    fetchAll();
  }, []);

  // Initialize map with India view (no GPS wait)
  useEffect(() => {
    if (!mapRef.current) return;
    if (mapInstanceRef.current) return;
    const map = L.map(mapRef.current, { zoomControl: false }).setView(INDIA_CENTER, INDIA_ZOOM);
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OSM',
      maxZoom: 18,
    }).addTo(map);
    markersRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;
    return () => { map.remove(); mapInstanceRef.current = null; };
  }, []);

  // Live location function
  const goToMyLocation = () => {
    if (!navigator.geolocation) return;
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setUserLat(lat);
        setUserLng(lng);
        setGpsLoading(false);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([lat, lng], 14);
          // Add/update user marker
          if (userMarkerRef.current) {
            userMarkerRef.current.setLatLng([lat, lng]);
          } else {
            const userIcon = L.divIcon({
              html: '<div style="width:18px;height:18px;background:hsl(217,91%,60%);border:3px solid white;border-radius:50%;box-shadow:0 0 0 2px hsl(217,91%,60%,0.3),0 2px 8px rgba(0,0,0,0.3)"></div>',
              iconSize: [18, 18], iconAnchor: [9, 9], className: '',
            });
            userMarkerRef.current = L.marker([lat, lng], { icon: userIcon }).addTo(mapInstanceRef.current!).bindPopup('📍 My Location');
          }
        }
      },
      () => { setGpsLoading(false); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Update markers when data/filters change
  useEffect(() => {
    if (!markersRef.current || !mapInstanceRef.current) return;
    markersRef.current.clearLayers();
    const workerEntities: MapEntity[] = workers
      .filter((w) => w.lat && w.lng)
      .map((w) => ({ id: w.id, name: w.name, category: w.category, village: w.village, mobile: w.mobile, lat: w.lat!, lng: w.lng!, type: 'worker' as const }));
    const allEntities = [...workerEntities, ...businesses];
    const filtered = allEntities
      .filter((e) => typeFilter === 'all' || e.type === typeFilter)
      .filter((e) => {
        if (!userLat || !userLng) return true;
        return getDistance(userLat, userLng, e.lat, e.lng) <= radius;
      });
    filtered.forEach((e) => {
      const color = MARKER_COLORS[e.type];
      const emoji = MARKER_EMOJIS[e.type];
      const distText = userLat && userLng ? ` · ${getDistance(userLat, userLng, e.lat, e.lng).toFixed(1)} km` : '';
      const icon = L.divIcon({
        html: `<div style="width:32px;height:32px;background:${color};border:2px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;font-size:15px;cursor:pointer">${emoji}</div>`,
        iconSize: [32, 32], iconAnchor: [16, 16], className: '',
      });
      const marker = L.marker([e.lat, e.lng], { icon });
      marker.on('click', () => setSelectedEntity(e));
      markersRef.current!.addLayer(marker);
    });
  }, [workers, businesses, radius, typeFilter, userLat, userLng]);

  // Route line
  useEffect(() => {
    if (routeLayerRef.current && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(routeLayerRef.current);
      routeLayerRef.current = null;
    }
    if (selectedEntity && userLat && userLng && mapInstanceRef.current) {
      const line = L.polyline(
        [[userLat, userLng], [selectedEntity.lat, selectedEntity.lng]],
        { color: 'hsl(217,91%,60%)', weight: 3, dashArray: '8, 8', opacity: 0.7 }
      ).addTo(mapInstanceRef.current);
      routeLayerRef.current = line;
      mapInstanceRef.current.fitBounds(line.getBounds(), { padding: [60, 60] });
    }
  }, [selectedEntity, userLat, userLng]);

  const allEntities = [
    ...workers.filter((w) => w.lat && w.lng).map((w) => ({ id: w.id, name: w.name, category: w.category, village: w.village, mobile: w.mobile, lat: w.lat!, lng: w.lng!, type: 'worker' as const })),
    ...businesses,
  ];
  const nearbyCount = allEntities
    .filter((e) => typeFilter === 'all' || e.type === typeFilter)
    .filter((e) => userLat && userLng ? getDistance(userLat, userLng, e.lat, e.lng) <= radius : true)
    .length;

  const typeLabel: Record<string, string> = { worker: 'कामगार', shop: 'दुकान', digital: 'डिजिटल सेवा', coaching: 'कोचिंग' };

  const selectedDist = selectedEntity && userLat && userLng
    ? getDistance(userLat, userLng, selectedEntity.lat, selectedEntity.lng) : null;

  const openGoogleMapsRoute = (entity: MapEntity) => {
    if (userLat && userLng) {
      window.open(`https://www.google.com/maps/dir/${userLat},${userLng}/${entity.lat},${entity.lng}`, '_blank');
    } else {
      window.open(`https://www.google.com/maps?q=${entity.lat},${entity.lng}`, '_blank');
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Top bar */}
      <div className="bg-card border-b border-border px-3 py-2 flex items-center gap-2 shrink-0 z-30">
        <button onClick={() => navigate('/')} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-secondary transition-colors">
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-extrabold text-foreground truncate">{t('नज़दीकी सेवाएँ', lang)}</h1>
          <p className="text-[10px] text-muted-foreground">{nearbyCount} {t('सेवाएँ', lang)} {userLat ? `${radius} km` : lang === 'hi' ? 'भारत' : 'India'}</p>
        </div>
        <button
          onClick={goToMyLocation}
          disabled={gpsLoading}
          className="w-9 h-9 rounded-xl flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 shadow-md"
          title={lang === 'hi' ? 'मेरी लोकेशन' : 'My Location'}
        >
          {gpsLoading ? <Loader2 size={16} className="animate-spin" /> : <Crosshair size={16} />}
        </button>
      </div>

      {/* Filters */}
      <div className="bg-card/80 backdrop-blur-sm border-b border-border px-3 py-2 shrink-0 z-20 space-y-1.5">
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
          {TYPE_FILTERS.map((f) => (
            <button key={f.value} onClick={() => setTypeFilter(f.value)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${typeFilter === f.value ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
              {lang === 'hi' ? f.label : f.labelEn}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5">
          {RADIUS_OPTIONS.map((opt) => (
            <button key={opt.value} onClick={() => setRadius(opt.value)}
              className={`flex-1 py-1 rounded-full text-[10px] font-bold transition-colors ${radius === opt.value ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <div ref={mapRef} className="absolute inset-0" />

        {/* Legend */}
        <div className="absolute bottom-3 left-3 z-[500] bg-card/90 backdrop-blur-sm rounded-xl px-3 py-2 border border-border shadow-md">
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] font-bold text-muted-foreground">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full" style={{ background: MARKER_COLORS.worker }} /> {lang === 'hi' ? 'कामगार' : 'Worker'}</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full" style={{ background: MARKER_COLORS.shop }} /> {lang === 'hi' ? 'दुकान' : 'Shop'}</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full" style={{ background: MARKER_COLORS.digital }} /> {lang === 'hi' ? 'डिजिटल' : 'Digital'}</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full" style={{ background: MARKER_COLORS.coaching }} /> {lang === 'hi' ? 'कोचिंग' : 'Coaching'}</span>
          </div>
        </div>
      </div>

      {/* Selected entity card */}
      {selectedEntity && (
        <div className="absolute inset-x-0 bottom-0 z-[600] p-3 sm:p-4 animate-fade-in" style={{ maxWidth: '480px', margin: '0 auto' }}>
          <div className="bg-card rounded-2xl shadow-2xl border border-border p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="min-w-0 flex-1">
                <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-bold mb-1">
                  {MARKER_EMOJIS[selectedEntity.type]} {typeLabel[selectedEntity.type]}
                </span>
                <h3 className="font-extrabold text-foreground text-sm truncate">{selectedEntity.name}</h3>
                <p className="text-xs text-muted-foreground font-medium">{selectedEntity.category} · {selectedEntity.village}</p>
                {selectedDist !== null && (
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-xs text-primary font-extrabold flex items-center gap-1">
                      <MapPin size={12} /> {selectedDist.toFixed(1)} km
                    </span>
                    <span className="text-xs text-muted-foreground font-bold flex items-center gap-1">
                      <Clock size={12} /> {estimateTravelTime(selectedDist, lang)}
                    </span>
                  </div>
                )}
              </div>
              <button onClick={() => setSelectedEntity(null)} className="text-muted-foreground p-1 hover:bg-secondary rounded-lg transition-colors"><X size={18} /></button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <a href={`tel:${selectedEntity.mobile}`}
                className="bg-primary text-primary-foreground py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 active:scale-[0.97] transition-transform">
                <Phone size={14} /> {t('कॉल', lang)}
              </a>
              <a href={`https://wa.me/91${selectedEntity.mobile}`} target="_blank" rel="noopener noreferrer"
                className="bg-accent text-accent-foreground py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 active:scale-[0.97] transition-transform">
                <WhatsAppIcon size={14} /> WhatsApp
              </a>
              <button onClick={() => openGoogleMapsRoute(selectedEntity)}
                className="bg-secondary text-secondary-foreground py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border border-border active:scale-[0.97] transition-transform">
                <Route size={14} /> {t('रास्ता', lang)}
              </button>
            </div>
            {selectedEntity.type === 'worker' && (
              <button onClick={() => { setSelectedEntity(null); navigate(`/worker/${selectedEntity.id}`); }}
                className="w-full mt-2 bg-secondary text-secondary-foreground py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 border border-border active:scale-[0.97] transition-transform">
                {t('प्रोफ़ाइल देखें', lang)} <ChevronRight size={14} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MapPage;
