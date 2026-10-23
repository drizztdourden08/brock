/* @layer electron-main @kind logic */
import { readdir, rm } from 'fs/promises';
import { join } from 'path';
import type { RecoverableSnapshot } from '@drizztdourden08/brock-core/platform';
import { assertSafeName } from '@drizztdourden08/brock-core/storage';
import { readOrNull } from '../storage/read-or-null';
import { writeAtomic } from '../storage/write-atomic';
import { pathExists } from './path-exists';
import { pathKey } from './path-key';
import { readRecoveryMeta } from './recovery-meta';
import { META_EXT, RECOVERY_DIR, SNAPSHOT_EXT } from './recovery-snapshots.constants';
import type { RecoveryDeps, RecoverySnapshots } from './recovery-snapshots.type';

const namesIn = async (dir: string): Promise<string[]> => {
  try {
    return await readdir(dir);
  } catch {
    return [];
  }
};

const createRecoverySnapshots = (deps: RecoveryDeps): RecoverySnapshots => {
  const now = deps.now ?? Date.now;
  const dirOf = (profileId: string): string => join(deps.profileDir(profileId), RECOVERY_DIR);
  const dataFile = (profileId: string, key: string): string => join(dirOf(profileId), `${assertSafeName(key, 'snapshot key')}${SNAPSHOT_EXT}`);
  const metaFile = (profileId: string, key: string): string => join(dirOf(profileId), `${assertSafeName(key, 'snapshot key')}${META_EXT}`);

  const save: RecoverySnapshots['save'] = async (profileId, key, data, meta) => {
    const entry: RecoverableSnapshot = { key, name: meta.name ?? null, path: meta.path ?? null, savedAt: now(), size: data.byteLength };
    await writeAtomic(dataFile(profileId, key), data);
    await writeAtomic(metaFile(profileId, key), JSON.stringify(entry));
  };

  const list: RecoverySnapshots['list'] = async (profileId) => {
    const names = (await namesIn(dirOf(profileId))).filter((name) => name.endsWith(META_EXT));
    const metas = await Promise.all(names.map((name) => readRecoveryMeta(join(dirOf(profileId), name))));
    const found = metas.filter((meta): meta is RecoverableSnapshot => meta !== null);
    const whole = await Promise.all(found.map((meta) => pathExists(dataFile(profileId, meta.key))));
    return found.filter((_meta, index) => whole[index] === true).sort((a, b) => b.savedAt - a.savedAt);
  };

  const read: RecoverySnapshots['read'] = async (profileId, key) => readOrNull(dataFile(profileId, key));

  const discard: RecoverySnapshots['discard'] = async (profileId, key) => {
    await rm(metaFile(profileId, key), { force: true });
    await rm(dataFile(profileId, key), { force: true });
  };

  const discardForPath: RecoverySnapshots['discardForPath'] = async (profileId, path) => {
    const matching = (await list(profileId)).filter((meta) => meta.path !== null && pathKey(meta.path) === pathKey(path));
    await Promise.all(matching.map((meta) => discard(profileId, meta.key)));
  };

  return { save, list, read, discard, discardForPath };
};

export { createRecoverySnapshots };
