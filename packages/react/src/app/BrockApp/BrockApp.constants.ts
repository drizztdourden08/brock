/* @layer renderer-shell @kind constants */
import type { LogLevel } from '@drizztdourden08/brock-core';
import type { MenuItem } from '../../menu/menu.type';

const DEFAULT_LOGO = './logos/logo-128.png';
const NO_MODULES: never[] = [];
const NO_MENU: never[] = [];
const PROFILES_SCREEN = 'profiles';
const LEVELS: readonly LogLevel[] = ['info', 'warn', 'error'];

const BUILT_IN_ENTRIES: MenuItem[] = [
  { key: 'profiles', label: 'Profiles', screen: 'profiles' },
  { key: 'settings', label: 'Settings', screen: 'settings' },
  { key: 'about', label: 'About', screen: 'about' },
];

export { BUILT_IN_ENTRIES, DEFAULT_LOGO, LEVELS, NO_MENU, NO_MODULES, PROFILES_SCREEN };
