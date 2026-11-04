/* @layer renderer-shell @kind types */
import type { ArchipelagoConnection } from '../../../augment';

interface OnlineConnectionApi {
  connection: ArchipelagoConnection;
  patch(fields: ArchipelagoConnection): Promise<string | null>;
}

export type { OnlineConnectionApi };
