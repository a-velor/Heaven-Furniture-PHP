<?php
require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/config/database.php';

$id = (int)($_GET['id'] ?? 1);
$pdo = Database::getConnection();

$stmt = $pdo->prepare("SELECT p.*, c.name as category_name FROM products p JOIN categories c ON p.category_id = c.id WHERE p.id = :id");
$stmt->execute([':id' => $id]);
$product = $stmt->fetch();

if (!$product) {
    header("Location: catalog.php");
    exit;
}

require_once __DIR__ . '/includes/header.php';
?>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-xs text-stone-500 mb-8">
        <a href="index.php" class="hover:text-stone-800">Home</a>
        <span>/</span>
        <a href="catalog.php" class="hover:text-stone-800">Catalog</a>
        <span>/</span>
        <span class="text-stone-800 font-semibold"><?= htmlspecialchars($product['name']) ?></span>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        <!-- Left: Gallery Image -->
        <div class="lg:col-span-7 space-y-4">
            <div class="aspect-[4/3] bg-stone-100 rounded-lg overflow-hidden border border-stone-200 shadow-sm">
                <img src="<?= htmlspecialchars($product['image_url']) ?>" alt="<?= htmlspecialchars($product['name']) ?>" class="w-full h-full object-cover">
            </div>
            <div class="grid grid-cols-3 gap-3 text-center">
                <div class="p-3 bg-white border border-stone-200 rounded">
                    <span class="text-[10px] text-stone-400 uppercase block">Wood Provenance</span>
                    <span class="text-xs font-bold text-[#132629]"><?= htmlspecialchars($product['wood_type']) ?></span>
                </div>
                <div class="p-3 bg-white border border-stone-200 rounded">
                    <span class="text-[10px] text-stone-400 uppercase block">Moisture Condition</span>
                    <span class="text-xs font-bold text-emerald-700">Kiln Seasoned 10-12%</span>
                </div>
                <div class="p-3 bg-white border border-stone-200 rounded">
                    <span class="text-[10px] text-stone-400 uppercase block">Joinery Guarantee</span>
                    <span class="text-xs font-bold text-[#8C6239]">Lifetime Tenon & Mortise</span>
                </div>
            </div>
        </div>

        <!-- Right: Purchase & Finishes Form -->
        <div class="lg:col-span-5 bg-white p-8 rounded-lg border border-stone-200 shadow-sm flex flex-col justify-between">
            <div>
                <span class="text-xs uppercase tracking-widest font-semibold text-[#8C6239] block mb-1">
                    <?= htmlspecialchars($product['category_name']) ?>
                </span>
                
                <h1 class="font-serif text-2xl sm:text-3xl text-[#132629] font-bold mb-3">
                    <?= htmlspecialchars($product['name']) ?>
                </h1>

                <div class="flex items-baseline gap-3 mb-6 pb-6 border-b border-stone-200">
                    <span class="font-serif text-3xl font-bold text-[#8C6239]">
                        <?= formatBDT((float)$product['price']) ?>
                    </span>
                    <?php if (!empty($product['original_price']) && $product['original_price'] > $product['price']): ?>
                        <span class="text-sm line-through text-stone-400">
                            <?= formatBDT((float)$product['original_price']) ?>
                        </span>
                    <?php endif; ?>
                    <span class="ml-auto text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                        <?= (int)$product['stock'] ?> Available in Atelier
                    </span>
                </div>

                <p class="text-xs text-stone-600 leading-relaxed font-light mb-6">
                    <?= htmlspecialchars($product['description']) ?>
                </p>

                <!-- Order Form -->
                <form action="cart.php" method="POST" class="space-y-4">
                    <input type="hidden" name="action" value="add">
                    <input type="hidden" name="product_id" value="<?= $product['id'] ?>">

                    <div>
                        <label class="block text-xs uppercase font-semibold text-stone-700 mb-1">Select Artisan Wood Polish</label>
                        <select name="finish" class="w-full p-2.5 border border-stone-300 rounded text-xs bg-white focus:outline-none focus:border-[#8C6239]">
                            <option value="Natural Honey Teak">Natural Honey Teak (Traditional Segun Polish)</option>
                            <option value="Antique Walnut">Antique Walnut (Deep Satin Brown)</option>
                            <option value="Ebony Shadow">Ebony Shadow (Matte Charcoal)</option>
                            <option value="Raw Timber Wax">Raw Timber Wax (Minimal Organic Feel)</option>
                        </select>
                    </div>

                    <div>
                        <label class="block text-xs uppercase font-semibold text-stone-700 mb-1">Quantity</label>
                        <input type="number" name="quantity" value="1" min="1" max="<?= $product['stock'] ?>" class="w-24 p-2.5 border border-stone-300 rounded text-xs">
                    </div>

                    <?php if (!empty($product['dimensions'])): ?>
                        <div class="p-3 bg-stone-50 border border-stone-200 rounded text-xs text-stone-600">
                            <strong>Atelier Dimensions:</strong> <?= htmlspecialchars($product['dimensions']) ?>
                        </div>
                    <?php endif; ?>

                    <div class="pt-4 space-y-3">
                        <button type="submit" class="w-full py-4 bg-[#132629] hover:bg-[#1B3236] text-[#FAF8F5] text-xs font-bold uppercase tracking-wider rounded transition-colors shadow">
                            Commission & Add to Bag
                        </button>
                        
                        <a href="https://wa.me/<?= STUDIO_WHATSAPP ?>?text=<?= urlencode("Hello Heaven Furniture Mart, I want to discuss custom dimensions for the " . $product['name']) ?>" target="_blank" class="block w-full py-3 text-center border border-dashed border-stone-400 text-stone-700 text-xs font-semibold uppercase rounded hover:bg-stone-50 transition-colors">
                            Request Custom Dimensions via WhatsApp
                        </a>
                    </div>
                </form>
            </div>
        </div>

    </div>

</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
