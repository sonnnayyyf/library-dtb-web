
-- Inventory: decrement on borrow (new checkout)
DROP TRIGGER IF EXISTS trg_checkouts_ai; /*<SPLIT>*/
-- Inventory: increment on return (return_date set)
DROP TRIGGER IF EXISTS trg_checkouts_au_return; /*<SPLIT>*/
-- Rating: recompute on review insert
DROP TRIGGER IF EXISTS trg_reviews_ai; /*<SPLIT>*/
-- Rating: recompute on review update
DROP TRIGGER IF EXISTS trg_reviews_au; /*<SPLIT>*/
-- Rating: recompute on review delete
DROP TRIGGER IF EXISTS trg_reviews_ad; /*<SPLIT>*/

DELIMITER $$

/* Borrow: after a new checkout, reduce availability (only if not instantly returned) */
CREATE TRIGGER trg_checkouts_ai
AFTER INSERT ON checkouts
FOR EACH ROW
BEGIN
  IF NEW.return_date IS NULL THEN
    UPDATE books
       SET available_copies = GREATEST(0, available_copies - 1)
     WHERE id = NEW.book_id;
  END IF;
END $$

/* Return: when a checkout gets a return_date, increase availability */
CREATE TRIGGER trg_checkouts_au_return
AFTER UPDATE ON checkouts
FOR EACH ROW
BEGIN
  IF OLD.return_date IS NULL AND NEW.return_date IS NOT NULL THEN
    UPDATE books
       SET available_copies = LEAST(copies, available_copies + 1)
     WHERE id = NEW.book_id;
  END IF;
END $$

/* Rating maintenance: recompute avg_rating after INSERT */
CREATE TRIGGER trg_reviews_ai
AFTER INSERT ON reviews
FOR EACH ROW
BEGIN
  UPDATE books b
     SET avg_rating = (
       SELECT ROUND(AVG(r.rating), 2)
       FROM reviews r
       WHERE r.book_id = NEW.book_id
     )
   WHERE b.id = NEW.book_id;
END $$

/* Rating maintenance: recompute avg_rating after UPDATE */
CREATE TRIGGER trg_reviews_au
AFTER UPDATE ON reviews
FOR EACH ROW
BEGIN
  UPDATE books b
     SET avg_rating = (
       SELECT ROUND(AVG(r.rating), 2)
       FROM reviews r
       WHERE r.book_id = NEW.book_id
     )
   WHERE b.id = NEW.book_id;
END $$

/* Rating maintenance: recompute avg_rating after DELETE */
CREATE TRIGGER trg_reviews_ad
AFTER DELETE ON reviews
FOR EACH ROW
BEGIN
  UPDATE books b
     SET avg_rating = (
       SELECT ROUND(AVG(r.rating), 2)
       FROM reviews r
       WHERE r.book_id = OLD.book_id
     )
   WHERE b.id = OLD.book_id;
END $$

DELIMITER ;

ALTER TABLE books
  ADD COLUMN avg_rating DECIMAL(3,2) NULL AFTER available_copies;
