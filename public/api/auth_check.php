<?php
// MIDDLEWARE AUTH_CHECK.PHP - SÉCURISATION SERVEUR & VÉRIFICATION DES RÔLES
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/connect.php';

session_start();

$email = $_GET['email'] ?? $_POST['email'] ?? $_SESSION['user_email'] ?? '';
$requested_role = $_GET['role'] ?? $_POST['role'] ?? $_SESSION['user_role'] ?? '';

// Determine role based on email or parameter if not in session
if (empty($requested_role) && !empty($email)) {
    $email_clean = strtolower(trim($email));
    if (strpos($email_clean, 'president') !== false || strpos($email_clean, 'ngozikugasaka') !== false || strpos($email_clean, 'admin') !== false) {
        $requested_role = 'president';
    } elseif (strpos($email_clean, 'secretaire') !== false) {
        $requested_role = 'secretaire';
    } elseif (strpos($email_clean, 'tresorier') !== false) {
        $requested_role = 'tresorier';
    } elseif (strpos($email_clean, 'candidat') !== false || strpos($email_clean, 'visiteur') !== false) {
        $requested_role = 'candidat';
    } else {
        $requested_role = 'membre';
    }
}

if (empty($requested_role)) {
    $requested_role = 'visiteur';
}

$_SESSION['user_email'] = $email;
$_SESSION['user_role'] = $requested_role;

// Define authorized dashboard modules based on user_role
$role_dashboards = [
    'president' => [
        'role' => 'president',
        'title' => '👑 Direction & Présidence - Accès Complet',
        'dashboard_component' => 'presidentDashboardModal',
        'allowed_sections' => ['overview', 'activities', 'applications', 'registrations', 'mysql_export', 'espace_membre'],
        'permissions' => [
            'can_edit_site' => true,
            'can_approve_members' => true,
            'can_manage_finances' => true,
            'can_export_sql' => true,
            'can_publish_pv' => true,
        ]
    ],
    'secretaire' => [
        'role' => 'secretaire',
        'title' => '📜 Secrétariat Général & Communication',
        'dashboard_component' => 'secretaireDashboardModal',
        'allowed_sections' => ['secretaire_dashboard', 'content_sections', 'newsletter', 'messages', 'applications', 'espace_membre'],
        'permissions' => [
            'can_edit_site' => true,
            'can_approve_members' => false,
            'can_manage_finances' => false,
            'can_export_sql' => false,
            'can_publish_pv' => true,
        ]
    ],
    'tresorier' => [
        'role' => 'tresorier',
        'title' => '💰 Trésorerie & Finances du Club',
        'dashboard_component' => 'treasurer_dashboard',
        'allowed_sections' => ['treasurer_dashboard', 'registrations', 'mysql_export', 'espace_membre'],
        'permissions' => [
            'can_edit_site' => false,
            'can_approve_members' => false,
            'can_manage_finances' => true,
            'can_export_sql' => true,
            'can_publish_pv' => false,
        ]
    ],
    'membre' => [
        'role' => 'membre',
        'title' => '🌟 Espace Membre Actif Rotaractien',
        'dashboard_component' => 'membreactifDashboardModal',
        'allowed_sections' => ['espace_membre', 'registrations'],
        'permissions' => [
            'can_edit_site' => false,
            'can_approve_members' => false,
            'can_manage_finances' => false,
            'can_export_sql' => false,
            'can_publish_pv' => false,
        ]
    ],
    'candidat' => [
        'role' => 'candidat',
        'title' => '🎓 Portail Postulant & Visiteur',
        'dashboard_component' => 'visiterDashboardModal',
        'allowed_sections' => ['espace_visiteur', 'applications'],
        'permissions' => [
            'can_edit_site' => false,
            'can_approve_members' => false,
            'can_manage_finances' => false,
            'can_export_sql' => false,
            'can_publish_pv' => false,
        ]
    ]
];

$user_auth_config = $role_dashboards[$requested_role] ?? $role_dashboards['membre'];

echo json_encode([
    'status' => 'success',
    'authenticated' => true,
    'user_email' => $email,
    'user_role' => $requested_role,
    'auth_config' => $user_auth_config,
    'server_time' => date('Y-m-d H:i:s')
]);
exit();
