import React from 'react';

interface FooterProps {
  setCurrentView: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentView }) => {
  return (
    <footer className="bg-[#240F35] text-white border-t border-purple-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 sm:pt-16 pb-8">
        {/* Main 4-Column Layout matching image_144715e9.png */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-12">
          {/* Column 1: Brand Info, Description & App Download Badges (Span 5 columns) */}
          <div className="md:col-span-5 space-y-5 text-left">
            {/* Logo: Mystic Avatar Icon + Wordmark LUMSIC */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-950 via-[#37164F] to-[#58207E] border border-[#F7CA50]/70 flex items-center justify-center text-[#F7CA50] shadow-[0_0_15px_rgba(247,202,80,0.35)] shrink-0">
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
              <span className="text-2xl font-black tracking-wider text-white">
                LUMSIC
              </span>
            </div>

            {/* Description Text matching reference image */}
            <p className="text-xs sm:text-[13px] text-purple-200/90 leading-relaxed max-w-md">
              Lumsic is the best astrology website for online astrology predictions. Connect with verified psychics, astrologers, tarot readers, numerologists, vastu experts and more — over call and chat, 24/7.
            </p>

            {/* App Store and Google Play Download Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              {/* Apple App Store */}
              <div className="flex items-center gap-2.5 bg-black hover:bg-neutral-900 border border-white/20 rounded-lg px-3.5 py-1.5 cursor-pointer transition-colors shadow-xs select-none">
                <svg className="w-6 h-6 text-white fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.84c.64-.78 1.08-1.87.96-2.96-1 .04-2.15.65-2.83 1.44-.6.68-1.12 1.79-.98 2.85 1.12.09 2.2-.57 2.85-1.33Z" />
                </svg>
                <div className="text-left">
                  <div className="text-[9px] text-gray-300 leading-tight">Download on the</div>
                  <div className="text-xs font-bold text-white leading-tight font-sans">App Store</div>
                </div>
              </div>

              {/* Google Play Store */}
              <div className="flex items-center gap-2.5 bg-black hover:bg-neutral-900 border border-white/20 rounded-lg px-3.5 py-1.5 cursor-pointer transition-colors shadow-xs select-none">
                <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M3.6 1.6C3.2 2 3 2.6 3 3.4v17.2c0 .8.2 1.4.6 1.8l.1.1 9.8-9.8v-.2L3.7 2.7l-.1-1.1z"
                  />
                  <path
                    fill="#FFBB00"
                    d="M17.1 16.1l-3.6-3.6v-.2l3.6-3.6.1.1 4.2 2.4c1.2.7 1.2 1.8 0 2.5l-4.3 2.4z"
                  />
                  <path
                    fill="#EA4335"
                    d="M13.5 12.3L3.6 22.4c.4.4 1.1.5 1.9.1l11.6-6.6-3.6-3.6z"
                  />
                  <path
                    fill="#34A853"
                    d="M13.5 12.3l3.6-3.6L5.5 2.1C4.7 1.7 4 1.8 3.6 2.2l9.9 10.1z"
                  />
                </svg>
                <div className="text-left">
                  <div className="text-[9px] text-gray-300 leading-tight uppercase font-medium">GET IT ON</div>
                  <div className="text-xs font-bold text-white leading-tight font-sans">Google Play</div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: SERVICES (Span 3 columns) */}
          <div className="md:col-span-3 text-left space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              SERVICES
            </h4>
            <ul className="space-y-2.5 text-xs text-purple-200/80">
              <li>
                <button
                  onClick={() => setCurrentView('explore')}
                  className="hover:text-[#F7CA50] transition-colors cursor-pointer"
                >
                  Chat with Psychic
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('explore')}
                  className="hover:text-[#F7CA50] transition-colors cursor-pointer"
                >
                  Vedic Astrology
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('explore')}
                  className="hover:text-[#F7CA50] transition-colors cursor-pointer"
                >
                  Numerology
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('compatibility')}
                  className="hover:text-[#F7CA50] transition-colors cursor-pointer text-[#F7CA50] font-semibold"
                >
                  Love Calculator
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('compatibility')}
                  className="hover:text-[#F7CA50] transition-colors cursor-pointer"
                >
                  Rising Sign
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('explore')}
                  className="hover:text-[#F7CA50] transition-colors cursor-pointer"
                >
                  Moon Phase
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: COMPANY (Span 2 columns) */}
          <div className="md:col-span-2 text-left space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              COMPANY
            </h4>
            <ul className="space-y-2.5 text-xs text-purple-200/80">
              <li>
                <button
                  onClick={() => setCurrentView('about')}
                  className="hover:text-[#F7CA50] transition-colors cursor-pointer"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('contact')}
                  className="hover:text-[#F7CA50] transition-colors cursor-pointer"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('signup')}
                  className="hover:text-[#F7CA50] transition-colors cursor-pointer"
                >
                  Psychic Signup
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: LEGAL (Span 2 columns) */}
          <div className="md:col-span-2 text-left space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              LEGAL
            </h4>
            <ul className="space-y-2.5 text-xs text-purple-200/80">
              <li>
                <button
                  onClick={() => setCurrentView('terms')}
                  className="hover:text-[#F7CA50] transition-colors cursor-pointer"
                >
                  Terms &amp; Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('privacy')}
                  className="hover:text-[#F7CA50] transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Horizontal Divider & Exact Copyright text from image_144715e9.png */}
        <div className="pt-6 border-t border-purple-900/60 text-left">
          <p className="text-[11px] sm:text-xs text-purple-200/60">
            &copy; 2026 Lumsic &middot; Powered by Maskyeti Solutions Private Limited &middot; All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
};
