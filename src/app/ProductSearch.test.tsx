import { act, fireEvent, render, screen } from "@testing-library/react";

import { products } from "@/data/products";
import { ProductSearch } from "./ProductSearch";

describe("ProductSearch", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.useRealTimers();
  });

  it("renders initial products without fetching and preserves them while refreshing", async () => {
    jest.useFakeTimers();
    let resolveRequest!: (response: Response) => void;
    global.fetch = jest.fn(
      () => new Promise<Response>((resolve) => { resolveRequest = resolve; }),
    );

    render(<ProductSearch initialProducts={products} />);

    expect(screen.getByRole("heading", { name: "Canvas Backpack" })).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();

    fireEvent.change(screen.getByRole("searchbox"), {
      target: { value: "  headphones  " },
    });

    expect(screen.getByRole("heading", { name: "Canvas Backpack" })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Updating products");

    await act(async () => {
      jest.advanceTimersByTime(300);
    });

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
});
