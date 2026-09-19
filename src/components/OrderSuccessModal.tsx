import React from 'react';
import { CheckCircle2, PackageCheck, Printer, ArrowRight, X, Clock, MapPin } from 'lucide-react';
import { useEcommerce } from '../context/EcommerceContext';

export const OrderSuccessModal: React.FC = () => {
  const {
    confirmedOrder,
    setConfirmedOrder,
    formatPrice,
    setIsOrderTrackingOpen,
    setTrackingOrderId,
  } = useEcommerce();

  if (!confirmedOrder) return null;

  const handleTrack = () => {
    setTrackingOrderId(confirmedOrder.id);
    setIsOrderTrackingOpen(true);
    setConfirmedOrder(null);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[130] overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-950/80 backdrop-blur-md transition-opacity"
        onClick={() => setConfirmedOrder(null)}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-lg bg-[#FAF8F5] dark:bg-[#0E1A1C] rounded-2xl shadow-2xl border border-[#C5A880]/50 text-[#2C221E] dark:text-[#F2EFE9] overflow-hidden p-6 sm:p-8 transition-colors my-6">
          
          <button
            onClick={() => setConfirmedOrder(null)}
            className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Success Icon */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div className="inline-block px-3 py-1 bg-[#8C6239]/10 text-[#8C6239] dark:text-[#C5A880] text-[10px] font-bold tracking-widest uppercase rounded-full">
              Atelier Commission Authenticated
            </div>
            <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100">
              Thank You, {confirmedOrder.customerName.split(' ')[0]}
            </h2>
            <p className="text-xs text-stone-600 dark:text-stone-400 max-w-xs mx-auto">
              Your order has been logged with our master craftsmen in Chattogram. Production lumber staging has commenced.
            </p>
          </div>

          {/* Order Details Card */}
          <div className="mt-6 p-4 rounded-xl bg-white dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-2">
              <div>
                <span className="text-[10px] uppercase text-stone-400 block font-mono">Commission ID</span>
                <span className="font-mono font-bold text-[#8C6239] dark:text-[#C5A880] text-sm">
                  {confirmedOrder.id}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase text-stone-400 block">Total Amount</span>
                <span className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                  {formatPrice(confirmedOrder.total)}
                </span>
              </div>
            </div>

            <div className="space-y-1.5 text-stone-600 dark:text-stone-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#8C6239] dark:text-[#C5A880] shrink-0 mt-0.5" />
                <span>
                  {confirmedOrder.shippingAddress}, {confirmedOrder.city}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#8C6239] dark:text-[#C5A880] shrink-0" />
                <span>Status: <strong className="text-emerald-600 dark:text-emerald-400">{confirmedOrder.status}</strong></span>
              </div>
            </div>

            {/* Items summary */}
            <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
              <span className="text-[10px] uppercase tracking-wider text-stone-400 block mb-1">Commissioned Items</span>
              <div className="space-y-1">
                {confirmedOrder.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between text-[11px]">
                    <span className="text-stone-800 dark:text-stone-200 truncate max-w-[240px]">
                      {it.quantity}x {it.name}
                    </span>
                    <span className="font-semibold text-stone-900 dark:text-stone-100">
                      {formatPrice(it.price * it.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-6 space-y-2">
            <button
              onClick={handleTrack}
              className="w-full py-3 px-4 bg-[#132629] dark:bg-[#C5A880] text-white dark:text-[#0B1617] font-semibold text-xs uppercase tracking-wider rounded-lg shadow hover:brightness-110 flex items-center justify-center gap-2 transition-all"
            >
              <PackageCheck className="w-4 h-4" />
              <span>Track Atelier Progress Live</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handlePrint}
                className="py-2.5 px-3 border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Invoice</span>
              </button>
              <button
                onClick={() => setConfirmedOrder(null)}
                className="py-2.5 px-3 border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-semibold rounded-lg flex items-center justify-center transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
