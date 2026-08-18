# Interviewer Guide

This guide explains how to install, run, and evaluate the product-search application.

## Prerequisites

- Node.js and npm
- A modern web browser

## Install and run locally

From the repository root, install the locked dependencies:

```bash
npm ci
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in a browser. Stop the server with `Ctrl+C`.

## Manual checks

1. Confirm the initial catalog renders product cards without making a mount-time request for data already available on the server.
2. Type `headphones` in the search field. After the 300 ms debounce, the matching product should appear.
3. Type quickly to confirm stale requests are cancelled and do not replace newer results.
4. Search for a term with no matches, then search again. Skeleton cards should appear briefly while there are no previous results to display.
5. Search for `headphones`, then `backpack`, then `HEADPHONES`. In the browser Network panel, confirm the repeated normalized query uses the client cache and does not make another request.
6. During a refresh that already has successful results, confirm those cards remain visible until the replacement request completes.
7. Resize the browser to desktop, tablet, and mobile widths and confirm the grid changes from three columns to two and then one.
8. Use only the keyboard to focus the search field and, for a large result set, the scrollable virtualized region.

The product API can also be inspected directly:

- `http://localhost:3000/api/products`
- `http://localhost:3000/api/products?q=headphones`
- `http://localhost:3000/api/products?error=true` returns a simulated `503` response.

## Automated checks

Run the same validation expected before handing off changes:

```bash
npm run typecheck
npm run lint
npm test -- --runInBand
npm run build
```

The test suite covers product rendering, search behavior, caching, loading placeholders, and bounded rendering for large result sets.

## Improvements over the initial component

The initial implementation kept the input and products in one component, requested data after every query change, and rendered every result directly. The current implementation adds the following improvements.

### Rendering architecture

- The page loads the initial public catalog in a Server Component and passes serializable data into the client search boundary. This avoids an unnecessary request after the first mount.
- Client behavior is split into focused components: `SearchForm` owns raw input and debouncing, `ProductSearch` coordinates requests and cached data, `ProductResults` presents result states, and `VirtualizedProductGrid` controls large-list rendering.
- The client boundary is limited to the components that need state, effects, event handlers, or browser APIs.
- Product data uses an explicit shared TypeScript type instead of an untyped empty array.

### Search and request handling

- Search input is debounced by 300 ms instead of requesting after every keystroke.
- Queries are trimmed and converted to lowercase at the debounce/request boundary while the raw text remains visible in the input.
- Query values are encoded with `encodeURIComponent` before being added to the URL.
- Each request uses an `AbortController`; obsolete requests are cancelled when the user continues typing or a newer search starts.
- Request cancellation is ignored as an expected event rather than shown as a network failure.
- Non-successful HTTP responses are checked and treated as errors instead of always attempting to parse them as successful data.
- An explicit retry action starts a fresh request after a failure.

### Loading, error, and empty states

- Initial loading, background refreshing, failures, and empty results are represented separately.
- Previous successful products remain visible while replacement results load or fail, preventing disruptive content flashes.
- A six-card skeleton is displayed when loading without previous results.
- The skeleton respects the operating system's reduced-motion preference.
- Errors show a user-facing message and retry control instead of failing silently or only logging to the console.
- Empty searches return to the server-provided initial catalog without making another request.

### Client and HTTP caching

- Successful search results are stored in a bounded in-memory client cache for up to 25 normalized queries.
- Repeated case-insensitive searches reuse cached results without another API request.
- Explicit retries bypass the cache.
- API responses include shared-cache instructions with a 60-second freshness period and a 300-second stale-while-revalidate period.

### Rendering performance

- Small result sets use a normal responsive CSS grid.
- Result sets above the virtualization threshold render only visible rows plus overscan rather than mounting the entire catalog.
- Virtualized scrolling is frame-throttled, and resize observers and animation frames are cleaned up.
- Product prices are formatted only for mounted cards, which keeps work bounded for large catalogs.
- Stable product IDs are used as React keys instead of missing keys or array indexes.

### Accessibility and responsive behavior

- The search input has a persistent programmatic label, search landmark, help text, and a connection to the results region.
- Loading and result counts are announced through polite live regions, and the results region exposes its busy state.
- Visual spinners and skeletons are hidden from assistive technology so announcements are not duplicated.
- The virtualized results region is keyboard-focusable and exposes list position and total-size metadata.
- Product cards connect their accessible name, description, and price.
- The grid adapts from three columns to two and then one at smaller viewport widths.

### Testing and maintainability

- Tests use accessible roles and names to verify visible behavior.
- Coverage includes debouncing, preserving existing products during refresh, cached repeated queries, loading placeholders, and bounded rendering of large result sets.
- Pure product filtering and price-formatting logic lives outside the render components.
- The project includes repeatable type checking, linting, unit tests, and a production build check.

## Test the production build

After `npm run build` succeeds, start the optimized application:

```bash
npm run start
```

Open [http://localhost:3000](http://localhost:3000) and repeat the relevant manual checks above.
