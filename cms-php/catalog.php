<?php
require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/config/database.php';

$pdo = Database::getConnection();

// Fetch categories
$catStmt = $pdo->query("SELECT * FROM categories ORDER BY id ASC");
$categories = $catStmt->fetchAll();

// Filters
$categoryFilter = $_GET['category'] ?? 'all';
$woodFilter = $_GET['wood'] ?? 'all';
$search = trim($_GET['q'] ?? '');

$sql = "SELECT p.*, c.name as category_name FROM products p JOIN categories c ON p.category_id = c.id WHERE p.status = 'active'";
$params = [];

if ($categoryFilter !== 'all' && is_numeric($categoryFilter)) {
    $sql .= " AND p.category_id = :cat_id";
    $params[':cat_id'] = $categoryFilter;
}

if ($woodFilter !== 'all') {
    $sql .= " AND p.wood_type LIKE :wood";
    $params[':wood'] = "%{$woodFilter}%";
}

if (!empty($search)) {
    $sql .= " AND (p.name LIKE :search OR p.description LIKE :search OR p.wood_type LIKE :search)";
    $params[':search'] = "%{$search}%";
}

$sql .= " ORDER BY p.id ASC";

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$products = $stmt->fetchAll();

require_once __DIR__ . '/includes/header.php';
?>

<div class="bg-white border-b border-stone-200 py-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <span class="text-xs uppercase tracking-[0.2em] font-semibold text-[#8C6239] block mb-2">Master Crafted Catalog</span>
        <h1 class="font-cinzel text-3xl sm:text-4xl text-[#132629] font-medium">Genuine Solid Wood Pieces</h1>
        <p class="text-xs text-stone-500 mt-2 font-light">
            Explore kiln-seasoned Chittagong Segun, Burma Teak, and American Walnut furniture ready for home installation or custom dimensioning.
        </p>
    </div>
</div>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    
    <!-- Filter Bar -->
    <form method="GET" action="catalog.php" class="bg-white p-4 rounded-lg border border-stone-200 mb-8 flex flex-col md:flex-row gap-4 justify-between items-center shadow-xs">
        
        <!-- Search Input -->
        <div class="w-full md:w-1/3">
            <input type="text" name="q" value="<?= htmlspecialchars($search) ?>" placeholder="Search timber, piece name..." class="w-full p-2.5 border border-stone-300 rounded text-xs focus:outline-none focus:border-[#8C6239]">
        </div>

        <div class="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <!-- Category Selector -->
            <select name="category" onchange="this.form.submit()" class="p-2.5 border border-stone-300 rounded text-xs bg-white text-stone-700">
                <option value="all">All Room Categories</option>
                <?php foreach ($categories as $cat): ?>
                    <option value="<?= $cat['id'] ?>" <?= $categoryFilter == $cat['id'] ? 'selected' : '' ?>>
                        <?= htmlspecialchars($cat['name']) ?>
                    </option>
                <?php endforeach; ?>
            </select>

            <!-- Wood Type Selector -->
            <select name="wood" onchange="this.form.submit()" class="p-2.5 border border-stone-300 rounded text-xs bg-white text-stone-700">
                <option value="all">All Timber Species</option>
                <option value="Chittagong" <?= $woodFilter === 'Chittagong' ? 'selected' : '' ?>>Chittagong Teak (Segun)</option>
                <option value="Burma" <?= $woodFilter === 'Burma' ? 'selected' : '' ?>>Burma Teak</option>
                <option value="Walnut" <?= $woodFilter === 'Walnut' ? 'selected' : '' ?>>American Walnut</option>
                <option value="Mahogany" <?= $woodFilter === 'Mahogany' ? 'selected' : '' ?>>Royal Mahogany</option>
            </select>

            <button type="submit" class="px-4 py-2.5 bg-[#132629] text-white text-xs font-semibold uppercase rounded hover:bg-[#1B3236]">
                Filter
            </button>

            <?php if ($categoryFilter !== 'all' || $woodFilter !== 'all' || !empty($search)): ?>
                <a href="catalog.php" class="text-xs text-stone-500 hover:text-stone-800 underline">Reset</a>
            <?php endif; ?>
        </div>

    </form>

    <!-- Product Grid -->
    <?php if (empty($products)): ?>
        <div class="py-16 text-center bg-white rounded-lg border border-stone-200">
            <p class="text-stone-500 text-sm">No furniture pieces matched your filter criteria.</p>
            <a href="catalog.php" class="mt-3 inline-block text-xs font-bold text-[#8C6239] uppercase">Clear All Filters</a>
        </div>
    <?php else: ?>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <?php foreach ($products as $p): ?>
                <div class="bg-white border border-stone-200 rounded-lg overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-lg transition-all">
                    <div>
                        <div class="relative aspect-[4/3] bg-stone-100 overflow-hidden">
                            <img src="<?= htmlspecialchars($p['image_url']) ?>" alt="<?= htmlspecialchars($p['name']) ?>" class="w-full h-full object-cover">
                            <span class="absolute top-3 left-3 px-2 py-0.5 bg-[#132629]/90 text-white text-[10px] uppercase font-bold tracking-wider rounded-xs">
                                <?= htmlspecialchars($p['category_name']) ?>
                            </span>
                        </div>

                        <div class="p-6">
                            <div class="text-[11px] uppercase tracking-wider text-[#8C6239] font-semibold mb-1">
                                <?= htmlspecialchars($p['wood_type']) ?>
                            </div>
                            <h3 class="font-serif text-lg font-medium text-[#132629] mb-2 leading-snug">
                                <a href="product.php?id=<?= $p['id'] ?>" class="hover:text-[#8C6239]">
                                    <?= htmlspecialchars($p['name']) ?>
                                </a>
                            </h3>
                            <p class="text-xs text-stone-500 line-clamp-2 leading-relaxed mb-3">
                                <?= htmlspecialchars($p['description']) ?>
                            </p>
                            <?php if (!empty($p['dimensions'])): ?>
                                <div class="text-[11px] text-stone-400">
                                    Dimensions: <?= htmlspecialchars($p['dimensions']) ?>
                                </div>
                            <?php endif; ?>
                        </div>
                    </div>

                    <div class="p-6 pt-0">
                        <div class="flex items-center justify-between py-3 border-t border-stone-100">
                            <div>
                                <span class="text-base font-bold font-serif text-[#8C6239]">
                                    <?= formatBDT((float)$p['price']) ?>
                                </span>
                                <?php if (!empty($p['original_price']) && $p['original_price'] > $p['price']): ?>
                                    <span class="text-xs line-through text-stone-400 ml-1">
                                        <?= formatBDT((float)$p['original_price']) ?>
                                    </span>
                                <?php endif; ?>
                            </div>
                            <span class="text-xs text-emerald-600 font-medium">
                                <?= (int)$p['stock'] ?> in atelier
                            </span>
                        </div>

                        <div class="grid grid-cols-2 gap-2 mt-2">
                            <a href="product.php?id=<?= $p['id'] ?>" class="py-2.5 text-center text-xs font-semibold uppercase tracking-wider border border-stone-300 rounded hover:bg-stone-50 transition-colors text-stone-700">
                                Inspect
                            </a>
                            <form action="cart.php" method="POST">
                                <input type="hidden" name="action" value="add">
                                <input type="hidden" name="product_id" value="<?= $p['id'] ?>">
                                <input type="hidden" name="quantity" value="1">
                                <button type="submit" class="w-full py-2.5 bg-[#132629] text-[#FAF8F5] text-xs font-semibold uppercase tracking-wider rounded hover:bg-[#1B3236] transition-colors">
                                    Add to Bag
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>

</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
