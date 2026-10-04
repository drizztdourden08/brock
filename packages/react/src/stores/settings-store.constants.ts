/* @layer renderer-shell @kind constants */
import type { SettingsSaveState } from './settings-store.type';

const DEFAULT_SAVE_DELAY_MS = 300;
const NO_SAVE: SettingsSaveState = { saveStatus: 'idle', saveError: null, savedAt: null };

export { DEFAULT_SAVE_DELAY_MS, NO_SAVE };
