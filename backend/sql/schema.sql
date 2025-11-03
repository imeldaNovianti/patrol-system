CREATE DATABASE IF NOT EXISTS patrol_db CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE patrol_db;

CREATE TABLE users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  fullname VARCHAR(150) NOT NULL,
  role ENUM('EHS','Leader','Supervisor','Admin') NOT NULL DEFAULT 'Leader',
  department VARCHAR(100),
  status ENUM('active','inactive') DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE reports (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  report_code VARCHAR(50) NOT NULL UNIQUE,
  tanggal_patrol DATE NOT NULL,
  area VARCHAR(200),
  plant VARCHAR(100),
  no_dokumen VARCHAR(50),
  no_revisi VARCHAR(50),
  tanggal_rilis DATE,
  pic VARCHAR(150),
  total_rank_a INT DEFAULT 0,
  total_rank_b INT DEFAULT 0,
  total_rank_c INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_reports_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE patrol_items (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  report_id INT UNSIGNED NOT NULL,
  item_no INT,
  problem TEXT NOT NULL,
  before_desc TEXT,
  actual TEXT,
  standard TEXT,
  control_point VARCHAR(200),
  kategori_4m SET('Man','Machine','Material','Method'),
  root_cause TEXT,
  kaizen TEXT,
  kaizen_category ENUM('Eliminasi','Substitusi','Modifikasi','APD','Admin'),
  progress ENUM('Before','After'),
  after_desc TEXT,
  tingkat_keparahan INT,
  frekuensi INT,
  kemungkinan INT,
  score INT,
  rank CHAR(1),
  action_taken VARCHAR(200),
  tanggal_perbaikan DATE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_items_report FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE attachments (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  report_id INT UNSIGNED,
  item_id INT UNSIGNED,
  type ENUM('before','after'),
  filename VARCHAR(255),
  filepath VARCHAR(255),
  uploaded_by INT UNSIGNED,
  uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_attachments_report FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_attachments_item FOREIGN KEY (item_id) REFERENCES patrol_items(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_attachments_user FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE scores_summary (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  report_id INT UNSIGNED,
  tanggal DATE,
  rank_a INT DEFAULT 0,
  rank_b INT DEFAULT 0,
  rank_c INT DEFAULT 0,
  total_score INT DEFAULT 0,
  CONSTRAINT fk_scores_report FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO users (username, password, fullname, role) VALUES
('imelda', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Imelda Novianti', 'Admin');
