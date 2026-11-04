/* @layer core @kind logic */
import type { FileStore } from '@drizztdourden08/brock-core';
import type { MsuGameConfig } from '../config';
import { parseManifest } from '../manifest-io';
import type { MsuPackManifest } from '../types';
import { manifestPath } from './manifest-path';
import { withPackName } from './with-pack-name';

const readManifest = async (
  config: MsuGameConfig, files: FileStore, pack: string,
): Promise<MsuPackManifest | null> => {
  const manifest = parseManifest(await files.readText(manifestPath(config, pack)));
  return manifest && withPackName(manifest, pack);
};

export { readManifest };
