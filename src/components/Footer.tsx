export function Footer() {
  return (
    <footer className="w-full bg-[#1b1c1c] text-white pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-y-10 lg:gap-x-12 pb-12 border-b border-gray-800">
          {/* Brand Summary */}
          <div className="lg:col-span-4 flex flex-col items-start gap-4">
            <div className="flex items-center gap-2">
              <svg
                className="w-8 h-8"
                fill="none"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <polygon fill="#0088cc" points="24,4 42,14 24,24 6,14" />
                <polygon fill="#006bb1" points="6,14 24,24 24,44 6,34" />
                <polygon fill="#cc181e" points="42,14 24,24 24,44 42,34" />
              </svg>
              <span className="font-bold text-xl tracking-tight text-white">
                KAPPA<span className="text-[#cc181e]">BOXES</span>
              </span>
            </div>

            <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
              Premier bespoke packaging studio and rigid box manufacturer headquartered in Bengaluru. Engineering architectural unboxing experiences, corporate gifting hampers, and luxury bespoke packaging for leading enterprises.
            </p>

            <div className="pt-1">
              <span className="inline-block px-3 py-1 rounded bg-gray-800 text-[10px] font-bold tracking-wider text-[#cc181e] border border-gray-700">
                ISO 9001:2015 CERTIFIED FACILITY
              </span>
            </div>
          </div>

          {/* Portfolios */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
              Bespoke Portfolios
            </h4>
            <ul className="flex flex-col gap-2 text-xs text-gray-400">
              <li className="hover:text-white transition-colors cursor-pointer">Rigid Kappa Board Boxes</li>
              <li className="hover:text-white transition-colors cursor-pointer">Executive Corporate Hampers</li>
              <li className="hover:text-white transition-colors cursor-pointer">Magnetic Lid Gift Packaging</li>
              <li className="hover:text-white transition-colors cursor-pointer">Book-Style Presentation Sleeves</li>
              <li className="hover:text-white transition-colors cursor-pointer">Custom Precision Die-Cut Foam</li>
              <li className="hover:text-white transition-colors cursor-pointer">Hot Foil &amp; Debossed Suites</li>
            </ul>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
              Navigation
            </h4>
            <ul className="flex flex-col gap-2 text-xs text-gray-400">
              <li><a className="hover:text-white transition-colors" href="#top">Home</a></li>
              <li><a className="hover:text-white transition-colors" href="#about-section">About</a></li>
              <li><a className="hover:text-white transition-colors" href="#collections-portfolio">Gift Boxes</a></li>
              <li><a className="hover:text-white transition-colors" href="#gallery-section">Gallery</a></li>
              <li><a className="hover:text-white transition-colors" href="#contact-section">Contact</a></li>
            </ul>
          </div>

          {/* Factory Detail */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
              Bengaluru Factory
            </h4>
            <div className="flex flex-col gap-2.5 text-xs text-gray-400">
              <p>
                22/2, Sri Venkateshwara Industrial Estate,<br />
                Sunkadakatte, Bengaluru - 560091
              </p>
              <p>
                <span className="text-[10px] font-bold text-gray-500 uppercase block">PHONE ENQUIRIES</span>
                <a className="text-[#cc181e] font-bold hover:underline" href="tel:+918867719798">
                  +91 8867719798
                </a>
              </p>
              <p>
                <span className="text-[10px] font-bold text-gray-500 uppercase block">EMAIL</span>
                <a className="text-white hover:text-gray-300" href="mailto:info@kappaBoxes.com">
                  info@kappaBoxes.com
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© 2025 KappaBoxes LLP. All rights reserved. Crafted in Bengaluru.</p>
          <div className="flex items-center gap-6">
            <a className="hover:text-gray-300 transition-colors" href="#top">Privacy Policy</a>
            <a className="hover:text-gray-300 transition-colors" href="#collections-portfolio">Specifications</a>
            <a className="hover:text-gray-300 transition-colors" href="#contact-section">Terms &amp; Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
