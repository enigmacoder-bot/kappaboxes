import { useState, useEffect } from 'react';
import { X, MessageSquare, ExternalLink, Copy, Check } from 'lucide-react';
import type { DiscoveredEnquiryState } from '../../types/chat';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  enquiryState: DiscoveredEnquiryState;
}

export function WhatsAppModal({ isOpen, onClose, enquiryState }: WhatsAppModalProps) {
  const [draftText, setDraftText] = useState('');
  const [copied, setCopied] = useState(false);
  const [companyNumber, setCompanyNumber] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    setLoading(true);
    fetch('/api/whatsapp-draft', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        companyName: enquiryState.companyName || '',
        contactName: enquiryState.contactName || '',
        requirement: enquiryState.occasion || enquiryState.giftingPurpose || 'Corporate Gifting Enquiry',
        occasion: enquiryState.occasion || '',
        targetAudience: enquiryState.targetAudience || '',
        quantity: enquiryState.quantity || '',
        budgetPerUnit: enquiryState.budgetPerUnit || '',
        customisation: enquiryState.customisationRequirements || '',
        deliveryLocation: enquiryState.deliveryLocations || '',
        requiredDeliveryDate: enquiryState.requiredDeliveryDate || '',
        additionalNotes: enquiryState.additionalRequirements || '',
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setDraftText(data.formattedText);
          setCompanyNumber(data.companyNumber);
        }
      })
      .catch((err) => {
        console.error('Failed to load WhatsApp draft from backend:', err);
        // Fallback local text generation
        const fallback = [
          'Hello KappaBoxes! I would like to enquire about corporate gifting solutions.',
          '',
          enquiryState.companyName ? `*Company:* ${enquiryState.companyName}` : '',
          enquiryState.occasion ? `*Requirement:* ${enquiryState.occasion}` : '',
          enquiryState.quantity ? `*Estimated Quantity:* ${enquiryState.quantity} units` : '',
          enquiryState.budgetPerUnit ? `*Target Budget:* ₹${enquiryState.budgetPerUnit} per unit` : '',
          enquiryState.customisationRequirements ? `*Customisation:* ${enquiryState.customisationRequirements}` : '',
          enquiryState.deliveryLocations ? `*Delivery Location:* ${enquiryState.deliveryLocations}` : '',
          '',
          'Please share suitable options, pricing and availability.',
          'Thank you.',
        ]
          .filter(Boolean)
          .join('\n');
        setDraftText(fallback);
      })
      .finally(() => setLoading(false));
  }, [isOpen, enquiryState]);

  if (!isOpen) return null;

  const handleOpenWhatsApp = () => {
    const encoded = encodeURIComponent(draftText);
    const targetNumber = companyNumber || '13125550184';
    const url = `https://wa.me/${targetNumber}?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    onClose();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(draftText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-[#075E54] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center text-white">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold leading-tight">Send Enquiry via WhatsApp</h3>
              <p className="text-xs text-white/80">Connect directly with KappaBoxes Sales Team</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1 text-sm text-[#333333]">
          <p className="text-xs text-gray-500 mb-2">
            Review and edit your enquiry draft below before launching WhatsApp:
          </p>

          {loading ? (
            <div className="h-44 flex items-center justify-center text-gray-400">
              <span>Generating summary...</span>
            </div>
          ) : (
            <textarea
              value={draftText}
              onChange={(e) => setDraftText(e.target.value)}
              rows={8}
              className="w-full p-3 font-mono text-xs border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#25D366] focus:border-transparent bg-gray-50 leading-relaxed resize-none"
              placeholder="Your enquiry summary will appear here..."
            />
          )}

          <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-800 leading-normal">
            <strong>Important:</strong> Clicking <em>Open in WhatsApp</em> will open WhatsApp with your enquiry pre-filled. You will still have the opportunity to review and press <strong>Send</strong> manually.
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 hover:text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied!' : 'Copy Text'}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleOpenWhatsApp}
              disabled={!draftText.trim()}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-[#25D366] hover:bg-[#1EBE5D] disabled:opacity-50 rounded-lg shadow-xs hover:shadow transition-all cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              Open in WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
