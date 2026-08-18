import "@testing-library/jest-dom";

class IntersectionObserverMock implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = "0px";
  readonly scrollMargin = "0px";
  readonly thresholds = [0];

  disconnect = jest.fn();
  observe = jest.fn((element: Element) => {
    this.callback(
      [{ isIntersecting: true, target: element } as IntersectionObserverEntry],
      this,
    );
  });
  takeRecords = jest.fn(() => []);
  unobserve = jest.fn();

  constructor(private callback: IntersectionObserverCallback) {}
}

Object.defineProperty(window, "IntersectionObserver", {
  writable: true,
  value: IntersectionObserverMock,
});
