import { Phone, Mail, MapPin, ArrowUp, Facebook, Instagram, Youtube } from "lucide-react";
export const Footer = ({ onOpenQuote }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return <footer className="bg-[#0B1719] dark:bg-[#050B0C] text-[#FAF8F5] pt-16 pb-12 border-t border-[#C5A880]/25 relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {
    /* Top Grid */
  }
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-16 border-b border-stone-800">
          
          {
    /* Brand Column */
  }
          <div className="lg:col-span-4 space-y-4">
            <div className="flex flex-col">
              <span className="font-serif text-3xl font-bold tracking-wider text-[#FAF8F5]">
                HEAVEN
              </span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] font-semibold mt-0.5">
                Furniture Mart · Chattogram
              </span>
            </div>
            
            <p className="text-xs text-stone-400 max-w-sm leading-relaxed font-light">
              Chattogram's premier bespoke luxury furniture and interior styling studio. 
              Custom sofas, beds, dining sets, and corporate millwork handcrafted in seasoned 
              hardwoods to match your home’s architectural vision.
            </p>

            <div className="text-[11px] text-[#C5A880] tracking-widest uppercase font-semibold">
              Designed · Crafted · Customized
            </div>

            {
    /* Social Links */
  }
            <div className="flex items-center gap-3 pt-2">
              <a
    href="https://facebook.com/HeavenFurnitureMart"
    target="_blank"
    rel="noopener noreferrer"
    className="w-9 h-9 bg-stone-900 hover:bg-[#C5A880] hover:text-[#132629] text-stone-300 rounded-none border border-stone-800 flex items-center justify-center transition-colors"
    aria-label="Heaven Furniture Mart on Facebook"
  >
                <Facebook className="w-4 h-4" />
              </a>

              <a
    href="https://instagram.com/heaven_furniture_ltd"
    target="_blank"
    rel="noopener noreferrer"
    className="w-9 h-9 bg-stone-900 hover:bg-[#C5A880] hover:text-[#132629] text-stone-300 rounded-none border border-stone-800 flex items-center justify-center transition-colors"
    aria-label="Heaven Furniture Mart on Instagram"
  >
                <Instagram className="w-4 h-4" />
              </a>

              <a
    href="https://youtube.com/@HeavenFurnitureMart"
    target="_blank"
    rel="noopener noreferrer"
    className="w-9 h-9 bg-stone-900 hover:bg-[#C5A880] hover:text-[#132629] text-stone-300 rounded-none border border-stone-800 flex items-center justify-center transition-colors"
    aria-label="Heaven Furniture Mart on YouTube"
  >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {
    /* Quick Navigation Links */
  }
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A880]">
              Atelier
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <a href="#featured-slider" className="hover:text-white transition-colors">Featured Showcase</a>
              </li>
              <li>
                <a href="#collections" className="hover:text-white transition-colors">Collections</a>
              </li>
              <li>
                <a href="#bespoke" className="hover:text-white transition-colors">Bespoke Atelier</a>
              </li>
              <li>
                <a href="#why-us" className="hover:text-white transition-colors">Why Choose Us</a>
              </li>
              <li>
                <a href="#story" className="hover:text-white transition-colors">Founder's Message</a>
              </li>
              <li>
                <a href="#showroom" className="hover:text-white transition-colors">Agrabad Showroom</a>
              </li>
            </ul>
          </div>

          {
    /* Furniture Categories */
  }
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A880]">
              Categories
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>Living Room Ensembles</li>
              <li>Master Bedroom Suites</li>
              <li>Solid Teak Dining</li>
              <li>Executive Office & Study</li>
              <li>Full-Home Millwork</li>
            </ul>
          </div>

          {
    /* Contact & Studio Details */
  }
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A880]">
              Agrabad Showroom
            </h4>
            <div className="space-y-2.5 text-xs text-stone-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                <span>Agrabad Access Road, Chattogram, Bangladesh</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C5A880] shrink-0" />
                <a href="tel:+8801960481983" className="hover:text-white transition-colors">
                  +880 1960-481983
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C5A880] shrink-0" />
                <a href="mailto:heavenfurnituremart@gmail.com" className="hover:text-white transition-colors">
                  heavenfurnituremart@gmail.com
                </a>
              </div>
            </div>

            <div className="pt-2">
              <button
    onClick={onOpenQuote}
    className="w-full py-2.5 px-4 bg-[#1B3236] dark:bg-[#122022] hover:bg-[#C5A880] hover:text-[#132629] text-[#FAF8F5] text-xs font-semibold uppercase tracking-wider border border-[#C5A880]/30 transition-all text-center btn-luxury"
  >
                Request Custom Consultation
              </button>
            </div>
          </div>

        </div>

        {
    /* Bottom Bar */
  }
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 gap-4">
          <div>
            © {(/* @__PURE__ */ new Date()).getFullYear()} Heaven Furniture Mart. Founded in 2020 by Abul Kalam Bhuiyan. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <span className="text-stone-400">Agrabad, Chattogram, Bangladesh</span>
            <button
    onClick={scrollToTop}
    className="flex items-center gap-1 hover:text-[#C5A880] transition-colors"
    aria-label="Scroll back to top"
  >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>;
};
