/* @layer core @kind types */
import type { SecretMeta } from '../secrets.type';
import type { SecretStore } from '../secret-store.type';

interface NodeSecretStoreOptions {
  dataDir: string;
  env?: Readonly<Record<string, string | undefined>>;
  envPrefix?: string;
}

interface NodeSecretRecord extends SecretMeta {
  value: string;
}

interface NodeSecretStore extends SecretStore {
  readonly encryptedAtRest: false;
}

export type { NodeSecretStoreOptions, NodeSecretRecord, NodeSecretStore };
