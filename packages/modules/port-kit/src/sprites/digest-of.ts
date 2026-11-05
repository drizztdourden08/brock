/* @layer core @kind logic */
import { expectedOf } from './expected-of';
import { spriteDigestOf } from './sprite-digest-of';
import type { SpriteManifest } from './sprites.type';

const digestOf = (manifest: SpriteManifest): string => {
  const { digest } = manifest;
  if (digest === undefined) return spriteDigestOf(expectedOf(manifest));
  return typeof digest === 'function' ? digest() : digest;
};

export { digestOf };
