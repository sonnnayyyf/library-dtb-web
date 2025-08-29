-- 100_schema_tables.sql  (minimal books shape)

-- USERS
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  role ENUM('reader','staff','admin') NOT NULL DEFAULT 'reader',
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- BOOKS (minimal)
CREATE TABLE IF NOT EXISTS books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  genre VARCHAR(100) NULL,
  publisher VARCHAR(255) NULL,
  copies INT NOT NULL DEFAULT 0 CHECK (copies >= 0),
  available_copies INT NOT NULL DEFAULT 0 CHECK (available_copies >= 0),
  image_url TEXT NULL,
  is_retired TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_books_title (title),
  INDEX idx_books_genre (genre),
  INDEX idx_books_publisher (publisher),
  INDEX idx_books_retired (is_retired)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- CHECKOUTS
CREATE TABLE IF NOT EXISTS checkouts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  book_id INT NOT NULL,
  user_id INT NOT NULL,
  checkout_date DATETIME NOT NULL,
  due_date DATETIME NOT NULL,
  return_date DATETIME NULL,
  status ENUM('borrowed','returned','lost') NOT NULL DEFAULT 'borrowed',
  late TINYINT(1) NOT NULL DEFAULT 0,
  CONSTRAINT fk_checkouts_book FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
  CONSTRAINT fk_checkouts_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_checkouts_user (user_id),
  INDEX idx_checkouts_book (book_id),
  INDEX idx_checkouts_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- REVIEWS (one per user+book)
CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  book_id INT NOT NULL,
  user_id INT NOT NULL,
  rating TINYINT NOT NULL,
  comment TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_reviews_rating CHECK (rating BETWEEN 1 AND 5),
  CONSTRAINT fk_reviews_book FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
  CONSTRAINT fk_reviews_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uniq_reviews_user_book (user_id, book_id),
  INDEX idx_reviews_book (book_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- STAFF LOGS (for inventory adjustments)
CREATE TABLE IF NOT EXISTS staff_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  staff_id INT NULL,
  book_id INT NOT NULL,
  action VARCHAR(64) NOT NULL,
  delta INT NULL,
  reason VARCHAR(255) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_stafflogs_staff FOREIGN KEY (staff_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_stafflogs_book  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
  INDEX idx_stafflogs_book (book_id),
  INDEX idx_stafflogs_action (action)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
