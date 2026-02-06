export const dynamic = "force-dynamic";

import { pool } from "@/lib/db";
import styles from './page.module.css';

type Row = {
  member_id: number;
  name: string;
  total_loans: number;
  overdue_rate: number;
};

export default async function MemberActivityPage() {
  const result = await pool.query<Row>(
    `SELECT member_id, name, total_loans, overdue_rate
     FROM vw_member_activity
     ORDER BY total_loans DESC`
  );

  const totalLoans = result.rows.reduce((acc, r) => acc + r.total_loans, 0);
  const avgOverdueRate = result.rows.reduce((acc, r) => acc + r.overdue_rate, 0) / result.rows.length;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.badge}>Reporte de participación</span>
        <h1 className={styles.title}>Actividad de socios</h1>
        <p className={styles.description}>
          Socios más activos y su tasa de atraso.
        </p>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <p className={styles.statLabel}>Total socios</p>
          <p className={styles.statValue}>{result.rowCount}</p>
        </div>
        <div className={styles.stat}>
          <p className={styles.statLabel}>Total préstamos</p>
          <p className={styles.statValue}>{totalLoans}</p>
        </div>
        <div className={styles.stat}>
          <p className={styles.statLabel}>Tasa atraso prom.</p>
          <p className={styles.statValue}>{(avgOverdueRate * 100).toFixed(1)}%</p>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Socio</th>
              <th>Préstamos</th>
              <th>Tasa atraso</th>
            </tr>
          </thead>
          <tbody>
            {result.rows.map((r) => (
              <tr key={r.member_id}>
                <td className={styles.bold}>{r.name}</td>
                <td className={styles.number}>{r.total_loans}</td>
                <td className={r.overdue_rate > 0.2 ? styles.warning : styles.success}>
                  {(r.overdue_rate * 100).toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}