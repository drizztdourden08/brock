/* @layer renderer-shell @kind logic */
import { joinServerAddress } from '../../../archipelago';
import type { ConnectionForm } from './connection-form.type';

const connectionAddress = ({ host, port }: Pick<ConnectionForm, 'host' | 'port'>): string =>
  port.trim() === '' ? host.trim() : joinServerAddress({ host, port });

export { connectionAddress };
