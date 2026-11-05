/* @layer electron-main @kind logic */
import { memoByContext } from '@drizztdourden08/brock-electron/context';
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import type { MsuMainHolder } from './msu-main-state.type';

const msuMainState = memoByContext<MainContext, MsuMainHolder>(() => ({ options: null }));

export { msuMainState };
