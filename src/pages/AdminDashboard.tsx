import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Reader,
  ConsultationSession,
  AppSettings,
  ReaderApplication,
  PayoutRequest,
  CategoryItem,
  SupportTicket,
  CouponItem,
  WebsiteContentSettings,
  AdminStaffMember,
  ActivityLog,
} from '../types';
import { api } from '../lib/api';
import { AdminTransferModal } from '../components/AdminTransferModal';
import {
  LayoutDashboard,
  Users,
  Sparkles,
  Power,
  ArrowRightLeft,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Settings,
  Plus,
  RefreshCw,
  Clock,
  DollarSign,
  Wallet,
  CreditCard,
  Tag,
  FolderTree,
  Star,
  Bell,
  LifeBuoy,
  Globe,
  Sliders,
  BarChart3,
  Shield,
  FileSpreadsheet,
  Download,
  Trash2,
  Edit3,
  MessageSquare,
  Send,
  Eye,
  EyeOff,
  Filter,
  Check,
  ChevronRight,
  TrendingUp,
  Activity,
  Layers,
  PhoneCall,
  Video,
  Upload,
  Camera,
} from 'lucide-react';

interface AdminDashboardProps {
  onOpenChat: () => void;
  setCurrentView: (view: string) => void;
}

type AdminSection =
  | 'overview'
  | 'readers'
  | 'applications'
  | 'workflow'
  | 'consultations'
  | 'customers'
  | 'transactions'
  | 'wallets'
  | 'payouts'
  | 'pricing'
  | 'categories'
  | 'reviews'
  | 'broadcasts'
  | 'support'
  | 'content'
  | 'global-settings'
  | 'reports'
  | 'staff'
  | 'logs';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onOpenChat,
  setCurrentView,
}) => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');
  const [dateRange, setDateRange] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Core Data
  const [metrics, setMetrics] = useState<any>(null);
  const [readers, setReaders] = useState<Reader[]>([]);
  const [consultations, setConsultations] = useState<ConsultationSession[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [wallets, setWallets] = useState<any[]>([]);
  const [applications, setApplications] = useState<ReaderApplication[]>([]);
  const [payouts, setPayouts] = useState<PayoutRequest[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [broadcasts, setBroadcasts] = useState<any[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [websiteContent, setWebsiteContent] = useState<WebsiteContentSettings | null>(null);
  const [coupons, setCoupons] = useState<CouponItem[]>([]);
  const [staff, setStaff] = useState<AdminStaffMember[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [appSettings, setAppSettings] = useState<AppSettings | null>(null);
  const [reportsData, setReportsData] = useState<any>(null);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals State
  const [editingReader, setEditingReader] = useState<Reader | null>(null);
  const [showAddReaderModal, setShowAddReaderModal] = useState(false);
  const [newReaderForm, setNewReaderForm] = useState({
    name: '',
    title: '',
    email: '',
    pricePerMinute: '2.50',
    inrPrice: '35',
    specializations: 'Love & Relationships, Tarot Reading',
    languages: 'English',
    bio: '',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80',
    country: 'United States',
    city: 'New York',
    experienceYears: 5,
  });

  // Transfer Modal
  const [transferSession, setTransferSession] = useState<ConsultationSession | null>(null);

  // Application Review Modal
  const [selectedApp, setSelectedApp] = useState<ReaderApplication | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Wallet Adjustment Modal
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [walletAdjustForm, setWalletAdjustForm] = useState({
    userId: '',
    type: 'credit' as 'credit' | 'debit',
    amount: '',
    reason: '',
  });

  // Refund Modal
  const [refundingTx, setRefundingTx] = useState<any | null>(null);
  const [refundReason, setRefundReason] = useState('Seeker consultation satisfaction guarantee policy');

  // Ticket Response Modal
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [ticketReplyText, setTicketReplyText] = useState('');
  const [ticketNewStatus, setTicketNewStatus] = useState<string>('resolved');

  // Broadcast Modal
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastForm, setBroadcastForm] = useState({
    title: '',
    message: '',
    target: 'all',
  });

  // Category Modal
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    icon: 'Sparkles',
    description: '',
    displayOrder: 1,
  });

  // Coupon Modal
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [couponForm, setCouponForm] = useState({
    code: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: '15',
    minSpend: '20',
    maxUses: '1000',
  });

  // Staff Modal
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [staffForm, setStaffForm] = useState({
    fullName: '',
    email: '',
    role: 'support' as any,
  });

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMsg({ text, type });
    setTimeout(() => setStatusMsg(null), 5000);
  };

  const handleAvatarFileUpload = (file: File, isNew: boolean = false) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, JPEG, WEBP)', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size should be less than 5MB', 'error');
      return;
    }
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      const base64 = fileReader.result as string;
      if (isNew) {
        setNewReaderForm(prev => ({ ...prev, avatar: base64 }));
      } else if (editingReader) {
        setEditingReader(prev => (prev ? { ...prev, avatar: base64 } : null));
      }
      showToast('Photo selected from computer. Save profile to confirm.');
    };
    fileReader.readAsDataURL(file);
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [
        ov,
        rList,
        cList,
        custList,
        txList,
        wList,
        appList,
        payList,
        catList,
        revList,
        bcList,
        tickList,
        webCont,
        cpnList,
        stfList,
        logsList,
        setts,
        rep,
      ] = await Promise.all([
        api.admin.getOverview(dateRange),
        api.readers.list(),
        api.consultations.list({ role: 'admin' }),
        api.admin.getCustomers(),
        api.admin.getTransactions(),
        api.admin.getWallets(),
        api.admin.getApplications(),
        api.admin.getPayouts(),
        api.admin.getCategories(),
        api.admin.getReviews(),
        api.admin.getBroadcasts(),
        api.admin.getTickets(),
        api.admin.getWebsiteContent(),
        api.admin.getCoupons(),
        api.admin.getStaff(),
        api.admin.getActivityLogs({ limit: 100 }),
        api.settings.get(),
        api.admin.getReports(),
      ]);

      setMetrics(ov);
      setReaders(rList);
      setConsultations(cList);
      setCustomers(custList);
      setTransactions(txList);
      setWallets(wList);
      setApplications(appList);
      setPayouts(payList);
      setCategories(catList);
      setReviews(revList);
      setBroadcasts(bcList);
      setTickets(tickList);
      setWebsiteContent(webCont);
      setCoupons(cpnList);
      setStaff(stfList);
      setActivityLogs(logsList);
      setAppSettings(setts);
      setReportsData(rep);
    } catch (err: any) {
      showToast(err.message || 'Failed to sync data with server', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [dateRange]);

  // Section 4: Workflow Control Toggle
  const handleToggleWorkflow = async (astrologerId: string, currentStatus: boolean) => {
    try {
      const res = await api.admin.toggleWorkflow(astrologerId, !currentStatus);
      setReaders(prev =>
        prev.map(r => (r.astrologerId === astrologerId ? { ...r, workflowEnabled: res.workflowEnabled } : r))
      );
      showToast(
        `Reader ${astrologerId} workflow turned ${res.workflowEnabled ? 'ACTIVE (ON)' : 'PAUSED (OFF)'}. Consultations routing updated immediately.`
      );
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to toggle workflow', 'error');
    }
  };

  // Section 2: Reader Update & Delete
  const handleSaveReaderEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReader) return;
    try {
      await api.admin.updateReader(editingReader.id, editingReader);
      showToast(`Reader profile for ${editingReader.name} saved successfully.`);
      setEditingReader(null);
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to update reader', 'error');
    }
  };

  const handleDeleteReader = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete reader account ${name}?`)) return;
    try {
      await api.admin.deleteReader(id);
      showToast(`Reader ${name} removed from platform.`);
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete reader', 'error');
    }
  };

  const handleCreateReader = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.admin.createAstrologer({
        name: newReaderForm.name,
        title: newReaderForm.title,
        email: newReaderForm.email,
        pricePerMinute: newReaderForm.pricePerMinute,
        specializations: newReaderForm.specializations.split(',').map(s => s.trim()),
        languages: newReaderForm.languages.split(',').map(s => s.trim()),
        bio: newReaderForm.bio,
        avatar: newReaderForm.avatar,
      });
      showToast(`New reader ${newReaderForm.name} onboarded.`);
      setShowAddReaderModal(false);
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to create reader', 'error');
    }
  };

  // Section 3: Applications Approval / Rejection
  const handleApproveApplication = async (appId: string) => {
    try {
      await api.admin.approveApplication(appId);
      showToast('Applicant approved and reader account activated.');
      setSelectedApp(null);
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to approve application', 'error');
    }
  };

  const handleRejectApplication = async (appId: string) => {
    try {
      await api.admin.rejectApplication(appId, rejectReason || 'Profile credentials not currently aligned.');
      showToast('Applicant rejected.');
      setSelectedApp(null);
      setRejectReason('');
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to reject application', 'error');
    }
  };

  // Section 5: Force End Consultation
  const handleForceEndConsultation = async (sessionId: string) => {
    if (!window.confirm('Force terminate this live consultation session immediately?')) return;
    try {
      await api.admin.endConsultation(sessionId);
      showToast('Live consultation terminated by administrator.');
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to end session', 'error');
    }
  };

  // Section 6: Customer Suspension & Notes
  const handleToggleSuspendCustomer = async (customerId: string) => {
    try {
      const res = await api.admin.toggleSuspendCustomer(customerId);
      showToast(`Customer account ${res.isSuspended ? 'suspended' : 'activated'}.`);
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to update customer status', 'error');
    }
  };

  const handleSaveCustomerNotes = async (customerId: string, notes: string) => {
    try {
      await api.admin.updateCustomerNotes(customerId, notes);
      showToast('Admin internal notes saved.');
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to save notes', 'error');
    }
  };

  // Section 7: Process Refund
  const handleProcessRefund = async () => {
    if (!refundingTx) return;
    try {
      await api.admin.refundTransaction(refundingTx.id, refundReason);
      showToast(`Refund of $${refundingTx.amount.toFixed(2)} processed to customer.`);
      setRefundingTx(null);
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to process refund', 'error');
    }
  };

  // Section 8: Wallet Manual Adjustment
  const handleAdjustWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletAdjustForm.userId || !walletAdjustForm.amount || !walletAdjustForm.reason) {
      showToast('Please fill all wallet adjustment fields including audit reason.', 'error');
      return;
    }
    try {
      await api.admin.adjustWallet(
        walletAdjustForm.userId,
        walletAdjustForm.type,
        parseFloat(walletAdjustForm.amount),
        walletAdjustForm.reason
      );
      showToast(`Wallet ${walletAdjustForm.type === 'credit' ? 'credited' : 'debited'} successfully.`);
      setShowWalletModal(false);
      setWalletAdjustForm({ userId: '', type: 'credit', amount: '', reason: '' });
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to adjust wallet', 'error');
    }
  };

  // Section 9: Payout Approval / Rejection
  const handleApprovePayout = async (id: string) => {
    try {
      await api.admin.approvePayout(id);
      showToast('Payout approved and marked processed.');
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to approve payout', 'error');
    }
  };

  const handleRejectPayout = async (id: string) => {
    const reason = window.prompt('Enter reason for rejecting this payout request:') || 'Banking details verification error';
    try {
      await api.admin.rejectPayout(id, reason);
      showToast('Payout request rejected.');
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to reject payout', 'error');
    }
  };

  // Section 10: Coupons Management
  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.admin.createCoupon({
        code: couponForm.code,
        discountType: couponForm.discountType,
        discountValue: couponForm.discountValue,
        minSpend: couponForm.minSpend,
        maxUses: couponForm.maxUses,
      });
      showToast(`Coupon ${couponForm.code.toUpperCase()} created.`);
      setShowCouponModal(false);
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to create coupon', 'error');
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    try {
      await api.admin.deleteCoupon(id);
      showToast('Coupon removed.');
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete coupon', 'error');
    }
  };

  // Section 11: Categories Management
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.admin.createCategory(categoryForm);
      showToast(`Category ${categoryForm.name} created.`);
      setShowCategoryModal(false);
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to create category', 'error');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm('Delete this specialization category?')) return;
    try {
      await api.admin.deleteCategory(id);
      showToast('Category deleted.');
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete category', 'error');
    }
  };

  // Section 12: Reviews Moderation
  const handleToggleReviewVisibility = async (id: string) => {
    try {
      const res = await api.admin.toggleReviewVisibility(id);
      showToast(`Review visibility updated to ${res.isHidden ? 'Hidden' : 'Approved (Public)'}.`);
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to update review visibility', 'error');
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!window.confirm('Permanently delete this customer review?')) return;
    try {
      await api.admin.deleteReview(id);
      showToast('Review deleted and reader rating recalculated.');
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete review', 'error');
    }
  };

  // Section 13: Broadcasts
  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.admin.sendBroadcast(broadcastForm);
      showToast('Broadcast notification dispatched to all target users.');
      setShowBroadcastModal(false);
      setBroadcastForm({ title: '', message: '', target: 'all' });
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to send broadcast', 'error');
    }
  };

  // Section 14: Support Tickets
  const handleReplyTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !ticketReplyText.trim()) return;
    try {
      await api.admin.replyTicket(selectedTicket.id, ticketReplyText, ticketNewStatus);
      showToast(`Replied to ticket ${selectedTicket.ticketNumber}.`);
      setSelectedTicket(null);
      setTicketReplyText('');
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to reply to ticket', 'error');
    }
  };

  // Section 15: Website Content
  const handleSaveWebsiteContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!websiteContent) return;
    try {
      await api.admin.updateWebsiteContent(websiteContent);
      showToast('Website content, hero headlines & announcements saved.');
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to save website content', 'error');
    }
  };

  // Section 16: Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appSettings) return;
    try {
      await api.settings.update(appSettings);
      showToast('Global settings updated.');
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to save settings', 'error');
    }
  };

  // Section 18: Staff Management
  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.admin.createStaff(staffForm);
      showToast(`Admin staff member ${staffForm.fullName} invited.`);
      setShowStaffModal(false);
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to add staff member', 'error');
    }
  };

  const handleDeleteStaff = async (id: string) => {
    if (!window.confirm('Revoke access for this staff member?')) return;
    try {
      await api.admin.deleteStaff(id);
      showToast('Staff member access revoked.');
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to remove staff', 'error');
    }
  };

  // CSV Exporter Helper
  const exportToCSV = (data: any[], filename: string) => {
    if (!data || data.length === 0) {
      showToast('No records to export', 'error');
      return;
    }
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row =>
        headers
          .map(fieldName => {
            const val = row[fieldName];
            const escaped = (typeof val === 'object' ? JSON.stringify(val) : String(val ?? '')).replace(/"/g, '""');
            return `"${escaped}"`;
          })
          .join(',')
      ),
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast(`Exported ${data.length} records to CSV.`);
  };

  // Sidebar Menu Items - 19 Complete Sections
  const sidebarItems: { id: AdminSection; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'overview', label: '1. Overview & KPIs', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'readers', label: '2. Readers Management', icon: <Sparkles className="w-4 h-4" />, badge: readers.length },
    {
      id: 'applications',
      label: '3. Reader Applications',
      icon: <Users className="w-4 h-4" />,
      badge: applications.filter(a => a.status === 'pending').length || undefined,
    },
    { id: 'workflow', label: '4. Workflow & Routing', icon: <Power className="w-4 h-4" /> },
    {
      id: 'consultations',
      label: '5. Live Consultations',
      icon: <MessageSquare className="w-4 h-4" />,
      badge: consultations.filter(c => c.status === 'active').length || undefined,
    },
    { id: 'customers', label: '6. Customers & Notes', icon: <Users className="w-4 h-4" /> },
    { id: 'transactions', label: '7. Transactions & Refunds', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'wallets', label: '8. Wallet Management', icon: <Wallet className="w-4 h-4" /> },
    {
      id: 'payouts',
      label: '9. Reader Payouts',
      icon: <DollarSign className="w-4 h-4" />,
      badge: payouts.filter(p => p.status === 'pending').length || undefined,
    },
    { id: 'pricing', label: '10. Pricing & Coupons', icon: <Tag className="w-4 h-4" /> },
    { id: 'categories', label: '11. Categories & Skills', icon: <FolderTree className="w-4 h-4" /> },
    { id: 'reviews', label: '12. Reviews & Ratings', icon: <Star className="w-4 h-4" /> },
    { id: 'broadcasts', label: '13. Announcements', icon: <Bell className="w-4 h-4" /> },
    {
      id: 'support',
      label: '14. Support & Tickets',
      icon: <LifeBuoy className="w-4 h-4" />,
      badge: tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length || undefined,
    },
    { id: 'content', label: '15. Website Content', icon: <Globe className="w-4 h-4" /> },
    { id: 'global-settings', label: '16. Global Settings', icon: <Sliders className="w-4 h-4" /> },
    { id: 'reports', label: '17. Reports & Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'staff', label: '18. Staff & Roles', icon: <Shield className="w-4 h-4" /> },
    { id: 'logs', label: '19. Security & Audit Logs', icon: <FileSpreadsheet className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#38243F] flex flex-col font-sans">
      {/* Top Banner Status */}
      {statusMsg && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 text-sm font-medium transition-all ${
            statusMsg.type === 'success'
              ? 'bg-emerald-600 text-white'
              : 'bg-rose-600 text-white'
          }`}
        >
          {statusMsg.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Admin Top Header */}
      <header className="bg-[#2D1B34] text-white border-b border-[#38243F] sticky top-0 z-30 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#9B4D96] to-[#D4AF37] flex items-center justify-center text-white font-bold text-lg shadow-inner">
            L
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg font-bold tracking-wide">LUMSIC</span>
              <span className="px-2 py-0.5 text-[10px] tracking-wider uppercase font-semibold bg-[#FAF7F2]/15 text-[#F2EADF] rounded">
                Admin Center
              </span>
            </div>
            <p className="text-xs text-[#F2EADF]/70">Global Astrology & Consultation Management Hub</p>
          </div>
        </div>

        {/* Quick Date Range Filter & Realtime Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center bg-[#38243F] border border-[#FAF7F2]/10 rounded-lg p-1 text-xs">
            <span className="px-2 text-[#F2EADF]/60">Range:</span>
            {(['all', 'today', '7d', '30d', 'month'] as const).map(rangeKey => (
              <button
                key={rangeKey}
                onClick={() => setDateRange(rangeKey)}
                className={`px-2.5 py-1 rounded transition-colors uppercase font-medium ${
                  dateRange === rangeKey
                    ? 'bg-[#9B4D96] text-white shadow-sm'
                    : 'text-[#F2EADF]/70 hover:text-white'
                }`}
              >
                {rangeKey === 'all' ? 'All' : rangeKey === 'month' ? 'Month' : rangeKey}
              </button>
            ))}
          </div>

          <button
            onClick={loadData}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF7F2]/10 hover:bg-[#FAF7F2]/20 text-xs font-medium text-[#F2EADF] transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>

          <div className="h-6 w-px bg-white/10" />

          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[#F2EADF]/80">System Live</span>
          </div>
        </div>
      </header>

      {/* Main Container: Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* 19-Section Sidebar */}
        <aside className="w-64 bg-white border-r border-[#E8DFC8] flex flex-col shrink-0 overflow-y-auto">
          <div className="p-3 border-b border-[#F2EADF] bg-[#FAF7F2]/50">
            <p className="text-[11px] font-semibold text-[#8B7898] uppercase tracking-wider px-2">
              Platform Modules (19)
            </p>
          </div>
          <nav className="p-2 space-y-0.5 text-xs font-medium flex-1">
            {sidebarItems.map(item => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all ${
                    isActive
                      ? 'bg-[#38243F] text-white shadow-sm font-semibold'
                      : 'text-[#38243F]/80 hover:bg-[#FAF7F2] hover:text-[#38243F]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className={isActive ? 'text-[#D4AF37]' : 'text-[#8B7898]'}>{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`px-1.5 py-0.2 text-[10px] rounded-full font-bold shrink-0 ${
                        isActive
                          ? 'bg-[#D4AF37] text-[#2D1B34]'
                          : 'bg-[#9B4D96] text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="p-3 border-t border-[#F2EADF] bg-[#FAF7F2] text-xs text-[#8B7898] flex items-center justify-between">
            <span>Staff: {user?.fullName || 'Super Admin'}</span>
            <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
              Verified
            </span>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#FAF7F2]">
          {/* SECTION 1: OVERVIEW & KPIS */}
          {activeSection === 'overview' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="font-serif text-2xl font-bold text-[#38243F]">1. Executive Operations Overview</h1>
                  <p className="text-xs text-[#8B7898]">
                    Real-time metrics, active consultations, and global financial health.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => exportToCSV([metrics || {}], 'lumsic_kpis_snapshot')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#38243F]/20 text-xs font-semibold text-[#38243F] hover:bg-white bg-white/50"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export KPIs</span>
                  </button>
                </div>
              </div>

              {/* KPI Cards Row 1: Consultations & Readers */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-white border border-[#E8DFC8] shadow-sm">
                  <div className="flex items-center justify-between text-xs text-[#8B7898] mb-1">
                    <span>Active Consultations</span>
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-bold text-[#38243F]">
                    {metrics?.activeConsultations ?? 0}
                  </div>
                  <p className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                    Live connected rooms
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#E8DFC8] shadow-sm">
                  <div className="flex items-center justify-between text-xs text-[#8B7898] mb-1">
                    <span>Online Readers</span>
                    <Sparkles className="w-4 h-4 text-[#9B4D96]" />
                  </div>
                  <div className="text-2xl font-bold text-[#38243F]">
                    {metrics?.onlineAstrologers ?? 0}{' '}
                    <span className="text-xs font-normal text-[#8B7898]">/ {metrics?.totalAstrologers ?? 0}</span>
                  </div>
                  <p className="text-[11px] text-[#8B7898] mt-1">
                    {metrics?.busyAstrologers ?? 0} busy in reading
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#E8DFC8] shadow-sm">
                  <div className="flex items-center justify-between text-xs text-[#8B7898] mb-1">
                    <span>Pending Requests</span>
                    <Clock className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="text-2xl font-bold text-[#38243F]">
                    {metrics?.pendingRequests ?? 0}
                  </div>
                  <p className="text-[11px] text-amber-700 mt-1">Awaiting reader accept</p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#E8DFC8] shadow-sm">
                  <div className="flex items-center justify-between text-xs text-[#8B7898] mb-1">
                    <span>Total Customers</span>
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-[#38243F]">
                    {metrics?.totalCustomers ?? 0}
                  </div>
                  <p className="text-[11px] text-blue-700 mt-1">Registered worldwide</p>
                </div>
              </div>

              {/* KPI Cards Row 2: Revenue & Wallet Balances */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-[#38243F] to-[#241729] text-white shadow-sm">
                  <div className="flex items-center justify-between text-xs text-[#F2EADF]/70 mb-1">
                    <span>Gross Platform Revenue</span>
                    <DollarSign className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <div className="text-2xl font-bold font-serif text-[#D4AF37]">
                    ${(metrics?.totalRevenue ?? 0).toFixed(2)}
                  </div>
                  <p className="text-[11px] text-[#F2EADF]/80 mt-1">
                    {dateRange === 'all' ? 'All-time gross volume' : `Filtered (${dateRange}): $${(metrics?.rangeRevenue ?? 0).toFixed(2)}`}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#E8DFC8] shadow-sm">
                  <div className="flex items-center justify-between text-xs text-[#8B7898] mb-1">
                    <span>Today's Billings</span>
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-bold text-[#38243F]">
                    ${(metrics?.todayRevenue ?? 0).toFixed(2)}
                  </div>
                  <p className="text-[11px] text-emerald-600 mt-1">Past 24 hours</p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#E8DFC8] shadow-sm">
                  <div className="flex items-center justify-between text-xs text-[#8B7898] mb-1">
                    <span>User Wallet Balance</span>
                    <Wallet className="w-4 h-4 text-violet-600" />
                  </div>
                  <div className="text-2xl font-bold text-[#38243F]">
                    ${(metrics?.totalWalletBalance ?? 0).toFixed(2)}
                  </div>
                  <p className="text-[11px] text-[#8B7898] mt-1">Prepaid customer float</p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#E8DFC8] shadow-sm">
                  <div className="flex items-center justify-between text-xs text-[#8B7898] mb-1">
                    <span>Action Items Pending</span>
                    <AlertCircle className="w-4 h-4 text-rose-500" />
                  </div>
                  <div className="text-2xl font-bold text-[#38243F]">
                    {(metrics?.pendingPayoutsCount ?? 0) + (metrics?.pendingApplicationsCount ?? 0) + (metrics?.openTicketsCount ?? 0)}
                  </div>
                  <p className="text-[11px] text-rose-600 mt-1">
                    {metrics?.pendingPayoutsCount ?? 0} payouts, {metrics?.pendingApplicationsCount ?? 0} applicants
                  </p>
                </div>
              </div>

              {/* Recent Activity Stream & Quick Workflow Snapshot */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-xl border border-[#E8DFC8] p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-serif font-bold text-base text-[#38243F]">Real-time Immutable Audit Feed</h2>
                    <span className="text-xs text-[#8B7898]">Latest 20 system actions</span>
                  </div>
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {(metrics?.recentActivity || []).length === 0 ? (
                      <p className="text-xs text-[#8B7898] py-8 text-center">No recent activity recorded.</p>
                    ) : (
                      (metrics?.recentActivity || []).map((log: any) => (
                        <div key={log.id} className="p-3 rounded-lg bg-[#FAF7F2] border border-[#E8DFC8]/60 flex items-start gap-3 text-xs">
                          <Activity className="w-4 h-4 text-[#9B4D96] shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-semibold text-[#38243F]">{log.action}</span>
                              <span className="text-[10px] text-[#8B7898]">{new Date(log.timestamp).toLocaleTimeString()}</span>
                            </div>
                            <p className="text-[#38243F]/80 mt-0.5">{log.details}</p>
                            <span className="text-[10px] text-[#8B7898]">Actor: {log.actorName}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-[#E8DFC8] p-5 shadow-sm space-y-4">
                  <h2 className="font-serif font-bold text-base text-[#38243F]">Active Readers Status</h2>
                  <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                    {readers.slice(0, 8).map(r => (
                      <div key={r.id} className="flex items-center justify-between p-2.5 rounded-lg border border-[#F2EADF] bg-[#FAF7F2]/60">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img src={r.avatar} alt={r.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-[#38243F] truncate">{r.name}</p>
                            <p className="text-[10px] text-[#8B7898]">{r.astrologerId} • ${r.pricePerMinute.toFixed(2)}/m</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                              r.workflowEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {r.workflowEnabled ? 'ON' : 'OFF'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: READERS MANAGEMENT */}
          {activeSection === 'readers' && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="font-serif text-2xl font-bold text-[#38243F]">2. Astrologer & Reader Directory</h1>
                  <p className="text-xs text-[#8B7898]">
                    Search, add, edit comprehensive reader profiles, availability, and rates.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => exportToCSV(readers, 'lumsic_readers_directory')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#38243F]/20 text-xs font-semibold text-[#38243F] bg-white"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>
                  <button
                    onClick={() => setShowAddReaderModal(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#38243F] text-white text-xs font-semibold hover:bg-[#241729]"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Reader</span>
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="bg-white p-3 rounded-xl border border-[#E8DFC8] flex flex-wrap items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center gap-2 flex-1 min-w-[260px]">
                  <Search className="w-4 h-4 text-[#8B7898]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search reader by name, ID (e.g. LUM001), or specialization..."
                    className="w-full text-xs bg-transparent border-none focus:outline-none text-[#38243F]"
                  />
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[#8B7898]">Status:</span>
                  <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="border border-[#E8DFC8] rounded-lg px-2 py-1 bg-[#FAF7F2] text-xs text-[#38243F]"
                  >
                    <option value="all">All Readers</option>
                    <option value="online">Online Only</option>
                    <option value="busy">Busy Only</option>
                    <option value="workflow_on">Workflow ON</option>
                    <option value="workflow_off">Workflow OFF</option>
                  </select>
                </div>
              </div>

              {/* Readers Table */}
              <div className="bg-white rounded-xl border border-[#E8DFC8] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF7F2] border-b border-[#E8DFC8] text-[#8B7898] uppercase text-[10px] tracking-wider font-semibold">
                      <tr>
                        <th className="py-3 px-4">Reader / Profile</th>
                        <th className="py-3 px-3">Unique ID</th>
                        <th className="py-3 px-3">Rates (USD / INR)</th>
                        <th className="py-3 px-3">Specializations</th>
                        <th className="py-3 px-3">Experience</th>
                        <th className="py-3 px-3">Rating</th>
                        <th className="py-3 px-3">Workflow</th>
                        <th className="py-3 px-3">Online State</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F2EADF]">
                      {readers
                        .filter(r => {
                          const matchesQuery =
                            r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            r.astrologerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            r.specializations.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
                          if (!matchesQuery) return false;
                          if (statusFilter === 'online') return r.isOnline;
                          if (statusFilter === 'busy') return r.isBusy;
                          if (statusFilter === 'workflow_on') return r.workflowEnabled;
                          if (statusFilter === 'workflow_off') return !r.workflowEnabled;
                          return true;
                        })
                        .map(r => (
                          <tr key={r.id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <img src={r.avatar} alt={r.name} className="w-10 h-10 rounded-full object-cover border border-[#E8DFC8]" />
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-[#38243F]">{r.name}</span>
                                    {r.badge && (
                                      <span className="px-1.5 py-0.2 text-[9px] font-semibold bg-[#D4AF37]/20 text-[#8B7898] rounded">
                                        {r.badge}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-[#8B7898] truncate max-w-xs">{r.title}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-3 font-mono font-semibold text-[#9B4D96]">{r.astrologerId}</td>
                            <td className="py-3 px-3">
                              <span className="font-bold text-[#38243F]">${r.pricePerMinute.toFixed(2)}</span>
                              <span className="text-[#8B7898] text-[10px]"> / ₹{r.inrPrice || Math.round(r.pricePerMinute * 14)}</span>
                            </td>
                            <td className="py-3 px-3">
                              <div className="flex flex-wrap gap-1 max-w-[200px]">
                                {r.specializations.slice(0, 2).map((s, idx) => (
                                  <span key={idx} className="bg-[#FAF7F2] border border-[#E8DFC8] text-[10px] px-1.5 py-0.5 rounded text-[#38243F]">
                                    {s}
                                  </span>
                                ))}
                                {r.specializations.length > 2 && (
                                  <span className="text-[10px] text-[#8B7898]">+{r.specializations.length - 2}</span>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-3">{r.experienceYears} Years</td>
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-1 text-[#D4AF37] font-bold">
                                <Star className="w-3.5 h-3.5 fill-[#D4AF37]" />
                                <span>{r.rating.toFixed(1)}</span>
                                <span className="text-[10px] text-[#8B7898] font-normal">({r.reviewsCount})</span>
                              </div>
                            </td>
                            <td className="py-3 px-3">
                              <button
                                onClick={() => handleToggleWorkflow(r.astrologerId, r.workflowEnabled)}
                                className={`px-2 py-0.5 text-[10px] font-bold rounded-full transition-colors ${
                                  r.workflowEnabled
                                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                    : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                                }`}
                              >
                                {r.workflowEnabled ? 'ACTIVE (ON)' : 'PAUSED (OFF)'}
                              </button>
                            </td>
                            <td className="py-3 px-3">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                                  r.isBusy
                                    ? 'bg-amber-100 text-amber-800'
                                    : r.isOnline
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-gray-100 text-gray-700'
                                }`}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${r.isBusy ? 'bg-amber-500' : r.isOnline ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                                {r.isBusy ? 'In Chat' : r.isOnline ? 'Online' : 'Offline'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setEditingReader({ ...r })}
                                  className="p-1.5 rounded-md hover:bg-[#FAF7F2] text-[#38243F] hover:text-[#9B4D96]"
                                  title="Edit Reader Profile"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteReader(r.id, r.name)}
                                  className="p-1.5 rounded-md hover:bg-rose-50 text-rose-600"
                                  title="Delete Reader Account"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: READER APPLICATIONS */}
          {activeSection === 'applications' && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="font-serif text-2xl font-bold text-[#38243F]">3. Reader Applicant Screening</h1>
                  <p className="text-xs text-[#8B7898]">
                    Review applicant psychics, examine credentials & video samples, and onboard to LUMSIC platform.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {applications.map(app => (
                  <div key={app.id} className="bg-white rounded-xl border border-[#E8DFC8] p-5 shadow-sm space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-sm text-[#38243F]">{app.fullName}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            app.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : app.status === 'rejected'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {app.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#8B7898]">{app.email} • {app.phone}</p>
                      <p className="text-xs text-[#38243F] font-medium mt-1">{app.city}, {app.country} ({app.experienceYears} Years Exp)</p>

                      <div className="mt-2.5">
                        <p className="text-[11px] font-semibold text-[#8B7898]">Skills:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {app.primarySkills.map((sk, idx) => (
                            <span key={idx} className="bg-[#FAF7F2] border border-[#E8DFC8] text-[10px] px-1.5 py-0.5 rounded text-[#38243F]">
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-[#38243F]/80 italic mt-3 bg-[#FAF7F2] p-2.5 rounded-lg border border-[#E8DFC8]/60">
                        "{app.bio}"
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#F2EADF] flex items-center justify-between gap-2">
                      {app.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => handleApproveApplication(app.id)}
                            className="flex-1 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                          >
                            Approve & Onboard
                          </button>
                          <button
                            onClick={() => {
                              setSelectedApp(app);
                              setRejectReason('');
                            }}
                            className="flex-1 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <p className="text-[11px] text-[#8B7898]">
                          Reviewed on {new Date(app.reviewedAt || app.createdAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 4: READER WORKFLOW MANAGEMENT */}
          {activeSection === 'workflow' && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="font-serif text-2xl font-bold text-[#38243F]">4. Reader Workflow Control Engine</h1>
                  <p className="text-xs text-[#8B7898]">
                    Reader ID based instant ON/OFF switch. Turning OFF blocks incoming seeker consultations instantly.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {readers.map(r => (
                  <div
                    key={r.id}
                    className={`rounded-xl border p-5 transition-all shadow-sm ${
                      r.workflowEnabled
                        ? 'bg-white border-emerald-300'
                        : 'bg-rose-50/50 border-rose-200'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <img src={r.avatar} alt={r.name} className="w-12 h-12 rounded-full object-cover border" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#38243F]">{r.name}</span>
                          <span className="font-mono text-xs text-[#9B4D96] font-semibold">{r.astrologerId}</span>
                        </div>
                        <p className="text-xs text-[#8B7898] truncate">{r.title}</p>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs py-2 border-y border-[#F2EADF]">
                      <div className="flex justify-between">
                        <span className="text-[#8B7898]">Workflow State:</span>
                        <span className={`font-bold ${r.workflowEnabled ? 'text-emerald-700' : 'text-rose-700'}`}>
                          {r.workflowEnabled ? 'ACTIVE (Accepting Inquiries)' : 'PAUSED (Admin Blocked)'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#8B7898]">Routing Policy:</span>
                        <span>{r.workflowEnabled ? 'Auto-routed to Room' : 'Blocked with Notice'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#8B7898]">Max Concurrent Chats:</span>
                        <span className="font-semibold">{r.maxCapacity || 1} session</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-2">
                      <button
                        onClick={() => handleToggleWorkflow(r.astrologerId, r.workflowEnabled)}
                        className={`w-full py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                          r.workflowEnabled
                            ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                        }`}
                      >
                        <Power className="w-4 h-4" />
                        <span>{r.workflowEnabled ? 'TURN WORKFLOW OFF' : 'TURN WORKFLOW ON'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 5: LIVE CONSULTATIONS */}
          {activeSection === 'consultations' && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="font-serif text-2xl font-bold text-[#38243F]">5. Live Chat & Consultation Monitor</h1>
                  <p className="text-xs text-[#8B7898]">
                    Supervise active sessions, trigger immediate transfer between readers, or force conclude sessions.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-[#E8DFC8] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF7F2] border-b border-[#E8DFC8] text-[#8B7898] uppercase text-[10px] tracking-wider font-semibold">
                      <tr>
                        <th className="py-3 px-4">Session No</th>
                        <th className="py-3 px-3">Seeker Customer</th>
                        <th className="py-3 px-3">Assigned Reader</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-3">Rate / Cost</th>
                        <th className="py-3 px-3">Duration</th>
                        <th className="py-3 px-3">Requested At</th>
                        <th className="py-3 px-4 text-right">Supervisor Controls</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F2EADF]">
                      {consultations.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-8 text-center text-xs text-[#8B7898]">
                            No consultation sessions recorded.
                          </td>
                        </tr>
                      ) : (
                        consultations.map(c => (
                          <tr key={c.id} className="hover:bg-[#FAF7F2]/40 transition-colors">
                            <td className="py-3 px-4 font-mono font-bold text-[#38243F]">{c.sessionNumber}</td>
                            <td className="py-3 px-3">
                              <p className="font-semibold text-[#38243F]">{c.customerName}</p>
                              <p className="text-[10px] text-[#8B7898]">{c.customerEmail}</p>
                            </td>
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-2">
                                <img src={c.readerAvatar} alt={c.readerName} className="w-6 h-6 rounded-full object-cover" />
                                <span className="font-medium text-[#38243F]">{c.readerName}</span>
                              </div>
                            </td>
                            <td className="py-3 px-3">
                              <span
                                className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                                  c.status === 'active'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : c.status === 'pending'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-gray-100 text-gray-700'
                                }`}
                              >
                                {c.status}
                              </span>
                            </td>
                            <td className="py-3 px-3 font-semibold text-[#38243F]">
                              ${c.pricePerMinute.toFixed(2)}/m (${(c.totalCost || 0).toFixed(2)})
                            </td>
                            <td className="py-3 px-3">
                              {Math.floor(c.durationSeconds / 60)}m {c.durationSeconds % 60}s
                            </td>
                            <td className="py-3 px-3 text-[#8B7898]">{new Date(c.requestedAt).toLocaleTimeString()}</td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {c.status === 'active' && (
                                  <>
                                    <button
                                      onClick={() => setTransferSession(c)}
                                      className="px-2 py-1 rounded bg-[#FAF7F2] border border-[#E8DFC8] text-[#38243F] hover:bg-[#F2EADF] text-[10px] font-semibold flex items-center gap-1"
                                    >
                                      <ArrowRightLeft className="w-3 h-3 text-[#9B4D96]" />
                                      <span>Transfer</span>
                                    </button>
                                    <button
                                      onClick={() => handleForceEndConsultation(c.id)}
                                      className="px-2 py-1 rounded bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold"
                                    >
                                      End Session
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 6: CUSTOMER MANAGEMENT */}
          {activeSection === 'customers' && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="font-serif text-2xl font-bold text-[#38243F]">6. Seeker & Customer Directory</h1>
                  <p className="text-xs text-[#8B7898]">
                    Manage registered seeker profiles, balances, suspension status, and internal admin notes.
                  </p>
                </div>
                <button
                  onClick={() => exportToCSV(customers, 'lumsic_customers_list')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#38243F]/20 text-xs font-semibold text-[#38243F] bg-white"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>

              <div className="bg-white rounded-xl border border-[#E8DFC8] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF7F2] border-b border-[#E8DFC8] text-[#8B7898] uppercase text-[10px] tracking-wider font-semibold">
                      <tr>
                        <th className="py-3 px-4">Customer Name & Email</th>
                        <th className="py-3 px-3">Country</th>
                        <th className="py-3 px-3">Wallet Balance</th>
                        <th className="py-3 px-3">Consultations</th>
                        <th className="py-3 px-3">Total Spend</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-4">Internal Admin Notes</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F2EADF]">
                      {customers.map(cust => (
                        <tr key={cust.id} className="hover:bg-[#FAF7F2]/40 transition-colors">
                          <td className="py-3 px-4">
                            <p className="font-bold text-[#38243F]">{cust.fullName}</p>
                            <p className="text-[10px] text-[#8B7898]">{cust.email} • {cust.phone}</p>
                          </td>
                          <td className="py-3 px-3">{cust.country}</td>
                          <td className="py-3 px-3 font-bold text-emerald-700">${cust.walletBalance.toFixed(2)}</td>
                          <td className="py-3 px-3">{cust.totalConsultations} readings</td>
                          <td className="py-3 px-3 font-semibold">${cust.totalSpent.toFixed(2)}</td>
                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                                cust.isSuspended ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {cust.isSuspended ? 'SUSPENDED' : 'ACTIVE'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <input
                              type="text"
                              defaultValue={cust.adminNotes || ''}
                              onBlur={e => handleSaveCustomerNotes(cust.id, e.target.value)}
                              placeholder="Add private note..."
                              className="w-full text-xs px-2 py-1 rounded bg-[#FAF7F2] border border-[#E8DFC8] text-[#38243F]"
                            />
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => handleToggleSuspendCustomer(cust.id)}
                              className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                                cust.isSuspended
                                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                  : 'bg-rose-600 hover:bg-rose-700 text-white'
                              }`}
                            >
                              {cust.isSuspended ? 'Unblock' : 'Suspend'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 7: PAYMENTS & TRANSACTIONS */}
          {activeSection === 'transactions' && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="font-serif text-2xl font-bold text-[#38243F]">7. Transactions & Refund Processing</h1>
                  <p className="text-xs text-[#8B7898]">
                    Audit all deposits, consultation deductions, and process satisfaction guarantee refunds.
                  </p>
                </div>
                <button
                  onClick={() => exportToCSV(transactions, 'lumsic_transactions_ledger')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#38243F]/20 text-xs font-semibold text-[#38243F] bg-white"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Transactions CSV</span>
                </button>
              </div>

              <div className="bg-white rounded-xl border border-[#E8DFC8] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF7F2] border-b border-[#E8DFC8] text-[#8B7898] uppercase text-[10px] tracking-wider font-semibold">
                      <tr>
                        <th className="py-3 px-4">TX ID</th>
                        <th className="py-3 px-3">Type</th>
                        <th className="py-3 px-3">Amount</th>
                        <th className="py-3 px-3">Balance After</th>
                        <th className="py-3 px-3">Description</th>
                        <th className="py-3 px-3">Timestamp</th>
                        <th className="py-3 px-4 text-right">Refund Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F2EADF]">
                      {transactions.map(tx => (
                        <tr key={tx.id} className="hover:bg-[#FAF7F2]/40 transition-colors">
                          <td className="py-3 px-4 font-mono font-semibold text-[#38243F]">{tx.id}</td>
                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                                tx.type === 'deposit'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : tx.type === 'refund'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {tx.type}
                            </span>
                          </td>
                          <td className={`py-3 px-3 font-bold ${tx.type === 'deposit' || tx.type === 'refund' ? 'text-emerald-700' : 'text-[#38243F]'}`}>
                            {tx.type === 'deposit' || tx.type === 'refund' ? '+' : '-'}${tx.amount.toFixed(2)}
                          </td>
                          <td className="py-3 px-3 text-[#8B7898]">${tx.balanceAfter?.toFixed(2)}</td>
                          <td className="py-3 px-3 text-[#38243F] max-w-sm truncate">{tx.description}</td>
                          <td className="py-3 px-3 text-[#8B7898]">{new Date(tx.timestamp).toLocaleString()}</td>
                          <td className="py-3 px-4 text-right">
                            {tx.type === 'consultation_deduction' && (
                              <button
                                onClick={() => setRefundingTx(tx)}
                                className="px-2 py-1 rounded bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 text-[10px] font-bold"
                              >
                                Issue Refund
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 8: WALLET MANAGEMENT */}
          {activeSection === 'wallets' && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="font-serif text-2xl font-bold text-[#38243F]">8. Wallet Ledgers & Manual Adjustment</h1>
                  <p className="text-xs text-[#8B7898]">
                    Inspect customer & reader wallet float balances. Credit/debit with mandatory audit trail.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => exportToCSV(wallets, 'lumsic_wallets_snapshot')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#38243F]/20 text-xs font-semibold text-[#38243F] bg-white"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>
                  <button
                    onClick={() => setShowWalletModal(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#38243F] text-white text-xs font-semibold"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add / Deduct Funds</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {wallets.map((w, idx) => (
                  <div key={idx} className="bg-white rounded-xl border border-[#E8DFC8] p-4 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-[#38243F]">{w.name}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-[#FAF7F2] text-[#8B7898]">
                          {w.role}
                        </span>
                      </div>
                      <p className="text-xs text-[#8B7898]">{w.email}</p>
                      {w.astrologerId && <p className="text-xs font-mono text-[#9B4D96] font-semibold">ID: {w.astrologerId}</p>}
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#F2EADF] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-[#8B7898]">Available Balance</span>
                        <p className="text-xl font-bold text-emerald-700">${w.balance.toFixed(2)}</p>
                      </div>
                      <button
                        onClick={() => {
                          setWalletAdjustForm({ userId: w.userId, type: 'credit', amount: '', reason: '' });
                          setShowWalletModal(true);
                        }}
                        className="px-2.5 py-1 rounded bg-[#FAF7F2] border border-[#E8DFC8] text-xs font-semibold text-[#38243F] hover:bg-[#F2EADF]"
                      >
                        Adjust
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 9: READER EARNINGS & PAYOUTS */}
          {activeSection === 'payouts' && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="font-serif text-2xl font-bold text-[#38243F]">9. Reader Earnings & Payout Requests</h1>
                  <p className="text-xs text-[#8B7898]">
                    Approve bank wires, PayPal transfers, and Stripe payouts for verified readers.
                  </p>
                </div>
                <button
                  onClick={() => exportToCSV(payouts, 'lumsic_payout_requests')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#38243F]/20 text-xs font-semibold text-[#38243F] bg-white"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>

              <div className="bg-white rounded-xl border border-[#E8DFC8] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF7F2] border-b border-[#E8DFC8] text-[#8B7898] uppercase text-[10px] tracking-wider font-semibold">
                      <tr>
                        <th className="py-3 px-4">Reader</th>
                        <th className="py-3 px-3">Reader ID</th>
                        <th className="py-3 px-3">Amount</th>
                        <th className="py-3 px-3">Method</th>
                        <th className="py-3 px-3">Account Details</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-3">Requested At</th>
                        <th className="py-3 px-4 text-right">Approval Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F2EADF]">
                      {payouts.map(p => (
                        <tr key={p.id} className="hover:bg-[#FAF7F2]/40 transition-colors">
                          <td className="py-3 px-4 font-bold text-[#38243F]">{p.readerName}</td>
                          <td className="py-3 px-3 font-mono text-[#9B4D96] font-semibold">{p.astrologerId}</td>
                          <td className="py-3 px-3 font-bold text-emerald-700 text-sm">${p.amount.toFixed(2)}</td>
                          <td className="py-3 px-3 uppercase text-[10px] font-semibold">{p.paymentMethod}</td>
                          <td className="py-3 px-3 text-[#38243F] max-w-xs truncate">{p.payoutDetails}</td>
                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                                p.status === 'approved'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : p.status === 'rejected'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {p.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-[#8B7898]">{new Date(p.requestedAt).toLocaleDateString()}</td>
                          <td className="py-3 px-4 text-right">
                            {p.status === 'pending' ? (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleApprovePayout(p.id)}
                                  className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[10px]"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleRejectPayout(p.id)}
                                  className="px-2.5 py-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-[10px]"
                                >
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <span className="text-[10px] text-[#8B7898]">Ref: {p.transactionRef || 'Completed'}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 10: PRICING & COMMISSIONS & COUPONS */}
          {activeSection === 'pricing' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="font-serif text-2xl font-bold text-[#38243F]">10. Pricing, Commissions & Discount Coupons</h1>
                  <p className="text-xs text-[#8B7898]">
                    Configure global platform commission percentage and promotional promo codes.
                  </p>
                </div>
                <button
                  onClick={() => setShowCouponModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#38243F] text-white text-xs font-semibold"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Discount Coupon</span>
                </button>
              </div>

              {/* Global Pricing Rules */}
              <div className="bg-white rounded-xl border border-[#E8DFC8] p-5 shadow-sm">
                <h2 className="font-serif font-bold text-base text-[#38243F] mb-3">Global Commission & Minimum Rules</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-3 bg-[#FAF7F2] rounded-lg border border-[#E8DFC8]">
                    <span className="text-[#8B7898]">Platform Commission</span>
                    <p className="text-xl font-bold text-[#38243F] mt-1">{appSettings?.platformCommissionPercent || 15}%</p>
                    <span className="text-[10px] text-[#8B7898]">Retained by LUMSIC per completed reading</span>
                  </div>
                  <div className="p-3 bg-[#FAF7F2] rounded-lg border border-[#E8DFC8]">
                    <span className="text-[#8B7898]">Minimum Wallet Balance to Start</span>
                    <p className="text-xl font-bold text-[#38243F] mt-1">${(appSettings?.minWalletBalanceToStart || 5.0).toFixed(2)}</p>
                    <span className="text-[10px] text-[#8B7898]">Minimum prepaid float required before joining room</span>
                  </div>
                  <div className="p-3 bg-[#FAF7F2] rounded-lg border border-[#E8DFC8]">
                    <span className="text-[#8B7898]">Min Consultation Billing Unit</span>
                    <p className="text-xl font-bold text-[#38243F] mt-1">1 Minute</p>
                    <span className="text-[10px] text-[#8B7898]">Pro-rated per second afterwards</span>
                  </div>
                </div>
              </div>

              {/* Coupons Table */}
              <div className="bg-white rounded-xl border border-[#E8DFC8] overflow-hidden shadow-sm">
                <div className="p-4 border-b border-[#E8DFC8] flex items-center justify-between">
                  <h3 className="font-bold text-sm text-[#38243F]">Active Promotional Coupon Codes</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF7F2] border-b border-[#E8DFC8] text-[#8B7898] uppercase text-[10px] tracking-wider font-semibold">
                      <tr>
                        <th className="py-3 px-4">Coupon Code</th>
                        <th className="py-3 px-3">Type</th>
                        <th className="py-3 px-3">Discount Value</th>
                        <th className="py-3 px-3">Min Spend</th>
                        <th className="py-3 px-3">Usage</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F2EADF]">
                      {coupons.map(cpn => (
                        <tr key={cpn.id} className="hover:bg-[#FAF7F2]/40 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-[#9B4D96] text-sm">{cpn.code}</td>
                          <td className="py-3 px-3 uppercase text-[10px] font-semibold">{cpn.discountType}</td>
                          <td className="py-3 px-3 font-bold text-[#38243F]">
                            {cpn.discountType === 'percentage' ? `${cpn.discountValue}%` : `$${cpn.discountValue}`}
                          </td>
                          <td className="py-3 px-3 text-[#8B7898]">${cpn.minSpend || 0}</td>
                          <td className="py-3 px-3">
                            {cpn.usedCount} / {cpn.maxUses}
                          </td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800">
                              Active
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => handleDeleteCoupon(cpn.id)}
                              className="p-1 rounded text-rose-600 hover:bg-rose-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 11: CATEGORIES & SPECIALIZATIONS */}
          {activeSection === 'categories' && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="font-serif text-2xl font-bold text-[#38243F]">11. Categories & Specializations</h1>
                  <p className="text-xs text-[#8B7898]">
                    Manage spiritual and psychic specialization categories visible across seeker exploration pages.
                  </p>
                </div>
                <button
                  onClick={() => setShowCategoryModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#38243F] text-white text-xs font-semibold"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Category</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map(cat => (
                  <div key={cat.id} className="bg-white rounded-xl border border-[#E8DFC8] p-4 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="p-2 rounded-lg bg-[#FAF7F2] text-[#9B4D96] border border-[#E8DFC8]">
                            <Sparkles className="w-4 h-4" />
                          </span>
                          <span className="font-bold text-sm text-[#38243F]">{cat.name}</span>
                        </div>
                        <span className="text-[10px] text-[#8B7898] font-mono">#{cat.displayOrder}</span>
                      </div>
                      <p className="text-xs text-[#8B7898]">{cat.description}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#F2EADF] flex items-center justify-between text-xs">
                      <span className="text-[11px] text-[#8B7898]">{cat.readersCount || 0} Readers Assigned</span>
                      <button
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="text-rose-600 hover:text-rose-800 text-[11px] font-semibold"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 12: REVIEWS & RATINGS */}
          {activeSection === 'reviews' && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="font-serif text-2xl font-bold text-[#38243F]">12. Reviews & Rating Moderation</h1>
                  <p className="text-xs text-[#8B7898]">
                    Approve, hide, or dispute client reviews. Reader average rating recalculates automatically.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-[#E8DFC8] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF7F2] border-b border-[#E8DFC8] text-[#8B7898] uppercase text-[10px] tracking-wider font-semibold">
                      <tr>
                        <th className="py-3 px-4">Customer</th>
                        <th className="py-3 px-3">Rating</th>
                        <th className="py-3 px-3">Review Comment</th>
                        <th className="py-3 px-3">Timestamp</th>
                        <th className="py-3 px-3">Visibility</th>
                        <th className="py-3 px-4 text-right">Moderation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F2EADF]">
                      {reviews.map(rev => (
                        <tr key={rev.id} className="hover:bg-[#FAF7F2]/40 transition-colors">
                          <td className="py-3 px-4 font-semibold text-[#38243F]">{rev.customerName}</td>
                          <td className="py-3 px-3">
                            <div className="flex items-center text-[#D4AF37]">
                              {[...Array(rev.rating || 5)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-[#D4AF37]" />
                              ))}
                            </div>
                          </td>
                          <td className="py-3 px-3 text-[#38243F] max-w-md italic">"{rev.comment}"</td>
                          <td className="py-3 px-3 text-[#8B7898]">{new Date(rev.timestamp).toLocaleDateString()}</td>
                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                                rev.isHidden ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {rev.isHidden ? 'HIDDEN' : 'APPROVED'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleToggleReviewVisibility(rev.id)}
                                className="px-2 py-1 rounded bg-[#FAF7F2] border border-[#E8DFC8] text-[10px] font-semibold text-[#38243F]"
                              >
                                {rev.isHidden ? 'Make Public' : 'Hide'}
                              </button>
                              <button
                                onClick={() => handleDeleteReview(rev.id)}
                                className="p-1 rounded text-rose-600 hover:bg-rose-50"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 13: BROADCAST ANNOUNCEMENTS */}
          {activeSection === 'broadcasts' && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="font-serif text-2xl font-bold text-[#38243F]">13. Broadcast Communication Engine</h1>
                  <p className="text-xs text-[#8B7898]">
                    Send in-app notifications and announcements to customers, astrologers, or all active platform users.
                  </p>
                </div>
                <button
                  onClick={() => setShowBroadcastModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#38243F] text-white text-xs font-semibold"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Broadcast</span>
                </button>
              </div>

              <div className="space-y-3">
                {broadcasts.map(bc => (
                  <div key={bc.id} className="bg-white rounded-xl border border-[#E8DFC8] p-4 shadow-sm flex items-start gap-4">
                    <div className="p-2.5 rounded-xl bg-[#FAF7F2] text-[#9B4D96] border border-[#E8DFC8] shrink-0">
                      <Bell className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-sm text-[#38243F]">{bc.title}</span>
                        <span className="text-[11px] text-[#8B7898]">{new Date(bc.sentAt).toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-[#38243F]/85 mt-1">{bc.message}</p>
                      <div className="flex items-center gap-3 mt-2 text-[10px] text-[#8B7898]">
                        <span>Target: <strong className="uppercase text-[#38243F]">{bc.target}</strong></span>
                        <span>Recipients: {bc.recipientsCount}</span>
                        <span>Sent by: {bc.sentBy}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 14: SUPPORT & TICKETS */}
          {activeSection === 'support' && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="font-serif text-2xl font-bold text-[#38243F]">14. Customer Support & Complaints Desk</h1>
                  <p className="text-xs text-[#8B7898]">
                    Respond to billing inquiries, session quality complaints, and dispute resolution tickets.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {tickets.map(t => (
                  <div key={t.id} className="bg-white rounded-xl border border-[#E8DFC8] p-5 shadow-sm space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-[#9B4D96]">{t.ticketNumber}</span>
                        <span className="font-bold text-sm text-[#38243F]">{t.subject}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                            t.priority === 'urgent'
                              ? 'bg-rose-100 text-rose-800'
                              : t.priority === 'high'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {t.priority}
                        </span>
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                            t.status === 'resolved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : t.status === 'in_progress'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {t.status}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-[#8B7898]">
                      Submitted by: <strong>{t.userName}</strong> ({t.userEmail}) • Category: {t.category}
                      {t.sessionReferenceId && ` • Ref: ${t.sessionReferenceId}`}
                    </p>

                    <p className="text-xs text-[#38243F] bg-[#FAF7F2] p-3 rounded-lg border border-[#E8DFC8]/60">
                      {t.description}
                    </p>

                    {/* Responses */}
                    {t.responses && t.responses.length > 0 && (
                      <div className="space-y-2 pl-4 border-l-2 border-[#9B4D96]">
                        {t.responses.map(resp => (
                          <div key={resp.id} className="text-xs">
                            <span className="font-semibold text-[#9B4D96]">{resp.senderName}</span>
                            <span className="text-[10px] text-[#8B7898] ml-2">{new Date(resp.timestamp).toLocaleTimeString()}</span>
                            <p className="text-[#38243F] mt-0.5">{resp.message}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => {
                          setSelectedTicket(t);
                          setTicketReplyText('');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#38243F] hover:bg-[#241729] text-white text-xs font-semibold flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Reply & Update Status</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 15: WEBSITE CONTENT MANAGEMENT */}
          {activeSection === 'content' && (
            <div className="space-y-6">
              <div>
                <h1 className="font-serif text-2xl font-bold text-[#38243F]">15. Website Content Management</h1>
                <p className="text-xs text-[#8B7898]">
                  Edit homepage headings, global tagline, announcement banner, and FAQs.
                </p>
              </div>

              {websiteContent && (
                <form onSubmit={handleSaveWebsiteContent} className="bg-white rounded-xl border border-[#E8DFC8] p-6 shadow-sm space-y-5 text-xs">
                  <div>
                    <label className="font-semibold block text-[#38243F] mb-1">
                      Hero Stylish Tagline (User Requested)
                    </label>
                    <input
                      type="text"
                      value={websiteContent.heroTagline}
                      onChange={e => setWebsiteContent({ ...websiteContent, heroTagline: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg bg-[#FAF7F2] font-serif italic text-sm text-[#38243F]"
                    />
                    <span className="text-[10px] text-[#8B7898]">Displays prominently in gold script above home hero heading.</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold block text-[#38243F] mb-1">Homepage Main Headline</label>
                      <input
                        type="text"
                        value={websiteContent.heroHeadline}
                        onChange={e => setWebsiteContent({ ...websiteContent, heroHeadline: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg bg-[#FAF7F2]"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block text-[#38243F] mb-1">Top Announcement Banner</label>
                      <input
                        type="text"
                        value={websiteContent.announcementText}
                        onChange={e => setWebsiteContent({ ...websiteContent, announcementText: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg bg-[#FAF7F2]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold block text-[#38243F] mb-1">Homepage Subtitle</label>
                    <textarea
                      rows={2}
                      value={websiteContent.heroSubtitle}
                      onChange={e => setWebsiteContent({ ...websiteContent, heroSubtitle: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg bg-[#FAF7F2]"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    <div>
                      <label className="font-semibold block text-[#38243F] mb-1">Terms of Service Excerpt</label>
                      <textarea
                        rows={3}
                        value={websiteContent.termsPolicy}
                        onChange={e => setWebsiteContent({ ...websiteContent, termsPolicy: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg bg-[#FAF7F2]"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block text-[#38243F] mb-1">Privacy Guarantee Policy</label>
                      <textarea
                        rows={3}
                        value={websiteContent.privacyPolicy}
                        onChange={e => setWebsiteContent({ ...websiteContent, privacyPolicy: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg bg-[#FAF7F2]"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block text-[#38243F] mb-1">100% Satisfaction Refund Policy</label>
                      <textarea
                        rows={3}
                        value={websiteContent.refundPolicy}
                        onChange={e => setWebsiteContent({ ...websiteContent, refundPolicy: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg bg-[#FAF7F2]"
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#F2EADF] flex justify-end">
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-lg bg-[#38243F] text-white font-bold hover:bg-[#241729]"
                    >
                      Save Website Content
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* SECTION 16: GLOBAL SETTINGS */}
          {activeSection === 'global-settings' && (
            <div className="space-y-6">
              <div>
                <h1 className="font-serif text-2xl font-bold text-[#38243F]">16. Global Settings & Currency Rates</h1>
                <p className="text-xs text-[#8B7898]">
                  Manage system currencies, maintenance switch, and commission thresholds.
                </p>
              </div>

              {appSettings && (
                <form onSubmit={handleSaveSettings} className="bg-white rounded-xl border border-[#E8DFC8] p-6 shadow-sm space-y-4 text-xs max-w-xl">
                  <div>
                    <label className="font-semibold block text-[#38243F] mb-1">Default Base Currency</label>
                    <select
                      value={appSettings.defaultCurrency}
                      onChange={e => setAppSettings({ ...appSettings, defaultCurrency: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg bg-[#FAF7F2]"
                    >
                      <option value="USD">USD ($ - United States Dollar)</option>
                      <option value="EUR">EUR (€ - Euro)</option>
                      <option value="GBP">GBP (£ - British Pound)</option>
                      <option value="CAD">CAD ($ - Canadian Dollar)</option>
                      <option value="AUD">AUD ($ - Australian Dollar)</option>
                      <option value="INR">INR (₹ - Indian Rupee)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold block text-[#38243F] mb-1">Platform Commission (%)</label>
                    <input
                      type="number"
                      value={appSettings.platformCommissionPercent}
                      onChange={e =>
                        setAppSettings({ ...appSettings, platformCommissionPercent: parseFloat(e.target.value) || 15 })
                      }
                      className="w-full px-3 py-2 border rounded-lg bg-[#FAF7F2]"
                    />
                  </div>

                  <div>
                    <label className="font-semibold block text-[#38243F] mb-1">Global System Notice Message</label>
                    <input
                      type="text"
                      value={appSettings.systemNotice}
                      onChange={e => setAppSettings({ ...appSettings, systemNotice: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg bg-[#FAF7F2]"
                    />
                  </div>

                  <div className="pt-3 border-t border-[#F2EADF] flex justify-end">
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-lg bg-[#38243F] text-white font-bold hover:bg-[#241729]"
                    >
                      Update Global Settings
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* SECTION 17: REPORTS & ANALYTICS */}
          {activeSection === 'reports' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="font-serif text-2xl font-bold text-[#38243F]">17. Financial Reports & Analytics</h1>
                  <p className="text-xs text-[#8B7898]">
                    Revenue breakdown, net commission calculations, and reader earnings liability.
                  </p>
                </div>
                <button
                  onClick={() => exportToCSV(reportsData?.readerLeaderboard || [], 'lumsic_analytics_leaderboard')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#38243F] text-white text-xs font-semibold"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Analytics CSV</span>
                </button>
              </div>

              {reportsData && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-white border border-[#E8DFC8] shadow-sm">
                    <span className="text-xs text-[#8B7898]">Gross Consultation Volume</span>
                    <p className="text-2xl font-bold font-serif text-[#38243F] mt-1">${reportsData.grossRevenue.toFixed(2)}</p>
                    <span className="text-[10px] text-[#8B7898]">From all completed sessions</span>
                  </div>
                  <div className="p-4 rounded-xl bg-white border border-[#E8DFC8] shadow-sm">
                    <span className="text-xs text-[#8B7898]">LUMSIC Net Commission (15%)</span>
                    <p className="text-2xl font-bold font-serif text-emerald-700 mt-1">${reportsData.platformCommission.toFixed(2)}</p>
                    <span className="text-[10px] text-emerald-700">Platform operational earnings</span>
                  </div>
                  <div className="p-4 rounded-xl bg-white border border-[#E8DFC8] shadow-sm">
                    <span className="text-xs text-[#8B7898]">Reader Earnings Liability (85%)</span>
                    <p className="text-2xl font-bold font-serif text-[#9B4D96] mt-1">${reportsData.readerEarningsLiability.toFixed(2)}</p>
                    <span className="text-[10px] text-[#8B7898]">Payable to psychic consultants</span>
                  </div>
                </div>
              )}

              {/* Reader Leaderboard */}
              <div className="bg-white rounded-xl border border-[#E8DFC8] overflow-hidden shadow-sm">
                <div className="p-4 border-b border-[#E8DFC8]">
                  <h3 className="font-bold text-sm text-[#38243F]">Top Performing Psychics Leaderboard</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF7F2] border-b border-[#E8DFC8] text-[#8B7898] uppercase text-[10px] tracking-wider font-semibold">
                      <tr>
                        <th className="py-3 px-4">Rank</th>
                        <th className="py-3 px-3">Reader</th>
                        <th className="py-3 px-3">Reader ID</th>
                        <th className="py-3 px-3">Rating</th>
                        <th className="py-3 px-3">Sessions Completed</th>
                        <th className="py-3 px-4 text-right">Total Generated</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F2EADF]">
                      {(reportsData?.readerLeaderboard || []).map((r: any, idx: number) => (
                        <tr key={r.id} className="hover:bg-[#FAF7F2]/40 transition-colors">
                          <td className="py-3 px-4 font-bold text-[#8B7898]">#{idx + 1}</td>
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2">
                              <img src={r.avatar} alt={r.name} className="w-7 h-7 rounded-full object-cover" />
                              <span className="font-semibold text-[#38243F]">{r.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-3 font-mono text-[#9B4D96] font-semibold">{r.astrologerId}</td>
                          <td className="py-3 px-3">
                            <div className="flex items-center text-[#D4AF37] font-semibold gap-1">
                              <Star className="w-3.5 h-3.5 fill-[#D4AF37]" />
                              <span>{r.rating.toFixed(1)}</span>
                            </div>
                          </td>
                          <td className="py-3 px-3">{r.totalConsultations} readings</td>
                          <td className="py-3 px-4 text-right font-bold text-[#38243F] text-sm">${r.earningsTotal.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 18: STAFF & PERMISSIONS */}
          {activeSection === 'staff' && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="font-serif text-2xl font-bold text-[#38243F]">18. Admin Staff & Role Permissions</h1>
                  <p className="text-xs text-[#8B7898]">
                    Control administration access, manage operations managers, finance auditors, and support agents.
                  </p>
                </div>
                <button
                  onClick={() => setShowStaffModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#38243F] text-white text-xs font-semibold"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Staff Member</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {staff.map(st => (
                  <div key={st.id} className="bg-white rounded-xl border border-[#E8DFC8] p-4 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-sm text-[#38243F]">{st.fullName}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-[#FAF7F2] text-[#9B4D96] border border-[#E8DFC8]">
                          {st.role.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-[#8B7898]">{st.email}</p>
                      <p className="text-[11px] text-[#8B7898] mt-2">
                        Last Active: {new Date(st.lastActive).toLocaleTimeString()}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#F2EADF] flex items-center justify-between text-xs">
                      <span className="text-[10px] text-emerald-700 font-semibold uppercase">{st.status}</span>
                      {st.role !== 'super_admin' && (
                        <button
                          onClick={() => handleDeleteStaff(st.id)}
                          className="text-rose-600 hover:text-rose-800 text-[11px] font-semibold"
                        >
                          Revoke Access
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 19: SECURITY & AUDIT LOGS */}
          {activeSection === 'logs' && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="font-serif text-2xl font-bold text-[#38243F]">19. Immutable Security & Audit Trail</h1>
                  <p className="text-xs text-[#8B7898]">
                    Chronological audit log recording every workflow toggle, reader edit, refund, and balance adjustment.
                  </p>
                </div>
                <button
                  onClick={() => exportToCSV(activityLogs, 'lumsic_security_audit_logs')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#38243F]/20 text-xs font-semibold text-[#38243F] bg-white"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Logs CSV</span>
                </button>
              </div>

              <div className="bg-white rounded-xl border border-[#E8DFC8] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF7F2] border-b border-[#E8DFC8] text-[#8B7898] uppercase text-[10px] tracking-wider font-semibold">
                      <tr>
                        <th className="py-3 px-4">Timestamp</th>
                        <th className="py-3 px-3">Admin Actor</th>
                        <th className="py-3 px-3">Role</th>
                        <th className="py-3 px-3">Action Type</th>
                        <th className="py-3 px-4">Audit Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F2EADF]">
                      {activityLogs.map(log => (
                        <tr key={log.id} className="hover:bg-[#FAF7F2]/40 transition-colors">
                          <td className="py-3 px-4 font-mono text-[#8B7898]">{new Date(log.timestamp).toLocaleString()}</td>
                          <td className="py-3 px-3 font-semibold text-[#38243F]">{log.actorName}</td>
                          <td className="py-3 px-3 uppercase text-[10px] text-[#8B7898]">{log.actorRole}</td>
                          <td className="py-3 px-3">
                            <span className="font-mono text-[11px] font-bold text-[#9B4D96] px-1.5 py-0.5 rounded bg-[#FAF7F2] border border-[#E8DFC8]">
                              {log.action}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-[#38243F]">{log.details}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ----------------- MODALS ----------------- */}

      {/* Edit Reader Modal */}
      {editingReader && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-serif font-bold text-lg text-[#38243F]">
                Edit Reader Profile: {editingReader.name} ({editingReader.astrologerId})
              </h3>
              <button onClick={() => setEditingReader(null)} className="text-[#8B7898] hover:text-[#38243F]">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveReaderEdit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={editingReader.name}
                    onChange={e => setEditingReader({ ...editingReader, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Consultation Title</label>
                  <input
                    type="text"
                    value={editingReader.title}
                    onChange={e => setEditingReader({ ...editingReader, title: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Chat Price/min (USD)</label>
                  <input
                    type="number"
                    step="0.10"
                    value={editingReader.pricePerMinute}
                    onChange={e => setEditingReader({ ...editingReader, pricePerMinute: parseFloat(e.target.value) || 2.5 })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">INR Rate (₹/min)</label>
                  <input
                    type="number"
                    value={editingReader.inrPrice || ''}
                    onChange={e => setEditingReader({ ...editingReader, inrPrice: parseFloat(e.target.value) || 35 })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Experience Years</label>
                  <input
                    type="number"
                    value={editingReader.experienceYears}
                    onChange={e => setEditingReader({ ...editingReader, experienceYears: parseInt(e.target.value, 10) || 5 })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1.5 text-[#38243F]">
                  Profile Picture (Upload from Computer / Device)
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl border border-dashed border-[#9B4D96]/40 bg-[#FAF7F2]">
                  <div className="relative group shrink-0">
                    <img
                      src={editingReader.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80'}
                      alt="preview"
                      className="w-20 h-20 rounded-full object-cover border-2 border-[#9B4D96] shadow-sm bg-white"
                    />
                    <label className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[10px] font-semibold cursor-pointer">
                      <Camera className="w-5 h-5 text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => {
                          if (e.target.files?.[0]) handleAvatarFileUpload(e.target.files[0], false);
                        }}
                      />
                    </label>
                  </div>

                  <div className="flex-1 space-y-2 text-center sm:text-left">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#38243F] hover:bg-[#241729] text-white text-xs font-bold shadow-sm transition-colors">
                        <Upload className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Choose Photo from Device</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={e => {
                            if (e.target.files?.[0]) handleAvatarFileUpload(e.target.files[0], false);
                          }}
                        />
                      </label>

                      {editingReader.avatar && (
                        <button
                          type="button"
                          onClick={() => setEditingReader({ ...editingReader, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80' })}
                          className="px-3 py-2 rounded-lg border border-[#E8DFC8] bg-white hover:bg-rose-50 text-rose-600 text-xs font-medium"
                        >
                          Reset Default
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-[#8B7898]">
                      Supports PNG, JPG, JPEG, WEBP. No external links required; image loads instantly from your system.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Specializations (comma separated)</label>
                <input
                  type="text"
                  value={editingReader.specializations.join(', ')}
                  onChange={e => setEditingReader({ ...editingReader, specializations: e.target.value.split(',').map(s => s.trim()) })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Languages (comma separated)</label>
                <input
                  type="text"
                  value={editingReader.languages.join(', ')}
                  onChange={e => setEditingReader({ ...editingReader, languages: e.target.value.split(',').map(s => s.trim()) })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Biography</label>
                <textarea
                  rows={3}
                  value={editingReader.bio}
                  onChange={e => setEditingReader({ ...editingReader, bio: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-semibold">
                  <input
                    type="checkbox"
                    checked={editingReader.workflowEnabled}
                    onChange={e => setEditingReader({ ...editingReader, workflowEnabled: e.target.checked })}
                    className="rounded text-[#9B4D96]"
                  />
                  <span>Workflow Active (ON)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-semibold">
                  <input
                    type="checkbox"
                    checked={editingReader.isOnline}
                    onChange={e => setEditingReader({ ...editingReader, isOnline: e.target.checked })}
                    className="rounded text-emerald-600"
                  />
                  <span>Is Online</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setEditingReader(null)}
                  className="px-4 py-2 rounded-lg border text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#38243F] text-white text-xs font-bold hover:bg-[#241729]"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Reader Modal */}
      {showAddReaderModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-serif font-bold text-lg text-[#38243F]">Onboard New Reader</h3>
              <button onClick={() => setShowAddReaderModal(false)} className="text-[#8B7898]">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateReader} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Full Name</label>
                <input
                  type="text"
                  value={newReaderForm.name}
                  onChange={e => setNewReaderForm({ ...newReaderForm, name: e.target.value })}
                  placeholder="e.g. Psychic Nicole"
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Title</label>
                  <input
                    type="text"
                    value={newReaderForm.title}
                    onChange={e => setNewReaderForm({ ...newReaderForm, title: e.target.value })}
                    placeholder="Clairvoyant & Tarot Expert"
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Login Email</label>
                  <input
                    type="email"
                    value={newReaderForm.email}
                    onChange={e => setNewReaderForm({ ...newReaderForm, email: e.target.value })}
                    placeholder="reader@lumsic.com"
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="font-semibold block mb-1">Price/min ($)</label>
                <input
                  type="number"
                  step="0.10"
                  value={newReaderForm.pricePerMinute}
                  onChange={e => setNewReaderForm({ ...newReaderForm, pricePerMinute: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1 text-[#38243F]">
                  Profile Picture (Upload from Computer)
                </label>
                <div className="flex items-center gap-3 p-3 rounded-xl border border-dashed border-[#9B4D96]/40 bg-[#FAF7F2]">
                  <img
                    src={newReaderForm.avatar}
                    alt="avatar preview"
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#9B4D96] bg-white shrink-0"
                  />
                  <div className="flex-1">
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#38243F] hover:bg-[#241729] text-white text-xs font-bold shadow-sm">
                      <Upload className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Choose Image File</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => {
                          if (e.target.files?.[0]) handleAvatarFileUpload(e.target.files[0], true);
                        }}
                      />
                    </label>
                    <p className="text-[10px] text-[#8B7898] mt-1">Select PNG, JPG, or WEBP from your device.</p>
                  </div>
                </div>
              </div>
              <div>
                <label className="font-semibold block mb-1">Specializations</label>
                <input
                  type="text"
                  value={newReaderForm.specializations}
                  onChange={e => setNewReaderForm({ ...newReaderForm, specializations: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Biography</label>
                <textarea
                  rows={2}
                  value={newReaderForm.bio}
                  onChange={e => setNewReaderForm({ ...newReaderForm, bio: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddReaderModal(false)}
                  className="px-4 py-2 rounded-lg border text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#38243F] text-white text-xs font-bold"
                >
                  Create & Activate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Wallet Adjustment Modal */}
      {showWalletModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-serif font-bold text-base text-[#38243F]">Adjust Wallet Balance</h3>
              <button onClick={() => setShowWalletModal(false)} className="text-[#8B7898]">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAdjustWallet} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Select User / Account</label>
                <select
                  value={walletAdjustForm.userId}
                  onChange={e => setWalletAdjustForm({ ...walletAdjustForm, userId: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-[#FAF7F2]"
                  required
                >
                  <option value="">-- Choose Account --</option>
                  {wallets.map(w => (
                    <option key={w.userId} value={w.userId}>
                      {w.name} ({w.role}) - Current: ${w.balance.toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Action Type</label>
                  <select
                    value={walletAdjustForm.type}
                    onChange={e => setWalletAdjustForm({ ...walletAdjustForm, type: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-lg bg-[#FAF7F2]"
                  >
                    <option value="credit">Credit (+ Add Funds)</option>
                    <option value="debit">Debit (- Deduct Funds)</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Amount ($ USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={walletAdjustForm.amount}
                    onChange={e => setWalletAdjustForm({ ...walletAdjustForm, amount: e.target.value })}
                    placeholder="50.00"
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="font-semibold block mb-1">Mandatory Audit Reason</label>
                <input
                  type="text"
                  value={walletAdjustForm.reason}
                  onChange={e => setWalletAdjustForm({ ...walletAdjustForm, reason: e.target.value })}
                  placeholder="e.g. Goodwill compensation for disconnected call"
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowWalletModal(false)}
                  className="px-4 py-2 rounded-lg border text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#38243F] text-white text-xs font-bold"
                >
                  Execute Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Refund Modal */}
      {refundingTx && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-serif font-bold text-base text-[#38243F]">
              Confirm Refund for ${refundingTx.amount.toFixed(2)}
            </h3>
            <p className="text-xs text-[#8B7898]">
              Transaction: {refundingTx.id} • Session: {refundingTx.referenceSessionId || 'N/A'}
            </p>
            <div className="text-xs">
              <label className="font-semibold block mb-1">Reason for Refund</label>
              <textarea
                rows={2}
                value={refundReason}
                onChange={e => setRefundReason(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t">
              <button onClick={() => setRefundingTx(null)} className="px-4 py-2 rounded-lg border text-xs">
                Cancel
              </button>
              <button
                onClick={handleProcessRefund}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
              >
                Execute Refund
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Reply Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-serif font-bold text-base text-[#38243F]">
                Reply to {selectedTicket.ticketNumber} ({selectedTicket.userName})
              </h3>
              <button onClick={() => setSelectedTicket(null)} className="text-[#8B7898]">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleReplyTicket} className="space-y-3 text-xs">
              <p className="p-3 rounded-lg bg-[#FAF7F2] text-[#38243F] border border-[#E8DFC8]">
                <strong>Seeker Query:</strong> {selectedTicket.description}
              </p>
              <div>
                <label className="font-semibold block mb-1">Support Official Response</label>
                <textarea
                  rows={4}
                  value={ticketReplyText}
                  onChange={e => setTicketReplyText(e.target.value)}
                  placeholder="Type official response to seeker..."
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Update Ticket Status</label>
                <select
                  value={ticketNewStatus}
                  onChange={e => setTicketNewStatus(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-[#FAF7F2]"
                >
                  <option value="resolved">Resolved & Closed</option>
                  <option value="in_progress">Keep In Progress</option>
                  <option value="closed">Closed Without Action</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setSelectedTicket(null)}
                  className="px-4 py-2 rounded-lg border text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#38243F] text-white text-xs font-bold"
                >
                  Send Response
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Broadcast Modal */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-serif font-bold text-base text-[#38243F]">New Broadcast Announcement</h3>
              <button onClick={() => setShowBroadcastModal(false)} className="text-[#8B7898]">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSendBroadcast} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Target Audience</label>
                <select
                  value={broadcastForm.target}
                  onChange={e => setBroadcastForm({ ...broadcastForm, target: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-[#FAF7F2]"
                >
                  <option value="all">All Platform Users (Seekers & Readers)</option>
                  <option value="customers">Seekers & Customers Only</option>
                  <option value="readers">Astrologers & Readers Only</option>
                </select>
              </div>
              <div>
                <label className="font-semibold block mb-1">Headline Title</label>
                <input
                  type="text"
                  value={broadcastForm.title}
                  onChange={e => setBroadcastForm({ ...broadcastForm, title: e.target.value })}
                  placeholder="e.g. Weekend Full Moon Special Discount"
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Message Body</label>
                <textarea
                  rows={3}
                  value={broadcastForm.message}
                  onChange={e => setBroadcastForm({ ...broadcastForm, message: e.target.value })}
                  placeholder="Type message content..."
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(false)}
                  className="px-4 py-2 rounded-lg border text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#38243F] text-white text-xs font-bold"
                >
                  Send Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-serif font-bold text-base text-[#38243F]">Add Specialization Category</h3>
              <button onClick={() => setShowCategoryModal(false)} className="text-[#8B7898]">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateCategory} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Category Name</label>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={e => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  placeholder="e.g. Chakra Balancing & Energy Healing"
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={categoryForm.description}
                  onChange={e => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="px-4 py-2 rounded-lg border text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#38243F] text-white text-xs font-bold"
                >
                  Add Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Coupon Modal */}
      {showCouponModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-serif font-bold text-base text-[#38243F]">Create Promotional Coupon</h3>
              <button onClick={() => setShowCouponModal(false)} className="text-[#8B7898]">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Coupon Code</label>
                <input
                  type="text"
                  value={couponForm.code}
                  onChange={e => setCouponForm({ ...couponForm, code: e.target.value })}
                  placeholder="e.g. LUMSICLOVE"
                  className="w-full px-3 py-2 border rounded-lg font-mono uppercase"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Discount Type</label>
                  <select
                    value={couponForm.discountType}
                    onChange={e => setCouponForm({ ...couponForm, discountType: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-lg bg-[#FAF7F2]"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Dollar ($)</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Discount Value</label>
                  <input
                    type="number"
                    value={couponForm.discountValue}
                    onChange={e => setCouponForm({ ...couponForm, discountValue: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowCouponModal(false)}
                  className="px-4 py-2 rounded-lg border text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#38243F] text-white text-xs font-bold"
                >
                  Activate Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Staff Modal */}
      {showStaffModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-serif font-bold text-base text-[#38243F]">Invite Admin Staff</h3>
              <button onClick={() => setShowStaffModal(false)} className="text-[#8B7898]">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateStaff} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Full Name</label>
                <input
                  type="text"
                  value={staffForm.fullName}
                  onChange={e => setStaffForm({ ...staffForm, fullName: e.target.value })}
                  placeholder="e.g. Julian Sterling"
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Corporate Email</label>
                <input
                  type="email"
                  value={staffForm.email}
                  onChange={e => setStaffForm({ ...staffForm, email: e.target.value })}
                  placeholder="julian@lumsic.com"
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Role & Authority Level</label>
                <select
                  value={staffForm.role}
                  onChange={e => setStaffForm({ ...staffForm, role: e.target.value as any })}
                  className="w-full px-3 py-2 border rounded-lg bg-[#FAF7F2]"
                >
                  <option value="manager">Operations Manager (Reader & Chat supervision)</option>
                  <option value="finance">Finance Admin (Payouts & Wallets)</option>
                  <option value="support">Support Agent (Tickets & Disputes)</option>
                  <option value="super_admin">Super Admin (Full Access)</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowStaffModal(false)}
                  className="px-4 py-2 rounded-lg border text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#38243F] text-white text-xs font-bold"
                >
                  Add Staff Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Consultation Transfer Modal */}
      <AdminTransferModal
        session={transferSession}
        isOpen={Boolean(transferSession)}
        onClose={() => setTransferSession(null)}
        onSuccess={() => {
          setTransferSession(null);
          showToast('Session transferred to target reader.');
          loadData();
        }}
      />
    </div>
  );
};
