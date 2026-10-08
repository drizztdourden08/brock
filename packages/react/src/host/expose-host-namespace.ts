/* @layer renderer-shell @kind logic */
import type { ApiWindow } from './host-api.type';

const exposeHostNamespace = (id: string, value: unknown): void => {
  if (typeof window === 'undefined') return;
  const api = (window as ApiWindow).api;
  if (!api || typeof api !== 'object' || id in api) return;
  (api as Record<string, unknown>)[id] = value;
};

export { exposeHostNamespace };
