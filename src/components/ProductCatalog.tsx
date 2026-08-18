"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { sortProducts } from "@/lib/products";
import { readStorage, writeStorage } from "@/lib/storage";
import { fetchProducts } from "@/services/productService";
import type { Product, ProductCategory, ProductSort } from "@/types/product";
import { Modal } from "./Modal";
import { ProductCard } from "./ProductCard";

type CategoryChoice = "All" | ProductCategory;
const categories: CategoryChoice[] = ["All", "Accessories", "Audio", "Computers", "Home"];

export function ProductCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryChoice>("All");
  const [sort, setSort] = useState<ProductSort>("featured");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [simulateError, setSimulateError] = useState(false);
  const [cartCount, setCartCount] = useState(() => readStorage("interview-cart-count", 0));
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  const loadProducts = useCallback(() => {
    const controller = new AbortController();

    fetchProducts({ signal: controller.signal, simulateError })
      .then((items) => {
        setProducts(items);
        setStatus("success");
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setStatus("error");
      });

    return () => controller.abort();
  }, [simulateError]);

  useEffect(() => loadProducts(), [loadProducts]);

  const visibleProducts = useMemo(() => {
    const normalizedQuery = debouncedQuery.trim().toLowerCase();
    const filtered = products.filter((product) => {
      const matchesQuery = !normalizedQuery || `${product.name} ${product.description}`.toLowerCase().includes(normalizedQuery);
      const matchesCategory = category === "All" || product.category === category;
      return matchesQuery && matchesCategory;
    });
    return sortProducts(filtered, sort);
  }, [products, debouncedQuery, category, sort]);

  function addToCart() {
    setCartCount((current) => {
      const next = current + 1;
      writeStorage("interview-cart-count", next);
      return next;
    });
  }

  function retryLoading() {
    setStatus("loading");
    loadProducts();
  }

  function toggleSimulatedError(shouldError: boolean) {
    setStatus("loading");
    setSimulateError(shouldError);
  }

  return (
    <section aria-labelledby="catalog-heading">
      <div className="catalog-heading">
        <div>
          <p className="eyebrow">Fake storefront</p>
          <h1 id="catalog-heading">Product catalog</h1>
          <p>Small examples, deliberate trade-offs, and plenty to improve.</p>
        </div>
        <div className="header-actions">
          <span aria-live="polite">Cart: {cartCount}</span>
          <button type="button" className="secondary" onClick={() => setIsHelpOpen(true)}>About this sandbox</button>
        </div>
      </div>

      <form className="filters" role="search" onSubmit={(event) => event.preventDefault()}>
        <label>
          Search
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products" />
        </label>
        <label>
          Category
          <select value={category} onChange={(event) => setCategory(event.target.value as CategoryChoice)}>
            {categories.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label>
          Sort
          <select value={sort} onChange={(event) => setSort(event.target.value as ProductSort)}>
            <option value="featured">Featured</option>
            <option value="name">Name</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
        </label>
      </form>

      <label className="error-toggle">
        <input type="checkbox" checked={simulateError} onChange={(event) => toggleSimulatedError(event.target.checked)} />
        Simulate API failure
      </label>

      {status === "loading" && <div className="status" role="status">Loading products…</div>}
      {status === "error" && (
        <div className="status" role="alert">
          <p>Products could not be loaded.</p>
          <button type="button" onClick={retryLoading}>Try again</button>
        </div>
      )}
      {status === "success" && visibleProducts.length === 0 && <div className="status">No products match those filters.</div>}
      {status === "success" && visibleProducts.length > 0 && (
        <div className="product-grid">
          {visibleProducts.map((product) => <ProductCard key={product.id} product={product} onAddToCart={addToCart} />)}
        </div>
      )}

      <Modal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} title="About this sandbox">
        <p>This intentionally small catalog is a starting point for the exercises in CHALLENGES.md.</p>
      </Modal>
    </section>
  );
}
