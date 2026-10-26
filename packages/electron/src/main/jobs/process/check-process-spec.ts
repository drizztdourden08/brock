/* @layer electron-main @kind logic */
import { isAbsolute, win32 } from 'path';
import { checkCommand } from './check-command';
import { checkEnv } from './check-env';
import { PROCESS_ARG_MAX_CHARS, PROCESS_ARGS_MAX } from './process-job.constants';
import type { ProcessAllow, ProcessSpec } from './process-job.type';

const clean = (value: unknown): value is string => typeof value === 'string' && !value.includes('\0');

const badArgs = (args: unknown): boolean =>
  !Array.isArray(args) || args.length > PROCESS_ARGS_MAX || args.some((arg) => !clean(arg) || arg.length > PROCESS_ARG_MAX_CHARS);

const badDirectory = (cwd: unknown, platform: NodeJS.Platform): boolean => {
  if (!clean(cwd) || cwd === '') return true;
  return platform === 'win32' ? !win32.isAbsolute(cwd) : !isAbsolute(cwd);
};

const checkProcessSpec = (spec: ProcessSpec, allow: ProcessAllow = {}, platform: NodeJS.Platform = process.platform): string | null => {
  const problem = checkCommand(spec.command, allow, platform);
  if (problem) return problem;
  if (badArgs(spec.args)) return 'The arguments must be a list of plain strings.';
  if (spec.cwd !== undefined && badDirectory(spec.cwd, platform)) return 'The working directory must be an absolute path.';
  return checkEnv(spec.env, allow, platform);
};

export { checkProcessSpec };
