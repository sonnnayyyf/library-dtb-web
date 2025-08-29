DELIMITER $$
DROP PROCEDURE IF EXISTS sp_update_inventory $$
CREATE PROCEDURE sp_update_inventory(IN p_staff_id BIGINT UNSIGNED, IN p_book_id BIGINT UNSIGNED, IN p_delta INT, IN p_reason VARCHAR(255))
BEGIN
  DECLARE v_new_total INT; DECLARE v_new_avail INT;
  START TRANSACTION;
  SELECT total_copies + p_delta, available_copies + p_delta INTO v_new_total, v_new_avail
  FROM books WHERE id=p_book_id FOR UPDATE;
  IF v_new_total < 0 OR v_new_avail < 0 THEN ROLLBACK; SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Inventory cannot be negative'; END IF;
  UPDATE books SET total_copies=v_new_total, available_copies=v_new_avail WHERE id=p_book_id;
  INSERT INTO staff_logs(staff_id, action, book_id, payload)
  VALUES (p_staff_id, 'UPDATE_INVENTORY', p_book_id, JSON_OBJECT('delta', p_delta, 'reason', p_reason));
  COMMIT;
END $$
DELIMITER ;
