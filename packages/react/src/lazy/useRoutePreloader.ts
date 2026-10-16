/* @layer renderer-shell @kind hook */
import { useContext, useMemo } from 'react';
import { ScreenRegistryContext } from '../screens/screen-registry-context';
import { routePreloader } from './route-preloader';

const skip = (): void => {};

const useRoutePreloader = (): ((route: string) => void) => {
  const registry = useContext(ScreenRegistryContext);
  return useMemo(() => (registry ? routePreloader(registry) : skip), [registry]);
};

export { useRoutePreloader };
