import React from 'react';
import { Compass, ShieldCheck, Award, HeartHandshake, Sparkles } from 'lucide-react';

interface AboutPageProps {
  onExplore: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onExplore }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 text-left">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#C6A66B]">
          Lineage, Rigor, Discretion
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#38243F]">
          About LUMSIC
        </h1>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
          The premier international destination for genuine spiritual counseling, astrological mathematics, and clairvoyant discernment.
        </p>
      </div>

      {/* Origin Story & Philosophy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
          <h2 className="text-2xl font-serif font-bold text-[#38243F]">
            Restoring Honor to Ancient Sciences
          </h2>
          <p>
            LUMSIC was founded on a singular conviction: spiritual insight is too profound to be reduced to cheap entertainment, algorithmic clickbait, or predatory subscription traps.
          </p>
          <p>
            Throughout human civilization, leaders, scholars, and everyday seekers consulted verified lineage astrologers and intuitive seers before entering battles, sealing alliances, or deciding personal destinies.
          </p>
          <p>
            We engineered LUMSIC as an uncompromising, secure global platform where seekers meet authentic masters—scholars whose understanding of celestial mechanics, archetypal psychology, and intuitive wisdom has been forged through decades of dedicated practice.
          </p>
        </div>

        <div className="rounded-2xl overflow-hidden border-2 border-[#C6A66B]/30 shadow-xl bg-gray-900 aspect-4/3">
          <img
            src="/src/assets/images/lumsic_hero_mystic_1793513346187.jpg"
            alt="Lumsic Heritage"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Core Principles Bento */}
      <div className="space-y-6">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#C6A66B]">
            Our Foundation
          </span>
          <h2 className="text-2xl font-serif font-bold text-[#38243F] mt-1">
            The LUMSIC Ethical Charter
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 space-y-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-[#38243F] text-[#C6A66B] flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#38243F]">Decades of Demonstrated Lineage</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              We verify academic diplomas, parampara lineages, and professional credentials. No amateur readers or computer-generated bots are ever permitted.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 space-y-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-[#38243F] text-[#C6A66B] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#38243F]">Zero Fear-Based Tactics</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              LUMSIC strictly forbids manipulative curse warnings, fear-mongering, or aggressive upselling of expensive rituals. Readings focus entirely on empowerment and strategic clarity.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 space-y-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-[#38243F] text-[#C6A66B] flex items-center justify-center">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#38243F]">Transparent Per-Second Billing</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              You maintain total sovereign control over your budget. You are billed strictly for the exact seconds you spend communicating with your chosen advisor.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
