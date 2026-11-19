import { useState } from 'react';
import { Search, ShoppingBag, Eye, Send } from 'lucide-react';
import {
  PACKAGING_CATEGORIES,
  type PackagingCategory,
  type PackagingProduct,
} from '../data/catalog';
import { filterCatalogProducts } from '../utils/packagingLogic';

interface ProductCatalogProps {
  products: PackagingProduct[];
  activeCategory: PackagingCategory;
  onCategoryChange: (cat: PackagingCategory) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectProduct: (product: PackagingProduct) => void;
  onQuickEnquire: (product: PackagingProduct) => void;
  quoteLineCount: number;
  quoteTotalUnits: number;
  onOpenQuoteDrawer: () => void;
}

export function ProductCatalog({
  products,
  activeCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  onSelectProduct,
  onQuickEnquire,
  quoteLineCount,
  quoteTotalUnits,
  onOpenQuoteDrawer,
}: ProductCatalogProps) {
  const filteredProducts = filterCatalogProducts(products, activeCategory, searchQuery);

  const getSubheading = () => {
    switch (activeCategory) {
      case 'Corporate Gifts':
        return 'Corporate Gifts and Hampers';
      case 'Christmas Gifts':
        return 'Christmas & Festive Gift Boxes';
      case 'Gift Hampers':
        return 'Luxury Gift Hampers & Caskets';
      case 'Annual Gifts':
        return 'Annual Commemorative & Milestone Boxes';
      default:
        return 'Bespoke Corporate Boxes & Hampers';
    }
  };

  return (
    <section className="w-full bg-white py-16 lg:py-24" id="collections-portfolio">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Header matching Stitch: OUR GIFTS, GIFT BOXES (Red) */}
        <div className="text-center max-w-2xl mx-auto mb-6">
          <span className="text-xs font-semibold tracking-widest text-[#777777] uppercase block mb-1">
            OUR GIFTS
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#111827] tracking-tight font-bold">
            GIFT <span className="text-[#cc181e] font-serif font-bold">BOXES</span>
          </h2>
        </div>

        {/* Filter Tabs with Red Active Underline as in Stitch */}
        <div className="flex items-center justify-center flex-wrap gap-3 sm:gap-8 mb-6 border-b border-[#e5e7eb] pb-2">
          {PACKAGING_CATEGORIES.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => onCategoryChange(category)}
                className={`font-semibold text-xs sm:text-sm pb-2.5 transition-all cursor-pointer border-b-2 ${
                  isActive
                    ? 'text-[#cc181e] border-[#cc181e]'
                    : 'text-[#666666] border-transparent hover:text-[#cc181e]'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Dynamic Category Subheading & Quote Summary Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 text-center sm:text-left">
          <div>
            <span className="text-[11px] font-bold text-[#777777] tracking-wider uppercase block">
              {activeCategory.toUpperCase()}
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-[#0088cc] mt-0.5" id="section-category-title">
              {getSubheading()}
            </h3>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search box styles..."
                className="pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded-full focus:outline-hidden focus:ring-2 focus:ring-[#cc181e] bg-gray-50"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
            </div>

            {/* Quote List Drawer Trigger */}
            <button
              type="button"
              onClick={onOpenQuoteDrawer}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-full transition-colors cursor-pointer ${
                quoteLineCount > 0
                  ? 'bg-[#0088cc] text-white hover:bg-[#006497]'
                  : 'bg-white text-[#0088cc] border border-[#0088cc] hover:bg-[#0088cc] hover:text-white'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Quote List ({quoteLineCount})</span>
            </button>
          </div>
        </div>

        {/* Product Cards Grid with Signature Red "Enquiry Now" Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="product-grid">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl border border-[#e5e7eb] shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col group overflow-hidden"
            >
              {/* Image & Badge */}
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-50 flex items-center justify-center">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#0088cc] text-white text-[10px] font-bold tracking-wider uppercase shadow-xs">
                  {product.badge}
                </span>

                <button
                  type="button"
                  onClick={() => onSelectProduct(product)}
                  className="absolute bottom-3 right-3 p-2 bg-white/90 hover:bg-white text-[#111827] rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  title="Configure & inspect options"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col flex-1 justify-between text-center items-center">
                <div>
                  <span className="text-[10px] font-bold text-[#777777] tracking-wider uppercase block mb-1">
                    {product.boardGrade}
                  </span>
                  <h4 className="font-serif text-xl font-bold text-[#111827] mb-2 leading-snug">
                    {product.name}
                  </h4>
                  <p className="text-xs text-[#555555] leading-relaxed mb-4">
                    {product.summary}
                  </p>

                  {/* Material Tags */}
                  <div className="flex flex-wrap justify-center gap-1.5 mb-5">
                    {product.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 rounded bg-gray-100 text-[10px] font-medium text-[#444444]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer with MOQ and Red Enquiry Button */}
                <div className="w-full pt-3.5 border-t border-[#f0f0f0] flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#777777]">
                    Min {product.moq} Units
                  </span>
                  <button
                    type="button"
                    onClick={() => onQuickEnquire(product)}
                    className="px-5 py-2 rounded-full bg-[#cc181e] hover:bg-[#b01217] text-white text-xs font-bold transition-all shadow-xs hover:shadow active:scale-95 cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Enquiry Now</span>
                    <Send className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
