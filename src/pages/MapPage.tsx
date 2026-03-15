import { useState, useEffect, useRef } from 'react';
import { MapPin, Phone, Navigation, Loader2, X, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWorkerStore, getDistance } from '@/store/workerStore';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const WhatsAppIcon = ({ size = 16 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const RADIUS_OPTIONS = [
  { value: 2, label: '2 km' },
  { value: 5, label: '5 km' },
  { value: 10, label: '10 km' },
];

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
  const [selectedWorker, setSelectedWorker] = useState<string | null>(null);

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

    // User marker
    if (userLat && userLng) {
      const userIcon = L.divIcon({
        html: '<div style="width:16px;height:16px;background:#3b82f6;border:3px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>',
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

  // Update worker markers
  useEffect(() => {
    if (!markersRef.current || !mapInstanceRef.current) return;
    markersRef.current.clearLayers();

    const workersWithLocation = workers.filter((w) => w.lat && w.lng);
    const filtered = userLat && userLng
      ? workersWithLocation.filter((w) => getDistance(userLat, userLng, w.lat!, w.lng!) <= radius)
      : workersWithLocation;

    filtered.forEach((w) => {
      const workerIcon = L.divIcon({
        html: `<div style="width:28px;height:28px;background:hsl(142,71%,40%);border:2px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;font-size:14px">🔧</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        className: '',
      });

      const marker = L.marker([w.lat!, w.lng!], { icon: workerIcon });
      marker.on('click', () => setSelectedWorker(w.id));
      markersRef.current!.addLayer(marker);
    });
  }, [workers, radius, userLat, userLng]);

  const selected = selectedWorker ? workers.find((w) => w.id === selectedWorker) : null;
  const nearbyCount = workers.filter((w) => w.lat && w.lng && userLat && userLng && getDistance(userLat, userLng, w.lat!, w.lng!) <= radius).length;

  return (
    <div className="min-h-screen bottom-nav-safe bg-background flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary via-primary to-accent-foreground px-6 pt-8 pb-6 text-primary-foreground">
        <h1 className="text-2xl font-bold flex items-center gap-2"><MapPin size={24} /> नज़दीकी कामगार</h1>
        <p className="text-primary-foreground/80 text-sm mt-1">नक्शे पर देखें</p>
      </div>

      {/* Radius Filter */}
      <div className="max-w-lg mx-auto w-full px-4 -mt-4 relative z-20">
        <div className="bg-card rounded-2xl shadow-lg border border-border p-3 flex items-center gap-2">
          <Navigation size={16} className="text-primary shrink-0" />
          <span className="text-xs font-semibold text-foreground shrink-0">दूरी:</span>
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

      {/* Worker Info Popup */}
      {selected && (
        <div className="fixed inset-x-0 bottom-20 z-50 px-4 max-w-lg mx-auto animate-fade-in">
          <div className="bg-card rounded-2xl shadow-xl border border-border p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-bold text-foreground text-sm">{selected.name}</h3>
                <p className="text-xs text-muted-foreground">{selected.category} · {selected.village}</p>
                {userLat && userLng && selected.lat && selected.lng && (
                  <p className="text-[10px] text-primary font-semibold mt-0.5">
                    📍 {getDistance(userLat, userLng, selected.lat, selected.lng).toFixed(1)} km दूर
                  </p>
                )}
              </div>
              <button onClick={() => setSelectedWorker(null)} className="text-muted-foreground p-1"><X size={18} /></button>
            </div>
            <div className="flex items-center gap-2">
              <a href={`tel:${selected.mobile}`}
                className="flex-1 bg-primary text-primary-foreground py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 active:scale-[0.97] transition-transform">
                <Phone size={14} /> कॉल
              </a>
              <a href={`https://wa.me/91${selected.mobile}`} target="_blank" rel="noopener noreferrer"
                className="flex-1 bg-accent text-accent-foreground py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 active:scale-[0.97] transition-transform">
                <WhatsAppIcon size={14} /> WhatsApp
              </a>
              <button onClick={() => { setSelectedWorker(null); navigate(`/search?name=${encodeURIComponent(selected.name)}`); }}
                className="flex-1 bg-secondary text-secondary-foreground py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border border-border active:scale-[0.97] transition-transform">
                प्रोफ़ाइल <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapPage;
