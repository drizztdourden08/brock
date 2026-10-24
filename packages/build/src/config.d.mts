/* @layer tooling-scripts @kind types */
import type { WorkflowSteps } from '@drizztdourden08/brock-core/module';
import type { ProductInput } from '@drizztdourden08/brock-core/product';

type BrockPlatform = 'windows' | 'macos' | 'linux' | 'android' | 'ios' | 'web' | 'server';

/** A platform id, or a bundle: desktop is windows, macos and linux; mobile is android, and iOS once it lands. */
type BrockTarget = BrockPlatform | 'desktop' | 'mobile';

interface BrockWebOptions {
  /** false leaves manifest.webmanifest out of the web build. Default true. */
  manifest?: boolean;
}

interface BrockServerOptions {
  /** The server entry, relative to the app folder. Default server/main.ts. It builds into dist/server/main.mjs, one file with every dependency inlined. */
  entry?: string;
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
  /** Globals replaced at build time in main, preload, the renderer, its workers and the web build: each value is JSON-stringified, so the code reads it as written here. Declare each name in a .d.ts of the app. */
  define?: Record<string, BrockDefineValue>;
  /** Added to the renderer dev server's optimizeDeps, after the list Brock computes from the installed packages and the imports of the renderer source. */
  optimizeDeps?: BrockOptimizeDepsOptions;
}

interface BrockOptimizeDepsOptions {
  /** More dependencies to pre-bundle, as Vite's optimizeDeps.include takes them. */
  include?: string[];
  /** Dependencies never to pre-bundle; also dropped from the computed list. */
  exclude?: string[];
  /** Vite's optimizeDeps.entries: the files its scanner starts from instead of index.html. */
  entries?: string[];
  /** Dependencies only a renderer Web Worker imports (fs, crypto, path through build.nodePolyfills, js-yaml), pre-bundled at start instead of when the worker first loads. */
  worker?: string[];
}

type BrockDefineValue = string | number | boolean | null | BrockDefineValue[] | { [key: string]: BrockDefineValue };

type BrockWorkflowMode = 'managed' | 'own';

interface BrockWorkflowOptions {
  /** 'own' leaves the CI workflow to the app: brock sync stops writing it and brock check stops comparing it. Default 'managed'. */
  ci?: BrockWorkflowMode;
  /** 'own' leaves the release workflow to the app, the same way. Default 'managed'. */
  release?: BrockWorkflowMode;
  /** The app's own steps, spliced into the managed workflows at fixed points, after the steps of the modules and plugins. */
  steps?: WorkflowSteps;
}

interface BrockTsconfigOptions {
  /** Merged key by key over the compilerOptions of the managed tsconfig.json; paths merges entry by entry. */
  compilerOptions?: Record<string, unknown>;
}

interface BrockExtraResource {
  /** A file or folder, relative to the app folder. */
  from: string;
  /** Where it lands, relative to the resources folder of the packaged app. */
  to: string;
  filter?: string[];
}

interface BrockFileAssociationOptions {
  /** macOS CFBundleTypeRole. */
  role?: 'Editor' | 'Viewer' | 'Shell' | 'None';
  /** The icon name, as product.fileAssociations takes it; replaces the product's for this extension. */
  icon?: string;
}

interface BrockPackagingOptions {
  /** Files copied beside the app, after the module resources. */
  extraResources?: BrockExtraResource[];
  /** A module, relative to the app folder, whose default export (the electron-builder AfterPackContext) runs after Brock's own afterPack. */
  afterPack?: string;
  /** Per extension of product.fileAssociations: the role and the icon. */
  fileAssociations?: Record<string, BrockFileAssociationOptions>;
  /** The icon vpk pack takes, relative to the app folder: an .ico on Windows, a .png on Linux. Default: the app icon. */
  velopackIcons?: { windows?: string; linux?: string };
}

interface BrockFuseOptions {
  /** Whether the packaged app honours ELECTRON_RUN_AS_NODE. Default: true when helpers are declared (a helper starts through it), false otherwise. false with helpers is refused. */
  runAsNode?: boolean;
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
  /** The server, for the server target: a windowless app when it is the only target. */
  server?: BrockServerOptions;
  /** The headless review in CI. */
  review?: BrockReviewOptions;
  /** Options of the managed Vite configs. */
  build?: BrockBuildOptions;
  /** The app's own gate steps: brock gate runs them, and so do the CI quality job and upgrade. */
  gate?: BrockGateOptions;
  /** The managed CI and release workflows: which files Brock keeps, and the app's own steps in them. */
  workflows?: BrockWorkflowOptions;
  /** Merged over the managed tsconfig.json. */
  tsconfig?: BrockTsconfigOptions;
  /** What the managed electron-builder config and vpk take beside the product. */
  packaging?: BrockPackagingOptions;
  /** Standalone Node scripts an outside program runs, such as a stdio MCP helper: name to entry file, relative to the app folder. Each builds into dist/helpers/<name>.mjs and ships in resources/helpers, outside the asar. */
  helpers?: Record<string, string>;
  /** The Electron fuses of the packaged app. */
  fuses?: BrockFuseOptions;
}

declare const CONFIG_FILE: 'brock.config.ts';
declare const defineBrockConfig: (cfg: BrockConfig) => BrockConfig;

export { defineBrockConfig, CONFIG_FILE };
export type {
  BrockBuildOptions, BrockConfig, BrockDefineValue, BrockExtraResource, BrockFileAssociationOptions, BrockFuseOptions, BrockGateOptions, BrockOptimizeDepsOptions, BrockPackagingOptions, BrockPlatform,
  BrockReviewOptions, BrockServerOptions, BrockTarget, BrockTsconfigOptions, BrockWebOptions, BrockWorkflowMode, BrockWorkflowOptions,
};
export type { WorkflowStep, WorkflowSteps } from '@drizztdourden08/brock-core/module';
