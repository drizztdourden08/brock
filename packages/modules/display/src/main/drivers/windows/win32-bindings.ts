/* @layer electron-main @kind logic */
import type { Koffi } from '../koffi/koffi.type';
import { loadKoffi } from '../koffi/load-koffi';
import { devModeStruct } from './devmode-struct';
import { CDS_FULLSCREEN, CHANGE_SIGNATURE, DISP_CHANGE_SUCCESSFUL, ENUM_SIGNATURE } from './windows.constants';
import type { DevMode, Win32Bindings } from './windows.type';

let bindings: Win32Bindings | null = null;
let bindingError = '';

const bind = (koffi: Koffi): Win32Bindings => {
  const user32 = koffi.load('user32.dll');
  const sizeofDevMode = koffi.sizeof(devModeStruct(koffi));
  const enumFn = user32.func(ENUM_SIGNATURE);
  const changeFn = user32.func(CHANGE_SIGNATURE);
  return {
    enumDisplaySettings: (index) => {
      const mode: DevMode = { dmSize: sizeofDevMode, dmPelsWidth: 0, dmPelsHeight: 0, dmDisplayFrequency: 0, dmFields: 0 };
      return enumFn(null, index, mode) ? mode : null;
    },
    changeDisplaySettings: (mode) => changeFn(null, mode, null, CDS_FULLSCREEN, null) === DISP_CHANGE_SUCCESSFUL,
  };
};

const buildBindings = (): Win32Bindings | null => {
  const koffi = loadKoffi();
  if (!koffi) {
    bindingError = 'The native display binding (koffi) is not installed.';
    return null;
  }
  try {
    return bind(koffi);
  } catch (error) {
    bindingError = `The native display binding failed to start: ${error instanceof Error ? error.message : String(error)}`;
    return null;
  }
};

const win32Bindings = (): { api: Win32Bindings | null; error: string } => {
  if (bindings === null && !bindingError) bindings = buildBindings();
  return { api: bindings, error: bindingError };
};

export { win32Bindings };
