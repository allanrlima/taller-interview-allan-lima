import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ErrorState } from "./ErrorState";
import { LoadingState } from "./LoadingState";

describe("status state components", () => {
  it("announces loading updates politely", () => {
    render(<LoadingState message="Loading products…" />);

    const status = screen.getByRole("status");
    expect(status).toHaveTextContent("Loading products…");
    expect(status).toHaveAttribute("aria-live", "polite");
    expect(status).toHaveAttribute("aria-atomic", "true");
  });

  it("announces errors and provides an accessible retry action", async () => {
    const user = userEvent.setup();
    const onRetry = jest.fn();
    render(<ErrorState message="Products unavailable." onRetry={onRetry} />);

    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Products unavailable.");
    expect(alert).toHaveAttribute("aria-live", "assertive");

    await user.click(screen.getByRole("button", { name: "Try loading again" }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
