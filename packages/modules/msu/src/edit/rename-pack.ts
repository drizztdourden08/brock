/* @layer core @kind logic */
import type { FileStore } from '@drizztdourden08/brock-core';
import type { MsuGameConfig } from '../config';
import { assertSafeName, packDir } from '../paths';
import { readManifest } from './read-manifest';
import { writeManifest } from './write-manifest';

const renamePack = async (config: MsuGameConfig, files: FileStore, from: string, to: string): Promise<void> => {
  assertSafeName(from);
  assertSafeName(to);
  if (from === to) return;
  if (await files.exists(packDir(config, to))) throw new Error(`MSU pack already exists: ${to}`);
  for (const name of await files.list(packDir(config, from))) {
    const bytes = await files.readBytes(`${packDir(config, from)}/${name}`);
    if (bytes) await files.writeBytes(`${packDir(config, to)}/${name}`, bytes);
  }
  const manifest = await readManifest(config, files, to);
  if (manifest) await writeManifest(config, files, to, manifest);
  await files.remove(packDir(config, from));
};

export { renamePack };
