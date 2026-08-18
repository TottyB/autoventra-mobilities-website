import React, { useState, useEffect, useMemo } from 'react';
import { Vehicle } from '../types';
import { getVehicles, isSupabaseConfigured, SUPABASE_SQL_SETUP } from '../lib/supabase';
import { VehicleCard } from './VehicleCard';
import { BRAND_INFO } from '../data/autoventraData';
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  RotateCcw,
  Sparkles,
  Car,
  AlertCircle,
  Code2,
  Copy,
  Check,
  Phone,
  MessageCircle,
  ChevronDown,
  X,
  ShieldCheck,
} from 'lucide-react';

interface VehiclesShowroomPageProps {
  onViewDetails: (vehicleId: string | number) => void;
  onOpenInquiry: (serviceName?: string) => void;
}

export const VehiclesShowroomPage: React.FC<VehiclesShowroomPageProps> = ({
  onViewDetails,
  onOpenInquiry,
}) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [dbError, setDbError] = useState<string | null>(null);
  const [isTableMissing, setIsTableMissing] = useState<boolean>(false);

  // Search & Sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc' | 'year-desc'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filters
  const [selectedMake, setSelectedMake] = useState<string>('all');
  const [selectedBodyType, setSelectedBodyType] = useState<string>('all');
  const [selectedTransmission, setSelectedTransmission] = useState<string>('all');
  const [selectedFuelType, setSelectedFuelType] = useState<string>('all');
  const [selectedCondition, setSelectedCondition] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [minYear, setMinYear] = useState<string>('');
  const [maxYear, setMaxYear] = useState<string>('');

  // Mobile filters drawer
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [showSqlSetupModal, setShowSqlSetupModal] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // Fetch vehicles on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setDbError(null);
    setIsTableMissing(false);
    const res = await getVehicles();
    if (res.tableMissing || res.error === 'TABLE_NOT_FOUND') {
      setIsTableMissing(true);
    } else if (res.error && res.error !== 'SUPABASE_NOT_CONFIGURED') {
      setDbError(res.error);
    }
    setVehicles(res.data);
    setLoading(false);
  };

  // Dynamic filter options derived from current database data
  const availableMakes = useMemo(() => {
    const set = new Set<string>();
    vehicles.forEach((v) => {
      if (v.make) set.add(v.make);
    });
    return Array.from(set).sort();
  }, [vehicles]);

  const availableBodyTypes = useMemo(() => {
    const set = new Set<string>();
    vehicles.forEach((v) => {
      if (v.body_type) set.add(v.body_type);
    });
    return Array.from(set).sort();
  }, [vehicles]);

  const availableFuelTypes = useMemo(() => {
    const set = new Set<string>();
    vehicles.forEach((v) => {
      if (v.fuel_type) set.add(v.fuel_type);
    });
    return Array.from(set).sort();
  }, [vehicles]);

  // Filter & Sort Logic
  const filteredVehicles = useMemo(() => {
    return vehicles
      .filter((v) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = `${v.year} ${v.make} ${v.model}`.toLowerCase().includes(q);
          const matchDesc = v.description?.toLowerCase().includes(q);
          const matchFuel = v.fuel_type?.toLowerCase().includes(q);
          const matchBody = v.body_type?.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchFuel && !matchBody) return false;
        }

        // Make filter
        if (selectedMake !== 'all' && v.make.toLowerCase() !== selectedMake.toLowerCase()) {
          return false;
        }

        // Body type filter
        if (selectedBodyType !== 'all' && v.body_type.toLowerCase() !== selectedBodyType.toLowerCase()) {
          return false;
        }

        // Transmission filter
        if (selectedTransmission !== 'all' && v.transmission.toLowerCase() !== selectedTransmission.toLowerCase()) {
          return false;
        }

        // Fuel type filter
        if (selectedFuelType !== 'all' && v.fuel_type.toLowerCase() !== selectedFuelType.toLowerCase()) {
          return false;
        }

        // Condition filter
        if (selectedCondition !== 'all' && v.condition?.toLowerCase() !== selectedCondition.toLowerCase()) {
          return false;
        }

        // Status filter
        if (selectedStatus !== 'all' && v.status !== selectedStatus) {
          return false;
        }

        // Price range
        const actualPrice = v.discount_price || v.price;
        if (minPrice && actualPrice < Number(minPrice)) {
          return false;
        }
        if (maxPrice && actualPrice > Number(maxPrice)) {
          return false;
        }

        // Year range
        if (minYear && v.year < Number(minYear)) {
          return false;
        }
        if (maxYear && v.year > Number(maxYear)) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const priceA = a.discount_price || a.price;
        const priceB = b.discount_price || b.price;

        if (sortBy === 'price-asc') return priceA - priceB;
        if (sortBy === 'price-desc') return priceB - priceA;
        if (sortBy === 'year-desc') return b.year - a.year;
        // Default: newest listed
        return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
      });
  }, [
    vehicles,
    searchQuery,
    selectedMake,
    selectedBodyType,
    selectedTransmission,
    selectedFuelType,
    selectedCondition,
    selectedStatus,
    minPrice,
    maxPrice,
    minYear,
    maxYear,
    sortBy,
  ]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedMake('all');
    setSelectedBodyType('all');
    setSelectedTransmission('all');
    setSelectedFuelType('all');
    setSelectedCondition('all');
    setSelectedStatus('all');
    setMinPrice('');
    setMaxPrice('');
    setMinYear('');
    setMaxYear('');
    setSortBy('newest');
  };

  const hasActiveFilters =
    searchQuery ||
    selectedMake !== 'all' ||
    selectedBodyType !== 'all' ||
    selectedTransmission !== 'all' ||
    selectedFuelType !== 'all' ||
    selectedCondition !== 'all' ||
    selectedStatus !== 'all' ||
    minPrice ||
    maxPrice ||
    minYear ||
    maxYear;

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SETUP);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div className="w-full bg-[#0b0b0b] text-white min-h-screen">
      {/* Header Banner */}
      <section className="relative bg-gradient-to-b from-[#1a1a1a] to-[#0b0b0b] border-b border-white/10 py-12 lg:py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <span className="text-[#e24b4a] font-bold text-xs uppercase tracking-[0.3em] block font-mono">
                AutoVentraMotors Verified Inventory
              </span>
              <h1 className="text-3xl sm:text-5xl font-black font-heading uppercase tracking-tighter text-white">
                VEHICLE <span className="text-[#e24b4a]">SHOWROOM</span>
              </h1>
              <p className="text-white/60 text-xs sm:text-sm max-w-xl font-medium">
                Browse our live selection of foreign and locally used motor vehicles, complete with transparent logbook inspections and direct asset financing support.
              </p>
            </div>

            {/* Quick Stats or Action */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
              <div className="bg-[#111] border border-white/10 px-4 py-2.5 flex items-center gap-2">
                <Car className="w-4 h-4 text-[#e24b4a]" />
                <span className="text-white font-bold">{vehicles.length}</span>
                <span className="text-white/40 uppercase">Total Listed</span>
              </div>

              {(!isSupabaseConfigured() || isTableMissing || vehicles.length === 0) && (
                <button
                  id="showroom-view-schema-btn"
                  onClick={() => setShowSqlSetupModal(true)}
                  className="bg-white/5 hover:bg-white/10 border border-white/20 px-3.5 py-2.5 text-white/80 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="View Supabase Table Schema & Seed SQL"
                >
                  <Code2 className="w-4 h-4 text-[#e24b4a]" />
                  <span>Database Setup / SQL</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Showroom Area */}
      <section className="py-8 lg:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Control Bar: Search + Sort + View Toggle + Mobile Filter Button */}
        <div className="bg-[#111] border border-white/10 p-4 mb-8 flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full lg:w-96">
            <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="showroom-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search make, model, year, fuel..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#0b0b0b] border border-white/10 text-white placeholder-white/40 text-xs font-medium focus:outline-none focus:border-[#e24b4a]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Controls Right */}
          <div className="flex flex-wrap items-center justify-between lg:justify-end gap-3 w-full lg:w-auto">
            {/* Mobile Filter Toggle */}
            <button
              id="showroom-mobile-filter-btn"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden px-3.5 py-2 bg-white/5 border border-white/10 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#e24b4a]" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-[#e24b4a]" />
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-white/40 uppercase hidden sm:inline">Sort:</span>
              <select
                id="showroom-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#0b0b0b] border border-white/10 text-white px-3 py-2 text-xs focus:outline-none focus:border-[#e24b4a]"
              >
                <option value="newest" className="bg-[#111]">Newest Listed</option>
                <option value="price-asc" className="bg-[#111]">Price: Low to High</option>
                <option value="price-desc" className="bg-[#111]">Price: High to Low</option>
                <option value="year-desc" className="bg-[#111]">Year: Newest First</option>
              </select>
            </div>

            {/* Grid / List Layout Toggle */}
            <div className="flex items-center border border-white/10 bg-[#0b0b0b] p-0.5">
              <button
                id="showroom-grid-view-btn"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 transition-colors cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-[#e24b4a] text-white'
                    : 'text-white/40 hover:text-white'
                }`}
                aria-label="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                id="showroom-list-view-btn"
                onClick={() => setViewMode('list')}
                className={`p-1.5 transition-colors cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-[#e24b4a] text-white'
                    : 'text-white/40 hover:text-white'
                }`}
                aria-label="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Showroom Layout: Sidebar Filters + Vehicles Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Desktop Left Sidebar Filters */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6">
            <div className="bg-[#111] border border-white/10 p-5 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#e24b4a]" />
                  <span className="text-xs font-bold uppercase tracking-widest text-white font-heading">
                    Filter Vehicles
                  </span>
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={handleResetFilters}
                    className="text-[10px] text-[#e24b4a] hover:underline uppercase font-mono cursor-pointer flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                )}
              </div>

              {/* Make Filter */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70">
                  Vehicle Make
                </label>
                <select
                  id="filter-make"
                  value={selectedMake}
                  onChange={(e) => setSelectedMake(e.target.value)}
                  className="w-full bg-[#0b0b0b] border border-white/10 text-white px-3 py-2 text-xs focus:outline-none focus:border-[#e24b4a]"
                >
                  <option value="all">All Makes</option>
                  {availableMakes.map((m) => (
                    <option key={m} value={m} className="bg-[#111]">
                      {m}
                    </option>
                  ))}
                  {/* Common Kenyan options if empty */}
                  {availableMakes.length === 0 && (
                    <>
                      <option value="Toyota">Toyota</option>
                      <option value="Mazda">Mazda</option>
                      <option value="Subaru">Subaru</option>
                      <option value="Nissan">Nissan</option>
                      <option value="Honda">Honda</option>
                      <option value="Mercedes-Benz">Mercedes-Benz</option>
                      <option value="BMW">BMW</option>
                      <option value="Land Rover">Land Rover</option>
                    </>
                  )}
                </select>
              </div>

              {/* Body Type */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70">
                  Body Type
                </label>
                <select
                  id="filter-body-type"
                  value={selectedBodyType}
                  onChange={(e) => setSelectedBodyType(e.target.value)}
                  className="w-full bg-[#0b0b0b] border border-white/10 text-white px-3 py-2 text-xs focus:outline-none focus:border-[#e24b4a]"
                >
                  <option value="all">All Body Types</option>
                  {availableBodyTypes.length > 0 ? (
                    availableBodyTypes.map((b) => (
                      <option key={b} value={b} className="bg-[#111]">
                        {b}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="SUV">SUV</option>
                      <option value="Sedan">Sedan</option>
                      <option value="Hatchback">Hatchback</option>
                      <option value="Pickup">Pickup</option>
                      <option value="Station Wagon">Station Wagon</option>
                      <option value="Coupe">Coupe</option>
                      <option value="Van">Van / Minibus</option>
                    </>
                  )}
                </select>
              </div>

              {/* Price Range */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70">
                  Price Range (KSh)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="Min KSh"
                    className="w-full bg-[#0b0b0b] border border-white/10 px-2.5 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#e24b4a]"
                  />
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="Max KSh"
                    className="w-full bg-[#0b0b0b] border border-white/10 px-2.5 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#e24b4a]"
                  />
                </div>
              </div>

              {/* Year Range */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70">
                  Year Range
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={minYear}
                    onChange={(e) => setMinYear(e.target.value)}
                    placeholder="From e.g. 2017"
                    className="w-full bg-[#0b0b0b] border border-white/10 px-2.5 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#e24b4a]"
                  />
                  <input
                    type="number"
                    value={maxYear}
                    onChange={(e) => setMaxYear(e.target.value)}
                    placeholder="To e.g. 2024"
                    className="w-full bg-[#0b0b0b] border border-white/10 px-2.5 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#e24b4a]"
                  />
                </div>
              </div>

              {/* Transmission */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70">
                  Transmission
                </label>
                <select
                  id="filter-transmission"
                  value={selectedTransmission}
                  onChange={(e) => setSelectedTransmission(e.target.value)}
                  className="w-full bg-[#0b0b0b] border border-white/10 text-white px-3 py-2 text-xs focus:outline-none focus:border-[#e24b4a]"
                >
                  <option value="all">All Transmissions</option>
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                  <option value="CVT">CVT</option>
                </select>
              </div>

              {/* Fuel Type */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70">
                  Fuel Type
                </label>
                <select
                  id="filter-fuel-type"
                  value={selectedFuelType}
                  onChange={(e) => setSelectedFuelType(e.target.value)}
                  className="w-full bg-[#0b0b0b] border border-white/10 text-white px-3 py-2 text-xs focus:outline-none focus:border-[#e24b4a]"
                >
                  <option value="all">All Fuel Types</option>
                  {availableFuelTypes.length > 0 ? (
                    availableFuelTypes.map((f) => (
                      <option key={f} value={f} className="bg-[#111]">
                        {f}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="Petrol">Petrol</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="Electric">Electric</option>
                    </>
                  )}
                </select>
              </div>

              {/* Condition */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70">
                  Condition
                </label>
                <select
                  id="filter-condition"
                  value={selectedCondition}
                  onChange={(e) => setSelectedCondition(e.target.value)}
                  className="w-full bg-[#0b0b0b] border border-white/10 text-white px-3 py-2 text-xs focus:outline-none focus:border-[#e24b4a]"
                >
                  <option value="all">All Conditions</option>
                  <option value="Foreign Used">Foreign Used (Direct Import)</option>
                  <option value="Locally Used">Locally Used</option>
                  <option value="Brand New">Brand New</option>
                </select>
              </div>

              {/* Availability Status */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70">
                  Availability
                </label>
                <select
                  id="filter-status"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full bg-[#0b0b0b] border border-white/10 text-white px-3 py-2 text-xs focus:outline-none focus:border-[#e24b4a]"
                >
                  <option value="all">All Statuses</option>
                  <option value="available">Available in Stock</option>
                  <option value="reserved">Reserved</option>
                  <option value="sold">Sold</option>
                </select>
              </div>
            </div>

            {/* Sourcing Assistance Promo Box */}
            <div className="bg-[#0b0b0b] border border-white/10 p-5 space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#e24b4a] block font-bold">
                Can't find your dream car?
              </span>
              <h4 className="text-xs font-bold uppercase text-white font-heading">
                Bespoke Import & Local Sourcing
              </h4>
              <p className="text-[11px] text-white/60 leading-relaxed">
                Tell us your target make, model, and budget. We source directly from Japan, the UK, and South Africa with guaranteed port clearance.
              </p>
              <button
                onClick={() => onOpenInquiry('Car Sourcing')}
                className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Request Sourcing
              </button>
            </div>
          </aside>

          {/* Mobile Filter Drawer */}
          {mobileFilterOpen && (
            <div className="lg:hidden col-span-12 bg-[#111] border border-white/10 p-5 space-y-4 animate-in slide-in-from-top duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs font-bold uppercase tracking-widest text-white">
                  Filters
                </span>
                <div className="flex items-center gap-3">
                  {hasActiveFilters && (
                    <button
                      onClick={handleResetFilters}
                      className="text-xs text-[#e24b4a] font-mono uppercase"
                    >
                      Reset All
                    </button>
                  )}
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="p-1 text-white/40 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] text-white/60 mb-1">Make</label>
                  <select
                    value={selectedMake}
                    onChange={(e) => setSelectedMake(e.target.value)}
                    className="w-full bg-[#0b0b0b] border border-white/10 text-white px-3 py-2 text-xs"
                  >
                    <option value="all">All Makes</option>
                    {availableMakes.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-white/60 mb-1">Transmission</label>
                  <select
                    value={selectedTransmission}
                    onChange={(e) => setSelectedTransmission(e.target.value)}
                    className="w-full bg-[#0b0b0b] border border-white/10 text-white px-3 py-2 text-xs"
                  >
                    <option value="all">All</option>
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-white/60 mb-1">Condition</label>
                  <select
                    value={selectedCondition}
                    onChange={(e) => setSelectedCondition(e.target.value)}
                    className="w-full bg-[#0b0b0b] border border-white/10 text-white px-3 py-2 text-xs"
                  >
                    <option value="all">All</option>
                    <option value="Foreign Used">Foreign Used</option>
                    <option value="Locally Used">Locally Used</option>
                    <option value="Brand New">Brand New</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-white/60 mb-1">Availability</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full bg-[#0b0b0b] border border-white/10 text-white px-3 py-2 text-xs"
                  >
                    <option value="all">All</option>
                    <option value="available">Available</option>
                    <option value="reserved">Reserved</option>
                    <option value="sold">Sold</option>
                  </select>
                </div>
              </div>

              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-2.5 bg-[#e24b4a] text-white font-bold text-xs uppercase tracking-widest"
              >
                Apply Filters ({filteredVehicles.length} vehicles)
              </button>
            </div>
          )}

          {/* Right Main Content: Vehicle Cards Grid or Empty State */}
          <main className="col-span-12 lg:col-span-9">
            {/* Loading Indicator */}
            {loading ? (
              <div className="py-24 text-center space-y-4">
                <div className="w-10 h-10 border-2 border-[#e24b4a] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs font-mono uppercase tracking-widest text-white/60">
                  Loading Live Vehicle Inventory...
                </p>
              </div>
            ) : vehicles.length === 0 ? (
              /* CRITICAL RULE: Empty Database State */
              <div className="bg-[#111] border border-white/10 p-12 sm:p-16 text-center space-y-5">
                <div className="w-16 h-16 bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-[#e24b4a]">
                  <Car className="w-8 h-8" />
                </div>

                <div className="space-y-2 max-w-md mx-auto">
                  <h3 className="text-xl sm:text-2xl font-black font-heading uppercase text-white tracking-tight">
                    No vehicles listed yet — check back soon.
                  </h3>
                  <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
                    Our inventory database is ready for listings. As new foreign imports and verified local trade-ins arrive at our Ngong Road showroom, they will appear here in real time.
                  </p>
                </div>

                <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => onOpenInquiry('Car Sourcing')}
                    className="px-6 py-3 bg-[#e24b4a] hover:bg-[#c53736] text-white text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer"
                  >
                    Inquire for Specific Model
                  </button>

                  <button
                    onClick={() => setShowSqlSetupModal(true)}
                    className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <Code2 className="w-4 h-4 text-[#e24b4a]" />
                    <span>Supabase Schema Instructions</span>
                  </button>
                </div>
              </div>
            ) : filteredVehicles.length === 0 ? (
              /* Filter / Search Yielded Zero Matches */
              <div className="bg-[#111] border border-white/10 p-12 text-center space-y-4">
                <AlertCircle className="w-10 h-10 text-[#e24b4a] mx-auto" />
                <h3 className="text-lg font-bold font-heading uppercase text-white">
                  No vehicles match your active search filters
                </h3>
                <p className="text-xs text-white/60 max-w-md mx-auto">
                  Try adjusting your keywords, price limits, or make selection to view available stock.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-widest cursor-pointer transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              /* Populated Vehicles List */
              <div className="space-y-6">
                {/* Results count indicator */}
                <div className="flex justify-between items-center text-xs font-mono text-white/50 pb-2 border-b border-white/5">
                  <span>Showing {filteredVehicles.length} of {vehicles.length} vehicles</span>
                  {hasActiveFilters && (
                    <span className="text-[#e24b4a]">Filters Active</span>
                  )}
                </div>

                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredVehicles.map((vehicle) => (
                      <VehicleCard
                        key={vehicle.id}
                        vehicle={vehicle}
                        viewMode="grid"
                        onViewDetails={onViewDetails}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredVehicles.map((vehicle) => (
                      <VehicleCard
                        key={vehicle.id}
                        vehicle={vehicle}
                        viewMode="list"
                        onViewDetails={onViewDetails}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </section>

      {/* Supabase SQL Setup Modal for Easy Database Provisioning */}
      {showSqlSetupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-[#111] border border-white/10 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="h-1 bg-[#e24b4a] w-full" />

            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0b0b0b]">
              <div className="flex items-center gap-2.5">
                <Code2 className="w-5 h-5 text-[#e24b4a]" />
                <h3 className="text-base font-bold font-heading uppercase text-white">
                  Supabase Schema Setup
                </h3>
              </div>
              <button
                onClick={() => setShowSqlSetupModal(false)}
                className="p-1.5 text-white/40 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto">
              <p className="text-xs text-white/70 leading-relaxed">
                Run this SQL script in your Supabase SQL Editor (<b>SQL Editor &gt; New Query</b>) to create the <code className="text-[#e24b4a] font-mono">vehicles</code> and <code className="text-[#e24b4a] font-mono">leads</code> tables with Row-Level Security:
              </p>

              <div className="relative bg-[#0b0b0b] border border-white/10 p-4 font-mono text-[11px] text-white/80 overflow-x-auto max-h-72">
                <pre>{SUPABASE_SQL_SETUP}</pre>
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <span className="text-[11px] text-white/40 font-mono">
                  {copiedSql ? '✓ Copied to clipboard!' : 'Ready to paste into Supabase'}
                </span>
                <button
                  onClick={handleCopySql}
                  className="px-4 py-2 bg-[#e24b4a] hover:bg-[#c53736] text-white text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSql ? 'Copied' : 'Copy SQL Script'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
