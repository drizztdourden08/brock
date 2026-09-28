/* @layer renderer-shell @kind constants */
import type { LogLevel } from '@drizztdourden08/brock-core';
import type { MenuItem } from '../../menu/menu.type';

const NO_MODULES: never[] = [];
const NO_MENU: never[] = [];
const PROFILES_SCREEN = 'profiles';
const CREDITS_SCREEN = 'credits';
const LEVELS: readonly LogLevel[] = ['info', 'warn', 'error'];
const CHROMELESS_WINDOW_MODES: readonly string[] = ['borderless', 'fullscreen'];

const HOME_ENTRY: Omit<MenuItem, 'screen'> = { key: 'home', label: 'Home', icon: 'house' };

const TOP_ENTRIES: readonly MenuItem[] = [
  { key: 'profiles', label: 'Profiles', icon: 'users', screen: PROFILES_SCREEN },
  { key: 'settings', label: 'Settings', icon: 'settings', screen: 'settings' },
];

const CREDITS_ENTRY: MenuItem = { key: 'credits', label: 'Credits', icon: 'file-text', screen: CREDITS_SCREEN };
const ABOUT_ENTRY: MenuItem = { key: 'about', label: 'About', icon: 'info', screen: 'about' };
const QUIT_ENTRY: Omit<MenuItem, 'onClick'> = { key: 'quit', label: 'Quit', icon: 'log-out' };
const DEV_CONSOLE_ENTRY: Omit<MenuItem, 'onClick'> = { key: 'dev-console', label: 'Dev Console', icon: 'cpu', section: 'advanced', devOnly: true };

export {
  ABOUT_ENTRY, CHROMELESS_WINDOW_MODES, CREDITS_ENTRY, CREDITS_SCREEN, DEV_CONSOLE_ENTRY, HOME_ENTRY, LEVELS, NO_MENU, NO_MODULES,
  PROFILES_SCREEN, QUIT_ENTRY, TOP_ENTRIES,
};
