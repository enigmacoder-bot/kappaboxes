import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateConfiguredUnitPrice,
  calculateLineTotal,
  calculateQuoteSummary,
  filterCatalogProducts,
  getVolumeDiscountMultiplier,
  validateEnquiryForm,
  type QuoteItem,
} from './packagingLogic';
import type { PackagingProduct } from '../data/catalog';

const SAMPLE_PRODUCTS: PackagingProduct[] = [
  {
    id: 'box-1',
    sku: 'KB-CORP-101',
    name: 'Executive Onboarding & Desk Hamper',
    category: 'Corporate Gifts',
    badge: 'MAGNETIC LID',
    dimensionsMm: '280 × 220 × 95 mm',
    boardGrade: '1200 GSM Greyboard',
    moq: 50,
    baseUnitPrice: 10.0,
    leadTimeDays: '10–12 Business Days',
    featuredFinish: 'Matte Lamination',
    summary: 'Concealed magnetic rigid box.',
    imageUrl: '/sample-1.jpg',
    availableFinishes: ['Matte Lamination', 'Foil Stamping'],
    availableInserts: ['No Insert', 'Die-Cut EVA Foam'],
    tags: ['EVA Foam Inset', 'Gold Foil'],
  },
  {
    id: 'box-2',
    sku: 'KB-ANN-202',
    name: 'Focus Signature Milestone Box',
    category: 'Annual Gifts',
    badge: 'NEW YEAR SUITE',
    dimensionsMm: '310 × 230 × 100 mm',
    boardGrade: '3-Ply E-Flute 450 GSM',
    moq: 100,
    baseUnitPrice: 3.0,
    leadTimeDays: '7–9 Business Days',
    featuredFinish: 'Matte Lamination',
    summary: 'Self-locking mailer box.',
    imageUrl: '/sample-2.jpg',
    availableFinishes: ['Matte Lamination'],
    availableInserts: ['No Insert'],
    tags: ['Matte Lamination', 'Spot UV'],
  },
];

test('volume discount multiplier scales across quantity tiers', () => {
  assert.equal(getVolumeDiscountMultiplier(50), 1.0);
  assert.equal(getVolumeDiscountMultiplier(250), 0.9);
  assert.equal(getVolumeDiscountMultiplier(500), 0.82);
  assert.equal(getVolumeDiscountMultiplier(1000), 0.74);
});

test('configured unit price includes finish and insert surcharges plus tier discount', () => {
  const base50 = calculateConfiguredUnitPrice(10.0, 'Matte Lamination', 'No Insert', 50);
  assert.equal(base50, 10.0);

  // 10.0 + 0.85 (Foil Stamping) + 1.15 (Die-Cut EVA Foam) = 12.00 * 0.9 (250 tier) = 10.80
  const foilFoam250 = calculateConfiguredUnitPrice(
    10.0,
    'Foil Stamping',
    'Die-Cut EVA Foam',
    250
  );
  assert.equal(foilFoam250, 10.8);
});

test('quote summary aggregates total units, line count, and subtotal accurately', () => {
  const items: QuoteItem[] = [
    {
      id: 'q1',
      productId: 'box-1',
      sku: 'MRD-RG-101',
      name: 'Scarlet Magnetic Closure Box',
      dimensionsMm: '280 × 220 × 95 mm',
      finish: 'Matte Lamination',
      insert: 'No Insert',
      quantity: 50,
      unitPrice: 10.0,
      imageUrl: '/sample-1.jpg',
    },
    {
      id: 'q2',
      productId: 'box-2',
      sku: 'MRD-CM-302',
      name: 'Double-Sided E-Flute Mailer',
      dimensionsMm: '310 × 230 × 100 mm',
      finish: 'Matte Lamination',
      insert: 'Fluted Paperboard',
      quantity: 100,
      unitPrice: 3.45,
      imageUrl: '/sample-2.jpg',
    },
  ];
  const summary = calculateQuoteSummary(items);
  assert.equal(summary.lineCount, 2);
  assert.equal(summary.totalUnits, 150);
  assert.equal(summary.estimatedSubtotal, 845.0);
  assert.equal(calculateLineTotal(3.45, 100), 345.0);
});

test('catalog filtering matches category and search query', () => {
  const corporateOnly = filterCatalogProducts(SAMPLE_PRODUCTS, 'Corporate Gifts', '');
  assert.equal(corporateOnly.length, 1);
  assert.equal(corporateOnly[0].id, 'box-1');

  const skuSearch = filterCatalogProducts(SAMPLE_PRODUCTS, 'All Products', 'KB-ANN-202');
  assert.equal(skuSearch.length, 1);
  assert.equal(skuSearch[0].id, 'box-2');

  const noMatch = filterCatalogProducts(SAMPLE_PRODUCTS, 'Gift Hampers', '');
  assert.equal(noMatch.length, 0);
});

test('enquiry validation catches invalid fields and passes valid payload', () => {
  const badErrors = validateEnquiryForm({
    fullName: 'A',
    company: '',
    email: 'invalid-email',
    phone: '123',
    category: 'Rigid Gift Boxes',
    estimatedQuantity: '10',
    notes: '',
  });
  assert.ok(badErrors.fullName);
  assert.ok(badErrors.company);
  assert.ok(badErrors.email);
  assert.ok(badErrors.phone);
  assert.ok(badErrors.estimatedQuantity);

  const validErrors = validateEnquiryForm({
    fullName: 'Elena Vance',
    company: 'Northstar Logistics',
    email: 'elena@northstar.co',
    phone: '+1 415 555 0194',
    category: 'Corporate Hampers',
    estimatedQuantity: '250',
    notes: 'Foil logo on lid',
  });
  assert.deepEqual(validErrors, {});
});
