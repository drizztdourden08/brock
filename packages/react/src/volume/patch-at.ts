/* @layer renderer-shell @kind logic */
import { isRecord } from '../collections/is-record';

const setIn = (base: unknown, parts: readonly string[], value: unknown): unknown => {
  const [head, ...rest] = parts;
  if (head === undefined) return value;
  const record = isRecord(base) ? base : {};
  return { ...record, [head]: setIn(record[head], rest, value) };
};

const patchAt = (settings: object, writes: readonly (readonly [string, unknown])[]): Record<string, unknown> => {
  const current: Record<string, unknown> = isRecord(settings) ? settings : {};
  const patch: Record<string, unknown> = {};
  for (const [path, value] of writes) {
    const [top, ...rest] = path.split('.').filter((part) => part !== '');
    if (top === undefined) continue;
    patch[top] = setIn(top in patch ? patch[top] : current[top], rest, value);
  }
  return patch;
};

export { patchAt };
