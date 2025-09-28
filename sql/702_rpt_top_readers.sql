-- 702_rpt_top_readers.sql
DROP PROCEDURE IF EXISTS sp_rpt_top_readers; /*<SPLIT>*/
DELIMITER $$

CREATE PROCEDURE sp_rpt_top_readers(
  IN p_from  DATETIME,
  IN p_to    DATETIME,
  IN p_limit INT
)
BEGIN
  IF p_limit IS NULL OR p_limit <= 0 THEN SET p_limit = 10; END IF;

  SELECT
    u.id,
    u.name,
    u.email,
    COUNT(c.id) AS checkout_count
  FROM checkouts c
  JOIN users u ON u.id = c.user_id
  WHERE (p_from IS NULL OR c.checkout_date >= p_from)
    AND (p_to   IS NULL OR c.checkout_date < DATE_ADD(p_to, INTERVAL 1 DAY))
  GROUP BY u.id
  ORDER BY checkout_count DESC, u.name ASC
  LIMIT p_limit;
END $$
DELIMITER ;
