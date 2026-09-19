import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { ThemeProvider } from "./context/ThemeContext";
import { EcommerceProvider, useEcommerce } from "./context/EcommerceContext";
import { CmsAdminPanel } from "./components/CmsAdminPanel";
import { Store, Package } from "lucide-react";
import "./index.css";

// Re-export CmsAdminPanel as AdminDashboard for backwards compatibility
export const AdminDashboard = CmsAdminPanel;
export const AdminDashboardView = CmsAdminPanel;

export function RootApp() {
  const { products, activeView, setActiveView } = useEcommerce();
  const isAdminView = activeView === "cms";

  const handleSwitchTab = (tab) => {
    if (tab === "admin") {
      setActiveView("cms");
    } else {
      setActiveView("storefront");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Application Bar with Mode Switcher */}
      <header className="bg-[#132629] text-[#FAF8F5] px-4 py-2.5 text-xs border-b border-stone-800 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setActiveView("storefront")}
            className="font-serif font-bold text-sm tracking-wide text-[#C5A880] hover:text-[#e2cfb7] transition-colors flex items-center gap-1.5 focus:outline-none"
          >
            <span>Heaven Furniture Mart</span>
          </button>
          <span className="hidden sm:inline-block text-[11px] text-stone-400 font-mono">
            Atelier E-Commerce &amp; CMS Admin
          </span>
        </div>

        {/* View Switcher Segments */}
        <div className="flex items-center bg-[#0B1617] p-1 rounded-xl border border-stone-800">
          <button
            type="button"
            onClick={() => handleSwitchTab("storefront")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
              !isAdminView
                ? "bg-[#C5A880] text-[#0B1617] shadow-xs"
                : "text-stone-400 hover:text-stone-200"
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Storefront</span>
          </button>

          <button
            type="button"
            onClick={() => handleSwitchTab("admin")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
              isAdminView
                ? "bg-[#C5A880] text-[#0B1617] shadow-xs"
                : "text-stone-400 hover:text-stone-200"
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Admin Dashboard</span>
            <span className="ml-1 px-1.5 py-0.2 bg-[#132629] text-[10px] rounded-full text-[#C5A880]">
              {products.length}
            </span>
          </button>
        </div>
      </header>

      {/* Main View Area */}
      <main className="flex-1">
        {isAdminView ? (
          <CmsAdminPanel />
        ) : (
          <App />
        )}
      </main>
    </div>
  );
}

// Mount the application into the root element
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <EcommerceProvider>
        <RootApp />
      </EcommerceProvider>
    </ThemeProvider>
  </StrictMode>
);
