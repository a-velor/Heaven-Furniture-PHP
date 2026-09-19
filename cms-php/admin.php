<?php
require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/config/database.php';

$pdo = Database::getConnection();
$message = '';
$error = '';

// Handle Admin Actions
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';

    // Update Order Status
    if ($action === 'update_order_status') {
        $orderId = $_POST['order_id'] ?? '';
        $newStatus = $_POST['status'] ?? '';
        if ($orderId && $newStatus) {
            $stmt = $pdo->prepare("UPDATE orders SET status = :status WHERE id = :id");
            $stmt->execute([':status' => $newStatus, ':id' => $orderId]);
            $message = "Order {$orderId} status updated to {$newStatus}.";
        }
    }

    // Add New Product
    if ($action === 'add_product') {
        $name        = trim($_POST['name'] ?? '');
        $categoryId  = (int)($_POST['category_id'] ?? 1);
        $price       = (float)($_POST['price'] ?? 0);
        $stock       = (int)($_POST['stock'] ?? 5);
        $woodType    = trim($_POST['wood_type'] ?? 'Chittagong Teak (Segun)');
        $dimensions  = trim($_POST['dimensions'] ?? '');
        $imageUrl    = trim($_POST['image_url'] ?? '');
        $description = trim($_POST['description'] ?? '');
        $tag         = trim($_POST['highlight_tag'] ?? '');
        $sku         = 'HFM-' . strtoupper(substr(md5(uniqid()), 0, 6));

        if ($name && $price > 0 && $imageUrl) {
            $stmt = $pdo->prepare("
                INSERT INTO products (sku, name, category_id, price, stock, wood_type, dimensions, image_url, description, highlight_tag, status)
                VALUES (:sku, :name, :cat, :price, :stock, :wood, :dim, :img, :desc, :tag, 'active')
            ");
            $stmt->execute([
                ':sku'   => $sku,
                ':name'  => $name,
                ':cat'   => $categoryId,
                ':price' => $price,
                ':stock' => $stock,
                ':wood'  => $woodType,
                ':dim'   => $dimensions,
                ':img'   => $imageUrl,
                ':desc'  => $description,
                ':tag'   => $tag
            ]);
            $message = "Product '{$name}' successfully added to catalog!";
        } else {
            $error = "Please fill in all required fields (Name, Price, Image URL).";
        }
    }

    // Delete Product
    if ($action === 'delete_product') {
        $prodId = (int)($_POST['product_id'] ?? 0);
        if ($prodId > 0) {
            $pdo->prepare("DELETE FROM products WHERE id = :id")->execute([':id' => $prodId]);
            $message = "Product removed from catalog.";
        }
    }
}

// Fetch Analytics & Data
$totalRevenue = (float)$pdo->query("SELECT SUM(total) FROM orders")->fetchColumn();
$activeOrders = (int)$pdo->query("SELECT COUNT(*) FROM orders WHERE status != 'Delivered'")->fetchColumn();
$totalProducts = (int)$pdo->query("SELECT COUNT(*) FROM products")->fetchColumn();

// Fetch Orders
$orders = $pdo->query("SELECT * FROM orders ORDER BY created_at DESC LIMIT 20")->fetchAll();

// Fetch Products
$products = $pdo->query("SELECT p.*, c.name as category_name FROM products p JOIN categories c ON p.category_id = c.id ORDER BY p.id DESC")->fetchAll();

// Fetch Categories
$categories = $pdo->query("SELECT * FROM categories ORDER BY id ASC")->fetchAll();

require_once __DIR__ . '/includes/header.php';
?>

<div class="bg-[#132629] text-[#FAF8F5] py-10 border-b border-[#C5A880]/30">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <div class="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#C5A880] mb-1">
                <span>✦ Standalone PHP CMS Framework</span>
            </div>
            <h1 class="font-cinzel text-3xl font-medium">Heaven Atelier Administration</h1>
            <p class="text-xs text-stone-300 mt-1">Direct backend control panel running 100% on standard PHP hosting.</p>
        </div>
        <div class="flex items-center gap-3">
            <a href="install.php" class="px-4 py-2 bg-white/10 hover:bg-white/20 text-xs font-semibold rounded text-white border border-white/20">
                System Health Check
            </a>
            <a href="catalog.php" class="px-4 py-2 bg-[#C5A880] hover:bg-[#D4B78F] text-[#132629] text-xs font-bold uppercase tracking-wider rounded">
                Live Storefront
            </a>
        </div>
    </div>
