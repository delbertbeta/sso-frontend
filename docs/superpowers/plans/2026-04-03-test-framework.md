---
title: 2026-04-03-test-framework
type: note
permalink: work/sso-frontend/docs/superpowers/plans/2026-04-03-test-framework
---

# sso-frontend Test Framework Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a first-class Vitest-based unit/component test framework to `sso-frontend` and lock in the login redirect regression with automated coverage.

**Architecture:** Reuse the existing Vite config as the single source of truth for aliases and Vue transforms, run tests in `jsdom`, and keep the initial regression coverage focused on the auth store/helper boundary so the suite is small and deterministic.

**Tech Stack:** Vite, Vitest, Vue Test Utils, jsdom, Vue 3, Vuex, TypeScript

---

### Task 1: Add Test Dependencies And Commands

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Add the test packages**

Add these dev dependencies to `package.json`:

```json
"@vue/test-utils": "^2.4.6",
"jsdom": "^26.1.0",
"vitest": "^3.2.4"
```

- [ ] **Step 2: Add the test scripts**

Add these scripts to `package.json`:

```json
"test": "vitest run",
"test:watch": "vitest",
"test:ui": "vitest --ui"
```

- [ ] **Step 3: Install dependencies**

Run: `npm install --legacy-peer-deps`
Expected: install completes without unresolved dependency errors

### Task 2: Configure Vitest

**Files:**
- Modify: `vite.config.ts`
- Create: `src/test/setup.ts`

- [ ] **Step 1: Write the failing config expectation manually**

Expected failure before config exists:

```bash
npm test
```

Expected: Vitest cannot find config/setup or cannot execute the new test files

- [ ] **Step 2: Add the Vitest config**

Extend `vite.config.ts` with:

```ts
test: {
  environment: 'jsdom',
  setupFiles: ['./src/test/setup.ts'],
  clearMocks: true,
  restoreMocks: true,
  globals: true,
},
```

- [ ] **Step 3: Add the shared setup file**

Create `src/test/setup.ts` with:

```ts
import { afterEach } from 'vitest';

afterEach(() => {
  sessionStorage.clear();
  localStorage.clear();
});
```

- [ ] **Step 4: Run the test command again**

Run: `npm test`
Expected: Vitest starts successfully and now fails only because regression tests are not fully implemented yet

### Task 3: Formalize The Redirect Guard Helper

**Files:**
- Modify: `src/store/user/last-path.ts`
- Create: `src/store/user/last-path.spec.ts`

- [ ] **Step 1: Write the failing helper tests**

Create `src/store/user/last-path.spec.ts` with:

```ts
import { describe, expect, it } from 'vitest';
import { shouldPersistLastPath } from './last-path';

describe('shouldPersistLastPath', () => {
  it('returns false for the login route', () => {
    expect(
      shouldPersistLastPath({
        name: 'login',
        path: '/auth/login',
      })
    ).toBe(false);
  });

  it('returns false for the register route', () => {
    expect(
      shouldPersistLastPath({
        name: 'register',
        path: '/auth/register',
      })
    ).toBe(false);
  });

  it('returns true for a protected application route', () => {
    expect(
      shouldPersistLastPath({
        name: 'user',
        path: '/user',
      })
    ).toBe(true);
  });
});
```

- [ ] **Step 2: Run the helper test to verify it fails if needed**

Run: `npm test -- src/store/user/last-path.spec.ts`
Expected: fail if the helper still returns `true` for auth routes

- [ ] **Step 3: Implement the helper**

Ensure `src/store/user/last-path.ts` keeps auth paths and auth route names out of `last_path`.

- [ ] **Step 4: Run the helper test again**

Run: `npm test -- src/store/user/last-path.spec.ts`
Expected: PASS

### Task 4: Cover The Vuex Redirect Regression

**Files:**
- Modify: `src/store/user/actions.ts`
- Create: `src/store/user/actions.spec.ts`

- [ ] **Step 1: Write the failing action tests**

Create `src/store/user/actions.spec.ts` with tests that mock:

- `$api/request` `getSelfInfo`
- `$router/router`
- `$utils/local-storage`

Test these behaviors:

```ts
it('persists the current protected route and redirects to login on 106', async () => {
  // currentRoute: /user
  // expect safeSetStorage called with /user
  // expect router.push called with login
});

it('does not overwrite last_path when already on the login route', async () => {
  // currentRoute: /auth/login
  // expect safeSetStorage not called
  // expect router.push not called
});
```

- [ ] **Step 2: Run the action tests to verify they fail**

Run: `npm test -- src/store/user/actions.spec.ts`
Expected: fail before the action logic is updated

- [ ] **Step 3: Implement the minimal action fix**

Update `src/store/user/actions.ts` so that on response code `106` it:

- reads `router.currentRoute.value`
- persists `currentRoute.fullPath` only when `shouldPersistLastPath(currentRoute)` is `true`
- avoids pushing to login again when `currentRoute.name === RouteName.Login`

- [ ] **Step 4: Run the action tests again**

Run: `npm test -- src/store/user/actions.spec.ts`
Expected: PASS

### Task 5: Remove The Temporary Test Artifact

**Files:**
- Delete: `src/store/user/last-path.test.ts`

- [ ] **Step 1: Remove the temporary Node test**

Delete the earlier ad hoc `node:test` file so the repository has one consistent frontend test entrypoint.

- [ ] **Step 2: Verify no references remain**

Run: `rg -n "last-path\\.test" src`
Expected: no output

### Task 6: Verify The Whole Setup

**Files:**
- No file changes

- [ ] **Step 1: Run the focused test suite**

Run: `npm test -- src/store/user/last-path.spec.ts src/store/user/actions.spec.ts`
Expected: PASS

- [ ] **Step 2: Run the full test command**

Run: `npm test`
Expected: PASS

- [ ] **Step 3: Run the build**

Run: `npm run build`
Expected: production build completes successfully