import React, { useState, useEffect } from 'react';
import { PageId } from './types';
import { BRAND_INFO } from './data/autoventraData';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { AboutPage } from './components/AboutPage';
import { ServicesPage } from './components/ServicesPage';
import { ContactPage } from './components/ContactPage';
import { VehiclesShowroomPage } from './components/VehiclesShowroomPage';
import { VehicleDetailPage } from './components/VehicleDetailPage';
import { InquiryModal } from './components/InquiryModal';
import { NextPhaseModal } from './components/NextPhaseModal';
import { AdminPortal } from './components/admin/AdminPortal';
import { MessageCircle, Phone, ArrowUp } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | number | null>(null);

  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [inquiryService, setInquiryService] = useState<string>('');

  const [nextPhaseModal, setNextPhaseModal] = useState<{
    isOpen: boolean;
    category: 'vehicles' | 'rentals' | 'transport';
    title: string;
  }>({
    isOpen: false,
    category: 'rentals',
    title: 'Car Rental Fleet',
  });

  const [showScrollTop, setShowScrollTop] = useState(false);

  // Sync with browser URL / hash for /vehicles and /vehicles/:id
  useEffect(() => {
    const parseLocation = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;

      if (path.startsWith('/vehicles/') || hash.startsWith('#/vehicles/') || hash.startsWith('#vehicles/')) {
        const id = path.startsWith('/vehicles/')
          ? path.replace('/vehicles/', '')
          : hash.replace('#/vehicles/', '').replace('#vehicles/', '');
        if (id) {
          setSelectedVehicleId(id);
          setCurrentPage('vehicle-detail');
          return;
        }
      }

      if (path === '/vehicles' || hash === '#/vehicles' || hash === '#vehicles') {
        setCurrentPage('vehicles');
        return;
      }

      if (path === '/about' || hash === '#/about' || hash === '#about') {
        setCurrentPage('about');
        return;
      }

      if (path === '/services' || hash === '#/services' || hash === '#services') {
        setCurrentPage('services');
        return;
      }

      if (path === '/contact' || hash === '#/contact' || hash === '#contact') {
        setCurrentPage('contact');
        return;
      }

      if (path === '/av-manage' || hash === '#/av-manage' || hash === '#av-manage') {
        setCurrentPage('av-manage');
        return;
      }
    };

    parseLocation();
    window.addEventListener('popstate', parseLocation);
    window.addEventListener('hashchange', parseLocation);
    return () => {
      window.removeEventListener('popstate', parseLocation);
      window.removeEventListener('hashchange', parseLocation);
    };
  }, []);

  useEffect(() => {
    const checkScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', checkScroll);
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (page: PageId) => {
    if (page === 'rentals') {
      setNextPhaseModal({
        isOpen: true,
        category: 'rentals',
        title: 'Car Rental Fleet',
      });
      return;
    }
    if (page === 'transport') {
      setNextPhaseModal({
        isOpen: true,
        category: 'transport',
        title: 'Transport Logistics Desk',
      });
      return;
    }

    if (page === 'vehicles') {
      try {
        window.history.pushState({}, '', '/vehicles');
      } catch {
        window.location.hash = '#/vehicles';
      }
    } else if (page === 'home') {
      try {
        window.history.pushState({}, '', '/');
      } catch {
        window.location.hash = '';
      }
    } else {
      try {
        window.history.pushState({}, '', `/${page}`);
      } catch {
        window.location.hash = `#/${page}`;
      }
    }

    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewVehicleDetails = (vehicleId: string | number) => {
    setSelectedVehicleId(vehicleId);
    setCurrentPage('vehicle-detail');
    try {
      window.history.pushState({}, '', `/vehicles/${vehicleId}`);
    } catch {
      window.location.hash = `#/vehicles/${vehicleId}`;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenInquiry = (serviceName?: string) => {
    setInquiryService(serviceName || '');
    setInquiryModalOpen(true);
  };

  const handleOpenNextPhase = (
    category: 'vehicles' | 'rentals' | 'transport',
    title: string
  ) => {
    if (category === 'vehicles') {
      handleNavigate('vehicles');
      return;
    }
    setNextPhaseModal({
      isOpen: true,
      category,
      title,
    });
  };

  if (currentPage === 'av-manage') {
    return (
      <div className="min-h-screen bg-[#070707] text-white">
        <AdminPortal
          onBackToSite={() => handleNavigate('home')}
          onNavigateToVehicle={(id) => handleViewVehicleDetails(id)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0b0b] text-[#f1efe8] selection:bg-[#e24b4a] selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenInquiry={handleOpenInquiry}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onOpenInquiry={handleOpenInquiry}
            onOpenNextPhase={handleOpenNextPhase}
            onViewVehicleDetails={handleViewVehicleDetails}
          />
        )}

        {currentPage === 'vehicles' && (
          <VehiclesShowroomPage
            onViewDetails={handleViewVehicleDetails}
            onOpenInquiry={handleOpenInquiry}
          />
        )}

        {currentPage === 'vehicle-detail' && selectedVehicleId && (
          <VehicleDetailPage
            vehicleId={selectedVehicleId}
            onBackToShowroom={() => handleNavigate('vehicles')}
            onOpenInquiry={handleOpenInquiry}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage
            onNavigate={handleNavigate}
            onOpenInquiry={handleOpenInquiry}
          />
        )}

        {currentPage === 'services' && (
          <ServicesPage
            onNavigate={handleNavigate}
            onOpenInquiry={handleOpenInquiry}
          />
        )}

        {currentPage === 'contact' && <ContactPage />}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        {showScrollTop && (
          <button
            id="scroll-to-top-btn"
            onClick={scrollToTop}
            className="p-3 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800 shadow-xl transition-all duration-200 cursor-pointer"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        )}

        <a
          id="floating-whatsapp-btn"
          href={BRAND_INFO.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-bold text-xs uppercase tracking-wider shadow-2xl transition-all duration-200 hover:scale-105"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="w-5 h-5 fill-current" />
          <span className="hidden sm:inline">WhatsApp Us</span>
        </a>
      </div>

      {/* Inquiry & Quote Modal */}
      <InquiryModal
        isOpen={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
        initialService={inquiryService}
      />

      {/* Next Phase Informational Modal */}
      <NextPhaseModal
        isOpen={nextPhaseModal.isOpen}
        onClose={() =>
          setNextPhaseModal((prev) => ({ ...prev, isOpen: false }))
        }
        title={nextPhaseModal.title}
        category={nextPhaseModal.category}
        onOpenInquiry={handleOpenInquiry}
      />
    </div>
  );
}

