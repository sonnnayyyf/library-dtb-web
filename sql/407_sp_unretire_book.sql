DROP PROCEDURE IF EXISTS sp_unretire_book; /*<SPLIT>*/
DELIMITER $$

CREATE PROCEDURE sp_unretire_book(
  IN p_book_id  INT,
  IN p_reason   VARCHAR(255),
  IN p_staff_id INT
)
BEGIN
  -- Flip the flag
  UPDATE books
     SET is_retired = 0
   WHERE id = p_book_id;

  -- Audit log (optional but recommended)
  INSERT INTO staff_logs(staff_id, book_id, action, delta, reason, created_at)
  VALUES (p_staff_id, p_book_id, 'unretire', NULL, p_reason, NOW());
END $$
DELIMITER ;
