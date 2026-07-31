<?php
/**
 * PORTAIL ADMIN & EXPLORATEUR D'API PHP — ROTARACT CLUB NGOZI KUGASAKA
 * URL: /api/index.php
 */

header('Content-Type: text/html; charset=utf-8');

// Charger config pour tester la connexion
$dbConnected = false;
$dbError = null;
$mysqlVersion = 'Inconnue';
$tablesList = [];

try {
    require_once __DIR__ . '/config.php';
    if (isset($pdo)) {
        $dbConnected = true;
        $stmt = $pdo->query("SELECT VERSION() as v");
        $mysqlVersion = $stmt->fetchColumn();

        $tStmt = $pdo->query("SHOW TABLES");
        $tablesList = $tStmt->fetchAll(PDO::FETCH_COLUMN);
    }
} catch (Exception $e) {
    $dbError = $e->getMessage();
}
?>
<!DOCTYPE html>
<html lang="fr" class="h-full bg-slate-950 text-slate-100">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portail PHP & API MySQL — Rotaract Club Ngozi Kugasaka</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;800&family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Poppins:wght@600;700;800;900&display=swap" rel="stylesheet">
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Plus Jakarta Sans', 'sans-serif'],
                        poppins: ['Poppins', 'sans-serif'],
                        mono: ['JetBrains Mono', 'monospace'],
                    },
                    colors: {
                        brand: {
                            50: '#fff1f2',
                            500: '#f43f5e',
                            600: '#e11d48',
                            700: '#be123c',
                        }
                    }
                }
            }
        }
    </script>
