import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// In-Memory & File-backed Persistence
interface DatabaseState {
  users: any[];
  readers: any[];
  consultations: any[];
  messages: any[];
  wallets: Record<string, any>;
  transactions: any[];
  notifications: any[];
  reviews: any[];
  activityLogs: any[];
  settings: any;
  applications: any[];
  payouts: any[];
  categories: any[];
  tickets: any[];
  broadcasts: any[];
  coupons: any[];
  websiteContent: any;
  staff: any[];
}

const DB_PATH = path.join(__dirname, '.lumsic_data.json');

const INITIAL_READERS = [
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

const INITIAL_USERS = [
  {
    id: 'usr-admin',
    email: 'admin@lumsic.com',
    passwordHash: 'Admin123!',
    fullName: 'LUMSIC Operations Admin',
    phone: '+1 800 555 0199',
    country: 'US',
    currency: 'USD',
    timezone: 'UTC',
    role: 'admin',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'usr-customer',
    email: 'sarah.jenkins@example.com',
    passwordHash: 'Customer123!',
    fullName: 'Sarah Jenkins',
    phone: '+1 415 555 0142',
    country: 'US',
    currency: 'USD',
    timezone: 'America/Los_Angeles',
    role: 'customer',
    createdAt: '2026-02-15T10:00:00.000Z',
  },
  {
    id: 'usr-nikee',
    email: 'nikee@lumsic.com',
    passwordHash: 'Astro123!',
    fullName: 'Psychic Nikee',
    phone: '+1 310 555 0182',
    country: 'US',
    currency: 'USD',
    timezone: 'America/New_York',
    role: 'astrologer',
    astrologerId: 'LUM001',
    createdAt: '2026-01-10T00:00:00.000Z',
  },
  {
    id: 'usr-veronica',
    email: 'veronica@lumsic.com',
    passwordHash: 'Astro123!',
    fullName: 'Veronica',
    phone: '+33 6 12 34 56 78',
    country: 'FR',
    currency: 'USD',
    timezone: 'Europe/Paris',
    role: 'astrologer',
    astrologerId: 'LUM002',
    createdAt: '2026-01-12T00:00:00.000Z',
  },
];

const INITIAL_WALLETS = {
  'usr-customer': {
    userId: 'usr-customer',
    balance: 75.00,
    currency: 'USD',
    updatedAt: new Date().toISOString(),
  },
  'usr-nikee': {
    userId: 'usr-nikee',
    balance: 840.00,
    currency: 'USD',
    updatedAt: new Date().toISOString(),
  },
  'usr-veronica': {
    userId: 'usr-veronica',
    balance: 1250.00,
    currency: 'USD',
    updatedAt: new Date().toISOString(),
  },
};

const INITIAL_TRANSACTIONS = [
  {
    id: 'tx-001',
    userId: 'usr-customer',
    type: 'deposit',
    amount: 100.00,
    balanceAfter: 100.00,
    currency: 'USD',
    description: 'Added funds via Card (Stripe Verified)',
    status: 'completed',
    paymentProvider: 'stripe',
    timestamp: '2026-10-25T14:22:00.000Z',
  },
  {
    id: 'tx-002',
    userId: 'usr-customer',
    type: 'consultation_deduction',
    amount: 25.00,
    balanceAfter: 75.00,
    currency: 'USD',
    description: '10 min consultation with Psychic Nikee (LUM001)',
    referenceSessionId: 'cs-prev-001',
    status: 'completed',
    timestamp: '2026-10-26T18:30:00.000Z',
  },
];

const INITIAL_CONSULTATIONS = [
  {
    id: 'cs-prev-001',
    sessionNumber: 'LUM-CS-7812',
    customerId: 'usr-customer',
    customerName: 'Sarah Jenkins',
    customerEmail: 'sarah.jenkins@example.com',
    astrologerId: 'LUM001',
    readerId: 'rdr-001',
    readerName: 'Psychic Nikee',
    readerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80',
    status: 'completed',
    requestedAt: '2026-10-26T18:18:00.000Z',
    startedAt: '2026-10-26T18:20:00.000Z',
    endedAt: '2026-10-26T18:30:00.000Z',
    durationSeconds: 600,
    pricePerMinute: 2.50,
    totalCost: 25.00,
    initialTopic: 'Love connection and future soulmate alignment',
    rating: 5,
    reviewComment: 'Incredible clarity! Nikee tuned in instantly to my situation and provided exact peace of mind.',
  },
];

const INITIAL_MESSAGES = [
  {
    id: 'msg-001',
    sessionId: 'cs-prev-001',
    senderId: 'usr-customer',
    senderRole: 'customer',
    senderName: 'Sarah Jenkins',
    content: 'Hello Nikee, I am seeking guidance on a love connection and whether our paths are aligning.',
    timestamp: '2026-10-26T18:20:15.000Z',
    status: 'read',
  },
  {
    id: 'msg-002',
    sessionId: 'cs-prev-001',
    senderId: 'usr-nikee',
    senderRole: 'astrologer',
    senderName: 'Psychic Nikee',
    content: 'Welcome Sarah. I connect with your energy now. I see deep affection but also unexpressed fears between you two. The cards show clear resolution soon.',
    timestamp: '2026-10-26T18:21:40.000Z',
    status: 'read',
  },
];

const INITIAL_APPLICATIONS = [
  {
    id: 'app-001',
    fullName: 'Maya Lindqvist',
    email: 'maya.lindqvist@example.se',
    phone: '+46 70 123 4567',
    country: 'Sweden',
    city: 'Gothenburg',
    experienceYears: 8,
    primarySkills: ['Tarot Reading', 'Clairvoyance', 'Rune Reading'],
    languages: ['English', 'Swedish'],
    bio: '8 years practicing intuitive psychic reading across Scandinavia, specializing in relationship guidance and energy reading.',
    sampleIntroUrl: 'https://example.com/maya_sample.mp4',
    status: 'pending',
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
  },
  {
    id: 'app-002',
    fullName: 'Christian Davies',
    email: 'christian.davies@example.co.uk',
    phone: '+44 7911 123456',
    country: 'United Kingdom',
    city: 'London',
    experienceYears: 11,
    primarySkills: ['Love & Relationships', 'Mediumship', 'Tarot Reading'],
    languages: ['English'],
    bio: 'Certified third-generation psychic reader with extensive client practice across Europe and North America.',
    sampleIntroUrl: 'https://example.com/christian_sample.mp4',
    status: 'pending',
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
  {
    id: 'app-003',
    fullName: 'Clara Moreau',
    email: 'clara.moreau@example.fr',
    phone: '+33 6 55 44 33 22',
    country: 'France',
    city: 'Lyon',
    experienceYears: 6,
    primarySkills: ['Aura Healing', 'Psychic Reading', 'Life Direction'],
    languages: ['English', 'French'],
    bio: 'Intuitive empath focused on emotional realignment, trauma release, and romantic compatibility readings.',
    sampleIntroUrl: 'https://example.com/clara_sample.mp4',
    status: 'approved',
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    reviewedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    reviewedBy: 'usr-admin',
  },
];

const INITIAL_PAYOUTS = [
  {
    id: 'pay-001',
    readerId: 'rdr-001',
    readerName: 'Psychic Nikee',
    astrologerId: 'LUM001',
    amount: 450.00,
    currency: 'USD',
    paymentMethod: 'bank_wire',
    payoutDetails: 'Chase Bank (Acct ending 4912, Swift CHASUS33)',
    status: 'pending',
    requestedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 'pay-002',
    readerId: 'rdr-002',
    readerName: 'Veronica',
    astrologerId: 'LUM002',
    amount: 680.00,
    currency: 'USD',
    paymentMethod: 'stripe',
    payoutDetails: 'Stripe Express Account: acct_1N9xZqVer2',
    status: 'approved',
    requestedAt: new Date(Date.now() - 3600000 * 96).toISOString(),
    processedAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    processedBy: 'usr-admin',
    transactionRef: 'po_stripe_8239104',
  },
  {
    id: 'pay-003',
    readerId: 'rdr-003',
    readerName: 'Psychic Olivia',
    astrologerId: 'LUM003',
    amount: 280.00,
    currency: 'USD',
    paymentMethod: 'paypal',
    payoutDetails: 'paypal.me/oliviapsychic',
    status: 'pending',
    requestedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
];

const INITIAL_CATEGORIES = [
  {
    id: 'cat-001',
    name: 'Love & Relationships',
    slug: 'love-relationships',
    icon: 'Heart',
    description: 'Find answers on soulmates, marriage timing, breakups, and romantic reconciliation.',
    displayOrder: 1,
    isActive: true,
    readersCount: 8,
  },
  {
    id: 'cat-002',
    name: 'Tarot Reading',
    slug: 'tarot-reading',
    icon: 'Layers',
    description: 'Deep arcana card spreads revealing hidden currents and upcoming destiny shifts.',
    displayOrder: 2,
    isActive: true,
    readersCount: 9,
  },
  {
    id: 'cat-003',
    name: 'Clairvoyant Psychic',
    slug: 'clairvoyant-psychic',
    icon: 'Eye',
    description: 'Direct spiritual sight revealing truths, future events, and unexpressed thoughts.',
    displayOrder: 3,
    isActive: true,
    readersCount: 7,
  },
  {
    id: 'cat-004',
    name: 'Career & Wealth',
    slug: 'career-wealth',
    icon: 'Briefcase',
    description: 'Navigate professional crossroads, business investments, and financial freedom.',
    displayOrder: 4,
    isActive: true,
    readersCount: 6,
  },
  {
    id: 'cat-005',
    name: 'Life Direction & Destiny',
    slug: 'life-destiny',
    icon: 'Compass',
    description: 'Uncover your soul purpose, karmic lessons, and clarity for major life decisions.',
    displayOrder: 5,
    isActive: true,
    readersCount: 7,
  },
  {
    id: 'cat-006',
    name: 'Energy & Aura Assessment',
    slug: 'energy-aura',
    icon: 'Sun',
    description: 'Chakra alignment, emotional clearing, and personal aura resonance readings.',
    displayOrder: 6,
    isActive: true,
    readersCount: 4,
  },
  {
    id: 'cat-007',
    name: 'Nordic Runes & Divination',
    slug: 'nordic-runes',
    icon: 'Shield',
    description: 'Ancient elder futhark symbols channeled for decisive answers and protection.',
    displayOrder: 7,
    isActive: true,
    readersCount: 3,
  },
];

const INITIAL_TICKETS = [
  {
    id: 'tick-001',
    ticketNumber: 'TICK-101',
    userId: 'usr-customer',
    userName: 'Sarah Jenkins',
    userRole: 'customer',
    userEmail: 'sarah.jenkins@example.com',
    subject: 'Receipt request for session LUM-CS-7812',
    category: 'Billing',
    priority: 'medium',
    status: 'in_progress',
    sessionReferenceId: 'cs-prev-001',
    description: 'Could you please send an itemized invoice receipt with tax identification for my latest 10-minute session?',
    adminNotes: 'Requested receipt PDF. Provided sandbox invoice #LUM-INV-7812.',
    createdAt: new Date(Date.now() - 3600000 * 26).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    responses: [
      {
        id: 'resp-001',
        senderId: 'usr-admin',
        senderName: 'LUMSIC Billing Support',
        senderRole: 'admin',
        message: 'Hello Sarah, your official consultation receipt has been generated and sent to your email address.',
        timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
      },
    ],
  },
  {
    id: 'tick-002',
    ticketNumber: 'TICK-102',
    userId: 'usr-nikee',
    userName: 'Psychic Nikee',
    userRole: 'astrologer',
    userEmail: 'nikee@lumsic.com',
    subject: 'Microphone clarity test on live calls',
    category: 'Technical',
    priority: 'low',
    status: 'resolved',
    description: 'Testing noise cancellation on studio mic during consultation calls. All green from our end.',
    adminNotes: 'Audio bitrate verified at 128kbps Opus. Ticket closed.',
    createdAt: new Date(Date.now() - 3600000 * 80).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 40).toISOString(),
    responses: [],
  },
];

const INITIAL_COUPONS = [
  {
    id: 'cpn-001',
    code: 'LUMSICLOVE',
    discountType: 'percentage',
    discountValue: 15,
    minSpend: 20,
    maxUses: 1000,
    usedCount: 412,
    isActive: true,
    expiresAt: '2027-12-31T23:59:59.000Z',
  },
  {
    id: 'cpn-002',
    code: 'WELCOME10',
    discountType: 'percentage',
    discountValue: 10,
    minSpend: 10,
    maxUses: 5000,
    usedCount: 890,
    isActive: true,
    expiresAt: '2027-12-31T23:59:59.000Z',
  },
  {
    id: 'cpn-003',
    code: 'DESTINY25',
    discountType: 'fixed',
    discountValue: 25,
    minSpend: 100,
    maxUses: 200,
    usedCount: 64,
    isActive: true,
    expiresAt: '2027-12-31T23:59:59.000Z',
  },
];

const INITIAL_WEBSITE_CONTENT = {
  heroTagline: 'Where Hearts Seek Answers, and Love Finds Its Way.',
  heroHeadline: 'Find clarity in love, career & life.',
  heroSubtitle: 'Talk to verified psychics, tarot readers, numerologists & astrologers 24/7 — by chat, call or video. Trusted by over 2 million seekers worldwide.',
  announcementActive: true,
  announcementText: '✨ Global Spiritual Celebration: Get 15% bonus wallet credits on recharges with code LUMSICLOVE',
  announcementLink: '#wallet',
  faqs: [
    {
      id: 'faq-1',
      question: 'How do LUMSIC psychic consultations work?',
      answer: 'Choose from our verified global psychics, click Start Chat, and connect instantly in private end-to-end encrypted rooms. Sessions are billed per minute from your prepaid wallet balance with zero surprise charges.',
      category: 'General',
    },
    {
      id: 'faq-2',
      question: 'Are the psychics and readers verified?',
      answer: 'Yes. Every reader undergoes a rigorous 5-step screening process evaluating psychic accuracy, communication ethics, identity verification, and professional background check.',
      category: 'Psychics',
    },
    {
      id: 'faq-3',
      question: 'What is the 100% Satisfaction Guarantee?',
      answer: 'If you are unsatisfied with the clarity or quality of your first reading, contact admin support within 24 hours for a full wallet credit or refund.',
      category: 'Billing',
    },
    {
      id: 'faq-4',
      question: 'How does the wallet recharge and billing system operate?',
      answer: 'You can deposit funds securely using credit/debit cards or PayPal. Consultation funds are deducted per minute only while active. If you end early, remaining funds stay safely in your wallet.',
      category: 'Billing',
    },
  ],
  termsPolicy: 'Welcome to LUMSIC. By using our platform, you agree to these Terms of Service. All consultations are intended for spiritual guidance and entertainment. LUMSIC does not provide legal, medical, or financial advice.',
  privacyPolicy: 'Your privacy is paramount. LUMSIC utilizes 256-bit SSL encryption. We never sell your personal contact information, reading transcripts, or payment details to any third parties.',
  refundPolicy: 'We offer a 100% satisfaction guarantee on all initial consultations. If your experience fails to meet standard expectations, submit a support ticket within 24 hours for full review and refund.',
};

const INITIAL_STAFF = [
  {
    id: 'stf-001',
    fullName: 'Elena Rostova',
    email: 'elena.rostova@lumsic.com',
    role: 'super_admin',
    status: 'active',
    lastActive: new Date().toISOString(),
    createdAt: '2026-01-01T00:00:00.000Z',
    permissions: ['all'],
  },
  {
    id: 'stf-002',
    fullName: 'Marcus Vance',
    email: 'marcus.vance@lumsic.com',
    role: 'manager',
    status: 'active',
    lastActive: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    createdAt: '2026-01-10T00:00:00.000Z',
    permissions: ['reader_management', 'chat_supervision', 'workflow_control', 'reviews_moderation'],
  },
  {
    id: 'stf-003',
    fullName: 'Julian Sterling',
    email: 'julian.sterling@lumsic.com',
    role: 'finance',
    status: 'active',
    lastActive: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    createdAt: '2026-01-15T00:00:00.000Z',
    permissions: ['payouts_approval', 'refunds', 'wallet_adjustments', 'financial_reports'],
  },
  {
    id: 'stf-004',
    fullName: 'Beatrice Thorne',
    email: 'beatrice.thorne@lumsic.com',
    role: 'support',
    status: 'active',
    lastActive: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    createdAt: '2026-02-01T00:00:00.000Z',
    permissions: ['tickets_reply', 'customer_support', 'session_view'],
  },
];

const INITIAL_BROADCASTS = [
  {
    id: 'bc-001',
    title: 'Platform System Upgrade Complete',
    message: 'Global low-latency chat routing and updated reader dashboard tools are now active worldwide.',
    target: 'all',
    sentBy: 'Elena Rostova (Super Admin)',
    recipientsCount: 4200,
    sentAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
];

function loadDatabase(): DatabaseState {
  try {
    if (fs.existsSync(DB_PATH)) {
      const data = fs.readFileSync(DB_PATH, 'utf-8');
      const parsed = JSON.parse(data);
      // Ensure all 19 collections are present and migrated
      if (!parsed.applications || !Array.isArray(parsed.applications)) parsed.applications = INITIAL_APPLICATIONS;
      if (!parsed.payouts || !Array.isArray(parsed.payouts)) parsed.payouts = INITIAL_PAYOUTS;
      if (!parsed.categories || !Array.isArray(parsed.categories)) parsed.categories = INITIAL_CATEGORIES;
      if (!parsed.tickets || !Array.isArray(parsed.tickets)) parsed.tickets = INITIAL_TICKETS;
      if (!parsed.broadcasts || !Array.isArray(parsed.broadcasts)) parsed.broadcasts = INITIAL_BROADCASTS;
      if (!parsed.coupons || !Array.isArray(parsed.coupons)) parsed.coupons = INITIAL_COUPONS;
      if (!parsed.websiteContent) parsed.websiteContent = INITIAL_WEBSITE_CONTENT;
      if (!parsed.staff || !Array.isArray(parsed.staff)) parsed.staff = INITIAL_STAFF;
      
      // Ensure users and readers are present
      if (!parsed.users || parsed.users.length < 2) parsed.users = INITIAL_USERS;
      if (!parsed.readers || parsed.readers.length < 10) parsed.readers = INITIAL_READERS;
      if (!parsed.wallets) parsed.wallets = INITIAL_WALLETS;
      if (!parsed.transactions) parsed.transactions = INITIAL_TRANSACTIONS;
      if (!parsed.consultations) parsed.consultations = INITIAL_CONSULTATIONS;
      if (!parsed.messages) parsed.messages = INITIAL_MESSAGES;
      if (!parsed.activityLogs) parsed.activityLogs = [];
      if (!parsed.settings) {
        parsed.settings = {
          defaultCurrency: 'USD',
          supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'INR'],
          platformCommissionPercent: 15,
          minWalletBalanceToStart: 5.00,
          categories: ['Vedic Astrology', 'Tarot Reading', 'Psychic Reading', 'Love & Relationships', 'Career & Wealth', 'Numerology', 'Hellenistic Astrology'],
          systemNotice: 'LUMSIC platform operational worldwide with 24/7 reader availability.',
          maintenanceMode: false,
        };
      }
      return parsed;
    }
  } catch (err) {
    console.error('Error loading DB file, fallback to initial state', err);
  }
  return {
    users: INITIAL_USERS,
    readers: INITIAL_READERS,
    consultations: INITIAL_CONSULTATIONS,
    messages: INITIAL_MESSAGES,
    wallets: INITIAL_WALLETS,
    transactions: INITIAL_TRANSACTIONS,
    notifications: [
      {
        id: 'notif-001',
        userId: 'usr-customer',
        title: 'Consultation Completed',
        message: 'Your consultation with Psychic Nikee (LUM001) has ended.',
        type: 'session_request',
        isRead: true,
        timestamp: '2026-10-26T18:30:05.000Z',
        sessionId: 'cs-prev-001',
      },
    ],
    reviews: [
      {
        id: 'rev-001',
        sessionId: 'cs-prev-001',
        readerId: 'rdr-001',
        customerId: 'usr-customer',
        customerName: 'Sarah Jenkins',
        rating: 5,
        comment: 'Incredible depth! Nikee predicted the exact timeframe for my venture shift. Deeply grateful.',
        timestamp: '2026-10-26T18:32:00.000Z',
      },
    ],
    activityLogs: [
      {
        id: 'log-001',
        actorId: 'usr-admin',
        actorName: 'LUMSIC Operations Admin',
        actorRole: 'admin',
        action: 'WORKFLOW_CONFIG',
        details: 'Initial system boot and reader verification completed.',
        timestamp: new Date().toISOString(),
      },
    ],
    settings: {
      defaultCurrency: 'USD',
      supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'INR'],
      platformCommissionPercent: 15,
      minWalletBalanceToStart: 5.00,
      categories: ['Vedic Astrology', 'Tarot Reading', 'Psychic Reading', 'Love & Relationships', 'Career & Wealth', 'Numerology', 'Hellenistic Astrology'],
      systemNotice: 'LUMSIC platform operational worldwide with 24/7 reader availability.',
      maintenanceMode: false,
    },
    applications: INITIAL_APPLICATIONS,
    payouts: INITIAL_PAYOUTS,
    categories: INITIAL_CATEGORIES,
    tickets: INITIAL_TICKETS,
    broadcasts: INITIAL_BROADCASTS,
    coupons: INITIAL_COUPONS,
    websiteContent: INITIAL_WEBSITE_CONTENT,
    staff: INITIAL_STAFF,
  };
}

let db = loadDatabase();

function saveDatabase() {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving DB file', err);
  }
}

