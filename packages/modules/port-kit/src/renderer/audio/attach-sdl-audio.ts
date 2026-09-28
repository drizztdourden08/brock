/* @layer renderer-shell @kind logic */
import type { EmscriptenModule } from '../core/emscripten.type';
import type { AudioAdapter } from './audio.type';
import { SDL_POLL_LIMIT, SDL_POLL_MS } from './audio.constants';

const tryAttach = (mod: EmscriptenModule, adapter: AudioAdapter): boolean => {
  const context = mod.SDL2?.audioContext;
  const node = mod.SDL2?.audio?.scriptProcessorNode;
  if (!context || !node) return false;
  adapter.attachNode(context, node);
  return true;
};

const attachSdlAudio = (mod: EmscriptenModule, adapter: AudioAdapter): (() => void) => {
  if (tryAttach(mod, adapter)) return () => undefined;
  let tries = 0;
  const timer = setInterval(() => {
    tries += 1;
    if (tryAttach(mod, adapter) || tries >= SDL_POLL_LIMIT) clearInterval(timer);
  }, SDL_POLL_MS);
  return () => clearInterval(timer);
};

export { attachSdlAudio };
