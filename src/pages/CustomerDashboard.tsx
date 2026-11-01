import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { ConsultationSession, Wallet, WalletTransaction, Reader } from '../types';
import { api } from '../lib/api';
import { ZodiacCompatibilityCalculator } from '../components/ZodiacCompatibilityCalculator';
import {
  Wallet as WalletIcon,
  Clock,
  MessageSquare,
  Sparkles,
  User,
  ShieldCheck,
  CreditCard,
  ArrowUpRight,
  ChevronRight,
  Star,
  ExternalLink,
  Bell,
  RefreshCw,
} from 'lucide-react';

interface CustomerDashboardProps {
  onOpenAddMoney: () => void;
  onOpenChat: () => void;
  onExplore: () => void;
  setCurrentView: (view: string) => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  onOpenAddMoney,
  onOpenChat,
  onExplore,
  setCurrentView,
}) => {
  const { user } = useAuth();
  const { activeSession, startSession } = useChat();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'chats' | 'wallet' | 'profile' | 'support' | 'calculator'
  >('overview');

  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [consultations, setConsultations] = useState<ConsultationSession[]>([]);
  const [selectedSessionTranscript, setSelectedSessionTranscript] = useState<ConsultationSession | null>(null);
  const [sessionMessages, setSessionMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Profile fields
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [country, setCountry] = useState(user?.country || 'US');
  const [currency, setCurrency] = useState(user?.currency || 'USD');
  const [profileSaved, setProfileSaved] = useState(false);

  const loadData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const [w, txs, sessions] = await Promise.all([
        api.wallet.get(user.id),
        api.wallet.getTransactions(user.id),
        api.consultations.list({ userId: user.id, role: 'customer' }),
      ]);
      setWallet(w);
      setTransactions(txs);
      setConsultations(sessions);
    } catch {
      // quiet
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user?.id]);

  const viewTranscript = async (session: ConsultationSession) => {
    setSelectedSessionTranscript(session);
    try {
      const msgs = await api.chat.getMessages(session.id);
      setSessionMessages(msgs);
    } catch {
      // quiet
    }
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    user.fullName = fullName;
    user.phone = phone;
    user.country = country;
    user.currency = currency;
    localStorage.setItem('lumsic_user', JSON.stringify(user));
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  };

  if (!user) return null;

  const completedSessions = consultations.filter(c => c.status === 'completed');
  const totalSpent = transactions
    .filter(t => t.type === 'consultation_deduction')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      {/* Top Greeting & Action Banner */}
      <div className="bg-[#FAF7F2] p-6 sm:p-8 rounded-3xl border border-[#38243F]/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xs">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#C6A66B]">
            Seeker Sanctuary
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#38243F] mt-0.5">
            Welcome back, {user.fullName}
          </h1>
          <p className="text-xs text-gray-600 mt-1">
            Manage your spiritual inquiries, private transcripts, and ledger wallet.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {activeSession && (
            <button
              onClick={onOpenChat}
              className="px-4 py-2.5 bg-[#38243F] text-[#FAF7F2] text-xs font-semibold rounded-xl hover:bg-[#38243F]/90 transition-colors shadow-md flex items-center gap-2 animate-pulse"
            >
              <MessageSquare className="w-4 h-4 text-[#C6A66B]" />
              <span>Resume Active Consultation</span>
            </button>
          )}

          <button
            onClick={onOpenAddMoney}
            className="px-4 py-2.5 bg-[#F2EADF] text-[#38243F] text-xs font-semibold rounded-xl hover:bg-[#C6A66B]/20 border border-[#C6A66B]/30 transition-colors flex items-center gap-2"
          >
            <WalletIcon className="w-4 h-4 text-[#C6A66B]" />
            <span>Add Funds (${wallet?.balance.toFixed(2) || '0.00'})</span>
          </button>

          <button
            onClick={onExplore}
            className="px-4 py-2.5 bg-[#38243F] text-[#FAF7F2] text-xs font-semibold rounded-xl hover:bg-[#38243F]/90 transition-colors flex items-center gap-2 shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-[#C6A66B]" />
            <span>Find an Astrologer</span>
          </button>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2 text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-[#38243F] text-[#FAF7F2]'
              : 'text-gray-600 hover:text-gray-900 hover:bg-[#FAF7F2]'
          }`}
        >
          Overview & Metrics
        </button>
        <button
          onClick={() => setActiveTab('chats')}
          className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'chats'
              ? 'bg-[#38243F] text-[#FAF7F2]'
              : 'text-gray-600 hover:text-gray-900 hover:bg-[#FAF7F2]'
          }`}
        >
          Consultation History ({consultations.length})
        </button>
        <button
          onClick={() => setActiveTab('wallet')}
          className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'wallet'
              ? 'bg-[#38243F] text-[#FAF7F2]'
              : 'text-gray-600 hover:text-gray-900 hover:bg-[#FAF7F2]'
          }`}
        >
          Wallet & Transactions ({transactions.length})
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'profile'
              ? 'bg-[#38243F] text-[#FAF7F2]'
              : 'text-gray-600 hover:text-gray-900 hover:bg-[#FAF7F2]'
          }`}
        >
          Profile Settings
        </button>
        <button
          onClick={() => setActiveTab('support')}
          className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'support'
              ? 'bg-[#38243F] text-[#FAF7F2]'
              : 'text-gray-600 hover:text-gray-900 hover:bg-[#FAF7F2]'
          }`}
        >
          Client Concierge Support
        </button>
        <button
          onClick={() => setActiveTab('calculator')}
          className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'calculator'
              ? 'bg-[#38243F] text-[#FAF7F2]'
              : 'text-purple-700 hover:text-purple-900 hover:bg-purple-50 font-medium'
          }`}
        >
          <span>💖</span>
          <span>Love &amp; Zodiac Calculator</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics Bento */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-200">
              <span className="text-xs text-gray-500 font-medium">Available Balance</span>
              <div className="text-2xl font-serif font-bold text-[#38243F] mt-1 tabular-nums">
                ${wallet?.balance.toFixed(2) || '0.00'}{' '}
                <span className="text-xs font-sans font-normal text-gray-400">USD</span>
              </div>
              <button
                onClick={onOpenAddMoney}
                className="text-[11px] text-[#C6A66B] font-semibold hover:underline mt-2 flex items-center gap-1"
              >
                <span>Add Consultation Credits</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200">
              <span className="text-xs text-gray-500 font-medium">Completed Readings</span>
              <div className="text-2xl font-serif font-bold text-[#38243F] mt-1 tabular-nums">
                {completedSessions.length}
              </div>
              <span className="text-[11px] text-gray-400">Transcripts available</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200">
              <span className="text-xs text-gray-500 font-medium">Total Consulted Time</span>
              <div className="text-2xl font-serif font-bold text-[#38243F] mt-1 tabular-nums">
                {Math.floor(
                  completedSessions.reduce((acc, c) => acc + c.durationSeconds, 0) / 60
                )}{' '}
                <span className="text-xs font-sans font-normal text-gray-400">mins</span>
              </div>
              <span className="text-[11px] text-gray-400">Billed per second</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200">
              <span className="text-xs text-gray-500 font-medium">Total Settled</span>
              <div className="text-2xl font-serif font-bold text-[#38243F] mt-1 tabular-nums">
                ${totalSpent.toFixed(2)}{' '}
                <span className="text-xs font-sans font-normal text-gray-400">USD</span>
              </div>
              <span className="text-[11px] text-emerald-600 font-semibold">Ledger Verified</span>
            </div>
          </div>

          {/* Ongoing Consultation Card if any */}
          {activeSession && (
            <div className="bg-[#38243F] text-[#FAF7F2] p-6 rounded-2xl border border-[#C6A66B]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={activeSession.readerAvatar}
                  alt={activeSession.readerName}
                  className="w-12 h-12 rounded-xl object-cover border border-[#C6A66B]/40"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-[#C6A66B] uppercase">
                      Live Active Consultation
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <h3 className="text-lg font-serif font-bold text-white">
                    {activeSession.readerName} ({activeSession.astrologerId})
                  </h3>
                  <p className="text-xs text-gray-300">
                    Session ID: {activeSession.sessionNumber} · Rate: ${activeSession.pricePerMinute.toFixed(2)}/min
                  </p>
                </div>
              </div>
              <button
                onClick={onOpenChat}
                className="px-5 py-2.5 bg-[#C6A66B] text-[#29252D] font-bold text-xs rounded-xl hover:bg-[#C6A66B]/90 transition-colors shadow-md"
              >
                Open Encrypted Chat
              </button>
            </div>
          )}

          {/* Recent Consultations Table */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-base text-[#38243F]">
                  Recent Consultations
                </h3>
                <p className="text-xs text-gray-500">Your private history of astrological readings</p>
              </div>
              <button
                onClick={() => setActiveTab('chats')}
                className="text-xs text-[#38243F] hover:text-[#C6A66B] font-semibold flex items-center gap-1"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {consultations.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-500 space-y-2">
                <Clock className="w-8 h-8 text-gray-400 mx-auto" />
                <p>No consultations yet. Connect with a master astrologer to begin.</p>
                <button
                  onClick={onExplore}
                  className="px-4 py-2 bg-[#38243F] text-white text-xs font-semibold rounded-lg mt-2"
                >
                  Explore Readers
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#FAF7F2] text-gray-500 uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="px-5 py-3">Session</th>
                      <th className="px-5 py-3">Astrologer</th>
                      <th className="px-5 py-3">Topic</th>
                      <th className="px-5 py-3">Duration</th>
                      <th className="px-5 py-3">Cost</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {consultations.slice(0, 5).map(session => (
                      <tr key={session.id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                        <td className="px-5 py-3.5 font-mono font-medium text-gray-800">
                          {session.sessionNumber}
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="font-semibold text-gray-900">{session.readerName}</div>
                          <div className="text-[10px] text-[#C6A66B] font-mono">{session.astrologerId}</div>
                        </td>
                        <td className="px-5 py-3.5 max-w-xs truncate text-gray-600">
                          {session.initialTopic || 'General consultation'}
                        </td>
                        <td className="px-5 py-3.5 tabular-nums text-gray-600">
                          {Math.floor(session.durationSeconds / 60)}m {session.durationSeconds % 60}s
                        </td>
                        <td className="px-5 py-3.5 font-semibold text-gray-900 tabular-nums">
                          ${session.totalCost.toFixed(2)}
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                              session.status === 'completed'
                                ? 'bg-emerald-50 text-emerald-700'
                                : session.status === 'active'
                                ? 'bg-blue-50 text-blue-700'
                                : session.status === 'pending'
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {session.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <button
                            onClick={() => viewTranscript(session)}
                            className="px-2.5 py-1 text-xs text-[#38243F] hover:bg-[#F2EADF] rounded-lg transition-colors font-medium"
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

      {/* TAB 2: CONSULTATIONS & TRANSCRIPTS */}
      {activeTab === 'chats' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* List column */}
          <div className="md:col-span-5 bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-serif font-bold text-sm text-[#38243F]">
                Your Consultation Sessions
              </h3>
              <span className="text-xs text-gray-400">{consultations.length} total</span>
            </div>
            <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
              {consultations.map(s => (
                <div
                  key={s.id}
                  onClick={() => viewTranscript(s)}
                  className={`p-4 cursor-pointer transition-colors hover:bg-[#FAF7F2] ${
                    selectedSessionTranscript?.id === s.id ? 'bg-[#FAF7F2] border-l-2 border-[#38243F]' : ''
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-serif font-bold text-[#38243F]">{s.readerName}</span>
                    <span className="font-mono text-[10px] text-gray-400">{s.sessionNumber}</span>
                  </div>
                  <p className="text-[11px] text-gray-500 truncate mt-1">
                    {s.initialTopic || 'General consultation'}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-gray-400 mt-2">
                    <span>{new Date(s.requestedAt).toLocaleDateString()}</span>
                    <span className="font-semibold text-gray-700">${s.totalCost.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transcript Viewer Column */}
          <div className="md:col-span-7 bg-white rounded-2xl border border-gray-200 p-6 min-h-[500px]">
            {selectedSessionTranscript ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div>
                    <span className="text-[10px] font-mono text-[#C6A66B]">
                      {selectedSessionTranscript.sessionNumber}
                    </span>
                    <h3 className="font-serif font-bold text-lg text-[#38243F]">
                      Consultation with {selectedSessionTranscript.readerName} ({selectedSessionTranscript.astrologerId})
                    </h3>
                  </div>
                  <div className="text-right text-xs">
                    <div className="font-bold text-emerald-800">${selectedSessionTranscript.totalCost.toFixed(2)}</div>
                    <div className="text-gray-400">
                      {Math.floor(selectedSessionTranscript.durationSeconds / 60)}m {selectedSessionTranscript.durationSeconds % 60}s
                    </div>
                  </div>
                </div>

                {/* Messages stream */}
                <div className="space-y-3 max-h-[420px] overflow-y-auto p-2 bg-[#FAF7F2] rounded-xl">
                  {sessionMessages.length === 0 ? (
                    <div className="p-6 text-center text-xs text-gray-400">No message history found for this session.</div>
                  ) : (
                    sessionMessages.map(m => (
                      <div
                        key={m.id}
                        className={`flex flex-col ${
                          m.senderRole === 'customer' ? 'items-end' : 'items-start'
                        }`}
                      >
                        <span className="text-[10px] text-gray-400 mb-0.5">{m.senderName}</span>
                        <div
                          className={`px-3 py-2 rounded-xl text-xs max-w-sm ${
                            m.senderRole === 'customer'
                              ? 'bg-[#38243F] text-white'
                              : 'bg-white text-gray-800 border border-gray-200'
                          }`}
                        >
                          <p>{m.content}</p>
                          <div className="text-[9px] text-right mt-1 opacity-70">
                            {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-80 text-gray-400 space-y-2 text-xs">
                <MessageSquare className="w-8 h-8 text-gray-300" />
                <p>Select a consultation from the left to view the encrypted transcript.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: WALLET & TRANSACTIONS */}
      {activeTab === 'wallet' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-xs text-gray-500 font-medium">LUMSIC Consultation Balance</span>
              <div className="text-3xl font-serif font-bold text-[#38243F] mt-1 tabular-nums">
                ${wallet?.balance.toFixed(2) || '0.00'} USD
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Audited ledger balance. Debited only during active consultation sessions.
              </p>
            </div>
            <button
              onClick={onOpenAddMoney}
              className="px-5 py-3 bg-[#38243F] text-[#FAF7F2] text-xs font-semibold rounded-xl hover:bg-[#38243F]/90 transition-colors shadow-sm flex items-center gap-2"
            >
              <CreditCard className="w-4 h-4 text-[#C6A66B]" />
              <span>Add Money to Wallet</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-serif font-bold text-sm text-[#38243F]">
                Transaction Ledger
              </h3>
              <span className="text-xs text-gray-400">{transactions.length} entries</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#FAF7F2] text-gray-500 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="px-5 py-3">Tx ID</th>
                    <th className="px-5 py-3">Type</th>
                    <th className="px-5 py-3">Description</th>
                    <th className="px-5 py-3">Amount</th>
                    <th className="px-5 py-3">Balance After</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {transactions.map(t => (
                    <tr key={t.id} className="hover:bg-[#FAF7F2]/50">
                      <td className="px-5 py-3 font-mono font-medium text-gray-700">{t.id}</td>
                      <td className="px-5 py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            t.type === 'deposit'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {t.type.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-700">{t.description}</td>
                      <td
                        className={`px-5 py-3 font-semibold tabular-nums ${
                          t.type === 'deposit' ? 'text-emerald-700' : 'text-rose-700'
                        }`}
                      >
                        {t.type === 'deposit' ? '+' : '-'}${t.amount.toFixed(2)}
                      </td>
                      <td className="px-5 py-3 font-semibold text-gray-900 tabular-nums">
                        ${t.balanceAfter.toFixed(2)}
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                          {t.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-400">
                        {new Date(t.timestamp).toLocaleString([], {
                          dateStyle: 'short',
                          timeStyle: 'short',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PROFILE SETTINGS */}
      {activeTab === 'profile' && (
        <div className="max-w-2xl bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs space-y-6">
          <div>
            <h3 className="font-serif font-bold text-xl text-[#38243F]">
              Client Profile & Preferences
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Update your international telephone, country code, and currency preferences.
            </p>
          </div>

          {profileSaved && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 rounded-lg">
              Profile updated successfully.
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Full Legal Name</label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-gray-300 rounded-xl focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Email Address</label>
              <input
                type="email"
                disabled
                value={user.email}
                className="w-full px-3 py-2 text-xs bg-gray-100 border border-gray-300 rounded-xl text-gray-500 cursor-not-allowed"
              />
              <span className="text-[10px] text-gray-400">Email cannot be modified directly for security reasons.</span>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">International Telephone</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-gray-300 rounded-xl focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Country</label>
                <select
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-gray-300 rounded-xl focus:outline-none"
                >
                  <option value="US">United States (USD)</option>
                  <option value="UK">United Kingdom (GBP)</option>
                  <option value="CA">Canada (CAD)</option>
                  <option value="AU">Australia (AUD)</option>
                  <option value="IN">India (INR)</option>
                  <option value="FR">France (EUR)</option>
                  <option value="DE">Germany (EUR)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Preferred Currency</label>
                <select
                  value={currency}
                  onChange={e => setCurrency(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-gray-300 rounded-xl focus:outline-none"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="INR">INR (₹)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="py-2.5 px-6 bg-[#38243F] text-[#FAF7F2] text-xs font-semibold rounded-xl hover:bg-[#38243F]/90 transition-colors shadow-xs"
            >
              Save Changes
            </button>
          </form>
        </div>
      )}

      {/* TAB 5: SUPPORT */}
      {activeTab === 'support' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs space-y-4 max-w-xl">
          <h3 className="font-serif font-bold text-lg text-[#38243F]">
            Client Support & Dispute Resolution
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Need assistance with a consultation refund, transcript export, or balance adjustment? Our concierge team is on duty 24/7.
          </p>
          <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#38243F]/10 space-y-2 text-xs">
            <div className="font-semibold text-[#38243F]">Direct Concierge Channel:</div>
            <div className="text-gray-700">Email: concierge@lumsic.com</div>
            <div className="text-gray-700">Toll-Free Client Desk: +1 (800) 555-0199</div>
          </div>
          <button
            onClick={() => setCurrentView('contact')}
            className="px-4 py-2 bg-[#38243F] text-white text-xs font-semibold rounded-lg"
          >
            Open Support Ticket
          </button>
        </div>
      )}

      {/* TAB 6: LOVE & ZODIAC CALCULATOR */}
      {activeTab === 'calculator' && (
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-stone-200/90 shadow-xs">
          <ZodiacCompatibilityCalculator onChatWithLovePsychics={onExplore} />
        </div>
      )}
    </div>
  );
};
