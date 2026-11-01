import React from 'react';
import { ShieldCheck, Clock, Wallet, MessageSquare, ArrowRight, Award, Lock, Sparkles } from 'lucide-react';

interface HowItWorksPageProps {
  onExplore: () => void;
  setCurrentView: (view: string) => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ onExplore, setCurrentView }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 text-left">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#C6A66B]">
          Transparent & Rigorous
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#38243F]">
          How Consultation Works on LUMSIC
        </h1>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
          Designed for seekers who demand intellectual rigor, absolute privacy, and total financial transparency. Here is how our global platform safeguards your consultation journey.
        </p>
      </div>

      {/* 4-Step Process */}
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white p-8 rounded-3xl border border-gray-200">
          <div className="space-y-4">
            <span className="text-xs font-mono font-bold text-[#C6A66B]">STEP 01</span>
            <h2 className="text-2xl font-serif font-bold text-[#38243F]">
              Browse Verified Master Profiles
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Every astrologer on LUMSIC possesses a permanent Astrologer ID (e.g. LUM001) and has passed our 4-tier lineage evaluation. View transparent per-minute pricing, real-time availability (Online, In Session, or Away), authentic client reviews, and specialized modalities.
            </p>
          </div>
          <div className="bg-[#FAF7F2] p-6 rounded-2xl border border-[#38243F]/10 space-y-3 text-xs">
            <div className="flex items-center gap-2 font-semibold text-[#38243F]">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Vetted Lineages Only</span>
            </div>
            <p className="text-gray-600">
              We reject over 88% of reader applicants. Only genuine scholars of Vedic Jyotish, certified Western horary, and seasoned psychic advisors are approved.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white p-8 rounded-3xl border border-gray-200">
          <div className="space-y-4">
            <span className="text-xs font-mono font-bold text-[#C6A66B]">STEP 02</span>
            <h2 className="text-2xl font-serif font-bold text-[#38243F]">
              Fund Your Ledger Wallet
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Unlike legacy sites that enforce predatory subscriptions or forced minute bundles, LUMSIC operates an auditable wallet ledger. Top up with any major international credit card or PayPal. You need only a 2-minute minimum balance to initiate an instant consultation.
            </p>
          </div>
          <div className="bg-[#FAF7F2] p-6 rounded-2xl border border-[#38243F]/10 space-y-3 text-xs">
            <div className="flex items-center gap-2 font-semibold text-[#38243F]">
              <Wallet className="w-4 h-4 text-[#C6A66B]" />
              <span>Per-Second Precision</span>
            </div>
            <p className="text-gray-600">
              When your chat ends, the session duration is calculated to the exact second. Unused funds remain permanently in your account with zero expiration.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white p-8 rounded-3xl border border-gray-200">
          <div className="space-y-4">
            <span className="text-xs font-mono font-bold text-[#C6A66B]">STEP 03</span>
            <h2 className="text-2xl font-serif font-bold text-[#38243F]">
              Live Routing & Astrologer Acceptance
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              When you click "Start Chat", the request is dispatched immediately to your selected astrologer. If their workflow is enabled and they are online, they receive a high-priority ping and accept within seconds.
            </p>
          </div>
          <div className="bg-[#FAF7F2] p-6 rounded-2xl border border-[#38243F]/10 space-y-3 text-xs">
            <div className="flex items-center gap-2 font-semibold text-[#38243F]">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>Zero Leakage Security</span>
            </div>
            <p className="text-gray-600">
              Astrologers only receive chats assigned to their own ID. If an astrologer declines or is delayed, no funds are charged and you can immediately choose another reader.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white p-8 rounded-3xl border border-gray-200">
          <div className="space-y-4">
            <span className="text-xs font-mono font-bold text-[#C6A66B]">STEP 04</span>
            <h2 className="text-2xl font-serif font-bold text-[#38243F]">
              Encrypted Real-Time Consultation
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Communicate in our WhatsApp-style private chat with live timer, billing counter, and instant delivery. Once you have received your answers, either party may conclude the chat. Transcripts are stored in your private history.
            </p>
          </div>
          <div className="bg-[#FAF7F2] p-6 rounded-2xl border border-[#38243F]/10 space-y-3 text-xs">
            <div className="flex items-center gap-2 font-semibold text-[#38243F]">
              <MessageSquare className="w-4 h-4 text-[#38243F]" />
              <span>Permanent Transcripts</span>
            </div>
            <p className="text-gray-600">
              Re-read planetary remedies, astrological timelines, or tarot spreads whenever you wish from your Customer Dashboard.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="bg-[#38243F] text-[#FAF7F2] p-8 sm:p-12 rounded-3xl text-center space-y-5">
        <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
          Begin Your Consultation Today
        </h3>
        <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto">
          Our verified scholars are available 24/7 across all global timezones.
        </p>
        <button
          onClick={onExplore}
          className="px-6 py-3 bg-[#C6A66B] text-[#29252D] font-bold text-xs rounded-xl hover:bg-[#C6A66B]/90 transition-colors shadow-lg"
        >
          Explore Available Readers
        </button>
      </div>
    </div>
  );
};
