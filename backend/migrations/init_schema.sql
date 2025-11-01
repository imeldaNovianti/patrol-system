-- =======================================================
--  SISTEM LAPORAN SAFETY PATROL - STRUKTUR DATABASE
--  Dibuat untuk XAMPP (MySQL)
--  Dibuat oleh: ChatGPT & Imelda Novianti
-- =======================================================

-- 1. Buat database
CREATE DATABASE IF NOT EXISTS safety_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE safety_db;

-- =======================================================
-- 2. TABEL USERS (untuk login)
-- =======================================================
DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin','user') NOT NULL DEFAULT 'admin',
  full_name VARCHAR(150),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Masukkan user default (admin / admin123)
-- Password di-hash dengan PHP password_hash('admin123', PASSWORD_DEFAULT)
INSERT INTO users (username, password, role, full_name)
VALUES 
('admin', '$2y$10$6S1mToAvbS4EbnfqFsSKdOIvG3FjLljjvNwVb7Z2rwbKdyFYhbGmi', 'admin', 'Administrator');

-- =======================================================
-- 3. TABEL AREAS (lokasi / plant)
-- =======================================================
DROP TABLE IF EXISTS areas;
CREATE TABLE areas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,       -- Contoh: 'Plant 1', 'Warehouse'
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Data awal area
INSERT INTO areas (name, description) VALUES
('Plant 1', 'Area produksi utama'),
('Plant 2', 'Area perakitan'),
('Warehouse', 'Gudang penyimpanan bahan dan hasil produksi');

-- =======================================================
-- 4. TABEL PATROLS (inspeksi / patroli)
-- =======================================================
DROP TABLE IF EXISTS patrols;
CREATE TABLE patrols (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patrol_date DATE NOT NULL,        -- tanggal patroli
  area_id INT NOT NULL,             -- area yang diperiksa
  conducted_by VARCHAR(150),        -- nama petugas patroli
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (area_id) REFERENCES areas(id) ON DELETE RESTRICT
);

-- Contoh data patroli
INSERT INTO patrols (patrol_date, area_id, conducted_by, notes)
VALUES 
('2024-10-04', 1, 'Tim EHS', 'Patroli rutin area Plant 1');

-- =======================================================
-- 5. TABEL FINDINGS (temuan hasil patroli)
-- =======================================================
DROP TABLE IF EXISTS findings;
CREATE TABLE findings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patrol_id INT NULL,                -- link ke tabel patrols
  area_id INT NOT NULL,              -- area temuan
  title VARCHAR(255) NOT NULL,       -- judul singkat temuan
  actual_before TEXT,                -- kondisi sebelum perbaikan
  actual_after TEXT,                 -- kondisi sesudah perbaikan
  root_cause TEXT,                   -- akar penyebab
  four_m_set SET('Material','Machine','Man','Method') DEFAULT NULL, -- klasifikasi 4M
  control_point TEXT,                -- acuan / standar kontrol
  severity TINYINT UNSIGNED,         -- S (1-5)
  frequency TINYINT UNSIGNED,        -- F (1-5)
  probability TINYINT UNSIGNED,      -- P (1-5)
  score_before INT,                  -- hasil SxFxP
  rank_before ENUM('A','B','C') DEFAULT 'C', -- tingkat bahaya awal
  rank_after ENUM('A','B','C') DEFAULT NULL, -- tingkat bahaya sesudah perbaikan
  status ENUM('open','in_progress','closed') DEFAULT 'open',
  reported_by VARCHAR(150),
  reported_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  closed_by VARCHAR(150),
  closed_date DATETIME NULL,
  photo_path VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (area_id) REFERENCES areas(id) ON DELETE RESTRICT,
  FOREIGN KEY (patrol_id) REFERENCES patrols(id) ON DELETE SET NULL
);

-- Contoh data temuan awal
INSERT INTO findings 
(patrol_id, area_id, title, actual_before, root_cause, four_m_set, control_point, severity, frequency, probability, score_before, rank_before, reported_by)
VALUES
(1, 1, 'Kabel colokan tidak rapi', 'Kabel bekas mesin dibiarkan di lantai', 'Housekeeping belum dilakukan', 'Material,Method', 'SOP Housekeeping', 2, 3, 4, 24, 'B', 'Admin'),
(1, 1, 'Baut ankur menonjol di lantai', 'Baut di jalur pejalan kaki belum dipotong', 'Finishing area belum lengkap', 'Machine,Method', 'Standard Area Work', 2, 3, 3, 18, 'B', 'Admin'),
(1, 1, 'Perbedaan tinggi lantai tangga', 'Tinggi lantai tidak rata, bahaya tersandung', 'Desain akses tidak standar', 'Method', 'Standard Safety Access', 2, 2, 3, 12, 'C', 'Admin');

-- =======================================================
-- 6. TABEL KAIZEN_ACTIONS (tindakan perbaikan)
-- =======================================================
DROP TABLE IF EXISTS kaizen_actions;
CREATE TABLE kaizen_actions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  finding_id INT NOT NULL,                         -- temuan yang diperbaiki
  category ENUM('ELIMINASI','SUBSTITUSI','MODIFIKASI','APD','ADMIN') NOT NULL,
  action_description TEXT NOT NULL,                -- deskripsi tindakan
  pic VARCHAR(150),                                -- person in charge
  action_date DATE,
  verified_by VARCHAR(150),
  verified_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (finding_id) REFERENCES findings(id) ON DELETE CASCADE
);

-- Contoh data tindakan KAIZEN
INSERT INTO kaizen_actions 
(finding_id, category, action_description, pic, action_date, verified_by, verified_date, notes)
VALUES
(1, 'ELIMINASI', 'Kabel dicabut dan disimpan di area yang benar', 'Pak Zul', '2024-10-08', 'Bu Dhea', '2024-10-09', 'Aman dan rapi'),
(2, 'MODIFIKASI', 'Baut dipapas dan jalur diratakan', 'Pak Zul', '2024-10-08', 'Pak Iqbal', '2024-10-09', 'Tidak ada lagi risiko tersandung');
