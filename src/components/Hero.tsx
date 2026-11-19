import { useState, type FormEvent } from 'react';
import { ArrowRight, FileText, CheckCircle2, PackageCheck, Send, ShieldCheck } from 'lucide-react';

interface HeroProps {
  onEnquiryClick: () => void;
  onExploreClick: () => void;
  onSubmittedLead?: (name: string, company: string) => void;
}

export function Hero({ onEnquiryClick, onExploreClick, onSubmittedLead }: HeroProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [requirements, setRequirements] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone) return;

    setIsSubmitting(true);
    try {
      await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: `hero-quote-${Date.now()}`,
          companyName: company || 'Corporate Enquiry',
          contactName: fullName,
          businessEmail: email,
          phone,
          conversationSummary: `Hero Quick Estimate: ${requirements || 'Corporate Gifting Quote'}`,
          additionalRequirements: requirements,
          consentToContact: true,
        }),
      });
      setSubmitted(true);
      onSubmittedLead?.(fullName, company);
    } catch (err) {
      console.error('Failed to submit quote:', err);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#f0f7ff]/70 via-white to-white pt-28 pb-14 lg:pt-36 lg:pb-20">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Editorial Narrative */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-100 text-[#cc181e] w-fit mb-5 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#cc181e] animate-ping" />
              <span className="text-xs font-bold tracking-wider uppercase">Bengaluru Custom Atelier</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#111827] tracking-tight leading-[1.15] font-bold">
              Experience the <span className="italic text-[#cc181e] font-serif font-bold">Power</span> of Bespoke Packaging.
            </h1>

            <p className="text-base sm:text-lg text-[#555555] mt-5 max-w-xl leading-relaxed">
              Bespoke rigid boxes, corporate gifting, and luxury packaging solutions engineered with cutting-edge digital craftsmanship. Elevating your brand unboxing into an unforgettable tactile experience.
            </p>

            {/* Dual CTAs */}
            <div className="flex flex-wrap items-center gap-4 mt-8">
              <button
                type="button"
                onClick={onExploreClick}
                className="px-7 py-3 rounded-full bg-[#cc181e] hover:bg-[#b01217] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 group active:scale-95 cursor-pointer"
              >
                <span>Explore Box Collections</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={onEnquiryClick}
                className="px-6 py-3 rounded-full bg-white text-[#0088cc] border-2 border-[#0088cc]/30 hover:border-[#0088cc] font-bold text-sm hover:bg-sky-50 transition-all flex items-center gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-[#0088cc]" />
                <span>Request Custom Spec</span>
              </button>
            </div>

            {/* Trust Badges & Metrics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 pt-6 border-t border-[#e5e7eb]">
              <div className="flex flex-col">
                <span className="text-2xl font-extrabold text-[#0088cc]">500+</span>
                <span className="text-xs text-[#666666] font-medium mt-0.5">Corporate Clients</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-extrabold text-[#cc181e]">100%</span>
                <span className="text-xs text-[#666666] font-medium mt-0.5">Custom Sizing &amp; Dies</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-extrabold text-[#0088cc]">Digital</span>
                <span className="text-xs text-[#666666] font-medium mt-0.5">Precision Stamping</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-extrabold text-[#cc181e]">Peenya</span>
                <span className="text-xs text-[#666666] font-medium mt-0.5">Fast Bengaluru Hub</span>
              </div>
            </div>
          </div>

          {/* Right Column: Quick Estimate Card */}
          <div className="lg:col-span-5 relative" id="quick-inquiry">
            <div className="relative bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-[#e5e7eb]">
              <div className="flex items-center justify-between pb-3 border-b border-[#e5e7eb] mb-4">
                <div>
                  <span className="text-[11px] font-bold tracking-widest text-[#cc181e] uppercase block">
                    INSTANT ESTIMATE
                  </span>
                  <h3 className="font-serif text-2xl text-[#111827] font-bold">
                    Welcome to <span className="text-[#0088cc]">Kappa</span>
                    <span className="text-[#cc181e]">Boxes</span>!
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-red-50 text-[#cc181e] flex items-center justify-center shrink-0">
                  <PackageCheck className="w-5 h-5" />
                </div>
              </div>

              <p className="text-xs text-[#666666] mb-4">
                Direct atelier pricing and physical sample delivery across India.
              </p>

              {submitted ? (
                <div className="py-8 text-center bg-green-50 rounded-xl border border-green-200 p-6">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="text-base font-bold text-[#111827] mb-1">Quotation Request Received!</h4>
                  <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                    Thank you <strong>{fullName}</strong>. Our packaging engineer will call you shortly to discuss dielines, mockups, and volume tiers.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="text-xs font-bold text-[#0088cc] hover:underline cursor-pointer"
                  >
                    Submit another spec
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#333333] mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Vikramaditya Rao"
                      className="w-full px-3.5 py-2 rounded-lg border border-[#d1d5db] text-xs sm:text-sm text-[#222222] focus:outline-hidden focus:ring-2 focus:ring-[#cc181e]/30 focus:border-[#cc181e] transition-all bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-semibold text-[#333333] mb-1">Corporate Email *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@company.com"
                        className="w-full px-3.5 py-2 rounded-lg border border-[#d1d5db] text-xs sm:text-sm text-[#222222] focus:outline-hidden focus:ring-2 focus:ring-[#cc181e]/30 focus:border-[#cc181e] transition-all bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#333333] mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-3.5 py-2 rounded-lg border border-[#d1d5db] text-xs sm:text-sm text-[#222222] focus:outline-hidden focus:ring-2 focus:ring-[#cc181e]/30 focus:border-[#cc181e] transition-all bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#333333] mb-1">Company / Brand Website</label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Ather, Titan, Infosys"
                      className="w-full px-3.5 py-2 rounded-lg border border-[#d1d5db] text-xs sm:text-sm text-[#222222] focus:outline-hidden focus:ring-2 focus:ring-[#cc181e]/30 focus:border-[#cc181e] transition-all bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#333333] mb-1">
                      Box Requirements / Approximate Quantity
                    </label>
                    <textarea
                      rows={2}
                      value={requirements}
                      onChange={(e) => setRequirements(e.target.value)}
                      placeholder="Describe dimensions, magnetic lid preferences, or gifting dates..."
                      className="w-full px-3.5 py-2 rounded-lg border border-[#d1d5db] text-xs sm:text-sm text-[#222222] focus:outline-hidden focus:ring-2 focus:ring-[#cc181e]/30 focus:border-[#cc181e] transition-all resize-none bg-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 rounded-full bg-[#cc181e] hover:bg-[#b01217] disabled:opacity-50 text-white font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 group active:scale-95 cursor-pointer mt-1"
                  >
                    <span>{isSubmitting ? 'Submitting...' : 'Submit Quotation Spec'}</span>
                    <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              )}

              <div className="mt-4 pt-3 border-t border-[#e5e7eb] flex items-center justify-between text-[11px] font-bold text-[#777777]">
                <span className="flex items-center gap-1 text-[#cc181e]">
                  <ShieldCheck className="w-3.5 h-3.5" /> NDAs SIGNED
                </span>
                <span>MOQ: 100 PIECES</span>
                <span>FREE CAD PROTOTYPE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
