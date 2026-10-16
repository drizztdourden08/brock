/* @layer electron-main @kind logic */
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { session } from 'electron';
import { CLEAR_CACHE_ENV, DEPS_METADATA_ENV, DEV_CACHE_KEY_FILE } from './dev-cache.constants';
import { devCachePlan } from './dev-cache-plan';

const readText = (file: string | undefined): string | null => {
  if (!file) return null;
  try {
    return readFileSync(file, 'utf8').trim();
  } catch {
    return null;
  }
};

const writeKey = (file: string, hash: string): boolean => {
  try {
    writeFileSync(file, hash);
    return true;
  } catch {
    return false;
  }
};

const refreshDevCache = async (userData: string, env: NodeJS.ProcessEnv = process.env): Promise<boolean> => {
  const keyFile = join(userData, DEV_CACHE_KEY_FILE);
  const plan = devCachePlan(readText(env[DEPS_METADATA_ENV]), readText(keyFile), env[CLEAR_CACHE_ENV] === '1');
  if (plan.clear) await session.defaultSession.clearCache();
  if (plan.hash !== null) writeKey(keyFile, plan.hash);
  return plan.clear;
};

export { refreshDevCache };
