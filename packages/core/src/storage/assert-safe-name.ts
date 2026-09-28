/* @layer core @kind logic */
import { isSafeName } from './is-safe-name';

const assertSafeName = (name: string, what = 'name'): string => {
  if (!isSafeName(name)) throw new Error(`Unsafe ${what}: "${name}"`);
  return name;
};

export { assertSafeName };