// -------------------------------------------------------------
// REST API ENDPOINTS
// -------------------------------------------------------------

// 1. Health
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    platform: 'LUMSIC Global Astrology Platform',
    timestamp: new Date().toISOString(),
    readersCount: db.readers.length,
    activeSessions: db.consultations.filter(c => c.status === 'active').length,
  });
});

// 2. Auth: Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user || user.passwordHash !== password) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  if (user.isSuspended) {
    return res.status(403).json({ error: 'This account has been suspended by administration.' });
  }

  // Create or retrieve wallet for customer
  if (user.role === 'customer' && !db.wallets[user.id]) {
    db.wallets[user.id] = {
      userId: user.id,
      balance: 50.00,
      currency: user.currency || 'USD',
      updatedAt: new Date().toISOString(),
    };
    saveDatabase();
  }

  const token = `lumsic_token_${user.id}_${Date.now()}`;
  const { passwordHash, ...safeUser } = user;
  res.json({ user: safeUser, token });
});

// 3. Auth: Signup
app.post('/api/auth/signup', (req, res) => {
  const { fullName, email, phone, password, role = 'customer', country = 'US', currency = 'USD' } = req.body;

  if (!fullName || !email || !phone || !password) {
    return res.status(400).json({ error: 'Please provide all required fields.' });
  }

  const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(409).json({ error: 'An account with this email address already exists.' });
  }

  const newId = `usr-${Date.now().toString(36)}`;
  const newUser: any = {
    id: newId,
    email,
    passwordHash: password,
    fullName,
    phone,
    country,
    currency,
    timezone: 'UTC',
    role: role === 'astrologer' ? 'astrologer' : 'customer',
    createdAt: new Date().toISOString(),
  };

  if (role === 'astrologer') {
    const astroNum = (db.readers.length + 1).toString().padStart(3, '0');
    newUser.astrologerId = `LUM${astroNum}`;
    
    // Also create reader entity
    const newReader = {
      id: `rdr-${Date.now().toString(36)}`,
      astrologerId: newUser.astrologerId,
      userId: newId,
      name: fullName,
      avatar: '/src/assets/images/reader_vedic_astrologer_1793513362018.jpg',
      title: 'Consulting Astrologer',
      specializations: ['Astrology Consultation', 'Spiritual Guidance'],
      languages: ['English'],
      experienceYears: 5,
      rating: 5.0,
      reviewsCount: 0,
      pricePerMinute: 2.00,
      currency: 'USD',
      bio: 'Professional spiritual and astrological consultant on LUMSIC platform.',
      isOnline: true,
      isBusy: false,
      workflowEnabled: true,
      totalConsultations: 0,
      earningsTotal: 0.00,
    };
    db.readers.push(newReader);
  } else {
    // Initial customer welcome wallet balance bonus
    db.wallets[newId] = {
      userId: newId,
      balance: 30.00,
      currency,
      updatedAt: new Date().toISOString(),
    };
    db.transactions.push({
      id: `tx-${Date.now().toString(36)}`,
      userId: newId,
      type: 'deposit',
      amount: 30.00,
      balanceAfter: 30.00,
      currency,
      description: 'LUMSIC Welcome Account Credit',
      status: 'completed',
      timestamp: new Date().toISOString(),
    });
  }

  db.users.push(newUser);
  saveDatabase();

  const token = `lumsic_token_${newUser.id}_${Date.now()}`;
  const { passwordHash, ...safeUser } = newUser;
  res.status(201).json({ user: safeUser, token });
});

