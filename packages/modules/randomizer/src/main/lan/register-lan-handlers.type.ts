/* @layer electron-main @kind types */
import type { MainContext } from '@drizztdourden08/brock-electron/main';

type LanHandlerContext = Pick<MainContext, 'handle' | 'emit' | 'product'>;

export type { LanHandlerContext };
