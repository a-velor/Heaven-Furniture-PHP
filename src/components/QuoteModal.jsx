import { useState, useEffect } from "react";
import { X, CheckCircle2, MessageCircle, Send, Sparkles, ShieldCheck } from "lucide-react";
export const QuoteModal = ({
  isOpen,
  onClose,
  defaultRoom = "Living Room Suite"
}) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    roomType: defaultRoom,
    woodPreference: "Chittagong Teak (Segun)",
    notes: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [refId, setRefId] = useState("");
  useEffect(() => {
    if (defaultRoom) {
      setFormData((prev) => ({ ...prev, roomType: defaultRoom }));
    }
  }, [defaultRoom]);
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);
  if (!isOpen) return null;
  const handleSubmit = (e) => {
    e.preventDefault();
    const generatedRef = "HFM-" + Math.floor(1e5 + Math.random() * 9e5);
    setRefId(generatedRef);
    setSubmitted(true);
  };
  const handleWhatsAppDirect = () => {
    const message = `Hello Heaven Furniture Mart!
I would like to request a bespoke furniture quote & design consultation:
\u2022 Name: ${formData.name || "Valued Client"}
\u2022 Phone: ${formData.phone || "Provided on chat"}
\u2022 Room / Commission: ${formData.roomType}
\u2022 Wood Preference: ${formData.woodPreference}
\u2022 Dimensions / Notes: ${formData.notes || "To be measured at Agrabad studio or home"}
Looking forward to discussing our project!`;
    window.open(`https://wa.me/8801960481983?text=${encodeURIComponent(message)}`, "_blank");
    onClose();
  };
  return <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
    role="dialog"
    aria-modal="true"
    aria-label="Request a Bespoke Quote"
    onClick={onClose}
  >
      <div
    className="bg-[#FAF8F5] dark:bg-[#122022] text-[#2C221E] dark:text-[#F2EFE9] border border-[#C5A880]/50 shadow-2xl max-w-xl w-full relative overflow-hidden max-h-[95vh] flex flex-col transition-colors duration-300"
    onClick={(e) => e.stopPropagation()}
  >
        {
    /* Top Decorative Gold Accent */
  }
        <div className="h-1 bg-gradient-to-r from-[#132629] via-[#C5A880] to-[#132629]" />

        {
    /* Modal Close Button */
  }
        <button
    onClick={onClose}
    className="absolute top-4 right-4 p-2 text-stone-500 hover:text-[#132629] dark:text-stone-400 dark:hover:text-[#FAF8F5] hover:bg-stone-200 dark:hover:bg-stone-800 rounded-full transition-colors z-10"
    aria-label="Close"
  >
          <X className="w-5 h-5" />
        </button>

        {submitted ? <div className="p-8 sm:p-10 text-center space-y-6 my-auto">
            <div className="w-16 h-16 bg-[#132629] dark:bg-[#182A2D] text-[#C5A880] rounded-full flex items-center justify-center mx-auto border-2 border-[#C5A880]">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[11px] uppercase tracking-[0.25em] font-bold text-[#8C6239] dark:text-[#D4B78F]">
                Inquiry Received
              </span>
              <h3 className="font-serif text-3xl font-medium text-[#132629] dark:text-[#FAF8F5] mt-1">
                Thank You, {formData.name || "Valued Client"}
              </h3>
              <p className="text-sm text-stone-600 dark:text-stone-300 mt-2 max-w-md mx-auto">
                Your bespoke consultation request has been forwarded to our Agrabad studio artisans. 
                Reference: <strong className="text-[#132629] dark:text-[#C5A880]">{refId}</strong>.
              </p>
            </div>

            <div className="bg-white dark:bg-[#182A2D] p-5 border border-stone-200 dark:border-stone-700 text-left text-xs space-y-2 max-w-md mx-auto">
              <div className="flex justify-between">
                <span className="text-stone-500 dark:text-stone-400">Commission Type:</span>
                <span className="font-semibold text-stone-900 dark:text-stone-100">{formData.roomType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500 dark:text-stone-400">Selected Hardwood:</span>
                <span className="font-semibold text-stone-900 dark:text-stone-100">{formData.woodPreference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500 dark:text-stone-400">Studio Response Time:</span>
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">Within 2 Hours</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
    onClick={handleWhatsAppDirect}
    className="py-3 px-6 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 btn-luxury"
  >
                <MessageCircle className="w-4 h-4" />
                <span>Connect on WhatsApp Now</span>
              </button>

              <button
    onClick={() => {
      setSubmitted(false);
      onClose();
    }}
    className="py-3 px-6 bg-[#132629] dark:bg-[#C5A880] hover:bg-black dark:hover:bg-[#D4B78F] text-[#FAF8F5] dark:text-[#132629] text-xs font-semibold uppercase tracking-wider btn-luxury"
  >
                Done
              </button>
            </div>
          </div> : <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
            
            {
    /* Header */
  }
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] font-semibold text-[#8C6239] dark:text-[#D4B78F] mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Complimentary Consultation</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#132629] dark:text-[#FAF8F5]">
                Request a Bespoke Quote
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 mt-1">
                Tell us about your room or custom design. We provide tailored estimates, 3D visualizations, and in-home measurements.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {
    /* Name & Phone */
  }
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#132629] dark:text-[#FAF8F5] mb-1">
                    Your Name *
                  </label>
                  <input
    type="text"
    required
    placeholder="e.g. Tariqul Islam"
    value={formData.name}
    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
    className="w-full px-3.5 py-2.5 bg-white dark:bg-[#182A2D] border border-stone-300 dark:border-stone-700 text-sm text-[#132629] dark:text-[#FAF8F5] focus:outline-none focus:border-[#8C6239] dark:focus:border-[#C5A880]"
  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#132629] dark:text-[#FAF8F5] mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
    type="tel"
    required
    placeholder="+880 1XXXXXXXXX"
    value={formData.phone}
    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
    className="w-full px-3.5 py-2.5 bg-white dark:bg-[#182A2D] border border-stone-300 dark:border-stone-700 text-sm text-[#132629] dark:text-[#FAF8F5] focus:outline-none focus:border-[#8C6239] dark:focus:border-[#C5A880]"
  />
                </div>
              </div>

              {
    /* Email */
  }
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#132629] dark:text-[#FAF8F5] mb-1">
                  Email Address
                </label>
                <input
    type="email"
    placeholder="yourname@domain.com"
    value={formData.email}
    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
    className="w-full px-3.5 py-2.5 bg-white dark:bg-[#182A2D] border border-stone-300 dark:border-stone-700 text-sm text-[#132629] dark:text-[#FAF8F5] focus:outline-none focus:border-[#8C6239] dark:focus:border-[#C5A880]"
  />
              </div>

              {
    /* Commission Category */
  }
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#132629] dark:text-[#FAF8F5] mb-1">
                    Room / Commission
                  </label>
                  <select
    value={formData.roomType}
    onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
    className="w-full px-3.5 py-2.5 bg-white dark:bg-[#182A2D] border border-stone-300 dark:border-stone-700 text-sm text-[#132629] dark:text-[#FAF8F5] focus:outline-none focus:border-[#8C6239] dark:focus:border-[#C5A880]"
  >
                    <option>Living Room Suite</option>
                    <option>Master Bedroom Suite</option>
                    <option>Formal Dining Ensemble</option>
                    <option>Executive Workstation & Study</option>
                    <option>Full Home Bespoke Commission</option>
                    <option>Custom Architectural Drawing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#132629] dark:text-[#FAF8F5] mb-1">
                    Wood Preference
                  </label>
                  <select
    value={formData.woodPreference}
    onChange={(e) => setFormData({ ...formData, woodPreference: e.target.value })}
    className="w-full px-3.5 py-2.5 bg-white dark:bg-[#182A2D] border border-stone-300 dark:border-stone-700 text-sm text-[#132629] dark:text-[#FAF8F5] focus:outline-none focus:border-[#8C6239] dark:focus:border-[#C5A880]"
  >
                    <option>Chittagong Teak (Segun)</option>
                    <option>Burma Segun (Imported)</option>
                    <option>American Black Walnut</option>
                    <option>Seasoned Royal Mahogany</option>
                    <option>Advise me during consultation</option>
                  </select>
                </div>
              </div>

              {
    /* Notes / Measurements */
  }
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#132629] dark:text-[#FAF8F5] mb-1">
                  Space Dimensions or Custom Details
                </label>
                <textarea
    rows={3}
    placeholder="e.g. 14ft x 18ft living room in Nasirabad, looking for an L-shaped sofa in bouclé with matching teak coffee table..."
    value={formData.notes}
    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
    className="w-full px-3.5 py-2.5 bg-white dark:bg-[#182A2D] border border-stone-300 dark:border-stone-700 text-sm text-[#132629] dark:text-[#FAF8F5] focus:outline-none focus:border-[#8C6239] dark:focus:border-[#C5A880]"
  />
              </div>

              {
    /* Trust Callout */
  }
              <div className="flex items-center gap-2 text-[11px] text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-[#182A2D] p-2.5 border border-stone-200 dark:border-stone-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Zero obligation. We respect your privacy and never spam.</span>
              </div>

              {
    /* Dual Action Buttons */
  }
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
    type="submit"
    className="flex-1 py-3.5 px-6 bg-[#132629] dark:bg-[#C5A880] hover:bg-[#1B3236] dark:hover:bg-[#D4B78F] text-[#FAF8F5] dark:text-[#132629] text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow btn-luxury"
  >
                  <Send className="w-4 h-4 text-[#C5A880] dark:text-[#132629]" />
                  <span>Submit Bespoke Request</span>
                </button>

                <button
    type="button"
    onClick={handleWhatsAppDirect}
    className="py-3.5 px-6 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors btn-luxury"
  >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send via WhatsApp</span>
                </button>
              </div>

            </form>

            <div className="text-center pt-2 text-[11px] text-stone-500 dark:text-stone-400">
              Or call our Agrabad Studio directly: <a href="tel:+8801960481983" className="font-semibold text-[#132629] dark:text-[#C5A880] hover:underline">+880 1960-481983</a>
            </div>

          </div>}

      </div>
    </div>;
};
