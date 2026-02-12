# Dashboard de Reportes – Biblioteca

Proyecto académico desarrollado con Next.js, PostgreSQL y Docker Compose.
El objetivo es visualizar reportes SQL mediante VIEWS aplicando seguridad, paginación, filtros y buenas prácticas de arquitectura.

## Arquitectura

* Frontend: Next.js (App Router, Server Components)
* Base de datos: PostgreSQL 16
* Infraestructura: Docker Compose
* Acceso a datos: SELECT exclusivo sobre VIEWS
* Cliente de base de datos: pg (Node.js)

La aplicación no se conecta como postgres, sino mediante un usuario dedicado con permisos limitados.

---

## Base de Datos

### Tablas

* members
* books
* copies
* loans
* fines

Se utilizan relaciones FK reales para modelar préstamos y multas.

### Scripts incluidos en /db

* schema.sql – definición de tablas y relaciones
* seed.sql – datos iniciales
* migrate.sql – ajustes y migraciones
* reports_vw.sql – creación de vistas analíticas
* indexes.sql – índices para optimización
* roles.sql – creación de usuario y permisos

---

## VIEWS implementadas

* vw_most_borrowed_books
* vw_overdue_loans
* vw_fines_summary
* vw_member_activity
* vw_inventory_health

Cada VIEW incluye agregaciones, campos calculados, funciones analíticas y está documentada con comentarios y queries de verificación.

Se utilizan:

* COUNT y SUM con agregaciones
* RANK() OVER()
* CTE con WITH
* DATE_TRUNC
* CASE para cálculos condicionales
* Métricas derivadas como tasas y rankings

---

## Seguridad

Usuario de aplicación: app_user

Permisos:

* SELECT únicamente sobre VIEWS
* Sin acceso directo a tablas base

### Verificación

```sql
SET ROLE app_user;
SELECT * FROM vw_most_borrowed_books;
SELECT * FROM books; -- debe fallar
```

Esto garantiza separación entre capa analítica y datos operativos.

---

## Estructura del proyecto

```
/
├─ docker-compose.yml
├─ README.md
├─ .env
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
```

---

# Guía de Instalación y Ejecución

Esta sección describe el proceso completo para levantar el proyecto desde cero después de clonarlo.

---

## 1. Prerrequisitos

Tener instalado:

* Docker
* Docker Compose (incluido en Docker Desktop)
* Git

Verificar instalación:

```bash
docker --version
docker compose version
```

---

## 2. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd nombre-del-repositorio
```

---

## 3. Crear archivo de variables de entorno

En la raíz del proyecto crear un archivo llamado:

```
.env
```

Con el siguiente contenido:

```env
DB_USER=tu-usuario
DB_PASSWORD=tu-password
DB_NAME=tu-db
PUERTO_DB=puerto
DATABASE_URL=url-database 
```

Importante:

* El host debe ser db, ya que es el nombre del servicio definido en docker-compose.
* No utilizar localhost dentro de contenedores.

---

## 4. Construir y levantar los contenedores

Desde la raíz del proyecto ejecutar:

```bash
docker compose up --build
```

Este comando realiza automáticamente:

* Descarga de la imagen postgres:16
* Construcción de la imagen de la aplicación Next.js
* Creación de contenedores
* Inicialización automática de la base de datos
* Ejecución de todos los scripts dentro de /db
* Creación de tablas, datos semilla, índices, roles y views

---

## 5. Acceder a la aplicación

Abrir el navegador en:

```
http://localhost:3000
```

## Flujo resumido de ejecución

1. Clonar repositorio
2. Crear archivo .env
3. Ejecutar docker compose up --build
4. Acceder a http://localhost:3000

