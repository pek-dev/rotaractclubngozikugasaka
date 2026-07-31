<?php
/**
 * Test de Connexion MySQL & Diagnostic Système — Rotaract Club Ngozi
 * URL Endpoint : /api/connect.php
 */

require_once __DIR__ . '/config.php';

// Si appelé dans un navigateur web ordinaire, rediriger vers le portail UI/UX
$accept = $_SERVER['HTTP_ACCEPT'] ?? '';
if (strpos($accept, 'text/html') !== false && !isset($_GET['json'])) {
    header('Location: /api/index.php');
    exit();
}

header('Content-Type: application/json; charset=utf-8');

try {
    // Tester la version de MySQL et le nom de la base de données active
    $stmt = $pdo->query("SELECT VERSION() as mysql_version, DATABASE() as current_db");
    $dbInfo = $stmt->fetch();

    // Lister toutes les tables existantes
    $tablesStmt = $pdo->query("SHOW TABLES");
    $tables = $tablesStmt->fetchAll(PDO::FETCH_COLUMN);

    // Compter quelques métriques si les tables existent
    $stats = [];
    if (in_array('newsletter_subscribers', $tables)) {
        $stats['newsletter_subscribers_count'] = $pdo->query("SELECT COUNT(*) FROM newsletter_subscribers")->fetchColumn();
    }
    if (in_array('membership_applications', $tables)) {
        $stats['membership_applications_count'] = $pdo->query("SELECT COUNT(*) FROM membership_applications")->fetchColumn();
    }
    if (in_array('news_articles', $tables)) {
        $stats['news_articles_count'] = $pdo->query("SELECT COUNT(*) FROM news_articles")->fetchColumn();
    }
    if (in_array('activities', $tables)) {
        $stats['activities_count'] = $pdo->query("SELECT COUNT(*) FROM activities")->fetchColumn();
    }

    echo json_encode([
        'status' => 'success',
        'message' => 'Connexion MySQL établie avec succès ! 🚀',
        'club' => 'Rotaract Club Ngozi Kugasaka (District 9150)',
        'server_info' => [
            'php_version' => PHP_VERSION,
            'mysql_version' => $dbInfo['mysql_version'],
            'database_name' => $dbInfo['current_db'],
            'tables_count' => count($tables),
            'tables_list' => $tables,
            'metrics' => $stats,
            'timestamp' => date('d/m/Y H:i:s')
        ]
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Erreur lors de la requête de test MySQL',
        'error_details' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
