/* @layer core @kind logic */
import type { RandomizerProfileConfig } from './randomizer-profile.type';

const frozenKeysOf = (config: RandomizerProfileConfig | undefined): readonly string[] =>
  Object.keys(config?.frozenSettings ?? {});

export { frozenKeysOf };
