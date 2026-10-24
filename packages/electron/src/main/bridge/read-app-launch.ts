/* @layer electron-main @kind logic */
import { isAbsolute } from 'path';
import { BACKGROUND_FLAG } from '@drizztdourden08/brock-core/automation';
import type { AppLaunch, ReadAppLaunchOptions } from './app-launch.type';
import { BRIDGE_LAUNCH_ARG } from './bridge.constants';
import { bridgeLaunchFile } from './bridge-launch-file';
import { discoveryFileOf } from './discovery-file-of';
import { isRecord } from './is-record';
import { parseJson } from './parse-json';
import { readPrivateFile } from './read-private-file';

const isStrings = (value: unknown): value is string[] => Array.isArray(value) && value.every((item) => typeof item === 'string');

const isKnownArg = (arg: string, index: number): boolean => arg === BACKGROUND_FLAG || BRIDGE_LAUNCH_ARG.test(arg) || (index === 0 && isAbsolute(arg));

const isEmpty = (value: unknown): value is Record<string, never> => isRecord(value) && Object.keys(value).length === 0;

const asLaunch = (data: unknown): AppLaunch | null => {
  if (!isRecord(data)) return null;
  const { command, args, env } = data;
  if (typeof command !== 'string' || !isAbsolute(command) || !isStrings(args) || !args.every(isKnownArg) || !isEmpty(env)) return null;
  return { command, args, env };
};

const readAppLaunch = ({ background = false, ...where }: ReadAppLaunchOptions): AppLaunch => {
  const file = bridgeLaunchFile(discoveryFileOf(where));
  const launch = asLaunch(parseJson(readPrivateFile(file)));
  if (!launch) throw new Error(`${file} is not an app launch file.`);
  return background && !launch.args.includes(BACKGROUND_FLAG) ? { ...launch, args: [...launch.args, BACKGROUND_FLAG] } : launch;
};

export { readAppLaunch };
