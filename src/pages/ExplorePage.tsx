import React, { useState, useEffect } from 'react';
import { Reader } from '../types';
import { api } from '../lib/api';
import {
  Search,
  Filter,
  Star,
  MessageSquare,
  Sparkles,
  SlidersHorizontal,
  CheckCircle,
  AlertTriangle,
  User,
} from 'lucide-react';

interface ExplorePageProps {
  onSelectReader: (reader: Reader) => void;
  onOpenConsultationModal: (reader: Reader) => void;
}

export const ExplorePage: React.FC<ExplorePageProps> = ({
  onSelectReader,
  onOpenConsultationModal,
}) => {
  const [readers, setReaders] = useState<Reader[]>([]);
  const [search, setSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [onlineOnly, setOnlineOnly] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(5.0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const categories = [
    'All',
    'Vedic Astrology',
    'Tarot Reading',
    'Psychic Reading',
    'Love & Relationships',
    'Career & Wealth',
    'Hellenistic Astrology',
  ];

  const languages = ['All', 'English', 'Hindi', 'French', 'Spanish', 'German', 'Sanskrit'];

  const fetchReaders = async () => {
    setIsLoading(true);
    try {
      const list = await api.readers.list({
        search: search.trim() || undefined,
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        onlineOnly,
        language: selectedLanguage !== 'All' ? selectedLanguage : undefined,
        maxPrice: maxPrice < 5.0 ? maxPrice : undefined,
      });
      setReaders(list);
    } catch {
      // quiet
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReaders();
  }, [search, selectedCategory, onlineOnly, selectedLanguage, maxPrice]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-left">
      {/* Page Title */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#C6A66B] block mb-1">
          Global Verified Directory
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#38243F]">
          Explore Astrologers & Spiritual Counselors
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-2xl">
          Browse verified master readers available for instant, encrypted chat consultation. Real availability status and per-second transparent rates.
        </p>
      </div>

      {/* Search and Main Filters Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by name, specialization, or Astrologer ID (e.g. LUM001)..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-[#FAF7F2] border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#38243F]"
            />
          </div>

          {/* Online status toggle */}
          <button
            onClick={() => setOnlineOnly(!onlineOnly)}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border transition-all ${
              onlineOnly
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-[#FAF7F2] text-gray-700 border-gray-300 hover:border-[#C6A66B]'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${onlineOnly ? 'bg-emerald-500' : 'bg-gray-400'}`} />
            <span>Online Now Only</span>
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 border-t border-gray-100">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#38243F] text-[#FAF7F2]'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-[#FAF7F2]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Secondary Filters: Language & Max Price */}
        <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700">Language:</span>
            <select
              value={selectedLanguage}
              onChange={e => setSelectedLanguage(e.target.value)}
              className="px-2.5 py-1 bg-[#FAF7F2] border border-gray-300 rounded-lg text-xs focus:outline-none"
            >
              {languages.map(l => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-semibold text-gray-700">Max Rate:</span>
            <input
              type="range"
              min="1.5"
              max="5.0"
              step="0.1"
              value={maxPrice}
              onChange={e => setMaxPrice(parseFloat(e.target.value))}
              className="accent-[#38243F] w-28 cursor-pointer"
            />
            <span className="font-mono font-bold text-gray-900">${maxPrice.toFixed(2)}/min</span>
          </div>

          <div className="text-gray-400">
            Showing <span className="font-semibold text-gray-700">{readers.length}</span> astrologers
          </div>
        </div>
      </div>

      {/* Reader Cards Grid */}
      {isLoading ? (
        <div className="text-center py-20 text-xs text-gray-500">Loading astrologer directory...</div>
      ) : readers.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 max-w-md mx-auto space-y-3">
          <Sparkles className="w-10 h-10 text-gray-400 mx-auto" />
          <h3 className="font-serif font-bold text-lg text-gray-800">No Astrologers Match</h3>
          <p className="text-xs text-gray-500">
            Try adjusting your category, language filter, or search query.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('All');
              setOnlineOnly(false);
              setSelectedLanguage('All');
              setMaxPrice(5.0);
            }}
            className="px-4 py-2 bg-[#38243F] text-white text-xs font-semibold rounded-lg"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {readers.map(reader => {
            const isAvailableForNew = reader.workflowEnabled && reader.isOnline && !reader.isBusy;

            return (
              <div
                key={reader.id}
                className="bg-white rounded-2xl p-5 border border-gray-200/90 hover:border-[#C6A66B] transition-all shadow-xs hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  {/* Photo & Badge */}
                  <div className="relative mb-4">
                    <img
                      src={reader.avatar}
                      alt={reader.name}
                      className="w-full h-56 object-cover rounded-xl"
                    />

                    {/* Online / Busy / Offline Indicator */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 bg-white/90 backdrop-blur-xs rounded-full text-[11px] font-semibold shadow-xs">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          reader.isOnline && !reader.isBusy
                            ? 'bg-emerald-500'
                            : reader.isBusy
                            ? 'bg-amber-500'
                            : 'bg-gray-400'
                        }`}
                      />
                      <span className="text-gray-800">
                        {reader.isOnline && !reader.isBusy
                          ? 'Available'
                          : reader.isBusy
                          ? 'In Consultation'
                          : 'Offline'}
                      </span>
                    </div>

                    {/* Astrologer ID badge */}
                    <div className="absolute bottom-3 left-3 px-2 py-0.5 bg-[#38243F]/90 text-[#FAF7F2] font-mono text-[10px] font-semibold rounded">
                      ID: {reader.astrologerId}
                    </div>

                    {/* Workflow status alert if paused by admin */}
                    {!reader.workflowEnabled && (
                      <div className="absolute top-3 left-3 px-2 py-0.5 bg-red-600/90 text-white text-[10px] font-semibold rounded flex items-center gap-1 shadow-sm">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Workflow Paused</span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="space-y-2 text-left">
                    <div className="flex items-center justify-between">
                      <h3
                        onClick={() => onSelectReader(reader)}
                        className="font-serif font-bold text-lg text-[#38243F] hover:text-[#C6A66B] cursor-pointer transition-colors"
                      >
                        {reader.name}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-amber-600 font-semibold">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span>{reader.rating.toFixed(2)}</span>
                        <span className="text-gray-400 font-normal">({reader.reviewsCount})</span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-600 font-medium">{reader.title}</p>

                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{reader.experienceYears} Years Exp</span>
                      <span>·</span>
                      <span>{reader.languages.join(', ')}</span>
                    </div>

                    <div className="flex flex-wrap gap-1 text-[11px] text-gray-500 pt-1">
                      {reader.specializations.map((spec, i) => (
                        <span key={spec} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[10px]">
                          {spec}
                        </span>
                      ))}
                    </div>

                    <p className="text-xs text-gray-600 line-clamp-2 pt-1">{reader.bio}</p>
                  </div>
                </div>

                {/* Bottom Row: Price & Actions */}
                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-[#38243F]">
                      ${reader.pricePerMinute.toFixed(2)}{' '}
                      <span className="text-[11px] font-normal text-gray-500">/ min</span>
                    </div>
                    <div className="text-[10px] text-gray-400">Billed per second</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectReader(reader)}
                      className="px-2.5 py-1.5 text-xs font-semibold text-gray-600 hover:text-[#38243F] hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => onOpenConsultationModal(reader)}
                      disabled={!isAvailableForNew}
                      className="px-3.5 py-1.5 bg-[#38243F] text-[#FAF7F2] text-xs font-semibold rounded-lg hover:bg-[#38243F]/90 transition-colors shadow-xs disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-[#C6A66B]" />
                      <span>{isAvailableForNew ? 'Start Chat' : 'Unavailable'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
