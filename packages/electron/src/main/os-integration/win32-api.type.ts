/* @layer electron-main @kind types */
import type { Result } from '@drizztdourden08/brock-core/result';
import type { NativeFunction } from './koffi.type';

interface Win32Bindings {
  createKey: NativeFunction;
  setValue: NativeFunction;
  closeKey: NativeFunction;
  deleteTree: NativeFunction;
  deleteValue: NativeFunction;
  changeNotify: NativeFunction;
}

interface Win32Api {
  setString: (subKey: string, name: string | null, value: string) => Result;
  deleteTree: (subKey: string) => Result;
  deleteValue: (subKey: string, name: string) => Result;
  notifyShell: () => Result;
}

export type { Win32Api, Win32Bindings };
