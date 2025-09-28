-- 900_seed_sample.sql  (extended)
-- Fresh sample data: users, authors, ≈100 books, and book_author links.
-- NOTE: Running this multiple times without resetting will create duplicates.

INSERT INTO users (role, name, email, password_hash) VALUES
('reader','Reader One','reader1@example.com','$2a$10$Ri4DldISswwMGgCSYNIhg.wah8TJg44ErcG5WezlM8wWLqBI28uI.'),
('reader','Reader Two','reader2@example.com','$2a$10$Ri4DldISswwMGgCSYNIhg.wah8TJg44ErcG5WezlM8wWLqBI28uI.'),
('reader','Reader Three','reader3@example.com','$2a$10$Ri4DldISswwMGgCSYNIhg.wah8TJg44ErcG5WezlM8wWLqBI28uI.');

INSERT INTO authors (name) VALUES
('Agatha Christie'),
('Isaac Asimov'),
('George R.R. Martin'),
('Neil Gaiman'),
('Haruki Murakami'),
('Ursula K. Le Guin'),
('Jane Austen'),
('Mary Beard'),
('Tana French'),
('C. J. Date');

INSERT INTO books (title, genre, publisher, copies, available_copies, is_retired) VALUES
('The Silent Archive','Mystery','Penguin',5,5,0),
('Starlight Algorithms','Sci-Fi','Tor',6,6,0),
('Winds of Winterfell','Fantasy','HarperCollins',7,7,0),
('The Wandering Library','Fantasy','Random House',4,4,0),
('Chronicles of a Bookkeeper','Non-Fiction','OUP',5,5,0),
('Quantum Shelves','Sci-Fi','Tor',5,5,0),
('Romance of the Stacks','Romance','Penguin',8,8,0),
('History of Borrowed Time','History','OUP',6,6,0),
('The Last Checkout','Mystery','HarperCollins',5,5,0),
('Designing Databases','Non-Fiction','O''Reilly',9,9,0),
('Murder in the Margins','Mystery','Penguin',5,5,0),
('Robots on the Range','Sci-Fi','Tor',6,6,0),
('Songs of the North','Fantasy','HarperCollins',7,7,0),
('Dreams in the Stacks','Fantasy','Random House',4,4,0),
('Notes of a Night Reader','Non-Fiction','OUP',5,5,0),
('Hainish Lectures','Sci-Fi','Tor',5,5,0),
('Ballrooms & Bookmarks','Romance','Penguin',8,8,0),
('SPQR for Libraries','History','OUP',6,6,0),
('Dublin Shelf Mysteries','Mystery','HarperCollins',5,5,0),
('Relational Theory 101','Non-Fiction','O''Reilly',9,9,0);

INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b, authors a
WHERE a.name='Agatha Christie' AND b.title='The Silent Archive';
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b, authors a
WHERE a.name='Agatha Christie' AND b.title='Murder in the Margins';

INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b, authors a
WHERE a.name='Isaac Asimov' AND b.title='Starlight Algorithms';
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b, authors a
WHERE a.name='Isaac Asimov' AND b.title='Robots on the Range';

INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b, authors a
WHERE a.name='George R.R. Martin' AND b.title='Winds of Winterfell';
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b, authors a
WHERE a.name='George R.R. Martin' AND b.title='Songs of the North';

INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b, authors a
WHERE a.name='Neil Gaiman' AND b.title='The Wandering Library';
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b, authors a
WHERE a.name='Neil Gaiman' AND b.title='Dreams in the Stacks';

INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b, authors a
WHERE a.name='Haruki Murakami' AND b.title='Chronicles of a Bookkeeper';
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b, authors a
WHERE a.name='Haruki Murakami' AND b.title='Notes of a Night Reader';

INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b, authors a
WHERE a.name='Ursula K. Le Guin' AND b.title='Quantum Shelves';
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b, authors a
WHERE a.name='Ursula K. Le Guin' AND b.title='Hainish Lectures';

INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b, authors a
WHERE a.name='Jane Austen' AND b.title='Romance of the Stacks';
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b, authors a
WHERE a.name='Jane Austen' AND b.title='Ballrooms & Bookmarks';

INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b, authors a
WHERE a.name='Mary Beard' AND b.title='History of Borrowed Time';
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b, authors a
WHERE a.name='Mary Beard' AND b.title='SPQR for Libraries';

INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b, authors a
WHERE a.name='Tana French' AND b.title='The Last Checkout';
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b, authors a
WHERE a.name='Tana French' AND b.title='Dublin Shelf Mysteries';

INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b, authors a
WHERE a.name='C. J. Date' AND b.title='Designing Databases';
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b, authors a
WHERE a.name='C. J. Date' AND b.title='Relational Theory 101';


INSERT INTO authors (name) VALUES
('Ann Leckie'),
('Brandon Sanderson'),
('Terry Pratchett'),
('Philip K. Dick'),
('N. K. Jemisin'),
('Colson Whitehead'),
('Donna Tartt'),
('Elif Shafak'),
('Emily St. John Mandel'),
('Andy Weir'),
('Neil Stephenson'),
('Patrick Rothfuss'),
('Margaret Atwood'),
('Madeline Miller'),
('Kazuo Ishiguro'),
('Sally Rooney'),
('Rebecca Solnit'),
('Michael Lewis'),
('Andrew Ng'),
('Tim O''Reilly'),
('Martin Fowler'),
('Kent Beck'),
('Eric Evans'),
('Gene Kim'),
('Nicole Forsgren'),
('Kathy Sierra'),
('Robert C. Martin'),
('Julie Zhuo'),
('Kim Scott'),
('Ben Horowitz');


