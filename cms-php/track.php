<?php
require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/config/database.php';

$pdo = Database::getConnection();
$orderId = trim($_GET['id'] ?? '');
$isNew = !empty($_GET['new']);

$order = null;
$items = [];

if (!empty($orderId)) {
    $stmt = $pdo->prepare("SELECT * FROM orders WHERE id = :id");
    $stmt->execute([':id' => $orderId]);
    $order = $stmt->fetch();

    if ($order) {
        $itemStmt = $pdo->prepare("SELECT * FROM order_items WHERE order_id = :id");
        $itemStmt->execute([':id' => $orderId]);
        $items = $itemStmt->fetchAll();
    }
}

require_once __DIR__ . '/includes/header.php';
?>

<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    
    <?php if ($isNew && $order): ?>
        <div class="mb-8 p-6 bg-emerald-50 border border-emerald-200 rounded-lg text-center space-y-2">
            <span class="text-xs uppercase tracking-widest font-bold text-emerald-800">✦ Commission Successfully Booked ✦</span>
            <h2 class="font-serif text-2xl font-bold text-emerald-900">Thank you, <?= htmlspecialchars($order['customer_name']) ?>!</h2>
            <p class="text-xs text-emerald-700">
                Your commission tracking identifier is <strong><?= htmlspecialchars($order['id']) ?></strong>. Our Agrabad master craftsman will reach out within 2 hours to confirm timber grain specifications.
            </p>
        </div>
    <?php endif; ?>

    <div class="bg-white p-8 rounded-lg border border-stone-200 shadow-xs mb-8">
        <h1 class="font-cinzel text-2xl text-[#132629] font-medium mb-4">Track Masterpiece Progress</h1>
        
        <form method="GET" action="track.php" class="flex gap-3">
            <input type="text" name="id" value="<?= htmlspecialchars($orderId) ?>" required placeholder="Enter Commission ID (e.g. HFM-ABC123)" class="flex-1 p-3 border border-stone-300 rounded text-xs uppercase focus:outline-none focus:border-[#8C6239]">
            <button type="submit" class="px-6 py-3 bg-[#132629] text-white text-xs font-bold uppercase tracking-wider rounded hover:bg-[#1B3236]">
                Track
            </button>
        </form>
    </div>

    <?php if ($order): ?>
        <div class="bg-white p-8 rounded-lg border border-stone-200 shadow-xs space-y-8">
            
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-stone-200 gap-4">
                <div>
                    <span class="text-[10px] uppercase text-stone-400 block">Commission Identifier</span>
                    <h3 class="font-serif text-xl font-bold text-[#132629]"><?= htmlspecialchars($order['id']) ?></h3>
                    <div class="text-xs text-stone-500">Booked: <?= date('d M Y, h:i A', strtotime($order['created_at'])) ?></div>
                </div>

                <div class="sm:text-right">
                    <span class="text-[10px] uppercase text-stone-400 block">Current Status</span>
                    <span class="inline-block px-3 py-1 bg-amber-100 text-amber-900 text-xs font-bold rounded-full uppercase tracking-wider">
                        <?= htmlspecialchars($order['status']) ?>
                    </span>
                    <div class="text-xs text-stone-500 mt-1">Payment: <?= htmlspecialchars($order['payment_method']) ?> (<?= htmlspecialchars($order['payment_status']) ?>)</div>
                </div>
            </div>

            <!-- Milestone Progress Pipeline -->
            <?php
            $stages = ['Pending', 'Crafting', 'Quality Audit', 'Out for Delivery', 'Delivered'];
            $currentStatus = $order['status'];
            $statusIdx = array_search($currentStatus, $stages);
            if ($statusIdx === false) $statusIdx = 0;
            ?>
            <div>
                <h4 class="text-xs uppercase tracking-widest font-semibold text-stone-500 mb-6">Atelier Progress Timeline</h4>
                <div class="grid grid-cols-5 gap-2 text-center text-[10px]">
                    <?php foreach ($stages as $i => $stage): ?>
                        <div class="flex flex-col items-center">
                            <div class="w-7 h-7 rounded-full flex items-center justify-center font-bold mb-2 <?= $i <= $statusIdx ? 'bg-[#132629] text-[#C5A880]' : 'bg-stone-200 text-stone-400' ?>">
                                <?= $i + 1 ?>
                            </div>
                            <span class="<?= $i <= $statusIdx ? 'font-bold text-[#132629]' : 'text-stone-400' ?>">
                                <?= $stage ?>
                            </span>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>

            <!-- Commission Items -->
            <div class="pt-6 border-t border-stone-200">
                <h4 class="text-xs uppercase tracking-widest font-semibold text-stone-500 mb-4">Commissioned Pieces</h4>
                <div class="space-y-3">
                    <?php foreach ($items as $item): ?>
                        <div class="flex justify-between items-center text-xs pb-3 border-b border-stone-100 last:border-0">
                            <div>
                                <span class="font-bold text-stone-800"><?= htmlspecialchars($item['product_name']) ?></span>
                                <span class="text-stone-500 block">Finish: <?= htmlspecialchars($item['wood_finish'] ?? 'Natural Teak') ?> · Qty: <?= $item['quantity'] ?></span>
                            </div>
                            <span class="font-bold font-serif text-[#8C6239]"><?= formatBDT((float)$item['total_price']) ?></span>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>

            <!-- Delivery Address -->
            <div class="p-4 bg-stone-50 rounded border border-stone-200 text-xs space-y-1">
                <span class="text-[10px] uppercase text-stone-400 font-semibold block">Delivery Destination</span>
                <div class="font-bold text-stone-800"><?= htmlspecialchars($order['customer_name']) ?> (<?= htmlspecialchars($order['customer_phone']) ?>)</div>
                <div class="text-stone-600"><?= htmlspecialchars($order['shipping_address']) ?>, <?= htmlspecialchars($order['city']) ?></div>
            </div>

        </div>
    <?php elseif (!empty($orderId)): ?>
        <div class="bg-white p-8 rounded-lg border border-stone-200 text-center">
            <p class="text-stone-600 text-xs">No commission found matching "<strong><?= htmlspecialchars($orderId) ?></strong>". Please check your ID or contact the atelier.</p>
        </div>
    <?php endif; ?>

</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
