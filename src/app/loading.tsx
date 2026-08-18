import { ProductGridSkeleton } from "./ProductGridSkeleton";
import styles from "./page.module.css";

export default function Loading() {
  return (
    <main className={styles.page}>
      <section className={styles.catalog} aria-busy="true">
        <p className={styles.srOnly} role="status">Loading products…</p>
        <ProductGridSkeleton />
      </section>
    </main>
  );
}
