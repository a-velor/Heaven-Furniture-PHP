import { createContext, useContext, useState, useEffect } from "react";
import { COLLECTIONS, INITIAL_COUPONS, INITIAL_ORDERS, SAMPLE_REVIEWS } from "../data/furnitureData";
const EcommerceContext = createContext(void 0);
const CURRENCY_RATES = {
  BDT: { symbol: "\u09F3", rate: 1 },
  USD: { symbol: "$", rate: 83e-4 },
  EUR: { symbol: "\u20AC", rate: 78e-4 }
};
export const EcommerceProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    try {
      const stored = localStorage.getItem("hfm_cms_products");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn("Error reading products from localStorage", e);
    }
    return COLLECTIONS;
  });
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem("hfm_cart");
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn("Error reading cart", e);
    }
    return [];
  });
  const [wishlist, setWishlist] = useState(() => {
    try {
      const stored = localStorage.getItem("hfm_wishlist");
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn("Error reading wishlist", e);
    }
    return ["l1", "d1"];
  });
  const [orders, setOrders] = useState(() => {
    try {
      const stored = localStorage.getItem("hfm_orders");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn("Error reading orders", e);
    }
    return INITIAL_ORDERS;
  });
  const [coupons, setCoupons] = useState(INITIAL_COUPONS);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [reviews, setReviews] = useState(SAMPLE_REVIEWS);
  const [currency, setCurrency] = useState("BDT");
  const [activeView, setActiveView] = useState("storefront");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isOrderTrackingOpen, setIsOrderTrackingOpen] = useState(false);
  const [trackingOrderId, setTrackingOrderId] = useState("HFM-89241");
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  useEffect(() => {
    try {
      localStorage.setItem("hfm_cms_products", JSON.stringify(products));
    } catch (e) {
      console.warn("Could not save products to localStorage", e);
    }
  }, [products]);
  useEffect(() => {
    try {
      localStorage.setItem("hfm_cart", JSON.stringify(cart));
    } catch (e) {
      console.warn("Could not save cart to localStorage", e);
    }
  }, [cart]);
  useEffect(() => {
    try {
      localStorage.setItem("hfm_wishlist", JSON.stringify(wishlist));
    } catch (e) {
      console.warn("Could not save wishlist", e);
    }
  }, [wishlist]);
  useEffect(() => {
    try {
      localStorage.setItem("hfm_orders", JSON.stringify(orders));
    } catch (e) {
      console.warn("Could not save orders", e);
    }
  }, [orders]);
  const formatPrice = (amountInBDT) => {
    const config = CURRENCY_RATES[currency];
    const converted = amountInBDT * config.rate;
    if (currency === "BDT") {
      return `\u09F3${Math.round(converted).toLocaleString("en-US")}`;
    }
    return `${config.symbol}${Math.round(converted).toLocaleString("en-US")}`;
  };
  const addToCart = (product, quantity = 1, options) => {
    const woodFinish = options?.woodFinish || product.woodFinishOptions?.[0] || product.woodType;
    const upholstery = options?.upholstery || product.upholsteryOptions?.[0] || "Standard";
    const hardware = options?.hardware || product.hardwareOptions?.[0] || "Standard";
    const notes = options?.customNotes || "";
    const existingIndex = cart.findIndex(
      (item) => item.productId === product.id && item.selectedWoodFinish === woodFinish && item.selectedUpholstery === upholstery && item.selectedHardware === hardware
    );
    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += quantity;
      setCart(updated);
    } else {
      const newItem = {
        cartId: `cart_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        productId: product.id,
        name: product.name,
        image: product.image,
        category: product.categoryLabel,
        price: product.price,
        quantity,
        selectedWoodFinish: woodFinish,
        selectedUpholstery: upholstery,
        selectedHardware: hardware,
        customNotes: notes
      };
      setCart((prev) => [...prev, newItem]);
    }
    setIsCartOpen(true);
  };
  const removeFromCart = (cartId) => {
    setCart((prev) => prev.filter((item) => item.cartId !== cartId));
  };
  const updateCartQuantity = (cartId, delta) => {
    setCart(
      (prev) => prev.map((item) => {
        if (item.cartId === cartId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean)
    );
  };
  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };
  const applyCoupon = (code) => {
    const clean = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === clean && c.isActive);
    if (!found) {
      return { success: false, message: "Invalid or expired promotional voucher code." };
    }
    setAppliedCoupon(found);
    return { success: true, message: `Promo code "${found.code}" applied: ${found.description}` };
  };
  const removeCoupon = () => {
    setAppliedCoupon(null);
  };
  const toggleWishlist = (productId) => {
    setWishlist(
      (prev) => prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };
  const isInWishlist = (productId) => wishlist.includes(productId);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent) {
      discountAmount = Math.round(subtotal * appliedCoupon.discountPercent / 100);
    } else if (appliedCoupon.discountAmount) {
      discountAmount = Math.min(subtotal, appliedCoupon.discountAmount);
    }
  }
  const shippingFee = subtotal === 0 || subtotal >= 1e5 || appliedCoupon?.code === "FREESHIP" ? 0 : 3500;
  const total = Math.max(0, subtotal - discountAmount + shippingFee);
  const totalCartCount = cart.reduce((count, item) => count + item.quantity, 0);
  const placeOrder = (orderData) => {
    const orderId = `HFM-${Math.floor(1e4 + Math.random() * 9e4)}`;
    const now = /* @__PURE__ */ new Date();
    const newOrder = {
      id: orderId,
      createdAt: now.toISOString(),
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      customerEmail: orderData.customerEmail,
      shippingAddress: orderData.shippingAddress,
      city: orderData.city,
      postalCode: orderData.postalCode,
      deliveryNotes: orderData.deliveryNotes,
      shippingMethod: orderData.shippingMethod,
      shippingFee,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: orderData.paymentMethod === "cod" ? "cod" : "paid",
      items: [...cart],
      subtotal,
      discount: discountAmount,
      couponCode: appliedCoupon?.code,
      tax: 0,
      total,
      status: "Pending",
      trackingTimeline: [
        {
          timestamp: now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }),
          title: "Order Commissioned & Logged",
          description: `Order ${orderId} received. Verification in progress via ${orderData.paymentMethod.toUpperCase()}.`,
          done: true
        },
        {
          timestamp: "Pending Confirmation",
          title: "Kiln-Seasoned Lumber Staged",
          description: "A-Grade Chittagong Teak heartwood inspected and marked at the workshop.",
          done: false
        },
        {
          timestamp: "Scheduled",
          title: "Master Joinery & Upholstery",
          description: "Mortise-and-tenon structural assembly and tailored fabric fitting.",
          done: false
        },
        {
          timestamp: "Scheduled",
          title: "White-Glove In-Home Installation",
          description: `Scheduled dispatch for ${orderData.city} address with assembly team.`,
          done: false
        }
      ]
    };
    setProducts(
      (prev) => prev.map((prod) => {
        const matchingCart = cart.find((item) => item.productId === prod.id);
        if (matchingCart) {
          return { ...prod, stock: Math.max(0, prod.stock - matchingCart.quantity) };
        }
        return prod;
      })
    );
    setOrders((prev) => [newOrder, ...prev]);
    setConfirmedOrder(newOrder);
    setTrackingOrderId(newOrder.id);
    clearCart();
    setIsCheckoutOpen(false);
    return newOrder;
  };
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(
      (prev) => prev.map((ord) => {
        if (ord.id === orderId) {
          const nowStr = (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          });
          const updatedTimeline = ord.trackingTimeline.map((ev, idx) => {
            if (newStatus === "Delivered") return { ...ev, done: true };
            if (newStatus === "Out for Delivery" && idx <= 3) return { ...ev, done: true };
            if (newStatus === "In Crafting" && idx <= 1) return { ...ev, done: true };
            return ev;
          });
          return {
            ...ord,
            status: newStatus,
            paymentStatus: newStatus === "Delivered" ? "paid" : ord.paymentStatus,
            trackingTimeline: updatedTimeline
          };
        }
        return ord;
      })
    );
  };
  const addProduct = (productData) => {
    const id = `prod_${Date.now()}`;
    const newProduct = {
      ...productData,
      id,
      sku: productData.sku || `HFM-${productData.category.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      rating: productData.rating || 5,
      reviewCount: productData.reviewCount || 0,
      status: productData.status || "active",
      isCustomizable: productData.isCustomizable !== void 0 ? productData.isCustomizable : true
    };
    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  };
  const updateProduct = (id, updates) => {
    setProducts(
      (prev) => prev.map((p) => p.id === id ? { ...p, ...updates } : p)
    );
  };
  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };
  const addReview = (reviewData) => {
    const newRev = {
      ...reviewData,
      id: `rev_${Date.now()}`,
      date: (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    };
    setReviews((prev) => [newRev, ...prev]);
    const productReviews = [...reviews.filter((r) => r.productId === reviewData.productId), newRev];
    const avg = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
    updateProduct(reviewData.productId, {
      rating: parseFloat(avg.toFixed(1)),
      reviewCount: productReviews.length
    });
  };
  const getProductReviews = (productId) => {
    return reviews.filter((r) => r.productId === productId);
  };
  const resetToDefaults = () => {
    setProducts(COLLECTIONS);
    setOrders(INITIAL_ORDERS);
    setCoupons(INITIAL_COUPONS);
    setReviews(SAMPLE_REVIEWS);
    setCart([]);
    setWishlist(["l1", "d1"]);
    localStorage.removeItem("hfm_cms_products");
    localStorage.removeItem("hfm_orders");
    localStorage.removeItem("hfm_cart");
    localStorage.removeItem("hfm_wishlist");
  };
  return <EcommerceContext.Provider
    value={{
      products,
      cart,
      wishlist,
      orders,
      coupons,
      appliedCoupon,
      reviews,
      currency,
      activeView,
      selectedProduct,
      isCartOpen,
      isCheckoutOpen,
      isWishlistOpen,
      isOrderTrackingOpen,
      trackingOrderId,
      confirmedOrder,
      setCurrency,
      setActiveView,
      setSelectedProduct,
      setIsCartOpen,
      setIsCheckoutOpen,
      setIsWishlistOpen,
      setIsOrderTrackingOpen,
      setTrackingOrderId,
      setConfirmedOrder,
      formatPrice,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      applyCoupon,
      removeCoupon,
      toggleWishlist,
      isInWishlist,
      placeOrder,
      updateOrderStatus,
      addProduct,
      updateProduct,
      deleteProduct,
      addReview,
      getProductReviews,
      subtotal,
      discountAmount,
      shippingFee,
      total,
      totalCartCount,
      resetToDefaults
    }}
  >
      {children}
    </EcommerceContext.Provider>;
};
export const useEcommerce = () => {
  const context = useContext(EcommerceContext);
  if (!context) {
    throw new Error("useEcommerce must be used within an EcommerceProvider");
  }
  return context;
};
