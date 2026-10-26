/* @layer electron-main @kind logic */
import { isAbsolute } from 'path';
import { PROCESS_ARG_MAX_CHARS, PROCESS_ARGS_MAX, PROCESS_ENV_NAME } from './process-job.constants';
import type { ProcessSpec } from './process-job.type';

const clean = (value: unknown): value is string => typeof value === 'string' && !value.includes('\0');

const badPath = (value: unknown): boolean => !clean(value) || value === '' || !isAbsolute(value);

const badArgs = (args: unknown): boolean =>
  !Array.isArray(args) || args.length > PROCESS_ARGS_MAX || args.some((arg) => !clean(arg) || arg.length > PROCESS_ARG_MAX_CHARS);

const badEnv = (env: unknown): boolean => {
  if (env === undefined) return false;
  if (typeof env !== 'object' || env === null) return true;
  return Object.entries(env).some(([key, value]) => !PROCESS_ENV_NAME.test(key) || !clean(value));
};

const checkProcessSpec = (spec: ProcessSpec): string | null => {
  if (badPath(spec.command)) return 'The command must be an absolute path.';
  if (/\.(bat|cmd)$/i.test(spec.command)) return 'A batch file cannot run without a shell.';
  if (badArgs(spec.args)) return 'The arguments must be a list of plain strings.';
  if (spec.cwd !== undefined && badPath(spec.cwd)) return 'The working directory must be an absolute path.';
  if (badEnv(spec.env)) return 'The environment must map plain names to plain strings.';
  return null;
};

export { checkProcessSpec };
