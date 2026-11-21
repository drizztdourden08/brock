/* @layer renderer-shell @kind hook */
import type { WindowTitleBarAction } from '@drizztdourden08/tessera/composites';
import { useText } from '../../../i18n/useText';
import type { TitleBarActionSource } from '../../../modules/renderer-module.type';
import type { TitleBarActionDef } from '../../../title-bar/title-bar-action.type';
import { resolveTitleBarAction } from '../../../title-bar/resolve-title-bar-action';

const isAction = (action: TitleBarActionDef | null): action is TitleBarActionDef => action !== null;

const useTitleBarActions = (sources: readonly TitleBarActionSource[]): WindowTitleBarAction[] => {
  const text = useText();
  return sources.map((source) => (typeof source === 'function' ? source() : source)).filter(isAction).map((action) => resolveTitleBarAction(action, text));
};

export { useTitleBarActions };
