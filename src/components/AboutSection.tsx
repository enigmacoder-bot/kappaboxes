import { BookOpen, Layers, Network, Gem, Headset } from 'lucide-react';

export function AboutSection() {
  return (
    <section className="w-full bg-[#f9fafb] py-16 lg:py-24" id="about-section">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold tracking-widest text-[#777777] uppercase block mb-1">
            WHY KAPPABOXES
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl text-[#111827] font-bold">
            Learn More <span className="italic text-[#cc181e] font-serif">About Us</span>
          </h2>
          <p className="text-base text-[#0088cc] font-semibold mt-2">
            Crafting Excellence Through Modern Custom Packaging
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Dominant Red Manifesto Card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#cc181e] to-[#991216] text-white p-8 sm:p-10 rounded-2xl shadow-xl flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-6">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-bold tracking-widest text-red-200 uppercase block mb-2">
                MANIFESTO
              </span>
              <h3 className="font-serif text-3xl font-bold leading-snug">
                Some Information About us
              </h3>
              <p className="text-sm sm:text-base text-white/90 mt-4 leading-relaxed font-normal">
                As a custom box maker, we continually invest in state-of-the-art digital technologies to deliver quality creative packaging solutions. We are deeply committed to helping you remain responsive to evolving customer expectations and market needs—digitally printed packaging offers advantages that conventional methods simply cannot.
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-white/20 flex items-center justify-between text-xs font-semibold text-red-100">
              <span>Rigid Kappa Core (1.5mm - 3.5mm)</span>
              <Layers className="w-4 h-4 text-white/80" />
            </div>
          </div>

          {/* 3 Feature Columns */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white p-7 rounded-2xl shadow-xs border border-[#e5e7eb] hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-full bg-sky-50 flex items-center justify-center text-[#0088cc] mb-5">
                  <Network className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-[#111827] mb-2">Supply Chain Agility</h4>
                <p className="text-sm text-[#555555] leading-relaxed">
                  Ensuring you have all-in-one access to manufactured and distributed packaging products.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#f0f0f0]">
                <span className="text-[10px] font-bold text-[#0088cc] tracking-wider uppercase">
                  END-TO-END FULFILLMENT
                </span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-7 rounded-2xl shadow-xs border border-[#e5e7eb] hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-[#cc181e] mb-5">
                  <Gem className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-[#111827] mb-2">Scalable Solutions</h4>
                <p className="text-sm text-[#555555] leading-relaxed">
                  Easily grow with your brand from prototype batch runs to bulk multi-thousand unit runs.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#f0f0f0]">
                <span className="text-[10px] font-bold text-[#cc181e] tracking-wider uppercase">
                  100 TO 50,000+ UNITS
                </span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-7 rounded-2xl shadow-xs border border-[#e5e7eb] hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-full bg-sky-50 flex items-center justify-center text-[#0088cc] mb-5">
                  <Headset className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-[#111827] mb-2">Personalized Service</h4>
                <p className="text-sm text-[#555555] leading-relaxed">
                  Peace of mind, because every detail, dieline and lead time is managed to your advantage.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#f0f0f0]">
                <span className="text-[10px] font-bold text-[#0088cc] tracking-wider uppercase">
                  DEDICATED ACCOUNT LEAD
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