// 4. Auth: Password Recovery Request
app.post('/api/auth/recover', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(404).json({ error: 'No account found with this email address.' });
  }

  // Generate verified recovery token
  const recoveryCode = Math.floor(100000 + Math.random() * 900000).toString();
  user.recoveryToken = recoveryCode;
  user.recoveryExpiry = Date.now() + 15 * 60 * 1000; // 15 mins
  saveDatabase();

  res.json({
    success: true,
    message: `Password reset verification code has been dispatched. (Verification Code for preview: ${recoveryCode})`,
    recoveryCode, // Sent in response for ease of preview testing
  });
});

// 5. Auth: Reset Password
app.post('/api/auth/reset', (req, res) => {
  const { email, token, newPassword } = req.body;
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user || user.recoveryToken !== token || Date.now() > (user.recoveryExpiry || 0)) {
    return res.status(400).json({ error: 'Invalid or expired verification token.' });
  }

  user.passwordHash = newPassword;
  delete user.recoveryToken;
  delete user.recoveryExpiry;
  saveDatabase();

  res.json({ success: true, message: 'Password has been updated successfully.' });
});

// 6. Readers: List & Filters
app.get('/api/readers', (req, res) => {
  let results = [...db.readers];
  const { search, category, onlineOnly, maxPrice, language, workflowOnly } = req.query;

  if (workflowOnly === 'true') {
    results = results.filter(r => r.workflowEnabled === true);
  }

  if (search) {
    const q = (search as string).toLowerCase();
    results = results.filter(
      r =>
        r.name.toLowerCase().includes(q) ||
        r.title.toLowerCase().includes(q) ||
        r.astrologerId.toLowerCase().includes(q) ||
        r.specializations.some((s: string) => s.toLowerCase().includes(q))
    );
  }

  if (category && category !== 'All') {
    const cat = (category as string).toLowerCase();
    results = results.filter(r =>
      r.specializations.some((s: string) => s.toLowerCase().includes(cat))
    );
  }

  if (onlineOnly === 'true') {
    results = results.filter(r => r.isOnline && !r.isBusy);
  }

  if (language && language !== 'All') {
    results = results.filter(r => r.languages.includes(language as string));
  }

  if (maxPrice) {
    const priceLimit = parseFloat(maxPrice as string);
    if (!isNaN(priceLimit)) {
      results = results.filter(r => r.pricePerMinute <= priceLimit);
    }
  }

  res.json(results);
});

// 7. Readers: Get One
app.get('/api/readers/:id', (req, res) => {
  const reader = db.readers.find(
    r => r.id === req.params.id || r.astrologerId === req.params.id
  );
  if (!reader) {
    return res.status(404).json({ error: 'Astrologer not found.' });
  }
  res.json(reader);
});

// 8. Readers: Update Availability Status (Astrologer self-service)
app.patch('/api/readers/:id/availability', (req, res) => {
  const { isOnline, isBusy } = req.body;
  const reader = db.readers.find(r => r.id === req.params.id || r.astrologerId === req.params.id);
  if (!reader) {
    return res.status(404).json({ error: 'Reader not found.' });
  }

  if (typeof isOnline === 'boolean') reader.isOnline = isOnline;
  if (typeof isBusy === 'boolean') reader.isBusy = isBusy;
  saveDatabase();

  res.json({ success: true, reader });
});

// Astrologer Self-Service Profile Update (avatar, bio, title, price, cover, video, specs, hours, etc.)
app.patch('/api/readers/:id/profile', (req, res) => {
  const reader = db.readers.find(r => r.id === req.params.id || r.astrologerId === req.params.id);
  if (!reader) {
    return res.status(404).json({ error: 'Reader not found.' });
  }
  const {
    name,
    bio,
    title,
    pricePerMinute,
    avatar,
    coverImage,
    introVideoUrl,
    specializations,
    languages,
    experienceYears,
    country,
    city,
    inrPrice,
    callPricePerMinute,
    videoPricePerMinute,
    workingHours,
    timezone,
    maxCapacity,
    aboutHtml,
    qualifications,
    scheduleJson,
  } = req.body;

  if (name !== undefined) reader.name = name;
  if (bio !== undefined) reader.bio = bio;
  if (title !== undefined) reader.title = title;
  if (pricePerMinute !== undefined) reader.pricePerMinute = parseFloat(pricePerMinute) || reader.pricePerMinute;
  if (avatar !== undefined) reader.avatar = avatar;
  if (coverImage !== undefined) reader.coverImage = coverImage;
  if (introVideoUrl !== undefined) reader.introVideoUrl = introVideoUrl;
  if (specializations !== undefined) {
    reader.specializations = Array.isArray(specializations) ? specializations : specializations.split(',').map((s: string) => s.trim());
  }
  if (languages !== undefined) {
    reader.languages = Array.isArray(languages) ? languages : languages.split(',').map((s: string) => s.trim());
  }
  if (experienceYears !== undefined) reader.experienceYears = parseInt(experienceYears, 10) || reader.experienceYears;
  if (country !== undefined) reader.country = country;
  if (city !== undefined) reader.city = city;
  if (inrPrice !== undefined) reader.inrPrice = parseFloat(inrPrice) || reader.inrPrice;
  if (callPricePerMinute !== undefined) reader.callPricePerMinute = parseFloat(callPricePerMinute) || 0;
  if (videoPricePerMinute !== undefined) reader.videoPricePerMinute = parseFloat(videoPricePerMinute) || 0;
  if (workingHours !== undefined) reader.workingHours = workingHours;
  if (timezone !== undefined) reader.timezone = timezone;
  if (maxCapacity !== undefined) reader.maxCapacity = parseInt(maxCapacity, 10) || 1;
  if (aboutHtml !== undefined) reader.aboutHtml = aboutHtml;
  if (scheduleJson !== undefined) reader.scheduleJson = scheduleJson;
  if (qualifications !== undefined) {
    reader.qualifications = Array.isArray(qualifications) ? qualifications : qualifications.split(',').map((s: string) => s.trim());
  }

  const user = db.users.find(u => u.id === reader.userId || u.astrologerId === reader.astrologerId);
  if (user) {
    if (avatar) user.avatar = avatar;
    if (name) user.fullName = name;
    if (country) user.country = country;
    if (timezone) user.timezone = timezone;
  }

  saveDatabase();
  res.json({ success: true, reader });
});

// Astrologer Self-Service Withdrawal Request
app.post('/api/readers/:id/withdrawals', (req, res) => {
  const reader = db.readers.find(r => r.id === req.params.id || r.astrologerId === req.params.id);
  if (!reader) return res.status(404).json({ error: 'Reader not found.' });

  const { amount, paymentMethod, payoutDetails } = req.body;
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount) || numAmount <= 0) {
    return res.status(400).json({ error: 'Valid positive withdrawal amount is required.' });
  }

  const wallet = db.wallets[reader.userId];
  const currentBal = wallet ? wallet.balance : (reader.earningsTotal || 0);
  if (numAmount > currentBal) {
    return res.status(400).json({ error: `Withdrawal amount ($${numAmount.toFixed(2)}) exceeds available balance ($${currentBal.toFixed(2)}).` });
  }

  if (numAmount < 25) {
    return res.status(400).json({ error: 'Minimum withdrawal amount is $25.00.' });
  }

  if (!paymentMethod || !payoutDetails) {
    return res.status(400).json({ error: 'Payment method and account payout details are required.' });
  }

  const payout = {
    id: `po-${Date.now().toString(36)}`,
    readerId: reader.id,
    readerName: reader.name,
    astrologerId: reader.astrologerId,
    amount: numAmount,
    currency: reader.currency || 'USD',
    paymentMethod: paymentMethod,
    payoutDetails: payoutDetails,
    status: 'pending',
    requestedAt: new Date().toISOString(),
  };

  if (!db.payouts) db.payouts = [];
  db.payouts.unshift(payout);

  if (wallet) {
    wallet.balance = parseFloat((wallet.balance - numAmount).toFixed(2));
    wallet.updatedAt = new Date().toISOString();
  }

  const tx = {
    id: `tx-po-${Date.now().toString(36)}`,
    userId: reader.userId,
    type: 'payout',
    amount: numAmount,
    balanceAfter: wallet ? wallet.balance : 0,
    currency: reader.currency || 'USD',
    description: `Withdrawal Request to ${paymentMethod} (${payoutDetails})`,
    status: 'pending',
    timestamp: new Date().toISOString(),
  };
  db.transactions.unshift(tx);

  db.activityLogs.push({
    id: `log-${Date.now().toString(36)}`,
    actorId: reader.userId,
    actorName: reader.name,
    actorRole: 'astrologer',
    action: 'REQUEST_PAYOUT',
    details: `Submitted withdrawal request for $${numAmount.toFixed(2)} via ${paymentMethod}.`,
    timestamp: new Date().toISOString(),
  });

  saveDatabase();
  res.status(201).json({ success: true, payout, walletBalance: wallet ? wallet.balance : 0 });
});

