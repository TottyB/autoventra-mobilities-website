import React, { useState, useEffect, useMemo } from 'react';
import { Vehicle, Lead, SiteSettings } from '../../types';
import {
  getVehicles,
  deleteVehicle,
  updateVehicleStatus,
  toggleVehicleFeatured,
  getAdminDashboardStats,
  getAdminLeads,
  deleteLead,
  updateLeadPaymentStatus,
  getSiteSettings,
  DEFAULT_SITE_SETTINGS,
  getAdminUser,
  getAdminSession,
  subscribeToAuth,
  adminSignOut,
  AdminStats,
  SUPABASE_SQL_SETUP,
  isSupabaseConfigured,
} from '../../lib/supabase';
import { AdminLoginPage } from './AdminLoginPage';
import { AdminVehicleFormModal } from './AdminVehicleFormModal';
import { AdminSiteSettingsTab } from './AdminSiteSettingsTab';
import {
  Car,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  RefreshCw,
  Search,
  Filter,
  LogOut,
  ShieldCheck,
  Phone,
  MessageSquare,
  Calendar,
  DollarSign,
  AlertTriangle,
  Code2,
  Copy,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Inbox,
  Lock,
  CreditCard,
  CheckSquare,
  KeyRound,
} from 'lucide-react';
import { User } from '@supabase/supabase-js';

interface AdminPortalProps {
  onBackToSite: () => void;
  onNavigateToVehicle?: (id: string | number) => void;
}

type AdminTab = 'vehicles' | 'leads' | 'settings' | 'security';
type LeadFilterType = 'all' | 'rentals' | 'vehicles' | 'purchases' | 'paid' | 'unpaid';

