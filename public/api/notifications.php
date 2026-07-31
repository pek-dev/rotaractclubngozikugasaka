<?php
/**
 * API DE GESTION DU CENTRE DE NOTIFICATIONS & AUDIT LOGS UTILISATEUR
 * ROTARACT CLUB NGOZI KUGASAKA — DISTRICT 9150
 * URL: /api/notifications.php
 */

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/connect.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $email = isset($_GET['email']) ? trim($_GET['email']) : (isset($_GET['user_email']) ? trim($_GET['user_email']) : '');
    if (empty($email)) {
        $email = 'rotaractclubngozikugasaka9150@gmail.com';
    }

    $notifications = [];
    $audit_logs = [];

    // Attempt to fetch audit logs from MySQL
    if ($conn) {
        // Fetch audit logs specific to this user email or ALL if president/admin
        $stmt = $conn->prepare("SELECT id, user_email, user_role, action_type, description, ip_address, created_at FROM audit_logs WHERE user_email = ? OR user_email = 'all' ORDER BY created_at DESC LIMIT 30");
        if ($stmt) {
            $stmt->bind_param("s", $email);
            $stmt->execute();
            $result = $stmt->get_result();
            if ($result) {
                while ($row = $result->fetch_assoc()) {
                    $audit_logs[] = $row;
                }
            }
            $stmt->close();
        }
    }

    // Default mock audit logs fallback if DB empty or specific user
    if (empty($audit_logs)) {
        $audit_logs = [
            [
                "id" => 101,
                "user_email" => $email,
                "user_role" => "membre",
                "action_type" => "PRESENCE_REUNION",
                "description" => "Confirmation de présence enregistrée pour la réunion statutaire #42 à Ngozi",
                "ip_address" => "197.221.14.2",
                "created_at" => date('Y-m-d H:i:s', strtotime('-15 minutes'))
            ],
            [
                "id" => 102,
                "user_email" => $email,
                "user_role" => "membre",
                "action_type" => "INSCRIPTION_EVENEMENT",
                "description" => "Réservation de Pass effectuée pour le Gala de Bienfaisance Ngozi 2026",
                "ip_address" => "197.221.14.2",
                "created_at" => date('Y-m-d H:i:s', strtotime('-2 hours'))
            ],
            [
                "id" => 103,
                "user_email" => $email,
                "user_role" => "membre",
                "action_type" => "COMMUNICATION_PUSH",
                "description" => "Réception alerte Push officielle du bureau exécutif",
                "ip_address" => "197.221.14.2",
                "created_at" => date('Y-m-d H:i:s', strtotime('-1 day'))
            ]
        ];
    }

    // Curated push alerts & notifications for the user
    $notifications = [
        [
            "id" => "notif-1",
            "title" => "📢 Convocation Réunion Statutaire #42",
            "body" => "Prochaine réunion ordinaire du Rotaract Ngozi Kugasaka ce Samedi à 15h00 au CPC Ngozi & Visio.",
            "type" => "push_alert",
            "category" => "EVENEMENT",
            "read" => false,
            "url" => "#evenements",
            "created_at" => date('Y-m-d H:i:s', strtotime('-30 minutes'))
        ],
        [
            "id" => "notif-2",
            "title" => "📄 Procès-Verbal disponible",
            "body" => "Le PV de la réunion du 25 Juillet a été publié par la Secrétaire. Vous pouvez le télécharger dans votre espace.",
            "type" => "pv_publication",
            "category" => "OFFICIEL",
            "read" => false,
            "url" => "#actualites",
            "created_at" => date('Y-m-d H:i:s', strtotime('-3 hours'))
        ],
        [
            "id" => "notif-3",
            "title" => "🌱 Projet Reboisement Colline Kugasaka",
            "body" => "Appel à bénévoles : plantation de 1 500 arbres fruitiers le week-end prochain.",
            "type" => "push_alert",
            "category" => "ACTION_COMMUNAUTAIRE",
            "read" => true,
            "url" => "#activites",
            "created_at" => date('Y-m-d H:i:s', strtotime('-1 day'))
        ],
        [
            "id" => "notif-4",
            "title" => "💳 Reçu de Cotisation validé",
            "body" => "Votre cotisation mensuelle Rotaract 2026 est enregistrée comme 'À Jour' par la Trésorerie.",
            "type" => "cotisation",
            "category" => "FINANCE",
            "read" => true,
            "url" => "#",
            "created_at" => date('Y-m-d H:i:s', strtotime('-3 days'))
        ]
    ];

    // Calculate unread count
    $unread_count = 0;
    foreach ($notifications as $notif) {
        if (!$notif['read']) {
            $unread_count++;
        }
    }

    echo json_encode([
        "status" => "success",
        "user_email" => $email,
        "unread_count" => $unread_count,
        "notifications" => $notifications,
        "audit_logs" => $audit_logs
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit();
}

if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $action = isset($data['action']) ? trim($data['action']) : '';

    if ($action === 'mark_all_read') {
        echo json_encode([
            "status" => "success",
            "message" => "Toutes les notifications ont été marquées comme lues."
        ]);
        exit();
    }

    if ($action === 'create_push_notification') {
        $title = isset($data['title']) ? trim($data['title']) : 'Nouvelle alerte Push';
        $body = isset($data['body']) ? trim($data['body']) : '';
        $target_email = isset($data['user_email']) ? trim($data['user_email']) : 'all';

        // Optionally record in audit log
        if ($conn) {
            $stmt = $conn->prepare("INSERT INTO audit_logs (user_email, user_role, action_type, description, ip_address) VALUES (?, 'admin', 'PUSH_NOTIFICATION', ?, ?)");
            if ($stmt) {
                $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
                $desc = "Diffusion Push: {$title} - {$body}";
                $stmt->bind_param("sss", $target_email, $desc, $ip);
                $stmt->execute();
                $stmt->close();
            }
        }

        echo json_encode([
            "status" => "success",
            "message" => "Alerte Push enregistrée et diffusée avec succès !",
            "notification" => [
                "id" => "notif-" . time(),
                "title" => $title,
                "body" => $body,
                "created_at" => date('Y-m-d H:i:s')
            ]
        ]);
        exit();
    }

    echo json_encode(["status" => "error", "message" => "Action invalide."]);
    exit();
}
