import React, { createContext, useContext, useState, useEffect } from 'react';
import { FurnitureItem, CartItem, Coupon, Order, OrderStatus, ProductReview } from '../types';
import { COLLECTIONS, INITIAL_COUPONS, INITIAL_ORDERS, SAMPLE_REVIEWS } from '../data/furnitureData';

type Currency = 'BDT' | 'USD' | 'EUR';

interface EcommerceContextType {
  products: FurnitureItem[];
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  coupons: Coupon[];
  appliedCoupon: Coupon | null;
  reviews: ProductReview[];
  currency: Currency;
  activeView: 'storefront' | 'catalog' | 'cms';
  selectedProduct: FurnitureItem | null;
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  isWishlistOpen: boolean;
  isOrderTrackingOpen: boolean;
  trackingOrderId: string;
  confirmedOrder: Order | null;
  
  // Setters & UI controls
  setCurrency: (c: Currency) => void;
  setActiveView: (view: 'storefront' | 'catalog' | 'cms') => void;
  setSelectedProduct: (p: FurnitureItem | null) => void;
  setIsCartOpen: (open: boolean) => void;
  setIsCheckoutOpen: (open: boolean) => void;
  setIsWishlistOpen: (open: boolean) => void;
  setIsOrderTrackingOpen: (open: boolean) => void;
  setTrackingOrderId: (id: string) => void;
  setConfirmedOrder: (order: Order | null) => void;

  // Pricing helper
  formatPrice: (amountInBDT: number) => string;

  // Cart operations
  addToCart: (
    product: FurnitureItem,
    quantity?: number,
    options?: { woodFinish?: string; upholstery?: string; hardware?: string; customNotes?: string }
  ) => void;
  removeFromCart: (cartId: string) => void;
  updateCartQuantity: (cartId: string, delta: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Wishlist
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Orders
  placeOrder: (orderData: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    shippingAddress: string;
    city: string;
    postalCode?: string;
    deliveryNotes?: string;
    shippingMethod: 'white-glove' | 'freight' | 'pickup';
    paymentMethod: 'bkash' | 'nagad' | 'card' | 'cod' | 'bank_transfer';
  }) => Order;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;

  // CMS Catalog CRUD
  addProduct: (productData: Omit<FurnitureItem, 'id'>) => FurnitureItem;
  updateProduct: (id: string, updates: Partial<FurnitureItem>) => void;
  deleteProduct: (id: string) => void;

  // Reviews
  addReview: (reviewData: Omit<ProductReview, 'id' | 'date'>) => void;
  getProductReviews: (productId: string) => ProductReview[];

  // Totals calculations
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  total: number;
  totalCartCount: number;

  // Reset
  resetToDefaults: () => void;
}

const EcommerceContext = createContext<EcommerceContextType | undefined>(undefined);

const CURRENCY_RATES: Record<Currency, { symbol: string; rate: number }> = {
  BDT: { symbol: '৳', rate: 1 },
  USD: { symbol: '$', rate: 0.0083 },
  EUR: { symbol: '€', rate: 0.0078 },
};

