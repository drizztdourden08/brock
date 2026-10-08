/* @layer tooling-scripts @kind types */
interface WasmOptions {
  sourceDirs: string[];
  skipDirs: string[];
  sourceExtensions: string[];
  buildScript: string;
  output: string;
  outputExtensions: string[];
  emsdkDir: string;
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
}

declare const WASM_DEFAULTS: Readonly<WasmOptions>;
declare const ensureWasm: (request: EnsureWasmRequest) => 'current' | 'built';
declare const wasmStaleReason: (root: string, wasm: WasmOptions) => string | null;
declare const staleReasonOf: (times: StaleTimes) => string | null;
declare const wasmOptionsOf: (root: string) => WasmOptions;

export { WASM_DEFAULTS, ensureWasm, wasmStaleReason, staleReasonOf, wasmOptionsOf };
export type { WasmOptions, StaleTimes, EnsureWasmRequest };
