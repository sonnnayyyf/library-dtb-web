-- No DELIMITER lines needed

DROP FUNCTION IF EXISTS fn_book_available;
CREATE FUNCTION fn_book_available(p_book_id BIGINT UNSIGNED)
RETURNS INT
DETERMINISTIC
READS SQL DATA
RETURN (
  SELECT IF(is_retired = 1, 0, IFNULL(available_copies, 0))
  FROM books
  WHERE id = p_book_id
);

DROP FUNCTION IF EXISTS fn_is_return_on_time;
CREATE FUNCTION fn_is_return_on_time(p_checkout_id BIGINT UNSIGNED)
RETURNS TINYINT
DETERMINISTIC
READS SQL DATA
RETURN (
  SELECT IF(return_date IS NULL, NULL, (return_date <= due_date))
  FROM checkouts
  WHERE id = p_checkout_id
);

DROP FUNCTION IF EXISTS fn_count_borrowed;
CREATE FUNCTION fn_count_borrowed(p_start DATETIME, p_end DATETIME)
RETURNS INT
DETERMINISTIC
READS SQL DATA
RETURN (
  SELECT COUNT(*)
  FROM checkouts
  WHERE checkout_date >= p_start AND checkout_date < p_end
);
