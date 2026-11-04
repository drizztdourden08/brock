/* @layer core @kind logic */
import type { FileStore } from '@drizztdourden08/brock-core';
import type { MsuGameConfig } from '../../config';
import { createPack, writeManifest } from '../../edit';
import { listPacks, packGameMismatch } from '../../packs';
import { readMsulPack } from '../import-msul';
import { FALLBACK_PACK_NAME } from './install-msul-pack.constants';
import type { InstallOptions, InstallResult } from './install-msul-pack.type';
import { preferredPackName } from './preferred-pack-name';
import { sanitizePackName } from './sanitize-pack-name';
import { uniquePackName } from './unique-pack-name';
import { writePackEntries } from './write-pack-entries';

const installMsulPack = async (
  config: MsuGameConfig, store: FileStore, bytes: Uint8Array, options: InstallOptions = {},
): Promise<InstallResult> => {
  const { desiredName, onProgress } = options;
  const { manifest, files } = await readMsulPack(bytes);
  const mismatch = packGameMismatch(config, manifest);
  if (mismatch) throw new Error(mismatch);
  const existing = (await listPacks(config, store)).map((p) => p.name);
  const ownName = sanitizePackName(preferredPackName(desiredName, manifest.meta.name)) || FALLBACK_PACK_NAME;
  const pack = uniquePackName(ownName, existing);
  await createPack(config, store, pack, manifest.meta);
  const written = await writePackEntries(config, store, pack, { entries: files, onProgress });
  await writeManifest(config, store, pack, manifest);
  const missingFiles = (manifest.files ?? []).filter((name) => !written.has(name));
  return { pack, ownName, fileCount: written.size, trackCount: manifest.tracks.length, missingFiles };
};

export { installMsulPack };
