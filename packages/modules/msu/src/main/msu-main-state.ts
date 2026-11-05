/* @layer electron-main @kind logic */
import { memoByContext } from '@drizztdourden08/brock-electron/context';
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import type { MsuMainOptions } from './msu-main-options.type';

interface MsuMainHolder {
  options: MsuMainOptions | null;
}

const msuMainState = memoByContext<MainContext, MsuMainHolder>(() => ({ options: null }));

export { msuMainState };
