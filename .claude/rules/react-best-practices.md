---
paths:
  - "Frontend/**"
---

# React + TypeScript Best Practices

Stack in this project: React 18, TypeScript, Vite, styled-components, react-router-dom.

## Components

- Functional components with hooks only — no class components.
- One component per file; name the file after the component.
- Type props with an explicit `interface Props { ... }` — never `any`, avoid `React.FC`.
- Keep components small and focused; extract a child component instead of nesting deep JSX.

## Hooks

- Only call hooks at the top level — never inside loops, conditions, or nested functions.
- Don't reach for `useEffect` for derived values; compute them directly during render.
- Use `useMemo`/`useCallback` only when there's a measured perf problem, not by default.
- Custom hooks go in `src/hooks/` and start with `use`.

## State

- Keep state as local as possible; lift it only when a sibling actually needs it.
- Don't store derived data in state — compute it from existing state/props.
- Keep server state (fetched data) and client/UI state conceptually separate.

## JSX

- Never use array index as a `key` — use a stable id.
- Avoid inline object/array/function literals in props on components that re-render often.
- Always handle loading, error, and empty states for anything that fetches data.

## Styling

- Use styled-components for all styling — no inline `style={}` objects, no plain CSS files.
- Co-locate styled component definitions near the component that uses them, or in a sibling `*.styles.ts` file for larger components.

## TypeScript

- `strict` mode stays on — don't weaken `tsconfig.json` to silence errors.
- Prefer discriminated unions over optional-flag soup for variant state (e.g. loading/error/success).
- Type API responses explicitly; don't let `fetch`/axios calls return untyped `any`.
