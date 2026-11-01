import React, { useState } from 'react';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import { Bell, Sparkles, Check, X, Clock, AlertCircle } from 'lucide-react';

interface IncomingRequestModalProps {
  onOpenChat: () => void;
}

export const IncomingRequestModal: React.FC<IncomingRequestModalProps> = ({ onOpenChat }) => {
  const { user } = useAuth();
  const { pendingRequests, acceptRequest, rejectRequest, isLoading } = useChat();
  const [rejectReason, setRejectReason] = useState<string>('Briefly stepping away');
  const [showRejectInput, setShowRejectInput] = useState<boolean>(false);

  // Only render for astrologers with pending requests
  if (!user || user.role !== 'astrologer' || pendingRequests.length === 0) {
    return null;
  }

  const current = pendingRequests[0];

  const handleAccept = async () => {
    try {
      await acceptRequest(current.id);
      onOpenChat();
    } catch {
      // error handled in context
    }
  };

  const handleReject = async () => {
    try {
      await rejectRequest(current.id, rejectReason);
      setShowRejectInput(false);
    } catch {
      // error handled in context
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-[#FAF7F2] text-[#29252D] rounded-2xl max-w-md w-full p-6 shadow-2xl border-2 border-[#C6A66B] relative">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-[#38243F] text-[#C6A66B] flex items-center justify-center animate-bounce">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#C6A66B]">
              Incoming Consultation
            </span>
            <h3 className="text-lg font-serif font-bold text-[#38243F]">
              New Client Waiting
            </h3>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 mb-5 space-y-2.5 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Client Name:</span>
            <span className="font-semibold text-gray-900">{current.customerName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Session ID:</span>
            <span className="font-mono text-gray-800">{current.sessionNumber}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Agreed Rate:</span>
            <span className="font-semibold text-emerald-700">${current.pricePerMinute.toFixed(2)} / min</span>
          </div>
          <div className="pt-2 border-t border-gray-100">
            <span className="text-gray-500 block mb-1">Focus / Query:</span>
            <p className="text-gray-800 bg-gray-50 p-2.5 rounded-lg italic">
              "{current.initialTopic || 'General consultation'}"
            </p>
          </div>
        </div>

        {showRejectInput ? (
          <div className="space-y-3 mb-4">
            <label className="text-xs font-semibold text-gray-700 block">
              Reason for Declining:
            </label>
            <select
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-lg"
            >
              <option value="Stepping away briefly">Stepping away briefly</option>
              <option value="In puja / deep meditation">In puja / deep meditation</option>
              <option value="Technical difficulty">Technical difficulty</option>
            </select>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowRejectInput(false)}
                className="w-1/2 py-2 text-xs text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleReject}
                disabled={isLoading}
                className="w-1/2 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg"
              >
                Confirm Decline
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowRejectInput(true)}
              className="w-1/3 py-2.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <X className="w-4 h-4" />
              <span>Decline</span>
            </button>
            <button
              type="button"
              onClick={handleAccept}
              disabled={isLoading}
              className="w-2/3 py-2.5 bg-[#38243F] text-[#FAF7F2] text-xs font-semibold rounded-lg hover:bg-[#38243F]/90 transition-colors flex items-center justify-center gap-2 shadow-lg"
            >
              <Check className="w-4 h-4 text-[#C6A66B]" />
              <span>Accept & Start Chat</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