// Astrologer List Own Withdrawals
app.get('/api/readers/:id/withdrawals', (req, res) => {
  const reader = db.readers.find(r => r.id === req.params.id || r.astrologerId === req.params.id);
  if (!reader) return res.status(404).json({ error: 'Reader not found.' });

  const list = (db.payouts || []).filter((p: any) => p.readerId === reader.id || p.astrologerId === reader.astrologerId);
  list.sort((a: any, b: any) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());
  res.json(list);
});

// Astrologer List Own Reviews
app.get('/api/readers/:id/reviews', (req, res) => {
  const reader = db.readers.find(r => r.id === req.params.id || r.astrologerId === req.params.id);
  if (!reader) return res.status(404).json({ error: 'Reader not found.' });

  const list = (db.reviews || []).filter((r: any) => r.readerId === reader.id || r.readerId === reader.astrologerId);
  list.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  res.json(list);
});

// Astrologer Reply to Review
app.post('/api/readers/:id/reviews/:reviewId/reply', (req, res) => {
  const { reply } = req.body;
  if (!reply || !reply.trim()) {
    return res.status(400).json({ error: 'Reply text cannot be blank.' });
  }

  const review = (db.reviews || []).find((r: any) => r.id === req.params.reviewId);
  if (!review) return res.status(404).json({ error: 'Review not found.' });

  review.readerReply = reply.trim();
  review.replyTimestamp = new Date().toISOString();
  saveDatabase();
  res.json({ success: true, review });
});

// Auth Change Password
app.post('/api/auth/change-password', (req, res) => {
  const { userId, currentPassword, newPassword } = req.body;
  const user = db.users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: 'User not found.' });

  if (currentPassword && user.passwordHash && user.passwordHash !== currentPassword) {
    return res.status(400).json({ error: 'Current password does not match.' });
  }
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters long.' });
  }

  user.passwordHash = newPassword;
  saveDatabase();
  res.json({ success: true, message: 'Password has been updated successfully.' });
});

// Support Tickets: Get for user & Create
app.get('/api/tickets', (req, res) => {
  const { userId } = req.query;
  let list = db.tickets || [];
  if (userId) {
    list = list.filter((t: any) => t.userId === userId);
  }
  list.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json(list);
});

app.post('/api/tickets', (req, res) => {
  const { userId, userName, userEmail, userRole, subject, category, priority, description } = req.body;
  if (!userId || !subject || !description) {
    return res.status(400).json({ error: 'User, subject, and description are required.' });
  }

  const newTicket = {
    id: `tick-${Date.now().toString(36)}`,
    ticketNumber: `TICK-${Math.floor(100 + Math.random() * 900)}`,
    userId,
    userName: userName || 'User',
    userRole: userRole || 'astrologer',
    userEmail: userEmail || '',
    subject,
    category: category || 'General',
    priority: priority || 'medium',
    status: 'open',
    description,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    responses: [],
  };

  if (!db.tickets) db.tickets = [];
  db.tickets.unshift(newTicket);
  saveDatabase();
  res.status(201).json(newTicket);
});


// 9. Consultations: Create Request
// CRITICAL ROUTING RULE: checks astrologer ID, online status, busy status, and WORKFLOW STATUS!
app.post('/api/consultations/request', (req, res) => {
  const { customerId, astrologerId, initialTopic } = req.body;

  const customer = db.users.find(u => u.id === customerId);
  if (!customer) {
    return res.status(404).json({ error: 'Customer not found.' });
  }

  const reader = db.readers.find(
    r => r.astrologerId === astrologerId || r.id === astrologerId
  );
  if (!reader) {
    return res.status(404).json({ error: `Astrologer ID ${astrologerId} does not exist.` });
  }

  // ENFORCE WORKFLOW CONTROL: Cannot assign if workflow is OFF!
  if (!reader.workflowEnabled) {
    return res.status(403).json({
      error: `Consultation routing unavailable: Astrologer ${reader.name} (${reader.astrologerId}) workflow is currently turned OFF by system administration. Please select another verified astrologer.`,
    });
  }

  // ENFORCE AVAILABILITY
  if (!reader.isOnline) {
    return res.status(400).json({
      error: `Astrologer ${reader.name} is currently offline. You may only initiate instant consultations with online readers.`,
    });
  }

  if (reader.isBusy) {
    return res.status(400).json({
      error: `Astrologer ${reader.name} is currently in an active consultation. Please check back shortly or choose another reader.`,
    });
  }

  // CHECK WALLET BALANCE (Customer must have at least 2 minutes of consultation balance)
  const wallet = db.wallets[customerId];
  const minRequired = reader.pricePerMinute * 2;
  if (!wallet || wallet.balance < minRequired) {
    return res.status(402).json({
      error: `Insufficient wallet balance. You have $${wallet?.balance?.toFixed(2) || '0.00'}, but at least $${minRequired.toFixed(2)} is required to start a consultation with ${reader.name} ($${reader.pricePerMinute.toFixed(2)}/min). Please add funds to your wallet.`,
      currentBalance: wallet?.balance || 0,
      minRequired,
    });
  }

  // Prevent multiple concurrent pending/active consultations
  const existingActive = db.consultations.find(
    c => c.customerId === customerId && (c.status === 'active' || c.status === 'pending')
  );
  if (existingActive) {
    return res.status(409).json({
      error: `You already have an ongoing or pending consultation (${existingActive.sessionNumber}). Please complete or cancel it first.`,
      existingSession: existingActive,
    });
  }

  const sessionNumber = `LUM-CS-${Math.floor(1000 + Math.random() * 9000)}`;
  const newSession: any = {
    id: `cs-${Date.now().toString(36)}`,
    sessionNumber,
    customerId,
    customerName: customer.fullName,
    customerEmail: customer.email,
    astrologerId: reader.astrologerId,
    readerId: reader.id,
    readerName: reader.name,
    readerAvatar: reader.avatar,
    status: 'pending',
    requestedAt: new Date().toISOString(),
    durationSeconds: 0,
    pricePerMinute: reader.pricePerMinute,
    totalCost: 0.00,
    initialTopic: initialTopic || 'General Life & Astrological Guidance',
  };

  db.consultations.push(newSession);

  // Notify Astrologer
  db.notifications.push({
    id: `notif-${Date.now().toString(36)}`,
    userId: reader.userId,
    title: 'New Consultation Request!',
    message: `${customer.fullName} has requested a consultation regarding: "${newSession.initialTopic}".`,
    type: 'session_request',
    isRead: false,
    timestamp: new Date().toISOString(),
    sessionId: newSession.id,
  });

  saveDatabase();
  res.status(201).json(newSession);
});

// 10. Consultations: Astrologer Accept
app.post('/api/consultations/:id/accept', (req, res) => {
  const session = db.consultations.find(c => c.id === req.params.id);
  if (!session) {
    return res.status(404).json({ error: 'Consultation session not found.' });
  }

  if (session.status !== 'pending') {
    return res.status(400).json({ error: `Cannot accept session in '${session.status}' state.` });
  }

  session.status = 'active';
  session.startedAt = new Date().toISOString();

  // Mark reader as busy
  const reader = db.readers.find(r => r.astrologerId === session.astrologerId);
  if (reader) reader.isBusy = true;

  // Add initial system message to chat
  db.messages.push({
    id: `msg-${Date.now().toString(36)}`,
    sessionId: session.id,
    senderId: 'system',
    senderRole: 'system',
    senderName: 'LUMSIC Security Engine',
    content: `Consultation session connected (${session.sessionNumber}). Rate: $${session.pricePerMinute.toFixed(2)}/min. All messages are end-to-end encrypted.`,
    timestamp: new Date().toISOString(),
    status: 'delivered',
  });

  // Notify customer
  db.notifications.push({
    id: `notif-${Date.now().toString(36)}`,
    userId: session.customerId,
    title: 'Consultation Accepted!',
    message: `${session.readerName} has accepted your consultation request. Live session is now active.`,
    type: 'session_accepted',
    isRead: false,
    timestamp: new Date().toISOString(),
    sessionId: session.id,
  });

  saveDatabase();
  res.json({ success: true, session });
});

// 11. Consultations: Astrologer Reject
app.post('/api/consultations/:id/reject', (req, res) => {
  const { reason = 'Astrologer temporarily unavailable' } = req.body;
  const session = db.consultations.find(c => c.id === req.params.id);
  if (!session) {
    return res.status(404).json({ error: 'Session not found.' });
  }

  session.status = 'rejected';
  session.rejectionReason = reason;
  session.endedAt = new Date().toISOString();

  // Release busy lock
  const reader = db.readers.find(r => r.astrologerId === session.astrologerId);
  if (reader) reader.isBusy = false;

  // Notify customer
  db.notifications.push({
    id: `notif-${Date.now().toString(36)}`,
    userId: session.customerId,
    title: 'Consultation Request Declined',
    message: `${session.readerName} could not accept at this time (${reason}). No funds were charged.`,
    type: 'session_rejected',
    isRead: false,
    timestamp: new Date().toISOString(),
    sessionId: session.id,
  });

  saveDatabase();
  res.json({ success: true, session });
});

// 12. Consultations: End Session & Settle Billing Atomically
app.post('/api/consultations/:id/end', (req, res) => {
  const session = db.consultations.find(c => c.id === req.params.id);
  if (!session) {
    return res.status(404).json({ error: 'Session not found.' });
  }

  if (session.status !== 'active') {
    return res.status(400).json({ error: `Cannot end session with status '${session.status}'.` });
  }

  const endedAt = new Date();
  session.endedAt = endedAt.toISOString();
  session.status = 'completed';

  const startedAt = session.startedAt ? new Date(session.startedAt) : endedAt;
  const elapsedSec = Math.max(30, Math.floor((endedAt.getTime() - startedAt.getTime()) / 1000));
  session.durationSeconds = elapsedSec;

  // Billing calculation: minimum 1 minute, calculated per second
  const minutesBilled = Math.max(1, elapsedSec / 60);
  const totalCost = parseFloat((minutesBilled * session.pricePerMinute).toFixed(2));
  session.totalCost = totalCost;

  // Release reader busy state
  const reader = db.readers.find(r => r.astrologerId === session.astrologerId);
  if (reader) {
    reader.isBusy = false;
    reader.totalConsultations += 1;
    reader.earningsTotal += parseFloat((totalCost * 0.85).toFixed(2)); // Astrologer gets 85%
  }

  // ATOMIC WALLET DEDUCTION
  const wallet = db.wallets[session.customerId];
  if (wallet) {
    const actualCharge = Math.min(wallet.balance, totalCost);
    wallet.balance = parseFloat((wallet.balance - actualCharge).toFixed(2));
    wallet.updatedAt = endedAt.toISOString();

    db.transactions.push({
      id: `tx-${Date.now().toString(36)}`,
      userId: session.customerId,
      type: 'consultation_deduction',
      amount: actualCharge,
      balanceAfter: wallet.balance,
      currency: wallet.currency || 'USD',
      description: `${Math.ceil(minutesBilled)} min consultation with ${session.readerName} (${session.astrologerId})`,
      referenceSessionId: session.id,
      status: 'completed',
      timestamp: endedAt.toISOString(),
    });
  }

  // Add completion message
  db.messages.push({
    id: `msg-${Date.now().toString(36)}`,
    sessionId: session.id,
    senderId: 'system',
    senderRole: 'system',
    senderName: 'LUMSIC Billing System',
    content: `Consultation ended. Duration: ${Math.floor(elapsedSec / 60)}m ${elapsedSec % 60}s. Total settled: $${totalCost.toFixed(2)}.`,
    timestamp: endedAt.toISOString(),
    status: 'delivered',
  });

  saveDatabase();
  res.json({ success: true, session });
});

