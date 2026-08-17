import React, { useState } from 'react';
import { Vehicle } from '../types';
import { createLead } from '../lib/supabase';
import { PaymentInfo } from './PaymentInfo';
import { BRAND_INFO } from '../data/autoventraData';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  MessageCircle,
  KeyRound,
  Send,
  Lock,
} from 'lucide-react';

interface VehicleReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle;
}

export const VehicleReservationModal: React.FC<VehicleReservationModalProps> = ({
  isOpen,
  onClose,
  vehicle,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const vehicleTitle = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      maximumFractionDigits: 0,
    }).format(amount).replace('KES', 'KSh');
  };

  const currentPrice = vehicle.discount_price || vehicle.price;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      setErrorMessage('Please provide your full name and phone number.');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    const res = await createLead({
      vehicle_id: vehicle.id,
      vehicle_name: vehicleTitle,
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim() || null,
      intent: 'purchase',
      lead_type: 'vehicle_enquiry',
      payment_status: 'unpaid',
      notes: formData.notes.trim() || 'Purchase reservation request from vehicle detail page',
    });

    setSubmitting(false);

    if (res.success) {
      setSubmitted(true);
    } else {
      setErrorMessage(res.error || 'Failed to submit reservation. Please try again.');
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    setErrorMessage(null);
    setFormData({ name: '', phone: '', email: '', notes: '' });
    onClose();
  };

  const reservationContext = `purchase reservation deposit for ${vehicleTitle} (ID #${vehicle.id})`;
  const whatsappMsg = encodeURIComponent(
    `Hello AutoVentraMobilities, I have submitted a reservation request to purchase the ${vehicleTitle} (Price: ${formatPrice(
      currentPrice
    )}). I would like to confirm my holding deposit payment.`
  );
  const whatsappUrl = `https://wa.me/${BRAND_INFO.whatsapp}?text=${whatsappMsg}`;

  return (
    <div
      id="vehicle-reservation-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        id="vehicle-reservation-modal"
        className="relative w-full max-w-2xl bg-[#0e0e0e] border border-white/15 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="bg-[#141414] border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#e24b4a]/20 border border-[#e24b4a]/40 text-[#e24b4a] flex items-center justify-center">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold uppercase tracking-wider text-white font-heading">
                {submitted ? 'Reservation Request Confirmed' : 'Reserve This Vehicle'}
              </h3>
              <p className="text-[11px] text-white/50 font-mono">
                {vehicleTitle} • {formatPrice(currentPrice)}
              </p>
            </div>
          </div>

          <button
            id="close-reservation-modal-btn"
            onClick={handleClose}
            className="p-1.5 text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 max-h-[80vh] overflow-y-auto space-y-6">
          {submitted ? (
            /* Step 2: Post-Submission Confirmation Screen with PaymentInfo */
            <div className="space-y-6">
              <div className="p-5 bg-emerald-950/40 border border-emerald-600/50 text-center space-y-2.5">
                <div className="w-12 h-12 bg-emerald-900/60 border border-emerald-500 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold uppercase tracking-wider text-white font-heading">
                  Reservation Request Logged!
                </h4>
                <p className="text-xs text-white/80 leading-relaxed max-w-md mx-auto">
                  Thank you, <strong className="text-white">{formData.name}</strong>. Your purchase reservation request for the <span className="text-[#e24b4a] font-bold">{vehicleTitle}</span> has been logged to our sales CRM.
                </p>
                <div className="pt-1 flex items-center justify-center gap-2 text-[10px] font-mono text-emerald-300">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Intent: Purchase Reservation • Status: Pending Holding Deposit</span>
                </div>
              </div>

              {/* Instructions banner */}
              <div className="bg-white/5 border border-white/10 p-4 text-xs text-white/70 space-y-1">
                <p className="font-bold text-white uppercase text-[11px] font-mono flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-[#e24b4a]" />
                  Next Step: Complete Your Holding Deposit
                </p>
                <p className="text-[11px] text-white/60 leading-relaxed">
                  Use our official Lipa na Paybill details below to submit your holding deposit. Once paid, click the WhatsApp button to confirm with our sales desk and receive your receipt.
                </p>
              </div>

              {/* Lipa na Paybill Payment Info Card */}
              <PaymentInfo
                context={reservationContext}
                title="Pay Reservation Deposit via M-Pesa"
                variant="compact"
              />

              {/* WhatsApp Action and Dismiss Button */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <a
                  id="confirm-reservation-whatsapp-btn"
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:flex-1 py-3 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Chat on WhatsApp</span>
                </a>

                <button
                  id="close-reservation-done-btn"
                  type="button"
                  onClick={handleClose}
                  className="w-full sm:w-auto py-3 px-6 bg-white/10 hover:bg-white/15 text-white font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Step 1: Reservation Short Form */
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Vehicle Summary Bar */}
              <div className="bg-[#141414] border border-white/10 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#e24b4a] font-bold">
                    Vehicle Selected for Purchase Reservation
                  </span>
                  <div className="text-sm font-bold text-white uppercase font-heading">
                    {vehicleTitle}
                  </div>
                  <div className="text-xs text-white/50 font-mono">
                    Condition: {vehicle.condition} • Mileage: {vehicle.mileage}
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 block">
                    Price
                  </span>
                  <span className="text-lg font-black text-[#e24b4a] font-mono">
                    {formatPrice(currentPrice)}
                  </span>
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-950/50 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Name Field */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-white/80 mb-1.5 font-mono">
                  Full Name *
                </label>
                <input
                  id="reservation-name-input"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. John Mwangi"
                  className="w-full px-4 py-2.5 bg-[#080808] border border-white/15 text-white placeholder-white/25 text-xs focus:outline-none focus:border-[#e24b4a]"
                />
              </div>

              {/* Phone Field */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-white/80 mb-1.5 font-mono">
                  Phone Number (M-Pesa / WhatsApp) *
                </label>
                <input
                  id="reservation-phone-input"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. 0712 345 678"
                  className="w-full px-4 py-2.5 bg-[#080808] border border-white/15 text-white placeholder-white/25 text-xs focus:outline-none focus:border-[#e24b4a]"
                />
              </div>

              {/* Email Field (Optional) */}
              <div>
                <label className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-white/80 mb-1.5 font-mono">
                  <span>Email Address (Optional)</span>
                  <span className="text-[10px] text-white/40 font-normal">For formal invoice/receipt</span>
                </label>
                <input
                  id="reservation-email-input"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. john.mwangi@example.com"
                  className="w-full px-4 py-2.5 bg-[#080808] border border-white/15 text-white placeholder-white/25 text-xs focus:outline-none focus:border-[#e24b4a]"
                />
              </div>

              {/* Notes Field */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-white/80 mb-1.5 font-mono">
                  Additional Notes or Holding Requirements (Optional)
                </label>
                <textarea
                  id="reservation-notes-input"
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Planning to pay holding deposit today and collect vehicle on Friday..."
                  className="w-full px-4 py-2.5 bg-[#080808] border border-white/15 text-white placeholder-white/25 text-xs focus:outline-none focus:border-[#e24b4a] resize-none"
                />
              </div>

              {/* Reassurance Notice */}
              <div className="flex items-center gap-2 text-[11px] text-white/50 font-mono bg-white/[0.02] p-3 border border-white/5">
                <Lock className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>Your contact info is saved securely in our CRM. Lipa na Paybill details will be displayed immediately upon submission.</span>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-5 py-3 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="submit-reservation-btn"
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3.5 px-6 bg-[#e24b4a] hover:bg-[#c53736] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg shadow-red-950/40"
                >
                  <span>{submitting ? 'Submitting Reservation...' : 'Reserve & View Payment Details'}</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
