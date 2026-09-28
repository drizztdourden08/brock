/* @layer electron-main @kind logic */
import { safeStorage } from 'electron';
import { assertSafeName, readJson, writeJson } from '@drizztdourden08/brock-core/storage';
import type { FileStore } from '@drizztdourden08/brock-core/platform';
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import type { SecretMeta } from '../secrets.type';
import type { SecretStore } from './secret-store.type';
import { DIR, INDEX_FILE } from './secret-store.constants';

const fileOf = (name: string): string => `${DIR}/${assertSafeName(name, 'secret name')}.bin`;

const canStore = (): boolean => safeStorage.isEncryptionAvailable();

const readIndex = (files: FileStore): Promise<SecretMeta[]> => readJson<SecretMeta[]>(files, INDEX_FILE, []);

const writeIndex = (files: FileStore, metas: SecretMeta[]): Promise<void> =>
  writeJson(files, INDEX_FILE, metas, { trailingNewline: true });

const upsertMeta = (metas: SecretMeta[], name: string, label: string | undefined, now: number): SecretMeta[] => {
  const existing = metas.find((m) => m.name === name);
  const next: SecretMeta = existing
    ? { ...existing, updatedAt: now, ...(label === undefined ? {} : { label }) }
    : { name, createdAt: now, updatedAt: now, ...(label === undefined ? {} : { label }) };
  return [...metas.filter((m) => m.name !== name), next].sort((a, b) => a.name.localeCompare(b.name));
};

const createSerialQueue = (): (<T>(job: () => Promise<T>) => Promise<T>) => {
  let tail: Promise<unknown> = Promise.resolve();
  return (job) => {
    const run = tail.then(job, job);
    tail = run.then(() => undefined, () => undefined);
    return run;
  };
};

const createSecretStore = ({ files, log }: Pick<MainContext, 'files' | 'log'>): SecretStore => {
  const serial = createSerialQueue();

  const set = (name: string, value: string, label?: string): Promise<void> =>
    serial(async () => {
      const file = fileOf(name);
      if (!canStore()) throw new Error('This system cannot keep a secret encrypted, so it was not stored.');
      await files.writeBytes(file, safeStorage.encryptString(value));
      await writeIndex(files, upsertMeta(await readIndex(files), name, label, Date.now()));
    });

  const get = async (name: string): Promise<string | null> => {
    const bytes = await files.readBytes(fileOf(name));
    if (!bytes || !canStore()) return null;
    try {
      return safeStorage.decryptString(Buffer.from(bytes));
    } catch (err) {
      log(`secret "${name}" could not be decrypted: ${err instanceof Error ? err.message : String(err)}`, 'warn');
      return null;
    }
  };

  const has = (name: string): Promise<boolean> => files.exists(fileOf(name));

  const list = (): Promise<SecretMeta[]> => serial(() => readIndex(files));

  const remove = (name: string): Promise<void> =>
    serial(async () => {
      const file = fileOf(name);
      await files.remove(file);
      await writeIndex(files, (await readIndex(files)).filter((m) => m.name !== name));
    });

  return { canStore, set, get, has, list, delete: remove };
};

export { createSecretStore };
