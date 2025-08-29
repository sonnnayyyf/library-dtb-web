ALTER TABLE users
  ADD COLUMN password_hash VARCHAR(255) NULL AFTER email;

CREATE INDEX idx_users_email ON users(email);