/* @layer electron-main @kind logic */
import { CatalogApiError } from './catalog-api-error';
import type { CatalogCall, CatalogClient } from './catalog-client.type';
import type { CatalogEndpoint } from './catalog-config.type';
import { UNAUTHORIZED } from './catalog-main.constants';
import { catalogUrl } from './catalog-url';

const messageOf = async (response: Response): Promise<string> => {
  const fallback = `The catalogue answered ${response.status}.`;
  try {
    const body = (await response.json()) as { error?: unknown; message?: unknown };
    const text = body.error ?? body.message;
    return typeof text === 'string' && text ? text : fallback;
  } catch {
    return fallback;
  }
};

const headersOf = async (endpoint: CatalogEndpoint, call: CatalogCall): Promise<Record<string, string>> => ({
  accept: 'application/json',
  ...(await endpoint.headers?.()),
  ...(call.body === undefined ? {} : { 'content-type': 'application/json' }),
});

const createCatalogClient = (endpoint: CatalogEndpoint): CatalogClient => {
  const send = endpoint.fetch ?? fetch;
  return async (call) => {
    const body = call.body === undefined ? undefined : JSON.stringify(call.body);
    const response = await send(catalogUrl(endpoint.baseUrl, call), { method: call.route.method, headers: await headersOf(endpoint, call), body });
    if (response.status === UNAUTHORIZED) await endpoint.onUnauthorized?.();
    if (!response.ok) throw new CatalogApiError(await messageOf(response), response.status);
    return (await response.json()) as unknown;
  };
};

export { createCatalogClient };
