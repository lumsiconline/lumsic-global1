export type UserRole = 'customer' | 'astrologer' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  country: string;
  currency: string;
  timezone: string;
  role: UserRole;
  astrologerId?: string; // e.g. "LUM001" for astrologers
  avatar?: string;
  createdAt: string;
  isSuspended?: boolean;
}

export interface Reader {
  id: string;
  astrologerId: string; // LUM001, LUM002, etc.
  userId: string;
  name: string;
  avatar: string;
  title: string;
  specializations: string[];
  languages: string[];
  experienceYears: number;
  rating: number;
  reviewsCount: number;
  pricePerMinute: number;
  currency: string;
  bio: string;
  isOnline: boolean;
  isBusy: boolean;
  workflowEnabled: boolean; // Admin ON/OFF switch!
  totalConsultations: number;
  earningsTotal: number;
  aboutHtml?: string;
  qualifications?: string[];
  badge?: string;
  waitTimeMinutes?: number;
  inrPrice?: number;
  country?: string;
  city?: string;
  callPricePerMinute?: number;
  videoPricePerMinute?: number;
  workingHours?: string;
  timezone?: string;
  isVerified?: boolean;
  isFeatured?: boolean;
  coverImage?: string;
  introVideoUrl?: string;
  isSuspended?: boolean;
  maxCapacity?: number;
  scheduleJson?: string;
}

export type ConsultationStatus =
  | 'pending'
  | 'accepted'
  | 'active'
  | 'rejected'
  | 'completed'
  | 'cancelled';

export interface TransferRecord {
  fromAstrologerId: string;
  toAstrologerId: string;
  timestamp: string;
  reason: string;
  transferredBy: string;
}

export interface ConsultationSession {
  id: string;
  sessionNumber: string; // e.g. LUM-CS-8391
  customerId: string;
  customerName: string;
  customerEmail: string;
  astrologerId: string; // e.g. LUM001
  readerId: string;
  readerName: string;
  readerAvatar: string;
  status: ConsultationStatus;
  requestedAt: string;
  startedAt?: string;
  endedAt?: string;
  durationSeconds: number;
  pricePerMinute: number;
  totalCost: number;
  transferHistory?: TransferRecord[];
  rating?: number;
  reviewComment?: string;
  initialTopic?: string;
  rejectionReason?: string;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  senderId: string;
  senderRole: 'customer' | 'astrologer' | 'admin' | 'system';
  senderName: string;
  content: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
}

export interface Wallet {
  userId: string;
  balance: number;
  currency: string;
  updatedAt: string;
}

export interface WalletTransaction {
  id: string;
  userId: string;
  type: 'deposit' | 'consultation_deduction' | 'refund' | 'payout';
  amount: number;
  balanceAfter: number;
  currency: string;
  description: string;
  referenceSessionId?: string;
  status: 'completed' | 'pending' | 'failed';
  paymentProvider?: string;
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'session_request' | 'session_accepted' | 'session_rejected' | 'payment' | 'system' | 'workflow';
  isRead: boolean;
  timestamp: string;
  sessionId?: string;
}

export interface ReviewItem {
  id: string;
  sessionId: string;
  readerId: string;
  customerId: string;
  customerName: string;
  rating: number;
  comment: string;
  timestamp: string;
  readerReply?: string;
  replyTimestamp?: string;
}


export interface AppSettings {
  defaultCurrency: string;
  supportedCurrencies: string[];
  platformCommissionPercent: number;
  minWalletBalanceToStart: number;
  categories: string[];
  systemNotice: string;
}

export interface ActivityLog {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole | 'super_admin' | 'manager' | 'finance' | 'support';
  action: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
  targetId?: string;
}

export interface ReaderApplication {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  experienceYears: number;
  primarySkills: string[];
  languages: string[];
  bio: string;
  sampleIntroUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface PayoutRequest {
  id: string;
  readerId: string;
  readerName: string;
  astrologerId: string;
  amount: number;
  currency: string;
  paymentMethod: 'bank_wire' | 'paypal' | 'stripe';
  payoutDetails: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  requestedAt: string;
  processedAt?: string;
  processedBy?: string;
  transactionRef?: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  displayOrder: number;
  isActive: boolean;
  readersCount?: number;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  userEmail: string;
  subject: string;
  category: 'Billing' | 'Consultation Issue' | 'Reader Conduct' | 'Technical' | 'General';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  sessionReferenceId?: string;
  description: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
  responses?: {
    id: string;
    senderId: string;
    senderName: string;
    senderRole: string;
    message: string;
    timestamp: string;
  }[];
}

export interface CouponItem {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minSpend?: number;
  maxUses?: number;
  usedCount: number;
  isActive: boolean;
  expiresAt: string;
}

export interface WebsiteContentSettings {
  heroTagline: string;
  heroHeadline: string;
  heroSubtitle: string;
  announcementActive: boolean;
  announcementText: string;
  announcementLink?: string;
  faqs: {
    id: string;
    question: string;
    answer: string;
    category: string;
  }[];
  termsPolicy: string;
  privacyPolicy: string;
  refundPolicy: string;
}

export interface AdminStaffMember {
  id: string;
  fullName: string;
  email: string;
  role: 'super_admin' | 'manager' | 'finance' | 'support';
  status: 'active' | 'suspended';
  lastActive: string;
  createdAt: string;
  permissions: string[];
}
