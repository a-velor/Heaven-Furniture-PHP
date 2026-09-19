<?php
require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/config/database.php';

$pdo = Database::getConnection();

if (empty($_SESSION['cart'])) {
    header("Location: cart.php");
    exit;
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

$error = '';
$successOrderId = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $customerName    = trim($_POST['customer_name'] ?? '');
    $customerPhone   = trim($_POST['customer_phone'] ?? '');
    $customerEmail   = trim($_POST['customer_email'] ?? '');
    $shippingAddress = trim($_POST['shipping_address'] ?? '');
    $city            = trim($_POST['city'] ?? 'Chattogram');
    $paymentMethod   = trim($_POST['payment_method'] ?? 'COD');

    if (empty($customerName) || empty($customerPhone) || empty($shippingAddress)) {
        $error = "Please provide your Full Name, Phone Number, and Delivery Address.";
    } else {
        $orderId = 'HFM-' . strtoupper(substr(uniqid(), -6));

        try {
            $pdo->beginTransaction();

            $stmt = $pdo->prepare("
                INSERT INTO orders (id, customer_name, customer_phone, customer_email, shipping_address, city, subtotal, discount, total, status, payment_method, payment_status)
                VALUES (:id, :name, :phone, :email, :address, :city, :subtotal, :discount, :total, 'Pending', :payment, 'pending')
            ");

            $stmt->execute([
                ':id'       => $orderId,
                ':name'     => $customerName,
                ':phone'    => $customerPhone,
                ':email'    => $customerEmail,
                ':address'  => $shippingAddress,
                ':city'     => $city,
                ':subtotal' => $subtotal,
                ':discount' => $discount,
                ':total'    => $total,
                ':payment'  => $paymentMethod
            ]);

            $itemStmt = $pdo->prepare("
                INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, total_price, wood_finish)
                VALUES (:order_id, :product_id, :product_name, :quantity, :unit_price, :total_price, :wood_finish)
            ");

            foreach ($_SESSION['cart'] as $item) {
                $itemStmt->execute([
                    ':order_id'      => $orderId,
                    ':product_id'    => $item['product_id'],
                    ':product_name'  => $item['name'],
                    ':quantity'      => $item['qty'],
                    ':unit_price'    => $item['price'],
                    ':total_price'   => $item['price'] * $item['qty'],
                    ':wood_finish'   => $item['finish']
                ]);

                // Decrement inventory
                $pdo->prepare("UPDATE products SET stock = MAX(0, stock - :qty) WHERE id = :id")->execute([
                    ':qty' => $item['qty'],
                    ':id'  => $item['product_id']
                ]);
            }

            $pdo->commit();

            // Clear session cart
            $_SESSION['cart'] = [];
            unset($_SESSION['coupon']);

            // Redirect to tracking page
            header("Location: track.php?id=" . urlencode($orderId) . "&new=1");
            exit;

        } catch (Exception $e) {
            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }
            $error = "Error booking your commission: " . $e->getMessage();
        }
    }
}

