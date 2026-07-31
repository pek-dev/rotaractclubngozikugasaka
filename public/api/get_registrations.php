<?php
/**
 * GET REGISTRATIONS — API PHP ROTARACT CLUB NGOZI KUGASAKA
 * URL: /api/get_registrations.php
 */

require_once __DIR__ . '/config.php';

header('Content-Type: application/json; charset=utf-8');

try {
    if (isset($pdo)) {
        // Create table if not exists
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

        $stmt = $pdo->query("SELECT id, event_id as eventId, event_title as eventTitle, name, email, phone, tickets, registration_date as date, status FROM event_registrations ORDER BY registration_date DESC");
        $registrations = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            'status' => 'success',
            'count' => count($registrations),
            'source' => 'MySQL Database',
            'data' => $registrations
        ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        exit();
    }
} catch (Exception $e) {
    // Fallback if MySQL is disconnected or offline
}

// Fallback sample data if DB unavailable
$sampleData = [
    [
        'id' => 'reg-1',
        'eventId' => 'evt-1',
        'eventTitle' => 'Grand Don de Sang & Dépistage Diabète',
        'name' => 'Jean-Paul Nkurunziza',
        'email' => 'jp.nkurunziza@gmail.com',
        'phone' => '+257 79 123 456',
        'tickets' => 2,
        'date' => '25/07/2026 à 09:30',
        'status' => 'Confirmé'
    ],
    [
        'id' => 'reg-2',
        'eventId' => 'evt-2',
        'eventTitle' => 'Reboisement & Protection Environnementale Ngozi',
        'name' => 'Chantal Munezero',
        'email' => 'munezero.chantal@yahoo.fr',
        'phone' => '+257 68 987 654',
        'tickets' => 1,
        'date' => '26/07/2026 à 14:15',
        'status' => 'En attente'
    ],
    [
        'id' => 'reg-3',
        'eventId' => 'evt-1',
        'eventTitle' => 'Grand Don de Sang & Dépistage Diabète',
        'name' => 'Alain Bigirimana',
        'email' => 'alain.bigiri@outlook.com',
        'phone' => '+257 79 456 789',
        'tickets' => 3,
        'date' => '27/07/2026 à 11:00',
        'status' => 'Confirmé'
    ]
];

echo json_encode([
    'status' => 'success',
    'count' => count($sampleData),
    'source' => 'Local Mode (Fallback)',
    'data' => $sampleData
], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
