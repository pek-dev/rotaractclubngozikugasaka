<?php
/**
 * Inscription Newsletter via PHP + MySQL
 * Endpoint POST : /api/subscribe_newsletter.php
 */

require_once __DIR__ . '/config.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Méthode non autorisée. Utilisez POST.']);
    exit();
}

$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true) ?? $_POST;

$email = filter_var(trim($data['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$source = trim($data['source'] ?? 'Footer Site Web');

if (!$email) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'Veuillez fournir une adresse email valide.'
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

try {
    // Insérer ou mettre à jour si l'email existe déjà
    $id = 'sub-' . time() . '-' . rand(100, 999);
    $stmt = $pdo->prepare("
        INSERT INTO newsletter_subscribers (id, email, subscribed_at, source)
        VALUES (:id, :email, NOW(), :source)
        ON DUPLICATE KEY UPDATE source = VALUES(source)
    ");

    $stmt->execute([
        ':id' => $id,
        ':email' => $email,
        ':source' => $source
    ]);

    echo json_encode([
        'status' => 'success',
        'message' => 'Merci pour votre inscription à la lettre d information ! 📬',
        'data' => [
            'id' => $id,
            'email' => $email,
            'source' => $source,
            'timestamp' => date('Y-m-d H:i:s')
        ]
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Erreur lors de l enregistrement dans la base de données : ' . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
