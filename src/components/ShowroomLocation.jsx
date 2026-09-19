import { MapPin, Phone, Mail, Clock, MessageCircle, ArrowRight, Check } from "lucide-react";
export const ShowroomLocation = ({ onOpenQuote }) => {
  return <section id="showroom" className="py-20 lg:py-28 bg-[#132629] dark:bg-[#081213] text-[#FAF8F5] relative overflow-hidden transition-colors duration-300">
      
      {
    /* Subtle Background Glow */
  }
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C5A880]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {
    /* Section Headline */
  }
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#C5A880] block mb-3">
            Visit Our Flagship Studio
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight">
            Experience the Wood, Joinery & Finishes <br />
            <span className="italic text-[#C5A880]">in Person at Agrabad</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#FAF8F5]/75 font-light">
            Feel the natural grain of seasoned Chittagong Teak, test sofa cushion densities, 
            and browse our extensive textile and marble swatch library.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {
    /* Left Column: Direct Studio Information & One Clear Action */
  }
          <div className="lg:col-span-6 bg-[#1B3236] dark:bg-[#122022] p-8 sm:p-10 border border-[#C5A880]/30 flex flex-col justify-between shadow-xl">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#132629] dark:bg-[#091415] text-[#C5A880] text-xs uppercase tracking-wider font-semibold border border-[#C5A880]/20 mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Showroom Welcoming Visitors</span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl text-[#FAF8F5] mb-6">
                Heaven Furniture Mart
              </h3>

              <div className="space-y-4 text-sm text-[#FAF8F5]/85">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#C5A880] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white">Physical Address:</strong>
                    <span>Agrabad Access Road, Chattogram, Bangladesh</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#C5A880] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white">Phone / Direct Line:</strong>
                    <a href="tel:+8801960481983" className="hover:text-[#C5A880] transition-colors">
                      +880 1960-481983
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#C5A880] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white">Direct Email:</strong>
                    <a href="mailto:heavenfurnituremart@gmail.com" className="hover:text-[#C5A880] transition-colors">
                      heavenfurnituremart@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#C5A880] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white">Studio Working Hours:</strong>
                    <span>Saturday – Thursday: 10:00 AM – 9:00 PM</span>
                    <span className="block text-xs text-stone-400 mt-0.5">Friday: 3:00 PM – 9:00 PM</span>
                  </div>
                </div>
              </div>

              {
    /* Trust Points */
  }
              <div className="mt-8 pt-6 border-t border-[#C5A880]/20 grid grid-cols-2 gap-3 text-xs text-[#FAF8F5]/80">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#C5A880]" />
                  <span>Free Studio Parking</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#C5A880]" />
                  <span>In-House Designers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#C5A880]" />
                  <span>Material Swatch Books</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#C5A880]" />
                  <span>Delivery Across BD</span>
                </div>
              </div>
            </div>

            {
    /* The Unified Primary CTA */
  }
            <div className="mt-10 pt-6 border-t border-[#C5A880]/30 space-y-3">
              <button
    id="showroom-book-consult-btn"
    onClick={onOpenQuote}
    className="w-full py-4 px-6 bg-[#C5A880] hover:bg-[#D4B78F] text-[#132629] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all btn-luxury"
  >
                <span>Book Free Showroom Consultation</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
    href="https://wa.me/8801960481983?text=Hello%20Heaven%20Furniture%20Mart,%20I%20would%20like%20to%20visit%20your%20Agrabad%20showroom."
    target="_blank"
    rel="noopener noreferrer"
    className="w-full py-3 px-6 bg-[#132629] dark:bg-[#0E1A1C] hover:bg-[#0f1f22] text-[#FAF8F5] text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 border border-[#C5A880]/30 transition-colors btn-luxury"
  >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Message on WhatsApp (+880 1960-481983)</span>
              </a>
            </div>

          </div>

          {
    /* Right Column: Architectural Photography of the Agrabad Showroom & Interactive Visit Planner */
  }
          <div className="lg:col-span-6 flex flex-col justify-between gap-6">
            
            <div className="relative aspect-[16/10] overflow-hidden bg-stone-900 border border-[#C5A880]/30 shadow-xl">
              <img
    src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=75"
    alt="Heaven Furniture Mart luxury showroom display at Agrabad Access Road Chattogram"
    loading="lazy"
    decoding="async"
    className="w-full h-full object-cover"
    referrerPolicy="no-referrer"
  />
              <div className="absolute inset-0 bg-gradient-to-t from-[#132629]/90 via-[#132629]/20 to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A880]">
                  Agrabad Access Road
                </span>
                <h4 className="font-serif text-2xl text-white mt-0.5">
                  The Flagship Interior & Furniture Studio
                </h4>
                <p className="text-xs text-stone-300 mt-1 max-w-md font-light">
                  Browse over 10,000 sq. ft. of styled living rooms, master bedrooms, executive suites, and dining settings.
                </p>
              </div>
            </div>

            {
    /* Location Guidance Card */
  }
            <div className="bg-[#1B3236] dark:bg-[#122022] p-6 border border-[#C5A880]/20 flex flex-col sm:flex-row items-center justify-between gap-4 card-hover shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#132629] dark:bg-[#0E1A1C] flex items-center justify-center text-[#C5A880] shrink-0 border border-[#C5A880]/30">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">
                    Need Directions in Chattogram?
                  </div>
                  <div className="text-xs text-[#FAF8F5]/70">
                    Located centrally on Agrabad Access Road with effortless road access.
                  </div>
                </div>
              </div>

              <a
    href="https://www.google.com/maps/search/Agrabad+Access+Road+Chattogram"
    target="_blank"
    rel="noopener noreferrer"
    className="px-4 py-2 bg-[#132629] dark:bg-[#0E1A1C] hover:bg-black text-xs font-semibold uppercase tracking-wider text-[#C5A880] border border-[#C5A880]/40 whitespace-nowrap transition-colors btn-luxury"
  >
                Open in Google Maps
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>;
};
