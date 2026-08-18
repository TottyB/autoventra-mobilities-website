import React, { useState } from 'react';
import { BRAND_INFO, SERVICES } from '../data/autoventraData';
import { createLead } from '../lib/supabase';
import { PaymentInfo } from './PaymentInfo';
import { X, Send, Phone, MessageCircle, CheckCircle2 } from 'lucide-react';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: string;
}

export const InquiryModal: React.FC<InquiryModalProps> = ({
  isOpen,
  onClose,
  initialService = '',
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: initialService || SERVICES[0].title,
    message: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Sync initialService if provided
  React.useEffect(() => {
    if (initialService) {
      setFormData((prev) => ({ ...prev, service: initialService }));
    }
  }, [initialService]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await createLead({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || null,
        lead_type: 'service_inquiry',
        notes: `[Service: ${formData.service}] ${formData.message || 'No additional message'}`,
        preferred_date: null,
      });
    } catch (err) {
      console.warn('Notice while saving inquiry:', err);
    } finally {
      setSubmitting(false);
      setIsSubmitted(true);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      service: SERVICES[0].title,
      message: '',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#111] border border-white/10 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="h-1 bg-[#e24b4a] w-full flex-shrink-0" />
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0b0b0b] flex-shrink-0">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-[#e24b4a] uppercase font-mono">
              AutoVentraMotors Concierge
            </span>
            <h3 className="text-base font-bold font-heading uppercase text-white">
              Request a Service or Quote
            </h3>
          </div>
          <button
            id="close-inquiry-modal-btn"
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto">
          {isSubmitted ? (
            <div className="space-y-5">
              <div className="text-center space-y-2 p-4 bg-emerald-500/10 border border-emerald-500/30">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold font-heading uppercase text-white">
                  Inquiry Received!
                </h4>
                <p className="text-xs text-white/70 max-w-sm mx-auto leading-relaxed">
                  Thank you, <span className="text-white font-bold">{formData.name}</span>. Our representative at Ngong Road, Nairobi has logged your inquiry for <span className="text-[#e24b4a] font-medium">{formData.service}</span>.
                </p>
              </div>

              {/* Pay via M-Pesa Info */}
              <PaymentInfo
                context={`inquiry for ${formData.service} (${formData.name})`}
                title="Direct M-Pesa Payment (If Applicable)"
                variant="compact"
              />

              <div className="pt-2 flex justify-center">
                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-widest border border-white/10 cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. John Kamau"
                  className="w-full px-4 py-2.5 bg-[#0b0b0b] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#e24b4a] text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full px-4 py-2.5 bg-[#0b0b0b] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#e24b4a] text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0712 345 678"
                    className="w-full px-4 py-2.5 bg-[#0b0b0b] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#e24b4a] text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1.5">
                  Service of Interest *
                </label>
                <select
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#0b0b0b] border border-white/10 text-white focus:outline-none focus:border-[#e24b4a] text-xs"
                >
                  {SERVICES.map((s) => (
                    <option key={s.id} value={s.title} className="bg-[#111] text-white">
                      {s.title}
                    </option>
                  ))}
                  <option value="General Inquiry" className="bg-[#111] text-white">General Dealership Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1.5">
                  Message / Details
                </label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us vehicle model preferences, rental dates, or specific requirements..."
                  className="w-full px-4 py-2.5 bg-[#0b0b0b] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#e24b4a] text-xs resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-between gap-4">
                <a
                  href={BRAND_INFO.telUrl}
                  className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white"
                >
                  <Phone className="w-3.5 h-3.5 text-[#e24b4a]" />
                  <span>Call {BRAND_INFO.phone}</span>
                </a>

                <button
                  type="submit"
                  id="submit-inquiry-btn"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-[#e24b4a] hover:bg-[#c53736] disabled:opacity-50 text-white font-bold text-xs tracking-widest uppercase flex items-center gap-2 shadow-lg shadow-red-950/50 cursor-pointer"
                >
                  <span>{submitting ? 'Submitting...' : 'Submit'}</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};


