import React, { useState, useEffect } from 'react';
import { Vehicle } from '../types';
import { getVehicleById, createLead, isSupabaseConfigured } from '../lib/supabase';
import { BRAND_INFO } from '../data/autoventraData';
import { PaymentInfo } from './PaymentInfo';
import { VehicleReservationModal } from './VehicleReservationModal';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Gauge,
  Cog,
  Fuel,
  ShieldCheck,
  Calendar,
  Phone,
  MessageCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Maximize2,
  X,
  Send,
  MapPin,
  Car,
  FileCheck,
  KeyRound,
  CreditCard,
} from 'lucide-react';

interface VehicleDetailPageProps {
  vehicleId: string | number;
  onBackToShowroom: () => void;
  onOpenInquiry: (serviceName?: string) => void;
}

export const VehicleDetailPage: React.FC<VehicleDetailPageProps> = ({
  vehicleId,
  onBackToShowroom,
  onOpenInquiry,
}) => {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Gallery state
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Test drive form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    preferred_date: '',
    notes: '',
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Vehicle Purchase Reservation Modal state
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);

  useEffect(() => {
    fetchVehicle();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [vehicleId]);

  const fetchVehicle = async () => {
    setLoading(true);
    setError(null);
    const res = await getVehicleById(vehicleId);
    if (
      res.error &&
      res.error !== 'SUPABASE_NOT_CONFIGURED' &&
      res.error !== 'TABLE_NOT_FOUND'
    ) {
      setError(res.error);
    }
    setVehicle(res.data);
    setLoading(false);
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      maximumFractionDigits: 0,
    }).format(amount).replace('KES', 'KSh');
  };

  const handlePrevPhoto = () => {
    if (!vehicle?.photos || vehicle.photos.length === 0) return;
    setActivePhotoIdx((prev) =>
      prev === 0 ? vehicle.photos.length - 1 : prev - 1
    );
  };

  const handleNextPhoto = () => {
    if (!vehicle?.photos || vehicle.photos.length === 0) return;
    setActivePhotoIdx((prev) =>
      prev === vehicle.photos.length - 1 ? 0 : prev + 1
    );
  };

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      setFormError('Please provide your name and phone number.');
      return;
    }

    setFormSubmitting(true);
    setFormError(null);

    const vehicleTitle = vehicle
      ? `${vehicle.year} ${vehicle.make} ${vehicle.model}`
      : `Vehicle #${vehicleId}`;

    const res = await createLead({
      vehicle_id: vehicleId,
      vehicle_name: vehicleTitle,
      name: formData.name,
      phone: formData.phone,
      preferred_date: formData.preferred_date || null,
      notes: formData.notes || null,
    });

    setFormSubmitting(false);

    if (res.success) {
      setFormSubmitted(true);
    } else {
      setFormError(res.error || 'Failed to submit test-drive request');
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center bg-[#0b0b0b] text-white p-8">
        <div className="w-10 h-10 border-2 border-[#e24b4a] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-mono uppercase tracking-widest text-white/60">
          Loading Vehicle Details...
        </p>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="w-full bg-[#0b0b0b] text-white min-h-[70vh] py-16 px-4">
        <div className="max-w-xl mx-auto bg-[#111] border border-white/10 p-8 sm:p-12 text-center space-y-5">
          <AlertCircle className="w-12 h-12 text-[#e24b4a] mx-auto" />
          <h2 className="text-2xl font-bold font-heading uppercase text-white">
            Vehicle Not Found
          </h2>
          <p className="text-xs text-white/60 leading-relaxed">
            The requested vehicle listing is not available in our current inventory or may have been sold.
          </p>
          <button
            onClick={onBackToShowroom}
            className="px-6 py-3 bg-[#e24b4a] hover:bg-[#c53736] text-white text-xs font-bold uppercase tracking-widest cursor-pointer transition-colors"
          >
            Return to Showroom
          </button>
        </div>
      </div>
    );
  }

  const photos =
    vehicle.photos && vehicle.photos.length > 0
      ? vehicle.photos
      : [
          'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
        ];

  const currentPhoto = photos[activePhotoIdx] || photos[0];

  const vehicleTitle = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;

  // WhatsApp link pre-filled with vehicle name and pricing
  const whatsappMessage = encodeURIComponent(
    `Hello AutoVentraMobilities, I am asking about this vehicle on your website: ${vehicleTitle} (Price: ${formatPrice(
      vehicle.discount_price || vehicle.price
    )}, ID: ${vehicle.id}). Is it still available for viewing at Ngong Road?`
  );
  const whatsappUrl = `https://wa.me/${BRAND_INFO.whatsapp}?text=${whatsappMessage}`;

  return (
    <div className="w-full bg-[#0b0b0b] text-white min-h-screen">
      {/* Breadcrumb & Navigation Header */}
      <div className="bg-[#111] border-b border-white/10 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            id="detail-back-to-showroom-btn"
            onClick={onBackToShowroom}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#e24b4a]" />
            <span>Back to Vehicle Showroom</span>
          </button>

          <div className="text-[11px] font-mono text-white/40 uppercase hidden sm:block">
            Showroom / {vehicle.make} / {vehicleTitle}
          </div>
        </div>
      </div>

      {/* Main Vehicle Detail Layout */}
      <section className="py-8 lg:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Photo Gallery & Specifications (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Main Active Photo with Nav Controls */}
            <div className="relative aspect-[16/10] bg-[#000] border border-white/10 overflow-hidden group">
              <img
                src={currentPhoto}
                alt={`${vehicleTitle} - Photo ${activePhotoIdx + 1}`}
                className="w-full h-full object-cover select-none"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80';
                }}
              />

              {/* Photo Overlay Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                {vehicle.is_featured && (
                  <span className="px-3 py-1 bg-[#e24b4a] text-white text-xs font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg">
                    <Sparkles className="w-3.5 h-3.5" />
                    Featured Vehicle
                  </span>
                )}
                <span className="px-2.5 py-1 bg-black/80 backdrop-blur-sm text-white border border-white/10 text-[10px] font-mono uppercase tracking-wider">
                  {vehicle.condition}
                </span>
              </div>

              {/* Status Badge */}
              {vehicle.status !== 'available' && (
                <div className="absolute top-4 right-4 z-10">
                  <span
                    className={`px-3 py-1 text-xs font-black uppercase tracking-widest ${
                      vehicle.status === 'sold'
                        ? 'bg-zinc-800 text-white border border-zinc-600'
                        : 'bg-amber-600 text-white'
                    }`}
                  >
                    {vehicle.status}
                  </span>
                </div>
              )}

              {/* Lightbox Trigger */}
              <button
                onClick={() => setIsLightboxOpen(true)}
                className="absolute bottom-4 right-4 p-2 bg-black/70 hover:bg-black text-white border border-white/20 text-xs transition-colors cursor-pointer"
                title="Expand fullscreen view"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              {/* Navigation Arrows (if multiple photos) */}
              {photos.length > 1 && (
                <>
                  <button
                    onClick={handlePrevPhoto}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 bg-black/60 hover:bg-black text-white border border-white/10 transition-colors cursor-pointer"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNextPhoto}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-black/60 hover:bg-black text-white border border-white/10 transition-colors cursor-pointer"
                    aria-label="Next photo"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Photo Counter */}
              <div className="absolute bottom-4 left-4 bg-black/70 px-3 py-1 text-xs font-mono text-white/90 border border-white/10">
                {activePhotoIdx + 1} / {photos.length}
              </div>
            </div>

            {/* Thumbnail Strip */}
            {photos.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
                {photos.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActivePhotoIdx(idx)}
                    className={`relative w-20 sm:w-24 aspect-video flex-shrink-0 bg-[#000] border transition-all cursor-pointer overflow-hidden ${
                      activePhotoIdx === idx
                        ? 'border-[#e24b4a] scale-105'
                        : 'border-white/10 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Full Spec Table */}
            <div className="bg-[#111] border border-white/10 p-6 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-white font-mono flex items-center gap-2 pb-2 border-b border-white/10">
                <span className="w-1.5 h-1.5 bg-[#e24b4a] rotate-45" />
                Technical Specifications & Data
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
                <div className="bg-[#0b0b0b] p-3 border border-white/5">
                  <span className="text-white/40 uppercase block text-[10px]">Make</span>
                  <strong className="text-white font-medium text-sm">{vehicle.make}</strong>
                </div>

                <div className="bg-[#0b0b0b] p-3 border border-white/5">
                  <span className="text-white/40 uppercase block text-[10px]">Model</span>
                  <strong className="text-white font-medium text-sm">{vehicle.model}</strong>
                </div>

                <div className="bg-[#0b0b0b] p-3 border border-white/5">
                  <span className="text-white/40 uppercase block text-[10px]">Year of Manufacture</span>
                  <strong className="text-white font-medium text-sm">{vehicle.year}</strong>
                </div>

                <div className="bg-[#0b0b0b] p-3 border border-white/5">
                  <span className="text-white/40 uppercase block text-[10px]">Mileage</span>
                  <strong className="text-white font-medium text-sm">{vehicle.mileage}</strong>
                </div>

                <div className="bg-[#0b0b0b] p-3 border border-white/5">
                  <span className="text-white/40 uppercase block text-[10px]">Transmission</span>
                  <strong className="text-white font-medium text-sm">{vehicle.transmission}</strong>
                </div>

                <div className="bg-[#0b0b0b] p-3 border border-white/5">
                  <span className="text-white/40 uppercase block text-[10px]">Fuel Type</span>
                  <strong className="text-white font-medium text-sm">{vehicle.fuel_type}</strong>
                </div>

                <div className="bg-[#0b0b0b] p-3 border border-white/5">
                  <span className="text-white/40 uppercase block text-[10px]">Body Type</span>
                  <strong className="text-white font-medium text-sm">{vehicle.body_type}</strong>
                </div>

                <div className="bg-[#0b0b0b] p-3 border border-white/5">
                  <span className="text-white/40 uppercase block text-[10px]">Condition</span>
                  <strong className="text-white font-medium text-sm">{vehicle.condition}</strong>
                </div>

                <div className="bg-[#0b0b0b] p-3 border border-white/5">
                  <span className="text-white/40 uppercase block text-[10px]">Availability</span>
                  <strong className={`font-medium text-sm capitalize ${vehicle.status === 'available' ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {vehicle.status}
                  </strong>
                </div>
              </div>
            </div>

            {/* Vehicle Description */}
            {vehicle.description && (
              <div className="bg-[#111] border border-white/10 p-6 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-white font-mono flex items-center gap-2 pb-2 border-b border-white/10">
                  <span className="w-1.5 h-1.5 bg-[#e24b4a] rotate-45" />
                  Vehicle Overview & Features
                </h3>
                <p className="text-xs sm:text-sm text-white/70 leading-relaxed whitespace-pre-line">
                  {vehicle.description}
                </p>
              </div>
            )}

            {/* AutoVentra Assurance Strip */}
            <div className="bg-[#111] border border-white/10 p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="flex items-start gap-3">
                <FileCheck className="w-5 h-5 text-[#e24b4a] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold uppercase text-white font-mono">
                    Verified Logbook
                  </h4>
                  <p className="text-white/50 text-[11px] mt-0.5">
                    Clear ownership history with NTSA TIMS record verification.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#e24b4a] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold uppercase text-white font-mono">
                    Mechanical Inspection
                  </h4>
                  <p className="text-white/50 text-[11px] mt-0.5">
                    Engine, transmission, and chassis thoroughly road-tested.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Price Block, WhatsApp Action, & Test-Drive Form (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Title & Price Card */}
            <div className="bg-[#111] border border-white/10 p-6 sm:p-8 space-y-6">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 block mb-1">
                  Listing ID: #{vehicle.id} • {vehicle.body_type}
                </span>
                <h1 className="text-2xl sm:text-3xl font-black font-heading uppercase text-white tracking-tight">
                  {vehicleTitle}
                </h1>
              </div>

              {/* Price Block */}
              <div className="p-4 bg-[#0b0b0b] border border-white/10">
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 block mb-1">
                  Asking Price
                </span>

                {vehicle.discount_price ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-white/40 line-through font-mono">
                        {formatPrice(vehicle.price)}
                      </span>
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono uppercase font-bold">
                        Save {formatPrice(vehicle.price - vehicle.discount_price)}
                      </span>
                    </div>
                    <span className="text-3xl font-black text-[#e24b4a] font-mono block">
                      {formatPrice(vehicle.discount_price)}
                    </span>
                  </div>
                ) : (
                  <span className="text-3xl font-black text-white font-mono block">
                    {formatPrice(vehicle.price)}
                  </span>
                )}

                <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-white/50 font-mono">
                  <span>* Negotiable / Asset Financing Available</span>
                  <span className="text-white/80">Duty Paid</span>
                </div>
              </div>

              {/* Primary Actions: WhatsApp, Reserve Vehicle, Call, Financing */}
              <div className="space-y-3">
                <button
                  id="detail-reserve-vehicle-btn"
                  onClick={() => setIsReservationModalOpen(true)}
                  className="w-full py-4 px-5 bg-[#e24b4a] hover:bg-[#c53736] text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-red-950/50 cursor-pointer"
                >
                  <KeyRound className="w-5 h-5" />
                  <span>Reserve This Vehicle (Hold With Deposit)</span>
                </button>

                <a
                  id="detail-whatsapp-btn"
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-5 bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2.5 transition-colors shadow-lg"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Ask About This Vehicle on WhatsApp</span>
                </a>

                <div className="grid grid-cols-2 gap-2">
                  <a
                    id="detail-call-btn"
                    href={BRAND_INFO.telUrl}
                    className="py-3 px-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#e24b4a]" />
                    <span>Call Showroom</span>
                  </a>

                  <button
                    onClick={() => onOpenInquiry(`Financing: ${vehicleTitle}`)}
                    className="py-3 px-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Asset Financing
                  </button>
                </div>
              </div>
            </div>

            {/* Test Drive Booking Form (Saves to `leads` table in Supabase) */}
            <div className="bg-[#111] border border-white/10 p-6 sm:p-8 space-y-5">
              <div className="border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#e24b4a]" />
                  <h3 className="text-sm font-bold uppercase tracking-widest text-white font-heading">
                    Book a Test Drive
                  </h3>
                </div>
                <p className="text-[11px] text-white/50 mt-1">
                  Schedule an on-site viewing and test drive at our Ngong Road hub.
                </p>
              </div>

              {formSubmitted ? (
                <div className="space-y-4">
                  <div className="p-5 bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2.5">
                    <CheckCircle2 className="w-9 h-9 text-emerald-400 mx-auto" />
                    <h4 className="text-sm font-bold uppercase text-white font-heading">
                      Test Drive & Enquiry Received!
                    </h4>
                    <p className="text-xs text-white/70 leading-relaxed">
                      Thank you, <span className="text-white font-bold">{formData.name}</span>. Your request for the <span className="text-[#e24b4a] font-medium">{vehicleTitle}</span> has been logged to our CRM. Our sales desk will call you shortly on <span className="text-white font-bold">{formData.phone}</span>.
                    </p>
                    <button
                      onClick={() => {
                        setFormSubmitted(false);
                        setFormData({ name: '', phone: '', preferred_date: '', notes: '' });
                      }}
                      className="text-[11px] text-[#e24b4a] hover:underline font-bold uppercase tracking-wider pt-1 inline-block"
                    >
                      Submit another inquiry
                    </button>
                  </div>

                  {/* Pay via M-Pesa Info for Vehicle Reservation/Deposit */}
                  <PaymentInfo
                    context={`vehicle inquiry & test-drive for ${vehicleTitle}`}
                    title="Pay Vehicle Reservation / Deposit via M-Pesa"
                    variant="compact"
                  />
                </div>
              ) : (
                <form onSubmit={handleSubmitLead} className="space-y-4">
                  {formError && (
                    <div className="p-3 bg-red-950/40 border border-red-800/50 text-red-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{formError}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1">
                      Your Full Name *
                    </label>
                    <input
                      id="testdrive-name-input"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. John Mwangi"
                      className="w-full px-3.5 py-2.5 bg-[#0b0b0b] border border-white/10 text-white placeholder-white/30 text-xs focus:outline-none focus:border-[#e24b4a]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1">
                      Phone Number *
                    </label>
                    <input
                      id="testdrive-phone-input"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. 0712 345 678"
                      className="w-full px-3.5 py-2.5 bg-[#0b0b0b] border border-white/10 text-white placeholder-white/30 text-xs focus:outline-none focus:border-[#e24b4a]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1">
                      Preferred Date
                    </label>
                    <input
                      id="testdrive-date-input"
                      type="date"
                      value={formData.preferred_date}
                      onChange={(e) => setFormData({ ...formData, preferred_date: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#0b0b0b] border border-white/10 text-white text-xs focus:outline-none focus:border-[#e24b4a]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1">
                      Notes or Questions (Optional)
                    </label>
                    <textarea
                      id="testdrive-notes-input"
                      rows={2}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="e.g. Looking to trade in my current vehicle..."
                      className="w-full px-3.5 py-2 bg-[#0b0b0b] border border-white/10 text-white placeholder-white/30 text-xs focus:outline-none focus:border-[#e24b4a] resize-none"
                    />
                  </div>

                  <button
                    id="testdrive-submit-btn"
                    type="submit"
                    disabled={formSubmitting}
                    className="w-full py-3.5 px-4 bg-[#e24b4a] hover:bg-[#c53736] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <span>{formSubmitting ? 'Saving Request...' : 'Schedule Test Drive'}</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>

            {/* Showroom Location Summary */}
            <div className="bg-[#111] border border-white/10 p-5 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-white font-bold uppercase font-mono">
                <MapPin className="w-4 h-4 text-[#e24b4a]" />
                <span>Showroom Location</span>
              </div>
              <p className="text-white/60 text-[11px]">
                {BRAND_INFO.location}
              </p>
              <p className="text-white/40 text-[10px] font-mono">
                Monday – Saturday: 8:00 AM – 6:00 PM
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Fullscreen Photo Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4">
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 p-3 text-white/70 hover:text-white cursor-pointer z-50"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative max-w-5xl max-h-[85vh] w-full flex items-center justify-center">
            <img
              src={currentPhoto}
              alt="Fullscreen Preview"
              className="max-w-full max-h-[80vh] object-contain"
              referrerPolicy="no-referrer"
            />

            {photos.length > 1 && (
              <>
                <button
                  onClick={handlePrevPhoto}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-3 bg-black/60 hover:bg-black text-white cursor-pointer"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={handleNextPhoto}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-black/60 hover:bg-black text-white cursor-pointer"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}
          </div>

          <div className="text-xs font-mono text-white/60 mt-4">
            {vehicleTitle} • Photo {activePhotoIdx + 1} of {photos.length}
          </div>
        </div>
      )}

      {/* Vehicle Purchase Reservation Modal (Saves lead with intent = 'purchase') */}
      {vehicle && (
        <VehicleReservationModal
          isOpen={isReservationModalOpen}
          onClose={() => setIsReservationModalOpen(false)}
          vehicle={vehicle}
        />
      )}
    </div>
  );
};
