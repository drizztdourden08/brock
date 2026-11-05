/* @layer core @kind logic */
import { checkSprites } from './check-sprites';
import { dirOf } from './dir-of';
import { isSpritesStale } from './is-sprites-stale';
import { removeSprites } from './remove-sprites';
import { spritesMissing } from './sprites-missing';
import { writeSprites } from './write-sprites';
import type { SpriteStore, SpriteStoreOptions } from './sprites.type';

const createSpriteStore = ({ manifest }: SpriteStoreOptions): SpriteStore => ({
  dir: (romFile) => dirOf(manifest, romFile),
  write: (files, romFile, buffers) => writeSprites(manifest, files, romFile, buffers),
  check: (files, romFile) => checkSprites(manifest, files, romFile),
  isStale: (files, romFile, expectedVersion) => isSpritesStale(manifest, files, romFile, expectedVersion),
  missing: (files, romFile) => spritesMissing(manifest, files, romFile),
  remove: (files, romFile) => removeSprites(manifest, files, romFile),
  readFile: (files, romFile, name) => files.readBytes(`${dirOf(manifest, romFile)}/${name}`),
});

export { createSpriteStore };
