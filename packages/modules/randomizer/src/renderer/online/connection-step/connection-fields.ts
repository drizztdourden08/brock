/* @layer renderer-shell @kind logic */
import type { ArchipelagoConnection } from '../../../augment';
import { connectionAddress } from './connection-address';
import type { ConnectionForm } from './connection-form.type';

const connectionFields = (form: ConnectionForm): ArchipelagoConnection => {
  const fields: ArchipelagoConnection = { slotName: form.slotName, deathLink: form.deathLink };
  if (form.host.trim() !== '') fields.serverUrl = connectionAddress(form);
  if (form.password !== '') fields.password = form.password;
  return fields;
};

export { connectionFields };
