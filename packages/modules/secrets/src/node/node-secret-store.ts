/* @layer core @kind logic */
import { join } from 'node:path';
import { assertSafeName } from '@drizztdourden08/brock-core/storage';
import type { SecretMeta } from '../secrets.type';
import { createSerialQueue } from '../serial-queue';
import { envSecretName } from './env-secret-name';
import { readSecretsFile } from './read-secrets-file';
import { writeSecretsFile } from './write-secrets-file';
import { ENV_PREFIX, NODE_SECRETS_FILE } from './node-secret-store.constants';
import type { NodeSecretStore, NodeSecretStoreOptions } from './node-secret-store.type';

const metaOf = ({ name, createdAt, updatedAt, label }: SecretMeta): SecretMeta => ({
  name, createdAt, updatedAt, ...(label === undefined ? {} : { label }),
});

const createNodeSecretStore = ({ dataDir, env = process.env, envPrefix = ENV_PREFIX }: NodeSecretStoreOptions): NodeSecretStore => {
  const serial = createSerialQueue();
  const file = join(dataDir, NODE_SECRETS_FILE);

  const fromEnv = (name: string): string | null => {
    const value = env[envSecretName(assertSafeName(name, 'secret name'), envPrefix)];
    return value === undefined || value === '' ? null : value;
  };

  const set = (name: string, value: string, label?: string): Promise<void> =>
    serial(async () => {
      assertSafeName(name, 'secret name');
      const records = await readSecretsFile(file);
      const now = Date.now();
      const existing = records[name];
      const nextLabel = label ?? existing?.label;
      records[name] = {
        name, value, createdAt: existing?.createdAt ?? now, updatedAt: now,
        ...(nextLabel === undefined ? {} : { label: nextLabel }),
      };
      await writeSecretsFile(file, records);
    });

  const get = async (name: string): Promise<string | null> => {
    const override = fromEnv(name);
    if (override !== null) return override;
    return (await readSecretsFile(file))[name]?.value ?? null;
  };

  const has = async (name: string): Promise<boolean> => (await get(name)) !== null;

  const list = (): Promise<SecretMeta[]> =>
    serial(async () => Object.values(await readSecretsFile(file)).map(metaOf).sort((a, b) => a.name.localeCompare(b.name)));

  const remove = (name: string): Promise<void> =>
    serial(async () => {
      assertSafeName(name, 'secret name');
      const records = await readSecretsFile(file);
      if (!(name in records)) return;
      delete records[name];
      await writeSecretsFile(file, records);
    });

  return { encryptedAtRest: false, canStore: () => true, set, get, has, list, delete: remove };
};

export { createNodeSecretStore };
