/* @layer renderer-shell @kind logic */
import { cleanPreference } from '../../preference/clean-preference';
import { STORAGE_KEY } from '../i18n-renderer.constants';

const readWebPreference = (): string | null => {
  try {
    return cleanPreference(localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
};

export { readWebPreference };