INSERT INTO books (title, genre, publisher, copies, available_copies, is_retired) VALUES
('Ancillary Justice','Sci-Fi','Orbit',6,6,0),
('Ancillary Sword','Sci-Fi','Orbit',6,6,0),
('Mistborn: The Final Empire','Fantasy','Tor',7,7,0),
('The Well of Ascension','Fantasy','Tor',7,7,0),
('Guards! Guards!','Fantasy','HarperCollins',6,6,0),
('Mort','Fantasy','HarperCollins',6,6,0),
('Do Androids Dream of Electric Sheep?','Sci-Fi','Vintage',5,5,0),
('Ubik','Sci-Fi','Vintage',5,5,0),
('The Fifth Season','Fantasy','Orbit',7,7,0),
('The Obelisk Gate','Fantasy','Orbit',7,7,0),
('The Underground Railroad','Historical','Doubleday',6,6,0),
('The Nickel Boys','Historical','Doubleday',6,6,0),
('The Goldfinch','Literary','Little, Brown',6,6,0),
('The Secret History','Literary','Vintage',6,6,0),
('10 Minutes 38 Seconds in This Strange World','Literary','Penguin',5,5,0),
('The Island of Missing Trees','Literary','Penguin',5,5,0),
('Station Eleven','Sci-Fi','Knopf',6,6,0),
('Sea of Tranquility','Sci-Fi','Knopf',6,6,0),
('The Martian','Sci-Fi','Crown',8,8,0),
('Project Hail Mary','Sci-Fi','Crown',8,8,0),
('Snow Crash','Sci-Fi','Bantam',6,6,0),
('Cryptonomicon','Thriller','Avon',6,6,0),
('The Name of the Wind','Fantasy','DAW',7,7,0),
('The Wise Man''s Fear','Fantasy','DAW',7,7,0),
('The Handmaid''s Tale','Dystopia','McClelland & Stewart',6,6,0),
('Oryx and Crake','Dystopia','McClelland & Stewart',6,6,0),
('Circe','Fantasy','Little, Brown',6,6,0),
('The Song of Achilles','Fantasy','Bloomsbury',6,6,0),
('Never Let Me Go','Literary','Faber & Faber',5,5,0),
('Klara and the Sun','Sci-Fi','Faber & Faber',5,5,0),
('Normal People','Literary','Faber & Faber',5,5,0),
('Conversations with Friends','Literary','Faber & Faber',5,5,0),
('Men Explain Things to Me','Non-Fiction','Haymarket',5,5,0),
('A Field Guide to Getting Lost','Non-Fiction','Penguin',5,5,0),
('The Big Short','Non-Fiction','W. W. Norton',6,6,0),
('Moneyball','Non-Fiction','W. W. Norton',6,6,0),
('Machine Learning Yearning','Non-Fiction','deeplearning.ai',5,5,0),
('Hands-On Machine Learning','Non-Fiction','O''Reilly',9,9,0),
('What Is the Future and Why It''s Up to Us','Non-Fiction','O''Reilly',6,6,0),
('The Lean Startup','Business','Crown',6,6,0),
('The Phoenix Project','Business','IT Revolution',6,6,0),
('Accelerate','Business','IT Revolution',6,6,0),
('The Pragmatic Programmer','Non-Fiction','Addison-Wesley',9,9,0),
('Refactoring','Non-Fiction','Addison-Wesley',9,9,0),
('Domain-Driven Design','Non-Fiction','Addison-Wesley',9,9,0),
('Continuous Delivery','Non-Fiction','Addison-Wesley',8,8,0),
('Clean Code','Non-Fiction','Prentice Hall',9,9,0),
('The Manager''s Path','Business','O''Reilly',6,6,0),
('Radical Candor','Business','St. Martin''s',6,6,0),
('The Hard Thing About Hard Things','Business','HarperBusiness',6,6,0),
('Trillion Dollar Coach','Business','HarperBusiness',6,6,0),
('The Culture Map','Business','PublicAffairs',6,6,0),
('Deep Work','Business','Grand Central',6,6,0),
('Atomic Habits','Business','Avery',6,6,0),
('Thinking, Fast and Slow','Non-Fiction','Farrar, Straus and Giroux',6,6,0),
('Sapiens','Non-Fiction','Harper',6,6,0),
('Homo Deus','Non-Fiction','Harper',6,6,0),
('Educated','Memoir','Random House',6,6,0),
('Becoming','Memoir','Crown',6,6,0),
('Bad Blood','Non-Fiction','Knopf',6,6,0),
('The Everything Store','Non-Fiction','Little, Brown',6,6,0),
('No Rules Rules','Business','Penguin',6,6,0),
('Lean In','Business','Knopf',6,6,0),
('The Ride of a Lifetime','Business','Random House',6,6,0),
('The Design of Everyday Things','Non-Fiction','Basic Books',9,9,0),
('Don''t Make Me Think','Non-Fiction','New Riders',9,9,0),
('Hooked','Business','Portfolio',6,6,0),
('Inspired','Business','Wiley',6,6,0),
('Measure What Matters','Business','Portfolio',6,6,0),
('Sprint','Business','Simon & Schuster',6,6,0),
('Creative Selection','Business','HarperBusiness',6,6,0),
('Building Microservices','Non-Fiction','O''Reilly',9,9,0),
('Release It!','Non-Fiction','Pragmatic Bookshelf',9,9,0),
('Site Reliability Engineering','Non-Fiction','O''Reilly',9,9,0),
('A Philosophy of Software Design','Non-Fiction','Yaknyam',9,9,0),
('Team Topologies','Business','IT Revolution',6,6,0),
('The Unicorn Project','Business','IT Revolution',6,6,0),
('The DevOps Handbook','Business','IT Revolution',6,6,0),
('Designing Data-Intensive Applications','Non-Fiction','O''Reilly',9,9,0),
('Grokking Algorithms','Non-Fiction','Manning',9,9,0),
('The Clean Coder','Non-Fiction','Prentice Hall',9,9,0),
('Soft Skills','Non-Fiction','Manning',9,9,0),
('Algorithms to Live By','Non-Fiction','Henry Holt',6,6,0),
('The Art of SQL','Non-Fiction','O''Reilly',9,9,0),
('Database Internals','Non-Fiction','O''Reilly',9,9,0),
('Kafka: The Definitive Guide','Non-Fiction','O''Reilly',9,9,0),
('Designing Event-Driven Systems','Non-Fiction','O''Reilly',9,9,0),
('Fundamentals of Software Architecture','Non-Fiction','O''Reilly',9,9,0),
('The Mythical Man-Month','Non-Fiction','Addison-Wesley',8,8,0),
('Peopleware','Non-Fiction','Dorset House',8,8,0);



