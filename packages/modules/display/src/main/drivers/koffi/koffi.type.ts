/* @layer electron-main @kind types */
type NativeFunction = (...args: unknown[]) => unknown;

interface KoffiLibrary {
  func: (signature: string) => NativeFunction;
}

interface Koffi {
  load: (path: string) => KoffiLibrary;
  struct: (name: string, fields: Record<string, unknown>) => unknown;
  array: (type: string, length: number) => unknown;
  sizeof: (type: unknown) => number;
}

export type { NativeFunction, KoffiLibrary, Koffi };
