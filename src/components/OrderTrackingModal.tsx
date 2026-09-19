import React, { useState } from 'react';
import { X, Search, CheckCircle2, Circle, Clock, MapPin, Truck, Phone, PackageCheck } from 'lucide-react';
import { useEcommerce } from '../context/EcommerceContext';

export const OrderTrackingModal: React.FC = () => {
  const {
    isOrderTrackingOpen,
    setIsOrderTrackingOpen,
    orders,
    trackingOrderId,
    setTrackingOrderId,
    formatPrice,
  } = useEcommerce();

  const [inputCode, setInputCode] = useState(trackingOrderId || 'HFM-89241');
  const [searchedId, setSearchedId] = useState(trackingOrderId || 'HFM-89241');

  if (!isOrderTrackingOpen) return null;

  const currentOrder = orders.find(
    (o) => o.id.toUpperCase() === searchedId.trim().toUpperCase()
  ) || orders[0];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim()) {
      setSearchedId(inputCode.trim());
      setTrackingOrderId(inputCode.trim());
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300';
      case 'Out for Delivery':
        return 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300';
      case 'In Crafting':
        return 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-300';
      default:
        return 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-300';
    }
  };

  return (
    <div className="fixed inset-0 z-[120] overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-950/75 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOrderTrackingOpen(false)}
      />

      <div className="flex min-h-full items-center justify-center p-3 sm:p-6">
        <div className="relative w-full max-w-2xl bg-[#FAF8F5] dark:bg-[#0E1A1C] rounded-2xl shadow-2xl border border-[#C5A880]/40 text-[#2C221E] dark:text-[#F2EFE9] overflow-hidden p-6 sm:p-8 transition-colors my-6">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#8C6239]/15 flex items-center justify-center text-[#8C6239] dark:text-[#C5A880]">
                <PackageCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
                  Live Atelier Commission Tracking
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Monitor timber seasoning, joinery, and white-glove dispatch in real time.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOrderTrackingOpen(false)}
              className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search bar & Quick Picks */}
          <div className="space-y-3 mb-6">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  placeholder="Enter Commission ID (e.g. HFM-89241)"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 uppercase font-mono focus:outline-none focus:border-[#C5A880]"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-[#132629] dark:bg-[#C5A880] text-white dark:text-[#0B1617] text-xs font-semibold uppercase tracking-wider rounded-lg hover:brightness-110 transition-colors"
              >
                Track
              </button>
            </form>

            {/* Quick selector buttons */}
            <div className="flex items-center gap-2 overflow-x-auto text-[11px]">
              <span className="text-stone-400 shrink-0">Recent Commissions:</span>
              {orders.slice(0, 4).map((ord) => (
                <button
                  key={ord.id}
                  onClick={() => {
                    setInputCode(ord.id);
                    setSearchedId(ord.id);
                  }}
                  className={`px-2.5 py-1 rounded font-mono shrink-0 transition-colors border ${
                    currentOrder?.id === ord.id
                      ? 'bg-[#8C6239] text-white border-[#8C6239]'
                      : 'bg-stone-200/60 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-300 dark:border-stone-700 hover:border-stone-400'
                  }`}
                >
                  {ord.id} ({ord.customerName.split(' ')[0]})
                </button>
              ))}
            </div>
          </div>

          {currentOrder ? (
            <div className="space-y-6">
              
              {/* Order Status Banner */}
              <div className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-stone-400 block font-mono">Commission ID</span>
                  <span className="font-mono text-base font-bold text-[#8C6239] dark:text-[#C5A880]">
                    {currentOrder.id}
                  </span>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Client: <strong>{currentOrder.customerName}</strong> • {currentOrder.city}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-wider text-stone-400 block">Current Stage</span>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(currentOrder.status)}`}>
                      {currentOrder.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dynamic Timeline */}
              <div className="bg-stone-100/70 dark:bg-stone-950/60 p-5 rounded-xl border border-stone-200 dark:border-stone-800">
                <h4 className="font-serif text-sm font-semibold text-stone-900 dark:text-stone-100 mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#8C6239] dark:text-[#C5A880]" />
                  Chattogram Workshop Timeline
                </h4>

                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-300 dark:before:bg-stone-700">
                  {currentOrder.trackingTimeline.map((step, idx) => (
                    <div key={idx} className="relative">
                      {/* Circle icon */}
                      <span className={`absolute -left-6 top-0.5 flex items-center justify-center w-5 h-5 rounded-full ${
                        step.done
                          ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950'
                          : 'text-stone-400 bg-stone-200 dark:bg-stone-800'
                      }`}>
                        {step.done ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-3 h-3" />}
                      </span>

                      <div>
                        <div className="flex items-center justify-between">
                          <h5 className={`text-xs font-semibold ${step.done ? 'text-stone-900 dark:text-stone-100' : 'text-stone-400'}`}>
                            {step.title}
                          </h5>
                          <span className="text-[10px] text-stone-400 font-mono">{step.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Items in this Order */}
              <div className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-2.5">
                <h4 className="font-serif text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Commissioned Atelier Items
                </h4>

                <div className="divide-y divide-stone-100 dark:divide-stone-800">
                  {currentOrder.items.map((item, i) => (
                    <div key={i} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-md shrink-0" />
                        <div>
                          <p className="font-semibold text-stone-900 dark:text-stone-100">{item.name}</p>
                          <p className="text-[11px] text-stone-500">
                            Qty: {item.quantity} • Finish: {item.selectedWoodFinish || 'Teak'}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-[#8C6239] dark:text-[#C5A880] shrink-0">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex justify-between text-xs font-bold">
                  <span>Commission Value</span>
                  <span className="text-[#8C6239] dark:text-[#C5A880]">{formatPrice(currentOrder.total)}</span>
                </div>
              </div>

              {/* Atelier Support Direct Contact */}
              <div className="p-3 bg-[#8C6239]/10 rounded-lg text-xs flex items-center justify-between text-stone-700 dark:text-stone-300">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#8C6239] dark:text-[#C5A880]" />
                  <span>Workshop Concierge: <strong>+880 1819-334455</strong> (Agrabad Showroom)</span>
                </div>
                <span className="text-[10px] uppercase font-semibold text-[#8C6239] dark:text-[#C5A880]">Open 10 AM - 9 PM</span>
              </div>

            </div>
          ) : (
            <div className="text-center py-12 text-stone-400">
              <p>No order found matching Commission ID "{searchedId}".</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
