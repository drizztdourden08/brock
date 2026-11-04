/* @layer core @kind logic */
import type { FileStore } from '@drizztdourden08/brock-core';
import type { MsuGameConfig } from '../config';
import { assertSafeName, packDir } from '../paths';
import type { MsuPackMeta } from '../types';
import { newManifest } from './new-manifest';
import { writeManifest } from './write-manifest';

const createPack = async (
  config: MsuGameConfig, files: FileStore, pack: string, meta?: Partial<MsuPackMeta>,
): Promise<void> => {
  assertSafeName(pack);
  if (await files.exists(packDir(config, pack))) throw new Error(`MSU pack already exists: ${pack}`);
  await writeManifest(config, files, pack, newManifest(pack, meta));
};

export { createPack };
