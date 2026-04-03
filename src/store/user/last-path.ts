export interface LastPathRoute {
  name?: string | symbol | null;
  path?: string | null;
}

const AUTH_PATHS = new Set(['/auth/login', '/auth/register']);
const AUTH_ROUTE_NAMES = new Set(['login', 'register']);

export function shouldPersistLastPath(route: LastPathRoute) {
  if (
    typeof route.name === 'string' &&
    AUTH_ROUTE_NAMES.has(route.name)
  ) {
    return false;
  }

  return !AUTH_PATHS.has(route.path ?? '');
}
