/* @layer renderer-shell @kind logic */
import type { ScreenDef } from '../screen.type';
import { createAboutScreen } from './AboutScreen';
import type { AboutScreenOptions } from './AboutScreen';
import { profilesScreen } from './ProfilesScreen';
import { settingsScreen } from './SettingsScreen';

const createBuiltInScreens = (options: AboutScreenOptions): ScreenDef[] => [
  profilesScreen,
  settingsScreen,
  createAboutScreen(options),
];

export { createBuiltInScreens };
