/* @layer renderer-shell @kind hook */
import type { WindowTitleBarAction } from '@drizztdourden08/tessera/composites';
import type { TitleBarActionSource } from '../../../modules/renderer-module.type';

const isAction = (action: WindowTitleBarAction | null): action is WindowTitleBarAction => action !== null;

const useTitleBarActions = (sources: readonly TitleBarActionSource[]): WindowTitleBarAction[] =>
  sources.map((source) => (typeof source === 'function' ? source() : source)).filter(isAction);

export { useTitleBarActions };
