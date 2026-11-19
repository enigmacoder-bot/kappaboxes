import { Sparkles } from 'lucide-react';
import festiveSleeveImg from '@/src/assets/images/product_festive_sleeve_1794662089954.jpg';
import celebrationKitImg from '@/src/assets/images/product_celebration_kit_1794662337512.jpg';
import ribbonKeepsakeImg from '@/src/assets/images/product_ribbon_keepsake_1794662337319.jpg';
import corporateHamperImg from '@/src/assets/images/product_corporate_hamper_1794662088046.jpg';
import rigidMagneticImg from '@/src/assets/images/product_rigid_magnetic_1794662087585.jpg';

const GALLERY_ITEMS = [
  {
    name: 'Strawberry Kiss Hamper',
    badge: 'STRAWBERRY KISS',
    badgeColor: 'bg-[#cc181e]',
    imageUrl: festiveSleeveImg,
    featured: false,
  },
  {
    name: 'Cross My Heart Hamper',
    badge: 'CROSS MY HEART',
    badgeColor: 'bg-[#0088cc]',
    imageUrl: celebrationKitImg,
    featured: false,
  },
  {
    name: 'Sweetheart Hamper Valentine Gift',
    badge: 'SWEETHEART HAMPER',
    badgeColor: 'bg-[#cc181e]',
    imageUrl: ribbonKeepsakeImg,
    featured: true, // Center highlighted featured item
  },
  {
    name: 'Festive Royale Gift Hamper',
    badge: 'FESTIVE ROYALE',
    badgeColor: 'bg-[#cc181e]',
    imageUrl: corporateHamperImg,
    featured: false,
  },
  {
    name: 'Couture Perfumery Casing',
    badge: 'BESPOKE SLEEVE',
    badgeColor: 'bg-[#0088cc]',
    imageUrl: rigidMagneticImg,
    featured: false,
  },
];

export function GallerySection() {
  return (
    <section className="w-full bg-[#f9fafb] py-16 lg:py-24 border-y border-[#e5e7eb]" id="gallery-section">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-semibold tracking-widest text-[#777777] uppercase block mb-1">
            GALLERY
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl text-[#111827] tracking-tight font-bold">
            Check <span className="text-[#cc181e] font-serif font-bold">Our Boxes</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#555555] mt-2">
            Explore our artisanal finishes, precision dielines, and bespoke textures designed for high-impact unboxing.
          </p>
        </div>

        {/* Gallery Showcase with Featured Highlight Border as in Stitch */}
        <div className="relative">
          <div
            className="flex gap-5 overflow-x-auto pb-6 pt-3 scroll-smooth snap-x items-center justify-start lg:justify-center scrollbar-none"
            id="gallery-scroller"
          >
            {GALLERY_ITEMS.map((item) => (
              <div
                key={item.badge}
                className={`snap-center bg-white rounded-xl overflow-hidden group transition-all duration-300 shrink-0 ${
                  item.featured
                    ? 'min-w-[260px] sm:min-w-[290px] shadow-xl ring-4 ring-[#cc181e] scale-105 z-10'
                    : 'min-w-[230px] sm:min-w-[260px] shadow-xs border border-[#e5e7eb]'
                }`}
              >
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span
                    className={`absolute bottom-2 left-2 px-2.5 py-0.5 rounded text-white text-[10px] font-bold tracking-wider shadow-xs ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                  {item.featured && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-white/90 text-[#cc181e] text-[9px] font-extrabold flex items-center gap-1 shadow-xs">
                      <Sparkles className="w-2.5 h-2.5" /> FEATURED
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Carousel Indicator Dots */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <span className="w-2 h-2 rounded-full bg-gray-300" />
            <span className="w-2 h-2 rounded-full bg-gray-300" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#cc181e]" />
            <span className="w-2 h-2 rounded-full bg-gray-300" />
            <span className="w-2 h-2 rounded-full bg-gray-300" />
          </div>
        </div>
      </div>
    </section>
  );
}
