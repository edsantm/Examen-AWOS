import { Pool } from "pg";

// Pool de conexión (solo server-side)
export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});
