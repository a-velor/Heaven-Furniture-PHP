import React, { useState } from 'react';
import { X, Star, Heart, Check, ShieldCheck, Ruler, Truck, Sparkles, MessageSquare, Send } from 'lucide-react';
import { useEcommerce } from '../context/EcommerceContext';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProduct,
    setSelectedProduct,
    formatPrice,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setIsCheckoutOpen,
    getProductReviews,
    addReview,
  } = useEcommerce();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedWood, setSelectedWood] = useState<string>('');
  const [selectedFabric, setSelectedFabric] = useState<string>('');
  const [selectedHw, setSelectedHw] = useState<string>('');
  const [customNotes, setCustomNotes] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');

  // Review form state
  const [revAuthor, setRevAuthor] = useState('');
  const [revRating, setRevRating] = useState(5);
  const [revTitle, setRevTitle] = useState('');
  const [revComment, setRevComment] = useState('');
  const [revLocation, setRevLocation] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  if (!selectedProduct) return null;

  // Initialize options with product defaults
  const currentWood = selectedWood || selectedProduct.woodFinishOptions?.[0] || selectedProduct.woodType;
  const currentFabric = selectedFabric || selectedProduct.upholsteryOptions?.[0] || 'Standard Selection';
  const currentHw = selectedHw || selectedProduct.hardwareOptions?.[0] || 'Brushed Champagne Brass';

  const allImages = [
    selectedProduct.image,
    ...(selectedProduct.additionalImages || []),
  ];

  const inWish = isInWishlist(selectedProduct.id);
  const reviews = getProductReviews(selectedProduct.id);

  const handleAddToCart = () => {
    addToCart(selectedProduct, quantity, {
      woodFinish: currentWood,
      upholstery: currentFabric,
      hardware: currentHw,
      customNotes,
    });
  };

  const handleBuyNow = () => {
    addToCart(selectedProduct, quantity, {
      woodFinish: currentWood,
      upholstery: currentFabric,
      hardware: currentHw,
      customNotes,
    });
    setSelectedProduct(null);
    setIsCheckoutOpen(true);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revAuthor.trim() || !revComment.trim()) return;
    addReview({
      productId: selectedProduct.id,
      author: revAuthor,
      rating: revRating,
      title: revTitle || 'Exquisite quality',
      comment: revComment,
      verifiedBuyer: true,
      location: revLocation || 'Chattogram, Bangladesh',
    });
    setReviewSubmitted(true);
    setRevAuthor('');
    setRevTitle('');
    setRevComment('');
    setRevLocation('');
    setTimeout(() => setReviewSubmitted(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-[110] overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-950/70 backdrop-blur-sm transition-opacity"
        onClick={() => setSelectedProduct(null)}
      />

      <div className="flex min-h-full items-center justify-center p-3 sm:p-6">
        <div className="relative w-full max-w-4xl bg-[#FAF8F5] dark:bg-[#0E1A1C] rounded-xl shadow-2xl border border-[#C5A880]/30 text-[#2C221E] dark:text-[#F2EFE9] overflow-hidden transition-colors my-8">
          
          {/* Close button */}
          <button
            onClick={() => setSelectedProduct(null)}
            className="absolute top-4 right-4 z-20 p-2 text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-100 bg-white/70 dark:bg-stone-900/80 rounded-full backdrop-blur-xs transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
            {/* Left Column: Gallery */}
            <div className="md:col-span-6 bg-stone-100 dark:bg-stone-950/50 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-stone-200 dark:border-stone-800">
              <div className="space-y-4">
                {/* Main Hero Image */}
                <div className="relative aspect-4/3 rounded-lg overflow-hidden border border-stone-200 dark:border-stone-800 shadow-xs group">
                  <img
                    src={allImages[activeImageIndex] || selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {selectedProduct.highlightTag && (
                    <span className="absolute top-3 left-3 px-3 py-1 bg-[#132629]/90 dark:bg-[#C5A880]/90 text-white dark:text-[#0B1617] text-[10px] font-bold tracking-widest uppercase rounded">
                      {selectedProduct.highlightTag}
                    </span>
                  )}
                  <button
                    onClick={() => toggleWishlist(selectedProduct.id)}
                    className="absolute top-3 right-3 p-2 bg-white/80 dark:bg-stone-900/80 rounded-full text-stone-600 dark:text-stone-300 hover:text-rose-500 transition-colors shadow-xs"
                    aria-label="Wishlist"
                  >
                    <Heart className={`w-4 h-4 ${inWish ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>
                </div>

                {/* Thumbnails */}
                {allImages.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {allImages.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`relative w-16 h-16 rounded-md overflow-hidden border-2 shrink-0 transition-all ${
                          activeImageIndex === idx
                            ? 'border-[#C5A880] ring-1 ring-[#C5A880]'
                            : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Atelier Quality Badges */}
              <div className="pt-6 border-t border-stone-200 dark:border-stone-800/80 grid grid-cols-2 gap-3 text-[11px] text-stone-600 dark:text-stone-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#8C6239] dark:text-[#C5A880] shrink-0" />
                  <span>Lifetime Joinery Guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#8C6239] dark:text-[#C5A880] shrink-0" />
                  <span>100% Kiln-Seasoned Teak</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#8C6239] dark:text-[#C5A880] shrink-0" />
                  <span>White-Glove Placement</span>
                </div>
                <div className="flex items-center gap-2">
                  <Ruler className="w-4 h-4 text-[#8C6239] dark:text-[#C5A880] shrink-0" />
                  <span>Custom Dimension Service</span>
                </div>
              </div>
            </div>

            {/* Right Column: Information & Actions */}
            <div className="md:col-span-6 p-6 md:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
              <div>
                {/* SKU and Category */}
                <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-1">
                  <span className="uppercase tracking-widest font-semibold text-[#8C6239] dark:text-[#C5A880]">
                    {selectedProduct.categoryLabel}
                  </span>
                  <span className="font-mono text-[11px]">{selectedProduct.sku}</span>
                </div>

                {/* Title */}
                <h1 className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
                  {selectedProduct.name}
                </h1>

                {/* Rating & Stock */}
                <div className="flex items-center gap-4 mt-2 mb-4">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-4 h-4 fill-amber-500" />
                    <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
                      {(selectedProduct.rating || 5.0).toFixed(1)}
                    </span>
                    <span className="text-xs text-stone-500">
                      ({selectedProduct.reviewCount || 0} verified reviews)
                    </span>
                  </div>
                  <span className="text-stone-300 dark:text-stone-700">•</span>
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <Check className="w-3 h-3" /> {selectedProduct.stock} Available in Atelier
                  </span>
                </div>

                {/* Pricing */}
                <div className="flex items-baseline gap-3 p-3 bg-stone-100/60 dark:bg-stone-900/60 rounded-lg border border-stone-200 dark:border-stone-800 mb-5">
                  <span className="text-2xl font-serif font-bold text-[#8C6239] dark:text-[#C5A880]">
                    {formatPrice(selectedProduct.price)}
                  </span>
                  {selectedProduct.originalPrice && selectedProduct.originalPrice > selectedProduct.price && (
                    <span className="text-sm line-through text-stone-400 dark:text-stone-500">
                      {formatPrice(selectedProduct.originalPrice)}
                    </span>
                  )}
                  {selectedProduct.originalPrice && (
                    <span className="ml-auto text-[10px] font-semibold uppercase tracking-wider bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded">
                      Save {formatPrice(selectedProduct.originalPrice - selectedProduct.price)}
                    </span>
                  )}
                </div>

                {/* Tab Switcher */}
                <div className="flex border-b border-stone-200 dark:border-stone-800 mb-4 text-xs font-semibold uppercase tracking-wider">
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`pb-2 mr-6 transition-colors border-b-2 ${
                      activeTab === 'details'
                        ? 'border-[#8C6239] dark:border-[#C5A880] text-stone-900 dark:text-stone-100'
                        : 'border-transparent text-stone-400 hover:text-stone-600 dark:hover:text-stone-300'
                    }`}
                  >
                    Craftsmanship & Specs
                  </button>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`pb-2 transition-colors border-b-2 ${
                      activeTab === 'reviews'
                        ? 'border-[#8C6239] dark:border-[#C5A880] text-stone-900 dark:text-stone-100'
                        : 'border-transparent text-stone-400 hover:text-stone-600 dark:hover:text-stone-300'
                    }`}
                  >
                    Client Reviews ({reviews.length})
                  </button>
                </div>

                {activeTab === 'details' ? (
                  <div className="space-y-4 text-xs text-stone-600 dark:text-stone-300">
                    <p className="leading-relaxed">{selectedProduct.description}</p>

                    {/* Wood Finish Options */}
                    {selectedProduct.woodFinishOptions && selectedProduct.woodFinishOptions.length > 0 && (
                      <div>
                        <label className="block font-semibold text-stone-800 dark:text-stone-200 mb-1.5">
                          Wood Specie & Hand Finish: <span className="text-[#8C6239] dark:text-[#C5A880] font-normal">{currentWood}</span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {selectedProduct.woodFinishOptions.map((w) => (
                            <button
                              key={w}
                              type="button"
                              onClick={() => setSelectedWood(w)}
                              className={`px-3 py-1.5 rounded text-[11px] border transition-all ${
                                currentWood === w
                                  ? 'border-[#8C6239] dark:border-[#C5A880] bg-[#8C6239]/10 text-stone-900 dark:text-stone-100 font-semibold'
                                  : 'border-stone-300 dark:border-stone-700 hover:border-stone-400'
                              }`}
                            >
                              {w}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Upholstery Options */}
                    {selectedProduct.upholsteryOptions && selectedProduct.upholsteryOptions.length > 0 && (
                      <div>
                        <label className="block font-semibold text-stone-800 dark:text-stone-200 mb-1.5">
                          Upholstery / Top Material: <span className="text-[#8C6239] dark:text-[#C5A880] font-normal">{currentFabric}</span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {selectedProduct.upholsteryOptions.map((u) => (
                            <button
                              key={u}
                              type="button"
                              onClick={() => setSelectedFabric(u)}
                              className={`px-3 py-1.5 rounded text-[11px] border transition-all ${
                                currentFabric === u
                                  ? 'border-[#8C6239] dark:border-[#C5A880] bg-[#8C6239]/10 text-stone-900 dark:text-stone-100 font-semibold'
                                  : 'border-stone-300 dark:border-stone-700 hover:border-stone-400'
                              }`}
                            >
                              {u}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Dimensions & Specifications */}
                    <div className="bg-stone-100/60 dark:bg-stone-900/60 p-3 rounded border border-stone-200 dark:border-stone-800 space-y-1 text-[11px]">
                      <div>
                        <strong className="text-stone-800 dark:text-stone-200">Dimensions: </strong>
                        {selectedProduct.dimensions}
                      </div>
                      <div>
                        <strong className="text-stone-800 dark:text-stone-200">Core Hardwood: </strong>
                        {selectedProduct.woodType}
                      </div>
                      <div>
                        <strong className="text-stone-800 dark:text-stone-200">Featured Materials: </strong>
                        {selectedProduct.materials.join(' • ')}
                      </div>
                    </div>

                    {/* Bespoke Custom Notes */}
                    <div>
                      <label className="block font-semibold text-stone-800 dark:text-stone-200 mb-1">
                        Bespoke Request or Floor Plan Notes (Optional):
                      </label>
                      <input
                        type="text"
                        value={customNotes}
                        onChange={(e) => setCustomNotes(e.target.value)}
                        placeholder="e.g. Needs to fit 14ft living wall; right-facing chaise..."
                        className="w-full px-3 py-1.5 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded text-xs focus:outline-none focus:border-[#C5A880]"
                      />
                    </div>
                  </div>
                ) : (
                  /* Reviews Tab */
                  <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
                    {/* Review Submission Form */}
                    <form onSubmit={handleReviewSubmit} className="p-3 bg-stone-100 dark:bg-stone-900 rounded border border-stone-200 dark:border-stone-800 space-y-2">
                      <p className="font-serif font-semibold text-xs text-stone-900 dark:text-stone-100">Write an Atelier Review</p>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          required
                          placeholder="Your Name"
                          value={revAuthor}
                          onChange={(e) => setRevAuthor(e.target.value)}
                          className="px-2.5 py-1 text-xs bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded"
                        />
                        <input
                          type="text"
                          placeholder="Location (e.g. Khulshi, CTG)"
                          value={revLocation}
                          onChange={(e) => setRevLocation(e.target.value)}
                          className="px-2.5 py-1 text-xs bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded"
                        />
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        <span>Rating:</span>
                        <div className="flex gap-1 text-amber-500">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setRevRating(s)}
                              className="focus:outline-none"
                            >
                              <Star className={`w-3.5 h-3.5 ${s <= revRating ? 'fill-amber-500' : 'text-stone-400'}`} />
                            </button>
                          ))}
                        </div>
                      </div>

                      <textarea
                        required
                        rows={2}
                        placeholder="Share your experience with wood grain, delivery, and craftsmanship..."
                        value={revComment}
                        onChange={(e) => setRevComment(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded"
                      />

                      <button
                        type="submit"
                        className="px-3 py-1 bg-[#132629] dark:bg-[#C5A880] text-white dark:text-[#132629] text-[11px] font-semibold rounded hover:brightness-110 flex items-center gap-1"
                      >
                        <Send className="w-3 h-3" /> Submit Review
                      </button>

                      {reviewSubmitted && (
                        <p className="text-[11px] text-emerald-600 font-medium">Thank you! Your review has been recorded.</p>
                      )}
                    </form>

                    {/* Review List */}
                    <div className="space-y-3">
                      {reviews.length === 0 ? (
                        <p className="text-xs text-stone-500 italic">No reviews yet for this piece. Be the first to review!</p>
                      ) : (
                        reviews.map((rev) => (
                          <div key={rev.id} className="border-b border-stone-200 dark:border-stone-800 pb-2.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-semibold text-stone-900 dark:text-stone-100">{rev.author}</span>
                              <span className="text-[10px] text-stone-400">{rev.date}</span>
                            </div>
                            <div className="flex items-center gap-1 text-amber-500 my-0.5">
                              {Array.from({ length: rev.rating }).map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-amber-500" />
                              ))}
                              {rev.location && (
                                <span className="text-[10px] text-stone-400 ml-1">({rev.location})</span>
                              )}
                            </div>
                            <p className="text-[11px] text-stone-600 dark:text-stone-300">{rev.comment}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons & Quantity */}
              <div className="pt-6 border-t border-stone-200 dark:border-stone-800 mt-6 space-y-3">
                <div className="flex items-center gap-3">
                  {/* Quantity */}
                  <div className="flex items-center border border-stone-300 dark:border-stone-700 rounded overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 text-xs hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 text-xs font-bold">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(selectedProduct.stock, quantity + 1))}
                      className="px-3 py-2 text-xs hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="flex-1 py-2.5 px-4 bg-stone-200 dark:bg-stone-800 hover:bg-[#8C6239] hover:text-white dark:hover:bg-[#C5A880] dark:hover:text-[#0B1617] text-stone-900 dark:text-stone-100 font-semibold text-xs uppercase tracking-wider rounded transition-colors"
                  >
                    Add to Atelier Bag
                  </button>

                  {/* Instant Commission / Buy Now */}
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="flex-1 py-2.5 px-4 bg-gradient-to-r from-[#132629] to-[#1f383c] dark:from-[#C5A880] dark:to-[#dfc399] text-white dark:text-[#0B1617] font-semibold text-xs uppercase tracking-wider rounded shadow hover:brightness-110 transition-all"
                  >
                    Instant Checkout
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
