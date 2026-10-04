/* @layer electron-main @kind logic */
import type { AppServices } from '@drizztdourden08/brock-core/augment';
import { servicesState } from './services-state';
import { NOT_BUILT } from './services.constants';

const buildServices = async <C>(ctx: C, factory: ((ctx: C) => AppServices | Promise<AppServices>) | undefined): Promise<void> => {
  if (!factory || servicesState.value !== null) return;
  servicesState.missing = NOT_BUILT;
  servicesState.value = await factory(ctx);
};

export { buildServices };
