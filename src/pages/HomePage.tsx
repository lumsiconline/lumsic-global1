import React, { useState, useEffect } from 'react';
import { Reader } from '../types';
import { api } from '../lib/api';
import { ZodiacCompatibilityCalculator } from '../components/ZodiacCompatibilityCalculator';
import {
  Sparkles,
  ShieldCheck,
  Clock,
  Star,
  ArrowRight,
  MessageSquare,
  Globe2,
  Lock,
  ChevronDown,
  ChevronUp,
  Award,
  Download,
  Eye,
  Heart,
  Compass,
  Sun,
  Moon,
  Briefcase,
  DollarSign,
  Users,
  CreditCard,
  CheckCircle,
  HeartPulse,
  Zap,
} from 'lucide-react';

const DEFAULT_PSYCHICS: Reader[] = [
  {
    id: 'rdr-001',
    astrologerId: 'LUM001',
    userId: 'usr-nikee',
    name: 'Psychic Nikee',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80',
    title: 'Clairvoyant Empath & Relationship Medium',
    specializations: ['Psychic Reading', 'Love & Relationships', 'Tarot Reading'],
    languages: ['English', 'Spanish'],
    experienceYears: 5,
    rating: 5.0,
    reviewsCount: 1420,
    pricePerMinute: 2.50,
    inrPrice: 36,
    currency: 'USD',
    bio: 'Renowned international empath specializing in soulmate alignment, emotional clarity, and intuitive destiny breakthroughs.',
    isOnline: true,
    isBusy: true,
    waitTimeMinutes: 13,
    badge: 'Top Choice',
    workflowEnabled: true,
    totalConsultations: 2840,
    earningsTotal: 17400.00,
  },
  {
    id: 'rdr-002',
    astrologerId: 'LUM002',
    userId: 'usr-veronica',
    name: 'Veronica',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80',
    title: 'Celebrity Spiritual Advisor & Executive Strategist',
    specializations: ['Career & Wealth', 'Life Direction', 'Tarot Reading'],
    languages: ['English', 'French'],
    experienceYears: 6,
    rating: 5.0,
    reviewsCount: 1890,
    pricePerMinute: 3.20,
    inrPrice: 48,
    currency: 'USD',
    bio: 'Trusted intuitive guide for executives, creators, and public figures navigating pivotal high-stakes career and romantic turning points.',
    isOnline: true,
    isBusy: true,
    waitTimeMinutes: 8,
    badge: 'Celebrity',
    workflowEnabled: true,
    totalConsultations: 3100,
    earningsTotal: 24600.00,
  },
  {
    id: 'rdr-003',
    astrologerId: 'LUM003',
    userId: 'usr-olivia',
    name: 'Psychic Olivia',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    title: 'Empathic Clairaudient & Aura Healer',
    specializations: ['Love & Relationships', 'Psychic Reading', 'Aura Assessment'],
    languages: ['English'],
    experienceYears: 3,
    rating: 5.0,
    reviewsCount: 920,
    pricePerMinute: 2.00,
    inrPrice: 30,
    currency: 'USD',
    bio: 'Gentle yet piercing clairaudient perceptions uncovering unsaid partner emotions and immediate romantic clarity.',
    isOnline: true,
    isBusy: true,
    waitTimeMinutes: 22,
    badge: 'Top Choice',
    workflowEnabled: true,
    totalConsultations: 1650,
    earningsTotal: 9800.00,
  },
  {
    id: 'rdr-004',
    astrologerId: 'LUM004',
    userId: 'usr-hayley',
    name: 'Psychic Hayley',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&auto=format&fit=crop&q=80',
    title: 'Master Clairvoyant & Karmic Cycle Guide',
    specializations: ['Life Direction', 'Psychic Reading', 'Family & Ancestral'],
    languages: ['English'],
    experienceYears: 18,
    rating: 5.0,
    reviewsCount: 3410,
    pricePerMinute: 2.00,
    inrPrice: 30,
    currency: 'USD',
    bio: '18 years of international practice guiding seekers across 40 countries through family reconciliations and karmic transitions.',
    isOnline: true,
    isBusy: true,
    waitTimeMinutes: 9,
    workflowEnabled: true,
    totalConsultations: 5200,
    earningsTotal: 31200.00,
  },
  {
    id: 'rdr-005',
    astrologerId: 'LUM005',
    userId: 'usr-allison',
    name: 'Mystic Allison',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=500&auto=format&fit=crop&q=80',
    title: 'Crystal Resonance & Archetypal Channeler',
    specializations: ['Tarot Reading', 'Psychic Reading', 'Spiritual Awakening'],
    languages: ['English'],
    experienceYears: 4,
    rating: 5.0,
    reviewsCount: 780,
    pricePerMinute: 2.40,
    inrPrice: 35,
    currency: 'USD',
    bio: 'Harmonizing sacred crystal frequencies and Tarot symbolism for fast, accurate answers to urgent emotional questions.',
    isOnline: true,
    isBusy: true,
    waitTimeMinutes: 8,
    workflowEnabled: true,
    totalConsultations: 1390,
    earningsTotal: 8400.00,
  },
  {
    id: 'rdr-006',
    astrologerId: 'LUM006',
    userId: 'usr-stella',
    name: 'Psychic Stella',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=500&auto=format&fit=crop&q=80',
    title: 'Modern Intuitive & Direct Tarot Consultant',
    specializations: ['Love & Relationships', 'Career & Wealth', 'Tarot Reading'],
    languages: ['English', 'Italian'],
    experienceYears: 8,
    rating: 5.0,
    reviewsCount: 1650,
    pricePerMinute: 2.70,
    inrPrice: 40,
    currency: 'USD',
    bio: 'Direct, honest, grounded insights with zero sugar-coating. Instant availability for pressing dilemmas.',
    isOnline: true,
    isBusy: false,
    workflowEnabled: true,
    totalConsultations: 2400,
    earningsTotal: 16200.00,
  },
  {
    id: 'rdr-007',
    astrologerId: 'LUM007',
    userId: 'usr-camila',
    name: 'Psychic Camila',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80',
    title: 'Twin Flame Intuitive & Empathic Reader',
    specializations: ['Love & Relationships', 'Psychic Reading'],
    languages: ['English', 'Spanish', 'Portuguese'],
    experienceYears: 5,
    rating: 5.0,
    reviewsCount: 1120,
    pricePerMinute: 2.00,
    inrPrice: 30,
    currency: 'USD',
    bio: 'Compassionate clarity for soul connections, separation healing, and romantic destiny reconciliation.',
    isOnline: true,
    isBusy: false,
    workflowEnabled: true,
    totalConsultations: 1980,
    earningsTotal: 11800.00,
  },
  {
    id: 'rdr-008',
    astrologerId: 'LUM008',
    userId: 'usr-scarlett',
    name: 'Psychic Scarlett',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=80',
    title: 'Clairsentient Life & Destiny Guide',
    specializations: ['Life Direction', 'Career & Wealth', 'Tarot Reading'],
    languages: ['English'],
    experienceYears: 5,
    rating: 5.0,
    reviewsCount: 1290,
    pricePerMinute: 2.20,
    inrPrice: 32,
    currency: 'USD',
    bio: 'Empowering seekers with predictive psychic timing, emotional clarity, and actionable life compass navigation.',
    isOnline: true,
    isBusy: false,
    workflowEnabled: true,
    totalConsultations: 2150,
    earningsTotal: 14200.00,
  },
  {
    id: 'rdr-009',
    astrologerId: 'LUM009',
    userId: 'usr-gloria',
    name: 'Psychic Gloria',
    avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=500&auto=format&fit=crop&q=80',
    title: 'Senior Intuitive Medium & Energy Reader',
    specializations: ['Psychic Reading', 'Family & Ancestral', 'Life Direction'],
    languages: ['English', 'German'],
    experienceYears: 7,
    rating: 5.0,
    reviewsCount: 1870,
    pricePerMinute: 3.80,
    inrPrice: 57,
    currency: 'USD',
    bio: 'Senior European medium bridging unseen dimensions to bring profound closure, peace, and spiritual direction.',
    isOnline: true,
    isBusy: false,
    badge: 'Top Choice',
    workflowEnabled: true,
    totalConsultations: 2790,
    earningsTotal: 25400.00,
  },
  {
    id: 'rdr-010',
    astrologerId: 'LUM010',
    userId: 'usr-freya',
    name: 'Psychic Freya',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=500&auto=format&fit=crop&q=80',
    title: 'Nordic Rune Master & Clairvoyant Seer',
    specializations: ['Tarot Reading', 'Psychic Reading', 'Love & Relationships'],
    languages: ['English', 'Swedish', 'Norwegian'],
    experienceYears: 9,
    rating: 5.0,
    reviewsCount: 1530,
    pricePerMinute: 2.80,
    inrPrice: 41,
    currency: 'USD',
    bio: 'Channeling ancient Nordic symbols and psychic sight for decisive clarity on relationships, destiny, and personal growth.',
    isOnline: true,
    isBusy: true,
    waitTimeMinutes: 4,
    workflowEnabled: true,
    totalConsultations: 2280,
    earningsTotal: 15900.00,
  },
];

