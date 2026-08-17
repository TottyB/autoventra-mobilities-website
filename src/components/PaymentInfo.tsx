import React, { useState, useEffect } from 'react';
import { SiteSettings } from '../types';
import { getSiteSettings, DEFAULT_SITE_SETTINGS } from '../lib/supabase';
import { BRAND_INFO } from '../data/autoventraData';
import {
  Copy,
  Check,
  MessageCircle,
  ShieldCheck,
  CreditCard,
  Building2,
  Info,
  Phone,
} from 'lucide-react';

interface PaymentInfoProps {
  /**
   * The context string used to pre-fill the WhatsApp confirmation message.
   * Example: "my rental booking", "vehicle inquiry for 2020 Subaru Outback", or "order #123"
   */
  context?: string;
  /**
   * Custom title or heading for the payment section.
   */
  title?: string;
  /**
   * Layout mode: 'card' (default standalone card) or 'compact' (modal/inline banner)
   */
  variant?: 'card' | 'compact';
  /**
   * Optional preloaded settings if passed from parent
   */
  initialSettings?: SiteSettings;
  /**
   * Optional extra CSS class
   */
  className?: string;
}

export const PaymentInfo: React.FC<PaymentInfoProps> = ({
  context = 'my vehicle booking',
  title = 'Pay via M-Pesa (Lipa na Paybill)',
  variant = 'card',
  initialSettings,
  className = '',
}) => {
  const [settings, setSettings] = useState<SiteSettings>(
    initialSettings || DEFAULT_SITE_SETTINGS
  );
  const [loading, setLoading] = useState<boolean>(!initialSettings);
  const [copiedField, setCopiedField] = useState<'paybill' | 'account' | null>(null);

  useEffect(() => {
    if (initialSettings) {
      setSettings(initialSettings);
      setLoading(false);
      return;
    }

    let isMounted = true;
    async function loadSettings() {
      try {
        const { data } = await getSiteSettings();
        if (isMounted && data) {
          setSettings(data);
        }
      } catch (err) {
        console.warn('Could not fetch site settings for payment info:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadSettings();
    return () => {
      isMounted = false;
    };
  }, [initialSettings]);

  const hasPaybillDetails = Boolean(
    settings.paybill_number?.trim() || settings.paybill_account_number?.trim()
  );

  const hasBusinessName = Boolean(
    settings.business_name && settings.business_name.trim().length > 0
  );

  const handleCopy = (text: string, field: 'paybill' | 'account') => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => {
      setCopiedField(null);
    }, 2500);
  };

  // Build the pre-filled WhatsApp message strictly matching the user requirement:
  // "Hi, I've made a payment via M-Pesa for [context]."
  const whatsappMessage = encodeURIComponent(
    `Hi, I've made a payment via M-Pesa for ${context}.`
  );
  const whatsappConfirmationUrl = `https://wa.me/254714885888?text=${whatsappMessage}`;

  return (
    <div
      id="payment-info-component"
      className={`bg-[#0d0d0d] border border-white/10 overflow-hidden ${
        variant === 'compact' ? 'p-4 sm:p-5' : 'p-5 sm:p-7'
      } ${className}`}
    >
      {/* Header with Title & Security Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
          <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white font-heading">
            {title}
          </h3>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5">
          <ShieldCheck className="w-3 h-3" />
          <span>Manual Direct M-Pesa</span>
        </div>
      </div>

      {loading ? (
        <div className="py-8 text-center text-xs text-white/40 font-mono">
          Loading Lipa na Paybill details...
        </div>
      ) : !hasPaybillDetails ? (
        /* Neutral Placeholder when settings have not been configured yet */
        <div className="bg-[#141414] border border-dashed border-white/15 p-5 text-center space-y-2">
          <CreditCard className="w-8 h-8 text-white/30 mx-auto" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">
            Payment Details Coming Soon
          </h4>
          <p className="text-[11px] text-white/60 max-w-sm mx-auto leading-relaxed">
            Our direct M-Pesa Paybill is currently being updated. Please contact our desk on WhatsApp or call{' '}
            <span className="text-white font-bold">{BRAND_INFO.phone}</span> for instant payment instructions.
          </p>
          <div className="pt-2">
            <a
              id="payment-placeholder-whatsapp-btn"
              href={whatsappConfirmationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/40 text-xs font-bold uppercase tracking-wider hover:bg-[#25D366]/30 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Contact Desk on WhatsApp</span>
            </a>
          </div>
        </div>
      ) : (
        /* Co-operative Bank Lipa na Paybill Authentic Card */
        <div className="space-y-4">
          {/* Card Frame */}
          <div className="bg-white text-zinc-900 rounded-sm border-2 border-[#006837] shadow-xl overflow-hidden">
            {/* Top Forest Green Co-operative Bank Header */}
            <div className="bg-[#006837] text-white px-4 py-2.5 flex items-center justify-between gap-2 border-b border-[#00522c]">
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tighter text-sm sm:text-base uppercase font-heading text-white">
                  CO-OPERATIVE BANK
                </span>
                <span className="text-emerald-200 text-[10px] hidden sm:inline font-mono">
                  | We are you
                </span>
              </div>
              <div className="bg-white/10 px-2 py-0.5 border border-white/20 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-emerald-100 font-mono">
                LIPA NA PAYBILL
              </div>
            </div>

            {/* Paybill Body */}
            <div className="p-4 sm:p-6 bg-gradient-to-b from-white to-[#f7f9f7] space-y-4">
              {/* Paybill Number Box */}
              <div className="text-center bg-white p-3 sm:p-4 border-2 border-[#006837]/30 rounded shadow-sm">
                <div className="text-[10px] sm:text-xs font-bold font-mono tracking-widest text-zinc-500 uppercase mb-1">
                  PAYBILL BUSINESS NUMBER
                </div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black font-mono tracking-[0.25em] text-[#006837] select-all">
                  {settings.paybill_number}
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(settings.paybill_number, 'paybill')}
                  className="mt-2 text-[10px] font-bold uppercase tracking-wider text-[#006837] hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  {copiedField === 'paybill' ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>Copied to clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Paybill Number</span>
                    </>
                  )}
                </button>
              </div>

              {/* Account Number & Business Name (Optional) */}
              {hasBusinessName ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Account Number Box */}
                  <div className="bg-white p-3 border border-zinc-300 rounded text-center">
                    <div className="text-[10px] font-bold font-mono uppercase tracking-wider text-zinc-500 mb-1">
                      ACCOUNT NUMBER:
                    </div>
                    <div className="text-base sm:text-lg font-black font-mono tracking-wider text-zinc-900 select-all">
                      {settings.paybill_account_number}
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(settings.paybill_account_number, 'account')
                      }
                      className="mt-1.5 text-[9px] font-bold uppercase tracking-wider text-zinc-600 hover:text-black inline-flex items-center gap-1 cursor-pointer"
                    >
                      {copiedField === 'account' ? (
                        <>
                          <Check className="w-2.5 h-2.5 text-emerald-600" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-2.5 h-2.5" />
                          <span>Copy Account No.</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Business Name Box */}
                  <div className="bg-white p-3 border border-zinc-300 rounded text-center flex flex-col justify-center">
                    <div className="text-[10px] font-bold font-mono uppercase tracking-wider text-zinc-500 mb-1">
                      BUSINESS NAME:
                    </div>
                    <div className="text-sm sm:text-base font-bold uppercase text-zinc-900 tracking-wide">
                      {settings.business_name}
                    </div>
                  </div>
                </div>
              ) : (
                /* When business_name is empty/null, only render Account Number */
                <div className="bg-white p-3 border border-zinc-300 rounded text-center">
                  <div className="text-[10px] font-bold font-mono uppercase tracking-wider text-zinc-500 mb-1">
                    ACCOUNT NUMBER:
                  </div>
                  <div className="text-base sm:text-lg font-black font-mono tracking-wider text-zinc-900 select-all">
                    {settings.paybill_account_number}
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(settings.paybill_account_number, 'account')
                    }
                    className="mt-1.5 text-[9px] font-bold uppercase tracking-wider text-zinc-600 hover:text-black inline-flex items-center gap-1 cursor-pointer"
                  >
                    {copiedField === 'account' ? (
                      <>
                        <Check className="w-2.5 h-2.5 text-emerald-600" />
                        <span>Copied to clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-2.5 h-2.5" />
                        <span>Copy Account Number</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Payment Instructions */}
          <div className="p-3.5 bg-white/5 border border-white/10 text-xs text-white/80 space-y-1.5">
            <div className="flex items-center gap-1.5 text-white font-bold text-[11px] uppercase tracking-wider font-mono">
              <Info className="w-3.5 h-3.5 text-[#e24b4a]" />
              <span>Step-by-Step Payment Instructions</span>
            </div>
            <p className="text-[11px] text-white/70 leading-relaxed">
              {settings.payment_instructions ||
                'Pay via M-Pesa using the details above, then contact us on WhatsApp with your payment confirmation.'}
            </p>
          </div>

          {/* WhatsApp Pre-filled Confirmation Button */}
          <div>
            <a
              id="payment-whatsapp-confirm-btn"
              href={whatsappConfirmationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-[#25D366] hover:bg-[#20b858] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg shadow-emerald-950/40"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Confirm M-Pesa Payment on WhatsApp</span>
            </a>
            <p className="text-[10px] text-white/40 text-center font-mono mt-1.5">
              Includes pre-filled message: "Hi, I've made a payment via M-Pesa for {context}."
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