// 13. Consultations: Admin Transfer Session to Another Astrologer
app.post('/api/consultations/:id/transfer', (req, res) => {
  const { newAstrologerId, reason, adminId = 'usr-admin' } = req.body;
  const session = db.consultations.find(c => c.id === req.params.id);
  if (!session) {
    return res.status(404).json({ error: 'Session not found.' });
  }

  const targetReader = db.readers.find(r => r.astrologerId === newAstrologerId);
  if (!targetReader) {
    return res.status(404).json({ error: `Target Astrologer ${newAstrologerId} not found.` });
  }

  if (!targetReader.workflowEnabled) {
    return res.status(403).json({ error: `Cannot transfer: Astrologer ${newAstrologerId} workflow is turned OFF.` });
  }

  const oldAstrologerId = session.astrologerId;
  const oldReaderName = session.readerName;

  // Free previous reader
  const oldReader = db.readers.find(r => r.astrologerId === oldAstrologerId);
  if (oldReader) oldReader.isBusy = false;

  // Reassign session
  session.astrologerId = targetReader.astrologerId;
  session.readerId = targetReader.id;
  session.readerName = targetReader.name;
  session.readerAvatar = targetReader.avatar;
  session.pricePerMinute = targetReader.pricePerMinute;

  if (!session.transferHistory) session.transferHistory = [];
  session.transferHistory.push({
    fromAstrologerId: oldAstrologerId,
    toAstrologerId: targetReader.astrologerId,
    timestamp: new Date().toISOString(),
    reason: reason || 'Administrative reassignment for optimal client care',
    transferredBy: adminId,
  });

  targetReader.isBusy = true;

  // Add system message
  db.messages.push({
    id: `msg-${Date.now().toString(36)}`,
    sessionId: session.id,
    senderId: 'system',
    senderRole: 'system',
    senderName: 'LUMSIC Supervisor',
    content: `Session reassigned by Administration from ${oldReaderName} (${oldAstrologerId}) to ${targetReader.name} (${targetReader.astrologerId}). Reason: ${reason}`,
    timestamp: new Date().toISOString(),
    status: 'delivered',
  });

  // Log activity
  db.activityLogs.push({
    id: `log-${Date.now().toString(36)}`,
    actorId: adminId,
    actorName: 'System Administrator',
    actorRole: 'admin',
    action: 'SESSION_TRANSFER',
    details: `Transferred session ${session.sessionNumber} from ${oldAstrologerId} to ${targetReader.astrologerId}.`,
    timestamp: new Date().toISOString(),
  });

  saveDatabase();
  res.json({ success: true, session });
});

// 14. Consultations: List by User/Role
app.get('/api/consultations', (req, res) => {
  const { userId, role, astrologerId } = req.query;

  let results = [...db.consultations];
  if (role === 'customer' && userId) {
    results = results.filter(c => c.customerId === userId);
  } else if (role === 'astrologer') {
    const aid = astrologerId || db.users.find(u => u.id === userId)?.astrologerId;
    if (aid) {
      results = results.filter(c => c.astrologerId === aid);
    }
  }
  // admin gets all

  // Sort newest first
  results.sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());
  res.json(results);
});

// 15. Consultations: Get Single Session
app.get('/api/consultations/:id', (req, res) => {
  const session = db.consultations.find(c => c.id === req.params.id);
  if (!session) {
    return res.status(404).json({ error: 'Session not found.' });
  }
  res.json(session);
});

// 16. Chat: Get Messages
app.get('/api/chat/:sessionId/messages', (req, res) => {
  const messages = db.messages.filter(m => m.sessionId === req.params.sessionId);
  messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  res.json(messages);
});

