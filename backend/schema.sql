
CREATE DATABASE IF NOT EXISTS patrol_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE patrol_db;

CREATE TABLE users (
  user_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,         -- login identifier
  PASSWORD VARCHAR(255) NOT NULL,                -- bcrypt hash
  full_name VARCHAR(150) NOT NULL,
  ROLE ENUM('EHS','Leader','Supervisor','Admin') NOT NULL DEFAULT 'Leader',
  department VARCHAR(100),
  STATUS ENUM('active','inactive') DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE safety_patrol (
  patrol_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  patrol_date DATE NOT NULL,
  area_name VARCHAR(100) NOT NULL,
  inspector_id INT UNSIGNED NOT NULL,
  DESCRIPTION TEXT NOT NULL,
  category_4m ENUM('Material','Machine','Man','Method') NULL,
  rank_before ENUM('A','B','C') NOT NULL,
  rank_after ENUM('A','B','C','Safe') NULL,
  severity TINYINT NULL,
  frequency TINYINT NULL,
  probability TINYINT NULL,
  score_before INT NULL,
  score_after INT NULL,
  category_stop VARCHAR(20) NULL,
  kaizen_type ENUM('Eliminasi','Substitusi','Modifikasi','APD','Administrasi') NULL,
  root_cause TEXT NULL,
  action_taken TEXT NULL,
  action_pic INT UNSIGNED NULL,
  action_date DATE NULL,
  STATUS ENUM('open','in_progress','closed') DEFAULT 'open',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_patrol_inspector FOREIGN KEY (inspector_id)
    REFERENCES users(user_id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT fk_patrol_actionpic FOREIGN KEY (action_pic)
    REFERENCES users(user_id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  INDEX idx_patrol_date (patrol_date),
  INDEX idx_area_date (area_name, patrol_date),
  INDEX idx_status_rank (STATUS, rank_before)
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE rank_progress (
  progress_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  patrol_id INT UNSIGNED NOT NULL,
  old_rank ENUM('A','B','C') NOT NULL,
  new_rank ENUM('A','B','C','Safe') NOT NULL,
  change_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  changed_by INT UNSIGNED NULL,  --  boleh NULL karena ON DELETE SET NULL
  remarks TEXT,
  total_problem INT NULL,
  rank_a_total INT NULL,
  rank_b_total INT NULL,
  rank_c_total INT NULL,
  rank_down_count INT NULL,
  rank_down_percent DECIMAL(5,2) NULL,
  CONSTRAINT fk_progress_patrol FOREIGN KEY (patrol_id)
    REFERENCES safety_patrol(patrol_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_progress_user FOREIGN KEY (changed_by)
    REFERENCES users(user_id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  INDEX idx_change_date (change_date),
  INDEX idx_progress_patrol (patrol_id)
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE performance_summary (
  summary_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  total_problem INT NOT NULL DEFAULT 0,
  total_rank_down INT NOT NULL DEFAULT 0,
  total_rank_b INT NOT NULL DEFAULT 0,
  total_rank_c INT NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_by INT UNSIGNED NULL,
  CONSTRAINT fk_summary_by FOREIGN KEY (created_by)
    REFERENCES users(user_id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  UNIQUE KEY ux_period (period_start, period_end),
  INDEX idx_period (period_start, period_end)
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE attachments (
  attachment_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  patrol_id INT UNSIGNED NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(255) NOT NULL,
  file_type VARCHAR(50),
  uploaded_by INT UNSIGNED NULL,
  uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_attach_patrol FOREIGN KEY (patrol_id)
    REFERENCES safety_patrol(patrol_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_attach_user FOREIGN KEY (uploaded_by)
    REFERENCES users(user_id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  INDEX idx_attach_patrol (patrol_id)
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

