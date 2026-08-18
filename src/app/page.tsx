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

        <label className={styles.search}>
          <span className={styles.searchIcon} aria-hidden="true">⌕</span>
          <span className={styles.srOnly}>Search products</span>
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setStatus("loading");
              setErrorMessage("");
            }}
            placeholder="Search products"
          />
        </label>

        <div className={styles.results}>
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
              <h2>No products found</h2>
              <p>Try a different search term.</p>
            </div>
          )}

          {status === "success" && products.length > 0 && (
            <div className={styles.productGrid}>
              {products.map((product) => (
                <article className={styles.productCard} key={product.id}>
                  <div>
                    <p className={styles.category}>{product.category}</p>
                    <h2>{product.name}</h2>
                  </div>
                  <p>{product.description}</p>
                  <strong>{formatPrice(product.priceInCents)}</strong>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
