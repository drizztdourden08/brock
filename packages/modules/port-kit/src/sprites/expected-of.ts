/* @layer core @kind logic */
import type { SpriteManifest } from './sprites.type';

const expectedOf = ({ expected }: SpriteManifest): readonly string[] =>
  typeof expected === 'function' ? expected() : expected;

export { expectedOf };
