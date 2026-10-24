/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import { useEscapeStack } from '@drizztdourden08/tessera/primitives';
import { dispatchCommand } from '../../../commands/dispatch-command';
import { useKeymapSync } from '../../../commands/useKeymapSync';
import { useNavigationStore } from '../../../navigation/useNavigationStore';
import { useProfilesStore } from '../../../stores/useProfilesStore';
import { useScreenRegistry } from '../../../screens/useScreenRegistry';
import type { ScreenDef } from '../../../screens/screen.type';
import { isScreenAllowed } from '../../../screens/is-screen-allowed';
import { touringHolds } from '../../../tours/touring-key';
import { useBrock } from '../../useBrock';
import { useDeveloperTools } from '../../useDeveloperTools';
import { handleShellKey } from './handle-shell-key';
import { useEditAnswer } from './useEditAnswer';
import { profilelessEscape } from './profileless-escape';
import { useRouteCommands } from './useRouteCommands';
import { useShellCommands } from './useShellCommands';

const useKeyboardShortcuts = (): void => {
  const { home: base, homeScreen } = useBrock();
  const registry = useScreenRegistry();
  const developerTools = useDeveloperTools();
  const escapes = useEscapeStack();
  useShellCommands();
  useRouteCommands();
  useKeymapSync();
  useEditAnswer(base);

  useEffect(() => {
    const allowed = (screen: ScreenDef | undefined): screen is ScreenDef =>
      screen !== undefined && isScreenAllowed(screen, developerTools, useProfilesStore.getState().active !== null);
    const context = {
      home: () => (allowed(registry.get(homeScreen)) ? homeScreen : profilelessEscape.home()),
      holds: profilelessEscape.holds,
      reopenable: () => allowed(registry.get(useNavigationStore.getState().closed?.active ?? '')),
      escapes,
    };
    const handler = (e: KeyboardEvent) => {
      if (touringHolds(e)) return;
      if (handleShellKey(e, context)) return;
      dispatchCommand(e, useNavigationStore.getState().active ?? base);
    };
    const root = document.documentElement;
    root.addEventListener('keydown', handler);
    return () => root.removeEventListener('keydown', handler);
  }, [base, homeScreen, registry, developerTools, escapes]);
};

export { useKeyboardShortcuts };