require_once __DIR__ . '/includes/header.php';
?>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    
    <div class="mb-8 border-b border-stone-200 pb-4">
        <span class="text-xs uppercase tracking-[0.2em] font-semibold text-[#8C6239] block mb-1">Final Step</span>
        <h1 class="font-cinzel text-3xl text-[#132629] font-medium">Bespoke Commission Checkout</h1>
    </div>

    <?php if (!empty($error)): ?>
        <div class="p-4 mb-6 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded">
            <?= htmlspecialchars($error) ?>
        </div>
    <?php endif; ?>

    <form method="POST" action="checkout.php" class="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        <!-- Left: Delivery Information -->
        <div class="lg:col-span-7 bg-white p-8 rounded-lg border border-stone-200 shadow-xs space-y-6">
            
            <h3 class="font-serif text-lg font-bold text-[#132629] border-b border-stone-200 pb-2">Client & Delivery Details</h3>

            <div>
                <label class="block text-xs uppercase font-semibold text-stone-700 mb-1">Full Name *</label>
                <input type="text" name="customer_name" required placeholder="e.g. Asif Chowdhury" class="w-full p-2.5 border border-stone-300 rounded text-xs focus:outline-none focus:border-[#8C6239]">
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label class="block text-xs uppercase font-semibold text-stone-700 mb-1">Mobile Phone (Bangladeshi / WhatsApp) *</label>
                    <input type="tel" name="customer_phone" required placeholder="01XXXXXXXXX" class="w-full p-2.5 border border-stone-300 rounded text-xs focus:outline-none focus:border-[#8C6239]">
                </div>
                <div>
                    <label class="block text-xs uppercase font-semibold text-stone-700 mb-1">Email Address (Optional)</label>
                    <input type="email" name="customer_email" placeholder="client@example.com" class="w-full p-2.5 border border-stone-300 rounded text-xs focus:outline-none focus:border-[#8C6239]">
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label class="block text-xs uppercase font-semibold text-stone-700 mb-1">District / Division *</label>
                    <select name="city" class="w-full p-2.5 border border-stone-300 rounded text-xs bg-white">
                        <option value="Chattogram" selected>Chattogram (Atelier Immediate Delivery)</option>
                        <option value="Dhaka">Dhaka (Gulshan, Banani, Uttara, Dhanmondi)</option>
                        <option value="Sylhet">Sylhet Division</option>
                        <option value="Cox's Bazar">Cox's Bazar</option>
                        <option value="Other">Other District (All Bangladesh)</option>
                    </select>
                </div>
                <div>
                    <label class="block text-xs uppercase font-semibold text-stone-700 mb-1">Showroom Pickup / In-Home</label>
                    <input type="text" readonly value="Complimentary White-Glove In-Home" class="w-full p-2.5 bg-stone-50 border border-stone-300 rounded text-xs text-stone-600">
                </div>
            </div>

            <div>
                <label class="block text-xs uppercase font-semibold text-stone-700 mb-1">Street Address / Apartment & Floor *</label>
                <textarea name="shipping_address" required rows="3" placeholder="House number, road, area, floor (e.g. House 14, Road 3, O.R. Nizam Road R/A, Chattogram)" class="w-full p-2.5 border border-stone-300 rounded text-xs focus:outline-none focus:border-[#8C6239]"></textarea>
            </div>

            <!-- Payment Protocol Selection -->
            <div class="pt-4 border-t border-stone-200">
                <h4 class="font-serif text-sm font-bold text-[#132629] mb-3">Preferred Settlement Protocol</h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label class="flex items-start gap-3 p-3 border border-stone-200 rounded cursor-pointer hover:bg-stone-50">
                        <input type="radio" name="payment_method" value="COD" checked class="mt-0.5">
                        <div>
                            <div class="text-xs font-bold text-stone-800">Cash on Assembly (COD)</div>
                            <div class="text-[10px] text-stone-500">Pay upon in-home inspection in Chattogram/Dhaka</div>
                        </div>
                    </label>

                    <label class="flex items-start gap-3 p-3 border border-stone-200 rounded cursor-pointer hover:bg-stone-50">
                        <input type="radio" name="payment_method" value="bKash" class="mt-0.5">
                        <div>
                            <div class="text-xs font-bold text-[#E2136E]">bKash Merchant Pay</div>
                            <div class="text-[10px] text-stone-500">Instant mobile OTP verification</div>
                        </div>
                    </label>

                    <label class="flex items-start gap-3 p-3 border border-stone-200 rounded cursor-pointer hover:bg-stone-50">
                        <input type="radio" name="payment_method" value="Nagad" class="mt-0.5">
                        <div>
                            <div class="text-xs font-bold text-[#F7941D]">Nagad Direct</div>
                            <div class="text-[10px] text-stone-500">Fast postal digital banking</div>
                        </div>
                    </label>

                    <label class="flex items-start gap-3 p-3 border border-stone-200 rounded cursor-pointer hover:bg-stone-50">
                        <input type="radio" name="payment_method" value="Bank" class="mt-0.5">
                        <div>
                            <div class="text-xs font-bold text-stone-800">Corporate Bank Wire</div>
                            <div class="text-[10px] text-stone-500">Standard Chartered / City Bank</div>
                        </div>
                    </label>
                </div>
            </div>

        </div>

        <!-- Right: Order Items & Total -->
        <div class="lg:col-span-5 bg-white p-8 rounded-lg border border-stone-200 shadow-xs space-y-6">
            
            <h3 class="font-serif text-lg font-bold text-[#132629] border-b border-stone-200 pb-2">Summary Review</h3>

            <div class="space-y-4 max-h-72 overflow-y-auto pr-2">
                <?php foreach ($_SESSION['cart'] as $item): ?>
                    <div class="flex items-center justify-between gap-3 text-xs pb-3 border-b border-stone-100 last:border-0">
                        <div class="flex items-center gap-3">
                            <img src="<?= htmlspecialchars($item['image_url']) ?>" alt="" class="w-12 h-12 rounded object-cover bg-stone-100">
                            <div>
                                <div class="font-semibold text-stone-800"><?= htmlspecialchars($item['name']) ?></div>
                                <div class="text-[10px] text-stone-500"><?= htmlspecialchars($item['finish']) ?> · Qty: <?= $item['qty'] ?></div>
                            </div>
                        </div>
                        <span class="font-bold font-serif text-[#8C6239]"><?= formatBDT($item['price'] * $item['qty']) ?></span>
                    </div>
                <?php endforeach; ?>
            </div>

            <div class="space-y-2 text-xs border-t border-stone-200 pt-4">
                <div class="flex justify-between text-stone-600">
                    <span>Subtotal:</span>
                    <span><?= formatBDT($subtotal) ?></span>
                </div>
                <?php if ($discount > 0): ?>
                    <div class="flex justify-between text-emerald-700 font-bold">
                        <span>Discount:</span>
                        <span>- <?= formatBDT($discount) ?></span>
                    </div>
                <?php endif; ?>
                <div class="flex justify-between text-stone-600">
                    <span>Delivery:</span>
                    <span class="text-emerald-700 font-semibold">Complimentary</span>
                </div>
                <div class="flex justify-between text-base font-bold font-serif text-[#132629] border-t border-stone-200 pt-3">
                    <span>Net Commission Due:</span>
                    <span class="text-[#8C6239]"><?= formatBDT($total) ?></span>
                </div>
            </div>

            <button type="submit" class="w-full py-4 bg-[#132629] hover:bg-[#1B3236] text-[#FAF8F5] text-xs font-bold uppercase tracking-wider rounded transition-colors shadow">
                Confirm & Book Atelier Commission
            </button>

            <div class="text-[10px] text-stone-400 text-center">
                By placing this commission, you receive an official Heaven Furniture Mart timber authenticity certificate and warranty deed.
            </div>

        </div>

    </form>

</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
