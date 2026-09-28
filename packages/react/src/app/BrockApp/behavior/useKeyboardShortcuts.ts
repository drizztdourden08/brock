/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import { usePlatform } from '../../../platform/usePlatform';
import { nav } from '../../../navigation/nav';
import { useNavigationStore } from '../../../navigation/useNavigationStore';
import { useDialogStore } from '../../../stores/useDialogStore';
import { useProfilesStore } from '../../../stores/useProfilesStore';
import { useScreenRegistry } from '../../../screens/useScreenRegistry';
import type { ScreenDef } from '../../../screens/screen.type';
import { matchesShortcut } from '../../../screens/matches-shortcut';

const isEditing = (target: EventTarget | null): boolean => {
  const el = target as HTMLElement | null;
  return el !== null && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable);
};

const closeTopmost = (e: KeyboardEvent): void => {
  const dialog = useDialogStore.getState();
  if (dialog.dialog) { e.preventDefault(); dialog.dismiss(); return; }
  if (useNavigationStore.getState().active !== null) { e.preventDefault(); nav.close(); }
};

const isShortcutFor = (screen: ScreenDef, e: KeyboardEvent, isDev: boolean, hasProfile: boolean): boolean => {
  if (!screen.shortcut || !matchesShortcut(e, screen.shortcut)) return false;
  if (screen.devOnly && !isDev) return false;
  return screen.requiresProfile === false || hasProfile;
};

const useKeyboardShortcuts = (): void => {
  const { window: win, info } = usePlatform();
  const registry = useScreenRegistry();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'Enter') {
        e.preventDefault();
        win.toggleFullscreen();
        return;
      }
      if (e.key === 'Escape') { closeTopmost(e); return; }
      if (isEditing(e.target) && !(e.ctrlKey || e.metaKey)) return;

      const hasProfile = useProfilesStore.getState().active !== null;
      const screen = registry.list().find((def) => isShortcutFor(def, e, info.isDev, hasProfile));
      if (!screen) return;
      e.preventDefault();
      nav.toggle(screen.id);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [win, info.isDev, registry]);
};

export { useKeyboardShortcuts };
