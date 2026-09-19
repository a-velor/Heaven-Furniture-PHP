/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState, lazy, Suspense } from "react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { CustomCursor } from "./components/CustomCursor";
import { MobileActionBar } from "./components/MobileActionBar";
import { useEcommerce } from "./context/EcommerceContext";
import { ShopCatalog } from "./components/ShopCatalog";
import { CmsAdminPanel } from "./components/CmsAdminPanel";
import { CartDrawer } from "./components/CartDrawer";
import { WishlistDrawer } from "./components/WishlistDrawer";
import { CheckoutModal } from "./components/CheckoutModal";
import { ProductDetailModal } from "./components/ProductDetailModal";
import { OrderSuccessModal } from "./components/OrderSuccessModal";
import { OrderTrackingModal } from "./components/OrderTrackingModal";
const FeaturedSlider = lazy(
  () => import("./components/FeaturedSlider").then((m) => ({ default: m.FeaturedSlider }))
);
const BrandIntro = lazy(
  () => import("./components/BrandIntro").then((m) => ({ default: m.BrandIntro }))
);
const BespokeStudio = lazy(
  () => import("./components/BespokeStudio").then((m) => ({ default: m.BespokeStudio }))
);
const CollectionsSnapshot = lazy(
  () => import("./components/CollectionsSnapshot").then((m) => ({ default: m.CollectionsSnapshot }))
);
const ProjectsSection = lazy(
  () => import("./components/ProjectsSection").then((m) => ({ default: m.ProjectsSection }))
);
const WhyChooseUs = lazy(
  () => import("./components/WhyChooseUs").then((m) => ({ default: m.WhyChooseUs }))
);
const StoryAndProof = lazy(
  () => import("./components/StoryAndProof").then((m) => ({ default: m.StoryAndProof }))
);
const ShowroomLocation = lazy(
  () => import("./components/ShowroomLocation").then((m) => ({ default: m.ShowroomLocation }))
);
const Footer = lazy(
  () => import("./components/Footer").then((m) => ({ default: m.Footer }))
);
const QuoteModal = lazy(
  () => import("./components/QuoteModal").then((m) => ({ default: m.QuoteModal }))
);
const FloatingWhatsApp = lazy(
  () => import("./components/FloatingWhatsApp").then((m) => ({ default: m.FloatingWhatsApp }))
);
const SectionFallback = () => <div className="py-24 bg-[#FAF8F5] dark:bg-[#0B1617] flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 rounded-full border-2 border-[#C5A880]/30 border-t-[#C5A880] animate-spin" />
      <span className="text-[11px] uppercase tracking-[0.2em] text-[#8C6239] dark:text-[#C5A880] font-semibold">
        Curating Atelier Content...
      </span>
    </div>
  </div>;
export default function App() {
  const { activeView } = useEcommerce();
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [selectedRoomForQuote, setSelectedRoomForQuote] = useState("Living Room Suite");
  const handleOpenQuote = (roomOrPiece) => {
    if (roomOrPiece) {
      setSelectedRoomForQuote(roomOrPiece);
    }
    setIsQuoteOpen(true);
  };
  const handleCloseQuote = () => {
    setIsQuoteOpen(false);
  };
  return <div className="min-h-screen flex flex-col pb-16 md:pb-0 bg-[#FAF8F5] dark:bg-[#0B1617] text-[#2C221E] dark:text-[#F2EFE9] antialiased selection:bg-[#C5A880]/30 selection:text-[#132629] dark:selection:text-[#FAF8F5] transition-colors duration-300">
      {
    /* Top Navigation Bar with E-Commerce & Dark Mode Controls */
  }
      <Navbar onOpenQuote={handleOpenQuote} />

      {
    /* Main View Router */
  }
      <main className="flex-1 pt-16">
        {activeView === "catalog" && <ShopCatalog />}

        {activeView === "cms" && <CmsAdminPanel />}

        {activeView === "storefront" && <>
            {
    /* 1. Hero Section */
  }
            <Hero onOpenQuote={() => handleOpenQuote()} />

            {
    /* Below-the-fold showroom sections */
  }
            <Suspense fallback={<SectionFallback />}>
              {
    /* 2. Interactive Featured Suites with E-commerce Buy / Customizer */
  }
              <FeaturedSlider onOpenQuote={handleOpenQuote} />

              {
    /* 3. Brand Intro & Studio Philosophy */
  }
              <BrandIntro onOpenQuote={() => handleOpenQuote()} />

              {
    /* 4. Bespoke Studio Highlight (#1 Differentiator) */
  }
              <BespokeStudio onOpenQuote={handleOpenQuote} />

              {
    /* 5. Curated Collections Snapshot with Instant Add to Bag */
  }
              <CollectionsSnapshot onOpenQuote={handleOpenQuote} />

              {
    /* 6. Completed Projects & Before/After Atelier Transformations */
  }
              <ProjectsSection onOpenQuote={handleOpenQuote} />

              {
    /* 7. Why Choose Heaven (6 Trust Pillars) */
  }
              <WhyChooseUs onOpenQuote={() => handleOpenQuote()} />

              {
    /* 8. Social Proof, Founder's MD Statement & Milestones */
  }
              <StoryAndProof />

              {
    /* 9. Agrabad Flagship Showroom & Unified Call-to-Action */
  }
              <ShowroomLocation onOpenQuote={() => handleOpenQuote()} />
            </Suspense>
          </>}
      </main>

      {
    /* Footer with full contact, navigation & socials */
  }
      <Suspense fallback={null}>
        <Footer onOpenQuote={() => handleOpenQuote()} />
      </Suspense>

      {
    /* E-Commerce Interactive Modals & Slide-over Drawers */
  }
      <CartDrawer />
      <WishlistDrawer />
      <ProductDetailModal />
      <CheckoutModal />
      <OrderSuccessModal />
      <OrderTrackingModal />

      {
    /* Conversion Quote / Consultation Modal */
  }
      <Suspense fallback={null}>
        <QuoteModal
    isOpen={isQuoteOpen}
    onClose={handleCloseQuote}
    defaultRoom={selectedRoomForQuote}
  />
      </Suspense>

      {
    /* Persistent Floating WhatsApp Quick Connect */
  }
      <Suspense fallback={null}>
        <FloatingWhatsApp />
      </Suspense>

      {
    /* Mobile-Only Ergonomic Bottom Action Bar */
  }
      <MobileActionBar onOpenQuote={() => handleOpenQuote()} />

      {
    /* Bespoke Luxury Fluid Custom Cursor */
  }
      <CustomCursor />
    </div>;
}
