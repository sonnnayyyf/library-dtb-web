DROP PROCEDURE IF EXISTS sp_retire_book; /*<SPLIT>*/
DELIMITER $$

CREATE PROCEDURE sp_retire_book(
  IN p_book_id  INT,
  IN p_reason   VARCHAR(255),
  IN p_staff_id INT
)
BEGIN
  -- Mark retired
  UPDATE books
     SET is_retired = 1
   WHERE id = p_book_id;

  -- Optional audit
  INSERT INTO staff_logs(staff_id, book_id, action, delta, reason, created_at)
  VALUES (p_staff_id, p_book_id, 'retire', NULL, p_reason, NOW());
END $$

DELIMITER ;
