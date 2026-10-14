/* @layer renderer-shell @kind constants */
import type { LogLevel } from '@drizztdourden08/brock-core';
import type { TesseraOverrides } from '@drizztdourden08/tessera/primitives';
import { clipboardWriter } from '../../host/clipboard-writer';
import type { MenuItem } from '../../menu/menu.type';
import type { RouteShortcut } from '../../navigation/navigation.type';
import type { ScreenDef } from '../../screens/screen.type';
import type { TabDef } from '../../settings/settings.type';

const NO_MODULES: never[] = [];
const NO_MENU: never[] = [];
const NO_SCREENS: ScreenDef[] = [];
const NO_TABS: TabDef<object>[] = [];
const NO_SHORTCUTS: readonly RouteShortcut[] = [];
const NO_BACKGROUND = '';
const NO_MODULE_IDS: readonly string[] = [];
const PROFILES_SCREEN = 'profiles';
const CREDITS_SCREEN = 'credits';
const WIDGETS_SECTION = 'widgets';
const LEVELS: readonly LogLevel[] = ['info', 'warn', 'error'];
const CHROMELESS_WINDOW_MODES: readonly string[] = ['borderless', 'fullscreen'];
const MOUSE_BACK_BUTTON = 3;

const HOME_ENTRY: Omit<MenuItem, 'screen'> = { key: 'home', label: 'Home', icon: 'house', fresh: true };

const TOP_ENTRIES: readonly MenuItem[] = [
  { key: 'profiles', label: 'Profiles', icon: 'users', screen: PROFILES_SCREEN },
  { key: 'settings', label: 'Settings', icon: 'settings', screen: 'settings' },
];

const CREDITS_ENTRY: MenuItem = { key: 'credits', label: 'Credits', icon: 'file-text', screen: CREDITS_SCREEN };
const ABOUT_ENTRY: MenuItem = { key: 'about', label: 'About', icon: 'info', screen: 'about' };
const QUIT_ENTRY: Omit<MenuItem, 'onClick'> = { key: 'quit', label: 'Quit', icon: 'log-out' };
const REPORT_BUG_ENTRY: Omit<MenuItem, 'onClick'> = { key: 'report-bug', label: 'Report a bug', icon: 'bug', section: 'advanced' };
const DEV_CONSOLE_ENTRY: Omit<MenuItem, 'onClick'> = { key: 'dev-console', label: 'Dev Console', icon: 'cpu', section: 'advanced', devOnly: true };

const TESSERA_OVERRIDES: TesseraOverrides = { writeText: clipboardWriter };

export {
  ABOUT_ENTRY, CHROMELESS_WINDOW_MODES, CREDITS_ENTRY, CREDITS_SCREEN, DEV_CONSOLE_ENTRY, HOME_ENTRY, LEVELS, MOUSE_BACK_BUTTON, NO_BACKGROUND, NO_MENU, NO_MODULE_IDS, NO_MODULES, NO_SCREENS, NO_SHORTCUTS, NO_TABS,
  PROFILES_SCREEN, QUIT_ENTRY, REPORT_BUG_ENTRY, TESSERA_OVERRIDES, TOP_ENTRIES, WIDGETS_SECTION,
};
