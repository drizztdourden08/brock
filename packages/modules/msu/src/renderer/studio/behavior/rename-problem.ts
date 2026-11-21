/* @layer renderer-shell @kind logic */
import type { I18n } from '@drizztdourden08/brock-core/i18n';
import { extensionOf, sanitizeFileName } from './track-file-name';

const renameProblem = (from: string, to: string, taken: Set<string>, t: I18n['t']): string | null => {
  if (to.length === 0) return t('msu:rename.empty');
  if (to !== sanitizeFileName(to)) return t('msu:rename.badChars');
  if (extensionOf(to) !== extensionOf(from)) return t('msu:rename.extension');
  if (taken.has(to)) return t('msu:rename.taken', { name: to });
  return null;
};

export { renameProblem };
