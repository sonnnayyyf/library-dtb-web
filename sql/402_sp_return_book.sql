DELIMITER $$

DROP PROCEDURE IF EXISTS sp_return_book $$ 
CREATE PROCEDURE sp_return_book (
  IN  p_user_id     BIGINT UNSIGNED,
  IN  p_checkout_id BIGINT UNSIGNED,
  OUT p_success     TINYINT,
  OUT p_message     VARCHAR(255)
)
BEGIN
  DECLARE v_book_id  BIGINT;
  DECLARE v_due      DATETIME;
  DECLARE v_returned DATETIME;

  SET p_success = 0;
  SET p_message = '';

  proc: BEGIN
    START TRANSACTION;

    SELECT book_id, due_date, return_date
      INTO v_book_id, v_due, v_returned
    FROM checkouts
    WHERE id = p_checkout_id AND user_id = p_user_id
    FOR UPDATE;

    IF v_book_id IS NULL THEN
      SET p_message = 'Checkout not found.';
      ROLLBACK; LEAVE proc;
    END IF;

    IF v_returned IS NOT NULL THEN
      SET p_message = 'Already returned.';
      ROLLBACK; LEAVE proc;
    END IF;

    UPDATE checkouts
       SET return_date = NOW(),
           status = 'returned',
           late = (NOW() > v_due)
     WHERE id = p_checkout_id;

    COMMIT;
    SET p_success = 1;
    SET p_message = 'Returned successfully.';
  END proc;
END $$

DELIMITER ;
