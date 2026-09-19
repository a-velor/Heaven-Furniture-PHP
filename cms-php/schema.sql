-- Heaven Furniture Mart E-Commerce & CMS Schema
-- MySQL 5.7+ / 8.0+

CREATE DATABASE IF NOT EXISTS `heaven_furniture_mart` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `heaven_furniture_mart`;

-- Admin Users / CMS Managers
CREATE TABLE IF NOT EXISTS `cms_users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(150) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `role` ENUM('admin', 'editor', 'sales') DEFAULT 'admin',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Product Categories
CREATE TABLE IF NOT EXISTS `categories` (
    `id` VARCHAR(50) PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(100) NOT NULL UNIQUE,
    `description` TEXT,
    `display_order` INT DEFAULT 0
) ENGINE=InnoDB;

-- Furniture Products
CREATE TABLE IF NOT EXISTS `products` (
    `id` VARCHAR(50) PRIMARY KEY,
    `sku` VARCHAR(50) NOT NULL UNIQUE,
    `name` VARCHAR(255) NOT NULL,
    `category_id` VARCHAR(50) NOT NULL,
    `price` DECIMAL(12, 2) NOT NULL,
    `original_price` DECIMAL(12, 2) DEFAULT NULL,
    `stock` INT NOT NULL DEFAULT 10,
    `wood_type` VARCHAR(100) NOT NULL,
    `dimensions` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `image` VARCHAR(500) NOT NULL,
    `additional_images` JSON DEFAULT NULL,
    `materials` JSON DEFAULT NULL,
    `features` JSON DEFAULT NULL,
    `wood_finishes` JSON DEFAULT NULL,
    `upholstery_options` JSON DEFAULT NULL,
    `hardware_options` JSON DEFAULT NULL,
    `is_customizable` TINYINT(1) DEFAULT 1,
    `highlight_tag` VARCHAR(100) DEFAULT NULL,
    `status` ENUM('active', 'draft') DEFAULT 'active',
    `rating` DECIMAL(3, 2) DEFAULT 5.00,
    `review_count` INT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Orders
CREATE TABLE IF NOT EXISTS `orders` (
    `id` VARCHAR(50) PRIMARY KEY,
    `customer_name` VARCHAR(150) NOT NULL,
    `customer_email` VARCHAR(150) NOT NULL,
    `customer_phone` VARCHAR(50) NOT NULL,
    `shipping_address` TEXT NOT NULL,
    `city` VARCHAR(100) NOT NULL,
    `postal_code` VARCHAR(20) DEFAULT NULL,
    `delivery_notes` TEXT DEFAULT NULL,
    `shipping_method` VARCHAR(50) NOT NULL DEFAULT 'white-glove',
    `shipping_fee` DECIMAL(10, 2) DEFAULT 0.00,
    `payment_method` VARCHAR(50) NOT NULL,
    `payment_status` ENUM('paid', 'pending', 'cod') DEFAULT 'pending',
    `subtotal` DECIMAL(12, 2) NOT NULL,
    `discount` DECIMAL(10, 2) DEFAULT 0.00,
    `coupon_code` VARCHAR(50) DEFAULT NULL,
    `tax` DECIMAL(10, 2) DEFAULT 0.00,
    `total` DECIMAL(12, 2) NOT NULL,
    `status` ENUM('Pending', 'Processing', 'In Crafting', 'Quality Check', 'Out for Delivery', 'Delivered', 'Cancelled') DEFAULT 'Pending',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Order Items
CREATE TABLE IF NOT EXISTS `order_items` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `order_id` VARCHAR(50) NOT NULL,
    `product_id` VARCHAR(50) NOT NULL,
    `product_name` VARCHAR(255) NOT NULL,
    `unit_price` DECIMAL(12, 2) NOT NULL,
    `quantity` INT NOT NULL DEFAULT 1,
    `wood_finish` VARCHAR(100) DEFAULT NULL,
    `upholstery` VARCHAR(100) DEFAULT NULL,
    `hardware` VARCHAR(100) DEFAULT NULL,
    `custom_notes` TEXT DEFAULT NULL,
    FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Coupons & Promotional Discounts
CREATE TABLE IF NOT EXISTS `coupons` (
    `code` VARCHAR(50) PRIMARY KEY,
    `discount_percent` INT DEFAULT 0,
    `discount_amount` DECIMAL(10, 2) DEFAULT 0.00,
    `min_spend` DECIMAL(12, 2) DEFAULT 0.00,
    `description` VARCHAR(255) NOT NULL,
    `is_active` TINYINT(1) DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Customer Bespoke Inquiries
CREATE TABLE IF NOT EXISTS `bespoke_inquiries` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(150) NOT NULL,
    `phone` VARCHAR(50) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `room_type` VARCHAR(100) NOT NULL,
    `wood_preference` VARCHAR(100) NOT NULL,
    `dimensions_note` TEXT,
    `budget_range` VARCHAR(100),
    `message` TEXT NOT NULL,
    `status` ENUM('New', 'Contacted', 'In Estimation', 'Approved', 'Archived') DEFAULT 'New',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Seed Default Categories
INSERT IGNORE INTO `categories` (`id`, `name`, `slug`, `description`, `display_order`) VALUES
('living', 'Living Room', 'living', 'Presidential sectionals, artisanal media credenzas and accent loungers.', 1),
('bedroom', 'Bedroom Suites', 'bedroom', 'Canopy beds, floating platforms, and bespoke nightstands.', 2),
('dining', 'Dining & Banquets', 'dining', 'Live-edge Chittagong Teak dining suites and sculptural banquet tables.', 3),
('office', 'Executive Office', 'office', 'Prestige desks, library cabinetry, and ergonomic executive seating.', 4),
('bespoke', 'Bespoke Atelier', 'bespoke', 'Full-home architectural millwork and commissioned masterpieces.', 5);
