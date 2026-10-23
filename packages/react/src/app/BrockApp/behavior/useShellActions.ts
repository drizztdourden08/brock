/* @layer renderer-shell @kind hook */
import type { WindowTitleBarAction } from '@drizztdourden08/tessera/composites';
import { useChordLookup } from '../../../commands/useChordLookup';
import { useCommandEnabled } from '../../../commands/useCommandEnabled';
import type { TitleBarActionSource } from '../../../modules/renderer-module.type';
import { useTitleBarActions } from '../../../shell/TitleBar/behavior/useTitleBarActions';
import { withActionChord } from '../../../title-bar/with-action-chord';
import { withActionState } from '../../../title-bar/with-action-state';

const useShellActions = (sources: readonly TitleBarActionSource[]): WindowTitleBarAction[] => {
  const lookup = useChordLookup();
  const enabled = useCommandEnabled();
  return useTitleBarActions(sources).map((action) => withActionState(withActionChord(action, lookup), enabled));
};

export { useShellActions };
