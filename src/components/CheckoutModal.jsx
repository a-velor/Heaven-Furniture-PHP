import { useState } from "react";
import { X, ShieldCheck, Truck, CreditCard, Smartphone, Building, CheckCircle2, Lock, ArrowRight } from "lucide-react";
import { useEcommerce } from "../context/EcommerceContext";
export const CheckoutModal = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    subtotal,
    discountAmount,
    shippingFee,
    total,
    appliedCoupon,
    formatPrice,
    placeOrder
  } = useEcommerce();
  const [name, setName] = useState("Barrister Rafiqul Islam");
  const [phone, setPhone] = useState("+880 1819-234567");
  const [email, setEmail] = useState("rafiqul.islam@chattogram.law");
  const [address, setAddress] = useState("House 45, Road 2, South Khulshi Residential Area");
  const [city, setCity] = useState("Chattogram");
  const [postalCode, setPostalCode] = useState("4225");
  const [notes, setNotes] = useState("Third floor apartment. Freight elevator is operational on weekdays.");
  const [shippingMethod, setShippingMethod] = useState("white-glove");
  const [paymentMethod, setPaymentMethod] = useState("bkash");
  const [bkashTxn, setBkashTxn] = useState("8NA349K2X");
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  if (!isCheckoutOpen) return null;
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !phone || !address || !city) return;
    setIsSubmitting(true);
    setTimeout(() => {
      placeOrder({
        customerName: name,
        customerPhone: phone,
        customerEmail: email,
        shippingAddress: address,
        city,
        postalCode,
        deliveryNotes: notes,
        shippingMethod,
        paymentMethod
      });
      setIsSubmitting(false);
    }, 800);
  };
  return <div className="fixed inset-0 z-[120] overflow-y-auto">
      {
    /* Backdrop */
  }
      <div
    className="fixed inset-0 bg-stone-950/75 backdrop-blur-sm transition-opacity"
    onClick={() => setIsCheckoutOpen(false)}
  />

      <div className="flex min-h-full items-center justify-center p-3 sm:p-6">
        <div className="relative w-full max-w-3xl bg-[#FAF8F5] dark:bg-[#0E1A1C] rounded-xl shadow-2xl border border-[#C5A880]/40 text-[#2C221E] dark:text-[#F2EFE9] overflow-hidden transition-colors my-6">
          
          {
    /* Header */
  }
          <div className="p-6 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-100/70 dark:bg-stone-950/60">
            <div>
              <div className="flex items-center gap-2 text-[#8C6239] dark:text-[#C5A880] text-xs font-semibold uppercase tracking-wider mb-0.5">
                <Lock className="w-3.5 h-3.5" /> 256-Bit SSL Atelier Commission
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
                Finalize Bespoke Commission
              </h2>
            </div>
            <button
    onClick={() => setIsCheckoutOpen(false)}
    className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-full hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors"
  >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            
            {
    /* Step 1: Customer & Delivery Address */
  }
            <div className="space-y-4">
              <h3 className="font-serif text-base font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
                <Truck className="w-4 h-4 text-[#8C6239] dark:text-[#C5A880]" />
                1. Delivery Location & Client Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-medium mb-1 text-stone-700 dark:text-stone-300">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
    type="text"
    required
    value={name}
    onChange={(e) => setName(e.target.value)}
    className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 focus:outline-none focus:border-[#C5A880]"
  />
                </div>

                <div>
                  <label className="block font-medium mb-1 text-stone-700 dark:text-stone-300">
                    Direct Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
    type="tel"
    required
    value={phone}
    onChange={(e) => setPhone(e.target.value)}
    className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 focus:outline-none focus:border-[#C5A880]"
  />
                </div>

                <div>
                  <label className="block font-medium mb-1 text-stone-700 dark:text-stone-300">
                    Email Address (For CAD Updates & Receipts)
                  </label>
                  <input
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 focus:outline-none focus:border-[#C5A880]"
  />
                </div>

                <div>
                  <label className="block font-medium mb-1 text-stone-700 dark:text-stone-300">
                    Metropolitan City <span className="text-rose-500">*</span>
                  </label>
                  <select
    value={city}
    onChange={(e) => setCity(e.target.value)}
    className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 focus:outline-none focus:border-[#C5A880]"
  >
                    <option value="Chattogram">Chattogram (Agrabad, Khulshi, Nasirabad, GEC)</option>
                    <option value="Dhaka">Dhaka (Gulshan, Banani, Baridhara, Dhanmondi, Uttara)</option>
                    <option value="Sylhet">Sylhet Metropolitan</option>
                    <option value="Cox's Bazar">Cox's Bazar District</option>
                    <option value="Other">Other District in Bangladesh</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-medium mb-1 text-stone-700 dark:text-stone-300">
                    Detailed Residence / Villa Address <span className="text-rose-500">*</span>
                  </label>
                  <input
    type="text"
    required
    value={address}
    onChange={(e) => setAddress(e.target.value)}
    placeholder="Building name, Floor, Road, Area..."
    className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 focus:outline-none focus:border-[#C5A880]"
  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-medium mb-1 text-stone-700 dark:text-stone-300">
                    Delivery Instructions & Architectural Placement Notes
                  </label>
                  <textarea
    rows={2}
    value={notes}
    onChange={(e) => setNotes(e.target.value)}
    placeholder="Elevator dimension, stairwell turning radius, gate security protocols..."
    className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 focus:outline-none focus:border-[#C5A880]"
  />
                </div>
              </div>
            </div>

            {
    /* Step 2: Shipping & White-Glove Installation Method */
  }
            <div className="space-y-3">
              <h3 className="font-serif text-base font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
                <ShieldCheck className="w-4 h-4 text-[#8C6239] dark:text-[#C5A880]" />
                2. Shipping & Handling Protocol
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <label
    onClick={() => setShippingMethod("white-glove")}
    className={`p-3 rounded-lg border cursor-pointer transition-all flex flex-col justify-between ${shippingMethod === "white-glove" ? "border-[#8C6239] dark:border-[#C5A880] bg-[#8C6239]/10 ring-1 ring-[#C5A880]" : "border-stone-300 dark:border-stone-700 hover:border-stone-400"}`}
  >
                  <div>
                    <div className="font-semibold text-stone-900 dark:text-stone-100 flex items-center justify-between">
                      <span>White-Glove In-Home</span>
                      <CheckCircle2 className={`w-3.5 h-3.5 ${shippingMethod === "white-glove" ? "text-[#8C6239] dark:text-[#C5A880]" : "text-transparent"}`} />
                    </div>
                    <p className="text-[11px] text-stone-500 mt-1">
                      Unboxing, room placement, master carpenter leveling & full packaging removal.
                    </p>
                  </div>
                  <div className="mt-2 text-xs font-bold text-[#8C6239] dark:text-[#C5A880]">
                    {shippingFee === 0 ? "Complimentary" : formatPrice(shippingFee)}
                  </div>
                </label>

                <label
    onClick={() => setShippingMethod("freight")}
    className={`p-3 rounded-lg border cursor-pointer transition-all flex flex-col justify-between ${shippingMethod === "freight" ? "border-[#8C6239] dark:border-[#C5A880] bg-[#8C6239]/10 ring-1 ring-[#C5A880]" : "border-stone-300 dark:border-stone-700 hover:border-stone-400"}`}
  >
                  <div>
                    <div className="font-semibold text-stone-900 dark:text-stone-100 flex items-center justify-between">
                      <span>Express Crated Freight</span>
                      <CheckCircle2 className={`w-3.5 h-3.5 ${shippingMethod === "freight" ? "text-[#8C6239] dark:text-[#C5A880]" : "text-transparent"}`} />
                    </div>
                    <p className="text-[11px] text-stone-500 mt-1">
                      Heavy-duty timber crating delivered to property curb/loading dock.
                    </p>
                  </div>
                  <div className="mt-2 text-xs font-bold text-stone-600 dark:text-stone-300">
                    Included Free
                  </div>
                </label>

                <label
    onClick={() => setShippingMethod("pickup")}
    className={`p-3 rounded-lg border cursor-pointer transition-all flex flex-col justify-between ${shippingMethod === "pickup" ? "border-[#8C6239] dark:border-[#C5A880] bg-[#8C6239]/10 ring-1 ring-[#C5A880]" : "border-stone-300 dark:border-stone-700 hover:border-stone-400"}`}
  >
                  <div>
                    <div className="font-semibold text-stone-900 dark:text-stone-100 flex items-center justify-between">
                      <span>Agrabad Studio Pick-up</span>
                      <CheckCircle2 className={`w-3.5 h-3.5 ${shippingMethod === "pickup" ? "text-[#8C6239] dark:text-[#C5A880]" : "text-transparent"}`} />
                    </div>
                    <p className="text-[11px] text-stone-500 mt-1">
                      Pick up directly from Heaven Furniture Mart, Agrabad Access Road.
                    </p>
                  </div>
                  <div className="mt-2 text-xs font-bold text-stone-600 dark:text-stone-300">
                    Free
                  </div>
                </label>
              </div>
            </div>

            {
    /* Step 3: Payment Method Selection */
  }
            <div className="space-y-3">
              <h3 className="font-serif text-base font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
                <CreditCard className="w-4 h-4 text-[#8C6239] dark:text-[#C5A880]" />
                3. Secure Payment & Deposit Method
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                {
    /* bKash */
  }
                <button
    type="button"
    onClick={() => setPaymentMethod("bkash")}
    className={`p-3 rounded border text-left flex flex-col justify-between transition-all ${paymentMethod === "bkash" ? "border-pink-600 bg-pink-50/50 dark:bg-pink-950/30 text-pink-900 dark:text-pink-100 font-semibold ring-1 ring-pink-500" : "border-stone-300 dark:border-stone-700"}`}
  >
                  <div className="flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-pink-600" />
                    <span>bKash Merchant</span>
                  </div>
                  <span className="text-[10px] text-stone-500 mt-2">Instant Merchant Trx</span>
                </button>

                {
    /* Nagad */
  }
                <button
    type="button"
    onClick={() => setPaymentMethod("nagad")}
    className={`p-3 rounded border text-left flex flex-col justify-between transition-all ${paymentMethod === "nagad" ? "border-orange-600 bg-orange-50/50 dark:bg-orange-950/30 text-orange-900 dark:text-orange-100 font-semibold ring-1 ring-orange-500" : "border-stone-300 dark:border-stone-700"}`}
  >
                  <div className="flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-orange-600" />
                    <span>Nagad Express</span>
                  </div>
                  <span className="text-[10px] text-stone-500 mt-2">Post Office Digital</span>
                </button>

                {
    /* Credit Card */
  }
                <button
    type="button"
    onClick={() => setPaymentMethod("card")}
    className={`p-3 rounded border text-left flex flex-col justify-between transition-all ${paymentMethod === "card" ? "border-[#8C6239] dark:border-[#C5A880] bg-[#8C6239]/10 font-semibold ring-1 ring-[#C5A880]" : "border-stone-300 dark:border-stone-700"}`}
  >
                  <div className="flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-[#8C6239] dark:text-[#C5A880]" />
                    <span>Visa / Master</span>
                  </div>
                  <span className="text-[10px] text-stone-500 mt-2">SSL Commerz Gateway</span>
                </button>

                {
    /* Bank / Wire */
  }
                <button
    type="button"
    onClick={() => setPaymentMethod("bank_transfer")}
    className={`p-3 rounded border text-left flex flex-col justify-between transition-all ${paymentMethod === "bank_transfer" ? "border-[#8C6239] dark:border-[#C5A880] bg-[#8C6239]/10 font-semibold ring-1 ring-[#C5A880]" : "border-stone-300 dark:border-stone-700"}`}
  >
                  <div className="flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-[#8C6239] dark:text-[#C5A880]" />
                    <span>Bank Transfer</span>
                  </div>
                  <span className="text-[10px] text-stone-500 mt-2">City Bank Agrabad Br.</span>
                </button>
              </div>

              {
    /* Payment Details Box */
  }
              {paymentMethod === "bkash" && <div className="p-3 bg-pink-50/70 dark:bg-pink-950/20 border border-pink-200 dark:border-pink-900 rounded text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-pink-900 dark:text-pink-200">
                      bKash Merchant Number: <strong>01819-224488</strong>
                    </span>
                    <span className="text-[10px] bg-pink-200 dark:bg-pink-900 text-pink-900 dark:text-pink-200 px-2 py-0.5 rounded">
                      Reference: HFM-CART
                    </span>
                  </div>
                  <p className="text-[11px] text-pink-800 dark:text-pink-300">
                    Use bKash "Make Payment" or App scanner. Enter the resulting 8-digit Transaction ID below:
                  </p>
                  <input
    type="text"
    value={bkashTxn}
    onChange={(e) => setBkashTxn(e.target.value)}
    placeholder="Enter bKash TrxID (e.g. 8NA349K2X)"
    className="w-full px-3 py-1.5 bg-white dark:bg-stone-900 border border-pink-300 dark:border-pink-800 rounded font-mono text-xs uppercase"
  />
                </div>}

              {paymentMethod === "bank_transfer" && <div className="p-3 bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded text-xs space-y-1 text-stone-700 dark:text-stone-300">
                  <p><strong>Account Name:</strong> HEAVEN FURNITURE MART</p>
                  <p><strong>Bank:</strong> The City Bank Limited, Agrabad Corporate Branch, Chattogram</p>
                  <p><strong>Account Number:</strong> 1102938475001 | <strong>Routing:</strong> 225150893</p>
                </div>}
            </div>

            {
    /* Step 4: Order Summary Table */
  }
            <div className="p-4 bg-stone-100/70 dark:bg-stone-950/60 rounded-lg border border-stone-200 dark:border-stone-800 space-y-3">
              <h4 className="font-serif text-sm font-semibold text-stone-900 dark:text-stone-100">
                Order Review ({cart.length} item{cart.length > 1 ? "s" : ""})
              </h4>
              
              <div className="max-h-36 overflow-y-auto divide-y divide-stone-200 dark:divide-stone-800 text-xs">
                {cart.map((item) => <div key={item.cartId} className="py-2 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded shrink-0" />
                      <div className="truncate">
                        <p className="font-medium truncate text-stone-900 dark:text-stone-100">{item.name}</p>
                        <p className="text-[10px] text-stone-500">
                          Qty: {item.quantity} • {item.selectedWoodFinish}
                        </p>
                      </div>
                    </div>
                    <span className="font-semibold text-stone-900 dark:text-stone-100 shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>)}
              </div>

              {
    /* Total Calculation */
  }
              <div className="pt-2 border-t border-stone-200 dark:border-stone-800 space-y-1 text-xs">
                <div className="flex justify-between text-stone-500">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discountAmount > 0 && <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Promo Voucher ({appliedCoupon?.code})</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>}
                <div className="flex justify-between text-stone-500">
                  <span>White-Glove Logistics</span>
                  <span>{shippingFee === 0 ? "Complimentary" : formatPrice(shippingFee)}</span>
                </div>
                <div className="flex justify-between font-serif text-base font-bold text-stone-900 dark:text-stone-100 pt-2 border-t border-stone-300 dark:border-stone-700">
                  <span>Payable Atelier Total</span>
                  <span className="text-[#8C6239] dark:text-[#C5A880]">{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            {
    /* Agreement & Submit */
  }
            <div className="space-y-4">
              <label className="flex items-start gap-2 text-xs text-stone-600 dark:text-stone-400 cursor-pointer">
                <input
    type="checkbox"
    checked={agreeTerms}
    onChange={(e) => setAgreeTerms(e.target.checked)}
    className="mt-0.5 rounded text-[#8C6239] focus:ring-[#C5A880]"
  />
                <span>
                  I approve the bespoke workshop order specs and understand each piece is hand-seasoned and joined to order in Chattogram under Heaven Furniture Mart's lifetime craftsmanship guarantee.
                </span>
              </label>

              <button
    type="submit"
    disabled={!agreeTerms || isSubmitting}
    className="w-full py-3.5 px-6 bg-gradient-to-r from-[#132629] via-[#1f383c] to-[#132629] dark:from-[#C5A880] dark:via-[#dfc399] dark:to-[#C5A880] text-white dark:text-[#0B1617] font-semibold text-xs uppercase tracking-[0.2em] rounded-lg shadow-lg hover:brightness-110 active:scale-[0.99] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
  >
                {isSubmitting ? <span>Transmitting Commission to Atelier...</span> : <>
                    <span>Confirm Order ({formatPrice(total)})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>}
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>;
};
