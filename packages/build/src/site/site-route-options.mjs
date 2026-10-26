/* @layer tooling-scripts @kind logic */
import { SITE_CONFIG_FILE, SITE_ROUTE_PATH_RULE } from './site.constants.mjs';

const fail = (message) => {
  throw new Error(`${SITE_CONFIG_FILE}: build.routes ${message}`);
};

const textOf = (value, key, index) => {
  if (typeof value !== 'string' || !value.trim()) fail(`[${index}].${key} must be a non-empty string.`);
  return value.trim();
};

const optionalTextOf = (value, key, index) => {
  if (value === undefined || value === null) return null;
  return textOf(value, key, index);
};

const routeOf = (route, index) => {
  if (!route || typeof route !== 'object') fail(`[${index}] must be { path, title, description? }.`);
  const { path } = route;
  if (typeof path !== 'string' || !SITE_ROUTE_PATH_RULE.test(path)) {
    fail(`[${index}].path "${String(path)}" must be letters, digits and dashes in segments split by /, with no leading or trailing slash and no dots (privacy, legal/terms).`);
  }
  return { path, title: textOf(route.title, 'title', index), description: optionalTextOf(route.description, 'description', index) };
};

/**
 * @param {unknown} routes build.routes of brock.site.ts
 * @returns {{ path: string, title: string, description: string | null }[]} each route, checked
 */
const routesOf = (routes) => {
  if (routes === undefined || routes === null) return [];
  if (!Array.isArray(routes)) fail('is a list of { path, title, description? }.');
  const list = routes.map(routeOf);
  const seen = new Set();
  list.forEach(({ path }) => {
    if (seen.has(path.toLowerCase())) fail(`lists "${path}" twice.`);
    seen.add(path.toLowerCase());
  });
  return list;
};

export { routesOf };
