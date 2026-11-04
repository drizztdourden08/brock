/* @layer renderer-shell @kind logic */
import type { ArchipelagoConnection } from '../../../../../../augment';
import type { ServerSetupDraft } from '../ServerSetup.type';

const draftOf = (connection: ArchipelagoConnection): ServerSetupDraft => ({
  serverUrl: connection.serverUrl ?? '',
  slotName: connection.slotName ?? '',
  password: connection.password ?? '',
});

export { draftOf };
