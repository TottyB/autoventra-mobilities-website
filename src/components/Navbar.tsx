import React, { useState } from 'react';
import { PageId } from '../types';
import { AutoVentraLogo } from './AutoVentraLogo';
import { BRAND_INFO } from '../data/autoventraData';
import {
  Menu,
  X,
  Phone,
  MessageCircle,
  Car,
  KeyRound,
  Compass,
  Layers,
  Info,
  Mail,
  ChevronRight,
} from 'lucide-react';

interface NavbarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  onOpenInquiry?: (serviceName?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenInquiry,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { id: PageId; label: string; isNextPhase?: boolean; badge?: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'vehicles', label: 'Vehicles', badge: 'Showroom' },
    { id: 'rentals', label: 'Rentals', isNextPhase: true, badge: 'Fleet' },
    { id: 'transport', label: 'Transport', isNextPhase: true, badge: 'Logistics' },
    { id: 'services', label: 'Services' },
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleLinkClick = (pageId: PageId) => {
    onNavigate(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0b0b0b] border-b border-white/10 transition-all duration-300">
      {/* Top micro announcement bar */}
      <div className="bg-[#111] border-b border-white/5 py-1.5 px-4 text-xs font-mono">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-zinc-400">
            <span className="inline-block w-1.5 h-1.5 bg-[#e24b4a] rotate-45" />
            <span className="hidden sm:inline font-medium text-zinc-300 text-[11px] uppercase tracking-wider">
              {BRAND_INFO.location}
            </span>
            <span className="hidden md:inline text-zinc-700">|</span>
            <span className="hidden md:inline text-zinc-400 text-[11px] uppercase tracking-widest">
              "{BRAND_INFO.tagline}"
            </span>
          </div>

          <div className="flex items-center gap-4 text-zinc-300 ml-auto sm:ml-0 text-[11px] uppercase tracking-wider">
            <a
              id="header-phone-link"
              href={BRAND_INFO.telUrl}
              className="flex items-center gap-1.5 hover:text-[#e24b4a] transition-colors"
            >
              <Phone className="w-3 h-3 text-[#e24b4a]" />
              <span>{BRAND_INFO.phone}</span>
            </a>
            <span className="text-zinc-800">|</span>
            <a
              id="header-whatsapp-link"
              href={BRAND_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors text-zinc-300"
            >
              <MessageCircle className="w-3 h-3 text-[#25D366]" />
              <span className="hidden xs:inline">WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <button
            id="brand-logo-btn"
            onClick={() => handleLinkClick('home')}
            className="flex items-center text-left focus:outline-none group cursor-pointer"
            aria-label="AutoVentraMotors Home"
          >
            <AutoVentraLogo size="md" showTagline={false} />
          </button>

          {/* Desktop Nav items */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-xs font-bold uppercase tracking-widest text-zinc-400">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  id={`nav-link-${link.id}`}
                  onClick={() => handleLinkClick(link.id)}
                  className={`relative py-1 transition-colors cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'text-[#e24b4a]'
                      : 'hover:text-white'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.isNextPhase && (
                    <span className="text-[9px] uppercase tracking-wider px-1 py-0.2 rounded bg-white/5 text-zinc-400 border border-white/10 font-mono">
                      {link.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#e24b4a]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Header Action Button */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              id="nav-quick-inquiry-btn"
              onClick={() => onOpenInquiry?.()}
              className="px-5 py-2 border border-[#e24b4a] text-[#e24b4a] text-xs font-bold uppercase tracking-widest hover:bg-[#e24b4a] hover:text-white transition-all duration-200 cursor-pointer"
            >
              Get Quote
            </button>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <a
              id="mobile-call-quick-btn"
              href={BRAND_INFO.telUrl}
              className="p-2.5 bg-[#111] text-[#e24b4a] border border-white/10"
              aria-label="Call AutoVentraMotors"
            >
              <Phone className="w-4 h-4" />
            </a>
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 bg-[#111] text-zinc-200 border border-white/10 hover:text-white focus:outline-none cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-[#e24b4a]" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0b0b0b] border-b border-white/10 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-1 gap-1">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;
              const getIcon = () => {
                switch (link.id) {
                  case 'home':
                    return <Layers className="w-4 h-4 text-zinc-400" />;
                  case 'vehicles':
                    return <Car className="w-4 h-4 text-[#e24b4a]" />;
                  case 'rentals':
                    return <KeyRound className="w-4 h-4 text-[#e24b4a]" />;
                  case 'transport':
                    return <Compass className="w-4 h-4 text-[#e24b4a]" />;
                  case 'services':
                    return <Layers className="w-4 h-4 text-zinc-400" />;
                  case 'about':
                    return <Info className="w-4 h-4 text-zinc-400" />;
                  case 'contact':
                    return <Mail className="w-4 h-4 text-zinc-400" />;
                  default:
                    return null;
                }
              };

              return (
                <button
                  key={link.id}
                  id={`mobile-nav-${link.id}`}
                  onClick={() => handleLinkClick(link.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-xs uppercase tracking-widest font-bold transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-white/5 text-[#e24b4a] border-l-2 border-[#e24b4a]'
                      : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {getIcon()}
                    <span>{link.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {link.isNextPhase && (
                      <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 bg-white/5 text-zinc-400 border border-white/10">
                        {link.badge}
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-zinc-600" />
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-4 mt-4 border-t border-white/10 space-y-2.5">
            <button
              id="mobile-drawer-inquiry-btn"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenInquiry?.();
              }}
              className="w-full py-3 px-4 bg-[#e24b4a] text-white font-bold text-xs uppercase tracking-widest cursor-pointer"
            >
              Get Quote / Request Service
            </button>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <a
                id="mobile-drawer-call-btn"
                href={BRAND_INFO.telUrl}
                className="flex items-center justify-center gap-2 py-2.5 px-3 bg-[#111] text-zinc-200 border border-white/10 text-xs uppercase tracking-wider font-bold"
              >
                <Phone className="w-4 h-4 text-[#e24b4a]" />
                <span>Call Us</span>
              </a>
              <a
                id="mobile-drawer-wa-btn"
                href={BRAND_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 px-3 bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30 text-xs uppercase tracking-wider font-bold"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

