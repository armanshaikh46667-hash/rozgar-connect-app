import { useState } from 'react';
import { Star } from 'lucide-react';
import { useWorkerStore, getAverageRating, type Rating } from '@/store/workerStore';
import { toast } from 'sonner';

interface RatingDisplayProps {
  ratings: Rating[];
}

export const RatingDisplay = ({ ratings }: RatingDisplayProps) => {
  const avg = getAverageRating(ratings);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={12}
          className={i <= Math.round(avg) ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}
        />
      ))}
      {ratings.length > 0 && (
        <span className="text-[10px] text-muted-foreground ml-1">
          {avg.toFixed(1)} ({ratings.length})
        </span>
      )}
    </div>
  );
};

interface RateReviewInputProps {
  workerId: string;
  onClose: () => void;
}

export const RateReviewInput = ({ workerId, onClose }: RateReviewInputProps) => {
  const [stars, setStars] = useState(0);
  const [mobile, setMobile] = useState('');
  const [name, setName] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [saving, setSaving] = useState(false);
  const rateWorker = useWorkerStore((s) => s.rateWorker);
  const reviewWorker = useWorkerStore((s) => s.reviewWorker);

  const handleSubmit = async () => {
    if (mobile.length !== 10) {
      toast.error('कृपया 10 अंकों का मोबाइल नंबर डालें');
      return;
    }
    if (stars === 0) {
      toast.error('कृपया रेटिंग चुनें');
      return;
    }
    if (!name.trim()) {
      toast.error('कृपया अपना नाम डालें');
      return;
    }

    setSaving(true);

    // Submit rating
    const ratingSuccess = await rateWorker(workerId, mobile, stars);

    // Submit review if text provided
    let reviewSuccess = true;
    if (reviewText.trim()) {
      reviewSuccess = await reviewWorker(workerId, name.trim(), mobile, reviewText.trim());
    }

    setSaving(false);

    if (ratingSuccess || reviewSuccess) {
      toast.success('रेटिंग और समीक्षा सफलतापूर्वक दी गई!');
      onClose();
    } else {
      toast.error('आप पहले ही इस कामगार को रेटिंग दे चुके हैं');
    }
  };

  return (
    <div className="bg-secondary rounded-lg p-3 mt-2 space-y-2 animate-fade-in">
      <p className="text-xs font-semibold text-foreground text-center">⭐ Rate & Review</p>
      <div className="flex gap-1 justify-center">
        {[1, 2, 3, 4, 5].map((i) => (
          <button key={i} onClick={() => setStars(i)} className="p-1 active:scale-90 transition-transform">
            <Star size={24} className={i <= stars ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'} />
          </button>
        ))}
      </div>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="अपना नाम डालें"
        className="w-full bg-background text-foreground rounded-lg px-3 py-2 text-sm border border-border focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
      />
      <input
        type="tel"
        value={mobile}
        onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
        placeholder="अपना मोबाइल नंबर डालें"
        className="w-full bg-background text-foreground rounded-lg px-3 py-2 text-sm border border-border focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
      />
      <textarea
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        placeholder="समीक्षा लिखें (वैकल्पिक)"
        rows={2}
        className="w-full bg-background text-foreground rounded-lg px-3 py-2 text-sm border border-border focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground resize-none"
      />
      <div className="flex gap-2">
        <button onClick={onClose} className="flex-1 py-2 text-sm text-muted-foreground rounded-lg border border-border">रद्द करें</button>
        <button onClick={handleSubmit} disabled={saving} className="flex-1 py-2 text-sm bg-primary text-primary-foreground rounded-lg font-medium disabled:opacity-50">
          {saving ? 'भेज रहे हैं...' : 'सबमिट करें'}
        </button>
      </div>
    </div>
  );
};

// Keep backward compatibility
export const RatingInput = RateReviewInput;
