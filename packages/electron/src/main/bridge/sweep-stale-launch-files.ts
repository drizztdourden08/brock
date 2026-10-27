/* @layer electron-main @kind logic */
import { access, readdir, readFile, rm, stat } from 'fs/promises';
import { dirname, join } from 'path';
import { BRIDGE_DISCOVERY_NAME, BRIDGE_PROFILE_LAUNCH_FILE, BRIDGE_PROFILE_LAUNCH_TTL_MS, BRIDGE_USER_DATA_ARG } from './bridge.constants';
import { isRecord } from './is-record';
import { parseJson } from './parse-json';

const exists = (path: string): Promise<boolean> =>
  access(path).then(
    () => true,
    () => false,
  );

const profileOf = async (file: string): Promise<string | null> => {
  try {
    const data = parseJson(await readFile(file, 'utf8'));
    const args: unknown[] = isRecord(data) && Array.isArray(data.args) ? data.args : [];
    for (const arg of args) {
      const match = typeof arg === 'string' ? BRIDGE_USER_DATA_ARG.exec(arg) : null;
      if (match?.[1]) return match[1];
    }
    return null;
  } catch {
    return null;
  }
};

const isStale = async (dir: string, name: string, key: string, now: number): Promise<boolean> => {
  const file = join(dir, name);
  const info = await stat(file);
  if (now - info.mtimeMs < BRIDGE_PROFILE_LAUNCH_TTL_MS) return false;
  if (await exists(join(dir, `${BRIDGE_DISCOVERY_NAME}.${key}.json`))) return false;
  const profile = await profileOf(file);
  return profile === null || !(await exists(profile));
};

const sweepStaleLaunchFiles = async (discoveryFile: string, now: number = Date.now()): Promise<number> => {
  const dir = dirname(discoveryFile);
  let removed = 0;
  for (const name of await readdir(dir)) {
    const key = BRIDGE_PROFILE_LAUNCH_FILE.exec(name)?.[1];
    if (!key) continue;
    try {
      if (!(await isStale(dir, name, key, now))) continue;
      await rm(join(dir, name), { force: true });
      removed += 1;
    } catch {
      continue;
    }
  }
  return removed;
};

export { sweepStaleLaunchFiles };