-- Ann Leckie
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id
FROM books b, authors a
WHERE a.name='Ann Leckie' AND b.title='Ancillary Justice'
  AND NOT EXISTS (SELECT 1 FROM book_authors ba WHERE ba.book_id=b.id AND ba.author_id=a.id);

INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id
FROM books b, authors a
WHERE a.name='Ann Leckie' AND b.title='Ancillary Sword'
  AND NOT EXISTS (SELECT 1 FROM book_authors ba WHERE ba.book_id=b.id AND ba.author_id=a.id);

-- Brandon Sanderson
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id
FROM books b, authors a
WHERE a.name='Brandon Sanderson' AND b.title='Mistborn: The Final Empire'
  AND NOT EXISTS (SELECT 1 FROM book_authors ba WHERE ba.book_id=b.id AND ba.author_id=a.id);

INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id
FROM books b, authors a
WHERE a.name='Brandon Sanderson' AND b.title='The Well of Ascension'
  AND NOT EXISTS (SELECT 1 FROM book_authors ba WHERE ba.book_id=b.id AND ba.author_id=a.id);

-- Terry Pratchett
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id
FROM books b, authors a
WHERE a.name='Terry Pratchett' AND b.title='Guards! Guards!'
  AND NOT EXISTS (SELECT 1 FROM book_authors ba WHERE ba.book_id=b.id AND ba.author_id=a.id);

INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id
FROM books b, authors a
WHERE a.name='Terry Pratchett' AND b.title='Mort'
  AND NOT EXISTS (SELECT 1 FROM book_authors ba WHERE ba.book_id=b.id AND ba.author_id=a.id);

-- Philip K. Dick
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id
FROM books b, authors a
WHERE a.name='Philip K. Dick' AND b.title='Do Androids Dream of Electric Sheep?'
  AND NOT EXISTS (SELECT 1 FROM book_authors ba WHERE ba.book_id=b.id AND ba.author_id=a.id);

INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id
FROM books b, authors a
WHERE a.name='Philip K. Dick' AND b.title='Ubik'
  AND NOT EXISTS (SELECT 1 FROM book_authors ba WHERE ba.book_id=b.id AND ba.author_id=a.id);

-- N. K. Jemisin
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id
FROM books b, authors a
WHERE a.name='N. K. Jemisin' AND b.title='The Fifth Season'
  AND NOT EXISTS (SELECT 1 FROM book_authors ba WHERE ba.book_id=b.id AND ba.author_id=a.id);

INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id
FROM books b, authors a
WHERE a.name='N. K. Jemisin' AND b.title='The Obelisk Gate'
  AND NOT EXISTS (SELECT 1 FROM book_authors ba WHERE ba.book_id=b.id AND ba.author_id=a.id);

-- Colson Whitehead
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id
FROM books b, authors a
WHERE a.name='Colson Whitehead' AND b.title='The Underground Railroad'
  AND NOT EXISTS (SELECT 1 FROM book_authors ba WHERE ba.book_id=b.id AND ba.author_id=a.id);

INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id
FROM books b, authors a
WHERE a.name='Colson Whitehead' AND b.title='The Nickel Boys'
  AND NOT EXISTS (SELECT 1 FROM book_authors ba WHERE ba.book_id=b.id AND ba.author_id=a.id);

-- Donna Tartt
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id
FROM books b, authors a
WHERE a.name='Donna Tartt' AND b.title='The Goldfinch'
  AND NOT EXISTS (SELECT 1 FROM book_authors ba WHERE ba.book_id=b.id AND ba.author_id=a.id);

INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id
FROM books b, authors a
WHERE a.name='Donna Tartt' AND b.title='The Secret History'
  AND NOT EXISTS (SELECT 1 FROM book_authors ba WHERE ba.book_id=b.id AND ba.author_id=a.id);

-- Elif Shafak
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id
FROM books b, authors a
WHERE a.name='Elif Shafak' AND b.title='10 Minutes 38 Seconds in This Strange World'
  AND NOT EXISTS (SELECT 1 FROM book_authors ba WHERE ba.book_id=b.id AND ba.author_id=a.id);

INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id
FROM books b, authors a
WHERE a.name='Elif Shafak' AND b.title='The Island of Missing Trees'
  AND NOT EXISTS (SELECT 1 FROM book_authors ba WHERE ba.book_id=b.id AND ba.author_id=a.id);

-- Emily St. John Mandel
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id
FROM books b, authors a
WHERE a.name='Emily St. John Mandel' AND b.title='Station Eleven'
  AND NOT EXISTS (SELECT 1 FROM book_authors ba WHERE ba.book_id=b.id AND ba.author_id=a.id);

INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id
FROM books b, authors a
WHERE a.name='Emily St. John Mandel' AND b.title='Sea of Tranquility'
  AND NOT EXISTS (SELECT 1 FROM book_authors ba WHERE ba.book_id=b.id AND ba.author_id=a.id);