</div>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">

    <?php if ($message): ?>
        <div class="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded font-medium">
            <?= htmlspecialchars($message) ?>
        </div>
    <?php endif; ?>

    <?php if ($error): ?>
        <div class="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded font-medium">
            <?= htmlspecialchars($error) ?>
        </div>
    <?php endif; ?>

    <!-- KPI Metric Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-lg border border-stone-200 shadow-xs">
            <span class="text-[10px] uppercase font-bold text-stone-400 block mb-1">Gross Commission Volume</span>
            <span class="font-serif text-3xl font-bold text-[#8C6239]"><?= formatBDT($totalRevenue) ?></span>
            <span class="text-xs text-stone-500 block mt-1">Recorded across all customer orders</span>
        </div>
        <div class="bg-white p-6 rounded-lg border border-stone-200 shadow-xs">
            <span class="text-[10px] uppercase font-bold text-stone-400 block mb-1">Active Workshop Orders</span>
            <span class="font-serif text-3xl font-bold text-[#132629]"><?= $activeOrders ?></span>
            <span class="text-xs text-stone-500 block mt-1">Currently in carpentry or transit</span>
        </div>
        <div class="bg-white p-6 rounded-lg border border-stone-200 shadow-xs">
            <span class="text-[10px] uppercase font-bold text-stone-400 block mb-1">Catalog SKUs In Stock</span>
            <span class="font-serif text-3xl font-bold text-emerald-700"><?= $totalProducts ?></span>
            <span class="text-xs text-stone-500 block mt-1">Kiln-seasoned hardwood designs</span>
        </div>
    </div>

    <!-- Section 1: Orders Pipeline -->
    <div class="bg-white rounded-lg border border-stone-200 shadow-xs overflow-hidden">
        <div class="p-6 border-b border-stone-200 flex items-center justify-between">
            <div>
                <h3 class="font-serif text-lg font-bold text-[#132629]">Customer Commissions Pipeline</h3>
                <p class="text-xs text-stone-500">Live order queue from online bag checkouts.</p>
            </div>
        </div>

        <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
                <thead class="bg-stone-50 text-stone-600 uppercase text-[10px] border-b border-stone-200">
                    <tr>
                        <th class="p-4">Order ID</th>
                        <th class="p-4">Customer</th>
                        <th class="p-4">Amount</th>
                        <th class="p-4">Payment</th>
                        <th class="p-4">Status</th>
                        <th class="p-4">Action</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-stone-100">
                    <?php if (empty($orders)): ?>
                        <tr><td colspan="6" class="p-6 text-center text-stone-400">No orders recorded yet.</td></tr>
                    <?php else: ?>
                        <?php foreach ($orders as $ord): ?>
                            <tr class="hover:bg-stone-50/60">
                                <td class="p-4 font-mono font-bold text-[#132629]"><?= htmlspecialchars($ord['id']) ?></td>
                                <td class="p-4">
                                    <div class="font-semibold text-stone-800"><?= htmlspecialchars($ord['customer_name']) ?></div>
                                    <div class="text-[11px] text-stone-400"><?= htmlspecialchars($ord['customer_phone']) ?> · <?= htmlspecialchars($ord['city']) ?></div>
                                </td>
                                <td class="p-4 font-serif font-bold text-[#8C6239]"><?= formatBDT((float)$ord['total']) ?></td>
                                <td class="p-4 text-[11px] text-stone-600"><?= htmlspecialchars($ord['payment_method']) ?></td>
                                <td class="p-4">
                                    <span class="px-2.5 py-1 bg-amber-100 text-amber-900 rounded font-bold uppercase text-[10px]">
                                        <?= htmlspecialchars($ord['status']) ?>
                                    </span>
                                </td>
                                <td class="p-4">
                                    <form action="admin.php" method="POST" class="flex items-center gap-1">
                                        <input type="hidden" name="action" value="update_order_status">
                                        <input type="hidden" name="order_id" value="<?= $ord['id'] ?>">
                                        <select name="status" class="p-1 border border-stone-300 rounded text-xs bg-white" onchange="this.form.submit()">
                                            <option value="Pending" <?= $ord['status'] === 'Pending' ? 'selected' : '' ?>>Pending</option>
                                            <option value="Crafting" <?= $ord['status'] === 'Crafting' ? 'selected' : '' ?>>Crafting</option>
                                            <option value="Quality Audit" <?= $ord['status'] === 'Quality Audit' ? 'selected' : '' ?>>Quality Audit</option>
                                            <option value="Out for Delivery" <?= $ord['status'] === 'Out for Delivery' ? 'selected' : '' ?>>Out for Delivery</option>
                                            <option value="Delivered" <?= $ord['status'] === 'Delivered' ? 'selected' : '' ?>>Delivered</option>
                                        </select>
                                    </form>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>

    <!-- Section 2: Add New Product Form -->
    <div class="bg-white p-8 rounded-lg border border-stone-200 shadow-xs space-y-6">
        <div class="border-b border-stone-200 pb-3">
            <h3 class="font-serif text-lg font-bold text-[#132629]">Add New Furniture Piece to Catalog</h3>
            <p class="text-xs text-stone-500">Instantly creates a new piece in the MySQL or SQLite database.</p>
        </div>

        <form action="admin.php" method="POST" class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <input type="hidden" name="action" value="add_product">

            <div>
                <label class="block text-xs uppercase font-semibold text-stone-700 mb-1">Piece Name *</label>
                <input type="text" name="name" required placeholder="e.g. Victorian Teak Armoire" class="w-full p-2.5 border border-stone-300 rounded text-xs">
            </div>

            <div>
                <label class="block text-xs uppercase font-semibold text-stone-700 mb-1">Room Category</label>
                <select name="category_id" class="w-full p-2.5 border border-stone-300 rounded text-xs bg-white">
                    <?php foreach ($categories as $cat): ?>
                        <option value="<?= $cat['id'] ?>"><?= htmlspecialchars($cat['name']) ?></option>
                    <?php endforeach; ?>
                </select>
            </div>

            <div>
                <label class="block text-xs uppercase font-semibold text-stone-700 mb-1">Price in BDT (৳) *</label>
                <input type="number" name="price" required placeholder="145000" class="w-full p-2.5 border border-stone-300 rounded text-xs">
            </div>

            <div>
                <label class="block text-xs uppercase font-semibold text-stone-700 mb-1">Hardwood Species *</label>
                <select name="wood_type" class="w-full p-2.5 border border-stone-300 rounded text-xs bg-white">
                    <option value="Chittagong Teak (Segun)">Chittagong Teak (Segun)</option>
                    <option value="Burma Segun Teak">Burma Segun Teak</option>
                    <option value="American Walnut">American Walnut</option>
                    <option value="Royal Mahogany">Royal Mahogany</option>
                </select>
            </div>

            <div>
                <label class="block text-xs uppercase font-semibold text-stone-700 mb-1">Atelier Stock</label>
                <input type="number" name="stock" value="4" class="w-full p-2.5 border border-stone-300 rounded text-xs">
            </div>

            <div>
                <label class="block text-xs uppercase font-semibold text-stone-700 mb-1">Dimensions (e.g. 200x90x45cm)</label>
                <input type="text" name="dimensions" placeholder="e.g. 210x95x80cm" class="w-full p-2.5 border border-stone-300 rounded text-xs">
            </div>

            <div class="md:col-span-2">
                <label class="block text-xs uppercase font-semibold text-stone-700 mb-1">Image URL *</label>
                <input type="url" name="image_url" required placeholder="https://images.unsplash.com/photo-..." class="w-full p-2.5 border border-stone-300 rounded text-xs">
            </div>

            <div>
                <label class="block text-xs uppercase font-semibold text-stone-700 mb-1">Highlight Badge (Optional)</label>
                <input type="text" name="highlight_tag" placeholder="e.g. Masterwork or In Stock" class="w-full p-2.5 border border-stone-300 rounded text-xs">
            </div>

            <div class="md:col-span-3">
                <label class="block text-xs uppercase font-semibold text-stone-700 mb-1">Artisan Description</label>
                <textarea name="description" rows="2" placeholder="Describe wood grain, joinery, and aesthetic features..." class="w-full p-2.5 border border-stone-300 rounded text-xs"></textarea>
            </div>

            <div class="md:col-span-3">
                <button type="submit" class="px-8 py-3.5 bg-[#132629] text-white text-xs font-bold uppercase tracking-wider rounded hover:bg-[#1B3236] transition-colors shadow">
                    Save Piece to Catalog
                </button>
            </div>
        </form>
    </div>

    <!-- Section 3: Existing Catalog Table -->
    <div class="bg-white rounded-lg border border-stone-200 shadow-xs overflow-hidden">
        <div class="p-6 border-b border-stone-200">
            <h3 class="font-serif text-lg font-bold text-[#132629]">Existing Catalog Inventory (<?= count($products) ?> items)</h3>
        </div>

        <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
                <thead class="bg-stone-50 text-stone-600 uppercase text-[10px] border-b border-stone-200">
                    <tr>
                        <th class="p-4">Image</th>
                        <th class="p-4">Piece Name</th>
                        <th class="p-4">Category</th>
                        <th class="p-4">Wood Type</th>
                        <th class="p-4">Price</th>
                        <th class="p-4">Stock</th>
                        <th class="p-4">Action</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-stone-100">
                    <?php foreach ($products as $p): ?>
                        <tr class="hover:bg-stone-50/60">
                            <td class="p-4">
                                <img src="<?= htmlspecialchars($p['image_url']) ?>" alt="" class="w-12 h-12 object-cover rounded bg-stone-100">
                            </td>
                            <td class="p-4">
                                <div class="font-semibold text-stone-800"><?= htmlspecialchars($p['name']) ?></div>
                                <div class="text-[10px] text-stone-400 font-mono"><?= htmlspecialchars($p['sku']) ?></div>
                            </td>
                            <td class="p-4 text-stone-600"><?= htmlspecialchars($p['category_name']) ?></td>
                            <td class="p-4 text-stone-600"><?= htmlspecialchars($p['wood_type']) ?></td>
                            <td class="p-4 font-serif font-bold text-[#8C6239]"><?= formatBDT((float)$p['price']) ?></td>
                            <td class="p-4"><?= (int)$p['stock'] ?></td>
                            <td class="p-4">
                                <form action="admin.php" method="POST" onsubmit="return confirm('Delete this piece from catalog?');">
                                    <input type="hidden" name="action" value="delete_product">
                                    <input type="hidden" name="product_id" value="<?= $p['id'] ?>">
                                    <button type="submit" class="text-rose-600 hover:text-rose-800 font-semibold text-xs">
                                        Delete
                                    </button>
                                </form>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>

</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
