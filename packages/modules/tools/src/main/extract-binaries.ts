/* @layer electron-main @kind logic */
import { chmod, mkdir, rename, rm } from 'fs/promises';
import { join } from 'path';
import type { InstallPlan } from './tools-main.type';
import { exeName } from './exe-name';
import { unpackInto } from './unpack-into';

const extractBinaries = async (archive: string, { def, download, cacheDir, platform }: InstallPlan): Promise<Record<string, string>> => {
  const names = def.binaries.map((binary) => exeName(binary, platform));
  const staging = `${cacheDir}.partial`;
  await rm(staging, { recursive: true, force: true });
  await mkdir(staging, { recursive: true });
  try {
    await unpackInto(archive, download.archive ?? 'zip', names, staging);
    if (platform !== 'win32') await Promise.all(names.map((name) => chmod(join(staging, name), 0o755)));
    await rm(cacheDir, { recursive: true, force: true });
    await rename(staging, cacheDir);
  } catch (err) {
    await rm(staging, { recursive: true, force: true });
    throw err;
  }
  return Object.fromEntries(def.binaries.map((binary) => [binary, join(cacheDir, exeName(binary, platform))]));
};

export { extractBinaries };
