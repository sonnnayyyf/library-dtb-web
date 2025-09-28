-- 404_sp_add_book.sql
DROP PROCEDURE IF EXISTS sp_add_book; /*<SPLIT>*/
DELIMITER $$

CREATE PROCEDURE sp_add_book (
  IN  p_title      VARCHAR(255),
  IN  p_genre      VARCHAR(100),
  IN  p_publisher  VARCHAR(255),
  IN  p_copies     INT,
  OUT p_book_id    BIGINT UNSIGNED
)
BEGIN
  IF p_copies IS NULL OR p_copies < 0 THEN
    SET p_copies = 0;
  END IF;

  INSERT INTO books (title, genre, publisher, copies, available_copies, is_retired)
  VALUES (p_title, p_genre, p_publisher, p_copies, p_copies, 0);

  SET p_book_id = LAST_INSERT_ID();
END $$

DELIMITER ;
