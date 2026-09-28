/* @layer core @kind logic */
import type { SettingLock } from './setting-lock.type';

const createSettingLock = (opts: { keys: Iterable<string>; prefixes?: Iterable<string> }): SettingLock => {
  const keys = new Set(opts.keys);
  const prefixes = [...(opts.prefixes ?? [])];
  const isLocked = (key: string): boolean =>
    keys.has(key) || prefixes.some((p) => key === p || key.startsWith(`${p}.`));
  return { isLocked, keys };
};

export { createSettingLock };
