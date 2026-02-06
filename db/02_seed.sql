
-- Insertamos socios
INSERT INTO members (name, email, member_type, joined_at) VALUES
('Ana López', 'ana@mail.com', 'student', '2023-01-10'),
('Carlos Ruiz', 'carlos@mail.com', 'teacher', '2022-08-05'),
('María Pérez', 'maria@mail.com', 'student', '2023-03-20');

-- Insertamos libros
INSERT INTO books (title, author, category, isbn) VALUES
('Clean Code', 'Robert Martin', 'Programming', '111'),
('Design Patterns', 'GoF', 'Programming', '222'),
('1984', 'George Orwell', 'Novel', '333');

-- Insertamos copias físicas de los libros
INSERT INTO copies (book_id, barcode, status) VALUES
(1, 'BC001', 'available'),
(1, 'BC002', 'loaned'),
(2, 'BC003', 'loaned'),
(3, 'BC004', 'available');

-- Insertamos préstamos
-- Uno activo (sin returned_at) y uno devuelto tarde
INSERT INTO loans (copy_id, member_id, loaned_at, due_at, returned_at) VALUES
(2, 1, '2024-12-01', '2024-12-10', NULL),
(3, 2, '2024-11-15', '2024-11-25', '2024-11-30');

-- Insertamos multas
-- Una pendiente y una ya pagada
INSERT INTO fines (loan_id, amount, paid_at) VALUES
(1, 50.00, NULL),
(2, 20.00, '2024-12-01');
