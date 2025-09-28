-- 405_sp_update_inventory.sql
DROP PROCEDURE IF EXISTS sp_update_inventory; /*<SPLIT>*/
DELIMITER $$

CREATE PROCEDURE sp_update_inventory(
  IN p_book_id  INT,            -- FIRST: book id
  IN p_delta    INT,            -- SECOND: +N / -N
  IN p_reason   VARCHAR(255),   -- THIRD: reason text
  IN p_staff_id INT             -- FOURTH: staff/admin user id (nullable)
)
BEGIN
  DECLARE v_copies INT;
  DECLARE v_avail  INT;

  -- Lock the book row
  SELECT copies, available_copies
    INTO v_copies, v_avail
  FROM books
  WHERE id = p_book_id
  FOR UPDATE;

  IF v_copies IS NULL THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Book not found';
  END IF;

  -- Adjust totals; keep within bounds
  SET v_copies = GREATEST(0, v_copies + p_delta);
  SET v_avail  = LEAST(v_copies, GREATEST(0, v_avail + p_delta));

  UPDATE books
     SET copies = v_copies,
         available_copies = v_avail
   WHERE id = p_book_id;

  -- Optional audit log
  INSERT INTO staff_logs(staff_id, book_id, action, delta, reason, created_at)
  VALUES (p_staff_id, p_book_id, 'inventory_adjust', p_delta, p_reason, NOW());
END $$

DELIMITER ;