interface HomePageProps {
  onSelectReader: (reader: Reader) => void;
  onExplore: () => void;
  onOpenConsultationModal: (reader: Reader) => void;
  setCurrentView: (view: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onSelectReader,
  onExplore,
  onOpenConsultationModal,
  setCurrentView,
}) => {
  const [featuredReaders, setFeaturedReaders] = useState<Reader[]>(DEFAULT_PSYCHICS);
  const [allReaders, setAllReaders] = useState<Reader[]>(DEFAULT_PSYCHICS);
  const [selectedConcern, setSelectedConcern] = useState<string>('Love');
  const [selectedCardIndex, setSelectedCardIndex] = useState<number>(2); // Center card active
  const [onlineCount, setOnlineCount] = useState<number>(438);

  useEffect(() => {
    api.readers.list().then(list => {
      if (list && list.length > 0) {
        setAllReaders(list);
        setFeaturedReaders(list.slice(0, 10));
      }
    });
  }, []);

  // Rotate online user count between 300 and 600 every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const nextCount = Math.floor(Math.random() * (600 - 300 + 1)) + 300;
      setOnlineCount(nextCount);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const tarotCards = [
    {
      id: 'love',
      symbol: 'heart',
      title: 'Love & Soulmate',
      subtitle: 'Unveil romantic alignment and synastry paths',
      icon: Heart,
    },
    {
      id: 'destiny',
      symbol: 'sun',
      title: 'Karmic Destiny',
      subtitle: 'Planetary periods and spiritual awakening',
      icon: Sun,
    },
    {
      id: 'career',
      symbol: 'eye',
      title: 'Career Guidance',
      subtitle: 'Discover your true professional calling and financial timing',
      icon: Eye,
    },
    {
      id: 'clarity',
      symbol: 'moon',
      title: 'Clairvoyant Vision',
      subtitle: 'Deep intuitive clarity through hidden crossroads',
      icon: Moon,
    },
    {
      id: 'horary',
      symbol: 'compass',
      title: 'Prashna Astrology',
      subtitle: 'Instant answers to your most urgent questions',
      icon: Compass,
    },
  ];

  const concerns = [
    {
      id: 'Love',
      title: 'Love',
      question: 'Will I find true love?',
      icon: Heart,
      iconBg: 'bg-rose-50 text-rose-500 border border-rose-100',
      category: 'Love & Relationships',
      specialties: ['Love & Relationships', 'Tarot Reading', 'Psychic Reading'],
    },
    {
      id: 'Marriage',
      title: 'Marriage',
      question: 'When will I get married?',
      icon: Sparkles,
      iconBg: 'bg-purple-50 text-purple-600 border border-purple-100',
      category: 'Love & Relationships',
      specialties: ['Vedic Astrology', 'Kundali Milan', 'Love & Relationships'],
    },
    {
      id: 'Career',
      title: 'Career',
      question: 'What career suits me best?',
      icon: Briefcase,
      iconBg: 'bg-blue-50 text-blue-600 border border-blue-100',
      category: 'Career & Wealth',
      specialties: ['Career & Wealth', 'Life Direction', 'Vedic Astrology'],
    },
    {
      id: 'Finance',
      title: 'Finance',
      question: 'Will I be financially free?',
      icon: DollarSign,
      iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
      category: 'Career & Wealth',
      specialties: ['Financial Astrology', 'Career & Wealth', 'Horary Questions'],
    },
    {
      id: 'Health',
      title: 'Health',
      question: 'Stay healthy this year?',
      icon: HeartPulse,
      iconBg: 'bg-amber-50 text-amber-600 border border-amber-100',
      category: 'Psychic Reading',
      specialties: ['Psychic Reading', 'Aura Assessment', 'Medical Astrologer'],
    },
    {
      id: 'Family',
      title: 'Family',
      question: 'Will family conflicts end?',
      icon: Users,
      iconBg: 'bg-indigo-50 text-indigo-600 border border-indigo-100',
      category: 'Vedic Astrology',
      specialties: ['Vedic Astrology', 'Life Direction', 'Prashna Kundali'],
    },
  ];

  const activeConcern = concerns.find(c => c.id === selectedConcern) || concerns[0];
  const matchedReaders = (allReaders.length > 0 ? allReaders : featuredReaders).filter(reader => {
    return (
      reader.specializations.some(spec =>
        activeConcern.specialties.some(cs => cs.toLowerCase().includes(spec.toLowerCase()) || spec.toLowerCase().includes(cs.toLowerCase()))
      ) ||
      reader.title.toLowerCase().includes(activeConcern.id.toLowerCase()) ||
      reader.bio.toLowerCase().includes(activeConcern.id.toLowerCase())
    );
  });
  const displayMatchedReaders = matchedReaders.length > 0 ? matchedReaders.slice(0, 3) : (allReaders.length > 0 ? allReaders.slice(0, 3) : featuredReaders);

  return (
    <div className="pb-20 bg-[#160822] text-[#FAF7F2]">
      {/* HERO SECTION MATCHING REFERENCE DESIGN */}
      <section className="relative overflow-hidden pt-10 pb-8 lg:pt-14 lg:pb-12 bg-gradient-to-b from-[#1D0D2E] via-[#241038] to-[#160822]">
        {/* Mystic ambient background glow */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-[#F7CA50]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Headline, Copy, Action Buttons & Live Stats */}
            <div className="lg:col-span-7 space-y-7 text-left">
              {/* Main Headline with Tagline */}
              <div className="space-y-2">
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif text-white tracking-tight leading-[1.12]">
                  Where Hearts Seek Answers, <br />
                  <span className="italic font-normal text-[#F7CA50]">and Love Finds Its Way.</span>
                </h1>
                <p className="text-sm sm:text-base font-serif italic text-[#F7CA50] font-normal pt-1">
                  Find Clarity in Love, Life &amp; Relationships.
                </p>
              </div>

              {/* Subhead text */}
              <p className="text-sm sm:text-base text-purple-200/90 leading-relaxed max-w-xl">
                Connect with gifted psychics, tarot readers, and spiritual advisors worldwide. Get the guidance you seek, wherever you are.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                {/* Yellow/Gold Primary Pill Button */}
                <button
                  onClick={onExplore}
                  className="px-7 py-3.5 bg-[#F7CA50] hover:bg-[#F5BF38] text-[#1B0C27] font-bold text-sm rounded-full shadow-[0_0_25px_rgba(247,202,80,0.35)] transition-all hover:scale-105 flex items-center gap-2 group cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-[#1B0C27] fill-[#1B0C27]" />
                  <span>Start Free Chat</span>
                </button>

                {/* Translucent Outlined Pill Button */}
                <button
                  onClick={() => setCurrentView('how-it-works')}
                  className="px-6 py-3.5 bg-white/10 hover:bg-white/15 text-white border border-white/20 text-sm font-semibold rounded-full flex items-center gap-2 transition-all cursor-pointer backdrop-blur-xs"
                >
                  <Sparkles className="w-4 h-4 text-[#F7CA50]" />
                  <span>How It Works</span>
                </button>
              </div>

              {/* Live KPI / Trust Status Row with rotating online count */}
              <div className="pt-8 border-t border-purple-900/50 flex flex-wrap items-center gap-6 sm:gap-10 text-left">
                {/* 1. Online indicator with rotating number between 300 and 600 */}
                <div className="flex items-center gap-3">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                  </span>
                  <div>
                    <div className="font-bold text-white text-sm tabular-nums transition-all duration-500">
                      {onlineCount} online now
                    </div>
                    <div className="text-[11px] text-purple-300/70">Avg wait &lt; 30s</div>
                  </div>
                </div>

                <div className="hidden sm:block w-px h-8 bg-purple-800/60" />

                {/* 2. Rating & Reviews */}
                <div>
                  <div className="flex items-center gap-1.5 text-sm font-bold text-white">
                    <div className="flex gap-0.5 text-[#F7CA50]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#F7CA50]" />
                      ))}
                    </div>
                    <span className="tabular-nums">4.9</span>
                  </div>
                  <div className="text-[11px] text-purple-300/70">5,000+ verified reviews</div>
                </div>
              </div>
            </div>

            {/* Right Column: Luminous Tarot Card Fan & Mystic Orb */}
            <div className="lg:col-span-5 relative flex items-center justify-center min-h-[460px] select-none">
              {/* Mystic Center Glowing Sphere */}
              <div className="absolute z-0 w-64 h-64 rounded-full bg-gradient-to-tr from-purple-950 via-[#4A176B] to-[#7E29B3] opacity-80 blur-lg shadow-[0_0_80px_rgba(168,85,247,0.4)] flex items-center justify-center">
                <div className="w-40 h-40 rounded-full border border-purple-400/30 animate-pulse" />
              </div>

              {/* Psychic Eye Sphere Core */}
              <div className="absolute z-10 w-28 h-28 rounded-full bg-[#200A33] border-2 border-[#F7CA50]/70 shadow-[0_0_30px_rgba(247,202,80,0.5)] flex items-center justify-center text-[#F7CA50]">
                <Eye className="w-12 h-12 text-[#F7CA50] drop-shadow-[0_0_10px_#F7CA50]" />
              </div>

              {/* Fanned Tarot Cards Container */}
              <div className="relative z-20 w-full h-[440px] flex items-center justify-center">
                {/* Card 0: Far Left */}
                <div
                  onClick={() => setSelectedCardIndex(0)}
                  className={`absolute w-44 h-68 rounded-2xl p-4 bg-[#230F37] border transition-all duration-300 cursor-pointer transform -translate-x-36 -rotate-12 hover:-translate-y-2 ${
                    selectedCardIndex === 0
                      ? 'z-30 scale-105 border-[#F7CA50] shadow-[0_0_35px_rgba(247,202,80,0.6)] ring-2 ring-[#F7CA50]'
                      : 'z-10 border-[#F7CA50]/40 opacity-75'
                  }`}
                >
                  <div className="h-full border border-[#F7CA50]/30 rounded-xl p-3 flex flex-col justify-between items-center text-center">
                    <Moon className="w-5 h-5 text-[#F7CA50] mt-1" />
                    <div className="space-y-1">
                      <div className="text-[11px] font-serif font-bold text-[#F7CA50]">Love & Soulmate</div>
                      <p className="text-[9px] text-purple-200/70 line-clamp-3">
                        Synastry and karmic heart connection
                      </p>
                    </div>
                    <div className="text-[8px] text-[#F7CA50] font-mono tracking-widest">········</div>
                  </div>
                </div>

                {/* Card 1: Mid Left */}
                <div
                  onClick={() => setSelectedCardIndex(1)}
                  className={`absolute w-44 h-72 rounded-2xl p-4 bg-[#26113C] border transition-all duration-300 cursor-pointer transform -translate-x-20 -rotate-6 hover:-translate-y-2 ${
                    selectedCardIndex === 1
                      ? 'z-30 scale-105 border-[#F7CA50] shadow-[0_0_35px_rgba(247,202,80,0.6)] ring-2 ring-[#F7CA50]'
                      : 'z-15 border-[#F7CA50]/50 opacity-85'
                  }`}
                >
                  <div className="h-full border border-[#F7CA50]/30 rounded-xl p-3 flex flex-col justify-between items-center text-center">
                    <Sun className="w-5 h-5 text-[#F7CA50] mt-1" />
                    <div className="space-y-1">
                      <div className="text-[11px] font-serif font-bold text-[#F7CA50]">Karmic Destiny</div>
                      <p className="text-[9px] text-purple-200/70 line-clamp-3">
                        Planetary periods & solar transits
                      </p>
                    </div>
                    <div className="text-[8px] text-[#F7CA50] font-mono tracking-widest">········</div>
                  </div>
                </div>

                {/* Card 2: Center (Spotlighted) */}
                <div
                  onClick={() => setSelectedCardIndex(2)}
                  className={`absolute w-48 h-80 rounded-2xl p-4 bg-[#2A1343] border transition-all duration-300 cursor-pointer transform hover:-translate-y-2 ${
                    selectedCardIndex === 2
                      ? 'z-40 scale-105 border-[#F7CA50] shadow-[0_0_40px_rgba(247,202,80,0.7)] ring-2 ring-[#F7CA50]'
                      : 'z-20 border-[#F7CA50]/60 opacity-90'
                  }`}
                >
                  <div className="h-full border border-[#F7CA50]/40 rounded-xl p-3.5 flex flex-col justify-between items-center text-center">
                    <div className="w-8 h-8 rounded-full bg-purple-900/60 border border-[#F7CA50]/60 flex items-center justify-center">
                      <Eye className="w-4 h-4 text-[#F7CA50]" />
                    </div>

                    <div className="space-y-1.5 my-auto">
                      <h4 className="font-serif font-bold text-sm text-[#F7CA50] tracking-wide">
                        Career Guidance
                      </h4>
                      <p className="text-[10px] text-purple-100/90 leading-relaxed">
                        Discover your true professional calling and astrological planetary timing.
                      </p>
                    </div>

                    <div className="w-full pt-2 border-t border-[#F7CA50]/20 flex items-center justify-between text-[9px] text-[#F7CA50]">
                      <span className="font-mono">LUMSIC</span>
                      <span className="font-mono">VII</span>
                    </div>
                  </div>
                </div>

                {/* Card 3: Mid Right */}
                <div
                  onClick={() => setSelectedCardIndex(3)}
                  className={`absolute w-44 h-72 rounded-2xl p-4 bg-[#26113C] border transition-all duration-300 cursor-pointer transform translate-x-20 rotate-6 hover:-translate-y-2 ${
                    selectedCardIndex === 3
                      ? 'z-30 scale-105 border-[#F7CA50] shadow-[0_0_35px_rgba(247,202,80,0.6)] ring-2 ring-[#F7CA50]'
                      : 'z-15 border-[#F7CA50]/50 opacity-85'
                  }`}
                >
                  <div className="h-full border border-[#F7CA50]/30 rounded-xl p-3 flex flex-col justify-between items-center text-center">
                    <Heart className="w-5 h-5 text-[#F7CA50] mt-1" />
                    <div className="space-y-1">
                      <div className="text-[11px] font-serif font-bold text-[#F7CA50]">Twin Flame Bond</div>
                      <p className="text-[9px] text-purple-200/70 line-clamp-3">
                        Deep psychic compatibility spread
                      </p>
                    </div>
                    <div className="text-[8px] text-[#F7CA50] font-mono tracking-widest">········</div>
                  </div>
                </div>

                {/* Card 4: Far Right */}
                <div
                  onClick={() => setSelectedCardIndex(4)}
                  className={`absolute w-44 h-68 rounded-2xl p-4 bg-[#230F37] border transition-all duration-300 cursor-pointer transform translate-x-36 rotate-12 hover:-translate-y-2 ${
                    selectedCardIndex === 4
                      ? 'z-30 scale-105 border-[#F7CA50] shadow-[0_0_35px_rgba(247,202,80,0.6)] ring-2 ring-[#F7CA50]'
                      : 'z-10 border-[#F7CA50]/40 opacity-75'
                  }`}
                >
                  <div className="h-full border border-[#F7CA50]/30 rounded-xl p-3 flex flex-col justify-between items-center text-center">
                    <Compass className="w-5 h-5 text-[#F7CA50] mt-1" />
                    <div className="space-y-1">
                      <div className="text-[11px] font-serif font-bold text-[#F7CA50]">Prashna Oracle</div>
                      <p className="text-[9px] text-purple-200/70 line-clamp-3">
                        Instant answer for time of query
                      </p>
                    </div>
                    <div className="text-[8px] text-[#F7CA50] font-mono tracking-widest">········</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECOND SECTION: TRUST STRIP & COMPACT CONCERN MATCHING (image_5d6654a9.png) */}
      <section className="bg-[#FAF7F2] text-[#29252D] py-10 sm:py-12 px-4 sm:px-6 lg:px-8 border-b border-stone-200">
        <div className="max-w-6xl mx-auto space-y-9">
          {/* Trust Guarantees Strip */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-stone-200/90">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 divide-y md:divide-y-0 md:divide-x divide-stone-100">
              {/* Item 1: Verified Psychics */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 border border-purple-100 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-xs sm:text-sm font-bold text-gray-900 leading-tight">Verified Psychics</div>
                  <div className="text-[11px] text-gray-500 font-medium">5-step screening</div>
                </div>
              </div>

              {/* Item 2: Private & Secure */}
              <div className="flex items-center gap-3 pt-3 md:pt-0 md:pl-6">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 border border-purple-100 flex items-center justify-center shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-xs sm:text-sm font-bold text-gray-900 leading-tight">Private &amp; Secure</div>
                  <div className="text-[11px] text-gray-500 font-medium">End-to-end encrypted</div>
                </div>
              </div>

              {/* Item 3: Secure Payments */}
              <div className="flex items-center gap-3 pt-3 md:pt-0 md:pl-6">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 border border-purple-100 flex items-center justify-center shrink-0">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-xs sm:text-sm font-bold text-gray-900 leading-tight">Secure Payments</div>
                  <div className="text-[11px] text-gray-500 font-medium">PCI-DSS certified</div>
                </div>
              </div>

              {/* Item 4: 100% Refund */}
              <div className="flex items-center gap-3 pt-3 md:pt-0 md:pl-6">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 border border-purple-100 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-xs sm:text-sm font-bold text-gray-900 leading-tight">100% Refund</div>
                  <div className="text-[11px] text-gray-500 font-medium">On unsatisfactory chats</div>
                </div>
              </div>
            </div>
          </div>

          {/* Section Heading: Begin Your Reading */}
          <div className="text-center space-y-2 pt-1">
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#733596] block">
              BEGIN YOUR READING
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2A153B] tracking-tight">
              What&apos;s troubling you today?
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto font-normal">
              Pick a concern — we&apos;ll match you with the right psychic in under 30 seconds.
            </p>
          </div>

          {/* 6 Compact Concern Cards (Zero big numbers, compact size) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-3.5">
            {concerns.map(item => {
              const IconComp = item.icon;
              const isSelected = selectedConcern === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedConcern(item.id)}
                  type="button"
                  className={`group rounded-2xl p-4 flex flex-col items-center text-center transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-white border-2 border-purple-600 shadow-md ring-2 ring-purple-100 -translate-y-1'
                      : 'bg-white border border-stone-200/90 hover:border-purple-300 shadow-xs hover:shadow-sm hover:-translate-y-0.5'
                  }`}
                >
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center mb-2.5 transition-transform group-hover:scale-105 ${item.iconBg}`}
                  >
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm group-hover:text-purple-700 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-gray-500 font-medium leading-snug mt-1 line-clamp-2">
                    {item.question}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Instant Matcher Action & Matched Psychics Drawer */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/90 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3.5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs sm:text-sm font-semibold text-gray-900">
                  Matched with verified <span className="text-purple-700 font-bold">{activeConcern.title}</span> specialists
                </span>
                <span className="text-[11px] bg-purple-50 text-purple-700 font-semibold px-2 py-0.5 rounded-full border border-purple-100">
                  Avg wait &lt; 30s
                </span>
              </div>

              <button
                onClick={() => {
                  const topOnline = displayMatchedReaders.find(r => r.isOnline && !r.isBusy) || displayMatchedReaders[0];
                  if (topOnline) onOpenConsultationModal(topOnline);
                }}
                className="px-4 py-2 bg-[#F7CA50] hover:bg-[#F5BF38] text-[#1B0C27] text-xs font-bold rounded-full transition-all shadow-sm flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Instant Match &amp; Chat</span>
              </button>
            </div>

            {/* Compact Reader Rows/Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3.5">
              {displayMatchedReaders.map(reader => (
                <div
                  key={reader.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-purple-200 bg-stone-50/60 hover:bg-white transition-all group"
                >
                  <div
                    onClick={() => onSelectReader(reader)}
                    className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0"
                  >
                    <div className="relative shrink-0">
                      <img
                        src={reader.avatar}
                        alt={reader.name}
                        className="w-10 h-10 rounded-full object-cover border border-purple-100"
                      />
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${
                          reader.isOnline && !reader.isBusy ? 'bg-emerald-500' : 'bg-amber-400'
                        }`}
                      />
                    </div>
                    <div className="min-w-0 pr-2 text-left">
                      <div className="text-xs font-bold text-gray-900 truncate group-hover:text-purple-700 transition-colors">
                        {reader.name}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-gray-500">
                        <Star className="w-3 h-3 fill-[#F7CA50] text-[#F7CA50]" />
                        <span className="font-semibold text-gray-700">{reader.rating.toFixed(2)}</span>
                        <span>·</span>
                        <span className="text-purple-800 font-bold">${reader.pricePerMinute.toFixed(2)}/m</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenConsultationModal(reader)}
                    disabled={!reader.workflowEnabled || !reader.isOnline || reader.isBusy}
                    className="px-3 py-1.5 bg-[#2A153B] hover:bg-[#3E1F57] text-[#FAF7F2] text-[11px] font-bold rounded-lg transition-colors shadow-xs disabled:opacity-40 disabled:cursor-not-allowed shrink-0 flex items-center gap-1 cursor-pointer"
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>Chat</span>
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-3.5 pt-3 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs">
              <span className="text-gray-500 text-[11px] sm:text-xs">
                Need more specific guidance in {activeConcern.title}?
              </span>
              <button
                onClick={onExplore}
                className="text-purple-700 hover:text-purple-900 font-bold flex items-center gap-1 cursor-pointer transition-colors text-[11px] sm:text-xs"
              >
                <span>Browse All {activeConcern.title} Readers on LUMSIC</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3RD SECTION: CHAT WITH PSYCHIC (image_feae37c2.png) */}
      <section className="bg-[#FAF7F2] py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-stone-200">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#2A153B] tracking-tight">
              Chat with Psychic
            </h2>

            {/* Emblem Decorative Divider matching image_feae37c2.png */}
            <div className="relative flex items-center justify-center my-6 max-w-xl mx-auto">
              <div className="w-full border-t border-purple-200/80" />
              <div className="absolute px-3 bg-[#FAF7F2]">
                <div className="w-8 h-8 rounded-full bg-[#200A33] border border-[#F7CA50]/70 flex items-center justify-center text-[#F7CA50] shadow-sm">
                  <Eye className="w-4 h-4 text-[#F7CA50]" />
                </div>
              </div>
            </div>
          </div>

          {/* 10 Advisor Cards Grid (2 rows of 5 on desktop) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4.5 pt-2">
            {featuredReaders.slice(0, 10).map(reader => (
              <div
                key={reader.id}
                className="bg-white rounded-3xl p-3 sm:p-3.5 border border-stone-200/90 hover:border-purple-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between text-center relative group"
              >
                <div>
                  {/* Photo with subtle top-rounded frame and soft gradient background */}
                  <div
                    onClick={() => onSelectReader(reader)}
                    className="relative mb-2.5 rounded-2xl overflow-hidden bg-gradient-to-b from-stone-200 via-stone-300 to-stone-400 aspect-[4/5] flex items-end justify-center cursor-pointer"
                  >
                    <img
                      src={reader.avatar}
                      alt={reader.name}
                      className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Rating badge (Star + 5 in dark purple pill) */}
                    <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#2B163E]/90 text-white text-[11px] font-bold shadow-xs backdrop-blur-xs">
                      <Star className="w-3 h-3 fill-[#F7CA50] text-[#F7CA50]" />
                      <span>5</span>
                    </div>

                    {/* Top Choice / Celebrity Sub-Badge */}
                    {reader.badge && (
                      <div className="absolute top-7 left-2 px-1.5 py-0.5 rounded-sm bg-[#FDF5E6] text-[#8C6D28] text-[9px] font-bold border border-[#E8D19F] shadow-xs">
                        {reader.badge}
                      </div>
                    )}
                  </div>

                  {/* Info below photo */}
                  <div className="space-y-0.5 text-center px-1">
                    <h3
                      onClick={() => onSelectReader(reader)}
                      className="font-bold text-gray-900 text-sm sm:text-base tracking-tight truncate cursor-pointer hover:text-purple-700 transition-colors"
                    >
                      {reader.name}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium">
                      Exp- {reader.experienceYears} Y
                    </p>
                  </div>
                </div>

                <div className="mt-2 w-full">
                  {/* Chat Action Button */}
                  {reader.waitTimeMinutes ? (
                    /* Red-wine outlined pill with wait time */
                    <button
                      onClick={() => onOpenConsultationModal(reader)}
                      type="button"
                      className="w-full border border-[#B3261E] text-[#B3261E] hover:bg-rose-50 rounded-xl py-1 px-2 transition-colors flex flex-col items-center justify-center cursor-pointer shadow-2xs"
                    >
                      <span className="text-xs font-semibold leading-tight">Chat</span>
                      <span className="text-[10px] text-gray-500 font-normal leading-tight">
                        wait ~ {reader.waitTimeMinutes} min
                      </span>
                    </button>
                  ) : (
                    /* Green outlined pill for available now */
                    <button
                      onClick={() => onOpenConsultationModal(reader)}
                      type="button"
                      className="w-full border border-emerald-600 text-emerald-700 hover:bg-emerald-50 rounded-xl py-2 px-2 transition-colors flex items-center justify-center cursor-pointer shadow-2xs text-xs font-semibold"
                    >
                      Chat
                    </button>
                  )}

                  {/* Price at bottom */}
                  <div className="mt-1.5 text-center text-xs font-semibold text-gray-800">
                    ₹ {reader.inrPrice || Math.round(reader.pricePerMinute * 15)}/min
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View All Button */}
          <div className="mt-10 sm:mt-12 text-center">
            <button
              onClick={onExplore}
              className="px-8 py-3 bg-[#2A153B] hover:bg-[#3E1F57] text-[#FAF7F2] text-xs sm:text-sm font-bold rounded-full transition-all shadow-sm hover:shadow-md inline-flex items-center gap-2 cursor-pointer"
            >
              <span>View All Psychics &amp; Readers</span>
              <ArrowRight className="w-4 h-4 text-[#F7CA50]" />
            </button>
          </div>
        </div>
      </section>

      {/* 4TH SECTION: LOVE & ZODIAC COMPATIBILITY CALCULATOR (image_ff974ad1.png) */}
      <section id="love-calculator" className="bg-[#FAF7F2] py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-stone-200">
        <ZodiacCompatibilityCalculator
          onChatWithLovePsychics={onExplore}
        />
      </section>

      {/* 5TH SECTION: COMPACT VERIFIED REVIEWS ON CREAM BACKGROUND */}
      <section className="bg-[#FAF7F2] py-10 sm:py-14 px-4 sm:px-6 lg:px-8 border-b border-stone-200">
        <div className="max-w-6xl mx-auto space-y-7">
          {/* Compact Header */}
          <div className="text-center space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#733596] block">
              VERIFIED SEEKER EXPERIENCES
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2A153B] tracking-tight">
              Loved by Seekers Worldwide
            </h2>
            <div className="flex items-center justify-center gap-2 text-xs text-stone-600 font-medium">
              <div className="flex gap-0.5 text-[#F7CA50]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#F7CA50]" />
                ))}
              </div>
              <span className="font-bold text-gray-900">4.9 / 5.0</span>
              <span className="text-stone-400">·</span>
              <span>Based on 5,000+ verified consultations</span>
            </div>
          </div>

          {/* 3 Compact Review Cards in Cream/White Style */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4 text-left">
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/90 shadow-2xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex gap-0.5 text-[#F7CA50]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#F7CA50]" />
                    ))}
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    Verified Seeker
                  </span>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed italic">
                  &ldquo;The clarity on my relationship crossroads was unbelievable. No generic answers—direct, compassionate guidance that gave me immediate peace.&rdquo;
                </p>
              </div>
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-[#2A153B]">Elena Rostova</div>
                  <div className="text-[11px] text-gray-500">London, UK</div>
                </div>
                <span className="text-[10px] font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                  Love &amp; Tarot
                </span>
              </div>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/90 shadow-2xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex gap-0.5 text-[#F7CA50]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#F7CA50]" />
                    ))}
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    Verified Seeker
                  </span>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed italic">
                  &ldquo;Veronica pinpointed the exact month my executive career transition would solidify. The per-second transparent billing made it stress-free.&rdquo;
                </p>
              </div>
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-[#2A153B]">Marcus Vance</div>
                  <div className="text-[11px] text-gray-500">New York, USA</div>
                </div>
                <span className="text-[10px] font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                  Career Advisory
                </span>
              </div>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/90 shadow-2xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex gap-0.5 text-[#F7CA50]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#F7CA50]" />
                    ))}
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    Verified Seeker
                  </span>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed italic">
                  &ldquo;I felt truly heard and understood. Within 10 minutes I had actionable clarity for my family situation. Easily the most authentic platform online.&rdquo;
                </p>
              </div>
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-[#2A153B]">Chloe Laurent</div>
                  <div className="text-[11px] text-gray-500">Paris, France</div>
                </div>
                <span className="text-[10px] font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                  Life Path Session
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
