/* @layer renderer-shell @kind types */
import type { SecretMeta } from '../secrets.type';

interface SecretsState {
  metas: SecretMeta[];
  canStore: boolean;
  loaded: boolean;
  refresh: () => Promise<void>;
  set: (name: string, value: string, label?: string) => Promise<void>;
  remove: (name: string) => Promise<void>;
}

export type { SecretsState };
