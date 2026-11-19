import type {
  FinishOption,
  InsertOption,
  PackagingCategory,
  PackagingProduct,
} from '../data/catalog';

export interface QuoteItem {
  id: string;
  productId: string;
  sku: string;
  name: string;
  dimensionsMm: string;
  finish: FinishOption;
  insert: InsertOption;
  quantity: number;
  unitPrice: number;
  imageUrl: string;
}

export interface EnquiryFormValues {
  fullName: string;
  company: string;
  email: string;
  phone: string;
  category: string;
  estimatedQuantity: string;
  notes: string;
}

export interface EnquiryValidationErrors {
  fullName?: string;
  company?: string;
  email?: string;
  phone?: string;
  estimatedQuantity?: string;
}

const FINISH_SURCHARGE: Record<FinishOption, number> = {
  'Matte Lamination': 0,
  'Soft-Touch Velvet': 0.55,
  'Foil Stamping': 0.85,
  'Spot UV': 0.65,
};

const INSERT_SURCHARGE: Record<InsertOption, number> = {
  'No Insert': 0,
  'Fluted Paperboard': 0.45,
  'Molded Pulp': 0.75,
  'Die-Cut EVA Foam': 1.15,
};

export function getVolumeDiscountMultiplier(quantity: number): number {
  if (quantity >= 1000) return 0.74;
  if (quantity >= 500) return 0.82;
  if (quantity >= 250) return 0.9;
  return 1.0;
}

export function calculateConfiguredUnitPrice(
  baseUnitPrice: number,
  finish: FinishOption,
  insert: InsertOption,
  quantity: number
): number {
  const safeQty = Math.max(1, Math.floor(quantity));
  const raw = baseUnitPrice + FINISH_SURCHARGE[finish] + INSERT_SURCHARGE[insert];
  const discounted = raw * getVolumeDiscountMultiplier(safeQty);
  return Math.round(discounted * 100) / 100;
}

export function calculateLineTotal(unitPrice: number, quantity: number): number {
  const safeQty = Math.max(1, Math.floor(quantity));
  return Math.round(unitPrice * safeQty * 100) / 100;
}

export function calculateQuoteSummary(items: QuoteItem[]): {
  totalUnits: number;
  estimatedSubtotal: number;
  lineCount: number;
} {
  return items.reduce(
    (acc, item) => {
      const qty = Math.max(1, Math.floor(item.quantity));
      return {
        totalUnits: acc.totalUnits + qty,
        estimatedSubtotal:
          Math.round((acc.estimatedSubtotal + item.unitPrice * qty) * 100) / 100,
        lineCount: acc.lineCount + 1,
      };
    },
    { totalUnits: 0, estimatedSubtotal: 0, lineCount: 0 }
  );
}

export function filterCatalogProducts(
  products: PackagingProduct[],
  activeCategory: PackagingCategory,
  searchQuery: string
): PackagingProduct[] {
  const normalizedQuery = searchQuery.trim().toLowerCase();
  return products.filter((product) => {
    const matchesCategory =
      activeCategory === 'All Products' || product.category === activeCategory;
    if (!matchesCategory) return false;
    if (!normalizedQuery) return true;
    return (
      product.name.toLowerCase().includes(normalizedQuery) ||
      product.sku.toLowerCase().includes(normalizedQuery) ||
      product.boardGrade.toLowerCase().includes(normalizedQuery) ||
      product.dimensionsMm.toLowerCase().includes(normalizedQuery) ||
      product.category.toLowerCase().includes(normalizedQuery)
    );
  });
}

export function validateEnquiryForm(values: EnquiryFormValues): EnquiryValidationErrors {
  const errors: EnquiryValidationErrors = {};
  if (!values.fullName.trim() || values.fullName.trim().length < 2) {
    errors.fullName = 'Please enter your full name (at least 2 characters).';
  }
  if (!values.company.trim()) {
    errors.company = 'Please enter your company or organization name.';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!values.email.trim() || !emailRegex.test(values.email.trim())) {
    errors.email = 'Please enter a valid work email address.';
  }
  const digits = values.phone.replace(/\D/g, '');
  if (!values.phone.trim() || digits.length < 7) {
    errors.phone = 'Please provide a contact phone number (at least 7 digits).';
  }
  const qty = Number(values.estimatedQuantity);
  if (!values.estimatedQuantity.trim() || Number.isNaN(qty) || qty < 25) {
    errors.estimatedQuantity = 'Minimum custom production enquiry is 25 units.';
  }
  return errors;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
