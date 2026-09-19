# Heaven Furniture Mart — Pure PHP CMS & E-Commerce Framework

A luxury e-commerce website and Content Management System built in **pure PHP 8+**, designed specifically for standard shared hosting, cPanel, Apache, LiteSpeed, and Nginx **without requiring TypeScript (`.ts`) or Node.js on the server**.

---

## Why did you see "Hosting doesn't support .ts files"?

TypeScript files (`.ts` and `.tsx`) are developer source files that run through a compiler on a development machine. Standard web hosting (cPanel, Namecheap, Hostinger, GoDaddy, Bluehost) **only executes PHP, HTML, CSS, and JavaScript**. 

To run this application on standard hosting, you have two 100% working options:

---

### Option 1: 100% Pure PHP CMS Website (Recommended for Shared Hosting / cPanel)

The `/cms-php/` directory contains a complete, production-ready e-commerce website that **uses 0% TypeScript and 100% standard PHP**.

#### Directory Structure
```text
cms-php/
├── index.php             # Luxury Homepage with Hero & Featured Suites
├── catalog.php           # Solid Wood Catalog with live room & timber filters
├── product.php           # Product Detail & Timber Finish Customizer
├── cart.php              # Session Shopping Bag with voucher engine
├── checkout.php          # Order checkout with bKash, Nagad, Bank Wire, COD
├── track.php             # Real-time Order & Commission Timeline Tracker
├── admin.php             # Full CMS Dashboard (Products CRUD, Orders Pipeline)
├── install.php           # 1-Click Diagnostics & Database Seed Tool
├── export.php            # 1-Click ZIP Downloader
├── .htaccess             # Apache Gzip compression & URL security rules
├── schema.sql            # MySQL Database schema & seed data
├── config/
│   ├── config.php        # Database credentials & site settings
│   └── database.php      # PDO database handler with SQLite zero-config fallback
└── includes/
    ├── header.php        # Shared navigation with live bag counter
    └── footer.php        # Atelier footer & Chattogram contact info
```

#### 3-Step cPanel Deployment Guide:
1. **Upload Files:**
   - Log in to your cPanel.
   - Open **File Manager** and navigate into `public_html`.
   - Upload the files and folders inside `cms-php/` directly into `public_html`.
2. **Database Setup (MySQL):**
   - In cPanel, go to **MySQL Databases** and create a database (e.g. `youruser_heaven`) and a user with full privileges.
   - Open `config/config.php` in File Manager and enter your `DB_NAME`, `DB_USER`, and `DB_PASS`.
   - In **phpMyAdmin**, click your database and click **Import**, selecting `schema.sql`.
   *(Note: If you don't configure MySQL, the system automatically uses SQLite in `data/heaven.sqlite` with zero configuration!)*
3. **Launch:**
   - Visit `yourdomain.com/install.php` in your browser to confirm database connection and seed products.
   - Visit `yourdomain.com/admin.php` to manage products and orders.

---

### Option 2: Compile the React/TypeScript Frontend to Static HTML/JS/CSS

If you prefer to run the modern React frontend:
1. Run the build command on your development machine or laptop:
   ```bash
   npm run build
   ```
2. This compiles all `.ts` and `.tsx` source code into plain static files in the `dist/` directory:
   - `dist/index.html`
   - `dist/assets/*.js`
   - `dist/assets/*.css`
3. Upload the contents of `dist/` to your hosting server's `public_html`.
4. **Notice: There are NO `.ts` files in the `dist/` folder!**

---

## Key Features

- **Master Timber Catalog:** Solid Chittagong Teak (Segun), Burma Teak, American Walnut, Royal Mahogany.
- **Cart & Voucher Engine:** Persistent session shopping bag with discount voucher codes (`HEAVEN10`, `ATELIER5000`).
- **Bangladeshi Payment Protocols:** bKash Merchant Pay, Nagad, Corporate Bank Wire, and Cash on Delivery.
- **Order Milestones:** 5-stage workshop progress tracker (`Pending` → `Crafting` → `Quality Audit` → `Out for Delivery` → `Delivered`).
- **Comprehensive CMS Admin:** Add/edit/delete furniture pieces, set pricing and dimensions, update stock, and manage order pipelines.
