/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import { useScreenRegistry } from '../screens/useScreenRegistry';
import { routePreloader } from './route-preloader';

const useRoutePreloader = (): ((route: string) => void) => {
  const registry = useScreenRegistry();
  return useMemo(() => routePreloader(registry), [registry]);
};

export { useRoutePreloader };
