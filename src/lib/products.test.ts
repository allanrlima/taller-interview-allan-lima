import { filterProductsByQuery, formatPrice, sortProducts } from "./products";
import { products } from "@/data/products";

describe("product utilities", () => {
  it("formats a cent amount as currency", () => {
    expect(formatPrice(15900, "en-US", "USD")).toBe("$159.00");
  });

  it("sorts without mutating the original array", () => {
    const input = products.slice(0, 3);
    const original = [...input];
    const sorted = sortProducts(input, "price-asc");
    expect(sorted.map((product) => product.priceInCents)).toEqual([6900, 11900, 15900]);
    expect(input).toEqual(original);
  });

  it("filters products using a trimmed, case-insensitive query", () => {
    expect(filterProductsByQuery(products, "  HEADPHONES ")).toEqual([
      expect.objectContaining({ id: "p-02" }),
    ]);
  });

  it("searches product descriptions and categories", () => {
    expect(filterProductsByQuery(products, "noise cancellation")).toEqual([
      expect.objectContaining({ id: "p-02" }),
    ]);
    expect(filterProductsByQuery(products, "computers")).toHaveLength(3);
  });

  it("returns no products when the query does not match", () => {
    expect(filterProductsByQuery(products, "nonexistent product")).toEqual([]);
  });
});
