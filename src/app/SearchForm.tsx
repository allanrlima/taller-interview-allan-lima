"use client";

import { useEffect, useRef, useState } from "react";

import { useDebounce } from "@/hooks/useDebounce";
import styles from "./page.module.css";

interface SearchFormProps {
  onInput: () => void;
  onSearch: (query: string) => void;
}

export function SearchForm({ onInput, onSearch }: SearchFormProps) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const lastSubmittedQuery = useRef("");

  useEffect(() => {
    const normalizedQuery = debouncedQuery.trim();
    if (normalizedQuery === lastSubmittedQuery.current) return;

    lastSubmittedQuery.current = normalizedQuery;
    onSearch(normalizedQuery);
  }, [debouncedQuery, onSearch]);

  return (
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
          if (nextQuery.trim() !== debouncedQuery.trim()) {
            onInput();
          }
          setQuery(nextQuery);
        }}
        placeholder="Search products"
        autoComplete="off"
      />
      <span id="search-help" className={styles.srOnly}>
        Search by product name, description, or category. Results update as
        you type.
      </span>
    </form>
  );
}
