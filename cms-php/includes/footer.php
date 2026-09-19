<!-- Footer -->
<footer class="mt-auto bg-[#132629] text-[#FAF8F5] pt-16 pb-12 border-t border-[#C5A880]/20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
            
            <!-- Atelier Info -->
            <div class="space-y-4">
                <span class="font-cinzel font-bold text-2xl tracking-wider text-[#FAF8F5] block">
                    HEAVEN
                </span>
                <p class="text-xs text-stone-300 leading-relaxed font-light">
                    Master craftsmen in Agrabad, Chattogram shaping kiln-seasoned Chittagong Teak, Burma Segun, and American Walnut into heirloom commissions since 2002.
                </p>
                <div class="text-xs text-[#C5A880] font-medium">
                    ✦ 100% Solid Seasoned Hardwood Guarantee
                </div>
            </div>

            <!-- Fast Navigation -->
            <div>
                <h4 class="text-xs font-semibold uppercase tracking-widest text-[#C5A880] mb-4">Navigation</h4>
                <ul class="space-y-2 text-xs text-stone-300">
                    <li><a href="index.php" class="hover:text-white">Flagship Showroom</a></li>
                    <li><a href="catalog.php" class="hover:text-white">Solid Wood Catalog</a></li>
                    <li><a href="cart.php" class="hover:text-white">Shopping Bag & Checkout</a></li>
                    <li><a href="track.php" class="hover:text-white">Track Order Progress</a></li>
                    <li><a href="admin.php" class="hover:text-white">Administrative CMS</a></li>
                </ul>
            </div>

            <!-- Atelier Timings & Address -->
            <div>
                <h4 class="text-xs font-semibold uppercase tracking-widest text-[#C5A880] mb-4">Agrabad Flagship</h4>
                <p class="text-xs text-stone-300 leading-relaxed font-light mb-3">
                    Agrabad Commercial Area, Beside Access Road, Chattogram, Bangladesh.
                </p>
                <p class="text-xs text-stone-400">
                    Sat – Thu: 10:00 AM – 9:00 PM<br>
                    Friday: 3:30 PM – 9:30 PM
                </p>
            </div>

            <!-- Direct artisan contact -->
            <div>
                <h4 class="text-xs font-semibold uppercase tracking-widest text-[#C5A880] mb-4">Artisan Inquiries</h4>
                <p class="text-xs text-stone-300 leading-relaxed font-light mb-3">
                    Phone: <a href="tel:<?= STUDIO_PHONE ?>" class="text-white hover:underline"><?= STUDIO_PHONE ?></a><br>
                    WhatsApp: <a href="https://wa.me/<?= STUDIO_WHATSAPP ?>" class="text-emerald-400 hover:underline">+880 1960-481983</a>
                </p>
                <a href="https://wa.me/<?= STUDIO_WHATSAPP ?>?text=Hello%20Heaven%20Furniture%20Mart,%20I%20am%20inquiring%20about%20a%20custom%20commission" target="_blank" class="inline-flex items-center gap-2 py-2.5 px-4 bg-[#C5A880] hover:bg-[#D4B78F] text-[#132629] text-xs font-semibold uppercase tracking-wider rounded transition-colors">
                    <span>Chat with Artisan</span>
                </a>
            </div>

        </div>

        <div class="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-400 gap-4">
            <div>
                © <?= date('Y') ?> Heaven Furniture Mart. All rights reserved. Handcrafted in Chattogram.
            </div>
            <div class="flex items-center gap-4">
                <span>PHP CMS Architecture v2.4</span>
                <span>•</span>
                <a href="install.php" class="hover:text-stone-200">System Diagnostics</a>
            </div>
        </div>
    </div>
</footer>

</body>
</html>
