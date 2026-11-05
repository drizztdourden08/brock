/* @layer core @kind logic */
import { defaultSpriteDir } from './default-sprite-dir';
import type { SpriteManifest } from './sprites.type';

const dirOf = ({ dirOf: custom }: SpriteManifest, romFile: string): string =>
  (custom ?? defaultSpriteDir)(romFile);

export { dirOf };
