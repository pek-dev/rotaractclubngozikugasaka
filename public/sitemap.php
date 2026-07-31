<?php
/**
 * DYNAMIC SITEMAP GENERATOR XML — ROTARACT CLUB NGOZI KUGASAKA
 * URL: /sitemap.php or /sitemap.xml
 * Génère un fichier XML sitemap standard conforme sitemaps.org pour le SEO
 */

header("Content-Type: application/xml; charset=UTF-8");
header("Access-Control-Allow-Origin: *");

require_once __DIR__ . '/api/connect.php';

// Base URL detection
$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
$domainName = $_SERVER['HTTP_HOST'] ?? 'rotaract-ngozi-kugasaka.org';
$baseUrl = $protocol . $domainName;

// Fetch events from MySQL if available
$events = [];
if ($conn) {
    $result = $conn->query("SELECT id, title, updated_at FROM events ORDER BY id DESC LIMIT 50");
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $events[] = $row;
        }
    }
}

// Fetch news from MySQL if available
$news = [];
if ($conn) {
    $result = $conn->query("SELECT id, title, updated_at FROM news ORDER BY id DESC LIMIT 50");
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $news[] = $row;
        }
    }
}

// Output XML
echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
                            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
    <!-- Page d'accueil principale -->
    <url>
        <loc><?php echo htmlspecialchars($baseUrl); ?>/</loc>
        <lastmod><?php echo date('Y-m-d'); ?></lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>

    <!-- Sections clés du Rotaract Ngozi Kugasaka -->
    <url>
        <loc><?php echo htmlspecialchars($baseUrl); ?>/#apropos</loc>
        <lastmod><?php echo date('Y-m-d'); ?></lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc><?php echo htmlspecialchars($baseUrl); ?>/#impact</loc>
        <lastmod><?php echo date('Y-m-d'); ?></lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc><?php echo htmlspecialchars($baseUrl); ?>/#activites</loc>
        <lastmod><?php echo date('Y-m-d'); ?></lastmod>
        <changefreq>daily</changefreq>
        <priority>0.9</priority>
    </url>
    <url>
        <loc><?php echo htmlspecialchars($baseUrl); ?>/#evenements</loc>
        <lastmod><?php echo date('Y-m-d'); ?></lastmod>
        <changefreq>daily</changefreq>
        <priority>0.9</priority>
    </url>
    <url>
        <loc><?php echo htmlspecialchars($baseUrl); ?>/#actualites</loc>
        <lastmod><?php echo date('Y-m-d'); ?></lastmod>
        <changefreq>daily</changefreq>
        <priority>0.9</priority>
    </url>
    <url>
        <loc><?php echo htmlspecialchars($baseUrl); ?>/#equipe</loc>
        <lastmod><?php echo date('Y-m-d'); ?></lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>
    <url>
        <loc><?php echo htmlspecialchars($baseUrl); ?>/#contact</loc>
        <lastmod><?php echo date('Y-m-d'); ?></lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>

    <!-- Événements dynamiques de la BDD -->
    <?php if (!empty($events)): ?>
        <?php foreach ($events as $event): ?>
            <url>
                <loc><?php echo htmlspecialchars($baseUrl . '/#evenement-' . $event['id']); ?></loc>
                <lastmod><?php echo !empty($event['updated_at']) ? date('Y-m-d', strtotime($event['updated_at'])) : date('Y-m-d'); ?></lastmod>
                <changefreq>weekly</changefreq>
                <priority>0.8</priority>
            </url>
        <?php endforeach; ?>
    <?php else: ?>
        <!-- Événements phares par défaut -->
        <url>
            <loc><?php echo htmlspecialchars($baseUrl); ?>/#evenement-1</loc>
            <lastmod><?php echo date('Y-m-d'); ?></lastmod>
            <changefreq>weekly</changefreq>
            <priority>0.8</priority>
        </url>
        <url>
            <loc><?php echo htmlspecialchars($baseUrl); ?>/#evenement-2</loc>
            <lastmod><?php echo date('Y-m-d'); ?></lastmod>
            <changefreq>weekly</changefreq>
            <priority>0.8</priority>
        </url>
    <?php endif; ?>

    <!-- News & Articles dynamiques -->
    <?php if (!empty($news)): ?>
        <?php foreach ($news as $article): ?>
            <url>
                <loc><?php echo htmlspecialchars($baseUrl . '/#article-' . $article['id']); ?></loc>
                <lastmod><?php echo !empty($article['updated_at']) ? date('Y-m-d', strtotime($article['updated_at'])) : date('Y-m-d'); ?></lastmod>
                <changefreq>weekly</changefreq>
                <priority>0.7</priority>
            </url>
        <?php endforeach; ?>
    <?php else: ?>
        <url>
            <loc><?php echo htmlspecialchars($baseUrl); ?>/#article-1</loc>
            <lastmod><?php echo date('Y-m-d'); ?></lastmod>
            <changefreq>weekly</changefreq>
            <priority>0.7</priority>
        </url>
    <?php endif; ?>
</urlset>
