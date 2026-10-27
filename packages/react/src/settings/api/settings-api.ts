/* @layer renderer-shell @kind logic */
import { setSetting } from './set-setting';
import { settingsCatalog } from './settings-catalog';

const settingsApi = {
  catalog: settingsCatalog,
  set: setSetting,
};

export { settingsApi };
