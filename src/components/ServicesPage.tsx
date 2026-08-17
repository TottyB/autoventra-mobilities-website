import React, { useState } from 'react';
import { PageId, ServiceItem } from '../types';
import { SERVICES, BRAND_INFO } from '../data/autoventraData';
import {
  Car,
  KeyRound,
  Compass,
  Repeat,
  Search,
  Globe2,
  CircleDollarSign,
  HelpCircle,
  Check,
  ArrowRight,
  Phone,
  MessageCircle,
  X,
  Sparkles,
} from 'lucide-react';

interface ServicesPageProps {
  onNavigate: (page: PageId) => void;
  onOpenInquiry: (serviceName?: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  onNavigate,
  onOpenInquiry,
}) => {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  const getServiceIcon = (iconName: string, className = 'w-5 h-5 text-[#e24b4a]') => {
    switch (iconName) {
      case 'Car':
        return <Car className={className} />;
      case 'KeyRound':
        return <KeyRound className={className} />;
      case 'Compass':
        return <Compass className={className} />;
      case 'Repeat':
        return <Repeat className={className} />;
      case 'Search':
        return <Search className={className} />;
      case 'Globe2':
        return <Globe2 className={className} />;
      case 'CircleDollarSign':
        return <CircleDollarSign className={className} />;
      case 'HelpCircle':
        return <HelpCircle className={className} />;
      default:
        return <Car className={className} />;
    }
  };

  return (
    <div className="w-full bg-[#0b0b0b] text-white">
      {/* Services Header Banner */}
      <section className="relative bg-gradient-to-b from-[#1a1a1a] to-[#0b0b0b] border-b border-white/10 py-16 lg:py-24 overflow-hidden">
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-[#e24b4a] font-bold text-xs uppercase tracking-[0.3em] mb-2 block font-mono">
            AutoVentraMobilities Solutions
          </span>
          <h1 className="text-4xl sm:text-6xl font-black font-heading uppercase tracking-tighter text-white">
            OUR <span className="text-[#e24b4a]">SERVICES</span>
          </h1>
          <p className="text-white/60 text-sm sm:text-base max-w-2xl mx-auto font-medium">
            From vehicle sales and bespoke sourcing to executive car rentals and cross-border import clearance, explore our 8 dedicated automotive solutions.
          </p>
        </div>
      </section>

      {/* 8 Cards Grid */}
      <section className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((service, index) => (
            <div
              key={service.id}
              className="bg-[#111] border border-white/10 p-6 flex flex-col justify-between hover:border-[#e24b4a]/50 transition-all duration-200 group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 bg-white/5 flex items-center justify-center group-hover:bg-[#e24b4a]/10 transition-colors">
                    {getServiceIcon(service.icon)}
                  </div>
                  <span className="text-xs font-mono text-zinc-500 font-bold">
                    0{index + 1}
                  </span>
                </div>

                <h3 className="text-base font-bold font-heading uppercase text-white group-hover:text-[#e24b4a] transition-colors leading-snug">
                  {service.title}
                </h3>

                <p className="text-white/60 text-xs leading-relaxed">
                  {service.shortDescription}
                </p>

                {/* Feature highlights preview */}
                <div className="pt-2 space-y-1.5 border-t border-white/5">
                  {service.features.slice(0, 2).map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-[11px] text-white/50">
                      <span className="w-1 h-1 bg-[#e24b4a] rotate-45 flex-shrink-0" />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-5 border-t border-white/10 mt-6 flex items-center justify-between gap-2">
                <button
                  id={`service-learn-more-${service.id}`}
                  onClick={() => setSelectedService(service)}
                  className="text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Details</span>
                  <ArrowRight className="w-3 h-3 text-[#e24b4a]" />
                </button>

                <button
                  id={`service-card-inquire-${service.id}`}
                  onClick={() => onOpenInquiry(service.title)}
                  className="px-3 py-1.5 bg-[#e24b4a] hover:bg-[#c53736] text-white text-[10px] font-bold uppercase tracking-widest transition-colors cursor-pointer"
                >
                  Inquire
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Service Detail Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-[#111] border border-white/10 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="h-1 bg-[#e24b4a] w-full flex-shrink-0" />

            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-[#0b0b0b] flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/5 flex items-center justify-center">
                  {getServiceIcon(selectedService.icon, 'w-5 h-5 text-[#e24b4a]')}
                </div>
                <div>
                  <span className="text-[10px] font-bold font-mono tracking-widest text-[#e24b4a] uppercase">
                    AutoVentraMobilities Service Overview
                  </span>
                  <h3 className="text-lg font-bold font-heading uppercase text-white">
                    {selectedService.title}
                  </h3>
                </div>
              </div>

              <button
                id="close-service-modal-btn"
                onClick={() => setSelectedService(null)}
                className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                aria-label="Close details"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-6 overflow-y-auto">
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#e24b4a] font-mono mb-2">
                  Service Description
                </h4>
                <p className="text-white/80 text-sm leading-relaxed">
                  {selectedService.fullDescription}
                </p>
              </div>

              <div className="bg-[#0b0b0b] border border-white/10 p-5 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#e24b4a]" />
                  Key Standards & Deliverables
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {selectedService.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-white/70">
                      <div className="w-4 h-4 bg-[#e24b4a]/20 border border-[#e24b4a]/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-[#e24b4a]" />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    const title = selectedService.title;
                    setSelectedService(null);
                    onOpenInquiry(title);
                  }}
                  className="flex-1 py-3 px-5 bg-[#e24b4a] hover:bg-[#c53736] text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-red-950/40"
                >
                  <span>Request Quote for {selectedService.title}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <a
                  href={BRAND_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 px-5 bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] font-bold text-xs uppercase tracking-widest border border-[#25D366]/30 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Ask on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Consultation Banner */}
      <section className="border-t border-white/10 bg-[#111] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#0b0b0b] border border-white/10 p-8 sm:p-12 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center lg:text-left">
              <span className="text-xs font-mono uppercase tracking-widest text-[#e24b4a]">
                Tailored Automotive Advisory
              </span>
              <h3 className="text-2xl sm:text-3xl font-black font-heading uppercase text-white tracking-tight">
                Not Sure Which Vehicle or Service Fits Your Needs?
              </h3>
              <p className="text-white/60 text-sm max-w-xl">
                Our seasoned automotive advisors on Ngong Road, Nairobi are ready to provide impartial technical guidance, import duty estimates, and fleet optimization advice.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <a
                id="services-call-advisors-btn"
                href={BRAND_INFO.telUrl}
                className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-widest border border-white/10 flex items-center gap-2"
              >
                <Phone className="w-3.5 h-3.5 text-[#e24b4a]" />
                <span>Call {BRAND_INFO.phone}</span>
              </a>

              <button
                id="services-contact-advisors-btn"
                onClick={() => onNavigate('contact')}
                className="px-6 py-3 bg-[#e24b4a] hover:bg-[#c53736] text-white font-bold text-xs uppercase tracking-widest cursor-pointer"
              >
                Visit Contact Page
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

