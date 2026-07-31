<?php
/**
 * API PHP pour le Calendrier Mensuel Interactif des Événements
 * Endpoint GET : /api/get_events_calendar.php
 */

require_once __DIR__ . '/config.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

try {
    $events = [];
    
    // Attempt fetching from PDO MySQL database if table exists
    try {
        $stmt = $pdo->query("SELECT * FROM events ORDER BY date ASC");
        $events = $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (\PDOException $e) {
        // Table might not exist yet, fallback to structured sample events
        $events = [];
    }

    if (empty($events)) {
        $events = [
            [
                'id' => 1,
                'title' => 'Grand Don de Sang & Dépistage Diabète',
                'category' => 'Santé Publique',
                'date' => '2026-08-15',
                'time' => '08:30 - 14:00',
                'location' => 'Centre de Santé Kugasaka, Ngozi',
                'description' => 'Collecte de sang annuelle en collaboration avec l Hôpital Régional de Ngozi pour appuyer la banque de sang et dépistage gratuit du diabète.',
                'image' => 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=1200&q=80&fm=webp',
                'seats_available' => 45,
                'organizer' => 'Commission Action Intérêt Public'
            ],
            [
                'id' => 2,
                'title' => 'Campagne de Reboisement Colline Kugasaka',
                'category' => 'Environnement',
                'date' => '2026-08-22',
                'time' => '07:00 - 12:00',
                'location' => 'Colline Kugasaka, Ngozi',
                'description' => 'Plantation de 1 500 arbres fruitiers et essences locales pour lutter contre l érosion et sensibiliser la jeunesse locale.',
                'image' => 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80&fm=webp',
                'seats_available' => 80,
                'organizer' => 'Commission Environnement & Écologie'
            ],
            [
                'id' => 3,
                'title' => 'Atelier Mentorat Youth Leadership',
                'category' => 'Formation',
                'date' => '2026-09-05',
                'time' => '14:00 - 17:30',
                'location' => 'Alliance Française de Ngozi',
                'description' => 'Session interactive sur la prise de parole en public, l entrepreneuriat social et la rédaction de projets à impact.',
                'image' => 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80&fm=webp',
                'seats_available' => 30,
                'organizer' => 'Commission Développement Professionnel'
            ],
            [
                'id' => 4,
                'title' => 'Gala Caritatif & Remise des Bourses Scolaires',
                'category' => 'Éducation',
                'date' => '2026-09-19',
                'time' => '18:00 - 22:00',
                'location' => 'Hôtel BCECO, Ngozi',
                'description' => 'Soirée de bienfaisance pour financer l équivalent de 50 bourses d études secondaires pour les orphelins de Ngozi.',
                'image' => 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80&fm=webp',
                'seats_available' => 120,
                'organizer' => 'Comité Exécutif Rotaract'
            ],
            [
                'id' => 5,
                'title' => 'Réunion Statutaire & Accueil des Nouveaux Postulants',
                'category' => 'Vie du Club',
                'date' => '2026-08-08',
                'time' => '16:00 - 18:00',
                'location' => 'Siège Rotaract Ngozi, Centre-Ville',
                'description' => 'Rencontre bi-mensuelle des membres, évaluation des commissions et présentation du programme aux futurs membres.',
                'image' => 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80&fm=webp',
                'seats_available' => 25,
                'organizer' => 'Secrétariat Général'
            ]
        ];
    }

    echo json_encode([
        'status' => 'success',
        'count' => count($events),
        'events' => $events
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

} catch (\Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Erreur API : ' . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
