/* @layer electron-main @kind logic */
import type { AppServices } from '@drizztdourden08/brock-core/augment';
import { servicesState } from './services-state';

const readServices = (): AppServices => {
  if (servicesState.value === null) throw new Error(servicesState.missing);
  return servicesState.value;
};

export { readServices };
