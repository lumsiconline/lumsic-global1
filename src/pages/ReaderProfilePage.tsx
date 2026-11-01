import React, { useState, useEffect } from 'react';
import { Reader, ReviewItem } from '../types';
import { api } from '../lib/api';
import {
  Star,
  ShieldCheck,
  Award,
  Globe,
  Clock,
  MessageSquare,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface ReaderProfilePageProps {
  reader: Reader;
  onBack: () => void;
  onOpenConsultationModal: (reader: Reader) => void;
}

export const ReaderProfilePage: React.FC<ReaderProfilePageProps> = ({
  reader,
  onBack,
  onOpenConsultationModal,
}) => {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);

  useEffect(() => {
    // In our backend, reviews are associated with readerId or session
    // Seed initial reviews if empty
    setReviews([
      {
        id: 'rev-01',
        sessionId: 'cs-demo-1',
        readerId: reader.id,
        customerId: 'usr-customer',
        customerName: 'Sarah J.',
        rating: 5,
        comment: 'Acharya Devrat is astonishingly accurate. The timeline he gave for my career shift manifested within days of his forecast.',
        timestamp: '2026-10-26T18:32:00.000Z',
      },
      {
        id: 'rev-02',
        sessionId: 'cs-demo-2',
        readerId: reader.id,
        customerId: 'usr-demo',
        customerName: 'Michael K.',
        rating: 5,
        comment: 'Incredible poise, empathy, and scholarly rigor. Truly a master of traditional astrological principles.',
        timestamp: '2026-10-18T11:15:00.000Z',
      },
    ]);
  }, [reader.id]);

  const isAvailable = reader.workflowEnabled && reader.isOnline && !reader.isBusy;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-left">
      {/* Back button */}
      <button
        onClick={onBack}
        className="text-xs font-semibold text-gray-500 hover:text-[#38243F] flex items-center gap-1.5 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Astrologers</span>
      </button>

      {/* Main Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Avatar Column */}
          <div className="md:col-span-4 space-y-4">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] md:aspect-square bg-gray-100 border-2 border-[#C6A66B]/30">
              <img
                src={reader.avatar}
                alt={reader.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1 bg-white/90 backdrop-blur-xs rounded-full text-xs font-semibold shadow-xs">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    reader.isOnline && !reader.isBusy
                      ? 'bg-emerald-500'
                      : reader.isBusy
                      ? 'bg-amber-500'
                      : 'bg-gray-400'
                  }`}
                />
                <span className="text-gray-900">
                  {reader.isOnline && !reader.isBusy
                    ? 'Online Now'
                    : reader.isBusy
                    ? 'In Consultation'
                    : 'Offline'}
                </span>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#38243F]/10 space-y-2 text-xs">
              <div className="flex justify-between items-center text-gray-600">
                <span>Unique Reader ID:</span>
                <span className="font-mono font-bold text-[#38243F]">{reader.astrologerId}</span>
              </div>
              <div className="flex justify-between items-center text-gray-600">
                <span>Experience:</span>
                <span className="font-semibold text-gray-900">{reader.experienceYears} Years</span>
              </div>
              <div className="flex justify-between items-center text-gray-600">
                <span>Completed Consultations:</span>
                <span className="font-semibold text-gray-900 tabular-nums">{reader.totalConsultations.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-gray-600">
                <span>Consultation Rate:</span>
                <span className="font-semibold text-emerald-800 tabular-nums">${reader.pricePerMinute.toFixed(2)} / min</span>
              </div>
            </div>

            {/* Start Chat Button */}
            <button
              onClick={() => onOpenConsultationModal(reader)}
              disabled={!isAvailable}
              className="w-full py-3.5 bg-[#38243F] text-[#FAF7F2] font-semibold text-sm rounded-xl hover:bg-[#38243F]/90 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MessageSquare className="w-4 h-4 text-[#C6A66B]" />
              <span>{isAvailable ? 'Start Consultation Now' : 'Currently Unavailable'}</span>
            </button>
            {!reader.workflowEnabled && (
              <p className="text-[11px] text-red-600 text-center flex items-center justify-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>Workflow paused by admin.</span>
              </p>
            )}
          </div>

          {/* Details Column */}
          <div className="md:col-span-8 space-y-6">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                <span className="text-xs font-mono font-semibold text-[#C6A66B]">
                  VERIFIED MASTER · {reader.astrologerId}
                </span>
                <div className="flex items-center gap-1.5 text-amber-600 font-bold text-sm">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span>{reader.rating.toFixed(2)}</span>
                  <span className="text-gray-400 font-normal">({reader.reviewsCount} reviews)</span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#38243F]">
                {reader.name}
              </h1>
              <p className="text-sm font-medium text-gray-600 mt-1">{reader.title}</p>
            </div>

            {/* Specializations & Languages */}
            <div className="flex flex-wrap gap-2">
              {reader.specializations.map(spec => (
                <span
                  key={spec}
                  className="px-3 py-1 bg-[#FAF7F2] text-[#38243F] font-medium text-xs rounded-lg border border-[#C6A66B]/20"
                >
                  {spec}
                </span>
              ))}
            </div>

            <div className="text-xs text-gray-600 flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#C6A66B]" />
                <span>Fluent in: {reader.languages.join(', ')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Ethical Charter Vetted</span>
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-3 pt-3 border-t border-gray-100">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#38243F]">
                About & Methodology
              </h3>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                {reader.bio}
              </p>
              {reader.aboutHtml && (
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                  {reader.aboutHtml}
                </p>
              )}
            </div>

            {/* Qualifications */}
            {reader.qualifications && reader.qualifications.length > 0 && (
              <div className="space-y-3 pt-3 border-t border-gray-100">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[#38243F]">
                  Accreditations & Lineage
                </h3>
                <ul className="space-y-2">
                  {reader.qualifications.map(q => (
                    <li key={q} className="flex items-center gap-2 text-xs text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Verified Client Reviews */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-serif font-bold text-[#38243F]">
              Verified Client Reviews
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Only clients with verified completed consultation sessions may submit feedback.
            </p>
          </div>
          <div className="flex items-center gap-1 text-sm font-bold text-amber-600">
            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>{reader.rating.toFixed(2)} rating</span>
          </div>
        </div>

        <div className="divide-y divide-gray-100 space-y-4 pt-2">
          {reviews.map(rev => (
            <div key={rev.id} className="pt-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-gray-900">{rev.customerName}</span>
                <span className="text-gray-400">
                  {new Date(rev.timestamp).toLocaleDateString([], {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex gap-1 text-amber-500">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                ))}
              </div>
              <p className="text-xs text-gray-700 leading-relaxed italic">
                "{rev.comment}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
