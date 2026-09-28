/* @layer renderer-shell @kind logic */
import type { GameCore } from '../core/game-core.type';
import { SLOT_TOKEN } from './save-session.constants';

const scratchPathOf = (core: GameCore): string => {
  const { state, scratchSlot } = core.definition.core.files;
  return state.replace(SLOT_TOKEN, String(scratchSlot));
};

const readCoreState = (core: GameCore): Uint8Array | null => {
  const calls = core.calls();
  const fs = core.fs();
  const { saveState } = core.definition.core.exports;
  if (!calls || !fs || !saveState) return null;
  const path = scratchPathOf(core);
  calls.call(saveState, core.definition.core.files.scratchSlot);
  if (!fs.analyzePath(path).exists) return null;
  const bytes = fs.readFile(path).slice();
  fs.unlink(path);
  return bytes;
};

const writeCoreState = (core: GameCore, state: Uint8Array): boolean => {
  const calls = core.calls();
  const fs = core.fs();
  const { loadState } = core.definition.core.exports;
  if (!calls || !fs || !loadState) return false;
  const path = scratchPathOf(core);
  fs.writeFile(path, state);
  calls.call(loadState, core.definition.core.files.scratchSlot);
  fs.unlink(path);
  return true;
};

const coreStateIo = { read: readCoreState, write: writeCoreState };

export { coreStateIo };
