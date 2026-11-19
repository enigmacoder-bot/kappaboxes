import { useState, type FormEvent } from 'react';
import { X, Send, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';
import type { DiscoveredEnquiryState } from '../../types/chat';

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string;
  enquiryState: DiscoveredEnquiryState;
  onSuccess: (referenceId: string) => void;
}

export function LeadCaptureModal({
  isOpen,
  onClose,
  sessionId,
  enquiryState,
  onSuccess,
}: LeadCaptureModalProps) {
  const [companyName, setCompanyName] = useState(enquiryState.companyName || '');
  const [contactName, setContactName] = useState(enquiryState.contactName || '');
  const [email, setEmail] = useState(enquiryState.businessEmail || '');
  const [phone, setPhone] = useState(enquiryState.phone || '');
  const [industry, setIndustry] = useState(enquiryState.industry || '');
  const [quantity, setQuantity] = useState(enquiryState.quantity ? String(enquiryState.quantity) : '');
  const [budgetPerUnit, setBudgetPerUnit] = useState(
    enquiryState.budgetPerUnit ? String(enquiryState.budgetPerUnit) : ''
  );
  const [notes, setNotes] = useState(
    [
      enquiryState.occasion ? `Occasion: ${enquiryState.occasion}` : '',
      enquiryState.customisationRequirements ? `Customisation: ${enquiryState.customisationRequirements}` : '',
      enquiryState.deliveryLocations ? `Delivery: ${enquiryState.deliveryLocations}` : '',
    ]
      .filter(Boolean)
      .join('\n')
  );
  const [consent, setConsent] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!companyName.trim()) {
      setErrorMsg('Please enter your company or organisation name.');
      return;
    }
    if (!contactName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid business email.');
      return;
    }
    if (!phone.trim() || phone.length < 7) {
      setErrorMsg('Please enter a valid phone number.');
      return;
    }
    if (!consent) {
      setErrorMsg('Consent to be contacted is required to submit your quotation request.');
      return;
    }

    setSubmitting(true);
    try {
      const parsedQty = quantity ? parseInt(quantity, 10) : undefined;
      const parsedBudget = budgetPerUnit ? parseInt(budgetPerUnit, 10) : undefined;

      const summaryText = `B2B Request for ${companyName} (${contactName}) — Purpose: ${
        enquiryState.occasion || 'Corporate Gifting'
      }, Quantity: ${quantity || 'TBD'}, Budget: ${budgetPerUnit ? `₹${budgetPerUnit}` : 'TBD'}. Notes: ${notes}`;

      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          companyName: companyName.trim(),
          industry: industry.trim() || undefined,
          contactName: contactName.trim(),
          businessEmail: email.trim(),
          phone: phone.trim(),
          giftingPurpose: enquiryState.giftingPurpose || enquiryState.occasion,
          occasion: enquiryState.occasion,
          targetAudience: enquiryState.targetAudience,
          quantity: isNaN(parsedQty as any) ? undefined : parsedQty,
          budgetPerUnitPaise: isNaN(parsedBudget as any) ? undefined : parsedBudget! * 100,
          customisationRequirements: enquiryState.customisationRequirements,
          deliveryLocations: enquiryState.deliveryLocations,
          conversationSummary: summaryText,
          additionalRequirements: notes.trim(),
          consentToContact: true,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmittedRef(data.referenceId);
        onSuccess(data.referenceId);
      } else {
        setErrorMsg(data.error || 'Failed to submit enquiry. Please try again.');
      }
    } catch (err: any) {
      setErrorMsg('Network error. Please check your connection or contact via WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-[#0088cc] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-sky-200" />
            <div>
              <h3 className="text-base font-bold leading-tight">Submit Corporate Gifting Enquiry</h3>
              <p className="text-xs text-white/80">Receive an official quote within 4 business hours</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close form"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {submittedRef ? (
          <div className="p-6 text-center">
            <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-[#222222] mb-1">Enquiry Submitted Successfully!</h4>
            <p className="text-sm text-gray-600 mb-3">
              Thank you, <strong>{contactName}</strong>. Our corporate account manager will contact you at <strong>{email}</strong>.
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 inline-block mb-5">
              <span className="text-xs text-gray-500 block">Enquiry Reference Number:</span>
              <span className="font-mono font-bold text-base text-[#0088cc]">{submittedRef}</span>
            </div>
            <div>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 px-4 bg-[#0088cc] hover:bg-[#006497] text-white font-bold rounded-lg transition-colors cursor-pointer"
              >
                Return to Chat
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 overflow-y-auto flex-1 space-y-3.5 text-xs text-[#333333]">
            {errorMsg && (
              <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1">Company / Organisation *</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Acme Technologies Ltd"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0088cc] focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Contact Person Name *</label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0088cc] focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1">Work Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="priya@acmetech.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0088cc] focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Contact Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0088cc] focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1">Target Quantity</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="e.g. 250 units"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0088cc] focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Budget / Unit (₹)</label>
                <input
                  type="number"
                  value={budgetPerUnit}
                  onChange={(e) => setBudgetPerUnit(e.target.value)}
                  placeholder="e.g. ₹1,500"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0088cc] focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Additional Requirements / Customisation</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Details on branding, delivery cities, deadline..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0088cc] focus:outline-hidden resize-none"
              />
            </div>

            <div className="pt-1">
              <label className="flex items-start gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  required
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 rounded text-[#0088cc] focus:ring-[#0088cc]"
                />
                <span className="text-[11px] text-gray-600 leading-tight">
                  I consent to KappaBoxes contacting me via email, phone, or WhatsApp regarding this B2B enquiry.
                </span>
              </label>
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-gray-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-[#0088cc] hover:bg-[#006497] disabled:opacity-50 rounded-lg shadow-xs hover:shadow transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                {submitting ? 'Submitting...' : 'Submit Quote Request'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
