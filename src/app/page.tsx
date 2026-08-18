import { products } from "@/data/products";
import { ProductSearch } from "./ProductSearch";
import styles from "./page.module.css";

export default function Page() {
  return (
    <main className={styles.page}>
      <section className={styles.catalog} aria-labelledby="page-title">
        <header className={styles.header}>
          <p className={styles.eyebrow}>Taller Store</p>
          <h1 id="page-title">Find your next favorite product</h1>
          <p>Browse our collection or search by name, description, and category.</p>
        </header>

        <ProductSearch initialProducts={products} />
      </section>
    </main>
  );
}
