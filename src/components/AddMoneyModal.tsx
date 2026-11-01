import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { X, CreditCard, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

interface AddMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (newBalance: number) => void;
}

export const AddMoneyModal: React.FC<AddMoneyModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [amount, setAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'applepay'>('card');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successTx, setSuccessTx] = useState<any | null>(null);

  if (!isOpen || !user) return null;

  const quickAmounts = [25, 50, 100, 200];

  const handleDeposit = async () => {
    const finalAmount = customAmount ? parseFloat(customAmount) : amount;
    if (isNaN(finalAmount) || finalAmount <= 0) {
      setError('Please specify a deposit amount greater than $0.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const res = await api.wallet.deposit({
        userId: user.id,
        amount: finalAmount,
        currency: 'USD',
        paymentMethod,
      });
      setSuccessTx(res.transaction);
      if (onSuccess) onSuccess(res.balance);
    } catch (err: any) {
      setError(err.message || 'Deposit could not be processed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSuccessTx(null);
    setError(null);
    setCustomAmount('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#FAF7F2] text-[#29252D] rounded-2xl max-w-md w-full max-h-[92vh] overflow-y-auto p-5 sm:p-8 shadow-2xl border border-[#38243F]/10 relative">
        <button
          onClick={handleReset}
          className="absolute top-3 sm:top-4 right-3 sm:right-4 p-2 text-gray-400 hover:text-gray-700 rounded-full min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>

        {successTx ? (
          <div className="text-center py-4 space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-serif font-bold text-[#38243F]">
              Deposit Confirmed
            </h3>
            <p className="text-xs text-gray-600">
              Successfully credited <span className="font-semibold text-emerald-700">${successTx.amount.toFixed(2)} USD</span> to your LUMSIC consultation wallet.
            </p>
            <div className="bg-white p-3 rounded-lg border border-gray-200 text-xs text-left space-y-1">
              <div className="flex justify-between text-gray-500">
                <span>Transaction Ref:</span>
                <span className="font-mono text-gray-800">{successTx.id}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>New Wallet Balance:</span>
                <span className="font-semibold text-gray-900">${successTx.balanceAfter.toFixed(2)} USD</span>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="w-full py-2.5 bg-[#38243F] text-[#FAF7F2] font-semibold text-xs rounded-lg hover:bg-[#38243F]/90 transition-colors"
            >
              Continue to Consultations
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <span className="text-[11px] font-semibold tracking-wider uppercase text-[#C6A66B]">
                Consultation Credits
              </span>
              <h3 className="text-2xl font-serif font-bold text-[#38243F] mt-0.5">
                Add Funds to Wallet
              </h3>
              <p className="text-xs text-gray-600 mt-1">
                Credits are billed per-second during active consultations. Unused funds remain securely in your account.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Quick amount options */}
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-2">
                Select Amount (USD)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {quickAmounts.map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => {
                      setAmount(val);
                      setCustomAmount('');
                    }}
                    className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                      amount === val && !customAmount
                        ? 'bg-[#38243F] text-[#FAF7F2] border-[#38243F]'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-[#C6A66B]'
                    }`}
                  >
                    ${val}
                  </button>
                ))}
              </div>
              <div className="mt-3">
                <input
                  type="number"
                  placeholder="Or enter custom amount in USD"
                  value={customAmount}
                  onChange={e => {
                    setCustomAmount(e.target.value);
                  }}
                  className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#38243F]"
                />
              </div>
            </div>

            {/* Payment method */}
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-2">
                Payment Channel
              </label>
              <div className="space-y-2">
                <label className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-[#C6A66B] transition-colors">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="text-[#38243F]"
                    />
                    <CreditCard className="w-4 h-4 text-[#38243F]" />
                    <span className="text-xs font-medium text-gray-800">Credit / Debit Card (Visa, MC, Amex)</span>
                  </div>
                  <span className="text-[10px] text-emerald-600 font-semibold">Instant</span>
                </label>
                <label className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-[#C6A66B] transition-colors">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'paypal'}
                      onChange={() => setPaymentMethod('paypal')}
                      className="text-[#38243F]"
                    />
                    <span className="text-xs font-medium text-gray-800">PayPal Express Checkout</span>
                  </div>
                  <span className="text-[10px] text-emerald-600 font-semibold">Instant</span>
                </label>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleDeposit}
                disabled={isLoading}
                className="w-full py-3 bg-[#38243F] text-[#FAF7F2] font-semibold text-xs rounded-lg hover:bg-[#38243F]/90 transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Authorizing Ledger Deposit...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-[#C6A66B]" />
                    <span>Pay ${customAmount ? customAmount : amount}.00 USD</span>
                  </>
                )}
              </button>
              <p className="text-[10px] text-gray-400 text-center mt-2">
                256-bit TLS encrypted transaction · Powered by LUMSIC Secure Vault
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
