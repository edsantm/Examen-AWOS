export const dynamic = "force-dynamic";

import { pool } from "@/lib/db";
import styles from './page.module.css';

type Row = {
  category: string;
  total_copies: number;
  available_copies: number;
  loaned_copies: number;
  lost_copies: number;
};

export default async function InventoryHealthPage() {
  const result = await pool.query<Row>(
    `SELECT category, total_copies, available_copies, loaned_copies, lost_copies
     FROM vw_inventory_health
     ORDER BY category`
  );

  const totalCopies = result.rows.reduce((acc, r) => acc + r.total_copies, 0);
  const totalAvailable = result.rows.reduce((acc, r) => acc + r.available_copies, 0);
  const totalLost = result.rows.reduce((acc, r) => acc + r.lost_copies, 0);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.badge}>Reporte de existencias</span>
        <h1 className={styles.title}>Salud del inventario</h1>
        <p className={styles.description}>
          Estado del inventario por categoría.
        </p>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <p className={styles.statLabel}>Total copias</p>
          <p className={styles.statValue}>{totalCopies}</p>
        </div>
        <div className={styles.stat}>
          <p className={styles.statLabel}>Disponibles</p>
          <p className={styles.statValue}>{totalAvailable}</p>
        </div>
        <div className={styles.stat}>
          <p className={styles.statLabel}>Perdidos</p>
          <p className={styles.statValue}>{totalLost}</p>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Categoría</th>
              <th>Total</th>
              <th>Disponibles</th>
              <th>Prestados</th>
              <th>Perdidos</th>
            </tr>
          </thead>
          <tbody>
            {result.rows.map((r, i) => (
              <tr key={i}>
                <td className={styles.bold}>
                  <span className={styles.tag}>{r.category}</span>
                </td>
                <td className={styles.number}>{r.total_copies}</td>
                <td className={styles.success}>{r.available_copies}</td>
                <td className={styles.number}>{r.loaned_copies}</td>
                <td className={r.lost_copies > 0 ? styles.warning : styles.muted}>
                  {r.lost_copies}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}