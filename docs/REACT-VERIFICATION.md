# React conversion verification

Converted on 2026-10-29 from the original native JavaScript implementation.

- React and React DOM render all screens using JSX and `createRoot`.
- React Router provides guarded hash routes.
- Context owns the session, selected API adapter and notifications.
- Hooks own forms, pagination, loading, errors, modal state and request lifecycle cleanup.
- No custom Node/Express backend; Vite is used only for development and build tooling.
- `npm run build` produces a static frontend in `dist`.
- All six local API/demo tests passed.
- Live Route mutation tests remain outside this conversion's verification. Existing read-only evidence is preserved with its original date.

Browser demo checks: protected-route redirect to login, local demo login, feed rendering, new post creation, post details navigation, comment creation with refreshed count, and opening/saving the comment editor. The browser demo is isolated from real Route account data.

The production build was checked with the installed Vite 8 / React 19 toolchain on Node 24. The native config loader avoids a restricted Windows child-process path during config loading; the resulting app is ordinary static browser code.
