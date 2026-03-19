import { useState, useEffect, useRef } from 'react';
import { MapPin, Phone, Navigation, Loader2, X, ChevronRight, Store, Laptop, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWorkerStore, getDistance } from '@/store/workerStore';
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
];

const TYPE_FILTERS = [
  { value: 'all', label: 'सभी', icon: '📍' },
  { value: 'worker', label: 'कामगार', icon: '🔧' },
  { value: 'shop', label: 'दुकान', icon: '🏪' },
  { value: 'digital', label: 'डिजिटल', icon: '💻' },
  { value: 'coaching', label: 'कोचिंग', icon: '📚' },
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

const MapPage = () => {
  const navigate = useNavigate();
  const workers = useWorkerStore((s) => s.workers);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLng, setUserLng] = useState<number | null>(null);
  const [gpsLoading, setGpsLoading] = useState(true);
  const [radius, setRadius] = useState(5);
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedEntity, setSelectedEntity] = useState<MapEntity | null>(null);
  const [businesses, setBusinesses] = useState<MapEntity[]>([]);

  // Fetch shops, digital services, coaching centers
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

  // Get user location
  useEffect(() => {
    if (!navigator.geolocation) { setGpsLoading(false); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => { setUserLat(pos.coords.latitude); setUserLng(pos.coords.longitude); setGpsLoading(false); },
      () => { setGpsLoading(false); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || gpsLoading) return;
    if (mapInstanceRef.current) return;

    const lat = userLat || 26.8;
    const lng = userLng || 80.9;

    const map = L.map(mapRef.current).setView([lat, lng], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 18,
    }).addTo(map);

    if (userLat && userLng) {
      const userIcon = L.divIcon({
        html: '<div style="width:16px;height:16px;background:hsl(217,91%,60%);border:3px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
        className: '',
      });
      L.marker([userLat, userLng], { icon: userIcon }).addTo(map).bindPopup('📍 आपकी लोकेशन');
    }

    markersRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => { map.remove(); mapInstanceRef.current = null; };
  }, [gpsLoading, userLat, userLng]);

  // Update markers for all entity types
  useEffect(() => {
    if (!markersRef.current || !mapInstanceRef.current) return;
    markersRef.current.clearLayers();

    // Workers
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
      const icon = L.divIcon({
        html: `<div style="width:28px;height:28px;background:${color};border:2px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;font-size:14px">${emoji}</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        className: '',
      });

      const marker = L.marker([e.lat, e.lng], { icon });
      marker.on('click', () => setSelectedEntity(e));
      markersRef.current!.addLayer(marker);
    });
  }, [workers, businesses, radius, typeFilter, userLat, userLng]);

  const nearbyCount = (() => {
    const workerEntities: MapEntity[] = workers
      .filter((w) => w.lat && w.lng)
      .map((w) => ({ id: w.id, name: w.name, category: w.category, village: w.village, mobile: w.mobile, lat: w.lat!, lng: w.lng!, type: 'worker' as const }));
    const all = [...workerEntities, ...businesses];
    return all
      .filter((e) => typeFilter === 'all' || e.type === typeFilter)
      .filter((e) => userLat && userLng ? getDistance(userLat, userLng, e.lat, e.lng) <= radius : true)
      .length;
  })();

  const typeLabel: Record<string, string> = { worker: 'कामगार', shop: 'दुकान', digital: 'डिजिटल सेवा', coaching: 'कोचिंग' };

  return (
    <div className="min-h-screen bottom-nav-safe bg-background flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary via-primary to-accent-foreground px-6 pt-8 pb-6 text-primary-foreground">
        <h1 className="text-2xl font-bold flex items-center gap-2"><MapPin size={24} /> नज़दीकी सेवाएँ</h1>
        <p className="text-primary-foreground/80 text-sm mt-1">कामगार, दुकानें, डिजिटल सेवाएँ — नक्शे पर देखें</p>
      </div>

      {/* Type Filter */}
      <div className="max-w-lg mx-auto w-full px-4 -mt-4 relative z-20">
        <div className="bg-card rounded-2xl shadow-lg border border-border p-3 space-y-2">
          <div className="flex gap-1.5 overflow-x-auto">
            {TYPE_FILTERS.map((f) => (
              <button key={f.value} onClick={() => setTypeFilter(f.value)}
                className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${typeFilter === f.value ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                <span>{f.icon}</span> {f.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Navigation size={14} className="text-primary shrink-0" />
            <span className="text-[10px] font-semibold text-foreground shrink-0">दूरी:</span>
            <div className="flex gap-1.5 flex-1">
              {RADIUS_OPTIONS.map((opt) => (
                <button key={opt.value} onClick={() => setRadius(opt.value)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors ${radius === opt.value ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                  {opt.label}
                </button>
              ))}
            </div>
            <span className="text-[10px] text-muted-foreground shrink-0">{nearbyCount} मिले</span>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 max-w-lg mx-auto w-full px-4 mt-3">
        {gpsLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-primary mb-3" size={32} />
            <p className="text-sm text-muted-foreground">लोकेशन ले रहे हैं...</p>
          </div>
        ) : (
          <div ref={mapRef} className="w-full rounded-2xl border border-border overflow-hidden" style={{ height: '55vh' }} />
        )}
      </div>

      {/* Legend */}
      <div className="max-w-lg mx-auto w-full px-4 mt-2">
        <div className="flex items-center justify-center gap-4 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full" style={{ background: MARKER_COLORS.worker }} /> कामगार</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full" style={{ background: MARKER_COLORS.shop }} /> दुकान</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full" style={{ background: MARKER_COLORS.digital }} /> डिजिटल</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full" style={{ background: MARKER_COLORS.coaching }} /> कोचिंग</span>
        </div>
      </div>

      {/* Entity Info Popup */}
      {selectedEntity && (
        <div className="fixed inset-x-0 bottom-20 z-50 px-4 max-w-lg mx-auto animate-fade-in">
          <div className="bg-card rounded-2xl shadow-xl border border-border p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-semibold">
                    {MARKER_EMOJIS[selectedEntity.type]} {typeLabel[selectedEntity.type]}
                  </span>
                </div>
                <h3 className="font-bold text-foreground text-sm">{selectedEntity.name}</h3>
                <p className="text-xs text-muted-foreground">{selectedEntity.category} · {selectedEntity.village}</p>
                {userLat && userLng && (
                  <p className="text-[10px] text-primary font-semibold mt-0.5">
                    📍 {getDistance(userLat, userLng, selectedEntity.lat, selectedEntity.lng).toFixed(1)} km दूर
                  </p>
                )}
              </div>
              <button onClick={() => setSelectedEntity(null)} className="text-muted-foreground p-1"><X size={18} /></button>
            </div>
            <div className="flex items-center gap-2">
              <a href={`tel:${selectedEntity.mobile}`}
                className="flex-1 bg-primary text-primary-foreground py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 active:scale-[0.97] transition-transform">
                <Phone size={14} /> कॉल
              </a>
              <a href={`https://wa.me/91${selectedEntity.mobile}`} target="_blank" rel="noopener noreferrer"
                className="flex-1 bg-accent text-accent-foreground py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 active:scale-[0.97] transition-transform">
                <WhatsAppIcon size={14} /> WhatsApp
              </a>
              {selectedEntity.type === 'worker' && (
                <button onClick={() => { setSelectedEntity(null); navigate(`/worker/${selectedEntity.id}`); }}
                  className="flex-1 bg-secondary text-secondary-foreground py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border border-border active:scale-[0.97] transition-transform">
                  प्रोफ़ाइल <ChevronRight size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapPage;
