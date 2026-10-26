/* @layer electron-main @kind logic */
import { PROCESS_ENV_ALLOW } from './process-job.constants';

const fold = (key: string, platform: NodeJS.Platform): string => (platform === 'win32' ? key.toUpperCase() : key);

const buildProcessEnv = (
  base: NodeJS.ProcessEnv,
  extra: Readonly<Record<string, string>> = {},
  platform: NodeJS.Platform = process.platform,
): Record<string, string> => {
  const added = new Set(Object.keys(extra).map((key) => fold(key, platform)));
  const env: Record<string, string> = {};
  for (const [key, value] of Object.entries(base)) {
    if (value === undefined || !PROCESS_ENV_ALLOW.includes(key.toUpperCase()) || added.has(fold(key, platform))) continue;
    env[key] = value;
  }
  return { ...env, ...extra };
};

export { buildProcessEnv };