-- Andy Weir
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id
FROM books b, authors a
WHERE a.name='Andy Weir' AND b.title='The Martian'
  AND NOT EXISTS (SELECT 1 FROM book_authors ba WHERE ba.book_id=b.id AND ba.author_id=a.id);

INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id
FROM books b, authors a
WHERE a.name='Andy Weir' AND b.title='Project Hail Mary'
  AND NOT EXISTS (SELECT 1 FROM book_authors ba WHERE ba.book_id=b.id AND ba.author_id=a.id);

-- Neil Stephenson
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id
FROM books b, authors a
WHERE a.name='Neil Stephenson' AND b.title='Snow Crash'
  AND NOT EXISTS (SELECT 1 FROM book_authors ba WHERE ba.book_id=b.id AND ba.author_id=a.id);

INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id
FROM books b, authors a
WHERE a.name='Neil Stephenson' AND b.title='Cryptonomicon'
  AND NOT EXISTS (SELECT 1 FROM book_authors ba WHERE ba.book_id=b.id AND ba.author_id=a.id);

-- Patrick Rothfuss
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id
FROM books b, authors a
WHERE a.name='Patrick Rothfuss' AND b.title='The Name of the Wind'
  AND NOT EXISTS (SELECT 1 FROM book_authors ba WHERE ba.book_id=b.id AND ba.author_id=a.id);

INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id
FROM books b, authors a
WHERE a.name='Patrick Rothfuss' AND b.title='The Wise Man''s Fear'
  AND NOT EXISTS (SELECT 1 FROM book_authors ba WHERE ba.book_id=b.id AND ba.author_id=a.id);

-- Margaret Atwood
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id
FROM books b, authors a
WHERE a.name='Margaret Atwood' AND b.title='The Handmaid''s Tale'
  AND NOT EXISTS (SELECT 1 FROM book_authors ba WHERE ba.book_id=b.id AND ba.author_id=a.id);

INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id
FROM books b, authors a
WHERE a.name='Margaret Atwood' AND b.title='Oryx and Crake'
  AND NOT EXISTS (SELECT 1 FROM book_authors ba WHERE ba.book_id=b.id AND ba.author_id=a.id);

-- Madeline Miller
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id
FROM books b, authors a
WHERE a.name='Madeline Miller' AND b.title='Circe'
  AND NOT EXISTS (SELECT 1 FROM book_authors ba WHERE ba.book_id=b.id AND ba.author_id=a.id);

INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id
FROM books b, authors a
WHERE a.name='Madeline Miller' AND b.title='The Song of Achilles'
  AND NOT EXISTS (SELECT 1 FROM book_authors ba WHERE ba.book_id=b.id AND ba.author_id=a.id);

-- Kazuo Ishiguro
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id
FROM books b, authors a
WHERE a.name='Kazuo Ishiguro' AND b.title='Never Let Me Go'
  AND NOT EXISTS (SELECT 1 FROM book_authors ba WHERE ba.book_id=b.id AND ba.author_id=a.id);

INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id
FROM books b, authors a
WHERE a.name='Kazuo Ishiguro' AND b.title='Klara and the Sun'
  AND NOT EXISTS (SELECT 1 FROM book_authors ba WHERE ba.book_id=b.id AND ba.author_id=a.id);

-- Sally Rooney
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id
FROM books b, authors a
WHERE a.name='Sally Rooney' AND b.title='Normal People'
  AND NOT EXISTS (SELECT 1 FROM book_authors ba WHERE ba.book_id=b.id AND ba.author_id=a.id);

INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id
FROM books b, authors a
WHERE a.name='Sally Rooney' AND b.title='Conversations with Friends'
  AND NOT EXISTS (SELECT 1 FROM book_authors ba WHERE ba.book_id=b.id AND ba.author_id=a.id);

-- Rebecca Solnit
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id
FROM books b, authors a
WHERE a.name='Rebecca Solnit' AND b.title='Men Explain Things to Me'
  AND NOT EXISTS (SELECT 1 FROM book_authors ba WHERE ba.book_id=b.id AND ba.author_id=a.id);

INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id
FROM books b, authors a
WHERE a.name='Rebecca Solnit' AND b.title='A Field Guide to Getting Lost'
  AND NOT EXISTS (SELECT 1 FROM book_authors ba WHERE ba.book_id=b.id AND ba.author_id=a.id);

-- Michael Lewis
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id
FROM books b, authors a
WHERE a.name='Michael Lewis' AND b.title='The Big Short'
  AND NOT EXISTS (SELECT 1 FROM book_authors ba WHERE ba.book_id=b.id AND ba.author_id=a.id);

INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id
FROM books b, authors a
WHERE a.name='Michael Lewis' AND b.title='Moneyball'
  AND NOT EXISTS (SELECT 1 FROM book_authors ba WHERE ba.book_id=b.id AND ba.author_id=a.id);

-- Andrew Ng
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id
FROM books b, authors a
WHERE a.name='Andrew Ng' AND b.title='Machine Learning Yearning'
  AND NOT EXISTS (SELECT 1 FROM book_authors ba WHERE ba.book_id=b.id AND ba.author_id=a.id);

-- Tim O'Reilly
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id
FROM books b, authors a
WHERE a.name='Tim O''Reilly' AND b.title='What Is the Future and Why It''s Up to Us'
  AND NOT EXISTS (SELECT 1 FROM book_authors ba WHERE ba.book_id=b.id AND ba.author_id=a.id);

-- Gene Kim
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id
FROM books b, authors a
WHERE a.name='Gene Kim' AND b.title='The Phoenix Project'
  AND NOT EXISTS (SELECT 1 FROM book_authors ba WHERE ba.book_id=b.id AND ba.author_id=a.id);

INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id
FROM books b, authors a
WHERE a.name='Gene Kim' AND b.title='The Unicorn Project'
  AND NOT EXISTS (SELECT 1 FROM book_authors ba WHERE ba.book_id=b.id AND ba.author_id=a.id);

INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id
FROM books b, authors a
WHERE a.name='Gene Kim' AND b.title='The DevOps Handbook'
  AND NOT EXISTS (SELECT 1 FROM book_authors ba WHERE ba.book_id=b.id AND ba.author_id=a.id);

-- Nicole Forsgren
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id
FROM books b, authors a
WHERE a.name='Nicole Forsgren' AND b.title='Accelerate'
  AND NOT EXISTS (SELECT 1 FROM book_authors ba WHERE ba.book_id=b.id AND ba.author_id=a.id);

-- Martin Fowler
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id
FROM books b, authors a
WHERE a.name='Martin Fowler' AND b.title='Refactoring'
  AND NOT EXISTS (SELECT 1 FROM book_authors ba WHERE ba.book_id=b.id AND ba.author_id=a.id);

INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id
FROM books b, authors a
WHERE a.name='Martin Fowler' AND b.title='Continuous Delivery'
  AND NOT EXISTS (SELECT 1 FROM book_authors ba WHERE ba.book_id=b.id AND ba.author_id=a.id);

-- Kent Beck
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id
FROM books b, authors a
WHERE a.name='Kent Beck' AND b.title='The Clean Coder'
  AND NOT EXISTS (SELECT 1 FROM book_authors ba WHERE ba.book_id=b.id AND ba.author_id=a.id);

-- Eric Evans
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id
FROM books b, authors a
WHERE a.name='Eric Evans' AND b.title='Domain-Driven Design'
  AND NOT EXISTS (SELECT 1 FROM book_authors ba WHERE ba.book_id=b.id AND ba.author_id=a.id);

-- Robert C. Martin
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id
FROM books b, authors a
WHERE a.name='Robert C. Martin' AND b.title='Clean Code'
  AND NOT EXISTS (SELECT 1 FROM book_authors ba WHERE ba.book_id=b.id AND ba.author_id=a.id);

/* --- UTIL: helper to add an author then link a single-title book (idempotent) ---
   Usage pattern repeated inline below for clarity.
*/

/* A Philosophy of Software Design → John Ousterhout */
INSERT INTO authors (name) SELECT 'John Ousterhout'
WHERE NOT EXISTS (SELECT 1 FROM authors WHERE name='John Ousterhout');
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b JOIN authors a ON a.name='John Ousterhout'
WHERE b.title='A Philosophy of Software Design'
  AND NOT EXISTS (SELECT 1 FROM book_authors WHERE book_id=b.id AND author_id=a.id);

/* Algorithms to Live By → Brian Christian & Tom Griffiths */
INSERT INTO authors (name) SELECT 'Brian Christian'
WHERE NOT EXISTS (SELECT 1 FROM authors WHERE name='Brian Christian');
INSERT INTO authors (name) SELECT 'Tom Griffiths'
WHERE NOT EXISTS (SELECT 1 FROM authors WHERE name='Tom Griffiths');
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b JOIN authors a ON a.name='Brian Christian'
WHERE b.title='Algorithms to Live By'
  AND NOT EXISTS (SELECT 1 FROM book_authors WHERE book_id=b.id AND author_id=a.id);
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b JOIN authors a ON a.name='Tom Griffiths'
WHERE b.title='Algorithms to Live By'
  AND NOT EXISTS (SELECT 1 FROM book_authors WHERE book_id=b.id AND author_id=a.id);

/* Atomic Habits → James Clear */
INSERT INTO authors (name) SELECT 'James Clear'
WHERE NOT EXISTS (SELECT 1 FROM authors WHERE name='James Clear');
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b JOIN authors a ON a.name='James Clear'
WHERE b.title='Atomic Habits'
  AND NOT EXISTS (SELECT 1 FROM book_authors WHERE book_id=b.id AND author_id=a.id);

/* Bad Blood → John Carreyrou */
INSERT INTO authors (name) SELECT 'John Carreyrou'
WHERE NOT EXISTS (SELECT 1 FROM authors WHERE name='John Carreyrou');
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b JOIN authors a ON a.name='John Carreyrou'
WHERE b.title='Bad Blood'
  AND NOT EXISTS (SELECT 1 FROM book_authors WHERE book_id=b.id AND author_id=a.id);

/* Becoming → Michelle Obama */
INSERT INTO authors (name) SELECT 'Michelle Obama'
WHERE NOT EXISTS (SELECT 1 FROM authors WHERE name='Michelle Obama');
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b JOIN authors a ON a.name='Michelle Obama'
WHERE b.title='Becoming'
  AND NOT EXISTS (SELECT 1 FROM book_authors WHERE book_id=b.id AND author_id=a.id);

/* Building Microservices → Sam Newman */
INSERT INTO authors (name) SELECT 'Sam Newman'
WHERE NOT EXISTS (SELECT 1 FROM authors WHERE name='Sam Newman');
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b JOIN authors a ON a.name='Sam Newman'
WHERE b.title='Building Microservices'
  AND NOT EXISTS (SELECT 1 FROM book_authors WHERE book_id=b.id AND author_id=a.id);

/* The Design of Everyday Things → Don Norman */
INSERT INTO authors (name) SELECT 'Don Norman'
WHERE NOT EXISTS (SELECT 1 FROM authors WHERE name='Don Norman');
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b JOIN authors a ON a.name='Don Norman'
WHERE b.title='The Design of Everyday Things'
  AND NOT EXISTS (SELECT 1 FROM book_authors WHERE book_id=b.id AND author_id=a.id);

/* Don't Make Me Think → Steve Krug */
INSERT INTO authors (name) SELECT 'Steve Krug'
WHERE NOT EXISTS (SELECT 1 FROM authors WHERE name='Steve Krug');
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b JOIN authors a ON a.name='Steve Krug'
WHERE b.title='Don''t Make Me Think'
  AND NOT EXISTS (SELECT 1 FROM book_authors WHERE book_id=b.id AND author_id=a.id);

