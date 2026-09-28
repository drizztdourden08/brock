/* @layer renderer-shell @kind logic */
import type { CoreFiles } from '../../port/port-definition.type';
import type { EmscriptenFS } from './emscripten.type';
import type { CoreBoot } from './game-core.type';

const ensureParent = (fs: EmscriptenFS, path: string): void => {
  const parent = path.slice(0, path.lastIndexOf('/'));
  if (parent && !fs.analyzePath(parent).exists) fs.mkdir(parent);
};

const writeFile = (fs: EmscriptenFS, path: string, data: Uint8Array | string): void => {
  ensureParent(fs, path);
  fs.writeFile(path, data);
};

const writeBootFiles = (fs: EmscriptenFS, files: CoreFiles, boot: CoreBoot): void => {
  const { assets, config, sram, extraFiles = {} } = boot;
  writeFile(fs, files.assets, assets);
  if (files.config && config !== undefined) writeFile(fs, files.config, config);
  ensureParent(fs, files.sram);
  if (sram) writeFile(fs, files.sram, sram);
  for (const [path, data] of Object.entries(extraFiles)) writeFile(fs, path, data);
};

export { writeBootFiles };
