---
paths:
  - "Frontend/**"
---

# Frontend — unit tests required

When you **add or change frontend logic** (components, hooks, context providers, pure utility functions, etc.), treat the task as incomplete until **tests are green**.

## What to do

1. After substantive edits under `Frontend/`, run the unit test suite:

   ```bash
   cd Frontend && npm test
   ```

2. If any test **fails**, **fix the code or update the tests** so `npm test` passes. Do not leave the frontend in a broken-test state when the change was intentional (refactors, renames, new behavior).

3. If you **add new behavior**, extend or add tests next to the file they cover (e.g. `Foo.tsx` → `Foo.test.tsx`) when it is reasonable for the change — same pattern as the existing tests in `ProductCard/`, `CartContext.tsx`, `ThemeToggle/`, `AuthModal/`, and `orderStatusLabels.ts`.

## Exceptions

- Trivial edits (comments only, styling-only tweaks with no behavior change) may skip a full run if verification is obviously unnecessary — but when in doubt, run `npm test`.

## Project note

Tests run with Vitest + `@testing-library/react` in a jsdom environment (config in `vite.config.ts`'s `test` block, setup in `src/setupTests.ts`). This is separate from `smoke.test.ts` at the repo root, which is a slower Playwright end-to-end suite — see [backend-unit-tests.md](backend-unit-tests.md) for the equivalent backend rule.
