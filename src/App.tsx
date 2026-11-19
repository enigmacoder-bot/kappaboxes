import { useState } from 'react';
import { AboutSection } from './components/AboutSection';
import { ClientsSection } from './components/ClientsSection';
import { EnquirySection } from './components/EnquirySection';
import { Footer } from './components/Footer';
import { GallerySection } from './components/GallerySection';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductCatalog } from './components/ProductCatalog';
import { ProductModal } from './components/ProductModal';
import { QuoteDrawer } from './components/QuoteDrawer';
import { SimpleLeadChatWidget } from './components/chat/SimpleLeadChatWidget';
import {
  PACKAGING_CATALOG,
  type FinishOption,
  type InsertOption,
  type PackagingCategory,
  type PackagingProduct,
} from './data/catalog';
import {
  calculateConfiguredUnitPrice,
  calculateQuoteSummary,
  type QuoteItem,
} from './utils/packagingLogic';

export default function App() {
  const [activeCategory, setActiveCategory] =
    useState<PackagingCategory>('All Products');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] =
    useState<PackagingProduct | null>(null);
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([]);
  const [quoteDrawerOpen, setQuoteDrawerOpen] = useState(false);

  const [prefillCategory, setPrefillCategory] = useState('Corporate Gifts');
  const [prefillQuantity, setPrefillQuantity] = useState('100');
  const [prefillNotes, setPrefillNotes] = useState('');

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAddToQuote = ({
    product,
    finish,
    insert,
    quantity,
    unitPrice,
  }: {
    product: PackagingProduct;
    finish: FinishOption;
    insert: InsertOption;
    quantity: number;
    unitPrice: number;
  }) => {
    setQuoteItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.productId === product.id &&
          item.finish === finish &&
          item.insert === insert
      );
      if (existingIndex >= 0) {
        const updated = [...prev];
        const nextQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: nextQty,
          unitPrice: calculateConfiguredUnitPrice(
            product.baseUnitPrice,
            finish,
            insert,
            nextQty
          ),
        };
        return updated;
      }
      return [
        ...prev,
        {
          id: `${product.id}-${finish}-${insert}-${Date.now()}`,
          productId: product.id,
          sku: product.sku,
          name: product.name,
          dimensionsMm: product.dimensionsMm,
          finish,
          insert,
          quantity,
          unitPrice,
          imageUrl: product.imageUrl,
        },
      ];
    });
    setSelectedProduct(null);
    setQuoteDrawerOpen(true);
  };

  const handleUpdateQuoteQuantity = (id: string, delta: number) => {
    setQuoteItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const catalogProduct = PACKAGING_CATALOG.find(
          (p) => p.id === item.productId
        );
        const minMoq = catalogProduct?.moq ?? 50;
        const nextQty = Math.max(minMoq, item.quantity + delta);
        const nextUnitPrice = catalogProduct
          ? calculateConfiguredUnitPrice(
              catalogProduct.baseUnitPrice,
              item.finish,
              item.insert,
              nextQty
            )
          : item.unitPrice;
        return {
          ...item,
          quantity: nextQty,
          unitPrice: nextUnitPrice,
        };
      })
    );
  };

  const handleRemoveQuoteItem = (id: string) => {
    setQuoteItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleQuickEnquire = (product: PackagingProduct, qty?: number) => {
    setPrefillCategory(product.category);
    setPrefillQuantity(String(qty ?? product.moq));
    setPrefillNotes(
      `Interested in ${product.name} (${product.sku}, ${product.dimensionsMm}, ${product.boardGrade}).`
    );
    setSelectedProduct(null);
    scrollToSection('contact-section');
  };

  const handleProceedFromDrawer = () => {
    if (quoteItems.length > 0) {
      const totalQty = quoteItems.reduce((acc, i) => acc + i.quantity, 0);
      const summaryLines = quoteItems
        .map(
          (i) =>
            `${i.quantity}x ${i.name} (${i.sku}) — ${i.finish}, ${i.insert}`
        )
        .join('; ');
      setPrefillQuantity(String(totalQty));
      setPrefillNotes(`Quote List: ${summaryLines}`);
    }
    setQuoteDrawerOpen(false);
    scrollToSection('contact-section');
  };

  const quoteSummary = calculateQuoteSummary(quoteItems);

  return (
    <div id="top" className="min-h-screen flex flex-col bg-white text-[#222222]">
      {/* 1. Header with KappaBoxes 3D Mark & Navigation */}
      <Header onEnquiryClick={() => scrollToSection('contact-section')} />

      <main className="flex-1">
        {/* 2. Hero & Quick Estimate RFQ Card */}
        <Hero
          onEnquiryClick={() => scrollToSection('quick-inquiry')}
          onExploreClick={() => scrollToSection('collections-portfolio')}
        />

        {/* 3. Industry Leaders / Trust Metrics */}
        <ClientsSection />

        {/* 4. About Us & Core Capability Manifesto */}
        <AboutSection />

        {/* 5. Gift Boxes Collection & Catalog */}
        <ProductCatalog
          products={PACKAGING_CATALOG}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelectProduct={setSelectedProduct}
          onQuickEnquire={(p) => handleQuickEnquire(p)}
          quoteLineCount={quoteSummary.lineCount}
          quoteTotalUnits={quoteSummary.totalUnits}
          onOpenQuoteDrawer={() => setQuoteDrawerOpen(true)}
        />

        {/* 6. Gallery: Check Our Boxes Showcase */}
        <GallerySection />

        {/* 7. Contact Us & Custom Sample Desk */}
        <EnquirySection
          attachedQuoteItems={quoteItems}
          prefillCategory={prefillCategory}
          prefillQuantity={prefillQuantity}
          prefillNotes={prefillNotes}
          onClearAttachedQuote={() => setQuoteItems([])}
          onSubmittedSuccess={() => setQuoteItems([])}
        />
      </main>

      {/* 8. Footer */}
      <Footer />

      {/* Product Spec Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToQuote={handleAddToQuote}
        onDirectEnquiry={handleQuickEnquire}
      />

      {/* Quote Drawer */}
      <QuoteDrawer
        open={quoteDrawerOpen}
        items={quoteItems}
        onClose={() => setQuoteDrawerOpen(false)}
        onUpdateQuantity={handleUpdateQuoteQuantity}
        onRemoveItem={handleRemoveQuoteItem}
        onProceedToEnquiry={handleProceedFromDrawer}
      />

      {/* Floating B2B Corporate Gifting Quick WhatsApp Enquiry Assistant */}
      <SimpleLeadChatWidget />
    </div>
  );
}
