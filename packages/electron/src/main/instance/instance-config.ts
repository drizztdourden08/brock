/* @layer electron-main @kind logic */
import type { InstanceInfo } from '../types/main-context.type';
import { appendMainLog } from '../logs/append-main-log';
import { SLUG } from './instance-config.constants';

const flagValue = (argv: readonly string[], flag: string): string | null => {
  const prefix = `${flag}=`;
  const raw = argv.find((arg) => arg.startsWith(prefix))?.slice(prefix.length).trim();
  if (!raw) return null;
  return raw;
};

const asSlug = (value: string | null): string | null => {
  if (value === null) return null;
  const slug = value.toLowerCase();
  if (SLUG.test(slug)) return slug;
  appendMainLog('error', `[instance] Ignoring invalid instance name "${value}". Names must be a slug like "big-key".`);
  return null;
};

const parseInstanceConfig = (argv: readonly string[] = process.argv): InstanceInfo => {
  const name = asSlug(flagValue(argv, '--instance'));
  return { name, profile: flagValue(argv, '--profile') ?? name };
};

export { parseInstanceConfig };
