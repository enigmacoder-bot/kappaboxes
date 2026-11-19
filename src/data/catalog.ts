import heroPackagingImg from '@/src/assets/images/hero_packaging_suite_1794662087131.jpg';
import rigidMagneticImg from '@/src/assets/images/product_rigid_magnetic_1794662087585.jpg';
import corporateHamperImg from '@/src/assets/images/product_corporate_hamper_1794662088046.jpg';
import corrugatedMailerImg from '@/src/assets/images/product_corrugated_mailer_1794662089404.jpg';
import festiveSleeveImg from '@/src/assets/images/product_festive_sleeve_1794662089954.jpg';
import ribbonKeepsakeImg from '@/src/assets/images/product_ribbon_keepsake_1794662337319.jpg';
import celebrationKitImg from '@/src/assets/images/product_celebration_kit_1794662337512.jpg';

export type PackagingCategory =
  | 'All Products'
  | 'Corporate Gifts'
  | 'Christmas Gifts'
  | 'Gift Hampers'
  | 'Annual Gifts';

export type FinishOption =
  | 'Matte Lamination'
  | 'Soft-Touch Velvet'
  | 'Foil Stamping'
  | 'Spot UV';

export type InsertOption =
  | 'Die-Cut EVA Foam'
  | 'Fluted Paperboard'
  | 'Molded Pulp'
  | 'No Insert';

export interface PackagingProduct {
  id: string;
  sku: string;
  name: string;
  category: Exclude<PackagingCategory, 'All Products'>;
  badge: string;
  dimensionsMm: string;
  boardGrade: string;
  moq: number;
  baseUnitPrice: number;
  leadTimeDays: string;
  featuredFinish: FinishOption;
  summary: string;
  imageUrl: string;
  availableFinishes: FinishOption[];
  availableInserts: InsertOption[];
  tags: string[];
}

export const HERO_IMAGE_URL = heroPackagingImg;

export const PACKAGING_CATEGORIES: PackagingCategory[] = [
  'All Products',
  'Corporate Gifts',
  'Christmas Gifts',
  'Gift Hampers',
  'Annual Gifts',
];

