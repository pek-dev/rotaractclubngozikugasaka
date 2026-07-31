<?php
/**
 * DYNAMIC OPEN GRAPH META GENERATOR — ROTARACT CLUB NGOZI KUGASAKA
 * URL: /api/share.php?type=article|event&id=XYZ
 */

require_once __DIR__ . '/config.php';

$type = trim($_GET['type'] ?? 'article');
$id = trim($_GET['id'] ?? 'news-1');

// Mock fallback dataset matching site contents
$articles = [
    'news-1' => [
        'title' => 'Lancement de la Campagne "Un Arbre, Un Avenir" à Ngozi',
        'summary' => 'Plus de 2 500 plants d\'arbres fruitiers et forestiers plantés sur la colline Kugasaka pour lutter contre l\'érosion des sols.',
        'image' => 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1200',
        'author' => 'Commission Environnement',
        'date' => '2026-07-20'
    ],
    'news-2' => [
        'title' => 'Campagne de Dépistage Gratuit du Diabète & Don de Sang',
        'summary' => 'Une grande mobilisation humanitaire à l\'Hôpital Régional de Ngozi ayant permis de collecter 150 poches de sang.',
        'image' => 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&q=80&w=1200',
        'author' => 'Comité Santé Publique',
        'date' => '2026-07-15'
    ],
    'news-3' => [
        'title' => 'Atelier de Formation en Leadership & Entrepreneuriat Jeune',
        'summary' => '45 jeunes diplômés formés à la gestion de projet et au montage de business plans bancables.',
        'image' => 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1200',
        'author' => 'Commission Formation & Jeunesse',
        'date' => '2026-07-10'
    ]
];

$events = [
    'evt-1' => [
        'title' => 'Grand Don de Sang Communautaire & Dépistage Diabète',
        'summary' => 'Rejoignez les membres du Rotaract Ngozi Kugasaka pour une journée de solidarité et de don de soi.',
        'image' => 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&q=80&w=1200',
        'date' => 'Samedi 15 Août 2026'
    ],
    'evt-2' => [
        'title' => 'Reboisement Communautaire & Sensibilisation Écologique',
        'summary' => 'Action environnementale de reboisement sur les crêtes de Ngozi.',
        'image' => 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1200',
        'date' => 'Samedi 22 Août 2026'
    ]
];

// Try reading from MySQL if PDO is initialized
if (isset($pdo)) {
    try {
        if ($type === 'article') {
            $stmt = $pdo->prepare("SELECT title, summary, image_url as image, author, publication_date as date FROM news_articles WHERE id = ?");
            $stmt->execute([$id]);
            $found = $stmt->fetch();
            if ($found) $articles[$id] = $found;
        }
    } catch (Exception $e) {}
}

$item = null;
if ($type === 'article') {
    $item = $articles[$id] ?? $articles['news-1'];
} else {
    $item = $events[$id] ?? $events['evt-1'];
}

$pageTitle = htmlspecialchars($item['title']) . ' — Rotaract Club Ngozi Kugasaka';
$pageDescription = htmlspecialchars($item['summary']);
$pageImage = htmlspecialchars($item['image']);
$currentUrl = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
$appRedirectUrl = "/?{$type}={$id}#" . ($type === 'article' ? 'actualites' : 'evenements');

?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- Primary Meta Tags -->
    <title><?php echo $pageTitle; ?></title>
    <meta name="title" content="<?php echo $pageTitle; ?>">
    <meta name="description" content="<?php echo $pageDescription; ?>">

    <!-- Open Graph / Facebook / WhatsApp -->
    <meta property="og:type" content="<?php echo $type === 'article' ? 'article' : 'website'; ?>">
    <meta property="og:url" content="<?php echo htmlspecialchars($currentUrl); ?>">
    <meta property="og:title" content="<?php echo $pageTitle; ?>">
    <meta property="og:description" content="<?php echo $pageDescription; ?>">
    <meta property="og:image" content="<?php echo $pageImage; ?>">
    <meta property="og:site_name" content="Rotaract Club Ngozi Kugasaka (District 9150)">
    <meta property="og:locale" content="fr_FR">

    <!-- Twitter Cards -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="<?php echo htmlspecialchars($currentUrl); ?>">
    <meta property="twitter:title" content="<?php echo $pageTitle; ?>">
    <meta property="twitter:description" content="<?php echo $pageDescription; ?>">
    <meta property="twitter:image" content="<?php echo $pageImage; ?>">

    <style>
        body { font-family: 'Segoe UI', system-ui, sans-serif; background-color: #0f172a; color: #ffffff; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; text-align: center; }
        .card { background: #1e293b; border-radius: 24px; padding: 30px; max-width: 500px; width: 100%; border: 1px solid #334155; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
        .badge { background: #e11d48; color: #ffffff; font-size: 11px; font-weight: bold; padding: 4px 12px; border-radius: 20px; text-transform: uppercase; display: inline-block; margin-bottom: 15px; }
        h1 { font-size: 20px; margin: 0 0 10px; line-height: 1.4; }
        p { font-size: 13px; color: #94a3b8; line-height: 1.6; margin-bottom: 20px; }
        img { width: 100%; height: 200px; object-fit: cover; border-radius: 16px; margin-bottom: 20px; border: 1px solid #334155; }
        .btn { display: inline-block; background: #e11d48; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 12px; font-weight: bold; font-size: 13px; transition: all 0.2s; }
        .btn:hover { background: #be123c; }
    </style>
</head>
<body>
    <div class="card">
        <span class="badge">Aperçu Open Graph • Rotaract Ngozi</span>
        <img src="<?php echo $pageImage; ?>" alt="Cover Image">
        <h1><?php echo htmlspecialchars($item['title']); ?></h1>
        <p><?php echo $pageDescription; ?></p>
        <a href="<?php echo htmlspecialchars($appRedirectUrl); ?>" class="btn">🚀 Ouvrir dans l'application Rotaract</a>
    </div>

    <script>
        // Automatic redirection after 1.5 seconds if user came from a direct link click
        setTimeout(() => {
            if (!window.location.search.includes('no_redirect=1')) {
                window.location.href = "<?php echo htmlspecialchars($appRedirectUrl); ?>";
            }
        }, 1500);
    </script>
</body>
</html>
