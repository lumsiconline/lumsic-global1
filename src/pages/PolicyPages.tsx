import React from 'react';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

interface PolicyPageProps {
  type: 'privacy' | 'terms' | 'refund';
  onBack: () => void;
}

export const PolicyPages: React.FC<PolicyPageProps> = ({ type, onBack }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-left">
      <button
        onClick={onBack}
        className="text-xs font-semibold text-gray-500 hover:text-[#38243F] flex items-center gap-1.5 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Platform</span>
      </button>

      {type === 'privacy' && (
        <article className="bg-white p-8 sm:p-12 rounded-3xl border border-gray-200 shadow-xs space-y-6 text-xs sm:text-sm text-gray-700 leading-relaxed">
          <div>
            <span className="text-xs font-mono font-bold text-[#C6A66B]">COMPLIANCE DOCUMENT</span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#38243F] mt-1">
              Privacy & Data Protection Policy
            </h1>
            <p className="text-xs text-gray-400 mt-1">Effective Date: November 1, 2026 · Version 2.4</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-base font-serif font-bold text-[#38243F]">1. Commitment to Seeker Confidentiality</h2>
            <p>
              LUMSIC operates under an uncompromising discretion standard. We understand that birth charts, personal inquiries, and psychic consultations touch intimate personal and spiritual dimensions. We never sell, lease, or monetize your consultation records, birth data, or chat transcripts.
            </p>

            <h2 className="text-base font-serif font-bold text-[#38243F]">2. Cryptographic Session Partitioning</h2>
            <p>
              Every consultation session is assigned an isolated cryptographic identifier (Session UUID). Messages are delivered in real time over encrypted channels. Astrologers cannot access client records, birth details, or past sessions outside their authorized consultation assignments.
            </p>

            <h2 className="text-base font-serif font-bold text-[#38243F]">3. Financial Data Isolation</h2>
            <p>
              Credit card numbers, bank credentials, and raw payment methods are processed exclusively by PCI-DSS Level 1 compliant partners (Stripe, PayPal). LUMSIC only retains your auditable balance ledger and transaction references.
            </p>

            <h2 className="text-base font-serif font-bold text-[#38243F]">4. Data Retention and Erasure</h2>
            <p>
              You may request a complete export or permanent deletion of your profile and consultation transcripts at any time by contacting our privacy officer at privacy@lumsic.com.
            </p>
          </div>
        </article>
      )}

      {type === 'terms' && (
        <article className="bg-white p-8 sm:p-12 rounded-3xl border border-gray-200 shadow-xs space-y-6 text-xs sm:text-sm text-gray-700 leading-relaxed">
          <div>
            <span className="text-xs font-mono font-bold text-[#C6A66B]">COMPLIANCE DOCUMENT</span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#38243F] mt-1">
              Terms & Conditions of Service
            </h1>
            <p className="text-xs text-gray-400 mt-1">Effective Date: November 1, 2026 · Version 2.1</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-base font-serif font-bold text-[#38243F]">1. Platform Nature and Advisory Scope</h2>
            <p>
              LUMSIC provides a digital marketplace connecting seekers with independent astrological scholars, tarot intuitives, and spiritual counselors. Astrological interpretations and intuitive insights are philosophical, introspective, and cultural in nature and must never substitute for licensed medical, psychiatric, or legal advisory.
            </p>

            <h2 className="text-base font-serif font-bold text-[#38243F]">2. Real-Time Per-Second Billing Rules</h2>
            <p>
              Consultations are billed on a transparent per-second rate established by the reader and verified by administration. Billing begins when the reader accepts the consultation and the session transitions to Active status. Either party may conclude the consultation at any point to halt billing instantly.
            </p>

            <h2 className="text-base font-serif font-bold text-[#38243F]">3. Astrologer Workflow and Routing Governance</h2>
            <p>
              LUMSIC platform administration reserves the right to toggle astrologer workflow states (ON/OFF), monitor authorized sessions for safety, and transfer active sessions in the event of technical failure or reader unresponsiveness.
            </p>

            <h2 className="text-base font-serif font-bold text-[#38243F]">4. Account Integrity & Conduct</h2>
            <p>
              Users agree to provide accurate information and refrain from abusive language, harassment, or attempts to circumvent platform payment mechanisms. Violation of these terms results in immediate account suspension.
            </p>
          </div>
        </article>
      )}

      {type === 'refund' && (
        <article className="bg-white p-8 sm:p-12 rounded-3xl border border-gray-200 shadow-xs space-y-6 text-xs sm:text-sm text-gray-700 leading-relaxed">
          <div>
            <span className="text-xs font-mono font-bold text-[#C6A66B]">COMPLIANCE DOCUMENT</span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#38243F] mt-1">
              Refund & Cancellation Policy
            </h1>
            <p className="text-xs text-gray-400 mt-1">Effective Date: November 1, 2026 · Version 1.9</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-base font-serif font-bold text-[#38243F]">1. The LUMSIC Integrity Guarantee</h2>
            <p>
              We believe in fair financial practices. If a technical disconnect occurs, or if an astrologer disconnects unexpectedly before responding to your inquiry, your session duration is audited and any disputed amounts are refunded immediately to your wallet balance.
            </p>

            <h2 className="text-base font-serif font-bold text-[#38243F]">2. Rejection & Timeout Refunds</h2>
            <p>
              If a consultation request is declined by the astrologer or expires without acceptance, zero funds are charged to your wallet.
            </p>

            <h2 className="text-base font-serif font-bold text-[#38243F]">3. Quality Dispute Resolution</h2>
            <p>
              If you feel a consultation did not meet the scholarly and ethical standards of LUMSIC, submit a dispute within 24 hours of session completion. Our supervisor team reviews the transcript and issues full or partial credits where appropriate.
            </p>

            <h2 className="text-base font-serif font-bold text-[#38243F]">4. Wallet Balance Withdrawals</h2>
            <p>
              Unused deposited funds that have not been applied to consultations may be refunded back to the original funding card upon written request to billing@lumsic.com within 30 days of deposit.
            </p>
          </div>
        </article>
      )}
    </div>
  );
};
