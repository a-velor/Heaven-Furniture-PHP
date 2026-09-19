import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Ticket,
  Code2,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  Server,
  Database,
  ArrowRight,
  RefreshCw,
  Copy,
  Check,
  Eye,
  Sliders,
  Sparkles
} from 'lucide-react';
import { useEcommerce } from '../context/EcommerceContext';
import { FurnitureItem, OrderStatus } from '../types';

export const CmsAdminPanel: React.FC = () => {
  const {
    products,
    orders,
    coupons,
    formatPrice,
    updateOrderStatus,
    addProduct,
    updateProduct,
    deleteProduct,
    setActiveView,
    resetToDefaults,
  } = useEcommerce();

  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'orders' | 'coupons' | 'php-framework'>('analytics');
  
  // Product Edit / Create Modal state
  const [editingProduct, setEditingProduct] = useState<FurnitureItem | null>(null);
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'living' as 'living' | 'bedroom' | 'dining' | 'office' | 'bespoke',
    categoryLabel: 'Living Room',
    price: 150000,
    originalPrice: 175000,
    stock: 5,
    woodType: 'Chittagong Teak (Segun)',
    dimensions: '220cm x 100cm x 75cm',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=75',
    description: 'Masterfully carved solid timber piece with kiln-seasoned joinery.',
    highlightTag: 'New Atelier Commission',
  });

  // PHP Framework code viewer selected file
  const [selectedPhpFile, setSelectedPhpFile] = useState<'router' | 'product_model' | 'order_model' | 'database' | 'schema'>('router');
  const [copiedCode, setCopiedCode] = useState(false);

  // Statistics
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter((o) => o.status === 'Pending' || o.status === 'In Crafting');
  const lowStockProducts = products.filter((p) => p.stock < 5);

  const handleOpenEdit = (prod: FurnitureItem) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      category: prod.category as any,
      categoryLabel: prod.categoryLabel,
      price: prod.price,
      originalPrice: prod.originalPrice || prod.price,
      stock: prod.stock,
      woodType: prod.woodType,
      dimensions: prod.dimensions,
      image: prod.image,
      description: prod.description,
      highlightTag: prod.highlightTag || '',
    });
    setIsNewProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct(editingProduct.id, {
        ...formData,
      });
    } else {
      addProduct({
        ...formData,
        isCustomizable: true,
        materials: ['Solid Seasoned Hardwood', 'German Hardware'],
        features: ['Kiln-seasoned in Chattogram', 'Lifetime joinery guarantee'],
        rating: 5.0,
        reviewCount: 0,
      });
    }
    setIsNewProductModalOpen(false);
    setEditingProduct(null);
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

CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(50) PRIMARY KEY,
    customer_name VARCHAR(150) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_email VARCHAR(150),
    shipping_address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    subtotal DECIMAL(12,2) NOT NULL,
    total DECIMAL(12,2) NOT NULL,
    status ENUM('Pending','In Crafting','Quality Audit','Out for Delivery','Delivered','Cancelled') DEFAULT 'Pending',
    payment_method VARCHAR(50) NOT NULL,
    payment_status ENUM('pending','paid','cod') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(PHP_CODE_FILES[selectedPhpFile]);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F5F2EC] dark:bg-[#081213] text-[#2C221E] dark:text-[#F2EFE9] transition-colors py-8 px-4 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Header */}
        <div className="bg-white/90 dark:bg-stone-900/80 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8C6239] to-[#C5A880] flex items-center justify-center text-white shadow-md">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100">
                  PHP CMS Website Framework
                </h1>
                <span className="px-2.5 py-0.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold uppercase rounded-full border border-emerald-300 dark:border-emerald-800">
                  v2.4 Live
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                Heaven Furniture Mart • Master Catalog, Inventory & MySQL Production Engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setActiveView('storefront')}
              className="px-4 py-2 border border-stone-300 dark:border-stone-700 hover:border-[#C5A880] text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors"
            >
              Public Showroom
            </button>
            <button
              onClick={() => setActiveView('catalog')}
              className="px-4 py-2 bg-[#132629] dark:bg-[#C5A880] text-white dark:text-[#0B1617] text-xs font-semibold uppercase tracking-wider rounded-lg shadow hover:brightness-110 transition-colors"
            >
              Shop Catalog
            </button>
          </div>
        </div>

        {/* CMS Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto border-b border-stone-200 dark:border-stone-800 pb-2 text-xs font-semibold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
              activeTab === 'analytics'
                ? 'bg-[#132629] dark:bg-[#C5A880] text-white dark:text-[#0B1617] shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-stone-800'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Executive KPIs
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
              activeTab === 'products'
                ? 'bg-[#132629] dark:bg-[#C5A880] text-white dark:text-[#0B1617] shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-stone-800'
            }`}
          >
            <Package className="w-4 h-4" />
            Solid Wood Catalog ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
              activeTab === 'orders'
                ? 'bg-[#132629] dark:bg-[#C5A880] text-white dark:text-[#0B1617] shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-stone-800'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            Commissions & Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('coupons')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
              activeTab === 'coupons'
                ? 'bg-[#132629] dark:bg-[#C5A880] text-white dark:text-[#0B1617] shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-stone-800'
            }`}
          >
            <Ticket className="w-4 h-4" />
            Vouchers & Promotions
          </button>
          <button
            onClick={() => setActiveTab('php-framework')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
              activeTab === 'php-framework'
                ? 'bg-[#8C6239] text-white shadow-xs'
                : 'text-[#8C6239] dark:text-[#C5A880] hover:bg-[#8C6239]/10'
            }`}
          >
            <Code2 className="w-4 h-4" />
            PHP CMS Code & MySQL Architecture
          </button>
        </div>

        {/* Tab 1: Executive KPIs */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xs">
                <span className="text-[11px] uppercase tracking-wider text-stone-500 block">Gross Commission Volume</span>
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
                <span className="text-[11px] uppercase tracking-wider text-stone-500 block">Active Workshop Orders</span>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100">
                    {pendingOrders.length} In Queue
                  </span>
                  <span className="text-xs text-amber-600 font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Agrabad Workshop
                  </span>
                </div>
              </div>

              <div className="p-5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xs">
                <span className="text-[11px] uppercase tracking-wider text-stone-500 block">Catalog SKU Master</span>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100">
                    {products.length} Designs
                  </span>
                  <span className="text-xs text-stone-500">100% Solid Hardwood</span>
                </div>
              </div>

              <div className="p-5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xs">
                <span className="text-[11px] uppercase tracking-wider text-stone-500 block">Low Timber Stock Alert</span>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="font-serif text-2xl font-bold text-rose-600">
                    {lowStockProducts.length} Needs Restock
                  </span>
                  <span className="text-xs text-rose-500 font-medium flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> &lt; 5 pcs
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
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-[#8C6239] dark:text-[#C5A880] hover:underline font-semibold"
                  >
                    View All Orders
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

              {/* Maintenance & Reset */}
              <div className="lg:col-span-4 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-base font-bold text-stone-900 dark:text-stone-100 mb-2">
                    Database & Demo Control
                  </h3>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    The CMS persists data into local storage and synchronizes with the PHP MySQL backend schema. You can reset anytime to the default factory state.
                  </p>
                </div>

                <div className="space-y-3 pt-6">
                  <button
                    onClick={() => {
                      if (confirm('Reset store catalog and orders to default demo state?')) {
                        resetToDefaults();
                      }
                    }}
                    className="w-full py-2.5 px-3 border border-rose-300 dark:border-rose-800 text-rose-600 text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Reset to Initial Atelier Catalog
                  </button>

                  <button
                    onClick={() => {
                      setEditingProduct(null);
                      setIsNewProductModalOpen(true);
                    }}
                    className="w-full py-2.5 px-3 bg-[#132629] dark:bg-[#C5A880] text-white dark:text-[#0B1617] text-xs font-semibold uppercase tracking-wider rounded-lg shadow hover:brightness-110 flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Plus className="w-4 h-4" /> Add New Furniture Design
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Products CRUD */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800">
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
                  Solid Wood Product Inventory
                </h3>
                <p className="text-xs text-stone-500">
                  Manage timber types, pricing, specifications, and stock limits.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingProduct(null);
                  setIsNewProductModalOpen(true);
                }}
                className="px-4 py-2 bg-[#132629] dark:bg-[#C5A880] text-white dark:text-[#0B1617] text-xs font-semibold uppercase tracking-wider rounded-lg shadow flex items-center gap-1.5 hover:brightness-110 transition-all"
              >
                <Plus className="w-4 h-4" /> New Bespoke Design
              </button>
            </div>

            <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="text-[10px] uppercase tracking-wider text-stone-400 bg-stone-50 dark:bg-stone-950/60 border-b border-stone-200 dark:border-stone-800">
                    <tr>
                      <th className="py-3 px-4">Image</th>
                      <th>SKU & Name</th>
                      <th>Category</th>
                      <th>Hardwood Specie</th>
                      <th>Price</th>
                      <th>Atelier Stock</th>
                      <th className="text-right px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                    {products.map((item) => (
                      <tr key={item.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/40">
                        <td className="py-3 px-4">
                          <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-md border" />
                        </td>
                        <td className="font-medium">
                          <span className="font-mono text-[10px] text-stone-400 block">{item.sku}</span>
                          <span className="font-serif font-semibold text-stone-900 dark:text-stone-100">{item.name}</span>
                        </td>
                        <td>
                          <span className="px-2 py-0.5 rounded text-[10px] uppercase font-semibold bg-stone-100 dark:bg-stone-800">
                            {item.categoryLabel}
                          </span>
                        </td>
                        <td className="text-stone-600 dark:text-stone-400">{item.woodType}</td>
                        <td className="font-bold text-[#8C6239] dark:text-[#C5A880]">{formatPrice(item.price)}</td>
                        <td>
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            item.stock < 4 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {item.stock} in workshop
                          </span>
                        </td>
                        <td className="text-right px-4 space-x-2">
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 text-stone-600 dark:text-stone-300 hover:text-[#8C6239] rounded hover:bg-stone-100 dark:hover:bg-stone-800"
                            title="Edit piece"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Remove "${item.name}" from catalog?`)) {
                                deleteProduct(item.id);
                              }
                            }}
                            className="p-1.5 text-stone-400 hover:text-rose-500 rounded hover:bg-stone-100 dark:hover:bg-stone-800"
                            title="Delete piece"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Orders Management */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800">
              <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
                Commission Pipeline & Workshop Orders
              </h3>
              <p className="text-xs text-stone-500">
                Update fabrication stages, log customer payments, and manage dispatch.
              </p>
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
                      <label className="text-xs text-stone-500">Workshop Stage:</label>
                      <select
                        value={ord.status}
                        onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                        className="px-3 py-1.5 bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-xs font-semibold focus:outline-none focus:border-[#C5A880]"
                      >
                        <option value="Pending">Pending Verification</option>
                        <option value="In Crafting">In Crafting (Lumber Staging)</option>
                        <option value="Quality Audit">Quality Audit & Buffing</option>
                        <option value="Out for Delivery">Out for Delivery (Transit)</option>
                        <option value="Delivered">Delivered & Assembled</option>
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
                      <p className="text-stone-500">Status: <strong className="uppercase text-emerald-600">{ord.paymentStatus}</strong></p>
                    </div>

                    <div>
                      <span className="text-stone-400 uppercase text-[10px] block">Commission Value</span>
                      <p className="font-serif text-base font-bold text-[#8C6239] dark:text-[#C5A880]">
                        {formatPrice(ord.total)}
                      </p>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="bg-stone-50 dark:bg-stone-950/50 p-3 rounded border border-stone-200 dark:border-stone-800/80 text-xs">
                    <span className="text-[10px] uppercase text-stone-400 block mb-1">Commissioned Items</span>
                    <div className="space-y-1">
                      {ord.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span>{it.quantity}x {it.name} ({it.selectedWoodFinish || 'Solid Teak'})</span>
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

        {/* Tab 4: Coupons */}
        {activeTab === 'coupons' && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800">
              <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
                Promotional Vouchers & VIP Codes
              </h3>
              <p className="text-xs text-stone-500">
                Manage promotional marketing codes for bridal seasons and corporate suites.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {coupons.map((c) => (
                <div key={c.code} className="p-4 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-[#8C6239]/10 text-[#8C6239] dark:text-[#C5A880] font-mono font-bold text-xs uppercase rounded">
                      {c.code}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 uppercase">Active</span>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-400">{c.description}</p>
                  <p className="text-xs font-bold text-stone-900 dark:text-stone-100">
                    {c.discountPercent ? `${c.discountPercent}% Off` : `-${formatPrice(c.discountAmount || 0)}`}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: PHP Framework Code & Architecture */}
        {activeTab === 'php-framework' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-stone-900 p-6 rounded-xl border border-stone-200 dark:border-stone-800 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-[#8C6239] dark:text-[#C5A880] text-xs font-semibold uppercase tracking-wider mb-1">
                    <Database className="w-4 h-4" /> Native PHP 8+ CMS Website Framework
                  </div>
                  <h3 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100">
                    Backend Architecture & Model Engine
                  </h3>
                  <p className="text-xs text-stone-500 max-w-2xl mt-1">
                    The files below are physically stored in <code className="bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded font-mono">/cms-php/</code> in your codebase. They can be deployed to any Apache / Nginx + PHP 8+ LAMP stack.
                  </p>
                </div>

                <button
                  onClick={handleCopyCode}
                  className="px-4 py-2 bg-[#132629] dark:bg-[#C5A880] text-white dark:text-[#0B1617] text-xs font-semibold uppercase tracking-wider rounded-lg shadow flex items-center gap-1.5 hover:brightness-110 transition-all self-start"
                >
                  {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedCode ? 'Copied Code!' : 'Copy Current File'}</span>
                </button>
              </div>

              {/* File Selector Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto text-xs font-mono border-b border-stone-200 dark:border-stone-800 pb-2">
                <button
                  onClick={() => setSelectedPhpFile('router')}
                  className={`px-3 py-1.5 rounded transition-colors ${
                    selectedPhpFile === 'router'
                      ? 'bg-[#8C6239] text-white font-bold'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900'
                  }`}
                >
                  api/index.php (Router)
                </button>
                <button
                  onClick={() => setSelectedPhpFile('product_model')}
                  className={`px-3 py-1.5 rounded transition-colors ${
                    selectedPhpFile === 'product_model'
                      ? 'bg-[#8C6239] text-white font-bold'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900'
                  }`}
                >
                  models/Product.php
                </button>
                <button
                  onClick={() => setSelectedPhpFile('order_model')}
                  className={`px-3 py-1.5 rounded transition-colors ${
                    selectedPhpFile === 'order_model'
                      ? 'bg-[#8C6239] text-white font-bold'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900'
                  }`}
                >
                  models/Order.php
                </button>
                <button
                  onClick={() => setSelectedPhpFile('database')}
                  className={`px-3 py-1.5 rounded transition-colors ${
                    selectedPhpFile === 'database'
                      ? 'bg-[#8C6239] text-white font-bold'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900'
                  }`}
                >
                  config/database.php
                </button>
                <button
                  onClick={() => setSelectedPhpFile('schema')}
                  className={`px-3 py-1.5 rounded transition-colors ${
                    selectedPhpFile === 'schema'
                      ? 'bg-[#8C6239] text-white font-bold'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900'
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

      </div>

      {/* Product Add / Edit Modal */}
      {isNewProductModalOpen && (
        <div className="fixed inset-0 z-[150] overflow-y-auto">
          <div
            className="fixed inset-0 bg-stone-950/70 backdrop-blur-sm transition-opacity"
            onClick={() => setIsNewProductModalOpen(false)}
          />

          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-xl bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-[#C5A880]/40 p-6 sm:p-8 text-stone-900 dark:text-stone-100 my-6">
              <h3 className="font-serif text-xl font-bold mb-4">
                {editingProduct ? 'Edit Furniture Piece' : 'Add New Atelier Design'}
              </h3>

              <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                <div>
                  <label className="block font-medium mb-1">Design Title</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium mb-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => {
                        const val = e.target.value as any;
                        const labelMap: Record<string, string> = {
                          living: 'Living Room',
                          bedroom: 'Bedroom',
                          dining: 'Dining',
                          office: 'Office & Study',
                          bespoke: 'Bespoke Architectural',
                        };
                        setFormData({ ...formData, category: val, categoryLabel: labelMap[val] });
                      }}
                      className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded"
                    >
                      <option value="living">Living Room</option>
                      <option value="bedroom">Bedroom</option>
                      <option value="dining">Dining</option>
                      <option value="office">Office & Study</option>
                      <option value="bespoke">Bespoke Architectural</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium mb-1">Hardwood Specie</label>
                    <input
                      type="text"
                      required
                      value={formData.woodType}
                      onChange={(e) => setFormData({ ...formData, woodType: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-medium mb-1">Price (BDT ৳)</label>
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-1">Original Price (BDT ৳)</label>
                    <input
                      type="number"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded"
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-1">Atelier Stock</label>
                    <input
                      type="number"
                      required
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium mb-1">Dimensions & Specifications</label>
                  <input
                    type="text"
                    value={formData.dimensions}
                    onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">High-Resolution Image URL</label>
                  <input
                    type="url"
                    required
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">Description & Craftsmanship Details</label>
                  <textarea
                    rows={3}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-stone-200 dark:border-stone-800">
                  <button
                    type="button"
                    onClick={() => setIsNewProductModalOpen(false)}
                    className="px-4 py-2 border border-stone-300 dark:border-stone-700 rounded text-stone-600 dark:text-stone-300 hover:bg-stone-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#132629] dark:bg-[#C5A880] text-white dark:text-[#0B1617] font-semibold uppercase tracking-wider rounded shadow hover:brightness-110"
                  >
                    Save Piece to Catalog
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
