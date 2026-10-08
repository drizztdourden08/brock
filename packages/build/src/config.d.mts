/* @layer tooling-scripts @kind types */
import type { ProductInput } from '@drizztdourden08/brock-core/product';

type BrockPlatform = 'windows' | 'macos' | 'linux' | 'android' | 'ios' | 'web';

/** A platform id, or a bundle: desktop is windows, macos and linux; mobile is android, and iOS once it lands. */
type BrockTarget = BrockPlatform | 'desktop' | 'mobile';

interface BrockWebOptions {
  /** false leaves manifest.webmanifest out of the web build. Default true. */
  manifest?: boolean;
}

interface BrockReviewOptions {
  /** true makes the CI review job compare its captures with tests/baselines/linux, and adds the bless input. */
  baselines?: boolean;
}

interface BrockBuildOptions {
  /** Import prefixes beside @app, each a folder relative to the app folder ('@shared': '../../shared'), for main, preload, renderer, workers and the tsconfig paths. */
  aliases?: Record<string, string>;
  /** Node polyfills (Buffer, process, ...) in the renderer and its workers through vite-plugin-node-polyfills, which the app installs: true for its defaults, or its options. */
  nodePolyfills?: boolean | Record<string, unknown>;
}

interface BrockGateOptions {
  /** package.json scripts the gate runs, in order: from the app's own package.json, else the workspace root's. */
  scripts?: string[];
  /** Folders or files of C sources, relative to the repo root, that clang-format checks against the managed .clang-format there. */
  clangFormat?: string[];
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
  /** The headless review in CI. */
  review?: BrockReviewOptions;
  /** Options of the managed Vite configs. */
  build?: BrockBuildOptions;
  /** The app's own gate steps: brock gate runs them, and so do the CI quality job and upgrade. */
  gate?: BrockGateOptions;
}

declare const CONFIG_FILE: 'brock.config.ts';
declare const defineBrockConfig: (cfg: BrockConfig) => BrockConfig;

export { defineBrockConfig, CONFIG_FILE };
export type { BrockBuildOptions, BrockConfig, BrockGateOptions, BrockPlatform, BrockReviewOptions, BrockTarget, BrockWebOptions };
