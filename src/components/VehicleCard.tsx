import React from 'react';
import { Vehicle } from '../types';
import { BRAND_INFO } from '../data/autoventraData';
import {
  Gauge,
  Cog,
  Fuel,
  Sparkles,
  ArrowRight,
  MessageCircle,
  Eye,
  Car,
} from 'lucide-react';

interface VehicleCardProps {
  vehicle: Vehicle;
  viewMode?: 'grid' | 'list';
  onViewDetails: (vehicleId: string | number) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  viewMode = 'grid',
  onViewDetails,
}) => {
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      maximumFractionDigits: 0,
    }).format(amount).replace('KES', 'KSh');
  };

  const primaryPhoto =
    vehicle.photos && vehicle.photos.length > 0
      ? vehicle.photos[0]
      : 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80';

  const whatsappMessage = encodeURIComponent(
    `Hello AutoVentraMotors, I am inquiring about the ${vehicle.year} ${vehicle.make} ${vehicle.model} (Price: ${formatPrice(
      vehicle.discount_price || vehicle.price
    )}). Is it available for viewing / test drive?`
  );

  const whatsappUrl = `https://wa.me/${BRAND_INFO.whatsapp}?text=${whatsappMessage}`;

  const isSold = vehicle.status === 'sold';
  const isReserved = vehicle.status === 'reserved';

  if (viewMode === 'list') {
    return (
      <div
        id={`vehicle-card-${vehicle.id}`}
        className="bg-[#111] border border-white/10 p-4 sm:p-5 flex flex-col md:flex-row gap-5 items-start md:items-center justify-between hover:border-[#e24b4a]/50 transition-all duration-200 group"
      >
        {/* Photo + Badges */}
        <div className="relative w-full md:w-64 h-48 md:h-40 bg-[#0b0b0b] overflow-hidden flex-shrink-0">
          <img
            src={primaryPhoto}
            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            referrerPolicy="no-referrer"
            loading="lazy"
            onError={(e) => {
              // Fallback placeholder if broken URL
              (e.currentTarget as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80';
            }}
          />

          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {vehicle.is_featured && (
              <span className="px-2 py-0.5 bg-[#e24b4a] text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-md">
                <Sparkles className="w-2.5 h-2.5" />
                Featured
              </span>
            )}
            {vehicle.condition && (
              <span className="px-2 py-0.5 bg-black/80 backdrop-blur-sm text-white/90 border border-white/10 text-[9px] font-mono uppercase tracking-wider">
                {vehicle.condition}
              </span>
            )}
          </div>

          {/* Status Badge */}
          {vehicle.status !== 'available' && (
            <div className="absolute top-2 right-2">
              <span
                className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-widest ${
                  isSold
                    ? 'bg-zinc-800 text-white border border-zinc-600'
                    : 'bg-amber-600 text-white'
                }`}
              >
                {vehicle.status}
              </span>
            </div>
          )}
        </div>

        {/* Content Details */}
        <div className="flex-1 space-y-3 w-full">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
            <h3 className="text-lg sm:text-xl font-black font-heading uppercase text-white group-hover:text-[#e24b4a] transition-colors">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h3>
            <span className="text-xs font-mono uppercase text-white/40">
              {vehicle.body_type}
            </span>
          </div>

          {/* Specs Row */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-xs text-white/70 font-mono">
            <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 border border-white/5">
              <Car className="w-3.5 h-3.5 text-[#e24b4a]" />
              <span>{vehicle.body_type}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 border border-white/5">
              <Cog className="w-3.5 h-3.5 text-[#e24b4a]" />
              <span>{vehicle.transmission}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 border border-white/5">
              <Fuel className="w-3.5 h-3.5 text-[#e24b4a]" />
              <span>{vehicle.fuel_type}</span>
            </div>
          </div>

          {vehicle.description && (
            <p className="text-xs text-white/50 line-clamp-2 max-w-2xl">
              {vehicle.description}
            </p>
          )}
        </div>

        {/* Price & Actions */}
        <div className="w-full md:w-56 flex md:flex-col justify-between items-end md:items-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-white/10 flex-shrink-0">
          <div className="text-left md:text-right">
            {vehicle.discount_price ? (
              <div>
                <span className="text-xs text-white/40 line-through block font-mono">
                  {formatPrice(vehicle.price)}
                </span>
                <span className="text-lg sm:text-xl font-black text-[#e24b4a] font-mono block">
                  {formatPrice(vehicle.discount_price)}
                </span>
              </div>
            ) : (
              <span className="text-lg sm:text-xl font-black text-white font-mono block">
                {formatPrice(vehicle.price)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              id={`vehicle-details-btn-${vehicle.id}`}
              onClick={() => onViewDetails(vehicle.id)}
              className="flex-1 md:w-full py-2.5 px-4 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-widest border border-white/10 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Details</span>
            </button>

            <a
              id={`vehicle-whatsapp-btn-${vehicle.id}`}
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] border border-[#25D366]/40 text-xs font-bold uppercase tracking-wider flex items-center justify-center transition-colors"
              title="Enquire on WhatsApp"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Grid view (Default)
  return (
    <div
      id={`vehicle-card-${vehicle.id}`}
      className="bg-[#111] border border-white/10 flex flex-col justify-between hover:border-[#e24b4a]/50 transition-all duration-200 group relative"
    >
      <div>
        {/* Photo Banner */}
        <div className="relative aspect-video w-full bg-[#0b0b0b] overflow-hidden">
          <img
            src={primaryPhoto}
            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            referrerPolicy="no-referrer"
            loading="lazy"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80';
            }}
          />

          {/* Badges Top Left */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {vehicle.is_featured && (
              <span className="px-2 py-0.5 bg-[#e24b4a] text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-md">
                <Sparkles className="w-2.5 h-2.5" />
                Featured
              </span>
            )}
            {vehicle.condition && (
              <span className="px-2 py-0.5 bg-black/80 backdrop-blur-sm text-white/90 border border-white/10 text-[9px] font-mono uppercase tracking-wider">
                {vehicle.condition}
              </span>
            )}
          </div>

          {/* Status Badge Top Right */}
          {vehicle.status !== 'available' && (
            <div className="absolute top-2 right-2 z-10">
              <span
                className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-widest ${
                  isSold
                    ? 'bg-zinc-800 text-white border border-zinc-600'
                    : 'bg-amber-600 text-white'
                }`}
              >
                {vehicle.status}
              </span>
            </div>
          )}

          {/* Photo count indicator */}
          {vehicle.photos && vehicle.photos.length > 1 && (
            <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-0.5 text-[10px] font-mono text-white/80 border border-white/10">
              {vehicle.photos.length} Photos
            </div>
          )}
        </div>

        {/* Body Content */}
        <div className="p-5 space-y-4">
          <div>
            <div className="flex justify-between items-center text-[10px] font-mono uppercase text-white/40 mb-1">
              <span>{vehicle.body_type}</span>
              <span>ID: #{vehicle.id}</span>
            </div>
            <h3 className="text-base font-black font-heading uppercase text-white group-hover:text-[#e24b4a] transition-colors leading-snug">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h3>
          </div>

          {/* Specifications Pills */}
          <div className="grid grid-cols-3 gap-1.5 text-[11px] text-white/70 font-mono">
            <div className="bg-white/5 p-1.5 text-center border border-white/5">
              <Car className="w-3 h-3 text-[#e24b4a] mx-auto mb-0.5" />
              <span className="block truncate">{vehicle.condition || vehicle.body_type}</span>
            </div>
            <div className="bg-white/5 p-1.5 text-center border border-white/5">
              <Cog className="w-3 h-3 text-[#e24b4a] mx-auto mb-0.5" />
              <span className="block truncate">{vehicle.transmission}</span>
            </div>
            <div className="bg-white/5 p-1.5 text-center border border-white/5">
              <Fuel className="w-3 h-3 text-[#e24b4a] mx-auto mb-0.5" />
              <span className="block truncate">{vehicle.fuel_type}</span>
            </div>
          </div>

          {/* Price display */}
          <div className="pt-2 border-t border-white/10 flex items-baseline justify-between">
            <span className="text-[10px] uppercase font-mono text-white/40">
              Price
            </span>
            <div className="text-right">
              {vehicle.discount_price ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/40 line-through font-mono">
                    {formatPrice(vehicle.price)}
                  </span>
                  <span className="text-base font-black text-[#e24b4a] font-mono">
                    {formatPrice(vehicle.discount_price)}
                  </span>
                </div>
              ) : (
                <span className="text-base font-black text-white font-mono">
                  {formatPrice(vehicle.price)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Card Actions */}
      <div className="p-5 pt-0 grid grid-cols-12 gap-2">
        <button
          id={`vehicle-details-btn-${vehicle.id}`}
          onClick={() => onViewDetails(vehicle.id)}
          className="col-span-8 py-2.5 px-3 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-widest border border-white/10 transition-colors flex items-center justify-center gap-1 cursor-pointer"
        >
          <span>View Details</span>
          <ArrowRight className="w-3 h-3 text-[#e24b4a]" />
        </button>

        <a
          id={`vehicle-whatsapp-btn-${vehicle.id}`}
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="col-span-4 py-2.5 px-2 bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] border border-[#25D366]/30 text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-colors"
          title="Enquire on WhatsApp"
        >
          <MessageCircle className="w-3.5 h-3.5 fill-current" />
          <span className="hidden sm:inline">Inquire</span>
        </a>
      </div>
    </div>
  );
};