/* Hooked → Nir Eyal */
INSERT INTO authors (name) SELECT 'Nir Eyal'
WHERE NOT EXISTS (SELECT 1 FROM authors WHERE name='Nir Eyal');
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b JOIN authors a ON a.name='Nir Eyal'
WHERE b.title='Hooked'
  AND NOT EXISTS (SELECT 1 FROM book_authors WHERE book_id=b.id AND author_id=a.id);

/* Inspired → Marty Cagan */
INSERT INTO authors (name) SELECT 'Marty Cagan'
WHERE NOT EXISTS (SELECT 1 FROM authors WHERE name='Marty Cagan');
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b JOIN authors a ON a.name='Marty Cagan'
WHERE b.title='Inspired'
  AND NOT EXISTS (SELECT 1 FROM book_authors WHERE book_id=b.id AND author_id=a.id);

/* Measure What Matters → John Doerr */
INSERT INTO authors (name) SELECT 'John Doerr'
WHERE NOT EXISTS (SELECT 1 FROM authors WHERE name='John Doerr');
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b JOIN authors a ON a.name='John Doerr'
WHERE b.title='Measure What Matters'
  AND NOT EXISTS (SELECT 1 FROM book_authors WHERE book_id=b.id AND author_id=a.id);

/* Sprint → Jake Knapp (+ co-authors optional) */
INSERT INTO authors (name) SELECT 'Jake Knapp'
WHERE NOT EXISTS (SELECT 1 FROM authors WHERE name='Jake Knapp');
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b JOIN authors a ON a.name='Jake Knapp'
WHERE b.title='Sprint'
  AND NOT EXISTS (SELECT 1 FROM book_authors WHERE book_id=b.id AND author_id=a.id);

/* Creative Selection → Ken Kocienda */
INSERT INTO authors (name) SELECT 'Ken Kocienda'
WHERE NOT EXISTS (SELECT 1 FROM authors WHERE name='Ken Kocienda');
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b JOIN authors a ON a.name='Ken Kocienda'
WHERE b.title='Creative Selection'
  AND NOT EXISTS (SELECT 1 FROM book_authors WHERE book_id=b.id AND author_id=a.id);

/* Release It! → Michael T. Nygard */
INSERT INTO authors (name) SELECT 'Michael T. Nygard'
WHERE NOT EXISTS (SELECT 1 FROM authors WHERE name='Michael T. Nygard');
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b JOIN authors a ON a.name='Michael T. Nygard'
WHERE b.title='Release It!'
  AND NOT EXISTS (SELECT 1 FROM book_authors WHERE book_id=b.id AND author_id=a.id);

/* Site Reliability Engineering → Betsy Beyer (editor) */
INSERT INTO authors (name) SELECT 'Betsy Beyer'
WHERE NOT EXISTS (SELECT 1 FROM authors WHERE name='Betsy Beyer');
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b JOIN authors a ON a.name='Betsy Beyer'
WHERE b.title='Site Reliability Engineering'
  AND NOT EXISTS (SELECT 1 FROM book_authors WHERE book_id=b.id AND author_id=a.id);

/* Team Topologies → Matthew Skelton & Manuel Pais */
INSERT INTO authors (name) SELECT 'Matthew Skelton'
WHERE NOT EXISTS (SELECT 1 FROM authors WHERE name='Matthew Skelton');
INSERT INTO authors (name) SELECT 'Manuel Pais'
WHERE NOT EXISTS (SELECT 1 FROM authors WHERE name='Manuel Pais');
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b JOIN authors a ON a.name='Matthew Skelton'
WHERE b.title='Team Topologies'
  AND NOT EXISTS (SELECT 1 FROM book_authors WHERE book_id=b.id AND author_id=a.id);
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b JOIN authors a ON a.name='Manuel Pais'
WHERE b.title='Team Topologies'
  AND NOT EXISTS (SELECT 1 FROM book_authors WHERE book_id=b.id AND author_id=a.id);

/* Designing Data-Intensive Applications → Martin Kleppmann */
INSERT INTO authors (name) SELECT 'Martin Kleppmann'
WHERE NOT EXISTS (SELECT 1 FROM authors WHERE name='Martin Kleppmann');
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b JOIN authors a ON a.name='Martin Kleppmann'
WHERE b.title='Designing Data-Intensive Applications'
  AND NOT EXISTS (SELECT 1 FROM book_authors WHERE book_id=b.id AND author_id=a.id);

/* Grokking Algorithms → Aditya Bhargava */
INSERT INTO authors (name) SELECT 'Aditya Bhargava'
WHERE NOT EXISTS (SELECT 1 FROM authors WHERE name='Aditya Bhargava');
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b JOIN authors a ON a.name='Aditya Bhargava'
WHERE b.title='Grokking Algorithms'
  AND NOT EXISTS (SELECT 1 FROM book_authors WHERE book_id=b.id AND author_id=a.id);

/* The Clean Coder → Robert C. Martin  (fix incorrect link to Kent Beck) */
DELETE ba FROM book_authors ba
JOIN books b ON b.id=ba.book_id
JOIN authors a ON a.id=ba.author_id
WHERE b.title='The Clean Coder' AND a.name='Kent Beck';
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b JOIN authors a ON a.name='Robert C. Martin'
WHERE b.title='The Clean Coder'
  AND NOT EXISTS (SELECT 1 FROM book_authors WHERE book_id=b.id AND author_id=a.id);

/* Soft Skills → John Sonmez */
INSERT INTO authors (name) SELECT 'John Sonmez'
WHERE NOT EXISTS (SELECT 1 FROM authors WHERE name='John Sonmez');
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b JOIN authors a ON a.name='John Sonmez'
WHERE b.title='Soft Skills'
  AND NOT EXISTS (SELECT 1 FROM book_authors WHERE book_id=b.id AND author_id=a.id);

