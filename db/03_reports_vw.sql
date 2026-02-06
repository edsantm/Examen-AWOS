-- VIEW: vw_most_borrowed_books
-- Devuelve: Ranking de los libros más prestados en la biblioteca.
-- Grain: Una fila por libro.
-- Métricas:
--   - total_loans: número total de préstamos por libro
--   - rank_position: posición del libro en el ranking
-- VERIFY:
--   SELECT * FROM vw_most_borrowed_books LIMIT 5;
--   SELECT * FROM vw_most_borrowed_books WHERE title ILIKE '%SQL%';

CREATE OR REPLACE VIEW vw_most_borrowed_books AS
SELECT
    b.id AS book_id,
    b.title,
    b.author,
    COUNT(l.id) AS total_loans,
    RANK() OVER (ORDER BY COUNT(l.id) DESC) AS rank_position
FROM books b
JOIN copies c ON c.book_id = b.id
JOIN loans l ON l.copy_id = c.id
GROUP BY b.id, b.title, b.author;

-- VIEW: vw_overdue_loans
-- Devuelve: Préstamos vencidos con días de atraso y multa sugerida.
-- Grain: Una fila por préstamo vencido.
-- Métricas:
--   - days_overdue: días de atraso
--   - suggested_fine: multa calculada según días de atraso
-- VERIFY:
--   SELECT * FROM vw_overdue_loans;
--   SELECT * FROM vw_overdue_loans WHERE days_overdue > 5;

CREATE OR REPLACE VIEW vw_overdue_loans AS
WITH overdue AS (
    SELECT
        l.id AS loan_id,
        m.name AS member_name,
        b.title AS book_title,
        l.due_at,
        CURRENT_DATE - l.due_at AS days_overdue
    FROM loans l
    JOIN members m ON m.id = l.member_id
    JOIN copies c ON c.id = l.copy_id
    JOIN books b ON b.id = c.book_id
    WHERE l.returned_at IS NULL
      AND l.due_at < CURRENT_DATE
)
SELECT
    loan_id,
    member_name,
    book_title,
    days_overdue,
    CASE
        WHEN days_overdue <= 5 THEN days_overdue * 5
        ELSE days_overdue * 10
    END AS suggested_fine
FROM overdue;


-- VIEW: vw_fines_summary
-- Devuelve: Resumen mensual de multas pagadas y pendientes.
-- Grain: Una fila por mes.
-- Métricas:
--   - total_fines: número total de multas
--   - total_paid: monto total pagado
--   - total_pending: monto total pendiente
-- VERIFY:
--   SELECT * FROM vw_fines_summary;
--   SELECT * FROM vw_fines_summary WHERE total_pending > 0;

CREATE OR REPLACE VIEW vw_fines_summary AS
SELECT
    DATE_TRUNC('month', l.loaned_at) AS month,
    COUNT(f.id) AS total_fines,
    SUM(CASE WHEN f.paid_at IS NOT NULL THEN f.amount ELSE 0 END) AS total_paid,
    SUM(CASE WHEN f.paid_at IS NULL THEN f.amount ELSE 0 END) AS total_pending
FROM fines f
JOIN loans l ON l.id = f.loan_id
GROUP BY DATE_TRUNC('month', l.loaned_at)
HAVING COUNT(f.id) > 0;


-- VIEW: vw_member_activity
-- Devuelve: Actividad de socios y su tasa de atraso.
-- Grain: Una fila por socio.
-- Métricas:
--   - total_loans: número de préstamos realizados
--   - overdue_rate: proporción de préstamos vencidos
-- VERIFY:
--   SELECT * FROM vw_member_activity;
--   SELECT * FROM vw_member_activity WHERE overdue_rate > 0;

CREATE OR REPLACE VIEW vw_member_activity AS
SELECT
    m.id AS member_id,
    m.name,
    COUNT(l.id) AS total_loans,
    SUM(
        CASE
            WHEN l.returned_at IS NULL AND l.due_at < CURRENT_DATE THEN 1
            ELSE 0
        END
    ) * 1.0 / COUNT(l.id) AS overdue_rate
FROM members m
JOIN loans l ON l.member_id = m.id
GROUP BY m.id, m.name
HAVING COUNT(l.id) > 0;


-- VIEW: vw_inventory_health
-- Devuelve: Estado del inventario por categoría.
-- Grain: Una fila por categoría.
-- Métricas:
--   - available_copies: copias disponibles
--   - loaned_copies: copias prestadas
--   - lost_copies: copias perdidas
-- VERIFY:
--   SELECT * FROM vw_inventory_health;
--   SELECT * FROM vw_inventory_health WHERE available_copies = 0;

CREATE OR REPLACE VIEW vw_inventory_health AS
SELECT
    b.category,
    COUNT(*) AS total_copies,
    SUM(CASE WHEN c.status = 'available' THEN 1 ELSE 0 END) AS available_copies,
    SUM(CASE WHEN c.status = 'loaned' THEN 1 ELSE 0 END) AS loaned_copies,
    SUM(CASE WHEN c.status = 'lost' THEN 1 ELSE 0 END) AS lost_copies
FROM books b
JOIN copies c ON c.book_id = b.id
GROUP BY b.category;
