import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { Reader, ConsultationSession, ReviewItem, ChatMessage } from '../types';
import { api } from '../lib/api';
import {
  LayoutDashboard,
  User,
  Camera,
  Image as ImageIcon,
  Video,
  Sparkles,
  Inbox,
  MessageSquare,
  Radio,
  History,
  Users,
  DollarSign,
  Wallet,
  CreditCard,
  Power,
  Calendar,
  Star,
  Bell,
  LifeBuoy,
  Settings,
  ShieldCheck,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Trash2,
  RefreshCw,
  Clock,
  Send,
  Check,
  Menu,
  X,
  ExternalLink,
  Lock,
  Eye,
  EyeOff,
  Edit3,
  Search,
  Filter,
  FileText,
  Globe,
  Phone,
  Mail,
  ArrowUpRight,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from 'lucide-react';

interface AstrologerDashboardProps {
  onOpenChat: () => void;
  setCurrentView: (view: string) => void;
}

export type DashboardModule =
  | 'overview' // 1. Dashboard Overview
  | 'profile-mgmt' // 2. My Profile Management
  | 'avatar-crop' // 3. Profile Picture Upload, Crop, Replace, Remove
  | 'cover-video' // 4. Cover Image and Intro Video
  | 'specializations' // 5. Profile Info & Specializations
  | 'requests' // 6. Incoming Consultation Requests
  | 'live-chat' // 7. Live Chat Management
  | 'active-sessions' // 8. Active Consultations
  | 'history' // 9. Consultation History
  | 'clients' // 10. Customer Information
  | 'earnings' // 11. Earnings Dashboard
  | 'wallet' // 12. Wallet and Transactions
  | 'withdrawals' // 13. Withdrawal Requests
  | 'availability' // 14. Availability & Online/Offline
  | 'schedule' // 15. Working Hours & Calendar
  | 'reviews' // 16. Ratings and Reviews
  | 'notifications' // 17. Notifications
  | 'support' // 18. Support and Help
  | 'account' // 19. Account Settings
  | 'security'; // 20. Password & Security Settings

const ALL_CATEGORIES = [
  'Love & Relationships',
  'Tarot Reading',
  'Vedic Astrology',
  'Clairvoyant Psychic',
  'Career & Wealth',
  'Life Direction & Destiny',
  'Energy & Aura Assessment',
  'Nordic Runes & Divination',
  'Numerology',
  'Soulmate & Twin Flame',
  'Chakra Balancing',
  'Dream Interpretation',
];

const WEEKDAYS = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
];

