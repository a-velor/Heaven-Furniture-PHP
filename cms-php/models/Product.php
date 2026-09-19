<?php
/**
 * Heaven Furniture Mart - PHP CMS
 * Product Model (Active Record / Repository)
 */

require_once __DIR__ . '/../config/database.php';

class Product {
    public static function all(?string $category = null, ?string $search = null, ?string $status = 'active'): array {
        $db = Database::getConnection();
        $sql = "SELECT p.*, c.name as category_name FROM products p JOIN categories c ON p.category_id = c.id WHERE 1=1";
        $params = [];

        if ($status !== null) {
            $sql .= " AND p.status = :status";
            $params[':status'] = $status;
        }

        if ($category && $category !== 'all') {
            $sql .= " AND p.category_id = :category";
            $params[':category'] = $category;
        }

        if ($search) {
            $sql .= " AND (p.name LIKE :search OR p.description LIKE :search OR p.wood_type LIKE :search)";
            $params[':search'] = "%{$search}%";
        }

        $sql .= " ORDER BY p.created_at DESC";
        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        $rows = $stmt->fetchAll();

        return array_map([self::class, 'formatRow'], $rows);
    }

    public static function find(string $id): ?array {
        $db = Database::getConnection();
        $stmt = $db->prepare("SELECT p.*, c.name as category_name FROM products p JOIN categories c ON p.category_id = c.id WHERE p.id = :id LIMIT 1");
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();
        return $row ? self::formatRow($row) : null;
    }

    public static function create(array $data): string {
        $db = Database::getConnection();
        $id = $data['id'] ?? ('hfm_' . bin2hex(random_bytes(4)));
        $sql = "INSERT INTO products (id, sku, name, category_id, price, original_price, stock, wood_type, dimensions, description, image, materials, features, wood_finishes, upholstery_options, hardware_options, is_customizable, highlight_tag, status) 
                VALUES (:id, :sku, :name, :category_id, :price, :original_price, :stock, :wood_type, :dimensions, :description, :image, :materials, :features, :wood_finishes, :upholstery_options, :hardware_options, :is_customizable, :highlight_tag, :status)";
        
        $stmt = $db->prepare($sql);
        $stmt->execute([
            ':id' => $id,
            ':sku' => $data['sku'] ?? strtoupper('HFM-' . substr($data['category_id'] ?? 'PROD', 0, 3) . '-' . rand(100, 999)),
            ':name' => $data['name'],
            ':category_id' => $data['category_id'],
            ':price' => $data['price'],
            ':original_price' => $data['original_price'] ?? null,
            ':stock' => $data['stock'] ?? 5,
            ':wood_type' => $data['wood_type'] ?? 'Chittagong Teak',
            ':dimensions' => $data['dimensions'] ?? 'Custom sizing',
            ':description' => $data['description'] ?? '',
            ':image' => $data['image'] ?? '',
            ':materials' => json_encode($data['materials'] ?? []),
            ':features' => json_encode($data['features'] ?? []),
            ':wood_finishes' => json_encode($data['wood_finishes'] ?? []),
            ':upholstery_options' => json_encode($data['upholstery_options'] ?? []),
            ':hardware_options' => json_encode($data['hardware_options'] ?? []),
            ':is_customizable' => isset($data['is_customizable']) ? ($data['is_customizable'] ? 1 : 0) : 1,
            ':highlight_tag' => $data['highlight_tag'] ?? null,
            ':status' => $data['status'] ?? 'active'
        ]);

        return $id;
    }

    public static function update(string $id, array $data): bool {
        $db = Database::getConnection();
        $fields = [];
        $params = [':id' => $id];

        $allowed = ['name', 'category_id', 'price', 'original_price', 'stock', 'wood_type', 'dimensions', 'description', 'image', 'status', 'highlight_tag'];
        foreach ($allowed as $key) {
            if (array_key_exists($key, $data)) {
                $fields[] = "{$key} = :{$key}";
                $params[":{$key}"] = $data[$key];
            }
        }

        if (isset($data['materials'])) {
            $fields[] = "materials = :materials";
            $params[':materials'] = json_encode($data['materials']);
        }
        if (isset($data['features'])) {
            $fields[] = "features = :features";
            $params[':features'] = json_encode($data['features']);
        }

        if (empty($fields)) return false;

        $sql = "UPDATE products SET " . implode(', ', $fields) . " WHERE id = :id";
        $stmt = $db->prepare($sql);
        return $stmt->execute($params);
    }

    public static function delete(string $id): bool {
        $db = Database::getConnection();
        $stmt = $db->prepare("DELETE FROM products WHERE id = :id");
        return $stmt->execute([':id' => $id]);
    }

    private static function formatRow(array $row): array {
        return [
            'id' => $row['id'],
            'sku' => $row['sku'],
            'name' => $row['name'],
            'categoryId' => $row['category_id'],
            'categoryLabel' => $row['category_name'] ?? $row['category_id'],
            'price' => (float)$row['price'],
            'originalPrice' => $row['original_price'] ? (float)$row['original_price'] : null,
            'stock' => (int)$row['stock'],
            'woodType' => $row['wood_type'],
            'dimensions' => $row['dimensions'],
            'description' => $row['description'],
            'image' => $row['image'],
            'materials' => json_decode($row['materials'] ?? '[]', true) ?: [],
            'features' => json_decode($row['features'] ?? '[]', true) ?: [],
            'woodFinishes' => json_decode($row['wood_finishes'] ?? '[]', true) ?: [],
            'upholsteryOptions' => json_decode($row['upholstery_options'] ?? '[]', true) ?: [],
            'hardwareOptions' => json_decode($row['hardware_options'] ?? '[]', true) ?: [],
            'isCustomizable' => (bool)$row['is_customizable'],
            'highlightTag' => $row['highlight_tag'],
            'status' => $row['status'],
            'rating' => (float)$row['rating'],
            'reviewCount' => (int)$row['review_count']
        ];
    }
}
