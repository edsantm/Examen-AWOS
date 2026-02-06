import { pool } from "@/lib/db";
import { z } from "zod";
import styles from './page.module.css';

export const dynamic = "force-dynamic";

const querySchema = z.object({
  q: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(10).default(5),
});

export default async function MostBorrowedPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const { q, page, limit } = querySchema.parse(searchParams);
  const offset = (page - 1) * limit;

  const result = await pool.query(
    `
    SELECT *
    FROM vw_most_borrowed_books
    WHERE ($1::text IS NULL OR title ILIKE '%' || $1 || '%' OR author ILIKE '%' || $1 || '%')
    ORDER BY total_loans DESC
    LIMIT $2 OFFSET $3
  `,
    [q ?? null, limit, offset]
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.badge}>Reporte de demanda</span>
        <h1 className={styles.title}>Libros más prestados</h1>
        <p className={styles.description}>
          Ranking de libros con mayor número de préstamos.
        </p>
      </div>

      <form className={styles.searchForm}>
        <input
          type="text"
          name="q"
          placeholder="Buscar por título o autor"
          defaultValue={q}
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchButton}>Buscar</button>
      </form>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Título</th>
              <th>Autor</th>
              <th>Préstamos</th>
            </tr>
          </thead>
          <tbody>
            {result.rows.map((row) => (
              <tr key={row.book_id}>
                <td className={styles.rank}>{row.rank_position}</td>
                <td className={styles.bold}>{row.title}</td>
                <td>{row.author}</td>
                <td className={styles.number}>{row.total_loans}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.pagination}>
        {page > 1 && (
          <a href={`?q=${q ?? ""}&page=${page - 1}&limit=${limit}`} className={styles.paginationLink}>
            ← Anterior
          </a>
        )}
        <span className={styles.paginationInfo}>Página {page}</span>
        <a href={`?q=${q ?? ""}&page=${page + 1}&limit=${limit}`} className={styles.paginationLink}>
          Siguiente →
        </a>
      </div>
    </div>
  );
}