export const EcommerceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Products (persisted in localStorage with COLLECTIONS fallback)
  const [products, setProducts] = useState<FurnitureItem[]>(() => {
    try {
      const stored = localStorage.getItem('hfm_cms_products');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Error reading products from localStorage', e);
    }
    return COLLECTIONS;
  });

  // 2. Cart (persisted in localStorage)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem('hfm_cart');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Error reading cart', e);
    }
    return [];
  });

  // 3. Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('hfm_wishlist');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Error reading wishlist', e);
    }
    return ['l1', 'd1'];
  });

  // 4. Orders (persisted in localStorage with INITIAL_ORDERS fallback)
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const stored = localStorage.getItem('hfm_orders');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Error reading orders', e);
    }
    return INITIAL_ORDERS;
  });

  // 5. Coupons
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // 6. Reviews
  const [reviews, setReviews] = useState<ProductReview[]>(SAMPLE_REVIEWS);

  // 7. Navigation & Modals State
  const [currency, setCurrency] = useState<Currency>('BDT');
  const [activeView, setActiveView] = useState<'storefront' | 'catalog' | 'cms'>('storefront');
  const [selectedProduct, setSelectedProduct] = useState<FurnitureItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isOrderTrackingOpen, setIsOrderTrackingOpen] = useState(false);
  const [trackingOrderId, setTrackingOrderId] = useState<string>('HFM-89241');
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Sync products to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('hfm_cms_products', JSON.stringify(products));
    } catch (e) {
      console.warn('Could not save products to localStorage', e);
    }
  }, [products]);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('hfm_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('Could not save cart to localStorage', e);
    }
  }, [cart]);

  // Sync wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('hfm_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.warn('Could not save wishlist', e);
    }
  }, [wishlist]);

  // Sync orders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('hfm_orders', JSON.stringify(orders));
    } catch (e) {
      console.warn('Could not save orders', e);
    }
  }, [orders]);

  // Format price helper
  const formatPrice = (amountInBDT: number): string => {
    const config = CURRENCY_RATES[currency];
    const converted = amountInBDT * config.rate;
    if (currency === 'BDT') {
      return `৳${Math.round(converted).toLocaleString('en-US')}`;
    }
    return `${config.symbol}${Math.round(converted).toLocaleString('en-US')}`;
  };

  // Cart operations
  const addToCart = (
    product: FurnitureItem,
    quantity: number = 1,
    options?: { woodFinish?: string; upholstery?: string; hardware?: string; customNotes?: string }
  ) => {
    const woodFinish = options?.woodFinish || product.woodFinishOptions?.[0] || product.woodType;
    const upholstery = options?.upholstery || product.upholsteryOptions?.[0] || 'Standard';
    const hardware = options?.hardware || product.hardwareOptions?.[0] || 'Standard';
    const notes = options?.customNotes || '';

    // Check if duplicate configuration already exists in cart
    const existingIndex = cart.findIndex(
      (item) =>
        item.productId === product.id &&
        item.selectedWoodFinish === woodFinish &&
        item.selectedUpholstery === upholstery &&
        item.selectedHardware === hardware
    );

    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += quantity;
      setCart(updated);
    } else {
      const newItem: CartItem = {
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
        customNotes: notes,
      };
      setCart((prev) => [...prev, newItem]);
    }
    setIsCartOpen(true);
  };

  const removeFromCart = (cartId: string) => {
    setCart((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  const updateCartQuantity = (cartId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.cartId === cartId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Coupons
  const applyCoupon = (code: string): { success: boolean; message: string } => {
    const clean = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === clean && c.isActive);
    if (!found) {
      return { success: false, message: 'Invalid or expired promotional voucher code.' };
    }
    setAppliedCoupon(found);
    return { success: true, message: `Promo code "${found.code}" applied: ${found.description}` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Subtotals & calculations
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent) {
      discountAmount = Math.round((subtotal * appliedCoupon.discountPercent) / 100);
    } else if (appliedCoupon.discountAmount) {
      discountAmount = Math.min(subtotal, appliedCoupon.discountAmount);
    }
  }

  // Free white-glove shipping on orders over 100,000 BDT or if coupon applies
  const shippingFee = subtotal === 0 || subtotal >= 100000 || appliedCoupon?.code === 'FREESHIP' ? 0 : 3500;
  const total = Math.max(0, subtotal - discountAmount + shippingFee);
  const totalCartCount = cart.reduce((count, item) => count + item.quantity, 0);

  // Orders
  const placeOrder = (orderData: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    shippingAddress: string;
    city: string;
    postalCode?: string;
    deliveryNotes?: string;
    shippingMethod: 'white-glove' | 'freight' | 'pickup';
    paymentMethod: 'bkash' | 'nagad' | 'card' | 'cod' | 'bank_transfer';
  }): Order => {
    const orderId = `HFM-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date();

    const newOrder: Order = {
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
      paymentStatus: orderData.paymentMethod === 'cod' ? 'cod' : 'paid',
      items: [...cart],
      subtotal,
      discount: discountAmount,
      couponCode: appliedCoupon?.code,
      tax: 0,
      total,
      status: 'Pending',
      trackingTimeline: [
        {
          timestamp: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
          title: 'Order Commissioned & Logged',
          description: `Order ${orderId} received. Verification in progress via ${orderData.paymentMethod.toUpperCase()}.`,
          done: true,
        },
        {
          timestamp: 'Pending Confirmation',
          title: 'Kiln-Seasoned Lumber Staged',
          description: 'A-Grade Chittagong Teak heartwood inspected and marked at the workshop.',
          done: false,
        },
        {
          timestamp: 'Scheduled',
          title: 'Master Joinery & Upholstery',
          description: 'Mortise-and-tenon structural assembly and tailored fabric fitting.',
          done: false,
        },
        {
          timestamp: 'Scheduled',
          title: 'White-Glove In-Home Installation',
          description: `Scheduled dispatch for ${orderData.city} address with assembly team.`,
          done: false,
        },
      ],
    };

    // Decrement stock for products
    setProducts((prev) =>
      prev.map((prod) => {
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

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const nowStr = new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });
          const updatedTimeline = ord.trackingTimeline.map((ev, idx) => {
            if (newStatus === 'Delivered') return { ...ev, done: true };
            if (newStatus === 'Out for Delivery' && idx <= 3) return { ...ev, done: true };
            if (newStatus === 'In Crafting' && idx <= 1) return { ...ev, done: true };
            return ev;
          });

          return {
            ...ord,
            status: newStatus,
            paymentStatus: newStatus === 'Delivered' ? 'paid' : ord.paymentStatus,
            trackingTimeline: updatedTimeline,
          };
        }
        return ord;
      })
    );
  };

  // CMS Catalog CRUD
  const addProduct = (productData: Omit<FurnitureItem, 'id'>): FurnitureItem => {
    const id = `prod_${Date.now()}`;
    const newProduct: FurnitureItem = {
      ...productData,
      id,
      sku: productData.sku || `HFM-${productData.category.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      rating: productData.rating || 5.0,
      reviewCount: productData.reviewCount || 0,
      status: productData.status || 'active',
      isCustomizable: productData.isCustomizable !== undefined ? productData.isCustomizable : true,
    };

    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<FurnitureItem>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // Reviews
  const addReview = (reviewData: Omit<ProductReview, 'id' | 'date'>) => {
    const newRev: ProductReview = {
      ...reviewData,
      id: `rev_${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };
    setReviews((prev) => [newRev, ...prev]);

    // Recalculate rating on product
    const productReviews = [...reviews.filter((r) => r.productId === reviewData.productId), newRev];
    const avg = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;

    updateProduct(reviewData.productId, {
      rating: parseFloat(avg.toFixed(1)),
      reviewCount: productReviews.length,
    });
  };

  const getProductReviews = (productId: string) => {
    return reviews.filter((r) => r.productId === productId);
  };

  // Reset to default seed data
  const resetToDefaults = () => {
    setProducts(COLLECTIONS);
    setOrders(INITIAL_ORDERS);
    setCoupons(INITIAL_COUPONS);
    setReviews(SAMPLE_REVIEWS);
    setCart([]);
    setWishlist(['l1', 'd1']);
    localStorage.removeItem('hfm_cms_products');
    localStorage.removeItem('hfm_orders');
    localStorage.removeItem('hfm_cart');
    localStorage.removeItem('hfm_wishlist');
  };

  return (
    <EcommerceContext.Provider
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

        resetToDefaults,
      }}
    >
      {children}
    </EcommerceContext.Provider>
  );
};

export const useEcommerce = (): EcommerceContextType => {
  const context = useContext(EcommerceContext);
  if (!context) {
    throw new Error('useEcommerce must be used within an EcommerceProvider');
  }
  return context;
};
