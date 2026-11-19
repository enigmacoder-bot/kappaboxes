import {
  Zap,
  Watch,
  Diamond,
  Terminal,
  TrendingUp,
  Sparkles,
  Hotel,
  Bike,
  Activity,
  Building2,
  ShieldCheck,
  Gift,
  Factory,
} from 'lucide-react';

const CLIENT_LIST = [
  { name: 'ATHER', sub: 'Energy Suites', icon: Zap, color: 'text-[#cc181e]', bg: 'bg-red-50' },
  { name: 'TITAN', sub: 'Luxury Timepieces', icon: Watch, color: 'text-[#0088cc]', bg: 'bg-sky-50' },
  { name: 'TANISHQ', sub: 'Gold & Jewellery', icon: Diamond, color: 'text-[#cc181e]', bg: 'bg-red-50' },
  { name: 'INFOSYS', sub: 'Global Tech Gifting', icon: Terminal, color: 'text-[#0088cc]', bg: 'bg-sky-50' },
  { name: 'ZERODHA', sub: 'Executive Induction', icon: TrendingUp, color: 'text-[#cc181e]', bg: 'bg-red-50' },
  { name: 'FOREST ESSENTIALS', sub: 'Ayurvedic Hampers', icon: Sparkles, color: 'text-[#0088cc]', bg: 'bg-sky-50' },
  { name: 'ITC HOTELS', sub: 'Gourmet Confections', icon: Hotel, color: 'text-[#cc181e]', bg: 'bg-red-50' },
  { name: 'SWIGGY', sub: 'Partner Kits', icon: Bike, color: 'text-[#0088cc]', bg: 'bg-sky-50' },
  { name: 'CULT.FIT', sub: 'Merch Packaging', icon: Activity, color: 'text-[#cc181e]', bg: 'bg-red-50' },
  { name: 'WIPRO', sub: 'Annual Awards', icon: Building2, color: 'text-[#0088cc]', bg: 'bg-sky-50' },
];

export function ClientsSection() {
  return (
    <section className="w-full bg-white py-16 border-b border-[#e5e7eb] relative overflow-hidden" id="clients-section">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold tracking-widest text-[#777777] uppercase block mb-1">
            TRUSTED BY 500+ ENTERPRISES &amp; LUXURY BRANDS
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#111827] tracking-tight leading-tight font-bold">
            Powering Packaging for <span className="italic text-[#cc181e] font-serif">Industry Leaders</span>
          </h2>
          <p className="text-sm text-[#555555] mt-2">
            From agile Bengaluru tech unicorns to legacy conglomerates, top brands trust KappaBoxes for precision unboxing suites.
          </p>
        </div>

        {/* Client Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 lg:gap-5 items-center">
          {CLIENT_LIST.map((client) => {
            const Icon = client.icon;
            return (
              <div
                key={client.name}
                className="group bg-[#f9fafb] hover:bg-white p-4.5 rounded-xl border border-[#e5e7eb] hover:border-[#cc181e]/30 transition-all duration-300 shadow-2xs hover:shadow-md flex flex-col items-center justify-center text-center"
              >
                <div
                  className={`w-10 h-10 rounded-full ${client.bg} ${client.color} flex items-center justify-center mb-2 group-hover:scale-105 transition-transform`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-bold text-sm text-[#111827] tracking-tight">{client.name}</span>
                <span className="text-[10px] text-[#777777] uppercase font-semibold">{client.sub}</span>
              </div>
            );
          })}
        </div>

        {/* Highlight Stats Bar */}
        <div className="mt-10 p-5 rounded-xl bg-[#f9fafb] border border-[#e5e7eb] flex flex-col md:flex-row items-center justify-around gap-4 text-center">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#cc181e]" />
            <span className="text-xs sm:text-sm font-semibold text-[#222222]">
              <strong className="text-[#cc181e] font-bold">99.4%</strong> On-Time Corporate Delivery
            </span>
          </div>
          <div className="hidden md:block w-px h-6 bg-[#d1d5db]"></div>
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-[#0088cc]" />
            <span className="text-xs sm:text-sm font-semibold text-[#222222]">
              <strong className="text-[#0088cc] font-bold">100K+</strong> Hampers Delivered Annually
            </span>
          </div>
          <div className="hidden md:block w-px h-6 bg-[#d1d5db]"></div>
          <div className="flex items-center gap-2">
            <Factory className="w-5 h-5 text-[#cc181e]" />
            <span className="text-xs sm:text-sm font-semibold text-[#222222]">
              <strong className="text-[#cc181e] font-bold">Peenya Factory</strong> Direct Sourcing &amp; CAD Dies
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
