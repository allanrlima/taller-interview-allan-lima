import { ErrorState } from "@/components/ErrorState";
import type { Product } from "@/types/product";
import { ProductGridSkeleton } from "./ProductGridSkeleton";
import { VirtualizedProductGrid } from "./VirtualizedProductGrid";
import styles from "./page.module.css";

interface ProductResultsProps {
  products: Product[];
  isRefreshing: boolean;
  errorMessage: string;
  onRetry: () => void;
}

export function ProductResults({
  products,
  isRefreshing,
  errorMessage,
  onRetry,
}: ProductResultsProps) {
  return (
    <section
      id="product-results"
      className={styles.results}
      aria-labelledby="results-heading"
      aria-busy={isRefreshing}
    >
      <h2 id="results-heading" className={styles.srOnly}>Product results</h2>

      <div
        className={styles.refreshStatus}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {isRefreshing && (
          <>
            <span className={styles.spinner} aria-hidden="true" />
            Updating products…
          </>
        )}
      </div>

      {errorMessage && <ErrorState message={errorMessage} onRetry={onRetry} />}

      {isRefreshing && products.length === 0 ? (
        <ProductGridSkeleton />
      ) : products.length === 0 ? (
        <div className={styles.empty}>
          <h3>No products found</h3>
          <p>Try a different search term.</p>
        </div>
      ) : (
        <VirtualizedProductGrid products={products} />
      )}

      {!isRefreshing && !errorMessage && (
        <p className={styles.srOnly} role="status" aria-live="polite" aria-atomic="true">
          {products.length === 0
            ? "No products found."
            : `${products.length} ${products.length === 1 ? "product" : "products"} found.`}
        </p>
      )}
    </section>
  );
}