// 17. Chat: Send Message
app.post('/api/chat/:sessionId/messages', (req, res) => {
  const { senderId, senderRole, senderName, content } = req.body;
  const session = db.consultations.find(c => c.id === req.params.sessionId);

  if (!session) {
    return res.status(404).json({ error: 'Session not found.' });
  }

  if (session.status !== 'active') {
    return res.status(400).json({ error: `Cannot send message in inactive session (${session.status}).` });
  }

  if (!content || !content.trim()) {
    return res.status(400).json({ error: 'Message content cannot be empty.' });
  }

  const newMessage = {
    id: `msg-${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
    sessionId: session.id,
    senderId,
    senderRole,
    senderName,
    content: content.trim(),
    timestamp: new Date().toISOString(),
    status: 'delivered',
  };

  db.messages.push(newMessage);
  saveDatabase();

  res.status(201).json(newMessage);
});

// 18. Wallet: Get Balance
app.get('/api/wallet/:userId', (req, res) => {
  const wallet = db.wallets[req.params.userId] || {
    userId: req.params.userId,
    balance: 0.00,
    currency: 'USD',
    updatedAt: new Date().toISOString(),
  };
  res.json(wallet);
});

// 19. Wallet: Add Funds (Deposit)
app.post('/api/wallet/deposit', (req, res) => {
  const { userId, amount, currency = 'USD', paymentMethod = 'card' } = req.body;
  const numAmount = parseFloat(amount);

  if (isNaN(numAmount) || numAmount <= 0) {
    return res.status(400).json({ error: 'Please enter a valid deposit amount greater than $0.' });
  }

  if (!db.wallets[userId]) {
    db.wallets[userId] = {
      userId,
      balance: 0.00,
      currency,
      updatedAt: new Date().toISOString(),
    };
  }

  const wallet = db.wallets[userId];
  wallet.balance = parseFloat((wallet.balance + numAmount).toFixed(2));
  wallet.updatedAt = new Date().toISOString();

  const transaction = {
    id: `tx-${Date.now().toString(36)}`,
    userId,
    type: 'deposit',
    amount: numAmount,
    balanceAfter: wallet.balance,
    currency,
    description: `Added funds via ${paymentMethod.toUpperCase()} (Stripe Verified Sandbox)`,
    status: 'completed',
    paymentProvider: 'stripe',
    timestamp: new Date().toISOString(),
  };

  db.transactions.push(transaction);

  db.notifications.push({
    id: `notif-${Date.now().toString(36)}`,
    userId,
    title: 'Wallet Funded Successfully',
    message: `$${numAmount.toFixed(2)} has been credited to your LUMSIC balance. Current balance: $${wallet.balance.toFixed(2)}.`,
    type: 'payment',
    isRead: false,
    timestamp: new Date().toISOString(),
  });

  saveDatabase();
  res.json({ success: true, balance: wallet.balance, transaction });
});

// 20. Wallet: Transactions
app.get('/api/wallet/:userId/transactions', (req, res) => {
  const list = db.transactions.filter(t => t.userId === req.params.userId);
  list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  res.json(list);
});

// 21. Admin: Astrologer Workflow Control (CRITICAL)
app.patch('/api/admin/astrologers/:astrologerId/workflow', (req, res) => {
  const { enabled, adminId = 'usr-admin' } = req.body;
  const { astrologerId } = req.params;

  const reader = db.readers.find(r => r.astrologerId === astrologerId);
  if (!reader) {
    return res.status(404).json({ error: `Astrologer ${astrologerId} not found.` });
  }

  const previousState = reader.workflowEnabled;
  reader.workflowEnabled = Boolean(enabled);

  // Record Admin Activity Log
  const log = {
    id: `log-${Date.now().toString(36)}`,
    actorId: adminId,
    actorName: 'Admin Operations',
    actorRole: 'admin',
    action: 'ASTROLOGER_WORKFLOW_TOGGLE',
    details: `Toggled Astrologer ${reader.name} (${reader.astrologerId}) workflow from ${previousState ? 'ON' : 'OFF'} to ${reader.workflowEnabled ? 'ON' : 'OFF'}.`,
    timestamp: new Date().toISOString(),
  };
  db.activityLogs.push(log);

  // Notify Astrologer
  db.notifications.push({
    id: `notif-${Date.now().toString(36)}`,
    userId: reader.userId,
    title: 'Workflow Status Updated',
    message: `Administration has set your consultation routing workflow to: ${reader.workflowEnabled ? 'ACTIVE (ON)' : 'PAUSED (OFF)'}.`,
    type: 'workflow',
    isRead: false,
    timestamp: new Date().toISOString(),
  });

  saveDatabase();
  res.json({
    success: true,
    astrologerId: reader.astrologerId,
    workflowEnabled: reader.workflowEnabled,
    reader,
  });
});

// 22. Admin: Astrologer Management (Create / Update / Status)
app.post('/api/admin/astrologers', (req, res) => {
  const { name, title, pricePerMinute, specializations, languages, bio, avatar, email } = req.body;
  const nextNum = (db.readers.length + 1).toString().padStart(3, '0');
  const astrologerId = `LUM${nextNum}`;
  const userId = `usr-reader-${Date.now().toString(36)}`;

  // Create linked user
  db.users.push({
    id: userId,
    email: email || `reader.${nextNum}@lumsic.com`,
    passwordHash: 'Astro123!',
    fullName: name,
    phone: '+1 800 000 0000',
    country: 'US',
    currency: 'USD',
    timezone: 'UTC',
    role: 'astrologer',
    astrologerId,
    createdAt: new Date().toISOString(),
  });

  const newReader = {
    id: `rdr-${Date.now().toString(36)}`,
    astrologerId,
    userId,
    name,
    title: title || 'Professional Astrologer',
    avatar: avatar || '/src/assets/images/reader_vedic_astrologer_1793513362018.jpg',
    specializations: specializations || ['Astrology Consultation'],
    languages: languages || ['English'],
    experienceYears: 5,
    rating: 5.0,
    reviewsCount: 0,
    pricePerMinute: parseFloat(pricePerMinute) || 2.50,
    currency: 'USD',
    bio: bio || 'Verified LUMSIC spiritual counselor.',
    isOnline: true,
    isBusy: false,
    workflowEnabled: true,
    totalConsultations: 0,
    earningsTotal: 0.00,
  };

  db.readers.push(newReader);

  db.activityLogs.push({
    id: `log-${Date.now().toString(36)}`,
    actorId: 'usr-admin',
    actorName: 'Admin Operations',
    actorRole: 'admin',
    action: 'CREATE_ASTROLOGER',
    details: `Onboarded new astrologer ${newReader.name} assigned with unique ID ${astrologerId}.`,
    timestamp: new Date().toISOString(),
  });

  saveDatabase();
  res.status(201).json(newReader);
});

// 23. Admin: Overview Metrics with Date Filtering
app.get('/api/admin/overview', (req, res) => {
  const { dateRange = 'all' } = req.query;
  const now = Date.now();
  
  let cutoff = 0;
  if (dateRange === 'today') {
    cutoff = now - 24 * 3600 * 1000;
  } else if (dateRange === '7d') {
    cutoff = now - 7 * 24 * 3600 * 1000;
  } else if (dateRange === '30d') {
    cutoff = now - 30 * 24 * 3600 * 1000;
  } else if (dateRange === 'month') {
    const d = new Date();
    cutoff = new Date(d.getFullYear(), d.getMonth(), 1).getTime();
  }

  const filteredTransactions = cutoff > 0
    ? db.transactions.filter(t => new Date(t.timestamp).getTime() >= cutoff)
    : db.transactions;

  const filteredConsultations = cutoff > 0
    ? db.consultations.filter(c => new Date(c.requestedAt).getTime() >= cutoff)
    : db.consultations;

  const totalCustomers = db.users.filter(u => u.role === 'customer').length;
  const totalAstrologers = db.readers.length;
  const onlineAstrologers = db.readers.filter(r => r.isOnline).length;
  const offlineAstrologers = db.readers.filter(r => !r.isOnline).length;
  const busyAstrologers = db.readers.filter(r => r.isBusy).length;
  
  const activeConsultations = db.consultations.filter(c => c.status === 'active').length;
  const pendingRequests = db.consultations.filter(c => c.status === 'pending').length;
  const completedConsultations = filteredConsultations.filter(c => c.status === 'completed').length;
  
  const totalRevenue = db.transactions
    .filter(t => t.type === 'consultation_deduction' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const rangeRevenue = filteredTransactions
    .filter(t => t.type === 'consultation_deduction' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const todayCutoff = now - 24 * 3600 * 1000;
  const todayRevenue = db.transactions
    .filter(t => t.type === 'consultation_deduction' && t.status === 'completed' && new Date(t.timestamp).getTime() >= todayCutoff)
    .reduce((sum, t) => sum + t.amount, 0);

  const monthCutoff = now - 30 * 24 * 3600 * 1000;
  const monthlyRevenue = db.transactions
    .filter(t => t.type === 'consultation_deduction' && t.status === 'completed' && new Date(t.timestamp).getTime() >= monthCutoff)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalWalletBalance = Object.values(db.wallets).reduce((sum: number, w: any) => sum + (w.balance || 0), 0);
  const pendingPayoutsCount = (db.payouts || []).filter((p: any) => p.status === 'pending').length;
  const pendingApplicationsCount = (db.applications || []).filter((a: any) => a.status === 'pending').length;
  const openTicketsCount = (db.tickets || []).filter((t: any) => t.status === 'open' || t.status === 'in_progress').length;

  res.json({
    totalCustomers,
    totalAstrologers,
    onlineAstrologers,
    offlineAstrologers,
    busyAstrologers,
    activeConsultations,
    pendingRequests,
    completedConsultations,
    totalRevenue: parseFloat(totalRevenue.toFixed(2)),
    rangeRevenue: parseFloat(rangeRevenue.toFixed(2)),
    todayRevenue: parseFloat(todayRevenue.toFixed(2)),
    monthlyRevenue: parseFloat(monthlyRevenue.toFixed(2)),
    totalWalletBalance: parseFloat(totalWalletBalance.toFixed(2)),
    pendingPayoutsCount,
    pendingApplicationsCount,
    openTicketsCount,
    recentActivity: db.activityLogs.slice(-20).reverse(),
  });
});

// 24. Admin: Reader Management - Full Update (PUT)
app.put('/api/admin/astrologers/:id', (req, res) => {
  const reader = db.readers.find(r => r.id === req.params.id || r.astrologerId === req.params.id);
  if (!reader) {
    return res.status(404).json({ error: 'Reader not found.' });
  }

  const up = req.body;
  if (up.name !== undefined) reader.name = up.name;
  if (up.title !== undefined) reader.title = up.title;
  if (up.avatar !== undefined) reader.avatar = up.avatar;
  if (up.coverImage !== undefined) reader.coverImage = up.coverImage;
  if (up.bio !== undefined) reader.bio = up.bio;
  if (up.country !== undefined) reader.country = up.country;
  if (up.city !== undefined) reader.city = up.city;
  if (up.languages !== undefined) reader.languages = Array.isArray(up.languages) ? up.languages : up.languages.split(',').map((s: string) => s.trim());
  if (up.specializations !== undefined) reader.specializations = Array.isArray(up.specializations) ? up.specializations : up.specializations.split(',').map((s: string) => s.trim());
  if (up.experienceYears !== undefined) reader.experienceYears = parseInt(up.experienceYears, 10) || reader.experienceYears;
  if (up.pricePerMinute !== undefined) reader.pricePerMinute = parseFloat(up.pricePerMinute) || reader.pricePerMinute;
  if (up.inrPrice !== undefined) reader.inrPrice = parseFloat(up.inrPrice) || reader.inrPrice;
  if (up.callPricePerMinute !== undefined) reader.callPricePerMinute = parseFloat(up.callPricePerMinute);
  if (up.videoPricePerMinute !== undefined) reader.videoPricePerMinute = parseFloat(up.videoPricePerMinute);
  if (up.workingHours !== undefined) reader.workingHours = up.workingHours;
  if (up.timezone !== undefined) reader.timezone = up.timezone;
  if (up.badge !== undefined) reader.badge = up.badge;
  if (up.waitTimeMinutes !== undefined) reader.waitTimeMinutes = parseInt(up.waitTimeMinutes, 10);
  if (up.isVerified !== undefined) reader.isVerified = Boolean(up.isVerified);
  if (up.isFeatured !== undefined) reader.isFeatured = Boolean(up.isFeatured);
  if (up.isSuspended !== undefined) reader.isSuspended = Boolean(up.isSuspended);
  if (up.isOnline !== undefined) reader.isOnline = Boolean(up.isOnline);
  if (up.isBusy !== undefined) reader.isBusy = Boolean(up.isBusy);
  if (up.workflowEnabled !== undefined) reader.workflowEnabled = Boolean(up.workflowEnabled);
  if (up.maxCapacity !== undefined) reader.maxCapacity = parseInt(up.maxCapacity, 10) || 1;

  db.activityLogs.push({
    id: `log-${Date.now().toString(36)}`,
    actorId: 'usr-admin',
    actorName: 'Admin Operations',
    actorRole: 'admin',
    action: 'UPDATE_READER_PROFILE',
    details: `Updated profile details for reader ${reader.name} (${reader.astrologerId}).`,
    timestamp: new Date().toISOString(),
  });

  saveDatabase();
  res.json({ success: true, reader });
});

// 25. Admin: Reader Management - Delete
app.delete('/api/admin/astrologers/:id', (req, res) => {
  const index = db.readers.findIndex(r => r.id === req.params.id || r.astrologerId === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Reader not found.' });
  }

  const [deleted] = db.readers.splice(index, 1);
  db.activityLogs.push({
    id: `log-${Date.now().toString(36)}`,
    actorId: 'usr-admin',
    actorName: 'Admin Operations',
    actorRole: 'admin',
    action: 'DELETE_READER',
    details: `Removed reader account ${deleted.name} (${deleted.astrologerId}).`,
    timestamp: new Date().toISOString(),
  });

  saveDatabase();
  res.json({ success: true, deletedId: deleted.id });
});

// 26. Admin: Reader Applications
app.get('/api/admin/applications', (req, res) => {
  res.json(db.applications || []);
});

app.post('/api/admin/applications', (req, res) => {
  const { fullName, email, phone, country, city, experienceYears, primarySkills, languages, bio, sampleIntroUrl } = req.body;
  const newApp = {
    id: `app-${Date.now().toString(36)}`,
    fullName,
    email,
    phone,
    country: country || 'United States',
    city: city || 'New York',
    experienceYears: parseInt(experienceYears, 10) || 3,
    primarySkills: Array.isArray(primarySkills) ? primarySkills : (primarySkills || 'Psychic Reading').split(','),
    languages: Array.isArray(languages) ? languages : (languages || 'English').split(','),
    bio: bio || 'Professional intuitive reader applying to LUMSIC.',
    sampleIntroUrl: sampleIntroUrl || '',
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  db.applications.unshift(newApp);
  saveDatabase();
  res.status(201).json(newApp);
});

app.post('/api/admin/applications/:id/approve', (req, res) => {
  const appItem = db.applications.find(a => a.id === req.params.id);
  if (!appItem) return res.status(404).json({ error: 'Application not found.' });

  appItem.status = 'approved';
  appItem.reviewedAt = new Date().toISOString();
  appItem.reviewedBy = 'usr-admin';

  // Create reader
  const nextNum = (db.readers.length + 1).toString().padStart(3, '0');
  const astrologerId = `LUM${nextNum}`;
  const userId = `usr-reader-${Date.now().toString(36)}`;

  db.users.push({
    id: userId,
    email: appItem.email,
    passwordHash: 'Astro123!',
    fullName: appItem.fullName,
    phone: appItem.phone,
    country: appItem.country,
    currency: 'USD',
    timezone: 'UTC',
    role: 'astrologer',
    astrologerId,
    createdAt: new Date().toISOString(),
  });

  const newReader = {
    id: `rdr-${Date.now().toString(36)}`,
    astrologerId,
    userId,
    name: appItem.fullName,
    title: 'Verified Psychic & Intuitive Reader',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    specializations: appItem.primarySkills,
    languages: appItem.languages,
    experienceYears: appItem.experienceYears,
    rating: 5.0,
    reviewsCount: 0,
    pricePerMinute: 2.50,
    inrPrice: 35,
    currency: 'USD',
    bio: appItem.bio,
    isOnline: true,
    isBusy: false,
    workflowEnabled: true,
    totalConsultations: 0,
    earningsTotal: 0.00,
  };

  db.readers.push(newReader);

  db.activityLogs.push({
    id: `log-${Date.now().toString(36)}`,
    actorId: 'usr-admin',
    actorName: 'Admin Operations',
    actorRole: 'admin',
    action: 'APPROVE_APPLICATION',
    details: `Approved application for ${appItem.fullName}. Onboarded with Reader ID ${astrologerId}.`,
    timestamp: new Date().toISOString(),
  });

  saveDatabase();
  res.json({ success: true, application: appItem, reader: newReader });
});

app.post('/api/admin/applications/:id/reject', (req, res) => {
  const { reason = 'Qualifications do not match current platform openings.' } = req.body;
  const appItem = db.applications.find(a => a.id === req.params.id);
  if (!appItem) return res.status(404).json({ error: 'Application not found.' });

  appItem.status = 'rejected';
  appItem.rejectionReason = reason;
  appItem.reviewedAt = new Date().toISOString();
  appItem.reviewedBy = 'usr-admin';

  db.activityLogs.push({
    id: `log-${Date.now().toString(36)}`,
    actorId: 'usr-admin',
    actorName: 'Admin Operations',
    actorRole: 'admin',
    action: 'REJECT_APPLICATION',
    details: `Rejected applicant ${appItem.fullName}. Reason: ${reason}`,
    timestamp: new Date().toISOString(),
  });

  saveDatabase();
  res.json({ success: true, application: appItem });
});

// 27. Admin: Live Consultation Supervision - Force End
app.post('/api/admin/consultations/:id/end', (req, res) => {
  const session = db.consultations.find(c => c.id === req.params.id);
  if (!session) return res.status(404).json({ error: 'Session not found.' });

  session.status = 'completed';
  session.endedAt = new Date().toISOString();
  if (session.startedAt) {
    const durSec = Math.max(60, Math.floor((new Date(session.endedAt).getTime() - new Date(session.startedAt).getTime()) / 1000));
    session.durationSeconds = durSec;
    session.totalCost = parseFloat(((durSec / 60) * session.pricePerMinute).toFixed(2));
  }

  const reader = db.readers.find(r => r.astrologerId === session.astrologerId);
  if (reader) reader.isBusy = false;

  db.messages.push({
    id: `msg-${Date.now().toString(36)}`,
    sessionId: session.id,
    senderId: 'system',
    senderRole: 'system',
    senderName: 'LUMSIC Supervisor',
    content: `Consultation session has been concluded by Administration. Total billed: $${session.totalCost.toFixed(2)}.`,
    timestamp: new Date().toISOString(),
    status: 'delivered',
  });

  db.activityLogs.push({
    id: `log-${Date.now().toString(36)}`,
    actorId: 'usr-admin',
    actorName: 'Admin Operations',
    actorRole: 'admin',
    action: 'SUPERVISOR_END_SESSION',
    details: `Admin ended session ${session.sessionNumber} with ${session.readerName}.`,
    timestamp: new Date().toISOString(),
  });

  saveDatabase();
  res.json({ success: true, session });
});

// 28. Admin: Customers list & notes
app.get('/api/admin/customers', (req, res) => {
  const customers = db.users
    .filter(u => u.role === 'customer')
    .map(u => {
      const wallet = db.wallets[u.id];
      const custSessions = db.consultations.filter(c => c.customerId === u.id);
      const totalSpent = custSessions
        .filter(c => c.status === 'completed')
        .reduce((sum, c) => sum + (c.totalCost || 0), 0);
      return {
        id: u.id,
        fullName: u.fullName,
        email: u.email,
        phone: u.phone,
        country: u.country,
        createdAt: u.createdAt,
        walletBalance: wallet?.balance || 0,
        totalConsultations: custSessions.length,
        totalSpent: parseFloat(totalSpent.toFixed(2)),
        isSuspended: Boolean(u.isSuspended),
        adminNotes: u.adminNotes || '',
      };
    });
  res.json(customers);
});

app.patch('/api/admin/customers/:id/notes', (req, res) => {
  const user = db.users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'Customer not found.' });
  user.adminNotes = req.body.notes || '';
  saveDatabase();
  res.json({ success: true, adminNotes: user.adminNotes });
});

app.patch('/api/admin/customers/:id/suspend', (req, res) => {
  const user = db.users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'Customer not found.' });
  user.isSuspended = !user.isSuspended;
  
  db.activityLogs.push({
    id: `log-${Date.now().toString(36)}`,
    actorId: 'usr-admin',
    actorName: 'Admin Operations',
    actorRole: 'admin',
    action: 'CUSTOMER_SUSPENSION_TOGGLE',
    details: `${user.isSuspended ? 'Suspended' : 'Activated'} customer account: ${user.fullName} (${user.email}).`,
    timestamp: new Date().toISOString(),
  });

  saveDatabase();
  res.json({ success: true, isSuspended: user.isSuspended });
});

// 29. Admin: Transactions & Refunds
app.get('/api/admin/transactions', (req, res) => {
  const { type, search } = req.query;
  let list = [...db.transactions];
  if (type && type !== 'all') {
    list = list.filter(t => t.type === type);
  }
  if (search) {
    const q = String(search).toLowerCase();
    list = list.filter(t =>
      t.id.toLowerCase().includes(q) ||
      (t.description && t.description.toLowerCase().includes(q)) ||
      (t.referenceSessionId && t.referenceSessionId.toLowerCase().includes(q))
    );
  }
  list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  res.json(list);
});

app.post('/api/admin/transactions/:id/refund', (req, res) => {
  const { reason = 'Admin authorized satisfaction guarantee refund' } = req.body;
  const originalTx = db.transactions.find(t => t.id === req.params.id);
  if (!originalTx) return res.status(404).json({ error: 'Transaction not found.' });

  if (originalTx.type !== 'consultation_deduction') {
    return res.status(400).json({ error: 'Only consultation charges can be refunded.' });
  }

  // Credit customer wallet
  const customerId = originalTx.userId;
  if (!db.wallets[customerId]) {
    db.wallets[customerId] = { userId: customerId, balance: 0.00, currency: originalTx.currency, updatedAt: new Date().toISOString() };
  }
  const wallet = db.wallets[customerId];
  wallet.balance = parseFloat((wallet.balance + originalTx.amount).toFixed(2));
  wallet.updatedAt = new Date().toISOString();

  const refundTx = {
    id: `tx-rf-${Date.now().toString(36)}`,
    userId: customerId,
    type: 'refund',
    amount: originalTx.amount,
    balanceAfter: wallet.balance,
    currency: originalTx.currency,
    description: `Refund: ${reason} (Ref: ${originalTx.id})`,
    referenceSessionId: originalTx.referenceSessionId,
    status: 'completed',
    timestamp: new Date().toISOString(),
  };
  db.transactions.unshift(refundTx);

  db.notifications.push({
    id: `notif-${Date.now().toString(36)}`,
    userId: customerId,
    title: 'Refund Processed',
    message: `$${originalTx.amount.toFixed(2)} has been credited back to your LUMSIC balance. Reason: ${reason}.`,
    type: 'payment',
    isRead: false,
    timestamp: new Date().toISOString(),
  });

  db.activityLogs.push({
    id: `log-${Date.now().toString(36)}`,
    actorId: 'usr-admin',
    actorName: 'Admin Operations',
    actorRole: 'admin',
    action: 'PROCESS_REFUND',
    details: `Refunded $${originalTx.amount.toFixed(2)} to customer ${customerId}. Reason: ${reason}.`,
    timestamp: new Date().toISOString(),
  });

  saveDatabase();
  res.json({ success: true, refundTransaction: refundTx, currentBalance: wallet.balance });
});

// 30. Admin: Wallet Management (Add/Deduct balance with audit reason)
app.get('/api/admin/wallets', (req, res) => {
  const result: any[] = [];
  for (const [userId, wallet] of Object.entries(db.wallets as Record<string, any>)) {
    const user = db.users.find(u => u.id === userId);
    const reader = db.readers.find(r => r.userId === userId);
    result.push({
      userId,
      name: reader?.name || user?.fullName || 'User',
      email: user?.email || '',
      role: user?.role || (reader ? 'astrologer' : 'customer'),
      astrologerId: reader?.astrologerId,
      balance: wallet.balance,
      currency: wallet.currency || 'USD',
      updatedAt: wallet.updatedAt,
    });
  }
  res.json(result);
});

app.post('/api/admin/wallets/adjust', (req, res) => {
  const { userId, type, amount, reason } = req.body;
  const numAmount = parseFloat(amount);
  if (!userId || !type || isNaN(numAmount) || numAmount <= 0) {
    return res.status(400).json({ error: 'Please provide valid userId, type (credit|debit), and positive amount.' });
  }
  if (!reason || !reason.trim()) {
    return res.status(400).json({ error: 'A mandatory audit reason is required for manual balance adjustments.' });
  }

  if (!db.wallets[userId]) {
    db.wallets[userId] = { userId, balance: 0.00, currency: 'USD', updatedAt: new Date().toISOString() };
  }
  const wallet = db.wallets[userId];

  if (type === 'debit' && wallet.balance < numAmount) {
    return res.status(400).json({ error: `Cannot debit $${numAmount.toFixed(2)}. Current balance is only $${wallet.balance.toFixed(2)}.` });
  }

  wallet.balance = type === 'credit'
    ? parseFloat((wallet.balance + numAmount).toFixed(2))
    : parseFloat((wallet.balance - numAmount).toFixed(2));
  wallet.updatedAt = new Date().toISOString();

  const tx = {
    id: `tx-adj-${Date.now().toString(36)}`,
    userId,
    type: type === 'credit' ? 'deposit' : 'consultation_deduction',
    amount: numAmount,
    balanceAfter: wallet.balance,
    currency: wallet.currency || 'USD',
    description: `Admin manual adjustment (${type.toUpperCase()}): ${reason}`,
    status: 'completed',
    timestamp: new Date().toISOString(),
  };
  db.transactions.unshift(tx);

  db.activityLogs.push({
    id: `log-${Date.now().toString(36)}`,
    actorId: 'usr-admin',
    actorName: 'Admin Operations',
    actorRole: 'admin',
    action: 'WALLET_MANUAL_ADJUSTMENT',
    details: `${type.toUpperCase()} $${numAmount.toFixed(2)} for ${userId}. New balance: $${wallet.balance.toFixed(2)}. Reason: ${reason}`,
    timestamp: new Date().toISOString(),
  });

  saveDatabase();
  res.json({ success: true, wallet, transaction: tx });
});

// 31. Admin: Reader Earnings & Payouts
app.get('/api/admin/payouts', (req, res) => {
  res.json(db.payouts || []);
});

app.post('/api/admin/payouts/:id/approve', (req, res) => {
  const payout = (db.payouts || []).find((p: any) => p.id === req.params.id);
  if (!payout) return res.status(404).json({ error: 'Payout request not found.' });

  payout.status = 'approved';
  payout.processedAt = new Date().toISOString();
  payout.processedBy = 'usr-admin';
  payout.transactionRef = `po_ref_${Date.now().toString(36)}`;

  db.activityLogs.push({
    id: `log-${Date.now().toString(36)}`,
    actorId: 'usr-admin',
    actorName: 'Admin Operations',
    actorRole: 'admin',
    action: 'APPROVE_PAYOUT',
    details: `Approved payout of $${payout.amount.toFixed(2)} to ${payout.readerName} (${payout.paymentMethod}).`,
    timestamp: new Date().toISOString(),
  });

  saveDatabase();
  res.json({ success: true, payout });
});

app.post('/api/admin/payouts/:id/reject', (req, res) => {
  const { reason = 'Banking credentials mismatch' } = req.body;
  const payout = (db.payouts || []).find((p: any) => p.id === req.params.id);
  if (!payout) return res.status(404).json({ error: 'Payout request not found.' });

  payout.status = 'rejected';
  payout.rejectionReason = reason;
  payout.processedAt = new Date().toISOString();
  payout.processedBy = 'usr-admin';

  db.activityLogs.push({
    id: `log-${Date.now().toString(36)}`,
    actorId: 'usr-admin',
    actorName: 'Admin Operations',
    actorRole: 'admin',
    action: 'REJECT_PAYOUT',
    details: `Rejected payout request of $${payout.amount.toFixed(2)} for ${payout.readerName}. Reason: ${reason}`,
    timestamp: new Date().toISOString(),
  });

  saveDatabase();
  res.json({ success: true, payout });
});

// 32. Admin: Categories & Specializations CRUD
app.get('/api/admin/categories', (req, res) => {
  res.json(db.categories || []);
});

app.post('/api/admin/categories', (req, res) => {
  const { name, icon, description, displayOrder } = req.body;
  const newCat = {
    id: `cat-${Date.now().toString(36)}`,
    name,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    icon: icon || 'Sparkles',
    description: description || '',
    displayOrder: parseInt(displayOrder, 10) || (db.categories.length + 1),
    isActive: true,
    readersCount: 0,
  };
  db.categories.push(newCat);
  saveDatabase();
  res.status(201).json(newCat);
});

app.put('/api/admin/categories/:id', (req, res) => {
  const cat = (db.categories || []).find((c: any) => c.id === req.params.id);
  if (!cat) return res.status(404).json({ error: 'Category not found.' });

  const { name, icon, description, displayOrder, isActive } = req.body;
  if (name !== undefined) cat.name = name;
  if (icon !== undefined) cat.icon = icon;
  if (description !== undefined) cat.description = description;
  if (displayOrder !== undefined) cat.displayOrder = parseInt(displayOrder, 10);
  if (isActive !== undefined) cat.isActive = Boolean(isActive);

  saveDatabase();
  res.json({ success: true, category: cat });
});

app.delete('/api/admin/categories/:id', (req, res) => {
  const idx = (db.categories || []).findIndex((c: any) => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Category not found.' });
  const [removed] = db.categories.splice(idx, 1);
  saveDatabase();
  res.json({ success: true, removedId: removed.id });
});

// 33. Admin: Reviews & Ratings Moderation
app.get('/api/admin/reviews', (req, res) => {
  res.json(db.reviews || []);
});

app.patch('/api/admin/reviews/:id/visibility', (req, res) => {
  const review = (db.reviews || []).find((r: any) => r.id === req.params.id);
  if (!review) return res.status(404).json({ error: 'Review not found.' });
  review.isHidden = !review.isHidden;
  saveDatabase();
  res.json({ success: true, isHidden: review.isHidden });
});

app.delete('/api/admin/reviews/:id', (req, res) => {
  const idx = (db.reviews || []).findIndex((r: any) => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Review not found.' });
  const [removed] = db.reviews.splice(idx, 1);
  saveDatabase();
  res.json({ success: true, removedId: removed.id });
});

// 34. Admin: Broadcast Announcements
app.get('/api/admin/broadcasts', (req, res) => {
  res.json(db.broadcasts || []);
});

app.post('/api/admin/broadcasts', (req, res) => {
  const { title, message, target = 'all' } = req.body;
  if (!title || !message) return res.status(400).json({ error: 'Title and message are required.' });

  let targetUsers = db.users;
  if (target === 'customers') targetUsers = db.users.filter(u => u.role === 'customer');
  if (target === 'readers') targetUsers = db.users.filter(u => u.role === 'astrologer');

  for (const u of targetUsers) {
    db.notifications.push({
      id: `notif-${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
      userId: u.id,
      title,
      message,
      type: 'system',
      isRead: false,
      timestamp: new Date().toISOString(),
    });
  }

  const broadcastRecord = {
    id: `bc-${Date.now().toString(36)}`,
    title,
    message,
    target,
    sentBy: 'Admin Operations',
    recipientsCount: targetUsers.length,
    sentAt: new Date().toISOString(),
  };

  db.broadcasts.unshift(broadcastRecord);
  saveDatabase();
  res.status(201).json(broadcastRecord);
});

