import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';

export const CATEGORY_GROUPS = {
  "मूल सेवाएँ (Core Services)": [
    "Plumber", "Electrician", "Rajmistri", "Painter", "Carpenter",
    "Mobile Repair", "Bike Mechanic", "Domestic Worker",
  ],
  "शिक्षा और प्रशिक्षण (Education & Training)": [
    "Computer Class", "Competitive Exam Coaching", "Driving School", "Skill Training",
  ],
  "स्थानीय दुकानें (Local Shops & Suppliers)": [
    "Kirana Store", "Hardware Store", "Medical Store",
    "Cement / Sand Supplier", "Furniture Shop",
  ],
  "डिजिटल सेवाएँ (Digital Services)": [
    "Online Form Filling", "Aadhaar Update", "PAN Card Apply",
    "Electricity Bill Payment", "Government Scheme Registration",
  ],
  "घरेलू सेवाएँ (Home & Personal Services)": [
    "Tailoring / Boutique", "Beauty Parlour", "Home Tutor",
    "Cook", "Cleaning Worker", "Gas Stove Repair",
  ],
  "वाहन सेवाएँ (Vehicle & Machine Services)": [
    "Tractor Mechanic", "JCB Operator", "Truck Driver",
    "Auto Driver", "Tempo Service", "Pickup Rental",
  ],
  "निर्माण और श्रम (Construction & Labor)": [
    "General Labor", "Tiles Worker", "Welding Worker",
    "Iron Work", "Roof Casting Worker", "Water Tank Installation",
  ],
  "कृषि सेवाएँ (Agriculture Services)": [
    "Tractor Driver", "Harvester / Thresher Service", "Field Ploughing Service",
    "Pesticide Spraying Service", "Dairy Worker", "Animal Doctor", "Animal Feed Supplier",
  ],
} as const;

export const WORK_CATEGORIES = Object.values(CATEGORY_GROUPS).flat();
export type WorkCategory = (typeof WORK_CATEGORIES)[number];

export type Availability = 'Morning' | 'Afternoon' | 'Evening' | 'Full Day';
export type WorkerStatus = 'available' | 'busy' | 'offline';

export interface Rating {
  raterMobile: string;
  stars: number;
}

export interface Review {
  reviewerName: string;
  reviewerMobile: string;
  text: string;
  date: string;
}

export interface Worker {
  id: string;
  name: string;
  mobile: string;
  village: string;
  category: WorkCategory;
  experience: number;
  about: string;
  photo: string;
  serviceCharge?: string;
  priceMin?: number;
  priceMax?: number;
  availability: Availability;
  status: WorkerStatus;
  ratings: Rating[];
  reviews: Review[];
  gallery: string[];
  pin: string;
  lat?: number;
  lng?: number;
}

interface WorkerStore {
  workers: Worker[];
  loading: boolean;
  fetchWorkers: () => Promise<void>;
  addWorker: (worker: Omit<Worker, 'id' | 'ratings' | 'reviews' | 'gallery' | 'status'>) => Promise<boolean>;
  rateWorker: (workerId: string, raterMobile: string, stars: number) => Promise<boolean>;
  reviewWorker: (workerId: string, reviewerName: string, reviewerMobile: string, text: string) => Promise<boolean>;
  updateWorker: (workerId: string, pin: string, data: Partial<Omit<Worker, 'id' | 'ratings' | 'reviews' | 'pin'>>) => Promise<boolean>;
  deleteWorker: (workerId: string, pin: string) => Promise<boolean>;
  toggleStatus: (workerId: string, pin: string, status: WorkerStatus) => Promise<boolean>;
  addGalleryPhoto: (workerId: string, pin: string, photo: string) => Promise<boolean>;
}

// Helper to map DB row to Worker
const mapRow = (row: any): Worker => ({
  id: row.id,
  name: row.name,
  mobile: row.mobile,
  village: row.village,
  category: row.category,
  experience: row.experience,
  about: row.about,
  photo: row.photo || '',
  serviceCharge: row.service_charge || undefined,
  priceMin: row.price_min || undefined,
  priceMax: row.price_max || undefined,
  availability: row.availability as Availability,
  status: row.status as WorkerStatus,
  ratings: (row.ratings as Rating[]) || [],
  reviews: (row.reviews as Review[]) || [],
  gallery: row.gallery || [],
  pin: row.pin,
  lat: row.lat || undefined,
  lng: row.lng || undefined,
});

