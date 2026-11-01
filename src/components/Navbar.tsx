import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import {
  Sparkles,
  Wallet,
  Bell,
  MessageSquare,
  Shield,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Eye,
  Globe,
} from 'lucide-react';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  onOpenWalletModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setCurrentView, onOpenWalletModal }) => {
  const { user, logout, switchUser, unreadCount, notifications, markNotificationRead } = useAuth();
  const { activeSession } = useChat();
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('ENG');
  const [langOpen, setLangOpen] = useState(false);

  const handleNav = (view: string) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    setServicesOpen(false);
  };

  return (
    <>
      {/* Evaluator Quick Switcher Strip */}
      <div className="bg-[#12071A] text-[#FAF7F2] text-xs py-1 px-4 border-b border-purple-900/40">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[#F7CA50] font-medium tracking-wide uppercase text-[11px]">Role Switcher:</span>
            <span className="text-purple-300/60 hidden sm:inline">Test multi-role workflows:</span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => switchUser('customer')}
              className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                user?.role === 'customer'
                  ? 'bg-[#F7CA50] text-[#1B0C27] font-semibold'
                  : 'bg-white/10 hover:bg-white/20 text-[#FAF7F2]'
              }`}
            >
              Customer (Sarah)
            </button>
            <button
              onClick={() => switchUser('astrologer')}
              className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                user?.role === 'astrologer'
                  ? 'bg-[#F7CA50] text-[#1B0C27] font-semibold'
                  : 'bg-white/10 hover:bg-white/20 text-[#FAF7F2]'
              }`}
            >
              Astrologer (LUM001 Devrat)
            </button>
            <button
              onClick={() => switchUser('admin')}
              className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                user?.role === 'admin'
                  ? 'bg-[#F7CA50] text-[#1B0C27] font-semibold'
                  : 'bg-white/10 hover:bg-white/20 text-[#FAF7F2]'
              }`}
            >
              Admin (Ops)
            </button>
          </div>
        </div>
      </div>

      {/* Main Top Navigation Styled like the Reference Design */}
      <header className="sticky top-0 z-40 bg-[#1D0D2E]/95 backdrop-blur-md border-b border-purple-900/40 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
          {/* Zone 1: Logo Icon + Brand Wordmark: LUMSIC */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleNav('home')}
              className="flex items-center gap-2.5 text-left group"
            >
              {/* Illuminated Mystic Third-Eye Avatar */}
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-950 via-[#37164F] to-[#58207E] border border-[#F7CA50]/70 flex items-center justify-center text-[#F7CA50] shadow-[0_0_15px_rgba(247,202,80,0.35)] group-hover:scale-105 transition-transform">
                <svg
                  className="w-5 h-5 text-[#F7CA50]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" fill="#F7CA50" fillOpacity="0.4" />
                  <circle cx="12" cy="12" r="1.5" fill="#F7CA50" />
                  <path d="M12 5V2m0 20v-3M5 12H2m20 0h-3" strokeOpacity="0.6" strokeWidth="1.2" />
                </svg>
              </div>

              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold tracking-wider font-sans text-white group-hover:text-[#F7CA50] transition-colors">
                  LUMSIC
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links matching Reference Design */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-purple-100/90">
            <button
              onClick={() => handleNav('explore')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                currentView === 'explore' ? 'text-[#F7CA50] font-semibold' : ''
              }`}
            >
              <span>Chat With Psychic</span>
            </button>

            {/* Free Services Dropdown */}
            <div className="relative">
              <button
                onClick={() => setServicesOpen(!servicesOpen)}
                className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1"
              >
                <span>Services</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {servicesOpen && (
                <div className="absolute left-0 mt-2 w-56 bg-[#230F37] border border-purple-800/60 rounded-xl shadow-2xl py-2 z-50 text-xs">
                  <button
                    onClick={() => handleNav('compatibility')}
                    className="w-full text-left px-4 py-2 hover:bg-white/10 text-[#F7CA50] font-semibold flex items-center gap-1.5"
                  >
                    <span>💖 Love &amp; Zodiac Calculator</span>
                  </button>
                  <button
                    onClick={() => handleNav('explore')}
                    className="w-full text-left px-4 py-2 hover:bg-white/10 text-purple-100"
                  >
                    Vedic Kundali Reading
                  </button>
                  <button
                    onClick={() => handleNav('explore')}
                    className="w-full text-left px-4 py-2 hover:bg-white/10 text-purple-100"
                  >
                    Tarot &amp; Divination
                  </button>
                  <button
                    onClick={() => handleNav('explore')}
                    className="w-full text-left px-4 py-2 hover:bg-white/10 text-purple-100"
                  >
                    Love &amp; Relationship Synastry
                  </button>
                  <button
                    onClick={() => handleNav('explore')}
                    className="w-full text-left px-4 py-2 hover:bg-white/10 text-purple-100"
                  >
                    Career &amp; Financial Dasha
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => handleNav('compatibility')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 ${
                currentView === 'compatibility' || currentView === 'calculator'
                  ? 'text-[#F7CA50] font-semibold'
                  : ''
              }`}
            >
              <span className="text-[#F7CA50]">💖</span>
              <span>Love Calculator</span>
            </button>

            <button
              onClick={() => handleNav('how-it-works')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                currentView === 'how-it-works' ? 'text-[#F7CA50] font-semibold' : ''
              }`}
            >
              How It Works
            </button>

            <button
              onClick={() => handleNav('about')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                currentView === 'about' ? 'text-[#F7CA50] font-semibold' : ''
              }`}
            >
              About
            </button>

            <button
              onClick={() => handleNav('contact')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                currentView === 'contact' ? 'text-[#F7CA50] font-semibold' : ''
              }`}
            >
              Support
            </button>
          </nav>

          {/* Zone 3: Language Selector + Golden Pill Login Button */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Language Selector */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1 text-xs font-semibold text-purple-200 hover:text-white transition-colors px-2 py-1 rounded"
              >
                <span>{selectedLang}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-2 w-28 bg-[#230F37] border border-purple-800/60 rounded-xl shadow-xl py-1 text-xs z-50">
                  {['ENG', 'ESP', 'FRA', 'HIN', 'DEU'].map(l => (
                    <button
                      key={l}
                      onClick={() => {
                        setSelectedLang(l);
                        setLangOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-white/10 text-purple-100"
                    >
                      {l}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {user ? (
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Active Chat Shortcut */}
                {activeSession && (
                  <button
                    onClick={() => handleNav(user.role === 'customer' ? 'customer-chat' : 'astrologer-chat')}
                    className="relative flex items-center gap-1.5 px-3 py-1.5 bg-[#F7CA50] text-[#1B0C27] text-xs font-bold rounded-full hover:bg-[#F7CA50]/90 transition-colors whitespace-nowrap shadow-sm"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Active Chat</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  </button>
                )}

                {/* Customer Wallet */}
                {user.role === 'customer' && (
                  <button
                    onClick={onOpenWalletModal}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 text-white hover:bg-white/15 text-xs font-medium rounded-full border border-purple-500/40 transition-colors whitespace-nowrap"
                    title="Open Wallet"
                  >
                    <Wallet className="w-3.5 h-3.5 text-[#F7CA50]" />
                    <span>Wallet</span>
                  </button>
                )}

                {/* Notifications trigger */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 text-purple-200 hover:text-white hover:bg-white/10 rounded-full transition-colors relative"
                    title="Notifications"
                  >
                    <Bell className="w-4 h-4" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-[#F7CA50] text-[#1B0C27] text-[10px] font-bold rounded-full flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-[#241038] rounded-xl shadow-2xl border border-purple-800/80 py-2 z-50 text-left text-white">
                      <div className="px-4 py-2 border-b border-purple-900/60 flex items-center justify-between">
                        <span className="text-xs font-semibold text-white">Notifications</span>
                        <span className="text-[11px] text-purple-300">{notifications.length} total</span>
                      </div>
                      <div className="max-h-64 overflow-y-auto divide-y divide-purple-900/40">
                        {notifications.length === 0 ? (
                          <div className="p-4 text-xs text-purple-300 text-center">No notifications yet</div>
                        ) : (
                          notifications.map(n => (
                            <div
                              key={n.id}
                              onClick={() => {
                                markNotificationRead(n.id);
                                if (n.sessionId) {
                                  handleNav(user.role === 'customer' ? 'customer-chat' : 'astrologer-chat');
                                }
                                setShowNotifications(false);
                              }}
                              className={`p-3 text-xs hover:bg-white/5 cursor-pointer transition-colors ${
                                !n.isRead ? 'bg-purple-900/40 font-medium' : 'text-purple-200'
                              }`}
                            >
                              <div className="text-white font-semibold">{n.title}</div>
                              <div className="text-[11px] text-purple-200/80 mt-0.5">{n.message}</div>
                              <div className="text-[10px] text-purple-400 mt-1">
                                {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Dashboard button */}
                <button
                  onClick={() => {
                    if (user.role === 'admin') handleNav('admin');
                    else if (user.role === 'astrologer') handleNav('astrologer-dashboard');
                    else handleNav('customer-dashboard');
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-[#F7CA50] to-[#E9BC45] text-[#1B0C27] text-xs font-bold rounded-full hover:brightness-105 transition-all shadow-md whitespace-nowrap"
                >
                  {user.role === 'admin'
                    ? 'Admin Portal'
                    : user.role === 'astrologer'
                    ? `Astrologer (${user.astrologerId || 'Hub'})`
                    : 'Dashboard'}
                </button>

                {/* Logout Button */}
                <button
                  onClick={logout}
                  className="p-2 text-purple-300 hover:text-red-400 hover:bg-white/10 rounded-full transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNav('login')}
                className="px-6 py-2.5 bg-[#F7CA50] hover:bg-[#F5BF38] text-[#1B0C27] text-xs font-bold rounded-full shadow-[0_0_20px_rgba(247,202,80,0.35)] transition-all hover:scale-105 whitespace-nowrap"
              >
                Login
              </button>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-purple-900/40 bg-[#1D0D2E] px-4 py-3 space-y-2 text-sm font-medium text-purple-100">
            <button onClick={() => handleNav('explore')} className="block w-full text-left py-2 hover:text-[#F7CA50]">
              Chat With Psychic
            </button>
            <button onClick={() => handleNav('compatibility')} className="block w-full text-left py-2 hover:text-[#F7CA50] text-[#F7CA50] font-semibold">
              💖 Love &amp; Zodiac Calculator
            </button>
            <button onClick={() => handleNav('how-it-works')} className="block w-full text-left py-2 hover:text-[#F7CA50]">
              How It Works
            </button>
            <button onClick={() => handleNav('about')} className="block w-full text-left py-2 hover:text-[#F7CA50]">
              About LUMSIC
            </button>
            <button onClick={() => handleNav('contact')} className="block w-full text-left py-2 hover:text-[#F7CA50]">
              Support &amp; Contact
            </button>
            {user && (
              <div className="pt-2 border-t border-purple-900/60">
                <button
                  onClick={() => handleNav(user.role === 'admin' ? 'admin' : user.role === 'astrologer' ? 'astrologer-dashboard' : 'customer-dashboard')}
                  className="block w-full text-left py-2 font-bold text-[#F7CA50]"
                >
                  Go to Dashboard
                </button>
              </div>
            )}
          </div>
        )}
      </header>
    </>
  );
};
