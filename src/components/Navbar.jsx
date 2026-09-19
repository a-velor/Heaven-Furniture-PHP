import { useState, useEffect } from "react";
import { Phone, Menu, X, ArrowRight, Sun, Moon, Share2, ShoppingBag, Heart, PackageCheck, Server } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useEcommerce } from "../context/EcommerceContext";
import { SocialShareModal } from "./SocialShareModal";
export const Navbar = ({ onOpenQuote }) => {
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const {
    activeView,
    setActiveView,
    totalCartCount,
    setIsCartOpen,
    wishlist,
    setIsWishlistOpen,
    setIsOrderTrackingOpen,
    currency,
    setCurrency,
    subtotal,
    formatPrice
  } = useEcommerce();
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      const totalScrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScrollableHeight > 0) {
        const currentProgress = window.scrollY / totalScrollableHeight * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      } else {
        setScrollProgress(0);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);
  const navLinks = [
    { name: "Shop Catalog", action: () => setActiveView("catalog"), isAction: true },
    { name: "Featured Suites", href: "#featured-slider" },
    { name: "Collections", href: "#collections" },
    { name: "Bespoke Atelier", href: "#bespoke" },
    { name: "Why Us", href: "#why-us" },
    { name: "Showroom", href: "#showroom" },
    { name: "PHP CMS Admin", action: () => setActiveView("cms"), isAction: true, isCms: true }
  ];
  return <>
      {
    /* Thin Gold Scroll Progress Bar fixed at top of screen */
  }
      <div
    id="scroll-progress-container"
    className="fixed top-0 left-0 right-0 h-[2.5px] z-[60] pointer-events-none bg-stone-300/20 dark:bg-stone-800/30 overflow-hidden"
    role="progressbar"
    aria-valuenow={Math.round(scrollProgress)}
    aria-valuemin={0}
    aria-valuemax={100}
    aria-label="Page scroll depth progression"
  >
        <div
    id="scroll-progress-bar"
    className="h-full bg-gradient-to-r from-[#8C6239] via-[#C5A880] to-[#EBD5A9] shadow-[0_0_10px_rgba(197,168,128,0.7)] transition-[width] duration-150 ease-out"
    style={{ width: `${scrollProgress}%` }}
  />
      </div>

      <header
    className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#FAF8F5]/95 dark:bg-[#0B1617]/95 backdrop-blur-md shadow-sm border-b border-[#C5A880]/20 py-3" : "bg-[#FAF8F5]/80 dark:bg-[#0B1617]/80 backdrop-blur-sm py-4 border-b border-stone-200/50 dark:border-stone-800/60"}`}
  >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {
    /* Logo & Brand Identity */
  }
          <button
    onClick={() => setActiveView("storefront")}
    className="group flex flex-col items-start focus:outline-none text-left"
  >
            <span className="font-serif text-2xl sm:text-3xl font-bold tracking-wider text-[#132629] dark:text-[#FAF8F5] group-hover:text-[#8C6239] dark:group-hover:text-[#C5A880] transition-colors leading-none">
              HEAVEN
            </span>
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#8C6239] dark:text-[#C5A880] font-medium mt-1">
              Furniture Mart · Chattogram
            </span>
          </button>

          {
    /* Desktop Navigation Links */
  }
          <nav className="hidden lg:flex items-center space-x-6 text-[13px] font-medium text-[#2C221E]/80 dark:text-[#FAF8F5]/80">
            {navLinks.map((link) => link.isAction ? <button
    key={link.name}
    onClick={link.action}
    className={`transition-colors relative py-1 link-luxury ${link.isCms ? "px-2.5 py-0.5 rounded-full bg-[#8C6239]/10 text-[#8C6239] dark:text-[#C5A880] border border-[#C5A880]/30 hover:bg-[#8C6239]/20 font-semibold" : activeView === "catalog" && link.name === "Shop Catalog" ? "text-[#8C6239] dark:text-[#C5A880] font-bold" : "hover:text-[#132629] dark:hover:text-white"}`}
  >
                  {link.isCms && <Server className="w-3 h-3 inline mr-1" />}
                  {link.name}
                </button> : <a
    key={link.name}
    href={link.href}
    onClick={() => {
      if (activeView !== "storefront") setActiveView("storefront");
    }}
    className="hover:text-[#132629] dark:hover:text-white transition-colors relative py-1 link-luxury"
  >
                  {link.name}
                </a>)}
          </nav>

          {
    /* Right Action Controls */
  }
          <div className="flex items-center space-x-1.5 sm:space-x-2.5">
            
            {
    /* Currency Switcher */
  }
            <select
    value={currency}
    onChange={(e) => setCurrency(e.target.value)}
    className="text-[11px] font-semibold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-700 rounded px-1.5 py-1 focus:outline-none focus:border-[#C5A880] cursor-pointer"
    title="Change Currency"
  >
              <option value="BDT">৳ BDT</option>
              <option value="USD">$ USD</option>
              <option value="EUR">€ EUR</option>
            </select>

            {
    /* Order Tracking Icon */
  }
            <button
    onClick={() => setIsOrderTrackingOpen(true)}
    className="p-2 rounded-full border border-stone-300 dark:border-stone-700 bg-white/60 dark:bg-[#162528] text-stone-700 dark:text-[#C5A880] hover:text-[#132629] dark:hover:text-white transition-all shadow-xs"
    title="Track Order / Commission Progress"
    aria-label="Track Order"
  >
              <PackageCheck className="w-4 h-4" />
            </button>

            {
    /* Wishlist Icon */
  }
            <button
    onClick={() => setIsWishlistOpen(true)}
    className="relative p-2 rounded-full border border-stone-300 dark:border-stone-700 bg-white/60 dark:bg-[#162528] text-stone-700 dark:text-[#C5A880] hover:text-rose-500 transition-all shadow-xs"
    title="Saved Atelier Pieces"
    aria-label="Wishlist"
  >
              <Heart className="w-4 h-4" />
              {wishlist.length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {wishlist.length}
                </span>}
            </button>

            {
    /* Shopping Cart Button with Count & Subtotal */
  }
            <button
    onClick={() => setIsCartOpen(true)}
    className="relative flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#8C6239]/40 bg-[#FAF8F5] dark:bg-[#162528] text-stone-800 dark:text-[#F2EFE9] hover:border-[#8C6239] transition-all shadow-xs"
    title="View Atelier Cart"
  >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 text-[#8C6239] dark:text-[#C5A880]" />
                {totalCartCount > 0 && <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-gradient-to-r from-[#8C6239] to-[#C5A880] text-white text-[9px] font-bold flex items-center justify-center shadow">
                    {totalCartCount}
                  </span>}
              </div>
              {subtotal > 0 && <span className="hidden sm:inline text-xs font-bold text-[#8C6239] dark:text-[#C5A880]">
                  {formatPrice(subtotal)}
                </span>}
            </button>

            {
    /* Dark Mode Toggle */
  }
            <button
    id="theme-toggle-btn"
    onClick={toggleTheme}
    aria-label={theme === "dark" ? "Switch to daylight atmosphere" : "Switch to evening atelier atmosphere"}
    title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
    className="relative p-2 rounded-full border border-stone-300 dark:border-stone-700 bg-white/60 dark:bg-[#162528] text-stone-700 dark:text-[#C5A880] hover:text-[#132629] dark:hover:text-white transition-all shadow-xs"
  >
              {theme === "dark" ? <Sun className="w-4 h-4 text-[#C5A880]" /> : <Moon className="w-4 h-4 text-[#132629]" />}
            </button>

            {
    /* Social Share Button */
  }
            <button
    id="nav-share-btn"
    onClick={() => setIsShareModalOpen(true)}
    className="hidden sm:block p-2 text-stone-700 dark:text-[#FAF8F5]/80 hover:text-[#8C6239] dark:hover:text-[#C5A880] transition-colors"
    title="Share Studio & Preview Social Card"
    aria-label="Share Studio"
  >
              <Share2 className="w-4 h-4" />
            </button>

            {
    /* Mobile Hamburger Menu Toggle */
  }
            <button
    id="mobile-menu-toggle"
    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
    className="lg:hidden p-2 text-[#132629] dark:text-[#FAF8F5] hover:text-[#8C6239] focus:outline-none"
    aria-label="Toggle Navigation Menu"
  >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {
    /* Mobile Menu Drawer */
  }
      {mobileMenuOpen && <>
          <div
    id="mobile-nav-backdrop"
    onClick={() => setMobileMenuOpen(false)}
    className="fixed inset-0 top-[60px] bg-black/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
    aria-hidden="true"
  />
          <div className="fixed top-[60px] left-0 right-0 z-50 lg:hidden bg-[#FAF8F5] dark:bg-[#0E1A1C] border-b border-[#C5A880]/40 px-6 py-6 shadow-2xl transition-all max-h-[calc(100vh-70px)] overflow-y-auto">
            <nav className="flex flex-col space-y-3 text-base font-medium text-[#2C221E] dark:text-[#FAF8F5]">
              <button
    onClick={() => {
      setActiveView("catalog");
      setMobileMenuOpen(false);
    }}
    className="py-2.5 px-3 bg-[#132629] dark:bg-[#C5A880] text-white dark:text-[#0B1617] rounded-lg text-left font-bold flex items-center justify-between"
  >
                <span>Shop Solid Wood Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
    onClick={() => {
      setActiveView("cms");
      setMobileMenuOpen(false);
    }}
    className="py-2.5 px-3 bg-[#8C6239]/10 text-[#8C6239] dark:text-[#C5A880] border border-[#8C6239]/30 rounded-lg text-left font-bold flex items-center justify-between"
  >
                <span>PHP CMS Website Framework Admin</span>
                <Server className="w-4 h-4" />
              </button>

              <button
    onClick={() => {
      setIsOrderTrackingOpen(true);
      setMobileMenuOpen(false);
    }}
    className="py-2 border-b border-stone-200/50 dark:border-stone-800 text-left flex items-center justify-between"
  >
                <span>Track Workshop Commission</span>
                <PackageCheck className="w-4 h-4 text-[#C5A880]" />
              </button>

              {navLinks.filter((l) => !l.isAction).map((link) => <a
    key={link.name}
    href={link.href}
    onClick={() => {
      setActiveView("storefront");
      setMobileMenuOpen(false);
    }}
    className="py-2 border-b border-stone-200/50 dark:border-stone-800 text-[#132629] dark:text-[#FAF8F5] hover:text-[#8C6239] dark:hover:text-[#C5A880] transition-colors flex items-center justify-between"
  >
                  <span>{link.name}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C5A880] opacity-60" />
                </a>)}
            </nav>

            <div className="mt-6 pt-4 border-t border-stone-200 dark:border-stone-800 flex flex-col gap-3">
              <a
    href="tel:+8801960481983"
    className="flex items-center gap-2.5 text-sm font-semibold text-[#132629] dark:text-[#FAF8F5] py-2 px-3 rounded-lg bg-stone-100 dark:bg-stone-800/80"
  >
                <Phone className="w-4 h-4 text-[#8C6239] dark:text-[#C5A880]" />
                <span>+880 1960-481983</span>
              </a>

              <button
    onClick={() => {
      setMobileMenuOpen(false);
      onOpenQuote();
    }}
    className="w-full mt-2 py-3 bg-[#132629] dark:bg-[#C5A880] text-[#FAF8F5] dark:text-[#132629] text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 rounded-lg shadow"
  >
                <span>Book Free Space Consultation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </>}

      {
    /* Studio Social Share / Open Graph Modal */
  }
      <SocialShareModal
    isOpen={isShareModalOpen}
    onClose={() => setIsShareModalOpen(false)}
    title="Heaven Furniture Mart — Luxury & Bespoke Furniture Studio"
    category="Bespoke Interior Studio · Chattogram"
    woodType="Seasoned Chittagong Teak & Hardwoods"
    imageUrl="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop"
    description="Luxury & bespoke furniture studio in Agrabad, Chattogram. Handcrafted living, bedroom, dining, and custom furniture tailored to your space."
  />
    </header>
    </>;
};
