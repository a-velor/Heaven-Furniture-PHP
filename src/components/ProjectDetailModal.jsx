import { useEffect } from "react";
import { X, MapPin, Calendar, Clock, Check, ArrowRight, MessageCircle, Sparkles, ShieldCheck, Layers } from "lucide-react";
import { BeforeAfterSlider } from "./BeforeAfterSlider";
export const ProjectDetailModal = ({
  project,
  isOpen,
  onClose,
  onOpenQuote
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);
  if (!isOpen || !project) return null;
  return <div
    className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto"
    role="dialog"
    aria-modal="true"
    aria-labelledby="project-modal-title"
    onClick={onClose}
  >
      <div
    className="bg-[#FAF8F5] dark:bg-[#0E1A1C] text-[#2C221E] dark:text-[#F2EFE9] border border-[#C5A880]/50 shadow-2xl max-w-4xl w-full relative overflow-hidden my-auto max-h-[94vh] flex flex-col rounded-sm transition-colors duration-300"
    onClick={(e) => e.stopPropagation()}
  >
        {
    /* Top Gold Accent Border */
  }
        <div className="h-1 bg-gradient-to-r from-[#132629] via-[#C5A880] to-[#132629]" />

        {
    /* Close Button */
  }
        <button
    onClick={onClose}
    className="absolute top-4 right-4 p-2 text-stone-500 hover:text-[#132629] dark:text-stone-400 dark:hover:text-[#FAF8F5] hover:bg-stone-200 dark:hover:bg-stone-800 rounded-full transition-colors z-20"
    aria-label="Close project details"
  >
          <X className="w-5 h-5" />
        </button>

        {
    /* Scrollable Modal Body */
  }
        <div className="overflow-y-auto p-6 sm:p-8 space-y-8">
          
          {
    /* Header & Meta Badges */
  }
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase bg-[#C5A880]/15 dark:bg-[#C5A880]/20 text-[#8C6239] dark:text-[#D4B78F] border border-[#C5A880]/40 rounded-sm">
                <Sparkles className="w-3 h-3" />
                {project.category}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-stone-600 dark:text-stone-400">
                <MapPin className="w-3.5 h-3.5 text-[#C5A880]" />
                {project.location}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-stone-600 dark:text-stone-400">
                <Calendar className="w-3.5 h-3.5 text-[#C5A880]" />
                Completed {project.completionYear}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-stone-600 dark:text-stone-400">
                <Clock className="w-3.5 h-3.5 text-[#C5A880]" />
                {project.leadTime} Lead Time
              </span>
            </div>

            <h2 id="project-modal-title" className="font-serif text-2xl sm:text-3xl font-normal text-[#132629] dark:text-[#FAF8F5]">
              {project.title}
            </h2>
            <p className="text-sm text-stone-600 dark:text-stone-300 mt-2 max-w-2xl leading-relaxed">
              {project.summary}
            </p>
          </div>

          {
    /* Interactive Before-and-After Slider */
  }
          <div className="space-y-2">
            <h3 className="text-xs uppercase tracking-widest font-semibold text-[#8C6239] dark:text-[#C5A880] flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              Interactive Transformation Slider
            </h3>
            <BeforeAfterSlider
    beforeImage={project.beforeImage}
    beforeLabel={project.beforeLabel}
    afterImage={project.afterImage}
    afterLabel={project.afterLabel}
    altText={project.title}
    aspectRatio="aspect-[16/10]"
  />
          </div>

          {
    /* Architectural Challenge vs Bespoke Solution Grid */
  }
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-stone-100 dark:bg-[#132426] border border-stone-200 dark:border-stone-800 rounded-sm">
              <span className="text-[10px] uppercase tracking-widest font-bold text-amber-700 dark:text-amber-400 block mb-2">
                Client Challenge & Spatial Constraints
              </span>
              <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                {project.challenge}
              </p>
            </div>

            <div className="p-5 bg-[#C5A880]/10 dark:bg-[#C5A880]/10 border border-[#C5A880]/30 rounded-sm">
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#8C6239] dark:text-[#C5A880] block mb-2">
                Our Atelier Engineering & Solution
              </span>
              <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                {project.solution}
              </p>
            </div>
          </div>

          {
    /* Master Craftsmanship & Joinery Highlights */
  }
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-widest font-semibold text-[#132629] dark:text-[#FAF8F5] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#C5A880]" />
              Artisan Techniques & Joinery Highlights
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {project.craftsmanshipHighlights.map((highlight, index) => <div
    key={index}
    className="flex items-start gap-2.5 p-3 bg-white dark:bg-[#162729] border border-stone-200/80 dark:border-stone-800/80 text-xs text-stone-700 dark:text-stone-300 rounded-sm"
  >
                  <Check className="w-3.5 h-3.5 text-[#C5A880] mt-0.5 shrink-0" />
                  <span>{highlight}</span>
                </div>)}
            </div>
          </div>

          {
    /* Technical Specifications Grid */
  }
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-stone-100/70 dark:bg-[#122224] border border-stone-200 dark:border-stone-800 text-xs rounded-sm">
            <div>
              <span className="block text-[10px] uppercase tracking-wider text-stone-500 dark:text-stone-400 font-semibold mb-1">
                Hardwood / Spec
              </span>
              <span className="font-medium text-[#132629] dark:text-[#FAF8F5]">
                {project.woodType}
              </span>
            </div>
            <div>
              <span className="block text-[10px] uppercase tracking-wider text-stone-500 dark:text-stone-400 font-semibold mb-1">
                Dimensions Tailored
              </span>
              <span className="font-medium text-[#132629] dark:text-[#FAF8F5]">
                {project.dimensions}
              </span>
            </div>
            <div>
              <span className="block text-[10px] uppercase tracking-wider text-stone-500 dark:text-stone-400 font-semibold mb-1">
                Materials Palette
              </span>
              <span className="font-medium text-[#132629] dark:text-[#FAF8F5]">
                {project.materials.join(" \xB7 ")}
              </span>
            </div>
          </div>

          {
    /* Client Testimonial Quote */
  }
          {project.testimonialSnippet && <div className="p-4 bg-white dark:bg-[#152528] border-l-2 border-[#C5A880] text-xs text-stone-700 dark:text-stone-300 italic">
              <p className="leading-relaxed">"{project.testimonialSnippet}"</p>
              <span className="block not-italic font-semibold text-[#132629] dark:text-[#FAF8F5] mt-2">
                — {project.clientName} ({project.location})
              </span>
            </div>}

          {
    /* Actions CTA Bar */
  }
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-stone-200 dark:border-stone-800">
            <span className="text-xs text-stone-500 dark:text-stone-400 text-center sm:text-left">
              Have a similar room in Chattogram or Dhaka requiring tailored dimensions?
            </span>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <a
    href={`https://wa.me/8801960481983?text=${encodeURIComponent(`Hello Heaven Furniture Mart, I saw your completed commission "${project.title}" and would like to discuss a similar project for my space.`)}`}
    target="_blank"
    rel="noopener noreferrer"
    className="flex-1 sm:flex-initial py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 rounded-sm transition-colors"
  >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>

              <button
    onClick={() => {
      onClose();
      onOpenQuote(project.title);
    }}
    className="flex-1 sm:flex-initial py-2.5 px-5 bg-[#132629] dark:bg-[#C5A880] hover:bg-[#1C3337] dark:hover:bg-[#D4B78F] text-[#FAF8F5] dark:text-[#132629] text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 rounded-sm transition-colors btn-luxury"
  >
                <span>Commission Similar Suite</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>;
};
