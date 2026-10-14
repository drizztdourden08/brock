/* @layer tooling-scripts @kind types */
interface AddonPins {
  addonVersion: string;
  sdl3Version: string;
  libusbVersion: string;
  buildKey: string;
}

interface AddonPaths {
  packageDir: string;
  nativeDir: string;
  platformArch: string;
  prebuildsDir: string;
  outDir: string;
  nodeFile: string;
  markerFile: string;
  stagingDir: string;
  thirdPartyDir: string;
  downloadsDir: string;
  installDir: string;
  cmakeDir: string | null;
  sdlBuildDir: string;
  addonBuildDir: string;
}

interface AddonMarker {
  buildKey: string;
  addonVersion: string;
  sdl3Version: string;
  libusbVersion: string;
  platform: string;
  arch: string;
  source: 'prebuilt' | 'local';
  ensuredAt: string;
}

interface AddonStateInput {
  marker: AddonMarker | null;
  hasBuild: boolean;
  pins: AddonPins;
  platformArch: string;
  sourcesNewer: () => boolean;
}

interface PrebuiltAsset {
  tag: string;
  name: string;
  url: string;
}

interface AddonJob {
  paths: AddonPaths;
  pins: AddonPins;
  force: boolean;
  log: (message: string) => void;
}

interface EnsureAddonRequest {
  packageDir: string;
  mode: EnsureMode;
  env: Record<string, string | undefined>;
  log: (message: string) => void;
}

type AddonState = 'current' | 'missing' | 'version-changed' | 'sources-edited';
type FetchOutcome = 'installed' | 'absent' | 'failed';
type BuildOutcome = 'built' | 'no-toolchain' | 'locked' | 'failed';
type EnsureMode = 'postinstall' | 'prepare' | 'force';
type EnsureResult = 'skipped' | 'current' | 'installed' | 'built' | 'kept' | 'unavailable' | 'failed';

declare const ensureAddon: (request: EnsureAddonRequest) => Promise<EnsureResult>;
declare const addonStateOf: (input: AddonStateInput) => AddonState;
declare const addonPathsOf: (packageDir: string, platformArch?: string, env?: Record<string, string | undefined>) => AddonPaths;
declare const cmakeDirOf: (packageDir: string, env: Record<string, string | undefined>) => string | null;
declare const prebuiltAssetOf: (pins: AddonPins, platformArch: string) => PrebuiltAsset;
declare const buildKeyOf: (versions: Omit<AddonPins, 'buildKey'>) => string;
declare const readPins: (nativeDir: string) => AddonPins;
declare const ensureModeOf: (argv: readonly string[]) => EnsureMode;

export { ensureAddon, addonStateOf, addonPathsOf, cmakeDirOf, prebuiltAssetOf, buildKeyOf, readPins, ensureModeOf };
export type {
  AddonPins, AddonPaths, AddonMarker, AddonStateInput, PrebuiltAsset, AddonJob, EnsureAddonRequest,
  AddonState, FetchOutcome, BuildOutcome, EnsureMode, EnsureResult,
};
