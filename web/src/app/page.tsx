import styles from './page.module.css';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.badge}>Panel principal</span>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.description}>
          Consulta y analiza la información clave de préstamos, socios, inventario y multas.
        </p>
      </div>

      <div className={styles.grid}>
        <DashboardCard
          title="Libros más prestados"
          description="Ranking de títulos con mayor demanda."
          href="/reports/most_borrowed"
          color="blue"
        />

        <DashboardCard
          title="Préstamos vencidos"
          description="Control de atrasos y multas."
          href="/reports/overdue_loans"
          color="red"
        />

        <DashboardCard
          title="Resumen de multas"
          description="Estado de pagos y pendientes."
          href="/reports/fines_summary"
          color="orange"
        />

        <DashboardCard
          title="Socios activos"
          description="Comportamiento y cumplimiento."
          href="/reports/member_activity"
          color="green"
        />

        <DashboardCard
          title="Inventario"
          description="Disponibilidad por categoría."
          href="/reports/inventory_health"
          color="purple"
        />
      </div>
    </div>
  );
}

function DashboardCard({ title, description, href, color }: any) {
  return (
    <Link href={href} className={`${styles.card} ${styles[color]}`}>
      <h2 className={styles.cardTitle}>{title}</h2>
      <p className={styles.cardDescription}>{description}</p>
      <span className={styles.cardLink}>Ver reporte →</span>
    </Link>
  );
}
