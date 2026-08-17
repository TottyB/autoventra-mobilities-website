import React, { useState } from 'react';
import { createLead } from '../lib/supabase';
import { PaymentInfo } from './PaymentInfo';
import {
  X,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Calendar,
  User,
  Phone,
  Car,
  Clock,
  Send,
  ShieldCheck,
  MapPin,
  Sparkles,
} from 'lucide-react';

interface RentalBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialVehicle?: string;
}

const RENTAL_FLEET = [
  { id: 'prado', name: 'Toyota Land Cruiser Prado TX-L', rate: 'KES 15,000 / day', type: 'Executive SUV' },
  { id: 'v8', name: 'Toyota Land Cruiser V8 / ZX', rate: 'KES 25,000 / day', type: 'VIP Armored/Luxury SUV' },
  { id: 'rangerover', name: 'Range Rover Sport / Vogue', rate: 'KES 35,000 / day', type: 'Luxury Flagship' },
  { id: 'mercedes', name: 'Mercedes-Benz E-Class / C-Class', rate: 'KES 18,000 / day', type: 'Executive Sedan' },
  { id: 'safari', name: 'Safari 4x4 Land Cruiser (Pop-up Roof)', rate: 'KES 22,000 / day', type: 'Bush & Overland' },
  { id: 'voxy', name: 'Toyota Noah / Voxy (7-Seater MPV)', rate: 'KES 9,500 / day', type: 'Family / Group Shuttle' },
  { id: 'rav4', name: 'Toyota RAV4 / Harrier (Compact SUV)', rate: 'KES 8,000 / day', type: 'City & Suburban' },
];

