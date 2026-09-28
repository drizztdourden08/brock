/* @layer renderer-shell @kind logic */
import type { InstantiateWasm } from './emscripten.type';

const createInstantiateWasm = (bytes: ArrayBuffer, onError: (error: unknown) => void): InstantiateWasm =>
  (imports, onSuccess) => {
    WebAssembly.instantiate(bytes, imports)
      .then((result) => onSuccess(result.instance, result.module))
      .catch(onError);
    return {};
  };

export { createInstantiateWasm };
