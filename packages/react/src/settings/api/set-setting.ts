/* @layer renderer-shell @kind logic */
import { controlSources } from '../../app/control-sources';
import { patchAt } from '../../volume/patch-at';
import { readPath } from '../../volume/read-path';
import { findSetting } from './find-setting';
import type { SettingSetFailure, SettingSetResult } from './settings-catalog.type';
import { validateSetting } from './validate-setting';

const refuse = (why: SettingSetFailure, reason: string): SettingSetResult => ({ ok: false, why, reason });

const setSetting = (key: string, value: unknown): SettingSetResult => {
  const { tabs, settings: store } = controlSources.get();
  const state = store?.getState();
  if (state?.hydrated !== true) return refuse('not-ready', 'The settings are not loaded yet.');
  const found = findSetting(tabs, state.settings, key);
  if (found === null) return refuse('unknown', `No setting has the key "${key}".`);
  if (found.custom) return refuse('scope', `"${key}" is not an app setting.`);
  const problem = validateSetting(found.item.control, readPath(state.settings, key), value);
  if (problem !== null) return refuse('invalid', problem);
  state.patch(patchAt(state.settings, [[key, value]]));
  return { ok: true };
};

export { setSetting };
