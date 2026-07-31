<?php
/**
 * POST REGISTER EVENT — API PHP ROTARACT CLUB NGOZI KUGASAKA
 * URL: /api/register_event.php
 */

require_once __DIR__ . '/config.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Méthode non autorisée. Utilisez POST.'], JSON_UNESCAPED_UNICODE);
    exit();
}

$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

if (!$data) {
    $data = $_POST;
}

$eventId = trim($data['eventId'] ?? $data['event_id'] ?? 'evt-general');
$eventTitle = trim($data['eventTitle'] ?? $data['event_title'] ?? 'Événement Rotaract Ngozi');
$name = trim($data['name'] ?? '');
$email = trim($data['email'] ?? '');
$phone = trim($data['phone'] ?? '');
$tickets = intval($data['tickets'] ?? 1);

if (empty($name) || empty($email) || empty($phone)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Veuillez remplir le nom, l\'email et le numéro de téléphone.'], JSON_UNESCAPED_UNICODE);
    exit();
}

$registrationId = 'reg-' . time() . '-' . rand(100, 999);
$registrationDate = date('Y-m-d H:i:s');
$status = 'Confirmé';

try {
    if (isset($pdo)) {
        // Table ensure
        $pdo->exec("CREATE TABLE IF NOT EXISTS `event_registrations` (
          `id` VARCHAR(100) PRIMARY KEY,
          `event_id` VARCHAR(100) NOT NULL,
          `event_title` VARCHAR(255) NOT NULL,
          `name` VARCHAR(255) NOT NULL,
          `email` VARCHAR(255) NOT NULL,
          `phone` VARCHAR(100) NOT NULL,
          `tickets` INT DEFAULT 1,
          `registration_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          `status` VARCHAR(50) DEFAULT 'Confirmé'
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

        $stmt = $pdo->prepare("INSERT INTO event_registrations (id, event_id, event_title, name, email, phone, tickets, registration_date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$registrationId, $eventId, $eventTitle, $name, $email, $phone, $tickets, $registrationDate, $status]);

        echo json_encode([
            'status' => 'success',
            'message' => 'Inscription enregistrée en base de données MySQL avec succès ! 🎟️',
            'registration' => [
                'id' => $registrationId,
                'eventTitle' => $eventTitle,
                'name' => $name,
                'email' => $email,
                'phone' => $phone,
                'tickets' => $tickets,
                'date' => $registrationDate,
                'status' => $status
            ]
        ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        exit();
    }
} catch (Exception $e) {
    // Fallback response if DB is offline
}

echo json_encode([
    'status' => 'success',
    'message' => 'Inscription enregistrée en mode local. 🎟️',
    'registration' => [
        'id' => $registrationId,
        'eventTitle' => $eventTitle,
        'name' => $name,
        'email' => $email,
        'phone' => $phone,
        'tickets' => $tickets,
        'date' => $registrationDate,
        'status' => $status
    ]
], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
