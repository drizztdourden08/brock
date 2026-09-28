/* @layer electron-main @kind logic */
import { readJson, writeJson } from '@drizztdourden08/brock-core/storage';
import type { FileStore } from '@drizztdourden08/brock-core/platform';
import type { UpdaterPrefs } from '../updater.type';
import type { PrefsStore } from './updater-main.type';
import { DEFAULT_PREFS, PREFS_FILE } from './updater-main.constants';

const createPrefsStore = (files: FileStore): PrefsStore => ({
  read: async () => {
    const saved = await readJson<Partial<UpdaterPrefs>>(files, PREFS_FILE, DEFAULT_PREFS);
    return { allowPrerelease: saved.allowPrerelease === true };
  },
  write: (prefs) => writeJson(files, PREFS_FILE, prefs, { trailingNewline: true }),
});

export { createPrefsStore };
