/* @layer electron-main @kind logic */
import { app } from 'electron';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { APP_STATE_FILE } from '@drizztdourden08/brock-core/storage';
import { cleanPreference } from '../preference/clean-preference';
import { DATA_DIR } from './i18n-main.constants';

const preferenceOf = (parsed: unknown): string | null =>
  (typeof parsed === 'object' && parsed !== null && 'locale' in parsed ? cleanPreference(parsed.locale) : null);

const readStoredPreference = (): string | null => {
  const file = join(app.getPath('userData'), DATA_DIR, APP_STATE_FILE);
  if (!existsSync(file)) return null;
  try {
    return preferenceOf(JSON.parse(readFileSync(file, 'utf8')));
  } catch {
    return null;
  }
};

export { readStoredPreference };
