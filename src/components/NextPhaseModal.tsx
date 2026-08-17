import React from 'react';
import { BRAND_INFO } from '../data/autoventraData';
import { X, Sparkles, MessageCircle, Phone, ArrowRight, ShieldCheck } from 'lucide-react';

interface NextPhaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  category: 'vehicles' | 'rentals' | 'transport';
  onOpenInquiry: (serviceName?: string) => void;
}

export const NextPhaseModal: React.FC<NextPhaseModalProps> = ({
  isOpen,
  onClose,
  category,
  onOpenInquiry,
}) => {
  if (!isOpen) return null;

  const getDetails = () => {
    switch (category) {
      case 'vehicles':
        return {
          badge: 'Vehicle Inventory Catalog',
          heading: 'Live Vehicle Inventory & Showroom',
          desc: 'Our full real-time digital showroom with high-resolution vehicle specs, logbook verifications, and trade-in calculators is being connected in the next phase (powered by Supabase).',
          perks: [
            'Inspected Japanese, European & Local used car inventory',
            'Full valuation & trade-in assessment on Ngong Road',
            'Custom vehicle sourcing from Mombasa & international auctions',
          ],
          cta: 'Inquire About Available Stock',
          serviceName: 'New & Used Car Sales',
        };
      case 'rentals':
        return {
          badge: 'Car Rental Booking Engine',
          heading: 'Fleet Reservation & Self-Drive Hire',
          desc: 'Our self-drive and chauffeur reservation engine is launching in the next phase. In the meantime, our rental fleet is actively available for daily, weekly, and monthly bookings directly via our concierge.',
          perks: [
            'Executive sedans, SUVs, and safari 4x4 vehicles ready in Nairobi',
            'Flexible corporate lease and private airport transfers',
            'Instant booking confirmation over WhatsApp & Phone',
          ],
          cta: 'Book a Rental Directly',
          serviceName: 'Car Rentals',
        };
      case 'transport':
        return {
          badge: 'Transport & Logistics',
          heading: 'Corporate & VIP Mobility Solutions',
          desc: 'Dedicated transport scheduling, group transfers, and corporate fleet dispatch are currently coordinated directly by our transport desk on Ngong Road.',
          perks: [
            'JKIA Airport executive transfers and VIP escort services',
            'Custom staff shuttle routes and long-term corporate mobility',
            'Experienced, vetted, and punctual professional drivers',
          ],
          cta: 'Request Transport Quotation',
          serviceName: 'Transport Services',
        };
    }
  };

  const details = getDetails();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#111] border border-white/10 shadow-2xl overflow-hidden">
        {/* Top Accent bar */}
        <div className="h-1 bg-[#e24b4a] w-full" />

        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0b0b0b]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#e24b4a]" />
            <span className="text-[10px] font-bold tracking-widest text-[#e24b4a] uppercase font-mono">
              {details.badge}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <h3 className="text-lg font-bold font-heading uppercase text-white mb-2">
              {details.heading}
            </h3>
            <p className="text-xs text-white/60 leading-relaxed">
              {details.desc}
            </p>
          </div>

          <div className="bg-[#0b0b0b] border border-white/10 p-4 space-y-2">
            <span className="text-[10px] font-bold text-white uppercase tracking-widest block font-mono">
              Direct Service Highlights:
            </span>
            {details.perks.map((perk, i) => (
              <div key={i} className="flex items-start gap-2.5 text-xs text-white/70">
                <ShieldCheck className="w-3.5 h-3.5 text-[#e24b4a] flex-shrink-0 mt-0.5" />
                <span>{perk}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2.5 pt-2">
            <button
              onClick={() => {
                onClose();
                onOpenInquiry(details.serviceName);
              }}
              className="w-full py-3 px-4 bg-[#e24b4a] hover:bg-[#c53736] text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-red-950/50 cursor-pointer"
            >
              <span>{details.cta}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <div className="grid grid-cols-2 gap-2">
              <a
                href={BRAND_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 px-3 bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30 text-xs font-bold uppercase tracking-wider hover:bg-[#25D366]/30 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Desk</span>
              </a>
              <a
                href={BRAND_INFO.telUrl}
                className="flex items-center justify-center gap-2 py-2.5 px-3 bg-white/5 text-white/80 border border-white/10 text-xs font-bold uppercase tracking-wider hover:text-white transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#e24b4a]" />
                <span>{BRAND_INFO.phone}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

