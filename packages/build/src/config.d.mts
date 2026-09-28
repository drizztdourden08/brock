/* @layer tooling-scripts @kind types */
import type { ProductInput } from '@drizztdourden08/brock-core/product';

type BrockTarget = 'desktop' | 'android' | 'web';

interface BrockConfig {
  /** Identity fields; defaults fill the rest at boot. */
  product: ProductInput;
  /** Platforms this app builds for. */
  targets: BrockTarget[];
  /** Brock module ids, in load order. */
  modules: string[];
}

declare const CONFIG_FILE: 'brock.config.ts';
declare const defineBrockConfig: (cfg: BrockConfig) => BrockConfig;

export { defineBrockConfig, CONFIG_FILE };
export type { BrockConfig, BrockTarget };
