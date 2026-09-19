export interface FurnitureItem {
  id: string;
  sku?: string;
  name: string;
  category: 'living' | 'bedroom' | 'dining' | 'office' | 'bespoke' | 'decor';
  categoryLabel: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  reviewCount?: number;
  stock: number;
  image: string;
  additionalImages?: string[];
  description: string;
  woodType: string;
  materials: string[];
  dimensions: string;
  isCustomizable: boolean;
  highlightTag?: string;
  features: string[];
  status?: 'active' | 'draft';
  woodFinishOptions?: string[];
  upholsteryOptions?: string[];
  hardwareOptions?: string[];
}

export interface CartItem {
  cartId: string;
  productId: string;
  name: string;
  image: string;
  category: string;
  price: number;
  quantity: number;
  selectedWoodFinish: string;
  selectedUpholstery: string;
  selectedHardware: string;
  customNotes?: string;
}

export interface Coupon {
  code: string;
  discountPercent?: number;
  discountAmount?: number;
  minSpend?: number;
  description: string;
  isActive: boolean;
}

export type OrderStatus = 'Pending' | 'Processing' | 'In Crafting' | 'Quality Check' | 'Out for Delivery' | 'Delivered' | 'Cancelled';

export interface OrderTrackingEvent {
  timestamp: string;
  title: string;
  description: string;
  done: boolean;
}

export interface Order {
  id: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: string;
  city: string;
  postalCode?: string;
  deliveryNotes?: string;
  shippingMethod: 'white-glove' | 'freight' | 'pickup';
  shippingFee: number;
  paymentMethod: 'bkash' | 'nagad' | 'card' | 'cod' | 'bank_transfer';
  paymentStatus: 'paid' | 'pending' | 'cod';
  items: CartItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  tax: number;
  total: number;
  status: OrderStatus;
  trackingTimeline: OrderTrackingEvent[];
}

export interface ProductReview {
  id: string;
  productId: string;
  author: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verifiedBuyer: boolean;
  location?: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  location: string;
  quote: string;
  projectType: string;
  rating: number;
}

export interface Milestone {
  year: string;
  title: string;
  description: string;
}

export interface BespokeInquiry {
  id?: string;
  createdAt?: string;
  name: string;
  phone: string;
  email: string;
  roomType: string;
  woodPreference: string;
  dimensionsNote: string;
  budgetRange: string;
  message: string;
  status?: 'New' | 'Contacted' | 'In Estimation' | 'Approved' | 'Archived';
}

export interface CompletedProject {
  id: string;
  title: string;
  category: string;
  location: string;
  completionYear: string;
  leadTime: string;
  woodType: string;
  beforeImage: string;
  beforeLabel: string;
  afterImage: string;
  afterLabel: string;
  summary: string;
  challenge: string;
  solution: string;
  craftsmanshipHighlights: string[];
  materials: string[];
  dimensions: string;
  clientName: string;
  testimonialSnippet: string;
}

