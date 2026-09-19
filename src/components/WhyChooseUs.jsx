import {
  Sparkles,
  Ruler,
  Hammer,
  MapPin,
  Truck,
  CreditCard,
  Users,
  ArrowRight
} from "lucide-react";
import { TRUST_POINTS } from "../data/furnitureData";
export const WhyChooseUs = ({ onOpenQuote }) => {
  const iconMap = {
    t1: <Sparkles className="w-5 h-5 text-[#8C6239] dark:text-[#C5A880]" />,
    t2: <Ruler className="w-5 h-5 text-[#8C6239] dark:text-[#C5A880]" />,
    t3: <Hammer className="w-5 h-5 text-[#8C6239] dark:text-[#C5A880]" />,
    t4: <MapPin className="w-5 h-5 text-[#8C6239] dark:text-[#C5A880]" />,
    t5: <Truck className="w-5 h-5 text-[#8C6239] dark:text-[#C5A880]" />,
    t6: <CreditCard className="w-5 h-5 text-[#8C6239] dark:text-[#C5A880]" />
  };
  return <section id="why-us" className="py-20 lg:py-28 bg-[#132629] dark:bg-[#071011] text-[#FAF8F5] relative overflow-hidden transition-colors duration-300">
      
      {
    /* Subtle architectural grid lines */
  }
      <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06] pointer-events-none bg-[linear-gradient(to_right,#C5A880_1px,transparent_1px),linear-gradient(to_bottom,#C5A880_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {
    /* Header */
  }
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] font-semibold text-[#C5A880] mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              The Heaven Difference
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight">
              Why Discerning Homeowners <br className="hidden sm:inline" />
              <span className="italic text-[#C5A880]">Choose Heaven Furniture Mart</span>
            </h2>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-3 bg-[#1B3236] dark:bg-[#122022] px-4 py-3 border border-[#C5A880]/20">
            <Users className="w-5 h-5 text-[#C5A880]" />
            <span className="text-xs text-[#FAF8F5]/80">
              Trusted by <strong>hundreds of homeowners</strong> across Chattogram
            </span>
          </div>
        </div>

        {
    /* 6 Trust Points with Card Hover Lift */
  }
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TRUST_POINTS.map((point) => <div
    key={point.id}
    className="bg-[#1B3236]/70 dark:bg-[#122022] p-6 sm:p-7 border border-[#C5A880]/15 dark:border-[#C5A880]/20 hover:border-[#C5A880]/50 transition-all duration-300 flex flex-col justify-between group card-hover shadow-lg"
  >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-[#132629] dark:bg-[#0B1617] border border-[#C5A880]/30 flex items-center justify-center">
                    {iconMap[point.id] || <Sparkles className="w-5 h-5 text-[#8C6239] dark:text-[#C5A880]" />}
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#C5A880] bg-[#132629] dark:bg-[#0B1617] px-2.5 py-1 border border-[#C5A880]/20">
                    {point.tag}
                  </span>
                </div>

                <h3 className="font-serif text-xl font-medium text-[#FAF8F5] mb-2 group-hover:text-[#C5A880] transition-colors">
                  {point.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#FAF8F5]/70 leading-relaxed font-light">
                  {point.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#C5A880]/10 flex items-center text-[11px] text-[#C5A880] font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                <span>Heaven Standard</span>
                <span className="mx-2">·</span>
                <span className="text-[#FAF8F5]/60">Chittagong Atelier</span>
              </div>
            </div>)}
        </div>

        {
    /* Fast Action Ribbon */
  }
        <div className="mt-12 text-center pt-8 border-t border-[#C5A880]/20 flex flex-col sm:flex-row items-center justify-center gap-6">
          <p className="text-sm text-[#FAF8F5]/80 font-light">
            Ready to experience genuine bespoke craftsmanship in your home?
          </p>
          <button
    onClick={onOpenQuote}
    className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#C5A880] hover:bg-[#D4B78F] text-[#132629] text-xs font-semibold uppercase tracking-wider transition-all shadow btn-luxury"
  >
            <span>Book Your Free Consultation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>;
};
