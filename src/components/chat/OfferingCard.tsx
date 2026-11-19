import { Gift, Sparkles, Truck, CheckCircle2, AlertCircle } from 'lucide-react';
import type { GiftOffering } from '../../types/chat';

interface OfferingCardProps {
  offering: GiftOffering;
  onSelect: (offering: GiftOffering) => void;
}

export function OfferingCard({ offering, onSelect }: OfferingCardProps) {
  const isIdea = offering.offering_type === 'idea';
  const isService = offering.offering_type === 'service';

  const formatPrice = () => {
    if (offering.price_min_paise) {
      const min = Math.round(offering.price_min_paise / 100).toLocaleString('en-IN');
      if (offering.price_max_paise && offering.price_max_paise !== offering.price_min_paise) {
        const max = Math.round(offering.price_max_paise / 100).toLocaleString('en-IN');
        return `₹${min} – ₹${max}`;
      }
      return `From ₹${min}`;
    }
    return 'Quote on Request';
  };

  return (
    <div className="flex flex-col bg-white rounded-lg border border-[#e5e7eb] shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden w-full max-w-[280px] shrink-0 text-left">
      {/* Visual Header / Image */}
      <div className="relative h-28 w-full bg-[#f3f4f6] overflow-hidden flex items-center justify-center">
        {offering.image_url ? (
          <img
            src={offering.image_url}
            alt={offering.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              // Fallback to placeholder icon if image path fails
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-[#9ca3af]">
            <Gift className="w-8 h-8 mb-1" />
            <span className="text-xs font-medium">Bespoke Offering</span>
          </div>
        )}

        {/* Type Badge */}
        <div className="absolute top-2 left-2">
          {isIdea ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
              <Sparkles className="w-3 h-3" /> Illustrative Idea
            </span>
          ) : isService ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-100 text-purple-800 border border-purple-200">
              <Truck className="w-3 h-3" /> Service
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-[#006497] border border-blue-200">
              <CheckCircle2 className="w-3 h-3" /> Confirmed Solution
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#0088cc] mb-0.5">
            {offering.category}
          </div>
          <h4 className="text-sm font-bold text-[#222222] leading-snug line-clamp-1 mb-1" title={offering.name}>
            {offering.name}
          </h4>
          <p className="text-xs text-[#555555] line-clamp-2 mb-2 leading-relaxed">
            {offering.description}
          </p>

          {/* Pricing & MOQ metadata */}
          <div className="flex items-center justify-between text-xs py-1.5 px-2 bg-[#f9fafb] rounded border border-[#f0f0f0] mb-2">
            <div>
              <span className="text-[10px] text-[#777777] block">Est. Budget</span>
              <span className="font-bold text-[#222222]">{formatPrice()}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[#777777] block">Min Order</span>
              <span className="font-semibold text-[#555555]">
                {offering.minimum_quantity ? `${offering.minimum_quantity} units` : 'Custom MOQ'}
              </span>
            </div>
          </div>

          {/* Customisation highlights */}
          {offering.customisation_options.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {offering.customisation_options.slice(0, 2).map((opt) => (
                <span
                  key={opt}
                  className="text-[10px] bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded"
                >
                  {opt}
                </span>
              ))}
              {offering.customisation_options.length > 2 && (
                <span className="text-[10px] text-gray-400 self-center">
                  +{offering.customisation_options.length - 2} more
                </span>
              )}
            </div>
          )}

          {isIdea && (
            <div className="flex items-center gap-1 text-[10px] text-amber-700 bg-amber-50 p-1.5 rounded mb-2 border border-amber-100">
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>Illustrative concept: pricing confirmed upon enquiry.</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={() => onSelect(offering)}
          className="w-full mt-2 py-1.5 px-3 text-xs font-bold text-[#0088cc] hover:text-white bg-blue-50 hover:bg-[#0088cc] border border-blue-200 hover:border-transparent rounded transition-colors text-center cursor-pointer"
        >
          Enquire About This
        </button>
      </div>
    </div>
  );
}
