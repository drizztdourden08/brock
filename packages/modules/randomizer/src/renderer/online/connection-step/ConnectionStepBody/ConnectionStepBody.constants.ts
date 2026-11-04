/* @layer renderer-shell @kind constants */
import type { ConnectionTextField } from '../connection-form.type';

const CONNECTION_TEXT = {
  host: 'Host',
  port: 'Port',
  slotName: 'Slot name',
  password: 'Password',
  deathLink: 'DeathLink',
  check: 'Check server',
  checking: 'Checking',
  reachable: 'Server reachable.',
} as const;

const CONNECTION_TEXT_FIELDS: readonly ConnectionTextField[] = ['host', 'port', 'slotName'];

export { CONNECTION_TEXT, CONNECTION_TEXT_FIELDS };
