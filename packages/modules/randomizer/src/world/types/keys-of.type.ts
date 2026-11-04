/* @layer core @kind types */
import type { WorldKeys } from './world-keys.type';
import type { World } from './world.type';

type KeysOf<W extends World> = W extends World<infer K> ? K : WorldKeys;

export type { KeysOf };
