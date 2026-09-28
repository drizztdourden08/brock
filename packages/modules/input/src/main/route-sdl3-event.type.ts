/* @layer electron-main @kind types */
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import type { ControllerRegistry } from './controller-registry.type';

type RouteInput = Pick<MainContext, 'emit' | 'log'> & { registry: ControllerRegistry };

export type { RouteInput };
