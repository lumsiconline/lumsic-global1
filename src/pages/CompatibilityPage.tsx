import React from 'react';
import { ZodiacCompatibilityCalculator } from '../components/ZodiacCompatibilityCalculator';
import { Reader } from '../types';
import { Star, MessageSquare, ShieldCheck, Heart, Sparkles, CheckCircle2 } from 'lucide-react';

interface CompatibilityPageProps {
  onSelectReader?: (reader: Reader) => void;
  onExplore?: () => void;
  onOpenConsultationModal?: (reader: Reader) => void;
  setCurrentView?: (view: string) => void;
}

export const CompatibilityPage: React.FC<CompatibilityPageProps> = ({
  onExplore,
  setCurrentView,
}) => {
  const handleChatWithPsychics = () => {
    if (onExplore) {
      onExplore();
    } else if (setCurrentView) {
      setCurrentView('explore');
    }
  };

  return (
    <div className="bg-[#FAF7F2] text-[#29252D] min-h-screen py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Zodiac Compatibility Calculator Component */}
        <ZodiacCompatibilityCalculator
          onChatWithLovePsychics={handleChatWithPsychics}
          isStandalonePage={true}
        />

        {/* Informational Guidance Cards underneath */}
        <div className="max-w-5xl mx-auto pt-6 border-t border-stone-200/90">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#733596] block mb-1">
              THE CELESTIAL SYNASTRY METHOD
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#2A153B]">
              How LUMSIC Calculates Your Cosmic Match
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-2">
              Our astrological synergy model computes planetary elemental trines, communication octaves, and emotional polarities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
              </div>
              <h4 className="font-serif font-bold text-base text-gray-900">
                1. Elemental Chemistry
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Fire ignites Air, Earth grounds Water. We evaluate traditional Hellenistic and Vedic triplicities to measure instinctual physical and mental attraction.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5 text-sky-600" />
              </div>
              <h4 className="font-serif font-bold text-base text-gray-900">
                2. Communication Velocity
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Mercury alignments and air-harmonic aspects reveal whether conflict is easily resolved through candid dialogue or prone to defensive misunderstandings.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5 text-amber-600" />
              </div>
              <h4 className="font-serif font-bold text-base text-gray-900">
                3. Soulmate Destiny Timelines
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                While sun signs reveal core dynamics, our verified psychics dive deep into your exact birth chart, moon signs, and Venus placements for life-changing clarity.
              </p>
            </div>
          </div>
        </div>

        {/* Quick FAQ Strip */}
        <div className="max-w-4xl mx-auto bg-[#FAF8F5] border border-[#E9DFD3] rounded-3xl p-6 sm:p-8">
          <h4 className="font-serif font-bold text-xl text-[#2A153B] mb-4 text-center">
            Frequently Asked Compatibility Questions
          </h4>
          <div className="space-y-4 text-left">
            <div className="bg-white p-4 rounded-xl border border-stone-200/90">
              <div className="text-sm font-bold text-gray-900 mb-1">
                Does a lower percentage mean a relationship cannot work?
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Never! A lower sun-sign percentage simply indicates contrasting elemental energies (such as Fire and Water) which frequently create tremendous magnetism and personal growth when conscious communication is practiced.
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-stone-200/90">
              <div className="text-sm font-bold text-gray-900 mb-1">
                Can a psychic look at our full birth charts?
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Yes. When you start a 1-on-1 private chat with a LUMSIC relationship advisor, you can provide both birth dates, times, and cities for an intricate synastry and composite chart reading.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
