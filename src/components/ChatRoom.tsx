import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { api } from '../lib/api';
import {
  Send,
  Clock,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  Star,
  Check,
  CheckCheck,
  PhoneOff,
  User,
  ArrowLeft,
} from 'lucide-react';

interface ChatRoomProps {
  onBack: () => void;
  onOpenAddMoney?: () => void;
}

export const ChatRoom: React.FC<ChatRoomProps> = ({ onBack, onOpenAddMoney }) => {
  const { user } = useAuth();
  const {
    activeSession,
    messages,
    durationSeconds,
    sendMessage,
    endSession,
    setActiveSession,
    isLoading,
  } = useChat();

  const [inputMessage, setInputMessage] = useState<string>('');
  const [showEndModal, setShowEndModal] = useState<boolean>(false);
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [completedSession, setCompletedSession] = useState<any | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  if (!activeSession) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <div className="bg-[#FAF7F2] p-8 rounded-2xl border border-[#38243F]/10 shadow-sm max-w-md mx-auto space-y-4">
          <Clock className="w-12 h-12 text-[#C6A66B] mx-auto" />
          <h3 className="text-xl font-serif font-bold text-[#38243F]">
            No Active Consultation
          </h3>
          <p className="text-xs text-gray-600">
            You do not currently have an active chat session. Browse our verified astrologers to initiate an instant consultation.
          </p>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-[#38243F] text-[#FAF7F2] text-xs font-semibold rounded-lg hover:bg-[#38243F]/90 transition-colors"
          >
            Explore Astrologers
          </button>
        </div>
      </div>
    );
  }

  const isCustomer = user?.role === 'customer';
  const isAstrologer = user?.role === 'astrologer';
  const isAdmin = user?.role === 'admin';

  // Format timer
  const minutes = Math.floor(durationSeconds / 60);
  const seconds = durationSeconds % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  // Current billing accrued
  const currentMinutesBilled = Math.max(1, durationSeconds / 60);
  const accruedCost = (currentMinutesBilled * activeSession.pricePerMinute).toFixed(2);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isSending) return;

    const content = inputMessage.trim();
    setInputMessage('');
    setIsSending(true);

    try {
      await sendMessage(content);
    } catch {
      setInputMessage(content); // restore on error
    } finally {
      setIsSending(false);
    }
  };

  const handleEndConsultation = async () => {
    try {
      const finished = await endSession(activeSession.id);
      setShowEndModal(false);
      setCompletedSession(finished);
      if (isCustomer) {
        setShowReviewModal(true);
      }
    } catch {
      // quiet catch
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!completedSession) return;

    try {
      await api.reviews.create({
        sessionId: completedSession.id,
        readerId: completedSession.readerId,
        customerId: user?.id || completedSession.customerId,
        customerName: user?.fullName || 'Seeker',
        rating,
        comment: reviewComment,
      });
      setReviewSubmitted(true);
      setTimeout(() => {
        setShowReviewModal(false);
        setActiveSession(null);
        onBack();
      }, 1500);
    } catch {
      // quiet
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 sm:py-6">
      {/* Top Header bar */}
      <div className="bg-[#FAF7F2] rounded-t-2xl border border-b-0 border-[#38243F]/10 px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 text-gray-500 hover:text-[#38243F] hover:bg-white rounded-lg transition-colors"
            title="Back to dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="relative">
            <img
              src={activeSession.readerAvatar || '/src/assets/images/reader_vedic_astrologer_1793513362018.jpg'}
              alt={activeSession.readerName}
              className="w-10 h-10 rounded-full object-cover border border-[#C6A66B]/40"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-serif font-bold text-[#38243F]">
                {isCustomer ? activeSession.readerName : activeSession.customerName}
              </h3>
              <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 bg-[#38243F]/5 text-[#38243F] rounded">
                {activeSession.astrologerId}
              </span>
            </div>
            <div className="text-[11px] text-gray-500 flex items-center gap-1.5">
              <span>Session: {activeSession.sessionNumber}</span>
              <span>·</span>
              <span className="text-emerald-700 font-medium">${activeSession.pricePerMinute.toFixed(2)}/min</span>
            </div>
          </div>
        </div>

        {/* Live Timer & End Button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-gray-200 text-xs">
            <Clock className="w-3.5 h-3.5 text-[#C6A66B] animate-pulse" />
            <span className="font-mono font-bold text-gray-800">{timeFormatted}</span>
            <span className="text-gray-300">|</span>
            <span className="font-semibold text-emerald-700 font-mono">${accruedCost}</span>
          </div>

          <button
            onClick={() => setShowEndModal(true)}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <PhoneOff className="w-3.5 h-3.5" />
            <span>End Session</span>
          </button>
        </div>
      </div>

      {/* Main WhatsApp-Style Message Box */}
      <div className="bg-[#FAF7F2] border-x border-[#38243F]/10 h-[60vh] sm:h-[65vh] flex flex-col justify-between overflow-hidden relative">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5 bg-gradient-to-b from-[#FAF7F2] via-white/40 to-[#F2EADF]/30">
          {/* Security Banner */}
          <div className="text-center my-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50/90 border border-amber-200/80 rounded-full text-[11px] text-amber-800">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>End-to-End Encrypted Spiritual Consultation · Session {activeSession.sessionNumber}</span>
            </span>
          </div>

          {messages.map(msg => {
            const isMe =
              (isCustomer && msg.senderRole === 'customer') ||
              (isAstrologer && msg.senderRole === 'astrologer') ||
              (isAdmin && msg.senderRole === 'admin');

            const isSystem = msg.senderRole === 'system';

            if (isSystem) {
              return (
                <div key={msg.id} className="text-center my-3">
                  <div className="inline-block px-3 py-1 bg-gray-100 rounded-lg text-[11px] text-gray-600 border border-gray-200 max-w-md">
                    {msg.content}
                  </div>
                </div>
              );
            }

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-xl ${isMe ? 'ml-auto' : 'mr-auto'}`}
              >
                <div className="text-[10px] text-gray-400 mb-0.5 px-1 flex items-center gap-1">
                  <span>{msg.senderName}</span>
                </div>
                <div
                  className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm shadow-xs ${
                    isMe
                      ? 'bg-[#38243F] text-[#FAF7F2] rounded-tr-none'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  <div
                    className={`text-[9px] mt-1 flex items-center justify-end gap-1 ${
                      isMe ? 'text-[#C6A66B]' : 'text-gray-400'
                    }`}
                  >
                    <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {isMe && <CheckCheck className="w-3 h-3 text-[#C6A66B]" />}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Bottom Message Input Bar */}
        <form
          onSubmit={handleSend}
          className="p-3 sm:p-4 bg-white border-t border-[#38243F]/10 flex items-center gap-2 sm:gap-3"
        >
          <input
            type="text"
            placeholder={
              activeSession.status === 'active'
                ? 'Type your consultation message or query...'
                : 'Session is concluding...'
            }
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            disabled={activeSession.status !== 'active' || isSending}
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-[#FAF7F2] border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#38243F]"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || activeSession.status !== 'active' || isSending}
            className="px-4 py-2.5 bg-[#38243F] text-[#FAF7F2] rounded-xl hover:bg-[#38243F]/90 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-40 text-xs font-semibold shadow-xs"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5 text-[#C6A66B]" />
          </button>
        </form>
      </div>

      {/* Bottom Bar Info */}
      <div className="bg-[#FAF7F2] rounded-b-2xl border border-t-0 border-[#38243F]/10 px-4 py-2.5 flex items-center justify-between text-[11px] text-gray-500">
        <span>Session Rate: ${activeSession.pricePerMinute.toFixed(2)}/min · Billed per second</span>
        <span className="text-gray-400">LUMSIC Encrypted Realtime Network</span>
      </div>

      {/* CONFIRM END SESSION MODAL */}
      {showEndModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-gray-200">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <PhoneOff className="w-6 h-6" />
            </div>
            <h4 className="text-base font-serif font-bold text-gray-900">
              End Consultation Session?
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Your consultation duration is <span className="font-semibold">{timeFormatted}</span>. Your wallet balance will be debited <span className="font-semibold text-gray-900">${accruedCost} USD</span>.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowEndModal(false)}
                className="w-1/2 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                Continue Chat
              </button>
              <button
                type="button"
                onClick={handleEndConsultation}
                disabled={isLoading}
                className="w-1/2 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm"
              >
                Confirm End
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POST-SESSION REVIEW MODAL (Customer only) */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FAF7F2] rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#C6A66B]/30 relative text-center">
            {reviewSubmitted ? (
              <div className="py-6 space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-serif font-bold text-[#38243F]">
                  Thank You for Your Feedback
                </h3>
                <p className="text-xs text-gray-600">
                  Your verified review has been posted to {completedSession?.readerName}'s profile.
                </p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#38243F] text-[#C6A66B] flex items-center justify-center mx-auto">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#C6A66B]">
                    Consultation Concluded
                  </span>
                  <h3 className="text-xl font-serif font-bold text-[#38243F] mt-0.5">
                    Rate Your Experience
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">
                    How was your reading with {completedSession?.readerName}?
                  </p>
                </div>

                {/* Star rating */}
                <div className="flex items-center justify-center gap-2 py-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 text-2xl transition-transform hover:scale-110 focus:outline-none"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= rating
                            ? 'text-[#C6A66B] fill-[#C6A66B]'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <div>
                  <textarea
                    rows={3}
                    placeholder="Share any comments about the insights received (optional)..."
                    value={reviewComment}
                    onChange={e => setReviewComment(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#38243F]"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowReviewModal(false);
                      setActiveSession(null);
                      onBack();
                    }}
                    className="w-1/3 py-2.5 text-xs text-gray-500 hover:text-gray-700"
                  >
                    Skip
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 py-2.5 bg-[#38243F] text-[#FAF7F2] font-semibold text-xs rounded-lg hover:bg-[#38243F]/90 transition-colors shadow-md"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
