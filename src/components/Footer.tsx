import React from 'react';
import { PageId } from '../types';
import { BRAND_INFO } from '../data/autoventraData';
import { AutoVentraLogo } from './AutoVentraLogo';
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Clock,
  ArrowRight,
  Shield,
} from 'lucide-react';

interface FooterProps {
  onNavigate: (page: PageId) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleNav = (pageId: PageId) => {
    onNavigate(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0b0b0b] border-t-4 border-[#e24b4a] text-zinc-300">
      {/* Upper Footer Action Bar */}
      <div className="border-b border-white/5 bg-[#111] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#e24b4a] block mb-1 font-mono">
                {BRAND_INFO.slogan}
              </span>
              <h3 className="text-lg sm:text-xl font-black font-heading uppercase text-white tracking-tight">
                Ready to Experience Seamless Automotive Excellence?
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-3 justify-center">
              <a
                id="footer-call-action-btn"
                href={BRAND_INFO.telUrl}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-widest border border-white/10 transition-all duration-200"
              >
                <Phone className="w-3.5 h-3.5 text-[#e24b4a]" />
                <span>Call {BRAND_INFO.phone}</span>
              </a>
              <a
                id="footer-wa-action-btn"
                href={BRAND_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] font-bold text-xs uppercase tracking-widest border border-[#25D366]/30 transition-all duration-200"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-current" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-5 space-y-4">
            <AutoVentraLogo size="lg" showTagline={true} />
            <p className="text-zinc-400 text-xs leading-relaxed max-w-md pt-2">
              AutoVentraMotors is a modern automotive dealership and mobility solutions provider committed to making vehicle ownership and travel simple, reliable, and affordable. We specialize in the buying, selling, trading, and sourcing of quality vehicles while providing exceptional customer service and professional transport solutions.
            </p>
            <div className="pt-2 flex items-center gap-2 text-[10px] text-zinc-500 font-mono uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5 text-[#e24b4a]" />
              <span>Verified Dealership & Transport Partner · Nairobi, Kenya</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#e24b4a] font-mono">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs font-medium uppercase tracking-wider">
              <li>
                <button
                  id="footer-link-home"
                  onClick={() => handleNav('home')}
                  className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowRight className="w-3 h-3 text-[#e24b4a]" />
                  <span>Homepage</span>
                </button>
              </li>
              <li>
                <button
                  id="footer-link-about"
                  onClick={() => handleNav('about')}
                  className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowRight className="w-3 h-3 text-[#e24b4a]" />
                  <span>About Us (Profile & Mission)</span>
                </button>
              </li>
              <li>
                <button
                  id="footer-link-services"
                  onClick={() => handleNav('services')}
                  className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowRight className="w-3 h-3 text-[#e24b4a]" />
                  <span>Our 8 Core Services</span>
                </button>
              </li>
              <li>
                <button
                  id="footer-link-vehicles"
                  onClick={() => handleNav('vehicles')}
                  className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowRight className="w-3 h-3 text-[#e24b4a]" />
                  <span>Vehicles Catalog</span>
                </button>
              </li>
              <li>
                <button
                  id="footer-link-rentals"
                  onClick={() => handleNav('rentals')}
                  className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowRight className="w-3 h-3 text-[#e24b4a]" />
                  <span>Car Rentals Fleet</span>
                </button>
              </li>
              <li>
                <button
                  id="footer-link-transport"
                  onClick={() => handleNav('transport')}
                  className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowRight className="w-3 h-3 text-[#e24b4a]" />
                  <span>Transport Solutions</span>
                </button>
              </li>
              <li>
                <button
                  id="footer-link-contact"
                  onClick={() => handleNav('contact')}
                  className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowRight className="w-3 h-3 text-[#e24b4a]" />
                  <span>Contact & Location</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Details & Hours */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#e24b4a] font-mono">
              Official Contact
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-3.5 h-3.5 text-[#e24b4a] mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-white block font-medium">Headquarters</strong>
                  <span className="text-zinc-400 text-[11px]">{BRAND_INFO.location}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone className="w-3.5 h-3.5 text-[#e24b4a] mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-white block font-medium">Phone Support</strong>
                  <a
                    id="footer-phone-text-link"
                    href={BRAND_INFO.telUrl}
                    className="text-zinc-400 hover:text-white transition-colors text-[11px]"
                  >
                    {BRAND_INFO.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail className="w-3.5 h-3.5 text-[#e24b4a] mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-white block font-medium">Email Inquiries</strong>
                  <a
                    id="footer-email-text-link"
                    href={BRAND_INFO.mailUrl}
                    className="text-[#e24b4a] hover:underline transition-colors text-[11px]"
                  >
                    {BRAND_INFO.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5 pt-1">
                <Clock className="w-3.5 h-3.5 text-[#e24b4a] mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-white block font-medium">Working Hours</strong>
                  <div className="text-zinc-400 text-[11px] space-y-0.5 mt-1 font-mono">
                    {BRAND_INFO.businessHours.map((h, i) => (
                      <p key={i} className="flex justify-between gap-4">
                        <span>{h.days}:</span>
                        <span className="text-zinc-300">{h.hours}</span>
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-zinc-500 font-mono uppercase tracking-wider">
          <p>
            © {new Date().getFullYear()} {BRAND_INFO.fullName}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-zinc-400 font-medium">
              {BRAND_INFO.tagline}
            </span>
            <span className="text-zinc-700">|</span>
            <span className="text-zinc-400">Nairobi, Kenya</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

