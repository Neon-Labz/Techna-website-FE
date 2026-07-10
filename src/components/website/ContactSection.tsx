'use client';
import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, MessageCircle, Check } from 'lucide-react';
import { sendContactMessage } from '../../api/contact.api';
import PageHero from './PageHero';

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Valid email format - stricter check (no spaces, valid local + domain, TLD min 2 chars, no consecutive/leading/trailing dots)
  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
  // Sri Lankan phone: local 0XXXXXXXXX (10 digits starting 0) or +94XXXXXXXXX / 94XXXXXXXXX
  const SL_PHONE_REGEX = /^(?:\+94|0094|94|0)?7\d{8}$|^(?:\+94|0094|94|0)?(?:1[1-9]|2[1-9]|3[1-9]|4[1-9]|5[1-9]|6[1-9])\d{7}$/;

  const validate = () => {
    const errors: Record<string, string> = {};

    if (!form.name.trim()) {
      errors.name = 'Full name is required';
    } else if (form.name.trim().length < 2) {
      errors.name = 'Please enter your full name';
    }

    if (!form.email.trim()) {
      errors.email = 'Email is required';
    } else {
      const email = form.email.trim();
      if (email.length > 254) {
        errors.email = 'Email address is too long';
      } else if (/\.\./.test(email)) {
        errors.email = 'Please provide a valid email address';
      } else if (/^\.|\.@|@\.|\.$/.test(email)) {
        errors.email = 'Please provide a valid email address';
      } else if (!EMAIL_REGEX.test(email)) {
        errors.email = 'Please provide a valid email address';
      }
    }

    // Phone is optional, but if provided it must be a valid Sri Lankan number
    if (form.phone.trim()) {
      const cleaned = form.phone.replace(/[\s-]/g, '');
      if (!SL_PHONE_REGEX.test(cleaned)) {
        errors.phone = 'Enter a valid Sri Lankan phone number (e.g. 077-1234567)';
      }
    }

    if (!form.subject) {
      errors.subject = 'Please select a subject';
    }

    if (!form.message.trim()) {
      errors.message = 'Message is required';
    } else if (form.message.trim().length < 10) {
      errors.message = 'Message should be at least 10 characters';
    }

    return errors;
  };

  const updateField = (key: keyof typeof form, value: string) => {
    setForm(f => ({ ...f, [key]: value }));
    setFieldErrors(prev => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setSending(true);

    try {
      await sendContactMessage({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        subject: form.subject,
        message: form.message.trim(),
      });
      setSent(true);
    } catch (err: any) {
      const responseData = err?.response?.data;
      const message = responseData?.message;
      const backendMessage = Array.isArray(message) ? message.join(', ') : message;
      setError(backendMessage || 'Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const whatsappUrl = `https://wa.me/94771703549?text=${encodeURIComponent('Hello! I have a query about Techna Technical Institute.')}`;

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        title="Contact Us"
        subtitle="Have questions about admissions, courses, or anything else? We're here to help!"
        currentPage="Contact Us"
      />

      <div className="relative" style={{ background: 'rgba(1, 131, 203, 0.05)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-4 py-8 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white border border-[#F3F4F6] rounded-xl p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.05)]">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#F0F9FF] rounded-lg flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6 text-[#34BFF3]" strokeWidth={2} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-[0.3px] text-[#1F2937]">PHONE</p>
                    <p className="text-lg font-bold text-[#1F2937] mt-0.5">0771703549</p>
                    <p className="text-sm text-[#6B7280] mt-0.5">Mon-Sun, 8AM-6PM</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[#F3F4F6] rounded-xl p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.05)]">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#F0F9FF] rounded-lg flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6 text-[#34BFF3]" strokeWidth={2} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-[0.3px] text-[#1F2937]">EMAIL</p>
                    <p className="text-base sm:text-lg font-bold text-[#1F2937] mt-0.5 break-all">technatechnicalinstitute@gmail.com</p>
                    <p className="text-sm text-[#6B7280] mt-0.5">We reply within 24 hours</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[#F3F4F6] rounded-xl p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.05)]">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#F0F9FF] rounded-lg flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-[#34BFF3]" strokeWidth={2} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-[0.3px] text-[#1F2937]">ADDRESS</p>
                    <p className="text-lg font-bold text-[#1F2937] mt-0.5">Veerasingam Hall, 3rd Floor, Jaffna</p>
                    <p className="text-sm text-[#6B7280] mt-0.5">Sri Lanka</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[#F3F4F6] rounded-xl p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.05)]">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#F0F9FF] rounded-lg flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 text-[#34BFF3]" strokeWidth={2} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-[0.3px] text-[#1F2937]">OFFICE HOURS</p>
                    <p className="text-lg font-bold text-[#1F2937] mt-0.5">Mon-Sun: 8AM-6PM</p>
                    <p className="text-sm text-[#6B7280] mt-0.5">Open all week</p>
                  </div>
                </div>
              </div>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-[#01C950] rounded-xl p-6 shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] hover:brightness-110 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-base font-bold text-white">Chat on WhatsApp</p>
                    <p className="text-sm text-white opacity-90">Get instant answers</p>
                  </div>
                </div>
              </a>

              <div className="bg-white border border-[#F3F4F6] rounded-2xl p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] flex flex-col items-center justify-center">
                <MapPin className="w-8 h-8 text-[#34BFF3] mb-2" strokeWidth={2.67} />
                <p className="text-sm font-medium text-[#99A1AF] text-center">Veerasingam Hall, 3rd Floor</p>
                <p className="text-xs text-[#99A1AF] text-center">Jaffna, Sri Lanka</p>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="bg-white border border-[#F3F4F6] rounded-2xl p-5 sm:p-8 lg:p-12 shadow-[0px_4px_20px_rgba(0,0,0,0.05)]">
                {sent ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                      <Check className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#111827] mb-2">Message Sent!</h3>
                    <p className="text-[#6B7280]">Thank you for contacting us. We will get back to you within 24 hours.</p>
                    <button
                      onClick={() => { setSent(false); setError(''); setFieldErrors({}); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); }}
                      className="mt-6 px-6 py-2.5 bg-[#0183CB] text-white rounded-lg text-sm font-medium hover:bg-[#016ba5] transition-all"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-[30px] font-bold text-[#111827] leading-9">Send us a Message</h2>
                    <p className="text-base text-[#6B7280] mt-3 mb-8">
                      Fill in the form below and we&apos;ll get back to you as soon as possible.
                    </p>

                    <form onSubmit={handleSubmit} noValidate className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-[#374151] mb-2">Full Name *</label>
                          <input
                            value={form.name}
                            onChange={e => updateField('name', e.target.value)}
                            placeholder="Your full name"
                            aria-invalid={!!fieldErrors.name}
                            className={`w-full px-4 py-3.5 border rounded-lg text-base focus:outline-none focus:ring-2 placeholder:text-[#D1D5DB] ${
                              fieldErrors.name
                                ? 'border-red-400 focus:ring-red-400 focus:border-red-400'
                                : 'border-[#E5E7EB] focus:ring-[#0183CB] focus:border-[#0183CB]'
                            }`}
                          />
                          {fieldErrors.name && <p className="mt-1.5 text-xs text-red-600">{fieldErrors.name}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-[#374151] mb-2">Email Address *</label>
                          <input
                            type="email"
                            value={form.email}
                            onChange={e => updateField('email', e.target.value)}
                            placeholder="you@gmail.com"
                            aria-invalid={!!fieldErrors.email}
                            className={`w-full px-4 py-3.5 border rounded-lg text-base focus:outline-none focus:ring-2 placeholder:text-[#D1D5DB] ${
                              fieldErrors.email
                                ? 'border-red-400 focus:ring-red-400 focus:border-red-400'
                                : 'border-[#E5E7EB] focus:ring-[#0183CB] focus:border-[#0183CB]'
                            }`}
                          />
                          {fieldErrors.email && <p className="mt-1.5 text-xs text-red-600">{fieldErrors.email}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-[#374151] mb-2">Phone Number</label>
                          <input
                            type="tel"
                            value={form.phone}
                            onChange={e => updateField('phone', e.target.value)}
                            placeholder="07X-XXXXXXX"
                            aria-invalid={!!fieldErrors.phone}
                            className={`w-full px-4 py-3.5 border rounded-lg text-base focus:outline-none focus:ring-2 placeholder:text-[#D1D5DB] ${
                              fieldErrors.phone
                                ? 'border-red-400 focus:ring-red-400 focus:border-red-400'
                                : 'border-[#E5E7EB] focus:ring-[#0183CB] focus:border-[#0183CB]'
                            }`}
                          />
                          {fieldErrors.phone && <p className="mt-1.5 text-xs text-red-600">{fieldErrors.phone}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-[#374151] mb-2">Subject *</label>
                          <select
                            value={form.subject}
                            onChange={e => updateField('subject', e.target.value)}
                            aria-invalid={!!fieldErrors.subject}
                            className={`w-full px-4 py-3.5 border rounded-lg text-base focus:outline-none focus:ring-2 text-[#6B7280] appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236B7280%22%20stroke-width%3D%221.8%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_16px_center] bg-[length:20px] ${
                              fieldErrors.subject
                                ? 'border-red-400 focus:ring-red-400 focus:border-red-400'
                                : 'border-[#E5E7EB] focus:ring-[#0183CB] focus:border-[#0183CB]'
                            }`}
                          >
                            <option value="">Select a subject</option>
                            <option>Admission Inquiry</option>
                            <option>Course Information</option>
                            <option>Fee Structure</option>
                            <option>Exam Schedule</option>
                            <option>Technical Support</option>
                            <option>Other</option>
                          </select>
                          {fieldErrors.subject && <p className="mt-1.5 text-xs text-red-600">{fieldErrors.subject}</p>}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#374151] mb-2">Message *</label>
                        <textarea
                          value={form.message}
                          onChange={e => updateField('message', e.target.value)}
                          rows={6}
                          placeholder="Type your message here..."
                          aria-invalid={!!fieldErrors.message}
                          className={`w-full px-4 py-3.5 border rounded-lg text-base focus:outline-none focus:ring-2 placeholder:text-[#D1D5DB] resize-none ${
                            fieldErrors.message
                              ? 'border-red-400 focus:ring-red-400 focus:border-red-400'
                              : 'border-[#E5E7EB] focus:ring-[#0183CB] focus:border-[#0183CB]'
                          }`}
                        />
                        {fieldErrors.message && <p className="mt-1.5 text-xs text-red-600">{fieldErrors.message}</p>}
                      </div>

                      {error && (
                        <div className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
                          {error}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={sending}
                        className="w-full flex items-center justify-center gap-2 py-4 bg-[#34BFF3] hover:bg-[#1ab0e8] text-white font-bold rounded-lg transition-all shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] disabled:opacity-60 text-base"
                      >
                        {sending ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <Send className="w-5 h-5 rotate-45" />
                            <span>Send Message</span>
                          </>
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}