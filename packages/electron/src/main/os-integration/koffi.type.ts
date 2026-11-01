/* @layer electron-main @kind types */
type NativeFunction = (...args: unknown[]) => unknown;

interface KoffiLibrary {
  func: (signature: string) => NativeFunction;
}

interface Koffi {
  load: (path: string) => KoffiLibrary;
}

export type { Koffi, NativeFunction };
