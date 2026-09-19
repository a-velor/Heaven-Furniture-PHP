# Heaven Furniture Mart - PHP CMS Website Framework

A bespoke luxury furniture e-commerce and Content Management System (CMS) backend framework written in object-oriented PHP 8+ with PDO database abstraction, prepared SQL security, RESTful JSON API endpoints, and comprehensive administration capabilities.

## Architecture

```
/cms-php/
├── config/
│   └── database.php        # PDO database connection singleton
├── models/
│   ├── Product.php         # Product catalog repository & inventory model
│   └── Order.php           # Atomic checkout and transaction engine
├── api/
│   └── index.php           # RESTful API routing controller
├── views/                  # Server-side templating views
└── schema.sql              # Production MySQL database schema
```

## Quick Start on Standard LAMP / LEMP / cPanel

1. **Import Database Schema**:
   ```bash
   mysql -u root -p < schema.sql
   ```
2. **Configure Environment**:
   Define `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASS` in your virtual host or Apache `.htaccess`.
3. **Web Server Setup**:
   Point document root to `/cms-php` or route API traffic to `/api/index.php`.
