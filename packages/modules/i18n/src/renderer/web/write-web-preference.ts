/* @layer renderer-shell @kind logic */
import { STORAGE_KEY } from '../i18n-renderer.constants';

const writeWebPreference = (preference: string | null): void => {
  try {
    if (preference === null) localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, preference);
  } catch {
    return undefined;
  }
};

export { writeWebPreference };
