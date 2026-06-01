'use client';
import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, MessageCircle, Check } from 'lucide-react';

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => { setSending(false); setSent(true); }, 1500);
  };

  const contactInfo = [
    { icon: Phone, label: 'Phone', value: '021-222-3456', sub: 'Mon–Sat, 8AM–5PM', href: 'tel:0212223456' },
    { icon: Mail, label: 'Email', value: 'info@techna.lk', sub: 'We reply within 24 hours', href: 'mailto:info@techna.lk' },
    { icon: MapPin, label: 'Address', value: 'No. 42, Main Street, Jaffna', sub: 'Sri Lanka', href: '#' },
    { icon: Clock, label: 'Office Hours', value: 'Mon–Fri: 8AM–5PM', sub: 'Sat: 8AM–1PM', href: '#' },
  ];

  const whatsappUrl = `https://wa.me/94771234567?text=${encodeURIComponent('Hello! I have a query about Techna Technical Institute.')}`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-gradient-to-br from-blue-950 to-blue-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-yellow-400 font-semibold text-sm uppercase tracking-wider">Get In Touch</span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mt-2">Contact Us</h1>
          <p className="text-blue-300 mt-3 max-w-xl mx-auto">Have questions about admissions, courses, or anything else? We're here to help!</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-5">
            {contactInfo.map(info => {
              const Icon = info.icon;
              return (
                <a key={info.label} href={info.href} className="flex items-start gap-4 bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all group">
                  <div className="w-12 h-12 bg-blue-50 group-hover:bg-blue-100 rounded-xl flex items-center justify-center shrink-0 transition-all">
                    <Icon className="w-5 h-5 text-blue-700" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">{info.label}</p>
                    <p className="font-semibold text-gray-900 text-sm">{info.value}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{info.sub}</p>
                  </div>
                </a>
              );
            })}

            {/* WhatsApp CTA */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-green-500 hover:bg-green-600 text-white rounded-2xl p-5 shadow-sm transition-all group"
            >
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-base">Chat on WhatsApp</p>
                <p className="text-green-100 text-xs mt-0.5">Quick replies available</p>
              </div>
            </a>

            {/* Map placeholder */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 h-48 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <MapPin className="w-8 h-8 mx-auto mb-2 text-blue-300" />
                <p className="text-sm font-medium">No. 42, Main Street</p>
                <p className="text-xs">Jaffna, Sri Lanka</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
              {sent ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                    <Check className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-500">Thank you for contacting us. We will get back to you within 24 hours.</p>
                  <button onClick={() => { setSent(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); }} className="mt-6 px-6 py-2.5 bg-blue-900 text-white rounded-xl text-sm font-medium hover:bg-blue-800 transition-all">
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">Send us a Message</h2>
                  <p className="text-gray-500 text-sm mb-6">Fill in the form below and we'll get back to you as soon as possible.</p>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                        <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your full name" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address *</label>
                        <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="your@email.com" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                        <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="07X-XXXXXXX" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject *</label>
                        <select required value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-700">
                          <option value="">Select a subject</option>
                          <option>Admission Inquiry</option>
                          <option>Course Information</option>
                          <option>Fee Structure</option>
                          <option>Exam Schedule</option>
                          <option>Technical Support</option>
                          <option>Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Message *</label>
                      <textarea required value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} rows={5} placeholder="Type your message here..." className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 resize-none" />
                    </div>

                    <button
                      type="submit"
                      disabled={sending}
                      className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-blue-900 to-blue-700 hover:from-blue-800 hover:to-blue-600 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-60 text-sm"
                    >
                      {sending ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <><Send className="w-4 h-4" /> Send Message</>
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
  );
}
