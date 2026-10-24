/* @layer electron-main @kind logic */
import { resolve } from 'path';
import { ARG_PREFIX } from '../main/app/user-data-arg.constants';
import { DATA_DIR_ENV, DEFAULT_DATA_DIR, STATE_DIR_ENV } from './data-dir.constants';

const firstStateDirectory = (value: string): string => (value.startsWith('/') ? (value.split(':')[0] ?? '') : value);

const resolveDataDir = (argv: readonly string[], env: Readonly<Record<string, string | undefined>>, cwd: string): string => {
  const flag = argv.find((arg) => arg.startsWith(ARG_PREFIX))?.slice(ARG_PREFIX.length);
  const candidates = [flag, env[DATA_DIR_ENV], firstStateDirectory(env[STATE_DIR_ENV] ?? ''), DEFAULT_DATA_DIR];
  return resolve(cwd, candidates.find((candidate) => candidate !== undefined && candidate !== '') ?? DEFAULT_DATA_DIR);
};

export { resolveDataDir };
