import { render, screen } from "@testing-library/react";
import { ProductCatalog } from "./ProductCatalog";
import { products } from "@/data/products";
import { fetchProducts } from "@/services/productService";

jest.mock("@/services/productService", () => ({ fetchProducts: jest.fn() }));
const mockedFetchProducts = jest.mocked(fetchProducts);

describe("ProductCatalog", () => {
  it("shows a loading state and then the async products", async () => {
    let resolveRequest!: (value: typeof products) => void;
    mockedFetchProducts.mockReturnValue(new Promise((resolve) => { resolveRequest = resolve; }));
    render(<ProductCatalog />);

    expect(screen.getByRole("status")).toHaveTextContent("Loading products");
    resolveRequest(products);

    expect(await screen.findByRole("heading", { name: "Canvas Backpack" })).toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});
