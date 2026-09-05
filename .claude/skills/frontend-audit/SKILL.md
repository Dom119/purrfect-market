---
name: frontend-audit
description: Visually audit Purrfect Market pages by rendering them with Playwright (light and dark mode) and reviewing the screenshots for rendering/visual bugs that unit tests and the Playwright smoke suite can't catch — hardcoded colors that don't adapt to dark mode, broken layout, overlapping elements, overflow, misaligned components, broken images. Use when the user asks to audit, visually check, or review the look of a page, a set of pages, or the whole frontend.
---

This skill finds bugs that are invisible to `npm test` (Vitest) and `smoke.test.ts` (Playwright DOM/text assertions) because those only check *that something rendered*, not *whether it looks right*. See `.claude/rules/frontend-unit-tests.md` and the root `smoke.test.ts` for what those already cover — don't duplicate their job here.

## What this catches (and what it doesn't)

Good for: color/contrast issues (especially hardcoded hex values that don't respond to the app's `[data-theme="dark"]` CSS-variable system — see `Frontend/src/theme.ts` and `Frontend/src/globalStyles.ts`), layout breakage, overlapping or clipped elements, horizontal overflow, broken/missing images, inconsistent spacing versus sibling pages, badly wrapping text.

Not for: whether a button's `onClick` does the right thing, business logic, API correctness — those are unit/smoke test territory.

## Step 1 — figure out scope

- User named a specific page ("audit the admin products page", "check the cart page") → just that route.
- User said "audit everything" / "audit the frontend" / gave no page → all of `public` scope by default. Only include `user`/`admin` scope routes if the user asked for logged-in or admin pages specifically, or asked for a full/complete audit.
- `public` scope: `/`, `/products`, `/products/:id`, `/blog`, `/about`, `/privacy`, `/terms`, `/shipping`, `/contact`, `/faq`, `/cart`, `/favorites`, a 404 route.
- `user` scope: `/orders`, `/account` (needs a logged-in, non-admin account).
- `admin` scope: `/admin/dashboard`, `/admin/orders`, `/admin/products`, `/admin/newsletter`, `/admin/subscribers`, `/admin/reviews`, `/admin/users`.

## Step 2 — a quick static pass first (cheap, catches the most common bug class)

Before rendering anything, grep for the exact bug pattern found previously (a hardcoded hex color that bypasses the theme system):

```bash
grep -rnE "'#[0-9a-fA-F]{3,8}'" Frontend/src/pages Frontend/src/components | grep -v '\.styles\.ts'
```

Hits are colors written directly in `style={{ color: '#...' }}` / inline style objects instead of `theme.colors.*` or `var(--color-...)`. Each hit is a candidate — not automatically a bug (some are intentionally fixed, like `theme.colors.alwaysDark`), but worth rendering that page in dark mode to check.

## Step 3 — check whether servers are already running

```bash
lsof -ti:5173 && echo "frontend up"
lsof -ti:8080 && echo "backend up"
```

If `admin` or `user` scope is needed and the backend is already running (started by the user, not by this skill), **tell the user before proceeding**: the script needs to briefly stop and restart the backend to promote a throwaway test account to admin via a direct H2 database write (the app has no seeder or admin API for this — see `.claude/rules/project-conventions.md` history). Get a go-ahead before running an admin-scope audit against an already-running server. `public` scope needs no restart and no confirmation.

## Step 4 — run the renderer

```bash
node .claude/skills/frontend-audit/audit.js --scope=public --out=<a temp dir, e.g. the session scratchpad>
```

`--scope` is `public`, `user`, `admin`, or `all`. Add `--routes=/products,/cart` to override the route list with specific paths instead of a whole scope. The script:
- Starts whichever of the frontend/backend dev servers aren't already running, and stops only the ones it started, when it's done.
- For `user`/`admin` scope, registers a throwaway account (`frontend-audit-user@example.test` / `frontend-audit-admin@example.test`), and for `admin` also promotes it via a direct H2 write (stopping/restarting the backend around that one write). It cleans up by deleting any `frontend-audit-*@example.test` accounts at the end — including leftovers from a previous crashed run.
- For each route, screenshots it in light mode, then sets `localStorage['color-theme'] = 'dark'` and reloads for a dark-mode screenshot.
- Prints a JSON manifest to stdout: `[{ route, light, dark }, ...]` — the screenshot file paths.

The run takes a while (server startup + a real `mvn` cold start for admin scope) — this is expected, not a hang.

## Step 5 — actually look at the screenshots

Read every `light`/`dark` pair from the manifest with the Read tool. This is the part the script cannot do for you — visual judgment happens here, not in the script. For each page ask:
- Does anything look different between light and dark that shouldn't (a patch that stayed light/dark when its surroundings flipped)?
- Any overlapping text/elements, cut-off content, broken image icons, horizontal scrollbar/overflow?
- Does spacing/alignment look consistent with sibling pages of the same type (e.g. do all the admin table pages look alike)?

## Step 6 — report

For each real finding: which page, light or dark (or both), what's wrong, and if you can identify it, the file/line likely responsible (cross-reference the Step 2 grep hits, or search the component for the exact color/text you see in the screenshot). Don't report speculative issues you didn't actually see in a screenshot. If nothing looks wrong, say so plainly rather than inventing findings — a clean audit is a valid outcome.

Offer to fix findings, but don't fix without confirming first — some "weirdness" may be intentional design.
