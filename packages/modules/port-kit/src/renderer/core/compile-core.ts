/* @layer renderer-shell @kind logic */
import type { PortDefinition } from '../../port/port-definition.type';
import { loadCoreBytes } from './load-core-bytes';

const compileCore = async (definition: Pick<PortDefinition, 'core'>): Promise<WebAssembly.Module> =>
  WebAssembly.compile(await loadCoreBytes(definition.core.wasm));

export { compileCore };
