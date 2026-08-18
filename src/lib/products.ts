import type { Product, ProductSort } from "@/types/product";

export function formatPrice(priceInCents: number, locale = "en-US", currency = "USD") {
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(priceInCents / 100);
}

export function filterProductsByQuery(items: Product[], query: string): Product[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return items;

  return items.filter((product) =>
    `${product.name} ${product.description} ${product.category}`
      .toLowerCase()
      .includes(normalizedQuery),
  );
}

export function sortProducts(items: Product[], sort: ProductSort): Product[] {
  const copy = [...items];
  if (sort === "name") return copy.sort((a, b) => a.name.localeCompare(b.name));
  if (sort === "price-asc") return copy.sort((a, b) => a.priceInCents - b.priceInCents);
  if (sort === "price-desc") return copy.sort((a, b) => b.priceInCents - a.priceInCents);
  return copy;
}
