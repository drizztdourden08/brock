/* @layer tooling-scripts @kind types */
interface WasmOptions {
  sourceDirs: string[];
  skipDirs: string[];
  sourceExtensions: string[];
  buildScript: string;
  output: string;
  outputExtensions: string[];
  emsdkDir: string;
  skipWithoutSdk?: boolean;
}

interface EmsdkInfo {
  dir: string;
  activate: string | null;
  emscripten: string | null;
  mainCheckout: boolean;
  found: boolean;
}

interface EmsdkHost {
  env?: NodeJS.ProcessEnv;
  platform?: NodeJS.Platform;
}

interface StaleTimes {
  outputTimes: number[];
  sourceTimes: number[];
}

interface EnsureWasmRequest {
  root: string;
  wasm: WasmOptions;
  log: (message: string) => void;
  force?: boolean;
  skipWithoutSdk?: boolean;
}

declare const WASM_DEFAULTS: Readonly<WasmOptions>;
declare const SKIP_WITHOUT_SDK_FLAG: string;
declare const ensureWasm: (request: EnsureWasmRequest) => 'current' | 'built' | 'skipped';
declare const emsdkOf: (root: string, wasm: WasmOptions, host?: EmsdkHost) => EmsdkInfo;
declare const wasmStaleReason: (root: string, wasm: WasmOptions) => string | null;
declare const staleReasonOf: (times: StaleTimes) => string | null;
declare const wasmOptionsOf: (root: string) => WasmOptions;
declare const mainCheckoutOf: (dir: string) => { top: string; main: string } | null;

export { WASM_DEFAULTS, SKIP_WITHOUT_SDK_FLAG, ensureWasm, emsdkOf, wasmStaleReason, staleReasonOf, wasmOptionsOf, mainCheckoutOf };
export type { WasmOptions, EmsdkInfo, EmsdkHost, StaleTimes, EnsureWasmRequest };
