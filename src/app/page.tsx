"use client";

import { useEffect, useState } from "react";

import { ErrorState } from "@/components/ErrorState";
import { LoadingState } from "@/components/LoadingState";
import { formatPrice } from "@/lib/products";
import type { Product } from "@/types/product";
import styles from "./page.module.css";

export default function ProductSearch() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [requestKey, setRequestKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const timeoutId = window.setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/products?q=${encodeURIComponent(query)}`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error(`Product request failed (${response.status})`);
        }

        const data = (await response.json()) as Product[];
        setProducts(data);
        setStatus("success");
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          console.error("Unable to load products", error);
          setErrorMessage("Unable to load products. Please try again.");
          setStatus("error");
        }
      }
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [query, requestKey]);

  return (
    <main className={styles.page}>
      <section className={styles.catalog} aria-labelledby="page-title">
        <header className={styles.header}>
          <p className={styles.eyebrow}>Taller Store</p>
          <h1 id="page-title">Find your next favorite product</h1>
          <p>Browse our collection or search by name, description, and category.</p>
        </header>

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
              setQuery(event.target.value);
              setStatus("loading");
              setErrorMessage("");
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
          aria-busy={status === "loading"}
        >
          <h2 id="results-heading" className={styles.srOnly}>Product results</h2>

          {status === "loading" && <LoadingState message="Loading products…" />}

          {status === "error" && (
            <ErrorState
              message={errorMessage}
              onRetry={() => {
                setStatus("loading");
                setErrorMessage("");
                setRequestKey((key) => key + 1);
              }}
            />
          )}

          {status === "success" && products.length === 0 && (
            <div className={styles.empty}>
              <h3>No products found</h3>
              <p>Try a different search term.</p>
            </div>
          )}

          {status === "success" && products.length > 0 && (
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

          {status === "success" && (
            <p className={styles.srOnly} role="status" aria-live="polite" aria-atomic="true">
              {products.length === 0
                ? "No products found."
                : `${products.length} ${products.length === 1 ? "product" : "products"} found.`}
            </p>
          )}
        </section>
      </section>
    </main>
  );
}
