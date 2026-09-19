import { X, Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useEcommerce } from "../context/EcommerceContext";
export const WishlistDrawer = () => {
  const {
    wishlist,
    isWishlistOpen,
    setIsWishlistOpen,
    products,
    toggleWishlist,
    addToCart,
    formatPrice,
    setSelectedProduct,
    setActiveView
  } = useEcommerce();
  if (!isWishlistOpen) return null;
  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));
  return <div className="fixed inset-0 z-[100] overflow-hidden">
      {
    /* Backdrop */
  }
      <div
    className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity"
    onClick={() => setIsWishlistOpen(false)}
  />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF8F5] dark:bg-[#0E1A1C] border-l border-[#C5A880]/30 shadow-2xl flex flex-col text-[#2C221E] dark:text-[#F2EFE9] transition-colors">
          
          {
    /* Header */
  }
          <div className="p-6 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-100/50 dark:bg-stone-900/50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
                <Heart className="w-5 h-5 fill-rose-500" />
              </div>
              <div>
                <h2 className="font-serif text-lg font-bold tracking-wide">Saved Atelier Pieces</h2>
                <p className="text-[11px] uppercase tracking-wider text-stone-500">
                  {wishlistProducts.length} Saved {wishlistProducts.length === 1 ? "Design" : "Designs"}
                </p>
              </div>
            </div>
            <button
    onClick={() => setIsWishlistOpen(false)}
    className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-full"
  >
              <X className="w-5 h-5" />
            </button>
          </div>

          {
    /* List */
  }
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {wishlistProducts.length === 0 ? <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-stone-200/60 dark:bg-stone-800/60 flex items-center justify-center text-stone-400 mb-4">
                  <Heart className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-stone-800 dark:text-stone-100">
                  No saved pieces yet
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-xs">
                  Save your favorite solid teak living suites and dining commissions as you explore.
                </p>
                <button
    onClick={() => {
      setIsWishlistOpen(false);
      setActiveView("catalog");
    }}
    className="mt-6 px-6 py-2.5 bg-[#132629] dark:bg-[#FAF8F5] text-white dark:text-[#132629] text-xs font-semibold uppercase tracking-wider rounded hover:bg-[#8C6239] transition-colors"
  >
                  Browse Collection
                </button>
              </div> : wishlistProducts.map((prod) => <div
    key={prod.id}
    className="flex gap-4 p-3.5 rounded-lg bg-white/80 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 shadow-xs group"
  >
                  <img
    src={prod.image}
    alt={prod.name}
    className="w-20 h-20 object-cover rounded-md border border-stone-200 dark:border-stone-800 shrink-0 cursor-pointer"
    onClick={() => {
      setSelectedProduct(prod);
      setIsWishlistOpen(false);
    }}
  />

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4
    onClick={() => {
      setSelectedProduct(prod);
      setIsWishlistOpen(false);
    }}
    className="font-serif text-sm font-semibold truncate text-stone-900 dark:text-stone-100 cursor-pointer hover:text-[#8C6239]"
  >
                          {prod.name}
                        </h4>
                        <button
    onClick={() => toggleWishlist(prod.id)}
    className="text-stone-400 hover:text-rose-500 p-1 transition-colors"
    title="Remove from saved"
  >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-stone-500">{prod.woodType}</p>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100 dark:border-stone-800">
                      <span className="text-xs font-bold text-[#8C6239] dark:text-[#C5A880]">
                        {formatPrice(prod.price)}
                      </span>
                      <button
    onClick={() => {
      addToCart(prod, 1);
      toggleWishlist(prod.id);
    }}
    className="px-2.5 py-1 bg-[#132629] dark:bg-[#C5A880] text-white dark:text-[#0B1617] text-[10px] font-semibold uppercase tracking-wider rounded flex items-center gap-1 hover:brightness-110 transition-all"
  >
                        <ShoppingBag className="w-3 h-3" /> Move to Bag
                      </button>
                    </div>
                  </div>
                </div>)}
          </div>

        </div>
      </div>
    </div>;
};
