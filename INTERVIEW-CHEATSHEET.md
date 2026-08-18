# Interview Cheatsheet

## Quick commands

```bash
npm run dev          # local development server
npm run typecheck    # TypeScript without emitting files
npm run lint         # ESLint
npm test             # Jest once
npm run test:watch   # Jest watch mode
npm run build        # production compilation
```

## React rendering

- A component renders when its state changes, its parent renders, or consumed context changes.
- Rendering must be pure; effects synchronize with systems outside React.
- Keep state minimal, colocate it near consumers, and derive values during render.
- Keys identify siblings across renders; unstable keys can lose state or cause incorrect reuse.
- `memo`, `useMemo`, and `useCallback` are performance tools, not correctness tools. Measure first.
- Controlled inputs use React state; uncontrolled inputs keep state in the DOM.

## Next.js rendering

- App Router components are Server Components unless marked `"use client"`.
- Server Components can access server resources and reduce client JavaScript; they cannot use state, effects, or browser APIs.
- Client Components establish a client boundary; their serializable props may come from a server parent.
- Static rendering is reusable output. Dynamic rendering happens per request. Streaming can reveal ready segments early.
- Be explicit about cache lifetime and invalidation. Prices and inventory usually need different policies from descriptive content.
- Route Handlers live under `app/**/route.ts`; `loading.tsx` and `error.tsx` provide segment UI.

## Event loop

- Current synchronous work completes first.
- Promise reactions and `queueMicrotask` use the microtask queue, drained before the next task.
- Timers, input, and network callbacks schedule tasks. Rendering generally happens between tasks.
- Long JavaScript tasks block input and rendering; split work or move CPU-heavy work off the main thread.

## Browser APIs

- `AbortController`: pass `signal`, call `abort`, and handle `AbortError` separately.
- `IntersectionObserver`: observe visibility without repeated scroll measurements; always disconnect/unobserve.
- `localStorage`: synchronous, string-only, origin-scoped, and can throw. Do not access during server rendering.
- `requestAnimationFrame`: schedule visual updates before a repaint.
- `ResizeObserver`: react to element-size changes; avoid feedback loops.

## HTTP caching

- `Cache-Control: no-store` means do not retain; `no-cache` means retain but revalidate before reuse.
- `max-age` targets browser/shared caches; `s-maxage` overrides it for shared caches.
- `stale-while-revalidate` permits stale responses while refreshing in the background.
- Validators (`ETag`, `Last-Modified`) enable conditional requests and `304` responses.
- Include varying request dimensions in `Vary`; avoid caching private user data in shared caches.
- A CDN reduces origin load and latency, but invalidation and cache keys are part of correctness.

## Core Web Vitals

- LCP: loading experience; target at or below 2.5 s at the 75th percentile.
- INP: interaction responsiveness; target at or below 200 ms.
- CLS: visual stability; target at or below 0.1.
- Diagnose with real-user monitoring first, then reproduce with lab tooling. Segment by device, route, geography, and release.

## Jest and React Testing Library

- Query like a user: role and accessible name first (`getByRole`).
- `getBy*` expects now, `findBy*` waits, and `queryBy*` is useful for absence.
- Use `userEvent` for interactions and assert visible behavior instead of implementation details.
- Control network boundaries with mocks, but keep a smaller number of integration tests for real wiring.
- Await user actions and async UI updates; avoid arbitrary sleeps.
- Run one test: `npm test -- ProductCard`; update intentionally, never blindly.
