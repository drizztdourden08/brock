/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import type { ScreenRegistry } from '../screens/screen-registry.type';
import { preloadRoute } from './preload-route';

const useBootPreload = (registry: ScreenRegistry, routes: readonly string[]): void => {
  const key = routes.join('\n');
  useEffect(() => {
    for (const route of key.split('\n')) if (route) preloadRoute(registry, route);
  }, [registry, key]);
};

export { useBootPreload };
