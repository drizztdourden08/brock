/* @layer renderer-shell @kind logic */
import type { I18n } from '@drizztdourden08/brock-core/i18n';

const singleDiscardMessage = (files: string[], t: I18n['t']): string =>
  t('msu:layer.singleDiscard', { kept: files[0] ?? '', count: files.length - 1 });

export { singleDiscardMessage };
