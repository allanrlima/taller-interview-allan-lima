import type { Product } from "@/types/product";

export interface FetchProductsOptions {
  signal?: AbortSignal;
  simulateError?: boolean;
}

export async function fetchProducts(options: FetchProductsOptions = {}): Promise<Product[]> {
  const params = new URLSearchParams();
  if (options.simulateError) params.set("error", "true");

  const query = params.size ? `?${params.toString()}` : "";
  const response = await fetch(`/api/products${query}`, {
    signal: options.signal,
    headers: { Accept: "application/json" },
  });

  if (!response.ok) throw new Error(`Product request failed (${response.status})`);
  return (await response.json()) as Product[];
}
