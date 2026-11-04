/* @layer core @kind logic */
import type { MsuGameConfig } from '../config';
import { assertSafeName } from './assert-safe-name';
import { packDir } from './pack-dir';

const packFile = (config: MsuGameConfig, pack: string, fileName: string): string => {
  assertSafeName(fileName);
  return `${packDir(config, pack)}/${fileName}`;
};

export { packFile };
