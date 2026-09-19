<?php
require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/config/database.php';

$pdo = Database::getConnection();

// Fetch 6 flagship products
$stmt = $pdo->query("SELECT * FROM products WHERE status = 'active' ORDER BY id ASC LIMIT 6");
$featured = $stmt->fetchAll();

require_once __DIR__ . '/includes/header.php';
?>

<!-- Hero Section -->
<section class="relative bg-[#132629] text-[#FAF8F5] py-24 sm:py-32 overflow-hidden">
    <div class="absolute inset-0 opacity-20 bg-[radial-gradient(#C5A880_1px,transparent_1px)] [background-size:24px_24px]"></div>
    
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
        <div class="max-w-3xl space-y-6">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#C5A880]/40 bg-[#C5A880]/10 text-xs uppercase tracking-[0.2em] font-semibold text-[#D4B78F]">
                <span>Agrabad Flagship Studio · Chattogram</span>
            </div>
            
            <h1 class="font-cinzel text-4xl sm:text-6xl font-normal leading-tight">
                Solid Chittagong Teak, <br>
                <span class="text-[#D4B78F] italic">Heirloom Joinery.</span>
            </h1>
            
            <p class="text-stone-300 text-sm sm:text-base leading-relaxed font-light max-w-2xl">
                Every piece is carved from 100% kiln-seasoned Chittagong Segun, Burma Teak, and American Walnut. Commission your bespoke living, bedroom, or dining suite with white-glove in-home installation.
            </p>

            <div class="pt-4 flex flex-col sm:flex-row gap-4">
                <a href="catalog.php" class="px-8 py-4 bg-[#C5A880] hover:bg-[#D4B78F] text-[#132629] text-xs font-bold uppercase tracking-wider rounded transition-colors text-center shadow-lg">
                    Browse Solid Wood Catalog
                </a>
                <a href="#bespoke" class="px-8 py-4 bg-transparent hover:bg-white/10 text-[#FAF8F5] border border-white/20 text-xs font-semibold uppercase tracking-wider rounded transition-colors text-center">
                    Request Custom Commission
                </a>
            </div>
        </div>
    </div>
</section>

<!-- Trust Pillars Bar -->
<section class="bg-white border-b border-stone-200 py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div>
            <div class="text-sm font-bold text-[#132629]">100% Solid Teak</div>
            <div class="text-xs text-stone-500">Zero particle board or veneers</div>
        </div>
        <div>
            <div class="text-sm font-bold text-[#132629]">Kiln-Seasoned</div>
            <div class="text-xs text-stone-500">Moisture conditioned for longevity</div>
        </div>
        <div>
            <div class="text-sm font-bold text-[#132629]">Lifetime Joinery</div>
            <div class="text-xs text-stone-500">Traditional mortise & tenon joints</div>
        </div>
        <div>
            <div class="text-sm font-bold text-[#132629]">White-Glove Delivery</div>
            <div class="text-xs text-stone-500">Chattogram & nationwide assembly</div>
        </div>
    </div>
</section>

