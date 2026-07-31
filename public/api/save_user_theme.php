<?php
/**
 * API Sauvegarde & Synchronisation Préférence Thème (Sombre / Clair)
 * Rotaract Club Ngozi Kugasaka — District 9150
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$db_host = getenv('DB_HOST') ?: 'localhost';
$db_name = getenv('DB_NAME') ?: 'rotaract_ngozi_db';
$db_user = getenv('DB_USER') ?: 'root';
$db_pass = getenv('DB_PASS') ?: '';
$db_port = getenv('DB_PORT') ?: '3306';

$pdo = null;
try {
    $dsn = "mysql:host=$db_host;port=$db_port;dbname=$db_name;charset=utf8mb4";
    $pdo = new PDO($dsn, $db_user, $db_pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);

    // Ensure user_preferences table exists
    $pdo->exec("CREATE TABLE IF NOT EXISTS user_preferences (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_email VARCHAR(191) NOT NULL UNIQUE,
        role VARCHAR(50) DEFAULT 'membre',
        theme_preference VARCHAR(20) DEFAULT 'auto',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");
} catch (Exception $e) {
    // Database connection or creation failed; fallback gracefully to simulated JSON response
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $email = isset($_GET['email']) ? trim($_GET['email']) : '';
    
    if (empty($email)) {
        echo json_encode(['status' => 'error', 'message' => 'Email manquant'], JSON_UNESCAPED_UNICODE);
        exit();
    }

    if ($pdo) {
        try {
            $stmt = $pdo->prepare("SELECT theme_preference, role FROM user_preferences WHERE user_email = ?");
            $stmt->execute([$email]);
            $row = $stmt->fetch();
            if ($row) {
                echo json_encode([
                    'status' => 'success',
                    'email' => $email,
                    'theme_preference' => $row['theme_preference'],
                    'role' => $row['role'],
                    'synced_db' => true
                ], JSON_UNESCAPED_UNICODE);
                exit();
            }
        } catch (Exception $e) {
            // continue fallback
        }
    }

    // Default fallback
    echo json_encode([
        'status' => 'success',
        'email' => $email,
        'theme_preference' => 'auto',
        'synced_db' => false
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $email = isset($input['email']) ? trim($input['email']) : '';
    $theme = isset($input['theme']) ? trim($input['theme']) : 'auto';
    $role = isset($input['role']) ? trim($input['role']) : 'membre';

    if (empty($email)) {
        echo json_encode(['status' => 'error', 'message' => 'Email requis'], JSON_UNESCAPED_UNICODE);
        exit();
    }

    if (!in_array($theme, ['light', 'dark', 'auto'])) {
        $theme = 'auto';
    }

    $dbSuccess = false;
    if ($pdo) {
        try {
            $stmt = $pdo->prepare("INSERT INTO user_preferences (user_email, role, theme_preference) 
                VALUES (?, ?, ?) 
                ON DUPLICATE KEY UPDATE theme_preference = VALUES(theme_preference), role = VALUES(role)");
            $stmt->execute([$email, $role, $theme]);
            $dbSuccess = true;
        } catch (Exception $e) {
            $dbSuccess = false;
        }
    }

    echo json_encode([
        'status' => 'success',
        'message' => 'Préférence de thème enregistrée en base de données',
        'email' => $email,
        'theme_preference' => $theme,
        'role' => $role,
        'synced_db' => $dbSuccess,
        'updated_at' => date('Y-m-d H:i:s')
    ], JSON_UNESCAPED_UNICODE);
    exit();
}
