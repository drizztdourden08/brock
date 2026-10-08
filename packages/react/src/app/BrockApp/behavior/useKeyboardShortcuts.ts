/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import { useEscapeStack } from '@drizztdourden08/tessera/primitives';
import { usePlatform } from '../../../platform/usePlatform';
import { nav } from '../../../navigation/nav';
import { useProfilesStore } from '../../../stores/useProfilesStore';
import { useScreenRegistry } from '../../../screens/useScreenRegistry';
import type { ScreenDef } from '../../../screens/screen.type';
import { isScreenAllowed } from '../../../screens/is-screen-allowed';
import { touringHolds } from '../../../tours/touring-key';
import { useBrock } from '../../useBrock';
import { useDeveloperTools } from '../../useDeveloperTools';
import { handleShellKey } from './handle-shell-key';
import { shortcutTarget } from './shortcut-target';

const isEditing = (target: EventTarget | null): boolean => {
  const el = target as HTMLElement | null;
  return el !== null && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable);
};

const useKeyboardShortcuts = (): void => {
  const { window: win } = usePlatform();
  const { product, homeScreen, shortcuts } = useBrock();
  const fullscreenable = product.window.titleBar.controls.fullscreen;
  const registry = useScreenRegistry();
  const developerTools = useDeveloperTools();
  const escapes = useEscapeStack();

  useEffect(() => {
    const allowed = (screen: ScreenDef | undefined): screen is ScreenDef =>
      screen !== undefined && isScreenAllowed(screen, developerTools, useProfilesStore.getState().active !== null);
    const context = {
      toggleFullscreen: fullscreenable ? () => win.toggleFullscreen() : undefined,
      home: () => (allowed(registry.get(homeScreen)) ? homeScreen : null),
      escapes,
    };
    const handler = (e: KeyboardEvent) => {
      if (touringHolds(e)) return;
      if (handleShellKey(e, context)) return;
      if (isEditing(e.target) && !(e.ctrlKey || e.metaKey)) return;

      const target = shortcutTarget(e, registry, shortcuts, allowed);
      if (target === undefined) return;
      e.preventDefault();
      nav.toggle(target);
    };
    const root = document.documentElement;
    root.addEventListener('keydown', handler);
    return () => root.removeEventListener('keydown', handler);
  }, [win, fullscreenable, homeScreen, shortcuts, registry, developerTools, escapes]);
};

export { useKeyboardShortcuts };
