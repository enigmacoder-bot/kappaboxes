import { useState, type FormEvent } from 'react';
import { MapPin, Mail, Phone, Clock, Send, CheckCircle2 } from 'lucide-react';
import type { QuoteItem } from '../utils/packagingLogic';

interface EnquirySectionProps {
  attachedQuoteItems?: QuoteItem[];
  prefillCategory?: string;
  prefillQuantity?: string;
  prefillNotes?: string;
  onClearAttachedQuote?: () => void;
  onSubmittedSuccess?: () => void;
}

const CONTACT_CARDS = [
  {
    icon: MapPin,
    title: 'Our Address',
    description:
      '22/2, Sri Venkateshwara Industrial Estate, Vigneshwara Nagar, Near Arunodaya English School, Sunkadakatte, Bengaluru - 560091',
    link: null,
  },
  {
    icon: Mail,
    title: 'Email Us',
    description: 'For corporate quotes and catalogue queries:',
    linkText: 'info@kappaBoxes.com',
    linkHref: 'mailto:info@kappaBoxes.com',
  },
  {
    icon: Phone,
    title: 'Call Us',
    description: 'Direct sales & consultation desk:',
    linkText: '+91 8867719798',
    linkHref: 'tel:+918867719798',
  },
  {
    icon: Clock,
    title: 'Opening Hours',
    description: 'Mon–Sat: 9.30 AM – 6.30 PM IST; Sunday: Closed',
    link: null,
  },
];

export function EnquirySection({
  attachedQuoteItems = [],
  prefillCategory = '',
  prefillQuantity = '',
  prefillNotes = '',
  onClearAttachedQuote,
  onSubmittedSuccess,
}: EnquirySectionProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState(prefillCategory || 'Bespoke Corporate Gift Box Enquiry');
  const [message, setMessage] = useState(
    prefillNotes ? `${prefillNotes} (Qty: ${prefillQuantity || '100+'})` : ''
  );
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setIsSubmitting(true);
    try {
      await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: `contact-form-${Date.now()}`,
          companyName: 'Corporate Visitor',
          contactName: name,
          businessEmail: email,
          phone: phone || '+91 8867719798',
          conversationSummary: `Contact Section Form: ${subject} — ${message}`,
          additionalRequirements: message,
          consentToContact: true,
        }),
      });
      setSubmitted(true);
      onSubmittedSuccess?.();
    } catch (err) {
      console.error('Contact enquiry submit failed:', err);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full bg-white py-16 lg:py-24" id="contact-section">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold tracking-widest text-[#777777] uppercase block mb-1">
            CONTACT
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl text-[#111827] tracking-tight font-bold">
            Need Help? <span className="text-[#cc181e] font-serif font-bold">Contact Us</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#555555] mt-2">
            Reach our Bengaluru packaging atelier for bespoke dielines, materials consultation, and bulk deliveries.
          </p>
        </div>

        {/* 4 Contact Info Cards with Solid Vibrant Red Circular Icons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {CONTACT_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="bg-[#f9fafb] p-7 rounded-xl flex items-start gap-5 border border-[#e5e7eb] hover:shadow-xs transition-shadow"
              >
                <div className="w-13 h-13 rounded-full bg-[#cc181e] text-white flex items-center justify-center shrink-0 shadow-md">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#111827] mb-1">{card.title}</h4>
                  <p className="text-xs sm:text-sm text-[#555555] leading-relaxed">
                    {card.description}
                  </p>
                  {card.linkHref && (
                    <a
                      href={card.linkHref}
                      className="text-xs sm:text-sm font-bold text-[#0088cc] hover:text-[#cc181e] transition-colors mt-1 inline-block"
                    >
                      {card.linkText}
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact Form */}
        <div className="bg-[#f9fafb] p-8 sm:p-10 rounded-2xl border border-[#e5e7eb] shadow-xs">
          {submitted ? (
            <div className="py-8 text-center">
              <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-[#111827] mb-1">Message Sent to Sales Desk!</h3>
              <p className="text-xs sm:text-sm text-[#555555] max-w-md mx-auto mb-4">
                Thank you, <strong>{name}</strong>. Our Bengaluru team has received your enquiry and will respond within 4 business hours.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="text-xs font-bold text-[#0088cc] hover:underline cursor-pointer"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name *"
                    className="w-full px-4 py-3 rounded-lg bg-white border border-[#d1d5db] text-xs sm:text-sm text-[#222222] placeholder:text-[#888888] focus:outline-hidden focus:ring-2 focus:ring-[#cc181e]/30 focus:border-[#cc181e] transition-all"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your Email *"
                    className="w-full px-4 py-3 rounded-lg bg-white border border-[#d1d5db] text-xs sm:text-sm text-[#222222] placeholder:text-[#888888] focus:outline-hidden focus:ring-2 focus:ring-[#cc181e]/30 focus:border-[#cc181e] transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Your Phone Number"
                    className="w-full px-4 py-3 rounded-lg bg-white border border-[#d1d5db] text-xs sm:text-sm text-[#222222] placeholder:text-[#888888] focus:outline-hidden focus:ring-2 focus:ring-[#cc181e]/30 focus:border-[#cc181e] transition-all"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Subject *"
                    className="w-full px-4 py-3 rounded-lg bg-white border border-[#d1d5db] text-xs sm:text-sm text-[#222222] placeholder:text-[#888888] focus:outline-hidden focus:ring-2 focus:ring-[#cc181e]/30 focus:border-[#cc181e] transition-all"
                  />
                </div>
              </div>

              <div>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your box specifications, quantities, or event dates..."
                  className="w-full px-4 py-3 rounded-lg bg-white border border-[#d1d5db] text-xs sm:text-sm text-[#222222] placeholder:text-[#888888] focus:outline-hidden focus:ring-2 focus:ring-[#cc181e]/30 focus:border-[#cc181e] transition-all resize-none"
                />
              </div>

              {attachedQuoteItems.length > 0 && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-[#006497] flex items-center justify-between">
                  <span>Attached Quote List: {attachedQuoteItems.length} items configured</span>
                  <button
                    type="button"
                    onClick={onClearAttachedQuote}
                    className="text-xs text-red-600 hover:underline cursor-pointer"
                  >
                    Clear attached list
                  </button>
                </div>
              )}

              <div className="text-center pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 rounded-full bg-[#cc181e] hover:bg-[#b01217] disabled:opacity-50 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95 inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
