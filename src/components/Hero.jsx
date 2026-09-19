import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { ArrowRight, MessageCircle, Sparkles, MapPin, CheckCircle2 } from "lucide-react";
export const Hero = ({ onOpenQuote }) => {
  const heroRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const yBg = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : 80]);
  const yText = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : -30]);
  const yPhoto = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : 45]);
  const yBadge1 = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : -50]);
  const yBadge2 = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : 60]);
  const opacityFade = useTransform(scrollYProgress, [0, 0.9], [1, 0.4]);
  return <section
    ref={heroRef}
    id="hero-section"
    className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden bg-[#FAF8F5] dark:bg-[#0B1617] text-[#2C221E] dark:text-[#F2EFE9] transition-colors duration-300"
  >
      {
    /* Parallax architectural background texture accent */
  }
      <motion.div
    style={{ y: yBg }}
    className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06] pointer-events-none bg-[radial-gradient(#132629_1px,transparent_1px)] dark:bg-[radial-gradient(#C5A880_1px,transparent_1px)] [background-size:24px_24px]"
  />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {
    /* Left Column: Editorial Headline & Pitch with subtle parallax elevation */
  }
          <motion.div
    style={{ y: yText, opacity: opacityFade }}
    className="lg:col-span-7 flex flex-col items-start z-10"
  >
            
            {
    /* Studio Badge */
  }
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-[#132629]/5 dark:bg-[#C5A880]/10 border border-[#C5A880]/40 rounded-full mb-6 text-[#132629] dark:text-[#FAF8F5]">
              <Sparkles className="w-3.5 h-3.5 text-[#8C6239] dark:text-[#C5A880]" />
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#8C6239] dark:text-[#D4B78F]">
                Agrabad Studio · Chattogram
              </span>
            </div>

            {
    /* Main Luxury Headline */
  }
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl xl:text-[4.25rem] text-[#132629] dark:text-[#FAF8F5] leading-[1.08] font-normal tracking-tight mb-6">
              Furniture, Crafted <br className="hidden sm:inline" />
              <span className="italic font-light text-[#8C6239] dark:text-[#C5A880]">Around You.</span>
            </h1>

            {
    /* Core Brand Proposition */
  }
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-[#132629] dark:text-[#FAF8F5] pb-1 border-b border-[#C5A880]">
                Designed
              </span>
              <span className="text-[#C5A880] text-sm">✦</span>
              <span className="text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-[#132629] dark:text-[#FAF8F5] pb-1 border-b border-[#C5A880]">
                Crafted
              </span>
              <span className="text-[#C5A880] text-sm">✦</span>
              <span className="text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-[#132629] dark:text-[#FAF8F5] pb-1 border-b border-[#C5A880]">
                Customized
              </span>
            </div>

            {
    /* Brand Intro Narrative */
  }
            <p className="text-base sm:text-lg text-[#2C221E]/80 dark:text-[#FAF8F5]/80 max-w-2xl leading-relaxed mb-8 font-light">
              Welcome to Chattogram’s premier bespoke furniture and interior styling studio. 
              We do not pull pieces off a warehouse shelf; each sofa, bed, and dining ensemble is 
              hand-built in seasoned Chittagong Teak and tailored to your room’s exact architectural proportions.
            </p>

            {
    /* Primary Calls to Action with Interactive Hover Animations */
  }
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-10">
              <button
    id="hero-request-quote-btn"
    onClick={onOpenQuote}
    className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#132629] dark:bg-[#C5A880] hover:bg-[#1B3236] dark:hover:bg-[#D4B78F] text-[#FAF8F5] dark:text-[#132629] text-sm font-semibold uppercase tracking-wider shadow-md hover:shadow-xl btn-luxury group"
  >
                <span>Book Free Design Consultation</span>
                <ArrowRight className="w-4 h-4 text-[#C5A880] dark:text-[#132629] group-hover:translate-x-1 transition-transform" />
              </button>

              <a
    id="hero-whatsapp-btn"
    href="https://wa.me/8801960481983?text=Hello%20Heaven%20Furniture%20Mart,%20I%20would%20like%20to%20inquire%20about%20a%20bespoke%20furniture%20piece."
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center justify-center gap-2.5 px-6 py-4 bg-[#FAF8F5] dark:bg-[#162528] hover:bg-stone-100 dark:hover:bg-[#1f3336] text-[#132629] dark:text-[#FAF8F5] border border-[#132629]/20 dark:border-[#C5A880]/30 text-sm font-medium tracking-wide transition-colors btn-luxury"
  >
                <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>WhatsApp an Artisan</span>
              </a>
            </div>

            {
    /* Trust Badges in Hero */
  }
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-6 pt-6 border-t border-[#C5A880]/30 dark:border-[#C5A880]/20 w-full text-xs text-[#2C221E]/85 dark:text-[#FAF8F5]/85">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#8C6239] dark:text-[#C5A880] shrink-0" />
                <span>Zero Mass Production</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#8C6239] dark:text-[#C5A880] shrink-0" />
                <span>Seasoned Chittagong Teak</span>
              </div>
              <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                <CheckCircle2 className="w-4 h-4 text-[#8C6239] dark:text-[#C5A880] shrink-0" />
                <span>White-Glove Installation</span>
              </div>
            </div>

          </motion.div>

          {
    /* Right Column: High-End Editorial Photography & Atelier Badges with Multi-Layer Parallax */
  }
          <div className="lg:col-span-5 relative mt-4 lg:mt-0">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              
              {
    /* Main Luxury Setting Photo with Parallax Translation */
  }
              <motion.div
    style={{ y: yPhoto }}
    className="relative aspect-[4/5] overflow-hidden bg-stone-200 dark:bg-stone-900 shadow-2xl border-4 border-[#FAF8F5] dark:border-[#1A2E31]"
  >
                <img
    src="https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=1000&q=75"
    alt="Luxury bespoke living room crafted by Heaven Furniture Mart Chattogram"
    loading="eager"
    decoding="sync"
    fetchPriority="high"
    className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700 ease-out"
    referrerPolicy="no-referrer"
  />
                
                {
    /* Subtle vignette gradient */
  }
                <div className="absolute inset-0 bg-gradient-to-t from-[#132629]/80 via-transparent to-transparent pointer-events-none" />

                {
    /* Bottom Photo Caption */
  }
                <div className="absolute bottom-5 left-5 right-5 text-[#FAF8F5]">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#C5A880] font-medium mb-1">
                    Bespoke Commission
                  </p>
                  <p className="font-serif text-lg font-medium leading-snug">
                    The Khulshi Residence · Solid Teak & Raw Belgian Bouclé
                  </p>
                </div>
              </motion.div>

              {
    /* Floating Atelier Card 1: Agrabad Showroom Flagship with Independent Parallax */
  }
              <motion.div
    style={{ y: yBadge1 }}
    className="absolute -top-6 -left-4 sm:-left-8 bg-[#FAF8F5] dark:bg-[#162528] p-4 shadow-xl border border-[#C5A880]/30 max-w-[210px] hidden sm:block z-20 card-hover"
  >
                <div className="flex items-start gap-2.5">
                  <div className="p-2 bg-[#132629] dark:bg-[#0E1A1C] text-[#C5A880] rounded-none">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#8C6239] dark:text-[#C5A880] block">
                      Physical Showroom
                    </span>
                    <p className="text-xs font-serif font-medium text-[#132629] dark:text-[#FAF8F5] leading-tight mt-0.5">
                      Agrabad Access Road, Chattogram
                    </p>
                  </div>
                </div>
              </motion.div>

              {
    /* Floating Card 2: Handcrafted Guarantee with Opposing Parallax */
  }
              <motion.div
    style={{ y: yBadge2 }}
    className="absolute -bottom-6 -right-4 sm:-right-6 bg-[#132629] dark:bg-[#162528] text-[#FAF8F5] p-4 shadow-xl border border-[#C5A880]/30 max-w-[200px] z-20 card-hover"
  >
                <div className="text-center">
                  <span className="block font-serif text-2xl font-bold text-[#C5A880] leading-none">
                    100%
                  </span>
                  <span className="text-[11px] uppercase tracking-wider text-[#FAF8F5]/90 mt-1 block">
                    Custom Dimensions & Hand-Carved Joinery
                  </span>
                </div>
              </motion.div>

            </div>
          </div>

        </div>
      </div>
    </section>;
};
