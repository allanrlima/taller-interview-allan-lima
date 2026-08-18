# Repository Guidelines for Coding Agents

This file is the canonical guide for LLM-authored changes in this repository. It applies to the entire repository. Preserve established behavior unless the task explicitly changes it.

## Stack and commands

- Next.js App Router, React, and strict TypeScript.
- Use the `@/` alias for imports rooted at `src`.
- Styling uses CSS Modules for route-specific UI and `globals.css` only for application-wide rules.
- Before handing off code, run `npm run typecheck`, `npm run lint`, and `npm test -- --runInBand`.
- Run `npm run build` for rendering-boundary, routing, or production configuration changes.

## Source structure

- `src/app`: routes, route handlers, and route-specific components.
- `src/components`: reusable application components.
- `src/hooks`: reusable client hooks and browser lifecycle logic.
- `src/services`: client-side API adapters.
- `src/lib`: pure formatting, filtering, sorting, and storage utilities.
- `src/data`: local fixture or seed data.
- `src/types`: shared domain types.

Keep a component route-local while it serves only one route. Move it to `src/components` only when it is genuinely shared.

## Rendering architecture

1. Prefer Server Components. Add `"use client"` only to the smallest boundary that requires state, effects, event handlers, or browser APIs.
2. Fetch or load initial public data on the server and pass serializable data into client boundaries. Do not introduce a mount-time request for data already available during server rendering.
3. Separate immediate interaction state from expensive rendering. For product search:
   - `page.tsx` composes the server-rendered page and initial data.
   - `SearchForm.tsx` owns raw input state and debouncing.
   - `ProductSearch.tsx` coordinates requests, cancellation, retries, and successful data.
   - `ProductResults.tsx` owns result-state presentation.
   - `VirtualizedProductGrid.tsx` owns bounded rendering of large result sets.
4. Keep the previous successful result set mounted while a replacement request is pending or fails. Represent refreshing separately from initial loading and error state.
5. Cancel obsolete requests with `AbortController`, and never present cancellation as a network error.
6. Normalize search text at the debounce/request boundary so raw keystrokes remain local to the input component.

## Performance patterns

- Do not add `memo`, `useMemo`, or `useCallback` reflexively. Use stable callbacks when they preserve an intentional component boundary or effect dependency, and add a regression test for meaningful optimization work.
- The standard grid is appropriate for small result sets. Above the virtualization threshold, mount only visible rows plus overscan.
- Virtualized cards have a fixed row height. If card content changes, verify truncation and row-height assumptions at mobile, tablet, and desktop widths.
- Keep scroll work frame-throttled, clean up observers and animation frames, and retain `aria-posinset`/`aria-setsize` metadata for windowed list items.
- Do not add pagination unless a task explicitly requires it. Virtualization controls browser rendering cost; it does not reduce API payload size.
- Preserve stable product IDs as React keys. Never use array indexes when a domain ID exists.

## React and TypeScript conventions

- Keep state minimal and derive values during render when inexpensive.
- Put state beside the smallest subtree that consumes it.
- Effects synchronize with external systems; avoid synchronous state resets inside effects.
- Use functional state updates when the next value depends on the previous value.
- Keep render functions pure and clean up timers, requests, observers, and event listeners.
- Prefer explicit props interfaces and domain types over `any` or unchecked casts.
- Keep accessibility semantics intact: labeled controls, live status messages, busy state, keyboard-scrollable virtual regions, and reduced-motion behavior.

## Testing expectations

- Test user-visible behavior with Testing Library queries by role and accessible name.
- Use fake timers only around debounce behavior, and restore them after each test.
- Cover request success, failure, retry, and cancellation when those flows change.
- Performance tests should assert observable bounded work—for example, that keystrokes do not reformat every product or that a large catalog mounts fewer list items than its total size.
- Avoid snapshots for interaction logic.

## Change discipline

- Make the smallest coherent change and avoid unrelated cleanup.
- Update these guidelines when an architectural change makes them inaccurate.
- Do not commit generated `.next` changes or incidental rewrites to `next-env.d.ts`.
