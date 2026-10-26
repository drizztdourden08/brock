/* @layer renderer-shell @kind constants */
const CONTEXT_MENU_ATTRIBUTE = 'data-context-menu';

const CONTEXT_MENU_DATA_ATTRIBUTE = 'data-context-menu-data';

const CONTEXT_MENU_TYPING_ATTRIBUTE = 'data-context-menu-typing';

const NATIVE_MENU_ATTRIBUTE = 'data-native-menu';

const CONTEXT_MENU_SEPARATOR = 'separator';

const CONTEXT_MENU_ZONE = 'brock.context-menu';

const CONTEXT_MENU_LABEL = 'Open the context menu';

const CONTEXT_MENU_NAME = 'Context menu';

const CONTEXT_MENU_CHORDS: readonly string[] = ['Shift+F10', 'ContextMenu'];

const CONTEXT_MENU_SELECTOR = `[${CONTEXT_MENU_ATTRIBUTE}], [data-command-zone]`;

const LONG_PRESS_MS = 500;

const PRESS_SLOP = 10;

const MAX_SUBMENU_DEPTH = 2;

const MAX_TOP_ENTRIES = 12;

const MENU_ROLE_SELECTOR = '[role="menu"]';

export {
  CONTEXT_MENU_ATTRIBUTE, CONTEXT_MENU_CHORDS, CONTEXT_MENU_DATA_ATTRIBUTE, CONTEXT_MENU_LABEL, CONTEXT_MENU_NAME, CONTEXT_MENU_SELECTOR, CONTEXT_MENU_SEPARATOR, CONTEXT_MENU_TYPING_ATTRIBUTE, CONTEXT_MENU_ZONE,
  LONG_PRESS_MS, MAX_SUBMENU_DEPTH, MAX_TOP_ENTRIES, MENU_ROLE_SELECTOR, NATIVE_MENU_ATTRIBUTE, PRESS_SLOP,
};
