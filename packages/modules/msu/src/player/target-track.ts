/* @layer core @kind logic */
import type { MsuGameConfig } from '../config';

const targetTrack = <Ctx>(config: MsuGameConfig<Ctx>, variant: string | undefined, track: number, context: Ctx): number => {
  const remap = variant === undefined ? undefined : config.variants?.[variant]?.remapTrack;
  return remap ? remap(track, context) : track;
};

export { targetTrack };
