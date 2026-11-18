/* @layer renderer-shell @kind logic */
import { cleanPreference } from '../../../preference/clean-preference';
import { PROFILE_KEY } from '../../i18n-renderer.constants';

const profileLocaleOf = (settings: object, offered: readonly string[]): string | null => {
  const record: Partial<Record<string, unknown>> = settings;
  const tag = cleanPreference(record[PROFILE_KEY]);
  return tag !== null && offered.includes(tag) ? tag : null;
};

export { profileLocaleOf };
