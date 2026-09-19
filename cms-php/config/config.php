<?php
/**
 * Heaven Furniture Mart - PHP CMS Configuration
 */

// Error reporting (set to 0 in strict production)
error_reporting(E_ALL);
ini_set('display_errors', '0');

// Start session if not active
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Database Credentials
define('DB_TYPE', getenv('DB_TYPE') ?: 'sqlite'); // 'mysql' or 'sqlite'
define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_PORT', getenv('DB_PORT') ?: '3306');
define('DB_NAME', getenv('DB_NAME') ?: 'heaven_furniture_mart');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASS') ?: '');
define('SQLITE_PATH', __DIR__ . '/../data/heaven.sqlite');

// Studio Details
define('SITE_NAME', 'Heaven Furniture Mart');
define('SITE_TAGLINE', 'Luxury & Bespoke Solid Wood Studio · Agrabad, Chattogram');
define('STUDIO_PHONE', '+880 1960-481983');
define('STUDIO_WHATSAPP', '8801960481983');
define('CURRENCY_SYMBOL', '৳');

// Helper to format currency
function formatBDT(float $amount): string {
    return '৳' . number_format($amount, 0);
}