export const RentalBookingModal: React.FC<RentalBookingModalProps> = ({
  isOpen,
  onClose,
  initialVehicle,
}) => {
  const [selectedFleet, setSelectedFleet] = useState(
    initialVehicle || RENTAL_FLEET[0].name
  );
  const [rentalType, setRentalType] = useState<'self-drive' | 'chauffeur'>('self-drive');
  const [startDate, setStartDate] = useState('');
  const [days, setDays] = useState('3');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError('Please provide your name and phone number.');
      return;
    }

    setSubmitting(true);
    setError(null);

    const leadPayload = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || null,
      lead_type: 'rental_booking',
      rental_vehicle: selectedFleet,
      rental_days: parseInt(days, 10) || 1,
      start_date: startDate || null,
      payment_status: 'unpaid',
      preferred_date: startDate || null,
      notes: `[Rental: ${rentalType.toUpperCase()}] ${days} days starting ${startDate || 'Immediate'}. Notes: ${notes || 'None'}`,
    };

    const res = await createLead(leadPayload);
    setSubmitting(false);

    if (res.success) {
      setSubmitted(true);
    } else {
      setError(res.error || 'Failed to submit booking reservation.');
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setName('');
    setPhone('');
    setEmail('');
    setNotes('');
    setStartDate('');
    setDays('3');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#111] border border-white/10 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Top Header Accent */}
        <div className="h-1 bg-[#e24b4a] w-full flex-shrink-0" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0b0b0b] flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#e24b4a]/10 border border-[#e24b4a]/30 flex items-center justify-center text-[#e24b4a]">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold font-mono tracking-widest text-[#e24b4a] uppercase">
                AutoVentraMobilities Fleet Reservations
              </span>
              <h3 className="text-base sm:text-lg font-bold font-heading uppercase text-white">
                Book a Rental Vehicle
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 overflow-y-auto space-y-6">
          {submitted ? (
            /* ========================================================= */
            /* RENTAL BOOKING CONFIRMATION SCREEN */
            /* ========================================================= */
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="p-5 bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2.5">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="text-base font-bold uppercase text-white font-heading">
                  Rental Booking Received!
                </h4>
                <p className="text-xs text-white/70 max-w-lg mx-auto leading-relaxed">
                  Thank you, <strong className="text-white">{name}</strong>. Your reservation for the{' '}
                  <span className="text-[#e24b4a] font-bold">{selectedFleet}</span> ({rentalType},{' '}
                  {days} days) has been logged in our reservation system.
                </p>
                <div className="inline-flex items-center gap-2 text-[11px] font-mono text-emerald-300 bg-emerald-950/60 px-3 py-1 border border-emerald-800/40">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Status: Pending M-Pesa Confirmation</span>
                </div>
              </div>

              {/* Lipa na M-Pesa Component for Rental Confirmation */}
              <PaymentInfo
                context={`rental booking for ${selectedFleet} (${name})`}
                title="Complete Your Rental Deposit via M-Pesa"
              />

              <div className="text-center pt-2">
                <button
                  onClick={handleReset}
                  className="text-xs text-[#e24b4a] hover:underline font-bold uppercase tracking-wider cursor-pointer"
                >
                  Make another booking reservation
                </button>
              </div>
            </div>
          ) : (
            /* ========================================================= */
            /* RENTAL BOOKING FORM */
            /* ========================================================= */
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 bg-red-950/40 border border-red-800/50 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Fleet Selection */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1.5">
                  Select Fleet Vehicle *
                </label>
                <select
                  value={selectedFleet}
                  onChange={(e) => setSelectedFleet(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#070707] border border-white/10 text-white text-xs focus:outline-none focus:border-[#e24b4a]"
                >
                  {RENTAL_FLEET.map((car) => (
                    <option key={car.id} value={car.name}>
                      {car.name} — {car.rate} ({car.type})
                    </option>
                  ))}
                </select>
              </div>

              {/* Drive Mode Selection */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRentalType('self-drive')}
                  className={`p-3 border text-left cursor-pointer transition-all ${
                    rentalType === 'self-drive'
                      ? 'border-[#e24b4a] bg-[#e24b4a]/10 text-white'
                      : 'border-white/10 bg-[#070707] text-white/60 hover:text-white'
                  }`}
                >
                  <div className="text-xs font-bold uppercase">Self-Drive</div>
                  <div className="text-[10px] text-white/50">Standard driver license required</div>
                </button>

                <button
                  type="button"
                  onClick={() => setRentalType('chauffeur')}
                  className={`p-3 border text-left cursor-pointer transition-all ${
                    rentalType === 'chauffeur'
                      ? 'border-[#e24b4a] bg-[#e24b4a]/10 text-white'
                      : 'border-white/10 bg-[#070707] text-white/60 hover:text-white'
                  }`}
                >
                  <div className="text-xs font-bold uppercase">Chauffeur Driven</div>
                  <div className="text-[10px] text-white/50">Professional vetted driver included</div>
                </button>
              </div>

              {/* Date & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1">
                    Pickup Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#070707] border border-white/10 text-white text-xs focus:outline-none focus:border-[#e24b4a]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1">
                    Duration (Days)
                  </label>
                  <select
                    value={days}
                    onChange={(e) => setDays(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#070707] border border-white/10 text-white text-xs focus:outline-none focus:border-[#e24b4a]"
                  >
                    <option value="1">1 Day</option>
                    <option value="2">2 Days</option>
                    <option value="3">3 Days (Weekend Special)</option>
                    <option value="5">5 Days</option>
                    <option value="7">7 Days (Weekly Rate)</option>
                    <option value="14">14 Days</option>
                    <option value="30">30 Days (Monthly Lease)</option>
                  </select>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. David Kamau"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#070707] border border-white/10 text-white placeholder-white/30 text-xs focus:outline-none focus:border-[#e24b4a]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1">
                    Phone Number (M-Pesa enabled) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 0712 345 678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#070707] border border-white/10 text-white placeholder-white/30 text-xs focus:outline-none focus:border-[#e24b4a]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  placeholder="e.g. david@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#070707] border border-white/10 text-white placeholder-white/30 text-xs focus:outline-none focus:border-[#e24b4a]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1">
                  Pickup Location & Special Requests
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. JKIA Airport arrival pickup / Ngong Road showroom collection"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#070707] border border-white/10 text-white placeholder-white/30 text-xs focus:outline-none focus:border-[#e24b4a] resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-4 bg-[#e24b4a] hover:bg-[#c53736] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg shadow-red-950/40"
              >
                <span>{submitting ? 'Submitting Reservation...' : 'Proceed to Payment & Booking'}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
