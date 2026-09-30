/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import { usePlatform } from '../../../platform/usePlatform';
import { nav } from '../../../navigation/nav';
import { useProfilesStore } from '../../../stores/useProfilesStore';
import { useScreenRegistry } from '../../../screens/useScreenRegistry';
import type { ScreenDef } from '../../../screens/screen.type';
import { isScreenAllowed } from '../../../screens/is-screen-allowed';
import { useBrock } from '../../useBrock';
import { useDeveloperTools } from '../../useDeveloperTools';
import { closeTopmost } from './close-topmost';
import { shortcutTarget } from './shortcut-target';

const isEditing = (target: EventTarget | null): boolean => {
  const el = target as HTMLElement | null;
  return el !== null && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable);
};

const useKeyboardShortcuts = (): void => {
  const { window: win } = usePlatform();
  const { homeScreen, shortcuts } = useBrock();
  const registry = useScreenRegistry();
  const developerTools = useDeveloperTools();

  useEffect(() => {
    const allowed = (screen: ScreenDef | undefined): screen is ScreenDef =>
      screen !== undefined && isScreenAllowed(screen, developerTools, useProfilesStore.getState().active !== null);
    const handler = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'Enter') {
        e.preventDefault();
        win.toggleFullscreen();
        return;
      }
      if (e.key === 'Escape') { closeTopmost(e, allowed(registry.get(homeScreen)) ? homeScreen : null); return; }
      if (isEditing(e.target) && !(e.ctrlKey || e.metaKey)) return;

      const target = shortcutTarget(e, registry, shortcuts, allowed);
      if (target === undefined) return;
      e.preventDefault();
      nav.toggle(target);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [win, homeScreen, shortcuts, registry, developerTools]);
};

export { useKeyboardShortcuts };
