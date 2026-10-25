/* @layer renderer-shell @kind logic */
import { createBuiltInScreens } from '../../../screens/built-in/built-in-screens';
import { moduleBucketScreens } from '../../../screens/conventions/module-bucket-screens';
import { createScreenRegistry } from '../../../screens/create-screen-registry';
import type { ScreenRegistry } from '../../../screens/screen-registry.type';
import type { AppScreenRegistryInput } from './app-screen-registry.type';

const appScreenRegistry = (input: AppScreenRegistryInput): ScreenRegistry => {
  const { screens, tree, moduleScreens, moduleBuckets, legalText, credits, profilesRoute, singleProfile } = input;
  const all = createScreenRegistry([...screens, ...(tree?.screens ?? moduleBucketScreens(moduleBuckets)), ...moduleScreens]);
  for (const screen of createBuiltInScreens({ legalText, credits, settings: tree === null, profiles: profilesRoute === undefined && singleProfile !== true })) {
    if (!all.has(screen.id)) all.register(screen);
  }
  return all;
};

export { appScreenRegistry };