export const AstrologerDashboard: React.FC<AstrologerDashboardProps> = ({
  onOpenChat,
  setCurrentView,
}) => {
  const { user } = useAuth();
  const {
    activeSession,
    pendingRequests,
    acceptRequest,
    rejectRequest,
    endSession,
    sendMessage,
    messages,
    durationSeconds,
    refreshSessions,
  } = useChat();

  const [activeModule, setActiveModule] = useState<DashboardModule>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Core Data State
  const [reader, setReader] = useState<Reader | null>(null);
  const [consultations, setConsultations] = useState<ConsultationSession[]>([]);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Module 2 & 5: Profile Form States
  const [profileName, setProfileName] = useState('');
  const [profileTitle, setProfileTitle] = useState('');
  const [profileBio, setProfileBio] = useState('');
  const [pricePerMin, setPricePerMin] = useState('2.50');
  const [inrPrice, setInrPrice] = useState('36');
  const [callPrice, setCallPrice] = useState('3.50');
  const [videoPrice, setVideoPrice] = useState('4.50');
  const [expYears, setExpYears] = useState('5');
  const [country, setCountry] = useState('United States');
  const [city, setCity] = useState('New York');
  const [languages, setLanguages] = useState<string[]>(['English']);
  const [newLanguageInput, setNewLanguageInput] = useState('');
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [customTagInput, setCustomTagInput] = useState('');
  const [qualifications, setQualifications] = useState<string[]>([]);
  const [newQualInput, setNewQualInput] = useState('');
  const [consultationGreeting, setConsultationGreeting] = useState('');

  // Module 3: Avatar Crop & Reposition States
  const [avatarPreview, setAvatarPreview] = useState('');
  const [avatarZoom, setAvatarZoom] = useState(1);
  const [avatarCropShape, setAvatarCropShape] = useState<'circle' | 'square'>('circle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Module 4: Cover & Video States
  const [coverPreview, setCoverPreview] = useState('');
  const [introVideoUrl, setIntroVideoUrl] = useState('');
  const coverFileInputRef = useRef<HTMLInputElement>(null);

  // Module 6: Rejection Modal
  const [rejectingSessionId, setRejectingSessionId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('Currently in another intensive reading');

  // Module 7: Live Chat Input & Canned Responses
  const [chatInputText, setChatInputText] = useState('');
  const [isEndingSession, setIsEndingSession] = useState(false);
  const chatMessagesEndRef = useRef<HTMLDivElement>(null);

  // Module 9: Transcript Modal
  const [selectedTranscript, setSelectedTranscript] = useState<ConsultationSession | null>(null);
  const [transcriptMessages, setTranscriptMessages] = useState<ChatMessage[]>([]);
  const [isLoadingTranscript, setIsLoadingTranscript] = useState(false);

  // Module 10: Client Notes Modal
  const [clientNotes, setClientNotes] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('lumsic_reader_client_notes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [selectedClientForNotes, setSelectedClientForNotes] = useState<string | null>(null);
  const [clientNoteText, setClientNoteText] = useState('');

  // Module 13: Withdrawal Form
  const [withdrawAmount, setWithdrawAmount] = useState('100.00');
  const [payoutMethod, setPayoutMethod] = useState<'bank_wire' | 'paypal' | 'stripe'>('paypal');
  const [payoutDetails, setPayoutDetails] = useState('');
  const [isSubmittingWithdrawal, setIsSubmittingWithdrawal] = useState(false);

  // Module 15: Weekly Schedule
  const [scheduleData, setScheduleData] = useState<Record<string, { enabled: boolean; start: string; end: string }>>({
    monday: { enabled: true, start: '09:00', end: '19:00' },
    tuesday: { enabled: true, start: '09:00', end: '19:00' },
    wednesday: { enabled: true, start: '09:00', end: '19:00' },
    thursday: { enabled: true, start: '09:00', end: '19:00' },
    friday: { enabled: true, start: '09:00', end: '20:00' },
    saturday: { enabled: true, start: '10:00', end: '18:00' },
    sunday: { enabled: false, start: '10:00', end: '16:00' },
  });
  const [scheduleTimezone, setScheduleTimezone] = useState('America/New_York (UTC-5)');

  // Module 16: Review Reply
  const [replyingReviewId, setReplyingReviewId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // Module 18: Support Ticket Form
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState<'Billing' | 'Technical' | 'Customer Issue' | 'General'>('General');
  const [ticketPriority, setTicketPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [ticketDescription, setTicketDescription] = useState('');
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);

  // Module 19: Account Settings
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);

  // Module 20: Password Security
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Scroll chat to bottom
  useEffect(() => {
    chatMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load Astrologer Data from Backend
  const loadAstrologerData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const allReaders = await api.readers.list();
      const me = allReaders.find(
        r => r.userId === user.id || (user.astrologerId && r.astrologerId === user.astrologerId)
      );

      if (me) {
        setReader(me);
        setProfileName(me.name);
        setProfileTitle(me.title);
        setProfileBio(me.bio || '');
        setPricePerMin(me.pricePerMinute?.toString() || '2.50');
        setInrPrice(me.inrPrice?.toString() || '36');
        setCallPrice(me.callPricePerMinute?.toString() || '3.50');
        setVideoPrice(me.videoPricePerMinute?.toString() || '4.50');
        setExpYears(me.experienceYears?.toString() || '5');
        setCountry(me.country || 'United States');
        setCity(me.city || 'New York');
        setLanguages(me.languages?.length ? me.languages : ['English']);
        setSpecializations(me.specializations || []);
        setQualifications(me.qualifications || []);
        setAvatarPreview(me.avatar || '');
        setCoverPreview(me.coverImage || '');
        setIntroVideoUrl(me.introVideoUrl || '');
        if (me.scheduleJson) {
          try {
            setScheduleData(JSON.parse(me.scheduleJson));
          } catch {
            // keep default
          }
        }
        if (me.timezone) setScheduleTimezone(me.timezone);

        // Fetch reader's withdrawals
        const poList = await api.readers.getWithdrawals(me.id).catch(() => []);
        setWithdrawals(poList);

        // Fetch reader's reviews
        const revList = await api.readers.getReviews(me.id).catch(() => []);
        setReviews(revList);
      }

      // Fetch reader consultations
      const sessions = await api.consultations.list({
        role: 'astrologer',
        userId: user.id,
        astrologerId: user.astrologerId || me?.astrologerId,
      });
      setConsultations(sessions);

      // Fetch reader wallet & transactions
      const w = await api.wallet.get(user.id).catch(() => ({ balance: me?.earningsTotal || 0 }));
      setWalletBalance(w.balance || me?.earningsTotal || 0);

      const txs = await api.wallet.getTransactions(user.id).catch(() => []);
      setTransactions(txs);

      // Fetch reader notifications
      const notifs = await api.notifications.list(user.id).catch(() => []);
      setNotifications(notifs);

      // Fetch reader tickets
      const tix = await api.tickets.list(user.id).catch(() => []);
      setTickets(tix);
    } catch (err: any) {
      console.error('Failed to load astrologer dashboard:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAstrologerData();
  }, [user?.id, user?.astrologerId]);

  // Master Online/Offline Status Toggle
  const handleToggleOnline = async () => {
    if (!reader) return;
    const nextStatus = !reader.isOnline;
    try {
      const res = await api.readers.updateAvailability(reader.id, { isOnline: nextStatus });
      setReader(res.reader);
      showToast(nextStatus ? 'Status updated: You are now ONLINE & receiving seekers' : 'Status updated: You are now OFFLINE');
    } catch (err: any) {
      showToast('Error updating status: ' + err.message);
    }
  };

  // Toggle Busy Status
  const handleToggleBusy = async () => {
    if (!reader) return;
    const nextBusy = !reader.isBusy;
    try {
      const res = await api.readers.updateAvailability(reader.id, { isBusy: nextBusy });
      setReader(res.reader);
      showToast(nextBusy ? 'Busy Mode: ON (New requests paused)' : 'Busy Mode: OFF (Ready for new chats)');
    } catch (err: any) {
      showToast('Error updating busy mode: ' + err.message);
    }
  };

  // Module 2 & 5 Save: Profile & Information
  const handleSaveProfile = async () => {
    if (!reader) return;
    try {
      const updated = await api.readers.updateProfile(reader.id, {
        name: profileName,
        title: profileTitle,
        bio: profileBio,
        pricePerMinute: parseFloat(pricePerMin) || 2.50,
        inrPrice: parseFloat(inrPrice) || 36,
        callPricePerMinute: parseFloat(callPrice) || 0,
        videoPricePerMinute: parseFloat(videoPrice) || 0,
        experienceYears: parseInt(expYears, 10) || 5,
        country,
        city,
        languages,
        specializations,
        qualifications,
        aboutHtml: consultationGreeting,
      });
      setReader(updated.reader);
      showToast('Profile information saved successfully!');
    } catch (err: any) {
      showToast('Error saving profile: ' + err.message);
    }
  };

  // Module 3: Handle Avatar File Upload
  const handleAvatarFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('File size must be under 5MB.');
      return;
    }
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      const base64 = fileReader.result as string;
      setAvatarPreview(base64);
      showToast('Photo loaded in studio. Click Save Photo below to apply.');
    };
    fileReader.readAsDataURL(file);
  };

  const handleSaveAvatar = async () => {
    if (!reader) return;
    try {
      const res = await api.readers.updateProfile(reader.id, { avatar: avatarPreview });
      setReader(res.reader);
      showToast('Profile photo updated successfully!');
    } catch (err: any) {
      showToast('Error updating photo: ' + err.message);
    }
  };

  const handleRemoveAvatar = async () => {
    if (!reader) return;
    const defaultPlaceholder = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80';
    setAvatarPreview(defaultPlaceholder);
    try {
      const res = await api.readers.updateProfile(reader.id, { avatar: defaultPlaceholder });
      setReader(res.reader);
      showToast('Profile picture reset to default.');
    } catch (err: any) {
      showToast('Error resetting photo: ' + err.message);
    }
  };

  // Module 4: Cover Image & Video
  const handleCoverFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      const base64 = fileReader.result as string;
      setCoverPreview(base64);
      showToast('Cover loaded. Click Save Media below.');
    };
    fileReader.readAsDataURL(file);
  };

  const handleSaveMedia = async () => {
    if (!reader) return;
    try {
      const res = await api.readers.updateProfile(reader.id, {
        coverImage: coverPreview,
        introVideoUrl: introVideoUrl.trim(),
      });
      setReader(res.reader);
      showToast('Cover banner & video preferences saved!');
    } catch (err: any) {
      showToast('Error saving media: ' + err.message);
    }
  };

  // Module 6: Accept / Reject Requests
  const handleAcceptRequest = async (sessionId: string) => {
    try {
      await acceptRequest(sessionId);
      showToast('Consultation request accepted! Opening Live Chat...');
      setActiveModule('live-chat');
      refreshSessions();
      loadAstrologerData();
    } catch (err: any) {
      showToast('Failed to accept request: ' + err.message);
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectingSessionId) return;
    try {
      await rejectRequest(rejectingSessionId, rejectionReason);
      setRejectingSessionId(null);
      showToast('Consultation request declined.');
      refreshSessions();
      loadAstrologerData();
    } catch (err: any) {
      showToast('Failed to reject: ' + err.message);
    }
  };

  // Module 7: Send Chat Message
  const handleSendChatMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInputText.trim() || !activeSession) return;
    const text = chatInputText.trim();
    setChatInputText('');
    try {
      await sendMessage(text);
    } catch (err: any) {
      showToast('Failed to send message: ' + err.message);
    }
  };

  // Module 7: End Active Consultation
  const handleEndSession = async () => {
    if (!activeSession) return;
    setIsEndingSession(true);
    try {
      await endSession(activeSession.id);
      showToast('Consultation completed! Earnings added to your LUMSIC balance.');
      refreshSessions();
      await loadAstrologerData();
      setActiveModule('history');
    } catch (err: any) {
      showToast('Error ending session: ' + err.message);
    } finally {
      setIsEndingSession(false);
    }
  };

  // Module 9: View Transcript
  const handleViewTranscript = async (session: ConsultationSession) => {
    setSelectedTranscript(session);
    setIsLoadingTranscript(true);
    try {
      const msgs = await api.chat.getMessages(session.id);
      setTranscriptMessages(msgs);
    } catch {
      setTranscriptMessages([]);
    } finally {
      setIsLoadingTranscript(false);
    }
  };

  // Module 10: Save Customer Note
  const handleSaveClientNote = (customerId: string) => {
    const updated = { ...clientNotes, [customerId]: clientNoteText };
    setClientNotes(updated);
    try {
      localStorage.setItem('lumsic_reader_client_notes', JSON.stringify(updated));
      showToast('Private client consultation note saved.');
      setSelectedClientForNotes(null);
    } catch {
      // quiet
    }
  };

  // Module 13: Submit Withdrawal Request
  const handleSubmitWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reader) return;
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount < 25) {
      showToast('Minimum withdrawal amount is $25.00.');
      return;
    }
    if (amount > walletBalance) {
      showToast(`Cannot withdraw $${amount.toFixed(2)}. Available balance is $${walletBalance.toFixed(2)}.`);
      return;
    }
    if (!payoutDetails.trim()) {
      showToast('Please provide your bank or payout destination details.');
      return;
    }

    setIsSubmittingWithdrawal(true);
    try {
      const res = await api.readers.requestWithdrawal(reader.id, {
        amount,
        paymentMethod: payoutMethod,
        payoutDetails: payoutDetails.trim(),
      });
      showToast('Withdrawal request submitted! Reference: ' + res.payout.id);
      setPayoutDetails('');
      setWithdrawAmount('100.00');
      await loadAstrologerData();
    } catch (err: any) {
      showToast('Failed to request withdrawal: ' + err.message);
    } finally {
      setIsSubmittingWithdrawal(false);
    }
  };

  // Module 15: Save Working Hours & Calendar
  const handleSaveSchedule = async () => {
    if (!reader) return;
    try {
      const scheduleJson = JSON.stringify(scheduleData);
      const res = await api.readers.updateProfile(reader.id, {
        scheduleJson,
        timezone: scheduleTimezone,
      });
      setReader(res.reader);
      showToast('Weekly calendar schedule and availability saved!');
    } catch (err: any) {
      showToast('Error saving schedule: ' + err.message);
    }
  };

  // Module 16: Reply to Review
  const handleSubmitReviewReply = async (reviewId: string) => {
    if (!reader || !replyText.trim()) return;
    try {
      await api.readers.replyReview(reader.id, reviewId, replyText.trim());
      showToast('Thank you reply posted to seeker review!');
      setReplyingReviewId(null);
      setReplyText('');
      await loadAstrologerData();
    } catch (err: any) {
      showToast('Error saving reply: ' + err.message);
    }
  };

  // Module 17: Mark Notification Read
  const handleMarkNotificationRead = async (id: string) => {
    try {
      await api.notifications.markRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch {
      // quiet
    }
  };

  const handleMarkAllNotificationsRead = async () => {
    try {
      for (const n of notifications.filter(item => !item.isRead)) {
        await api.notifications.markRead(n.id);
      }
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      showToast('All notifications marked as read.');
    } catch {
      // quiet
    }
  };

  // Module 18: Submit Support Ticket
  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketDescription.trim() || !user) return;
    setIsSubmittingTicket(true);
    try {
      await api.tickets.create({
        userId: user.id,
        userName: reader?.name || user.fullName,
        userEmail: user.email,
        userRole: 'astrologer',
        subject: ticketSubject.trim(),
        category: ticketCategory,
        priority: ticketPriority,
        description: ticketDescription.trim(),
      });
      showToast('Support ticket dispatched to LUMSIC Operations.');
      setTicketSubject('');
      setTicketDescription('');
      const updatedTix = await api.tickets.list(user.id);
      setTickets(updatedTix);
    } catch (err: any) {
      showToast('Error creating ticket: ' + err.message);
    } finally {
      setIsSubmittingTicket(false);
    }
  };

  // Module 20: Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (newPassword.length < 6) {
      showToast('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match.');
      return;
    }

    try {
      await api.auth.changePassword({
        userId: user.id,
        currentPassword,
        newPassword,
      });
      showToast('Security password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      showToast('Error: ' + err.message);
    }
  };

  // Calculate live session running earnings
  const liveSessionCost = activeSession
    ? ((durationSeconds / 60) * (activeSession.pricePerMinute || reader?.pricePerMinute || 2.50)).toFixed(2)
    : '0.00';

  interface NavItem {
    id: DashboardModule;
    label: string;
    icon: any;
    badge?: number | string;
    badgeColor?: string;
  }

  interface NavGroup {
    group: string;
    items: NavItem[];
  }

  // Navigation Items Grouping
  const navGroups: NavGroup[] = [
    {
      group: 'Core Consultations',
      items: [
        { id: 'overview', label: '1. Overview', icon: LayoutDashboard },
        { id: 'requests', label: '6. Incoming Requests', icon: Inbox, badge: pendingRequests.length },
        { id: 'live-chat', label: '7. Live Chat', icon: MessageSquare, badge: activeSession ? 'ACTIVE' : undefined, badgeColor: 'bg-emerald-500 text-slate-950' },
        { id: 'active-sessions', label: '8. Active Consultations', icon: Radio },
        { id: 'history', label: '9. Session History', icon: History },
        { id: 'clients', label: '10. Seeker Directory', icon: Users },
      ],
    },
    {
      group: 'Profile & Brand',
      items: [
        { id: 'profile-mgmt', label: '2. Profile Details', icon: User },
        { id: 'avatar-crop', label: '3. Profile Picture', icon: Camera },
        { id: 'cover-video', label: '4. Banner & Video', icon: Video },
        { id: 'specializations', label: '5. Specializations', icon: Sparkles },
      ],
    },
    {
      group: 'Earnings & Finances',
      items: [
        { id: 'earnings', label: '11. Earnings Hub', icon: DollarSign },
        { id: 'wallet', label: '12. Wallet & Ledger', icon: Wallet },
        { id: 'withdrawals', label: '13. Payout Requests', icon: CreditCard },
      ],
    },
    {
      group: 'Schedule & Reviews',
      items: [
        { id: 'availability', label: '14. Online Status', icon: Power },
        { id: 'schedule', label: '15. Weekly Hours', icon: Calendar },
        { id: 'reviews', label: '16. Client Reviews', icon: Star, badge: reviews.length },
      ],
    },
    {
      group: 'System & Account',
      items: [
        { id: 'notifications', label: '17. Notifications', icon: Bell, badge: notifications.filter(n => !n.isRead).length || undefined },
        { id: 'support', label: '18. Support Desk', icon: LifeBuoy },
        { id: 'account', label: '19. Account Info', icon: Settings },
        { id: 'security', label: '20. Password & Security', icon: ShieldCheck },
      ],
    },
  ];

  // Compile unique clients
  const uniqueClients = React.useMemo(() => {
    const map = new Map<string, {
      customerId: string;
      customerName: string;
      customerEmail: string;
      sessionsCount: number;
      totalSeconds: number;
      totalSpent: number;
      lastDate: string;
      ratingAvg: number;
    }>();

    consultations.forEach(c => {
      if (!c.customerId) return;
      const existing = map.get(c.customerId) || {
        customerId: c.customerId,
        customerName: c.customerName || 'Seeker',
        customerEmail: c.customerEmail || '',
        sessionsCount: 0,
        totalSeconds: 0,
        totalSpent: 0,
        lastDate: c.requestedAt,
        ratingAvg: 5.0,
      };

      existing.sessionsCount += 1;
      existing.totalSeconds += c.durationSeconds || 0;
      existing.totalSpent += c.totalCost || 0;
      if (new Date(c.requestedAt).getTime() > new Date(existing.lastDate).getTime()) {
        existing.lastDate = c.requestedAt;
      }
      map.set(c.customerId, existing);
    });

    return Array.from(map.values());
  }, [consultations]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-800 border border-amber-500/40 text-amber-300 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in text-sm">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Navigation Bar */}
      <header className="h-16 bg-slate-950 border-b border-slate-800 px-4 lg:px-8 flex items-center justify-between gap-4 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-sm">
              L
            </div>
            <div>
              <span className="font-bold tracking-tight text-white text-lg">LUMSIC</span>
              <span className="hidden sm:inline-block ml-2 text-xs text-amber-400/90 font-medium tracking-wide uppercase px-1.5 py-0.5 bg-amber-400/10 rounded">
                Astrologer Portal
              </span>
            </div>
          </div>
        </div>

        {/* Reader Status & Quick Controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Active Live Chat Badge */}
          {activeSession && (
            <button
              onClick={() => setActiveModule('live-chat')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-semibold hover:bg-emerald-500/30 transition-colors"
            >
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>LIVE: {activeSession.customerName}</span>
              <span className="font-mono tabular-nums">
                ({Math.floor(durationSeconds / 60)}:{(durationSeconds % 60).toString().padStart(2, '0')})
              </span>
            </button>
          )}

          {/* Online / Offline Status Button */}
          <button
            onClick={handleToggleOnline}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              reader?.isOnline
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25'
                : 'bg-rose-500/15 text-rose-400 border border-rose-500/30 hover:bg-rose-500/25'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${reader?.isOnline ? 'bg-emerald-400' : 'bg-rose-400'}`} />
            <span>{reader?.isOnline ? 'Online (Accepting)' : 'Offline'}</span>
          </button>

          {/* Reader Profile Pill */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
            <img
              src={reader?.avatar || avatarPreview || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80'}
              alt={reader?.name || 'Reader'}
              className="w-8 h-8 rounded-full object-cover ring-1 ring-amber-400/50"
            />
            <div className="hidden md:block text-left text-xs leading-tight">
              <div className="font-semibold text-slate-200">{reader?.name || user?.fullName || 'Astrologer'}</div>
              <div className="text-slate-400 font-mono text-[11px]">{reader?.astrologerId || 'LUM001'}</div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <aside
          className={`fixed inset-y-16 left-0 z-30 w-72 bg-slate-950 border-r border-slate-800 overflow-y-auto transform transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-4 space-y-6">
            {navGroups.map((grp, gIdx) => (
              <div key={gIdx} className="space-y-1">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-3 pb-1">
                  {grp.group}
                </div>
                {grp.items.map(item => {
                  const Icon = item.icon;
                  const isActive = activeModule === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveModule(item.id as DashboardModule);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors text-left ${
                        isActive
                          ? 'bg-amber-500/15 text-amber-300 font-semibold border border-amber-500/30'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span
                          className={`ml-2 px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                            item.badgeColor || (typeof item.badge === 'number' && item.badge > 0 ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400')
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}

            {/* Back to Client Site */}
            <div className="pt-4 border-t border-slate-800">
              <button
                onClick={() => setCurrentView('home')}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-900 rounded-lg transition-colors"
              >
                <ExternalLink className="w-4 h-4 text-slate-400" />
                <span>Visit LUMSIC Public Site</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-slate-900 p-4 sm:p-6 lg:p-8">
          {isLoading ? (
            <div className="h-64 flex flex-col items-center justify-center gap-3 text-slate-400">
              <RefreshCw className="w-8 h-8 animate-spin text-amber-400" />
              <p className="text-sm">Connecting to authenticated reader workspace...</p>
            </div>
          ) : (
            <div className="max-w-6xl mx-auto space-y-6">

              {/* ============================================================== */}
              {/* MODULE 1: DASHBOARD OVERVIEW */}
              {/* ============================================================== */}
              {activeModule === 'overview' && (
                <div className="space-y-6">
                  {/* Top Welcome & Summary Header */}
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <img
                        src={reader?.avatar || avatarPreview}
                        alt={reader?.name}
                        className="w-16 h-16 rounded-full object-cover ring-2 ring-amber-400/60 shadow-lg"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h1 className="text-xl sm:text-2xl font-bold text-white">{reader?.name || 'Astrologer'}</h1>
                          <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono border border-amber-500/30">
                            {reader?.astrologerId || 'LUM001'}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-400 mt-1">{reader?.title || 'Psychic Reader & Spiritual Advisor'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        onClick={handleToggleOnline}
                        className={`px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-2 border transition-colors ${
                          reader?.isOnline
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30'
                        }`}
                      >
                        <Power className="w-4 h-4" />
                        <span>{reader?.isOnline ? 'Online (Accepting Seeker Chats)' : 'Offline (Click to Go Online)'}</span>
                      </button>

                      <button
                        onClick={() => setActiveModule('withdrawals')}
                        className="px-4 py-2 text-xs font-semibold rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors flex items-center gap-1.5"
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>Request Payout</span>
                      </button>
                    </div>
                  </div>

                  {/* Active Consultation Alert Banner */}
                  {activeSession && (
                    <div className="bg-gradient-to-r from-emerald-950/80 to-slate-950 border border-emerald-500/50 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 animate-pulse">
                          <Radio className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">Active Consultation in Progress</div>
                          <div className="text-white font-bold">{activeSession.customerName} ({activeSession.sessionNumber})</div>
                          <div className="text-xs text-slate-400 mt-0.5">
                            Duration: <span className="font-mono text-emerald-300 font-bold">{Math.floor(durationSeconds / 60)}m {durationSeconds % 60}s</span> · Running Earned: <span className="font-mono text-amber-300 font-bold">${liveSessionCost}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setActiveModule('live-chat')}
                          className="px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors"
                        >
                          Jump into Live Chat
                        </button>
                        <button
                          onClick={handleEndSession}
                          disabled={isEndingSession}
                          className="px-4 py-2 text-xs font-semibold rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 transition-colors"
                        >
                          End Session
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Incoming Requests Banner if any */}
                  {pendingRequests.length > 0 && (
                    <div className="bg-amber-950/40 border border-amber-500/50 rounded-2xl p-5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
                          <Inbox className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-amber-300">{pendingRequests.length} Pending Seeker Consultation Request(s)</h3>
                          <p className="text-xs text-slate-400">Incoming seekers are waiting for your spiritual reading connection.</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveModule('requests')}
                        className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 transition-colors"
                      >
                        Review Requests
                      </button>
                    </div>
                  )}

                  {/* Metric Stat Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                      <div className="text-xs text-slate-400 flex items-center justify-between">
                        <span>Wallet Balance</span>
                        <Wallet className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div className="text-2xl font-bold font-mono text-emerald-400 mt-2 tabular-nums">
                        ${walletBalance.toFixed(2)}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">Available for instant payout</div>
                    </div>

                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                      <div className="text-xs text-slate-400 flex items-center justify-between">
                        <span>Lifetime Gross</span>
                        <DollarSign className="w-4 h-4 text-amber-400" />
                      </div>
                      <div className="text-2xl font-bold font-mono text-white mt-2 tabular-nums">
                        ${(reader?.earningsTotal || 0).toFixed(2)}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">Total revenue generated</div>
                    </div>

                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                      <div className="text-xs text-slate-400 flex items-center justify-between">
                        <span>Total Consultations</span>
                        <CheckCircle className="w-4 h-4 text-blue-400" />
                      </div>
                      <div className="text-2xl font-bold font-mono text-white mt-2 tabular-nums">
                        {consultations.filter(c => c.status === 'completed').length || reader?.totalConsultations || 0}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">Completed readings</div>
                    </div>

                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                      <div className="text-xs text-slate-400 flex items-center justify-between">
                        <span>Rating & Feedback</span>
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      </div>
                      <div className="text-2xl font-bold font-mono text-amber-400 mt-2 tabular-nums">
                        {(reader?.rating || 5.0).toFixed(1)} <span className="text-xs text-slate-400">/ 5.0</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">{reviews.length || reader?.reviewsCount || 0} verified reviews</div>
                    </div>
                  </div>

                  {/* Operational Settings & Quick Workflow */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <div className="text-xs text-slate-400">Busy Mode Switch</div>
                        <div className="text-sm font-semibold text-white mt-0.5">{reader?.isBusy ? 'Busy (Paused)' : 'Free (Accepting)'}</div>
                      </div>
                      <button
                        onClick={handleToggleBusy}
                        className={`px-3 py-1.5 text-xs rounded-lg font-medium border ${
                          reader?.isBusy ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                      >
                        {reader?.isBusy ? 'Unmark Busy' : 'Mark Busy'}
                      </button>
                    </div>

                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <div className="text-xs text-slate-400">Chat Rate per Min</div>
                        <div className="text-sm font-semibold font-mono text-amber-300 mt-0.5">${reader?.pricePerMinute.toFixed(2)}/min (₹{reader?.inrPrice || 36})</div>
                      </div>
                      <button
                        onClick={() => setActiveModule('profile-mgmt')}
                        className="text-xs text-amber-400 hover:underline flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                    </div>

                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <div className="text-xs text-slate-400">Admin Workflow Status</div>
                        <div className="text-sm font-semibold text-emerald-400 mt-0.5">
                          {reader?.workflowEnabled ? 'Workflow Active' : 'Workflow Off'}
                        </div>
                      </div>
                      <span className="text-xs text-slate-400 font-mono">Reader ID {reader?.astrologerId}</span>
                    </div>
                  </div>

                  {/* Recent Consultations Feed */}
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-sm font-bold text-white uppercase tracking-wider">Recent Consultations</h2>
                      <button
                        onClick={() => setActiveModule('history')}
                        className="text-xs text-amber-400 hover:text-amber-300 transition-colors"
                      >
                        View All Session History →
                      </button>
                    </div>

                    {consultations.length === 0 ? (
                      <div className="text-center py-8 text-slate-400 text-xs">
                        No consultations recorded yet. When seekers book a reading with you, sessions appear here.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="border-b border-slate-800 text-slate-400">
                              <th className="py-2.5 font-medium">Session #</th>
                              <th className="py-2.5 font-medium">Seeker</th>
                              <th className="py-2.5 font-medium">Date & Time</th>
                              <th className="py-2.5 font-medium">Duration</th>
                              <th className="py-2.5 font-medium">Earned</th>
                              <th className="py-2.5 font-medium">Status</th>
                              <th className="py-2.5 font-medium text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                            {consultations.slice(0, 5).map(s => (
                              <tr key={s.id} className="hover:bg-slate-900/50">
                                <td className="py-3 text-amber-300 font-semibold">{s.sessionNumber}</td>
                                <td className="py-3 font-sans text-slate-200">{s.customerName}</td>
                                <td className="py-3 text-slate-400 font-sans text-[11px]">{new Date(s.requestedAt).toLocaleDateString()} {new Date(s.requestedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                <td className="py-3">{Math.floor((s.durationSeconds || 0) / 60)}m {(s.durationSeconds || 0) % 60}s</td>
                                <td className="py-3 text-emerald-400 font-bold">${(s.totalCost || 0).toFixed(2)}</td>
                                <td className="py-3 font-sans">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                                    s.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300' :
                                    s.status === 'active' ? 'bg-blue-500/20 text-blue-300 animate-pulse' :
                                    s.status === 'rejected' ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-800 text-slate-400'
                                  }`}>
                                    {s.status}
                                  </span>
                                </td>
                                <td className="py-3 text-right font-sans">
                                  <button
                                    onClick={() => handleViewTranscript(s)}
                                    className="px-2.5 py-1 text-[11px] rounded bg-slate-800 hover:bg-slate-700 text-slate-200"
                                  >
                                    Transcript
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* MODULE 2: MY PROFILE MANAGEMENT */}
              {/* ============================================================== */}
              {activeModule === 'profile-mgmt' && (
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <User className="w-5 h-5 text-amber-400" />
                      <span>2. My Profile Management</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Configure your public profile identity, international rates, and credentials displayed to seekers worldwide.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Reader ID (System Assigned)</label>
                      <input
                        type="text"
                        disabled
                        value={reader?.astrologerId || 'LUM001'}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-400 font-mono cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Display Name *</label>
                      <input
                        type="text"
                        value={profileName}
                        onChange={e => setProfileName(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-white"
                        placeholder="e.g. Psychic Nikee"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-slate-300 mb-1">Professional Title & Tagline *</label>
                      <input
                        type="text"
                        value={profileTitle}
                        onChange={e => setProfileTitle(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-white"
                        placeholder="e.g. Clairvoyant Empath & Relationship Medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Country</label>
                      <input
                        type="text"
                        value={country}
                        onChange={e => setCountry(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-white"
                        placeholder="e.g. United States"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">City</label>
                      <input
                        type="text"
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-white"
                        placeholder="e.g. New York"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Years of Spiritual Practice / Experience</label>
                      <input
                        type="number"
                        min="1"
                        max="50"
                        value={expYears}
                        onChange={e => setExpYears(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Languages Spoken</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newLanguageInput}
                          onChange={e => setNewLanguageInput(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter' && newLanguageInput.trim()) {
                              e.preventDefault();
                              if (!languages.includes(newLanguageInput.trim())) {
                                setLanguages([...languages, newLanguageInput.trim()]);
                              }
                              setNewLanguageInput('');
                            }
                          }}
                          placeholder="Type language & press Enter"
                          className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-white"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (newLanguageInput.trim() && !languages.includes(newLanguageInput.trim())) {
                              setLanguages([...languages, newLanguageInput.trim()]);
                              setNewLanguageInput('');
                            }
                          }}
                          className="px-3 py-2 bg-slate-800 text-slate-200 text-xs font-medium rounded-xl hover:bg-slate-700"
                        >
                          Add
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {languages.map((l, idx) => (
                          <span key={idx} className="text-xs bg-slate-800 text-slate-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                            {l}
                            <button
                              type="button"
                              onClick={() => setLanguages(languages.filter((_, i) => i !== idx))}
                              className="text-slate-400 hover:text-rose-400"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Rates Matrix */}
                    <div className="md:col-span-2 pt-2 border-t border-slate-800/80">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3">Consultation Rates per Minute</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Chat Price ($ USD/min)</label>
                          <input
                            type="number"
                            step="0.10"
                            value={pricePerMin}
                            onChange={e => setPricePerMin(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Chat INR (₹ INR/min)</label>
                          <input
                            type="number"
                            step="1"
                            value={inrPrice}
                            onChange={e => setInrPrice(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Audio Call ($ USD/min)</label>
                          <input
                            type="number"
                            step="0.10"
                            value={callPrice}
                            onChange={e => setCallPrice(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Video Call ($ USD/min)</label>
                          <input
                            type="number"
                            step="0.10"
                            value={videoPrice}
                            onChange={e => setVideoPrice(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={handleSaveProfile}
                      className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow-lg"
                    >
                      Save Profile Changes
                    </button>
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* MODULE 3: PROFILE PICTURE UPLOAD, CROP, REPLACE & REMOVE */}
              {/* ============================================================== */}
              {activeModule === 'avatar-crop' && (
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Camera className="w-5 h-5 text-amber-400" />
                      <span>3. Profile Picture Studio (Upload, Crop & Replace)</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Upload high-resolution headshots. Position and frame your profile avatar for optimal seeker trust and clarity.
                    </p>
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarFileSelected}
                    accept="image/*"
                    className="hidden"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    {/* Visual Crop / Framing Box */}
                    <div className="flex flex-col items-center justify-center p-6 bg-slate-900 rounded-2xl border border-slate-800">
                      <div
                        className={`relative overflow-hidden border-4 border-amber-400/60 shadow-2xl transition-all ${
                          avatarCropShape === 'circle' ? 'w-56 h-56 rounded-full' : 'w-56 h-56 rounded-2xl'
                        }`}
                      >
                        <img
                          src={avatarPreview || reader?.avatar}
                          alt="Avatar Framing"
                          style={{
                            transform: `scale(${avatarZoom})`,
                            transition: 'transform 0.15s ease-out',
                          }}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Zoom Control */}
                      <div className="w-full max-w-xs mt-6 space-y-2">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span className="flex items-center gap-1"><ZoomOut className="w-3.5 h-3.5" /> Zoom</span>
                          <span className="font-mono text-amber-400">{avatarZoom.toFixed(1)}x</span>
                          <span className="flex items-center gap-1"><ZoomIn className="w-3.5 h-3.5" /></span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="2.5"
                          step="0.1"
                          value={avatarZoom}
                          onChange={e => setAvatarZoom(parseFloat(e.target.value))}
                          className="w-full accent-amber-500"
                        />
                      </div>

                      {/* Shape toggle */}
                      <div className="flex gap-2 mt-4">
                        <button
                          type="button"
                          onClick={() => setAvatarCropShape('circle')}
                          className={`px-3 py-1 text-xs rounded-lg border ${
                            avatarCropShape === 'circle' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                        >
                          Circular Frame
                        </button>
                        <button
                          type="button"
                          onClick={() => setAvatarCropShape('square')}
                          className={`px-3 py-1 text-xs rounded-lg border ${
                            avatarCropShape === 'square' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                        >
                          Rounded Square
                        </button>
                      </div>
                    </div>

                    {/* Action Controls */}
                    <div className="space-y-4">
                      <div className="bg-slate-900 border border-slate-800/80 rounded-xl p-4">
                        <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Photo Quality Guidelines</h3>
                        <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
                          <li>Well-lit front-facing portrait with a calm, inviting aura.</li>
                          <li>Avoid sunglasses, heavy filters, or group photos.</li>
                          <li>PNG, JPG, or WEBP supported up to 5MB.</li>
                        </ul>
                      </div>

                      <div className="flex flex-col gap-2.5">
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-xs transition-colors flex items-center justify-center gap-2 border border-slate-700"
                        >
                          <Camera className="w-4 h-4 text-amber-400" />
                          <span>Choose New Photo from Device</span>
                        </button>

                        <button
                          onClick={handleSaveAvatar}
                          className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow-md flex items-center justify-center gap-2"
                        >
                          <Check className="w-4 h-4" />
                          <span>Save & Publish Profile Picture</span>
                        </button>

                        <button
                          onClick={handleRemoveAvatar}
                          className="w-full py-2 rounded-xl bg-slate-900 hover:bg-rose-950/40 text-rose-400 text-xs transition-colors border border-rose-900/40 flex items-center justify-center gap-1.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Reset to Default Avatar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* MODULE 4: COVER IMAGE & INTRO VIDEO */}
              {/* ============================================================== */}
              {activeModule === 'cover-video' && (
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Video className="w-5 h-5 text-amber-400" />
                      <span>4. Cover Image and Introduction Video Upload</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Elevate your reader profile banner with a mystical backdrop and introduce your reading style through video.
                    </p>
                  </div>

                  <input
                    type="file"
                    ref={coverFileInputRef}
                    onChange={handleCoverFileSelected}
                    accept="image/*"
                    className="hidden"
                  />

                  {/* Cover Banner Preview */}
                  <div className="space-y-3">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">Profile Cover Banner</label>
                    <div className="relative h-48 w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-900">
                      {coverPreview ? (
                        <img src={coverPreview} alt="Cover Banner" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 gap-2 bg-gradient-to-r from-purple-950/30 to-amber-950/20">
                          <ImageIcon className="w-8 h-8 text-slate-600" />
                          <span className="text-xs">No cover image uploaded yet</span>
                        </div>
                      )}
                      <div className="absolute bottom-3 right-3 flex gap-2">
                        <button
                          onClick={() => coverFileInputRef.current?.click()}
                          className="px-3 py-1.5 rounded-lg bg-slate-950/80 backdrop-blur text-white text-xs font-semibold hover:bg-slate-900 border border-slate-700 flex items-center gap-1.5"
                        >
                          <Camera className="w-3.5 h-3.5 text-amber-400" />
                          <span>Upload Banner</span>
                        </button>
                        {coverPreview && (
                          <button
                            onClick={() => setCoverPreview('')}
                            className="px-3 py-1.5 rounded-lg bg-rose-950/80 backdrop-blur text-rose-300 text-xs font-semibold hover:bg-rose-900 border border-rose-800"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Intro Video URL */}
                  <div className="space-y-3 pt-4 border-t border-slate-800">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                      Spiritual Introduction Video
                    </label>
                    <p className="text-xs text-slate-400">
                      Provide a direct video link (MP4, YouTube, or Vimeo) where seekers can hear your voice and feel your reading aura.
                    </p>
                    <input
                      type="url"
                      value={introVideoUrl}
                      onChange={e => setIntroVideoUrl(e.target.value)}
                      placeholder="https://example.com/videos/nikee-intro.mp4 or YouTube link"
                      className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono"
                    />

                    {introVideoUrl && (
                      <div className="mt-3 p-3 bg-slate-900 rounded-xl border border-slate-800">
                        <span className="text-[11px] text-amber-400 font-semibold uppercase tracking-wider block mb-2">Video Embed Preview</span>
                        <div className="aspect-video w-full rounded-lg overflow-hidden bg-black flex items-center justify-center">
                          {introVideoUrl.includes('youtube.com') || introVideoUrl.includes('youtu.be') ? (
                            <iframe
                              src={introVideoUrl.replace('watch?v=', 'embed/')}
                              title="Intro Video"
                              className="w-full h-full border-0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          ) : (
                            <video src={introVideoUrl} controls className="w-full h-full object-cover">
                              Your browser does not support the video tag.
                            </video>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={handleSaveMedia}
                      className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow-lg"
                    >
                      Save Cover & Video Media
                    </button>
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* MODULE 5: PROFILE INFO & SPECIALIZATIONS */}
              {/* ============================================================== */}
              {activeModule === 'specializations' && (
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-400" />
                      <span>5. Profile Information, Bio & Specializations</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Highlight your spiritual disciplines, esoteric mastery, and welcoming consultation message.
                    </p>
                  </div>

                  {/* Biography */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                      Public Biography & Spiritual Background
                    </label>
                    <textarea
                      rows={5}
                      value={profileBio}
                      onChange={e => setProfileBio(e.target.value)}
                      placeholder="Share your spiritual journey, reading style, how you channel intuitive insights, and what seekers can anticipate during a consultation..."
                      className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl p-3 text-xs text-white resize-y"
                    />
                    <div className="text-[11px] text-slate-400 text-right">{profileBio.length} characters</div>
                  </div>

                  {/* Consultation Greeting Message */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                      Consultation Greeting / Initial Welcome Note
                    </label>
                    <input
                      type="text"
                      value={consultationGreeting}
                      onChange={e => setConsultationGreeting(e.target.value)}
                      placeholder="e.g. Welcome! Please share your full name, date of birth, and what question weighs on your heart today."
                      className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-white"
                    />
                  </div>

                  {/* Specializations Tag Picker */}
                  <div className="space-y-3 pt-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                      Specializations & Divination Categories
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {ALL_CATEGORIES.map(cat => {
                        const isSelected = specializations.includes(cat);
                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setSpecializations(specializations.filter(s => s !== cat));
                              } else {
                                setSpecializations([...specializations, cat]);
                              }
                            }}
                            className={`px-3 py-1.5 text-xs rounded-xl font-medium border transition-colors ${
                              isSelected
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-semibold'
                                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                            }`}
                          >
                            {isSelected ? '✓ ' : '+ '}{cat}
                          </button>
                        );
                      })}
                    </div>

                    {/* Custom Tag Input */}
                    <div className="flex gap-2 pt-2">
                      <input
                        type="text"
                        value={customTagInput}
                        onChange={e => setCustomTagInput(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter' && customTagInput.trim()) {
                            e.preventDefault();
                            if (!specializations.includes(customTagInput.trim())) {
                              setSpecializations([...specializations, customTagInput.trim()]);
                            }
                            setCustomTagInput('');
                          }
                        }}
                        placeholder="Add custom specialization (e.g. Akashic Records)"
                        className="bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl px-3.5 py-2 text-xs text-white w-72"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (customTagInput.trim() && !specializations.includes(customTagInput.trim())) {
                            setSpecializations([...specializations, customTagInput.trim()]);
                            setCustomTagInput('');
                          }
                        }}
                        className="px-4 py-2 bg-slate-800 text-slate-200 text-xs font-semibold rounded-xl hover:bg-slate-700"
                      >
                        Add Tag
                      </button>
                    </div>
                  </div>

                  {/* Qualifications */}
                  <div className="space-y-3 pt-4 border-t border-slate-800">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                      Certifications & Qualifications
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newQualInput}
                        onChange={e => setNewQualInput(e.target.value)}
                        placeholder="e.g. Certified Tarot Master - Builders of the Adytum (2018)"
                        className="flex-1 bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl px-3.5 py-2 text-xs text-white"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newQualInput.trim() && !qualifications.includes(newQualInput.trim())) {
                            setQualifications([...qualifications, newQualInput.trim()]);
                            setNewQualInput('');
                          }
                        }}
                        className="px-4 py-2 bg-slate-800 text-slate-200 text-xs font-semibold rounded-xl hover:bg-slate-700"
                      >
                        Add Qualification
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      {qualifications.map((q, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
                          <span>{q}</span>
                          <button
                            type="button"
                            onClick={() => setQualifications(qualifications.filter((_, i) => i !== idx))}
                            className="text-slate-400 hover:text-rose-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={handleSaveProfile}
                      className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow-lg"
                    >
                      Save Specializations & Info
                    </button>
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* MODULE 6: INCOMING CONSULTATION REQUESTS */}
              {/* ============================================================== */}
              {activeModule === 'requests' && (
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Inbox className="w-5 h-5 text-amber-400" />
                        <span>6. Incoming Consultation Requests</span>
                      </h2>
                      <p className="text-xs text-slate-400 mt-1">
                        Seekers currently in queue waiting to begin a private reading with you.
                      </p>
                    </div>
                    <button
                      onClick={refreshSessions}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Refresh Queue</span>
                    </button>
                  </div>

                  {pendingRequests.length === 0 ? (
                    <div className="py-12 flex flex-col items-center justify-center text-center text-slate-400 gap-3 border border-dashed border-slate-800 rounded-2xl">
                      <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-amber-400">
                        <Clock className="w-6 h-6" />
                      </div>
                      <h3 className="text-sm font-semibold text-slate-200">No Pending Requests at this moment</h3>
                      <p className="text-xs max-w-md text-slate-400">
                        Ensure your status is set to <span className="text-emerald-400 font-semibold">Online</span> so seekers browsing the LUMSIC catalog can connect with you.
                      </p>
                      {!reader?.isOnline && (
                        <button
                          onClick={handleToggleOnline}
                          className="mt-2 px-4 py-2 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-emerald-400"
                        >
                          Turn Online Now
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pendingRequests.map(req => (
                        <div
                          key={req.id}
                          className="bg-slate-900 border border-amber-500/40 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-base border border-amber-400/30">
                              {req.customerName.charAt(0)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white text-sm">{req.customerName}</span>
                                <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                                  {req.sessionNumber}
                                </span>
                              </div>
                              <p className="text-xs text-slate-300 mt-1">
                                Topic: <span className="text-amber-300 font-medium">{req.initialTopic || 'General Love & Life Guidance'}</span>
                              </p>
                              <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                                Rate: ${req.pricePerMinute || reader?.pricePerMinute}/min · Requested at {new Date(req.requestedAt).toLocaleTimeString()}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 w-full sm:w-auto">
                            <button
                              onClick={() => handleAcceptRequest(req.id)}
                              className="flex-1 sm:flex-none px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-colors shadow-lg flex items-center justify-center gap-1.5"
                            >
                              <Check className="w-4 h-4" />
                              <span>Accept & Start Chat</span>
                            </button>
                            <button
                              onClick={() => setRejectingSessionId(req.id)}
                              className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-800 hover:bg-rose-950/40 text-rose-400 text-xs font-semibold rounded-xl transition-colors border border-slate-700"
                            >
                              Decline
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Rejection Modal */}
                  {rejectingSessionId && (
                    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4">
                        <h3 className="text-sm font-bold text-white">Decline Consultation Request</h3>
                        <p className="text-xs text-slate-400">
                          Please select a polite reason. The seeker will be promptly refunded and notified to choose another available reader.
                        </p>
                        <select
                          value={rejectionReason}
                          onChange={e => setRejectionReason(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                        >
                          <option value="Currently in another intensive reading">Currently in another intensive reading</option>
                          <option value="Stepping away for spiritual grounding / break">Stepping away for spiritual grounding / break</option>
                          <option value="Inquiry falls outside reader specialization">Inquiry falls outside reader specialization</option>
                          <option value="Temporary network/connectivity latency">Temporary network/connectivity latency</option>
                        </select>
                        <div className="flex justify-end gap-2 pt-2">
                          <button
                            onClick={() => setRejectingSessionId(null)}
                            className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleConfirmReject}
                            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl"
                          >
                            Confirm Decline
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ============================================================== */}
              {/* MODULE 7: LIVE CHAT MANAGEMENT */}
              {/* ============================================================== */}
              {activeModule === 'live-chat' && (
                <div className="bg-slate-950 border border-slate-800 rounded-2xl flex flex-col h-[700px] overflow-hidden shadow-2xl">
                  {/* Chat Session Header */}
                  <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center">
                          {activeSession?.customerName?.charAt(0) || 'S'}
                        </div>
                        {activeSession && <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-slate-900" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{activeSession?.customerName || 'No Active Consultation'}</span>
                          {activeSession && (
                            <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                              {activeSession.sessionNumber}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {activeSession ? (
                            <span>Topic: <span className="text-amber-300 font-medium">{activeSession.initialTopic || 'General Clarity'}</span></span>
                          ) : (
                            'Waiting for incoming request acceptance'
                          )}
                        </div>
                      </div>
                    </div>

                    {activeSession ? (
                      <div className="flex items-center gap-4">
                        {/* Live Timer & Accrued Earnings */}
                        <div className="text-right">
                          <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Consultation Duration</div>
                          <div className="text-sm font-bold font-mono text-emerald-400 tabular-nums">
                            {Math.floor(durationSeconds / 60)}:{(durationSeconds % 60).toString().padStart(2, '0')}
                            <span className="text-slate-400 font-normal ml-1">(${liveSessionCost})</span>
                          </div>
                        </div>

                        <button
                          onClick={handleEndSession}
                          disabled={isEndingSession}
                          className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl transition-colors shadow flex items-center gap-1.5"
                        >
                          <Power className="w-3.5 h-3.5" />
                          <span>{isEndingSession ? 'Finalizing...' : 'End Consultation'}</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setActiveModule('requests')}
                        className="px-3.5 py-1.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-amber-400"
                      >
                        View Queue ({pendingRequests.length})
                      </button>
                    )}
                  </div>

                  {/* Chat Messages Feed */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-950/60">
                    {!activeSession ? (
                      <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 gap-3">
                        <MessageSquare className="w-10 h-10 text-slate-600" />
                        <h3 className="text-sm font-semibold text-slate-300">Live Reading Consultation Studio</h3>
                        <p className="text-xs max-w-sm text-slate-400">
                          When you accept an incoming seeker request, the interactive chat session loads here with real-time timers and per-minute revenue metering.
                        </p>
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="py-8 text-center text-xs text-slate-400">
                        Consultation session initiated. Send a warm greeting to your seeker below.
                      </div>
                    ) : (
                      messages.map((m, idx) => {
                        const isMe = m.senderRole === 'astrologer';
                        return (
                          <div
                            key={idx}
                            className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                          >
                            <span className="text-[10px] text-slate-400 mb-1 px-1">
                              {isMe ? 'You (Astrologer)' : m.senderName} · {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <div
                              className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                                isMe
                                  ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-none'
                                  : 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700'
                              }`}
                            >
                              {m.content}
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={chatMessagesEndRef} />
                  </div>

                  {/* Quick Canned Responses Bar */}
                  {activeSession && (
                    <div className="px-4 py-2 bg-slate-900/90 border-t border-slate-800 flex items-center gap-2 overflow-x-auto text-[11px] whitespace-nowrap">
                      <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider shrink-0">Quick Answers:</span>
                      <button
                        onClick={() => setChatInputText('Greetings! Please share your first name and birth date so I can tune into your energy.')}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg shrink-0"
                      >
                        👋 Welcome & Birthdate
                      </button>
                      <button
                        onClick={() => setChatInputText('I am currently drawing cards from the Tarot deck for your inquiry; hold that intention in your thoughts.')}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg shrink-0"
                      >
                        🔮 Drawing Tarot Spread
                      </button>
                      <button
                        onClick={() => setChatInputText('The celestial transits show pivotal harmony approaching in your 7th house within the next cycle.')}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg shrink-0"
                      >
                        ⭐ Planetary Transition
                      </button>
                    </div>
                  )}

                  {/* Message Input Bar */}
                  <form onSubmit={handleSendChatMessage} className="p-4 bg-slate-900 border-t border-slate-800 flex items-center gap-3">
                    <input
                      type="text"
                      disabled={!activeSession}
                      value={chatInputText}
                      onChange={e => setChatInputText(e.target.value)}
                      placeholder={activeSession ? 'Type spiritual guidance message... (Press Enter)' : 'Consultation inactive'}
                      className="flex-1 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-xs text-white disabled:opacity-50"
                    />
                    <button
                      type="submit"
                      disabled={!activeSession || !chatInputText.trim()}
                      className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow"
                    >
                      <span>Send</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              )}

              {/* ============================================================== */}
              {/* MODULE 8: ACTIVE CONSULTATIONS */}
              {/* ============================================================== */}
              {activeModule === 'active-sessions' && (
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Radio className="w-5 h-5 text-emerald-400" />
                      <span>8. Active Consultations Overview</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Live status monitor of ongoing client consultations and active session meters.
                    </p>
                  </div>

                  {activeSession ? (
                    <div className="bg-slate-900 border border-emerald-500/50 rounded-2xl p-6 space-y-4 shadow-xl">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xl flex items-center justify-center ring-2 ring-emerald-500/40">
                            {activeSession.customerName.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-base font-bold text-white">{activeSession.customerName}</h3>
                              <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono font-bold animate-pulse">
                                IN SESSION
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5">Session ID: <span className="font-mono text-slate-300">{activeSession.sessionNumber}</span></p>
                            <p className="text-xs text-amber-300 mt-0.5">Reading Topic: {activeSession.initialTopic || 'General Love & Life Guidance'}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-xs text-slate-400 font-semibold uppercase">Elapsed Duration</div>
                          <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
                            {Math.floor(durationSeconds / 60)}:{(durationSeconds % 60).toString().padStart(2, '0')}
                          </div>
                          <div className="text-xs font-mono text-amber-300 mt-0.5">
                            Earned: ${liveSessionCost}
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                        <button
                          onClick={() => setActiveModule('live-chat')}
                          className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-colors shadow"
                        >
                          Open Live Chat Studio
                        </button>
                        <button
                          onClick={handleEndSession}
                          disabled={isEndingSession}
                          className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl transition-colors"
                        >
                          Conclude Consultation
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="py-12 text-center text-slate-400 text-xs border border-dashed border-slate-800 rounded-2xl space-y-2">
                      <Radio className="w-8 h-8 mx-auto text-slate-600" />
                      <p className="font-semibold text-slate-300">No active reading in progress</p>
                      <p>You can accept incoming requests from the Requests tab to launch an active session.</p>
                    </div>
                  )}
                </div>
              )}

              {/* ============================================================== */}
              {/* MODULE 9: CONSULTATION HISTORY & TRANSCRIPTS */}
              {/* ============================================================== */}
              {activeModule === 'history' && (
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <History className="w-5 h-5 text-amber-400" />
                        <span>9. Consultation History & Transcripts</span>
                      </h2>
                      <p className="text-xs text-slate-400 mt-1">
                        Historical record of all consultations with verified durations, payouts, and chat transcripts.
                      </p>
                    </div>
                    <span className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                      Total Records: {consultations.length}
                    </span>
                  </div>

                  {consultations.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 text-xs border border-dashed border-slate-800 rounded-2xl">
                      No consultation records found.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-400">
                            <th className="py-3 font-medium">Session #</th>
                            <th className="py-3 font-medium">Seeker Name</th>
                            <th className="py-3 font-medium">Date</th>
                            <th className="py-3 font-medium">Duration</th>
                            <th className="py-3 font-medium">Rate</th>
                            <th className="py-3 font-medium">Total Earned</th>
                            <th className="py-3 font-medium">Rating</th>
                            <th className="py-3 font-medium">Status</th>
                            <th className="py-3 font-medium text-right">Transcript</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                          {consultations.map(c => (
                            <tr key={c.id} className="hover:bg-slate-900/50">
                              <td className="py-3 text-amber-300 font-semibold">{c.sessionNumber}</td>
                              <td className="py-3 font-sans text-slate-200">{c.customerName}</td>
                              <td className="py-3 text-slate-400 font-sans text-[11px]">{new Date(c.requestedAt).toLocaleDateString()}</td>
                              <td className="py-3">{Math.floor((c.durationSeconds || 0) / 60)}m {(c.durationSeconds || 0) % 60}s</td>
                              <td className="py-3">${(c.pricePerMinute || 2.50).toFixed(2)}/m</td>
                              <td className="py-3 text-emerald-400 font-bold">${(c.totalCost || 0).toFixed(2)}</td>
                              <td className="py-3 font-sans">
                                {c.rating ? (
                                  <span className="text-amber-400 flex items-center gap-1">
                                    ★ {c.rating}
                                  </span>
                                ) : (
                                  <span className="text-slate-400">—</span>
                                )}
                              </td>
                              <td className="py-3 font-sans">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                                  c.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300' :
                                  c.status === 'rejected' ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-800 text-slate-400'
                                }`}>
                                  {c.status}
                                </span>
                              </td>
                              <td className="py-3 text-right font-sans">
                                <button
                                  onClick={() => handleViewTranscript(c)}
                                  className="px-3 py-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
                                >
                                  View Log
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Transcript Viewer Modal */}
                  {selectedTranscript && (
                    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
                      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl">
                        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-bold text-white">
                              Transcript: {selectedTranscript.sessionNumber} ({selectedTranscript.customerName})
                            </h3>
                            <div className="text-xs text-slate-400 font-mono mt-0.5">
                              {new Date(selectedTranscript.requestedAt).toLocaleString()} · Duration: {Math.floor((selectedTranscript.durationSeconds || 0) / 60)}m
                            </div>
                          </div>
                          <button
                            onClick={() => setSelectedTranscript(null)}
                            className="p-1.5 text-slate-400 hover:text-white rounded-lg"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-950">
                          {isLoadingTranscript ? (
                            <div className="py-12 text-center text-xs text-slate-400">Loading transcript messages...</div>
                          ) : transcriptMessages.length === 0 ? (
                            <div className="py-12 text-center text-xs text-slate-400">No chat messages recorded in this consultation.</div>
                          ) : (
                            transcriptMessages.map((m, i) => (
                              <div key={i} className={`flex flex-col ${m.senderRole === 'astrologer' ? 'items-end' : 'items-start'}`}>
                                <span className="text-[10px] text-slate-400 mb-0.5">{m.senderName} ({m.senderRole})</span>
                                <div className={`max-w-[80%] rounded-xl px-3.5 py-2 text-xs leading-relaxed ${
                                  m.senderRole === 'astrologer' ? 'bg-amber-500 text-slate-950 font-medium' : 'bg-slate-800 text-slate-200'
                                }`}>
                                  {m.content}
                                </div>
                              </div>
                            ))
                          )}
                        </div>

                        <div className="p-4 border-t border-slate-800 flex justify-end">
                          <button
                            onClick={() => setSelectedTranscript(null)}
                            className="px-4 py-2 bg-slate-800 text-slate-200 text-xs font-semibold rounded-xl hover:bg-slate-700"
                          >
                            Close Transcript
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ============================================================== */}
              {/* MODULE 10: CUSTOMER INFORMATION */}
              {/* ============================================================== */}
              {activeModule === 'clients' && (
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Users className="w-5 h-5 text-amber-400" />
                      <span>10. Customer Information & Seeker Directory</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Directory of clients who have consulted with you. Maintain private notes on their astrology charts and tarot spreads.
                    </p>
                  </div>

                  {uniqueClients.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 text-xs border border-dashed border-slate-800 rounded-2xl">
                      No customer records yet. Once seekers complete consultations with you, they are added to your client roster.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-400">
                            <th className="py-3 font-medium">Client</th>
                            <th className="py-3 font-medium">Total Sessions</th>
                            <th className="py-3 font-medium">Total Time</th>
                            <th className="py-3 font-medium">Total Spent</th>
                            <th className="py-3 font-medium">Last Reading</th>
                            <th className="py-3 font-medium">Private Notes</th>
                            <th className="py-3 font-medium text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                          {uniqueClients.map(c => {
                            const hasNote = Boolean(clientNotes[c.customerId]);
                            return (
                              <tr key={c.customerId} className="hover:bg-slate-900/50">
                                <td className="py-3 font-sans text-slate-200">
                                  <div className="font-semibold">{c.customerName}</div>
                                  <div className="text-[11px] text-slate-400 font-mono">{c.customerId}</div>
                                </td>
                                <td className="py-3">{c.sessionsCount} session(s)</td>
                                <td className="py-3">{Math.floor(c.totalSeconds / 60)}m</td>
                                <td className="py-3 text-emerald-400 font-bold">${c.totalSpent.toFixed(2)}</td>
                                <td className="py-3 text-slate-400 font-sans text-[11px]">{new Date(c.lastDate).toLocaleDateString()}</td>
                                <td className="py-3 font-sans text-xs">
                                  {hasNote ? (
                                    <span className="text-amber-300 truncate max-w-xs block">
                                      {clientNotes[c.customerId].substring(0, 45)}...
                                    </span>
                                  ) : (
                                    <span className="text-slate-400 italic">No notes</span>
                                  )}
                                </td>
                                <td className="py-3 text-right font-sans">
                                  <button
                                    onClick={() => {
                                      setSelectedClientForNotes(c.customerId);
                                      setClientNoteText(clientNotes[c.customerId] || '');
                                    }}
                                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs"
                                  >
                                    {hasNote ? 'Edit Notes' : '+ Add Note'}
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Customer Notes Modal */}
                  {selectedClientForNotes && (
                    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-5 space-y-4">
                        <h3 className="text-sm font-bold text-white">Private Reader Notes on Seeker</h3>
                        <p className="text-xs text-slate-400">
                          Only you can read these notes. Record astrological placements, tarot spread cards, or life updates for subsequent readings.
                        </p>
                        <textarea
                          rows={6}
                          value={clientNoteText}
                          onChange={e => setClientNoteText(e.target.value)}
                          placeholder="e.g. Natal Sun in Scorpio, Moon in Pisces. Inquired about career path at start-up. Pulled The Chariot & Wheel of Fortune."
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setSelectedClientForNotes(null)}
                            className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveClientNote(selectedClientForNotes)}
                            className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl"
                          >
                            Save Note
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ============================================================== */}
              {/* MODULE 11: EARNINGS DASHBOARD */}
              {/* ============================================================== */}
              {activeModule === 'earnings' && (
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-amber-400" />
                        <span>11. Earnings Dashboard & Financial Analytics</span>
                      </h2>
                      <p className="text-xs text-slate-400 mt-1">
                        Breakdown of reader compensation, platform split (80% Reader / 20% Platform), and withdrawable balance.
                      </p>
                    </div>

                    <button
                      onClick={() => setActiveModule('withdrawals')}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl"
                    >
                      Request Payout
                    </button>
                  </div>

                  {/* Earnings Key Figures */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                      <div className="text-xs text-slate-400">Available Wallet Balance</div>
                      <div className="text-2xl font-bold font-mono text-emerald-400 mt-2 tabular-nums">${walletBalance.toFixed(2)}</div>
                      <div className="text-[11px] text-slate-400 mt-1">Ready for withdrawal</div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                      <div className="text-xs text-slate-400">Lifetime Gross Consultations</div>
                      <div className="text-2xl font-bold font-mono text-white mt-2 tabular-nums">
                        ${(reader?.earningsTotal || 0).toFixed(2)}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">All time gross billings</div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                      <div className="text-xs text-slate-400">Reader Net Share (80%)</div>
                      <div className="text-2xl font-bold font-mono text-amber-400 mt-2 tabular-nums">
                        ${((reader?.earningsTotal || 0) * 0.8).toFixed(2)}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">After 20% LUMSIC fee</div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                      <div className="text-xs text-slate-400">Pending Withdrawals</div>
                      <div className="text-2xl font-bold font-mono text-slate-300 mt-2 tabular-nums">
                        ${withdrawals.filter(w => w.status === 'pending').reduce((sum, w) => sum + (w.amount || 0), 0).toFixed(2)}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">In processing queue</div>
                    </div>
                  </div>

                  {/* Performance Indicators */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Earnings Distribution & Metrics</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div>
                        <span className="text-slate-400 block mb-1">Average Session Duration</span>
                        <span className="text-sm font-bold font-mono text-white">
                          {consultations.length > 0
                            ? `${Math.round(consultations.reduce((sum, c) => sum + (c.durationSeconds || 0), 0) / consultations.length / 60)} minutes`
                            : '12 minutes'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block mb-1">Average Consultation Value</span>
                        <span className="text-sm font-bold font-mono text-emerald-400">
                          {consultations.length > 0
                            ? `$${(consultations.reduce((sum, c) => sum + (c.totalCost || 0), 0) / consultations.length).toFixed(2)}`
                            : '$30.00'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block mb-1">Payout Processing Cadence</span>
                        <span className="text-sm font-bold text-white">Within 24–48 Business Hours</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* MODULE 12: WALLET AND TRANSACTIONS */}
              {/* ============================================================== */}
              {activeModule === 'wallet' && (
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Wallet className="w-5 h-5 text-amber-400" />
                        <span>12. Wallet and Transactions Ledger</span>
                      </h2>
                      <p className="text-xs text-slate-400 mt-1">
                        Complete financial ledger of session credits, manual adjustments, and withdrawal disbursements.
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] text-slate-400 uppercase tracking-wider">Withdrawable Balance</span>
                      <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">${walletBalance.toFixed(2)}</div>
                    </div>
                  </div>

                  {transactions.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 text-xs border border-dashed border-slate-800 rounded-2xl">
                      No ledger transactions recorded yet.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-400">
                            <th className="py-3 font-medium">Tx ID</th>
                            <th className="py-3 font-medium">Date</th>
                            <th className="py-3 font-medium">Type</th>
                            <th className="py-3 font-medium">Description</th>
                            <th className="py-3 font-medium">Amount</th>
                            <th className="py-3 font-medium">Balance After</th>
                            <th className="py-3 font-medium">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                          {transactions.map(t => (
                            <tr key={t.id} className="hover:bg-slate-900/50">
                              <td className="py-3 text-amber-300 font-semibold">{t.id}</td>
                              <td className="py-3 text-slate-400 font-sans text-[11px]">{new Date(t.timestamp).toLocaleDateString()}</td>
                              <td className="py-3 font-sans capitalize">{t.type?.replace('_', ' ')}</td>
                              <td className="py-3 font-sans text-slate-200">{t.description}</td>
                              <td className={`py-3 font-bold ${t.type === 'deposit' || t.type === 'refund' ? 'text-emerald-400' : 'text-slate-200'}`}>
                                {t.type === 'payout' ? '-' : '+'}${t.amount?.toFixed(2)}
                              </td>
                              <td className="py-3">${(t.balanceAfter || 0).toFixed(2)}</td>
                              <td className="py-3 font-sans">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                                  t.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                                }`}>
                                  {t.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* ============================================================== */}
              {/* MODULE 13: WITHDRAWAL REQUESTS */}
              {/* ============================================================== */}
              {activeModule === 'withdrawals' && (
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-amber-400" />
                      <span>13. Withdrawal Requests & Payout Center</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Request payouts directly to your bank account, PayPal, or Stripe account.
                    </p>
                  </div>

                  {/* Payout Submission Form */}
                  <form onSubmit={handleSubmitWithdrawal} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <div>
                        <span className="text-xs text-slate-400">Available Withdrawable Balance</span>
                        <div className="text-xl font-bold font-mono text-emerald-400">${walletBalance.toFixed(2)}</div>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">Minimum payout: $25.00</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">Withdrawal Amount ($ USD)</label>
                        <input
                          type="number"
                          step="1"
                          min="25"
                          max={walletBalance}
                          value={withdrawAmount}
                          onChange={e => setWithdrawAmount(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">Payout Method</label>
                        <select
                          value={payoutMethod}
                          onChange={e => setPayoutMethod(e.target.value as any)}
                          className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-white"
                        >
                          <option value="paypal">PayPal Transfer</option>
                          <option value="bank_wire">Direct Bank Wire / ACH</option>
                          <option value="stripe">Stripe Connect Account</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">Payout Destination Details</label>
                        <input
                          type="text"
                          value={payoutDetails}
                          onChange={e => setPayoutDetails(e.target.value)}
                          placeholder={payoutMethod === 'paypal' ? 'e.g. nikee.psychic@gmail.com' : 'e.g. Bank Name, IBAN / Routing #'}
                          className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-white"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        disabled={isSubmittingWithdrawal || walletBalance < 25}
                        className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl transition-colors shadow"
                      >
                        {isSubmittingWithdrawal ? 'Submitting Request...' : 'Submit Withdrawal Request'}
                      </button>
                    </div>
                  </form>

                  {/* Past Withdrawals List */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Withdrawal Request History</h3>
                    {withdrawals.length === 0 ? (
                      <div className="py-8 text-center text-xs text-slate-400 border border-dashed border-slate-800 rounded-xl">
                        No withdrawal requests submitted yet.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="border-b border-slate-800 text-slate-400">
                              <th className="py-2.5 font-medium">Request #</th>
                              <th className="py-2.5 font-medium">Date</th>
                              <th className="py-2.5 font-medium">Amount</th>
                              <th className="py-2.5 font-medium">Method</th>
                              <th className="py-2.5 font-medium">Account Details</th>
                              <th className="py-2.5 font-medium">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                            {withdrawals.map(w => (
                              <tr key={w.id} className="hover:bg-slate-900/50">
                                <td className="py-3 text-amber-300 font-semibold">{w.id}</td>
                                <td className="py-3 text-slate-400 font-sans text-[11px]">{new Date(w.requestedAt).toLocaleDateString()}</td>
                                <td className="py-3 text-white font-bold">${w.amount?.toFixed(2)}</td>
                                <td className="py-3 font-sans capitalize">{w.paymentMethod?.replace('_', ' ')}</td>
                                <td className="py-3 font-sans text-slate-300">{w.payoutDetails}</td>
                                <td className="py-3 font-sans">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                                    w.status === 'approved' ? 'bg-emerald-500/20 text-emerald-300' :
                                    w.status === 'rejected' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                                  }`}>
                                    {w.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* MODULE 14: AVAILABILITY AND ONLINE/OFFLINE STATUS */}
              {/* ============================================================== */}
              {activeModule === 'availability' && (
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Power className="w-5 h-5 text-amber-400" />
                      <span>14. Availability & Online/Offline Status Control</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Manage your real-time availability in the LUMSIC reader directory and queueing system.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Master Status */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-4">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Master Directory Availability</span>
                        <div className="flex items-center gap-3 mt-2">
                          <span className={`w-3.5 h-3.5 rounded-full ${reader?.isOnline ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                          <span className="text-lg font-bold text-white">
                            {reader?.isOnline ? 'ONLINE — Accepting Seeker Readings' : 'OFFLINE — Profile Hidden from Queue'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-2">
                          When online, your profile displays an active green indicator and seekers can initiate chat requests immediately.
                        </p>
                      </div>

                      <button
                        onClick={handleToggleOnline}
                        className={`w-full py-3 rounded-xl font-bold text-xs transition-colors shadow ${
                          reader?.isOnline
                            ? 'bg-rose-600 hover:bg-rose-500 text-white'
                            : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                        }`}
                      >
                        {reader?.isOnline ? 'Go Offline' : 'Go Online Now'}
                      </button>
                    </div>

                    {/* Busy Mode & Queue Controls */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-4">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Busy Mode & Session Pausing</span>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-lg font-bold text-white">
                            {reader?.isBusy ? 'BUSY — Paused New Incoming Chats' : 'AVAILABLE — Ready for Next Chat'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-2">
                          Use Busy mode when preparing cards or taking a short breather between readings without taking your entire profile offline.
                        </p>
                      </div>

                      <button
                        onClick={handleToggleBusy}
                        className={`w-full py-3 rounded-xl font-bold text-xs transition-colors border ${
                          reader?.isBusy
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                        }`}
                      >
                        {reader?.isBusy ? 'Disable Busy Mode' : 'Enable Busy Mode'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* MODULE 15: WORKING HOURS AND CALENDAR */}
              {/* ============================================================== */}
              {activeModule === 'schedule' && (
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-amber-400" />
                      <span>15. Working Hours and Weekly Calendar</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Set your scheduled consulting hours for each day of the week so seekers know when to connect.
                    </p>
                  </div>

                  {/* Timezone picker */}
                  <div className="max-w-xs">
                    <label className="block text-xs font-medium text-slate-300 mb-1">Your Operating Timezone</label>
                    <select
                      value={scheduleTimezone}
                      onChange={e => setScheduleTimezone(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    >
                      <option value="America/New_York (UTC-5)">Eastern Time (New York - UTC-5)</option>
                      <option value="America/Chicago (UTC-6)">Central Time (Chicago - UTC-6)</option>
                      <option value="America/Los_Angeles (UTC-8)">Pacific Time (Los Angeles - UTC-8)</option>
                      <option value="Europe/London (UTC+0)">Greenwich Mean Time (London - UTC+0)</option>
                      <option value="Europe/Paris (UTC+1)">Central European Time (Paris - UTC+1)</option>
                      <option value="Asia/Kolkata (UTC+5:30)">India Standard Time (IST - UTC+5:30)</option>
                      <option value="Australia/Sydney (UTC+11)">Australian Eastern Time (Sydney - UTC+11)</option>
                    </select>
                  </div>

                  {/* Weekly Matrix */}
                  <div className="space-y-3">
                    {WEEKDAYS.map(day => {
                      const daySchedule = scheduleData[day.key] || { enabled: false, start: '09:00', end: '18:00' };
                      return (
                        <div
                          key={day.key}
                          className="bg-slate-900 border border-slate-800/80 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3 w-36">
                            <input
                              type="checkbox"
                              checked={daySchedule.enabled}
                              onChange={e => {
                                setScheduleData({
                                  ...scheduleData,
                                  [day.key]: { ...daySchedule, enabled: e.target.checked },
                                });
                              }}
                              className="accent-amber-500 w-4 h-4 rounded"
                            />
                            <span className={`text-xs font-semibold ${daySchedule.enabled ? 'text-white' : 'text-slate-400'}`}>
                              {day.label}
                            </span>
                          </div>

                          {daySchedule.enabled ? (
                            <div className="flex items-center gap-2 text-xs">
                              <span className="text-slate-400">From</span>
                              <input
                                type="time"
                                value={daySchedule.start}
                                onChange={e => {
                                  setScheduleData({
                                    ...scheduleData,
                                    [day.key]: { ...daySchedule, start: e.target.value },
                                  });
                                }}
                                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono"
                              />
                              <span className="text-slate-400">to</span>
                              <input
                                type="time"
                                value={daySchedule.end}
                                onChange={e => {
                                  setScheduleData({
                                    ...scheduleData,
                                    [day.key]: { ...daySchedule, end: e.target.value },
                                  });
                                }}
                                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono"
                              />
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400 italic">Day Off (Not available)</span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleSaveSchedule}
                      className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow-lg"
                    >
                      Save Weekly Schedule
                    </button>
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* MODULE 16: RATINGS AND REVIEWS */}
              {/* ============================================================== */}
              {activeModule === 'reviews' && (
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                      <span>16. Ratings and Seeker Reviews</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Seeker testimonials from verified consultations. Respond with gratitude to maintain client relationships.
                    </p>
                  </div>

                  {/* Summary Score Banner */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center gap-6">
                    <div className="text-center pr-6 border-r border-slate-800">
                      <div className="text-3xl font-bold font-mono text-amber-400">{(reader?.rating || 5.0).toFixed(1)}</div>
                      <div className="flex text-amber-400 text-xs justify-center mt-1">★★★★★</div>
                      <div className="text-[11px] text-slate-400 mt-1">{reviews.length || reader?.reviewsCount || 0} reviews</div>
                    </div>
                    <div className="space-y-1 flex-1 text-xs text-slate-400">
                      <div className="flex items-center gap-2">
                        <span>5 Stars</span>
                        <div className="flex-1 bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-amber-400 h-full w-[96%]" />
                        </div>
                        <span className="font-mono">96%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>4 Stars</span>
                        <div className="flex-1 bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-amber-400 h-full w-[4%]" />
                        </div>
                        <span className="font-mono">4%</span>
                      </div>
                    </div>
                  </div>

                  {/* Reviews List */}
                  <div className="space-y-4">
                    {reviews.length === 0 ? (
                      <div className="py-8 text-center text-xs text-slate-400 border border-dashed border-slate-800 rounded-xl">
                        No reviews submitted yet. When seekers complete consultations, their ratings and reviews appear here.
                      </div>
                    ) : (
                      reviews.map(r => (
                        <div key={r.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-xs">{r.customerName}</span>
                              <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">Verified Seeker</span>
                            </div>
                            <div className="flex items-center gap-1 text-amber-400 text-xs">
                              {'★'.repeat(r.rating || 5)}
                              <span className="text-[11px] text-slate-400 ml-1 font-mono">{new Date(r.timestamp).toLocaleDateString()}</span>
                            </div>
                          </div>

                          <p className="text-xs text-slate-300 leading-relaxed italic">"{r.comment}"</p>

                          {/* Existing Reply */}
                          {r.readerReply && (
                            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-xs space-y-1">
                              <div className="font-semibold text-amber-400 flex items-center justify-between">
                                <span>Your Reply:</span>
                                {r.replyTimestamp && (
                                  <span className="text-[10px] text-slate-400 font-mono">{new Date(r.replyTimestamp).toLocaleDateString()}</span>
                                )}
                              </div>
                              <p className="text-slate-300">{r.readerReply}</p>
                            </div>
                          )}

                          {/* Reply Box Toggle */}
                          {!r.readerReply && replyingReviewId !== r.id && (
                            <button
                              onClick={() => {
                                setReplyingReviewId(r.id);
                                setReplyText('');
                              }}
                              className="text-xs text-amber-400 hover:underline flex items-center gap-1"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>Reply to Seeker</span>
                            </button>
                          )}

                          {replyingReviewId === r.id && (
                            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                              <textarea
                                rows={2}
                                value={replyText}
                                onChange={e => setReplyText(e.target.value)}
                                placeholder="Thank the seeker for their session and express warm blessings..."
                                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                              />
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => setReplyingReviewId(null)}
                                  className="px-3 py-1 text-xs text-slate-400 hover:text-white"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleSubmitReviewReply(r.id)}
                                  className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg"
                                >
                                  Submit Reply
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* MODULE 17: NOTIFICATIONS */}
              {/* ============================================================== */}
              {activeModule === 'notifications' && (
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Bell className="w-5 h-5 text-amber-400" />
                        <span>17. Notifications Center</span>
                      </h2>
                      <p className="text-xs text-slate-400 mt-1">
                        System broadcasts, booking alerts, and account activity.
                      </p>
                    </div>

                    <button
                      onClick={handleMarkAllNotificationsRead}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl"
                    >
                      Mark All as Read
                    </button>
                  </div>

                  {notifications.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 text-xs border border-dashed border-slate-800 rounded-2xl">
                      No notifications at this time.
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {notifications.map(n => (
                        <div
                          key={n.id}
                          onClick={() => handleMarkNotificationRead(n.id)}
                          className={`p-4 rounded-xl border transition-colors cursor-pointer flex items-start justify-between gap-4 ${
                            n.isRead
                              ? 'bg-slate-900/50 border-slate-800/80 text-slate-400'
                              : 'bg-slate-900 border-amber-500/30 text-slate-200 shadow-md'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                              n.isRead ? 'bg-slate-800 text-slate-400' : 'bg-amber-500/20 text-amber-400'
                            }`}>
                              <Bell className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-xs font-semibold text-white">{n.title}</div>
                              <p className="text-xs text-slate-300 mt-0.5">{n.message}</p>
                              <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                                {new Date(n.timestamp).toLocaleString()}
                              </span>
                            </div>
                          </div>
                          {!n.isRead && (
                            <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 mt-2" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ============================================================== */}
              {/* MODULE 18: SUPPORT AND HELP */}
              {/* ============================================================== */}
              {activeModule === 'support' && (
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <LifeBuoy className="w-5 h-5 text-amber-400" />
                      <span>18. Astrologer Support & Help Desk</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Direct liaison with LUMSIC support for billing, disputes, and operational questions.
                    </p>
                  </div>

                  {/* Create Ticket Form */}
                  <form onSubmit={handleSubmitTicket} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">Open a New Support Ticket</h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-slate-300 mb-1">Subject *</label>
                        <input
                          type="text"
                          value={ticketSubject}
                          onChange={e => setTicketSubject(e.target.value)}
                          placeholder="e.g. Question regarding wire transfer reference #po-1092"
                          className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3.5 py-2 text-xs text-white"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                        <select
                          value={ticketCategory}
                          onChange={e => setTicketCategory(e.target.value as any)}
                          className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3.5 py-2 text-xs text-white"
                        >
                          <option value="Billing">Billing & Payouts</option>
                          <option value="Technical">Technical & Connectivity</option>
                          <option value="Customer Issue">Seeker Dispute / Conduct</option>
                          <option value="General">General Inquiry</option>
                        </select>
                      </div>

                      <div className="md:col-span-3">
                        <label className="block text-xs font-medium text-slate-300 mb-1">Detailed Message *</label>
                        <textarea
                          rows={4}
                          value={ticketDescription}
                          onChange={e => setTicketDescription(e.target.value)}
                          placeholder="Describe your inquiry with relevant session or payout IDs..."
                          className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl p-3 text-xs text-white"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        disabled={isSubmittingTicket}
                        className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl transition-colors shadow"
                      >
                        {isSubmittingTicket ? 'Submitting...' : 'Dispatch Support Ticket'}
                      </button>
                    </div>
                  </form>

                  {/* Existing Tickets List */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">My Support Tickets</h3>
                    {tickets.length === 0 ? (
                      <div className="py-8 text-center text-xs text-slate-400 border border-dashed border-slate-800 rounded-xl">
                        No support tickets submitted yet.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {tickets.map(t => (
                          <div key={t.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-amber-300 text-xs font-bold">{t.ticketNumber}</span>
                                <span className="text-white text-xs font-semibold">{t.subject}</span>
                              </div>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                                t.status === 'resolved' ? 'bg-emerald-500/20 text-emerald-300' :
                                t.status === 'in_progress' ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-300'
                              }`}>
                                {t.status}
                              </span>
                            </div>
                            <p className="text-xs text-slate-300">{t.description}</p>
                            {t.responses?.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-slate-800 space-y-2">
                                <span className="text-[10px] uppercase font-bold text-amber-400">Support Team Responses:</span>
                                {t.responses.map((resp: any, rIdx: number) => (
                                  <div key={rIdx} className="bg-slate-950 p-2.5 rounded-lg text-xs text-slate-200">
                                    <div className="text-[10px] text-slate-400 mb-1">{resp.senderName} ({new Date(resp.timestamp).toLocaleString()})</div>
                                    <p>{resp.message}</p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* MODULE 19: ACCOUNT SETTINGS */}
              {/* ============================================================== */}
              {activeModule === 'account' && (
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Settings className="w-5 h-5 text-amber-400" />
                      <span>19. Astrologer Account Settings</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Account registration details, contact credentials, and consultation alert preferences.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Full Legal Name</label>
                      <input
                        type="text"
                        disabled
                        value={user?.fullName || reader?.name || ''}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-400 cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Registered Email Address</label>
                      <input
                        type="email"
                        disabled
                        value={user?.email || ''}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-400 cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Contact Phone</label>
                      <input
                        type="tel"
                        disabled
                        value={user?.phone || '+1 (555) 019-2831'}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-400 cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Primary Settlement Currency</label>
                      <input
                        type="text"
                        disabled
                        value="USD ($)"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-400 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Notification Toggles */}
                  <div className="pt-4 border-t border-slate-800 space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">Notification Preferences</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3.5 bg-slate-900 rounded-xl border border-slate-800">
                        <div>
                          <div className="text-xs font-semibold text-white">Audio Chime Alert on Incoming Seeker Requests</div>
                          <div className="text-[11px] text-slate-400">Plays an audible chime sound when a seeker clicks Start Chat.</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={soundEnabled}
                          onChange={e => setSoundEnabled(e.target.checked)}
                          className="accent-amber-500 w-4 h-4 rounded"
                        />
                      </div>

                      <div className="flex items-center justify-between p-3.5 bg-slate-900 rounded-xl border border-slate-800">
                        <div>
                          <div className="text-xs font-semibold text-white">Email Notification on Payout Disbursement</div>
                          <div className="text-[11px] text-slate-400">Receive receipt confirmation when withdrawal requests are approved.</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={emailAlerts}
                          onChange={e => setEmailAlerts(e.target.checked)}
                          className="accent-amber-500 w-4 h-4 rounded"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => showToast('Preferences updated successfully.')}
                      className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow"
                    >
                      Save Account Preferences
                    </button>
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* MODULE 20: PASSWORD AND SECURITY SETTINGS */}
              {/* ============================================================== */}
              {activeModule === 'security' && (
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-amber-400" />
                      <span>20. Password and Security Settings</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Update your account password, manage two-factor authentication, and monitor login activity.
                    </p>
                  </div>

                  {/* Password Change Form */}
                  <form onSubmit={handleChangePassword} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 max-w-lg">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">Change Account Password</h3>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Current Password</label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={e => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">New Password (min 6 characters)</label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Confirm New Password</label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-white"
                        required
                      />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={showPassword}
                          onChange={e => setShowPassword(e.target.checked)}
                          className="accent-amber-500"
                        />
                        <span>Show password text</span>
                      </label>

                      <button
                        type="submit"
                        className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow"
                      >
                        Update Password
                      </button>
                    </div>
                  </form>

                  {/* Two-Factor Authentication */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider">Two-Factor Authentication (2FA)</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Protect your reader earnings and consultation privacy with 2-step verification.</p>
                    </div>
                    <button
                      onClick={() => {
                        setTwoFactorEnabled(!twoFactorEnabled);
                        showToast(twoFactorEnabled ? 'Two-Factor Authentication disabled.' : 'Two-Factor Authentication enabled.');
                      }}
                      className={`px-4 py-2 text-xs font-bold rounded-xl border ${
                        twoFactorEnabled ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {twoFactorEnabled ? 'Enabled ✓' : 'Enable 2FA'}
                    </button>
                  </div>

                  {/* Active Sessions */}
                  <div className="space-y-3 pt-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Active Device Sessions</h3>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-400" />
                        <div>
                          <div className="font-semibold text-white">Current Browser Session</div>
                          <div className="text-[11px] text-slate-400 font-mono">IP: 127.0.0.1 · Chrome / WebKit · Active Now</div>
                        </div>
                      </div>
                      <span className="text-[11px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">Current Device</span>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}
        </main>
      </div>
    </div>
  );
};
