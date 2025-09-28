-- 703_rpt_low_availability.sql
DROP PROCEDURE IF EXISTS sp_rpt_low_availability; /*<SPLIT>*/
DELIMITER $$

CREATE PROCEDURE sp_rpt_low_availability(
  IN p_threshold INT,
  IN p_limit     INT
)
BEGIN
  IF p_threshold IS NULL OR p_threshold < 0 THEN SET p_threshold = 1; END IF;
  IF p_limit IS NULL OR p_limit <= 0 THEN SET p_limit = 50; END IF;

  SELECT
    b.id,
    b.title,
    b.genre,
    b.publisher,
    b.copies,
    b.available_copies,
    (b.copies - b.available_copies) AS out_count
  FROM books b
  WHERE b.is_retired = 0
    AND b.available_copies <= p_threshold
  ORDER BY b.available_copies ASC, b.title ASC
  LIMIT p_limit;
END $$
DELIMITER ;
