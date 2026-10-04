/* @layer renderer-shell @kind hook */
import type { WindowTitleBarAction } from '@drizztdourden08/tessera/composites';
import type { TitleBarActionSource } from '../../../modules/renderer-module.type';
import { useTitleBarActions } from '../../../shell/TitleBar/behavior/useTitleBarActions';

const useShellActions = (sources: readonly TitleBarActionSource[]): WindowTitleBarAction[] => useTitleBarActions(sources);

export { useShellActions };
