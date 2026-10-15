/* @layer core @kind logic */
import type { FileStore } from '@drizztdourden08/brock-core/platform';
import type { RomFileName } from './rom.type';
import type { RomNameSource } from './rom-store.type';
import { hasRomExtension } from './has-rom-extension';

const stemOf = (file: string): string => file.replace(/\.[^.]+$/, '');

const assetOrNull = (assetFileOf: RomNameSource['assetFileOf'], file: string): string | null => {
  try {
    return assetFileOf(file);
  } catch {
    return null;
  }
};

const listRomNames = async (files: FileStore, { dir, rules, assetFileOf, labelOf }: RomNameSource): Promise<RomFileName[]> => {
  const names = (await files.list(dir)).filter((file) => hasRomExtension(file, rules)).sort((a, b) => a.localeCompare(b));
  return Promise.all(names.map(async (file) => {
    const asset = assetOrNull(assetFileOf, file);
    const stat = asset ? await files.stat(asset).catch(() => null) : null;
    const assetBytes = stat && !stat.isDirectory ? stat.bytes : null;
    return { file, label: labelOf(file) ?? stemOf(file), hasAssets: assetBytes !== null, assetBytes };
  }));
};

export { listRomNames };
