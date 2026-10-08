/* @layer electron-main @kind logic */
import type { CatalogCall } from './catalog-client.type';
import type { CatalogRoute } from './catalog-config.type';

const pathOf = (route: CatalogRoute, params: Record<string, string> = {}): string =>
  route.path.replace(/:(\w+)/g, (all: string, key: string) => {
    const value = params[key];
    if (value === undefined) throw new Error(`The catalogue route ${route.path} needs ${key}.`);
    return encodeURIComponent(value);
  });

const catalogUrl = (baseUrl: string, call: CatalogCall): string => {
  const url = new URL(`${baseUrl.replace(/\/$/, '')}${pathOf(call.route, call.params)}`);
  for (const [key, value] of Object.entries(call.query ?? {})) if (value !== null && value !== undefined) url.searchParams.set(key, String(value));
  return url.toString();
};

export { catalogUrl };
