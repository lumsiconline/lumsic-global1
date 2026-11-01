import React, { useState, useId } from 'react';
import { Sparkles, Heart, ChevronDown, MessageSquare, ArrowRight } from 'lucide-react';

export interface ZodiacSign {
  id: string;
  name: string;
  symbol: string;
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
  elementIcon: string;
  dates: string;
  color: string;
  accentBg: string;
}

export const ZODIAC_SIGNS: ZodiacSign[] = [
  {
    id: 'aries',
    name: 'Aries',
    symbol: '♈',
    element: 'Fire',
    elementIcon: '🔥',
    dates: 'Mar 21 - Apr 19',
    color: '#E03E3E',
    accentBg: 'bg-red-50 text-red-600',
  },
  {
    id: 'taurus',
    name: 'Taurus',
    symbol: '♉',
    element: 'Earth',
    elementIcon: '🌿',
    dates: 'Apr 20 - May 20',
    color: '#2B8A3E',
    accentBg: 'bg-emerald-50 text-emerald-700',
  },
  {
    id: 'gemini',
    name: 'Gemini',
    symbol: '♊',
    element: 'Air',
    elementIcon: '💨',
    dates: 'May 21 - Jun 20',
    color: '#1C7ED6',
    accentBg: 'bg-sky-50 text-sky-600',
  },
  {
    id: 'cancer',
    name: 'Cancer',
    symbol: '♋',
    element: 'Water',
    elementIcon: '💧',
    dates: 'Jun 21 - Jul 22',
    color: '#4C6EF5',
    accentBg: 'bg-blue-50 text-blue-600',
  },
  {
    id: 'leo',
    name: 'Leo',
    symbol: '♌',
    element: 'Fire',
    elementIcon: '🔥',
    dates: 'Jul 23 - Aug 22',
    color: '#DE721D',
    accentBg: 'bg-amber-50 text-amber-600',
  },
  {
    id: 'virgo',
    name: 'Virgo',
    symbol: '♍',
    element: 'Earth',
    elementIcon: '🌿',
    dates: 'Aug 23 - Sep 22',
    color: '#2F9E44',
    accentBg: 'bg-emerald-50 text-emerald-700',
  },
  {
    id: 'libra',
    name: 'Libra',
    symbol: '♎',
    element: 'Air',
    elementIcon: '💨',
    dates: 'Sep 23 - Oct 22',
    color: '#7048E8',
    accentBg: 'bg-purple-50 text-purple-600',
  },
  {
    id: 'scorpio',
    name: 'Scorpio',
    symbol: '♏',
    element: 'Water',
    elementIcon: '💧',
    dates: 'Oct 23 - Nov 21',
    color: '#9C36B5',
    accentBg: 'bg-fuchsia-50 text-fuchsia-700',
  },
  {
    id: 'sagittarius',
    name: 'Sagittarius',
    symbol: '♐',
    element: 'Fire',
    elementIcon: '🔥',
    dates: 'Nov 22 - Dec 21',
    color: '#C0326A',
    accentBg: 'bg-rose-50 text-rose-600',
  },
  {
    id: 'capricorn',
    name: 'Capricorn',
    symbol: 'Earth',
    element: 'Earth',
    elementIcon: '🌿',
    dates: 'Dec 22 - Jan 19',
    color: '#343A40',
    accentBg: 'bg-stone-100 text-stone-700',
  },
  {
    id: 'aquarius',
    name: 'Aquarius',
    symbol: '♒',
    element: 'Air',
    elementIcon: '💨',
    dates: 'Jan 20 - Feb 18',
    color: '#1098AD',
    accentBg: 'bg-cyan-50 text-cyan-700',
  },
  {
    id: 'pisces',
    name: 'Pisces',
    symbol: '♓',
    element: 'Water',
    elementIcon: '💧',
    dates: 'Feb 19 - Mar 20',
    color: '#3B5BDB',
    accentBg: 'bg-indigo-50 text-indigo-600',
  },
];

interface CompatibilityReport {
  resonance: number;
  chemistry: number;
  communication: number;
  emotionalDepth: number;
  elementLabel: string;
  relationshipStyle: string;
  coreStrength: string;
  harmonizingGuidance: string;
}

