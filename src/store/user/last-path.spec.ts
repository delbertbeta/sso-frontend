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
