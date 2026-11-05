/* @layer core @kind logic */
import { defaultSpriteDir } from './default-sprite-dir';
import { DEFAULT_SPRITE_SCHEME } from './sprites.constants';
import type { SpriteUrlOptions } from './sprites.type';

const spriteBaseUrl = (
  romFile: string, { scheme = DEFAULT_SPRITE_SCHEME, dirOf = defaultSpriteDir }: SpriteUrlOptions = {},
): string => `${scheme}://${dirOf(romFile).split('/').map(encodeURIComponent).join('/')}/`;

export { spriteBaseUrl };
