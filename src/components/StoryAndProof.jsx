import { Quote, Award, CheckCircle, Star, Building2 } from "lucide-react";
import { MILESTONES, TESTIMONIALS } from "../data/furnitureData";
export const StoryAndProof = () => {
  return <section id="story" className="py-20 lg:py-28 bg-[#FAF8F5] dark:bg-[#0B1617] text-[#2C221E] dark:text-[#F2EFE9] relative border-t border-stone-200 dark:border-stone-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {
    /* Spotlight MD Quote Section */
  }
        <div className="bg-gradient-to-br from-[#132629] to-[#1B3236] dark:from-[#0E1B1D] dark:to-[#142629] text-[#FAF8F5] p-8 sm:p-12 lg:p-16 border border-[#C5A880]/30 shadow-2xl relative overflow-hidden mb-20">
          
          {
    /* Decorative watermark quote mark */
  }
          <Quote className="absolute -bottom-6 -right-6 w-48 h-48 text-[#C5A880]/10 pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            
            {
    /* Showroom & MD Context Photo */
  }
            <div className="lg:col-span-4">
              <div className="relative aspect-[3/4] overflow-hidden border-2 border-[#C5A880]/40 shadow-lg bg-stone-900">
                <img
    src="https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=700&q=75"
    alt="Heaven Furniture Mart craftsman inspecting seasoned timber at Agrabad workshop"
    loading="lazy"
    decoding="async"
    className="w-full h-full object-cover"
    referrerPolicy="no-referrer"
  />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="text-[10px] uppercase font-bold tracking-widest text-[#C5A880]">
                    Agrabad Atelier · Chattogram
                  </div>
                  <div className="font-serif text-sm text-[#FAF8F5]">
                    Master Artisans & Timber Seasoning
                  </div>
                </div>
              </div>
            </div>

            {
    /* Managing Director Statement */
  }
            <div className="lg:col-span-8 flex flex-col justify-center space-y-6">
              
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] font-semibold text-[#C5A880]">
                <Quote className="w-4 h-4" />
                <span>The Founder's Commitment</span>
              </div>

              <blockquote className="font-serif text-2xl sm:text-3xl lg:text-3.5xl text-[#FAF8F5] font-light leading-snug italic">
                “At Heaven Furniture Mart, we believe furniture is more than just function; 
                it is a reflection of lifestyle, taste, and comfort. Every piece we create is designed 
                to bring lasting elegance into the homes of our clients.”
              </blockquote>

              <div className="pt-4 border-t border-[#C5A880]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="font-serif text-xl font-bold text-[#FAF8F5]">
                    Abul Kalam Bhuiyan
                  </div>
                  <div className="text-xs uppercase tracking-wider text-[#C5A880] mt-0.5">
                    Managing Director & Founder · Heaven Furniture Mart
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-stone-300">
                  <Building2 className="w-4 h-4 text-[#C5A880]" />
                  <span>Agrabad Access Road, Chattogram</span>
                </div>
              </div>

            </div>

          </div>
        </div>

        {
    /* Milestones Timeline */
  }
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] font-semibold text-[#8C6239] dark:text-[#D4B78F] mb-2">
              <Award className="w-3.5 h-3.5" />
              <span>Legacy & Recognition</span>
            </div>
            <h3 className="font-serif text-3xl sm:text-4xl text-[#132629] dark:text-[#FAF8F5] font-normal">
              A Proven Journey of Craftsmanship
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-2">
              From our first workshop in 2020 to nationwide recognition in 2026.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 relative">
            {MILESTONES.map((m, idx) => <div
    key={m.year}
    className="bg-white dark:bg-[#122022] p-5 border border-stone-200/90 dark:border-stone-800 shadow-sm relative flex flex-col justify-between hover:border-[#C5A880] dark:hover:border-[#C5A880]/50 transition-colors card-hover"
  >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-serif text-2xl font-bold text-[#132629] dark:text-[#FAF8F5]">
                      {m.year}
                    </span>
                    <span className="w-6 h-6 rounded-full bg-[#132629]/5 dark:bg-[#C5A880]/15 text-[#8C6239] dark:text-[#C5A880] flex items-center justify-center text-xs font-bold">
                      0{idx + 1}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-[#132629] dark:text-[#FAF8F5] mb-2 leading-snug">
                    {m.title}
                  </h4>
                  <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-light">
                    {m.description}
                  </p>
                </div>

                <div className="pt-3 mt-4 border-t border-stone-100 dark:border-stone-800 flex items-center gap-1.5 text-[10px] text-[#8C6239] dark:text-[#C5A880] font-semibold uppercase tracking-wider">
                  <CheckCircle className="w-3 h-3" />
                  <span>Verified Milestone</span>
                </div>
              </div>)}
          </div>
        </div>

        {
    /* Testimonials from Chattogram Homeowners */
  }
        <div>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1 text-amber-500 mb-2">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
            </div>
            <h3 className="font-serif text-3xl sm:text-4xl text-[#132629] dark:text-[#FAF8F5] font-normal">
              Words from Chattogram Residences
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1">
              Real feedback from homeowners who trusted Heaven for their personal living spaces.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => <div
    key={t.id}
    className="bg-white dark:bg-[#122022] p-7 border border-stone-200/80 dark:border-stone-800 shadow-sm flex flex-col justify-between card-hover"
  >
                <div>
                  <div className="flex items-center gap-1 text-amber-500 mb-3">
                    {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
                  </div>

                  <p className="text-xs sm:text-sm text-[#2C221E]/80 dark:text-[#FAF8F5]/80 leading-relaxed italic mb-6">
                    “{t.quote}”
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-100 dark:border-stone-800">
                  <div className="font-serif font-semibold text-[#132629] dark:text-[#FAF8F5] text-base">
                    {t.clientName}
                  </div>
                  <div className="text-xs text-[#8C6239] dark:text-[#C5A880] font-medium">
                    {t.location}
                  </div>
                  <div className="text-[11px] text-stone-400 dark:text-stone-500 mt-0.5">
                    Commission: {t.projectType}
                  </div>
                </div>
              </div>)}
          </div>
        </div>

      </div>
    </section>;
};
