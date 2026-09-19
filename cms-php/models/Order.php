<?php
/**
 * Heaven Furniture Mart - PHP CMS
 * Order Model with Database Transactions
 */

require_once __DIR__ . '/../config/database.php';

class Order {
    public static function all(): array {
        $db = Database::getConnection();
        $stmt = $db->query("SELECT * FROM orders ORDER BY created_at DESC");
        $orders = $stmt->fetchAll();

        $result = [];
        foreach ($orders as $order) {
            $itemsStmt = $db->prepare("SELECT * FROM order_items WHERE order_id = :id");
            $itemsStmt->execute([':id' => $order['id']]);
            $order['items'] = $itemsStmt->fetchAll();
            $result[] = $order;
        }

        return $result;
    }

    public static function find(string $id): ?array {
        $db = Database::getConnection();
        $stmt = $db->prepare("SELECT * FROM orders WHERE id = :id LIMIT 1");
        $stmt->execute([':id' => $id]);
        $order = $stmt->fetch();
        if (!$order) return null;

        $itemsStmt = $db->prepare("SELECT * FROM order_items WHERE order_id = :id");
        $itemsStmt->execute([':id' => $id]);
        $order['items'] = $itemsStmt->fetchAll();
        return $order;
    }

    public static function create(array $data): string {
        $db = Database::getConnection();
        $db->beginTransaction();

        try {
            $orderId = 'HFM-' . rand(10000, 99999);
            $sql = "INSERT INTO orders (id, customer_name, customer_email, customer_phone, shipping_address, city, postal_code, delivery_notes, shipping_method, shipping_fee, payment_method, payment_status, subtotal, discount, coupon_code, tax, total, status)
                    VALUES (:id, :name, :email, :phone, :address, :city, :postal, :notes, :shipping_method, :shipping_fee, :payment_method, :payment_status, :subtotal, :discount, :coupon_code, :tax, :total, 'Pending')";
            
            $stmt = $db->prepare($sql);
            $stmt->execute([
                ':id' => $orderId,
                ':name' => $data['customerName'],
                ':email' => $data['customerEmail'],
                ':phone' => $data['customerPhone'],
                ':address' => $data['shippingAddress'],
                ':city' => $data['city'] ?? 'Chattogram',
                ':postal' => $data['postalCode'] ?? null,
                ':notes' => $data['deliveryNotes'] ?? null,
                ':shipping_method' => $data['shippingMethod'] ?? 'white-glove',
                ':shipping_fee' => $data['shippingFee'] ?? 0,
                ':payment_method' => $data['paymentMethod'],
                ':payment_status' => $data['paymentMethod'] === 'cod' ? 'cod' : 'paid',
                ':subtotal' => $data['subtotal'],
                ':discount' => $data['discount'] ?? 0,
                ':coupon_code' => $data['couponCode'] ?? null,
                ':tax' => $data['tax'] ?? 0,
                ':total' => $data['total']
            ]);

            // Insert Items and decrement stock
            $itemSql = "INSERT INTO order_items (order_id, product_id, product_name, unit_price, quantity, wood_finish, upholstery, hardware, custom_notes)
                        VALUES (:order_id, :product_id, :product_name, :unit_price, :quantity, :wood_finish, :upholstery, :hardware, :custom_notes)";
            $itemStmt = $db->prepare($itemSql);

            $stockUpdateStmt = $db->prepare("UPDATE products SET stock = GREATEST(0, stock - :qty) WHERE id = :id");

            foreach ($data['items'] as $item) {
                $itemStmt->execute([
                    ':order_id' => $orderId,
                    ':product_id' => $item['productId'],
                    ':product_name' => $item['name'],
                    ':unit_price' => $item['price'],
                    ':quantity' => $item['quantity'],
                    ':wood_finish' => $item['selectedWoodFinish'] ?? null,
                    ':upholstery' => $item['selectedUpholstery'] ?? null,
                    ':hardware' => $item['selectedHardware'] ?? null,
                    ':custom_notes' => $item['customNotes'] ?? null,
                ]);

                $stockUpdateStmt->execute([
                    ':qty' => $item['quantity'],
                    ':id' => $item['productId']
                ]);
            }

            $db->commit();
            return $orderId;
        } catch (Exception $e) {
            $db->rollBack();
            throw $e;
        }
    }

    public static function updateStatus(string $orderId, string $status): bool {
        $db = Database::getConnection();
        $stmt = $db->prepare("UPDATE orders SET status = :status WHERE id = :id");
        return $stmt->execute([':status' => $status, ':id' => $orderId]);
    }
}
