/* @layer core @kind logic */
import type { FileStore } from '@drizztdourden08/brock-core';
import type { MsuGameConfig } from '../config';
import { listPackEntries } from '../inventory';
import { assertSafeName } from '../paths';
import type { MsuPackManifest } from '../types';
import { manifestPath } from './manifest-path';
import { serializeManifest } from './serialize-manifest';
import { withPackName } from './with-pack-name';

const writeManifest = async (
  config: MsuGameConfig, files: FileStore, pack: string, manifest: MsuPackManifest,
): Promise<void> => {
  assertSafeName(pack);
  const inventory = await listPackEntries(config, files, pack);
  const stamped = serializeManifest({ ...withPackName(manifest, pack), files: inventory });
  await files.writeText(manifestPath(config, pack), stamped);
};

export { writeManifest };
