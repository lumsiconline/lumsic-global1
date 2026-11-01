import React, { useState } from 'react';
import { Mail, Phone, MessageSquare, CheckCircle, ShieldCheck, Clock } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Consultation Query');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !message) return;
    setIsSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 text-left">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#C6A66B]">
          24/7 Global Client Care
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#38243F]">
          Contact LUMSIC Support
        </h1>
        <p className="text-xs sm:text-sm text-gray-600">
          Our international concierge team is available around the clock to assist with account billing, astrologer inquiries, and technical support.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Contact info cards */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-[#FAF7F2] text-[#38243F] flex items-center justify-center">
              <Mail className="w-4 h-4 text-[#C6A66B]" />
            </div>
            <h3 className="font-serif font-bold text-base text-[#38243F]">Email Concierge</h3>
            <p className="text-xs text-gray-600">
              Direct inquiries & verification:
            </p>
            <a
              href="mailto:concierge@lumsic.com"
              className="text-xs font-semibold text-[#38243F] hover:text-[#C6A66B] block"
            >
              concierge@lumsic.com
            </a>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-[#FAF7F2] text-[#38243F] flex items-center justify-center">
              <Phone className="w-4 h-4 text-[#C6A66B]" />
            </div>
            <h3 className="font-serif font-bold text-base text-[#38243F]">Priority Client Line</h3>
            <p className="text-xs text-gray-600">
              For urgent billing or session issues:
            </p>
            <div className="text-xs font-mono font-semibold text-[#38243F]">
              +1 (800) 555-0199
            </div>
          </div>

          <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#38243F]/10 space-y-2 text-xs text-gray-600">
            <div className="flex items-center gap-2 font-semibold text-[#38243F]">
              <Clock className="w-4 h-4 text-[#C6A66B]" />
              <span>Response SLA</span>
            </div>
            <p>
              Support tickets are answered within 2 hours. Active consultation routing is monitored 24/7.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs">
          {isSubmitted ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif font-bold text-[#38243F]">
                Inquiry Dispatched
              </h3>
              <p className="text-xs text-gray-600 max-w-sm mx-auto">
                Thank you, {fullName}. Your message has been logged with ticket #LUM-{Math.floor(1000 + Math.random() * 9000)}. Our concierge team will reply to {email} shortly.
              </p>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setMessage('');
                }}
                className="mt-4 px-4 py-2 bg-[#38243F] text-white text-xs font-semibold rounded-lg"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-lg font-serif font-bold text-[#38243F]">
                Send an Inquiry
              </h3>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#38243F]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#38243F]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Inquiry Topic
                </label>
                <select
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#38243F]"
                >
                  <option value="Consultation Query">Consultation Query</option>
                  <option value="Wallet / Billing Inquiry">Wallet / Billing Inquiry</option>
                  <option value="Reader Application">Reader Application / Lineage Audit</option>
                  <option value="Privacy / Data Request">Privacy / Data Request</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Detailed Message
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="How can our concierge assist you?"
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#38243F]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#38243F] text-[#FAF7F2] font-semibold text-xs rounded-xl hover:bg-[#38243F]/90 transition-colors shadow-sm"
              >
                Submit Inquiry to Concierge
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
