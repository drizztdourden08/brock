/* @layer renderer-shell @kind logic */
import type { MsuGameConfig } from '../../../../config';

const isAdditiveChannel = (config: MsuGameConfig<never>, channel: string): boolean =>
  config.soundChannels.find((entry) => entry.name === channel)?.kind !== 'stateful';

export { isAdditiveChannel };
