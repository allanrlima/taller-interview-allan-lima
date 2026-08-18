"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { Product } from "@/types/product";
import { ProductResults } from "./ProductResults";
import { SearchForm } from "./SearchForm";

interface ProductSearchProps {
  initialProducts: Product[];
}

const MAX_CACHED_QUERIES = 25;

export function ProductSearch({ initialProducts }: ProductSearchProps) {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState(initialProducts);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [requestKey, setRequestKey] = useState(0);
  const activeController = useRef<AbortController | null>(null);
  const productCache = useRef(new Map<string, Product[]>());

  const handleSearch = useCallback((nextQuery: string) => {
    setErrorMessage("");

    if (!nextQuery) {
      setQuery("");
      setProducts(initialProducts);
      setIsRefreshing(false);
      return;
    }

    setQuery(nextQuery);
    const cachedProducts = productCache.current.get(nextQuery);
    if (cachedProducts) {
      setProducts(cachedProducts);
      setIsRefreshing(false);
      return;
    }

    setIsRefreshing(true);
  }, [initialProducts]);

  const handleInput = useCallback(() => {
    activeController.current?.abort();
  }, []);

  const handleRetry = useCallback(() => {
    productCache.current.delete(query);
    setIsRefreshing(true);
    setErrorMessage("");
    setRequestKey((key) => key + 1);
  }, [query]);

  useEffect(() => {
    if (!query) return;

    const cachedProducts = productCache.current.get(query);
    if (cachedProducts) {
      setProducts(cachedProducts);
      setIsRefreshing(false);
      return;
    }

    const controller = new AbortController();
    activeController.current = controller;

    async function loadProducts() {
      try {
        const response = await fetch(
          `/api/products?q=${encodeURIComponent(query)}`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error(`Product request failed (${response.status})`);
        }

        const data = (await response.json()) as Product[];
        productCache.current.set(query, data);
        if (productCache.current.size > MAX_CACHED_QUERIES) {
          const oldestQuery = productCache.current.keys().next().value;
          if (oldestQuery !== undefined) productCache.current.delete(oldestQuery);
        }
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
    }

    void loadProducts();

    return () => {
      controller.abort();
      if (activeController.current === controller) {
        activeController.current = null;
      }
    };
  }, [query, requestKey]);

  return (
    <>
      <SearchForm onInput={handleInput} onSearch={handleSearch} />
      <ProductResults
        products={products}
        isRefreshing={isRefreshing}
        errorMessage={errorMessage}
        onRetry={handleRetry}
      />
    </>
  );
}
