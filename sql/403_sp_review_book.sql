DELIMITER $$

DROP PROCEDURE IF EXISTS sp_review_book $$
CREATE PROCEDURE sp_review_book (
  IN  p_user_id BIGINT UNSIGNED,
  IN  p_book_id BIGINT UNSIGNED,
  IN  p_rating  TINYINT,
  IN  p_comment TEXT,
  OUT p_success TINYINT,
  OUT p_message VARCHAR(255)
)
BEGIN
  DECLARE v_cnt INT DEFAULT 0;

  SET p_success = 0;
  SET p_message = '';

  -- must have borrowed at least once
  SELECT COUNT(*) INTO v_cnt
    FROM checkouts
   WHERE user_id = p_user_id
     AND book_id = p_book_id;

  IF v_cnt = 0 THEN
    SET p_message = 'Borrow the book before reviewing.';
  ELSE
    INSERT INTO reviews (book_id, user_id, rating, comment, created_at)
    VALUES (p_book_id, p_user_id, LEAST(GREATEST(p_rating,1),5), p_comment, NOW())
    ON DUPLICATE KEY UPDATE
      rating     = VALUES(rating),
      comment    = VALUES(comment),
      created_at = NOW();

    SET p_success = 1;
    SET p_message = 'Review saved.';
  END IF;
END $$

DELIMITER ;
