<?php
/**
 * Heaven Furniture Mart - 1-Click PHP CMS Downloader
 * Bundles the entire pure PHP CMS into a clean heaven-furniture-mart-php-cms.zip
 */

require_once __DIR__ . '/config/config.php';

if (!extension_loaded('zip')) {
    die("PHP ZipArchive extension is required for automatic bundle generation.");
}

$zip = new ZipArchive();
$zipFile = sys_get_temp_dir() . '/heaven-furniture-mart-php-cms-' . time() . '.zip';

if ($zip->open($zipFile, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
    die("Cannot create zip archive.");
}

$sourceDir = realpath(__DIR__);
$files = new RecursiveIteratorIterator(
    new RecursiveDirectoryIterator($sourceDir, RecursiveDirectoryIterator::SKIP_DOTS),
    RecursiveIteratorIterator::LEAVES_ONLY
);

foreach ($files as $name => $file) {
    if (!$file->isDir()) {
        $filePath = $file->getRealPath();
        $relativePath = substr($filePath, strlen($sourceDir) + 1);

        // Don't include temporary exports
        if (strpos($relativePath, 'export.php') !== false) {
            continue;
        }

        $zip->addFile($filePath, $relativePath);
    }
}

$zip->close();

header('Content-Type: application/zip');
header('Content-Disposition: attachment; filename="heaven-furniture-mart-pure-php-cms.zip"');
header('Content-Length: ' . filesize($zipFile));
readfile($zipFile);
@unlink($zipFile);
exit;