// 35. Admin: Support & Complaints Tickets
app.get('/api/admin/tickets', (req, res) => {
  res.json(db.tickets || []);
});

app.post('/api/admin/tickets/:id/reply', (req, res) => {
  const { message, status } = req.body;
  const ticket = (db.tickets || []).find((t: any) => t.id === req.params.id);
  if (!ticket) return res.status(404).json({ error: 'Ticket not found.' });

  if (!ticket.responses) ticket.responses = [];
  ticket.responses.push({
    id: `resp-${Date.now().toString(36)}`,
    senderId: 'usr-admin',
    senderName: 'LUMSIC Support Team',
    senderRole: 'admin',
    message,
    timestamp: new Date().toISOString(),
  });

  if (status) ticket.status = status;
  ticket.updatedAt = new Date().toISOString();

  // Send notification to ticket owner
  db.notifications.push({
    id: `notif-${Date.now().toString(36)}`,
    userId: ticket.userId,
    title: `Support Reply on ${ticket.ticketNumber}`,
    message: `Support replied: "${message.substring(0, 80)}..."`,
    type: 'system',
    isRead: false,
    timestamp: new Date().toISOString(),
  });

  saveDatabase();
  res.json({ success: true, ticket });
});

app.patch('/api/admin/tickets/:id/status', (req, res) => {
  const { status } = req.body;
  const ticket = (db.tickets || []).find((t: any) => t.id === req.params.id);
  if (!ticket) return res.status(404).json({ error: 'Ticket not found.' });
  ticket.status = status;
  ticket.updatedAt = new Date().toISOString();
  saveDatabase();
  res.json({ success: true, status: ticket.status });
});

