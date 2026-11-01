import {
  UserProfile,
  Reader,
  ConsultationSession,
  ChatMessage,
  Wallet,
  WalletTransaction,
  NotificationItem,
  ReviewItem,
  AppSettings,
} from '../types';

const API_BASE = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('lumsic_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }
  return data as T;
}

export const api = {
  // ---------------- AUTH ----------------
  auth: {
    async login(email: string, password: string): Promise<{ user: UserProfile; token: string }> {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await handleResponse<{ user: UserProfile; token: string }>(res);
      localStorage.setItem('lumsic_token', data.token);
      localStorage.setItem('lumsic_user', JSON.stringify(data.user));
      return data;
    },

    async signup(payload: {
      fullName: string;
      email: string;
      phone: string;
      password: string;
      role?: 'customer' | 'astrologer';
      country?: string;
      currency?: string;
    }): Promise<{ user: UserProfile; token: string }> {
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await handleResponse<{ user: UserProfile; token: string }>(res);
      localStorage.setItem('lumsic_token', data.token);
      localStorage.setItem('lumsic_user', JSON.stringify(data.user));
      return data;
    },

    async recoverPassword(email: string): Promise<{ success: boolean; message: string; recoveryCode?: string }> {
      const res = await fetch(`${API_BASE}/auth/recover`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      return handleResponse(res);
    },

    async resetPassword(email: string, token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
      const res = await fetch(`${API_BASE}/auth/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token, newPassword }),
      });
      return handleResponse(res);
    },

    async changePassword(payload: { userId: string; currentPassword?: string; newPassword: string }): Promise<{ success: boolean; message: string }> {
      const res = await fetch(`${API_BASE}/auth/change-password`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      return handleResponse(res);
    },

    logout() {
      localStorage.removeItem('lumsic_token');
      localStorage.removeItem('lumsic_user');
    },

    getStoredUser(): UserProfile | null {
      try {
        const item = localStorage.getItem('lumsic_user');
        return item ? JSON.parse(item) : null;
      } catch {
        return null;
      }
    },
  },

  // ---------------- READERS ----------------
  readers: {
    async list(filters?: {
      search?: string;
      category?: string;
      onlineOnly?: boolean;
      maxPrice?: number;
      language?: string;
      workflowOnly?: boolean;
    }): Promise<Reader[]> {
      const params = new URLSearchParams();
      if (filters?.search) params.append('search', filters.search);
      if (filters?.category) params.append('category', filters.category);
      if (filters?.onlineOnly) params.append('onlineOnly', 'true');
      if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
      if (filters?.language) params.append('language', filters.language);
      if (filters?.workflowOnly) params.append('workflowOnly', 'true');

      const res = await fetch(`${API_BASE}/readers?${params.toString()}`);
      return handleResponse<Reader[]>(res);
    },

    async get(id: string): Promise<Reader> {
      const res = await fetch(`${API_BASE}/readers/${id}`);
      return handleResponse<Reader>(res);
    },

    async updateAvailability(readerId: string, status: { isOnline?: boolean; isBusy?: boolean }): Promise<{ success: boolean; reader: Reader }> {
      const res = await fetch(`${API_BASE}/readers/${readerId}/availability`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(status),
      });
      return handleResponse(res);
    },

    async updateProfile(readerId: string, data: Partial<Reader>): Promise<{ success: boolean; reader: Reader }> {
      const res = await fetch(`${API_BASE}/readers/${readerId}/profile`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },

    async getWithdrawals(readerId: string): Promise<any[]> {
      const res = await fetch(`${API_BASE}/readers/${readerId}/withdrawals`, {
        headers: getAuthHeaders(),
      });
      return handleResponse<any[]>(res);
    },

    async requestWithdrawal(readerId: string, payload: { amount: number; paymentMethod: string; payoutDetails: string }): Promise<{ success: boolean; payout: any; walletBalance: number }> {
      const res = await fetch(`${API_BASE}/readers/${readerId}/withdrawals`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      return handleResponse(res);
    },

    async getReviews(readerId: string): Promise<ReviewItem[]> {
      const res = await fetch(`${API_BASE}/readers/${readerId}/reviews`, {
        headers: getAuthHeaders(),
      });
      return handleResponse<ReviewItem[]>(res);
    },

    async replyReview(readerId: string, reviewId: string, reply: string): Promise<{ success: boolean; review: ReviewItem }> {
      const res = await fetch(`${API_BASE}/readers/${readerId}/reviews/${reviewId}/reply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ reply }),
      });
      return handleResponse(res);
    },
  },

  // ---------------- TICKETS ----------------
  tickets: {
    async list(userId?: string): Promise<any[]> {
      const q = userId ? `?userId=${encodeURIComponent(userId)}` : '';
      const res = await fetch(`${API_BASE}/tickets${q}`, {
        headers: getAuthHeaders(),
      });
      return handleResponse<any[]>(res);
    },

    async create(payload: {
      userId: string;
      userName: string;
      userEmail: string;
      userRole?: string;
      subject: string;
      category: string;
      priority: string;
      description: string;
    }): Promise<any> {
      const res = await fetch(`${API_BASE}/tickets`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      return handleResponse(res);
    },
  },

  // ---------------- CONSULTATIONS ----------------
  consultations: {
    async request(payload: {
      customerId: string;
      astrologerId: string;
      initialTopic?: string;
    }): Promise<ConsultationSession> {
      const res = await fetch(`${API_BASE}/consultations/request`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      return handleResponse<ConsultationSession>(res);
    },

    async accept(sessionId: string): Promise<{ success: boolean; session: ConsultationSession }> {
      const res = await fetch(`${API_BASE}/consultations/${sessionId}/accept`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },

    async reject(sessionId: string, reason?: string): Promise<{ success: boolean; session: ConsultationSession }> {
      const res = await fetch(`${API_BASE}/consultations/${sessionId}/reject`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ reason }),
      });
      return handleResponse(res);
    },

    async end(sessionId: string): Promise<{ success: boolean; session: ConsultationSession }> {
      const res = await fetch(`${API_BASE}/consultations/${sessionId}/end`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },

    async transfer(sessionId: string, newAstrologerId: string, reason: string): Promise<{ success: boolean; session: ConsultationSession }> {
      const res = await fetch(`${API_BASE}/consultations/${sessionId}/transfer`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ newAstrologerId, reason }),
      });
      return handleResponse(res);
    },

    async list(params?: { userId?: string; role?: string; astrologerId?: string }): Promise<ConsultationSession[]> {
      const q = new URLSearchParams();
      if (params?.userId) q.append('userId', params.userId);
      if (params?.role) q.append('role', params.role);
      if (params?.astrologerId) q.append('astrologerId', params.astrologerId);

      const res = await fetch(`${API_BASE}/consultations?${q.toString()}`);
      return handleResponse<ConsultationSession[]>(res);
    },

    async get(sessionId: string): Promise<ConsultationSession> {
      const res = await fetch(`${API_BASE}/consultations/${sessionId}`);
      return handleResponse<ConsultationSession>(res);
    },
  },

  // ---------------- CHAT ----------------
  chat: {
    async getMessages(sessionId: string): Promise<ChatMessage[]> {
      const res = await fetch(`${API_BASE}/chat/${sessionId}/messages`);
      return handleResponse<ChatMessage[]>(res);
    },

    async sendMessage(sessionId: string, payload: {
      senderId: string;
      senderRole: 'customer' | 'astrologer' | 'admin';
      senderName: string;
      content: string;
    }): Promise<ChatMessage> {
      const res = await fetch(`${API_BASE}/chat/${sessionId}/messages`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      return handleResponse<ChatMessage>(res);
    },
  },

  // ---------------- WALLET ----------------
  wallet: {
    async get(userId: string): Promise<Wallet> {
      const res = await fetch(`${API_BASE}/wallet/${userId}`);
      return handleResponse<Wallet>(res);
    },

    async deposit(payload: {
      userId: string;
      amount: number;
      currency?: string;
      paymentMethod?: string;
    }): Promise<{ success: boolean; balance: number; transaction: WalletTransaction }> {
      const res = await fetch(`${API_BASE}/wallet/deposit`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      return handleResponse(res);
    },

    async getTransactions(userId: string): Promise<WalletTransaction[]> {
      const res = await fetch(`${API_BASE}/wallet/${userId}/transactions`);
      return handleResponse<WalletTransaction[]>(res);
    },
  },

  // ---------------- ADMIN ----------------
  admin: {
    async getOverview(dateRange: string = 'all'): Promise<{
      totalCustomers: number;
      totalAstrologers: number;
      onlineAstrologers: number;
      offlineAstrologers: number;
      busyAstrologers: number;
      activeConsultations: number;
      pendingRequests: number;
      completedConsultations: number;
      totalRevenue: number;
      rangeRevenue: number;
      todayRevenue: number;
      monthlyRevenue: number;
      totalWalletBalance: number;
      pendingPayoutsCount: number;
      pendingApplicationsCount: number;
      openTicketsCount: number;
      recentActivity: any[];
    }> {
      const res = await fetch(`${API_BASE}/admin/overview?dateRange=${dateRange}`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },

    async toggleWorkflow(astrologerId: string, enabled: boolean): Promise<{ success: boolean; workflowEnabled: boolean; reader: Reader }> {
      const res = await fetch(`${API_BASE}/admin/astrologers/${astrologerId}/workflow`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ enabled }),
      });
      return handleResponse(res);
    },

    async createAstrologer(data: any): Promise<Reader> {
      const res = await fetch(`${API_BASE}/admin/astrologers`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse<Reader>(res);
    },

    async updateReader(id: string, data: any): Promise<{ success: boolean; reader: Reader }> {
      const res = await fetch(`${API_BASE}/admin/astrologers/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },

    async deleteReader(id: string): Promise<{ success: boolean; deletedId: string }> {
      const res = await fetch(`${API_BASE}/admin/astrologers/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },

    async getCustomers(): Promise<any[]> {
      const res = await fetch(`${API_BASE}/admin/customers`, {
        headers: getAuthHeaders(),
      });
      return handleResponse<any[]>(res);
    },

    async toggleSuspendCustomer(customerId: string): Promise<{ success: boolean; isSuspended: boolean }> {
      const res = await fetch(`${API_BASE}/admin/customers/${customerId}/suspend`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },

    async updateCustomerNotes(customerId: string, notes: string): Promise<{ success: boolean; adminNotes: string }> {
      const res = await fetch(`${API_BASE}/admin/customers/${customerId}/notes`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ notes }),
      });
      return handleResponse(res);
    },

    // Applications
    async getApplications(): Promise<any[]> {
      const res = await fetch(`${API_BASE}/admin/applications`, { headers: getAuthHeaders() });
      return handleResponse(res);
    },

    async approveApplication(id: string): Promise<any> {
      const res = await fetch(`${API_BASE}/admin/applications/${id}/approve`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },

    async rejectApplication(id: string, reason: string): Promise<any> {
      const res = await fetch(`${API_BASE}/admin/applications/${id}/reject`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ reason }),
      });
      return handleResponse(res);
    },

    // Consultation Supervision
    async endConsultation(id: string): Promise<any> {
      const res = await fetch(`${API_BASE}/admin/consultations/${id}/end`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },

    // Transactions & Refunds
    async getTransactions(type?: string, search?: string): Promise<any[]> {
      const q = new URLSearchParams();
      if (type) q.append('type', type);
      if (search) q.append('search', search);
      const res = await fetch(`${API_BASE}/admin/transactions?${q.toString()}`, { headers: getAuthHeaders() });
      return handleResponse(res);
    },

    async refundTransaction(id: string, reason: string): Promise<any> {
      const res = await fetch(`${API_BASE}/admin/transactions/${id}/refund`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ reason }),
      });
      return handleResponse(res);
    },

    // Wallets
    async getWallets(): Promise<any[]> {
      const res = await fetch(`${API_BASE}/admin/wallets`, { headers: getAuthHeaders() });
      return handleResponse(res);
    },

    async adjustWallet(userId: string, type: 'credit' | 'debit', amount: number, reason: string): Promise<any> {
      const res = await fetch(`${API_BASE}/admin/wallets/adjust`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ userId, type, amount, reason }),
      });
      return handleResponse(res);
    },

    // Payouts
    async getPayouts(): Promise<any[]> {
      const res = await fetch(`${API_BASE}/admin/payouts`, { headers: getAuthHeaders() });
      return handleResponse(res);
    },

    async approvePayout(id: string): Promise<any> {
      const res = await fetch(`${API_BASE}/admin/payouts/${id}/approve`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },

    async rejectPayout(id: string, reason: string): Promise<any> {
      const res = await fetch(`${API_BASE}/admin/payouts/${id}/reject`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ reason }),
      });
      return handleResponse(res);
    },

    // Categories
    async getCategories(): Promise<any[]> {
      const res = await fetch(`${API_BASE}/admin/categories`, { headers: getAuthHeaders() });
      return handleResponse(res);
    },

    async createCategory(data: any): Promise<any> {
      const res = await fetch(`${API_BASE}/admin/categories`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },

    async updateCategory(id: string, data: any): Promise<any> {
      const res = await fetch(`${API_BASE}/admin/categories/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },

    async deleteCategory(id: string): Promise<any> {
      const res = await fetch(`${API_BASE}/admin/categories/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },

    // Reviews
    async getReviews(): Promise<any[]> {
      const res = await fetch(`${API_BASE}/admin/reviews`, { headers: getAuthHeaders() });
      return handleResponse(res);
    },

    async toggleReviewVisibility(id: string): Promise<any> {
      const res = await fetch(`${API_BASE}/admin/reviews/${id}/visibility`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },

    async deleteReview(id: string): Promise<any> {
      const res = await fetch(`${API_BASE}/admin/reviews/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },

    // Broadcasts
    async getBroadcasts(): Promise<any[]> {
      const res = await fetch(`${API_BASE}/admin/broadcasts`, { headers: getAuthHeaders() });
      return handleResponse(res);
    },

    async sendBroadcast(data: { title: string; message: string; target: string }): Promise<any> {
      const res = await fetch(`${API_BASE}/admin/broadcasts`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },

    // Tickets
    async getTickets(): Promise<any[]> {
      const res = await fetch(`${API_BASE}/admin/tickets`, { headers: getAuthHeaders() });
      return handleResponse(res);
    },

    async replyTicket(id: string, message: string, status?: string): Promise<any> {
      const res = await fetch(`${API_BASE}/admin/tickets/${id}/reply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ message, status }),
      });
      return handleResponse(res);
    },

    async updateTicketStatus(id: string, status: string): Promise<any> {
      const res = await fetch(`${API_BASE}/admin/tickets/${id}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      });
      return handleResponse(res);
    },

    // Website Content
    async getWebsiteContent(): Promise<any> {
      const res = await fetch(`${API_BASE}/admin/website-content`, { headers: getAuthHeaders() });
      return handleResponse(res);
    },

    async updateWebsiteContent(data: any): Promise<any> {
      const res = await fetch(`${API_BASE}/admin/website-content`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },

    // Coupons
    async getCoupons(): Promise<any[]> {
      const res = await fetch(`${API_BASE}/admin/coupons`, { headers: getAuthHeaders() });
      return handleResponse(res);
    },

    async createCoupon(data: any): Promise<any> {
      const res = await fetch(`${API_BASE}/admin/coupons`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },

    async deleteCoupon(id: string): Promise<any> {
      const res = await fetch(`${API_BASE}/admin/coupons/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },

    // Staff
    async getStaff(): Promise<any[]> {
      const res = await fetch(`${API_BASE}/admin/staff`, { headers: getAuthHeaders() });
      return handleResponse(res);
    },

    async createStaff(data: any): Promise<any> {
      const res = await fetch(`${API_BASE}/admin/staff`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },

    async updateStaff(id: string, data: any): Promise<any> {
      const res = await fetch(`${API_BASE}/admin/staff/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },

    async deleteStaff(id: string): Promise<any> {
      const res = await fetch(`${API_BASE}/admin/staff/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },

    // Logs & Reports
    async getActivityLogs(filters?: { action?: string; actor?: string; limit?: number }): Promise<any[]> {
      const q = new URLSearchParams();
      if (filters?.action) q.append('action', filters.action);
      if (filters?.actor) q.append('actor', filters.actor);
      if (filters?.limit) q.append('limit', String(filters.limit));
      const res = await fetch(`${API_BASE}/admin/logs?${q.toString()}`, { headers: getAuthHeaders() });
      return handleResponse(res);
    },

    async getReports(): Promise<any> {
      const res = await fetch(`${API_BASE}/admin/reports`, { headers: getAuthHeaders() });
      return handleResponse(res);
    },
  },


  // ---------------- NOTIFICATIONS ----------------
  notifications: {
    async list(userId: string): Promise<NotificationItem[]> {
      const res = await fetch(`${API_BASE}/notifications/${userId}`);
      return handleResponse<NotificationItem[]>(res);
    },

    async markRead(id: string): Promise<{ success: boolean }> {
      const res = await fetch(`${API_BASE}/notifications/${id}/read`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
  },

  // ---------------- REVIEWS ----------------
  reviews: {
    async create(payload: {
      sessionId: string;
      readerId: string;
      customerId: string;
      customerName: string;
      rating: number;
      comment: string;
    }): Promise<ReviewItem> {
      const res = await fetch(`${API_BASE}/reviews`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      return handleResponse<ReviewItem>(res);
    },
  },

  // ---------------- SETTINGS ----------------
  settings: {
    async get(): Promise<AppSettings> {
      const res = await fetch(`${API_BASE}/settings`);
      return handleResponse<AppSettings>(res);
    },

    async update(settings: Partial<AppSettings>): Promise<AppSettings> {
      const res = await fetch(`${API_BASE}/settings`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(settings),
      });
      return handleResponse<AppSettings>(res);
    },
  },
};
