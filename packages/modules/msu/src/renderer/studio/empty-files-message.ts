/* @layer renderer-shell @kind logic */
import type { I18n } from '@drizztdourden08/brock-core/i18n';

const emptyFilesMessage = (fileCount: number, supersededOnly: boolean, filter: string, t: I18n['t']): string => {
  if (fileCount === 0) return t('msu:files.empty');
  if (supersededOnly) return t('msu:files.noSuperseded');
  return t('msu:files.noMatch', { filter });
};

export { emptyFilesMessage };
