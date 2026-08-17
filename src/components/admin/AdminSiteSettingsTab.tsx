import React, { useState, useEffect } from 'react';
import { SiteSettings } from '../../types';
import { updateSiteSettings } from '../../lib/supabase';
import { PaymentInfo } from '../PaymentInfo';
import {
  CreditCard,
  Save,
  RefreshCw,
  CheckCircle,
  HelpCircle,
  Building,
  Hash,
  FileText,
  Eye,
  ShieldCheck,
} from 'lucide-react';

interface AdminSiteSettingsTabProps {
  initialSettings: SiteSettings;
  onSaveSuccess: (updated: SiteSettings) => void;
  showToast: (type: 'success' | 'error', message: string) => void;
}

export const AdminSiteSettingsTab: React.FC<AdminSiteSettingsTabProps> = ({
  initialSettings,
  onSaveSuccess,
  showToast,
}) => {
  const [formData, setFormData] = useState<SiteSettings>(initialSettings);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFormData(initialSettings);
  }, [initialSettings]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const res = await updateSiteSettings({
      paybill_number: formData.paybill_number.trim(),
      paybill_account_number: formData.paybill_account_number.trim(),
      business_name: formData.business_name.trim(),
      payment_instructions: formData.payment_instructions.trim(),
    });

    setSaving(false);

    if (res.success && res.data) {
      showToast('success', 'M-Pesa payment settings updated successfully in Supabase.');
      onSaveSuccess(res.data);
    } else {
      showToast(
        'error',
        res.error || 'Failed to update site settings in Supabase.'
      );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="p-5 bg-[#111111] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-950 border border-emerald-700 text-emerald-400 flex items-center justify-center">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white font-heading">
              M-Pesa & Site Settings
            </h3>
            <p className="text-xs text-white/50">
              Configure the Lipa na Paybill numbers and instructions shown to customers across all booking, inquiry, and contact screens.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1.5 self-start md:self-auto">
          <ShieldCheck className="w-4 h-4" />
          <span>RLS Protected (Admin-Only Edit)</span>
        </div>
      </div>

      {/* Grid: Form on Left, Live Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Configuration Form */}
        <div className="lg:col-span-6 bg-[#111111] border border-white/10 p-6 space-y-6">
          <div className="border-b border-white/10 pb-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#e24b4a] font-bold">
              Supabase site_settings Table
            </span>
            <h4 className="text-sm font-bold uppercase text-white">
              Edit Lipa na Paybill Details
            </h4>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Paybill Number */}
            <div>
              <label className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-white/80 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-[#e24b4a]" />
                  Paybill Business Number (paybill_number)
                </span>
                <span className="text-[10px] text-white/40 font-mono">e.g. 400200</span>
              </label>
              <input
                type="text"
                name="paybill_number"
                value={formData.paybill_number}
                onChange={handleChange}
                placeholder="Enter Paybill Number (leave empty for placeholder)"
                className="w-full px-4 py-2.5 bg-[#0b0b0b] border border-white/15 text-white placeholder-white/20 text-xs font-mono focus:outline-none focus:border-[#e24b4a]"
              />
              <p className="text-[10px] text-white/40 mt-1">
                If left empty, a neutral "Payment details coming soon" banner will be shown automatically.
              </p>
            </div>

            {/* Paybill Account Number */}
            <div>
              <label className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-white/80 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-[#e24b4a]" />
                  Paybill Account Number (paybill_account_number)
                </span>
                <span className="text-[10px] text-white/40 font-mono">e.g. 1192898 or AUTOVENTRA</span>
              </label>
              <input
                type="text"
                name="paybill_account_number"
                value={formData.paybill_account_number}
                onChange={handleChange}
                placeholder="Enter Account Number"
                className="w-full px-4 py-2.5 bg-[#0b0b0b] border border-white/15 text-white placeholder-white/20 text-xs font-mono focus:outline-none focus:border-[#e24b4a]"
              />
            </div>

            {/* Business Name (Optional) */}
            <div>
              <label className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-white/80 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-[#e24b4a]" />
                  Registered Business Name (business_name) — Optional
                </span>
                <span className="text-[10px] text-white/40 font-mono">e.g. AUTOVENTRA MOTORS</span>
              </label>
              <input
                type="text"
                name="business_name"
                value={formData.business_name}
                onChange={handleChange}
                placeholder="Optional: leave empty to omit completely from customer card"
                className="w-full px-4 py-2.5 bg-[#0b0b0b] border border-white/15 text-white placeholder-white/20 text-xs focus:outline-none focus:border-[#e24b4a]"
              />
              <p className="text-[10px] text-white/40 mt-1">
                Optional. If left blank, this row is completely omitted from the payment card.
              </p>
            </div>

            {/* Payment Instructions */}
            <div>
              <label className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-white/80 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#e24b4a]" />
                  Customer Payment Instructions (payment_instructions)
                </span>
              </label>
              <textarea
                rows={3}
                name="payment_instructions"
                value={formData.payment_instructions}
                onChange={handleChange}
                placeholder="Enter instructions for customers..."
                className="w-full px-4 py-2 bg-[#0b0b0b] border border-white/15 text-white placeholder-white/20 text-xs focus:outline-none focus:border-[#e24b4a] resize-none leading-relaxed"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                id="save-site-settings-btn"
                disabled={saving}
                className="w-full py-3 px-4 bg-[#e24b4a] hover:bg-[#c53736] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg shadow-red-950/40"
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Saving to Supabase...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save M-Pesa Settings</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right: Live Real-Time Customer Preview */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-[#111111] border border-white/10 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-white font-heading">
                Live Customer Preview
              </span>
            </div>
            <span className="text-[10px] font-mono text-white/40">
              Updates in real time as you type
            </span>
          </div>

          {/* Render the PaymentInfo component with the current formData */}
          <div className="border border-white/10">
            <PaymentInfo
              context="demo rental booking"
              title="Pay via M-Pesa (Lipa na Paybill)"
              initialSettings={formData}
            />
          </div>

          {/* Explanatory Help Card */}
          <div className="p-4 bg-white/[0.03] border border-white/10 space-y-2 text-xs text-white/60">
            <div className="flex items-center gap-2 text-white font-bold font-mono text-[11px] uppercase">
              <HelpCircle className="w-3.5 h-3.5 text-[#e24b4a]" />
              <span>How Customers Use This</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-white/60">
              <li>Customers view this banner on Rental Booking confirmations, Vehicle Inquiries, and the Contact page.</li>
              <li>They open M-Pesa on their phone, enter the Paybill and Account numbers, and complete payment.</li>
              <li>They click the WhatsApp confirmation button to send their transaction details.</li>
              <li>You confirm the payment on your phone or bank portal, then mark the lead as <strong className="text-emerald-400">"Paid"</strong> in the Customer Inquiries tab.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