/* The Art of SQL → Stéphane Faroult */
INSERT INTO authors (name) SELECT 'Stéphane Faroult'
WHERE NOT EXISTS (SELECT 1 FROM authors WHERE name='Stéphane Faroult');
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b JOIN authors a ON a.name='Stéphane Faroult'
WHERE b.title='The Art of SQL'
  AND NOT EXISTS (SELECT 1 FROM book_authors WHERE book_id=b.id AND author_id=a.id);

/* Database Internals → Alex Petrov */
INSERT INTO authors (name) SELECT 'Alex Petrov'
WHERE NOT EXISTS (SELECT 1 FROM authors WHERE name='Alex Petrov');
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b JOIN authors a ON a.name='Alex Petrov'
WHERE b.title='Database Internals'
  AND NOT EXISTS (SELECT 1 FROM book_authors WHERE book_id=b.id AND author_id=a.id);

/* Kafka: The Definitive Guide → Neha Narkhede (lead author) */
INSERT INTO authors (name) SELECT 'Neha Narkhede'
WHERE NOT EXISTS (SELECT 1 FROM authors WHERE name='Neha Narkhede');
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b JOIN authors a ON a.name='Neha Narkhede'
WHERE b.title='Kafka: The Definitive Guide'
  AND NOT EXISTS (SELECT 1 FROM book_authors WHERE book_id=b.id AND author_id=a.id);

/* Designing Event-Driven Systems → Ben Stopford */
INSERT INTO authors (name) SELECT 'Ben Stopford'
WHERE NOT EXISTS (SELECT 1 FROM authors WHERE name='Ben Stopford');
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b JOIN authors a ON a.name='Ben Stopford'
WHERE b.title='Designing Event-Driven Systems'
  AND NOT EXISTS (SELECT 1 FROM book_authors WHERE book_id=b.id AND author_id=a.id);

/* Fundamentals of Software Architecture → Mark Richards & Neal Ford */
INSERT INTO authors (name) SELECT 'Mark Richards'
WHERE NOT EXISTS (SELECT 1 FROM authors WHERE name='Mark Richards');
INSERT INTO authors (name) SELECT 'Neal Ford'
WHERE NOT EXISTS (SELECT 1 FROM authors WHERE name='Neal Ford');
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b JOIN authors a ON a.name='Mark Richards'
WHERE b.title='Fundamentals of Software Architecture'
  AND NOT EXISTS (SELECT 1 FROM book_authors WHERE book_id=b.id AND author_id=a.id);
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b JOIN authors a ON a.name='Neal Ford'
WHERE b.title='Fundamentals of Software Architecture'
  AND NOT EXISTS (SELECT 1 FROM book_authors WHERE book_id=b.id AND author_id=a.id);

/* The Mythical Man-Month → Frederick P. Brooks Jr. */
INSERT INTO authors (name) SELECT 'Frederick P. Brooks Jr.'
WHERE NOT EXISTS (SELECT 1 FROM authors WHERE name='Frederick P. Brooks Jr.');
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b JOIN authors a ON a.name='Frederick P. Brooks Jr.'
WHERE b.title='The Mythical Man-Month'
  AND NOT EXISTS (SELECT 1 FROM book_authors WHERE book_id=b.id AND author_id=a.id);

/* Peopleware → Tom DeMarco & Timothy Lister */
INSERT INTO authors (name) SELECT 'Tom DeMarco'
WHERE NOT EXISTS (SELECT 1 FROM authors WHERE name='Tom DeMarco');
INSERT INTO authors (name) SELECT 'Timothy Lister'
WHERE NOT EXISTS (SELECT 1 FROM authors WHERE name='Timothy Lister');
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b JOIN authors a ON a.name='Tom DeMarco'
WHERE b.title='Peopleware'
  AND NOT EXISTS (SELECT 1 FROM book_authors WHERE book_id=b.id AND author_id=a.id);
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b JOIN authors a ON a.name='Timothy Lister'
WHERE b.title='Peopleware'
  AND NOT EXISTS (SELECT 1 FROM book_authors WHERE book_id=b.id AND author_id=a.id);

/* The Everything Store → Brad Stone */
INSERT INTO authors (name) SELECT 'Brad Stone'
WHERE NOT EXISTS (SELECT 1 FROM authors WHERE name='Brad Stone');
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b JOIN authors a ON a.name='Brad Stone'
WHERE b.title='The Everything Store'
  AND NOT EXISTS (SELECT 1 FROM book_authors WHERE book_id=b.id AND author_id=a.id);

/* No Rules Rules → Reed Hastings & Erin Meyer */
INSERT INTO authors (name) SELECT 'Reed Hastings'
WHERE NOT EXISTS (SELECT 1 FROM authors WHERE name='Reed Hastings');
INSERT INTO authors (name) SELECT 'Erin Meyer'
WHERE NOT EXISTS (SELECT 1 FROM authors WHERE name='Erin Meyer');
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b JOIN authors a ON a.name='Reed Hastings'
WHERE b.title='No Rules Rules'
  AND NOT EXISTS (SELECT 1 FROM book_authors WHERE book_id=b.id AND author_id=a.id);
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b JOIN authors a ON a.name='Erin Meyer'
WHERE b.title='No Rules Rules'
  AND NOT EXISTS (SELECT 1 FROM book_authors WHERE book_id=b.id AND author_id=a.id);

/* Lean In → Sheryl Sandberg */
INSERT INTO authors (name) SELECT 'Sheryl Sandberg'
WHERE NOT EXISTS (SELECT 1 FROM authors WHERE name='Sheryl Sandberg');
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b JOIN authors a ON a.name='Sheryl Sandberg'
WHERE b.title='Lean In'
  AND NOT EXISTS (SELECT 1 FROM book_authors WHERE book_id=b.id AND author_id=a.id);

