# Biblioteca – Dashboard de Reportes

Aplicación web desarrollada con **Next.js (TypeScript)** y **PostgreSQL** que permite visualizar reportes de una biblioteca a partir de **VIEWS SQL**, cumpliendo criterios de seguridad, rendimiento y despliegue con Docker Compose.


# Dashboard de Reportes – Biblioteca

Proyecto académico desarrollado con Next.js, PostgreSQL y Docker Compose.
El objetivo es visualizar reportes SQL mediante VIEWS aplicando seguridad,
paginación, filtros y buenas prácticas de arquitectura.

---

## Arquitectura

- **Frontend:** Next.js (App Router, Server Components)
- **Base de datos:** PostgreSQL
- **Infraestructura:** Docker Compose
- **Acceso a datos:** SELECT exclusivo sobre VIEWS

La aplicación **no se conecta como postgres**, sino mediante un usuario
dedicado con permisos limitados.

---

## Base de Datos

### Tablas
- members
- books
- copies
- loans
- fines

Se utilizan relaciones FK reales para modelar préstamos y multas.

### VIEWS
- vw_most_borrowed_books
- vw_overdue_loans
- vw_fines_summary
- vw_member_activity
- vw_inventory_health

Cada VIEW incluye agregaciones, campos calculados y está documentada
con comentarios y queries de verificación.

---

## Seguridad

- Usuario de aplicación: `app_user`
- Permisos:
  - SELECT únicamente sobre VIEWS
  - Sin acceso a tablas base

### Verificación
```sql
SET ROLE app_user;
SELECT * FROM vw_most_borrowed_books;
SELECT * FROM books; --debe fallar
```


## Estructura del proyecto

```text
/
├─ docker-compose.yml
├─ README.md
├─ db/
│  ├─ schema.sql
│  ├─ seed.sql
│  ├─ migrate.sql
│  ├─ reports_vw.sql
│  ├─ indexes.sql
│  └─ roles.sql
└─ web/
   └─ src/app/
      ├─ page.tsx
      └─ reports/
         ├─ most_borrowed
         ├─ overdue_loans
         ├─ fines_summary
         ├─ member_activity
         └─ inventory_health
