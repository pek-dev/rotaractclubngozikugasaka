<?php
/**
 * API PHP pour Récupérer les Articles d'Actualités depuis MySQL
 * Endpoint GET : /api/get_news.php
 */

require_once __DIR__ . '/config.php';

header('Content-Type: application/json; charset=utf-8');

try {
    $stmt = $pdo->query("SELECT * FROM news_articles ORDER BY id DESC");
    $articles = $stmt->fetchAll();

    echo json_encode([
        'status' => 'success',
        'count' => count($articles),
        'articles' => $articles
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Erreur de lecture MySQL : ' . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