<!-- Featured Commissions -->
<section class="py-20 bg-[#FAF8F5]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="flex flex-col sm:flex-row items-baseline justify-between mb-12 border-b border-stone-200 pb-4">
            <div>
                <span class="text-xs uppercase tracking-[0.2em] font-semibold text-[#8C6239] block mb-1">Curated Atelier Pieces</span>
                <h2 class="font-cinzel text-3xl text-[#132629] font-medium">Masterwork Suites</h2>
            </div>
            <a href="catalog.php" class="text-xs uppercase tracking-wider font-semibold text-[#8C6239] hover:underline mt-2 sm:mt-0">
                View All Catalog Pieces &rarr;
            </a>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <?php foreach ($featured as $item): ?>
                <div class="bg-white border border-stone-200 rounded-lg overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-lg transition-all">
                    <div>
                        <div class="relative aspect-[4/3] bg-stone-100 overflow-hidden">
                            <img src="<?= htmlspecialchars($item['image_url']) ?>" alt="<?= htmlspecialchars($item['name']) ?>" class="w-full h-full object-cover">
                            <?php if (!empty($item['highlight_tag'])): ?>
                                <span class="absolute top-3 left-3 px-2.5 py-1 bg-[#132629] text-[#FAF8F5] text-[10px] uppercase font-bold tracking-wider">
                                    <?= htmlspecialchars($item['highlight_tag']) ?>
                                </span>
                            <?php endif; ?>
                        </div>

                        <div class="p-6">
                            <div class="text-[11px] uppercase tracking-wider text-[#8C6239] font-semibold mb-1">
                                <?= htmlspecialchars($item['wood_type']) ?>
                            </div>
                            <h3 class="font-serif text-xl font-medium text-[#132629] mb-2 leading-snug">
                                <?= htmlspecialchars($item['name']) ?>
                            </h3>
                            <p class="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-4 font-light">
                                <?= htmlspecialchars($item['description']) ?>
                            </p>
                        </div>
                    </div>

                    <div class="p-6 pt-0">
                        <div class="flex items-center justify-between py-3 border-t border-stone-100">
                            <div>
                                <span class="text-[10px] uppercase text-stone-400 block">Atelier Price</span>
                                <span class="text-lg font-bold font-serif text-[#8C6239]">
                                    <?= formatBDT((float)$item['price']) ?>
                                </span>
                            </div>
                            <span class="text-xs text-emerald-600 font-medium">
                                <?= (int)$item['stock'] ?> in stock
                            </span>
                        </div>

                        <div class="grid grid-cols-2 gap-2 mt-2">
                            <a href="product.php?id=<?= $item['id'] ?>" class="py-2.5 text-center text-xs font-semibold uppercase tracking-wider border border-stone-300 rounded hover:bg-stone-50 transition-colors text-stone-700">
                                Details
                            </a>
                            <form action="cart.php" method="POST">
                                <input type="hidden" name="action" value="add">
                                <input type="hidden" name="product_id" value="<?= $item['id'] ?>">
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

    </div>
</section>

<!-- Bespoke Studio Inquiries -->
<section id="bespoke" class="py-20 bg-[#132629] text-[#FAF8F5]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div class="space-y-6">
                <span class="text-xs uppercase tracking-[0.2em] font-semibold text-[#C5A880]">Custom Blueprint Atelier</span>
                <h2 class="font-cinzel text-3xl sm:text-4xl leading-snug">
                    Architectural Furniture Commission
                </h2>
                <p class="text-stone-300 text-sm leading-relaxed font-light">
                    Have an interior architect's floor plan, blueprint, or inspiration image? Send your specifications directly to our senior wood craftsmen in Agrabad. We inspect dimensions, season genuine timber, and create custom mockups.
                </p>
                <div class="space-y-2 text-xs text-[#D4B78F]">
                    <div>✦ 100% Chittagong Segun & Burma Teak logs</div>
                    <div>✦ German soft-close hydraulic mechanisms</div>
                    <div>✦ Lifetime anti-warp & joinery guarantee</div>
                </div>
            </div>

            <div class="bg-white text-[#2C221E] p-8 rounded-lg shadow-xl">
                <h3 class="font-serif text-xl font-bold text-[#132629] mb-4">Request Custom Atelier Blueprint</h3>
                <form action="https://wa.me/<?= STUDIO_WHATSAPP ?>" method="GET" target="_blank" class="space-y-4">
                    <div>
                        <label class="block text-xs uppercase font-semibold text-stone-600 mb-1">Your Name</label>
                        <input type="text" required placeholder="e.g. Asif Chowdhury" class="w-full p-2.5 border border-stone-300 rounded text-sm focus:outline-none focus:border-[#C5A880]">
                    </div>
                    <div>
                        <label class="block text-xs uppercase font-semibold text-stone-600 mb-1">Phone / WhatsApp</label>
                        <input type="tel" required placeholder="e.g. 01711-XXXXXX" class="w-full p-2.5 border border-stone-300 rounded text-sm focus:outline-none focus:border-[#C5A880]">
                    </div>
                    <div>
                        <label class="block text-xs uppercase font-semibold text-stone-600 mb-1">Furniture Requirement</label>
                        <textarea rows="3" placeholder="Describe the room, dimensions, or wood preference..." class="w-full p-2.5 border border-stone-300 rounded text-sm focus:outline-none focus:border-[#C5A880]"></textarea>
                    </div>
                    <button type="submit" class="w-full py-3.5 bg-[#8C6239] hover:bg-[#734e2c] text-white text-xs font-bold uppercase tracking-wider rounded transition-colors shadow">
                        Send to Master Craftsman via WhatsApp
                    </button>
                </form>
            </div>

        </div>
    </div>
</section>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
