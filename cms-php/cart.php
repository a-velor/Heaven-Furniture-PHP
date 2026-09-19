<?php
require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/config/database.php';

$pdo = Database::getConnection();

if (!isset($_SESSION['cart'])) {
    $_SESSION['cart'] = [];
}

// Handle POST actions
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';

    if ($action === 'add') {
        $productId = (int)($_POST['product_id'] ?? 0);
        $qty = max(1, (int)($_POST['quantity'] ?? 1));
        $finish = $_POST['finish'] ?? 'Natural Honey Teak';

        $stmt = $pdo->prepare("SELECT * FROM products WHERE id = :id AND status = 'active'");
        $stmt->execute([':id' => $productId]);
        $prod = $stmt->fetch();

        if ($prod) {
            $cartKey = $productId . '_' . md5($finish);
            if (isset($_SESSION['cart'][$cartKey])) {
                $_SESSION['cart'][$cartKey]['qty'] += $qty;
            } else {
                $_SESSION['cart'][$cartKey] = [
                    'product_id' => $prod['id'],
                    'name'       => $prod['name'],
                    'price'      => (float)$prod['price'],
                    'image_url'  => $prod['image_url'],
                    'wood_type'  => $prod['wood_type'],
                    'finish'     => $finish,
                    'qty'        => $qty
                ];
            }
        }
        header("Location: cart.php");
        exit;
    }

    if ($action === 'update') {
        $key = $_POST['cart_key'] ?? '';
        $qty = (int)($_POST['quantity'] ?? 1);
        if (isset($_SESSION['cart'][$key])) {
            if ($qty <= 0) {
                unset($_SESSION['cart'][$key]);
            } else {
                $_SESSION['cart'][$key]['qty'] = $qty;
            }
        }
        header("Location: cart.php");
        exit;
    }

    if ($action === 'remove') {
        $key = $_POST['cart_key'] ?? '';
        unset($_SESSION['cart'][$key]);
        header("Location: cart.php");
        exit;
    }

    if ($action === 'apply_coupon') {
        $code = strtoupper(trim($_POST['coupon_code'] ?? ''));
        $stmt = $pdo->prepare("SELECT * FROM coupons WHERE code = :code AND is_active = 1");
        $stmt->execute([':code' => $code]);
        $coupon = $stmt->fetch();

        if ($coupon) {
            $_SESSION['coupon'] = $coupon;
            $_SESSION['coupon_message'] = "Voucher {$code} applied successfully!";
        } else {
            unset($_SESSION['coupon']);
            $_SESSION['coupon_error'] = "Invalid or expired atelier voucher code.";
        }
        header("Location: cart.php");
        exit;
    }

    if ($action === 'remove_coupon') {
        unset($_SESSION['coupon']);
        header("Location: cart.php");
        exit;
    }
}

// Calculate totals
$subtotal = 0;
foreach ($_SESSION['cart'] as $item) {
    $subtotal += $item['price'] * $item['qty'];
}

$discount = 0;
if (!empty($_SESSION['coupon']) && $subtotal >= ($_SESSION['coupon']['min_spend'] ?? 0)) {
    $c = $_SESSION['coupon'];
    if (!empty($c['discount_percent'])) {
        $discount = round(($subtotal * $c['discount_percent']) / 100);
    } elseif (!empty($c['discount_amount'])) {
        $discount = min($subtotal, (float)$c['discount_amount']);
    }
}

$total = max(0, $subtotal - $discount);

