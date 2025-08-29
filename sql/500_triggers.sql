DELIMITER $$

DROP TRIGGER IF EXISTS trg_checkout_after_insert $$
CREATE TRIGGER trg_checkout_after_insert
AFTER INSERT ON checkouts FOR EACH ROW
BEGIN
  IF NEW.status = 'borrowed' AND NEW.return_date IS NULL THEN
    UPDATE books SET available_copies = GREATEST(0, available_copies - 1)
     WHERE id = NEW.book_id;
  END IF;
END $$

DROP TRIGGER IF EXISTS trg_checkout_after_update_return $$
CREATE TRIGGER trg_checkout_after_update_return
AFTER UPDATE ON checkouts FOR EACH ROW
BEGIN
  IF OLD.return_date IS NULL AND NEW.return_date IS NOT NULL THEN
    UPDATE books SET available_copies = LEAST(copies, available_copies + 1)
     WHERE id = NEW.book_id;
  END IF;
END $$

DELIMITER ;
