# Claude Code Guide

Read and follow [`AGENTS.md`](./AGENTS.md) before changing this repository. It is the canonical source for architecture, performance, accessibility, testing, and validation rules.

Key constraints:

- Keep `page.tsx` server-rendered and keep client boundaries as small as possible.
- Keep raw keystroke state inside `SearchForm.tsx`; send only normalized, debounced queries to `ProductSearch.tsx`.
- Keep previous results visible during refreshes and failures, and abort obsolete requests.
- Use the regular grid for small catalogs and the windowed grid for large catalogs. Do not add pagination unless explicitly requested.
- Preserve fixed-row and accessibility assumptions when editing virtualized cards.
- Validate changes with type checking, linting, and tests; also build after routing or rendering-boundary changes.
