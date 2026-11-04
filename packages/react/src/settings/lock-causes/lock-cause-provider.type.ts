/* @layer renderer-shell @kind types */
import type { SettingLockCause } from '../settings.type';

interface LockCauseProvider<S extends object = object> {
  id: string;
  order: number;
  causeOf: (key: string, settings: S) => SettingLockCause | null;
}

export type { LockCauseProvider };
