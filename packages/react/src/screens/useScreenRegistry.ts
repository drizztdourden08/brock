/* @layer renderer-shell @kind hook */
import { useContext } from 'react';
import { ScreenRegistryContext } from './screen-registry-context';
import type { ScreenRegistry } from './screen-registry.type';

const useScreenRegistry = (): ScreenRegistry => {
  const registry = useContext(ScreenRegistryContext);
  if (!registry) throw new Error('useScreenRegistry must be used within <BrockApp>');
  return registry;
};

export { useScreenRegistry };
