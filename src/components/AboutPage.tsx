import React from 'react';
import { PageId } from '../types';
import {
  BRAND_INFO,
  COMPANY_PROFILE,
  VISION,
  MISSION,
  OBJECTIVES,
  GOALS,
  CORE_VALUES,
} from '../data/autoventraData';
import {
  Eye,
  Target,
  ListChecks,
  TrendingUp,
  Scale,
  ShieldCheck,
  Users,
  Award,
  Lightbulb,
  CheckCircle2,
  MapPin,
  Shield,
} from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: PageId) => void;
  onOpenInquiry: (serviceName?: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onNavigate,
}) => {
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

  return (
    <div className="w-full bg-[#0b0b0b] text-white">
      {/* Page Header Banner */}
      <section className="relative bg-gradient-to-b from-[#1a1a1a] to-[#0b0b0b] border-b border-white/10 py-16 lg:py-24 overflow-hidden">
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-[#e24b4a] font-bold text-xs uppercase tracking-[0.3em] mb-2 block font-mono">
            About AutoVentraMotors
          </span>
          <h1 className="text-4xl sm:text-6xl font-black font-heading uppercase tracking-tighter text-white">
            DRIVEN BY INTEGRITY,<br />
            <span className="text-[#e24b4a]">COMMITTED TO EXCELLENCE</span>
          </h1>
          <p className="text-white/60 text-sm sm:text-base max-w-2xl mx-auto font-medium">
            {BRAND_INFO.tagline}
          </p>
        </div>
      </section>

      {/* 1. COMPANY PROFILE SECTION */}
      <section className="py-16 lg:py-20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#e24b4a] font-mono">
                <ShieldCheck className="w-4 h-4" />
                <span>Our Identity</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black font-heading uppercase text-white tracking-tight">
                {COMPANY_PROFILE.title}
              </h2>

              <div className="space-y-4 text-white/70 text-sm sm:text-base leading-relaxed">
                <p>{COMPANY_PROFILE.text}</p>
              </div>

              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs text-white/50 font-mono uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#e24b4a]" />
                  <span>Ngong Road, Nairobi, Kenya</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#e24b4a] rotate-45" />
                  <span>Licensed Automotive Dealership</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#111] border border-white/10 p-6 sm:p-8 space-y-6">
              <div className="space-y-1">
                <span className="text-[10px] text-[#e24b4a] font-mono uppercase tracking-widest font-bold">
                  The AutoVentraMotors Promise
                </span>
                <h3 className="text-lg font-bold font-heading uppercase text-white">
                  {BRAND_INFO.slogan}
                </h3>
              </div>

              <div className="space-y-3 text-xs text-white/80">
                <div className="p-3.5 bg-white/5 border border-white/5 flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#e24b4a] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-bold uppercase text-[11px]">Clear & Honest Pricing</strong>
                    <span className="text-[11px] text-white/60">Zero hidden fees, transparent import breakdown & duty computation.</span>
                  </div>
                </div>

                <div className="p-3.5 bg-white/5 border border-white/5 flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#e24b4a] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-bold uppercase text-[11px]">Multi-Point Vehicle Inspection</strong>
                    <span className="text-[11px] text-white/60">Mechanical, electrical, structural, and logbook provenance audits.</span>
                  </div>
                </div>

                <div className="p-3.5 bg-white/5 border border-white/5 flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#e24b4a] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-bold uppercase text-[11px]">Integrated Transport & Rentals</strong>
                    <span className="text-[11px] text-white/60">Complete mobility coverage for personal, executive, and corporate requirements.</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  id="about-profile-contact-btn"
                  onClick={() => onNavigate('contact')}
                  className="w-full py-3 bg-[#e24b4a] hover:bg-[#c53736] text-white text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer"
                >
                  Contact Showroom
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. VISION & MISSION SECTION */}
      <section className="py-16 lg:py-20 bg-[#111] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Vision Card */}
            <div className="bg-[#0b0b0b] border border-white/10 p-8 flex flex-col justify-between group hover:border-[#e24b4a]/40 transition-colors">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-white/5 flex items-center justify-center text-[#e24b4a]">
                  <Eye className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#e24b4a] font-mono block">
                  Future Direction
                </span>
                <h3 className="text-2xl font-black font-heading uppercase text-white">
                  {VISION.title}
                </h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  {VISION.text}
                </p>
              </div>
            </div>

            {/* Mission Card */}
            <div className="bg-[#0b0b0b] border border-white/10 p-8 flex flex-col justify-between group hover:border-[#e24b4a]/40 transition-colors">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-white/5 flex items-center justify-center text-[#e24b4a]">
                  <Target className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#e24b4a] font-mono block">
                  Daily Purpose
                </span>
                <h3 className="text-2xl font-black font-heading uppercase text-white">
                  {MISSION.title}
                </h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  {MISSION.text}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. OBJECTIVES & GOALS SECTION */}
      <section className="py-16 lg:py-20 border-b border-white/10 bg-[#0b0b0b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Objectives */}
            <div className="bg-[#111] border border-white/10 p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white/5 flex items-center justify-center text-[#e24b4a]">
                  <ListChecks className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold font-heading uppercase text-white tracking-wider">
                  OUR OBJECTIVES
                </h3>
              </div>

              <div className="space-y-3 pt-1">
                {OBJECTIVES.map((obj, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3.5 bg-[#0b0b0b] border border-white/5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#e24b4a] flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-white/80 leading-relaxed">
                      {obj.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Goals */}
            <div className="bg-[#111] border border-white/10 p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white/5 flex items-center justify-center text-[#e24b4a]">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold font-heading uppercase text-white tracking-wider">
                  OUR GOALS
                </h3>
              </div>

              <div className="space-y-3 pt-1">
                {GOALS.map((goal, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3.5 bg-[#0b0b0b] border border-white/5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#e24b4a] flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-white/80 leading-relaxed">
                      {goal.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CORE VALUES SECTION (#f1efe8) */}
      <section className="py-16 lg:py-20 bg-[#f1efe8] text-[#0b0b0b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 space-y-2">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-[#e24b4a] font-mono">
              Foundational Principles
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-heading tracking-tight uppercase text-[#0b0b0b]">
              OUR CORE <span className="text-[#e24b4a]">VALUES</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {CORE_VALUES.map((val, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#0b0b0b]/5 p-6 shadow-xs"
              >
                <div className="w-10 h-10 bg-[#f1efe8] flex items-center justify-center mb-4">
                  {getCoreValueIcon(val.icon)}
                </div>
                <h3 className="text-sm font-bold font-heading text-[#0b0b0b] uppercase tracking-wide">
                  {val.name}
                </h3>
                <p className="text-[#0b0b0b]/70 text-xs mt-2 leading-relaxed">
                  {val.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-[#0b0b0b] text-white p-8 sm:p-10 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-[10px] font-mono text-[#e24b4a] uppercase tracking-widest block mb-1">
                Experience the Difference
              </span>
              <h3 className="text-lg sm:text-xl font-bold font-heading uppercase text-white">
                Discover vehicles and services tailored to your exact journey.
              </h3>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                id="about-explore-services-btn"
                onClick={() => onNavigate('services')}
                className="px-6 py-3 bg-[#e24b4a] hover:bg-[#c53736] text-white font-bold text-xs uppercase tracking-widest transition-colors cursor-pointer"
              >
                View Services
              </button>
              <button
                id="about-contact-btn"
                onClick={() => onNavigate('contact')}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer"
              >
                Get In Touch
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

