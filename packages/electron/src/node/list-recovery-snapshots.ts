/* @layer electron-main @kind logic */
import { join } from 'path';
import { namesIn } from '../main/documents/names-in';
import { SNAPSHOT_EXT } from '../main/documents/recovery-snapshots.constants';
import { dataRootOf } from '../main/paths/data-root-of';
import { PROFILES_DIR } from './recovery-dir.constants';
import { recoveryDir } from './recovery-dir';

const profileIdsOf = async (userDataDir: string, profileId: string | undefined): Promise<string[]> =>
  profileId === undefined ? namesIn(join(dataRootOf(userDataDir), PROFILES_DIR)) : [profileId];

const snapshotsIn = async (dir: string): Promise<string[]> => (await namesIn(dir)).filter((name) => name.endsWith(SNAPSHOT_EXT)).map((name) => join(dir, name));

const listRecoverySnapshots = async (userDataDir: string, profileId?: string): Promise<string[]> => {
  const ids = await profileIdsOf(userDataDir, profileId);
  const found = await Promise.all(ids.map((id) => snapshotsIn(recoveryDir(userDataDir, id))));
  return found.flat().sort();
};

export { listRecoverySnapshots };
