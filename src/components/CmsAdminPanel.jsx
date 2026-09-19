import { useState, useMemo } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Ticket,
  Code2,
  Plus,
  Edit2,
  Trash2,
  Clock,
  AlertTriangle,
  TrendingUp,
  Server,
  Database,
  RefreshCw,
  Copy,
  Check,
  ShieldCheck,
  Download,
  FileCode,
  SlidersHorizontal,
  Search,
  Filter,
  ArrowUpDown,
  LayoutGrid,
  List,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  X,
  Settings,
  Store,
  Layers,
  Percent,
  ChevronRight
} from "lucide-react";
import { useEcommerce } from "../context/EcommerceContext";
import {
  generatePhpBoilerplate,
  generateSqlSchema,
  triggerFileDownload
} from "../utils/phpExportGenerator.js";

// Quick-fill image presets for easy catalog curation
const IMAGE_PRESETS = [
  {
    name: "Living Room Sofa",
    url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=75"
  },
  {
    name: "Dining Suite",
    url: "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1000&q=75"
  },
  {
    name: "Canopy Bed",
    url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=75"
  },
  {
    name: "Lounge Armchair",
    url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=75"
  },
  {
    name: "Executive Desk",
    url: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1000&q=75"
  },
  {
    name: "Teak Credenza",
    url: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1000&q=75"
  },
  {
    name: "Coffee Table",
    url: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1000&q=75"
  },
  {
    name: "Minimalist Bookcase",
    url: "https://images.unsplash.com/photo-1594040226829-7f251ab46d80?auto=format&fit=crop&w=1000&q=75"
  }
];

const CATEGORIES = [
  { value: "living", label: "Living Room" },
  { value: "dining", label: "Dining" },
  { value: "bedroom", label: "Bedroom" },
  { value: "office", label: "Office & Study" },
  { value: "bespoke", label: "Bespoke Architectural" },
  { value: "outdoor", label: "Verandah & Outdoor" }
];

const WOOD_SPECIES = [
  "Solid Chittagong Teak (Segun)",
  "Burma Mahogany",
  "Silky Oak (Shil Koroi)",
  "Gamari Hardwood",
  "Rosewood (Sheesham)",
  "Walnut & Brass Inlay",
  "Teak & Cane (Rattan)"
];

