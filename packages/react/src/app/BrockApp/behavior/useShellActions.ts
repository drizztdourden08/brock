/* @layer renderer-shell @kind hook */
import type { WindowTitleBarAction } from '@drizztdourden08/tessera/composites';
import { useChordLookup } from '../../../commands/useChordLookup';
import type { TitleBarActionSource } from '../../../modules/renderer-module.type';
import { useTitleBarActions } from '../../../shell/TitleBar/behavior/useTitleBarActions';
import { withActionChord } from '../../../title-bar/with-action-chord';

const useShellActions = (sources: readonly TitleBarActionSource[]): WindowTitleBarAction[] => {
  const lookup = useChordLookup();
  return useTitleBarActions(sources).map((action) => withActionChord(action, lookup));
};

export { useShellActions };
