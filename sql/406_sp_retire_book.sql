DELIMITER $$
DROP PROCEDURE IF EXISTS sp_retire_book $$
CREATE PROCEDURE sp_retire_book(IN p_staff_id BIGINT UNSIGNED, IN p_book_id BIGINT UNSIGNED, IN p_reason VARCHAR(255))
BEGIN
  START TRANSACTION;
  UPDATE books SET is_retired=1 WHERE id=p_book_id;
  INSERT INTO staff_logs(staff_id, action, book_id, payload)
  VALUES (p_staff_id, 'RETIRE_BOOK', p_book_id, JSON_OBJECT('reason', p_reason));
  COMMIT;
END $$
DELIMITER ;
