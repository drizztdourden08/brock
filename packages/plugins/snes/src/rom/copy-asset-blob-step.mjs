/* @layer tooling-scripts @kind logic */
import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';
import { readJson } from '../read-json.mjs';
import { snesOptions } from '../snes-options.mjs';
import { appDataDir } from './app-data-root.mjs';
import { findRom, stemOf } from './find-rom.mjs';
import { writeJson } from '../write-json.mjs';

const romSource = ({ worktree, roms, rom, assetsDir }) => {
  if (rom) return resolve(rom);
  return findRom(join(worktree.path, roms.dir), roms, assetsDir) ?? findRom(join(worktree.main, roms.dir), roms, assetsDir);
};

const copyRom = ({ source, romsDir, log }) => {
  const file = basename(source);
  const dest = join(romsDir, file);
  if (!existsSync(dest)) {
    mkdirSync(romsDir, { recursive: true });
    cpSync(source, dest);
    log(`ROM copied: ${file}`);
  }
  return file;
};

const copyBlob = ({ romFile, sourceAssets, assetsDir, roms, log }) => {
  const asset = `${stemOf(romFile)}${roms.assetExtension}`;
  const dest = join(assetsDir, asset);
  if (existsSync(dest)) return;
  const source = join(sourceAssets, asset);
  if (!existsSync(source)) {
    log(`No pre-extracted asset blob for ${romFile}; the first launch extracts it.`);
    return;
  }
  mkdirSync(assetsDir, { recursive: true });
  cpSync(source, dest);
  log(`Asset blob copied from the app data: ${asset}`);
};

const noteRomOnProfile = ({ worktree, romFile, states }) => {
  const file = join(worktree.userData, states.profilesDir, worktree.name, 'profile.json');
  const profile = readJson(file, null);
  if (!profile || profile.romFile) return;
  writeJson(file, { ...profile, romFile });
};

/**
 * @param {{ realDataDir?: string, rom?: string, dir?: string, extensions?: string[] }} [options]
 * @returns {{ name: string, run: (worktree: object) => void }}
 */
const copyAssetBlob = ({ realDataDir, rom, ...overrides } = {}) => ({
  name: 'asset-blob',
  run: (worktree) => {
    const roms = snesOptions('roms', worktree.workspace, overrides);
    const states = snesOptions('states', worktree.workspace);
    const sourceData = realDataDir ?? appDataDir(worktree.main);
    const sourceAssets = join(sourceData, 'assets');
    const dataDir = join(worktree.userData, 'Data');
    const source = romSource({ worktree, roms, rom, assetsDir: sourceAssets });
    if (!source || !existsSync(source)) {
      throw new Error(`No ROM found. Pass rom: "<path>" to copyAssetBlob(), or place one (${roms.extensions.join(', ')}) under ${roms.dir}/ in the worktree or the main checkout.`);
    }
    const romFile = copyRom({ source, romsDir: join(dataDir, 'roms'), log: worktree.log });
    copyBlob({ romFile, sourceAssets, assetsDir: join(dataDir, 'assets'), roms, log: worktree.log });
    noteRomOnProfile({ worktree, romFile, states });
  },
});

export { copyAssetBlob };