export function computeCompatibility(sign1: ZodiacSign, sign2: ZodiacSign): CompatibilityReport {
  // If exact Leo + Sagittarius pair as in reference screenshot
  if (
    (sign1.id === 'leo' && sign2.id === 'sagittarius') ||
    (sign1.id === 'sagittarius' && sign2.id === 'leo')
  ) {
    return {
      resonance: 94,
      chemistry: 95,
      communication: 91,
      emotionalDepth: 90,
      elementLabel: 'Fire + Fire',
      relationshipStyle: 'Natural Elemental Harmony & Shared Passion',
      coreStrength:
        'Sharing the same Fire element creates instinctive mutual understanding, effortless pacing, and natural emotional warmth.',
      harmonizingGuidance:
        'Honor personal boundaries while maintaining honest communication. Align on long-term values to cultivate enduring intimacy and devotion.',
    };
  }

  // Exact match (same sign)
  if (sign1.id === sign2.id) {
    return {
      resonance: 92,
      chemistry: 91,
      communication: 94,
      emotionalDepth: 89,
      elementLabel: `${sign1.element} + ${sign2.element}`,
      relationshipStyle: 'Mirror Soul Connection & Profound Kinship',
      coreStrength: `Sharing the exact ${sign1.name} frequency allows you to finish each other's sentences and intuitively reflect each other's deepest motivations.`,
      harmonizingGuidance: `Maintain healthy individuality and outside interests so the mirror effect continues to spark mutual fascination and growth.`,
    };
  }

  const e1 = sign1.element;
  const e2 = sign2.element;

  // Same Element
  if (e1 === e2) {
    return {
      resonance: 93,
      chemistry: 94,
      communication: 90,
      emotionalDepth: 88,
      elementLabel: `${e1} + ${e2}`,
      relationshipStyle: 'Natural Elemental Harmony & Intuitive Sync',
      coreStrength: `Both belonging to the ${e1} realm guarantees immediate comfort, synchronized rhythm, and shared instincts regarding life's big decisions.`,
      harmonizingGuidance: `Anchor shared passions into steady daily routines. Keep open communication about vulnerability to strengthen lasting trust.`,
    };
  }

  // Complementary Pairs (Fire + Air or Earth + Water)
  if ((e1 === 'Fire' && e2 === 'Air') || (e1 === 'Air' && e2 === 'Fire')) {
    return {
      resonance: 91,
      chemistry: 93,
      communication: 95,
      emotionalDepth: 85,
      elementLabel: 'Fire + Air',
      relationshipStyle: 'Dynamic Spark & Electric Inspiration',
      coreStrength:
        'Air feeds Fire with creative vision, while Fire empowers Air with passion and purposeful action. You constantly inspire each other to rise higher.',
      harmonizingGuidance:
        'Ground intellectual sparks with gentle emotional check-ins. Take peaceful pauses to nurture deep emotional presence between adventures.',
    };
  }

  if ((e1 === 'Earth' && e2 === 'Water') || (e1 === 'Water' && e2 === 'Earth')) {
    return {
      resonance: 96,
      chemistry: 92,
      communication: 89,
      emotionalDepth: 97,
      elementLabel: 'Earth + Water',
      relationshipStyle: 'Soulful Sanctuary & Enduring Devotion',
      coreStrength:
        'Earth offers an unshakable container for Water’s emotional tides, while Water enriches and softens Earth’s pragmatic foundation with deep love.',
      harmonizingGuidance:
        'Express unspoken feelings clearly without assuming the other already knows. Celebrate spontaneous joys alongside dependable stability.',
    };
  }

  // Moderately Complementary (Fire + Water)
  if ((e1 === 'Fire' && e2 === 'Water') || (e1 === 'Water' && e2 === 'Fire')) {
    return {
      resonance: 84,
      chemistry: 88,
      communication: 80,
      emotionalDepth: 87,
      elementLabel: 'Fire + Water',
      relationshipStyle: 'Magnetic Steam & Transformational Passion',
      coreStrength:
        'An intensely seductive attraction where fiery courage meets deep emotional vulnerability, sparking powerful personal growth for both partners.',
      harmonizingGuidance:
        'Practice patient listening during disagreements. Ensure intense emotions are channeled into affectionate reassurance rather than dramatic reactions.',
    };
  }

  // Moderately Complementary (Earth + Air)
  if ((e1 === 'Earth' && e2 === 'Air') || (e1 === 'Air' && e2 === 'Earth')) {
    return {
      resonance: 81,
      chemistry: 80,
      communication: 87,
      emotionalDepth: 78,
      elementLabel: 'Earth + Air',
      relationshipStyle: 'Pragmatic Innovation & Harmonious Balance',
      coreStrength:
        'A brilliant alliance where intellectual theory and grounded execution unite. You help one another transform ambitious ideas into tangible reality.',
      harmonizingGuidance:
        'Balance rational conversations with affectionate romance. Celebrate each other’s differing paces without trying to change natural instincts.',
    };
  }

  // Fire + Earth
  if ((e1 === 'Fire' && e2 === 'Earth') || (e1 === 'Earth' && e2 === 'Fire')) {
    return {
      resonance: 82,
      chemistry: 85,
      communication: 81,
      emotionalDepth: 80,
      elementLabel: 'Fire + Earth',
      relationshipStyle: 'Constructive Drive & Ambitious Foundation',
      coreStrength:
        'Fiery enthusiasm sparks new ventures while Earth builds the lasting structures to make dreams endure across decades.',
      harmonizingGuidance:
        'Respect the balance between spontaneity and careful planning. Give praise frequently and foster shared cozy moments.',
    };
  }

  // Air + Water
  return {
    resonance: 83,
    chemistry: 82,
    communication: 85,
    emotionalDepth: 86,
    elementLabel: 'Air + Water',
    relationshipStyle: 'Poetic Fascination & Mystical Curiosity',
    coreStrength:
      'Air’s articulate intellect helps express Water’s rich subconscious world, producing a beautifully empathetic and artistic romantic connection.',
    harmonizingGuidance:
      'Water benefits from verbal validation, while Air thrives when emotions are expressed with clarity. Cultivate gentle vulnerability.',
  };
}

