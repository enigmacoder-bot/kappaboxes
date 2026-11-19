import { useEffect, useState } from 'react';
import { Check, X } from 'lucide-react';
import type {
  FinishOption,
  InsertOption,
  PackagingProduct,
} from '../data/catalog';
import {
  calculateConfiguredUnitPrice,
  calculateLineTotal,
  formatCurrency,
  getVolumeDiscountMultiplier,
} from '../utils/packagingLogic';
import { ResilientImage } from './ResilientImage';

interface ProductModalProps {
  product: PackagingProduct | null;
  onClose: () => void;
  onAddToQuote: (config: {
    product: PackagingProduct;
    finish: FinishOption;
    insert: InsertOption;
    quantity: number;
    unitPrice: number;
  }) => void;
  onDirectEnquiry: (product: PackagingProduct, quantity: number) => void;
}

const QUANTITY_PRESETS = [50, 250, 500, 1000];

export function ProductModal({
  product,
  onClose,
  onAddToQuote,
  onDirectEnquiry,
}: ProductModalProps) {
  const [finish, setFinish] = useState<FinishOption>('Matte Lamination');
  const [insert, setInsert] = useState<InsertOption>('Die-Cut EVA Foam');
  const [quantity, setQuantity] = useState<number>(250);

  useEffect(() => {
    if (!product) return;
    setFinish(product.featuredFinish);
    setInsert(product.availableInserts[0]);
    setQuantity(Math.max(product.moq, 250));
  }, [product]);

  useEffect(() => {
    if (!product) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [product, onClose]);

  if (!product) return null;

  const safeQty = Math.max(product.moq, quantity || product.moq);
  const unitPrice = calculateConfiguredUnitPrice(
    product.baseUnitPrice,
    finish,
    insert,
    safeQty
  );
  const lineTotal = calculateLineTotal(unitPrice, safeQty);
  const discountPct = Math.round((1 - getVolumeDiscountMultiplier(safeQty)) * 100);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-product-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[1px]"
    >
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white border border-[#e5e7eb] rounded-lg shadow-xl">
        <div className="sticky top-0 z-10 bg-white border-b border-[#e5e7eb] px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#006497]">
              {product.sku} · {product.category}
            </p>
            <h2
              id="modal-product-title"
              className="font-display text-2xl font-semibold text-[#222222]"
            >
              {product.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close product configurator"
            className="w-9 h-9 inline-flex items-center justify-center rounded border border-[#e5e7eb] text-[#555555] hover:text-[#222222] hover:bg-[#f8f9fa] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left column: Image & Technical Specs */}
          <div className="md:col-span-5 space-y-4">
            <div className="aspect-[4/3] rounded overflow-hidden border border-[#e5e7eb] bg-[#f8f9fa]">
              <ResilientImage
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="bg-[#f8f9fa] border border-[#e5e7eb] rounded p-4 space-y-2.5 text-sm">
              <div className="flex justify-between gap-2">
                <span className="text-[#555555]">Dimensions</span>
                <span className="font-semibold text-[#222222] tabular-nums">
                  {product.dimensionsMm}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-[#555555]">Board Grade</span>
                <span className="font-semibold text-[#222222]">
                  {product.boardGrade}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-[#555555]">Standard Lead Time</span>
                <span className="font-semibold text-[#222222] tabular-nums">
                  {product.leadTimeDays}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-[#555555]">Minimum Order</span>
                <span className="font-semibold text-[#006497] tabular-nums">
                  {product.moq} Units
                </span>
              </div>
            </div>
          </div>

          {/* Right column: Configurator */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-5">
            <div className="space-y-5">
              {/* Surface Finish */}
              <div>
                <span className="block text-xs font-bold uppercase tracking-[0.06em] text-[#222222] mb-2">
                  1. Surface Finish
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {product.availableFinishes.map((opt) => {
                    const selected = finish === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => setFinish(opt)}
                        className={`px-3 py-2 text-left text-xs sm:text-sm font-semibold rounded border flex items-center justify-between gap-2 cursor-pointer ${
                          selected
                            ? 'border-[#0088cc] bg-[#e6f4fa] text-[#006699]'
                            : 'border-[#d1d5db] bg-white text-[#222222] hover:border-[#0088cc]'
                        }`}
                      >
                        <span className="truncate">{opt}</span>
                        {selected && <Check className="w-4 h-4 shrink-0" aria-hidden="true" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Inner Insert */}
              <div>
                <span className="block text-xs font-bold uppercase tracking-[0.06em] text-[#222222] mb-2">
                  2. Interior Insert Tray
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {product.availableInserts.map((opt) => {
                    const selected = insert === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => setInsert(opt)}
                        className={`px-3 py-2 text-left text-xs sm:text-sm font-semibold rounded border flex items-center justify-between gap-2 cursor-pointer ${
                          selected
                            ? 'border-[#0088cc] bg-[#e6f4fa] text-[#006699]'
                            : 'border-[#d1d5db] bg-white text-[#222222] hover:border-[#0088cc]'
                        }`}
                      >
                        <span className="truncate">{opt}</span>
                        {selected && <Check className="w-4 h-4 shrink-0" aria-hidden="true" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity Tiers */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="modal-quantity-input"
                    className="text-xs font-bold uppercase tracking-[0.06em] text-[#222222]"
                  >
                    3. Production Quantity
                  </label>
                  {discountPct > 0 && (
                    <span className="px-2 py-0.5 rounded bg-[#e6f4fa] text-[#006699] text-xs font-bold tabular-nums">
                      {discountPct}% Volume Tier Applied
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-4 gap-2 mb-2.5">
                  {QUANTITY_PRESETS.filter((q) => q >= product.moq).map((preset) => {
                    const active = quantity === preset;
                    return (
                      <button
                        key={preset}
                        type="button"
                        aria-pressed={active}
                        onClick={() => setQuantity(preset)}
                        className={`py-2 text-sm font-bold rounded border tabular-nums cursor-pointer ${
                          active
                            ? 'bg-[#222222] text-white border-[#222222]'
                            : 'bg-white text-[#222222] border-[#d1d5db] hover:border-[#222222]'
                        }`}
                      >
                        {preset}
                      </button>
                    );
                  })}
                </div>
                <input
                  id="modal-quantity-input"
                  type="number"
                  min={product.moq}
                  step={10}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(product.moq, Number(e.target.value) || product.moq))}
                  className="w-full px-3.5 py-2 text-sm font-semibold text-[#222222] bg-white border border-[#d1d5db] rounded tabular-nums focus:outline-none focus:border-[#0088cc] focus:ring-2 focus:ring-[#0088cc]/25"
                />
              </div>
            </div>

            {/* Pricing Summary & Actions */}
            <div className="pt-4 border-t border-[#e5e7eb] space-y-4">
              <div className="bg-[#fcf9f8] border border-[#e5e7eb] rounded p-4 flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-medium text-[#555555]">
                    Estimated Unit Rate
                  </div>
                  <div className="text-xl font-bold text-[#222222] tabular-nums">
                    {formatCurrency(unitPrice)}
                    <span className="text-xs font-normal text-[#555555]"> / pc</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-medium text-[#555555]">
                    Estimated Lot Subtotal ({safeQty} pcs)
                  </div>
                  <div className="text-xl font-bold text-[#cc181e] tabular-nums">
                    {formatCurrency(lineTotal)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() =>
                    onAddToQuote({
                      product,
                      finish,
                      insert,
                      quantity: safeQty,
                      unitPrice,
                    })
                  }
                  className="px-5 py-3 text-sm font-bold text-white bg-[#cc181e] hover:bg-[#b01217] rounded transition-colors cursor-pointer"
                >
                  Add to Quote List
                </button>
                <button
                  type="button"
                  onClick={() => onDirectEnquiry(product, safeQty)}
                  className="px-5 py-3 text-sm font-bold text-[#0088cc] border-[1.5px] border-[#0088cc] hover:bg-[#0088cc] hover:text-white rounded transition-colors cursor-pointer"
                >
                  Direct Enquiry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
