/**
 * Utility to generate standalone PHP/SQL boilerplate schema and seed scripts
 * based on the live product inventory state.
 */

/**
 * Escapes strings for safe inclusion in SQL statements
 */
export function escapeSqlString(val) {
  if (val === null || val === undefined) return "NULL";
  if (typeof val === "number") return isNaN(val) ? "0" : String(val);
  if (typeof val === "boolean") return val ? "1" : "0";
  return "'" + String(val).replace(/\\/g, "\\\\").replace(/'/g, "\\'") + "'";
}

/**
 * Escapes strings for safe inclusion in PHP single-quoted strings
 */
export function escapePhpString(val) {
  if (val === null || val === undefined) return "''";
  if (typeof val === "number") return isNaN(val) ? "0" : String(val);
  if (typeof val === "boolean") return val ? "true" : "false";
  return "'" + String(val).replace(/\\/g, "\\\\").replace(/'/g, "\\'") + "'";
}

/**
 * Generates pure SQL schema and INSERT statements representing current products
 */
export function generateSqlSchema(products) {
  const timestamp = new Date().toISOString();
  const totalItems = products.length;

  let inserts = "";
  products.forEach((p) => {
    const id = escapeSqlString(p.id);
    const sku = escapeSqlString(p.sku || `HVL-${p.id.slice(0, 8).toUpperCase()}`);
    const name = escapeSqlString(p.name);
    const category = escapeSqlString(p.category || "living");
    const categoryLabel = escapeSqlString(p.categoryLabel || p.category);
    const price = Number(p.price) || 0;
    const originalPrice = Number(p.originalPrice) || Math.round(price * 1.15);
    const stock = Number(p.stock) || 0;
    const woodType = escapeSqlString(p.woodType || "Solid Chittagong Teak");
    const dimensions = escapeSqlString(p.dimensions || "Custom Atelier");
    const description = escapeSqlString(p.description || "");
    const image = escapeSqlString(p.image || "");
    const highlightTag = escapeSqlString(p.highlightTag || "");
    const isCustomizable = p.isCustomizable ? 1 : 0;
    const materials = escapeSqlString(JSON.stringify(p.materials || [p.woodType || "Teak"]));
    const features = escapeSqlString(JSON.stringify(p.features || []));

    inserts += `INSERT INTO \`products\` (
  \`id\`, \`sku\`, \`name\`, \`category\`, \`category_label\`,
  \`price\`, \`original_price\`, \`stock\`, \`wood_type\`, \`dimensions\`,
  \`description\`, \`image\`, \`materials\`, \`features\`, \`highlight_tag\`,
  \`is_customizable\`, \`status\`
) VALUES (
  ${id}, ${sku}, ${name}, ${category}, ${categoryLabel},
  ${price.toFixed(2)}, ${originalPrice.toFixed(2)}, ${stock}, ${woodType}, ${dimensions},
  ${description}, ${image}, ${materials}, ${features}, ${highlightTag},
  ${isCustomizable}, 'active'
) ON DUPLICATE KEY UPDATE
  \`name\` = VALUES(\`name\`),
  \`price\` = VALUES(\`price\`),
  \`original_price\` = VALUES(\`original_price\`),
  \`stock\` = VALUES(\`stock\`),
  \`wood_type\` = VALUES(\`wood_type\`),
  \`dimensions\` = VALUES(\`dimensions\`),
  \`description\` = VALUES(\`description\`),
  \`image\` = VALUES(\`image\`),
  \`materials\` = VALUES(\`materials\`),
  \`features\` = VALUES(\`features\`),
  \`highlight_tag\` = VALUES(\`highlight_tag\`);\n\n`;
  });

  return `-- ============================================================================
-- HEAVEN FURNITURE MART - SQL PRODUCT SCHEMA & SEED BOILERPLATE
-- Export Generated: ${timestamp}
-- Total Live Catalog Products: ${totalItems}
-- Compatibility: MySQL 5.7+, MariaDB 10.2+, or SQLite 3
-- ============================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- 1. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS \`categories\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`slug\` VARCHAR(64) NOT NULL UNIQUE,
  \`label\` VARCHAR(128) NOT NULL,
  \`display_order\` INT DEFAULT 0,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. PRODUCTS INVENTORY TABLE
CREATE TABLE IF NOT EXISTS \`products\` (
  \`id\` VARCHAR(64) NOT NULL PRIMARY KEY,
  \`sku\` VARCHAR(64) NOT NULL UNIQUE,
  \`name\` VARCHAR(255) NOT NULL,
  \`category\` VARCHAR(64) NOT NULL,
  \`category_label\` VARCHAR(128) NOT NULL,
  \`price\` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  \`original_price\` DECIMAL(12, 2) DEFAULT 0.00,
  \`stock\` INT NOT NULL DEFAULT 0,
  \`wood_type\` VARCHAR(128) DEFAULT 'Solid Chittagong Teak',
  \`dimensions\` VARCHAR(128) DEFAULT NULL,
  \`description\` TEXT,
  \`image\` VARCHAR(512) NOT NULL,
  \`materials\` JSON DEFAULT NULL,
  \`features\` JSON DEFAULT NULL,
  \`highlight_tag\` VARCHAR(128) DEFAULT NULL,
  \`is_customizable\` TINYINT(1) DEFAULT 0,
  \`status\` ENUM('active', 'draft', 'archived') DEFAULT 'active',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_products_cat (\`category\`),
  INDEX idx_products_price (\`price\`),
  INDEX idx_products_stock (\`stock\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. SEED DEFAULT CATEGORIES
INSERT INTO \`categories\` (\`slug\`, \`label\`, \`display_order\`) VALUES
('living', 'Living Room', 1),
('dining', 'Dining Room', 2),
('bedroom', 'Bedroom', 3),
('office', 'Executive Office', 4),
('outdoor', 'Outdoor Veranda', 5),
('decor', 'Accent Decor', 6)
ON DUPLICATE KEY UPDATE \`label\` = VALUES(\`label\`);

-- 4. CURRENT PRODUCTS SEED STATEMENTS (${totalItems} ITEMS)
${inserts}

SET FOREIGN_KEY_CHECKS = 1;
`;
}

/**
 * Generates a complete standalone PHP boilerplate file containing database schema,
 * array representations, PDO operations, and CRUD helpers.
 */
export function generatePhpBoilerplate(products) {
  const timestamp = new Date().toISOString();
  const totalItems = products.length;
  const rawSql = generateSqlSchema(products);

  // Generate PHP array of products
  let phpArrayItems = "";
  products.forEach((p) => {
    phpArrayItems += `    [
        'id' => ${escapePhpString(p.id)},
        'sku' => ${escapePhpString(p.sku || `HVL-${p.id.slice(0, 8).toUpperCase()}`)},
        'name' => ${escapePhpString(p.name)},
        'category' => ${escapePhpString(p.category || "living")},
        'category_label' => ${escapePhpString(p.categoryLabel || p.category)},
        'price' => ${Number(p.price) || 0},
        'original_price' => ${Number(p.originalPrice) || 0},
        'stock' => ${Number(p.stock) || 0},
        'wood_type' => ${escapePhpString(p.woodType || "Solid Chittagong Teak")},
        'dimensions' => ${escapePhpString(p.dimensions || "Custom Atelier Dimensions")},
        'description' => ${escapePhpString(p.description || "")},
        'image' => ${escapePhpString(p.image || "")},
        'highlight_tag' => ${escapePhpString(p.highlightTag || "")},
        'is_customizable' => ${p.isCustomizable ? "true" : "false"},
        'materials' => [${(p.materials || []).map((m) => escapePhpString(m)).join(", ")}],
        'features' => [${(p.features || []).map((f) => escapePhpString(f)).join(", ")}],
        'status' => 'active'
    ],\n`;
  });

  return `<?php
/**
 * ============================================================================
 * HEAVEN FURNITURE MART - STANDALONE PHP & SQL BOILERPLATE SCHEMA EXPORT
 * ============================================================================
 * Generated: ${timestamp}
 * Total Live Products: ${totalItems} items
 *
 * This standalone PHP script contains:
 * 1. Database connection boilerplate (PDO with MySQL / SQLite support)
 * 2. Full SQL Schema (DDL) and current live Product inventory seeds (DML)
 * 3. Native PHP data structure representing the current product state
 * 4. Helper API functions for catalog queries, inventory updates, and CRUD
 * 5. Automatic schema installation route (?action=install) & JSON API endpoint
 * ============================================================================
 */

declare(strict_types=1);

// ---------------------------------------------------------------------------
// 1. DATABASE CONFIGURATION
// ---------------------------------------------------------------------------
$databaseConfig = [
    'driver'   => 'mysql', // Options: 'mysql' or 'sqlite'
    'host'     => getenv('DB_HOST') ?: '127.0.0.1',
    'port'     => (int)(getenv('DB_PORT') ?: 3306),
    'dbname'   => getenv('DB_NAME') ?: 'heaven_furniture',
    'user'     => getenv('DB_USER') ?: 'root',
    'password' => getenv('DB_PASS') ?: '',
    'charset'  => 'utf8mb4'
];

// ---------------------------------------------------------------------------
// 2. RAW SQL SCHEMA & PRODUCT SEEDS
// ---------------------------------------------------------------------------
$sqlSchemaBoilerplate = <<<'SQL'
${rawSql}
SQL;

// ---------------------------------------------------------------------------
// 3. LIVE PRODUCT STATE (NATIVE PHP ARRAY)
// ---------------------------------------------------------------------------
$liveProductState = [
${phpArrayItems}];

// ---------------------------------------------------------------------------
// 4. DATABASE CONNECTION & INITIALIZATION
// ---------------------------------------------------------------------------

/**
 * Obtain a secure PDO connection instance
 */
function getDatabaseConnection(array $config): PDO {
    if ($config['driver'] === 'sqlite') {
        $dbPath = __DIR__ . '/database.sqlite';
        $pdo = new PDO('sqlite:' . $dbPath);
    } else {
        $dsn = sprintf(
            'mysql:host=%s;port=%d;dbname=%s;charset=%s',
            $config['host'],
            $config['port'],
            $config['dbname'],
            $config['charset']
        );
        $pdo = new PDO($dsn, $config['user'], $config['password'], [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]);
    }
    return $pdo;
}

/**
 * Execute Schema Migration & Seed the current live products
 */
function migrateProductSchema(PDO $pdo, string $sqlScript): array {
    try {
        $pdo->exec($sqlScript);
        return [
            'success' => true,
            'message' => 'Schema migration and product seeding completed successfully.',
            'timestamp' => date('c')
        ];
    } catch (PDOException $e) {
        return [
            'success' => false,
            'error'   => $e->getMessage()
        ];
    }
}

// ---------------------------------------------------------------------------
// 5. PRODUCT INVENTORY CRUD HELPER FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Retrieve all products (from Database if PDO provided, otherwise fallback to array)
 */
function getProducts(?PDO $pdo = null): array {
    global $liveProductState;
    if ($pdo) {
        try {
            $stmt = $pdo->query("SELECT * FROM \`products\` WHERE \`status\` = 'active' ORDER BY \`created_at\` DESC");
            $rows = $stmt->fetchAll();
            if (!empty($rows)) {
                return array_map(function($row) {
                    $row['materials'] = !empty($row['materials']) ? json_decode($row['materials'], true) : [];
                    $row['features'] = !empty($row['features']) ? json_decode($row['features'], true) : [];
                    $row['price'] = (float)$row['price'];
                    $row['original_price'] = (float)$row['original_price'];
                    $row['stock'] = (int)$row['stock'];
                    $row['is_customizable'] = (bool)$row['is_customizable'];
                    return $row;
                }, $rows);
            }
        } catch (Exception $e) {
            // Fallback to in-memory array if database query fails
        }
    }
    return $liveProductState;
}

/**
 * Retrieve single product by ID
 */
function getProductById(string $id, ?PDO $pdo = null): ?array {
    if ($pdo) {
        try {
            $stmt = $pdo->prepare("SELECT * FROM \`products\` WHERE \`id\` = :id LIMIT 1");
            $stmt->execute([':id' => $id]);
            $row = $stmt->fetch();
            if ($row) {
                $row['materials'] = !empty($row['materials']) ? json_decode($row['materials'], true) : [];
                $row['features'] = !empty($row['features']) ? json_decode($row['features'], true) : [];
                return $row;
            }
        } catch (Exception $e) {}
    }
    global $liveProductState;
    foreach ($liveProductState as $p) {
        if ($p['id'] === $id) return $p;
    }
    return null;
}

/**
 * Update stock level for a product
 */
function updateProductStock(PDO $pdo, string $id, int $newStock): bool {
    $stmt = $pdo->prepare("UPDATE \`products\` SET \`stock\` = :stock WHERE \`id\` = :id");
    return $stmt->execute([':stock' => max(0, $newStock), ':id' => $id]);
}

/**
 * Remove a discontinued product
 */
function deleteProduct(PDO $pdo, string $id): bool {
    $stmt = $pdo->prepare("DELETE FROM \`products\` WHERE \`id\` = :id");
    return $stmt->execute([':id' => $id]);
}

// ---------------------------------------------------------------------------
// 6. ROUTE & SCRIPT DISPATCHER
// ---------------------------------------------------------------------------

// CLI Execution Output
if (php_sapi_name() === 'cli') {
    echo "================================================================\\n";
    echo "  Heaven Furniture Mart - PHP/SQL Product Schema Export\\n";
    echo "================================================================\\n";
    echo "  Total Products in Export : " . count($liveProductState) . " items\\n";
    echo "  Generated Timestamp      : ${timestamp}\\n";
    echo "\\n  Options:\\n";
    echo "  - Import directly into MySQL: mysql -u [user] -p [dbname] < schema.sql\\n";
    echo "  - Include in PHP app        : require_once __DIR__ . '/" . basename(__FILE__) . "';\\n";
    echo "================================================================\\n";
    exit(0);
}

// Browser Access Handler
if (basename($_SERVER['SCRIPT_FILENAME'] ?? '') === basename(__FILE__)) {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');

    $action = $_GET['action'] ?? 'list';

    if ($action === 'install' || $action === 'migrate') {
        header('Content-Type: application/json; charset=utf-8');
        try {
            $pdo = getDatabaseConnection($databaseConfig);
            $result = migrateProductSchema($pdo, $sqlSchemaBoilerplate);
            echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
        exit;
    }

    if ($action === 'sql') {
        header('Content-Type: text/plain; charset=utf-8');
        header('Content-Disposition: inline; filename="products_schema.sql"');
        echo $sqlSchemaBoilerplate;
        exit;
    }

    // Default: Output product inventory as JSON API
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'status'       => 'ok',
        'exported_at'  => '${timestamp}',
        'item_count'   => count($liveProductState),
        'products'     => $liveProductState,
        'install_url'  => '?action=install',
        'raw_sql_url'  => '?action=sql'
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    exit;
}
`;
}

/**
 * Triggers a browser file download using standard Blob and URL.createObjectURL
 */
export function triggerFileDownload(content, filename, mimeType = "application/x-php") {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
