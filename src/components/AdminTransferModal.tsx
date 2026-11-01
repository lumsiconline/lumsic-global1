import React, { useState, useEffect } from 'react';
import { ConsultationSession, Reader } from '../types';
import { api } from '../lib/api';
import { X, ArrowRightLeft, ShieldAlert, Check } from 'lucide-react';

interface AdminTransferModalProps {
  session: ConsultationSession | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminTransferModal: React.FC<AdminTransferModalProps> = ({
  session,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [readers, setReaders] = useState<Reader[]>([]);
  const [targetAstrologerId, setTargetAstrologerId] = useState<string>('');
  const [reason, setReason] = useState<string>('Client requested specialist in Vedic remedies');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      api.readers.list().then(list => {
        // Only show readers with workflowEnabled === true and not the same current reader
        const available = list.filter(
          r => r.workflowEnabled && r.astrologerId !== session?.astrologerId
        );
        setReaders(available);
        if (available.length > 0) {
          setTargetAstrologerId(available[0].astrologerId);
        }
      });
    }
  }, [isOpen, session?.astrologerId]);

  if (!isOpen || !session) return null;

  const handleTransfer = async () => {
    if (!targetAstrologerId) {
      setError('Please select a target astrologer for reassignment.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await api.consultations.transfer(session.id, targetAstrologerId, reason);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Transfer failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#FAF7F2] text-[#29252D] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#38243F]/10 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-[#38243F] text-[#C6A66B] flex items-center justify-center">
            <ArrowRightLeft className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#C6A66B]">
              Supervisor Controls
            </span>
            <h3 className="text-lg font-serif font-bold text-[#38243F]">
              Transfer Active Consultation
            </h3>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700 rounded-lg mb-3">
            {error}
          </div>
        )}

        <div className="bg-white p-3.5 rounded-xl border border-gray-200 mb-4 text-xs space-y-1.5">
          <div className="flex justify-between">
            <span className="text-gray-500">Session ID:</span>
            <span className="font-mono font-semibold">{session.sessionNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Client:</span>
            <span className="font-semibold">{session.customerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Current Reader:</span>
            <span className="font-semibold text-[#38243F]">{session.readerName} ({session.astrologerId})</span>
          </div>
        </div>

        <div className="space-y-4 mb-5">
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1.5">
              Select Destination Astrologer (Workflow ON)
            </label>
            <select
              value={targetAstrologerId}
              onChange={e => setTargetAstrologerId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#38243F]"
            >
              {readers.map(r => (
                <option key={r.astrologerId} value={r.astrologerId}>
                  {r.name} ({r.astrologerId}) · ${r.pricePerMinute}/min {r.isOnline ? '· Online' : '· Away'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1.5">
              Transfer Reason (Recorded in Audit Ledger)
            </label>
            <textarea
              rows={2}
              value={reason}
              onChange={e => setReason(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#38243F]"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-1/3 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleTransfer}
            disabled={isLoading || !targetAstrologerId}
            className="w-2/3 py-2 bg-[#38243F] text-[#FAF7F2] text-xs font-semibold rounded-lg hover:bg-[#38243F]/90 transition-colors shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-[#C6A66B]" />
            <span>Confirm Reassignment</span>
          </button>
        </div>
      </div>
    </div>
  );
};
