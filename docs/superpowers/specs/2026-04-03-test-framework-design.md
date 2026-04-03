# sso-frontend Test Framework Design

## Goal

Add a first-class test setup to `sso-frontend` that fits the existing Vue 3 + Vite + TypeScript stack, supports unit and component tests, and immediately covers the post-login redirect regression with an automated test.

## Context

The repository currently has no formal frontend test framework. The codebase uses Vite path aliases, Vue Router, Vuex, and browser APIs, so the chosen setup needs to run well in a `jsdom` environment and reuse the existing Vite resolution rules.

The current regression is: when an unauthenticated user lands on the login page, `user/getSelfInfo` can persist `/auth/login` into `last_path`. After a successful login, the app redirects back to the login page instead of the intended destination, which looks like "login succeeded but did not auto-redirect."

## Chosen Approach

Use `Vitest + Vue Test Utils + jsdom` as the baseline test framework.

This keeps the test runner aligned with the existing Vite toolchain, avoids a parallel Jest-specific configuration stack, and gives the project a clean path for both low-level unit tests and Vue component tests.

## Architecture

### Test Runner

`Vitest` will be configured from `vite.config.ts` so it can reuse the existing alias map and Vue plugin configuration. Tests will run in a `jsdom` environment by default because the application code relies on browser globals such as `window`, `location`, `sessionStorage`, and `localStorage`.

### Vue Component Testing

`@vue/test-utils` will provide component mounting utilities for future page and component tests. The initial regression can be validated at the store/helper boundary without mounting a full page, but the framework will be ready for component-level coverage immediately.

### Shared Test Setup

A single setup file will hold shared test helpers and environment initialization, such as clearing mocks between tests. This avoids repeated boilerplate in each test file and gives the project one place to expand browser API stubs later.

### Regression Boundary

The redirect bug will be covered at the Vuex action/helper boundary:

- a helper decides whether the current route is valid to persist as `last_path`
- the `user/getSelfInfo` action uses that helper before saving `last_path` and pushing to the login route

This keeps the regression test small, deterministic, and independent from TDesign rendering.

## Testing Strategy

The initial test suite will include:

- helper tests proving auth routes are never persisted as `last_path`
- action tests proving unauthenticated access from a protected route persists that route and redirects to login
- action tests proving unauthenticated access from the login route does not overwrite `last_path` and does not loop navigation

## Non-Goals

- No end-to-end browser automation in this change
- No broad refactor of existing auth architecture
- No migration away from Vuex

## Success Criteria

- `npm test` runs successfully in the repository
- the new test framework supports `.ts` and `.vue`-adjacent code under the current alias scheme
- the login redirect regression is reproduced by a failing test before the fix and passes after the fix
- the application still type-checks and builds once dependencies are installed
