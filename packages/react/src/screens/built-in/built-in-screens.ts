/* @layer renderer-shell @kind logic */
import type { ScreenDef } from '../screen.type';
import { createAboutScreen } from './AboutScreen';
import type { BuiltInScreenOptions } from './built-in-screens.type';
import { createCreditsScreen } from './create-credits-screen';
import { profilesScreen } from './ProfilesScreen';
import { settingsScreen } from './SettingsScreen';

const createBuiltInScreens = (options: BuiltInScreenOptions): ScreenDef[] => [
  profilesScreen,
  ...(options.settings === false ? [] : [settingsScreen]),
  createAboutScreen(options),
  ...(options.credits === undefined ? [] : [createCreditsScreen(options.credits)]),
];

export { createBuiltInScreens };
