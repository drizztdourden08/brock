/* @layer electron-main @kind logic */
import type { KoffiLibrary } from '../koffi/koffi.type';
import { loadKoffi } from '../koffi/load-koffi';
import { CF_SIGNATURES, CG_SIGNATURES, CORE_FOUNDATION, CORE_GRAPHICS } from './macos.constants';
import type { MacBindings } from './macos.type';

let bindings: MacBindings | null = null;
let bindingError = '';

const bindAll = <K extends string>(lib: KoffiLibrary, signatures: Record<K, string>): Record<K, MacBindings[keyof MacBindings]> => {
  const entries = (Object.keys(signatures) as K[]).map((key) => [key, lib.func(signatures[key])] as const);
  return Object.fromEntries(entries) as Record<K, MacBindings[keyof MacBindings]>;
};

const buildBindings = (): MacBindings | null => {
  const koffi = loadKoffi();
  if (!koffi) {
    bindingError = 'The native display binding (koffi) is not installed.';
    return null;
  }
  try {
    return { ...bindAll(koffi.load(CORE_GRAPHICS), CG_SIGNATURES), ...bindAll(koffi.load(CORE_FOUNDATION), CF_SIGNATURES) };
  } catch (error) {
    bindingError = `The native display binding failed to start: ${error instanceof Error ? error.message : String(error)}`;
    return null;
  }
};

const macBindings = (): { api: MacBindings | null; error: string } => {
  if (bindings === null && !bindingError) bindings = buildBindings();
  return { api: bindings, error: bindingError };
};

export { macBindings };
