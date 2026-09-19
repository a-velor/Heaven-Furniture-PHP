import { useState, useEffect, useRef, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Compass,
  Eye,
  ShoppingBag,
  Heart
} from "lucide-react";
import { useEcommerce } from "../context/EcommerceContext";
export const FeaturedSlider = ({ onOpenQuote }) => {
  const {
    products,
    formatPrice,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setSelectedProduct
  } = useEcommerce();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const sliderRef = useRef(null);
  const autoPlayTimerRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const featuredItems = products.slice(0, 5);
  const totalSlides = featuredItems.length || 1;
  const currentItem = featuredItems[currentIndex] || products[0];
  const slideDuration = 6e3;
  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
    setProgress(0);
  }, [totalSlides]);
  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    setProgress(0);
  }, [totalSlides]);
  const handleSelectSlide = (index) => {
    setCurrentIndex(index);
    setProgress(0);
  };
  useEffect(() => {
    if (!isPlaying) {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
      return;
    }
    const intervalStep = 50;
    const stepIncrement = intervalStep / slideDuration * 100;
    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + stepIncrement;
      });
    }, intervalStep);
    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    };
  }, [isPlaying, handleNext, slideDuration]);
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!sliderRef.current || !sliderRef.current.contains(document.activeElement)) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);
  const minSwipeDistance = 50;
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };
  return <section
    id="featured-slider"
    aria-label="Featured Atelier Masterpieces"
    className="py-20 lg:py-28 bg-[#FAF8F5] dark:bg-[#0B1617] text-[#2C221E] dark:text-[#F2EFE9] relative overflow-hidden transition-colors duration-300"
  >
      {
    /* Subtle architectural background texture */
  }
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-[radial-gradient(#132629_1px,transparent_1px)] dark:bg-[radial-gradient(#C5A880_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {
    /* Header with Slider Controls */
  }
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] font-semibold text-[#8C6239] dark:text-[#D4B78F] mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Interactive Spotlight
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#132629] dark:text-[#FAF8F5] font-normal leading-tight">
              Featured Atelier Masterpieces
            </h2>
          </div>

          <div className="mt-4 md:mt-0 flex items-center gap-4">
            {
    /* Slide Index Counter */
  }
            <div className="font-serif text-sm text-stone-500 dark:text-stone-400 tracking-widest">
              <span className="text-lg font-bold text-[#132629] dark:text-[#C5A880]">
                0{currentIndex + 1}
              </span>{" "}
              / 0{totalSlides}
            </div>

            {
    /* Slider Navigation Buttons */
  }
            <div className="flex items-center gap-2">
              <button
    onClick={handlePrev}
    aria-label="Previous masterpiece slide"
    className="w-10 h-10 border border-[#132629]/20 dark:border-[#C5A880]/30 bg-white dark:bg-[#162528] text-[#132629] dark:text-[#FAF8F5] hover:bg-[#132629] hover:text-[#FAF8F5] dark:hover:bg-[#C5A880] dark:hover:text-[#132629] flex items-center justify-center transition-all btn-luxury"
  >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
    onClick={handleNext}
    aria-label="Next masterpiece slide"
    className="w-10 h-10 border border-[#132629]/20 dark:border-[#C5A880]/30 bg-white dark:bg-[#162528] text-[#132629] dark:text-[#FAF8F5] hover:bg-[#132629] hover:text-[#FAF8F5] dark:hover:bg-[#C5A880] dark:hover:text-[#132629] flex items-center justify-center transition-all btn-luxury"
  >
                <ChevronRight className="w-5 h-5" />
              </button>

              {
    /* Autoplay Pause/Play */
  }
              <button
    onClick={() => setIsPlaying(!isPlaying)}
    aria-label={isPlaying ? "Pause slideshow" : "Resume slideshow"}
    className="w-10 h-10 border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#162528] text-stone-600 dark:text-stone-300 hover:text-[#132629] dark:hover:text-white flex items-center justify-center transition-colors"
    title={isPlaying ? "Pause slideshow" : "Resume slideshow"}
  >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {
    /* The Interactive Slider Stage */
  }
        <div
    ref={sliderRef}
    tabIndex={0}
    onMouseEnter={() => setIsPlaying(false)}
    onMouseLeave={() => setIsPlaying(true)}
    onTouchStart={onTouchStart}
    onTouchMove={onTouchMove}
    onTouchEnd={onTouchEnd}
    className="bg-white dark:bg-[#122022] border border-[#C5A880]/30 dark:border-[#C5A880]/20 shadow-xl overflow-hidden focus:outline-none focus:ring-1 focus:ring-[#C5A880]"
    aria-live="polite"
  >
          {
    /* Autoplay Progress Bar */
  }
          <div className="h-1 w-full bg-stone-100 dark:bg-stone-800 relative">
            <div
    className="h-full bg-gradient-to-r from-[#8C6239] via-[#C5A880] to-[#8C6239] transition-all ease-linear"
    style={{ width: `${progress}%` }}
  />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[460px]">
            
            {
    /* Left: Large High-Resolution Photography */
  }
            <div className="lg:col-span-7 relative overflow-hidden bg-stone-900 group">
              <div className="relative aspect-[16/10] sm:aspect-[16/11] lg:h-full w-full overflow-hidden">
                <img
    src={currentItem.image}
    alt={currentItem.name}
    loading="lazy"
    decoding="async"
    className="w-full h-full object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-105"
    referrerPolicy="no-referrer"
  />

                {
    /* Gradient Vignette for Text Contrast */
  }
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />

                {
    /* Floating Tags */
  }
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-3 py-1 bg-[#132629]/90 text-[#FAF8F5] text-xs uppercase font-bold tracking-widest border border-[#C5A880]/40">
                    {currentItem.categoryLabel}
                  </span>
                  {currentItem.highlightTag && <span className="px-3 py-1 bg-[#C5A880] text-[#132629] text-xs uppercase font-bold tracking-wider">
                      {currentItem.highlightTag}
                    </span>}
                </div>

                {
    /* Bottom Overlay Info on Mobile/Tablet */
  }
                <div className="absolute bottom-4 left-4 right-4 text-white sm:hidden">
                  <span className="text-xs uppercase tracking-wider text-[#C5A880] font-semibold">
                    {currentItem.woodType}
                  </span>
                  <h3 className="font-serif text-xl font-medium leading-snug">
                    {currentItem.name}
                  </h3>
                </div>
              </div>
            </div>

            {
    /* Right: Commission Specifications & Action */
  }
            <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-white dark:bg-[#122022] transition-colors">
              <div>
                
                {
    /* Wood Type & Provenance */
  }
                <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-[#8C6239] dark:text-[#D4B78F] mb-2">
                  <Compass className="w-3.5 h-3.5 text-[#8C6239] dark:text-[#C5A880]" />
                  <span>{currentItem.woodType}</span>
                </div>

                {
    /* Title */
  }
                <h3 className="font-serif text-2xl sm:text-3xl text-[#132629] dark:text-[#FAF8F5] font-medium leading-snug mb-3">
                  {currentItem.name}
                </h3>

                {
    /* Narrative Description */
  }
                <p className="text-sm text-[#2C221E]/80 dark:text-[#FAF8F5]/75 leading-relaxed mb-6 font-light">
                  {currentItem.description}
                </p>

                {
    /* Spec Highlights Grid */
  }
                <div className="bg-[#FAF8F5] dark:bg-[#192B2E] p-4 border border-stone-200 dark:border-[#C5A880]/20 space-y-2.5 text-xs mb-6">
                  <div className="flex items-start justify-between">
                    <span className="text-stone-500 dark:text-stone-400">Dimensions:</span>
                    <span className="font-semibold text-right text-[#132629] dark:text-[#FAF8F5] max-w-[200px]">
                      {currentItem.dimensions}
                    </span>
                  </div>
                  <div className="flex items-start justify-between border-t border-stone-200 dark:border-stone-700/60 pt-2">
                    <span className="text-stone-500 dark:text-stone-400">Materials:</span>
                    <span className="font-semibold text-right text-[#132629] dark:text-[#FAF8F5] max-w-[200px]">
                      {currentItem.materials.join(", ")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-stone-200 dark:border-stone-700/60 pt-2">
                    <span className="text-stone-500 dark:text-stone-400">Customization:</span>
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      100% Tailored to Space
                    </span>
                  </div>
                </div>

                {
    /* Pricing & Stock Availability */
  }
                <div className="flex items-center justify-between mb-4 p-3 rounded-lg bg-[#FAF8F5] dark:bg-[#162528] border border-stone-200 dark:border-stone-800">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-stone-500 block">Atelier Commission Price</span>
                    <div className="flex items-baseline gap-2">
                      <span className="font-serif text-2xl font-bold text-[#8C6239] dark:text-[#C5A880]">
                        {formatPrice(currentItem.price)}
                      </span>
                      {currentItem.originalPrice && currentItem.originalPrice > currentItem.price && <span className="text-xs line-through text-stone-400">
                          {formatPrice(currentItem.originalPrice)}
                        </span>}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 block">
                      {currentItem.stock} in Atelier
                    </span>
                    <span className="text-[10px] text-stone-400">White-Glove Included</span>
                  </div>
                </div>

                {
    /* Key Joinery Features */
  }
                <div className="space-y-1.5 mb-6">
                  {currentItem.features.map((feature, idx) => <div key={idx} className="flex items-start gap-2 text-xs text-stone-700 dark:text-stone-300">
                      <span className="text-[#8C6239] dark:text-[#C5A880] font-bold">✦</span>
                      <span>{feature}</span>
                    </div>)}
                </div>

              </div>

              {
    /* Action Buttons */
  }
              <div className="pt-4 border-t border-stone-200 dark:border-[#C5A880]/20 flex flex-col gap-2.5">
                <div className="flex gap-2">
                  <button
    onClick={() => addToCart(currentItem, 1)}
    className="flex-1 py-3 px-4 bg-[#132629] dark:bg-[#C5A880] hover:bg-[#1B3236] dark:hover:bg-[#D4B78F] text-[#FAF8F5] dark:text-[#132629] text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 rounded shadow-md transition-all"
  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Commission & Add to Bag</span>
                  </button>
                  <button
    onClick={() => setSelectedProduct(currentItem)}
    className="p-3 border border-stone-300 dark:border-stone-700 hover:border-[#C5A880] rounded text-stone-700 dark:text-stone-300 hover:text-[#8C6239] transition-colors"
    title="Customize Timber Finishes & Specs"
  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
    onClick={() => toggleWishlist(currentItem.id)}
    className="p-3 border border-stone-300 dark:border-stone-700 hover:border-[#C5A880] rounded text-stone-700 dark:text-stone-300 hover:text-rose-500 transition-colors"
    title="Save to Atelier Wishlist"
  >
                    <Heart className={`w-4 h-4 ${isInWishlist(currentItem.id) ? "fill-rose-500 text-rose-500" : ""}`} />
                  </button>
                </div>

                <button
    id={`slider-inquire-${currentItem.id}`}
    onClick={() => onOpenQuote(currentItem.name)}
    className="py-2.5 px-4 bg-transparent hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-semibold uppercase tracking-wider border border-dashed border-stone-300 dark:border-stone-700 rounded flex items-center justify-center gap-2 transition-colors"
  >
                  <span>Request Custom Architectural Dimensions</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#8C6239] dark:text-[#C5A880]" />
                </button>
              </div>

            </div>

          </div>

          {
    /* Bottom Thumbnails & Dots Bar */
  }
          <div className="p-4 bg-[#FAF8F5] dark:bg-[#0E1B1D] border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            
            <div className="flex items-center gap-3 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {featuredItems.map((item, idx) => <button
    key={item.id}
    onClick={() => handleSelectSlide(idx)}
    className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium transition-all text-left whitespace-nowrap border ${currentIndex === idx ? "bg-white dark:bg-[#1B3236] border-[#132629] dark:border-[#C5A880] text-[#132629] dark:text-[#FAF8F5] shadow-sm" : "border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-300"}`}
  >
                  <span className={`w-2 h-2 rounded-full ${currentIndex === idx ? "bg-[#8C6239] dark:bg-[#C5A880]" : "bg-stone-300 dark:bg-stone-700"}`} />
                  <span className="hidden md:inline line-clamp-1 max-w-[140px]">{item.name.replace("The ", "")}</span>
                  <span className="md:hidden">Piece 0{idx + 1}</span>
                </button>)}
            </div>

            <div className="text-[11px] text-stone-500 dark:text-stone-400 hidden lg:block">
              Swipe or click arrows to explore commissioned suites
            </div>

          </div>

        </div>

      </div>
    </section>;
};
