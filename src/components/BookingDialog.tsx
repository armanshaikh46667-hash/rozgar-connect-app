import { useState } from 'react';
import { X, Calendar, Clock, FileText, Send, Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface BookingDialogProps {
  workerName: string;
  workerMobile: string;
  workerCategory: string;
  onClose: () => void;
}



const BookingDialog = ({ workerName, workerMobile, workerCategory, onClose }: BookingDialogProps) => {
  const [customerName, setCustomerName] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const inputClass = "w-full bg-secondary text-secondary-foreground rounded-xl px-3 py-2.5 text-sm border border-border focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground";

  const handleSubmit = async () => {
    if (!customerName.trim()) { toast.error('कृपया अपना नाम डालें'); return; }
    if (customerMobile.length !== 10) { toast.error('कृपया 10 अंकों का मोबाइल नंबर डालें'); return; }
    if (!date) { toast.error('कृपया तारीख चुनें'); return; }
    if (!time) { toast.error('कृपया समय चुनें'); return; }

    setLoading(true);
    try {
      const { data: booking, error } = await supabase.from('bookings').insert({
        worker_name: workerName,
        worker_mobile: workerMobile,
        worker_category: workerCategory,
        customer_name: customerName.trim(),
        customer_mobile: customerMobile,
        booking_date: date,
        booking_time: time,
        description: description.trim() || null,
      }).select().single();
      if (error) throw error;

      // Send notification to worker
      await supabase.from('notifications').insert({
        recipient_mobile: workerMobile,
        title: 'नई बुकिंग अनुरोध!',
        message: `${customerName.trim()} ने ${date} को ${time} के लिए बुकिंग भेजी है। श्रेणी: ${workerCategory}`,
        type: 'booking',
        related_booking_id: booking?.id || null,
      });

      // Send notification to customer
      await supabase.from('notifications').insert({
        recipient_mobile: customerMobile,
        title: 'बुकिंग भेजी गई!',
        message: `आपकी बुकिंग ${workerName} (${workerCategory}) को भेज दी गई है। तारीख: ${date}, समय: ${time}`,
        type: 'booking',
        related_booking_id: booking?.id || null,
      });

      setSuccess(true);
    } catch (err) {
      console.error(err);
      toast.error('बुकिंग में समस्या हुई। कृपया पुनः प्रयास करें।');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div className="bg-card rounded-2xl shadow-xl w-full max-w-sm p-6 text-center animate-fade-in" onClick={(e) => e.stopPropagation()}>
          <CheckCircle size={48} className="mx-auto text-primary mb-3" />
          <h3 className="text-lg font-bold text-foreground mb-1">बुकिंग सफल!</h3>
          <p className="text-sm text-muted-foreground mb-2">
            आपकी बुकिंग <strong className="text-foreground">{workerName}</strong> को भेज दी गई है।
          </p>
          <p className="text-xs text-muted-foreground mb-4">स्थिति: <span className="text-primary font-semibold">Pending</span></p>
          <button onClick={onClose} className="w-full bg-primary text-primary-foreground py-3 rounded-xl text-sm font-bold">ठीक है</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto p-5 animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-foreground text-base">बुकिंग अनुरोध</h3>
          <button onClick={onClose} className="text-muted-foreground p-1"><X size={20} /></button>
        </div>
        <div className="bg-secondary rounded-xl p-3 mb-4">
          <p className="text-xs text-muted-foreground">कामगार</p>
          <p className="text-sm font-semibold text-foreground">{workerName} — {workerCategory}</p>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">आपका नाम *</label>
            <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="अपना नाम लिखें" className={inputClass} maxLength={100} />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">मोबाइल नंबर *</label>
            <input type="tel" value={customerMobile} onChange={(e) => setCustomerMobile(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="10 अंकों का नंबर" className={inputClass} />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block flex items-center gap-1"><Calendar size={13} /> तारीख *</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} min={new Date().toISOString().split('T')[0]} />
          </div>
           <div>
             <label className="text-xs font-medium text-muted-foreground mb-1 block flex items-center gap-1"><Clock size={13} /> काम का समय लिखें *</label>
             <input type="text" value={time} onChange={(e) => setTime(e.target.value)} placeholder="जैसे: 10 AM se 5 PM, सुबह 9 से 12" className={inputClass} maxLength={50} />
           </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block flex items-center gap-1"><FileText size={13} /> समस्या विवरण</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="क्या काम करवाना है..." className={`${inputClass} resize-none h-16`} maxLength={300} />
          </div>
          <button onClick={handleSubmit} disabled={loading}
            className="w-full bg-primary text-primary-foreground py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 active:scale-[0.97] transition-transform disabled:opacity-60">
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={16} />}
            {loading ? 'भेज रहे हैं...' : 'बुकिंग भेजें'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingDialog;
