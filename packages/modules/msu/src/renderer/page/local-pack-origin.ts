/* @layer renderer-shell @kind logic */
import type { I18n } from '@drizztdourden08/brock-core/i18n';

const promptFor = (packName: string, trashable: boolean, t: I18n['t']) => ({
  title: t('msu:delete.title'),
  message: t('msu:delete.message', { name: packName, trashable: trashable ? 'yes' : 'no' }),
});

export { promptFor };
