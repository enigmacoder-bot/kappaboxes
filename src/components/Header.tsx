import { useState } from 'react';
import { Menu, X, Phone } from 'lucide-react';

interface HeaderProps {
  onEnquiryClick: () => void;
}

const NAV_LINKS = [
  { label: 'Home', href: '#top' },
  { label: 'About', href: '#about-section' },
  { label: 'Gift Boxes', href: '#collections-portfolio' },
  { label: 'Gallery', href: '#gallery-section' },
  { label: 'Contact', href: '#contact-section' },
];

export function Header({ onEnquiryClick }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-40 bg-white/95 backdrop-blur-md border-b border-[#e5e7eb] shadow-xs">
      <div className="h-20 max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between">
        {/* LOGO: 3D Box graphic mark with KAPPA BOXES */}
        <a href="#top" className="flex items-center gap-2.5 group">
          <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
            <svg
              className="w-10 h-10 drop-shadow-xs transition-transform duration-200 group-hover:scale-105"
              fill="none"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <polygon fill="#0088cc" points="24,4 42,14 24,24 6,14" />
              <polygon fill="#006bb1" points="6,14 24,24 24,44 6,34" />
              <polygon fill="#cc181e" points="42,14 24,24 24,44 42,34" />
              <polygon fill="#58b8ff" opacity="0.6" points="24,14 34,9 24,4 14,9" />
              <polygon fill="#ff5252" opacity="0.8" points="24,24 24,14 34,9 34,19" />
            </svg>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center leading-none">
              <span className="font-extrabold text-xl tracking-tight text-[#0088cc]">KAPPA</span>
              <span className="font-extrabold text-xl tracking-tight text-[#cc181e] ml-1">BOXES</span>
              <span className="text-[9px] font-bold text-[#cc181e] align-top ml-0.5 relative -top-1">TM</span>
            </div>
            <span className="text-[9px] font-bold tracking-widest text-[#777777] uppercase mt-0.5">
              CUSTOM PACKAGING ATELIER
            </span>
          </div>
        </a>

        {/* MAIN NAVIGATION */}
        <nav
          aria-label="Primary navigation"
          className="hidden lg:flex items-center gap-8"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`text-sm font-semibold transition-colors py-2 border-b-2 ${
                link.label === 'Gift Boxes'
                  ? 'text-[#cc181e] border-[#cc181e]'
                  : 'text-[#444444] border-transparent hover:text-[#cc181e]'
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-4 sm:gap-6">
          <a
            href="tel:+918867719798"
            className="hidden sm:flex flex-col text-right group"
          >
            <span className="text-[10px] font-bold tracking-widest text-[#777777] uppercase">
              Quick Call
            </span>
            <span className="text-sm font-bold text-[#0088cc] group-hover:text-[#cc181e] transition-colors flex items-center gap-1 justify-end">
              <Phone className="w-3.5 h-3.5" /> +91 8867719798
            </span>
          </a>

          <button
            type="button"
            onClick={onEnquiryClick}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[#cc181e] hover:bg-[#b01217] text-white text-sm font-bold transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
          >
            Request a Quote
          </button>

          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="lg:hidden p-2 text-[#444444] hover:text-[#111111]"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#e5e7eb] px-6 py-4 space-y-3 shadow-lg">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-bold text-[#333333] hover:text-[#cc181e] py-1"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
            <a
              href="tel:+918867719798"
              className="text-sm font-bold text-[#0088cc] flex items-center gap-1.5"
            >
              <Phone className="w-4 h-4" /> +91 8867719798
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
