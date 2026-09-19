<?php
/**
 * Heaven Furniture Mart - Database Connector
 * Supports both MySQL (cPanel/Production) and SQLite (Zero-Configuration Fallback)
 */

require_once __DIR__ . '/config.php';

class Database {
    private static ?PDO $instance = null;

    public static function getConnection(): PDO {
        if (self::$instance !== null) {
            return self::$instance;
        }

        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];

        // Try MySQL first if credentials provided or configured
        if (DB_TYPE === 'mysql' || getenv('DB_HOST')) {
            try {
                $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=utf8mb4";
                self::$instance = new PDO($dsn, DB_USER, DB_PASS, $options);
                return self::$instance;
            } catch (PDOException $e) {
                // Fall back gracefully to SQLite if MySQL fails
                error_log("MySQL connection failed, falling back to SQLite: " . $e->getMessage());
            }
        }

        // SQLite fallback
        $dataDir = __DIR__ . '/../data';
        if (!is_dir($dataDir)) {
            @mkdir($dataDir, 0755, true);
        }

        $sqliteDb = SQLITE_PATH;
        $isNewDb = !file_exists($sqliteDb);

        try {
            self::$instance = new PDO("sqlite:" . $sqliteDb, null, null, $options);
            if ($isNewDb) {
                self::initSqliteSchema(self::$instance);
            }
        } catch (PDOException $e) {
            die("Database initialization error: " . $e->getMessage());
        }

        return self::$instance;
    }

    private static function initSqliteSchema(PDO $pdo): void {
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS categories (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                slug TEXT UNIQUE NOT NULL
            );

            CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                sku TEXT UNIQUE NOT NULL,
                name TEXT NOT NULL,
                category_id INTEGER NOT NULL,
                price REAL NOT NULL,
                original_price REAL,
                stock INTEGER NOT NULL DEFAULT 5,
                wood_type TEXT NOT NULL,
                dimensions TEXT,
                image_url TEXT NOT NULL,
                description TEXT,
                highlight_tag TEXT,
                status TEXT DEFAULT 'active',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS orders (
                id TEXT PRIMARY KEY,
                customer_name TEXT NOT NULL,
                customer_phone TEXT NOT NULL,
                customer_email TEXT,
                shipping_address TEXT NOT NULL,
                city TEXT NOT NULL,
                subtotal REAL NOT NULL,
                discount REAL DEFAULT 0,
                total REAL NOT NULL,
                status TEXT DEFAULT 'Pending',
                payment_method TEXT NOT NULL,
                payment_status TEXT DEFAULT 'pending',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS order_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                order_id TEXT NOT NULL,
                product_id INTEGER NOT NULL,
                product_name TEXT NOT NULL,
                quantity INTEGER NOT NULL,
                unit_price REAL NOT NULL,
                total_price REAL NOT NULL,
                wood_finish TEXT
            );

            CREATE TABLE IF NOT EXISTS coupons (
                code TEXT PRIMARY KEY,
                discount_percent INTEGER,
                discount_amount REAL,
                min_spend REAL DEFAULT 0,
                description TEXT,
                is_active INTEGER DEFAULT 1
            );
        ");

        // Seed initial categories
        $pdo->exec("
            INSERT OR IGNORE INTO categories (id, name, slug) VALUES 
            (1, 'Living Room', 'living'),
            (2, 'Bedroom', 'bedroom'),
            (3, 'Dining', 'dining'),
            (4, 'Office & Study', 'office'),
            (5, 'Bespoke Architectural', 'bespoke');
        ");

        // Seed initial products
        $pdo->exec("
            INSERT OR IGNORE INTO products (id, sku, name, category_id, price, original_price, stock, wood_type, dimensions, image_url, description, highlight_tag) VALUES
            (1, 'HFM-LIV-001', 'The Maharaja Grand Living Suite', 1, 285000, 320000, 4, 'Chittagong Teak (Segun)', '3-Seater: 215x95cm, Single: 90x90cm', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=75', 'Hand-carved solid kiln-seasoned Chittagong Teak living ensemble with traditional brass joints and natural honey polish.', 'Flagship Commission'),
            (2, 'HFM-BED-002', 'Imperial Royal Canopy Bedstead', 2, 245000, 275000, 3, 'Burma Segun Teak', 'King Size: 185x215cm x 220cm Height', 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=75', 'Monumental 4-poster king bedstead hand-turned by senior Chittagong artisans with mortise & tenon joinery.', 'Best Seller'),
            (3, 'HFM-DIN-003', 'Sultani 8-Seater Monolith Dining Set', 3, 215000, 240000, 5, 'Chittagong Teak & Brass Accents', 'Table: 240x110cm, 8 Ergonomic Chairs', 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1000&q=75', 'Single solid teak beam slab top paired with 8 matching heirloom high-back dining armchairs.', 'Atelier Choice'),
            (4, 'HFM-OFF-004', 'Governor Executive Teak Desk & Credenza', 4, 165000, 190000, 6, 'American Walnut & Segun', 'Desk: 190x95cm, Credenza: 160x50cm', 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1000&q=75', 'Distinguished executive workspace featuring bookmatched burl timber inlay and hand-carved cord routing channels.', 'Executive Suite'),
            (5, 'HFM-BES-005', 'Bespoke Curved Architectural Partition', 5, 135000, 155000, 4, 'Steam-Bent Burma Teak & Fluted Glass', 'Custom Segment: 280x240cm', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=75', 'Architectural acoustic room divider handcrafted from steam-bent solid teak louvers for penthouses.', 'Architectural Series'),
            (6, 'HFM-LIV-006', 'Agrabad Heritage Solid Teak Credenza', 1, 98000, 115000, 8, 'Kiln-Dried Chittagong Teak', '180x45x85cm', 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1000&q=75', 'Low-profile media console with soft-closing dovetail drawers and solid brass hardware.', 'In Stock');
        ");

        // Seed coupons
        $pdo->exec("
            INSERT OR IGNORE INTO coupons (code, discount_percent, discount_amount, min_spend, description) VALUES
            ('HEAVEN10', 10, NULL, 50000, '10% atelier inaugural discount'),
            ('VIPBRIDE', 12, NULL, 150000, '12% bridal wedding suite commission incentive'),
            ('ATELIER5000', NULL, 5000, 40000, '৳5,000 flat discount on mastercraft pieces');
        ");
    }
}
