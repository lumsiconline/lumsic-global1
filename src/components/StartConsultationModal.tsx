import React, { useState, useEffect } from 'react';
import { Reader, Wallet } from '../types';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { api } from '../lib/api';
import { X, Sparkles, AlertTriangle, ShieldCheck, Clock, Wallet as WalletIcon } from 'lucide-react';

interface StartConsultationModalProps {
  reader: Reader | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (session: any) => void;
  onOpenAddMoney: () => void;
}

export const StartConsultationModal: React.FC<StartConsultationModalProps> = ({
  reader,
  isOpen,
  onClose,
  onSuccess,
  onOpenAddMoney,
}) => {
  const { user } = useAuth();
  const { setActiveSession } = useChat();
  const [topic, setTopic] = useState<string>('');
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && isOpen) {
      api.wallet.get(user.id).then(setWallet).catch(() => {});
    }
  }, [user?.id, isOpen]);

  if (!isOpen || !reader) return null;

  const minRequired = reader.pricePerMinute * 2;
  const currentBalance = wallet?.balance ?? 0;
  const hasSufficientBalance = currentBalance >= minRequired;
  const isWorkflowActive = reader.workflowEnabled;
  const isOnline = reader.isOnline && !reader.isBusy;

  const handleStart = async () => {
    if (!user) {
      setError('Please sign in or create an account to start a consultation.');
      return;
    }

    if (!isWorkflowActive) {
      setError(`Cannot start consultation: Astrologer ${reader.name} (${reader.astrologerId}) workflow has been paused (OFF) by platform administration.`);
      return;
    }

    if (!isOnline) {
      setError(`Astrologer ${reader.name} is currently unavailable.`);
      return;
    }

    if (!hasSufficientBalance) {
      setError(`Insufficient wallet balance ($${currentBalance.toFixed(2)}). Please add at least $${minRequired.toFixed(2)} to begin.`);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const session = await api.consultations.request({
        customerId: user.id,
        astrologerId: reader.astrologerId,
        initialTopic: topic.trim() || 'Astrology & Life Guidance Consultation',
      });
      setActiveSession(session);
      onSuccess(session);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Could not initiate consultation request.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#FAF7F2] text-[#29252D] rounded-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-5 sm:p-8 shadow-2xl border border-[#38243F]/10 relative">
        <button
          onClick={onClose}
          className="absolute top-3 sm:top-4 right-3 sm:right-4 p-2 text-gray-400 hover:text-gray-700 rounded-full min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-[#38243F]/10">
          <img
            src={reader.avatar}
            alt={reader.name}
            className="w-16 h-16 rounded-xl object-cover border border-[#C6A66B]/30"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#C6A66B]">{reader.astrologerId}</span>
              <span className="text-gray-300">·</span>
              <span className="text-xs text-gray-500">{reader.experienceYears} yrs experience</span>
            </div>
            <h3 className="text-lg font-serif font-bold text-[#38243F]">{reader.name}</h3>
            <p className="text-xs text-gray-600 line-clamp-1">{reader.title}</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* WORKFLOW OFF WARNING */}
        {!isWorkflowActive && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-300 rounded-lg text-xs text-amber-800 space-y-1">
            <div className="font-semibold flex items-center gap-1.5 text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Astrologer Workflow Disabled (OFF)</span>
            </div>
            <p>
              Administration has paused new consultation routing for ID {reader.astrologerId}. New requests are blocked until workflow is re-enabled in Admin settings.
            </p>
          </div>
        )}

        {/* RATE & WALLET CHECK */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 mb-5 space-y-2.5 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Consultation Rate:</span>
            <span className="font-semibold text-gray-900">${reader.pricePerMinute.toFixed(2)} / minute</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Your Wallet Balance:</span>
            <span className={`font-semibold ${hasSufficientBalance ? 'text-emerald-700' : 'text-red-600'}`}>
              ${currentBalance.toFixed(2)} USD
            </span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-gray-100">
            <span className="text-gray-500">Initial Minimum Hold (2 mins):</span>
            <span className="font-semibold text-gray-900">${minRequired.toFixed(2)} USD</span>
          </div>

          {!hasSufficientBalance && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAddMoney();
                }}
                className="w-full py-2 bg-[#F2EADF] text-[#38243F] font-semibold rounded-lg hover:bg-[#C6A66B]/20 transition-colors flex items-center justify-center gap-2"
              >
                <WalletIcon className="w-3.5 h-3.5 text-[#C6A66B]" />
                <span>Add Money to Continue</span>
              </button>
            </div>
          )}
        </div>

        {/* TOPIC / QUESTION INPUT */}
        <div className="mb-6">
          <label className="text-xs font-semibold text-gray-700 block mb-1.5">
            Consultation Topic or Birth Details (Optional)
          </label>
          <textarea
            rows={3}
            value={topic}
            onChange={e => setTopic(e.target.value)}
            placeholder="e.g., Seeking guidance on career transition timing and love compatibility..."
            className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#38243F]"
          />
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-1/3 py-2.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleStart}
            disabled={isLoading || !isWorkflowActive || !isOnline || !hasSufficientBalance}
            className="w-2/3 py-2.5 bg-[#38243F] text-[#FAF7F2] text-xs font-semibold rounded-lg hover:bg-[#38243F]/90 transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
          >
            {isLoading ? (
              <span>Routing Consultation...</span>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-[#C6A66B]" />
                <span>Request Real-Time Chat</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
