/* @layer renderer-shell @kind constants */
import type { LogLevel } from '@drizztdourden08/brock-core';
import { msg } from '@drizztdourden08/brock-core/i18n';
import type { TesseraOverrides } from '@drizztdourden08/tessera/primitives';
import { clipboardWriter } from '../../host/clipboard-writer';
import type { MenuOverrideRecord } from '../../menu/menu-config.type';
import type { MenuItemDef } from '../../menu/menu.type';
import type { RouteShortcut } from '../../navigation/navigation.type';
import { SETTINGS_TITLE } from '../../screens/conventions/screens.constants';
import type { ScreenDef } from '../../screens/screen.type';
import type { TabDef } from '../../settings/settings.type';

const NO_MODULES: never[] = [];
const NO_MENU: never[] = [];
const NO_MENU_OVERRIDES: readonly MenuOverrideRecord[] = [];
const NO_SCREENS: ScreenDef[] = [];
const NO_TABS: TabDef<object>[] = [];
const NO_SHORTCUTS: readonly RouteShortcut[] = [];
const NO_BACKGROUND = '';
const NO_MODULE_IDS: readonly string[] = [];
const PROFILES_SCREEN = 'profiles';
const CREDITS_SCREEN = 'credits';
const WIDGETS_SECTION = 'widgets';
const WIDGETS_SECTION_KEY = `section:${WIDGETS_SECTION}`;
const LEVELS: readonly LogLevel[] = ['info', 'warn', 'error'];
const CHROMELESS_WINDOW_MODES: readonly string[] = ['borderless', 'fullscreen'];
const MOUSE_BACK_BUTTON = 3;

const HOME_ENTRY: Omit<MenuItemDef, 'screen'> = { key: 'home', label: msg('brock-shell:menu.home'), icon: 'house', fresh: true };

const SETTINGS_ENTRY_KEY = 'settings';

const PROFILES_ENTRY: MenuItemDef = { key: 'profiles', label: msg('brock-shell:menu.profiles'), icon: 'users', screen: PROFILES_SCREEN };

const TOP_ENTRIES: readonly MenuItemDef[] = [
  PROFILES_ENTRY,
  { key: SETTINGS_ENTRY_KEY, label: SETTINGS_TITLE, icon: 'settings', screen: 'settings' },
];

const CREDITS_ENTRY: MenuItemDef = { key: 'credits', label: msg('brock-shell:menu.credits'), icon: 'file-text', screen: CREDITS_SCREEN };
const ABOUT_ENTRY: MenuItemDef = { key: 'about', label: msg('brock-shell:menu.about'), icon: 'info', screen: 'about' };
const QUIT_ENTRY: Omit<MenuItemDef, 'onClick'> = { key: 'quit', label: msg('brock-shell:menu.quit'), icon: 'log-out' };
const REPORT_BUG_ENTRY: Omit<MenuItemDef, 'onClick'> = { key: 'report-bug', label: msg('brock-shell:menu.reportBug'), icon: 'bug', section: 'advanced' };
const DEV_CONSOLE_ENTRY: Omit<MenuItemDef, 'onClick'> = { key: 'dev-console', label: msg('brock-shell:menu.devConsole'), icon: 'cpu', section: 'advanced', devOnly: true };

const TESSERA_OVERRIDES: TesseraOverrides = { writeText: clipboardWriter };

export {
  ABOUT_ENTRY, CHROMELESS_WINDOW_MODES, CREDITS_ENTRY, CREDITS_SCREEN, DEV_CONSOLE_ENTRY, HOME_ENTRY, LEVELS, MOUSE_BACK_BUTTON, NO_BACKGROUND, NO_MENU, NO_MENU_OVERRIDES, NO_MODULE_IDS, NO_MODULES, NO_SCREENS, NO_SHORTCUTS, NO_TABS,
  PROFILES_ENTRY, PROFILES_SCREEN, QUIT_ENTRY, REPORT_BUG_ENTRY, SETTINGS_ENTRY_KEY, TESSERA_OVERRIDES, TOP_ENTRIES, WIDGETS_SECTION, WIDGETS_SECTION_KEY,
};
