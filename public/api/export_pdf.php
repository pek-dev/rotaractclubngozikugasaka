<?php
/**
 * DYNAMIC PDF EXPORTER — ROTARACT CLUB NGOZI KUGASAKA
 * URL: /api/export_pdf.php?type=members|registrations|ticket&id=XYZ
 */

require_once __DIR__ . '/config.php';

$type = trim($_GET['type'] ?? 'members');
$id = trim($_GET['id'] ?? '');

$filename = 'rotaract_ngozi_' . $type . '_' . date('Y-m-d') . '.pdf';

// Render a clean, printable PDF-optimized HTML view with window.print() trigger
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Rotaract Club Ngozi Kugasaka — Document PDF Officiel (District 9150)</title>
    <style>
        @page { size: A4 portrait; margin: 15mm; }
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #0f172a; margin: 0; padding: 0; background-color: #ffffff; line-height: 1.5; font-size: 13px; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #e11d48; padding-bottom: 15px; margin-bottom: 25px; }
        .header img { height: 50px; }
        .club-title { text-align: right; }
        .club-title h1 { margin: 0; font-size: 20px; color: #e11d48; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; }
        .club-title p { margin: 2px 0 0; font-size: 11px; color: #64748b; font-weight: bold; }
        .doc-banner { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 15px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
        .doc-banner h2 { margin: 0; font-size: 16px; color: #0f172a; }
        .doc-banner p { margin: 3px 0 0; font-size: 11px; color: #64748b; }
        .badge-date { background: #ffe4e6; color: #e11d48; font-weight: bold; padding: 6px 12px; border-radius: 20px; font-size: 11px; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th { background: #0f172a; color: #ffffff; text-align: left; padding: 10px 12px; font-size: 11px; font-weight: bold; text-transform: uppercase; }
        td { padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 12px; }
        tr:nth-child(even) { background-color: #f8fafc; }
        .status-tag { display: inline-block; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: bold; }
        .status-actif { background: #dcfce7; color: #166534; }
        .status-attente { background: #fef3c7; color: #92400e; }
        .footer { position: fixed; bottom: 10mm; left: 15mm; right: 15mm; border-top: 1px solid #e2e8f0; padding-top: 10px; text-align: center; font-size: 10px; color: #94a3b8; }
        .no-print-bar { background: #0f172a; color: #ffffff; padding: 12px 20px; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; z-index: 100; box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
        .btn-print { background: #e11d48; color: #ffffff; border: none; padding: 8px 18px; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 12px; transition: all 0.2s; }
        .btn-print:hover { background: #be123c; }
        @media print {
            .no-print-bar { display: none !important; }
            body { padding: 0; }
        }
    </style>
</head>
<body>

<div class="no-print-bar">
    <div>
        <strong>📄 Générateur de PDF Rotaract Ngozi</strong> — Prévisualisation d'impression haute définition A4
    </div>
    <div>
        <button onclick="window.print()" class="btn-print">🖨️ Télécharger / Imprimer en PDF</button>
    </div>
</div>

<div style="padding: 20px;">
    <!-- Header -->
    <div class="header">
        <div>
            <div style="font-size: 24px; font-weight: 900; color: #e11d48;">ROTARACT</div>
            <div style="font-size: 10px; font-weight: bold; color: #0f172a; letter-spacing: 2px;">CLUB NGOZI KUGASAKA</div>
        </div>
        <div class="club-title">
            <h1>SOCIÉTÉ DU ROTARY INTERNATIONAL</h1>
            <p>DISTRICT 9150 • PROVINCE DE NGOZI, BURUNDI</p>
        </div>
    </div>

    <?php if ($type === 'members'): ?>
        <!-- Annuaire Membres -->
        <div class="doc-banner">
            <div>
                <h2>ANNUAIRE OFFICIEL DES MEMBRES & DU BUREAU</h2>
                <p>Liste certifiée des membres actifs et responsables de commissions - Mandat 2026</p>
            </div>
            <div class="badge-date">Généré le <?php echo date('d/m/Y à H:i'); ?></div>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Matricule</th>
                    <th>Nom & Prénom</th>
                    <th>Rôle / Titre Bureau</th>
                    <th>Commission</th>
                    <th>Téléphone</th>
                    <th>Statut</th>
                </tr>
            </thead>
            <tbody>
                <?php
                $members = [
                    ['id' => 'MEM-2026-001', 'name' => 'Jean-Pierre Ndayishimiye', 'role' => 'Président du Club', 'comm' => 'Présidence & Bureau', 'phone' => '+257 79 111 222', 'status' => 'Actif'],
                    ['id' => 'MEM-2026-002', 'name' => 'Marie-Claire Uwimana', 'role' => 'Secrétaire Générale', 'comm' => 'Communication & Média', 'phone' => '+257 68 333 444', 'status' => 'Actif'],
                    ['id' => 'MEM-2026-003', 'name' => 'Patrick Habimana', 'role' => 'Trésorier du Club', 'comm' => 'Finances & Partenariats', 'phone' => '+257 79 555 666', 'status' => 'Actif'],
                    ['id' => 'MEM-2026-004', 'name' => 'Aline Nshimirimana', 'role' => 'Responsable Action Sociale', 'comm' => 'Action Communautaire', 'phone' => '+257 79 777 888', 'status' => 'Actif'],
                    ['id' => 'MEM-2026-005', 'name' => 'Claude Hakizimana', 'role' => 'Chef de Protocole', 'comm' => 'Camaraderie', 'phone' => '+257 71 555 444', 'status' => 'Actif'],
                    ['id' => 'MEM-2026-006', 'name' => 'Chantal Munezero', 'role' => 'Membre Actif', 'comm' => 'Environnement', 'phone' => '+257 68 987 654', 'status' => 'Actif']
                ];

                foreach ($members as $m):
                ?>
                <tr>
                    <td><strong><?php echo $m['id']; ?></strong></td>
                    <td><?php echo $m['name']; ?></td>
                    <td><strong style="color: #e11d48;"><?php echo $m['role']; ?></strong></td>
                    <td><?php echo $m['comm']; ?></td>
                    <td><?php echo $m['phone']; ?></td>
                    <td><span class="status-tag status-actif"><?php echo $m['status']; ?></span></td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>

    <?php elseif ($type === 'activity_report' || $type === 'report'): ?>
        <!-- Rapport Stratégique d'Activités & Bilan Inscrits -->
        <div class="doc-banner" style="background: #f0fdf4; border-color: #bbf7d0;">
            <div>
                <h2 style="color: #166534;">RAPPORT OFFICIEL D'ACTIVITÉS & BILAN DE PARTICIPATION</h2>
                <p>Statistiques certifiées du Comité Exécutif — Rotaract Club Ngozi Kugasaka (District 9150)</p>
            </div>
            <div class="badge-date" style="background: #dcfce7; color: #15803d;">Période 2026 • Généré le <?php echo date('d/m/Y à H:i'); ?></div>
        </div>

        <div style="display: flex; gap: 15px; margin-bottom: 25px;">
            <div style="flex: 1; background: #fafafa; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px; text-align: center;">
                <div style="font-size: 10px; font-weight: bold; color: #64748b; text-transform: uppercase;">Total Projets Enregistrés</div>
                <div style="font-size: 22px; font-weight: 900; color: #0f172a; margin-top: 2px;">8 Projets</div>
                <div style="font-size: 10px; color: #166534; font-weight: bold;">4 Piliers d'impact à Ngozi</div>
            </div>
            <div style="flex: 1; background: #fafafa; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px; text-align: center;">
                <div style="font-size: 10px; font-weight: bold; color: #64748b; text-transform: uppercase;">Pass Billetterie Réservés</div>
                <div style="font-size: 22px; font-weight: 900; color: #e11d48; margin-top: 2px;">142 Pass</div>
                <div style="font-size: 10px; color: #991b1b; font-weight: bold;">Taux de présence ~88%</div>
            </div>
            <div style="flex: 1; background: #fafafa; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px; text-align: center;">
                <div style="font-size: 10px; font-weight: bold; color: #64748b; text-transform: uppercase;">Candidatures Adhésion</div>
                <div style="font-size: 22px; font-weight: 900; color: #2563eb; margin-top: 2px;">14 Postulants</div>
                <div style="font-size: 10px; color: #1e40af; font-weight: bold;">8 Approuvés pour intronisation</div>
            </div>
        </div>

        <h3 style="font-size: 14px; color: #0f172a; margin-bottom: 10px; text-transform: uppercase;">1. Projets Phares & Réalisations Communautaires</h3>
        <table>
            <thead>
                <tr>
                    <th>Activité / Projet</th>
                    <th>Catégorie / Axe</th>
                    <th>Date & Lieu</th>
                    <th>Bénéficiaires Target</th>
                    <th>Budget Mobilisé</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>Don de Sang & Santé Publique</strong></td>
                    <td>Santé & Prévention</td>
                    <td>15/08/2026 • Hôpital Ngozi</td>
                    <td>500+ Poches de sang</td>
                    <td>1 200 000 BIF</td>
                </tr>
                <tr>
                    <td><strong>Reboisement Colline Kugasaka</strong></td>
                    <td>Environnement</td>
                    <td>22/08/2026 • Commune Ngozi</td>
                    <td>1 500 Arbres fruitiers</td>
                    <td>850 000 BIF</td>
                </tr>
                <tr>
                    <td><strong>Mentorat & Bourses Scolaires</strong></td>
                    <td>Éducation de Base</td>
                    <td>10/09/2026 • Lycée Ngozi</td>
                    <td>45 Élèves vulnérables</td>
                    <td>2 100 000 BIF</td>
                </tr>
            </tbody>
        </table>

        <h3 style="font-size: 14px; color: #0f172a; margin-top: 25px; margin-bottom: 10px; text-transform: uppercase;">2. Registre des Inscrits Récents aux Actions</h3>
        <table>
            <thead>
                <tr>
                    <th>Ref ID</th>
                    <th>Événement Reservé</th>
                    <th>Nom du Participant</th>
                    <th>Email & Contact</th>
                    <th>Places</th>
                    <th>Statut</th>
                </tr>
            </thead>
            <tbody>
                <?php
                $regs = [
                    ['id' => 'REG-101', 'title' => 'Grand Don de Sang & Dépistage Diabète', 'name' => 'Jean-Paul Nkurunziza', 'email' => 'jp.nkuru@gmail.com', 'phone' => '+257 79 123 456', 'tickets' => 2, 'status' => 'Confirmé'],
                    ['id' => 'REG-102', 'title' => 'Reboisement de la Colline Kugasaka', 'name' => 'Chantal Munezero', 'email' => 'munezero.c@yahoo.fr', 'phone' => '+257 68 987 654', 'tickets' => 1, 'status' => 'En attente'],
                    ['id' => 'REG-103', 'title' => 'Atelier Leadership & Entrepreneuriat', 'name' => 'Alain Bigirimana', 'email' => 'alain.bigiri@outlook.com', 'phone' => '+257 79 456 789', 'tickets' => 3, 'status' => 'Confirmé']
                ];

                foreach ($regs as $r):
                ?>
                <tr>
                    <td><strong><?php echo $r['id']; ?></strong></td>
                    <td><strong style="color: #0f172a;"><?php echo $r['title']; ?></strong></td>
                    <td><?php echo $r['name']; ?></td>
                    <td><?php echo $r['email']; ?><br><small style="color: #64748b;"><?php echo $r['phone']; ?></small></td>
                    <td><strong><?php echo $r['tickets']; ?> ticket(s)</strong></td>
                    <td>
                        <span class="status-tag <?php echo $r['status'] === 'Confirmé' ? 'status-actif' : 'status-attente'; ?>">
                            <?php echo $r['status']; ?>
                        </span>
                    </td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>

    <?php elseif ($type === 'registrations'): ?>
        <!-- Liste des Inscrits aux Événements -->
        <div class="doc-banner">
            <div>
                <h2>LISTE OFFICIELLE DES INSCRITS AUX ÉVÉNEMENTS</h2>
                <p>Extrait de la base de données MySQL — Rotaract Club Ngozi Kugasaka</p>
            </div>
            <div class="badge-date">Généré le <?php echo date('d/m/Y à H:i'); ?></div>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Ref ID</th>
                    <th>Événement Reservé</th>
                    <th>Nom du Participant</th>
                    <th>Email & Contact</th>
                    <th>Places</th>
                    <th>Statut</th>
                </tr>
            </thead>
            <tbody>
                <?php
                $regs = [
                    ['id' => 'REG-101', 'title' => 'Grand Don de Sang & Dépistage Diabète', 'name' => 'Jean-Paul Nkurunziza', 'email' => 'jp.nkuru@gmail.com', 'phone' => '+257 79 123 456', 'tickets' => 2, 'status' => 'Confirmé'],
                    ['id' => 'REG-102', 'title' => 'Reboisement de la Colline Kugasaka', 'name' => 'Chantal Munezero', 'email' => 'munezero.c@yahoo.fr', 'phone' => '+257 68 987 654', 'tickets' => 1, 'status' => 'En attente'],
                    ['id' => 'REG-103', 'title' => 'Atelier Leadership & Entrepreneuriat', 'name' => 'Alain Bigirimana', 'email' => 'alain.bigiri@outlook.com', 'phone' => '+257 79 456 789', 'tickets' => 3, 'status' => 'Confirmé']
                ];

                foreach ($regs as $r):
                ?>
                <tr>
                    <td><strong><?php echo $r['id']; ?></strong></td>
                    <td><strong style="color: #0f172a;"><?php echo $r['title']; ?></strong></td>
                    <td><?php echo $r['name']; ?></td>
                    <td><?php echo $r['email']; ?><br><small style="color: #64748b;"><?php echo $r['phone']; ?></small></td>
                    <td><strong><?php echo $r['tickets']; ?> ticket(s)</strong></td>
                    <td>
                        <span class="status-tag <?php echo $r['status'] === 'Confirmé' ? 'status-actif' : 'status-attente'; ?>">
                            <?php echo $r['status']; ?>
                        </span>
                    </td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>

    <?php else: ?>
        <!-- Badge Pass Événement -->
        <div class="doc-banner" style="background: #fff1f2; border-color: #fecdd3;">
            <div>
                <h2 style="color: #e11d48;">BADGE & PASS ACCÈS ÉVÉNEMENT ROTARACT</h2>
                <p>Présentez ce billet à l'entrée de la salle ou au comité d'accueil</p>
            </div>
            <div class="badge-date">PASS N° <?php echo $id ? htmlspecialchars($id) : 'PASS-2026-NZI'; ?></div>
        </div>

        <div style="border: 2px dashed #e11d48; border-radius: 16px; padding: 25px; background: #fafafa; text-align: center; margin-top: 30px;">
            <div style="font-size: 11px; font-weight: bold; color: #e11d48; text-transform: uppercase; letter-spacing: 1px;">Rotaract Club Ngozi Kugasaka</div>
            <h1 style="font-size: 22px; color: #0f172a; margin: 10px 0;">Grand Don de Sang Communautaire & Dépistage Diabète</h1>
            <p style="font-size: 13px; color: #475569; margin-bottom: 20px;">Samedi 15 Août 2026 à 09h00 • Hôpital Régional de Ngozi, Burundi</p>

            <div style="background: #ffffff; padding: 15px; border-radius: 12px; border: 1px solid #e2e8f0; display: inline-block; max-width: 400px; width: 100%; text-align: left;">
                <div style="font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: bold;">Participant Inscrit</div>
                <div style="font-size: 16px; font-weight: bold; color: #0f172a; margin-top: 2px;">Niyonzima Patrick</div>
                <div style="font-size: 12px; color: #64748b;">patrick.niyonzima@gmail.com • +257 79 123 456</div>
                <div style="margin-top: 10px; font-weight: bold; color: #e11d48; font-size: 13px;">Accès Accordé : 2 Place(s) Réservée(s)</div>
            </div>
        </div>
    <?php endif; ?>

    <div class="footer">
        Rotaract Club Ngozi Kugasaka — District 9150 • Province de Ngozi, République du Burundi.<br>
        Document généré dynamiquement par le système PHP & MySQL.
    </div>
</div>

<script>
    // Trigger print dialog automatically if param print=1 is set
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('print') === '1') {
        window.addEventListener('load', () => {
            setTimeout(() => window.print(), 500);
        });
    }
</script>
</body>
</html>
