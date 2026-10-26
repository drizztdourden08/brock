/* @layer electron-main @kind logic */
import { PROCESS_ENV_ALLOW } from './process-job.constants';

const buildProcessEnv = (base: NodeJS.ProcessEnv, extra: Readonly<Record<string, string>> = {}): Record<string, string> => {
  const env: Record<string, string> = {};
  for (const [key, value] of Object.entries(base)) {
    if (value !== undefined && PROCESS_ENV_ALLOW.includes(key.toUpperCase())) env[key] = value;
  }
  return { ...env, ...extra };
};

export { buildProcessEnv };
