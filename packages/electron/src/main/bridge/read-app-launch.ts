/* @layer electron-main @kind logic */
import { isAbsolute } from 'path';
import { BACKGROUND_FLAG } from '@drizztdourden08/brock-core/automation';
import type { AppLaunch, ReadAppLaunchOptions } from './app-launch.type';
import { bridgeLaunchFile } from './bridge-launch-file';
import { discoveryFileOf } from './discovery-file-of';
import { isRecord } from './is-record';
import { parseJson } from './parse-json';
import { readPrivateFile } from './read-private-file';

const isStrings = (value: unknown): value is string[] => Array.isArray(value) && value.every((item) => typeof item === 'string');

const isEnv = (value: unknown): value is Record<string, string> => isRecord(value) && Object.values(value).every((item) => typeof item === 'string');

const asLaunch = (data: unknown): AppLaunch | null => {
  if (!isRecord(data)) return null;
  const { command, args, env } = data;
  if (typeof command !== 'string' || !isAbsolute(command) || !isStrings(args) || !isEnv(env)) return null;
  return { command, args, env };
};

const readAppLaunch = ({ background = false, ...where }: ReadAppLaunchOptions): AppLaunch => {
  const file = bridgeLaunchFile(discoveryFileOf(where));
  const launch = asLaunch(parseJson(readPrivateFile(file)));
  if (!launch) throw new Error(`${file} is not an app launch file.`);
  return background && !launch.args.includes(BACKGROUND_FLAG) ? { ...launch, args: [...launch.args, BACKGROUND_FLAG] } : launch;
};

export { readAppLaunch };
