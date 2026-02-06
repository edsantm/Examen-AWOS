import { pool } from "@/lib/db";
import { z } from "zod";
import styles from './page.module.css';

export const dynamic = "force-dynamic";

const querySchema = z.object({
  min_days: z.coerce.number().min(1).default(1),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(10).default(5),
});

export default async function OverdueLoansPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const { min_days, page, limit } = querySchema.parse(searchParams);
  const offset = (page - 1) * limit;

  const result = await pool.query(
    `
    SELECT *
    FROM vw_overdue_loans
    WHERE days_overdue >= $1
    ORDER BY days_overdue DESC
    LIMIT $2 OFFSET $3
  `,
    [min_days, limit, offset]
  );

  const totalFines = result.rows.reduce((acc, r) => acc + Number(r.suggested_fine || 0), 0);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.badge}>Reporte de atrasos</span>
        <h1 className={styles.title}>Préstamos vencidos</h1>
        <p className={styles.description}>
          Préstamos con atraso y multa sugerida.
        </p>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <p className={styles.statLabel}>Total vencidos</p>
          <p className={styles.statValue}>{result.rows.length}</p>
        </div>
        <div className={styles.stat}>
          <p className={styles.statLabel}>Multas sugeridas</p>
          <p className={styles.statValue}>${totalFines.toFixed(2)}</p>
        </div>
      </div>

      <form className={styles.filterForm}>
        <label className={styles.filterLabel}>
          Mínimo de días de atraso
        </label>
        <input
          type="number"
          name="min_days"
          defaultValue={min_days}
          className={styles.filterInput}
        />
        <button type="submit" className={styles.filterButton}>Filtrar</button>
      </form>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Socio</th>
              <th>Libro</th>
              <th>Días atraso</th>
              <th>Multa</th>
            </tr>
          </thead>
          <tbody>
            {result.rows.map((row) => (
              <tr key={row.loan_id}>
                <td className={styles.bold}>{row.member_name}</td>
                <td>{row.book_title}</td>
                <td className={styles.warning}>{row.days_overdue}</td>
                <td className={styles.number}>${row.suggested_fine}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.pagination}>
        {page > 1 && (
          <a href={`?min_days=${min_days}&page=${page - 1}&limit=${limit}`} className={styles.paginationLink}>
            ← Anterior
          </a>
        )}
        <span className={styles.paginationInfo}>Página {page}</span>
        <a href={`?min_days=${min_days}&page=${page + 1}&limit=${limit}`} className={styles.paginationLink}>
          Siguiente →
        </a>
      </div>
    </div>
  );
}

