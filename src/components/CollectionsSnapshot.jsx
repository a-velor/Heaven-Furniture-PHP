import { useState, useEffect } from "react";
import { Sparkles, ArrowRight, Eye, Check, X, ShieldCheck, Share2, ShoppingBag, Heart } from "lucide-react";
import { useEcommerce } from "../context/EcommerceContext";
import { SocialShareModal } from "./SocialShareModal";
export const CollectionsSnapshot = ({ onOpenQuote }) => {
  const {
    products,
    formatPrice,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setSelectedProduct,
    setActiveView
  } = useEcommerce();
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemToShare, setItemToShare] = useState(null);
  const categories = [
    { id: "all", label: "All Commissions" },
    { id: "living", label: "Living Room" },
    { id: "bedroom", label: "Bedroom" },
    { id: "dining", label: "Dining" },
    { id: "office", label: "Office & Study" },
    { id: "bespoke", label: "Bespoke / Custom" }
  ];
  const filteredItems = activeCategory === "all" ? products : products.filter((item) => item.category === activeCategory);
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && selectedItem) {
        setSelectedItem(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedItem]);
  return <section id="collections" className="py-20 lg:py-28 bg-[#FAF8F5] dark:bg-[#0B1617] text-[#2C221E] dark:text-[#F2EFE9] relative border-t border-stone-200/60 dark:border-stone-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {
    /* Editorial Section Header */
  }
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] font-semibold text-[#8C6239] dark:text-[#D4B78F] mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Curated Atelier Commissions
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#132629] dark:text-[#FAF8F5] font-normal leading-tight">
              Collections Snapshot
            </h2>
          </div>
          <p className="mt-4 md:mt-0 text-sm text-[#2C221E]/75 dark:text-[#FAF8F5]/70 max-w-md font-light">
            Every piece displayed is crafted to order. We customize timber species, textile textures, 
            and millimeter dimensions for your individual home.
          </p>
        </div>

        {
    /* Minimalist Category Tabs */
  }
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar border-b border-stone-200 dark:border-stone-800">
          {categories.map((cat) => <button
    key={cat.id}
    onClick={() => setActiveCategory(cat.id)}
    className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold whitespace-nowrap transition-all border-b-2 -mb-[1px] ${activeCategory === cat.id ? "border-[#132629] dark:border-[#C5A880] text-[#132629] dark:text-[#FAF8F5]" : "border-transparent text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200"}`}
  >
              {cat.label}
            </button>)}
        </div>

        {
    /* Gallery Grid with lazy loaded images and hover lift */
  }
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => <div
    key={item.id}
    className="group bg-white dark:bg-[#122022] border border-stone-200/90 dark:border-stone-800 shadow-sm hover:shadow-xl dark:hover:border-[#C5A880]/30 transition-all duration-300 flex flex-col justify-between overflow-hidden card-hover"
  >
              <div>
                {
    /* Image Container with Editorial Aspect Ratio */
  }
                <div className="relative aspect-[4/3] overflow-hidden bg-stone-100 dark:bg-stone-900">
                  <img
    src={item.image}
    alt={item.name}
    loading="lazy"
    decoding="async"
    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
    referrerPolicy="no-referrer"
  />
                  
                  {
    /* Category & Custom Pill */
  }
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-2.5 py-1 bg-[#132629]/90 dark:bg-[#0B1617]/90 backdrop-blur-sm text-[#FAF8F5] text-[10px] uppercase font-bold tracking-widest border border-white/10">
                      {item.categoryLabel}
                    </span>
                    {item.highlightTag && <span className="px-2 py-1 bg-[#C5A880] text-[#132629] text-[10px] uppercase font-bold tracking-wider">
                        {item.highlightTag}
                      </span>}
                  </div>

                  {
    /* Quick Inspect Button Overlay */
  }
                  <button
    onClick={() => setSelectedItem(item)}
    className="absolute inset-0 bg-[#132629]/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-semibold uppercase tracking-wider backdrop-blur-[2px]"
  >
                    <Eye className="w-4 h-4 text-[#C5A880]" />
                    <span>Inspect Specifications</span>
                  </button>
                </div>

                {
    /* Content Details */
  }
                <div className="p-6">
                  <div className="text-[11px] uppercase tracking-wider text-[#8C6239] dark:text-[#D4B78F] font-semibold mb-1">
                    {item.woodType}
                  </div>
                  <h3 className="font-serif text-xl font-medium text-[#132629] dark:text-[#FAF8F5] mb-2 leading-snug">
                    {item.name}
                  </h3>
                  <p className="text-xs text-[#2C221E]/70 dark:text-[#FAF8F5]/70 line-clamp-2 mb-4 leading-relaxed font-light">
                    {item.description}
                  </p>

                  {
    /* Material Pills */
  }
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {item.materials.slice(0, 2).map((m, i) => <span
    key={i}
    className="px-2 py-0.5 bg-[#FAF8F5] dark:bg-[#182a2d] border border-stone-200 dark:border-stone-700/60 text-stone-600 dark:text-stone-300 text-[10px]"
  >
                        {m}
                      </span>)}
                  </div>
                </div>
              </div>

              {
    /* Price & Stock Display */
  }
              <div className="px-6 py-2 bg-stone-50/50 dark:bg-stone-900/40 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                <div>
                  <span className="font-serif text-base font-bold text-[#8C6239] dark:text-[#C5A880]">
                    {formatPrice(item.price)}
                  </span>
                  {item.originalPrice && item.originalPrice > item.price && <span className="text-[10px] line-through text-stone-400 ml-1.5">
                      {formatPrice(item.originalPrice)}
                    </span>}
                </div>
                <span className="text-[11px] text-stone-500 font-medium">
                  {item.stock} in Atelier
                </span>
              </div>

              {
    /* Bottom Card Actions */
  }
              <div className="px-6 pb-5 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-2">
                <button
    onClick={() => addToCart(item, 1)}
    className="flex-1 py-2 px-3 bg-[#132629] dark:bg-[#C5A880] text-white dark:text-[#0B1617] text-[11px] font-semibold uppercase tracking-wider rounded flex items-center justify-center gap-1.5 hover:brightness-110 transition-all shadow-xs"
  >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add to Bag</span>
                </button>

                <button
    onClick={() => setSelectedProduct(item)}
    className="p-2 border border-stone-200 dark:border-stone-700 rounded text-stone-600 dark:text-stone-300 hover:text-[#8C6239] transition-colors"
    title="Inspect Custom Finishes"
  >
                  <Eye className="w-3.5 h-3.5" />
                </button>

                <button
    onClick={() => toggleWishlist(item.id)}
    className="p-2 border border-stone-200 dark:border-stone-700 rounded text-stone-600 dark:text-stone-300 hover:text-rose-500 transition-colors"
    title="Wishlist"
  >
                  <Heart className={`w-3.5 h-3.5 ${isInWishlist(item.id) ? "fill-rose-500 text-rose-500" : ""}`} />
                </button>
              </div>
            </div>)}
        </div>

        {
    /* Banner: Custom Blueprint Commission */
  }
        <div className="mt-16 bg-[#132629] dark:bg-[#122022] text-[#FAF8F5] p-8 sm:p-10 border border-[#C5A880]/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="max-w-xl">
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#C5A880] block mb-2">
              Have an Architect's Drawing or Floor Plan?
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-normal leading-snug">
              Every home has a unique soul. We build any design to your exact taste.
            </h3>
          </div>
          <button
    onClick={() => onOpenQuote("Custom Architectural Blueprint")}
    className="px-6 py-3.5 bg-[#C5A880] hover:bg-[#D4B78F] text-[#132629] text-xs font-semibold uppercase tracking-wider whitespace-nowrap shadow transition-colors btn-luxury"
  >
            Submit Custom Requirements
          </button>
        </div>

      </div>

      {
    /* Item Detail Modal */
  }
      {selectedItem && <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
    role="dialog"
    aria-modal="true"
    aria-label={selectedItem.name}
  >
          <div className="bg-[#FAF8F5] dark:bg-[#122022] text-[#2C221E] dark:text-[#F2EFE9] max-w-2xl w-full border border-[#C5A880]/40 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            {
    /* Close Button */
  }
            <button
    onClick={() => setSelectedItem(null)}
    className="absolute top-4 right-4 z-10 p-2 bg-white/80 dark:bg-stone-800/80 hover:bg-white dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 rounded-full shadow"
    aria-label="Close dialog"
  >
              <X className="w-5 h-5" />
            </button>

            {
    /* Modal Image */
  }
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-stone-200 dark:bg-stone-800">
              <img
    src={selectedItem.image}
    alt={selectedItem.name}
    className="w-full h-full object-cover"
    loading="lazy"
    decoding="async"
    referrerPolicy="no-referrer"
  />
              <div className="absolute bottom-3 left-4 px-3 py-1 bg-[#132629]/90 text-[#C5A880] text-xs font-semibold uppercase tracking-wider">
                {selectedItem.categoryLabel}
              </div>
            </div>

            {
    /* Modal Body */
  }
            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-[#8C6239] dark:text-[#D4B78F]">
                  Hardwood: {selectedItem.woodType}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#132629] dark:text-[#FAF8F5] mt-1">
                  {selectedItem.name}
                </h3>
                <p className="text-sm text-[#2C221E]/80 dark:text-[#FAF8F5]/80 mt-3 leading-relaxed font-light">
                  {selectedItem.description}
                </p>
              </div>

              {
    /* Specifications Box */
  }
              <div className="bg-white dark:bg-[#182A2D] p-4 border border-stone-200 dark:border-stone-700 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-stone-100 dark:border-stone-700/60">
                  <span className="text-stone-500 dark:text-stone-400">Dimensions:</span>
                  <span className="font-semibold text-stone-900 dark:text-stone-100">{selectedItem.dimensions}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-100 dark:border-stone-700/60">
                  <span className="text-stone-500 dark:text-stone-400">Selected Materials:</span>
                  <span className="font-semibold text-stone-900 dark:text-stone-100">{selectedItem.materials.join(", ")}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-stone-500 dark:text-stone-400">Customization:</span>
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    100% Tailored to Your Dimensions
                  </span>
                </div>
              </div>

              {
    /* Handcrafted Features */
  }
              <div>
                <h4 className="text-xs uppercase tracking-wider font-semibold text-[#132629] dark:text-[#FAF8F5] mb-3">
                  Atelier Highlights & Quality Guarantee
                </h4>
                <div className="space-y-2">
                  {selectedItem.features.map((f, i) => <div key={i} className="flex items-start gap-2 text-xs text-stone-700 dark:text-stone-300">
                      <Check className="w-4 h-4 text-[#8C6239] dark:text-[#C5A880] shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>)}
                </div>
              </div>

              {
    /* Action Buttons */
  }
              <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row gap-3">
                <button
    onClick={() => {
      const item = selectedItem;
      setSelectedItem(null);
      onOpenQuote(item.name);
    }}
    className="flex-1 py-3.5 px-6 bg-[#132629] dark:bg-[#C5A880] hover:bg-[#1B3236] dark:hover:bg-[#D4B78F] text-[#FAF8F5] dark:text-[#132629] text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 btn-luxury"
  >
                  <span>Inquire for Custom Quote</span>
                  <ArrowRight className="w-4 h-4 text-[#C5A880] dark:text-[#132629]" />
                </button>
                <a
    href={`https://wa.me/8801960481983?text=${encodeURIComponent(`Hello Heaven Furniture Mart, I am interested in inquiring about ${selectedItem.name} (${selectedItem.woodType}). Could you share custom options?`)}`}
    target="_blank"
    rel="noopener noreferrer"
    className="py-3.5 px-6 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 text-center"
  >
                  <span>Chat on WhatsApp</span>
                </a>
                <button
    onClick={() => {
      setItemToShare(selectedItem);
    }}
    className="py-3.5 px-4 bg-stone-100 dark:bg-[#182A2D] hover:bg-stone-200 dark:hover:bg-[#20373b] border border-stone-300 dark:border-stone-700 text-[#132629] dark:text-[#FAF8F5] text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2"
    title="Share Open Graph card preview"
  >
                  <Share2 className="w-4 h-4 text-[#8C6239] dark:text-[#C5A880]" />
                  <span>Share</span>
                </button>
              </div>

            </div>

          </div>
        </div>}

      {
    /* Social Share / Dynamic Open Graph Preview Modal */
  }
      {itemToShare && <SocialShareModal
    isOpen={Boolean(itemToShare)}
    onClose={() => setItemToShare(null)}
    title={itemToShare.name}
    category={itemToShare.categoryLabel}
    woodType={itemToShare.woodType}
    imageUrl={itemToShare.image}
    description={itemToShare.description}
  />}

    </section>;
};
