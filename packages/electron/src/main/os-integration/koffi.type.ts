/* @layer electron-main @kind types */
type NativeFunction = (...args: unknown[]) => unknown;

interface KoffiLibrary {
  func: (signature: string) => NativeFunction;
}

interface KoffiDecode {
  (pointer: unknown, type: string, length?: number): unknown;
  string16: (pointer: unknown) => string;
}

interface Koffi {
  load: (path: string) => KoffiLibrary;
  decode: KoffiDecode;
}

export type { Koffi, KoffiDecode, NativeFunction };
