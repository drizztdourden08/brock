/* @layer electron-main @kind logic */
import { PROCESS_ENV_DENY_NAMES, PROCESS_ENV_DENY_PREFIXES, PROCESS_ENV_MESSAGE, PROCESS_ENV_NAME } from './process-job.constants';
import type { EnvScan, ProcessAllow } from './process-job.type';

const clean = (value: unknown): value is string => typeof value === 'string' && !value.includes('\0');

const isDenied = (name: string): boolean => {
  const upper = name.toUpperCase();
  return PROCESS_ENV_DENY_NAMES.includes(upper) || PROCESS_ENV_DENY_PREFIXES.some((prefix) => upper.startsWith(prefix));
};

const checkEntry = (key: string, value: unknown, scan: EnvScan): string | null => {
  const name = scan.fold(key);
  if (!PROCESS_ENV_NAME.test(key) || !clean(value) || scan.seen.has(name)) return PROCESS_ENV_MESSAGE;
  scan.seen.add(name);
  return isDenied(name) && !scan.allowed.includes(name) ? `The environment may not set ${key}.` : null;
};

const checkEnv = (env: unknown, allow: ProcessAllow, platform: NodeJS.Platform): string | null => {
  if (env === undefined) return null;
  if (typeof env !== 'object' || env === null) return PROCESS_ENV_MESSAGE;
  const fold = (key: string): string => (platform === 'win32' ? key.toUpperCase() : key);
  const scan: EnvScan = { allowed: (allow.env ?? []).map(fold), seen: new Set<string>(), fold };
  for (const [key, value] of Object.entries(env)) {
    const problem = checkEntry(key, value, scan);
    if (problem) return problem;
  }
  return null;
};

export { checkEnv };
