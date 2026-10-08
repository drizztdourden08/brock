/* @layer core @kind logic */
import { ROM_NAME_FORBIDDEN, ROM_NAME_MAX, ROM_NAME_RESERVED } from './rom-files.constants';

const hasControlChar = (name: string): boolean => [...name].some((char) => char.charCodeAt(0) < 0x20);

const isRomFileName = (name: string): boolean =>
  name.length > 0 && name.length <= ROM_NAME_MAX && !name.startsWith('.') && !/[. ]$/.test(name)
  && !ROM_NAME_FORBIDDEN.test(name) && !ROM_NAME_RESERVED.test(name) && !hasControlChar(name);

const assertRomFileName = (name: string): string => {
  if (!isRomFileName(name)) throw new Error(`Unsafe ROM file: "${name}"`);
  return name;
};

export { assertRomFileName };
