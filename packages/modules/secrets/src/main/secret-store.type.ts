/* @layer electron-main @kind types */
import type { SecretMeta } from '../secrets.type';

interface SecretStore {
  canStore: () => boolean;
  set: (name: string, value: string, label?: string) => Promise<void>;
  get: (name: string) => Promise<string | null>;
  has: (name: string) => Promise<boolean>;
  list: () => Promise<SecretMeta[]>;
  delete: (name: string) => Promise<void>;
}

export type { SecretStore };
