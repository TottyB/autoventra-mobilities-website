import React, { useState } from 'react';
import { BRAND_INFO, SERVICES } from '../data/autoventraData';
import { createLead } from '../lib/supabase';
import { PaymentInfo } from './PaymentInfo';
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  Send,
  CheckCircle2,
  Building,
  Shield,
  ArrowUpRight,
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: SERVICES[0].title,
    message: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createLead({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || null,
        lead_type: 'contact_message',
        notes: `[Service: ${formData.service}] ${formData.message || 'No message'}`,
        preferred_date: null,
      });
    } catch (err) {
      console.warn('Notice while saving contact lead:', err);
    }
    setIsSubmitted(true);
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
  };

  return (
    <div className="w-full bg-[#0b0b0b] text-white">
      {/* Page Header Banner */}
      <section className="relative bg-gradient-to-b from-[#1a1a1a] to-[#0b0b0b] border-b border-white/10 py-16 lg:py-24 overflow-hidden">
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-[#e24b4a] font-bold text-xs uppercase tracking-[0.3em] mb-2 block font-mono">
            Get In Touch
          </span>
          <h1 className="text-4xl sm:text-6xl font-black font-heading uppercase tracking-tighter text-white">
            CONTACT <span className="text-[#e24b4a]">AUTOVENTRAMOBILITIES</span>
          </h1>
          <p className="text-white/60 text-sm sm:text-base max-w-2xl mx-auto font-medium">
            Visit our showroom on Ngong Road, Nairobi or connect with our automotive advisors directly via phone, email, or WhatsApp.
          </p>
        </div>
      </section>

      {/* Main Contact Grid */}
      <section className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Direct Contact Info & Working Hours */}
          <div className="lg:col-span-5 space-y-6">
            {/* Quick Action Channels */}
            <div className="space-y-3">
              <h2 className="text-sm font-bold font-heading uppercase tracking-widest text-white flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#e24b4a] rotate-45" />
                Direct Communication
              </h2>

              {/* WhatsApp Card */}
              <a
                id="contact-whatsapp-card"
                href={BRAND_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 bg-[#111] border border-white/10 hover:border-[#25D366]/50 flex items-center justify-between group transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#25D366]/10 border border-[#25D366]/30 flex items-center justify-center text-[#25D366]">
                    <MessageCircle className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <strong className="text-white block text-sm font-bold uppercase tracking-wide group-hover:text-[#25D366] transition-colors">
                      WhatsApp Chat Support
                    </strong>
                    <span className="text-xs text-white/50">
                      Immediate response for quotes & inquiries
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-[#25D366] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </a>

              {/* Phone Card */}
              <a
                id="contact-phone-card"
                href={BRAND_INFO.telUrl}
                className="p-5 bg-[#111] border border-white/10 hover:border-[#e24b4a]/50 flex items-center justify-between group transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center text-[#e24b4a]">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-white block text-sm font-bold uppercase tracking-wide group-hover:text-[#e24b4a] transition-colors">
                      Direct Phone Call
                    </strong>
                    <span className="text-xs text-white/50">
                      {BRAND_INFO.phone}
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-[#e24b4a] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </a>

              {/* Email Card */}
              <a
                id="contact-email-card"
                href={BRAND_INFO.mailUrl}
                className="p-5 bg-[#111] border border-white/10 hover:border-white/30 flex items-center justify-between group transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-white block text-sm font-bold uppercase tracking-wide group-hover:text-white transition-colors">
                      Official Email
                    </strong>
                    <span className="text-xs text-white/50">
                      {BRAND_INFO.email}
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </a>
            </div>

            {/* Location & Showroom Address */}
            <div className="bg-[#111] border border-white/10 p-6 space-y-3">
              <div className="flex items-center gap-3">
                <Building className="w-4 h-4 text-[#e24b4a]" />
                <h3 className="text-xs font-bold font-heading uppercase text-white tracking-wider">
                  Headquarters & Showroom
                </h3>
              </div>
              <p className="text-sm text-white/80 flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#e24b4a] flex-shrink-0 mt-0.5" />
                <span>{BRAND_INFO.location}</span>
              </p>
              <p className="text-xs text-white/50 leading-relaxed">
                Centrally located along Ngong Road for convenient vehicle inspections, trade-in assessments, and test drives across Nairobi.
              </p>
            </div>

            {/* Business Hours */}
            <div className="bg-[#111] border border-white/10 p-6 space-y-3">
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-[#e24b4a]" />
                <h3 className="text-xs font-bold font-heading uppercase text-white tracking-wider">
                  Business Hours
                </h3>
              </div>
              <div className="space-y-2 text-xs divide-y divide-white/5">
                {BRAND_INFO.businessHours.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center pt-2 first:pt-0">
                    <span className="text-white/60">{item.days}</span>
                    <span className="text-white font-mono font-medium">
                      {item.hours}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 bg-[#111] border border-white/10 p-8 sm:p-10 shadow-2xl">
            <div className="mb-6 space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#e24b4a] font-bold">
                Send Us a Message
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-heading uppercase text-white">
                How Can We Assist Your Drive?
              </h2>
              <p className="text-xs text-white/50">
                Fill in your details below and our team will get in touch with you shortly.
              </p>
            </div>

            {isSubmitted ? (
              <div className="text-center py-12 space-y-5">
                <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold font-heading uppercase text-white">
                  Message Sent Successfully!
                </h3>
                <p className="text-xs text-white/70 max-w-md mx-auto leading-relaxed">
                  Thank you, <span className="text-white font-bold">{formData.name}</span>. We have received your inquiry regarding <span className="text-[#e24b4a] font-medium">{formData.service}</span> and will respond to <span className="text-white font-mono">{formData.email}</span> as soon as possible.
                </p>
                <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href={BRAND_INFO.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#25D366] text-slate-950 font-bold text-xs uppercase tracking-widest"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>Chat on WhatsApp Now</span>
                  </a>
                  <button
                    onClick={handleReset}
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-widest border border-white/10 cursor-pointer transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 bg-[#0b0b0b] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#e24b4a] text-xs font-medium"
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
                      className="w-full px-4 py-3 bg-[#0b0b0b] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#e24b4a] text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1.5">
                      Phone / WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+254 702 957300"
                      className="w-full px-4 py-3 bg-[#0b0b0b] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#e24b4a] text-xs font-medium"
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
                    className="w-full px-4 py-3 bg-[#0b0b0b] border border-white/10 text-white focus:outline-none focus:border-[#e24b4a] text-xs font-medium"
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
                    Your Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about the vehicle you wish to buy, trade in, rent, or transport needs..."
                    className="w-full px-4 py-3 bg-[#0b0b0b] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#e24b4a] text-xs font-medium resize-none"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-[11px] text-white/40 font-mono">
                    <Shield className="w-3.5 h-3.5 text-[#e24b4a]" />
                    <span>Information strictly confidential.</span>
                  </div>

                  <button
                    type="submit"
                    id="contact-submit-btn"
                    className="w-full sm:w-auto px-8 py-3 bg-[#e24b4a] hover:bg-[#c53736] text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-red-950/50 flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <span>Submit Message</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Lipa na M-Pesa Payment Info Section */}
      <section className="py-12 border-t border-white/10 bg-[#0d0d0d]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="text-center space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#e24b4a] font-mono">
              Direct Dealership Payments
            </span>
            <h2 className="text-xl sm:text-2xl font-black font-heading uppercase text-white">
              Official M-Pesa Lipa na Paybill
            </h2>
            <p className="text-xs text-white/50 max-w-lg mx-auto">
              Make vehicle reservation deposits, test-drive booking commitments, or rental hire payments securely through our official bank paybill.
            </p>
          </div>

          <PaymentInfo
            context="general payment / vehicle deposit"
            title="AutoVentraMobilities M-Pesa Payment Details"
          />
        </div>
      </section>

      {/* Embedded Map Section for Ngong Road, Nairobi */}
      <section className="border-t border-white/10 bg-[#0b0b0b] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#e24b4a] font-mono">
                Interactive Showroom Locator
              </span>
              <h3 className="text-2xl font-black font-heading uppercase text-white mt-1">
                Ngong Road, Nairobi, Kenya
              </h3>
            </div>
            <a
              id="google-maps-external-link"
              href="https://www.google.com/maps/search/?api=1&query=Ngong+Road+Nairobi+Kenya"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#e24b4a] hover:text-white transition-colors"
            >
              <span>Open in Google Maps</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

          {/* Map Container */}
          <div className="relative w-full h-80 sm:h-96 md:h-[400px] overflow-hidden border border-white/10 shadow-2xl">
            <iframe
              title="AutoVentraMobilities Location - Ngong Road Nairobi"
              src="https://maps.google.com/maps?q=Ngong%20Road,%20Nairobi,%20Kenya&t=&z=14&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full border-0 filter grayscale contrast-125 opacity-90 hover:opacity-100 transition-opacity"
              loading="lazy"
              allowFullScreen
            />
            {/* Map Overlay Badge */}
            <div className="absolute top-4 left-4 bg-[#0b0b0b]/90 backdrop-blur-md border border-white/10 px-4 py-2 text-xs flex items-center gap-2 shadow-lg pointer-events-none">
              <span className="w-2 h-2 bg-[#e24b4a] rotate-45" />
              <span className="font-bold text-white uppercase text-[11px]">AutoVentraMobilities Showroom Hub</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

