/* @layer renderer-shell @kind logic */
import type { InstantiateWasm } from './emscripten.type';

const createInstantiateWasm = (source: ArrayBuffer | WebAssembly.Module, onError: (error: unknown) => void): InstantiateWasm =>
  (imports, onSuccess) => {
    if (source instanceof WebAssembly.Module) {
      WebAssembly.instantiate(source, imports).then((instance) => onSuccess(instance, source)).catch(onError);
    } else {
      WebAssembly.instantiate(source, imports).then((result) => onSuccess(result.instance, result.module)).catch(onError);
    }
    return {};
  };

export { createInstantiateWasm };
