DELIMITER $$

DROP PROCEDURE IF EXISTS sp_borrow_book $$
CREATE PROCEDURE sp_borrow_book (
  IN  p_user_id     BIGINT UNSIGNED,
  IN  p_book_id     BIGINT UNSIGNED,
  OUT p_checkout_id BIGINT UNSIGNED,
  OUT p_success     TINYINT,
  OUT p_message     VARCHAR(255)
)
BEGIN
  DECLARE v_avail   INT;
  DECLARE v_retired TINYINT DEFAULT 0;

  SET p_success = 0;
  SET p_message = '';
  SET p_checkout_id = NULL;

  proc: BEGIN
    START TRANSACTION;

    SELECT available_copies, is_retired
      INTO v_avail, v_retired
    FROM books
    WHERE id = p_book_id
    FOR UPDATE;

    IF v_retired = 1 THEN
      SET p_message = 'Book is retired.';
      ROLLBACK; LEAVE proc;
    END IF;

    IF v_avail IS NULL OR v_avail <= 0 THEN
      SET p_message = 'No available copies.';
      ROLLBACK; LEAVE proc;
    END IF;

    -- Insert: checkout_date defaulted by schema, status default 'borrowed'
    INSERT INTO checkouts(user_id, book_id, checkout_date, due_date, status, late)
    VALUES (p_user_id, p_book_id, NOW(), DATE_ADD(NOW(), INTERVAL 14 DAY), 'borrowed', 0);
    SET p_checkout_id = LAST_INSERT_ID();

    COMMIT;
    SET p_success = 1;
    SET p_message = 'Borrowed successfully.';
  END proc;
END $$

DELIMITER ;
