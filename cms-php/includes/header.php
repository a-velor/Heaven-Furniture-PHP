<?php
require_once __DIR__ . '/../config/config.php';
$cartCount = 0;
if (!empty($_SESSION['cart'])) {
    foreach ($_SESSION['cart'] as $item) {
        $cartCount += (int)$item['qty'];
    }
}
?>
<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= SITE_NAME ?> — <?= SITE_TAGLINE ?></title>
    <meta name="description" content="Handcrafted bespoke solid wood furniture in Agrabad, Chattogram. Chittagong Teak (Segun), Burma Teak, and American Walnut.">
    <!-- Tailwind CSS via CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        atelier: {
                            deep: '#132629',
                            card: '#162528',
                            gold: '#C5A880',
                            goldLight: '#D4B78F',
                            wood: '#8C6239',
                            canvas: '#FAF8F5'
                        }
                    },
                    fontFamily: {
                        serif: ['Cinzel', 'Playfair Display', 'Georgia', 'serif'],
                        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif']
                    }
                }
            }
        }
    </script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        .font-cinzel { font-family: 'Cinzel', serif; }
    </style>
</head>
<body class="bg-[#FAF8F5] text-[#2C221E] antialiased min-h-screen flex flex-col selection:bg-[#C5A880]/30 selection:text-[#132629]">

<!-- Top Announcement Banner -->
<div class="bg-[#132629] text-[#FAF8F5] text-[11px] uppercase tracking-widest py-2 px-4 text-center border-b border-[#C5A880]/30">
    <span>✦ Chattogram Atelier Flagship · 100% Genuine Kiln-Seasoned Teak · Lifetime Warranty ✦</span>
</div>

<!-- Main Navigation -->
<nav class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs transition-all">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        <!-- Brand Logo -->
        <a href="index.php" class="flex flex-col">
            <span class="font-cinzel font-bold text-xl sm:text-2xl tracking-wider text-[#132629]">
                HEAVEN
            </span>
            <span class="text-[9px] uppercase tracking-[0.25em] text-[#8C6239] -mt-1 font-semibold">
                Furniture Mart · Atelier
            </span>
        </a>

        <!-- Desktop Navigation Links -->
        <div class="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-stone-700">
            <a href="index.php" class="hover:text-[#8C6239] transition-colors">Showroom</a>
            <a href="catalog.php" class="hover:text-[#8C6239] transition-colors">Solid Wood Catalog</a>
            <a href="index.php#bespoke" class="hover:text-[#8C6239] transition-colors">Bespoke Studio</a>
            <a href="track.php" class="hover:text-[#8C6239] transition-colors">Track Order</a>
            <a href="admin.php" class="px-2.5 py-1 bg-amber-100 text-amber-900 rounded font-bold hover:bg-amber-200 transition-colors">
                CMS Admin
            </a>
        </div>

        <!-- Right Action Items -->
        <div class="flex items-center gap-3">
            <a href="cart.php" class="relative inline-flex items-center gap-2 py-2 px-4 bg-[#132629] hover:bg-[#1B3236] text-[#FAF8F5] text-xs font-semibold uppercase tracking-wider rounded transition-colors shadow-sm">
                <svg class="w-4 h-4 text-[#C5A880]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                <span class="hidden sm:inline">Bag</span>
                <span class="bg-[#C5A880] text-[#132629] font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                    <?= $cartCount ?>
                </span>
            </a>
            
            <a href="https://wa.me/<?= STUDIO_WHATSAPP ?>" target="_blank" class="hidden lg:inline-flex items-center gap-1.5 py-2 px-3 border border-emerald-600 text-emerald-700 text-xs font-semibold rounded hover:bg-emerald-50 transition-colors">
                <span>WhatsApp</span>
            </a>
        </div>

    </div>
</nav>