// 36. Admin: Website Content Management
app.get('/api/admin/website-content', (req, res) => {
  res.json(db.websiteContent || INITIAL_WEBSITE_CONTENT);
});

app.put('/api/admin/website-content', (req, res) => {
  db.websiteContent = { ...(db.websiteContent || {}), ...req.body };
  saveDatabase();
  res.json({ success: true, content: db.websiteContent });
});

// 37. Admin: Promotional Coupon Codes
app.get('/api/admin/coupons', (req, res) => {
  res.json(db.coupons || []);
});

app.post('/api/admin/coupons', (req, res) => {
  const { code, discountType, discountValue, minSpend, maxUses, expiresAt } = req.body;
  const newCoupon = {
    id: `cpn-${Date.now().toString(36)}`,
    code: String(code).toUpperCase().trim(),
    discountType: discountType || 'percentage',
    discountValue: parseFloat(discountValue) || 10,
    minSpend: parseFloat(minSpend) || 0,
    maxUses: parseInt(maxUses, 10) || 500,
    usedCount: 0,
    isActive: true,
    expiresAt: expiresAt || '2027-12-31T23:59:59.000Z',
  };
  db.coupons.push(newCoupon);
  saveDatabase();
  res.status(201).json(newCoupon);
});

app.delete('/api/admin/coupons/:id', (req, res) => {
  const idx = (db.coupons || []).findIndex((c: any) => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Coupon not found.' });
  const [removed] = db.coupons.splice(idx, 1);
  saveDatabase();
  res.json({ success: true, removedId: removed.id });
});

// 38. Admin: Staff & Permissions
app.get('/api/admin/staff', (req, res) => {
  res.json(db.staff || []);
});

app.post('/api/admin/staff', (req, res) => {
  const { fullName, email, role, permissions } = req.body;
  const newStaff = {
    id: `stf-${Date.now().toString(36)}`,
    fullName,
    email,
    role: role || 'support',
    status: 'active',
    lastActive: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    permissions: permissions || ['customer_support'],
  };
  db.staff.push(newStaff);
  saveDatabase();
  res.status(201).json(newStaff);
});

app.put('/api/admin/staff/:id', (req, res) => {
  const member = (db.staff || []).find((s: any) => s.id === req.params.id);
  if (!member) return res.status(404).json({ error: 'Staff member not found.' });

  const { fullName, role, status, permissions } = req.body;
  if (fullName !== undefined) member.fullName = fullName;
  if (role !== undefined) member.role = role;
  if (status !== undefined) member.status = status;
  if (permissions !== undefined) member.permissions = permissions;

  saveDatabase();
  res.json({ success: true, staff: member });
});

app.delete('/api/admin/staff/:id', (req, res) => {
  const idx = (db.staff || []).findIndex((s: any) => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Staff member not found.' });
  const [removed] = db.staff.splice(idx, 1);
  saveDatabase();
  res.json({ success: true, removedId: removed.id });
});

// 39. Admin: Activity & Audit Logs
app.get('/api/admin/logs', (req, res) => {
  const { action, actor, limit = 100 } = req.query;
  let logs = [...db.activityLogs];
  if (action) {
    logs = logs.filter(l => l.action.toLowerCase().includes(String(action).toLowerCase()));
  }
  if (actor) {
    logs = logs.filter(l => l.actorName.toLowerCase().includes(String(actor).toLowerCase()) || l.actorId.includes(String(actor)));
  }
  logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  res.json(logs.slice(0, parseInt(String(limit), 10)));
});

// 40. Admin: Reports & Analytics
app.get('/api/admin/reports', (req, res) => {
  const totalRevenue = db.transactions
    .filter(t => t.type === 'consultation_deduction' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const platformCommission = totalRevenue * (db.settings.platformCommissionPercent / 100);
  const readerEarnings = totalRevenue - platformCommission;

  // Category performance
  const categoryStats: Record<string, number> = {};
  for (const c of db.consultations) {
    const topic = c.initialTopic || 'General Life';
    categoryStats[topic] = (categoryStats[topic] || 0) + 1;
  }

  // Reader leaderboard
  const readerLeaderboard = db.readers.map(r => ({
    id: r.id,
    astrologerId: r.astrologerId,
    name: r.name,
    rating: r.rating,
    totalConsultations: r.totalConsultations,
    earningsTotal: r.earningsTotal,
    avatar: r.avatar,
  })).sort((a, b) => b.earningsTotal - a.earningsTotal);

  res.json({
    grossRevenue: parseFloat(totalRevenue.toFixed(2)),
    platformCommission: parseFloat(platformCommission.toFixed(2)),
    readerEarningsLiability: parseFloat(readerEarnings.toFixed(2)),
    totalSessionsCount: db.consultations.length,
    completedSessionsCount: db.consultations.filter(c => c.status === 'completed').length,
    categoryStats,
    readerLeaderboard,
  });
});

// Notifications: User list
app.get('/api/notifications/:userId', (req, res) => {
  const list = (db.notifications || []).filter((n: any) => n.userId === req.params.userId);
  list.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  res.json(list);
});

app.patch('/api/notifications/:id/read', (req, res) => {
  const notif = (db.notifications || []).find((n: any) => n.id === req.params.id);
  if (notif) notif.isRead = true;
  saveDatabase();
  res.json({ success: true });
});

// Reviews: Add from seeker
app.post('/api/reviews', (req, res) => {
  const { sessionId, readerId, customerId, customerName, rating, comment } = req.body;
  const numRating = parseInt(rating, 10);
  if (!numRating || numRating < 1 || numRating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5 stars.' });
  }

  const review = {
    id: `rev-${Date.now().toString(36)}`,
    sessionId,
    readerId,
    customerId,
    customerName,
    rating: numRating,
    comment: comment || 'Verified client consultation.',
    timestamp: new Date().toISOString(),
    isHidden: false,
  };

  db.reviews.push(review);

  // Update session
  const session = db.consultations.find(c => c.id === sessionId);
  if (session) {
    session.rating = numRating;
    session.reviewComment = comment;
  }

  // Recalculate reader average
  const readerReviews = db.reviews.filter(r => r.readerId === readerId && !r.isHidden);
  if (readerReviews.length > 0) {
    const avg = readerReviews.reduce((sum, r) => sum + r.rating, 0) / readerReviews.length;
    const reader = db.readers.find(r => r.id === readerId);
    if (reader) {
      reader.rating = parseFloat(avg.toFixed(2));
      reader.reviewsCount = readerReviews.length;
    }
  }

  saveDatabase();
  res.status(201).json(review);
});

// Settings: Get & Update
app.get('/api/settings', (req, res) => {
  res.json(db.settings);
});

app.put('/api/settings', (req, res) => {
  db.settings = { ...db.settings, ...req.body };
  saveDatabase();
  res.json(db.settings);
});

// -------------------------------------------------------------
// VITE DEV SERVER INTEGRATION
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[LUMSIC Server] listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
