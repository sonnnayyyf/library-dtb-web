-- 701_rpt_most_borrowed_books.sql
DROP PROCEDURE IF EXISTS sp_rpt_most_borrowed_books; /*<SPLIT>*/
DELIMITER $$

CREATE PROCEDURE sp_rpt_most_borrowed_books(
  IN p_from  DATETIME,
  IN p_to    DATETIME,
  IN p_limit INT
)
BEGIN
  IF p_limit IS NULL OR p_limit <= 0 THEN SET p_limit = 10; END IF;

  SELECT
    b.id,
    b.title,
    GROUP_CONCAT(DISTINCT a.name ORDER BY a.name SEPARATOR ', ') AS authors,
    COUNT(c.id) AS borrow_count
  FROM checkouts c
  JOIN books b          ON b.id = c.book_id
  LEFT JOIN book_authors ba ON ba.book_id = b.id
  LEFT JOIN authors a       ON a.id = ba.author_id
  WHERE (p_from IS NULL OR c.checkout_date >= p_from)
    AND (p_to   IS NULL OR c.checkout_date < DATE_ADD(p_to, INTERVAL 1 DAY))
  GROUP BY b.id
  ORDER BY borrow_count DESC, b.title ASC
  LIMIT p_limit;
END $$
DELIMITER ;
