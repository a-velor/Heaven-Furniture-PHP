import { Phone, MessageCircle, FileText } from "lucide-react";
export const MobileActionBar = ({ onOpenQuote }) => {
  return <aside
    id="mobile-action-bar"
    aria-label="Quick mobile studio contacts"
    className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF8F5]/95 dark:bg-[#0B1617]/95 backdrop-blur-lg border-t border-[#C5A880]/30 shadow-[0_-8px_25px_rgba(0,0,0,0.18)] transition-all duration-300"
    style={{
      paddingBottom: "max(0.6rem, env(safe-area-inset-bottom, 0.6rem))"
    }}
  >
      <div className="max-w-md mx-auto px-3 pt-2 grid grid-cols-3 gap-2">
        {
    /* 1. Direct Call Line */
  }
        <a
    id="mobile-bar-call-btn"
    href="tel:+8801960481983"
    className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-stone-100/80 dark:bg-[#162528] text-[#132629] dark:text-[#FAF8F5] active:scale-95 transition-transform border border-stone-200/60 dark:border-stone-800"
    aria-label="Call Agrabad Studio directly"
  >
          <div className="w-8 h-8 rounded-full bg-[#132629]/5 dark:bg-[#C5A880]/15 flex items-center justify-center mb-1">
            <Phone className="w-4 h-4 text-[#8C6239] dark:text-[#C5A880]" />
          </div>
          <span className="text-[11px] font-semibold tracking-tight">Call Studio</span>
          <span className="text-[9px] text-stone-500 dark:text-stone-400 font-mono">Direct Line</span>
        </a>

        {
    /* 2. WhatsApp Artisan Concierge */
  }
        <a
    id="mobile-bar-whatsapp-btn"
    href="https://wa.me/8801960481983?text=Hello%20Heaven%20Furniture%20Mart,%20I%20would%20like%20to%20inquire%20about%20a%20bespoke%20furniture%20piece."
    target="_blank"
    rel="noopener noreferrer"
    className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-emerald-50/90 dark:bg-[#0e2724] text-emerald-900 dark:text-emerald-200 active:scale-95 transition-transform border border-emerald-500/30 shadow-sm"
    aria-label="Chat on WhatsApp with master artisan"
  >
          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center mb-1 shadow-sm relative">
            <MessageCircle className="w-4 h-4" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-300 border border-white dark:border-[#0e2724] animate-pulse" />
          </div>
          <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 tracking-tight">
            WhatsApp
          </span>
          <span className="text-[9px] text-emerald-700 dark:text-emerald-400">Live Artisan</span>
        </a>

        {
    /* 3. Request Bespoke Quote */
  }
        <button
    id="mobile-bar-quote-btn"
    onClick={() => onOpenQuote()}
    className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-[#132629] dark:bg-[#C5A880] text-[#FAF8F5] dark:text-[#132629] active:scale-95 transition-transform shadow-md"
    aria-label="Open custom quote and room consultation modal"
  >
          <div className="w-8 h-8 rounded-full bg-white/15 dark:bg-[#132629]/15 flex items-center justify-center mb-1">
            <FileText className="w-4 h-4 text-[#C5A880] dark:text-[#132629]" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider">
            Free Quote
          </span>
          <span className="text-[9px] opacity-80 font-medium">Bespoke Specs</span>
        </button>
      </div>
    </aside>;
};