export const CmsAdminPanel = () => {
  const {
    products,
    orders,
    coupons,
    currency,
    setCurrency,
    formatPrice,
    updateOrderStatus,
    addProduct,
    updateProduct,
    deleteProduct,
    setActiveView,
    resetToDefaults
  } = useEcommerce();

  // Navigation tabs: 'analytics' | 'products' | 'orders' | 'coupons' | 'export' | 'php-framework' | 'hosting-guide' | 'settings'
  const [activeTab, setActiveTab] = useState("products");

  // Customization & View Preferences
  const [viewMode, setViewMode] = useState("table"); // 'table' | 'compact' | 'grid'
  const [lowStockThreshold, setLowStockThreshold] = useState(() => {
    try {
      const saved = localStorage.getItem("hfm_admin_threshold");
      return saved ? parseInt(saved, 10) : 3;
    } catch {
      return 3;
    }
  });

  const [visibleColumns, setVisibleColumns] = useState({
    sku: true,
    category: true,
    woodType: true,
    dimensions: true,
    pricing: true,
    stock: true,
    actions: true
  });

  // Filters & Sorting state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedWood, setSelectedWood] = useState("all");
  const [stockStatusFilter, setStockStatusFilter] = useState("all"); // 'all' | 'in_stock' | 'low_stock' | 'out_of_stock'
  const [sortBy, setSortBy] = useState("default"); // 'default' | 'price-asc' | 'price-desc' | 'stock-asc' | 'stock-desc' | 'name-asc'

  // Modal states
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [activeExportCodeTab, setActiveExportCodeTab] = useState("php"); // 'php' | 'sql'

  // New Coupon Form state
  const [isNewCouponModalOpen, setIsNewCouponModalOpen] = useState(false);
  const [couponFormData, setCouponFormData] = useState({
    code: "",
    discountPercent: 15,
    description: "",
    minSpend: 50000
  });

  // Product Form state
  const [formData, setFormData] = useState({
    name: "",
    category: "living",
    categoryLabel: "Living Room",
    price: 120000,
    originalPrice: 140000,
    stock: 5,
    woodType: "Solid Chittagong Teak (Segun)",
    dimensions: "200cm W x 90cm D x 75cm H",
    image: IMAGE_PRESETS[0].url,
    description: "Masterfully carved solid timber piece with kiln-seasoned joinery.",
    highlightTag: "New Atelier Commission",
    materials: "Solid Seasoned Hardwood, German Hardware, Natural Danish Oil",
    features: "Kiln-seasoned in Chattogram, Lifetime joinery guarantee, Hand-rubbed wax finish"
  });

  const [formErrors, setFormErrors] = useState({});

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState(null);
  const [copiedType, setCopiedType] = useState(null);

  const showToast = (message, type = "success") => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Atelier Customizer Preferences (Lead Time, Commission status)
  const [isAcceptingCommissions, setIsAcceptingCommissions] = useState(true);
  const [fabricationLeadTime, setFabricationLeadTime] = useState("3-5 Weeks");

  // Save low stock threshold
  const handleUpdateThreshold = (val) => {
    const num = Math.max(1, parseInt(val, 10) || 1);
    setLowStockThreshold(num);
    try {
      localStorage.setItem("hfm_admin_threshold", String(num));
    } catch {}
    showToast(`Stock alert threshold updated to ≤ ${num} units!`, "info");
  };

  // Metrics calculation
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingOrders = orders.filter((o) => o.status === "Pending" || o.status === "In Crafting");
  const lowStockProducts = products.filter((p) => (p.stock || 0) <= lowStockThreshold && (p.stock || 0) > 0);
  const outOfStockProducts = products.filter((p) => (p.stock || 0) === 0);
  const totalValuation = products.reduce((sum, p) => sum + (p.price || 0) * (p.stock || 0), 0);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((item) => {
        const matchesSearch =
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.sku && item.sku.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (item.woodType && item.woodType.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesCat = selectedCategory === "all" || item.category === selectedCategory;
        const matchesWood =
          selectedWood === "all" || (item.woodType && item.woodType.toLowerCase().includes(selectedWood.toLowerCase()));

        let matchesStock = true;
        if (stockStatusFilter === "in_stock") {
          matchesStock = (item.stock || 0) > lowStockThreshold;
        } else if (stockStatusFilter === "low_stock") {
          matchesStock = (item.stock || 0) <= lowStockThreshold && (item.stock || 0) > 0;
        } else if (stockStatusFilter === "out_of_stock") {
          matchesStock = (item.stock || 0) === 0;
        }

        return matchesSearch && matchesCat && matchesWood && matchesStock;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return (a.price || 0) - (b.price || 0);
        if (sortBy === "price-desc") return (b.price || 0) - (a.price || 0);
        if (sortBy === "stock-asc") return (a.stock || 0) - (b.stock || 0);
        if (sortBy === "stock-desc") return (b.stock || 0) - (a.stock || 0);
        if (sortBy === "name-asc") return a.name.localeCompare(b.name);
        return 0; // default order
      });
  }, [products, searchQuery, selectedCategory, selectedWood, stockStatusFilter, sortBy, lowStockThreshold]);

  // Handle open add / edit modal
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      category: "living",
      categoryLabel: "Living Room",
      price: 120000,
      originalPrice: 140000,
      stock: 5,
      woodType: "Solid Chittagong Teak (Segun)",
      dimensions: "200cm W x 90cm D x 75cm H",
      image: IMAGE_PRESETS[0].url,
      description: "Masterfully carved solid timber piece with kiln-seasoned joinery.",
      highlightTag: "New Atelier Commission",
      materials: "Solid Seasoned Hardwood, German Hardware, Natural Danish Oil",
      features: "Kiln-seasoned in Chattogram, Lifetime joinery guarantee, Hand-rubbed wax finish"
    });
    setFormErrors({});
    setIsProductModalOpen(true);
  };

  const handleOpenEditModal = (prod) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      category: prod.category || "living",
      categoryLabel: prod.categoryLabel || "Living Room",
      price: prod.price,
      originalPrice: prod.originalPrice || Math.round(prod.price * 1.15),
      stock: prod.stock,
      woodType: prod.woodType || "Solid Chittagong Teak (Segun)",
      dimensions: prod.dimensions || "Custom Atelier Dimensions",
      image: prod.image || IMAGE_PRESETS[0].url,
      description: prod.description || "",
      highlightTag: prod.highlightTag || "",
      materials: Array.isArray(prod.materials) ? prod.materials.join(", ") : prod.materials || "Solid Teak",
      features: Array.isArray(prod.features) ? prod.features.join(", ") : prod.features || "Kiln-seasoned joinery"
    });
    setFormErrors({});
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();

    const errors = {};
    if (!formData.name.trim()) errors.name = "Design title is required.";
    const priceNum = parseFloat(formData.price);
    if (isNaN(priceNum) || priceNum <= 0) errors.price = "Valid positive price is required.";
    const stockNum = parseInt(formData.stock, 10);
    if (isNaN(stockNum) || stockNum < 0) errors.stock = "Valid non-negative stock count is required.";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const catObj = CATEGORIES.find((c) => c.value === formData.category) || CATEGORIES[0];
    const materialsArray = formData.materials
      ? formData.materials.split(",").map((m) => m.trim()).filter(Boolean)
      : ["Solid Seasoned Hardwood"];
    const featuresArray = formData.features
      ? formData.features.split(",").map((f) => f.trim()).filter(Boolean)
      : ["Kiln-seasoned joinery"];

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: formData.name.trim(),
        category: formData.category,
        categoryLabel: catObj.label,
        price: priceNum,
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : Math.round(priceNum * 1.15),
        stock: stockNum,
        woodType: formData.woodType.trim(),
        dimensions: formData.dimensions.trim(),
        image: formData.image.trim(),
        description: formData.description.trim(),
        highlightTag: formData.highlightTag.trim(),
        materials: materialsArray,
        features: featuresArray
      });
      showToast(`Updated "${formData.name.trim()}" successfully!`);
    } else {
      const generatedSku = `HFM-${formData.category.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
      addProduct({
        sku: generatedSku,
        name: formData.name.trim(),
        category: formData.category,
        categoryLabel: catObj.label,
        price: priceNum,
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : Math.round(priceNum * 1.15),
        stock: stockNum,
        woodType: formData.woodType.trim(),
        dimensions: formData.dimensions.trim(),
        image: formData.image.trim() || IMAGE_PRESETS[0].url,
        description: formData.description.trim(),
        highlightTag: formData.highlightTag.trim(),
        materials: materialsArray,
        features: featuresArray,
        isCustomizable: true,
        rating: 5,
        reviewCount: 0
      });
      showToast(`Added "${formData.name.trim()}" to catalog!`);
    }

    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  const confirmDeleteProduct = () => {
    if (!productToDelete) return;
    deleteProduct(productToDelete.id);
    showToast(`Removed "${productToDelete.name}" from catalog.`, "warning");
    setProductToDelete(null);
  };

  const handleStockAdjust = (id, currentStock, delta) => {
    const nextStock = Math.max(0, (currentStock || 0) + delta);
    updateProduct(id, { stock: nextStock });
    showToast(`Stock updated to ${nextStock} units.`, "info");
  };

  // PHP & SQL Export Handlers
  const handleDownloadPhp = () => {
    const phpCode = generatePhpBoilerplate(products);
    const fileName = `heaven_furniture_products_schema_${Date.now()}.php`;
    triggerFileDownload(phpCode, fileName, "application/x-php");
    showToast(`Downloaded PHP/SQL boilerplate for ${products.length} pieces!`, "info");
  };

  const handleDownloadSql = () => {
    const sqlCode = generateSqlSchema(products);
    const fileName = `heaven_furniture_schema_${Date.now()}.sql`;
    triggerFileDownload(sqlCode, fileName, "text/plain");
    showToast(`Downloaded SQL schema for ${products.length} pieces!`, "info");
  };

  const handleCopyCode = async (type) => {
    const code = type === "php" ? generatePhpBoilerplate(products) : generateSqlSchema(products);
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = code;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopiedType(type);
      showToast(`Copied ${type.toUpperCase()} code to clipboard!`, "info");
      setTimeout(() => setCopiedType(null), 2500);
    } catch {
      showToast("Unable to copy code to clipboard.", "warning");
    }
  };

  const PHP_CODE_FILES = {
    router: `<?php
/**
 * HEAVEN FURNITURE MART - RESTful API Router
 * File: cms-php/api/index.php
 * Powered by PHP 8.2+ & Native JSON Responses
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/Product.php';
require_once __DIR__ . '/../models/Order.php';

$pdo = Database::getConnection();
$productModel = new Product($pdo);
$orderModel = new Order($pdo);

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

// Route: GET /api/products
if ($uri === '/api/products' && $method === 'GET') {
    $category = $_GET['category'] ?? null;
    $wood = $_GET['wood'] ?? null;
    echo json_encode([
        'status' => 'success',
        'data' => $productModel->getAll($category, $wood)
    ]);
    exit;
}

// Route: POST /api/orders
if ($uri === '/api/orders' && $method === 'POST') {
    $payload = json_decode(file_get_contents('php://input'), true);
    $newOrder = $orderModel->create($payload);
    echo json_encode([
        'status' => 'success',
        'message' => 'Commission logged into Chattogram workshop queue',
        'order' => $newOrder
    ]);
    exit;
}
`,
    product_model: `<?php
/**
 * Product Model Repository Pattern
 * File: cms-php/models/Product.php
 */

class Product {
    private PDO $db;

    public function __construct(PDO $db) {
        $this->db = $db;
    }

    public function getAll(?string $category = null, ?string $wood = null): array {
        $sql = "SELECT p.*, c.name AS category_name FROM products p 
                LEFT JOIN categories c ON p.category_id = c.id WHERE p.status = 'active'";
        $params = [];
        if ($category) {
            $sql .= " AND c.slug = :category";
            $params['category'] = $category;
        }
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function updateStock(int $id, int $decrement): bool {
        $stmt = $this->db->prepare("UPDATE products SET stock = GREATEST(0, stock - :dec) WHERE id = :id");
        return $stmt->execute(['dec' => $decrement, 'id' => $id]);
    }
}
`,
    order_model: `<?php
/**
 * Order Model Transaction Engine
 * File: cms-php/models/Order.php
 */

class Order {
    private PDO $db;

    public function __construct(PDO $db) {
        $this->db = $db;
    }

    public function create(array $data): array {
        $this->db->beginTransaction();
        try {
            $orderId = 'HFM-' . mt_rand(10000, 99999);
            $stmt = $this->db->prepare("INSERT INTO orders (id, customer_name, customer_phone, customer_email, shipping_address, city, subtotal, total, status, payment_method) 
                                        VALUES (:id, :name, :phone, :email, :address, :city, :subtotal, :total, 'Pending', :pay)");
            $stmt->execute([
                'id' => $orderId,
                'name' => $data['customerName'],
                'phone' => $data['customerPhone'],
                'email' => $data['customerEmail'] ?? null,
                'address' => $data['shippingAddress'],
                'city' => $data['city'],
                'subtotal' => $data['subtotal'],
                'total' => $data['total'],
                'pay' => $data['paymentMethod']
            ]);

            $this->db->commit();
            return ['order_id' => $orderId, 'status' => 'Pending'];
        } catch (Exception $e) {
            $this->db->rollBack();
            throw $e;
        }
    }
}
`,
    database: `<?php
/**
 * Database Singleton Configuration
 * File: cms-php/config/database.php
 */

class Database {
    private static ?PDO $instance = null;

    public static function getConnection(): PDO {
        if (self::$instance === null) {
            $host = getenv('DB_HOST') ?: 'localhost';
            $db   = getenv('DB_NAME') ?: 'heaven_furniture_mart';
            $user = getenv('DB_USER') ?: 'root';
            $pass = getenv('DB_PASS') ?: '';

            $dsn = "mysql:host=$host;dbname=$db;charset=utf8mb4";
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ];
            self::$instance = new PDO($dsn, $user, $pass, $options);
        }
        return self::$instance;
    }
}
`,
    schema: `-- Heaven Furniture Mart MySQL Database Schema
-- File: cms-php/schema.sql

CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sku VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category_id INT NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    original_price DECIMAL(12,2),
    stock INT NOT NULL DEFAULT 5,
    wood_type VARCHAR(150) NOT NULL,
    dimensions VARCHAR(150),
    image_url TEXT NOT NULL,
    status ENUM('active','inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);
`
  };

  const [selectedPhpFile, setSelectedPhpFile] = useState("router");

  return (
    <div className="min-h-screen bg-[#F5F2EC] dark:bg-[#081213] text-[#2C221E] dark:text-[#F2EFE9] transition-colors py-6 px-4 sm:px-6 lg:px-10">
      {/* Toast Feedback */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-[200] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl text-xs font-semibold tracking-wide transition-all animate-in fade-in slide-in-from-bottom-5 duration-200 ${
            toastMessage.type === "warning"
              ? "bg-rose-900 text-rose-100 border border-rose-700"
              : toastMessage.type === "info"
              ? "bg-[#132629] text-[#C5A880] border border-[#C5A880]/50"
              : "bg-emerald-900 text-emerald-100 border border-emerald-700"
          }`}
        >
          {toastMessage.type === "warning" ? (
            <Trash2 className="w-4 h-4 shrink-0" />
          ) : toastMessage.type === "info" ? (
            <Sparkles className="w-4 h-4 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          )}
          <span>{toastMessage.message}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Control Bar with Quick Navigation and Download PHP Export Action */}
        <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#8C6239] to-[#C5A880] flex items-center justify-center text-white shadow-md">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100">
                  Heaven Atelier CMS Admin
                </h1>
                <span className="px-2.5 py-0.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold uppercase rounded-full border border-emerald-300 dark:border-emerald-800">
                  PHP 8.2+ Live
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                Master Solid Wood Catalog, Fabrication Orders &amp; PHP Schema Generator
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Download PHP Export Button */}
            <button
              type="button"
              onClick={handleDownloadPhp}
              className="px-3.5 py-2 bg-gradient-to-r from-[#8C6239] to-[#B38D5A] hover:from-[#7A5430] hover:to-[#A27D4B] text-white text-xs font-semibold uppercase tracking-wider rounded-lg shadow-sm flex items-center gap-1.5 transition-all"
              title="Download standalone PHP & SQL script for current products"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PHP Export</span>
              <span className="px-1.5 py-0.2 bg-black/25 text-[10px] rounded font-mono">.php</span>
            </button>

            {/* Quick Public View Links */}
            <button
              type="button"
              onClick={() => setActiveView("catalog")}
              className="px-3 py-2 border border-stone-300 dark:border-stone-700 hover:border-[#C5A880] text-xs font-semibold text-stone-700 dark:text-stone-300 rounded-lg transition-colors flex items-center gap-1"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Shop Catalog</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView("storefront")}
              className="px-3 py-2 bg-[#132629] dark:bg-[#C5A880] text-white dark:text-[#0B1617] text-xs font-semibold rounded-lg shadow hover:brightness-110 transition-all flex items-center gap-1"
            >
              <span>Public Showroom</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto border-b border-stone-200 dark:border-stone-800 pb-2 text-xs font-semibold uppercase tracking-wider no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab("products")}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition-all shrink-0 ${
              activeTab === "products"
                ? "bg-[#132629] dark:bg-[#C5A880] text-white dark:text-[#0B1617] shadow-xs"
                : "text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-stone-800"
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Solid Wood Catalog</span>
            <span className="ml-1 px-1.5 py-0.2 text-[10px] rounded-full bg-black/20 dark:bg-white/20">
              {products.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("orders")}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition-all shrink-0 ${
              activeTab === "orders"
                ? "bg-[#132629] dark:bg-[#C5A880] text-white dark:text-[#0B1617] shadow-xs"
                : "text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-stone-800"
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Orders &amp; Commissions</span>
            <span className="ml-1 px-1.5 py-0.2 text-[10px] rounded-full bg-black/20 dark:bg-white/20">
              {orders.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("analytics")}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition-all shrink-0 ${
              activeTab === "analytics"
                ? "bg-[#132629] dark:bg-[#C5A880] text-white dark:text-[#0B1617] shadow-xs"
                : "text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-stone-800"
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Executive KPIs</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("coupons")}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition-all shrink-0 ${
              activeTab === "coupons"
                ? "bg-[#132629] dark:bg-[#C5A880] text-white dark:text-[#0B1617] shadow-xs"
                : "text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-stone-800"
            }`}
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>VIP Vouchers</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("export")}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition-all shrink-0 ${
              activeTab === "export"
                ? "bg-[#8C6239] text-white shadow-xs"
                : "text-[#8C6239] dark:text-[#C5A880] hover:bg-[#8C6239]/10"
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>PHP &amp; SQL Export</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("php-framework")}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition-all shrink-0 ${
              activeTab === "php-framework"
                ? "bg-[#8C6239] text-white shadow-xs"
                : "text-[#8C6239] dark:text-[#C5A880] hover:bg-[#8C6239]/10"
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>PHP Backend Code</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("settings")}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition-all shrink-0 ${
              activeTab === "settings"
                ? "bg-[#132629] dark:bg-[#C5A880] text-white dark:text-[#0B1617] shadow-xs"
                : "text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-stone-800"
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Admin Customizer</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("hosting-guide")}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition-all shrink-0 ${
              activeTab === "hosting-guide"
                ? "bg-emerald-800 text-white shadow-xs"
                : "text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>cPanel Guide</span>
          </button>
        </div>

        {/* TAB 1: SOLID WOOD CATALOG & INVENTORY MANAGEMENT */}
        {activeTab === "products" && (
          <div className="space-y-4">
            {/* Header & Main Actions */}
            <div className="bg-white dark:bg-stone-900 p-4 sm:p-5 rounded-xl border border-stone-200 dark:border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <span>Solid Wood Inventory &amp; Catalog</span>
                  <span className="text-xs font-sans font-normal px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                    {filteredProducts.length} of {products.length} shown
                  </span>
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  Update timber specifications, workshop stock, pricing, and high-resolution visuals.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* View Mode Toggle */}
                <div className="flex items-center bg-stone-100 dark:bg-stone-800 p-1 rounded-lg border border-stone-200 dark:border-stone-700 text-xs">
                  <button
                    type="button"
                    onClick={() => setViewMode("table")}
                    className={`p-1.5 rounded transition ${
                      viewMode === "table"
                        ? "bg-white dark:bg-stone-900 shadow-xs text-stone-900 dark:text-white"
                        : "text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                    }`}
                    title="Standard Table View"
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("compact")}
                    className={`p-1.5 rounded transition ${
                      viewMode === "compact"
                        ? "bg-white dark:bg-stone-900 shadow-xs text-stone-900 dark:text-white"
                        : "text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                    }`}
                    title="Compact High-Density Table"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded transition ${
                      viewMode === "grid"
                        ? "bg-white dark:bg-stone-900 shadow-xs text-stone-900 dark:text-white"
                        : "text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                    }`}
                    title="Visual Card Grid View"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                </div>

                {/* Add New Product Button */}
                <button
                  type="button"
                  onClick={handleOpenAddModal}
                  className="px-4 py-2 bg-[#132629] dark:bg-[#C5A880] text-white dark:text-[#0B1617] text-xs font-semibold uppercase tracking-wider rounded-lg shadow hover:brightness-110 flex items-center gap-1.5 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Bespoke Piece</span>
                </button>
              </div>
            </div>

            {/* Live Filter, Search, and Sort Controls (Customizable) */}
            <div className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Search */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search title, SKU, wood..."
                    className="w-full pl-9 pr-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-xs placeholder:text-stone-400 focus:outline-none focus:border-[#C5A880]"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Category Filter */}
                <div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-xs font-medium focus:outline-none focus:border-[#C5A880]"
                  >
                    <option value="all">All Room Suites</option>
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Wood Specie Filter */}
                <div>
                  <select
                    value={selectedWood}
                    onChange={(e) => setSelectedWood(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-xs font-medium focus:outline-none focus:border-[#C5A880]"
                  >
                    <option value="all">All Timber Species</option>
                    <option value="Teak">Chittagong Teak (Segun)</option>
                    <option value="Mahogany">Burma Mahogany</option>
                    <option value="Oak">Silky Oak (Shil Koroi)</option>
                    <option value="Rosewood">Rosewood / Sheesham</option>
                    <option value="Walnut">Walnut</option>
                    <option value="Rattan">Teak &amp; Cane (Rattan)</option>
                  </select>
                </div>

                {/* Sort By */}
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <ArrowUpDown className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-xs font-medium focus:outline-none focus:border-[#C5A880]"
                    >
                      <option value="default">Default Atelier Order</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="stock-asc">Stock: Low to High (Restock)</option>
                      <option value="stock-desc">Stock: High to Low</option>
                      <option value="name-asc">Title: A to Z</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Stock Status Pills */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-100 dark:border-stone-800/80 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-stone-400 text-[11px] mr-1">Stock Filter:</span>
                  <button
                    type="button"
                    onClick={() => setStockStatusFilter("all")}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
                      stockStatusFilter === "all"
                        ? "bg-[#132629] text-white dark:bg-[#C5A880] dark:text-[#0B1617]"
                        : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200"
                    }`}
                  >
                    All ({products.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setStockStatusFilter("in_stock")}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
                      stockStatusFilter === "in_stock"
                        ? "bg-emerald-800 text-white"
                        : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100"
                    }`}
                  >
                    In Stock ({products.filter((p) => (p.stock || 0) > lowStockThreshold).length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setStockStatusFilter("low_stock")}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
                      stockStatusFilter === "low_stock"
                        ? "bg-amber-700 text-white"
                        : "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 hover:bg-amber-100"
                    }`}
                  >
                    Low Stock &le; {lowStockThreshold} ({lowStockProducts.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setStockStatusFilter("out_of_stock")}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
                      stockStatusFilter === "out_of_stock"
                        ? "bg-rose-700 text-white"
                        : "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 hover:bg-rose-100"
                    }`}
                  >
                    Out of Stock ({outOfStockProducts.length})
                  </button>
                </div>

                {/* Reset Filters button */}
                {(searchQuery || selectedCategory !== "all" || selectedWood !== "all" || stockStatusFilter !== "all") && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                      setSelectedWood("all");
                      setStockStatusFilter("all");
                    }}
                    className="text-[11px] text-[#8C6239] dark:text-[#C5A880] hover:underline font-semibold"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            </div>

            {/* Display Mode: STANDARD TABLE VIEW */}
            {viewMode === "table" && (
              <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="text-[10px] uppercase tracking-wider text-stone-400 bg-stone-50 dark:bg-stone-950/60 border-b border-stone-200 dark:border-stone-800">
                      <tr>
                        <th className="py-3 px-4">Preview</th>
                        {visibleColumns.sku && <th>SKU &amp; Title</th>}
                        {visibleColumns.category && <th>Room Suite</th>}
                        {visibleColumns.woodType && <th>Hardwood Specie</th>}
                        {visibleColumns.dimensions && <th>Dimensions</th>}
                        {visibleColumns.pricing && <th>Pricing</th>}
                        {visibleColumns.stock && <th>Workshop Stock</th>}
                        <th className="text-right px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                      {filteredProducts.map((item) => {
                        const isLow = (item.stock || 0) <= lowStockThreshold && (item.stock || 0) > 0;
                        const isOut = (item.stock || 0) === 0;

                        return (
                          <tr key={item.id} className="hover:bg-stone-50/80 dark:hover:bg-stone-800/40 transition-colors">
                            <td className="py-3 px-4">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-12 h-12 object-cover rounded-md border border-stone-200 dark:border-stone-700 shrink-0"
                              />
                            </td>
                            {visibleColumns.sku && (
                              <td className="font-medium">
                                <span className="font-mono text-[10px] text-stone-400 block">{item.sku}</span>
                                <span className="font-serif font-semibold text-stone-900 dark:text-stone-100">
                                  {item.name}
                                </span>
                                {item.highlightTag && (
                                  <span className="inline-block mt-0.5 px-1.5 py-0.2 bg-[#C5A880]/20 text-[#8C6239] dark:text-[#C5A880] rounded text-[9px] font-semibold">
                                    {item.highlightTag}
                                  </span>
                                )}
                              </td>
                            )}
                            {visibleColumns.category && (
                              <td>
                                <span className="px-2 py-0.5 rounded text-[10px] uppercase font-semibold bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                                  {item.categoryLabel || item.category}
                                </span>
                              </td>
                            )}
                            {visibleColumns.woodType && (
                              <td className="text-stone-600 dark:text-stone-400 font-medium">
                                {item.woodType || "Chittagong Teak"}
                              </td>
                            )}
                            {visibleColumns.dimensions && (
                              <td className="text-stone-500 font-mono text-[11px]">
                                {item.dimensions || "Custom Atelier"}
                              </td>
                            )}
                            {visibleColumns.pricing && (
                              <td>
                                <span className="font-bold text-[#8C6239] dark:text-[#C5A880] block text-[13px]">
                                  {formatPrice(item.price)}
                                </span>
                                {item.originalPrice && item.originalPrice > item.price && (
                                  <span className="text-[10px] text-stone-400 line-through block">
                                    {formatPrice(item.originalPrice)}
                                  </span>
                                )}
                              </td>
                            )}
                            {visibleColumns.stock && (
                              <td>
                                <div className="flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => handleStockAdjust(item.id, item.stock, -1)}
                                    className="w-5 h-5 rounded flex items-center justify-center bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 text-xs font-bold"
                                    title="Decrease stock by 1"
                                  >
                                    -
                                  </button>
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[11px] font-bold min-w-[50px] text-center ${
                                      isOut
                                        ? "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300"
                                        : isLow
                                        ? "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300"
                                        : "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300"
                                    }`}
                                  >
                                    {item.stock} in atelier
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleStockAdjust(item.id, item.stock, 1)}
                                    className="w-5 h-5 rounded flex items-center justify-center bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 text-xs font-bold"
                                    title="Increase stock by 1"
                                  >
                                    +
                                  </button>
                                </div>
                              </td>
                            )}
                            <td className="text-right px-4 space-x-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenEditModal(item)}
                                className="p-1.5 text-stone-600 dark:text-stone-300 hover:text-[#8C6239] dark:hover:text-[#C5A880] rounded hover:bg-stone-100 dark:hover:bg-stone-800 transition"
                                title="Edit piece details"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setProductToDelete(item)}
                                className="p-1.5 text-stone-400 hover:text-rose-600 rounded hover:bg-stone-100 dark:hover:bg-stone-800 transition"
                                title="Remove piece"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {filteredProducts.length === 0 && (
                  <div className="p-12 text-center text-stone-500">
                    <p className="text-sm font-semibold">No furniture pieces match your current filters.</p>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory("all");
                        setSelectedWood("all");
                        setStockStatusFilter("all");
                      }}
                      className="mt-2 text-xs text-[#8C6239] dark:text-[#C5A880] underline"
                    >
                      Reset filters
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Display Mode: COMPACT DENSITY TABLE VIEW */}
            {viewMode === "compact" && (
              <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-[11px] text-left">
                    <thead className="text-[9px] uppercase tracking-wider text-stone-400 bg-stone-50 dark:bg-stone-950/60 border-b border-stone-200 dark:border-stone-800">
                      <tr>
                        <th className="py-2 px-3">SKU</th>
                        <th>Piece Name</th>
                        <th>Suite</th>
                        <th>Wood</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th className="text-right px-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60">
                      {filteredProducts.map((item) => (
                        <tr key={item.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors">
                          <td className="py-2 px-3 font-mono text-[10px] text-stone-400">{item.sku}</td>
                          <td className="font-semibold text-stone-900 dark:text-stone-100">{item.name}</td>
                          <td>
                            <span className="px-1.5 py-0.2 rounded text-[9px] uppercase font-semibold bg-stone-100 dark:bg-stone-800">
                              {item.categoryLabel || item.category}
                            </span>
                          </td>
                          <td className="text-stone-500">{item.woodType}</td>
                          <td className="font-bold text-[#8C6239] dark:text-[#C5A880]">{formatPrice(item.price)}</td>
                          <td>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleStockAdjust(item.id, item.stock, -1)}
                                className="w-4 h-4 rounded bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-[10px]"
                              >
                                -
                              </button>
                              <span className="font-semibold px-1 text-center min-w-[20px]">{item.stock}</span>
                              <button
                                type="button"
                                onClick={() => handleStockAdjust(item.id, item.stock, 1)}
                                className="w-4 h-4 rounded bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-[10px]"
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="text-right px-3 space-x-1">
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(item)}
                              className="p-1 text-stone-600 dark:text-stone-300 hover:text-[#8C6239] rounded"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setProductToDelete(item)}
                              className="p-1 text-stone-400 hover:text-rose-500 rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Display Mode: VISUAL CARD GRID VIEW */}
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map((item) => {
                  const isLow = (item.stock || 0) <= lowStockThreshold && (item.stock || 0) > 0;
                  const isOut = (item.stock || 0) === 0;

                  return (
                    <div
                      key={item.id}
                      className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                    >
                      <div>
                        <div className="relative aspect-4/3 bg-stone-100 dark:bg-stone-800 overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-stone-900/80 text-white backdrop-blur-xs">
                            {item.categoryLabel || item.category}
                          </span>
                          <span
                            className={`absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              isOut
                                ? "bg-rose-600 text-white"
                                : isLow
                                ? "bg-amber-500 text-stone-950 font-bold"
                                : "bg-emerald-600 text-white"
                            }`}
                          >
                            {item.stock} in stock
                          </span>
                        </div>

                        <div className="p-4 space-y-2">
                          <span className="font-mono text-[10px] text-stone-400">{item.sku}</span>
                          <h4 className="font-serif text-sm font-bold text-stone-900 dark:text-stone-100 line-clamp-1">
                            {item.name}
                          </h4>
                          <p className="text-xs text-stone-500 line-clamp-1">{item.woodType}</p>
                          <div className="flex items-baseline justify-between pt-1">
                            <span className="font-serif text-base font-bold text-[#8C6239] dark:text-[#C5A880]">
                              {formatPrice(item.price)}
                            </span>
                            {item.originalPrice && item.originalPrice > item.price && (
                              <span className="text-[11px] text-stone-400 line-through">
                                {formatPrice(item.originalPrice)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="p-4 pt-0 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between mt-2">
                        {/* Inline stock stepper */}
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleStockAdjust(item.id, item.stock, -1)}
                            className="w-6 h-6 rounded bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-xs font-bold"
                          >
                            -
                          </button>
                          <span className="text-xs font-bold px-1">{item.stock}</span>
                          <button
                            type="button"
                            onClick={() => handleStockAdjust(item.id, item.stock, 1)}
                            className="w-6 h-6 rounded bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-xs font-bold"
                          >
                            +
                          </button>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(item)}
                            className="p-1.5 text-stone-600 dark:text-stone-300 hover:text-[#8C6239] rounded hover:bg-stone-100 dark:hover:bg-stone-800"
                            title="Edit Piece"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setProductToDelete(item)}
                            className="p-1.5 text-stone-400 hover:text-rose-500 rounded hover:bg-stone-100 dark:hover:bg-stone-800"
                            title="Delete Piece"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: COMMISSIONS & ORDERS MANAGEMENT */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-stone-900 p-4 sm:p-5 rounded-xl border border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
                  Workshop Commissions &amp; Customer Orders
                </h3>
                <p className="text-xs text-stone-500">
                  Manage timber milling stages, customer deliveries, and payment status verification.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                  Total Orders: {orders.length}
                </span>
                <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                  In Queue: {pendingOrders.length}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-white dark:bg-stone-900 p-5 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 dark:border-stone-800 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-base font-bold text-[#8C6239] dark:text-[#C5A880]">
                          {ord.id}
                        </span>
                        <span className="text-xs text-stone-400">• {new Date(ord.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs font-semibold text-stone-900 dark:text-stone-100 mt-0.5">
                        Client: {ord.customerName} ({ord.customerPhone})
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="text-xs text-stone-500 font-medium">Workshop Fabrication Stage:</label>
                      <select
                        value={ord.status}
                        onChange={(e) => {
                          updateOrderStatus(ord.id, e.target.value);
                          showToast(`Updated ${ord.id} to "${e.target.value}"`, "info");
                        }}
                        className="px-3 py-1.5 bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-xs font-semibold focus:outline-none focus:border-[#C5A880]"
                      >
                        <option value="Pending">Pending Verification</option>
                        <option value="In Crafting">In Crafting (Lumber Staging)</option>
                        <option value="Quality Audit">Quality Audit &amp; Buffing</option>
                        <option value="Out for Delivery">Out for Delivery (Transit)</option>
                        <option value="Delivered">Delivered &amp; Assembled</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-stone-400 uppercase text-[10px] block">Delivery Destination</span>
                      <p className="font-medium text-stone-800 dark:text-stone-200">{ord.shippingAddress}</p>
                      <p className="text-stone-500">{ord.city} (White-Glove In-Home)</p>
                    </div>

                    <div>
                      <span className="text-stone-400 uppercase text-[10px] block">Payment Protocol</span>
                      <p className="font-medium uppercase text-stone-800 dark:text-stone-200">{ord.paymentMethod}</p>
                      <p className="text-stone-500">
                        Status: <strong className="uppercase text-emerald-600">{ord.paymentStatus}</strong>
                      </p>
                    </div>

                    <div>
                      <span className="text-stone-400 uppercase text-[10px] block">Commission Total</span>
                      <p className="font-serif text-base font-bold text-[#8C6239] dark:text-[#C5A880]">
                        {formatPrice(ord.total)}
                      </p>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="bg-stone-50 dark:bg-stone-950/50 p-3 rounded-lg border border-stone-200 dark:border-stone-800/80 text-xs">
                    <span className="text-[10px] uppercase text-stone-400 block mb-1">Commissioned Pieces</span>
                    <div className="space-y-1">
                      {ord.items &&
                        ord.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span>
                              {it.quantity}x {it.name} ({it.selectedWoodFinish || "Solid Teak"})
                            </span>
                            <span className="font-semibold">{formatPrice(it.price * it.quantity)}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: EXECUTIVE KPIS & ANALYTICS */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xs">
                <span className="text-[11px] uppercase tracking-wider text-stone-500 block">
                  Gross Commission Volume
                </span>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="font-serif text-2xl font-bold text-[#8C6239] dark:text-[#C5A880]">
                    {formatPrice(totalRevenue)}
                  </span>
                  <span className="text-xs text-emerald-600 font-semibold flex items-center gap-0.5">
                    <TrendingUp className="w-3.5 h-3.5" /> +18.4%
                  </span>
                </div>
              </div>

              <div className="p-5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xs">
                <span className="text-[11px] uppercase tracking-wider text-stone-500 block">
                  Active Workshop Queue
                </span>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100">
                    {pendingOrders.length} In Fabrication
                  </span>
                  <span className="text-xs text-amber-600 font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Agrabad Atelier
                  </span>
                </div>
              </div>

              <div className="p-5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xs">
                <span className="text-[11px] uppercase tracking-wider text-stone-500 block">
                  Total Inventory Valuation
                </span>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100">
                    {formatPrice(totalValuation)}
                  </span>
                  <span className="text-xs text-stone-500">Live Timber Asset</span>
                </div>
              </div>

              <div className="p-5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xs">
                <span className="text-[11px] uppercase tracking-wider text-stone-500 block">
                  Low Stock Warning Alert
                </span>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="font-serif text-2xl font-bold text-rose-600">
                    {lowStockProducts.length} Pieces
                  </span>
                  <span className="text-xs text-rose-500 font-medium flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> &le; {lowStockThreshold} pcs
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions & Recent Commission Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Recent Orders */}
              <div className="lg:col-span-8 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-base font-bold text-stone-900 dark:text-stone-100">
                    Recent Atelier Commissions
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab("orders")}
                    className="text-xs text-[#8C6239] dark:text-[#C5A880] hover:underline font-semibold"
                  >
                    View All Orders &rarr;
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="text-[10px] uppercase tracking-wider text-stone-400 border-b border-stone-100 dark:border-stone-800">
                      <tr>
                        <th className="py-2.5">ID</th>
                        <th>Client</th>
                        <th>City</th>
                        <th>Status</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                      {orders.slice(0, 5).map((o) => (
                        <tr key={o.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/40">
                          <td className="py-3 font-mono font-bold text-[#8C6239] dark:text-[#C5A880]">{o.id}</td>
                          <td className="font-medium text-stone-900 dark:text-stone-100">{o.customerName}</td>
                          <td className="text-stone-500">{o.city}</td>
                          <td>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                              {o.status}
                            </span>
                          </td>
                          <td className="font-bold text-stone-900 dark:text-stone-100">{formatPrice(o.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Maintenance & Export */}
              <div className="lg:col-span-4 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-base font-bold text-stone-900 dark:text-stone-100 mb-2">
                    Database &amp; Standalone Sync
                  </h3>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    Live product catalog is persisted into local storage and ready for instant standalone export to PHP MySQL.
                  </p>
                </div>

                <div className="space-y-3 pt-6">
                  <button
                    type="button"
                    onClick={handleDownloadPhp}
                    className="w-full py-2.5 px-3 bg-[#8C6239] hover:bg-[#7A5430] text-white text-xs font-semibold uppercase tracking-wider rounded-lg shadow flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" /> Download PHP Export
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsResetConfirmOpen(true)}
                    className="w-full py-2.5 px-3 border border-rose-300 dark:border-rose-800 text-rose-600 text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Reset to Initial Atelier Catalog
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: COUPONS & VIP PROMOTIONS */}
        {activeTab === "coupons" && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-stone-900 p-4 sm:p-5 rounded-xl border border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
                  Promotional Vouchers &amp; VIP Privilege Codes
                </h3>
                <p className="text-xs text-stone-500">
                  Manage promotional marketing codes for bridal seasons and corporate commissions.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {coupons.map((c) => (
                <div
                  key={c.code}
                  className="p-5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 space-y-3 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-[#8C6239]/10 text-[#8C6239] dark:text-[#C5A880] font-mono font-bold text-xs uppercase rounded border border-[#C5A880]/30">
                      {c.code}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 uppercase flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Active
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-400">{c.description}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-800">
                    <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                      {c.discountPercent ? `${c.discountPercent}% Off Discount` : `-${formatPrice(c.discountAmount || 0)}`}
                    </span>
                    {c.minSpend && (
                      <span className="text-[10px] text-stone-400">Min spend {formatPrice(c.minSpend)}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: PHP & SQL EXPORT BOILERPLATE GENERATOR */}
        {activeTab === "export" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-stone-900 p-6 rounded-xl border border-stone-200 dark:border-stone-800 space-y-5 shadow-xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-[#8C6239] dark:text-[#C5A880] text-xs font-semibold uppercase tracking-wider mb-1">
                    <FileCode className="w-4 h-4" /> Standalone Export Generator
                  </div>
                  <h3 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100">
                    Export PHP &amp; SQL Boilerplate
                  </h3>
                  <p className="text-xs text-stone-500 max-w-2xl mt-1">
                    Export your live inventory into self-contained PHP scripts and relational SQL schemas that can be run on cPanel, Apache, or MySQL with zero configuration.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDownloadPhp}
                    className="px-4 py-2 bg-[#8C6239] hover:bg-[#7A5430] text-white text-xs font-semibold uppercase tracking-wider rounded-lg shadow flex items-center gap-1.5 transition-all"
                  >
                    <Download className="w-4 h-4" /> Download .php File
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadSql}
                    className="px-4 py-2 border border-stone-300 dark:border-stone-700 hover:border-[#C5A880] text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <Database className="w-4 h-4" /> Download .sql Schema
                  </button>
                </div>
              </div>

              {/* Code Viewer Sub-tabs */}
              <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-2">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase">
                  <button
                    type="button"
                    onClick={() => setActiveExportCodeTab("php")}
                    className={`px-3 py-1.5 rounded transition ${
                      activeExportCodeTab === "php"
                        ? "bg-[#132629] text-[#C5A880] dark:bg-[#C5A880] dark:text-[#0B1617]"
                        : "text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800"
                    }`}
                  >
                    PHP Boilerplate (.php)
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveExportCodeTab("sql")}
                    className={`px-3 py-1.5 rounded transition ${
                      activeExportCodeTab === "sql"
                        ? "bg-[#132629] text-[#C5A880] dark:bg-[#C5A880] dark:text-[#0B1617]"
                        : "text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800"
                    }`}
                  >
                    Raw SQL Schema (.sql)
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopyCode(activeExportCodeTab)}
                  className="px-3 py-1 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-semibold rounded flex items-center gap-1.5 transition"
                >
                  {copiedType === activeExportCodeTab ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedType === activeExportCodeTab ? "Copied!" : "Copy Code"}</span>
                </button>
              </div>

              {/* Code Preview */}
              <div className="bg-[#121b1d] text-[#e0e6e7] p-5 rounded-xl border border-stone-800 overflow-x-auto font-mono text-xs leading-relaxed max-h-[480px]">
                <pre>
                  {activeExportCodeTab === "php"
                    ? generatePhpBoilerplate(products)
                    : generateSqlSchema(products)}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: NATIVE PHP CMS ARCHITECTURE */}
        {activeTab === "php-framework" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-stone-900 p-6 rounded-xl border border-stone-200 dark:border-stone-800 space-y-4 shadow-xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-[#8C6239] dark:text-[#C5A880] text-xs font-semibold uppercase tracking-wider mb-1">
                    <Database className="w-4 h-4" /> Native PHP 8+ CMS Website Framework
                  </div>
                  <h3 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100">
                    Backend Architecture &amp; Model Engine
                  </h3>
                  <p className="text-xs text-stone-500 max-w-2xl mt-1">
                    The files below are physically stored in <code className="bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded font-mono">/cms-php/</code> in your project repository.
                  </p>
                </div>
              </div>

              {/* File Selector Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto text-xs font-mono border-b border-stone-200 dark:border-stone-800 pb-2">
                <button
                  type="button"
                  onClick={() => setSelectedPhpFile("router")}
                  className={`px-3 py-1.5 rounded transition-colors ${
                    selectedPhpFile === "router"
                      ? "bg-[#8C6239] text-white font-bold"
                      : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900"
                  }`}
                >
                  api/index.php (Router)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPhpFile("product_model")}
                  className={`px-3 py-1.5 rounded transition-colors ${
                    selectedPhpFile === "product_model"
                      ? "bg-[#8C6239] text-white font-bold"
                      : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900"
                  }`}
                >
                  models/Product.php
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPhpFile("order_model")}
                  className={`px-3 py-1.5 rounded transition-colors ${
                    selectedPhpFile === "order_model"
                      ? "bg-[#8C6239] text-white font-bold"
                      : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900"
                  }`}
                >
                  models/Order.php
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPhpFile("database")}
                  className={`px-3 py-1.5 rounded transition-colors ${
                    selectedPhpFile === "database"
                      ? "bg-[#8C6239] text-white font-bold"
                      : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900"
                  }`}
                >
                  config/database.php
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPhpFile("schema")}
                  className={`px-3 py-1.5 rounded transition-colors ${
                    selectedPhpFile === "schema"
                      ? "bg-[#8C6239] text-white font-bold"
                      : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900"
                  }`}
                >
                  schema.sql (MySQL DDL)
                </button>
              </div>

              {/* Code Pre Block */}
              <div className="bg-[#121b1d] text-[#e0e6e7] p-5 rounded-xl border border-stone-800 overflow-x-auto font-mono text-xs leading-relaxed max-h-[500px]">
                <pre>{PHP_CODE_FILES[selectedPhpFile]}</pre>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: ADMIN CUSTOMIZER & ATELIER PREFERENCES */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-stone-900 p-6 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-6">
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-[#8C6239] dark:text-[#C5A880]" />
                  <span>Admin Panel &amp; Atelier Customization</span>
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Tailor threshold limits, visible table columns, default currency, and workshop commission options.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* Customizer: Low Stock Alert Threshold */}
                <div className="p-4 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      <span>Low Stock Alert Threshold</span>
                    </label>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                      &le; {lowStockThreshold} units
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500">
                    Products with stock at or below this count will trigger alert badges in the catalog and KPI banner.
                  </p>
                  <div className="flex items-center gap-2">
                    {[2, 3, 5, 8, 10].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => handleUpdateThreshold(num)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                          lowStockThreshold === num
                            ? "bg-[#132629] text-[#C5A880] dark:bg-[#C5A880] dark:text-[#0B1617]"
                            : "bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100"
                        }`}
                      >
                        {num} pcs
                      </button>
                    ))}
                  </div>
                </div>

                {/* Customizer: Currency Preference */}
                <div className="p-4 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700/80 space-y-3">
                  <label className="text-xs font-bold text-stone-800 dark:text-stone-200 block">
                    Catalog Currency Display
                  </label>
                  <p className="text-[11px] text-stone-500">
                    Choose the active currency used throughout the administration tables and storefront view.
                  </p>
                  <div className="flex items-center gap-2">
                    {["BDT", "USD", "EUR"].map((curr) => (
                      <button
                        key={curr}
                        type="button"
                        onClick={() => {
                          setCurrency(curr);
                          showToast(`Currency updated to ${curr}!`, "info");
                        }}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                          currency === curr
                            ? "bg-[#132629] text-[#C5A880] dark:bg-[#C5A880] dark:text-[#0B1617]"
                            : "bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100"
                        }`}
                      >
                        {curr === "BDT" ? "৳ BDT" : curr === "USD" ? "$ USD" : "€ EUR"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Customizer: Visible Columns */}
                <div className="p-4 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700/80 space-y-3">
                  <label className="text-xs font-bold text-stone-800 dark:text-stone-200 block">
                    Product Table Visible Columns
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      { key: "sku", label: "SKU & Title" },
                      { key: "category", label: "Room Category" },
                      { key: "woodType", label: "Hardwood Specie" },
                      { key: "dimensions", label: "Dimensions" },
                      { key: "pricing", label: "Pricing & MSRP" },
                      { key: "stock", label: "Stock Counter" }
                    ].map((col) => (
                      <label key={col.key} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={visibleColumns[col.key]}
                          onChange={(e) =>
                            setVisibleColumns((prev) => ({ ...prev, [col.key]: e.target.checked }))
                          }
                          className="rounded border-stone-300 text-[#8C6239] focus:ring-[#C5A880]"
                        />
                        <span className="text-stone-700 dark:text-stone-300">{col.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Customizer: Atelier Commission Settings */}
                <div className="p-4 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700/80 space-y-3">
                  <label className="text-xs font-bold text-stone-800 dark:text-stone-200 block">
                    Atelier Studio Operations
                  </label>
                  <div className="space-y-2 text-xs">
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-stone-700 dark:text-stone-300">Accepting Bespoke Commissions</span>
                      <input
                        type="checkbox"
                        checked={isAcceptingCommissions}
                        onChange={(e) => {
                          setIsAcceptingCommissions(e.target.checked);
                          showToast(
                            e.target.checked
                              ? "Atelier is now accepting custom commissions."
                              : "Atelier custom commission queue is paused.",
                            "info"
                          );
                        }}
                        className="rounded border-stone-300 text-[#8C6239] focus:ring-[#C5A880] w-4 h-4"
                      />
                    </label>

                    <div className="pt-2">
                      <span className="text-stone-500 text-[11px] block mb-1">Standard Fabrication Lead Time:</span>
                      <select
                        value={fabricationLeadTime}
                        onChange={(e) => {
                          setFabricationLeadTime(e.target.value);
                          showToast(`Lead time updated to ${e.target.value}!`, "info");
                        }}
                        className="w-full px-3 py-1.5 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded text-xs font-semibold focus:outline-none"
                      >
                        <option value="2-3 Weeks">2-3 Weeks (Express Atelier)</option>
                        <option value="3-5 Weeks">3-5 Weeks (Standard Kiln-Drying)</option>
                        <option value="6-8 Weeks">6-8 Weeks (Intricate Hand-Carving)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: HOSTING GUIDE */}
        {activeTab === "hosting-guide" && (
          <div className="space-y-6">
            <div className="bg-emerald-900/10 dark:bg-emerald-950/40 border border-emerald-600/30 rounded-2xl p-6 text-stone-800 dark:text-stone-200 shadow-xs">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-700 text-white rounded-xl">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-emerald-900 dark:text-emerald-300">
                    Why Your Hosting Doesn't Support .ts Files &amp; How to Solve It
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 leading-relaxed">
                    TypeScript (<code className="bg-stone-200 dark:bg-stone-800 px-1 py-0.5 rounded text-[11px]">.ts</code> and <code className="bg-stone-200 dark:bg-stone-800 px-1 py-0.5 rounded text-[11px]">.tsx</code>) files are developer source code and are <strong>never executed directly by standard web servers or browsers</strong> (like cPanel, Apache, LiteSpeed, Nginx).
                  </p>
                  <p className="text-xs text-stone-600 dark:text-stone-300 mt-2 leading-relaxed">
                    Click <strong>"Download PHP Export"</strong> above to download your full catalog as a single, standard PHP script that runs instantly anywhere!
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 border-2 border-emerald-600 dark:border-emerald-500 shadow-md flex flex-col justify-between">
                <div>
                  <div className="inline-block px-2.5 py-1 bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold uppercase rounded mb-3">
                    Recommended for cPanel / Shared Hosting
                  </div>
                  <h4 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100 mb-2">
                    Option 1: 100% Pure PHP CMS Website
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed mb-4">
                    Ready-to-use pure PHP website located in <code className="font-mono text-[11px] text-[#8C6239] dark:text-[#C5A880]">/cms-php/</code>. Uses standard PHP 8, PDO, and Tailwind CSS CDN. Works on <strong>any</strong> shared hosting, cPanel, Namecheap, Bluehost, or Hostinger.
                  </p>

                  <div className="space-y-2 text-xs text-stone-700 dark:text-stone-300 bg-stone-50 dark:bg-stone-800/60 p-4 rounded-xl mb-4 font-mono text-[11px]">
                    <div>✓ <strong>0% TypeScript</strong> — No .ts or .tsx files</div>
                    <div>✓ <strong>0% Node.js</strong> — No npm or build step needed on server</div>
                    <div>✓ <strong>100% Standard PHP</strong> — Upload &amp; instant launch</div>
                    <div>✓ <strong>Dual Database</strong> — Supports cPanel MySQL &amp; SQLite</div>
                  </div>

                  <h5 className="font-bold text-xs uppercase text-stone-700 dark:text-stone-300 mb-2">
                    How to Deploy in 3 Simple Steps:
                  </h5>
                  <ol className="list-decimal list-inside space-y-2 text-xs text-stone-600 dark:text-stone-400">
                    <li>Open cPanel <strong>File Manager</strong> &rarr; go to <code className="bg-stone-200 dark:bg-stone-800 px-1 rounded">public_html</code>.</li>
                    <li>Upload all files from the <code className="bg-stone-200 dark:bg-stone-800 px-1 rounded">cms-php/</code> folder.</li>
                    <li>Visit <code className="bg-stone-200 dark:bg-stone-800 px-1 rounded">yourdomain.com/install.php</code> to verify your setup!</li>
                  </ol>
                </div>
              </div>

              <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 border border-stone-200 dark:border-stone-800 shadow-md flex flex-col justify-between">
                <div>
                  <div className="inline-block px-2.5 py-1 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-[10px] font-bold uppercase rounded mb-3">
                    Modern Web SPA
                  </div>
                  <h4 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100 mb-2">
                    Option 2: Compiled Static HTML/JS Build
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed mb-4">
                    Run <code className="font-mono text-[11px] bg-stone-100 dark:bg-stone-800 px-1 rounded">npm run build</code> on your computer to produce pre-compiled HTML, CSS, and JS into the <code className="font-mono text-[11px] bg-stone-100 dark:bg-stone-800 px-1 rounded">dist/</code> folder. Upload <code className="font-mono text-[11px] bg-stone-100 dark:bg-stone-800 px-1 rounded">dist/</code> to any static host or cPanel.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: ADD OR EDIT FURNITURE PIECE */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-[150] overflow-y-auto">
          <div
            className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs transition-opacity"
            onClick={() => setIsProductModalOpen(false)}
          />

          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-2xl bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-[#C5A880]/40 p-6 sm:p-8 text-stone-900 dark:text-stone-100 my-6 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-[#8C6239]/15 text-[#8C6239] dark:text-[#C5A880]">
                    {editingProduct ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold">
                      {editingProduct ? `Edit Piece: "${editingProduct.name}"` : "Add New Bespoke Atelier Design"}
                    </h3>
                    <p className="text-[11px] text-stone-500">
                      {editingProduct
                        ? `SKU: ${editingProduct.sku || editingProduct.id} • Modifications persist immediately`
                        : "Creates a new handcrafted piece in the master inventory"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                {/* Design Title */}
                <div>
                  <label className="block font-semibold mb-1">
                    Design Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (formErrors.name) setFormErrors({ ...formErrors, name: null });
                    }}
                    placeholder="e.g., Heritage Teak Dining Credenza"
                    className={`w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border rounded-lg focus:outline-none ${
                      formErrors.name
                        ? "border-rose-500"
                        : "border-stone-300 dark:border-stone-700 focus:border-[#C5A880]"
                    }`}
                  />
                  {formErrors.name && <p className="text-rose-500 text-[10px] mt-1">{formErrors.name}</p>}
                </div>

                {/* Category & Wood Specie */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Room Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => {
                        const val = e.target.value;
                        const cat = CATEGORIES.find((c) => c.value === val);
                        setFormData({ ...formData, category: val, categoryLabel: cat ? cat.label : val });
                      }}
                      className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg focus:outline-none focus:border-[#C5A880]"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Hardwood Specie &amp; Finish</label>
                    <input
                      type="text"
                      required
                      value={formData.woodType}
                      onChange={(e) => setFormData({ ...formData, woodType: e.target.value })}
                      placeholder="e.g., Solid Chittagong Teak (Segun)"
                      className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                </div>

                {/* Pricing & Stock */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">
                      Price (BDT ৳) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.price}
                      onChange={(e) => {
                        setFormData({ ...formData, price: e.target.value });
                        if (formErrors.price) setFormErrors({ ...formErrors, price: null });
                      }}
                      className={`w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border rounded-lg font-semibold focus:outline-none ${
                        formErrors.price
                          ? "border-rose-500"
                          : "border-stone-300 dark:border-stone-700 focus:border-[#C5A880]"
                      }`}
                    />
                    {formErrors.price && <p className="text-rose-500 text-[10px] mt-1">{formErrors.price}</p>}
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Original Price / MSRP (৳)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">
                      Workshop Stock <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.stock}
                      onChange={(e) => {
                        setFormData({ ...formData, stock: e.target.value });
                        if (formErrors.stock) setFormErrors({ ...formErrors, stock: null });
                      }}
                      className={`w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border rounded-lg font-semibold focus:outline-none ${
                        formErrors.stock
                          ? "border-rose-500"
                          : "border-stone-300 dark:border-stone-700 focus:border-[#C5A880]"
                      }`}
                    />
                    {formErrors.stock && <p className="text-rose-500 text-[10px] mt-1">{formErrors.stock}</p>}
                  </div>
                </div>

                {/* Dimensions & Highlight Tag */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Dimensions &amp; Measurements</label>
                    <input
                      type="text"
                      value={formData.dimensions}
                      onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                      placeholder="e.g., 200cm W x 90cm D x 75cm H"
                      className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Highlight Badge Tag</label>
                    <input
                      type="text"
                      value={formData.highlightTag}
                      onChange={(e) => setFormData({ ...formData, highlightTag: e.target.value })}
                      placeholder="e.g., Bespoke Commission, New Arrival"
                      className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                </div>

                {/* High-Resolution Image URL + Presets */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold">Image URL</label>
                    <span className="text-[10px] text-stone-400">Click a preset below for instant high-res photo</span>
                  </div>
                  <input
                    type="url"
                    required
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg font-mono text-[11px] focus:outline-none focus:border-[#C5A880]"
                  />

                  {/* Image Presets Selector */}
                  <div className="flex items-center gap-2 mt-2 overflow-x-auto pb-1 no-scrollbar">
                    {IMAGE_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => setFormData({ ...formData, image: preset.url })}
                        className={`flex items-center gap-1.5 px-2 py-1 rounded-md border text-[10px] shrink-0 transition ${
                          formData.image === preset.url
                            ? "border-[#C5A880] bg-[#C5A880]/15 text-[#8C6239] dark:text-[#C5A880] font-bold"
                            : "border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
                        }`}
                      >
                        <img src={preset.url} alt="" className="w-4 h-4 rounded object-cover" />
                        <span>{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block font-semibold mb-1">Craftsmanship &amp; Joinery Description</label>
                  <textarea
                    rows={3}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the lumber seasoning, hand-carved details, and joinery guarantees..."
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                {/* Modal Action Buttons */}
                <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-stone-200 dark:border-stone-800">
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className="px-4 py-2 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#132629] dark:bg-[#C5A880] text-white dark:text-[#0B1617] font-semibold uppercase tracking-wider rounded-lg shadow hover:brightness-110 transition flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>{editingProduct ? "Save Changes" : "Create Atelier Piece"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: DELETE CONFIRMATION DIALOG (Avoids iframe window.confirm blocks) */}
      {productToDelete && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-stone-900 rounded-2xl max-w-md w-full p-6 border border-stone-200 dark:border-stone-800 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
              <div className="p-2.5 rounded-full bg-rose-100 dark:bg-rose-950/60">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold">Remove From Catalog?</h3>
            </div>

            <div className="flex items-center gap-3 p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700">
              <img
                src={productToDelete.image}
                alt={productToDelete.name}
                className="w-12 h-12 rounded object-cover border"
              />
              <div className="text-xs">
                <span className="font-mono text-[10px] text-stone-400">{productToDelete.sku}</span>
                <p className="font-semibold text-stone-900 dark:text-stone-100">{productToDelete.name}</p>
                <p className="text-[#8C6239] dark:text-[#C5A880] font-bold">{formatPrice(productToDelete.price)}</p>
              </div>
            </div>

            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              Are you sure you want to remove this piece from inventory? It will no longer appear in the store catalog or shopping bag.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteProduct}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Confirm Removal</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: FACTORY RESET CONFIRMATION */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-stone-900 rounded-2xl max-w-md w-full p-6 border border-stone-200 dark:border-stone-800 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400">
              <div className="p-2.5 rounded-full bg-amber-100 dark:bg-amber-950/60">
                <RefreshCw className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold">Reset Demo Catalog?</h3>
            </div>

            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              This will restore all default solid wood furniture designs, collections, and initial order records. Any custom products created during this session will be replaced.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  resetToDefaults();
                  setIsResetConfirmOpen(false);
                  showToast("Restored initial atelier catalog!", "info");
                }}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-amber-600 hover:bg-amber-700 text-white transition flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Confirm Reset</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CmsAdminPanel;
