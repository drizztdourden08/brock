/* @layer renderer-shell @kind logic */
import type { SettingsRecord } from '../SettingsLayout.type';
import { asRecord } from './as-record';
import { readPath } from './read-path';

const withPath = (base: SettingsRecord, path: string[], value: unknown): SettingsRecord => {
  const [head, ...rest] = path;
  if (head === undefined) return base;
  if (rest.length === 0) return { ...base, [head]: value };
  return { ...base, [head]: withPath(asRecord(base[head]) ?? {}, rest, value) };
};

const defaultsPatch = <S extends object>(keys: readonly string[], settings: S, defaults: S): Partial<S> => {
  const current = settings as SettingsRecord;
  const original = defaults as SettingsRecord;

  return keys.reduce<SettingsRecord>((patch, key) => {
    const path = key.split('.');
    const [root] = path;
    if (root === undefined) return patch;
    const base = path.length === 1 || root in patch ? patch : { ...patch, [root]: current[root] };
    return withPath(base, path, readPath(original, path).value);
  }, {}) as Partial<S>;
};

export { defaultsPatch };