export const AdminPortal: React.FC<AdminPortalProps> = ({
  onBackToSite,
  onNavigateToVehicle,
}) => {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authChecking, setAuthChecking] = useState<boolean>(true);

  // Active Tab
  const [activeTab, setActiveTab] = useState<AdminTab>('vehicles');

  // Vehicles Data
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehiclesLoading, setVehiclesLoading] = useState<boolean>(true);
  const [vehicleSearch, setVehicleSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Leads Data
  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadsLoading, setLeadsLoading] = useState<boolean>(true);
  const [leadFilter, setLeadFilter] = useState<LeadFilterType>('all');

  // Site Settings Data (Paybill & M-Pesa)
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [siteSettingsLoading, setSiteSettingsLoading] = useState<boolean>(false);

  // Live Stats (Strictly live, default to 0)
  const [stats, setStats] = useState<AdminStats>({
    totalVehicles: 0,
    availableVehicles: 0,
    soldVehicles: 0,
    leadsThisWeek: 0,
    totalLeads: 0,
  });

  // Modals & Actions
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);
  const [copiedSql, setCopiedSql] = useState<boolean>(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Confirm "Mark as Sold?" prompt when a purchase lead is marked as Paid
  const [vehicleSoldPrompt, setVehicleSoldPrompt] = useState<{
    isOpen: boolean;
    vehicleId: string | number;
    vehicleName: string;
    customerName: string;
  } | null>(null);

  // Check Supabase Auth on Mount
  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      if (!isSupabaseConfigured()) {
        if (isMounted) {
          setCurrentUser(null);
          setAuthChecking(false);
        }
        return;
      }

      const user = await getAdminUser();
      if (isMounted) {
        setCurrentUser(user);
        setAuthChecking(false);
      }
    }

    checkAuth();

    const unsubscribe = subscribeToAuth((_session, user) => {
      if (isMounted) {
        setCurrentUser(user);
        setAuthChecking(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // Fetch Admin Data when Authenticated
  const refreshData = async () => {
    if (!currentUser) return;
    setVehiclesLoading(true);
    setLeadsLoading(true);
    setSiteSettingsLoading(true);

    try {
      const [vehiclesRes, leadsRes, statsRes, settingsRes] = await Promise.all([
        getVehicles(),
        getAdminLeads(100),
        getAdminDashboardStats(),
        getSiteSettings(),
      ]);

      setVehicles(vehiclesRes.data || []);
      setLeads(leadsRes.data || []);
      setStats(statsRes);
      if (settingsRes.data) {
        setSiteSettings(settingsRes.data);
      }
    } catch (err) {
      console.error('Error refreshing admin data:', err);
    } finally {
      setVehiclesLoading(false);
      setLeadsLoading(false);
      setSiteSettingsLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      refreshData();
    }
  }, [currentUser]);

  // Show Toast Notification
  const showToast = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Sign Out Handler
  const handleSignOut = async () => {
    await adminSignOut();
    setCurrentUser(null);
    showToast('success', 'You have been signed out successfully.');
  };

  // Delete Vehicle Action
  const handleDeleteVehicle = async (id: string | number) => {
    if (!window.confirm('Are you sure you want to permanently delete this vehicle from Supabase?')) {
      return;
    }

    setDeletingId(id);
    const res = await deleteVehicle(id);
    setDeletingId(null);

    if (res.success) {
      setVehicles((prev) => prev.filter((v) => String(v.id) !== String(id)));
      showToast('success', 'Vehicle permanently removed from inventory.');
      // Refresh stats
      getAdminDashboardStats().then(setStats);
    } else {
      showToast('error', res.error || 'Failed to delete vehicle.');
    }
  };

  // Quick Status Toggle Action
  const handleStatusChange = async (
    id: string | number,
    newStatus: 'available' | 'sold' | 'reserved'
  ) => {
    const res = await updateVehicleStatus(id, newStatus);
    if (res.success) {
      setVehicles((prev) =>
        prev.map((v) => (String(v.id) === String(id) ? { ...v, status: newStatus } : v))
      );
      showToast('success', `Vehicle status updated to "${newStatus}".`);
      getAdminDashboardStats().then(setStats);
    } else {
      showToast('error', res.error || 'Failed to update status.');
    }
  };

  // Quick Toggle Featured Action
  const handleToggleFeatured = async (id: string | number, currentVal: boolean) => {
    const newVal = !currentVal;
    const res = await toggleVehicleFeatured(id, newVal);
    if (res.success) {
      setVehicles((prev) =>
        prev.map((v) => (String(v.id) === String(id) ? { ...v, is_featured: newVal } : v))
      );
      showToast(
        'success',
        newVal ? 'Vehicle added to featured showcase.' : 'Vehicle removed from featured showcase.'
      );
    } else {
      showToast('error', res.error || 'Failed to update featured state.');
    }
  };

  // Lead Payment Status Update Action ("Mark as Paid", "Mark as Deposit Paid", "Mark as Unpaid")
  const handleUpdatePaymentStatus = async (
    id: string | number,
    status: 'unpaid' | 'paid' | 'deposit_paid'
  ) => {
    const res = await updateLeadPaymentStatus(id, status);
    if (res.success) {
      setLeads((prev) =>
        prev.map((l) => (String(l.id) === String(id) ? { ...l, payment_status: status } : l))
      );
      const label = status === 'paid' ? 'PAID' : status === 'deposit_paid' ? 'DEPOSIT PAID' : 'UNPAID';
      showToast('success', `Inquiry payment status marked as ${label}.`);

      // Prompt to mark vehicle as sold when intent === 'purchase' and vehicle_id is set
      if (status === 'paid') {
        const targetLead = leads.find((l) => String(l.id) === String(id));
        if (
          targetLead &&
          (targetLead.intent === 'purchase' || targetLead.lead_type === 'vehicle_enquiry') &&
          targetLead.vehicle_id
        ) {
          const matchingVehicle = vehicles.find(
            (v) => String(v.id) === String(targetLead.vehicle_id)
          );
          if (matchingVehicle && matchingVehicle.status !== 'sold') {
            const vName =
              targetLead.vehicle_name ||
              `${matchingVehicle.year} ${matchingVehicle.make} ${matchingVehicle.model}`;
            setVehicleSoldPrompt({
              isOpen: true,
              vehicleId: matchingVehicle.id,
              vehicleName: vName,
              customerName: targetLead.name,
            });
          }
        }
      }
    } else {
      showToast('error', res.error || 'Failed to update payment status in Supabase.');
    }
  };

  // Confirm Mark Vehicle as Sold Handler
  const handleConfirmMarkAsSold = async () => {
    if (!vehicleSoldPrompt) return;
    const { vehicleId, vehicleName } = vehicleSoldPrompt;
    setVehicleSoldPrompt(null);

    const res = await updateVehicleStatus(vehicleId, 'sold');
    if (res.success) {
      setVehicles((prev) =>
        prev.map((v) => (String(v.id) === String(vehicleId) ? { ...v, status: 'sold' } : v))
      );
      showToast('success', `"${vehicleName}" has been marked as Sold in showroom inventory.`);
      getAdminDashboardStats().then(setStats);
    } else {
      showToast('error', res.error || 'Failed to update vehicle status to Sold.');
    }
  };

  // Dismiss Mark Vehicle as Sold Handler
  const handleDismissMarkAsSold = () => {
    setVehicleSoldPrompt(null);
  };

  // Delete Lead Action
  const handleDeleteLead = async (id: string | number) => {
    if (!window.confirm('Delete this inquiry record?')) return;
    const res = await deleteLead(id);
    if (res.success) {
      setLeads((prev) => prev.filter((l) => String(l.id) !== String(id)));
      showToast('success', 'Inquiry deleted.');
      getAdminDashboardStats().then(setStats);
    } else {
      showToast('error', res.error || 'Failed to delete lead.');
    }
  };

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      if (leadFilter === 'purchases') {
        return lead.intent === 'purchase';
      }
      if (leadFilter === 'rentals') {
        return lead.lead_type === 'rental_booking' || Boolean(lead.rental_vehicle);
      }
      if (leadFilter === 'vehicles') {
        return (
          lead.lead_type === 'vehicle_enquiry' ||
          lead.lead_type === 'test_drive' ||
          (Boolean(lead.vehicle_id) && !lead.rental_vehicle)
        );
      }
      if (leadFilter === 'paid') {
        return lead.payment_status === 'paid';
      }
      if (leadFilter === 'unpaid') {
        return !lead.payment_status || lead.payment_status === 'unpaid';
      }
      return true;
    });
  }, [leads, leadFilter]);

  const leadCounts = useMemo(() => {
    const rentals = leads.filter(
      (l) => l.lead_type === 'rental_booking' || Boolean(l.rental_vehicle)
    ).length;
    const vehicles = leads.filter(
      (l) =>
        l.lead_type === 'vehicle_enquiry' ||
        l.lead_type === 'test_drive' ||
        (Boolean(l.vehicle_id) && !l.rental_vehicle)
    ).length;
    const purchases = leads.filter((l) => l.intent === 'purchase').length;
    const paid = leads.filter((l) => l.payment_status === 'paid').length;
    const unpaid = leads.filter((l) => !l.payment_status || l.payment_status === 'unpaid').length;
    return { all: leads.length, rentals, vehicles, purchases, paid, unpaid };
  }, [leads]);

  // Filtered Vehicles
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      const q = vehicleSearch.toLowerCase().trim();
      const matchQuery =
        !q ||
        v.make.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        String(v.year).includes(q) ||
        v.body_type.toLowerCase().includes(q);

      const matchStatus = statusFilter === 'all' || v.status === statusFilter;

      return matchQuery && matchStatus;
    });
  }, [vehicles, vehicleSearch, statusFilter]);

  // Copy SQL script to clipboard
  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SETUP);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  // Format currency
  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Auth checking loader
  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#070707] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-6 h-6 text-[#e24b4a] animate-spin" />
          <span className="text-xs font-mono text-white/50 tracking-wider">
            Verifying Admin Session...
          </span>
        </div>
      </div>
    );
  }

  // Not authenticated: Render login screen
  if (!currentUser) {
    return (
      <AdminLoginPage
        onLoginSuccess={() => {
          getAdminUser().then(setCurrentUser);
        }}
        onBackToSite={onBackToSite}
      />
    );
  }

  // Authenticated Admin Console
  return (
    <div className="min-h-screen bg-[#070707] text-white flex flex-col font-sans">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 border text-xs font-mono flex items-center gap-2 shadow-2xl transition-all ${
            notification.type === 'success'
              ? 'bg-emerald-950 border-emerald-700 text-emerald-200'
              : 'bg-red-950 border-red-700 text-red-200'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          ) : (
            <XCircle className="w-4 h-4 text-red-400" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Top Navigation Bar */}
      <header className="bg-[#111111] border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#e24b4a] text-white flex items-center justify-center font-bold text-sm">
                AV
              </div>
              <div>
                <span className="font-heading font-black text-sm tracking-wider uppercase">
                  AutoVentraMobilities
                </span>
                <span className="ml-2 text-[10px] font-mono bg-[#e24b4a]/20 text-[#e24b4a] border border-[#e24b4a]/30 px-1.5 py-0.5 uppercase tracking-wider font-bold">
                  Admin Portal
                </span>
              </div>
            </div>

            <span className="hidden sm:inline-block text-white/20">|</span>

            {/* Route indicator */}
            <span className="hidden sm:inline-block text-[11px] font-mono text-white/40">
              /av-manage
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Logged in email badge */}
            <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 text-xs text-white/80 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="truncate max-w-[200px]">{currentUser.email}</span>
            </div>

            {/* Return to Public Site */}
            <button
              onClick={onBackToSite}
              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/70 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>View Public Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            {/* Sign Out */}
            <button
              id="admin-signout-btn"
              onClick={handleSignOut}
              className="px-3 py-1.5 bg-red-950/40 hover:bg-red-900/60 border border-red-800/60 text-red-200 text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Sign Out of Admin Console"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* ========================================================= */}
        {/* 1. DASHBOARD OVERVIEW: LIVE STAT CARDS */}
        {/* ========================================================= */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-wider font-heading">
                Live Inventory & Leads Overview
              </h1>
              <p className="text-xs text-white/50 font-mono">
                Real-time metrics queried directly from Supabase database
              </p>
            </div>

            <button
              onClick={refreshData}
              disabled={vehiclesLoading || leadsLoading}
              className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
              title="Refresh Live Metrics"
            >
              <RefreshCw
                className={`w-4 h-4 ${vehiclesLoading || leadsLoading ? 'animate-spin text-[#e24b4a]' : ''}`}
              />
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Stat 1: Total Vehicles */}
            <div className="bg-[#111111] border border-white/10 p-5 relative overflow-hidden">
              <div className="flex items-center justify-between text-white/50 mb-2">
                <span className="text-xs font-mono uppercase tracking-wider">Total Vehicles</span>
                <Car className="w-4 h-4 text-white/40" />
              </div>
              <div className="text-2xl sm:text-3xl font-heading font-black text-white">
                {stats.totalVehicles}
              </div>
              <div className="text-[11px] font-mono text-white/40 mt-1">
                Database records in <code className="text-white/60">vehicles</code>
              </div>
            </div>

            {/* Stat 2: Available Vehicles */}
            <div className="bg-[#111111] border border-white/10 p-5 relative overflow-hidden">
              <div className="flex items-center justify-between text-white/50 mb-2">
                <span className="text-xs font-mono uppercase tracking-wider">Active in Showroom</span>
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-heading font-black text-emerald-400">
                {stats.availableVehicles}
              </div>
              <div className="text-[11px] font-mono text-white/40 mt-1">
                Available for test-drives & purchase
              </div>
            </div>

            {/* Stat 3: Sold Vehicles */}
            <div className="bg-[#111111] border border-white/10 p-5 relative overflow-hidden">
              <div className="flex items-center justify-between text-white/50 mb-2">
                <span className="text-xs font-mono uppercase tracking-wider">Sold Vehicles</span>
                <Clock className="w-4 h-4 text-zinc-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-heading font-black text-white/60">
                {stats.soldVehicles}
              </div>
              <div className="text-[11px] font-mono text-white/40 mt-1">
                Archived sales history
              </div>
            </div>

            {/* Stat 4: Leads This Week */}
            <div className="bg-[#111111] border border-white/10 p-5 relative overflow-hidden">
              <div className="flex items-center justify-between text-white/50 mb-2">
                <span className="text-xs font-mono uppercase tracking-wider">Leads This Week</span>
                <TrendingUp className="w-4 h-4 text-[#e24b4a]" />
              </div>
              <div className="text-2xl sm:text-3xl font-heading font-black text-[#e24b4a]">
                {stats.leadsThisWeek}
              </div>
              <div className="text-[11px] font-mono text-white/40 mt-1">
                {stats.totalLeads} total inquiries received
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 2. TAB CONTROLS */}
        {/* ========================================================= */}
        <div className="flex border-b border-white/10 gap-2 sm:gap-4 overflow-x-auto">
          <button
            id="admin-tab-vehicles"
            onClick={() => setActiveTab('vehicles')}
            className={`pb-3 px-3 text-xs uppercase tracking-wider font-mono font-bold flex items-center gap-2 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
              activeTab === 'vehicles'
                ? 'border-[#e24b4a] text-white'
                : 'border-transparent text-white/40 hover:text-white/80'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>Manage Vehicles ({vehicles.length})</span>
          </button>

          <button
            id="admin-tab-leads"
            onClick={() => setActiveTab('leads')}
            className={`pb-3 px-3 text-xs uppercase tracking-wider font-mono font-bold flex items-center gap-2 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
              activeTab === 'leads'
                ? 'border-[#e24b4a] text-white'
                : 'border-transparent text-white/40 hover:text-white/80'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>Customer Inquiries & Rentals ({leads.length})</span>
          </button>

          <button
            id="admin-tab-settings"
            onClick={() => setActiveTab('settings')}
            className={`pb-3 px-3 text-xs uppercase tracking-wider font-mono font-bold flex items-center gap-2 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
              activeTab === 'settings'
                ? 'border-[#e24b4a] text-white'
                : 'border-transparent text-white/40 hover:text-white/80'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>M-Pesa & Site Settings</span>
          </button>

          <button
            id="admin-tab-security"
            onClick={() => setActiveTab('security')}
            className={`pb-3 px-3 text-xs uppercase tracking-wider font-mono font-bold flex items-center gap-2 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
              activeTab === 'security'
                ? 'border-[#e24b4a] text-white'
                : 'border-transparent text-white/40 hover:text-white/80'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>RLS Security & SQL</span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* TAB 1: MANAGE VEHICLES */}
        {/* ========================================================= */}
        {activeTab === 'vehicles' && (
          <div className="space-y-6">
            {/* Control Bar: Search, Filters & Add Button */}
            <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-[#111111] border border-white/10 p-4">
              <div className="flex flex-1 flex-col sm:flex-row gap-3">
                {/* Search */}
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search by make, model, year, body type..."
                    value={vehicleSearch}
                    onChange={(e) => setVehicleSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-[#070707] border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#e24b4a]"
                  />
                  <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 text-white/40" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-[#070707] border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-[#e24b4a]"
                  >
                    <option value="all">All Statuses</option>
                    <option value="available">Available Only</option>
                    <option value="sold">Sold Only</option>
                    <option value="reserved">Reserved Only</option>
                  </select>
                </div>
              </div>

              {/* Add New Vehicle Button */}
              <button
                id="admin-add-vehicle-btn"
                onClick={() => {
                  setEditingVehicle(null);
                  setIsFormModalOpen(true);
                }}
                className="px-4 py-2.5 bg-[#e24b4a] hover:bg-[#c53736] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Vehicle</span>
              </button>
            </div>

            {/* Vehicles Table */}
            <div className="bg-[#111111] border border-white/10 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-[#161616] text-[11px] font-mono uppercase text-white/50 tracking-wider">
                    <th className="py-3.5 px-4">Vehicle</th>
                    <th className="py-3.5 px-4">Specs</th>
                    <th className="py-3.5 px-4">Price</th>
                    <th className="py-3.5 px-4">Featured</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-sans">
                  {vehiclesLoading ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-white/40 font-mono">
                        <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#e24b4a]" />
                        <span>Loading inventory from Supabase...</span>
                      </td>
                    </tr>
                  ) : filteredVehicles.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-white/40 space-y-3">
                        <Car className="w-8 h-8 mx-auto text-white/20" />
                        <p className="font-mono text-xs">
                          {vehicles.length === 0
                            ? 'No vehicles listed in Supabase database yet.'
                            : 'No vehicles match your search or filter.'}
                        </p>
                        {vehicles.length === 0 && (
                          <button
                            onClick={() => {
                              setEditingVehicle(null);
                              setIsFormModalOpen(true);
                            }}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs inline-flex items-center gap-2 cursor-pointer transition-colors"
                          >
                            <Plus className="w-4 h-4 text-[#e24b4a]" />
                            <span>Add First Vehicle</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ) : (
                    filteredVehicles.map((vehicle) => {
                      const coverPhoto =
                        Array.isArray(vehicle.photos) && vehicle.photos.length > 0
                          ? vehicle.photos[0]
                          : null;

                      return (
                        <tr
                          key={vehicle.id}
                          className="hover:bg-white/[0.02] transition-colors group"
                        >
                          {/* Vehicle Column */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-14 h-10 bg-black border border-white/10 flex-shrink-0 overflow-hidden relative">
                                {coverPhoto ? (
                                  <img
                                    src={coverPhoto}
                                    alt={`${vehicle.make} ${vehicle.model}`}
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-white/20">
                                    <Car className="w-4 h-4" />
                                  </div>
                                )}
                                {Array.isArray(vehicle.photos) && vehicle.photos.length > 1 && (
                                  <span className="absolute bottom-0 right-0 bg-black/80 text-[8px] font-mono px-1 text-white/80">
                                    +{vehicle.photos.length - 1}
                                  </span>
                                )}
                              </div>
                              <div>
                                <span className="font-bold text-white block">
                                  {vehicle.make} {vehicle.model}
                                </span>
                                <span className="text-[11px] text-white/50 font-mono">
                                  {vehicle.year} • {vehicle.body_type} • {vehicle.condition}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Specs Column */}
                          <td className="py-3.5 px-4 font-mono text-[11px] text-white/70">
                            <div>{vehicle.mileage}</div>
                            <div className="text-white/40">
                              {vehicle.transmission} • {vehicle.fuel_type}
                            </div>
                          </td>

                          {/* Price Column */}
                          <td className="py-3.5 px-4 font-mono text-[11px]">
                            <div className="font-bold text-white">
                              {formatPrice(vehicle.price)}
                            </div>
                            {vehicle.discount_price && (
                              <div className="text-[#e24b4a] text-[10px]">
                                Sale: {formatPrice(vehicle.discount_price)}
                              </div>
                            )}
                          </td>

                          {/* Featured Toggle */}
                          <td className="py-3.5 px-4">
                            <button
                              onClick={() => handleToggleFeatured(vehicle.id, vehicle.is_featured)}
                              className={`p-1.5 rounded transition-colors cursor-pointer flex items-center gap-1 text-[10px] font-mono ${
                                vehicle.is_featured
                                  ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                                  : 'bg-white/5 text-white/40 hover:text-white/70 border border-white/10'
                              }`}
                              title={
                                vehicle.is_featured
                                  ? 'Featured in Showcase'
                                  : 'Click to Feature'
                              }
                            >
                              <Star
                                className={`w-3.5 h-3.5 ${
                                  vehicle.is_featured ? 'fill-amber-400 text-amber-400' : ''
                                }`}
                              />
                              <span className="hidden sm:inline">
                                {vehicle.is_featured ? 'Featured' : 'Standard'}
                              </span>
                            </button>
                          </td>

                          {/* Status Select */}
                          <td className="py-3.5 px-4">
                            <select
                              value={vehicle.status}
                              onChange={(e) =>
                                handleStatusChange(
                                  vehicle.id,
                                  e.target.value as 'available' | 'sold' | 'reserved'
                                )
                              }
                              className={`text-[11px] font-mono font-bold px-2 py-1 border focus:outline-none cursor-pointer ${
                                vehicle.status === 'available'
                                  ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-300'
                                  : vehicle.status === 'sold'
                                  ? 'bg-zinc-900 border-zinc-700 text-zinc-400'
                                  : 'bg-amber-950/40 border-amber-700/60 text-amber-300'
                              }`}
                            >
                              <option value="available" className="bg-[#111] text-emerald-400">
                                Available
                              </option>
                              <option value="reserved" className="bg-[#111] text-amber-400">
                                Reserved
                              </option>
                              <option value="sold" className="bg-[#111] text-zinc-400">
                                Sold
                              </option>
                            </select>
                          </td>

                          {/* Action Buttons */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {onNavigateToVehicle && (
                                <button
                                  onClick={() => onNavigateToVehicle(vehicle.id)}
                                  className="p-1.5 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
                                  title="View Public Page"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </button>
                              )}

                              <button
                                onClick={() => {
                                  setEditingVehicle(vehicle);
                                  setIsFormModalOpen(true);
                                }}
                                className="p-1.5 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
                                title="Edit Vehicle"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => handleDeleteVehicle(vehicle.id)}
                                disabled={deletingId === vehicle.id}
                                className="p-1.5 bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 text-red-300 hover:text-white transition-colors cursor-pointer"
                                title="Delete Vehicle"
                              >
                                {deletingId === vehicle.id ? (
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Trash2 className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: INQUIRIES & RENTAL BOOKINGS */}
        {/* ========================================================= */}
        {activeTab === 'leads' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold uppercase tracking-wider font-heading text-white">
                  Customer Inquiries & Rental Bookings
                </h2>
                <p className="text-xs text-white/50 font-mono">
                  Live submissions from test-drives, rental bookings, and contact inquiries
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={refreshData}
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-white/70 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${leadsLoading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {/* Sub-Filters: All, Purchases, Rentals, Vehicles, Paid, Unpaid */}
            <div className="flex flex-wrap gap-2 pt-1 border-b border-white/10 pb-3">
              <button
                onClick={() => setLeadFilter('all')}
                className={`px-3 py-1 text-xs font-mono font-bold uppercase transition-colors cursor-pointer ${
                  leadFilter === 'all'
                    ? 'bg-white text-black'
                    : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                All ({leadCounts.all})
              </button>

              <button
                onClick={() => setLeadFilter('purchases')}
                className={`px-3 py-1 text-xs font-mono font-bold uppercase transition-colors cursor-pointer flex items-center gap-1.5 ${
                  leadFilter === 'purchases'
                    ? 'bg-[#e24b4a] text-white'
                    : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                <KeyRound className="w-3 h-3" />
                <span>Purchase Reservations ({leadCounts.purchases})</span>
              </button>

              <button
                onClick={() => setLeadFilter('rentals')}
                className={`px-3 py-1 text-xs font-mono font-bold uppercase transition-colors cursor-pointer flex items-center gap-1.5 ${
                  leadFilter === 'rentals'
                    ? 'bg-[#e24b4a] text-white'
                    : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                <KeyRound className="w-3 h-3" />
                <span>Rental Bookings ({leadCounts.rentals})</span>
              </button>

              <button
                onClick={() => setLeadFilter('vehicles')}
                className={`px-3 py-1 text-xs font-mono font-bold uppercase transition-colors cursor-pointer flex items-center gap-1.5 ${
                  leadFilter === 'vehicles'
                    ? 'bg-[#e24b4a] text-white'
                    : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                <Car className="w-3 h-3" />
                <span>Vehicle Inquiries ({leadCounts.vehicles})</span>
              </button>

              <button
                onClick={() => setLeadFilter('paid')}
                className={`px-3 py-1 text-xs font-mono font-bold uppercase transition-colors cursor-pointer flex items-center gap-1.5 ${
                  leadFilter === 'paid'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                <CheckCircle className="w-3 h-3 text-emerald-300" />
                <span>Paid ({leadCounts.paid})</span>
              </button>

              <button
                onClick={() => setLeadFilter('unpaid')}
                className={`px-3 py-1 text-xs font-mono font-bold uppercase transition-colors cursor-pointer flex items-center gap-1.5 ${
                  leadFilter === 'unpaid'
                    ? 'bg-amber-600 text-white'
                    : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                <Clock className="w-3 h-3 text-amber-300" />
                <span>Unpaid / Pending ({leadCounts.unpaid})</span>
              </button>
            </div>

            {/* Inquiries Table */}
            <div className="bg-[#111111] border border-white/10 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-[#161616] text-[11px] font-mono uppercase text-white/50 tracking-wider">
                    <th className="py-3.5 px-4">Date & Type</th>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Subject / Vehicle</th>
                    <th className="py-3.5 px-4">Details & Notes</th>
                    <th className="py-3.5 px-4">Payment Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-sans">
                  {leadsLoading ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-white/40 font-mono">
                        <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#e24b4a]" />
                        <span>Loading inquiries from Supabase...</span>
                      </td>
                    </tr>
                  ) : filteredLeads.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-white/40 space-y-2">
                        <Inbox className="w-8 h-8 mx-auto text-white/20" />
                        <p className="font-mono text-xs">
                          No matching records found in this view.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredLeads.map((lead) => {
                      const cleanPhone = lead.phone.replace(/[^0-9+]/g, '');
                      const whatsappPhone = cleanPhone.startsWith('0')
                        ? `254${cleanPhone.slice(1)}`
                        : cleanPhone.replace('+', '');

                      const dateString = lead.created_at
                        ? new Date(lead.created_at).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : 'Recent';

                      const isRental = lead.lead_type === 'rental_booking' || Boolean(lead.rental_vehicle);
                      const paymentStatus = lead.payment_status || 'unpaid';

                      return (
                        <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors">
                          {/* Date & Type Badge */}
                          <td className="py-3.5 px-4">
                            <div className="font-mono text-[11px] text-white/50">
                              {dateString}
                            </div>
                            <div className="mt-1">
                              {lead.intent === 'purchase' ? (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-rose-950/80 border border-rose-600/70 text-rose-300 text-[9px] font-mono uppercase tracking-wider font-bold">
                                  <KeyRound className="w-2.5 h-2.5" />
                                  <span>Purchase Reservation</span>
                                </span>
                              ) : isRental ? (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-purple-950/70 border border-purple-700/60 text-purple-300 text-[9px] font-mono uppercase tracking-wider">
                                  <KeyRound className="w-2.5 h-2.5" />
                                  <span>Rental Booking</span>
                                </span>
                              ) : lead.lead_type === 'service_inquiry' ? (
                                <span className="inline-flex items-center px-1.5 py-0.5 bg-blue-950/70 border border-blue-700/60 text-blue-300 text-[9px] font-mono uppercase tracking-wider">
                                  Service Inquiry
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-1.5 py-0.5 bg-zinc-800 border border-white/10 text-white/70 text-[9px] font-mono uppercase tracking-wider">
                                  Vehicle Inquiry
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Customer */}
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-white text-xs">
                              {lead.name}
                            </div>
                            <div className="font-mono text-[11px] text-white/70">
                              {lead.phone}
                            </div>
                            {lead.email && (
                              <div className="text-[10px] text-white/40 truncate max-w-[180px]">
                                {lead.email}
                              </div>
                            )}
                          </td>

                          {/* Subject / Vehicle */}
                          <td className="py-3.5 px-4 text-white/90">
                            {lead.rental_vehicle ? (
                              <div>
                                <span className="font-bold text-[#e24b4a]">
                                  {lead.rental_vehicle}
                                </span>
                                <div className="text-[10px] text-white/50 font-mono">
                                  {lead.rental_days || 1} Days
                                  {lead.start_date ? ` • From ${lead.start_date}` : ''}
                                </div>
                              </div>
                            ) : (
                              <div>
                                <span className="font-bold text-white">
                                  {lead.vehicle_name || 'General Inbound Inquiry'}
                                </span>
                              </div>
                            )}
                          </td>

                          {/* Notes */}
                          <td className="py-3.5 px-4 text-white/60 text-[11px] max-w-xs">
                            {lead.preferred_date && (
                              <div className="font-mono text-[#e24b4a] mb-0.5">
                                Preferred: {lead.preferred_date}
                              </div>
                            )}
                            <div className="line-clamp-2">
                              {lead.notes ? lead.notes : <span className="text-white/30 italic">No additional notes</span>}
                            </div>
                          </td>

                          {/* Payment Status + Manual Toggle */}
                          <td className="py-3.5 px-4">
                            <div className="space-y-1.5">
                              {/* Status Badge */}
                              <div>
                                {paymentStatus === 'paid' ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-950 border border-emerald-600 text-emerald-300 font-mono font-bold text-[10px] uppercase">
                                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                                    <span>PAID</span>
                                  </span>
                                ) : paymentStatus === 'deposit_paid' ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-950 border border-amber-600 text-amber-300 font-mono font-bold text-[10px] uppercase">
                                    <Clock className="w-3 h-3 text-amber-400" />
                                    <span>DEPOSIT PAID</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-zinc-900 border border-white/15 text-zinc-400 font-mono text-[10px] uppercase">
                                    <span>UNPAID</span>
                                  </span>
                                )}
                              </div>

                              {/* Manual Status Toggle Menu */}
                              <div className="flex items-center gap-1">
                                {paymentStatus !== 'paid' && (
                                  <button
                                    onClick={() => handleUpdatePaymentStatus(lead.id!, 'paid')}
                                    className="px-2 py-0.5 bg-emerald-900/40 hover:bg-emerald-800/80 border border-emerald-700/60 text-emerald-300 text-[9px] font-mono uppercase tracking-wider cursor-pointer transition-colors"
                                    title="Mark as full payment received via M-Pesa"
                                  >
                                    Mark as Paid
                                  </button>
                                )}
                                {paymentStatus === 'paid' ? (
                                  <button
                                    onClick={() => handleUpdatePaymentStatus(lead.id!, 'unpaid')}
                                    className="px-2 py-0.5 bg-zinc-800 hover:bg-zinc-700 border border-white/10 text-white/60 text-[9px] font-mono uppercase cursor-pointer"
                                    title="Reset to Unpaid"
                                  >
                                    Reset to Unpaid
                                  </button>
                                ) : paymentStatus !== 'deposit_paid' ? (
                                  <button
                                    onClick={() => handleUpdatePaymentStatus(lead.id!, 'deposit_paid')}
                                    className="px-2 py-0.5 bg-amber-900/30 hover:bg-amber-800/60 border border-amber-700/50 text-amber-300 text-[9px] font-mono uppercase cursor-pointer"
                                    title="Mark as deposit received"
                                  >
                                    Deposit Paid
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleUpdatePaymentStatus(lead.id!, 'unpaid')}
                                    className="px-2 py-0.5 bg-zinc-800 hover:bg-zinc-700 border border-white/10 text-white/60 text-[9px] font-mono uppercase cursor-pointer"
                                  >
                                    Reset
                                  </button>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {/* WhatsApp Direct Chat */}
                              <a
                                href={`https://wa.me/${whatsappPhone}?text=Hello%20${encodeURIComponent(
                                  lead.name
                                )}%2C%20thank%20you%20for%20contacting%20AutoVentra%20regarding%20${encodeURIComponent(
                                  lead.rental_vehicle || lead.vehicle_name || 'your inquiry'
                                )}.`}
                                target="_blank"
                                rel="noreferrer"
                                className="px-2 py-1 bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-300 text-[10px] font-mono uppercase tracking-wider flex items-center gap-1 transition-colors"
                              >
                                <MessageSquare className="w-3 h-3" />
                                <span>WhatsApp</span>
                              </a>

                              {/* Phone Call */}
                              <a
                                href={`tel:${cleanPhone}`}
                                className="p-1 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                                title="Call Customer"
                              >
                                <Phone className="w-3.5 h-3.5" />
                              </a>

                              {/* Delete Lead */}
                              {lead.id && (
                                <button
                                  onClick={() => handleDeleteLead(lead.id!)}
                                  className="p-1 bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 text-red-300 hover:text-white transition-colors cursor-pointer"
                                  title="Delete Record"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: M-PESA & SITE SETTINGS */}
        {/* ========================================================= */}
        {activeTab === 'settings' && (
          <AdminSiteSettingsTab
            initialSettings={siteSettings}
            onSaveSuccess={(saved) => {
              setSiteSettings(saved);
            }}
            showToast={showToast}
          />
        )}

        {/* ========================================================= */}
        {/* TAB 4: RLS SECURITY & SQL SETUP */}
        {/* ========================================================= */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="p-5 bg-[#111111] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-950 border border-emerald-700 text-emerald-400 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold uppercase tracking-wider font-heading">
                      Strict Row-Level Security (RLS) Policy Architecture
                    </h2>
                    <p className="text-xs text-white/50 font-mono">
                      Database-enforced security boundaries for inventory and leads
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleCopySql}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
                >
                  {copiedSql ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Full SQL Migration</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-3.5 bg-black/40 border border-white/5">
                  <span className="text-[11px] font-mono font-bold text-white uppercase block mb-1">
                    1. Vehicles Table RLS
                  </span>
                  <p className="text-xs text-white/60 leading-relaxed">
                    Public (anon) can only <code className="text-emerald-400">SELECT</code>. Only authenticated admin sessions can <code className="text-amber-400">INSERT</code>, <code className="text-amber-400">UPDATE</code>, or <code className="text-red-400">DELETE</code>.
                  </p>
                </div>

                <div className="p-3.5 bg-black/40 border border-white/5">
                  <span className="text-[11px] font-mono font-bold text-white uppercase block mb-1">
                    2. Leads Table RLS
                  </span>
                  <p className="text-xs text-white/60 leading-relaxed">
                    Public can <code className="text-emerald-400">INSERT</code> test-drive bookings. Only authenticated admin can <code className="text-amber-400">SELECT</code> or view customer leads.
                  </p>
                </div>

                <div className="p-3.5 bg-black/40 border border-white/5">
                  <span className="text-[11px] font-mono font-bold text-white uppercase block mb-1">
                    3. Storage Bucket Security
                  </span>
                  <p className="text-xs text-white/60 leading-relaxed">
                    <code className="text-white/80">vehicle-photos</code> bucket allows public downloads, but only authenticated admin can upload or delete photo assets.
                  </p>
                </div>
              </div>

              {/* Code Preview */}
              <div className="bg-[#070707] border border-white/10 p-4 font-mono text-[11px] text-white/70 overflow-x-auto max-h-96">
                <pre>{SUPABASE_SQL_SETUP}</pre>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Add / Edit Vehicle Modal */}
      <AdminVehicleFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingVehicle(null);
        }}
        editingVehicle={editingVehicle}
        onSuccess={(saved) => {
          setIsFormModalOpen(false);
          setEditingVehicle(null);
          showToast(
            'success',
            editingVehicle
              ? `Successfully updated "${saved.make} ${saved.model}".`
              : `Successfully added "${saved.make} ${saved.model}" to inventory.`
          );
          refreshData();
        }}
      />

      {/* Confirmation Modal: Mark Vehicle as Sold when Purchase Lead is Paid */}
      {vehicleSoldPrompt && vehicleSoldPrompt.isOpen && (
        <div
          id="mark-sold-modal-backdrop"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            id="mark-sold-modal"
            className="w-full max-w-md bg-[#111111] border border-white/15 p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white uppercase font-heading">
                  Mark {vehicleSoldPrompt.vehicleName} as Sold?
                </h3>
                <p className="text-xs text-white/70 leading-relaxed">
                  You just marked payment as <span className="text-emerald-400 font-bold">PAID</span> for <span className="text-white font-bold">{vehicleSoldPrompt.customerName}</span>'s purchase reservation.
                </p>
                <p className="text-[11px] text-white/50 leading-relaxed pt-1">
                  Would you like to update the status of this vehicle to <strong className="text-white">Sold</strong> in showroom inventory, or keep it available (e.g. if this was only a deposit)?
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
              <button
                id="confirm-mark-vehicle-sold-btn"
                onClick={handleConfirmMarkAsSold}
                className="w-full sm:flex-1 py-3 px-4 bg-[#e24b4a] hover:bg-[#c53736] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg shadow-red-950/40"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Yes, Mark as Sold</span>
              </button>

              <button
                id="dismiss-mark-vehicle-sold-btn"
                onClick={handleDismissMarkAsSold}
                className="w-full sm:w-auto py-3 px-4 bg-white/10 hover:bg-white/15 text-white/80 text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer"
              >
                Keep Available
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
