import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductCard } from "./ProductCard";
import { products } from "@/data/products";

describe("ProductCard", () => {
  it("renders product information and handles add to cart", async () => {
    const user = userEvent.setup();
    const onAddToCart = jest.fn();
    render(<ProductCard product={products[0]} onAddToCart={onAddToCart} />);

    expect(screen.getByRole("heading", { name: "Canvas Backpack" })).toBeInTheDocument();
    expect(screen.getByText("$69.00")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Add to cart" }));
    expect(onAddToCart).toHaveBeenCalledWith(products[0]);
  });
});