export const PACKAGING_CATALOG: PackagingProduct[] = [
  {
    id: 'executive-desk-hamper',
    sku: 'KB-CORP-101',
    name: 'Executive Onboarding & Desk Hamper',
    category: 'Corporate Gifts',
    badge: 'MAGNETIC LID',
    dimensionsMm: '340 × 260 × 115 mm',
    boardGrade: '2.0mm Kappa Rigid Board',
    moq: 100,
    baseUnitPrice: 14.5,
    leadTimeDays: '8–12 Business Days',
    featuredFinish: 'Foil Stamping',
    summary:
      'Structured 2mm Kappa core wrapped in European tactile linen-textured paper with metallic blind deboss and concealed magnetic closure.',
    imageUrl: corporateHamperImg,
    availableFinishes: ['Foil Stamping', 'Matte Lamination', 'Soft-Touch Velvet'],
    availableInserts: ['Die-Cut EVA Foam', 'Fluted Paperboard'],
    tags: ['EVA Foam Inset', 'Gold Foil', 'Ribbon Pull'],
  },
  {
    id: 'focus-milestone-box',
    sku: 'KB-ANN-202',
    name: 'Focus Signature Milestone Box',
    category: 'Annual Gifts',
    badge: 'NEW YEAR SUITE',
    dimensionsMm: '280 × 220 × 95 mm',
    boardGrade: '2.5mm Greyboard + Velvet Wrap',
    moq: 150,
    baseUnitPrice: 12.8,
    leadTimeDays: '10–12 Business Days',
    featuredFinish: 'Spot UV',
    summary:
      'Sleek book-style opening casing with dual concealed neodymium magnets and custom laser-engraved commemorative plate.',
    imageUrl: rigidMagneticImg,
    availableFinishes: ['Spot UV', 'Matte Lamination', 'Foil Stamping'],
    availableInserts: ['Die-Cut EVA Foam', 'Molded Pulp'],
    tags: ['Matte Lamination', 'Spot UV Gloss', 'Satin Ribbons'],
  },
  {
    id: 'grand-artisan-gourmet',
    sku: 'KB-HAMP-303',
    name: 'Grand Artisan Gourmet Casket',
    category: 'Gift Hampers',
    badge: 'FESTIVE HAMPER',
    dimensionsMm: '380 × 300 × 140 mm',
    boardGrade: '2.8mm Heavyweight Kappa Board',
    moq: 100,
    baseUnitPrice: 18.0,
    leadTimeDays: '10–14 Business Days',
    featuredFinish: 'Foil Stamping',
    summary:
      'Heavyweight 2.8mm rigid board engineered to bear up to 4kg contents with silver foiled exterior, luxury satin ribbon, and custom compartments.',
    imageUrl: festiveSleeveImg,
    availableFinishes: ['Foil Stamping', 'Soft-Touch Velvet'],
    availableInserts: ['Die-Cut EVA Foam', 'Fluted Paperboard'],
    tags: ['Velvet Touch', 'Silver Foil', 'Sturdy Handles'],
  },
  {
    id: 'atelier-wellness-box',
    sku: 'KB-CORP-404',
    name: 'Atelier Wellness & Spa Box',
    category: 'Corporate Gifts',
    badge: 'TOP & BOTTOM LID',
    dimensionsMm: '260 × 200 × 85 mm',
    boardGrade: '1.8mm FSC-Certified Core',
    moq: 250,
    baseUnitPrice: 9.5,
    leadTimeDays: '7–10 Business Days',
    featuredFinish: 'Matte Lamination',
    summary:
      'Sustainable FSC-certified textured unbleached stock encasing luxury wellness bottles with velvet top-flock and blind debossed logo.',
    imageUrl: celebrationKitImg,
    availableFinishes: ['Matte Lamination', 'Soft-Touch Velvet'],
    availableInserts: ['Molded Pulp', 'Die-Cut EVA Foam'],
    tags: ['Embossed Logo', 'Velvet Flocking', 'Precision Tray'],
  },
  {
    id: 'modern-desk-essentials',
    sku: 'KB-HAMP-505',
    name: 'Modern Executive Desk Essentials',
    category: 'Gift Hampers',
    badge: 'DRAWER / SLIPCASE',
    dimensionsMm: '310 × 230 × 100 mm',
    boardGrade: '2.2mm Kappa Board + Linen Sleeve',
    moq: 100,
    baseUnitPrice: 11.2,
    leadTimeDays: '8–12 Business Days',
    featuredFinish: 'Soft-Touch Velvet',
    summary:
      'Architectural slide-out drawer box with grosgrain ribbon tab, metallic pull, and high-density customized foam fitment for desk merchandise.',
    imageUrl: ribbonKeepsakeImg,
    availableFinishes: ['Soft-Touch Velvet', 'Foil Stamping', 'Spot UV'],
    availableInserts: ['Die-Cut EVA Foam', 'Fluted Paperboard'],
    tags: ['Soft-touch Velvet', 'Blind Deboss', 'Grosgrain Pull'],
  },
  {
    id: 'artisan-roast-hamper',
    sku: 'KB-XMAS-606',
    name: 'Artisan Roast & Confectionery Hamper',
    category: 'Christmas Gifts',
    badge: 'HANDMADE CRAFT',
    dimensionsMm: '320 × 250 × 110 mm',
    boardGrade: '2.4mm Kappa Core',
    moq: 100,
    baseUnitPrice: 13.5,
    leadTimeDays: '10–12 Business Days',
    featuredFinish: 'Foil Stamping',
    summary:
      'Deep-chamber rigid base with reinforced rim styling, custom food-grade safety partitions, and customized gold foil greeting belly band.',
    imageUrl: corrugatedMailerImg,
    availableFinishes: ['Foil Stamping', 'Matte Lamination'],
    availableInserts: ['Fluted Paperboard', 'Die-Cut EVA Foam'],
    tags: ['Gold Foil Bellyband', 'Silk Ribbon', 'Premium Kappa Core'],
  },
];
