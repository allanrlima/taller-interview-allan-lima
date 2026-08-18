# Interview Challenges

Do the exercises in order or choose one that targets a weak area. Requirements are intentionally incomplete in places: state your assumptions as you would in an interview. Do not install a UI library.

## 1. Product summaries — arrays, maps, and sets

Create a function that returns the unique categories, total inventory count, and average price from a product array. Define behavior for an empty array and add tests.

## 2. Cart normalization — maps

Write a function that merges repeated cart entries by product ID, sums quantities, rejects invalid quantities, and preserves the order of the first appearance.

## 3. Search history — sets and local storage

Persist the five most recent unique search terms. Make matching case-insensitive while retaining useful display casing, and handle unavailable or corrupt storage.

## 4. Debounce behavior

Add tests for `useDebounce`, then extend it with an explicit cancel operation. Explain the difference between debounce and throttle and where each fits in this catalog.

## 5. Promises and the event loop

Given a mix of synchronous logs, resolved promises, `queueMicrotask`, and `setTimeout`, predict the output order before running it. Add a small playground and explain microtasks versus tasks.

## 6. Cart state

Implement add, decrement, remove, and clear behavior using `useReducer`. Derive totals instead of storing them. Prevent stock from being exceeded and test the reducer.

## 7. React rendering investigation

Add render counters to the catalog and cards. Identify which interactions cause renders, why they happen, and whether any state is located too high in the tree. Document evidence before optimizing.

## 8. Memoization trade-offs

Use profiling evidence to choose one useful memoization change. Add it, verify that behavior is unchanged, and explain its runtime and code-complexity costs.

## 9. Data fetching states

Add pagination to the API and catalog. Design explicit loading, refreshing, failure, retry, empty, and end-of-results behavior without losing already displayed data unnecessarily.

## 10. AbortController race conditions

Move search filtering to the API. Cancel obsolete searches and prove with a test that a slow earlier request cannot overwrite a newer result. Distinguish cancellation from network failure in the UI.

## 11. Accessible modal

Audit the example modal using keyboard-only navigation and an accessibility tool. Add a robust focus trap, prevent background interaction and scrolling, and write interaction tests for focus restoration and Escape.

## 12. Browser APIs and infinite scrolling

Use `IntersectionObserver` to load the next result page. Provide a keyboard-accessible fallback, disconnect observers correctly, and decide how the experience should behave when the API fails.

## 13. Caching and Next.js boundaries

Create a server-rendered category page and decide what belongs in Server Components versus Client Components. Propose cache directives and invalidation for price, inventory, and product descriptions, which have different freshness needs.

## 14. eCommerce performance architecture

Design the catalog, cart, pricing, inventory, checkout, analytics, image delivery, and CDN boundaries for a high-traffic sale. Include consistency requirements, graceful degradation, Core Web Vitals budgets, monitoring, and rollback strategy.

## 15. Production incident

A deployment increases LCP from 1.8 s to 4.9 s, conversion drops on mobile, some users see stale prices, and client error volume doubles. Write an incident plan: triage signals, hypotheses, safe mitigations, investigation steps, ownership, communication, root-cause validation, and prevention work.