</head>
<body class="h-full font-sans antialiased bg-slate-950 text-slate-100 selection:bg-brand-600 selection:text-white">

    <div class="min-h-full flex flex-col">
        <!-- Top Header Navigation Bar -->
        <header class="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-rose-400 flex items-center justify-center font-black font-poppins text-white shadow-lg shadow-brand-600/30">
                        R
                    </div>
                    <div>
                        <h1 class="font-poppins font-black text-sm tracking-tight text-white flex items-center gap-2">
                            Rotaract Club Ngozi
                            <span class="px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-400 border border-brand-500/30 text-[10px] font-mono">PHP API v2.0</span>
                        </h1>
                        <p class="text-[11px] text-slate-400 font-medium">District 9150 • Province de Ngozi, Burundi</p>
                    </div>
                </div>

                <div class="flex items-center gap-3">
                    <a href="/" class="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors border border-slate-700 flex items-center gap-1.5">
                        ← Retour au Site Web
                    </a>
                </div>
            </div>
        </header>

        <!-- Main Content Portal -->
        <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            
            <!-- Hero Status Banner -->
            <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-rose-950 p-6 sm:p-8 border border-slate-800 shadow-2xl">
                <div class="absolute -right-10 -bottom-10 w-64 h-64 bg-brand-600/20 rounded-full blur-3xl pointer-events-none"></div>
                
                <div class="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div class="space-y-2">
                        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
                            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                            SERVEUR PHP ONLINE
                        </div>
                        <h2 class="text-2xl sm:text-3xl font-black font-poppins text-white">
                            Passerelle Backend PHP & MySQL Autogérée
                        </h2>
                        <p class="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                            Interface d'administration et de test d'API REST native PHP/PDO pour le Rotaract Ngozi Kugasaka. Permet l'interconnexion dynamique des formulaires (Newsletter, Inscriptions, Adhésions) avec votre serveur MySQL.
                        </p>
                    </div>

                    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
                        <div class="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
                            <div class="text-[10px] font-mono uppercase text-slate-400">Version PHP</div>
                            <div class="text-lg font-extrabold text-brand-400 font-mono mt-0.5"><?php echo PHP_VERSION; ?></div>
                        </div>
                        <div class="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
                            <div class="text-[10px] font-mono uppercase text-slate-400">Statut MySQL</div>
                            <div class="text-sm font-extrabold font-mono mt-1 <?php echo $dbConnected ? 'text-emerald-400' : 'text-amber-400'; ?>">
                                <?php echo $dbConnected ? 'CONNECTÉ 🟢' : 'STANDBY 🟡'; ?>
                            </div>
                        </div>
                        <div class="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center col-span-2 sm:col-span-1">
                            <div class="text-[10px] font-mono uppercase text-slate-400">Tables Actives</div>
                            <div class="text-lg font-extrabold text-white font-mono mt-0.5"><?php echo count($tablesList); ?> Tables</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- API Explorer & Sandbox -->
            <div class="grid lg:grid-cols-12 gap-8">
                
                <!-- Left Column: Endpoint Test Selectors -->
                <div class="lg:col-span-5 space-y-4">
                    <h3 class="font-poppins font-bold text-lg text-white flex items-center gap-2">
                        <span>⚡</span> Testeur d'Endpoints API REST
                    </h3>

                    <div class="space-y-3">
                        <!-- Endpoint 1: Diagnostic -->
                        <div onclick="runApiTest('/api/connect.php', 'GET')" class="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-brand-500/50 cursor-pointer transition-all group">
                            <div class="flex items-center justify-between">
                                <span class="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 font-mono font-bold text-[11px]">GET</span>
                                <span class="text-xs font-mono text-slate-400 group-hover:text-white transition-colors">/api/connect.php</span>
                            </div>
                            <h4 class="font-bold text-xs text-white mt-2 font-poppins">Diagnostic & Connexion MySQL</h4>
                            <p class="text-[11px] text-slate-400 mt-1">Vérifie l'état de la base de données, la version MySQL et liste les métriques.</p>
                        </div>

                        <!-- Endpoint 2: Get News -->
                        <div onclick="runApiTest('/api/get_news.php', 'GET')" class="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-brand-500/50 cursor-pointer transition-all group">
                            <div class="flex items-center justify-between">
                                <span class="px-2.5 py-1 rounded-lg bg-sky-500/20 text-sky-400 font-mono font-bold text-[11px]">GET</span>
                                <span class="text-xs font-mono text-slate-400 group-hover:text-white transition-colors">/api/get_news.php</span>
                            </div>
                            <h4 class="font-bold text-xs text-white mt-2 font-poppins">Récupérer les Articles d'Actualités</h4>
                            <p class="text-[11px] text-slate-400 mt-1">Renvoie la liste des actualités du Rotaract stockées en base MySQL.</p>
                        </div>

                        <!-- Endpoint 3: Inscriptions aux Événements -->
                        <div onclick="runApiTest('/api/get_registrations.php', 'GET')" class="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-brand-500/50 cursor-pointer transition-all group">
                            <div class="flex items-center justify-between">
                                <span class="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-400 font-mono font-bold text-[11px]">GET</span>
                                <span class="text-xs font-mono text-slate-400 group-hover:text-white transition-colors">/api/get_registrations.php</span>
                            </div>
                            <h4 class="font-bold text-xs text-white mt-2 font-poppins">Liste des Inscrits aux Événements</h4>
                            <p class="text-[11px] text-slate-400 mt-1">Récupère tous les participants enregistrés pour les actions à Ngozi.</p>
                        </div>

                        <!-- Endpoint 4: Exporter CSV -->
                        <a href="/api/export_registrations_csv.php" target="_blank" class="block p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-brand-500/50 cursor-pointer transition-all group">
                            <div class="flex items-center justify-between">
                                <span class="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 font-mono font-bold text-[11px]">CSV</span>
                                <span class="text-xs font-mono text-slate-400 group-hover:text-white transition-colors">/api/export_registrations_csv.php</span>
                            </div>
                            <h4 class="font-bold text-xs text-white mt-2 font-poppins">Télécharger Liste des Inscrits (.CSV)</h4>
                            <p class="text-[11px] text-slate-400 mt-1">Génère un fichier CSV compatible Excel/Sheets avec encodage UTF-8 BOM.</p>
                        </a>

                        <!-- Endpoint 5: Subscribe Newsletter -->
                        <div onclick="testNewsletterForm()" class="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-brand-500/50 cursor-pointer transition-all group">
                            <div class="flex items-center justify-between">
                                <span class="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-400 font-mono font-bold text-[11px]">POST</span>
                                <span class="text-xs font-mono text-slate-400 group-hover:text-white transition-colors">/api/subscribe_newsletter.php</span>
                            </div>
                            <h4 class="font-bold text-xs text-white mt-2 font-poppins">Inscription Newsletter (POST)</h4>
                            <p class="text-[11px] text-slate-400 mt-1">Simule l'ajout d'une adresse email dans la table <code class="text-brand-400">newsletter_subscribers</code>.</p>
                        </div>

                        <!-- Endpoint 6: Envoi d'E-mail -->
                        <div onclick="runApiTest('/api/send_email.php', 'POST', {email: 'test.membre@rotaractngozi.bi', name: 'Jean-Pierre', template: 'welcome_newsletter'})" class="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-brand-500/50 cursor-pointer transition-all group">
                            <div class="flex items-center justify-between">
                                <span class="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-400 font-mono font-bold text-[11px]">POST</span>
                                <span class="text-xs font-mono text-slate-400 group-hover:text-white transition-colors">/api/send_email.php</span>
                            </div>
                            <h4 class="font-bold text-xs text-white mt-2 font-poppins">Système d'Envoi E-mail & Logs</h4>
                            <p class="text-[11px] text-slate-400 mt-1">Génère les templates e-mail HTML et enregistre dans <code class="text-rose-400">email_logs</code>.</p>
                        </div>

                        <!-- Endpoint 7: Générateur PDF -->
                        <a href="/api/export_pdf.php?type=members" target="_blank" class="block p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-brand-500/50 cursor-pointer transition-all group">
                            <div class="flex items-center justify-between">
                                <span class="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-400 font-mono font-bold text-[11px]">PDF</span>
                                <span class="text-xs font-mono text-slate-400 group-hover:text-white transition-colors">/api/export_pdf.php</span>
                            </div>
                            <h4 class="font-bold text-xs text-white mt-2 font-poppins">Générateur PDF Officiel (A4)</h4>
                            <p class="text-[11px] text-slate-400 mt-1">Génère l'Annuaire des Membres, les Badges Événement et les Rapports au format PDF.</p>
                        </a>

                        <!-- Endpoint 8: Meta Generator Open Graph -->
                        <a href="/api/share.php?type=article&id=news-1&no_redirect=1" target="_blank" class="block p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-brand-500/50 cursor-pointer transition-all group">
                            <div class="flex items-center justify-between">
                                <span class="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-400 font-mono font-bold text-[11px]">OG META</span>
                                <span class="text-xs font-mono text-slate-400 group-hover:text-white transition-colors">/api/share.php</span>
                            </div>
                            <h4 class="font-bold text-xs text-white mt-2 font-poppins">Générateur Meta-Tags Open Graph</h4>
                            <p class="text-[11px] text-slate-400 mt-1">Génère les balises <code class="text-indigo-400">og:title</code>, <code class="text-indigo-400">og:image</code> pour Facebook, WhatsApp, Twitter.</p>
                        </a>

                        <!-- Endpoint 9: Inscription Notifications Push -->
                        <div onclick="runApiTest('/api/push_subscribe.php', 'POST', {email: 'membre.push@rotaractngozi.bi', endpoint: 'token_demo_sw_123'})" class="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-brand-500/50 cursor-pointer transition-all group">
                            <div class="flex items-center justify-between">
                                <span class="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 font-mono font-bold text-[11px]">POST</span>
                                <span class="text-xs font-mono text-slate-400 group-hover:text-white transition-colors">/api/push_subscribe.php</span>
                            </div>
                            <h4 class="font-bold text-xs text-white mt-2 font-poppins">Abonnement Notifications Push</h4>
                            <p class="text-[11px] text-slate-400 mt-1">Enregistre l'appareil ou le jeton de notification dans <code class="text-emerald-400">push_subscriptions</code>.</p>
                        </div>

                    </div>

                    <!-- SQL File Download Link -->
                    <div class="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                        <h4 class="text-xs font-bold uppercase tracking-wider text-slate-300">Ressources MySQL à télécharger</h4>
                        <div class="flex gap-2">
                            <a href="/api/schema.sql" download="rotaract_ngozi_db.sql" class="flex-1 py-2.5 px-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs text-center transition-colors shadow-md shadow-brand-600/20">
                                📥 Fichier schema.sql
                            </a>
                            <a href="/api/config.php" download="config.php" class="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs text-center transition-colors">
                                ⚙️ config.php
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Right Column: Interactive Console & Response Output -->
                <div class="lg:col-span-7 space-y-4">
                    <div class="flex items-center justify-between">
                        <h3 class="font-poppins font-bold text-lg text-white flex items-center gap-2">
                            <span>💻</span> Console d'Exécution JSON
                        </h3>
                        <span id="responseStatus" class="text-xs font-mono px-2.5 py-1 rounded-full bg-slate-800 text-slate-400">
                            Prêt • Cliquez sur un endpoint
                        </span>
                    </div>

                    <!-- Code Viewer Screen -->
                    <div class="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
                        <div class="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <span class="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
                                <span class="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
                                <span class="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
                                <span id="activeEndpointLabel" class="ml-2 font-mono text-xs text-slate-400">Response Viewer</span>
                            </div>
                            <button onclick="copyResponseText()" class="text-[11px] font-mono text-brand-400 hover:underline">
                                Copier JSON
                            </button>
                        </div>
                        <pre id="jsonOutput" class="p-5 text-xs font-mono text-emerald-400 overflow-x-auto min-h-[320px] max-h-[480px] leading-relaxed">
