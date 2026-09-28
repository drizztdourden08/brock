/* @layer core @kind logic */
import type { FileStore } from '@drizztdourden08/brock-core/platform';
import type { PortDefinition } from '../port/port-definition.type';
import type { RomStore } from '../rom/rom-store.type';
import { ASSETS_DIR } from '../rom/rom-files.constants';
import type { AssetProgress } from './asset-pipeline.type';
import type { AssetCache } from './asset-cache.type';
import { runAssetPipeline } from './run-asset-pipeline';

const createAssetCache = (files: FileStore, roms: RomStore, definition: PortDefinition): AssetCache => {
  const rebuild = async (romFile: string, onProgress?: AssetProgress): Promise<Uint8Array> => {
    const target = roms.assetFileOf(romFile);
    if (!target || !definition.assets) throw new Error(`Port "${definition.id}" declares no asset pipeline.`);
    const check = await roms.read(romFile);
    if (!check?.ok) throw new Error(`ROM "${romFile}" is missing or not a known dump.`);
    const { extractors, pack } = definition.assets;
    const blob = await runAssetPipeline({ rom: check.rom, extractors, pack, onProgress });
    await files.mkdir(ASSETS_DIR);
    await files.writeBytes(target, blob);
    return blob;
  };

  const load = async (romFile: string, onProgress?: AssetProgress): Promise<Uint8Array> => {
    const target = roms.assetFileOf(romFile);
    const cached = target ? await files.readBytes(target) : null;
    return cached && cached.length > 0 ? cached : rebuild(romFile, onProgress);
  };

  return { load, rebuild };
};

export { createAssetCache };
