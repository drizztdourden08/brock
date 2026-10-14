/* @layer core @kind logic */
import type { RomRules } from './rom.type';

const hasRomExtension = (fileName: string, { extensions }: Pick<RomRules, 'extensions'>): boolean => {
  const lower = fileName.toLowerCase();
  return extensions.some((ext) => lower.endsWith(ext.toLowerCase()));
};

export { hasRomExtension };
