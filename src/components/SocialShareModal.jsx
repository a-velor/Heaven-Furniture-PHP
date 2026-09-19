import { useState, useEffect } from "react";
import { X, Copy, Check, MessageCircle, Facebook, Twitter, Linkedin, Sparkles, Image as ImageIcon, Eye, Download } from "lucide-react";
import { generateDynamicBespokeOgImage, applySeoMetadata } from "../utils/seo";
export const SocialShareModal = ({
  isOpen,
  onClose,
  title,
  category = "Bespoke Atelier Commission",
  woodType = "Chittagong Teak (Segun)",
  imageUrl,
  description = "Handcrafted to custom dimensions at Heaven Furniture Mart, Agrabad Access Road, Chattogram."
}) => {
  const [copied, setCopied] = useState(false);
  const [dynamicOgUrl, setDynamicOgUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(true);
  const [isCardPreviewVisible, setIsCardPreviewVisible] = useState(true);
  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    setIsGenerating(true);
    generateDynamicBespokeOgImage({
      suiteTitle: title,
      category,
      woodType,
      photoUrl: imageUrl
    }).then((dataUrl) => {
      if (isMounted) {
        setDynamicOgUrl(dataUrl);
        setIsGenerating(false);
        applySeoMetadata({
          title,
          description,
          ogImage: dataUrl,
          canonicalUrl: window.location.href
        });
      }
    }).catch((err) => {
      console.warn("Dynamic OG Image generation fallback:", err);
      if (isMounted) {
        setIsGenerating(false);
        setDynamicOgUrl(imageUrl || "");
      }
    });
    return () => {
      isMounted = false;
    };
  }, [isOpen, title, category, woodType, imageUrl, description]);
  if (!isOpen) return null;
  const shareUrl = typeof window !== "undefined" ? window.location.href : "https://heavenfurnituremart.com/";
  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };
  const whatsappShareText = `Look at this bespoke furniture commission from Heaven Furniture Mart (Chattogram):
*${title}* (${woodType})
${shareUrl}`;
  const twitterShareText = `Check out "${title}" bespoke commission at Heaven Furniture Mart \u2014 Chattogram's premier luxury atelier.`;
  return <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
    role="dialog"
    aria-modal="true"
    aria-label="Share bespoke furniture specification"
    onClick={onClose}
  >
      <div
    className="bg-[#FAF8F5] dark:bg-[#122022] text-[#2C221E] dark:text-[#F2EFE9] border border-[#C5A880]/50 shadow-2xl max-w-xl w-full relative overflow-hidden max-h-[92vh] flex flex-col transition-colors duration-300"
    onClick={(e) => e.stopPropagation()}
  >
        {
    /* Top Gold Accent Line */
  }
        <div className="h-1 bg-gradient-to-r from-[#132629] via-[#C5A880] to-[#132629]" />

        {
    /* Top Close (Hide) Button */
  }
        <button
    id="close-share-modal-x-btn"
    onClick={onClose}
    className="absolute top-4 right-4 p-2 text-stone-500 hover:text-[#132629] dark:text-stone-400 dark:hover:text-[#FAF8F5] hover:bg-stone-200 dark:hover:bg-stone-800 rounded-full transition-colors z-10"
    aria-label="Hide dialog"
    title="Hide dialog"
  >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          
          {
    /* Header */
  }
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.25em] font-semibold text-[#8C6239] dark:text-[#D4B78F] mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Social Discovery & Metadata</span>
            </div>
            <h3 className="font-serif text-2xl font-normal text-[#132629] dark:text-[#FAF8F5]">
              Share Studio & Social Card
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-300 mt-1">
              Social platforms (Facebook, X, LinkedIn, WhatsApp) render this dynamic Open Graph card preview.
            </p>
          </div>

          {
    /* Dynamic Open Graph Card Live Preview with Hide/Show Toggle */
  }
          <div className="border border-[#C5A880]/40 bg-[#0E1A1C] p-3 shadow-inner rounded-sm">
            <div className="flex items-center justify-between text-[11px] text-[#C5A880] font-semibold uppercase tracking-wider mb-2 px-1">
              <span className="flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5" />
                Dynamic Open Graph Card (1200 × 630)
              </span>
              <div className="flex items-center gap-2">
                {isGenerating ? <span className="text-stone-400 animate-pulse text-[10px]">Rendering Preview...</span> : <span className="text-emerald-400 text-[10px]">Live Meta Synced</span>}
                {
    /* Hide Preview Card X Button */
  }
                <button
    id="hide-preview-card-btn"
    type="button"
    onClick={() => setIsCardPreviewVisible(!isCardPreviewVisible)}
    className="px-2 py-0.5 text-[10px] font-medium text-stone-300 hover:text-white bg-stone-800/90 hover:bg-stone-700 border border-stone-700 rounded transition-colors flex items-center gap-1 cursor-pointer"
    title={isCardPreviewVisible ? "Hide Social Card Preview (X)" : "Show Social Card Preview"}
    aria-expanded={isCardPreviewVisible}
  >
                  {isCardPreviewVisible ? <>
                      <X className="w-3 h-3 text-[#C5A880]" />
                      <span>Hide (X)</span>
                    </> : <>
                      <Eye className="w-3 h-3 text-[#C5A880]" />
                      <span>Show Preview</span>
                    </>}
                </button>
              </div>
            </div>

            {isCardPreviewVisible ? <div className="relative aspect-[1200/630] w-full overflow-hidden bg-stone-900 border border-stone-800 flex items-center justify-center group">
                {
    /* Floating X button on top-right of preview card to hide */
  }
                <button
    id="hide-preview-card-x-btn"
    type="button"
    onClick={() => setIsCardPreviewVisible(false)}
    className="absolute top-2.5 right-2.5 z-20 p-1.5 bg-black/80 hover:bg-black text-stone-300 hover:text-white rounded-full border border-white/20 transition-all shadow-lg backdrop-blur-xs flex items-center justify-center cursor-pointer group-hover:scale-105"
    title="Hide social card preview (X)"
    aria-label="Hide social card preview"
  >
                  <X className="w-4 h-4" />
                </button>

                {dynamicOgUrl ? <img
    src={dynamicOgUrl}
    alt={`Open Graph share card for ${title}`}
    className="w-full h-full object-contain"
  /> : <div className="text-xs text-stone-400">Loading social card preview...</div>}
              </div> : <div className="py-2.5 px-3 bg-stone-900/80 border border-stone-800/80 flex items-center justify-between text-xs text-stone-400">
                <span className="text-[11px]">Social Card preview is hidden. Live metadata remains active.</span>
                <button
    id="unhide-card-preview-btn"
    type="button"
    onClick={() => setIsCardPreviewVisible(true)}
    className="text-[11px] text-[#C5A880] hover:underline font-medium ml-2 shrink-0 cursor-pointer flex items-center gap-1"
  >
                  <Eye className="w-3 h-3" />
                  <span>Show Card</span>
                </button>
              </div>}
          </div>

          {
    /* Canonical Link Copy Box */
  }
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#132629] dark:text-[#FAF8F5] mb-1.5">
              Canonical Link
            </label>
            <div className="flex items-center gap-2">
              <input
    type="text"
    readOnly
    value={shareUrl}
    className="flex-1 px-3 py-2 bg-white dark:bg-[#182A2D] border border-stone-300 dark:border-stone-700 text-xs text-stone-700 dark:text-stone-200 select-all focus:outline-none"
  />
              <button
    id="copy-share-link-btn"
    type="button"
    onClick={handleCopyLink}
    className="px-4 py-2 bg-[#132629] dark:bg-[#C5A880] hover:bg-[#1B3236] dark:hover:bg-[#D4B78F] text-[#FAF8F5] dark:text-[#132629] text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors btn-luxury cursor-pointer"
  >
                {copied ? <>
                    <Check className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-900" />
                    <span>Copied</span>
                  </> : <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>}
              </button>
            </div>
          </div>

          {
    /* Social Channels Quick Links */
  }
          <div>
            <span className="block text-[11px] uppercase tracking-wider font-semibold text-[#132629] dark:text-[#FAF8F5] mb-2.5">
              Instant Share Channels
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <a
    id="share-whatsapp-btn"
    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappShareText)}`}
    target="_blank"
    rel="noopener noreferrer"
    className="py-2.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium flex items-center justify-center gap-2 transition-colors"
  >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>

              <a
    id="share-facebook-btn"
    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
    target="_blank"
    rel="noopener noreferrer"
    className="py-2.5 px-3 bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-medium flex items-center justify-center gap-2 transition-colors"
  >
                <Facebook className="w-4 h-4" />
                <span>Facebook</span>
              </a>

              <a
    id="share-twitter-btn"
    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterShareText)}&url=${encodeURIComponent(shareUrl)}`}
    target="_blank"
    rel="noopener noreferrer"
    className="py-2.5 px-3 bg-black hover:bg-stone-800 text-white text-xs font-medium flex items-center justify-center gap-2 transition-colors"
  >
                <Twitter className="w-4 h-4" />
                <span>X (Twitter)</span>
              </a>

              <a
    id="share-linkedin-btn"
    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
    target="_blank"
    rel="noopener noreferrer"
    className="py-2.5 px-3 bg-[#0A66C2] hover:bg-[#095196] text-white text-xs font-medium flex items-center justify-center gap-2 transition-colors"
  >
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>

          {
    /* Modal Footer with Hide Button & Download Action */
  }
          <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3">
            <span className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
              Heaven Furniture Mart · Agrabad Access Road
            </span>
            <div className="flex items-center gap-2 shrink-0">
              {dynamicOgUrl && <a
    id="download-og-card-btn"
    href={dynamicOgUrl}
    download={`heaven-furniture-${(title || "bespoke").toLowerCase().replace(/[^a-z0-9]+/g, "-")}.jpg`}
    className="px-3 py-1.5 text-xs text-stone-700 dark:text-stone-300 hover:text-[#132629] dark:hover:text-white border border-stone-300 dark:border-stone-700 hover:border-[#C5A880] transition-colors flex items-center gap-1.5"
    title="Download dynamic card image"
  >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">Download</span>
                </a>}
              <button
    id="hide-share-modal-btn"
    type="button"
    onClick={onClose}
    className="px-4 py-1.5 bg-stone-200 hover:bg-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5"
    aria-label="Hide share studio modal"
    title="Hide share studio modal (X)"
  >
                <X className="w-3.5 h-3.5" />
                <span>Hide (X)</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>;
};
