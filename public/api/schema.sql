-- ==========================================================================
-- SCHEMA DE BASE DE DONNÉES MYSQL — ROTARACT CLUB NGOZI KUGASAKA
-- District 9150 • Province de Ngozi, République du Burundi
-- ==========================================================================

SET FOREIGN_KEY_CHECKS = 0;
CREATE DATABASE IF NOT EXISTS `rotaract_ngozi_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `rotaract_ngozi_db`;

-- 1. site_settings
CREATE TABLE IF NOT EXISTS `site_settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `club_name` VARCHAR(255) NOT NULL,
  `district` VARCHAR(100) NOT NULL,
  `primary_email` VARCHAR(255) NOT NULL,
  `primary_phone` VARCHAR(255) NOT NULL,
  `meeting_times` TEXT NOT NULL,
  `meeting_place` TEXT NOT NULL,
  `address` TEXT NOT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. news_articles
CREATE TABLE IF NOT EXISTS `news_articles` (
  `id` VARCHAR(100) PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `publication_date` VARCHAR(100) NOT NULL,
  `read_time` VARCHAR(50) NOT NULL,
  `image_url` TEXT NOT NULL,
  `summary` TEXT NOT NULL,
  `content` TEXT NOT NULL,
  `author` VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. newsletter_subscribers
CREATE TABLE IF NOT EXISTS `newsletter_subscribers` (
  `id` VARCHAR(100) PRIMARY KEY,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `subscribed_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `source` VARCHAR(100) DEFAULT 'Footer Site Web'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. membership_applications
CREATE TABLE IF NOT EXISTS `membership_applications` (
  `id` VARCHAR(100) PRIMARY KEY,
  `full_name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(100) NOT NULL,
  `age` VARCHAR(20) NOT NULL,
  `occupation` VARCHAR(255) NOT NULL,
  `interests` TEXT NOT NULL,
  `motivation` TEXT NOT NULL,
  `availability` VARCHAR(100) NOT NULL,
  `application_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `status` VARCHAR(50) DEFAULT 'En attente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. event_registrations
CREATE TABLE IF NOT EXISTS `event_registrations` (
  `id` VARCHAR(100) PRIMARY KEY,
  `event_id` VARCHAR(100) NOT NULL,
  `event_title` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(100) NOT NULL,
  `tickets` INT DEFAULT 1,
  `registration_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `status` VARCHAR(50) DEFAULT 'Confirmé'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. contact_messages
CREATE TABLE IF NOT EXISTS `contact_messages` (
  `id` VARCHAR(100) PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `subject` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `message_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `is_read` TINYINT(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. club_members (Rôles et membres du Rotaract)
CREATE TABLE IF NOT EXISTS `club_members` (
  `id` VARCHAR(100) PRIMARY KEY,
  `full_name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `role` VARCHAR(100) NOT NULL DEFAULT 'Membre Actif',
  `committee` VARCHAR(100) NOT NULL DEFAULT 'Action Jeunesse',
  `phone` VARCHAR(100) NOT NULL,
  `status` VARCHAR(50) DEFAULT 'Actif',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. email_logs (Historique des E-mails envoyés)
CREATE TABLE IF NOT EXISTS `email_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `recipient_email` VARCHAR(255) NOT NULL,
  `recipient_name` VARCHAR(255) NOT NULL,
  `subject` VARCHAR(255) NOT NULL,
  `template_type` VARCHAR(100) NOT NULL,
  `sent_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `status` VARCHAR(50) DEFAULT 'Envoyé (Simulation/PHP Mail)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. audit_logs (Traçabilité des actions critiques)
CREATE TABLE IF NOT EXISTS `audit_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_email` VARCHAR(255) NOT NULL,
  `user_role` VARCHAR(100) NOT NULL,
  `action_type` VARCHAR(100) NOT NULL,
  `description` TEXT NOT NULL,
  `ip_address` VARCHAR(100) DEFAULT '127.0.0.1',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. user_preferences (Thèmes et préférences utilisateurs)
CREATE TABLE IF NOT EXISTS `user_preferences` (
  `email` VARCHAR(255) PRIMARY KEY,
  `theme_preference` VARCHAR(20) DEFAULT 'light',
  `role` VARCHAR(100) DEFAULT 'membre',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertion de quelques membres types
INSERT INTO `club_members` (`id`, `full_name`, `email`, `role`, `committee`, `phone`, `status`) VALUES
('mem-1', 'Jean-Pierre Ndayishimiye', 'president@rotaractngozi.bi', 'Président / Bureau', 'Présidence', '+257 79 111 222', 'Actif'),
('mem-2', 'Marie-Claire Uwimana', 'secretaire@rotaractngozi.bi', 'Secrétaire & Comm\'', 'Communication', '+257 68 333 444', 'Actif'),
('mem-3', 'Patrick Habimana', 'tresorier@rotaractngozi.bi', 'Trésorier & Impact', 'Finance', '+257 79 555 666', 'Actif'),
('mem-4', 'Aline Nshimirimana', 'aline.nshimi@rotaractngozi.bi', 'Membre Actif', 'Action Sociale', '+257 79 777 888', 'Actif')
ON DUPLICATE KEY UPDATE `full_name` = VALUES(`full_name`);

SET FOREIGN_KEY_CHECKS = 1;
