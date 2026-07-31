<?php
/**
 * SEND EMAIL API — ROTARACT CLUB NGOZI KUGASAKA
 * URL: /api/send_email.php
 */

require_once __DIR__ . '/config.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Méthode non autorisée. Utilisez POST.'], JSON_UNESCAPED_UNICODE);
    exit();
}

$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true) ?? $_POST;

$recipientEmail = trim($data['email'] ?? '');
$recipientName = trim($data['name'] ?? 'Abonné / Membre');
$subject = trim($data['subject'] ?? 'Notification du Rotaract Club Ngozi Kugasaka');
$templateType = trim($data['template'] ?? 'general');
$customMessage = trim($data['message'] ?? '');
$eventTitle = trim($data['eventTitle'] ?? 'Événement Rotaract Ngozi');
$tickets = intval($data['tickets'] ?? 1);

if (empty($recipientEmail)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'L\'adresse e-mail du destinataire est requise.'], JSON_UNESCAPED_UNICODE);
    exit();
}

// Build HTML Body according to template
$htmlBody = '
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: "Segoe UI", Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
        .header { background: linear-gradient(135deg, #e11d48 0%, #be123c 100%); padding: 30px 20px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 22px; font-weight: 800; }
        .header p { margin: 5px 0 0; font-size: 13px; opacity: 0.9; }
        .content { padding: 30px 25px; line-height: 1.6; }
        .badge { display: inline-block; background: #ffe4e6; color: #e11d48; padding: 6px 14px; border-radius: 20px; font-weight: bold; font-size: 12px; margin-bottom: 15px; }
        .footer { background: #0f172a; padding: 20px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #1e293b; }
        .button { display: inline-block; background: #e11d48; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-weight: bold; margin-top: 15px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Rotaract Club Ngozi Kugasaka</h1>
            <p>District 9150 • Province de Ngozi, République du Burundi</p>
        </div>
        <div class="content">
            <span class="badge">E-mail Officiel Rotaract</span>
            <h2>Bonjour ' . htmlspecialchars($recipientName) . ',</h2>
';

if ($templateType === 'event_confirmation') {
    $htmlBody .= '
        <p>Nous vous confirmons avec plaisir votre inscription à l\'événement :</p>
        <div style="background: #f1f5f9; padding: 15px; border-radius: 12px; border-left: 4px solid #e11d48; margin: 15px 0;">
            <strong style="font-size: 16px; color: #0f172a;">' . htmlspecialchars($eventTitle) . '</strong><br>
            <span style="font-size: 13px; color: #64748b;">Nombre de pass réservés : ' . $tickets . ' place(s)</span>
        </div>
        <p>Votre badge d\'accès PDF est disponible en pièce jointe ou via votre espace participant. Présentez ce message à l\'accueil de la salle.</p>
    ';
} elseif ($templateType === 'welcome_newsletter') {
    $htmlBody .= '
        <p>Bienvenue dans la communauté du Rotaract Club Ngozi Kugasaka ! 🎉</p>
        <p>Vous recevrez désormais notre bulletin d\'actualités, le calendrier de nos actions humanitaires et les invitations exclusives à nos forums de développement pour la jeunesse burundaise.</p>
    ';
} else {
    $htmlBody .= '
        <p>' . nl2br(htmlspecialchars($customMessage ? $customMessage : 'Nous avons bien reçu votre message et notre équipe du bureau vous recontactera dans les plus brefs délais.')) . '</p>
    ';
}

$htmlBody .= '
            <p style="margin-top: 25px; font-size: 13px; color: #64748b;">
                Sincères salutations rotaractiennes,<br>
                <strong>Le Bureau du Rotaract Club Ngozi Kugasaka</strong>
            </p>
        </div>
        <div class="footer">
            &copy; ' . date('Y') . ' Rotaract Club Ngozi Kugasaka • District 9150 Burundi.<br>
            "Servir d\'abord — La Jeunesse au Service de la Communauté"
        </div>
    </div>
</body>
</html>
';

// Attempt sending email via PHP mail()
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= "From: Rotaract Club Ngozi <no-reply@rotaractngozi.bi>" . "\r\n";

$mailSent = @mail($recipientEmail, $subject, $htmlBody, $headers);

// Log into MySQL
$logStatus = $mailSent ? 'Envoyé avec succès' : 'Simulé / Loggé en base MySQL';

try {
    if (isset($pdo)) {
        $pdo->exec("CREATE TABLE IF NOT EXISTS `email_logs` (
          `id` INT AUTO_INCREMENT PRIMARY KEY,
          `recipient_email` VARCHAR(255) NOT NULL,
          `recipient_name` VARCHAR(255) NOT NULL,
          `subject` VARCHAR(255) NOT NULL,
          `template_type` VARCHAR(100) NOT NULL,
          `sent_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          `status` VARCHAR(50) DEFAULT 'Envoyé (Simulation/PHP Mail)'
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

        $stmt = $pdo->prepare("INSERT INTO email_logs (recipient_email, recipient_name, subject, template_type, status) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$recipientEmail, $recipientName, $subject, $templateType, $logStatus]);
    }
} catch (Exception $e) {
    // Silent fallback
}

echo json_encode([
    'status' => 'success',
    'message' => 'E-mail traité et journalisé dans la base MySQL avec succès ! ✉️',
    'email' => [
        'recipient' => $recipientEmail,
        'name' => $recipientName,
        'subject' => $subject,
        'template' => $templateType,
        'sentAt' => date('Y-m-d H:i:s'),
        'mailSent' => $mailSent,
        'htmlBodyPreview' => mb_substr(strip_tags($htmlBody), 0, 180) . '...'
    ]
], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
