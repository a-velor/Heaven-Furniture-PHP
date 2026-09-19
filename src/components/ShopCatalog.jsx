import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, Star, Heart, ShoppingBag, Eye, Check, Sparkles, X } from "lucide-react";
import { useEcommerce } from "../context/EcommerceContext";
export const ShopCatalog = () => {
  const {
    products,
    formatPrice,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setSelectedProduct,
    setActiveView
  } = useEcommerce();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedWood, setSelectedWood] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [onlyInStock, setOnlyInStock] = useState(false);
  const categories = [
    { id: "all", label: "All Atelier Pieces" },
    { id: "living", label: "Living Room" },
    { id: "bedroom", label: "Bedroom" },
    { id: "dining", label: "Dining" },
    { id: "office", label: "Office & Study" },
    { id: "bespoke", label: "Bespoke Architectural" }
  ];
  const woodTypes = [
    "all",
    "Chittagong Teak",
    "Burma Segun",
    "American Walnut",
    "Mahogany"
  ];
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      if (selectedCategory !== "all" && item.category !== selectedCategory) {
        return false;
      }
      if (selectedWood !== "all" && !item.woodType.toLowerCase().includes(selectedWood.toLowerCase())) {
        return false;
      }
      if (onlyInStock && item.stock <= 0) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchWood = item.woodType.toLowerCase().includes(q);
        const matchCategory = item.categoryLabel.toLowerCase().includes(q);
        if (!matchName && !matchDesc && !matchWood && !matchCategory) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating") return (b.rating || 5) - (a.rating || 5);
      return 0;
    });
  }, [products, selectedCategory, selectedWood, onlyInStock, searchQuery, sortBy]);
  return <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#0B1617] text-[#2C221E] dark:text-[#F2EFE9] transition-colors py-10 px-4 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {
    /* Header Banner */
  }
        <div className="border-b border-stone-200 dark:border-stone-800 pb-8 pt-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#8C6239] dark:text-[#C5A880] text-xs font-semibold uppercase tracking-[0.2em] mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Agrabad Atelier Ready-To-Commission Catalog
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
              Handcrafted Solid Wood Catalog
            </h1>
            <p className="mt-2 text-stone-600 dark:text-stone-400 text-sm max-w-2xl">
              Each piece is carved from kiln-seasoned Chittagong Teak and rare hardwoods in our Chattogram workshop, backed by white-glove installation and lifetime joinery integrity.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
    onClick={() => setActiveView("storefront")}
    className="px-4 py-2 border border-stone-300 dark:border-stone-700 hover:border-[#C5A880] text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors"
  >
              Back to Showroom Home
            </button>
            <button
    onClick={() => setActiveView("cms")}
    className="px-4 py-2 bg-[#8C6239]/10 text-[#8C6239] dark:text-[#C5A880] hover:bg-[#8C6239]/20 text-xs font-semibold uppercase tracking-wider rounded-lg border border-[#8C6239]/30 transition-colors"
  >
              PHP CMS Management
            </button>
          </div>
        </div>

        {
    /* Filter Bar & Controls */
  }
        <div className="bg-white/80 dark:bg-stone-900/60 p-4 sm:p-6 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            
            {
    /* Search Input */
  }
            <div className="md:col-span-5 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
    type="text"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    placeholder="Search by furniture name, teak finish, wood type..."
    className="w-full pl-10 pr-8 py-2.5 bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:border-[#C5A880]"
  />
              {searchQuery && <button
    onClick={() => setSearchQuery("")}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
  >
                  <X className="w-3.5 h-3.5" />
                </button>}
            </div>

            {
    /* Wood Species Dropdown */
  }
            <div className="md:col-span-3">
              <select
    value={selectedWood}
    onChange={(e) => setSelectedWood(e.target.value)}
    className="w-full px-3 py-2.5 bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:border-[#C5A880]"
  >
                <option value="all">All Hardwood Species</option>
                <option value="Teak">Chittagong Teak (Segun)</option>
                <option value="Burma">Burma Segun Teak</option>
                <option value="Walnut">American Walnut</option>
                <option value="Mahogany">Royal Mahogany</option>
              </select>
            </div>

            {
    /* Sort Dropdown */
  }
            <div className="md:col-span-2">
              <select
    value={sortBy}
    onChange={(e) => setSortBy(e.target.value)}
    className="w-full px-3 py-2.5 bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:border-[#C5A880]"
  >
                <option value="featured">Featured Atelier Pieces</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {
    /* In Stock Toggle */
  }
            <div className="md:col-span-2 flex items-center justify-end">
              <label className="flex items-center gap-2 text-xs font-medium text-stone-700 dark:text-stone-300 cursor-pointer select-none">
                <input
    type="checkbox"
    checked={onlyInStock}
    onChange={(e) => setOnlyInStock(e.target.checked)}
    className="rounded text-[#8C6239] focus:ring-[#C5A880]"
  />
                <span>In Atelier Stock</span>
              </label>
            </div>
          </div>

          {
    /* Category Tabs */
  }
          <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-stone-100 dark:border-stone-800 text-xs">
            {categories.map((cat) => <button
    key={cat.id}
    onClick={() => setSelectedCategory(cat.id)}
    className={`px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all ${selectedCategory === cat.id ? "bg-[#132629] dark:bg-[#C5A880] text-white dark:text-[#0B1617] font-semibold shadow-xs" : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200"}`}
  >
                {cat.label}
              </button>)}
          </div>
        </div>

        {
    /* Results Count */
  }
        <div className="flex items-center justify-between text-xs text-stone-500">
          <span>
            Displaying <strong>{filteredProducts.length}</strong> of {products.length} bespoke pieces
          </span>
          {(searchQuery || selectedCategory !== "all" || selectedWood !== "all" || onlyInStock) && <button
    onClick={() => {
      setSearchQuery("");
      setSelectedCategory("all");
      setSelectedWood("all");
      setOnlyInStock(false);
    }}
    className="text-[#8C6239] dark:text-[#C5A880] hover:underline font-semibold"
  >
              Reset Filters
            </button>}
        </div>

        {
    /* Product Grid */
  }
        {filteredProducts.length === 0 ? <div className="text-center py-20 bg-white/50 dark:bg-stone-900/30 rounded-2xl border border-dashed border-stone-300 dark:border-stone-800">
            <SlidersHorizontal className="w-10 h-10 text-stone-400 mx-auto mb-3" />
            <h3 className="font-serif text-lg font-bold text-stone-800 dark:text-stone-200">
              No matching pieces found
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1">
              Try adjusting your wood finish filter, category, or search keywords.
            </p>
          </div> : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((item) => {
    const inWish = isInWishlist(item.id);
    return <div
      key={item.id}
      className="group bg-white dark:bg-stone-900/70 rounded-xl overflow-hidden border border-stone-200 dark:border-stone-800/80 shadow-xs hover:shadow-xl hover:border-[#C5A880]/50 transition-all duration-300 flex flex-col justify-between"
    >
                  {
      /* Image Container */
    }
                  <div className="relative aspect-4/3 overflow-hidden bg-stone-100 dark:bg-stone-950">
                    <img
      src={item.image}
      alt={item.name}
      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      loading="lazy"
    />

                    {
      /* Tag Badge */
    }
                    {item.highlightTag && <span className="absolute top-3 left-3 px-2.5 py-0.5 bg-[#132629]/90 dark:bg-[#C5A880]/90 text-white dark:text-[#0B1617] text-[10px] font-bold tracking-widest uppercase rounded">
                        {item.highlightTag}
                      </span>}

                    {
      /* Wishlist Button */
    }
                    <button
      onClick={(e) => {
        e.stopPropagation();
        toggleWishlist(item.id);
      }}
      className="absolute top-3 right-3 p-2 bg-white/80 dark:bg-stone-900/80 rounded-full text-stone-600 dark:text-stone-300 hover:text-rose-500 transition-colors shadow-xs"
      aria-label="Wishlist"
    >
                      <Heart className={`w-4 h-4 ${inWish ? "fill-rose-500 text-rose-500" : ""}`} />
                    </button>

                    {
      /* Quick View overlay button */
    }
                    <div className="absolute inset-0 bg-stone-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none group-hover:pointer-events-auto">
                      <button
      onClick={() => setSelectedProduct(item)}
      className="px-4 py-2 bg-white/95 dark:bg-stone-900/95 text-stone-900 dark:text-stone-100 text-xs font-semibold rounded-full shadow-lg flex items-center gap-1.5 hover:scale-105 transition-transform"
    >
                        <Eye className="w-3.5 h-3.5" /> Quick Inspect & Finishes
                      </button>
                    </div>
                  </div>

                  {
      /* Content Container */
    }
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {
      /* Meta info */
    }
                      <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1">
                        <span className="uppercase tracking-widest font-semibold text-[#8C6239] dark:text-[#C5A880]">
                          {item.categoryLabel}
                        </span>
                        <span className="font-mono text-[10px]">{item.sku}</span>
                      </div>

                      {
      /* Product Title */
    }
                      <h3
      onClick={() => setSelectedProduct(item)}
      className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100 hover:text-[#8C6239] cursor-pointer line-clamp-1 transition-colors"
    >
                        {item.name}
                      </h3>

                      {
      /* Wood & Materials */
    }
                      <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 line-clamp-1">
                        {item.woodType}
                      </p>

                      {
      /* Rating & Stock */
    }
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100 dark:border-stone-800 text-xs">
                        <div className="flex items-center gap-1 text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-amber-500" />
                          <span className="font-semibold text-stone-800 dark:text-stone-200">
                            {(item.rating || 5).toFixed(1)}
                          </span>
                          <span className="text-stone-400 text-[10px]">({item.reviewCount || 0})</span>
                        </div>

                        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                          <Check className="w-3 h-3" /> {item.stock} in atelier
                        </span>
                      </div>
                    </div>

                    {
      /* Price and Action Buttons */
    }
                    <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-2">
                      <div>
                        <span className="block font-serif text-lg font-bold text-[#8C6239] dark:text-[#C5A880]">
                          {formatPrice(item.price)}
                        </span>
                        {item.originalPrice && item.originalPrice > item.price && <span className="text-[11px] line-through text-stone-400">
                            {formatPrice(item.originalPrice)}
                          </span>}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
      onClick={() => setSelectedProduct(item)}
      className="p-2 text-stone-600 dark:text-stone-300 hover:text-[#8C6239] border border-stone-200 dark:border-stone-700 rounded-lg hover:border-[#C5A880] transition-colors"
      title="Custom Options"
    >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
      onClick={() => addToCart(item, 1)}
      className="px-3.5 py-2 bg-[#132629] dark:bg-[#C5A880] text-white dark:text-[#0B1617] text-xs font-semibold uppercase tracking-wider rounded-lg hover:brightness-110 flex items-center gap-1.5 transition-all"
    >
                          <ShoppingBag className="w-3.5 h-3.5" /> Add to Bag
                        </button>
                      </div>
                    </div>

                  </div>
                </div>;
  })}
          </div>}

      </div>
    </div>;
};
