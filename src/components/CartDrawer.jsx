import { useState } from "react";
import { X, ShoppingBag, Trash2, ArrowRight, ShieldCheck, Truck, Sparkles, Tag, Check } from "lucide-react";
import { useEcommerce } from "../context/EcommerceContext";
export const CartDrawer = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    formatPrice,
    subtotal,
    discountAmount,
    shippingFee,
    total,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    setIsCheckoutOpen,
    setActiveView
  } = useEcommerce();
  const [couponInput, setCouponInput] = useState("");
  const [couponFeedback, setCouponFeedback] = useState(null);
  if (!isCartOpen) return null;
  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponFeedback({ success: res.success, text: res.message });
    if (res.success) {
      setCouponInput("");
    }
  };
  const freeShippingThreshold = 1e5;
  const progressPercent = Math.min(100, Math.round(subtotal / freeShippingThreshold * 100));
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  return <div className="fixed inset-0 z-[100] overflow-hidden">
      {
    /* Backdrop */
  }
      <div
    className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity"
    onClick={() => setIsCartOpen(false)}
  />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF8F5] dark:bg-[#0E1A1C] border-l border-[#C5A880]/30 shadow-2xl flex flex-col text-[#2C221E] dark:text-[#F2EFE9] transition-colors">
          
          {
    /* Header */
  }
          <div className="p-6 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-100/50 dark:bg-stone-900/50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#C5A880]/20 flex items-center justify-center text-[#8C6239] dark:text-[#C5A880]">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-lg font-bold tracking-wide">Atelier Cart</h2>
                <p className="text-[11px] uppercase tracking-wider text-[#8C6239] dark:text-[#C5A880]">
                  {cart.length} {cart.length === 1 ? "Handcrafted Piece" : "Handcrafted Pieces"}
                </p>
              </div>
            </div>
            <button
    onClick={() => setIsCartOpen(false)}
    className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors rounded-full hover:bg-stone-200/50 dark:hover:bg-stone-800"
    aria-label="Close cart"
  >
              <X className="w-5 h-5" />
            </button>
          </div>

          {
    /* Free Shipping Progress Indicator */
  }
          <div className="bg-[#FAF8F5] dark:bg-[#0B1617] px-6 py-3 border-b border-stone-200/80 dark:border-stone-800/80">
            <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
              <span className="flex items-center gap-1.5 text-stone-600 dark:text-stone-300">
                <Truck className="w-3.5 h-3.5 text-[#8C6239] dark:text-[#C5A880]" />
                White-Glove In-Home Installation:
              </span>
              <span className="text-[#8C6239] dark:text-[#C5A880] font-semibold">
                {remainingForFreeShipping === 0 ? "Qualified (Free)" : `Add ${formatPrice(remainingForFreeShipping)} more`}
              </span>
            </div>
            <div className="w-full bg-stone-200 dark:bg-stone-800 h-1.5 rounded-full overflow-hidden">
              <div
    className="bg-gradient-to-r from-[#8C6239] to-[#C5A880] h-full transition-all duration-300 rounded-full"
    style={{ width: `${progressPercent}%` }}
  />
            </div>
          </div>

          {
    /* Cart Items List */
  }
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-stone-200/60 dark:bg-stone-800/60 flex items-center justify-center text-stone-400 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-stone-800 dark:text-stone-100">
                  Your atelier bag is empty
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-xs">
                  Explore our handcrafted Chittagong Teak living suites, master beds, and bespoke collections.
                </p>
                <button
    onClick={() => {
      setIsCartOpen(false);
      setActiveView("catalog");
    }}
    className="mt-6 px-6 py-2.5 bg-[#132629] dark:bg-[#FAF8F5] text-white dark:text-[#132629] text-xs font-semibold uppercase tracking-wider rounded hover:bg-[#8C6239] dark:hover:bg-[#C5A880] transition-colors"
  >
                  Explore Catalog
                </button>
              </div> : cart.map((item) => <div
    key={item.cartId}
    className="flex gap-4 p-3.5 rounded-lg bg-white/80 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800/80 shadow-xs"
  >
                  {
    /* Thumbnail */
  }
                  <img
    src={item.image}
    alt={item.name}
    className="w-20 h-20 object-cover rounded-md border border-stone-200/60 dark:border-stone-800 shrink-0"
  />

                  {
    /* Item Details */
  }
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-serif text-sm font-semibold truncate text-stone-900 dark:text-stone-100">
                          {item.name}
                        </h4>
                        <button
    onClick={() => removeFromCart(item.cartId)}
    className="text-stone-400 hover:text-rose-500 transition-colors p-1"
    title="Remove item"
  >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {
    /* Customization Specs */
  }
                      <div className="mt-1 space-y-0.5 text-[10px] text-stone-500 dark:text-stone-400">
                        {item.selectedWoodFinish && <p className="truncate">
                            <span className="font-medium text-stone-700 dark:text-stone-300">Finish:</span> {item.selectedWoodFinish}
                          </p>}
                        {item.selectedUpholstery && <p className="truncate">
                            <span className="font-medium text-stone-700 dark:text-stone-300">Fabric:</span> {item.selectedUpholstery}
                          </p>}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100 dark:border-stone-800/60">
                      {
    /* Quantity Selector */
  }
                      <div className="flex items-center border border-stone-200 dark:border-stone-700 rounded overflow-hidden">
                        <button
    onClick={() => updateCartQuantity(item.cartId, -1)}
    className="px-2 py-0.5 text-xs text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
  >
                          -
                        </button>
                        <span className="px-2.5 py-0.5 text-xs font-semibold text-stone-900 dark:text-stone-100 bg-stone-50 dark:bg-stone-900">
                          {item.quantity}
                        </span>
                        <button
    onClick={() => updateCartQuantity(item.cartId, 1)}
    className="px-2 py-0.5 text-xs text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
  >
                          +
                        </button>
                      </div>

                      {
    /* Item Total */
  }
                      <div className="text-right">
                        <span className="text-xs font-bold text-[#8C6239] dark:text-[#C5A880]">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>)}
          </div>

          {
    /* Footer & Checkout Area */
  }
          {cart.length > 0 && <div className="p-6 border-t border-stone-200 dark:border-stone-800 bg-white/70 dark:bg-stone-900/80 backdrop-blur-sm space-y-4">
              
              {
    /* Coupon input */
  }
              <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
    type="text"
    value={couponInput}
    onChange={(e) => setCouponInput(e.target.value)}
    placeholder="Promo voucher (e.g. HEAVEN10)"
    className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-stone-800 dark:text-stone-200 placeholder-stone-400 focus:outline-none focus:border-[#C5A880]"
  />
                  </div>
                  <button
    type="submit"
    className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider bg-stone-200 dark:bg-stone-700 hover:bg-[#C5A880] hover:text-white dark:hover:bg-[#C5A880] transition-colors rounded"
  >
                    Apply
                  </button>
                </div>

                {appliedCoupon && <div className="flex items-center justify-between text-[11px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded">
                    <span className="flex items-center gap-1">
                      <Check className="w-3 h-3" /> Voucher <strong>{appliedCoupon.code}</strong> active
                    </span>
                    <button
    type="button"
    onClick={removeCoupon}
    className="text-stone-400 hover:text-rose-500 text-[10px] underline ml-2"
  >
                      Remove
                    </button>
                  </div>}

                {couponFeedback && !appliedCoupon && <p className="text-[11px] text-rose-500">{couponFeedback.text}</p>}
              </form>

              {
    /* Price Calculations */
  }
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-stone-500 dark:text-stone-400">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discountAmount > 0 && <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                    <span>Voucher Discount</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>}
                <div className="flex justify-between text-stone-500 dark:text-stone-400">
                  <span>White-Glove Delivery</span>
                  <span>{shippingFee === 0 ? "Complimentary" : formatPrice(shippingFee)}</span>
                </div>
                <div className="flex justify-between font-serif text-base font-bold text-stone-900 dark:text-stone-100 pt-2 border-t border-stone-200 dark:border-stone-800">
                  <span>Total Amount</span>
                  <span className="text-[#8C6239] dark:text-[#C5A880]">{formatPrice(total)}</span>
                </div>
              </div>

              {
    /* Action Buttons */
  }
              <div className="space-y-2 pt-1">
                <button
    onClick={() => {
      setIsCartOpen(false);
      setIsCheckoutOpen(true);
    }}
    className="w-full py-3 px-4 bg-gradient-to-r from-[#132629] via-[#1f383c] to-[#132629] dark:from-[#C5A880] dark:via-[#dfc399] dark:to-[#C5A880] text-white dark:text-[#0B1617] font-semibold text-xs uppercase tracking-[0.2em] rounded shadow-md hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
  >
                  <span>Proceed to Commission / Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-center gap-4 text-[10px] text-stone-500 dark:text-stone-400 pt-1">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-[#8C6239] dark:text-[#C5A880]" /> Lifetime Joinery Guarantee
                  </span>
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#8C6239] dark:text-[#C5A880]" /> Kiln-Dried Teak
                  </span>
                </div>
              </div>

            </div>}

        </div>
      </div>
    </div>;
};
