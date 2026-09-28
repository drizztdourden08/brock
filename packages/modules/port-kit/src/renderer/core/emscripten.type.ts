/* @layer renderer-shell @kind types */
interface EmscriptenFS {
  writeFile: (path: string, data: Uint8Array | string) => void;
  readFile: (path: string) => Uint8Array;
  mkdir: (path: string) => void;
  unlink: (path: string) => void;
  analyzePath: (path: string) => { exists: boolean };
}

interface SdlAudio {
  audioContext?: AudioContext;
  audio?: { scriptProcessorNode?: AudioNode };
}

interface EmscriptenModule {
  [key: string]: unknown;
  FS: EmscriptenFS;
  HEAPU8: Uint8Array;
  ccall: (ident: string, returnType: 'number' | null, argTypes: string[], args: number[]) => unknown;
  canvas?: HTMLCanvasElement;
  SDL2?: SdlAudio;
}

type InstantiateWasm = (
  imports: WebAssembly.Imports,
  onSuccess: (instance: WebAssembly.Instance, module: WebAssembly.Module) => void,
) => Record<string, never>;

interface EmscriptenConfig {
  canvas?: HTMLCanvasElement;
  noInitialRun?: boolean;
  instantiateWasm: InstantiateWasm;
  preRun: ((mod: EmscriptenModule) => void)[];
  print: (text: string) => void;
  printErr: (text: string) => void;
}

type EmscriptenFactory = (config: EmscriptenConfig) => Promise<EmscriptenModule>;

export type { EmscriptenFS, SdlAudio, EmscriptenModule, InstantiateWasm, EmscriptenConfig, EmscriptenFactory };
