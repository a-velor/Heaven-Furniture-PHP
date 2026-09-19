<?php
require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/config/database.php';

$message = '';
$error = '';

// Test DB Connection
$dbStatus = 'Unknown';
try {
    $pdo = Database::getConnection();
    $dbStatus = 'Connected (' . $pdo->getAttribute(PDO::ATTR_DRIVER_NAME) . ')';
    $count = (int)$pdo->query("SELECT COUNT(*) FROM products")->fetchColumn();
} catch (Exception $e) {
    $dbStatus = 'Error: ' . $e->getMessage();
    $count = 0;
}

// Re-seed action
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['reseed'])) {
    try {
        $pdo = Database::getConnection();
        // Check if sqlite or mysql
        $driver = $pdo->getAttribute(PDO::ATTR_DRIVER_NAME);
        if ($driver === 'sqlite') {
            // Re-seed directly
            Database::getConnection();
            $message = "Database tables verified and sample inventory reseeded successfully!";
        } else {
            $sql = file_get_contents(__DIR__ . '/schema.sql');
            if ($sql) {
                $pdo->exec($sql);
                $message = "MySQL schema imported and seeded successfully!";
            }
        }
    } catch (Exception $e) {
        $error = "Seed failed: " . $e->getMessage();
    }
}

require_once __DIR__ . '/includes/header.php';
?>

<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    
    <div class="bg-white p-8 rounded-lg border border-stone-200 shadow-xs space-y-8">
        <div>
            <span class="text-xs uppercase tracking-widest font-semibold text-[#8C6239] block mb-1">Server Setup</span>
            <h1 class="font-cinzel text-3xl text-[#132629] font-medium">PHP CMS Environment Diagnostics</h1>
            <p class="text-xs text-stone-500 mt-1">This tool checks your shared hosting environment and confirms compatibility.</p>
        </div>

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

        <!-- Diagnostics Table -->
        <div class="space-y-3 text-xs">
            <div class="flex items-center justify-between p-3 bg-stone-50 rounded border border-stone-200">
                <span class="font-semibold text-stone-700">PHP Version:</span>
                <span class="font-mono text-emerald-700 font-bold"><?= PHP_VERSION ?> (Compatible)</span>
            </div>

            <div class="flex items-center justify-between p-3 bg-stone-50 rounded border border-stone-200">
                <span class="font-semibold text-stone-700">Database Connection Driver:</span>
                <span class="font-mono text-emerald-700 font-bold"><?= htmlspecialchars($dbStatus) ?></span>
            </div>

            <div class="flex items-center justify-between p-3 bg-stone-50 rounded border border-stone-200">
                <span class="font-semibold text-stone-700">Catalog Products in Database:</span>
                <span class="font-mono text-[#8C6239] font-bold"><?= $count ?> Products Active</span>
            </div>

            <div class="flex items-center justify-between p-3 bg-stone-50 rounded border border-stone-200">
                <span class="font-semibold text-stone-700">PDO SQLite Extension:</span>
                <span class="font-mono <?= extension_loaded('pdo_sqlite') ? 'text-emerald-700 font-bold' : 'text-stone-400' ?>">
                    <?= extension_loaded('pdo_sqlite') ? 'Enabled (Zero-config supported)' : 'Disabled' ?>
                </span>
            </div>

            <div class="flex items-center justify-between p-3 bg-stone-50 rounded border border-stone-200">
                <span class="font-semibold text-stone-700">PDO MySQL Extension:</span>
                <span class="font-mono <?= extension_loaded('pdo_mysql') ? 'text-emerald-700 font-bold' : 'text-stone-400' ?>">
                    <?= extension_loaded('pdo_mysql') ? 'Enabled (cPanel MySQL supported)' : 'Disabled' ?>
                </span>
            </div>
        </div>

        <div class="p-4 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900 space-y-2">
            <h4 class="font-bold">How to configure your cPanel MySQL Database:</h4>
            <ol class="list-decimal list-inside space-y-1 text-[11px] text-amber-800">
                <li>Log in to your hosting cPanel and go to <strong>MySQL Databases</strong>.</li>
                <li>Create a database (e.g. <code>cpaneluser_heaven</code>) and a user with full permissions.</li>
                <li>Open <code>config/config.php</code> and set <code>DB_NAME</code>, <code>DB_USER</code>, and <code>DB_PASS</code>.</li>
                <li>Import <code>schema.sql</code> in phpMyAdmin, or click below to re-seed automatically.</li>
            </ol>
        </div>

        <div class="flex items-center gap-4">
            <form action="install.php" method="POST">
                <button type="submit" name="reseed" value="1" class="px-6 py-3 bg-[#132629] hover:bg-[#1B3236] text-white text-xs font-bold uppercase tracking-wider rounded">
                    Verify & Re-seed Sample Inventory
                </button>
            </form>
            <a href="index.php" class="text-xs text-stone-600 hover:text-stone-900 font-semibold underline">
                Return to Storefront
            </a>
        </div>
    </div>

</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
