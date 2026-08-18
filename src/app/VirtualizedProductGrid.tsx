"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

import { formatPrice } from "@/lib/products";
import type { Product } from "@/types/product";
import styles from "./page.module.css";

const VIRTUALIZATION_THRESHOLD = 30;
const DEFAULT_VIEWPORT_WIDTH = 1088;
const DEFAULT_VIEWPORT_HEIGHT = 672;
const ROW_HEIGHT = 224;
const GRID_GAP = 20;
const OVERSCAN_ROWS = 2;

interface VirtualizedProductGridProps {
  products: Product[];
}

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  return (
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
  );
}

function StandardProductGrid({ products }: VirtualizedProductGridProps) {
  return (
    <ul className={styles.productGrid}>
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}

function getColumnCount(width: number) {
  if (width >= 896) return 3;
  if (width >= 640) return 2;
  return 1;
}

function WindowedProductGrid({ products }: VirtualizedProductGridProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const [viewport, setViewport] = useState({
    width: DEFAULT_VIEWPORT_WIDTH,
    height: DEFAULT_VIEWPORT_HEIGHT,
    scrollTop: 0,
  });

  useEffect(() => {
    const element = viewportRef.current;
    if (!element) return;

    const updateSize = () => {
      const width = element.clientWidth || DEFAULT_VIEWPORT_WIDTH;
      const height = element.clientHeight || DEFAULT_VIEWPORT_HEIGHT;
      setViewport((current) => (
        current.width === width && current.height === height
          ? current
          : { ...current, width, height }
      ));
    };

    updateSize();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateSize);
      return () => window.removeEventListener("resize", updateSize);
    }

    const observer = new ResizeObserver(updateSize);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => () => {
    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current);
    }
  }, []);

  const columns = getColumnCount(viewport.width);
  const rowStride = ROW_HEIGHT + GRID_GAP;
  const totalRows = Math.ceil(products.length / columns);
  const visibleRows = Math.ceil(viewport.height / rowStride);
  const maximumStartRow = Math.max(0, totalRows - visibleRows);
  const startRow = Math.min(
    maximumStartRow,
    Math.max(0, Math.floor(viewport.scrollTop / rowStride) - OVERSCAN_ROWS),
  );
  const endRow = Math.min(
    totalRows,
    Math.ceil((viewport.scrollTop + viewport.height) / rowStride) + OVERSCAN_ROWS,
  );
  const startIndex = startRow * columns;
  const endIndex = Math.min(products.length, endRow * columns);
  const columnWidth = (
    viewport.width - GRID_GAP * (columns - 1)
  ) / columns;
  const canvasHeight = Math.max(
    ROW_HEIGHT,
    totalRows * ROW_HEIGHT + Math.max(0, totalRows - 1) * GRID_GAP,
  );

  function handleScroll() {
    if (frameRef.current !== null) return;

    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = null;
      setViewport((current) => ({
        ...current,
        scrollTop: viewportRef.current?.scrollTop ?? 0,
      }));
    });
  }

  return (
    <div
      ref={viewportRef}
      className={styles.virtualGridViewport}
      onScroll={handleScroll}
      role="region"
      aria-label="Scrollable product results"
      tabIndex={0}
    >
      <ul
        className={styles.virtualGridCanvas}
        style={{ height: canvasHeight }}
      >
        {products.slice(startIndex, endIndex).map((product, offset) => {
          const index = startIndex + offset;
          const row = Math.floor(index / columns);
          const column = index % columns;
          const itemStyle: CSSProperties = {
            width: columnWidth,
            height: ROW_HEIGHT,
            transform: `translate(${column * (columnWidth + GRID_GAP)}px, ${row * rowStride}px)`,
          };

          return (
            <li
              key={product.id}
              className={styles.virtualGridItem}
              style={itemStyle}
              aria-posinset={index + 1}
              aria-setsize={products.length}
            >
              <ProductCard product={product} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function VirtualizedProductGrid({ products }: VirtualizedProductGridProps) {
  if (products.length <= VIRTUALIZATION_THRESHOLD) {
    return <StandardProductGrid products={products} />;
  }

  return <WindowedProductGrid products={products} />;
}
