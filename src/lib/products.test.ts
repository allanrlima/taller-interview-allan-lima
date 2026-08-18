import { formatPrice, sortProducts } from "./products";
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
});