export const useWorkerStore = create<WorkerStore>((set, get) => ({
  workers: [],
  loading: true,

  fetchWorkers: async () => {
    set({ loading: true });
    const { data } = await supabase.from('workers').select('*').order('created_at', { ascending: false });
    set({ workers: (data || []).map(mapRow), loading: false });
  },

  addWorker: async (worker) => {
    const { data, error } = await supabase.from('workers').insert({
      name: worker.name,
      mobile: worker.mobile,
      village: worker.village,
      category: worker.category,
      experience: worker.experience,
      about: worker.about,
      photo: worker.photo || '',
      service_charge: worker.serviceCharge || null,
      price_min: worker.priceMin || null,
      price_max: worker.priceMax || null,
      availability: worker.availability,
      pin: worker.pin,
      lat: worker.lat || null,
      lng: worker.lng || null,
    }).select().single();
    if (error || !data) return false;
    set((s) => ({ workers: [mapRow(data), ...s.workers] }));
    return true;
  },

  rateWorker: async (workerId, raterMobile, stars) => {
    const worker = get().workers.find((w) => w.id === workerId);
    if (!worker) return false;
    if (worker.ratings.some((r) => r.raterMobile === raterMobile)) return false;
    const newRatings = [...worker.ratings, { raterMobile, stars }];
    const { error } = await supabase.from('workers').update({ ratings: newRatings as any }).eq('id', workerId);
    if (error) return false;
    set((s) => ({ workers: s.workers.map((w) => w.id === workerId ? { ...w, ratings: newRatings } : w) }));
    return true;
  },

  reviewWorker: async (workerId, reviewerName, reviewerMobile, text) => {
    const worker = get().workers.find((w) => w.id === workerId);
    if (!worker) return false;
    if (worker.reviews.some((r) => r.reviewerMobile === reviewerMobile)) return false;
    const review: Review = { reviewerName, reviewerMobile, text, date: new Date().toLocaleDateString('hi-IN') };
    const newReviews = [...worker.reviews, review];
    const { error } = await supabase.from('workers').update({ reviews: newReviews as any }).eq('id', workerId);
    if (error) return false;
    set((s) => ({ workers: s.workers.map((w) => w.id === workerId ? { ...w, reviews: newReviews } : w) }));
    return true;
  },

  updateWorker: async (workerId, pin, data) => {
    const worker = get().workers.find((w) => w.id === workerId);
    if (!worker || worker.pin !== pin) return false;
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.village !== undefined) updateData.village = data.village;
    if (data.about !== undefined) updateData.about = data.about;
    if (data.serviceCharge !== undefined) updateData.service_charge = data.serviceCharge;
    if (data.priceMin !== undefined) updateData.price_min = data.priceMin;
    if (data.priceMax !== undefined) updateData.price_max = data.priceMax;
    if (data.availability !== undefined) updateData.availability = data.availability;
    if (data.photo !== undefined) updateData.photo = data.photo;
    const { error } = await supabase.from('workers').update(updateData).eq('id', workerId);
    if (error) return false;
    set((s) => ({ workers: s.workers.map((w) => w.id === workerId ? { ...w, ...data } : w) }));
    return true;
  },

  deleteWorker: async (workerId, pin) => {
    const worker = get().workers.find((w) => w.id === workerId);
    if (!worker || worker.pin !== pin) return false;
    const { error } = await supabase.from('workers').delete().eq('id', workerId);
    if (error) return false;
    set((s) => ({ workers: s.workers.filter((w) => w.id !== workerId) }));
    return true;
  },

  toggleStatus: async (workerId, pin, status) => {
    const worker = get().workers.find((w) => w.id === workerId);
    if (!worker || worker.pin !== pin) return false;
    const { error } = await supabase.from('workers').update({ status }).eq('id', workerId);
    if (error) return false;
    set((s) => ({ workers: s.workers.map((w) => w.id === workerId ? { ...w, status } : w) }));
    return true;
  },

  addGalleryPhoto: async (workerId, pin, photo) => {
    const worker = get().workers.find((w) => w.id === workerId);
    if (!worker || worker.pin !== pin) return false;
    if (worker.gallery.length >= 6) return false;
    const newGallery = [...worker.gallery, photo];
    const { error } = await supabase.from('workers').update({ gallery: newGallery }).eq('id', workerId);
    if (error) return false;
    set((s) => ({ workers: s.workers.map((w) => w.id === workerId ? { ...w, gallery: newGallery } : w) }));
    return true;
  },
}));

export const getAverageRating = (ratings: Rating[]) => {
  if (ratings.length === 0) return 0;
  return ratings.reduce((sum, r) => sum + r.stars, 0) / ratings.length;
};

export const getExperienceBadge = (years: number): string => {
  if (years >= 10) return '10+ Years';
  if (years >= 5) return '5+ Years';
  if (years >= 3) return '3+ Years';
  return '1+ Year';
};

export const getDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};
