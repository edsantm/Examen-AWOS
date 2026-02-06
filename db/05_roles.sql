-- =====================================================
-- CREACIÓN DE ROLES Y SEGURIDAD
-- La aplicación NO se conecta como postgres
-- =====================================================

-- Eliminamos el rol si ya existe (para evitar errores)
DROP ROLE IF EXISTS app_user;

-- Creamos el rol de la aplicación
CREATE ROLE app_user
WITH LOGIN
PASSWORD 'app_password';

-- Quitamos permisos por defecto
REVOKE ALL ON SCHEMA public FROM app_user;
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM app_user;

-- Permitimos usar el esquema public
GRANT USAGE ON SCHEMA public TO app_user;

-- Permitimos SOLO SELECT sobre las VIEWS (no tablas)
GRANT SELECT ON
    vw_most_borrowed_books,
    vw_overdue_loans,
    vw_fines_summary,
    vw_member_activity,
    vw_inventory_health
TO app_user;