// Custom Astrological Icon Graphics matching the aesthetic in image_ff974ad1.png
function ZodiacCustomGlyph({ signId }: { signId: string }) {
  if (signId === 'leo') {
    // Sun radiating glyph like in the screenshot
    return (
      <svg className="w-9 h-9 text-[#DE721D]" viewBox="0 0 48 48" fill="none" stroke="currentColor">
        <circle cx="24" cy="24" r="8" strokeWidth="2.5" fill="#FFF7ED" />
        <circle cx="24" cy="24" r="3.5" fill="#DE721D" strokeWidth="0" />
        {/* Radiating Petals/Rays */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const x1 = 24 + 11 * Math.cos(rad);
          const y1 = 24 + 11 * Math.sin(rad);
          const x2 = 24 + 17 * Math.cos(rad);
          const y2 = 24 + 17 * Math.sin(rad);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          );
        })}
      </svg>
    );
  }

  if (signId === 'sagittarius') {
    // Centaur archer bow/arrow glyph like in the screenshot
    return (
      <svg className="w-9 h-9 text-[#C0326A]" viewBox="0 0 48 48" fill="none" stroke="currentColor">
        <path
          d="M14 34L34 14M34 14H22M34 14V26"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 24C16 18 24 16 32 16"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="1 2"
          opacity="0.5"
        />
        <path
          d="M20 28L28 36"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (signId === 'aries') {
    return (
      <svg className="w-9 h-9 text-[#E03E3E]" viewBox="0 0 48 48" fill="none" stroke="currentColor">
        <path
          d="M24 38V18M24 18C20 12 12 12 12 18C12 24 18 26 22 23M24 18C28 12 36 12 36 18C36 24 30 26 26 23"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (signId === 'taurus') {
    return (
      <svg className="w-9 h-9 text-[#2B8A3E]" viewBox="0 0 48 48" fill="none" stroke="currentColor">
        <circle cx="24" cy="27" r="9" strokeWidth="2.8" />
        <path
          d="M14 13C16 19 21 21 24 21C27 21 32 19 34 13"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (signId === 'gemini') {
    return (
      <svg className="w-9 h-9 text-[#1C7ED6]" viewBox="0 0 48 48" fill="none" stroke="currentColor">
        <path d="M14 13C24 16 34 13 34 13M14 35C24 32 34 35 34 35" strokeWidth="2.8" strokeLinecap="round" />
        <line x1="20" y1="14" x2="20" y2="34" strokeWidth="2.8" strokeLinecap="round" />
        <line x1="28" y1="14" x2="28" y2="34" strokeWidth="2.8" strokeLinecap="round" />
      </svg>
    );
  }

  if (signId === 'cancer') {
    return (
      <svg className="w-9 h-9 text-[#4C6EF5]" viewBox="0 0 48 48" fill="none" stroke="currentColor">
        <circle cx="18" cy="20" r="5" strokeWidth="2.5" />
        <path d="M23 20C28 20 34 15 32 10" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="30" cy="28" r="5" strokeWidth="2.5" />
        <path d="M25 28C20 28 14 33 16 38" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (signId === 'virgo') {
    return (
      <svg className="w-9 h-9 text-[#2F9E44]" viewBox="0 0 48 48" fill="none" stroke="currentColor">
        <path
          d="M14 14V30M20 14V30M26 14V30C26 23 33 23 33 30V34C33 38 29 40 27 38"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (signId === 'libra') {
    return (
      <svg className="w-9 h-9 text-[#7048E8]" viewBox="0 0 48 48" fill="none" stroke="currentColor">
        <path d="M12 34H36M12 28H19M29 28H36" strokeWidth="2.8" strokeLinecap="round" />
        <path d="M19 28C19 23 29 23 29 28" strokeWidth="2.8" strokeLinecap="round" />
      </svg>
    );
  }

  if (signId === 'scorpio') {
    return (
      <svg className="w-9 h-9 text-[#9C36B5]" viewBox="0 0 48 48" fill="none" stroke="currentColor">
        <path
          d="M13 14V28M19 14V28M25 14V28C25 22 31 22 31 28V32L35 30M35 30L34 35M35 30L30 31"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (signId === 'capricorn') {
    return (
      <svg className="w-9 h-9 text-[#495057]" viewBox="0 0 48 48" fill="none" stroke="currentColor">
        <path
          d="M13 15V27M19 15V32C19 35 23 35 24 32C25 29 28 27 31 29C34 31 34 35 31 37C28 39 25 37 25 33"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (signId === 'aquarius') {
    return (
      <svg className="w-9 h-9 text-[#1098AD]" viewBox="0 0 48 48" fill="none" stroke="currentColor">
        <path
          d="M12 20L17 16L22 20L27 16L32 20L36 16M12 28L17 24L22 28L27 24L32 28L36 24"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  // Pisces
  return (
    <svg className="w-9 h-9 text-[#3B5BDB]" viewBox="0 0 48 48" fill="none" stroke="currentColor">
      <path d="M16 12C20 20 20 28 16 36M32 12C28 20 28 28 32 36M12 24H36" strokeWidth="2.8" strokeLinecap="round" />
    </svg>
  );
}

interface ZodiacCompatibilityCalculatorProps {
  onChatWithLovePsychics?: () => void;
  className?: string;
  isStandalonePage?: boolean;
}

export const ZodiacCompatibilityCalculator: React.FC<ZodiacCompatibilityCalculatorProps> = ({
  onChatWithLovePsychics,
  className = '',
  isStandalonePage = false,
}) => {
  const yourSignSelectId = useId();
  const partnerSignSelectId = useId();

  // Default to Leo and Sagittarius as in the user's reference image!
  const [sign1Id, setSign1Id] = useState<string>('leo');
  const [sign2Id, setSign2Id] = useState<string>('sagittarius');

  const sign1 = ZODIAC_SIGNS.find(s => s.id === sign1Id) || ZODIAC_SIGNS[4]; // Leo
  const sign2 = ZODIAC_SIGNS.find(s => s.id === sign2Id) || ZODIAC_SIGNS[8]; // Sagittarius

  const report = computeCompatibility(sign1, sign2);

  return (
    <div className={`w-full text-center ${className}`}>
      {/* 1. Header Pill matching image_ff974ad1.png */}
      <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#FCECEE] border border-[#F6D0D8] text-[#8C2C47] text-xs font-bold tracking-wider uppercase mb-3 shadow-2xs">
        <span className="text-sm">💖</span>
        <span>ZODIAC SYNERGY &amp; SOULMATE CALCULATOR</span>
        <span className="text-sm">✨</span>
      </div>

      {/* 2. Main Title */}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#2A153B] tracking-tight mb-2.5">
        Love &amp; Zodiac Compatibility
      </h2>

      {/* 3. Subtitle */}
      <p className="text-xs sm:text-sm text-[#736B63] max-w-2xl mx-auto font-medium mb-8 sm:mb-10 px-4">
        Explore elemental chemistry, celestial resonance and romantic alignment between zodiac signs
      </p>

      {/* 4. Calculator Card Container */}
      <div className="max-w-4xl mx-auto bg-[#FAF8F5] rounded-3xl border border-[#E9DFD3] p-5 sm:p-8 lg:p-9 shadow-sm text-left">
        {/* ROW 1: Two Sign Selectors with Heart connector in between */}
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 mb-5">
          {/* LEFT: YOUR SIGN CARD */}
          <div className="w-full md:w-1/2 bg-white rounded-2xl border border-[#E8DECF] p-4 flex items-center gap-3.5 shadow-2xs hover:border-[#D9C8B5] transition-colors">
            {/* Left Glyph Box */}
            <div className="w-14 h-14 rounded-2xl bg-[#FFFBF5] border border-[#F2E5D5] flex items-center justify-center shrink-0 shadow-2xs">
              <ZodiacCustomGlyph signId={sign1.id} />
            </div>

            {/* Right Information & Dropdown */}
            <div className="flex-1 min-w-0">
              <label
                htmlFor={yourSignSelectId}
                className="text-[10px] sm:text-[11px] font-bold text-[#8A7A70] uppercase tracking-wider block mb-0.5"
              >
                YOUR SIGN
              </label>

              {/* Styled Select Dropdown */}
              <div className="relative">
                <select
                  id={yourSignSelectId}
                  value={sign1Id}
                  onChange={e => setSign1Id(e.target.value)}
                  className="w-full appearance-none bg-transparent font-serif font-bold text-base sm:text-lg text-[#2A153B] pr-7 py-0.5 focus:outline-none cursor-pointer"
                >
                  {ZODIAC_SIGNS.map(s => (
                    <option key={s.id} value={s.id} className="text-gray-900 font-sans text-sm">
                      {s.name} ({s.element})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-500 absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Element & Dates */}
              <div className="text-[11px] text-[#8A7A70] font-medium flex items-center gap-1 mt-0.5">
                <span>{sign1.elementIcon}</span>
                <span>
                  {sign1.element} Element · {sign1.dates}
                </span>
              </div>
            </div>
          </div>

          {/* CENTER: Floating Heart Connector Badge */}
          <div className="shrink-0 z-10 my-[-8px] md:my-0">
            <div className="w-11 h-11 rounded-full bg-white border border-[#F4A4B4] shadow-sm flex items-center justify-center text-[#E11D48] hover:scale-110 transition-transform">
              <Heart className="w-5 h-5 fill-[#F87171] text-[#E11D48]" />
            </div>
          </div>

          {/* RIGHT: PARTNER / COMPANION CARD */}
          <div className="w-full md:w-1/2 bg-white rounded-2xl border border-[#E8DECF] p-4 flex items-center gap-3.5 shadow-2xs hover:border-[#D9C8B5] transition-colors">
            {/* Right Glyph Box */}
            <div className="w-14 h-14 rounded-2xl bg-[#FFFBF5] border border-[#F2E5D5] flex items-center justify-center shrink-0 shadow-2xs">
              <ZodiacCustomGlyph signId={sign2.id} />
            </div>

            {/* Right Information & Dropdown */}
            <div className="flex-1 min-w-0">
              <label
                htmlFor={partnerSignSelectId}
                className="text-[10px] sm:text-[11px] font-bold text-[#8A7A70] uppercase tracking-wider block mb-0.5"
              >
                PARTNER / COMPANION
              </label>

              {/* Styled Select Dropdown */}
              <div className="relative">
                <select
                  id={partnerSignSelectId}
                  value={sign2Id}
                  onChange={e => setSign2Id(e.target.value)}
                  className="w-full appearance-none bg-transparent font-serif font-bold text-base sm:text-lg text-[#2A153B] pr-7 py-0.5 focus:outline-none cursor-pointer"
                >
                  {ZODIAC_SIGNS.map(s => (
                    <option key={s.id} value={s.id} className="text-gray-900 font-sans text-sm">
                      {s.name} ({s.element})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-500 absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Element & Dates */}
              <div className="text-[11px] text-[#8A7A70] font-medium flex items-center gap-1 mt-0.5">
                <span>{sign2.elementIcon}</span>
                <span>
                  {sign2.element} Element · {sign2.dates}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ROW 2: Resonance Title Card with Big Percentage on Right */}
        <div className="bg-white rounded-2xl border border-[#E8DECF] p-5 sm:p-6 mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#2A153B]">
                {sign1.name} &amp; {sign2.name}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-[#C0326A] border border-rose-200/90 text-[11px] font-bold tracking-tight">
                {report.elementLabel}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#736B63] font-medium">
              <span className="text-[#8A7A70]">Relationship Style:</span>{' '}
              <span className="text-[#3F3631] font-semibold">{report.relationshipStyle}</span>
            </p>
          </div>

          {/* Large Resonance Badge */}
          <div className="shrink-0 bg-[#FAF8F5] sm:bg-transparent rounded-2xl border border-[#E8DECF] px-6 py-3 flex items-center gap-2 self-stretch sm:self-auto justify-center">
            <span className="font-serif font-bold text-3xl sm:text-4xl text-[#C06214] tabular-nums">
              {report.resonance}%
            </span>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#A66724]">
              RESONANCE
            </span>
          </div>
        </div>

        {/* ROW 3: 3 Metric Progress Bars matching screenshot */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mb-4">
          {/* 1. Romantic Chemistry */}
          <div className="bg-white rounded-2xl border border-[#E8DECF] p-4 shadow-2xs">
            <div className="flex items-center justify-between text-xs font-semibold mb-2">
              <span className="text-[#554C46]">Romantic Chemistry</span>
              <span className="text-[#E11D48] font-bold">{report.chemistry}%</span>
            </div>
            <div className="w-full bg-[#EFEAE2] h-2.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-pink-500 to-rose-600 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${report.chemistry}%` }}
              />
            </div>
          </div>

          {/* 2. Communication Flow */}
          <div className="bg-white rounded-2xl border border-[#E8DECF] p-4 shadow-2xs">
            <div className="flex items-center justify-between text-xs font-semibold mb-2">
              <span className="text-[#554C46]">Communication Flow</span>
              <span className="text-[#0284C7] font-bold">{report.communication}%</span>
            </div>
            <div className="w-full bg-[#EFEAE2] h-2.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sky-400 to-blue-600 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${report.communication}%` }}
              />
            </div>
          </div>

          {/* 3. Emotional Depth */}
          <div className="bg-white rounded-2xl border border-[#E8DECF] p-4 shadow-2xs">
            <div className="flex items-center justify-between text-xs font-semibold mb-2">
              <span className="text-[#554C46]">Emotional Depth</span>
              <span className="text-[#D97706] font-bold">{report.emotionalDepth}%</span>
            </div>
            <div className="w-full bg-[#EFEAE2] h-2.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${report.emotionalDepth}%` }}
              />
            </div>
          </div>
        </div>

        {/* ROW 4: 2 Detailed Astrological Insight Cards side-by-side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-7">
          {/* Card 1: Core Astrological Strength */}
          <div className="bg-white rounded-2xl border border-[#E8DECF] p-5 shadow-2xs space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#832729]">
              <span>💖</span>
              <span>Core Astrological Strength</span>
            </div>
            <p className="text-xs text-[#554C46] leading-relaxed font-normal">
              {report.coreStrength}
            </p>
          </div>

          {/* Card 2: Harmonizing Guidance */}
          <div className="bg-white rounded-2xl border border-[#E8DECF] p-5 shadow-2xs space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#A66724]">
              <span>✨</span>
              <span>Harmonizing Guidance</span>
            </div>
            <p className="text-xs text-[#554C46] leading-relaxed font-normal">
              {report.harmonizingGuidance}
            </p>
          </div>
        </div>

        {/* ROW 5: Large Golden Pill CTA Button matching screenshot */}
        <div className="text-center">
          <button
            onClick={onChatWithLovePsychics}
            type="button"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#F7CA50] via-[#F5BD38] to-[#EEAC24] hover:from-[#FAD56C] hover:to-[#E59F17] text-[#1B0C27] font-bold text-sm tracking-wide shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 fill-[#1B0C27] text-[#1B0C27]" />
            <span className="uppercase tracking-wider">CHAT WITH LOVE PSYCHICS</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-xs text-[#736B63] font-medium mt-3">
            Get custom twin-flame &amp; relationship timeline readings from top verified psychics
          </p>
        </div>
      </div>
    </div>
  );
};