// Cliquez sur un des boutons d'endpoint à gauche pour tester la réponse serveur PHP en temps réel.
{
  "info": "Portail API PHP Actif",
  "club": "Rotaract Ngozi Kugasaka",
  "district": "9150"
}
                        </pre>
                    </div>
                </div>
            </div>
        </main>

        <!-- Footer -->
        <footer class="border-t border-slate-800 py-6 bg-slate-950 text-center text-xs text-slate-500">
            Rotaract Club Ngozi Kugasaka (District 9150) • Province de Ngozi, Burundi • Backend PHP/MySQL v2.0
        </footer>
    </div>

    <script>
        async function runApiTest(endpoint, method, bodyData = null) {
            const output = document.getElementById('jsonOutput');
            const statusLabel = document.getElementById('responseStatus');
            const activeLabel = document.getElementById('activeEndpointLabel');

            activeLabel.innerText = `${method} ${endpoint}`;
            statusLabel.innerText = 'Exécution en cours... ⏳';
            statusLabel.className = 'text-xs font-mono px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30';
            output.innerText = '// Exécution de la requête HTTP...';

            try {
                const options = {
                    method: method,
                    headers: { 'Accept': 'application/json' }
                };
                if (bodyData) {
                    options.headers['Content-Type'] = 'application/json';
                    options.body = JSON.stringify(bodyData);
                }

                const response = await fetch(endpoint, options);
                const data = await response.json();

                statusLabel.innerText = `HTTP ${response.status} OK 🚀`;
                statusLabel.className = 'text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
                output.innerText = JSON.stringify(data, null, 2);
            } catch (err) {
                statusLabel.innerText = 'Erreur HTTP / Réseau ⚠️';
                statusLabel.className = 'text-xs font-mono px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30';
                output.innerText = JSON.stringify({
                    error: true,
                    message: "Impossible de joindre le script PHP ou le serveur MySQL n'est pas configuré sur cette machine.",
                    details: err.message,
                    tip: "Téléchargez schema.sql et config.php pour installer sur votre hébergement PHP (Apache/Nginx/cPanel)."
                }, null, 2);
            }
        }

        function testNewsletterForm() {
            const testEmail = 'test.membre' + Math.floor(Math.random() * 1000) + '@rotaract-ngozi.org';
            runApiTest('/api/subscribe_newsletter.php', 'POST', {
                email: testEmail,
                source: 'Test via Portail PHP'
            });
        }

        function copyResponseText() {
            const output = document.getElementById('jsonOutput').innerText;
            navigator.clipboard.writeText(output);
            alert('JSON copié dans le presse-papier !');
        }
    </script>
</body>
</html>
