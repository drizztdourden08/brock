/* @layer renderer-shell @kind hook */
import type { WindowTitleBarAction } from '@drizztdourden08/tessera/composites';
import type { TitleBarActionSource } from '../../../modules/renderer-module.type';
import { useTitleBarActions } from '../../../shell/TitleBar/behavior/useTitleBarActions';
import { useWindowGroupTitleAction } from '../../../widgets/useWindowGroupTitleAction';

const useShellActions = (sources: readonly TitleBarActionSource[], windowChrome: boolean): WindowTitleBarAction[] => {
  const sourced = useTitleBarActions(sources);
  const groupAction = useWindowGroupTitleAction(windowChrome);
  return groupAction ? [...sourced, groupAction] : sourced;
};

export { useShellActions };
