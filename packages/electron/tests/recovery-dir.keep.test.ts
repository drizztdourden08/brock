/* @layer electron-main @kind test */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { mkdir, mkdtemp, rm, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import { listRecoverySnapshots, recoveryDir, SNAPSHOT_EXT } from '../src/node';

let userData = '';

const seed = async (profileId: string, ...names: string[]): Promise<void> => {
  const dir = recoveryDir(userData, profileId);
  await mkdir(dir, { recursive: true });
  await Promise.all(names.map((name) => writeFile(join(dir, name), 'x')));
};

beforeEach(async () => {
  userData = await mkdtemp(join(tmpdir(), 'brock-recovery-dir-'));
});

afterEach(async () => {
  await rm(userData, { recursive: true, force: true });
});

describe('K2 recovery folder helpers of the node entry', { tags: ['critical'] }, () => {
  it('places the recovery folder under Data/profiles/<id>/recovery', () => {
    expect(recoveryDir(userData, 'ab12')).toBe(join(userData, 'Data', 'profiles', 'ab12', 'recovery'));
  });

  it('returns an empty list while the folder is missing', async () => {
    expect(await listRecoverySnapshots(userData, 'ab12')).toEqual([]);
    expect(await listRecoverySnapshots(userData)).toEqual([]);
  });

  it('lists only the snapshot files of one profile', async () => {
    await seed('ab12', `doc${SNAPSHOT_EXT}`, 'doc.json');
    await seed('cd34', `other${SNAPSHOT_EXT}`);
    expect(await listRecoverySnapshots(userData, 'ab12')).toEqual([join(recoveryDir(userData, 'ab12'), `doc${SNAPSHOT_EXT}`)]);
  });

  it('lists the snapshot files of every profile when no id is given', async () => {
    await seed('ab12', `doc${SNAPSHOT_EXT}`);
    await seed('cd34', `other${SNAPSHOT_EXT}`);
    expect(await listRecoverySnapshots(userData)).toEqual([join(recoveryDir(userData, 'ab12'), `doc${SNAPSHOT_EXT}`), join(recoveryDir(userData, 'cd34'), `other${SNAPSHOT_EXT}`)]);
  });

  it('refuses an unsafe profile id', () => {
    expect(() => recoveryDir(userData, '../x')).toThrow();
  });
});
