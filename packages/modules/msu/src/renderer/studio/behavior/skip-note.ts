/* @layer renderer-shell @kind logic */
import type { I18n } from '@drizztdourden08/brock-core/i18n';

const skipNote = (result: { skippedNested?: number; skippedDuplicate?: number }, t: I18n['t']): string => {
  const parts: string[] = [];
  if (result.skippedNested) parts.push(t('msu:skip.nested', { count: result.skippedNested }));
  if (result.skippedDuplicate) parts.push(t('msu:skip.duplicate', { count: result.skippedDuplicate }));
  return parts.length === 0 ? '' : ` ${t('msu:skip.note', { parts: parts.join(', ') })}`;
};

export { skipNote };
