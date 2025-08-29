CREATE INDEX idx_books_title ON books (title);
CREATE INDEX idx_books_retired ON books (is_retired, available_copies);
CREATE INDEX idx_authors_name ON authors (name);
CREATE INDEX idx_ba_author ON book_authors (author_id);
CREATE INDEX idx_co_book_date ON checkouts (book_id, checkout_date);
CREATE INDEX idx_rev_book ON reviews (book_id);
