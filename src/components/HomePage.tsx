import React, { useState, useEffect } from 'react';
import { PageId, Vehicle } from '../types';
import { getVehicles } from '../lib/supabase';
import { VehicleCard } from './VehicleCard';
import {
  BRAND_INFO,
  COMPANY_PROFILE,
  CORE_VALUES,
  PILLARS_STRIP,
  SERVICES,
} from '../data/autoventraData';
import {
  Car,
  KeyRound,
  Compass,
  Repeat,
  Search,
  Globe2,
  CircleDollarSign,
  HelpCircle,
  Scale,
  ShieldCheck,
  Users,
  Award,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  Shield,
  Phone,
  MessageCircle,
  Sparkles,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: PageId) => void;
  onOpenInquiry: (serviceName?: string) => void;
  onOpenNextPhase: (category: 'vehicles' | 'rentals' | 'transport', title: string) => void;
  onViewVehicleDetails?: (vehicleId: string | number) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenInquiry,
  onOpenNextPhase,
  onViewVehicleDetails,
}) => {
  const [featuredVehicles, setFeaturedVehicles] = useState<Vehicle[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState<boolean>(true);

  useEffect(() => {
    fetchFeatured();
  }, []);

  const fetchFeatured = async () => {
    setLoadingVehicles(true);
    const res = await getVehicles();
    const featured = (res.data || []).filter((v) => v.is_featured);
    setFeaturedVehicles(featured);
    setLoadingVehicles(false);
  };

  // Map value icons
  const getCoreValueIcon = (iconName: string) => {
    switch (iconName) {
      case 'Scale':
        return <Scale className="w-5 h-5 text-[#e24b4a]" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-[#e24b4a]" />;
      case 'Users':
        return <Users className="w-5 h-5 text-[#e24b4a]" />;
      case 'Award':
        return <Award className="w-5 h-5 text-[#e24b4a]" />;
      case 'Lightbulb':
        return <Lightbulb className="w-5 h-5 text-[#e24b4a]" />;
      case 'CheckCircle2':
        return <CheckCircle2 className="w-5 h-5 text-[#e24b4a]" />;
      default:
        return <Shield className="w-5 h-5 text-[#e24b4a]" />;
    }
  };

  // Map service icons
  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Car':
        return <Car className="w-5 h-5 text-[#e24b4a]" />;
      case 'KeyRound':
        return <KeyRound className="w-5 h-5 text-[#e24b4a]" />;
      case 'Compass':
        return <Compass className="w-5 h-5 text-[#e24b4a]" />;
      case 'Repeat':
        return <Repeat className="w-5 h-5 text-[#e24b4a]" />;
      case 'Search':
        return <Search className="w-5 h-5 text-[#e24b4a]" />;
      case 'Globe2':
        return <Globe2 className="w-5 h-5 text-[#e24b4a]" />;
      case 'CircleDollarSign':
        return <CircleDollarSign className="w-5 h-5 text-[#e24b4a]" />;
      case 'HelpCircle':
        return <HelpCircle className="w-5 h-5 text-[#e24b4a]" />;
      default:
        return <Car className="w-5 h-5 text-[#e24b4a]" />;
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* 1. DARK HERO SECTION (Professional Polish Theme) */}
      <section className="relative bg-gradient-to-b from-[#1a1a1a] to-[#0b0b0b] text-white pt-20 pb-28 lg:pt-28 lg:pb-36 overflow-hidden border-b border-white/10">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#e24b4a]/15 rounded-full blur-3xl -translate-y-1/2" />
          <div
            className="w-full h-full opacity-10"
            style={{
              backgroundImage: 'radial-gradient(#666 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Eyebrow */}
          <span className="text-[#e24b4a] font-bold text-xs uppercase tracking-[0.3em] mb-4 block font-mono">
            {BRAND_INFO.tagline}
          </span>

          {/* Main Headline */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black mb-6 leading-[0.95] text-white tracking-tighter uppercase font-heading">
            DRIVE WITH<br />CONFIDENCE.
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg lg:text-xl text-white/60 mb-10 max-w-xl mx-auto font-medium leading-relaxed">
            {BRAND_INFO.heroSubheadline}
          </p>

          {/* Three Primary CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <button
              id="hero-browse-vehicles-btn"
              onClick={() => onNavigate('vehicles')}
              className="w-full sm:w-auto px-8 py-4 bg-[#e24b4a] hover:bg-[#c53736] text-white font-bold uppercase tracking-widest text-xs transition-all duration-200 cursor-pointer shadow-lg shadow-red-950/40"
            >
              Browse Vehicles
            </button>

            <button
              id="hero-book-rental-btn"
              onClick={() => onOpenNextPhase('rentals', 'Book a Rental')}
              className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold uppercase tracking-widest text-xs backdrop-blur-sm transition-all duration-200 cursor-pointer border border-white/10"
            >
              Book a Rental
            </button>

            <button
              id="hero-request-transport-btn"
              onClick={() => onOpenNextPhase('transport', 'Request Transport')}
              className="w-full sm:w-auto px-8 py-4 border border-white/20 hover:bg-white/10 text-white font-bold uppercase tracking-widest text-xs transition-all duration-200 cursor-pointer"
            >
              Request Transport
            </button>
          </div>

          {/* Quick trust strip */}
          <div className="pt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-white/40 font-mono uppercase tracking-wider">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#e24b4a] rotate-45" />
              Verified Vehicle Logbooks
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#e24b4a] rotate-45" />
              Ngong Road Showroom Hub
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#e24b4a] rotate-45" />
              Transparent Pricing
            </span>
          </div>
        </div>
      </section>

      {/* 2. THREE-COLUMN DARK STRIP (Professional Polish Theme) */}
      <section className="grid grid-cols-1 md:grid-cols-3 bg-[#111] border-y border-white/5 divide-y md:divide-y-0 md:divide-x divide-white/5 shrink-0">
        {PILLARS_STRIP.map((pillar) => {
          const getIcon = () => {
            if (pillar.id === 'buy') return <Car className="w-5 h-5 text-[#e24b4a]" />;
            if (pillar.id === 'rent') return <KeyRound className="w-5 h-5 text-[#e24b4a]" />;
            return <Compass className="w-5 h-5 text-[#e24b4a]" />;
          };

          return (
            <div
              key={pillar.id}
              onClick={() => {
                if (pillar.id === 'buy') {
                  onNavigate('vehicles');
                } else {
                  onOpenNextPhase(
                    pillar.id as 'rentals' | 'transport',
                    pillar.actionLabel
                  );
                }
              }}
              className="flex items-center justify-start sm:justify-center gap-4 p-6 md:py-6 md:px-8 group cursor-pointer hover:bg-white/[0.02] transition-colors"
            >
              <div className="w-12 h-12 flex items-center justify-center text-[#e24b4a] bg-white/5 rounded-full flex-shrink-0 group-hover:bg-[#e24b4a]/10 transition-colors">
                {getIcon()}
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-white uppercase tracking-wider leading-none flex items-center gap-2">
                  <span>{pillar.title}</span>
                  <span className="text-[10px] text-[#e24b4a] font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                    →
                  </span>
                </div>
                <div className="text-[11px] text-white/40 mt-1.5 leading-tight">
                  {pillar.text}
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* 3. FEATURED VEHICLES SECTION (Pulls live where is_featured = true) */}
      <section className="bg-[#0b0b0b] text-white py-16 lg:py-20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-[#e24b4a]" />
                <span className="text-[#e24b4a] font-bold text-xs uppercase tracking-[0.25em] font-mono">
                  Curated Inventory
                </span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black font-heading uppercase text-white tracking-tight">
                Featured Vehicles
              </h2>
            </div>

            <button
              id="home-explore-showroom-btn"
              onClick={() => onNavigate('vehicles')}
              className="text-xs uppercase font-bold tracking-widest text-white hover:text-[#e24b4a] flex items-center gap-2 group cursor-pointer"
            >
              <span>Explore Full Showroom</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#e24b4a]" />
            </button>
          </div>

          {/* Featured Vehicles Content */}
          {loadingVehicles ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-8 h-8 border-2 border-[#e24b4a] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-mono uppercase tracking-widest text-white/50">
                Checking Live Inventory...
              </p>
            </div>
          ) : featuredVehicles.length === 0 ? (
            /* EXACT REQUIRED EMPTY STATE STRING */
            <div className="bg-[#111] border border-white/10 p-10 sm:p-14 text-center space-y-4">
              <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-[#e24b4a]">
                <Car className="w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-black font-heading uppercase text-white tracking-tight">
                No vehicles listed yet — check back soon.
              </h3>
              <p className="text-xs text-white/50 max-w-md mx-auto">
                Vehicles marked as featured in the database will appear here. You can also submit a bespoke car sourcing request for any foreign import.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('vehicles')}
                  className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer"
                >
                  Visit Showroom
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredVehicles.slice(0, 6).map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  viewMode="grid"
                  onViewDetails={(id) => {
                    if (onViewVehicleDetails) {
                      onViewVehicleDetails(id);
                    } else {
                      onNavigate('vehicles');
                    }
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. LIGHT GREY SECTIONS (#f1efe8) (Professional Polish Theme) */}
      <div className="bg-[#f1efe8] text-[#0b0b0b]">
        {/* Section A: Why AutoVentra & Services in Sleek Dual Split */}
        <section className="py-16 lg:py-20 border-b border-[#0b0b0b]/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Left Column: Why AutoVentraMobilities (4 Core Pillars) */}
              <div className="lg:col-span-4 bg-white/60 p-6 sm:p-8 border border-[#0b0b0b]/5 flex flex-col justify-between">
                <div>
                  <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#e24b4a] mb-6">
                    Why AutoVentraMobilities
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-5">
                    {CORE_VALUES.slice(0, 4).map((val, idx) => (
                      <div key={idx} className="border-b border-[#0b0b0b]/5 pb-4 last:border-0 last:pb-0">
                        <p className="font-bold text-xs uppercase tracking-wider text-[#0b0b0b] flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-[#e24b4a] rotate-45" />
                          {val.name}
                        </p>
                        <p className="text-[11px] text-[#0b0b0b]/70 leading-relaxed mt-1">
                          {val.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-[#0b0b0b]/5">
                  <button
                    id="why-about-more-btn"
                    onClick={() => onNavigate('about')}
                    className="text-xs font-bold uppercase tracking-wider text-[#0b0b0b] hover:text-[#e24b4a] flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <span>Read Full Profile & Objectives</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Right Column: Our Services Grid */}
              <div className="lg:col-span-8 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-end mb-6 pb-2 border-b border-[#0b0b0b]/10">
                    <div>
                      <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#e24b4a]">
                        Our Services
                      </h2>
                      <p className="text-xs text-[#0b0b0b]/60 mt-1">
                        Comprehensive Automotive Solutions
                      </p>
                    </div>
                    <button
                      id="services-view-all-btn"
                      onClick={() => onNavigate('services')}
                      className="text-[10px] uppercase font-bold tracking-wider border-b border-[#0b0b0b] pb-0.5 hover:text-[#e24b4a] hover:border-[#e24b4a] transition-colors cursor-pointer"
                    >
                      View All 8 Services →
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                    {SERVICES.map((srv) => (
                      <div
                        key={srv.id}
                        className="bg-white p-4 border border-[#0b0b0b]/5 flex flex-col justify-between hover:border-[#e24b4a]/40 transition-all shadow-xs group"
                      >
                        <div className="space-y-2">
                          <div className="w-8 h-8 rounded-full bg-[#f1efe8] flex items-center justify-center group-hover:bg-[#e24b4a]/10 transition-colors">
                            {getServiceIcon(srv.icon)}
                          </div>
                          <p className="text-[11px] font-bold leading-tight uppercase text-[#0b0b0b] group-hover:text-[#e24b4a] transition-colors">
                            {srv.title}
                          </p>
                          <p className="text-[10px] text-[#0b0b0b]/60 line-clamp-2 leading-relaxed">
                            {srv.shortDescription}
                          </p>
                        </div>
                        <div className="pt-3 mt-3 border-t border-[#0b0b0b]/5 flex items-center justify-between">
                          <button
                            id={`home-service-inquire-${srv.id}`}
                            onClick={() => onOpenInquiry(srv.title)}
                            className="text-[9px] text-[#e24b4a] font-bold tracking-wider uppercase hover:underline cursor-pointer flex items-center gap-1"
                          >
                            <span>Inquire</span>
                            <ArrowRight className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section B: Company Snapshot Card */}
        <section className="py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-[#0b0b0b] text-white p-8 sm:p-12 lg:p-14 border border-white/10 shadow-2xl relative overflow-hidden">
              <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                <div className="lg:col-span-8 space-y-6">
                  <span className="text-xs font-bold tracking-[0.25em] uppercase text-[#e24b4a] font-mono block">
                    {BRAND_INFO.slogan}
                  </span>

                  <h2 className="text-3xl sm:text-4xl font-black font-heading uppercase tracking-tight text-white">
                    {COMPANY_PROFILE.title}
                  </h2>

                  <p className="text-white/70 text-sm sm:text-base leading-relaxed">
                    {COMPANY_PROFILE.text}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-white/80 font-medium">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#e24b4a] flex-shrink-0" />
                      <span>Transparent Logbook & Inspection Audits</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#e24b4a] flex-shrink-0" />
                      <span>Direct Asset Financing Partnerships</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#e24b4a] flex-shrink-0" />
                      <span>Global Sourcing & Port Clearance (Mombasa)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#e24b4a] flex-shrink-0" />
                      <span>Dedicated Transport & Executive Rental Desk</span>
                    </div>
                  </div>

                  <div className="pt-4 flex flex-wrap gap-4">
                    <button
                      id="snapshot-contact-btn"
                      onClick={() => onNavigate('contact')}
                      className="px-6 py-3 bg-[#e24b4a] hover:bg-[#c53736] text-white font-bold text-xs uppercase tracking-widest transition-colors cursor-pointer"
                    >
                      Visit Our Ngong Road Location
                    </button>
                    <a
                      id="snapshot-call-btn"
                      href={BRAND_INFO.telUrl}
                      className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#e24b4a]" />
                      <span>{BRAND_INFO.phone}</span>
                    </a>
                  </div>
                </div>

                <div className="lg:col-span-4 bg-[#111] border border-white/10 p-6 space-y-5">
                  <div className="border-b border-white/5 pb-3">
                    <span className="text-[10px] text-white/40 uppercase tracking-widest block font-mono">
                      Location Hub
                    </span>
                    <strong className="text-white text-sm font-heading block mt-1">
                      {BRAND_INFO.location}
                    </strong>
                  </div>

                  <div className="border-b border-white/5 pb-3">
                    <span className="text-[10px] text-white/40 uppercase tracking-widest block font-mono">
                      Official Inquiries
                    </span>
                    <a
                      href={BRAND_INFO.mailUrl}
                      className="text-[#e24b4a] hover:underline text-xs font-medium block mt-1"
                    >
                      {BRAND_INFO.email}
                    </a>
                  </div>

                  <div>
                    <span className="text-[10px] text-white/40 uppercase tracking-widest block font-mono mb-2">
                      Immediate WhatsApp Support
                    </span>
                    <a
                      href={BRAND_INFO.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#25D366]/20 text-[#25D366] font-bold text-xs uppercase tracking-wider border border-[#25D366]/30 hover:bg-[#25D366]/30 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4 fill-current" />
                      <span>Chat on WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};


