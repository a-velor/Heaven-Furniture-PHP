<?php
/**
 * Heaven Furniture Mart - PHP CMS RESTful API Router
 * Handles all CRUD endpoints for Products, Orders, Categories, and CMS Analytics
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../models/Product.php';
require_once __DIR__ . '/../models/Order.php';

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

// Simple routing
if (preg_match('#/api/products/?$#', $uri)) {
    if ($method === 'GET') {
        $category = $_GET['category'] ?? null;
        $search = $_GET['search'] ?? null;
        $status = $_GET['status'] ?? 'active';
        $products = Product::all($category, $search, $status);
        echo json_encode(['status' => 'success', 'data' => $products]);
        exit;
    }

    if ($method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input || empty($input['name']) || empty($input['price'])) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Missing product name or price']);
            exit;
        }

        $id = Product::create($input);
        echo json_encode(['status' => 'success', 'message' => 'Product created', 'id' => $id]);
        exit;
    }
}

if (preg_match('#/api/products/([a-zA-Z0-9_-]+)$#', $uri, $matches)) {
    $id = $matches[1];
    if ($method === 'GET') {
        $product = Product::find($id);
        if ($product) {
            echo json_encode(['status' => 'success', 'data' => $product]);
        } else {
            http_response_code(404);
            echo json_encode(['status' => 'error', 'message' => 'Product not found']);
        }
        exit;
    }

    if ($method === 'PUT' || $method === 'PATCH') {
        $input = json_decode(file_get_contents('php://input'), true);
        $updated = Product::update($id, $input);
        echo json_encode(['status' => $updated ? 'success' : 'error', 'updated' => $updated]);
        exit;
    }

    if ($method === 'DELETE') {
        $deleted = Product::delete($id);
        echo json_encode(['status' => $deleted ? 'success' : 'error', 'deleted' => $deleted]);
        exit;
    }
}

if (preg_match('#/api/orders/?$#', $uri)) {
    if ($method === 'GET') {
        $orders = Order::all();
        echo json_encode(['status' => 'success', 'data' => $orders]);
        exit;
    }

    if ($method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input || empty($input['customerName']) || empty($input['items'])) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Invalid order payload']);
            exit;
        }

        try {
            $orderId = Order::create($input);
            echo json_encode(['status' => 'success', 'orderId' => $orderId, 'message' => 'Order successfully placed']);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
        exit;
    }
}

if (preg_match('#/api/orders/([a-zA-Z0-9_-]+)/status$#', $uri, $matches)) {
    $orderId = $matches[1];
    if ($method === 'PUT' || $method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        $status = $input['status'] ?? 'Processing';
        $updated = Order::updateStatus($orderId, $status);
        echo json_encode(['status' => $updated ? 'success' : 'error', 'orderId' => $orderId, 'newStatus' => $status]);
        exit;
    }
}

http_response_code(404);
echo json_encode(['status' => 'error', 'message' => 'Endpoint not found']);
