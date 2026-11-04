/* @layer core @kind types */
import type { ConnectionState } from '../network/network-status.type';

interface ConnectionUpdate {
  state: ConnectionState;
  slotName?: string;
  error?: string;
}

export type { ConnectionUpdate };
