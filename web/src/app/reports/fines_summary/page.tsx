export const dynamic = "force-dynamic";

import { pool } from "@/lib/db";
import styles from './page.module.css';

export default async function FinesSummaryPage() {
  const result = await pool.query(`
    SELECT * FROM vw_fines_summary
    ORDER BY month DESC
  `);

  const totalPaid = result.rows.reduce((acc, r) => acc + Number(r.total_paid), 0);
  const totalPending = result.rows.reduce((acc, r) => acc + Number(r.total_pending), 0);
  const totalFines = result.rows.reduce((acc, r) => acc + Number(r.total_fines), 0);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.badge}>Reporte financiero</span>
        <h1 className={styles.title}>Resumen de multas</h1>
        <p className={styles.description}>
          Análisis mensual de multas generadas, pagadas y pendientes.
        </p>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <p className={styles.statLabel}>Meses analizados</p>
          <p className={styles.statValue}>{result.rows.length}</p>
        </div>
        <div className={styles.stat}>
          <p className={styles.statLabel}>Total pagado</p>
          <p className={styles.statValue}>${totalPaid.toFixed(2)}</p>
        </div>
        <div className={styles.stat}>
          <p className={styles.statLabel}>Total pendiente</p>
          <p className={styles.statValue}>${totalPending.toFixed(2)}</p>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Mes</th>
              <th>Total</th>
              <th>Pagadas</th>
              <th>Pendientes</th>
            </tr>
          </thead>
          <tbody>
            {result.rows.map((row) => (
              <tr key={`${row.month}`}>
                <td className={styles.bold}>
                  {new Date(row.month).toLocaleDateString("es-MX", {
                    month: "long",
                    year: "numeric",
                  })}
                </td>
                <td className={styles.number}>${Number(row.total_fines).toFixed(2)}</td>
                <td className={styles.success}>${Number(row.total_paid).toFixed(2)}</td>
                <td className={styles.warning}>${Number(row.total_pending).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


