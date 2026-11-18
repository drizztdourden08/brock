/* @layer core @kind logic */
import { INTL_CACHE } from './intl-cache.constants';

const cached = <T>(kind: string, locale: string, options: object | undefined, make: () => T): T => {
  const id = `${kind}|${locale}|${JSON.stringify(options ?? null)}`;
  const hit = INTL_CACHE.get(id) as T | undefined;
  if (hit) return hit;
  const created = make();
  INTL_CACHE.set(id, created);
  return created;
};

export { cached };
