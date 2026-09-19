import { Compass, ShieldCheck, Hammer, Sparkles, ArrowUpRight } from "lucide-react";
export const BrandIntro = ({ onOpenQuote }) => {
  return <section className="py-20 lg:py-28 bg-[#132629] dark:bg-[#071011] text-[#FAF8F5] relative overflow-hidden transition-colors duration-300">
      {
    /* Decorative Gold Border Line at top */
  }
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#C5A880]/60 to-transparent" />

      {
    /* Background Architectural Watermark */
  }
      <div className="absolute right-0 bottom-0 opacity-5 dark:opacity-10 pointer-events-none select-none">
        <span className="font-serif text-[180px] font-bold leading-none text-[#C5A880]">
          HEAVEN
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {
    /* Editorial Subheading */
  }
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C5A880]/10 border border-[#C5A880]/30 rounded-full text-xs font-semibold uppercase tracking-[0.25em] text-[#C5A880] mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            The Studio Philosophy
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl max-w-3xl leading-[1.2] font-normal">
            Step into an interior studio where furniture is an extension of <span className="italic text-[#C5A880]">your architecture</span>.
          </h2>
          <div className="w-16 h-[1px] bg-[#C5A880] mt-6" />
        </div>

        {
    /* Core Narrative Columns */
  }
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-6 space-y-6 text-[#FAF8F5]/85 font-light text-base sm:text-lg leading-relaxed">
            <p className="border-l-2 border-[#C5A880] pl-5 text-[#FAF8F5] font-normal text-lg sm:text-xl font-serif">
              Heaven Furniture Mart is one of Chattogram's leading bespoke furniture brands. 
              We design and craft custom furniture — sofas, beds, dining sets, office pieces — built around what you actually want, never pulled off a shelf.
            </p>
            <p>
              In our Agrabad atelier, there are no conveyor belts. Each creation begins with an in-depth conversation 
              regarding your living habits, spatial proportions, and material affinities. 
              Whether working with seasoned Chittagong Teak (Segun) or imported Italian velvets, our master artisans craft pieces destined to become family heirlooms.
            </p>
            <p className="text-sm text-[#C5A880] uppercase tracking-wider font-semibold pt-2">
              Chittagong Craftsmanship · Architectural Precision · Zero Compromise
            </p>
          </div>

          <div className="lg:col-span-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="bg-[#1B3236]/90 dark:bg-[#122022] p-6 border border-[#C5A880]/20 hover:border-[#C5A880]/50 transition-colors card-hover shadow-md">
                <Compass className="w-6 h-6 text-[#C5A880] mb-4" />
                <h3 className="font-serif text-lg font-semibold text-[#FAF8F5] mb-2">
                  Space-Tailored Blueprints
                </h3>
                <p className="text-xs text-[#FAF8F5]/70 leading-relaxed font-light">
                  Every dimension is measured to harmonize with your home’s alcoves, ceiling heights, and circulation pathways.
                </p>
              </div>

              <div className="bg-[#1B3236]/90 dark:bg-[#122022] p-6 border border-[#C5A880]/20 hover:border-[#C5A880]/50 transition-colors card-hover shadow-md">
                <Hammer className="w-6 h-6 text-[#C5A880] mb-4" />
                <h3 className="font-serif text-lg font-semibold text-[#FAF8F5] mb-2">
                  Master Joinery
                </h3>
                <p className="text-xs text-[#FAF8F5]/70 leading-relaxed font-light">
                  Traditional mortise-and-tenon structural joints crafted by generational Chattogram artisans with kiln-seasoned hardwoods.
                </p>
              </div>

              <div className="bg-[#1B3236]/90 dark:bg-[#122022] p-6 border border-[#C5A880]/20 hover:border-[#C5A880]/50 transition-colors card-hover shadow-md">
                <ShieldCheck className="w-6 h-6 text-[#C5A880] mb-4" />
                <h3 className="font-serif text-lg font-semibold text-[#FAF8F5] mb-2">
                  Permanent Frame Integrity
                </h3>
                <p className="text-xs text-[#FAF8F5]/70 leading-relaxed font-light">
                  Seasoned against Bangladesh’s humid seasons to ensure zero warping, sagging, or joint separation over decades.
                </p>
              </div>

              <div className="bg-[#8C6239]/20 dark:bg-[#162528] p-6 border border-[#C5A880]/40 flex flex-col justify-between card-hover shadow-md">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A880]">
                    In-Studio Consultation
                  </span>
                  <p className="font-serif text-lg font-medium text-[#FAF8F5] mt-1">
                    Have a room ready for custom styling?
                  </p>
                </div>
                <button
    onClick={onOpenQuote}
    className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C5A880] hover:text-[#FAF8F5] transition-colors mt-4 link-luxury"
  >
                  <span>Talk with our Designer</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>;
};