/* The Ride of a Lifetime → Robert Iger */
INSERT INTO authors (name) SELECT 'Robert Iger'
WHERE NOT EXISTS (SELECT 1 FROM authors WHERE name='Robert Iger');
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b JOIN authors a ON a.name='Robert Iger'
WHERE b.title='The Ride of a Lifetime'
  AND NOT EXISTS (SELECT 1 FROM book_authors WHERE book_id=b.id AND author_id=a.id);

/* The Lean Startup → Eric Ries */
INSERT INTO authors (name) SELECT 'Eric Ries'
WHERE NOT EXISTS (SELECT 1 FROM authors WHERE name='Eric Ries');
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b JOIN authors a ON a.name='Eric Ries'
WHERE b.title='The Lean Startup'
  AND NOT EXISTS (SELECT 1 FROM book_authors WHERE book_id=b.id AND author_id=a.id);

/* The Pragmatic Programmer → Andrew Hunt & David Thomas */
INSERT INTO authors (name) SELECT 'Andrew Hunt'
WHERE NOT EXISTS (SELECT 1 FROM authors WHERE name='Andrew Hunt');
INSERT INTO authors (name) SELECT 'David Thomas'
WHERE NOT EXISTS (SELECT 1 FROM authors WHERE name='David Thomas');
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b JOIN authors a ON a.name='Andrew Hunt'
WHERE b.title='The Pragmatic Programmer'
  AND NOT EXISTS (SELECT 1 FROM book_authors WHERE book_id=b.id AND author_id=a.id);
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b JOIN authors a ON a.name='David Thomas'
WHERE b.title='The Pragmatic Programmer'
  AND NOT EXISTS (SELECT 1 FROM book_authors WHERE book_id=b.id AND author_id=a.id);

/* The Manager's Path → Camille Fournier (fix if any wrong link) */
INSERT INTO authors (name) SELECT 'Camille Fournier'
WHERE NOT EXISTS (SELECT 1 FROM authors WHERE name='Camille Fournier');
DELETE ba FROM book_authors ba
JOIN books b ON b.id=ba.book_id
JOIN authors a ON a.id=ba.author_id
WHERE b.title='The Manager''s Path' AND a.name<>'Camille Fournier';
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b JOIN authors a ON a.name='Camille Fournier'
WHERE b.title='The Manager''s Path'
  AND NOT EXISTS (SELECT 1 FROM book_authors WHERE book_id=b.id AND author_id=a.id);

/* Hands-On Machine Learning → Aurélien Géron */
INSERT INTO authors (name) SELECT 'Aurélien Géron'
WHERE NOT EXISTS (SELECT 1 FROM authors WHERE name='Aurélien Géron');
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b JOIN authors a ON a.name='Aurélien Géron'
WHERE b.title='Hands-On Machine Learning'
  AND NOT EXISTS (SELECT 1 FROM book_authors WHERE book_id=b.id AND author_id=a.id);

/* Trillion Dollar Coach → Eric Schmidt (lead, keep simple) */
INSERT INTO authors (name) SELECT 'Eric Schmidt'
WHERE NOT EXISTS (SELECT 1 FROM authors WHERE name='Eric Schmidt');
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b JOIN authors a ON a.name='Eric Schmidt'
WHERE b.title='Trillion Dollar Coach'
  AND NOT EXISTS (SELECT 1 FROM book_authors WHERE book_id=b.id AND author_id=a.id);

/* The Culture Map → Erin Meyer */
INSERT INTO authors (name) SELECT 'Erin Meyer'
WHERE NOT EXISTS (SELECT 1 FROM authors WHERE name='Erin Meyer');
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b JOIN authors a ON a.name='Erin Meyer'
WHERE b.title='The Culture Map'
  AND NOT EXISTS (SELECT 1 FROM book_authors WHERE book_id=b.id AND author_id=a.id);

/* Deep Work → Cal Newport */
INSERT INTO authors (name) SELECT 'Cal Newport'
WHERE NOT EXISTS (SELECT 1 FROM authors WHERE name='Cal Newport');
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b JOIN authors a ON a.name='Cal Newport'
WHERE b.title='Deep Work'
  AND NOT EXISTS (SELECT 1 FROM book_authors WHERE book_id=b.id AND author_id=a.id);

/* Thinking, Fast and Slow → Daniel Kahneman */
INSERT INTO authors (name) SELECT 'Daniel Kahneman'
WHERE NOT EXISTS (SELECT 1 FROM authors WHERE name='Daniel Kahneman');
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b JOIN authors a ON a.name='Daniel Kahneman'
WHERE b.title='Thinking, Fast and Slow'
  AND NOT EXISTS (SELECT 1 FROM book_authors WHERE book_id=b.id AND author_id=a.id);

/* Sapiens & Homo Deus → Yuval Noah Harari */
INSERT INTO authors (name) SELECT 'Yuval Noah Harari'
WHERE NOT EXISTS (SELECT 1 FROM authors WHERE name='Yuval Noah Harari');
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b JOIN authors a ON a.name='Yuval Noah Harari'
WHERE b.title IN ('Sapiens','Homo Deus')
  AND NOT EXISTS (SELECT 1 FROM book_authors WHERE book_id=b.id AND author_id=a.id);

/* Educated → Tara Westover */
INSERT INTO authors (name) SELECT 'Tara Westover'
WHERE NOT EXISTS (SELECT 1 FROM authors WHERE name='Tara Westover');
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b JOIN authors a ON a.name='Tara Westover'
WHERE b.title='Educated'
  AND NOT EXISTS (SELECT 1 FROM book_authors WHERE book_id=b.id AND author_id=a.id);

-- done
