/* @layer electron-main @kind logic */
import type { ServicesState } from './services-state.type';
import { NO_FACTORY } from './services.constants';

const servicesState: ServicesState = { value: null, missing: NO_FACTORY };

export { servicesState };
