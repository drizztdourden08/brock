/* @layer renderer-shell @kind logic */
import type { CoreExports } from '../../port/port-definition.type';
import type { EmscriptenModule } from './emscripten.type';
import type { CoreLog } from './game-core.type';

const stopMainLoop = (mod: EmscriptenModule, exports: CoreExports, log: CoreLog): void => {
  try {
    mod.ccall(exports.stop, null, [], []);
  } catch (error) {
    log(`The core stop call failed: ${error instanceof Error ? error.message : String(error)}`, 'error');
  }
};

const releaseAudio = (mod: EmscriptenModule): void => {
  mod.SDL2?.audio?.scriptProcessorNode?.disconnect();
  void mod.SDL2?.audioContext?.close().catch(() => undefined);
};

const releaseCanvas = (mod: EmscriptenModule): void => {
  mod.canvas?.getContext('webgl')?.getExtension('WEBGL_lose_context')?.loseContext();
};

const teardownCore = (mod: EmscriptenModule, exports: CoreExports, log: CoreLog): void => {
  stopMainLoop(mod, exports, log);
  releaseAudio(mod);
  releaseCanvas(mod);
};

export { teardownCore };