require_once __DIR__ . '/includes/header.php';
?>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    
    <div class="mb-8 border-b border-stone-200 pb-4">
        <h1 class="font-cinzel text-3xl text-[#132629] font-medium">Your Atelier Commission Bag</h1>
        <p class="text-xs text-stone-500 mt-1">Review your solid wood pieces before submitting your order specifications.</p>
    </div>

    <?php if (empty($_SESSION['cart'])): ?>
        <div class="bg-white p-12 rounded-lg border border-stone-200 text-center max-w-lg mx-auto">
            <svg class="w-12 h-12 text-stone-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
            <h3 class="font-serif text-lg font-bold text-stone-700 mb-1">Your bag is currently empty</h3>
            <p class="text-xs text-stone-500 mb-6 font-light">Explore our solid teak and walnut collections crafted in Agrabad.</p>
            <a href="catalog.php" class="px-6 py-3 bg-[#132629] text-white text-xs font-bold uppercase tracking-wider rounded">
                Browse Solid Wood Catalog
            </a>
        </div>
    <?php else: ?>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            <!-- Items Table -->
            <div class="lg:col-span-8 bg-white p-6 rounded-lg border border-stone-200 shadow-xs">
                <div class="space-y-6">
                    <?php foreach ($_SESSION['cart'] as $key => $item): ?>
                        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-stone-100 last:border-0 last:pb-0">
                            
                            <div class="flex items-center gap-4">
                                <img src="<?= htmlspecialchars($item['image_url']) ?>" alt="<?= htmlspecialchars($item['name']) ?>" class="w-20 h-20 object-cover rounded bg-stone-100">
                                <div>
                                    <div class="text-[10px] uppercase text-[#8C6239] font-semibold"><?= htmlspecialchars($item['wood_type']) ?></div>
                                    <h4 class="font-serif font-bold text-base text-[#132629]"><?= htmlspecialchars($item['name']) ?></h4>
                                    <div class="text-xs text-stone-500">Finish: <?= htmlspecialchars($item['finish']) ?></div>
                                    <div class="text-xs font-bold text-[#8C6239] mt-1"><?= formatBDT($item['price']) ?></div>
                                </div>
                            </div>

                            <div class="flex items-center gap-4 self-end sm:self-center">
                                <form action="cart.php" method="POST" class="flex items-center gap-1">
                                    <input type="hidden" name="action" value="update">
                                    <input type="hidden" name="cart_key" value="<?= $key ?>">
                                    <input type="number" name="quantity" value="<?= $item['qty'] ?>" min="1" max="20" class="w-16 p-1.5 border border-stone-300 rounded text-xs text-center" onchange="this.form.submit()">
                                </form>

                                <div class="text-right min-w-[100px]">
                                    <span class="text-xs uppercase text-stone-400 block">Total</span>
                                    <span class="font-serif font-bold text-sm text-[#132629]"><?= formatBDT($item['price'] * $item['qty']) ?></span>
                                </div>

                                <form action="cart.php" method="POST">
                                    <input type="hidden" name="action" value="remove">
                                    <input type="hidden" name="cart_key" value="<?= $key ?>">
                                    <button type="submit" class="text-stone-400 hover:text-rose-600 p-1">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    </button>
                                </form>
                            </div>

                        </div>
                    <?php endforeach; ?>
                </div>
            </div>

            <!-- Summary Box -->
            <div class="lg:col-span-4 bg-white p-6 rounded-lg border border-stone-200 shadow-xs space-y-6">
                
                <h3 class="font-serif text-lg font-bold text-[#132629] border-b border-stone-200 pb-3">Commission Summary</h3>

                <!-- Coupon Form -->
                <div>
                    <label class="block text-xs uppercase font-semibold text-stone-600 mb-1">Voucher Code</label>
                    <?php if (!empty($_SESSION['coupon'])): ?>
                        <div class="p-3 bg-emerald-50 border border-emerald-200 rounded flex items-center justify-between text-xs">
                            <span class="text-emerald-800 font-bold"><?= htmlspecialchars($_SESSION['coupon']['code']) ?> Applied</span>
                            <form action="cart.php" method="POST">
                                <input type="hidden" name="action" value="remove_coupon">
                                <button type="submit" class="text-rose-600 hover:underline">Remove</button>
                            </form>
                        </div>
                    <?php else: ?>
                        <form action="cart.php" method="POST" class="flex gap-2">
                            <input type="hidden" name="action" value="apply_coupon">
                            <input type="text" name="coupon_code" placeholder="e.g. HEAVEN10" class="flex-1 p-2 border border-stone-300 rounded text-xs uppercase focus:outline-none focus:border-[#8C6239]">
                            <button type="submit" class="px-3 py-2 bg-[#132629] text-white text-xs font-semibold rounded">Apply</button>
                        </form>
                        <span class="text-[10px] text-stone-400 mt-1 block">Try coupon: <strong>HEAVEN10</strong> or <strong>ATELIER5000</strong></span>
                    <?php endif; ?>
                </div>

                <!-- Math Breakdown -->
                <div class="space-y-2 text-xs border-t border-stone-200 pt-4">
                    <div class="flex justify-between text-stone-600">
                        <span>Items Subtotal:</span>
                        <span><?= formatBDT($subtotal) ?></span>
                    </div>

                    <?php if ($discount > 0): ?>
                        <div class="flex justify-between text-emerald-700 font-semibold">
                            <span>Promotional Discount:</span>
                            <span>- <?= formatBDT($discount) ?></span>
                        </div>
                    <?php endif; ?>

                    <div class="flex justify-between text-stone-600">
                        <span>White-Glove Delivery & Fitting:</span>
                        <span class="text-emerald-700 font-semibold">Complimentary</span>
                    </div>

                    <div class="flex justify-between text-base font-bold font-serif text-[#132629] border-t border-stone-200 pt-3">
                        <span>Estimated Total:</span>
                        <span class="text-[#8C6239]"><?= formatBDT($total) ?></span>
                    </div>
                </div>

                <!-- Proceed Button -->
                <a href="checkout.php" class="block w-full py-3.5 bg-[#132629] hover:bg-[#1B3236] text-[#FAF8F5] text-center text-xs font-bold uppercase tracking-wider rounded transition-colors shadow">
                    Proceed to Commission Checkout
                </a>

                <div class="text-[10px] text-stone-400 text-center space-y-1">
                    <div>✓ bKash, Nagad, Bank Wire, & Cash on Delivery Accepted</div>
                    <div>✓ Official Atelier Invoice & Warranty Certificate Included</div>
                </div>

            </div>

        </div>

    <?php endif; ?>

</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
