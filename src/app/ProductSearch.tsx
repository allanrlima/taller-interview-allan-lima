"use client";

import { useEffect, useState } from "react";

import { ErrorState } from "@/components/ErrorState";
import { formatPrice } from "@/lib/products";
import type { Product } from "@/types/product";
import styles from "./page.module.css";

interface ProductSearchProps {
  initialProducts: Product[];
}

export function ProductSearch({ initialProducts }: ProductSearchProps) {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState(initialProducts);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [requestKey, setRequestKey] = useState(0);

  useEffect(() => {
    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      return;
    }

    const controller = new AbortController();

    const timeoutId = window.setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/products?q=${encodeURIComponent(normalizedQuery)}`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error(`Product request failed (${response.status})`);
        }

        const data = (await response.json()) as Product[];
        setProducts(data);
        setErrorMessage("");
        setIsRefreshing(false);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          console.error("Unable to load products", error);
          setErrorMessage("Unable to load products. Please try again.");
          setIsRefreshing(false);
        }
      }
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [initialProducts, query, requestKey]);

  return (
    <>
      <form
        className={styles.search}
        role="search"
        aria-label="Product search"
        onSubmit={(event) => event.preventDefault()}
      >
        <label htmlFor="product-search" className={styles.srOnly}>
          Search products
        </label>
        <span className={styles.searchIcon} aria-hidden="true">⌕</span>
        <input
          id="product-search"
          type="search"
          value={query}
          aria-controls="product-results"
          aria-describedby="search-help"
          onChange={(event) => {
            const nextQuery = event.target.value;
            setQuery(nextQuery);
            setErrorMessage("");

            if (nextQuery.trim()) {
              setIsRefreshing(true);
            } else {
              setProducts(initialProducts);
              setIsRefreshing(false);
            }
          }}
          placeholder="Search products"
          autoComplete="off"
        />
        <span id="search-help" className={styles.srOnly}>
          Search by product name, description, or category. Results update as
          you type.
        </span>
      </form>

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

        {errorMessage && (
          <ErrorState
            message={errorMessage}
            onRetry={() => {
              setIsRefreshing(true);
              setErrorMessage("");
              setRequestKey((key) => key + 1);
            }}
          />
        )}

        {products.length === 0 ? (
          <div className={styles.empty}>
            <h3>No products found</h3>
            <p>Try a different search term.</p>
          </div>
        ) : (
          <ul className={styles.productGrid}>
            {products.map((product) => (
              <li key={product.id}>
                <article
                  className={styles.productCard}
                  aria-labelledby={`${product.id}-name`}
                  aria-describedby={`${product.id}-description ${product.id}-price`}
                >
                  <div>
                    <p className={styles.category}>{product.category}</p>
                    <h3 id={`${product.id}-name`}>{product.name}</h3>
                  </div>
                  <p id={`${product.id}-description`}>{product.description}</p>
                  <strong id={`${product.id}-price`}>
                    {formatPrice(product.priceInCents)}
                  </strong>
                </article>
              </li>
            ))}
          </ul>
        )}

        {!isRefreshing && !errorMessage && (
          <p className={styles.srOnly} role="status" aria-live="polite" aria-atomic="true">
            {products.length === 0
              ? "No products found."
              : `${products.length} ${products.length === 1 ? "product" : "products"} found.`}
          </p>
        )}
      </section>
    </>
  );
}
