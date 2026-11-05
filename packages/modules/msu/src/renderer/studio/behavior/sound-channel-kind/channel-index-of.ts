/* @layer renderer-shell @kind logic */
import type { MsuGameConfig } from '../../../../config';

const channelIndexOf = (config: MsuGameConfig<never>, channel: string): number =>
  config.soundChannels.find((entry) => entry.name === channel)?.coreIndex ?? -1;

export { channelIndexOf };
