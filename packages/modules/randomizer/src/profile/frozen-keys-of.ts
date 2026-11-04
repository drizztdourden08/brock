/* @layer core @kind logic */
import type { RandomizerProfileConfig } from '../augment';

const frozenKeysOf = (config: RandomizerProfileConfig | undefined): readonly string[] =>
  Object.keys(config?.frozenSettings ?? {});

export { frozenKeysOf };
