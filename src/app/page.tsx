"use client";

import { useEffect, useState } from "react";

import type { Product } from "@/types/product";

export default function ProductSearch() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [errorMessage, setErrorMessage] = useState("");

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
  }, [query]);

  return (
    <div>
      <input
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setStatus("loading");
          setErrorMessage("");
        }}
        placeholder="Search products"
      />

      {status === "loading" && <div role="status">Loading products…</div>}

      {status === "error" && <div role="alert">{errorMessage}</div>}

      {status === "success" && products.length === 0 && (
        <div>No products found</div>
      )}

      {status === "success" && products.length > 0 &&
        products.map((product) => (
          <div key={product.id}>
            <h3>{product.name}</h3>
            <span>${(product.priceInCents / 100).toFixed(2)}</span>
          </div>
        ))}
    </div>
  );
}
