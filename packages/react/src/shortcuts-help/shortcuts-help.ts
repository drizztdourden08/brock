/* @layer renderer-shell @kind logic */
import { useShortcutsHelpStore } from './useShortcutsHelpStore';

const shortcutsHelp = {
  open: (): void => useShortcutsHelpStore.getState().show(),
  close: (): void => useShortcutsHelpStore.getState().hide(),
  toggle: (): void => useShortcutsHelpStore.getState().toggle(),
  isOpen: (): boolean => useShortcutsHelpStore.getState().open,
};

export { shortcutsHelp };
