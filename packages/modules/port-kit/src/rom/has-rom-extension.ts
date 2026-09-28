/* @layer core @kind logic */
import type { RomDefinition } from './rom.type';

const hasRomExtension = (fileName: string, { extensions }: RomDefinition): boolean => {
  const lower = fileName.toLowerCase();
  return extensions.some((ext) => lower.endsWith(ext.toLowerCase()));
};

export { hasRomExtension };
