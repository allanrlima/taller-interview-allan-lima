import { act, fireEvent, render, screen } from "@testing-library/react";

import { products } from "@/data/products";
import { formatPrice } from "@/lib/products";
import { ProductSearch } from "./ProductSearch";

jest.mock("@/lib/products", () => {
  const actual = jest.requireActual<typeof import("@/lib/products")>("@/lib/products");
  return { ...actual, formatPrice: jest.fn(actual.formatPrice) };
});

const mockedFormatPrice = jest.mocked(formatPrice);

describe("ProductSearch", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.useRealTimers();
  });

  it("isolates keystroke renders and preserves products while refreshing", async () => {
    jest.useFakeTimers();
    let resolveRequest!: (response: Response) => void;
    global.fetch = jest.fn(
      () => new Promise<Response>((resolve) => { resolveRequest = resolve; }),
    );

    render(<ProductSearch initialProducts={products} />);

    expect(screen.getByRole("heading", { name: "Canvas Backpack" })).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
    expect(mockedFormatPrice).toHaveBeenCalledTimes(products.length);

    fireEvent.change(screen.getByRole("searchbox"), {
      target: { value: "head" },
    });
    fireEvent.change(screen.getByRole("searchbox"), {
      target: { value: "headphones" },
    });
    fireEvent.change(screen.getByRole("searchbox"), {
      target: { value: "  headphones  " },
    });

    expect(screen.getByRole("heading", { name: "Canvas Backpack" })).toBeInTheDocument();
    expect(mockedFormatPrice).toHaveBeenCalledTimes(products.length);

    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    expect(screen.getByRole("status")).toHaveTextContent("Updating products");
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/products?q=headphones",
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );

    await act(async () => {
      resolveRequest({
        ok: true,
        json: async () => [products[1]],
      } as Response);
    });

    expect(screen.getByRole("heading", { name: "Wireless Headphones" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Canvas Backpack" })).not.toBeInTheDocument();
  });

  it("mounts only a window of a large result set", () => {
    const largeCatalog = Array.from({ length: 120 }, (_, index) => ({
      ...products[index % products.length],
      id: `virtual-product-${index}`,
      name: `Virtual product ${index}`,
    }));

    render(<ProductSearch initialProducts={largeCatalog} />);

    const mountedProducts = screen.getAllByRole("listitem");
    expect(mountedProducts.length).toBeGreaterThan(0);
    expect(mountedProducts.length).toBeLessThan(largeCatalog.length);
    expect(mockedFormatPrice).toHaveBeenCalledTimes(mountedProducts.length);
  });
});
