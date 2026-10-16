/* @layer renderer-shell @kind logic */
import type { Preloadable } from './lazy.type';

const preloadOf = (component: unknown): (() => Promise<unknown>) | undefined => {
  const preload = (component as Preloadable | null)?.preload;
  return typeof preload === 'function' ? preload : undefined;
};

export { preloadOf };
