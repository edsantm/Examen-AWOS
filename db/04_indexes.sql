-- =====================================================
-- ÍNDICES PARA MEJORAR EL RENDIMIENTO DE LOS REPORTES
-- Estos índices están pensados específicamente
-- para las VIEWS que ya creamos
-- =====================================================

-- Índice para acelerar búsquedas por título y autor
-- Usado en vw_most_borrowed_books (filtro por title/author)
CREATE INDEX idx_books_title_author
ON books (title, author);

-- Índice para acelerar la detección de préstamos vencidos
-- Usado en vw_overdue_loans
CREATE INDEX idx_loans_due_returned
ON loans (due_at, returned_at);

-- Índice para acelerar joins entre loans y fines
-- Usado en vw_fines_summary
CREATE INDEX idx_fines_loan_id
ON fines (loan_id);

-- Índice para joins frecuentes entre copias y libros
-- Usado en inventario y ranking
CREATE INDEX idx_copies_book_id
ON copies (book_id);
