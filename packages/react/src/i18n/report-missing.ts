/* @layer renderer-shell @kind logic */
import type { MissingEvent } from '@drizztdourden08/brock-core/i18n';
import { getAppLog } from '../log/get-app-log';
import { I18N_LOG_CHANNEL, TESSERA_NAMESPACE } from './brock-layers.constants';

const describeEvent = (event: MissingEvent): string =>
  event.kind === 'missing' ? `missing ${event.key} for ${event.locale}` : `${event.key} for ${event.locale} fell back to ${event.from ?? '?'}`;

const reportMissing = (event: MissingEvent): void => {
  if (event.key.startsWith(`${TESSERA_NAMESPACE}:`)) return;
  getAppLog().log(I18N_LOG_CHANNEL, describeEvent(event), event.kind === 'missing' ? 'warn' : 'info');
};

export { reportMissing };
