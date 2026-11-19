import { Minus, Plus, Trash2, X } from 'lucide-react';
import {
  calculateLineTotal,
  calculateQuoteSummary,
  formatCurrency,
  type QuoteItem,
} from '../utils/packagingLogic';
import { ResilientImage } from './ResilientImage';

interface QuoteDrawerProps {
  open: boolean;
  items: QuoteItem[];
  onClose: () => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onProceedToEnquiry: () => void;
}

export function QuoteDrawer({
  open,
  items,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToEnquiry,
}: QuoteDrawerProps) {
  if (!open) return null;

  const summary = calculateQuoteSummary(items);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Custom Packaging Quote List"
      className="fixed inset-0 z-50 flex justify-end bg-black/40"
    >
      <div className="w-full max-w-md bg-white h-full flex flex-col border-l border-[#e5e7eb] shadow-2xl">
        <div className="px-6 py-4 border-b border-[#e5e7eb] flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold text-[#222222]">
              Quote List
            </h2>
            <p className="text-xs text-[#555555] tabular-nums">
              {summary.lineCount} {summary.lineCount === 1 ? 'format' : 'formats'} ·{' '}
              {summary.totalUnits} total units
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close quote list drawer"
            className="w-9 h-9 inline-flex items-center justify-center rounded border border-[#e5e7eb] text-[#555555] hover:text-[#222222] hover:bg-[#f8f9fa] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="bg-[#f8f9fa] border border-[#e5e7eb] rounded p-6 text-center">
              <p className="text-sm font-bold text-[#222222]">
                Your quote list is empty
              </p>
              <p className="mt-1.5 text-xs text-[#555555] leading-relaxed">
                Select any rigid box, corporate hamper, or corrugated mailer from the catalog to configure finishes and quantities.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-4 px-4 py-2 text-xs font-bold text-[#0088cc] border-[1.5px] border-[#0088cc] rounded hover:bg-[#0088cc] hover:text-white transition-colors cursor-pointer"
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="border border-[#e5e7eb] rounded p-4 bg-white space-y-3"
              >
                <div className="flex gap-3">
                  <div className="w-20 h-16 rounded overflow-hidden border border-[#e5e7eb] bg-[#f8f9fa] shrink-0">
                    <ResilientImage
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-bold text-[#222222] leading-snug">
                        {item.name}
                      </h3>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.id)}
                        aria-label={`Remove ${item.name} from quote list`}
                        className="p-1 text-[#555555] hover:text-[#cc181e] cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-[#555555] mt-0.5">
                      {item.finish} · {item.insert}
                    </p>
                    <p className="text-xs text-[#006497] font-semibold mt-0.5 tabular-nums">
                      {item.dimensionsMm}
                    </p>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-[#e5e7eb] flex items-center justify-between gap-3">
                  <div className="inline-flex items-center border border-[#d1d5db] rounded">
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.id, -25)}
                      aria-label={`Decrease quantity for ${item.name}`}
                      className="w-8 h-8 inline-flex items-center justify-center text-[#222222] hover:bg-[#f8f9fa] cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-[#222222] tabular-nums">
                      {item.quantity} pcs
                    </span>
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.id, 25)}
                      aria-label={`Increase quantity for ${item.name}`}
                      className="w-8 h-8 inline-flex items-center justify-center text-[#222222] hover:bg-[#f8f9fa] cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-right">
                    <div className="text-[11px] text-[#555555] tabular-nums">
                      {formatCurrency(item.unitPrice)} / pc
                    </div>
                    <div className="text-sm font-bold text-[#222222] tabular-nums">
                      {formatCurrency(calculateLineTotal(item.unitPrice, item.quantity))}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-[#e5e7eb] bg-[#fcf9f8] space-y-4">
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-semibold text-[#555555]">
                Estimated Production Total
              </span>
              <span className="text-xl font-bold text-[#cc181e] tabular-nums">
                {formatCurrency(summary.estimatedSubtotal)}
              </span>
            </div>
            <button
              type="button"
              onClick={onProceedToEnquiry}
              className="w-full py-3 px-5 text-sm font-bold text-white bg-[#cc181e] hover:bg-[#b01217] rounded transition-colors cursor-pointer"
            >
              Attach Items &amp; Send Enquiry
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
