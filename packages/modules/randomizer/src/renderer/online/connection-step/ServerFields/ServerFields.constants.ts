/* @layer renderer-shell @kind constants */
import { msg } from '@drizztdourden08/brock-core/i18n';
import type { ConnectionTextField } from '../connection-form.type';

const CONNECTION_TEXT = {
  host: msg('randomizer:connection.host'),
  port: msg('randomizer:connection.port'),
  slotName: msg('randomizer:connection.slotName'),
  password: msg('randomizer:connection.password'),
  deathLink: msg('randomizer:connection.deathLink'),
  check: msg('randomizer:connection.check'),
  checking: msg('randomizer:connection.checking'),
  reachable: msg('randomizer:connection.reachable'),
} as const;

const CONNECTION_TEXT_FIELDS: readonly ConnectionTextField[] = ['host', 'port', 'slotName'];

export { CONNECTION_TEXT, CONNECTION_TEXT_FIELDS };
