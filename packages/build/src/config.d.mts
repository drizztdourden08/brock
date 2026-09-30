/* @layer tooling-scripts @kind types */
import type { ProductInput } from '@drizztdourden08/brock-core/product';

type BrockPlatform = 'windows' | 'macos' | 'linux' | 'android' | 'ios' | 'web';

/** A platform id, or a bundle: desktop is windows, macos and linux; mobile is android, and iOS once it lands. */
type BrockTarget = BrockPlatform | 'desktop' | 'mobile';

interface BrockWebOptions {
  /** false leaves manifest.webmanifest out of the web build. Default true. */
  manifest?: boolean;
}

interface BrockConfig {
  /** Identity fields; defaults fill the rest at boot. */
  product: ProductInput;
  /** Platform ids and bundles this app builds for; brock sync writes the workflows from them. */
  targets: BrockTarget[];
  /** Brock module ids, in load order. */
  modules: string[];
  /** The web build, for the web target. */
  web?: BrockWebOptions;
}

declare const CONFIG_FILE: 'brock.config.ts';
declare const defineBrockConfig: (cfg: BrockConfig) => BrockConfig;

export { defineBrockConfig, CONFIG_FILE };
export type { BrockConfig, BrockPlatform, BrockTarget, BrockWebOptions };
